// The dashboard's HTTP server (`lvrtc serve`): the pages and their JSON twins over runs, baselines and lenses (Stage
// 8.4: `/lens/<lensKey>`, whose choice of curves is in the query of its address), on 127.0.0.1 only. A request whose
// Host is not this server's own is refused (403), which also defeats DNS rebinding; pages answer GET and HEAD only,
// and the actions of run control (`/control/<action>`, Stage 8.3) POST only (405 otherwise); a path segment is looked
// up among the names the server listed itself (404 otherwise), never joined into a path. No page writes anything; an
// action writes only through the child `lvrtc` command it starts (`control.ts`).
import { createServer } from "node:http";
import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { AddressInfo, Socket } from "node:net";

import type { ComparisonFile } from "../compare/comparisonFile.ts";
import type { Baseline } from "../contract/baseline.ts";
import type { RunManifest } from "../core/manifest.ts";
import { sectionSetGroups } from "../report/model.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import { DASHBOARD_TEXT } from "../report/wording.ts";
import { caseDocument } from "./figure.ts";
import type { DocumentName } from "./figure.ts";
import {
  renderActionRefusal,
  renderBaseline,
  renderBaselineRun,
  renderControl,
  renderIndex,
  renderJob,
  renderCompare,
  renderLens,
  renderRefusal,
  renderRun,
  renderRunPart,
  renderSection,
} from "./html.ts";
import { chartsReadStore, requestStoreKeys } from "./chartViews.ts";
import { CONTROL_ACTIONS, FORM_BODY_BYTES, createController, headerRefusal } from "./control.ts";
import type { ControlAction, ControlOptions, Controller, Refusal } from "./control.ts";
import { askEngines } from "./identity.ts";
import type { AskedEngines, EngineDescribeRunner } from "./identity.ts";
import { LENS_KEY_PATTERN, buildLensView, indexLenses, lensSelection, lensSummaries, selectionLabel } from "./lens.ts";
import type { LensIndex, LensView } from "./lens.ts";
import {
  COMPARE_TABS,
  buildCompareView,
  compareSummary,
  hasCounterpartComparison,
  indexBaseline,
  indexComparisons,
} from "./compare.ts";
import type { CompareBaseline, CompareDirectory, CompareInputs, CompareView } from "./compare.ts";
import { createSources } from "./sources.ts";
import type { DashboardSources, Loaded } from "./sources.ts";
import type { BaselineRunView, BaselineView, IndexView, RunPartView, RunView, SectionView } from "./views.ts";
import {
  RUN_PAGE_REQUESTS,
  baselineSummary,
  buildBaselineRunView,
  buildBaselineView,
  buildIndexView,
  buildRunPartView,
  buildRunView,
  buildSectionView,
  runInputProblems,
  runReport,
  runSummary,
} from "./views.ts";

/** The port `lvrtc serve` listens on unless `--port` names another. */
export const DEFAULT_PORT = 8077;
/** The one address the dashboard listens on. */
export const DASHBOARD_HOST = "127.0.0.1";

/** What a dashboard is started with. */
export interface DashboardOptions {
  /** The configuration root: its `baselines/` are read. */
  readonly rootDir: string;
  /** The runs directory of the configuration: its run directories are read. */
  readonly runsDir: string;
  /** The policy at hand; `policy/rungs.v1.json` of this repository unless a test names another. */
  readonly policyFile?: string;
  /** The port; 0 picks a free one. `DEFAULT_PORT` when left out. */
  readonly port?: number;
  /**
   * How the engines of the baselines are asked who they are, once, after the server listens; without a runner they
   * are not asked (`--no-ask`), and each baseline is judged against the last run of its suite.
   */
  readonly runner?: EngineDescribeRunner;
  /** How many requests a run page shows itself (`RUN_PAGE_REQUESTS`); a test lowers it to see a split page. */
  readonly runPageRequests?: number;
  /** What is read; made from the root, the runs directory and the policy file unless a test gives its own. */
  readonly sources?: DashboardSources;
  /**
   * What run control may start: the suites, the engines and the file-exchange engines it is held to (the CLI lists
   * `<root>/suites/*.json` and the configuration's engines). When left out, run control starts and collects nothing,
   * and its page says so.
   */
  readonly control?: ControlOptions;
}

/** A dashboard that is listening. */
export interface Dashboard {
  readonly port: number;
  /** `http://127.0.0.1:<port>/`. */
  readonly url: string;
  /** What became of asking the engines so far. */
  asked(): AskedEngines;
  /** Resolves once the engines answered, could not be asked, or were not to be asked. */
  readonly answered: Promise<AskedEngines>;
  /**
   * Stops listening, ends every open connection, an asking child and a running job's child (SIGTERM, then SIGKILL
   * after a grace period), and resolves once the server is closed and the child has exited.
   */
  close(): Promise<void>;
}

/** An answer: a status, a type and a body. */
interface Answer {
  readonly status: number;
  readonly type: "html" | "json" | "text";
  readonly body: string;
  readonly headers?: Readonly<Record<string, string>>;
}

const TYPES: Readonly<Record<Answer["type"], string>> = {
  html: "text/html; charset=utf-8",
  json: "application/json; charset=utf-8",
  text: "text/plain; charset=utf-8",
};

/** A page's JSON twin: its view model as canonical JSON and a newline. */
function json(view: unknown): string {
  return `${canonicalJson(view)}\n`;
}

/** The decoded segments of a request's path, or null for one that cannot be read as a path. */
export function pathSegments(url: string): string[] | null {
  const path = url.split(/[?#]/, 1)[0];
  if (!path.startsWith("/")) return null;
  if (path === "/") return [];
  try {
    return path
      .slice(1)
      .split("/")
      .map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }
}

/** A place in a list, as a route names it: digits without a leading zero. */
const PLACE = /^(0|[1-9][0-9]{0,8})$/;

/** The engine ids of every baseline the root has, sorted, each once. */
export function baselineEngineIds(sources: DashboardSources): string[] {
  const ids = new Set<string>();
  for (const stem of sources.baselineStems()) {
    const loaded = sources.baseline(stem);
    if (loaded.state === "ok") for (const engine of loaded.value.engines) ids.add(engine.id);
  }
  return [...ids].sort();
}

/** The view models of the dashboard over its sources: what the routes serve, before any page is rendered. */
export interface DashboardViews {
  /** The policy documents every view of the policy at hand is of: one name. */
  policyDocuments(): DocumentName[];
  /** A label of what the engines said, for the views that depend on it. */
  askedLabel(): string;
  index(): IndexView;
  run(name: string): RunView;
  /** Null for a place the run's manifest does not have. */
  runPart(name: string, place: number): RunPartView | null;
  /** Null for a run that was not compared or a section it does not have. */
  section(name: string, index: number): SectionView | null;
  /**
   * The store keys the manifest names for the jobs of a section's request: the only store entries its page reads,
   * and which its page is kept by. Empty for a section the run does not have.
   */
  sectionStoreKeys(name: string, index: number): string[];
  baseline(stem: string): BaselineView;
  /** Null for a place the baseline does not have, or a baseline that cannot be read. */
  baselineRun(stem: string, place: number): BaselineRunView | null;
  /** The lenses the cases of the run directories name, with their runs (Stage 8.4). */
  lensIndex(): LensIndex;
  /** The page of a lens, with the choice of curves its address's query makes (what follows `?`, without it). */
  lens(key: string, query: string): LensView;
  /**
   * The documents a lens page is of: the policy, every run directory's manifest and comparisons, the cases of the
   * lens's runs and the store entries the manifests name for their mtf.native jobs, and no other entry.
   */
  lensDocuments(key: string): DocumentName[];
  /**
   * The "LV vs optiland" page of a lens (Stage 8.5), with the condition its address's query chooses; with `tab`, that
   * tab's card and details. Null for a tab that is none of `COMPARE_TABS`.
   */
  compare(key: string, query: string, tab: string | null): CompareView | null;
  /**
   * The documents a compare page is of: the lens page's, the baselines, and the store entries the manifests name for
   * the jobs of the lens's runs in the recorded rungs of the cards.
   */
  compareDocuments(key: string): DocumentName[];
}

/**
 * The view models over `sources` and what the engines said (`asked`, read at every call). A summary, a report model
 * and input problems are kept while the files they are of are unchanged; a run's full report model is built only for
 * its own pages.
 */
export function createViews(
  sources: DashboardSources,
  asked: () => AskedEngines,
  options: { readonly runPageRequests?: number } = {},
): DashboardViews {
  const policyDocuments = (): DocumentName[] => {
    const policy = sources.policy();
    return [`policy:${policy.state === "ok" ? policy.value.name : "at-hand"}`];
  };
  const askedLabel = (): string => {
    const now = asked();
    return now.state === "asked" ? `asked:${canonicalJson(now.engines)}` : now.state;
  };
  const runDocuments = (name: string): DocumentName[] => [
    `manifest:${name}`,
    `comparisons:${name}`,
    ...policyDocuments(),
  ];
  const lastRunOf = (suite: string): Loaded<RunManifest> =>
    sources.runNames().includes(suite) ? sources.manifest(suite) : { state: "missing" };
  const inputProblemsOf = (name: string): readonly string[] =>
    sources.derived("input-problems", runDocuments(name), () =>
      runInputProblems(sources.manifest(name), sources.comparisons(name), sources.policy()),
    );
  const reportOf = (name: string, manifest: RunManifest) =>
    sources.derived("report", runDocuments(name), () =>
      runReport(manifest, sources.comparisons(name), sources.policy()),
    );
  const lensIndex = (): LensIndex =>
    sources.derived(
      "lens-index",
      sources.runNames().map((name): DocumentName => `manifest:${name}`),
      () =>
        indexLenses(
          sources.runNames().map((suite) => ({ suite, manifest: sources.manifest(suite) })),
          (suite, caseId) => sources.caseSummary(suite, caseId),
        ),
    );
  /** The lens each run of a run directory is of, by its case: what its run page links to. */
  const lensOf =
    (suite: string) =>
    (caseId: string): string | null => {
      const loaded = sources.caseSummary(suite, caseId);
      return loaded.state === "ok" ? (loaded.value.label.lensKey ?? null) : null;
    };
  const baselineInputs = (stem: string) => {
    const loaded: Loaded<Baseline> = sources.baseline(stem);
    const suite = loaded.state === "ok" ? loaded.value.suite.name : null;
    const lastRun: Loaded<RunManifest> = suite === null ? { state: "missing" } : lastRunOf(suite);
    return { loaded, lastRun };
  };

  /** A run directory as the compare pages read it, indexed once per file (Stage 8.5). */
  const compareDirectory = (suite: string): CompareDirectory | null => {
    const manifest = sources.manifest(suite);
    if (manifest.state !== "ok") return null;
    const comparisons = sources.comparisons(suite);
    const file = comparisons.state === "ok" ? comparisons.value : null;
    const indexed = sources.derived("compare-index", [`comparisons:${suite}`], () =>
      file === null ? null : indexComparisons(file, sectionSetGroups(file.comparisons)),
    );
    return {
      suite,
      manifest: manifest.value,
      comparisons: file,
      setsOfCase: indexed?.setsOfCase ?? new Map(),
      sectionOfSet: indexed?.sectionOfSet ?? new Map(),
    };
  };
  const compareBaselines = (): CompareBaseline[] =>
    sources.baselineStems().flatMap((stem) => {
      const loaded = sources.baseline(stem);
      if (loaded.state !== "ok") return [];
      const runsOfCase = sources.derived("compare-baseline", [`baseline:${stem}`], () => indexBaseline(loaded.value));
      return [{ stem, baseline: loaded.value, runsOfCase }];
    });
  const compareInputs = (key: string, query: string): CompareInputs => {
    const policy = sources.policy();
    return {
      key,
      runs: (lensIndex().lenses.get(key) ?? []).map((ref) => ({
        ref,
        caseSummary: sources.caseSummary(ref.suite, ref.caseId),
      })),
      directory: compareDirectory,
      baselines: compareBaselines(),
      policy: policy.state === "ok" ? { document: `policy:${policy.value.name}`, policy: policy.value.policy } : null,
      stored: (storeKey) => sources.storeEntry(storeKey),
      query,
      sectionCharts: (suite, section) => sectionView(suite, section)?.charts ?? null,
    };
  };
  const recordedRungs = new Set(COMPARE_TABS.flatMap((tab) => tab.recorded));

  const sectionView = (name: string, index: number): SectionView | null => {
    const manifest = sources.manifest(name);
    const comparisons: Loaded<ComparisonFile> = sources.comparisons(name);
    if (manifest.state !== "ok" || comparisons.state !== "ok") return null;
    const report = reportOf(name, manifest.value);
    return buildSectionView(
      name,
      index,
      comparisons.value,
      sources.policy(),
      report,
      inputProblemsOf(name),
      manifest.value,
      (key) => sources.storeEntry(key),
    );
  };
  return {
    policyDocuments,
    askedLabel,
    index: () => {
      const policy = sources.policy();
      const runs = sources
        .runNames()
        .map((name) =>
          sources.derived("run-summary", runDocuments(name), () =>
            runSummary(name, sources.manifest(name), sources.comparisons(name), inputProblemsOf(name)),
          ),
        );
      const baselines = sources.baselineStems().map((stem) => {
        const { loaded, lastRun } = baselineInputs(stem);
        const documents: DocumentName[] = [`baseline:${stem}`, ...policyDocuments()];
        if (loaded.state === "ok") documents.push(`manifest:${loaded.value.suite.name}`);
        return sources.derived(`baseline-summary:${askedLabel()}`, documents, () =>
          baselineSummary(stem, loaded, policy, asked(), lastRun),
        );
      });
      const index = lensIndex();
      const lenses = {
        lenses: lensSummaries(index, (suite, caseId) => sources.caseSummary(suite, caseId)),
        problems: index.problems,
      };
      const compared = [...index.lenses.keys()].flatMap((key) => {
        const inputs = compareInputs(key, "");
        return hasCounterpartComparison(inputs) ? [compareSummary(inputs)] : [];
      });
      return buildIndexView(policy, asked(), runs, baselines, lenses, compared);
    },
    run: (name) => {
      const manifest = sources.manifest(name);
      const report = manifest.state === "ok" ? reportOf(name, manifest.value) : null;
      const requests = options.runPageRequests ?? RUN_PAGE_REQUESTS;
      const comparisons = sources.comparisons(name);
      return buildRunView(name, manifest, comparisons, report, inputProblemsOf(name), requests, lensOf(name));
    },
    runPart: (name, place) => {
      const manifest = sources.manifest(name);
      if (manifest.state !== "ok") return null;
      const report = reportOf(name, manifest.value);
      return buildRunPartView(name, place, manifest.value, sources.comparisons(name), report, lensOf(name));
    },
    section: (name, index) => sectionView(name, index),
    sectionStoreKeys: (name, index) => {
      const manifest = sources.manifest(name);
      const comparisons: Loaded<ComparisonFile> = sources.comparisons(name);
      if (manifest.state !== "ok" || comparisons.state !== "ok") return [];
      const sets = sources.derived("section-groups", [`comparisons:${name}`], () =>
        sectionSetGroups(comparisons.value.comparisons),
      );
      const first = sets[index]?.[0];
      if (first === undefined) return [];
      const { run, rung, quantity, requestId } = comparisons.value.comparisons[first];
      return chartsReadStore(quantity, rung) ? requestStoreKeys(manifest.value, run, rung, requestId) : [];
    },
    baseline: (stem) => {
      const { loaded, lastRun } = baselineInputs(stem);
      return buildBaselineView(stem, loaded, sources.policy(), asked(), lastRun);
    },
    baselineRun: (stem, place) => {
      const { loaded, lastRun } = baselineInputs(stem);
      return buildBaselineRunView(stem, place, loaded, sources.policy(), asked(), lastRun);
    },
    lensIndex,
    lens: (key, query) => {
      const runs = (lensIndex().lenses.get(key) ?? []).flatMap((ref) => {
        const manifest = sources.manifest(ref.suite);
        if (manifest.state !== "ok") return [];
        const comparisons = sources.comparisons(ref.suite);
        const state = comparisons.state === "missing" ? ("none" as const) : comparisons.state;
        return [
          {
            ref,
            manifest: manifest.value,
            caseSummary: sources.caseSummary(ref.suite, ref.caseId),
            comparisons: state,
          },
        ];
      });
      return buildLensView({
        key,
        runs,
        selection: lensSelection(query),
        stored: (storeKey) => sources.storeEntry(storeKey),
        // The section page of the reference's request, as `/run/<suite>/section/<n>` draws it (Stage 8.2).
        sectionCharts: (suite, run, rung, requestId) => {
          const comparisons = sources.comparisons(suite);
          if (comparisons.state !== "ok") return null;
          const sets = comparisons.value.comparisons;
          const groups = sources.derived("section-groups", [`comparisons:${suite}`], () => sectionSetGroups(sets));
          const section = groups.findIndex((group) => {
            const first = sets[group[0]];
            return first.run === run && first.rung === rung && first.requestId === requestId;
          });
          const view = section < 0 ? null : sectionView(suite, section);
          return view === null ? null : { section, charts: view.charts };
        },
      });
    },
    compare: (key, query, tab) => {
      if (tab !== null && !COMPARE_TABS.some((each) => each.tab === tab)) return null;
      return buildCompareView(compareInputs(key, query), tab);
    },
    compareDocuments: (key) => {
      const refs = lensIndex().lenses.get(key) ?? [];
      const stores = refs.flatMap((ref) => {
        const manifest = sources.manifest(ref.suite);
        if (manifest.state !== "ok") return [];
        return manifest.value.jobs.flatMap((job): DocumentName[] =>
          job.run === ref.run && recordedRungs.has(job.rung) && job.storeKey !== null ? [`store:${job.storeKey}`] : [],
        );
      });
      return [
        ...policyDocuments(),
        ...sources.runNames().flatMap((name): DocumentName[] => [`manifest:${name}`, `comparisons:${name}`]),
        ...sources.baselineStems().map((stem): DocumentName => `baseline:${stem}`),
        ...refs.map((ref) => caseDocument(ref.suite, ref.caseId)),
        ...new Set(stores),
      ];
    },
    lensDocuments: (key) => {
      const refs = lensIndex().lenses.get(key) ?? [];
      const stores = refs.flatMap((ref) => {
        const manifest = sources.manifest(ref.suite);
        if (manifest.state !== "ok") return [];
        return manifest.value.jobs.flatMap((job): DocumentName[] =>
          job.run === ref.run && job.quantity === MTF_NATIVE && job.storeKey !== null ? [`store:${job.storeKey}`] : [],
        );
      });
      return [
        ...policyDocuments(),
        ...sources.runNames().flatMap((name): DocumentName[] => [`manifest:${name}`, `comparisons:${name}`]),
        ...refs.map((ref) => caseDocument(ref.suite, ref.caseId)),
        ...new Set(stores),
      ];
    },
  };
}

/** What a router is told beyond its sources (Stage 8.4): lens keys of its own, and the form that runs a lens. */
export interface RouterOptions {
  readonly runPageRequests?: number;
  /** Lens keys with a page though no run of them is in the runs directory: those run control started. */
  readonly lensKeys?: () => readonly string[];
  /** What a lens page's form to run the lens carries; without it a lens page has no such form. */
  readonly lensForm?: { readonly token: string; readonly configured: boolean };
}

/** What answers a request: every route of the dashboard, over `sources` and what the engines said. */
export function createRouter(
  sources: DashboardSources,
  asked: () => AskedEngines,
  options: RouterOptions = {},
): (url: string) => Answer {
  const views = createViews(sources, asked, options);
  const { policyDocuments } = views;

  /** A page and its twin, each rendered once while the documents it is of are unchanged. */
  const answer = <V>(
    api: boolean,
    label: string,
    documents: readonly DocumentName[],
    view: () => V | null,
    render: (view: V) => string,
  ): Answer => {
    const built = sources.derived(`view:${label}`, documents, view);
    if (built === null) return notFound(api);
    const body = sources.derived(`${api ? "json" : "html"}:${label}`, documents, () =>
      api ? json(built) : render(built),
    );
    return { status: 200, type: api ? "json" : "html", body };
  };
  const notFound = (api: boolean): Answer =>
    api
      ? { status: 404, type: "json", body: json({ error: "not found" }) }
      : { status: 404, type: "html", body: renderRefusal(404, "Not found") };

  return (url) => {
    const segments = pathSegments(url);
    if (segments === null) return notFound(false);
    const api = segments[0] === "api";
    const route = api ? segments.slice(1) : segments;
    const askedLabel = views.askedLabel();
    if (api ? route.length === 1 && route[0] === "index" : route.length === 0) {
      const documents: DocumentName[] = [
        ...policyDocuments(),
        ...sources.runNames().flatMap((name): DocumentName[] => [`manifest:${name}`, `comparisons:${name}`]),
        ...sources.baselineStems().map((stem): DocumentName => `baseline:${stem}`),
      ];
      // The listing itself is in the label: a run directory or a baseline that comes or goes is another index.
      const label = `index:${askedLabel}:${JSON.stringify([sources.runNames(), sources.baselineStems()])}`;
      return answer(api, label, documents, views.index, renderIndex);
    }
    const [kind, name, sub, number] = route;
    if (kind === "run" && name !== undefined && sources.runNames().includes(name)) {
      const documents: DocumentName[] = [`manifest:${name}`, `comparisons:${name}`, ...policyDocuments()];
      if (route.length === 2) return answer(api, `run:${name}`, documents, () => views.run(name), renderRun);
      if (route.length === 4 && number !== undefined && PLACE.test(number)) {
        const place = Number(number);
        if (sub === "section") {
          // A section page is of the store entries of its request too: an entry that comes, goes or changes is
          // another page.
          const keys = views.sectionStoreKeys(name, place);
          const withStore: DocumentName[] = [...documents, ...keys.map((key): DocumentName => `store:${key}`)];
          return answer(api, `section:${name}:${place}`, withStore, () => views.section(name, place), renderSection);
        }
        if (sub === "run") {
          return answer(api, `run-part:${name}:${place}`, documents, () => views.runPart(name, place), renderRunPart);
        }
      }
      return notFound(api);
    }
    if (kind === "lens" && name !== undefined && route.length === 2) {
      // Looked up among the lenses of the run directories and of run control's jobs, never joined into a path.
      const known =
        LENS_KEY_PATTERN.test(name) &&
        (views.lensIndex().lenses.has(name) || (options.lensKeys?.() ?? []).includes(name));
      if (!known) return notFound(api);
      const query = url.includes("?") ? url.slice(url.indexOf("?") + 1).split("#", 1)[0] : "";
      const label = `lens:${name}:${selectionLabel(lensSelection(query))}`;
      const page = answer(
        api,
        label,
        views.lensDocuments(name),
        () => views.lens(name, query),
        (view) => renderLens(view, options.lensForm ?? null),
      );
      return api ? page : { ...page, headers: FORM_PAGE_HEADERS };
    }
    if (kind === "compare" && name !== undefined && (route.length === 2 || route.length === 3)) {
      // As a lens page: the key looked up among the lenses of the run directories and of run control's jobs.
      const known =
        LENS_KEY_PATTERN.test(name) &&
        (views.lensIndex().lenses.has(name) || (options.lensKeys?.() ?? []).includes(name));
      const tab = route.length === 3 ? route[2] : null;
      if (!known || (tab !== null && !COMPARE_TABS.some((each) => each.tab === tab))) return notFound(api);
      const query = url.includes("?") ? url.slice(url.indexOf("?") + 1).split("#", 1)[0] : "";
      const params = new URLSearchParams(query);
      const normal = [...params].sort(([a, x], [b, y]) => (a !== b ? (a < b ? -1 : 1) : x < y ? -1 : x > y ? 1 : 0));
      const label = `compare:${name}:${tab ?? ""}:${JSON.stringify(normal)}`;
      const page = answer(
        api,
        label,
        views.compareDocuments(name),
        () => views.compare(name, query, tab),
        (view) => renderCompare(view, options.lensForm ?? null),
      );
      return api ? page : { ...page, headers: FORM_PAGE_HEADERS };
    }
    if (kind === "baseline" && name !== undefined && sources.baselineStems().includes(name)) {
      const loaded = sources.baseline(name);
      const documents: DocumentName[] = [`baseline:${name}`, ...policyDocuments()];
      if (loaded.state === "ok") documents.push(`manifest:${loaded.value.suite.name}`);
      if (route.length === 2) {
        return answer(api, `baseline:${askedLabel}:${name}`, documents, () => views.baseline(name), renderBaseline);
      }
      if (route.length === 4 && sub === "run" && number !== undefined && PLACE.test(number)) {
        const place = Number(number);
        const label = `baseline-run:${askedLabel}:${name}:${place}`;
        return answer(api, label, documents, () => views.baselineRun(name, place), renderBaselineRun);
      }
    }
    return notFound(api);
  };
}

/** The headers of a page with forms: they post to this origin only, and send it as their Origin. */
const FORM_PAGE_HEADERS: Readonly<Record<string, string>> = {
  "content-security-policy":
    "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "referrer-policy": "same-origin",
};

/** The action a path names, `/control/<action>`; null for any other path. */
function controlAction(segments: readonly string[] | null): ControlAction | null {
  if (segments === null || segments.length !== 2 || segments[0] !== "control") return null;
  return (CONTROL_ACTIONS as readonly string[]).includes(segments[1]) ? (segments[1] as ControlAction) : null;
}

/** The body of a request, or null once it is longer than `limit` bytes (the rest is not kept). */
function readBody(request: IncomingMessage, limit: number): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let done = false;
    request.on("data", (chunk: Buffer) => {
      if (done) return;
      size += chunk.length;
      if (size > limit) {
        done = true;
        resolve(null);
      } else chunks.push(chunk);
    });
    request.on("end", () => {
      if (!done) resolve(Buffer.concat(chunks).toString("utf8"));
      done = true;
    });
    request.on("error", reject);
  });
}

function refusalAnswer(refusal: Refusal): Answer {
  return {
    status: refusal.status,
    type: "html",
    body: renderActionRefusal(refusal.status, refusal.reason),
    ...(refusal.status === 413 ? { headers: { connection: "close" } } : {}),
  };
}

/** An action: its headers, its size and its token checked, then taken by run control. */
async function takeAction(
  controller: Controller,
  action: ControlAction,
  request: IncomingMessage,
  port: number,
): Promise<Answer> {
  const refused = headerRefusal(request.headers, port);
  if (refused !== null) return refusalAnswer(refused);
  const tooLarge: Refusal = { status: 413, reason: DASHBOARD_TEXT.control.refusedSize(String(FORM_BODY_BYTES / 1024)) };
  const declared = request.headers["content-length"];
  if (declared !== undefined && !(Number(declared) <= FORM_BODY_BYTES)) return refusalAnswer(tooLarge);
  const body = await readBody(request, FORM_BODY_BYTES);
  if (body === null) return refusalAnswer(tooLarge);
  const outcome = controller.act(action, body);
  if ("location" in outcome) {
    return { status: 303, type: "text", body: "see other\n", headers: { location: outcome.location } };
  }
  return refusalAnswer(outcome);
}

/** The pages of run control and their twins: `/control`, `/control/job/<n>`; null for any other path. */
function controlPage(controller: Controller, segments: readonly string[] | null): Answer | null {
  if (segments === null) return null;
  const api = segments[0] === "api";
  const route = api ? segments.slice(1) : segments;
  if (route[0] !== "control") return null;
  if (route.length === 1) {
    const view = controller.controlView();
    return api
      ? { status: 200, type: "json", body: json(view) }
      : { status: 200, type: "html", body: renderControl(view, controller.token), headers: FORM_PAGE_HEADERS };
  }
  if (route.length === 3 && route[1] === "job" && PLACE.test(route[2]) && route[2] !== "0") {
    const view = controller.jobView(Number(route[2]));
    if (view !== null) {
      // A plan of store maintenance carries the form that confirms it: the page of a form (Stage 8.4).
      return api
        ? { status: 200, type: "json", body: json(view) }
        : view.store === null
          ? { status: 200, type: "html", body: renderJob(view) }
          : { status: 200, type: "html", body: renderJob(view, controller.token), headers: FORM_PAGE_HEADERS };
    }
  }
  return api
    ? { status: 404, type: "json", body: json({ error: "not found" }) }
    : { status: 404, type: "html", body: renderRefusal(404, "Not found") };
}

function send(request: IncomingMessage, response: ServerResponse, answer: Answer): void {
  const body = Buffer.from(answer.body, "utf8");
  response.writeHead(answer.status, {
    "content-type": TYPES[answer.type],
    "content-length": String(body.length),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "content-security-policy":
      "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    ...answer.headers,
  });
  response.end(request.method === "HEAD" ? undefined : body);
}

/**
 * Starts the dashboard: listens on 127.0.0.1 at the port given (rejecting at once when it cannot), then, with a
 * runner, asks the engines of the baselines who they are, once, in the background. Until they answer, every page is
 * judged against the last run of each suite and says that the engines are being asked.
 */
export async function startDashboard(options: DashboardOptions): Promise<Dashboard> {
  const sources =
    options.sources ??
    createSources({ rootDir: options.rootDir, runsDir: options.runsDir, policyFile: options.policyFile });
  let asked: AskedEngines = options.runner === undefined ? { state: "not-asked" } : { state: "asking" };
  // The Host the server answers to: set in the listen callback, before any request can be served.
  let port = -1;
  const abort = new AbortController();
  const { runner } = options;
  /** Asks the engines of the baselines who they are, through the runner, and keeps what they said. */
  const ask = (asker: EngineDescribeRunner): Promise<AskedEngines> => {
    asked = { state: "asking" };
    return askEngines(asker, baselineEngineIds(sources), abort.signal).then((outcome) => {
      asked = abort.signal.aborted ? { state: "failed", problem: "the dashboard closed first" } : outcome;
      return asked;
    });
  };
  const controller = createController(
    {
      rootDir: options.rootDir,
      runsDir: options.runsDir,
      sources,
      asked: () => asked,
      askAgain: runner === undefined ? null : () => void ask(runner),
    },
    options.control,
  );
  const route = createRouter(sources, () => asked, {
    runPageRequests: options.runPageRequests,
    lensKeys: () => controller.lensKeys(),
    lensForm: { token: controller.token, configured: controller.configured },
  });

  const answerOf = async (request: IncomingMessage): Promise<Answer> => {
    const host = request.headers.host;
    if (host !== `${DASHBOARD_HOST}:${port}` && host !== `localhost:${port}`) {
      return { status: 403, type: "text", body: "forbidden: this dashboard answers its own host only\n" };
    }
    const url = request.url ?? "/";
    const segments = pathSegments(url);
    const action = controlAction(segments);
    if (action !== null) {
      if (request.method === "POST") return takeAction(controller, action, request, port);
      return {
        status: 405,
        type: "html",
        body: renderActionRefusal(405, DASHBOARD_TEXT.control.refusedMethod),
        headers: { allow: "POST" },
      };
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return { status: 405, type: "text", body: "method not allowed\n", headers: { allow: "GET, HEAD" } };
    }
    return controlPage(controller, segments) ?? route(url);
  };

  const server: Server = createServer((request, response) => {
    void answerOf(request)
      .catch((error: unknown): Answer => {
        // Never a stack trace to the client: what went wrong is for the console of whoever runs the server.
        process.stderr.write(
          `lvrtc serve: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
        );
        return { status: 500, type: "text", body: "internal error\n" };
      })
      .then((answer) => send(request, response, answer));
  });
  const sockets = new Set<Socket>();
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: DASHBOARD_HOST, port: options.port ?? DEFAULT_PORT, exclusive: true }, () => {
      port = (server.address() as AddressInfo).port;
      server.off("error", reject);
      resolve();
    });
  });

  const answered: Promise<AskedEngines> = runner === undefined ? Promise.resolve(asked) : ask(runner);
  return {
    port,
    url: `http://${DASHBOARD_HOST}:${port}/`,
    asked: () => asked,
    answered,
    close: async () => {
      abort.abort();
      await controller.close();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        for (const socket of sockets) socket.destroy();
      });
    },
  };
}
