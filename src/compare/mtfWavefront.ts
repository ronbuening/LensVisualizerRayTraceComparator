// R6c uses R5's sorting, facts, recording and metric computation without another implementation of them.
import { nativeMtfComparator } from "./mtfNative.ts";

export const mtfWavefrontComparator = nativeMtfComparator("r6c");
