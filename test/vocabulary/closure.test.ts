// The vocabulary is in no engine's import closure, so no fingerprint or adapter revision moves when a word does; and
// it imports nothing outside itself but types, so it reaches no engine either.
import assert from "node:assert/strict";
import { test } from "node:test";

import { importClosure } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { LV_FLUX_ENGINE_MODULE } from "../../src/engines/lv/fluxEngine.ts";
import { LV_REPLAY_ENGINE_MODULE } from "../../src/engines/lv/replayEngine.ts";
import { LV_WAVE_ENGINE_MODULE } from "../../src/engines/lv/waveEngine.ts";
import { REF_ENGINE_MODULE } from "../../src/engines/ref/engine.ts";
import { REF_SEIDEL_ENGINE_MODULE } from "../../src/engines/refSeidel/engine.ts";

/** The modules whose closures are engines' adapter revisions, and the registry and worker definition beside them. */
const ENGINE_MODULES = [
  LV_ENGINE_MODULE,
  LV_REPLAY_ENGINE_MODULE,
  LV_WAVE_ENGINE_MODULE,
  LV_FLUX_ENGINE_MODULE,
  REF_ENGINE_MODULE,
  REF_SEIDEL_ENGINE_MODULE,
  "engines/optiland/wavefrontEngine.ts",
  "engines/optiland/definition.ts",
  "engines/builtin.ts",
];

test("no built-in engine's import closure reaches src/vocabulary", () => {
  for (const entry of ENGINE_MODULES) {
    const closure = importClosure(entry);
    assert.ok(closure.length > 1, `${entry} has a closure`);
    assert.deepEqual(
      closure.filter((file) => file.startsWith("vocabulary/")),
      [],
      entry,
    );
  }
});

test("the vocabulary imports values from nothing outside itself", () => {
  const closure = importClosure("vocabulary/index.ts");
  assert.ok(closure.includes("vocabulary/checks.ts"));
  assert.deepEqual(
    closure.filter((file) => !file.startsWith("vocabulary/")),
    [],
  );
  // And report wording reaches it, the dependency going that way only.
  assert.ok(importClosure("report/wording.ts").includes("vocabulary/checks.ts"));
});
