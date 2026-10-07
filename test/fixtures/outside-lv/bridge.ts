// How the comparator reaches LV: an explicit ".ts" specifier from outside the root.
import buildLens from "../fake-lv/src/optics/buildLens.ts";

export const lens = buildLens([{ radius: 2 }]);
