// Suite files: read, checked and expanded into runs, and each run's lens turned into the optical case it names.
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import { caseInvariantProblems, verifyCaseIdentity } from "../contract/case.ts";
import type { OpticalCase } from "../contract/case.ts";
import { deepFreeze } from "../contract/json.ts";
import type { EngineDetails } from "../contract/result.ts";
import { expandSuite, runInvariantProblems } from "../contract/runSpec.ts";
import type { RunLens, RunSpec, Suite } from "../contract/runSpec.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { hashCanonical } from "./numeric/hash.ts";
import { UsageError } from "./usageError.ts";

/** What a case source makes of one run: the case of its lens, or every reason why there is none. */
export type CaseResolution =
  | { readonly ok: true; readonly opticalCase: OpticalCase }
  | { readonly ok: false; readonly problems: readonly string[] };

/** What a case source built its cases from, and whether that is still what is there. */
export interface SourceAudit {
  /**
   * What identifies the inputs: a flat map of strings, numbers, booleans and nulls, without a path or a time, so
   * that it can be recorded with a run.
   */
  readonly fingerprint: EngineDetails;
  /**
   * Each input that is no longer what the cases were built from, named without an absolute path; empty when
   * nothing has changed since the first case was built.
   */
  readonly changed: readonly string[];
}

/**
 * Where optical cases come from: the seam between a run's `lens` and the case every engine is asked about. The
 * fixture source below reads a case file; the LensVisualizer source (`src/engines/lv/caseSource.ts`) builds one
 * from a lens key and the run's state, aperture, lines and image plane, which is why a source is handed the whole
 * run.
 */
export interface CaseSource {
  /**
   * The case of `run.lens` under the run's options: valid by its schema and its invariants, with the identity it
   * states, and frozen. A lens the source cannot turn into such a case is a resolution with problems, never a
   * rejection; each problem is a deterministic text without absolute paths, since it is recorded with the run.
   */
  resolve(run: RunSpec): Promise<CaseResolution>;
  /**
   * What the cases resolved so far were built from, read again now: called when a run of a suite ends, so that a
   * source that changed under the run is noticed. Null when nothing was built. A source whose cases are whole
   * files, read once, has no such method: a case file's identity is its content.
   */
  audit?(): SourceAudit | null;
}

/** A case source for each kind of lens a run can name. A kind without one cannot be run. */
export type CaseSources = { readonly [K in RunLens["kind"]]?: CaseSource };

/** Why a lens of each kind has no case when no source is given for the kind. */
const NO_SOURCE: Readonly<Record<RunLens["kind"], string>> = {
  lv: "no case source builds cases from LensVisualizer lenses",
  fixture: "no case source reads optical-case files",
};

/** An optical-case file as a resolution; `shown` is the name its problems call it by. */
function readCaseFile(file: string, shown: string): CaseResolution {
  const failed = (problems: readonly string[]): CaseResolution => ({
    ok: false,
    problems: problems.map((problem) => `lens fixture ${shown}: ${problem}`),
  });
  // Neither Node's message nor the parser's is quoted: the first holds the absolute path, and both may change.
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    return failed([`it cannot be read (${(error as NodeJS.ErrnoException).code ?? "unknown error"})`]);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return failed(["it is malformed JSON"]);
  }
  const issues = validateKind("optical-case", parsed);
  if (issues.length > 0) return failed([`it is not a valid optical-case: ${formatIssues(issues)}`]);
  const opticalCase = parsed as OpticalCase;
  const broken = caseInvariantProblems(opticalCase.system, opticalCase.conditions);
  if (broken.length > 0) return failed(broken.map((problem) => `it is not a valid optical-case: ${problem}`));
  const mismatches = verifyCaseIdentity(opticalCase);
  if (mismatches.length > 0) {
    return failed(
      mismatches.map(
        ({ field, stated, derived }) =>
          `it states the ${field} ${stated}, but its system and conditions give ${derived}`,
      ),
    );
  }
  return { ok: true, opticalCase: deepFreeze(opticalCase) };
}

/**
 * The case source of `{ kind: "fixture", path }`: `path` names an optical-case file, and a relative one is
 * resolved against `rootDir`, the configuration root. The file is taken as it is (the run's other options do not
 * change a fixture) and must be valid by the schema, keep the invariants of a case and state the `id`, `systemId`
 * and `features` that its own system and conditions give. A file is read once, however many runs name it.
 * Problems name the file by its path relative to `rootDir`.
 */
export function createFixtureCaseSource(rootDir: string): CaseSource {
  const read = new Map<string, CaseResolution>();
  return {
    resolve: async ({ lens }) => {
      if (lens.kind !== "fixture") return { ok: false, problems: [`a lens of kind "${lens.kind}" is not a fixture`] };
      const file = resolve(rootDir, lens.path);
      let resolution = read.get(file);
      if (resolution === undefined) {
        resolution = readCaseFile(file, relative(rootDir, file).split(sep).join("/"));
        read.set(file, resolution);
      }
      return resolution;
    },
  };
}

/** One run of a loaded suite. */
export interface LoadedRun {
  /** The run as a complete RunSpec, with the suite's defaults filled in. */
  readonly spec: RunSpec;
  /** The case of the run's lens; null exactly when `problems` is not empty. */
  readonly opticalCase: OpticalCase | null;
  /** Everything that keeps the run from being run, each without the run's name; empty when nothing does. */
  readonly problems: readonly string[];
}

/** A suite file, read and resolved. */
export interface LoadedSuite {
  readonly name: string;
  /**
   * The SHA-256 of the canonical JSON of `{ name, runs }`, with the runs expanded: the identity of what the suite
   * asks for. How the file words it (key order, defaults or values repeated in each run) does not change it.
   */
  readonly hash: string;
  /** Every run, in suite order, runnable or not. */
  readonly runs: readonly LoadedRun[];
}

/** What `loadSuite` reads a suite with. */
export interface LoadSuiteOptions {
  /** The configuration root, which a fixture lens's relative path is resolved against. */
  readonly rootDir: string;
  /** The case source of each lens kind. Without it, fixtures are read from `rootDir` and no other kind has one. */
  readonly sources?: CaseSources;
}

/**
 * Loads the suite file `file`: reads it, validates it as a `suite`, expands it into complete RunSpecs and resolves
 * the lens of every run through the case source of its kind.
 *
 * - A file that is not a suite fails as a whole, with a `UsageError` that names the file: one that cannot be read,
 *   is not JSON, is not valid by the schema, or names two runs alike.
 * - What is wrong with one run stays with that run and fails no other: an option that breaks a rule the schema
 *   cannot state (`runInvariantProblems`), and a lens with no case. Every problem of a run is reported, so a run
 *   with both carries both. A lens of a kind that `sources` has no source for has no case.
 *
 * The result is frozen. A source that rejects has crashed, and the load rejects with it.
 */
export async function loadSuite(file: string, options: LoadSuiteOptions): Promise<LoadedSuite> {
  const reason = (error: unknown): string => (error instanceof Error ? error.message : String(error));
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    // The code says it all; Node's message would only repeat the path.
    const why = (error as NodeJS.ErrnoException).code ?? reason(error);
    throw new UsageError(`${file}: cannot be read (${why})`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new UsageError(`${file}: malformed JSON (${reason(error)})`, { cause: error });
  }
  const issues = validateKind("suite", parsed);
  if (issues.length > 0) throw new UsageError(`${file}: not a valid suite: ${formatIssues(issues)}`);
  const suite = parsed as Suite;
  let specs: RunSpec[];
  try {
    specs = expandSuite(suite);
  } catch (error) {
    throw new UsageError(`${file}: ${reason(error)}`, { cause: error });
  }

  const sources: CaseSources = options.sources ?? { fixture: createFixtureCaseSource(options.rootDir) };
  const runs: LoadedRun[] = [];
  for (const spec of specs) {
    const problems = runInvariantProblems(spec);
    const source = sources[spec.lens.kind];
    const resolution: CaseResolution =
      source === undefined ? { ok: false, problems: [NO_SOURCE[spec.lens.kind]] } : await source.resolve(spec);
    if (!resolution.ok) problems.push(...resolution.problems);
    runs.push({ spec, opticalCase: resolution.ok && problems.length === 0 ? resolution.opticalCase : null, problems });
  }
  return deepFreeze({ name: suite.name, hash: hashCanonical({ name: suite.name, runs: specs }), runs });
}
