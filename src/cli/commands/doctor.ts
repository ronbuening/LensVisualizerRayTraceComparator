import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import packageJson from "../../../package.json" with { type: "json" };
import { CONFIG_KEYS, REPO_ROOT, configValue, loadConfig } from "../../core/config.ts";
import type { ConfigKey, ConfigLayer, LoadedConfig } from "../../core/config.ts";
import { EXIT_FAILURE, EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

/** Outcome of a command that ran to completion. */
export interface CommandResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

/** Everything doctor reads from the machine besides the configuration, injected so tests are hermetic. */
export interface DoctorProbe {
  /** The running Node version, without a leading "v". */
  nodeVersion(): string;
  exists(path: string): boolean;
  /** Runs a command to completion without a shell; null when it could not be started or did not finish. */
  run(command: string, args: readonly string[]): CommandResult | null;
}

/** What `lvrtc doctor` is wired to: where the configuration lives, the environment, and the machine. */
export interface DoctorInputs {
  readonly rootDir: string;
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
    /** Null unless LV is present and is a git checkout. */
    readonly git: { readonly commit: string; readonly dirty: boolean } | null;
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
  };
}

const NODE_RANGE: string = packageJson.engines.node;
const LV_MARKER = "src/optics/buildLens.ts";
/** optiland has no `__version__`; its distribution metadata is the only version it carries. */
const OPTILAND_VERSION_SCRIPT = "import importlib.metadata as m; print(m.version('optiland'))";
const PROBE_TIMEOUT_MS = 20_000;
const USAGE = "Usage: lvrtc doctor [--json]\n";

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

function succeeded(result: CommandResult | null): result is CommandResult {
  return result !== null && result.status === 0;
}

/** The interpreter's `--version` line, or null when it could not be run. */
function interpreterVersion(command: string, probe: DoctorProbe): string | null {
  const result = probe.run(command, ["--version"]);
  return succeeded(result) ? result.stdout.trim() || result.stderr.trim() : null;
}

function probeLensVisualizer(path: string | null, probe: DoctorProbe): DoctorReport["lensVisualizer"] {
  if (path === null) return { status: "not configured", path: null, git: null };
  if (!probe.exists(join(path, LV_MARKER))) return { status: "missing", path, git: null };
  // Both git commands only read; --no-optional-locks keeps `status` from refreshing LV's index.
  const head = probe.run("git", ["-C", path, "rev-parse", "HEAD"]);
  const status = succeeded(head)
    ? probe.run("git", ["--no-optional-locks", "-C", path, "status", "--porcelain"])
    : null;
  const git =
    succeeded(head) && succeeded(status) ? { commit: head.stdout.trim(), dirty: status.stdout.trim() !== "" } : null;
  return { status: "present", path, git };
}

function probeOptiland(python: string | null, probe: DoctorProbe): DoctorReport["optiland"] {
  if (python === null) return { python: null, interpreter: "not configured", interpreterVersion: null, version: null };
  const version = interpreterVersion(python, probe);
  if (version === null) return { python, interpreter: "missing", interpreterVersion: null, version: null };
  const distribution = probe.run(python, ["-c", OPTILAND_VERSION_SCRIPT]);
  return {
    python,
    interpreter: "present",
    interpreterVersion: version,
    version: succeeded(distribution) ? distribution.stdout.trim() : null,
  };
}

/** Gathers the report. Probes only read: nothing is written, installed or imported from LV or optiland. */
export function collectDoctorReport(loaded: LoadedConfig, probe: DoctorProbe): DoctorReport {
  const { config, sources } = loaded;
  const nodeVersion = probe.nodeVersion();
  return {
    node: { version: nodeVersion, required: NODE_RANGE, ok: satisfiesRange(nodeVersion, NODE_RANGE) },
    config: Object.fromEntries(
      CONFIG_KEYS.map((key) => [key, { value: configValue(config, key), source: sources[key] }]),
    ) as DoctorReport["config"],
    lensVisualizer: probeLensVisualizer(config.lvPath, probe),
    python: { command: config.python, version: interpreterVersion(config.python, probe) },
    optiland: probeOptiland(config.engines.optiland.python, probe),
  };
}

type Row = readonly [label: string, value: string];

function section(title: string, rows: readonly Row[]): string {
  const width = Math.max(...rows.map(([label]) => label.length));
  return [title, ...rows.map(([label, value]) => `  ${label.padEnd(width)}  ${value}`)].join("\n");
}

/** The human-readable report: a pure function of the report, with no timestamps. */
export function renderDoctorText(report: DoctorReport): string {
  const { node, config, lensVisualizer, python, optiland } = report;

  const lvRows: Row[] = [["status", lensVisualizer.status]];
  if (lensVisualizer.path !== null) lvRows.unshift(["path", lensVisualizer.path]);
  if (lensVisualizer.status === "missing") lvRows.push(["reason", `${LV_MARKER} not found under the path`]);
  if (lensVisualizer.status === "present") {
    const { git } = lensVisualizer;
    lvRows.push(["git", git === null ? "not a git checkout" : `${git.commit} (${git.dirty ? "dirty" : "clean"})`]);
  }

  const optilandRows: Row[] = [["interpreter", optiland.interpreter]];
  if (optiland.python !== null) optilandRows.unshift(["python", optiland.python]);
  if (optiland.interpreter === "present") {
    optilandRows[optilandRows.length - 1] = ["interpreter", `present (${optiland.interpreterVersion})`];
    optilandRows.push(["version", optiland.version ?? "not importable"]);
  }

  const sections = [
    section("Node", [
      ["version", node.version],
      ["required", node.required],
      ["status", node.ok ? "ok" : "out of range"],
    ]),
    section(
      "Config",
      CONFIG_KEYS.map((key) => [key, `${config[key].value ?? "(not set)"}  [${config[key].source}]`]),
    ),
    section("LensVisualizer", lvRows),
    section("Python", [
      ["command", python.command],
      ["version", python.version ?? "not found"],
    ]),
    section("optiland", optilandRows),
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
  return `${JSON.stringify(withSortedKeys(report), null, 2)}\n`;
}

/**
 * Builds `lvrtc doctor [--json]`. It exits 1 only when the Node version is out of range; a missing LensVisualizer,
 * Python or optiland is reported and exits 0. A configuration file that cannot be read is an error.
 */
export function createDoctorCommand(inputs: DoctorInputs): CliCommand {
  return {
    name: "doctor",
    summary: "Report the Node version, configuration, LensVisualizer, Python and optiland",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(USAGE);
        return EXIT_OK;
      }
      const unknown = args.find((arg) => arg !== "--json");
      if (unknown !== undefined) {
        io.stderr(`lvrtc doctor: unknown argument "${unknown}"\n${USAGE}`);
        return EXIT_USAGE;
      }
      const loaded = loadConfig({ rootDir: inputs.rootDir, env: inputs.env });
      const report = collectDoctorReport(loaded, inputs.probe);
      io.stdout(args.includes("--json") ? renderDoctorJson(report) : renderDoctorText(report));
      if (report.node.ok) return EXIT_OK;
      io.stderr(`lvrtc doctor: Node ${report.node.version} is outside the supported range ${report.node.required}\n`);
      return EXIT_FAILURE;
    },
  };
}

/**
 * The variables with which git points its hooks and `rebase --exec` commands at its own repository
 * (`git rev-parse --local-env-vars`). They outrank `-C`, so a probe that inherited them would read LensVisualizer's
 * commit and dirty flag from whichever repository the parent git was working in.
 */
const GIT_REPOSITORY_VARIABLES: readonly string[] = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_CONFIG",
  "GIT_CONFIG_COUNT",
  "GIT_CONFIG_PARAMETERS",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
];

function probeEnvironment(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, PYTHONDONTWRITEBYTECODE: "1" };
  for (const name of GIT_REPOSITORY_VARIABLES) delete env[name];
  return env;
}

/**
 * Probes this machine. Commands run without a shell and under a time limit; Python is told not to write bytecode,
 * and git is not handed a repository inherited from a parent git.
 */
export const systemProbe: DoctorProbe = {
  nodeVersion: () => process.versions.node,
  exists: (path) => existsSync(path),
  run: (command, args) => {
    try {
      const result = spawnSync(command, [...args], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: PROBE_TIMEOUT_MS,
        env: probeEnvironment(),
      });
      return result.error ? null : { status: result.status, stdout: result.stdout, stderr: result.stderr };
    } catch {
      // spawnSync throws, instead of reporting, on a command line it refuses outright (a NUL byte in a path).
      return null;
    }
  },
};

/** `lvrtc doctor` wired to this repository, the process environment and this machine. */
export const doctorCommand: CliCommand = createDoctorCommand({
  rootDir: REPO_ROOT,
  env: process.env,
  probe: systemProbe,
});
