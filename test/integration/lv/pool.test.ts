import { test } from "node:test";
import { benchmarkPool } from "../poolSupport.ts";
import { LV_UNAVAILABLE } from "./support.ts";

test("benchmark rays subset: serial and jobs 4 agree byte for byte on LV/ref", { skip: LV_UNAVAILABLE }, async (t) => {
  await benchmarkPool(t, ["lv", "ref"]);
});

test(
  "gated MTF subset: child preparation and parallel comparison match serial LV/ref bytes",
  { skip: LV_UNAVAILABLE },
  async (t) => {
    await benchmarkPool(t, ["lv", "ref"], ["r4", "r4f", "r6a"]);
  },
);
