// Every quantity the comparator knows. A stage that adds a quantity adds its module to the list below.
import { axialNativeQuantity } from "./axialNative.ts";
import { chiefNativeQuantity } from "./chiefNative.ts";
import { curvatureNativeQuantity } from "./curvatureNative.ts";
import { mtfNativeQuantity } from "./mtfNative.ts";
import { paraxialFirstOrderQuantity } from "./paraxialFirstOrder.ts";
import { raysTraceQuantity } from "./raysTrace.ts";
import { createQuantityRegistry } from "./registry.ts";
import type { QuantityLookup } from "./registry.ts";
import { seidelNativeQuantity } from "./seidelNative.ts";
import { selftestEchoQuantity } from "./selftestEcho.ts";
import { spotNativeQuantity } from "./spotNative.ts";
import { summaryNativeQuantity } from "./summaryNative.ts";
import { systemDescribeQuantity } from "./systemDescribe.ts";
import { vignettingNativeQuantity } from "./vignettingNative.ts";
import { wavefrontNativeQuantity } from "./wavefrontNative.ts";
import { zernikeNativeQuantity } from "./zernikeNative.ts";

const { has, get, list } = createQuantityRegistry([
  selftestEchoQuantity,
  systemDescribeQuantity,
  paraxialFirstOrderQuantity,
  raysTraceQuantity,
  mtfNativeQuantity,
  wavefrontNativeQuantity,
  spotNativeQuantity,
  axialNativeQuantity,
  chiefNativeQuantity,
  curvatureNativeQuantity,
  vignettingNativeQuantity,
  summaryNativeQuantity,
  seidelNativeQuantity,
  zernikeNativeQuantity,
]);

/**
 * The comparator's quantities, to look up and to list; nothing can be added to them while the program runs. Each
 * one is a quantity of the contract: it has both schema files, and no schema file under `quantities/` is without a
 * module here.
 */
export const QUANTITIES: QuantityLookup = Object.freeze({ has, get, list });
