import { statSync } from "node:fs";
import { join, resolve } from "node:path";

import type { OpticalCase } from "../../contract/case.ts";
import type { EngineDescriptor } from "../../contract/engine.ts";
import { MTF_NATIVE } from "../../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import { makeRequest } from "../../contract/request.ts";
import type { RunAperture } from "../../contract/runSpec.ts";
import { SCHEMA_ID_PREFIX, contractSchemas } from "../../contract/schemas.ts";
import { validate } from "../../contract/validate.ts";
import { CONTRACT_VERSION } from "../../contract/version.ts";
import { REPO_ROOT, loadConfig } from "../../core/config.ts";
import type { ManifestEngine } from "../../core/manifest.ts";
import { mtfRunDirectory, writeMtfRun } from "../../core/mtfRun.ts";
import type { MtfRun, MtfRunAnswer } from "../../core/mtfRun.ts";
import { canonicalJson } from "../../core/numeric/canonicalJson.ts";
import { askEngine } from "../../core/orchestrator.ts";
import type { JobSource } from "../../core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore, isStorable } from "../../core/resultStore.ts";
import { UsageError } from "../../core/usageError.ts";
import { EngineUnavailableError, enginesText } from "../../engines/adapter.ts";
import type { EngineAdapter, EngineUnavailableCode } from "../../engines/adapter.ts";
import { loadLvBinding } from "../../engines/lv/binding.ts";
import type { LvBinding } from "../../engines/lv/binding.ts";
import { LvBindingError } from "../../engines/lv/errors.ts";
import { problemText } from "../../engines/lv/exportProblems.ts";
import { createLvTabProfileResolver } from "../../engines/lv/tabProfile.ts";
import { LV_TAB_COMPARISON_F_NUMBER, LV_TAB_PROFILE } from "../../engines/lv/tabRequest.ts";
import { ZOOM_ENDS, primeZoomNote, zoomEndAt } from "../../engines/lv/zoomEnds.ts";
import type { ZoomEnd } from "../../engines/lv/zoomEnds.ts";
import { createEngineRegistry } from "../../engines/registry.ts";
import { mtfNativeQuantity } from "../../quantities/mtfNative.ts";
import { mtfTableRows, mtfTableText } from "../../report/mtfTable.ts";
import type { MtfTableRow } from "../../report/mtfTable.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { apertureOption, sliderPosition } from "../lensOptions.ts";

/** What `lvrtc mtf` is wired to, injected so that tests choose all three. */
export interface MtfCommandInputs {
  /** The configuration root when `--root` does not name one. */
  readonly rootDir: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** The directory that `--root` is relative to. */
  readonly cwd: string;
}

/** The engine a run of `lvrtc mtf` asks when none is named. */
const DEFAULT_ENGINES: readonly string[] = ["lv"];

const SYNOPSIS = [
  "Usage: lvrtc mtf <lensKey> [--engines <id,...>] [--profile <name>] [--zoom <t>]",
  `                 [--aperture wide-open|f/${LV_TAB_COMPARISON_F_NUMBER}] [--root <dir>] [--json]`,
  "",
].join("\n");
const HELP = [
  SYNOPSIS,
  "Asks each engine for its own MTF of a LensVisualizer lens (the quantity mtf.native) as a profile requests it, and",
  "prints what each answered: a row per field with the image height, the field angle, the status and the sagittal",
  "and tangential MTF at the frequencies the profile shows, then the focus shift the engine applied, the aperture it",
  "traced, the lines it computed with and its notes. The request, the case and the answers are written to",
  "<runsDir>/mtf/<profile>/<run>/mtf.json; an answer the result store already holds is not computed again.",
  "",
  "A zoom is asked about at both ends unless --zoom names one position: the wide end (zoom 0) and then the tele end",
  "(zoom 1), each with its own request, its own table, labelled wide or tele, and its own run directory.",
  "",
  `  --engines <ids>   the engines to ask (default: ${DEFAULT_ENGINES.join(",")})`,
  `  --profile <name>  the request to make (default: ${LV_TAB_PROFILE}). ${LV_TAB_PROFILE} is the request of`,
  "                    LensVisualizer's MTF tab as it opens: its default method, spectrum, focus, grid cap, fields",
  "                    and frequencies, with the stop and pupil radii of its own hook",
  "  --zoom <t>        one zoom position from 0 (wide) to 1 (tele), in place of both ends of a zoom; a prime has",
  "                    no zoom position",
  `  --aperture <a>    wide-open (default), or f/${LV_TAB_COMPARISON_F_NUMBER}: the tab's own comparison at f/8`,
  "  --root <dir>      the directory that holds lvrtc.config.json (default: this repository)",
  "  --json            print one JSON object in place of the lines: the record of the run, or, for both ends of",
  "                    a zoom, an object with the record of each end under wide and tele",
  "",
  "Exit code: 0 when every engine answered (unsupported is an answer, not a failure); 1 when an engine ended in an",
  "error, when the lens has no case in a state that was asked about (each reason is printed with its code) or when",
  "LensVisualizer cannot be loaded; 2 when the command line cannot be used as given, which includes a key that is",
  "not in the catalog.",
  "",
].join("\n");

const VALUE_OPTIONS = ["--engines", "--profile", "--zoom", "--aperture", "--root"];

/** What a profile makes of a lens: the case and the request of its MTF, or every reason the lens has no case. */
type ProfileRequest =
  | {
      readonly ok: true;
      readonly opticalCase: OpticalCase;
      readonly spec: MtfNativeSpec;
      /** The frequencies of the spec that the profile shows. */
      readonly displayedFrequenciesPerMm: readonly number[];
      /** What the run is called after the lens key: empty for the lens as it opens. */
      readonly suffix: string;
      /** The request in a few words, for people. */
      readonly said: string;
    }
  | { readonly ok: false; readonly problems: readonly string[] };

/** A named way of asking for an MTF: what turns a lens and its state into a case and an `mtf.native` spec. */
interface MtfProfile {
  /**
   * The request of the profile for a lens of a bound LensVisualizer checkout. Throws a `UsageError` for a state
   * the profile is no request for.
   */
  resolve(binding: LvBinding, lensKey: string, zoomT: number, aperture: RunAperture): Promise<ProfileRequest>;
}

/** The text of a number as short as it reads back; zero of either sign is "0". */
function numberText(value: number): string {
  return value === 0 ? "0" : String(value);
}

/**
 * The profiles there are. `lv-tab-default` is the request of LensVisualizer's MTF tab for the lens as it opens
 * (`createLvTabProfileResolver`): wide open, or, for the aperture f/8, the tab's own comparison at f/8. The tab
 * reaches any other aperture only through a slider position, so the profile has no request for one. Where the tab
 * offers no comparison for the lens, the request says so in its words, and the engines are asked all the same.
 */
const PROFILES: Readonly<Record<string, MtfProfile>> = {
  [LV_TAB_PROFILE]: {
    resolve: async (binding, lensKey, zoomT, aperture) => {
      const comparison = aperture.kind === "f-number" && aperture.value === LV_TAB_COMPARISON_F_NUMBER;
      if (aperture.kind !== "wide-open" && !comparison) {
        throw new UsageError(
          `the profile ${LV_TAB_PROFILE} is LensVisualizer's MTF tab as it opens: ` +
            `--aperture takes wide-open or f/${LV_TAB_COMPARISON_F_NUMBER} with it`,
        );
      }
      const view = comparison ? "f8-comparison" : "wide-open";
      const resolved = await createLvTabProfileResolver(binding)({ lensKey, zoomT, view });
      if (!resolved.ok) return { ok: false, problems: resolved.problems.map(problemText) };
      const { opticalCase, spec, displayedFrequenciesPerMm, fNumber, unavailable } = resolved;
      const offered = unavailable === null ? "" : `, which the tab does not offer here: ${unavailable}`;
      const said = comparison
        ? `the tab's comparison at f/${fNumber}${offered}`
        : `the tab as it opens, wide open at f/${numberText(fNumber)}`;
      return { ok: true, opticalCase, spec, displayedFrequenciesPerMm, suffix: comparison ? `-f${fNumber}` : "", said };
    },
  },
};

/** The command line of `lvrtc mtf`, read. */
interface MtfArguments {
  readonly lensKey: string;
  readonly engines: readonly string[];
  readonly profile: string;
  /** The zoom position that was named; undefined when none was. */
  readonly zoomT: number | undefined;
  readonly aperture: RunAperture;
  readonly root: string | undefined;
  readonly json: boolean;
}

/** Reads the arguments. Throws a `UsageError` for anything that is not the command line the synopsis shows. */
function readArguments(args: readonly string[]): MtfArguments {
  const { positionals: keys, values, flags } = parseArguments(args, VALUE_OPTIONS, ["--json"]);
  if (keys.length === 0) throw new UsageError("no lens key was given");
  if (keys.length > 1) throw new UsageError(`unexpected argument "${keys[1]}"`);
  const engines = values.get("--engines")?.split(",") ?? [...DEFAULT_ENGINES];
  if (engines.includes("")) {
    throw new UsageError(`--engines needs ids separated by commas, got "${values.get("--engines")}"`);
  }
  const profile = values.get("--profile") ?? LV_TAB_PROFILE;
  if (!Object.hasOwn(PROFILES, profile)) {
    throw new UsageError(`unknown profile "${profile}": the profiles are ${Object.keys(PROFILES).sort().join(", ")}`);
  }
  const zoom = values.get("--zoom");
  const aperture = values.get("--aperture");
  return {
    lensKey: keys[0],
    engines: [...new Set(engines)].sort(),
    profile,
    zoomT: zoom === undefined ? undefined : sliderPosition("--zoom", zoom),
    aperture: aperture === undefined ? { kind: "wide-open" } : apertureOption(aperture),
    root: values.get("--root"),
    json: flags.has("--json"),
  };
}

/** One engine's part of a run: what is recorded of it, and what only the console is told. */
interface Asked {
  readonly engine: ManifestEngine;
  readonly answer: MtfRunAnswer;
  readonly source: JobSource;
  /** The message of an "error" and the messages of an "unsupported": never stored. */
  readonly detail: string | null;
}

/** An engine for the length of a command: reached and described, or the code and the words of why it cannot be. */
type EngineSession =
  | { readonly adapter: EngineAdapter; readonly descriptor: EngineDescriptor }
  | { readonly code: EngineUnavailableCode; readonly message: string };

/** The engine as a run records it. */
function engineOf(id: string, descriptor: EngineDescriptor): ManifestEngine {
  const { version, fingerprint, adapterRevision, details } = descriptor.identity;
  return { id, status: "available", version, fingerprint, ...(adapterRevision ? { adapterRevision } : {}), details };
}

/** The lines of one engine's part: how it ended, then its table, or why it has none. */
function engineText(asked: Asked, request: Extract<ProfileRequest, { ok: true }>): string {
  const { answer, source, detail } = asked;
  const head = `${answer.engine}  ${answer.status}  ${source}`;
  if (answer.status === "ok" && answer.result?.data !== undefined) {
    const data = answer.result.data as MtfNativeData;
    const { spec, displayedFrequenciesPerMm, opticalCase } = request;
    return `${head}\n${mtfTableText({ spec, data, displayedFrequenciesPerMm, opticalCase })}`;
  }
  if (answer.status === "unsupported") {
    const items = (answer.result?.unsupported ?? []).map((item) => `  ${item.code} ${item.item}: ${item.message}`);
    return `${[head, ...items].join("\n")}\n`;
  }
  const code = answer.error === undefined ? "" : `${answer.error.code}: `;
  return `${head}\n  ${code}${detail ?? ""}\n`;
}

/** The fields of each "ok" answer at the shown frequencies, as plain numbers: what `--json` adds to the record. */
function tablesOf(
  askeds: readonly Asked[],
  request: Extract<ProfileRequest, { ok: true }>,
): Record<string, MtfTableRow[]> {
  const { spec, displayedFrequenciesPerMm } = request;
  return Object.fromEntries(
    askeds.flatMap(({ answer }) =>
      answer.status === "ok" && answer.result?.data !== undefined
        ? [
            [
              answer.engine,
              mtfTableRows({ spec, data: answer.result.data as MtfNativeData, displayedFrequenciesPerMm }),
            ],
          ]
        : [],
    ),
  );
}

/**
 * Builds `lvrtc mtf <lensKey> [--engines <id,...>] [--profile <name>] [--zoom <t>] [--aperture ...] [--root <dir>]
 * [--json]`.
 *
 * It loads the configuration of the root and LensVisualizer (`lvPath`) and takes the states to ask about: the one
 * state of a prime, which has no zoom position (one given for it is ignored, and the error stream says so); the
 * position `--zoom` names; and, for a zoom that is given none, both ends, wide (zoom 0) and then tele (zoom 1).
 * Each state is a run of its own, with everything below, and what is printed for the tele end is what
 * `--zoom 1` prints. The engines are created once, for all of them.
 *
 * For a state it has the profile turn the lens at the zoom position into a case and an `mtf.native` spec, and asks
 * every named engine that one request (`askEngine`): an engine that does not offer the quantity is "unsupported"
 * without being asked, an answer the result store holds is taken from it, and an "ok" or "unsupported" answer is
 * stored. A built-in engine shares the one binding of the checkout. Then it writes the record of the run
 * (`writeMtfRun`) under `<runsDir>/mtf/<profile>/<run>/`, where `<run>` is the lens key, followed by `-zoom<t>` at a
 * zoom position other than 0 and by the profile's own mark of an aperture other than wide open, and prints, for each
 * engine in the order of their ids, how it ended and its table (`mtfTableText`), or why it has none, under a line that
 * states the zoom position and, at an end of a zoom, which end it is: "zoom 0 (wide)", "zoom 1 (tele)". With `--json`
 * it prints the record as one object, with the file it was written to, how each answer was come by and the fields of
 * each answer as plain numbers; for both ends, one object with that of each end under `wide` and `tele`. A state the
 * lens has no case in has its reasons on the error stream, named by its end, and the other end is asked all the same.
 *
 * With one engine the command only presents; setting several engines' answers against each other is a later
 * stage's, which adds nothing to this command line.
 *
 * Exit codes: 0 when every engine answered in every state, "unsupported" included; 1 when an engine ended in an
 * error or could not be used, when the lens cannot be exported as the profile needs it in a state, and when
 * LensVisualizer is not configured or cannot be loaded; 2 for a command line that is not the synopsis, a `--root`
 * that is not a directory, an unknown profile or engine, an aperture the profile has no request for and a key that
 * is not in the catalog, with the nearest keys suggested.
 */
export function createMtfCommand(inputs: MtfCommandInputs): CliCommand {
  return {
    name: "mtf",
    summary: "Ask engines for their own MTF of a lens, as LensVisualizer's MTF tab requests it",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      const adapters: EngineAdapter[] = [];
      try {
        const asked = readArguments(args);
        const rootDir = asked.root === undefined ? inputs.rootDir : resolve(inputs.cwd, asked.root);
        if (asked.root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
          throw new UsageError(`--root ${asked.root}: not a directory`);
        }
        const loaded = loadConfig({ rootDir, env: inputs.env });
        const registry = createEngineRegistry(loaded);
        const [configured, builtin] = [registry.ids(), registry.builtinIds()];
        const unknown = asked.engines.filter((id) => !configured.includes(id) && !builtin.includes(id));
        if (unknown.length > 0) {
          const named = unknown.map((id) => JSON.stringify(id)).join(", ");
          throw new UsageError(
            `unknown ${unknown.length > 1 ? "engines" : "engine"} ${named}: ${enginesText(configured, builtin)}`,
          );
        }

        const binding = await loadLvBinding(loaded.config.lvPath);
        let zoom: boolean;
        try {
          zoom = (await binding.lens(asked.lensKey)).entry.zoom === true;
        } catch (error) {
          if (error instanceof LvBindingError && error.code === "unknown-lens") throw new UsageError(error.message);
          throw error;
        }
        // A zoom that is given no position is asked about at both ends; a prime has one state, whatever is given.
        const positions: readonly { readonly zoomT: number; readonly end?: ZoomEnd["end"] }[] = !zoom
          ? [{ zoomT: 0 }]
          : asked.zoomT === undefined
            ? ZOOM_ENDS
            : [{ zoomT: asked.zoomT, end: zoomEndAt(asked.zoomT) }];
        if (!zoom && asked.zoomT !== undefined && asked.zoomT !== 0) {
          io.stderr(`lvrtc mtf: ${primeZoomNote(asked.lensKey)}\n`);
        }
        const bothEnds = positions.length > 1;

        const store = createResultStore(join(loaded.config.runsDir, STORE_DIRECTORY));
        const sessions = new Map<string, EngineSession>();
        const sessionOf = async (id: string): Promise<EngineSession> => {
          let session = sessions.get(id);
          if (session === undefined) {
            try {
              const adapter = await registry.create(id);
              adapters.push(adapter);
              session = { adapter, descriptor: await adapter.describe() };
            } catch (error) {
              if (!(error instanceof EngineUnavailableError)) throw error;
              session = { code: error.code, message: error.message };
            }
            sessions.set(id, session);
          }
          return session;
        };

        let failed = false;
        let tables = 0;
        const printed: Record<string, unknown> = {};
        for (const { zoomT, end } of positions) {
          const resolved = await PROFILES[asked.profile].resolve(binding, asked.lensKey, zoomT, asked.aperture);
          if (!resolved.ok) {
            const which = bothEnds ? ` (${end} end)` : "";
            for (const problem of resolved.problems) io.stderr(`lvrtc mtf: ${asked.lensKey}${which}: ${problem}\n`);
            failed = true;
            continue;
          }
          const { opticalCase, spec, displayedFrequenciesPerMm } = resolved;
          const name = `${asked.lensKey}${zoomT === 0 ? "" : `-zoom${numberText(zoomT)}`}${resolved.suffix}`;
          if (validate(contractSchemas(), `${SCHEMA_ID_PREFIX}common#/$defs/name`, name).length > 0) {
            throw new Error(`the run would be named "${name}", which cannot be the name of a directory`);
          }
          const request = makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec });

          const warnings: string[] = [];
          const askeds: Asked[] = [];
          for (const id of asked.engines) {
            const session = await sessionOf(id);
            if ("code" in session) {
              const { code, message } = session;
              askeds.push({
                engine: { id, status: "unavailable", code },
                answer: { engine: id, status: "error", storeKey: null, error: { code } },
                source: "unavailable",
                detail: message,
              });
              continue;
            }
            const { adapter, descriptor } = session;
            const { result, storeKey, source } = await askEngine({
              adapter,
              descriptor,
              quantity: mtfNativeQuantity,
              request,
              opticalCase,
              store,
              warnings,
            });
            // An answer is kept whole; of an error only its code, since its words may name files of this machine.
            const error = result.status === "error" ? { error: { code: result.error?.code ?? "unknown" } } : {};
            askeds.push({
              engine: engineOf(id, descriptor),
              answer: { engine: id, status: result.status, storeKey, ...(isStorable(result) ? { result } : error) },
              source,
              detail: result.error?.message ?? null,
            });
          }

          const record: MtfRun = {
            contract: CONTRACT_VERSION,
            kind: "mtf-run",
            name,
            lensKey: asked.lensKey,
            profile: asked.profile,
            caseId: opticalCase.id,
            request,
            displayedFrequenciesPerMm: [...displayedFrequenciesPerMm],
            engines: askeds.map(({ engine }) => engine),
            answers: askeds.map(({ answer }) => answer),
          };
          const file = writeMtfRun(mtfRunDirectory(loaded.config.runsDir, asked.profile, name), record, opticalCase);

          for (const warning of warnings) io.stderr(`lvrtc mtf: warning: ${warning}\n`);
          if (askeds.some(({ answer }) => answer.status === "error")) failed = true;
          const sources = Object.fromEntries(askeds.map(({ answer, source }) => [answer.engine, source]));
          printed[end ?? "state"] = { ...record, file, sources, tables: tablesOf(askeds, resolved) };
          if (asked.json) continue;
          const { source: origin } = opticalCase.provenance;
          // The end of a zoom is named beside its position, so that each table says which end it is of.
          const position = `zoom ${numberText(origin.kind === "lv-lens" ? (origin.zoomT ?? 0) : zoomT)}`;
          // A state is printed as soon as it is answered, a blank line after the one before it.
          io.stdout(
            [
              ...(tables++ === 0 ? [] : [""]),
              `${asked.lensKey}  ${opticalCase.label.name}`,
              `profile  ${asked.profile}: ${resolved.said}`,
              `state    ${position}${end === undefined ? "" : ` (${end})`}, infinity focus`,
              `case     ${opticalCase.id}`,
              `request  ${request.id}`,
              "",
              ...askeds.map((one) => engineText(one, resolved)),
              `result: ${file}`,
              "",
            ].join("\n"),
          );
        }

        if (asked.json) {
          // One state is its record; both ends are an object of the two, each under the name of its end.
          const [only] = Object.values(printed);
          const shown = bothEnds ? printed : only;
          // Canonical JSON sorts the keys at every depth; parsing it keeps that order for the indented text.
          if (shown !== undefined) io.stdout(`${JSON.stringify(JSON.parse(canonicalJson(shown)), null, 2)}\n`);
        }
        return failed ? EXIT_FAILURE : EXIT_OK;
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc mtf: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      } finally {
        for (const adapter of adapters) {
          await adapter.close().catch((error: unknown) => {
            io.stderr(`lvrtc mtf: warning: engine ${adapter.id}: it did not close: ${String(error)}\n`);
          });
        }
      }
    },
  };
}

/** `lvrtc mtf` wired to this repository, the process environment and the directory the process was started in. */
export const mtfCommand: CliCommand = createMtfCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  cwd: process.cwd(),
});
