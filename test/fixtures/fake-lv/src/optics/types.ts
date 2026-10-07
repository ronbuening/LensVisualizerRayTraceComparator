// Imported with `import type` only, so type stripping erases the import and this file is never loaded.
export interface FakeSurface {
  readonly radius: number;
}

export interface FakeLens {
  readonly surfaces: readonly FakeSurface[];
  readonly sagAtUnitHeight: readonly number[];
}
