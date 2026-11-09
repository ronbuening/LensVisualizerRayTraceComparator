import { existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import packageJson from "../../../package.json" with { type: "json" };
import { CONFIG_KEYS, REPO_ROOT, configValue, loadConfig } from "../../core/config.ts";
import type { ConfigKey, ConfigLayer, LoadedConfig } from "../../core/config.ts";
import { commandSucceeded as succeeded, runSystemCommand } from "../../core/systemCommand.ts";
import type { CommandResult } from "../../core/systemCommand.ts";
import { LV_MARKER, loadLvBinding } from "../../engines/lv/binding.ts";
import { EngineUnavailableError } from "../../engines/adapter.ts";
import type { EngineAdapter } from "../../engines/adapter.ts";
import { LvBindingError } from "../../engines/lv/errors.ts";
import { lvGitState } from "../../engines/lv/gitState.ts";
import type { LvGitState } from "../../engines/lv/gitState.ts";
import { OPTILAND_ENGINE_ID } from "../../engines/optiland/definition.ts";
import { createEngineRegistry } from "../../engines/registry.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { ROOT_OPTION, helpText, options, paragraph, wrap } from "../help.ts";
import { DOCTOR_TEXT, codeTextOf } from "../../vocabulary/index.ts";
import { doctorRefusals } from "../verifyReal.ts";

export type { CommandResult };

/**
 * What loading LensVisualizer through the binding gave: the engine code's closure, or why it could not be loaded.
 * A checkout can be present and still not loadable, when LV has renamed something the comparator imports.
 */
export type DoctorLvBinding =
  | { readonly status: "loaded"; readonly engineFileCount: number; readonly engineClosureHash: string }
  | { readonly status: "failed"; readonly code: string; readonly message: string };

/**
 * What asking the engine `optiland` for its descriptor gave: who it is, or why it cannot be used. `details` are the
 * descriptor's own: the commit and dirty flag of the optiland checkout, the hash and count of its Python sources,
 * the versions of Python, numpy, scipy and numba, and whether the JIT is on.
 */
export type DoctorOptilandEngine =
  | {
      readonly status: "available";
      readonly fingerprint: string;
      readonly adapterRevision: string | null;
      readonly details: Readonly<Record<string, string | number | boolean | null>>;
    }
  | { readonly status: "unavailable"; readonly code: string; readonly message: string };

/** Everything doctor reads from the machine besides the configuration, injected so tests are hermetic. */
export interface DoctorProbe {
  /** The running Node version, without a leading "v". */
  nodeVersion(): string;
  exists(path: string): boolean;
  /** Runs a command to completion without a shell; null when it could not be started or did not finish. */
  run(command: string, args: readonly string[]): CommandResult | null;
  /** Loads LensVisualizer from a checkout that is present and reports its engine closure; never rejects. */
  lvBinding(path: string): Promise<DoctorLvBinding>;
  /**
   * Starts the engine `optiland` as a run would, asks it who it is and lets it go; never rejects. The worker
   * writes its caches under the configuration's `cacheDir` and nothing anywhere else.
   */
  optilandEngine(loaded: LoadedConfig): Promise<DoctorOptilandEngine>;
}

/** What `lvrtc doctor` is wired to: where the configuration lives, the environment, and the machine. */
export interface DoctorInputs {
  readonly rootDir: string;
  /** What a relative `--root` is resolved against; the process's own directory unless given. */
  readonly cwd?: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly probe: DoctorProbe;
}

/** What doctor found. Only `node.ok` decides the exit code; everything else is reported, never a failure. */
export interface DoctorReport {
  readonly node: { readonly version: string; readonly required: string; readonly ok: boolean };
  readonly config: Readonly<Record<ConfigKey, { readonly value: string | null; readonly source: ConfigLayer }>>;
  readonly lensVisualizer: {
    /** "present" means `src/optics/buildLens.ts` exists under the path. */
    readonly status: "present" | "missing" | "not configured";
    readonly path: string | null;
    /**
     * Null unless LV is present and under git. Restricted to the checkout: inside another repository, the commit is
     * the last one that touched the LV directory and `dirty` looks at nothing outside it.
     */
    readonly git: LvGitState | null;
    /** Null unless LV is present. */
    readonly binding: DoctorLvBinding | null;
  };
  /** `version` is the interpreter's `--version` output, or null when it could not be run. */
  readonly python: { readonly command: string; readonly version: string | null };
  readonly optiland: {
    readonly python: string | null;
    /** "present" means the interpreter answered `--version`. */
    readonly interpreter: "present" | "missing" | "not configured";
    readonly interpreterVersion: string | null;
    /** Version of the installed optiland distribution, or null when the interpreter cannot find one. */
    readonly version: string | null;
    /** Null unless the interpreter is present: only then is the engine started. */
    readonly engine: DoctorOptilandEngine | null;
  };
}

const NODE_RANGE: string = packageJson.engines.node;
/** optiland has no `__version__`; its distribution metadata is the only version it carries. */
const OPTILAND_VERSION_SCRIPT = "import importlib.metadata as m; print(m.version('optiland'))";
const USAGE = "Usage: lvrtc doctor [--root <dir>] [--json]\n";
const HELP = helpText([
  USAGE,
  ...paragraph(
    "Says whether this machine is ready to check LensVisualizer, and what to fix where it is not. It reports the Node version, every configuration value with the file or environment variable that set it, the LensVisualizer checkout (its commit, whether it has uncommitted changes, and whether it loads), the Python interpreter, and optiland (its interpreter, its version, and the engine started once to ask who it is). Under each row that is not as it should be, a fix line says what to set, in lvrtc.local.json or in the environment. A last section says what is ready: LensVisualizer, optiland, and whether lvrtc check-lv can run.",
  ),
  ...paragraph(
    "It only reads: nothing is installed, and nothing is written into LensVisualizer or optiland (optiland's worker keeps its caches under the configuration's cacheDir).",
  ),
  ...options([
    ROOT_OPTION,
    ["--json", "print one JSON object in place of the lines, with sorted keys; ready says what is ready"],
  ]),
  ...paragraph(
    "Exit code: 0 when the Node version is in range, whatever else is missing (that is reported, not a failure); 1 when Node is out of range or a configuration file cannot be read; 2 when the command line cannot be used as given.",
  ),
]);

type Version = readonly [number, number, number];

function parseVersion(text: string): Version | null {
  const match = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(text);
  return match ? [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)] : null;
}

/** True when `version` meets every space-separated comparator of `range`, the only form package.json uses. */
function satisfiesRange(version: string, range: string): boolean {
  const actual = parseVersion(version);
  if (actual === null) return false;
  return range
    .trim()
    .split(/\s+/)
    .every((comparator) => {
      const [, operator, operand] = /^(>=|<=|>|<|=)?(.*)$/.exec(comparator) ?? [];
      const bound = parseVersion(operand ?? "");
      if (bound === null) return false;
      const differing = [0, 1, 2].find((index) => actual[index] !== bound[index]);
      const order = differing === undefined ? 0 : actual[differing] - bound[differing];
      if (operator === ">=") return order >= 0;
      if (operator === "<=") return order <= 0;
      if (operator === ">") return order > 0;
      if (operator === "<") return order < 0;
      return order === 0;
    });
}

/** The interpreter's `--version` line, or null when it could not be run. */
function interpreterVersion(command: string, probe: DoctorProbe): string | null {
  const result = probe.run(command, ["--version"]);
  return succeeded(result) ? result.stdout.trim() || result.stderr.trim() : null;
}

async function probeLensVisualizer(path: string | null, probe: DoctorProbe): Promise<DoctorReport["lensVisualizer"]> {
  if (path === null) return { status: "not configured", path: null, git: null, binding: null };
  if (!probe.exists(join(path, LV_MARKER))) return { status: "missing", path, git: null, binding: null };
  return { status: "present", path, git: lvGitState(path, probe.run), binding: await probe.lvBinding(path) };
}

async function probeOptiland(loaded: LoadedConfig, probe: DoctorProbe): Promise<DoctorReport["optiland"]> {
  const python = loaded.config.engines.optiland.python;
  const absent = { interpreterVersion: null, version: null, engine: null };
  if (python === null) return { python: null, interpreter: "not configured", ...absent };
  const version = interpreterVersion(python, probe);
  if (version === null) return { python, interpreter: "missing", ...absent };
  const distribution = probe.run(python, ["-c", OPTILAND_VERSION_SCRIPT]);
  return {
    python,
    interpreter: "present",
    interpreterVersion: version,
    version: succeeded(distribution) ? distribution.stdout.trim() : null,
    engine: await probe.optilandEngine(loaded),
  };
}

/**
 * Gathers the report. Probes only read LensVisualizer and optiland: nothing is written into either or installed.
 * A LensVisualizer checkout that is present is loaded through the binding, in this process, to fingerprint it.
 * An optiland interpreter that is present runs the engine's worker once, to fingerprint optiland: the worker's
 * caches go under the configuration's `cacheDir`.
 */
export async function collectDoctorReport(loaded: LoadedConfig, probe: DoctorProbe): Promise<DoctorReport> {
  const { config, sources } = loaded;
  const nodeVersion = probe.nodeVersion();
  return {
    node: { version: nodeVersion, required: NODE_RANGE, ok: satisfiesRange(nodeVersion, NODE_RANGE) },
    config: Object.fromEntries(
      CONFIG_KEYS.map((key) => [key, { value: configValue(config, key), source: sources[key] }]),
    ) as DoctorReport["config"],
    lensVisualizer: await probeLensVisualizer(config.lvPath, probe),
    python: { command: config.python, version: interpreterVersion(config.python, probe) },
    optiland: await probeOptiland(loaded, probe),
  };
}

type Row = readonly [label: string, value: string];

/** The rows whose value is prose, wrapped under itself; every other value is printed as it is. */
const WRAPPED: ReadonlySet<string> = new Set([DOCTOR_TEXT.fix, "role"]);

function section(title: string, rows: readonly Row[]): string {
  const width = Math.max(...rows.map(([label]) => label.length));
  return [
    title,
    ...rows.flatMap(([label, value]) => {
      const first = `  ${label.padEnd(width)}  `;
      return WRAPPED.has(label) ? wrap(value, first.length, first) : [`${first}${value}`];
    }),
  ].join("\n");
}

/** A fix line: what to do about the row above it. */
function fix(remedy: string): Row {
  return [DOCTOR_TEXT.fix, remedy];
}

/** The remedy of a code, or `fallback` where the vocabulary has none for it. */
function remedyOf(code: string, fallback: string): string {
  const remedy = codeTextOf(code)?.remedy ?? "";
  return remedy === "" ? fallback : remedy;
}

/** The rows that say who the engine `optiland` is, or why it cannot be used. */
function optilandEngineRows(engine: DoctorOptilandEngine | null): Row[] {
  if (engine === null) return [];
  if (engine.status === "unavailable") {
    return [
      ["engine", `unavailable (${engine.code}): ${engine.message}`],
      fix(remedyOf(engine.code, DOCTOR_TEXT.optilandPython)),
    ];
  }
  const { details } = engine;
  const said = (name: string): string => String(details[name] ?? "unknown");
  const commit =
    details.commit === null || details.commit === undefined
      ? "not a git checkout"
      : `${said("commit")} (${details.dirty === true ? "dirty" : details.dirty === false ? "clean" : "unknown"})`;
  const versions = `Python ${said("python")}, numpy ${said("numpy")}, scipy ${said("scipy")}, numba ${said("numba")}`;
  return [
    ["engine", `fingerprint ${engine.fingerprint}`],
    ["git", commit],
    ["sources", `${said("sourceFiles")} files, hash ${said("sourceHash")}`],
    ["versions", versions],
    ["jit", details.jit === true ? "on" : details.jit === false ? "off" : "unknown"],
    ["adapter", engine.adapterRevision ?? "none stated"],
  ];
}

/** What is ready, as `--json` states it under `ready`. */
export interface DoctorReadiness {
  /** LensVisualizer is a checkout that loads through the binding. */
  readonly lensVisualizer: boolean;
  /** The engine optiland answered who it is. */
  readonly optiland: boolean;
  /** `lvrtc check-lv` would run: `doctorRefusals`, the rule it refuses by, finds nothing. */
  readonly checkLv: boolean;
}

/** What is ready, from the report alone. */
export function readinessOf(report: DoctorReport): DoctorReadiness {
  const { lensVisualizer, optiland } = report;
  return {
    lensVisualizer: lensVisualizer.status === "present" && lensVisualizer.binding?.status === "loaded",
    optiland: optiland.engine?.status === "available",
    checkLv: doctorRefusals(report).length === 0,
  };
}

/** Why LensVisualizer is not ready, in a few words. */
function lvWhy(report: DoctorReport): string {
  const why = DOCTOR_TEXT.ready.why;
  const lv = report.lensVisualizer;
  if (lv.status === "not configured") return why.notConfigured;
  if (lv.status === "missing") return why.noCheckout;
  return lv.binding?.status === "failed" ? `${why.notLoadable}: ${lv.binding.code}` : why.notLoadable;
}

/** Why optiland is not ready, in a few words. */
function optilandWhy(report: DoctorReport): string {
  const why = DOCTOR_TEXT.ready.why;
  const optiland = report.optiland;
  if (optiland.interpreter === "not configured") return why.notConfigured;
  if (optiland.interpreter === "missing") return why.noInterpreter;
  if (optiland.version === null) return why.notImportable;
  return optiland.engine?.status === "unavailable" ? `${why.engine}: ${optiland.engine.code}` : why.engine;
}

/** The closing section: what is ready, and what can be run. */
function readySection(report: DoctorReport): string {
  const t = DOCTOR_TEXT.ready;
  const ready = readinessOf(report);
  const git = report.lensVisualizer.git;
  const lv = ready.lensVisualizer ? (git === null || git.dirty ? t.lvCaveat : t.yes) : `${t.no} (${lvWhy(report)})`;
  const optiland = ready.optiland ? t.yes : `${t.no} (${optilandWhy(report)}): ${t.optilandNeeded}`;
  const overall = ready.checkLv ? t.all : ready.lensVisualizer ? t.lvOnly : t.none;
  const width = Math.max(t.lensVisualizer.length, t.optiland.length, t.checkLv.length);
  const row = (label: string, value: string): string[] => {
    const first = `  ${label.padEnd(width)}  `;
    return wrap(value, first.length, first);
  };
  const refusals = ready.checkLv
    ? []
    : doctorRefusals(report).flatMap((refusal) => wrap(refusal, width + 6, `${" ".repeat(width + 4)}- `));
  return [
    t.title,
    ...row(t.lensVisualizer, lv),
    ...row(t.optiland, optiland),
    ...row(t.checkLv, ready.checkLv ? t.checkLvYes : t.checkLvNo),
    ...refusals,
    ...wrap(overall, 2),
  ].join("\n");
}

/** The human-readable report: a pure function of the report, with no timestamps. */
export function renderDoctorText(report: DoctorReport): string {
  const { node, config, lensVisualizer, python, optiland } = report;

  const lvRows: Row[] = [["status", lensVisualizer.status]];
  if (lensVisualizer.path !== null) lvRows.unshift(["path", lensVisualizer.path]);
  if (lensVisualizer.status !== "present") {
    if (lensVisualizer.status === "missing") lvRows.push(["reason", `${LV_MARKER} not found under the path`]);
    lvRows.push(fix(DOCTOR_TEXT.lvPath));
  } else {
    const { git, binding } = lensVisualizer;
    lvRows.push(["git", git === null ? "not a git checkout" : `${git.commit} (${git.dirty ? "dirty" : "clean"})`]);
    if (git === null) lvRows.push(fix(DOCTOR_TEXT.lvNotGit));
    else if (git.dirty) lvRows.push(fix(DOCTOR_TEXT.lvDirty));
    if (binding?.status === "loaded") {
      lvRows.push(["engine", `${binding.engineFileCount} files, closure ${binding.engineClosureHash}`]);
    } else if (binding?.status === "failed") {
      lvRows.push(["engine", `not loadable (${binding.code}): ${binding.message}`]);
      lvRows.push(fix(remedyOf(binding.code, DOCTOR_TEXT.lvPath)));
    }
  }

  const optilandRows: Row[] = [["interpreter", optiland.interpreter]];
  if (optiland.python !== null) optilandRows.unshift(["python", optiland.python]);
  if (optiland.interpreter === "present") {
    optilandRows[optilandRows.length - 1] = ["interpreter", `present (${optiland.interpreterVersion})`];
    optilandRows.push(["version", optiland.version ?? "not importable"]);
    if (optiland.version === null) optilandRows.push(fix(DOCTOR_TEXT.optilandNotImportable));
    optilandRows.push(...optilandEngineRows(optiland.engine));
  } else {
    optilandRows.push(fix(DOCTOR_TEXT.optilandPython));
  }

  const nodeRows: Row[] = [
    ["version", node.version],
    ["required", node.required],
    ["status", node.ok ? "ok" : "out of range"],
  ];
  if (!node.ok) nodeRows.push(fix(DOCTOR_TEXT.node));
  const pythonRows: Row[] = [
    ["role", DOCTOR_TEXT.pythonRole],
    ["command", python.command],
    ["version", python.version ?? "not found"],
  ];
  if (python.version === null) pythonRows.push(fix(DOCTOR_TEXT.python));

  const sections = [
    section("Node", nodeRows),
    section(
      "Config",
      CONFIG_KEYS.map((key) => [key, `${config[key].value ?? "(not set)"}  [${config[key].source}]`]),
    ),
    section("LensVisualizer", lvRows),
    section("Python", pythonRows),
    section("optiland", optilandRows),
    readySection(report),
  ];
  return `${sections.join("\n\n")}\n`;
}

function withSortedKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withSortedKeys);
  if (typeof value !== "object" || value === null) return value;
  const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return Object.fromEntries(entries.map(([key, child]) => [key, withSortedKeys(child)]));
}

/** The report as one JSON object with keys sorted at every level, so equal reports print identically. */
export function renderDoctorJson(report: DoctorReport): string {
  return `${JSON.stringify(withSortedKeys({ ...report, ready: readinessOf(report) }), null, 2)}\n`;
}

/**
 * Builds `lvrtc doctor [--root <dir>] [--json]`, of the configuration under `--root` (default: this repository). It
 * exits 1 only when the Node version is out of range; a missing LensVisualizer, one that is present and cannot be
 * loaded, a missing Python or optiland and an engine `optiland` that cannot be used are reported and exit 0. A
 * configuration file that cannot be read is an error.
 */
export function createDoctorCommand(inputs: DoctorInputs): CliCommand {
  return {
    name: "doctor",
    summary: "Say whether this machine is ready to check LensVisualizer, and what to fix",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let json = false;
      let root: string | undefined;
      for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === "--json") json = true;
        else if (arg === "--root" && root === undefined && args[index + 1] !== undefined) root = args[++index];
        else {
          io.stderr(`lvrtc doctor: unknown argument "${arg}"\n${USAGE}`);
          return EXIT_USAGE;
        }
      }
      const rootDir = root === undefined ? inputs.rootDir : resolve(inputs.cwd ?? process.cwd(), root);
      if (root !== undefined && !statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
        io.stderr(`lvrtc doctor: --root ${root}: not a directory\n${USAGE}`);
        return EXIT_USAGE;
      }
      const loaded = loadConfig({ rootDir, env: inputs.env });
      const report = await collectDoctorReport(loaded, inputs.probe);
      io.stdout(json ? renderDoctorJson(report) : renderDoctorText(report));
      if (report.node.ok) return EXIT_OK;
      io.stderr(`lvrtc doctor: Node ${report.node.version} is outside the supported range ${report.node.required}\n`);
      return EXIT_FAILURE;
    },
  };
}

/** Loads LensVisualizer through the binding; a failure becomes the report of it. */
async function loadedBinding(path: string): Promise<DoctorLvBinding> {
  try {
    const { engineFileCount, engineClosureHash } = (await loadLvBinding(path)).engineClosure();
    return { status: "loaded", engineFileCount, engineClosureHash };
  } catch (error) {
    const code = error instanceof LvBindingError ? error.code : "load-failed";
    return { status: "failed", code, message: error instanceof Error ? error.message : String(error) };
  }
}

/** Asks the engine `optiland` of a configuration who it is; a failure becomes the report of it. */
async function describedOptiland(loaded: LoadedConfig): Promise<DoctorOptilandEngine> {
  let adapter: EngineAdapter | undefined;
  try {
    adapter = await createEngineRegistry(loaded).create(OPTILAND_ENGINE_ID);
    const { identity } = await adapter.describe();
    const { fingerprint, adapterRevision = null, details } = identity;
    return { status: "available", fingerprint, adapterRevision, details };
  } catch (error) {
    const code = error instanceof EngineUnavailableError ? error.code : "create-failed";
    return { status: "unavailable", code, message: error instanceof Error ? error.message : String(error) };
  } finally {
    await adapter?.close().catch(() => undefined);
  }
}

/**
 * Probes this machine. Commands run as `runSystemCommand` runs them: without a shell, under a time limit, Python
 * told not to write bytecode and git not handed a repository inherited from a parent git.
 */
export const systemProbe: DoctorProbe = {
  nodeVersion: () => process.versions.node,
  exists: (path) => existsSync(path),
  run: runSystemCommand,
  lvBinding: loadedBinding,
  optilandEngine: describedOptiland,
};

/** `lvrtc doctor` wired to this repository, the process environment and this machine. */
export const doctorCommand: CliCommand = createDoctorCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  probe: systemProbe,
});
