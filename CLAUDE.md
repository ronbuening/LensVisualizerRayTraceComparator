# LensVisualizer Ray-Trace Comparator

Cross-checks LensVisualizer (LV) against external optical engines. The plan, with phases, stages and the comparison
ladder, is `docs/IMPLEMENTATION_PLAN.md`. Work one stage per commit; every stage has its own tests.

## Commands

```bash
npm run check          # typecheck + lint + format:check + test; run before every commit
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm run format         # prettier --write
npm test               # node --test "test/**/*.test.ts"
npm run test:python    # unittest for the Python worker kit (workers/python/tests/kit); part of check
node bin/lvrtc.mjs     # the CLI
node bin/lvrtc.mjs doctor   # Node, config layers, LV, Python and optiland as this machine sees them
node bin/lvrtc.mjs run test/fixtures/suites/fake-pair.json --root test/fixtures/fake-root   # a suite on fake engines
node bin/lvrtc.mjs engine conformance fake-py --root test/fixtures/fake-root   # the conformance kit on one engine
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
- **A test that runs `lvrtc run` sets `LVRTC_RUNS_DIR` to a temporary directory**; nothing a test writes goes into
  the repository. `test/fixtures/fake-root` defines `fake-py`, a Python worker: name the in-process engines
  (`--engines fake-a,fake-b,fake-none`) in a test that must run without Python.
- **Reports and baselines are deterministic**: no timestamps, no machine information.
- **Recorded differences are not errors.** Only direct and identical-ray rungs are gated; see the ladder in the
  plan before adding a tolerance.
- Formatting follows LV: double quotes, 120 columns.
