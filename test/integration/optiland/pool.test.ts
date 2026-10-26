import { test } from "node:test";
import { benchmarkPool } from "../poolSupport.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE } from "./support.ts";

test(
  "benchmark rays subset: serial and jobs 4 agree byte for byte on LV/ref/optiland",
  {
    skip: OPTILAND_UNAVAILABLE || LV_UNAVAILABLE,
  },
  async (t) => {
    await benchmarkPool(t, ["lv", "ref", "optiland"]);
  },
);

test(
  "gated MTF subset: child preparation and parallel comparison match serial LV/ref/optiland bytes",
  { skip: OPTILAND_UNAVAILABLE || LV_UNAVAILABLE },
  async (t) => {
    await benchmarkPool(t, ["lv", "ref", "optiland"], ["r4", "r4f", "r6a"]);
  },
);
