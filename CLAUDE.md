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
- **Every rung has an entry in `policy/rungs.v1.json` and every quantity a comparator in `src/compare`**; a test
  holds the three together. Raise the policy's `version` when a rung, a class or a limit changes.
- **Reports are golden-tested** against `test/fixtures/golden`. A change that is meant to change a report rewrites
  them with `node test/report/writeGolden.ts`; read the diff. `comparePair`, `compareGroup`, `buildReport` and
  `renderMarkdown` are pure functions and stay so.
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
