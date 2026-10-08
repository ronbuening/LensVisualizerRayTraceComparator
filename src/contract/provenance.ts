// Mirrors contract/schema/v1/provenance.schema.json.

/** What an optical case was built from: a LensVisualizer lens file, or a named fixture. */
export type ProvenanceSource =
  | {
      readonly kind: "lv-lens";
      readonly lensKey: string;
      /** The lens file, relative to the LensVisualizer checkout. */
      readonly file: string;
      readonly fileSha256: string;
      /**
       * The zoom and focus position the lens was in, each 0..1 on LensVisualizer's own sliders; a focus position of
       * 0 is infinity focus. With the lens file they say which prepared state the case was read from, so that
       * LensVisualizer can be asked about the same one again. The exporter always states both.
       */
      readonly zoomT?: number;
      readonly focusT?: number;
    }
  | { readonly kind: "fixture"; readonly name: string };

/** The LensVisualizer checkout a case was read from. */
export interface LvProvenance {
  /** The checked-out commit, or null when the checkout is not a git work tree. */
  readonly commit: string | null;
  /** Whether the work tree had uncommitted changes, or null when that is unknown. */
  readonly dirty: boolean | null;
  /**
   * SHA-256 over the LensVisualizer engine files loaded when the case was built: the engine closure, in which no
   * lens prescription file takes part. The lens file is identified by `source.fileSha256`.
   */
  readonly closureHash: string;
}

/**
 * Where an optical case came from. It is recorded for people and for audits and is never part of a case's
 * identity: two cases that differ only here have the same `id`.
 */
export interface Provenance {
  readonly source: ProvenanceSource;
  readonly lv?: LvProvenance;
  /**
   * What the source knows about the lens that the case does not carry, as codes, sorted and each once; left out
   * when there is nothing to note. The codes a source writes are listed in contract/CONTRACT.md.
   */
  readonly notes?: readonly string[];
  readonly producer: { readonly tool: "lvrtc"; readonly version: string };
}
