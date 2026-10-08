# LensVisualizer Ray-Trace Comparator

Cross-checks LensVisualizer (LV) against external optical engines. The plan, with phases, stages and the comparison
ladder, is `docs/IMPLEMENTATION_PLAN.md`. Work one stage per commit; every stage has its own tests.

## Commands

```bash
npm run check          # typecheck + lint + format:check + test; run before every commit
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm run format         # prettier --write
npm test               # node --test on test/**/*.test.ts, except test/integration
npm run test:python    # unittest for the Python worker kit (workers/python/tests/kit); part of check
npm run test:lv        # tests against the real LensVisualizer (test/integration/lv); NOT part of check
node bin/lvrtc.mjs     # the CLI
node bin/lvrtc.mjs doctor   # Node, config layers, LV, Python and optiland as this machine sees them
node bin/lvrtc.mjs run test/fixtures/suites/fake-pair.json --root test/fixtures/fake-root   # a suite on fake engines
node bin/lvrtc.mjs compare fake-pair --root test/fixtures/fake-root   # compare a run: writes comparisons.json
node bin/lvrtc.mjs report fake-pair --root test/fixtures/fake-root    # report a compared run: report.json, report.md
node test/contract/writeCorpus.ts   # rewrite contract/fixtures after editing test/contract/corpus.ts
node test/report/writeGolden.ts     # rewrite test/fixtures/golden after a change meant to change a report
node bin/lvrtc.mjs engine conformance fake-py --root test/fixtures/fake-root   # the conformance kit on one engine
node bin/lvrtc.mjs lenses list                 # every LensVisualizer lens: key, name, file
node bin/lvrtc.mjs lenses show nikkor-z50f12   # one lens as LV prepares it for tracing (console only)
node bin/lvrtc.mjs export nikkor-z50f12        # one lens as an engine-neutral case (stdout; never committed)
node bin/lvrtc.mjs export --all --census reports/census   # every lens at its default state; rewrites the census
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1   # real lenses on the built-in engines
node bin/lvrtc.mjs run suites/benchmark.json   # the same: a committed suite names lv and ref, and gets r0 and r1
node bin/lvrtc.mjs run suites/benchmark.json --engines lv --rungs rays        # lv traces LV's own launch rays
node bin/lvrtc.mjs engine conformance ref      # the conformance kit on a built-in engine
```

## Rules

- **Node `>=24.15.0 <25`, ESM, no build step.** Sources run under Node's native type stripping, so only erasable
  TypeScript is allowed (`erasableSyntaxOnly`): no enums, namespaces or constructor parameter properties.
- **Import TypeScript with `.ts` specifiers** and use `import type` for types (`verbatimModuleSyntax`).
- **Zero runtime npm dependencies.** Validators, hashing and codecs are written here. Dev dependencies are tooling
  only.
- **Tests are `node:test`** in `test/**/*.test.ts`. Unit tests are hermetic: they need neither LV nor optiland.
  Integration tests skip with a stated reason when LV or optiland is not configured.
- **LV and optiland are read-only.** Never edit either checkout. LV is imported only from
  `src/engines/lv/binding.ts`; optiland is called only from `workers/python/lvrtc_optiland`.
- **The LV binding is the only door to LV.** To use one more LV function, add its name to
  `src/engines/lv/manifest.ts` and its signature to `LvApi` in `src/engines/lv/types.ts`; the type check fails
  until the two agree, and the binding checks the export at load time. Types of LV values are local structural
  types: never `import type` from the LV path, so `npm run typecheck` passes with no LV on disk.
- **The LV engine fingerprint covers engine code only.** Lens prescription files (`src/lens-data/**/*.data.ts`,
  `*.teleconverter.ts`) are hashed one by one into the catalog and never into the engine closure.
- **Read a prepared state, not the authored lens.** The runtime stop radius is `state.surfaces[stopIndex].sd`;
  never read a surface's `source` or `base`, `L.stopPhysSD` or `L.totalTrack`. `syntheticKind` in the binding is
  the one reader of `source` (LV keeps the rear-plate flag nowhere else).
- **The exporter translates and never approximates.** What the contract cannot express is a coded problem for
  that run. A rule LV keeps only in its UI (the stop-down formula) is mirrored here with a source canary in
  `test/integration/lv/canaries.test.ts`. Hermetic tests use synthetic numbers only, never an LV-derived value.
- **Built-in engines (`ref`, `lv`) live in `src/engines/builtin.ts`** and run only where named: `--engines` or a
  suite's `engines`. `ref` is written from the optics alone; never port LV's or optiland's code into it. `lv`
  answers only from LV's own prepared state and re-exports every case (`stale-case`, `case-source`).
- **A gate is never loosened to make a lens pass.** Classify the lens in `docs/gotchas.md`. A gate changes only on
  a measured numerical floor, recorded under "Amendments since approval" in the plan and by raising the policy's
  `version`.
- **Tests that need the real LV** are `test/integration/lv/**/*.test.ts`, run by `npm run test:lv` and excluded
  from `npm test`. Each skips with a reason when LV is missing (`LV_UNAVAILABLE` in
  `test/integration/lv/support.ts`), writes nothing into the repository or LV, and names the LV commit of every
  number it pins. Hermetic binding tests use the fake tree `test/fixtures/fake-lv-binding`, copied to a temporary
  directory per test (`freshLv`), and close the binding they open: the loader serves one LV tree at a time.
- **Nothing LV-derived that reproduces a prescription is committed**: only result numbers, hashes, counts and
  lens keys. `lvrtc lenses show` is console output.
- **`test/fixtures/` is data, not source**: excluded from `tsc`, eslint and prettier. Tests load fixture modules
  from a temporary copy, because Node caches modules by URL.
- **The Python worker kit is stdlib-only** (`workers/python/lvrtc_worker_kit`, Python `>=3.10`, type hints, 120
  columns) and writes nothing to disk; numpy is used only inside the optiland worker. Nothing is installed into the
  optiland environment. Its tests are `unittest` in `workers/python/tests/kit`.
- **`validate.py` is a port of `src/contract/validate.ts`, and `ndarray.py` of the array codec.** Change both
  sides together; the fixture corpus in `contract/fixtures` holds them to the same answers. Workers echo ids and
  never recompute a hash.
- **A test that needs `python3` skips with a stated reason when it is missing** (`PYTHON_MISSING` in
  `test/engines/support.ts`). The stdio transport itself is tested against Node workers in
  `test/fixtures/stdio-worker`, so those tests need no Python.
- **A test that runs `lvrtc run`, `compare` or `report` sets `LVRTC_RUNS_DIR` to a temporary directory**; nothing
  a test writes goes into the repository. `test/fixtures/fake-root` defines `fake-py` and `fake-pyn`, Python
  workers: name in-process engines (`--engines fake-a,fake-b,fake-none`) in a test that must run without Python.
  `test/fixtures/fault-root` holds the engines that fail.
- **Every judged rung has an entry in `policy/rungs.v1.json` and its quantity a comparator in `src/compare`**; a
  test holds the three together. Raise the policy's `version` when a rung, a class or a limit changes. The one
  rung nothing judges yet is `rays` (`onlyWhenNamed`: run only by `--rungs rays`, no policy entry, no comparator
  for `rays.trace`); rungs that compare traced rays ask its requests (`rayTraceRequests`), so they share answers.
- **Rays come from the case source, never from a rung or an engine.** `CaseSource.raySets` makes the ray sets of a
  run (`src/engines/lv/raySets.ts` for an LV lens, `src/rays/probe.ts` for a case file); a rung's request builder
  only wraps the sets it is handed (`RungInputs`). A set must be the same bytes whenever it is generated: its
  hash is in the request id. A field without rays is a coded problem of that field and fails nothing.
- **LV's launch rays are kept verbatim**: every lattice cell as its own ray, no mirroring, no normalising (a `-0`
  stays), the chief ray last at weight 0. What `traceMtfBundle` and `computeMtfSteps` do inline is restated in
  `raySets.ts` and held to LV by source canaries and by a bit-for-bit comparison with LV's own bundle.
- **In `rays.trace` every value of a ray that did not arrive is NaN from the surface where it ended**, that
  surface's hit included; `endSurface` is S for a ray that passed every surface and cannot reach the image plane.
  A trace that ends on the last surface is landed by `src/estimators/imageProjection.ts`, for every engine alike.
- **`fingerprint` is the engine's own code; `adapterRevision` is the comparator's code behind a built-in engine**
  (`src/engines/adapterRevision.ts`: the import closure of the engine's module, values only). The result store
  keys by both. A new built-in engine states both; never fold adapter code into a fingerprint.
- **The fake LV tree (`test/fixtures/fake-lv-binding`) has a tracer and an MTF launch of its own**, with LV's
  names. A name added to the import manifest needs a fake of it there, and a new fake file a line in
  `FAKE_ENGINE_FILES` (`test/engines/lv/support.ts`). `variantOf` rewrites a file of a copy for one test.
- **Reports are golden-tested** against `test/fixtures/golden`. A change that is meant to change a report rewrites
  them with `node test/report/writeGolden.ts`; read the diff. `comparePair`, `compareGroup`, `buildReport` and
  `renderMarkdown` are pure functions and stay so.
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
