// The view models of the help and checks pages (`/help`, `/checks`): the vocabulary's words (`src/vocabulary`), and
// each check's limits as `lvrtc checks <id>` states them (`checkJson`), every limit a Figure read from the limits file
// at hand. Pure functions of the vocabulary and the limits file: equal inputs give equal views.
import { checkJson } from "../cli/commands/checks.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import {
  BADGE_TEXT,
  CHECKS,
  CLASS_TEXT,
  ENGINES,
  OUTCOME_TEXT,
  ROW_STATUS_TEXT,
  STALE_REASON_TEXT,
  TERMS,
  VERDICT_TEXT,
} from "../vocabulary/index.ts";
import type { CheckKind } from "../vocabulary/index.ts";
import { figureAt, optionalFigureAt } from "./figure.ts";
import type { DocumentName, Figure } from "./figure.ts";
import type { Loaded, PolicyAtHand } from "./sources.ts";

/** A label as a page shows it, the value the files store, and what it means. */
export interface LabelEntry {
  readonly stored: string;
  readonly label: string;
  readonly meaning: string;
}

/** The view of the help page. */
export interface HelpView {
  readonly kind: "dashboard-help";
  readonly terms: readonly { readonly term: string; readonly definition: string }[];
  readonly verdicts: readonly LabelEntry[];
  readonly badges: readonly LabelEntry[];
  readonly reasons: readonly LabelEntry[];
  readonly outcomes: readonly LabelEntry[];
  readonly classes: readonly LabelEntry[];
  readonly statuses: readonly LabelEntry[];
  readonly engines: readonly {
    readonly id: string;
    readonly newId: string;
    readonly name: string;
    readonly description: string;
  }[];
}

function entries(texts: Readonly<Record<string, { readonly label: string; readonly meaning: string }>>): LabelEntry[] {
  return Object.entries(texts).map(([stored, text]) => ({ stored, label: text.label, meaning: text.meaning }));
}

/** The help page: the glossary's terms, the verdicts, badges, outcomes and classes, and the engines. */
export function buildHelpView(): HelpView {
  return {
    kind: "dashboard-help",
    terms: TERMS.map(({ term, definition }) => ({ term, definition })),
    verdicts: entries(VERDICT_TEXT),
    badges: entries(BADGE_TEXT),
    reasons: entries(STALE_REASON_TEXT),
    outcomes: entries(OUTCOME_TEXT),
    classes: entries(CLASS_TEXT),
    statuses: entries(ROW_STATUS_TEXT),
    engines: ENGINES.map(({ id, newId, name, description }) => ({ id, newId, name, description })),
  };
}

/** One figure of a check with what the limits file holds it to: each limit a Figure of the file. */
export interface CheckLimitView {
  readonly metric: string;
  readonly unit: string;
  readonly tolerance: Figure | null;
  readonly band: Figure | null;
  readonly bandSeveralLines: Figure | null;
  /** Whether its band is a limit of the sorting of a side-by-side check, not a review band. */
  readonly sorting: boolean;
}

/** One check as the checks page shows it. */
export interface CheckView {
  readonly id: string;
  readonly newId: string;
  readonly title: string;
  readonly kind: CheckKind;
  readonly compares: string;
  readonly shows: string;
  readonly doesNotShow: string;
  /** The engines it is asked of whatever a run names, or null: the suite's. */
  readonly engines: readonly string[] | null;
  readonly onlyWhereNamed: boolean;
  readonly limits: readonly CheckLimitView[];
}

/** The view of the checks page. */
export interface ChecksView {
  readonly kind: "dashboard-checks";
  /** The version of the limits file at hand; null when it cannot be read (and no check has limits). */
  readonly limitsFile: Figure | null;
  readonly checks: readonly CheckView[];
}

/** The checks page: every check of the vocabulary, its engines and its limits from the limits file at hand. */
export function buildChecksView(policy: Loaded<PolicyAtHand>): ChecksView {
  const atHand = policy.state === "ok" ? policy.value : null;
  const document: DocumentName | null = atHand === null ? null : `policy:${atHand.name}`;
  const checks = CHECKS.map((check): CheckView => {
    const json =
      atHand === null
        ? checkJson(check, { contract: CONTRACT_VERSION, kind: "policy", version: 0, rungs: {} })
        : checkJson(check, atHand.policy);
    const limitOf = (metric: string, member: string): Figure | null =>
      atHand === null || document === null
        ? null
        : optionalFigureAt(document, atHand.policy, ["rungs", check.id, "metrics", metric, member]);
    return {
      id: json.id,
      newId: json.newId,
      title: json.title,
      kind: json.kind,
      compares: json.compares,
      shows: json.shows,
      doesNotShow: json.doesNotShow,
      engines: json.engines === null ? null : [...json.engines],
      onlyWhereNamed: json.onlyWhereNamed,
      limits: json.limits.map((limit) => ({
        metric: limit.metric,
        unit: limit.unit,
        tolerance: limitOf(limit.metric, "tolerance"),
        band: limitOf(limit.metric, "attention"),
        bandSeveralLines: limitOf(limit.metric, "attentionSeveralLines"),
        sorting: limit.sorting,
      })),
    };
  });
  return {
    kind: "dashboard-checks",
    limitsFile: atHand === null || document === null ? null : figureAt(document, atHand.policy, ["version"]),
    checks,
  };
}
