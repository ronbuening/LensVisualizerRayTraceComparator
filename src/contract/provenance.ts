// Mirrors contract/schema/v1/provenance.schema.json.

/** What an optical case was built from: a LensVisualizer lens file, or a named fixture. */
export type ProvenanceSource =
  | {
      readonly kind: "lv-lens";
      readonly lensKey: string;
      /** The lens file, relative to the LensVisualizer checkout. */
      readonly file: string;
      readonly fileSha256: string;
    }
  | { readonly kind: "fixture"; readonly name: string };

/** The LensVisualizer checkout a case was read from. */
export interface LvProvenance {
  /** The checked-out commit, or null when the checkout is not a git work tree. */
  readonly commit: string | null;
  /** Whether the work tree had uncommitted changes, or null when that is unknown. */
  readonly dirty: boolean | null;
  /** SHA-256 over every LensVisualizer source file the loader returned while building the case. */
  readonly closureHash: string;
}

/**
 * Where an optical case came from. It is recorded for people and for audits and is never part of a case's
 * identity: two cases that differ only here have the same `id`.
 */
export interface Provenance {
  readonly source: ProvenanceSource;
  readonly lv?: LvProvenance;
  readonly producer: { readonly tool: "lvrtc"; readonly version: string };
}
