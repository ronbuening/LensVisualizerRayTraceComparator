# LensVisualizer Ray-Trace Comparator

Cross-checks [LensVisualizer](https://github.com/ronbuening/LensVisualizer)'s ray trace and MTF against external
optical engines. It translates a LensVisualizer prescription into an engine-neutral case, runs each engine to the
same specification, and compares the results rung by rung: built system, paraxial data, identical rays, optical
path, then MTF.

The first external engine is [optiland](https://github.com/optiland/optiland). Engines sit behind one adapter
contract, so others can be added by a Python worker, a command line, file exchange or HTTP.

Status: Phase 0 (foundations) in progress. The full plan is in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Requirements

- Node `>=24.15.0 <25`. Sources are TypeScript run by Node's native type stripping; there is no build step.
- Optional, for real comparisons: a LensVisualizer checkout and a Python interpreter with optiland installed.
  Neither is needed for `npm run check`.

## Commands

```bash
npm ci
```

```bash
npm run check
```

```bash
node bin/lvrtc.mjs --help
```

`npm run check` runs the type check, lint, format check and tests.
