// What a number of the dashboard is. Every number a view model takes from a document is a `Figure`: the value as
// the file holds it and where it holds it, by an RFC 6901 JSON pointer. Every other number of a view model is a
// count the dashboard made itself, and it sits under a key of `COUNT_KEYS`. A test walks every view model built from
// the fixtures and holds every Figure to the file on disk and every count to a recount of its own.

/**
 * A document the dashboard read, by name: the run's manifest or comparisons (`<runsDir>/<suite>/manifest.json`,
 * `comparisons.json`), a baseline file (`baselines/<stem>.json`), a store entry (`{ request, result }`), or the
 * policy at hand (`policy/<stem>.json`).
 */
export type DocumentName =
  `manifest:${string}` | `comparisons:${string}` | `baseline:${string}` | `store:${string}` | `policy:${string}`;

/** Where a number is: a document, and an RFC 6901 pointer into it as the file holds it. */
export interface Source {
  readonly document: DocumentName;
  readonly pointer: string;
}

/** A number taken from a document: exactly the JSON value at `source.pointer`; null stays null. */
export interface Figure {
  readonly value: number | null;
  readonly source: Source;
}

/** An array of numbers: a list in the JSON, or (store only) an encoded ndarray decoded by the contract's codec. */
export interface Curve {
  readonly values: readonly (number | null)[];
  readonly source: Source;
}

/** A number the dashboard computes from figures: never a Figure. `derivation` says how, `of` from what. */
export interface Derived {
  readonly value: number | null;
  readonly derivation: string;
  readonly of: readonly Source[];
}

/**
 * The keys under which a view model holds a count the dashboard made itself: how many jobs, pairs, records or
 * requests. A number under any other key, and not inside a Figure, a Curve or a Derived, is a mistake.
 */
export const COUNT_KEYS: readonly string[] = Object.freeze([
  // How many of one status, verdict, badge or reason.
  "count",
  // How many pairs of a run are FAIL or ERROR.
  "failing",
  // How many records (pairs of one rung of one run) a baseline has.
  "records",
  // The place of a section among the run's sections, from 0: what its route names.
  "section",
  // The place of a recorded value's element in its list, from 0.
  "element",
  // The place of a run among the runs of a manifest or a baseline, from 0: what its route names.
  "place",
  // How many requests a run of a suite has (rows of its support matrix).
  "requests",
  // How many of a run's requests were compared (its sections).
  "sectionCount",
  // The place of a surface in a trace's list of surfaces, from 0: the bar of a deviation chart it is.
  "surface",
  // The number of a job of run control, from 1, in the order they were started: what its route names (Stage 8.3).
  "job",
  // The exit code of a step of a job of run control, as its child process ended with it (Stage 8.3).
  "exitCode",
]);

/** The pointer of a path of members and indices (RFC 6901): `~` is written `~0` and `/` is written `~1`. */
export function pointerOf(tokens: readonly (string | number)[]): string {
  return tokens.map((token) => `/${String(token).replaceAll("~", "~0").replaceAll("/", "~1")}`).join("");
}

/** The tokens of a pointer (RFC 6901); throws for a pointer that is neither empty nor starts with `/`. */
export function pointerTokens(pointer: string): string[] {
  if (pointer === "") return [];
  if (!pointer.startsWith("/")) throw new Error(`not a JSON pointer: ${JSON.stringify(pointer)}`);
  return pointer
    .slice(1)
    .split("/")
    .map((token) => token.replaceAll("~1", "/").replaceAll("~0", "~"));
}

/** What a pointer resolves to in a parsed document: the value, or that nothing is there. */
export function resolvePointer(
  document: unknown,
  pointer: string,
): { readonly found: true; readonly value: unknown } | { readonly found: false } {
  let at: unknown = document;
  for (const token of pointerTokens(pointer)) {
    if (Array.isArray(at)) {
      if (!/^(0|[1-9][0-9]*)$/.test(token) || Number(token) >= at.length) return { found: false };
      at = at[Number(token)];
    } else if (typeof at === "object" && at !== null && Object.hasOwn(at, token)) {
      at = (at as Record<string, unknown>)[token];
    } else return { found: false };
  }
  return { found: true, value: at };
}

/**
 * The figure at a path of a parsed document: the value read from the document itself, so that it is exactly what the
 * file holds there. Throws when there is no number or null there: a view that asks for one where there is none is a
 * mistake of the view.
 */
export function figureAt(document: DocumentName, root: unknown, tokens: readonly (string | number)[]): Figure {
  const pointer = pointerOf(tokens);
  const found = resolvePointer(root, pointer);
  if (!found.found || !(typeof found.value === "number" || found.value === null)) {
    throw new Error(`${document} has no number at ${pointer}`);
  }
  return { value: found.value, source: { document, pointer } };
}

/** The figure at a path, or null where the document has nothing there (a member left out). */
export function optionalFigureAt(
  document: DocumentName,
  root: unknown,
  tokens: readonly (string | number)[],
): Figure | null {
  const found = resolvePointer(root, pointerOf(tokens));
  return found.found ? figureAt(document, root, tokens) : null;
}

/** Whether a value of a view model is a Figure. */
export function isFigure(value: unknown): value is Figure {
  if (typeof value !== "object" || value === null) return false;
  const keys = Object.keys(value).sort().join();
  return keys === "source,value" && isSource((value as Figure).source);
}

/** Whether a value of a view model is a Curve. */
export function isCurve(value: unknown): value is Curve {
  if (typeof value !== "object" || value === null) return false;
  return Object.keys(value).sort().join() === "source,values" && isSource((value as Curve).source);
}

/** Whether a value of a view model is a Derived. */
export function isDerived(value: unknown): value is Derived {
  if (typeof value !== "object" || value === null) return false;
  return Object.keys(value).sort().join() === "derivation,of,value";
}

function isSource(value: unknown): value is Source {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Source).document === "string" &&
    typeof (value as Source).pointer === "string"
  );
}

/** A document's name as a person finds the file, relative to the root or the runs directory: no absolute path. */
export function documentLabel(document: DocumentName): string {
  const colon = document.indexOf(":");
  const [kind, name] = [document.slice(0, colon), document.slice(colon + 1)];
  if (kind === "manifest") return `${name}/manifest.json`;
  if (kind === "comparisons") return `${name}/comparisons.json`;
  if (kind === "baseline") return `baselines/${name}.json`;
  if (kind === "policy") return `policy/${name}.json`;
  return `store/${name}`;
}
