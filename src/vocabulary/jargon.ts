// The tool's own words that a reviewer should not meet: each with the plain words to say instead. A test
// (`test/vocabulary/jargon.test.ts`) holds every user-facing surface to its own list of the words it still uses, a
// list that only shrinks.

/** One word of the tool's own, and what to say instead. */
export interface JargonTerm {
  /** The name a ratchet lists it under. */
  readonly term: string;
  readonly pattern: RegExp;
  readonly replacement: string;
}

/** Every banned word, matched on word boundaries, in any case. */
export const JARGON: readonly JargonTerm[] = [
  { term: "rung", pattern: /\brungs?\b/i, replacement: "check" },
  { term: "ladder", pattern: /\bladders?\b/i, replacement: "the checks" },
  { term: "span", pattern: /\bspans?\b/i, replacement: "the requests compared together" },
  { term: "recipe", pattern: /\brecipes?\b/i, replacement: "MTF setup" },
  { term: "manifest", pattern: /\bmanifests?\b/i, replacement: "run record" },
  { term: "basis", pattern: /\b(?:basis|bases)\b/i, replacement: "what it is judged against" },
  { term: "gravest", pattern: /\bgravest\b/i, replacement: "worst" },
  { term: "adapter revision", pattern: /\badapter revisions?\b/i, replacement: "engine version" },
  { term: "fingerprint", pattern: /\bfingerprints?\b/i, replacement: "engine version" },
  { term: "Stage", pattern: /\bstage \d/i, replacement: "nothing: say what changed, not when" },
  { term: "Phase", pattern: /\bphase \d/i, replacement: "nothing: say what changed, not when" },
  { term: "owner", pattern: /\bowners?\b/i, replacement: "maintainer" },
  { term: "implementer", pattern: /\bimplementers?\b/i, replacement: "maintainer" },
];

/**
 * The parts of a Markdown or plain text that are exempt: a `<details>` block whose `<summary>` is exactly
 * "Identifiers", and a section under a heading that is exactly "Identifiers", up to the next heading of its level or
 * above (both in any case). Hashes and engine versions live there; every other `<details>` is checked.
 */
export function withoutExemptions(text: string): string {
  const withoutDetails = text.replace(
    /<details\b[^>]*>\s*<summary\b[^>]*>\s*identifiers\s*<\/summary>[\s\S]*?<\/details>/gi,
    "",
  );
  const kept: string[] = [];
  let skipping: number | null = null;
  for (const line of withoutDetails.split("\n")) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading !== null) {
      const level = heading[1].length;
      if (skipping !== null && level <= skipping) skipping = null;
      if (skipping === null && /^identifiers$/i.test(heading[2].trim())) {
        skipping = level;
        continue;
      }
    }
    if (skipping === null) kept.push(line);
  }
  return kept.join("\n");
}

/** The terms of `JARGON` a text uses outside its exempt parts, each once, in the order of `JARGON`. */
export function jargonTerms(text: string): string[] {
  const checked = withoutExemptions(text);
  return JARGON.filter((jargon) => jargon.pattern.test(checked)).map((jargon) => jargon.term);
}

/** What a text says in the tool's own words, as `<term>: "<as written>"; say "<replacement>"` lines (empty: none). */
export function jargonProblems(text: string): string[] {
  const checked = withoutExemptions(text);
  return JARGON.flatMap((jargon) => {
    const found = new RegExp(jargon.pattern.source, "gi");
    const spellings = [...new Set([...checked.matchAll(found)].map((match) => match[0]))];
    return spellings.map((spelling) => `${jargon.term}: "${spelling}"; say "${jargon.replacement}"`);
  });
}
