// The target is under the LV root but the importing module is not, so the specifier is not rewritten.
import { SCALE } from "../fake-lv/src/optics/constants.js";

export const value: number = SCALE;
