// `lvrtc checks [<id>]`: every check in plain words, or one in full with its engines and the limits of the limits
// file. It reads the vocabulary, the checks (`RUNGS`) and the limits file, and nothing else.
import { loadPolicy } from "../../compare/policyFile.ts";
import type { MetricPolicy, Policy } from "../../contract/policy.ts";
import { RUNGS } from "../../core/rungs.ts";
import { UsageError } from "../../core/usageError.ts";
import {
  CHECKS,
  CHECKS_COMMAND_TEXT,
  GLOSSARY_TEXT,
  SORTING_LIMITS,
  engineName,
  metricLabel,
} from "../../vocabulary/index.ts";
import type { CheckText } from "../../vocabulary/index.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";
import { helpText, options, paragraph, wrap } from "../help.ts";

const SYNOPSIS = "Usage: lvrtc checks [<id>] [--json]\n";
const HELP = helpText([
  SYNOPSIS,
  ...paragraph(
    "Lists every check this tool makes of LensVisualizer: its id, its title, whether it is held to a limit or sets two methods side by side, and what it compares. With an id, shows that check in full: what it compares, what a pass shows and what it does not show, which engines it is asked of, whether it runs in every run or only where named, and each figure it reports with its limit or review band from the limits file at hand.",
  ),
  ...options([
    [
      "<id>",
      "a check's id as suites and --checks name it (r2), or the id it takes when the ids are renamed (ray-trace)",
    ],
    ["--json", "print one JSON object in place of the lines"],
  ]),
  ...paragraph(
    "Exit code: 0 when it printed; 2 when the id is no check's or the command line cannot be used as given.",
  ),
]);

/** One figure of a check as the limits file states it. */
export interface LimitJson {
  readonly metric: string;
  readonly label: string;
  readonly unit: string;
  readonly tolerance: number | null;
  readonly reviewBand: number | null;
  readonly reviewBandSeveralWavelengths: number | null;
  readonly sorting: boolean;
}

/** A check as `--json` prints it, and as the dashboard's checks page shows it (`src/dashboard/helpViews.ts`). */
export interface CheckJson {
  readonly id: string;
  readonly newId: string;
  readonly title: string;
  readonly kind: CheckText["kind"];
  readonly compares: string;
  readonly shows: string;
  readonly doesNotShow: string;
  /** The engines it is asked of whatever `--engines` names, or null: the suite's. */
  readonly engines: readonly string[] | null;
  readonly onlyWhereNamed: boolean;
  readonly limits: readonly LimitJson[];
}

function limitsOf(check: CheckText, policy: Policy): LimitJson[] {
  const metrics = policy.rungs[check.id]?.metrics ?? {};
  return Object.entries(metrics).map(([metric, limits]: [string, MetricPolicy]) => ({
    metric,
    label: metricLabel(metric),
    unit: limits.unit,
    tolerance: limits.tolerance ?? null,
    reviewBand: limits.attention ?? null,
    reviewBandSeveralWavelengths: limits.attentionSeveralLines ?? null,
    sorting: check.kind === "side-by-side" && SORTING_LIMITS.includes(metric),
  }));
}

/** A check in full: its words, the engines it is asked of, and each figure's limits from `policy`. */
export function checkJson(check: CheckText, policy: Policy): CheckJson {
  const rung = RUNGS.find((each) => each.id === check.id);
  return {
    id: check.id,
    newId: check.newId,
    title: check.title,
    kind: check.kind,
    compares: check.compares,
    shows: check.shows,
    doesNotShow: check.doesNotShow,
    engines: rung?.engines ?? null,
    onlyWhereNamed: rung?.onlyWhereNamed === true,
    limits: limitsOf(check, policy),
  };
}

/** A value of the limits file with its unit, as a person writes it. */
function valueWithUnit(value: number, unit: string): string {
  if (unit === "1") return String(value);
  if (unit === "percent") return `${value} %`;
  return `${value} ${unit}`;
}

/** What one figure is held to, in words. */
function limitWords(limit: LimitJson): string {
  const t = CHECKS_COMMAND_TEXT;
  if (limit.tolerance !== null) return `${t.limit} ${valueWithUnit(limit.tolerance, limit.unit)}`;
  if (limit.reviewBand === null) return t.noBand;
  const value = valueWithUnit(limit.reviewBand, limit.unit);
  const several =
    limit.reviewBandSeveralWavelengths === null
      ? ""
      : `, ${valueWithUnit(limit.reviewBandSeveralWavelengths, limit.unit)} ${t.bandSeveral}`;
  return limit.sorting ? `${t.sorting}: ${value}${several}` : `${t.band} ${value}${several}`;
}

/** Every check, a block each: id and title with its kind, then what it compares. */
function listText(): string {
  const lines: string[] = [...paragraph(CHECKS_COMMAND_TEXT.intro)];
  for (const check of CHECKS) {
    lines.push(
      `${check.id} (${CHECKS_COMMAND_TEXT.labels.newId}: ${check.newId})  ${check.title}: ${GLOSSARY_TEXT.kinds[check.kind]}`,
    );
    lines.push(...wrap(`${check.compares}.`, 4));
  }
  lines.push("", ...wrap(CHECKS_COMMAND_TEXT.more));
  return `${lines.join("\n")}\n`;
}

/** One check in full. */
function checkText(check: CheckText, policy: Policy): string {
  const t = CHECKS_COMMAND_TEXT;
  const json = checkJson(check, policy);
  const engines =
    json.engines === null
      ? t.enginesOfSuite
      : `${json.engines.map((id) => (engineName(id) === id ? id : `${id} (${engineName(id)})`)).join(", ")}; ${t.enginesOwn}`;
  const rows: [string, string][] = [
    [t.labels.id, check.id],
    [t.labels.newId, check.newId],
    [t.labels.kind, GLOSSARY_TEXT.kinds[check.kind]],
    [t.labels.compares, `${check.compares}.`],
    [t.labels.shows, check.shows],
    [t.labels.doesNotShow, check.doesNotShow],
    [t.labels.engines, engines],
    [t.labels.runs, json.onlyWhereNamed ? t.runsNamed : t.runsAlways],
  ];
  const lines = [check.title, ...options(rows).slice(0, -1)];
  lines.push(`  ${t.labels.limits} (${t.limitsFile} ${policy.version}):`);
  if (json.limits.length === 0) lines.push(`    ${t.noLimits}`);
  for (const limit of json.limits) {
    lines.push(...wrap(`${limit.label} (${limit.metric}): ${limitWords(limit)}.`, 6, "    "));
  }
  return `${lines.join("\n")}\n`;
}

/** Builds `lvrtc checks [<id>] [--json]`, judged by `policy` (the limits file at hand unless given). */
export function createChecksCommand(inputs: { readonly policy?: Policy } = {}): CliCommand {
  return {
    name: "checks",
    summary: "List the checks, or show one: what it compares, what it shows and does not, and its limits",
    run: async (args, io) => {
      if (args.includes("-h") || args.includes("--help")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let id: string | undefined;
      let json: boolean;
      try {
        const parsed = parseArguments(args, [], ["--json"]);
        if (parsed.positionals.length > 1) throw new UsageError("name one check at most");
        id = parsed.positionals[0];
        json = parsed.flags.has("--json");
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc checks: ${error.message}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      const policy = inputs.policy ?? loadPolicy();
      if (id === undefined) {
        io.stdout(
          json
            ? `${JSON.stringify({ checks: CHECKS.map((check) => checkJson(check, policy)), limitsFile: policy.version }, null, 2)}\n`
            : listText(),
        );
        return EXIT_OK;
      }
      const check = CHECKS.find((each) => each.id === id || each.newId === id);
      if (check === undefined) {
        io.stderr(`lvrtc checks: "${id}": ${CHECKS_COMMAND_TEXT.unknown}\n${SYNOPSIS}`);
        return EXIT_USAGE;
      }
      io.stdout(
        json
          ? `${JSON.stringify({ ...checkJson(check, policy), limitsFile: policy.version }, null, 2)}\n`
          : checkText(check, policy),
      );
      return EXIT_OK;
    },
  };
}

/** `lvrtc checks`, by the committed limits file. */
export const checksCommand: CliCommand = createChecksCommand();
