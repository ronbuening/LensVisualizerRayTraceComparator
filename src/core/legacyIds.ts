// The ids a check or an engine had before it was renamed, and what each is called now. A run, a suite, a command
// line or a committed baseline written before a rename still names the old id; each is read through these maps, so
// that nothing with an old id is persisted again or enters a key. The check ids are renamed (Stage 9.7), and the
// engine ids (Stage 9.8).
//
// This file imports nothing and is in no engine's import closure: no fingerprint or adapter revision moves for it.
// It is never applied where the catalog snapshot is held to its frozen policy and known failures (`parseBaseline`,
// `readCatalogInputs`, `readKnownFailures`, `classifyCatalog`, `unusedKnownFailures`, `baselineGateProblems`), nor to
// the catalog's own reports: the catalog keeps its ids as written until the end-of-project catalog refresh.

/**
 * Old check id to new check id (Stage 9.7): a check held to a limit is named after what it compares, a side-by-side
 * comparison `<analysis>-vs-<counterpart>`. The catalog snapshot, its known failures and reproducers keep the old ids.
 */
export const LEGACY_CHECK_IDS: Readonly<Record<string, string>> = Object.freeze({
  selftest: "pipeline-echo",
  r0: "built-system",
  r1: "first-order",
  r2: "ray-trace",
  r3: "optical-path",
  r4: "geometric-mtf",
  r4f: "lv-mtf-replay",
  r5: "mtf-vs-optiland-fft",
  r5g: "geometric-mtf-vs-optiland",
  r6a: "wave-mtf",
  r6b: "mtf-vs-wave-estimate",
  r6c: "mtf-vs-optiland-wavefront",
  r7a: "spot-rays",
  r7b: "spot-vs-optiland",
  r8a: "axial-rays",
  r8b: "axial-vs-optiland",
  r9a: "chief-rays",
  r9b: "chief-vs-optiland",
  r10a: "field-curve-rays",
  r10b: "field-curve-vs-optiland",
  r11a: "vignetting-rays",
  r11b: "vignetting-vs-flux-estimate",
  r12b: "summary-vs-optiland",
  r13b: "seidel-vs-optiland",
  r14b: "zernike-vs-optiland",
});

/**
 * Old engine id to new engine id (Stage 9.8): an engine the comparator builds is named `<what it computes>-of-<whose
 * data>`. `lv` and `optiland` keep their ids. The catalog snapshot, its known failures and reproducers keep the old
 * ids.
 */
export const LEGACY_ENGINE_IDS: Readonly<Record<string, string>> = Object.freeze({
  ref: "reference-tracer",
  "ref-seidel": "reference-seidel",
  replay: "replay-of-lv-mtf",
  wave: "wave-mtf-of-lv-rays",
  flux: "flux-of-lv-rays",
  "optiland-wave": "otf-of-optiland-wavefront",
});

/** Both maps, as a function that reads ids is handed them; a test hands synthetic ones. */
export interface LegacyMaps {
  readonly checks: Readonly<Record<string, string>>;
  readonly engines: Readonly<Record<string, string>>;
}

/** The maps in force. */
export const LEGACY_IDS: LegacyMaps = Object.freeze({ checks: LEGACY_CHECK_IDS, engines: LEGACY_ENGINE_IDS });

/** The code of a run directory written before a rename, which `compare`, `report` and `baseline write` refuse. */
export const LEGACY_RUN_CODE = "written-before-id-rename";

/** The id a check has now: `id` itself unless `map` renames it. */
export function currentCheckId(id: string, map: Readonly<Record<string, string>> = LEGACY_CHECK_IDS): string {
  return Object.hasOwn(map, id) ? map[id] : id;
}

/** The id an engine has now: `id` itself unless `map` renames it. */
export function currentEngineId(id: string, map: Readonly<Record<string, string>> = LEGACY_ENGINE_IDS): string {
  return Object.hasOwn(map, id) ? map[id] : id;
}

// ── Input aliases ────────────────────────────────────────────────────────────────────────────────────────────────

/** The old ids met on input since the last `takeAliases`, as `kind\0old\0new`, in the order first met. */
const aliasesMet = new Set<string>();

/**
 * The id a check named on input (a command line, a suite file) has now, noting an old one: the command says once,
 * on stderr, which old ids it read as which new ones (`takeAliases`).
 */
export function aliasCheckId(id: string, map: Readonly<Record<string, string>> = LEGACY_CHECK_IDS): string {
  const now = currentCheckId(id, map);
  if (now !== id) aliasesMet.add(`check\0${id}\0${now}`);
  return now;
}

/** The id an engine named on input has now, noting an old one (`aliasCheckId`). */
export function aliasEngineId(id: string, map: Readonly<Record<string, string>> = LEGACY_ENGINE_IDS): string {
  const now = currentEngineId(id, map);
  if (now !== id) aliasesMet.add(`engine\0${id}\0${now}`);
  return now;
}

/** An old id read on input, and the id it was read as. */
export interface AliasRead {
  readonly kind: "check" | "engine";
  readonly old: string;
  readonly now: string;
}

/**
 * The old ids read on input since they were last taken, each once, in the order first read; taking them forgets them.
 * A command line says them in one note, after its command.
 */
export function takeAliases(): AliasRead[] {
  const read = [...aliasesMet].map((entry): AliasRead => {
    const [kind, old, now] = entry.split("\0");
    return { kind: kind as AliasRead["kind"], old, now };
  });
  aliasesMet.clear();
  return read;
}

// ── Baselines ────────────────────────────────────────────────────────────────────────────────────────────────────

/** What of a baseline names a check or an engine: the members `currentIds` maps. Every other member is kept. */
interface BaselineIds {
  readonly engines: readonly { readonly id: string }[];
  readonly runs: readonly {
    readonly rungs: readonly {
      readonly rung: string;
      readonly support: readonly { readonly engine: string }[];
      readonly rays?: readonly { readonly engine: string }[];
      readonly pairs: readonly { readonly a: string; readonly b: string }[];
      readonly steps?: readonly { readonly engine: string; readonly step: string }[];
      readonly sets?: readonly {
        readonly participants: readonly { readonly engine: string }[];
        readonly pairs: readonly { readonly a: string; readonly b: string }[];
      }[];
    }[];
  }[];
}

/** Code-unit order, as the baseline writer sorts (`byId` in `src/baseline/build.ts`). */
function byKey<T>(key: (value: T) => string): (a: T, b: T) => number {
  return (a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
}

/** A pair with its engines renamed and put in the writer's order: the first before the second by id. */
function pairAt<T extends { readonly a: string; readonly b: string }>(pair: T, engine: (id: string) => string): T {
  const [a, b] = [engine(pair.a), engine(pair.b)].sort();
  return { ...pair, a, b };
}

/**
 * The baseline as it would be written today: every check id (`runs[].rungs[].rung`) and every engine id
 * (`engines[].id`, `support[].engine`, `rays[].engine`, `pairs[].a` and `b`, `steps[].engine`, `sets[]`'s
 * participants and pairs) renamed by `maps`, and every list the writer sorts by an engine sorted again as it sorts
 * it: the engines, support and rays by id, a pair's two engines by id and the pairs by both, the steps by engine and
 * step, a set's participants by engine and its pairs by both. The order of runs and of their checks is kept: a
 * renamed check keeps its place among the checks. Nothing else is touched; a baseline that names no old id is
 * returned unchanged, the same object. A pure function.
 *
 * Never for the catalog snapshot where it is held to its frozen policy and known failures (see the head of this
 * file).
 */
export function currentIds<T extends BaselineIds>(baseline: T, maps: LegacyMaps = LEGACY_IDS): T {
  const check = (id: string): string => currentCheckId(id, maps.checks);
  const engine = (id: string): string => currentEngineId(id, maps.engines);
  const names = [
    ...baseline.engines.map(({ id }) => engine(id) !== id),
    ...baseline.runs.flatMap((run) =>
      run.rungs.map(
        (rung) =>
          check(rung.rung) !== rung.rung ||
          rung.support.some((each) => engine(each.engine) !== each.engine) ||
          rung.pairs.some((pair) => engine(pair.a) !== pair.a || engine(pair.b) !== pair.b) ||
          (rung.rays ?? []).some((each) => engine(each.engine) !== each.engine) ||
          (rung.steps ?? []).some((each) => engine(each.engine) !== each.engine) ||
          (rung.sets ?? []).some(
            (set) =>
              set.participants.some((each) => engine(each.engine) !== each.engine) ||
              set.pairs.some((pair) => engine(pair.a) !== pair.a || engine(pair.b) !== pair.b),
          ),
      ),
    ),
  ];
  if (!names.includes(true)) return baseline;
  const byEngine = byKey((each: { readonly engine: string }) => each.engine);
  const byPair = byKey((pair: { readonly a: string; readonly b: string }) => `${pair.a}\0${pair.b}`);
  return {
    ...baseline,
    engines: baseline.engines
      .map((each) => ({ ...each, id: engine(each.id) }))
      .sort(byKey((each: { readonly id: string }) => each.id)),
    runs: baseline.runs.map((run) => ({
      ...run,
      rungs: run.rungs.map((rung) => ({
        ...rung,
        rung: check(rung.rung),
        support: rung.support.map((each) => ({ ...each, engine: engine(each.engine) })).sort(byEngine),
        ...(rung.rays === undefined
          ? {}
          : { rays: rung.rays.map((each) => ({ ...each, engine: engine(each.engine) })).sort(byEngine) }),
        pairs: rung.pairs.map((pair) => pairAt(pair, engine)).sort(byPair),
        ...(rung.steps === undefined
          ? {}
          : {
              steps: rung.steps
                .map((each) => ({ ...each, engine: engine(each.engine) }))
                .sort(
                  byKey((each: { readonly engine: string; readonly step: string }) => `${each.engine}\0${each.step}`),
                ),
            }),
        ...(rung.sets === undefined
          ? {}
          : {
              sets: rung.sets.map((set) => ({
                ...set,
                participants: set.participants.map((each) => ({ ...each, engine: engine(each.engine) })).sort(byEngine),
                pairs: set.pairs.map((pair) => pairAt(pair, engine)).sort(byPair),
              })),
            }),
      })),
    })),
  };
}

/** One map turned round, new id to old; throws unless it is a bijection whose new ids are no old ids. */
function inverted(map: Readonly<Record<string, string>>, kind: string): Readonly<Record<string, string>> {
  const back: Record<string, string> = {};
  for (const [old, now] of Object.entries(map)) {
    if (Object.hasOwn(back, now)) throw new Error(`the ${kind} ids ${back[now]} and ${old} are both renamed ${now}`);
    if (Object.hasOwn(map, now)) throw new Error(`the ${kind} id ${old} is renamed ${now}, itself an old id`);
    back[now] = old;
  }
  return Object.freeze(back);
}

/**
 * The maps turned round, new id to old: the way back to the ids a dated snapshot was written with. Throws unless
 * each map is a bijection whose new ids are no old ids, so that every id has exactly one name in each id space.
 */
export function inverseMaps(maps: LegacyMaps = LEGACY_IDS): LegacyMaps {
  return Object.freeze({ checks: inverted(maps.checks, "check"), engines: inverted(maps.engines, "engine") });
}

/** The id a check had before it was renamed: `id` itself unless `map` renamed some id to it. */
export function legacyCheckId(id: string, maps: LegacyMaps = LEGACY_IDS): string {
  return currentCheckId(id, inverseMaps(maps).checks);
}

/** The id an engine had before it was renamed: `id` itself unless `map` renamed some id to it. */
export function legacyEngineId(id: string, maps: LegacyMaps = LEGACY_IDS): string {
  return currentEngineId(id, inverseMaps(maps).engines);
}

/**
 * A baseline of today in the id space of a dated snapshot written before the renames (the catalog's): every check
 * and engine id it names back under its old id, every list in the writer's order, as `currentIds` does it the other
 * way. So a fresh run is held to the snapshot, and classified by its known failures, under the ids they were written
 * with. A pure function; the same object where nothing was renamed.
 */
export function snapshotIds<T extends BaselineIds>(baseline: T, maps: LegacyMaps = LEGACY_IDS): T {
  return currentIds(baseline, inverseMaps(maps));
}

/**
 * A policy, or anything whose entries are keyed by check under `rungs`, with each entry under the id `map` gives it
 * (an id it does not name keeps its own): every other member is kept, and the order of the entries. The same object
 * where no id is mapped. A pure function.
 */
export function policyAtIds<T extends { readonly rungs: Readonly<Record<string, unknown>> }>(
  policy: T,
  map: Readonly<Record<string, string>>,
): T {
  if (!Object.keys(policy.rungs).some((id) => Object.hasOwn(map, id))) return policy;
  return {
    ...policy,
    rungs: Object.fromEntries(Object.entries(policy.rungs).map(([id, entry]) => [currentCheckId(id, map), entry])),
  };
}

/**
 * The policy at hand in the id space of a dated snapshot written before the renames (the catalog's): its entries
 * under their old ids, as `snapshotIds` reads today's run back, so that the snapshot's records are judged by the
 * limits of their own checks.
 */
export function snapshotPolicyIds<T extends { readonly rungs: Readonly<Record<string, unknown>> }>(
  policy: T,
  maps: LegacyMaps = LEGACY_IDS,
): T {
  return policyAtIds(policy, inverseMaps(maps).checks);
}

// ── Run directories ──────────────────────────────────────────────────────────────────────────────────────────────

/** What of a run record names a check or an engine. */
interface ManifestIds {
  readonly engines: readonly { readonly id: string }[];
  readonly runs: readonly { readonly referenceEngine?: string }[];
  readonly jobs: readonly { readonly rung: string; readonly engine: string }[];
}

/** What of a comparisons file names a check or an engine. */
interface ComparisonIds {
  readonly comparisons: readonly {
    readonly rung: string;
    readonly reference?: string;
    readonly participants: readonly { readonly engine: string }[];
    readonly pairs: readonly { readonly a: string; readonly b: string }[];
  }[];
}

/**
 * The old ids a run directory names, each once and sorted, as `check <old>` or `engine <old>`: in its run record (the
 * engines, each run's reference engine, each job's check and engine) and, when given, its comparisons (each set's
 * check, reference, participants and pairs). Empty for a run directory written with the ids of today.
 */
export function legacyIdsOfRun(
  manifest: ManifestIds,
  comparisons: ComparisonIds | null = null,
  maps: LegacyMaps = LEGACY_IDS,
): string[] {
  const found = new Set<string>();
  const check = (id: string | undefined): void => {
    if (id !== undefined && Object.hasOwn(maps.checks, id)) found.add(`check ${id}`);
  };
  const engine = (id: string | undefined): void => {
    if (id !== undefined && Object.hasOwn(maps.engines, id)) found.add(`engine ${id}`);
  };
  for (const each of manifest.engines) engine(each.id);
  for (const run of manifest.runs) engine(run.referenceEngine);
  for (const job of manifest.jobs) {
    check(job.rung);
    engine(job.engine);
  }
  for (const set of comparisons?.comparisons ?? []) {
    check(set.rung);
    engine(set.reference);
    for (const participant of set.participants) engine(participant.engine);
    for (const pair of set.pairs) {
      engine(pair.a);
      engine(pair.b);
    }
  }
  return [...found].sort();
}

/**
 * The engine ids a configuration defines under an old id, each with its new id: a configuration must name an engine
 * by the id of today, so that what it defines is what is run under that id.
 */
export function legacyEngineDefinitions(
  ids: readonly string[],
  map: Readonly<Record<string, string>> = LEGACY_ENGINE_IDS,
): { readonly old: string; readonly now: string }[] {
  return ids.filter((id) => Object.hasOwn(map, id)).map((old) => ({ old, now: map[old] }));
}
