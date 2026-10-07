// Outside the LV root, so the ".js" specifier is not rewritten and this import must fail.
import { helper } from "./helper.js";

export const value: string = helper;
