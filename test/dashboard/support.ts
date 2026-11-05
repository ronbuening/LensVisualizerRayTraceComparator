// What the dashboard tests share: a fixture of run directories and baselines made in a temporary directory by
// running the fake suites (in this process, on in-process engines only) and the R5 stand-ins, a walker of view
// models, an independent reader of JSON pointers, and a client that asks a dashboard with a Host header of its own.
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { MTF_BASELINE, baselineText, buildBaseline } from "../../src/baseline/build.ts";
import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE, comparisonFileText } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { CONTRACT_VERSION_1_6 } from "../../src/contract/version.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { COUNT_KEYS, isCurve, isDerived, isFigure } from "../../src/dashboard/figure.ts";
import type { Curve, Derived, DocumentName, Figure } from "../../src/dashboard/figure.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { createFixtureCaseSource } from "../../src/core/suite.ts";
import { createRefEngine } from "../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { DOUBLE_GAUSS, FAKE_ROOT, SINGLET, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { createEngine as createBentEngine } from "../engines/ref/bentEngine.ts";
import type { BentOptions } from "../engines/ref/bentEngine.ts";
import { ON_AXIS_BAND, R5_POLICY, mtfEngine, r5Cycle } from "../report/r5Fixture.ts";
import { FLAT, SPEC, raised } from "../compare/mtfNativeSupport.ts";
import { followUpsOf } from "../../src/compare/followUp.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { encodeF8 } from "../../src/core/numeric/ndarray.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { R5G_POLICY, r5gCycle } from "../report/r5gFixture.ts";
import type { ProtocolHandler, ProtocolResponse } from "../../src/contract/protocol.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { FAULT_ROOT, suiteFile } from "../report/support.ts";

/** The fixture: a root with baselines, its runs directory, and the R5 stand-ins under a root and runs of their own. */
export interface DashboardFixture {
  readonly directory: string;
  readonly rootDir: string;
  readonly runsDir: string;
  /** The R5 stand-ins: their own root (an MTF baseline), runs directory and policy file. */
  readonly mtfRootDir: string;
  readonly mtfRunsDir: string;
  readonly mtfPolicyFile: string;
  /**
   * The rays of `ref` against two copies of it (`RAYS_SUITE`), one with a radius one part in 1e6 too long, judged by
   * the comparator's policy with an R0 that blocks nothing: its own root, runs directory and policy file.
   */
  readonly raysRootDir: string;
  readonly raysRunsDir: string;
  readonly raysPolicyFile: string;
  /** The suites run into `runsDir`. */
  readonly suites: readonly string[];
  /** A run directory whose name needs escaping, and one whose comparison file is not JSON. */
  readonly oddName: string;
  readonly corrupt: string;
  remove(): void;
}

/** The fake suites run into the fixture, with the root and the engines each is run on. */
const SUITES: readonly { readonly name: string; readonly root: string; readonly engines?: string }[] = [
  { name: "fake-pair", root: FAKE_ROOT, engines: "fake-a,fake-b" },
  { name: "fake-3-engines-ts", root: FAKE_ROOT },
  { name: "fake-group", root: FAKE_ROOT },
  { name: "fake-faults", root: FAULT_ROOT },
];

/** The run directory with a name that a page must escape. */
export const ODD_NAME = "a<b&c";

/** The policy of the MTF part of the fixture: the R5 stand-ins' rung and the R5g stand-ins', with their bands. */
export const MTF_FIXTURE_POLICY: Policy = { ...R5_POLICY, rungs: { ...R5_POLICY.rungs, ...R5G_POLICY.rungs } };

/** The suite of the rays part of the fixture: `ref`, a copy with a bent radius and a faithful copy, on R0 and R2. */
export const RAYS_SUITE = "rays";

/** The comparator's own policy with an R0 that blocks nothing, so that R2 speaks for itself. */
export function unblockingPolicy(): Policy {
  const own = loadPolicy();
  const { blocksLaterRungs: _blocks, ...r0 } = own.rungs.r0;
  return { ...own, rungs: { ...own.rungs, r0 } };
}

/** Runs `ref` and its two copies on the Double-Gauss case into `runsDir`, and compares them by `policy`. */
/** The copy of `ref` whose radius on surface 8 is one part in 1e6 too long; it sorts after the faithful copy. */
export const WARPED = "ref-warped";

/**
 * A protocol handler that says it is `id` with a fingerprint and an adapter revision of the fixture's own, whatever
 * the code behind it: no golden chart or store key of the fixture depends on a hash of any engine's source, so a
 * chart changes only when its numbers or its drawing do.
 */
function fixedIdentity(id: string, handler: ProtocolHandler): ProtocolHandler {
  const fingerprint = hashCanonical({ fixture: "dashboard", engine: id });
  const adapterRevision = hashCanonical({ fixture: "dashboard", adapter: id });
  return async (message) => {
    const reply: ProtocolResponse = structuredClone(await handler(message));
    if (!reply.ok) return reply;
    const result = reply.result as { identity?: Record<string, unknown>; engine?: Record<string, unknown> };
    for (const who of [result.identity, result.engine]) {
      if (who === undefined) continue;
      who.id = id;
      who.fingerprint = fingerprint;
      if (who.adapterRevision !== undefined) who.adapterRevision = adapterRevision;
      if (who.details !== undefined) who.details = { fixture: "dashboard" };
    }
    return reply;
  };
}

async function raysCycle(runsDir: string, policy: Policy): Promise<ComparisonFile> {
  const engine =
    (handler: () => ProtocolHandler): EngineMaker =>
    (id) =>
      new RemoteEngineAdapter({ id, transport: createInProcessTransport(fixedIdentity(id, handler())) });
  const bend: BentOptions = { id: WARPED, edits: [{ pointer: "/system/surfaces/8/shape/radius", scale: 1 + 1e-6 }] };
  const { registry } = watchedRegistry({
    ref: engine(() => createRefEngine()),
    [WARPED]: engine(() => createBentEngine(bend)),
    "ref-twin": engine(() => createBentEngine({ id: "ref-twin" })),
  });
  const suite = suiteOf(RAYS_SUITE, [
    {
      name: "double-gauss",
      opticalCase: DOUBLE_GAUSS,
      rungs: ["r0", "r2"],
      fields: { kind: "angles-deg", values: [0, 10] },
      sampling: { bundleGrid: 12 },
    },
    // A run that could not start: a row of the heat map that no comparison has.
    { name: "no-case", opticalCase: null, problems: ["the fixture gives this run no case"] },
  ]);
  const sources = { fixture: createFixtureCaseSource(runsDir) };
  const { manifest } = await runSuite({ suite, registry, runsDir, sources });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  return compareManifest({ manifest, store, policy, reference: "ref", cases: () => DOUBLE_GAUSS });
}

/** The suite whose first field is off the axis and whose stand-in for optiland fails when asked again at 512 rays. */
export const REORDERED_SUITE = "r5-reordered";

/**
 * Runs `REORDERED_SUITE` into `runsDir` and compares it by `policy`: one request of two fields, 0.5 then 0, of two
 * stand-ins. On the axis (the second field) optiland's sagittal curve is twice the band above lv's at 10 cycles/mm,
 * so it is asked again at 512 rays, and that answer is an error: the comparison judges its first answer.
 */
async function reorderedCycle(runsDir: string, policy: Policy): Promise<ComparisonFile> {
  const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "image-height-fractions", values: [0.5, 0] } };
  const rung: RungDefinition = {
    id: "r5",
    quantity: MTF_NATIVE,
    engines: ["lv", "optiland"],
    buildRequests: (opticalCase) => [makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec })],
  };
  const field = (value: number, sagittal: readonly number[]) => ({
    field: value,
    fieldAngleDeg: 8 * value,
    imageHeightMm: 16 * value,
    sagittal: encodeF8([...sagittal]),
    tangential: encodeF8([...FLAT]),
    status: "ok" as const,
    sampling: {},
  });
  const data = (name: string, onAxis: readonly number[]): MtfNativeData => ({
    fields: [field(0.5, FLAT), field(0, onAxis)],
    method: { name, params: {} },
    focus: { mode: "design", appliedShiftMm: 0 },
    aperture: {},
    lines: [{ wavelengthNm: 587.5618, weight: 1 }],
    notes: [],
  });
  const { registry } = watchedRegistry({
    lv: mtfEngine(() => ({ status: "ok", data: data("lv-product", FLAT) })),
    optiland: mtfEngine((request) =>
      request.engineOptions?.fftRays === 512
        ? { status: "error", error: { code: "engine-failure", message: "the stand-in fails at 512 rays" } }
        : { status: "ok", data: data("scalar-fft-mtf", raised(2 * ON_AXIS_BAND, 0)) },
    ),
  });
  const suite = suiteOf(REORDERED_SUITE, [{ name: "singlet", opticalCase: SINGLET }]);
  const rungDefinitions = [rung];
  const { manifest } = await runSuite({
    suite,
    registry,
    runsDir,
    rungDefinitions,
    rungs: [rung.id],
    followUps: followUpsOf(policy),
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  return compareManifest({ manifest, store, policy, rungDefinitions });
}

async function cli(runsDir: string, args: readonly string[]): Promise<void> {
  const inputs = { rootDir: REPO_ROOT, cwd: REPO_ROOT, env: { LVRTC_RUNS_DIR: runsDir } };
  const io = { stdout: () => undefined, stderr: () => undefined };
  await runCli(args, io, [createRunCommand(inputs), createCompareCommand(inputs)]);
}

export function readManifest(runsDir: string, name: string): RunManifest {
  return JSON.parse(readFileSync(join(runsDir, name, MANIFEST_FILE), "utf8"));
}

export function readComparisons(runsDir: string, name: string): ComparisonFile {
  return JSON.parse(readFileSync(join(runsDir, name, COMPARISONS_FILE), "utf8"));
}

function writeBaseline(rootDir: string, stem: string, baseline: Baseline): void {
  mkdirSync(join(rootDir, "baselines"), { recursive: true });
  writeFileSync(join(rootDir, "baselines", `${stem}.json`), baselineText(baseline));
}

/**
 * Makes the fixture. The baselines of the root, by stem:
 *
 * - `fake-pair`, `fake-group`: of their runs as run, by the policy at hand (current on the last run);
 * - `policy-moved` (suite fake-3-engines-ts): judged by a policy of another version: STALE(policy);
 * - `case-moved` (suite fake-pair): the singlet's case another: STALE(case) on that run;
 * - `engine-moved` (suite fake-pair): fake-b's fingerprint another: STALE(engine) on its pairs;
 * - `orphan` (suite orphan, which has no run directory): NOT KNOWN(case,engine);
 * - `two-requests` (suite fake-pair): a rung of two requests, one PASS and one FAIL;
 * - `catalog`: the fake pair as a dated snapshot;
 * - `broken`: not a baseline.
 */
export async function buildFixture(): Promise<DashboardFixture> {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), "lvrtc-dashboard-")));
  const rootDir = join(directory, "root");
  const runsDir = join(directory, "runs");
  mkdirSync(rootDir, { recursive: true });
  for (const suite of SUITES) {
    const engines = suite.engines === undefined ? [] : ["--engines", suite.engines];
    await cli(runsDir, ["run", suiteFile(suite.name), "--root", suite.root, ...engines]);
    await cli(runsDir, ["compare", suite.name, "--root", suite.root]);
  }
  const policy = loadPolicy();
  const baselineOf = (name: string, judgedBy: Policy = policy): Baseline =>
    buildBaseline(readManifest(runsDir, name), readComparisons(runsDir, name), judgedBy);
  for (const name of ["fake-pair", "fake-group"]) writeBaseline(rootDir, name, baselineOf(name));
  writeBaseline(rootDir, "policy-moved", baselineOf("fake-3-engines-ts", { ...policy, version: policy.version + 1 }));
  const pair = baselineOf("fake-pair");
  writeBaseline(rootDir, "case-moved", {
    ...pair,
    runs: pair.runs.map((run, index) => (index === 0 ? { ...run, caseId: "0".repeat(64) } : run)),
  });
  writeBaseline(rootDir, "engine-moved", {
    ...pair,
    engines: pair.engines.map((engine) =>
      engine.id === "fake-b" ? { ...engine, fingerprint: "f".repeat(64) } : engine,
    ),
  });
  writeBaseline(rootDir, "orphan", { ...pair, suite: { ...pair.suite, name: "orphan" } });
  // A rung of two requests, one PASS and one FAIL: a pair with two verdict counts.
  writeBaseline(rootDir, "two-requests", {
    ...pair,
    runs: pair.runs.map((run) => ({
      ...run,
      rungs: run.rungs.map((rung) => ({
        ...rung,
        requests: 2,
        pairs: rung.pairs.map((each) => ({
          ...each,
          verdicts: [
            { verdict: "PASS" as const, count: 1 },
            { verdict: "FAIL" as const, count: 1 },
          ],
        })),
      })),
    })),
  });
  writeBaseline(rootDir, "catalog", {
    ...pair,
    contract: CONTRACT_VERSION_1_6,
    suite: { ...pair.suite, name: "catalog" },
    runs: pair.runs.map((run) => ({ ...run, features: [] })),
  });
  writeFileSync(join(rootDir, "baselines", "broken.json"), "{}\n");

  // A run directory whose name needs escaping, and one whose comparison file is not JSON.
  cpSync(join(runsDir, "fake-pair"), join(runsDir, ODD_NAME), { recursive: true });
  mkdirSync(join(runsDir, "corrupt"));
  cpSync(join(runsDir, "fake-pair", MANIFEST_FILE), join(runsDir, "corrupt", MANIFEST_FILE));
  writeFileSync(join(runsDir, "corrupt", COMPARISONS_FILE), "{ not json\n");

  // The R5 stand-ins, judged by a policy of their own: an MTF baseline and the run it is of.
  const mtfRootDir = join(directory, "mtf-root");
  const mtfRunsDir = join(directory, "mtf-runs");
  const mtfPolicyFile = join(directory, "r5-policy.json");
  writeFileSync(mtfPolicyFile, `${canonicalJson(MTF_FIXTURE_POLICY)}\n`);
  const cycle = await r5Cycle(mtfRunsDir, MTF_FIXTURE_POLICY);
  writeFileSync(join(mtfRunsDir, "r5-stand-ins", COMPARISONS_FILE), comparisonFileText(cycle.comparisons));
  writeBaseline(
    mtfRootDir,
    "r5-stand-ins.mtf",
    buildBaseline(cycle.manifest, cycle.comparisons, MTF_FIXTURE_POLICY, MTF_BASELINE),
  );
  // The R5g stand-ins beside them: a field of optiland's without curves (NaN at every frequency).
  const geometric = await r5gCycle(mtfRunsDir, MTF_FIXTURE_POLICY);
  writeFileSync(join(mtfRunsDir, "r5g-stand-ins", COMPARISONS_FILE), comparisonFileText(geometric.comparisons));
  // A first field off the axis, and a later step that is an error: the comparison judges optiland's first answer.
  const reordered = await reorderedCycle(mtfRunsDir, MTF_FIXTURE_POLICY);
  writeFileSync(join(mtfRunsDir, REORDERED_SUITE, COMPARISONS_FILE), comparisonFileText(reordered));

  // The rays of ref and its two copies, judged by a policy whose R0 blocks nothing.
  const raysRootDir = join(directory, "rays-root");
  const raysRunsDir = join(directory, "rays-runs");
  const raysPolicyFile = join(directory, "rays-policy.json");
  mkdirSync(raysRootDir, { recursive: true });
  const raysPolicy = unblockingPolicy();
  writeFileSync(raysPolicyFile, `${canonicalJson(raysPolicy)}\n`);
  const rays = await raysCycle(raysRunsDir, raysPolicy);
  writeFileSync(join(raysRunsDir, RAYS_SUITE, COMPARISONS_FILE), comparisonFileText(rays));

  return {
    directory,
    rootDir,
    runsDir,
    mtfRootDir,
    mtfRunsDir,
    mtfPolicyFile,
    raysRootDir,
    raysRunsDir,
    raysPolicyFile,
    suites: SUITES.map((suite) => suite.name),
    oddName: ODD_NAME,
    corrupt: "corrupt",
    remove: () => rmSync(directory, { recursive: true, force: true }),
  };
}

/** Every file and directory under `directory`, with the size and modification time of each file: a snapshot. */
export function treeOf(directory: string): string[] {
  const out: string[] = [];
  const walk = (at: string, relative: string): void => {
    for (const entry of readdirSync(at, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const path = join(at, entry.name);
      const name = `${relative}/${entry.name}`;
      if (entry.isDirectory()) {
        out.push(`${name}/`);
        walk(path, name);
      } else {
        const stats = statSync(path);
        out.push(`${name} ${stats.size} ${stats.mtimeMs}`);
      }
    }
  };
  walk(directory, "");
  return out;
}

/** An RFC 6901 pointer resolved by hand: the test's own reader, not the dashboard's. */
export function valueAtPointer(document: unknown, pointer: string): { found: boolean; value?: unknown } {
  if (pointer === "") return { found: true, value: document };
  let at: unknown = document;
  for (const raw of pointer.slice(1).split("/")) {
    const token = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(at)) {
      const index = Number(token);
      if (!/^\d+$/.test(token) || index >= at.length) return { found: false };
      at = at[index];
    } else if (at !== null && typeof at === "object" && Object.prototype.hasOwnProperty.call(at, token)) {
      at = (at as Record<string, unknown>)[token];
    } else return { found: false };
  }
  return { found: true, value: at };
}

/** Where a document of a view lies on disk. */
export interface DocumentPlaces {
  readonly rootDir: string;
  readonly runsDir: string;
  readonly policyFile: string;
}

/** The document a figure names, read and parsed from its file on disk by the test. */
export function documentFromDisk(places: DocumentPlaces, document: DocumentName): unknown {
  const colon = document.indexOf(":");
  const [kind, name] = [document.slice(0, colon), document.slice(colon + 1)];
  const file =
    kind === "manifest"
      ? join(places.runsDir, name, MANIFEST_FILE)
      : kind === "comparisons"
        ? join(places.runsDir, name, COMPARISONS_FILE)
        : kind === "baseline"
          ? join(places.rootDir, "baselines", `${name}.json`)
          : kind === "policy"
            ? places.policyFile
            : null;
  if (kind === "store") {
    // A store entry: the gzip file where there is one, else the legacy plain one.
    const gzip = join(places.runsDir, "store", `${name}.json.gz`);
    const text = existsSync(gzip)
      ? gunzipSync(readFileSync(gzip)).toString("utf8")
      : readFileSync(join(places.runsDir, "store", `${name}.json`), "utf8");
    return JSON.parse(text);
  }
  if (file === null) throw new Error(`a document the test cannot read: ${document}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

/** What a walk of a view found: its figures, curves, derived numbers and counts, each with its path in the view. */
export interface Walked {
  readonly figures: { readonly path: string; readonly figure: Figure }[];
  readonly curves: { readonly path: string; readonly curve: Curve }[];
  readonly derived: { readonly path: string; readonly derived: Derived }[];
  readonly counts: Map<string, number>;
  /** Numbers that are none of those: each a mistake of the view. */
  readonly strays: string[];
}

/**
 * Walks a view model: every number must be inside a Figure, a Curve or a Derived, or be a count under a key of
 * `COUNT_KEYS`. Paths are JSON pointers into the view.
 */
export function walkView(view: unknown): Walked {
  const walked: Walked = { figures: [], curves: [], derived: [], counts: new Map(), strays: [] };
  const visit = (value: unknown, path: string, key: string | null): void => {
    if (isFigure(value)) return void walked.figures.push({ path, figure: value });
    if (isDerived(value)) return void walked.derived.push({ path, derived: value });
    if (isCurve(value)) return void walked.curves.push({ path, curve: value });
    if (typeof value === "number") {
      if (key !== null && COUNT_KEYS.includes(key)) walked.counts.set(path, value);
      else walked.strays.push(`${path} = ${value}`);
      return;
    }
    if (Array.isArray(value)) return value.forEach((each, index) => visit(each, `${path}/${index}`, null));
    if (value !== null && typeof value === "object") {
      for (const [member, each] of Object.entries(value)) visit(each, `${path}/${member}`, member);
    }
  };
  visit(view, "", null);
  return walked;
}

/** What a request to a dashboard got back. */
export interface Fetched {
  readonly status: number;
  readonly headers: Record<string, string | string[] | undefined>;
  readonly body: string;
}

/**
 * Asks a dashboard on 127.0.0.1 for `path` by `method`, with the Host header given (its own unless one is), any
 * other headers and a body.
 */
export function fetchFrom(
  port: number,
  path: string,
  options: {
    readonly method?: string;
    readonly host?: string;
    readonly address?: string;
    readonly headers?: Readonly<Record<string, string>>;
    readonly body?: string;
  } = {},
): Promise<Fetched> {
  return new Promise((resolve, reject) => {
    const asked = request(
      {
        host: options.address ?? "127.0.0.1",
        port,
        path,
        method: options.method ?? "GET",
        headers: { host: options.host ?? `127.0.0.1:${port}`, ...options.headers },
        agent: false,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode ?? 0,
            headers: response.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    asked.on("error", reject);
    asked.end(options.body);
  });
}

/** The text of every <title> of a page or chart (its tooltips), entities decoded: what the wording lint reads too. */
export function titleTexts(html: string): string[] {
  return [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map(([, text]) =>
    text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&"),
  );
}

/** The visible text of a page, one block per text node, entities decoded: what the wording lint reads. */
export function visibleText(html: string): string {
  const withoutStyle = html.replace(/<style>[\s\S]*?<\/style>/g, "").replace(/<title>[\s\S]*?<\/title>/g, "");
  return withoutStyle
    .split(/<[^>]*>/)
    .map((text) =>
      text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .trim(),
    )
    .filter((text) => text !== "")
    .join("\n\n");
}
