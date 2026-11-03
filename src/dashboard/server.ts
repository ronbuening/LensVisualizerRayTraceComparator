// The dashboard's HTTP server (`lvrtc serve`): the pages and their JSON twins over runs and baselines, on
// 127.0.0.1 only. A request whose Host is not this server's own is refused (403), which also defeats DNS
// rebinding; only GET and HEAD are answered (405 otherwise); a path segment is looked up among the names the server
// listed itself (404 otherwise), never joined into a path. Nothing is written, and no directory is made.
import { createServer } from "node:http";
import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { AddressInfo, Socket } from "node:net";

import type { ComparisonFile } from "../compare/comparisonFile.ts";
import type { Baseline } from "../contract/baseline.ts";
import type { RunManifest } from "../core/manifest.ts";
import { sectionSetGroups } from "../report/model.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import type { DocumentName } from "./figure.ts";
import {
  renderBaseline,
  renderBaselineRun,
  renderIndex,
  renderRefusal,
  renderRun,
  renderRunPart,
  renderSection,
} from "./html.ts";
import { chartsReadStore, requestStoreKeys } from "./chartViews.ts";
import { askEngines } from "./identity.ts";
import type { AskedEngines, EngineDescribeRunner } from "./identity.ts";
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
  /** Stops listening, ends every open connection and an asking child, and resolves once the server is closed. */
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
  const baselineInputs = (stem: string) => {
    const loaded: Loaded<Baseline> = sources.baseline(stem);
    const suite = loaded.state === "ok" ? loaded.value.suite.name : null;
    const lastRun: Loaded<RunManifest> = suite === null ? { state: "missing" } : lastRunOf(suite);
    return { loaded, lastRun };
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
      return buildIndexView(policy, asked(), runs, baselines);
    },
    run: (name) => {
      const manifest = sources.manifest(name);
      const report = manifest.state === "ok" ? reportOf(name, manifest.value) : null;
      const requests = options.runPageRequests ?? RUN_PAGE_REQUESTS;
      return buildRunView(name, manifest, sources.comparisons(name), report, inputProblemsOf(name), requests);
    },
    runPart: (name, place) => {
      const manifest = sources.manifest(name);
      if (manifest.state !== "ok") return null;
      return buildRunPartView(name, place, manifest.value, sources.comparisons(name), reportOf(name, manifest.value));
    },
    section: (name, index) => {
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
    },
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
  };
}

/** What answers a request: every route of the dashboard, over `sources` and what the engines said. */
export function createRouter(
  sources: DashboardSources,
  asked: () => AskedEngines,
  options: { readonly runPageRequests?: number } = {},
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
  const route = createRouter(sources, () => asked, { runPageRequests: options.runPageRequests });
  // The Host the server answers to: set in the listen callback, before any request can be served.
  let port = -1;

  const server: Server = createServer((request, response) => {
    let answer: Answer;
    try {
      const host = request.headers.host;
      if (host !== `${DASHBOARD_HOST}:${port}` && host !== `localhost:${port}`) {
        answer = { status: 403, type: "text", body: "forbidden: this dashboard answers its own host only\n" };
      } else if (request.method !== "GET" && request.method !== "HEAD") {
        answer = { status: 405, type: "text", body: "method not allowed\n", headers: { allow: "GET, HEAD" } };
      } else answer = route(request.url ?? "/");
    } catch (error) {
      // Never a stack trace to the client: what went wrong is for the console of whoever runs the server.
      process.stderr.write(`lvrtc serve: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`);
      answer = { status: 500, type: "text", body: "internal error\n" };
    }
    send(request, response, answer);
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

  const abort = new AbortController();
  const answered: Promise<AskedEngines> =
    options.runner === undefined
      ? Promise.resolve(asked)
      : askEngines(options.runner, baselineEngineIds(sources), abort.signal).then((outcome) => {
          asked = abort.signal.aborted ? { state: "failed", problem: "the dashboard closed first" } : outcome;
          return asked;
        });
  return {
    port,
    url: `http://${DASHBOARD_HOST}:${port}/`,
    asked: () => asked,
    answered,
    close: async () => {
      abort.abort();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        for (const socket of sockets) socket.destroy();
      });
    },
  };
}
