// Run control (Stage 8.3): the dashboard's one writer. It writes only by starting `lvrtc` commands as children
// (`process.execPath bin/lvrtc.mjs ...`, no shell, the server's environment with its runs directory, the server's
// `--root`), one job at a time across the whole dashboard, and those commands write what they write. Each child is
// the leader of a process group of its own, so that ending a job ends the engine workers it started too. A job is
// `lvrtc run` of a listed suite, then `lvrtc compare`, then `lvrtc report`, or one `lvrtc collect --json`. Jobs and
// their output are kept in memory for the server's life and never written. Every field an action is given is held to
// the server's own lists; no path from a client ever reaches the file system. Store maintenance, baselines and
// anything that writes the repository have no action here.
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { StringDecoder } from "node:string_decoder";
import { fileURLToPath } from "node:url";

import { RUNGS } from "../core/rungs.ts";
import { DASHBOARD_TEXT } from "../report/wording.ts";
import { EXCHANGE_FOLDERS, exchangeDirectory } from "../transports/fileExchange.ts";
import type { DashboardSources } from "./sources.ts";

/** The command line of this repository, which every child is started with. */
const BIN: string = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));

/** The most concurrent jobs a start may ask of `lvrtc run`: the project's ceiling for real engines. */
export const CONTROL_MAX_JOBS = 4;
/** How much of a step's output is kept: its last 256 KB, from the start of a line. */
export const OUTPUT_TAIL_BYTES = 256 * 1024;
/** How much of a collect's standard output is kept to be read (its JSON); more is a problem of the step. */
const STDOUT_LIMIT_BYTES = 8 * 1024 * 1024;
/** The largest body an action accepts. */
export const FORM_BODY_BYTES = 16 * 1024;
/** How long a child is given to end after SIGTERM before it is sent SIGKILL. */
export const KILL_GRACE_MS = 5000;

/** The folders of an exchange directory, in the order a job passes through them. */
export const EXCHANGE_FOLDER_ORDER = [
  EXCHANGE_FOLDERS.outbox,
  EXCHANGE_FOLDERS.pending,
  EXCHANGE_FOLDERS.inbox,
  EXCHANGE_FOLDERS.collected,
  EXCHANGE_FOLDERS.rejected,
] as const;

/** The suites a start lists with the note that they are the owner's alone: a full catalog sweep. */
export const OWNER_ONLY_SUITES: readonly string[] = Object.freeze(["catalog"]);

/** The actions, each a POST route of `/control/<action>`. */
export const CONTROL_ACTIONS = ["start", "collect", "ask"] as const;
export type ControlAction = (typeof CONTROL_ACTIONS)[number];

/** A suite the dashboard may start: its name (what a form sends) and its file (which only the server knows). */
export interface ControlSuite {
  readonly name: string;
  readonly file: string;
}

/** What run control is given: the lists every field is held to, and the environment of its children. */
export interface ControlOptions {
  /** The suites a start may name; the CLI lists `<root>/suites/*.json`. */
  readonly suites: readonly ControlSuite[];
  /** The engine ids a start may name: the configuration's definitions and the built-in engines. */
  readonly engines: readonly string[];
  /** The file-exchange engines the configuration defines, whose exchange directories `/control` counts. */
  readonly exchangeEngines: readonly string[];
  /** The environment of the children: the server's own unless a test gives another. */
  readonly env?: Readonly<Record<string, string | undefined>>;
  /** How long a child has to end after SIGTERM; `KILL_GRACE_MS` unless a test shortens it. */
  readonly killGraceMs?: number;
}

/**
 * What became of a step: `not-run` when an earlier step ended the job, `closed` when the dashboard closed before it
 * was started.
 */
export type StepState = "queued" | "running" | "exited" | "killed" | "not-started" | "not-run" | "closed";

/** Which command a step runs. */
export type StepName = "run" | "compare" | "report" | "collect";

/** The output of a step: stdout and stderr interleaved as received, its last `OUTPUT_TAIL_BYTES`. */
interface OutputTail {
  text: string;
  bytes: number;
  truncated: boolean;
}

interface StepRecord {
  readonly name: StepName;
  /** The arguments after `bin/lvrtc.mjs`, as the child is given them. */
  readonly args: readonly string[];
  /** The command line as a page shows it: no absolute path. */
  readonly command: string;
  state: StepState;
  exitCode: number | null;
  signal: string | null;
  readonly output: OutputTail;
  /** A collect's standard output, kept whole (to `STDOUT_LIMIT_BYTES`) to be read once it exits; null otherwise. */
  stdout: { text: string; bytes: number } | null;
}

interface JobRecord {
  readonly job: number;
  readonly kind: "suite" | "collect";
  readonly suite: string | null;
  readonly steps: StepRecord[];
  finished: boolean;
  /** A collect's outcome, read once when its step exited. */
  collect: JobView["collect"];
}

// ── Views ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A step as a page shows it: its command line and output with no absolute path. */
export interface StepView {
  readonly name: StepName;
  readonly command: string;
  readonly state: StepState;
  readonly exitCode: number | null;
  readonly signal: string | null;
  readonly output: string;
  readonly truncated: boolean;
}

/** What one engine's collection came to, read from `lvrtc collect --json`. */
export interface CollectEngineView {
  readonly engine: string;
  readonly unavailable: string | null;
  readonly collected: { readonly count: number; readonly jobs: readonly string[] };
  readonly rejected: {
    readonly count: number;
    readonly jobs: readonly { readonly job: string; readonly reason: string }[];
  };
  readonly pending: { readonly count: number; readonly jobs: readonly string[] };
}

/** The page of one job. */
export interface JobView {
  readonly kind: "dashboard-control-job";
  readonly job: number;
  readonly jobKind: "suite" | "collect";
  readonly suite: string | null;
  readonly running: boolean;
  readonly steps: readonly StepView[];
  /** A collect's outcome, once its step exited; null for a suite job or a collect not yet read. */
  readonly collect: { readonly engines: readonly CollectEngineView[]; readonly problem: string | null } | null;
}

/** A job as the control page lists it. */
export interface JobEntry {
  readonly job: number;
  readonly jobKind: "suite" | "collect";
  readonly suite: string | null;
  readonly running: boolean;
  readonly steps: readonly { readonly name: StepName; readonly state: StepState; readonly exitCode: number | null }[];
}

/** The control page. */
export interface ControlView {
  readonly kind: "dashboard-control";
  /** False when the dashboard was given no lists to hold a start to (`startDashboard` without `control`). */
  readonly configured: boolean;
  readonly suites: readonly string[];
  /** The suites listed that are the owner's alone (`OWNER_ONLY_SUITES`). */
  readonly ownerOnly: readonly string[];
  readonly engines: readonly string[];
  readonly rungs: readonly string[];
  /** What keeps a start or a collect from being taken now: a job, the engines being asked, or nothing. */
  readonly busy: { readonly reason: "job"; readonly job: number } | { readonly reason: "asking" } | null;
  /** Whether the engines can be asked again (the dashboard was started with a way to ask them). */
  readonly canAsk: boolean;
  readonly asked: { readonly state: string; readonly problem: string | null };
  readonly jobs: readonly JobEntry[];
  readonly pending: readonly {
    readonly suite: string;
    readonly run: string;
    readonly rung: string;
    readonly engine: string;
    readonly step: string | null;
    readonly requestId: string;
  }[];
  readonly exchange: readonly {
    readonly engine: string;
    readonly folders: readonly { readonly folder: string; readonly count: number }[];
  }[];
}

// ── Output with no absolute path ─────────────────────────────────────────────────────────────────────────────────

/** A path without trailing slashes (the root directory `/` stays itself). */
function withoutTrailingSlash(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * A path and the spellings it may be written in, each once: as given, and with its nearest existing ancestor
 * resolved (`realpath`), so that a directory made later, or one reached through a link (macOS's `/var` is
 * `/private/var`), is known by either. The root directory alone is no spelling.
 */
function spellings(path: string): string[] {
  const given = withoutTrailingSlash(resolve(path));
  const out = new Set([given]);
  let ancestor = given;
  while (!existsSync(ancestor) && dirname(ancestor) !== ancestor) ancestor = dirname(ancestor);
  try {
    out.add(withoutTrailingSlash(join(realpathSync(ancestor), relative(ancestor, given))));
  } catch {
    // Nothing of it can be resolved: only the spelling given.
  }
  return [...out].filter((each) => each.length > 1);
}

/** A character that can be part of a path's name: a prefix followed by one is not that path. */
const PATH_CHARACTER = "A-Za-z0-9._~+@%\\-";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replaces the root, the runs directory, the home directory and any other path given (`others`, such as a listed
 * suite outside the root) wherever they occur as whole paths, by `<root>`, `<runsDir>`, `~` and the others' labels,
 * the longest spelling first, so that a runs directory under the root, or a root under the home directory, is named
 * by the nearer of the two. A path is whole where it is not part of a longer name: `/Users/ron` is not replaced in
 * `/Users/ronald`.
 */
export function redactor(places: {
  readonly rootDir: string;
  readonly runsDir: string;
  readonly home?: string;
  readonly others?: readonly { readonly path: string; readonly label: string }[];
}): (text: string) => string {
  const pairs: [string, string][] = [
    ...(places.others ?? []).flatMap(({ path, label }) =>
      spellings(path).map((each): [string, string] => [each, label]),
    ),
    ...spellings(places.rootDir).map((path): [string, string] => [path, "<root>"]),
    ...spellings(places.runsDir).map((path): [string, string] => [path, "<runsDir>"]),
    ...spellings(places.home ?? homedir()).map((path): [string, string] => [path, "~"]),
  ].sort(([a], [b]) => b.length - a.length);
  const patterns = pairs.map(([path, label]): [RegExp, string] => [
    new RegExp(`(?<![${PATH_CHARACTER}/])${escapeRegExp(path)}(?![${PATH_CHARACTER}])`, "g"),
    label,
  ]);
  return (text) => {
    let out = text;
    for (const [pattern, label] of patterns) out = out.replace(pattern, () => label);
    return out;
  };
}

/** Whether `file` lies inside the directory `directory`. */
function inside(directory: string, file: string): boolean {
  const path = relative(resolve(directory), resolve(file));
  return path !== "" && !path.startsWith("..") && !isAbsolute(path);
}

/** An argument as a shell would need it written: as it is when it is plain, else in single quotes. */
function shellWord(word: string): string {
  return /^[A-Za-z0-9_./<>~:=,@%+-]+$/.test(word) ? word : `'${word.replaceAll("'", "'\\''")}'`;
}

function append(output: OutputTail, chunk: string): void {
  output.text += chunk;
  output.bytes += Buffer.byteLength(chunk);
  // Trimmed once it is half again as long as kept, to the last OUTPUT_TAIL_BYTES from the start of a line.
  if (output.bytes <= OUTPUT_TAIL_BYTES * 1.5) return;
  let kept = Buffer.from(output.text, "utf8").subarray(-OUTPUT_TAIL_BYTES).toString("utf8");
  const newline = kept.indexOf("\n");
  if (newline >= 0 && newline < kept.length - 1) kept = kept.slice(newline + 1);
  output.text = kept;
  output.bytes = Buffer.byteLength(kept);
  output.truncated = true;
}

// ── Reading a collect's output ───────────────────────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((each) => typeof each === "string");

/** What `lvrtc collect --json` printed, read: per engine, or why it cannot be read, in words that quote nothing. */
export function readCollectOutput(
  stdout: string,
  redact: (text: string) => string,
): { readonly engines: readonly CollectEngineView[]; readonly problem: string | null } {
  const none = (problem: string) => ({ engines: [], problem });
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return none(DASHBOARD_TEXT.control.collectNotJson);
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.engines)) return none(DASHBOARD_TEXT.control.collectNoEngines);
  const engines: CollectEngineView[] = [];
  for (const each of parsed.engines as unknown[]) {
    if (!isRecord(each) || typeof each.engine !== "string") return none(DASHBOARD_TEXT.control.collectNoEngines);
    if (typeof each.unavailable === "string") {
      engines.push({
        engine: each.engine,
        unavailable: redact(each.unavailable),
        collected: { count: 0, jobs: [] },
        rejected: { count: 0, jobs: [] },
        pending: { count: 0, jobs: [] },
      });
      continue;
    }
    const rejected = each.rejected;
    if (
      !isStrings(each.collected) ||
      !isStrings(each.pending) ||
      !Array.isArray(rejected) ||
      !rejected.every((job) => isRecord(job) && typeof job.job === "string" && typeof job.reason === "string")
    ) {
      return none(DASHBOARD_TEXT.control.collectNoEngines);
    }
    const refused = (rejected as { job: string; reason: string }[]).map(({ job, reason }) => ({
      job,
      reason: redact(reason),
    }));
    engines.push({
      engine: each.engine,
      unavailable: null,
      collected: { count: each.collected.length, jobs: [...each.collected] },
      rejected: { count: refused.length, jobs: refused },
      pending: { count: each.pending.length, jobs: [...each.pending] },
    });
  }
  return { engines, problem: null };
}

// ── The form ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** A refusal of an action: its status and the sentence that says why. */
export interface Refusal {
  readonly status: 400 | 403 | 409 | 413 | 415;
  readonly reason: string;
}

/** Whether `given` is the token, compared in constant time (both hashed, so their lengths do not show). */
export function tokenMatches(token: string, given: string | null): boolean {
  if (given === null) return false;
  const digest = (text: string): Buffer => createHash("sha256").update(text, "utf8").digest();
  return timingSafeEqual(digest(token), digest(given)) && given.length === token.length;
}

/**
 * The headers of an action held to this dashboard: an `Origin`, when sent, must be its own; `Sec-Fetch-Site`, when
 * sent, `same-origin` or `none`; the body a form, `application/x-www-form-urlencoded`. Null when they hold.
 */
export function headerRefusal(
  headers: Readonly<Record<string, string | string[] | undefined>>,
  port: number,
): Refusal | null {
  const text = DASHBOARD_TEXT.control;
  const origin = headers.origin;
  if (origin !== undefined && origin !== `http://127.0.0.1:${port}` && origin !== `http://localhost:${port}`) {
    return { status: 403, reason: text.refusedOrigin };
  }
  const site = headers["sec-fetch-site"];
  if (site !== undefined && site !== "same-origin" && site !== "none") return { status: 403, reason: text.refusedSite };
  const type = String(headers["content-type"] ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (type !== "application/x-www-form-urlencoded") return { status: 415, reason: text.refusedType };
  return null;
}

/** The fields of a form body, each once, or why not. */
function fieldsOf(
  body: string,
  allowed: readonly string[],
): { readonly fields: ReadonlyMap<string, string> } | { readonly refusal: Refusal } {
  const fields = new Map<string, string>();
  for (const [name, value] of new URLSearchParams(body)) {
    if (!allowed.includes(name)) return { refusal: { status: 400, reason: DASHBOARD_TEXT.control.unknownField(name) } };
    if (fields.has(name)) return { refusal: { status: 400, reason: DASHBOARD_TEXT.control.repeatedField(name) } };
    fields.set(name, value);
  }
  return { fields };
}

/** A list of ids separated by commas, each one of `known`, or why not; null for a field left empty. */
function idList(
  value: string | undefined,
  known: readonly string[],
  unknown: (id: string) => string,
): { readonly ids: readonly string[] | null } | { readonly reason: string } {
  if (value === undefined || value.trim() === "") return { ids: null };
  const ids = value.split(",").map((id) => id.trim());
  if (ids.includes("")) return { reason: DASHBOARD_TEXT.control.emptyId };
  for (const id of ids) if (!known.includes(id)) return { reason: unknown(id) };
  if (new Set(ids).size !== ids.length) return { reason: DASHBOARD_TEXT.control.repeatedId };
  return { ids };
}

/** What a start asks for, held to the lists. */
interface StartRequest {
  readonly suite: ControlSuite;
  readonly engines: readonly string[] | null;
  readonly rungs: readonly string[] | null;
  readonly jobs: number;
}

// ── The controller ───────────────────────────────────────────────────────────────────────────────────────────────

/** What the server asks of run control. */
export interface Controller {
  /** The token every form carries: random for each server, never written. */
  readonly token: string;
  /** Takes an action whose headers and token were checked: 303 to the page to see, or a refusal. */
  act(action: ControlAction, body: string): { readonly location: string } | Refusal;
  controlView(): ControlView;
  /** Null for a job the dashboard does not have. */
  jobView(job: number): JobView | null;
  /**
   * Ends a running child's process group (SIGTERM, then SIGKILL after the grace period; SIGKILL to what of the group
   * outlives the child) and resolves once the child has exited.
   */
  close(): Promise<void>;
}

/** What run control needs of the server: where it is, and the engines' asking. */
export interface ControlContext {
  readonly rootDir: string;
  readonly runsDir: string;
  readonly sources: DashboardSources;
  /** What became of asking the engines, now. */
  readonly asked: () => { readonly state: string; readonly problem?: string };
  /** Asks the engines again; null when the dashboard has no way to ask them (`--no-ask`). */
  readonly askAgain: (() => void) | null;
}

/** The entries of a folder that are neither hidden nor temporary, as `lvrtc collect` reads them; none if not there. */
function folderCount(directory: string): number {
  try {
    return readdirSync(directory).filter((name) => !name.startsWith(".") && !name.endsWith(".tmp")).length;
  } catch {
    return 0;
  }
}

/** The suite's own name (what compare and report are given), or the file's stem where the file says none. */
function suiteNameOf(file: string): string {
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (isRecord(parsed) && typeof parsed.name === "string" && parsed.name !== "") return parsed.name;
  } catch {
    // lvrtc run says what is wrong with the file, and ends the job.
  }
  return basename(file).replace(/\.json$/, "");
}

/** Sends a signal to a child's process group, which it leads; a group that is gone already is no error. */
function signalGroup(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid === undefined) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    // The group has no process left.
  }
}

/**
 * Makes run control over the context and options given. Without options the dashboard was given no lists to hold a
 * start to: it starts and collects nothing, and its page says so.
 */
export function createController(context: ControlContext, configured: ControlOptions | undefined): Controller {
  const { rootDir, runsDir, sources } = context;
  const options: ControlOptions = configured ?? { suites: [], engines: [], exchangeEngines: [] };
  const token = randomBytes(32).toString("hex");
  // A listed suite outside the root is named by a placeholder: its path is none of a page's business.
  const outside = options.suites.filter((suite) => !inside(rootDir, suite.file));
  const others = outside.map((suite) => ({
    path: suite.file,
    label: DASHBOARD_TEXT.control.suitePlaceholder(suite.name),
  }));
  const redact = redactor({ rootDir, runsDir, others });
  const env = { ...(options.env ?? process.env), LVRTC_RUNS_DIR: runsDir };
  const grace = options.killGraceMs ?? KILL_GRACE_MS;
  const rungIds = RUNGS.map((rung) => rung.id);
  const suiteNames = options.suites.map((suite) => suite.name);
  const jobs: JobRecord[] = [];
  let current: { readonly job: JobRecord; child: ChildProcess | null; exited: Promise<void> | null } | null = null;
  let closing = false;
  const text = DASHBOARD_TEXT.control;

  const commandOf = (args: readonly string[]): string =>
    ["LVRTC_RUNS_DIR=<runsDir>", "node", "bin/lvrtc.mjs", ...args.map((arg) => shellWord(redact(arg)))].join(" ");
  const step = (name: StepName, args: readonly string[]): StepRecord => ({
    name,
    args,
    command: commandOf(args),
    state: "queued",
    exitCode: null,
    signal: null,
    output: { text: "", bytes: 0, truncated: false },
    stdout: name === "collect" ? { text: "", bytes: 0 } : null,
  });

  /** Runs one step as a child and resolves once it has ended and its output is in. */
  const runStep = (record: StepRecord): Promise<void> =>
    new Promise((resolve) => {
      record.state = "running";
      let child: ChildProcess;
      try {
        // Detached: the child leads a process group of its own, which `close()` signals whole.
        child = spawn(process.execPath, [BIN, ...record.args], {
          env,
          stdio: ["ignore", "pipe", "pipe"],
          detached: true,
        });
      } catch {
        record.state = "not-started";
        resolve();
        return;
      }
      if (current !== null) current.child = child;
      const decoders = { stdout: new StringDecoder("utf8"), stderr: new StringDecoder("utf8") };
      child.stdout?.on("data", (chunk: Buffer) => {
        const said = decoders.stdout.write(chunk);
        append(record.output, said);
        const kept = record.stdout;
        if (kept !== null && kept.bytes <= STDOUT_LIMIT_BYTES) {
          kept.text += said;
          kept.bytes += chunk.length;
        }
      });
      child.stderr?.on("data", (chunk: Buffer) => append(record.output, decoders.stderr.write(chunk)));
      let exited: () => void = () => undefined;
      if (current !== null) current.exited = new Promise((done) => (exited = done));
      child.on("error", () => {
        if (record.state === "running") record.state = "not-started";
        exited();
        resolve();
      });
      child.on("exit", (code, signal) => {
        record.exitCode = code;
        record.signal = signal;
        record.state = signal === null ? "exited" : "killed";
        exited();
      });
      child.on("close", () => {
        const rest = decoders.stdout.end();
        append(record.output, rest + decoders.stderr.end());
        if (record.stdout !== null) record.stdout.text += rest;
        if (current !== null) current.child = null;
        resolve();
      });
    });

  /** Whether the job goes on after a step: a run that exits 2 ends it, and so does a compare that exits 2. */
  const goesOn = (record: StepRecord): boolean =>
    record.state === "exited" &&
    (record.name === "run" || record.name === "compare" ? record.exitCode === 0 || record.exitCode === 1 : true);

  /** A collect's outcome, read once from its whole standard output, which is then let go. */
  const collectOutcome = (record: StepRecord): JobView["collect"] => {
    const kept = record.stdout;
    record.stdout = null;
    if (kept === null) return null;
    if (kept.bytes > STDOUT_LIMIT_BYTES) return { engines: [], problem: text.collectTooLong };
    return readCollectOutput(kept.text, redact);
  };

  const runJob = async (job: JobRecord): Promise<void> => {
    let stopped = false;
    for (const record of job.steps) {
      if (closing) record.state = "closed";
      else if (stopped) record.state = "not-run";
      else {
        await runStep(record);
        if (record.name === "collect") job.collect = collectOutcome(record);
        if (!goesOn(record)) stopped = true;
      }
    }
    job.finished = true;
    current = null;
  };

  const begin = (job: JobRecord): { readonly location: string } => {
    jobs.push(job);
    current = { job, child: null, exited: null };
    void runJob(job);
    return { location: `/control/job/${job.job}` };
  };

  const busyRefusal = (): Refusal | null => {
    if (closing) return { status: 409, reason: text.closing };
    if (current !== null) return { status: 409, reason: text.busyJob(String(current.job.job)) };
    if (context.asked().state === "asking") return { status: 409, reason: text.busyAsking };
    return null;
  };

  const readStart = (fields: ReadonlyMap<string, string>): StartRequest | Refusal => {
    const name = fields.get("suite");
    const suite = options.suites.find((each) => each.name === name);
    if (name === undefined || name === "") return { status: 400, reason: text.noSuite };
    if (suite === undefined) return { status: 400, reason: text.unknownSuite(name) };
    const engines = idList(fields.get("engines"), options.engines, text.unknownEngine);
    if ("reason" in engines) return { status: 400, reason: engines.reason };
    const rungs = idList(fields.get("rungs"), rungIds, text.unknownRung);
    if ("reason" in rungs) return { status: 400, reason: rungs.reason };
    const jobsText = (fields.get("jobs") ?? "").trim();
    const said = jobsText === "" ? "1" : jobsText;
    if (!/^[1-9][0-9]?$/.test(said) || Number(said) > CONTROL_MAX_JOBS) {
      return { status: 400, reason: text.badJobs(jobsText, String(CONTROL_MAX_JOBS)) };
    }
    return { suite, engines: engines.ids, rungs: rungs.ids, jobs: Number(said) };
  };

  const act = (action: ControlAction, body: string): { readonly location: string } | Refusal => {
    const allowed = action === "start" ? ["token", "suite", "engines", "rungs", "jobs"] : ["token"];
    const read = fieldsOf(body, allowed);
    // The token first: a form without this server's token is refused whatever else it holds.
    const tokens = new URLSearchParams(body).getAll("token");
    if (tokens.length !== 1 || !tokenMatches(token, tokens[0])) return { status: 403, reason: text.refusedToken };
    if ("refusal" in read) return read.refusal;
    if (action === "ask") {
      if (context.askAgain === null) return { status: 409, reason: text.cannotAsk };
      const busy = busyRefusal();
      if (busy !== null) return busy;
      context.askAgain();
      return { location: "/control" };
    }
    if (configured === undefined) return { status: 409, reason: text.notConfigured };
    if (action === "collect") {
      const busy = busyRefusal();
      if (busy !== null) return busy;
      return begin({
        job: jobs.length + 1,
        kind: "collect",
        suite: null,
        steps: [step("collect", ["collect", "--root", rootDir, "--json"])],
        finished: false,
        collect: null,
      });
    }
    const start = readStart(read.fields);
    if ("status" in start) return start;
    const busy = busyRefusal();
    if (busy !== null) return busy;
    const suiteName = suiteNameOf(start.suite.file);
    const selection = [
      ...(start.engines === null ? [] : ["--engines", start.engines.join(",")]),
      ...(start.rungs === null ? [] : ["--rungs", start.rungs.join(",")]),
    ];
    return begin({
      job: jobs.length + 1,
      kind: "suite",
      suite: suiteName,
      steps: [
        step("run", ["run", start.suite.file, "--root", rootDir, ...selection, "--jobs", String(start.jobs)]),
        step("compare", ["compare", suiteName, "--root", rootDir]),
        step("report", ["report", suiteName, "--root", rootDir]),
      ],
      finished: false,
      collect: null,
    });
  };

  const jobView = (number: number): JobView | null => {
    const job = jobs[number - 1];
    if (job === undefined) return null;
    return {
      kind: "dashboard-control-job",
      job: job.job,
      jobKind: job.kind,
      suite: job.suite,
      running: !job.finished,
      steps: job.steps.map((record) => ({
        name: record.name,
        command: record.command,
        state: record.state,
        exitCode: record.exitCode,
        signal: record.signal,
        output: redact(record.output.text),
        truncated: record.output.truncated,
      })),
      collect: job.collect,
    };
  };

  const controlView = (): ControlView => {
    const asked = context.asked();
    const pending: ControlView["pending"][number][] = [];
    for (const suite of sources.runNames()) {
      const manifest = sources.manifest(suite);
      if (manifest.state !== "ok") continue;
      for (const job of manifest.value.jobs) {
        if (job.status !== "pending") continue;
        pending.push({
          suite,
          run: job.run,
          rung: job.rung,
          engine: job.engine,
          step: job.step ?? null,
          requestId: job.requestId,
        });
      }
    }
    return {
      kind: "dashboard-control",
      configured: configured !== undefined,
      suites: [...suiteNames],
      ownerOnly: suiteNames.filter((name) => OWNER_ONLY_SUITES.includes(name)),
      engines: [...options.engines],
      rungs: [...rungIds],
      busy:
        current !== null
          ? { reason: "job", job: current.job.job }
          : asked.state === "asking"
            ? { reason: "asking" }
            : null,
      canAsk: context.askAgain !== null,
      asked: { state: asked.state, problem: asked.problem ?? null },
      jobs: jobs.map((job) => ({
        job: job.job,
        jobKind: job.kind,
        suite: job.suite,
        running: !job.finished,
        steps: job.steps.map(({ name, state, exitCode }) => ({ name, state, exitCode })),
      })),
      pending,
      exchange: options.exchangeEngines.map((engine) => ({
        engine,
        folders: EXCHANGE_FOLDER_ORDER.map((folder) => ({
          folder,
          count: folderCount(join(exchangeDirectory(runsDir, engine), folder)),
        })),
      })),
    };
  };

  return {
    token,
    act,
    controlView,
    jobView,
    close: async () => {
      closing = true;
      const running = current;
      if (running === null) return;
      const { child } = running;
      if (child !== null) {
        // The whole group: the child and every process it started (engine workers), which a serial lvrtc run does
        // not end itself on SIGTERM.
        if (child.exitCode === null && child.signalCode === null) {
          signalGroup(child, "SIGTERM");
          const timer = setTimeout(() => signalGroup(child, "SIGKILL"), grace);
          await running.exited;
          clearTimeout(timer);
        }
        // Whatever of the group outlived its leader is ended too, and a pipe it keeps open does not hold the close.
        signalGroup(child, "SIGKILL");
        child.stdout?.destroy();
        child.stderr?.destroy();
      }
      // The job's remaining steps are marked as not run once its last child is in.
      while (current !== null) await new Promise((done) => setTimeout(done, 10));
    },
  };
}
