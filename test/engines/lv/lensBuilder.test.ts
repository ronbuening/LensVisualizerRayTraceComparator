// The lens builder against the fake LV tree: what the case exporter and the engine `lv` each build their lenses
// with. The fake's numbers describe no real lens.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { FAKE_LENS_FILES, bind, fileHash, freshLv } from "./support.ts";

const [[SINGLET_FILE, SINGLET_KEY]] = FAKE_LENS_FILES;

test("a lens is built once: the same key gives the same built lens, with its catalog entry", async (t) => {
  const lv = freshLv(t);
  const build = createLensBuilder(await bind(t, lv));
  const first = await build(SINGLET_KEY);
  assert.ok(first.ok);
  assert.equal(first.entry.key, SINGLET_KEY);
  assert.equal(first.entry.file, SINGLET_FILE);
  assert.equal(first.entry.fileSha256, fileHash(lv, SINGLET_FILE));
  assert.equal(first.runtime.lastLensSurfaceIdx, 2);
  // LensVisualizer keeps the states it prepares by the built lens itself: a lens built again would prepare afresh.
  const again = await build(SINGLET_KEY);
  assert.ok(again.ok);
  assert.equal(again.runtime, first.runtime);
  assert.equal(again, first);
});

test("a key the catalog does not hold and a lens that cannot be built are problems, not rejections", async (t) => {
  const lv = freshLv(t);
  mkdirSync(join(lv, "src/lens-data/broken"));
  // The fake's buildLens refuses a lens without a stop surface.
  writeFileSync(
    join(lv, "src/lens-data/broken/NoStop.data.ts"),
    'export default { key: "no-stop", name: "NO Stop", surfaces: [{ label: "1", R: 50, d: 4, nd: 1, sd: 8 }] };\n',
  );
  const build = createLensBuilder(await bind(t, lv));

  const unknown = await build("acme-singlet-51");
  assert.ok(!unknown.ok);
  assert.equal(unknown.problem.code, "unknown-lens");
  assert.match(unknown.problem.message, /^unknown lens "acme-singlet-51"; did you mean acme-singlet-50/);

  const broken = await build("no-stop");
  assert.ok(!broken.ok);
  assert.deepEqual(broken.problem, {
    code: "lens-build-failed",
    message: "LensVisualizer cannot build the lens: no-stop: no STO surface",
  });
  // A problem is remembered like a lens: the file is not built again.
  assert.equal(await build("no-stop"), broken);
});
