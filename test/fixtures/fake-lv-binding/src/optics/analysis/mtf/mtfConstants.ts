// The fake's MTF sampling constants, under LV's names. None is LV's value.

/** The fake's refinement ladder. */
export const MTF_GRID_LADDER = Object.freeze([4, 8, 16, 32, 64, 128] as const);

/** The largest grid of a request that names none. */
export const MTF_DEFAULT_GRID_CAP = 128;

/** How often one field's footprint is widened. */
export const MTF_MAX_FOOTPRINT_EXPANSIONS = 1;

/** Fewer rays than this at a line are no pupil. */
export const MTF_MIN_RAYS = 24;

/** The largest share of a field's flux that the tracer may leave unresolved. */
export const MTF_MAX_UNKNOWN_FLUX = 0.25;

/** The change between two grids, at every frequency, that the fake takes for converged. */
export const MTF_CONVERGENCE_TOLERANCE = 0.015625;
