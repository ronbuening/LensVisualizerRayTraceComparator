# LensVisualizer Ray-Trace Comparator

Cross-checks [LensVisualizer](https://github.com/ronbuening/LensVisualizer)'s ray trace and MTF against other
optical engines. It exports a LensVisualizer lens as an engine-neutral case, asks every engine the same questions,
and compares the answers rung by rung: the built system, paraxial data, identical rays, optical path, then MTF.

**Status.** Phases 0 and 1 of the [plan](docs/IMPLEMENTATION_PLAN.md) are complete. LensVisualizer (`lv`) and the
comparator's own reference tracer (`ref`) answer rungs R0 to R3 and agree on the benchmark suite, and `lvrtc mtf`
prints the MTF that LensVisualizer's own MTF tab shows. The first external engine,
[optiland](https://github.com/optiland/optiland), is Phase 2: the engine `optiland` builds every case in optiland
and answers rungs R0 to R3: the built system, its first-order data, the same rays traced by optiland's own tracer
and their optical paths, on which the three engines agree on both suites
([measured](docs/REFERENCE.md#phase-2-r0-to-r3-on-three-engines)). Baselines of those runs close the phase.
Phase 3, MTF, has begun: the comparator's own geometric estimator reproduces LensVisualizer's geometric MTF on a
replay of LensVisualizer's sampling to 1.3e-14, with every grid size and ray count the same, on the benchmark wide
open and at f/8, at the design plane and at LensVisualizer's best focus (rung R4f,
[measured](docs/REFERENCE.md#the-mtf-recipe-the-replay-and-rung-r4f)); and the geometric MTF of the same rays, as
LensVisualizer, the reference tracer and optiland each land them, agrees within 5.4e-8 on the same benchmark, the
two exact tracers within 1.2e-11 (rung R4, gated at 1e-7,
[measured](docs/REFERENCE.md#rung-r4-the-geometric-mtf-of-the-same-rays)). The comparator's wave estimator, Hopkins'
autocorrelation of the pupil function from the optical paths of the same rays, is held to closed forms
([the wave OTF](docs/REFERENCE.md#the-wave-otf)), and on the three engines' traces of the same rays it agrees
within 3.2e-6 wherever its lattice samples the wavefront, the two exact tracers within 1.2e-9 (rung R6a, gated at
4e-5; a fast lens wide open is undersampled and not judged). Beside LensVisualizer's own diffraction MTF it stays
within the plan's bands at f/8 and marks five of 96 runs for attention (rung R6b, recorded;
[measured](docs/REFERENCE.md#rungs-r6a-and-r6b-the-wave-mtf)). The engine `optiland` answers with optiland's own
FFT MTF, one line and one field at a time, a field it cannot compute being a row with the reason
([optiland's own MTF](docs/REFERENCE.md#optilands-own-mtf)). Rung R5 sets it beside LensVisualizer's product MTF
and the wave estimator, field by field, with the class of every difference: recorded and never gated. At f/8 all
24 reference-line runs of the benchmark are inside the plan's bands (at most 0.0041 on the axis, 0.0088 off it);
wide open 15 of 24 are marked for attention ([measured](docs/REFERENCE.md#rung-r5-the-engines-own-mtf)). A report
states what it does not cover, and its wording is linted.

## Requirements

- Node `>=24.15.0 <25`. The sources are TypeScript run directly by Node; there is no build step.
- Python `>=3.10` as `python3`, for the worker kit and its tests. Nothing is installed into it.
- A LensVisualizer checkout, for anything that involves a real lens.
- A Python interpreter that can import optiland, for the engine `optiland`. Nothing is installed into it and
  nothing is written into the optiland checkout.

## Setup

```bash
npm ci
```

Installs the development tools. The comparator itself has no runtime dependencies.

### Point it at your LensVisualizer and optiland

```bash
cp lvrtc.local.example.json lvrtc.local.json
```

**The configuration needs adjusting for your own installs of both programs.** The committed `lvrtc.config.json`
assumes they sit beside this repository: LensVisualizer at `../../LensVisualizer/LensVisualizer` and optiland's
interpreter at `../../optiland/optiland/.venv/bin/python`. Unless yours are laid out that way, edit the copy you
just made:

| Key in `lvrtc.local.json` | Set it to |
|---|---|
| `lvPath` | your LensVisualizer checkout |
| `engines.optiland.python` | a Python interpreter that can import optiland |

`lvrtc.local.json` is ignored by git and overrides the committed file. The environment variables `LVRTC_LV_PATH`
and `LVRTC_OPTILAND_PYTHON` override both. Relative paths are resolved against this repository.

```bash
node bin/lvrtc.mjs doctor
```

Shows what the comparator found: the Node version, every configuration value and which file or variable set it,
the LensVisualizer checkout with its commit, the Python interpreter, and the optiland the engine `optiland` runs:
its commit, a hash of its sources, the versions it computes with and its fingerprint. A missing LensVisualizer or
optiland is reported, not an error, so run this to check your paths.

## Try it without LensVisualizer or optiland

```bash
node bin/lvrtc.mjs run test/fixtures/suites/fake-3-engines.json --root test/fixtures/fake-root
```

Runs a small suite on three fake engines that know no optics: a TypeScript one, a Python one, and one that
declares it cannot answer. Without Python, use `fake-3-engines-ts.json` here and `fake-3-engines-ts` below.

```bash
node bin/lvrtc.mjs compare fake-3-engines --root test/fixtures/fake-root
```

Compares what the engines answered, each against a reference engine and every engine against every other.

```bash
node bin/lvrtc.mjs report fake-3-engines --root test/fixtures/fake-root
```

Writes `test/fixtures/fake-root/runs/fake-3-engines/report.md`. Run the three again and the report is the same
file, byte for byte.

## Commands

### Check the code

```bash
npm run check
```

Runs the type check, lint, format check, the TypeScript tests and the Python tests of the worker kit. It needs
neither LensVisualizer nor optiland. Run it before every commit.

```bash
npm run test:lv
```

Runs the tests that need the real LensVisualizer checkout. They are not part of `npm run check`; each skips,
saying why, when LensVisualizer is not configured. They write nothing into LensVisualizer.

```bash
npm run test:optiland
```

Runs the tests that need the real optiland, with the interpreter of `engines.optiland.python`. They are not part
of `npm run check` either, skip the same way, and prove that nothing was written into the optiland checkout. The
tests that set optiland against LensVisualizer need both.

### Look at LensVisualizer's lenses

```bash
node bin/lvrtc.mjs lenses list
```

Lists every lens of the LensVisualizer catalog: key, name and file.

```bash
node bin/lvrtc.mjs lenses show nikkor-z50f12
```

Prints one lens as LensVisualizer prepares it for tracing: a row per surface, the stop and its radius, and the
image plane. Add `--zoom 1` for the tele end of a zoom.

```bash
node bin/lvrtc.mjs export nikkor-z50f12 --aperture f/2.8 --lines photopic --out /tmp/z50.case.json
```

Writes one lens in one state as an optical case, the document every engine is asked about. What a case cannot
express, such as a mirror or a diffractive surface, is refused with a reason code and never approximated.

```bash
node bin/lvrtc.mjs export --all --census reports/census
```

Exports every lens, every zoom at both ends, and rewrites the committed [census](reports/census/lv-export.md):
how many states export, and the lens keys that do not, by reason.

### Compare engines

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref --rungs r0,r1,r2,r3
```

Runs a suite: for every lens, rung and engine it asks the engine and stores the answer. Stored answers are reused,
so a run that was interrupted resumes by being run again. `--engines` and `--rungs` are optional.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r0,r1,r2,r3
```

Adds optiland: it builds every lens in optiland and reads the built system back (R0), so a translation error
shows before a ray is traced, gives optiland's own focal length, cardinal points and pupils (R1), and traces the
very rays LensVisualizer launches with optiland's own tracer: where they go (R2) and how long their paths are
(R3). What comes of it is in [docs/REFERENCE.md](docs/REFERENCE.md#phase-2-r0-to-r3-on-three-engines).

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r2,r3,r4
```

Adds the geometric MTF of those rays (R4): one estimator, the comparator's own, on where each engine lands the
rays of a field, at every line of the lens and at the frequencies of LensVisualizer's MTF. It traces nothing that
R2 and R3 have not traced.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --rungs r4f
```

Holds LensVisualizer's own geometric MTF to the comparator's estimator on a replay of LensVisualizer's sampling
(R4f): the same rays, the same grids, the same counts. It is asked of two engines of its own, `lv` and `replay`,
whatever `--engines` names, and takes about three minutes on the benchmark.

```bash
node bin/lvrtc.mjs run suites/benchmark.json --engines lv,ref,optiland --rungs r6a
node bin/lvrtc.mjs run suites/benchmark.json --rungs r6b
```

The wave MTF. R6a applies the comparator's wave estimator to each engine's trace of the same rays, on a lattice
twice as fine as the run's own, which it traces for that (about 8 minutes and 15 GB of the store on the
benchmark); a field whose lattice does not sample the wavefront, or has not converged, is reported and not judged.
R6b sets LensVisualizer's own diffraction MTF beside that estimator on LensVisualizer's rays: two engines of its
own, `lv` and `wave`, recorded and never gated (about 13 minutes).

```bash
node bin/lvrtc.mjs run suites/benchmark.json --rungs r5
```

R5 sets three engines' own diffraction MTF side by side: LensVisualizer's product MTF (`lv`), optiland's FFT MTF
(`optiland`) and the comparator's wave estimator on LensVisualizer's rays (`wave`). It is run only where it is
named, since it needs optiland, and is recorded and never gated; a run whose figures are outside their band asks
optiland once more, at 512 rays. About 8 minutes on the benchmark. A photopic run has no optiland row: its FFT
MTF is of one line.

```bash
node bin/lvrtc.mjs compare benchmark
```

Compares the stored answers of that run and gives each pair of engines a verdict per rung. It exits 1 when a
pair is `FAIL` or `ERROR`.

```bash
node bin/lvrtc.mjs report benchmark
```

Writes `runs/benchmark/report.md`: every run, rung and pair, with where each largest difference occurs.

### Baselines

```bash
node bin/lvrtc.mjs baseline write benchmark
```

After the three-engine `run` and `compare` above: rewrites the committed record of what the engines agreed on,
[baselines/benchmark.json](baselines/benchmark.json), and the report rendered from it,
[reports/benchmark/rays.md](reports/benchmark/rays.md). The same three commands with `features` rewrite the
feature suite's. That sequence regenerates everything that is committed under `baselines/` and `reports/` except
the census.

```bash
node bin/lvrtc.mjs baseline check benchmark
```

Runs the suite again on the baseline's engines and says, record by record, whether the baseline is still of the
lenses and engines at hand: `OK`, `STALE` (a lens or an engine has changed; `REFRESHABLE` if the figures still
hold) or `DRIFT` (a verdict changed or a figure moved past its tolerance). Only `DRIFT`, `FAIL` and `ERROR` exit 1.

```bash
node bin/lvrtc.mjs verify
```

Needs no engine and is part of `npm run check`: validates every committed baseline and makes the committed
reports anew from the baselines, failing on a byte of difference. It cannot see a lens that has changed;
`baseline check` does.

```bash
node bin/lvrtc.mjs engine conformance ref
```

Checks that one engine speaks the contract correctly, whatever way it is reached.

```bash
node bin/lvrtc.mjs engine conformance optiland
```

The same for optiland: it starts the Python worker with the configured interpreter, which takes a few seconds.

### LensVisualizer's own MTF

```bash
node bin/lvrtc.mjs mtf nikkor-z50f12
```

Prints the MTF that LensVisualizer's MTF tab shows for the lens, asked exactly as the tab asks: sagittal and
tangential at 10 and 30 cycles/mm for each field, the focus shift, and the traced f-number.

```bash
node bin/lvrtc.mjs mtf nikon-z-24-70f4s
```

For a zoom, prints two tables: the wide end and the tele end. `--zoom <t>` asks for one position only, and
`--aperture f/8` for the tab's f/8 comparison.

## Suites

A suite is a list of lenses and the states to compare them in. A zoom with no stated position is compared at
both ends.

| Suite | Holds |
|---|---|
| `suites/smoke.json` | two small primes and one small zoom |
| `suites/benchmark.json` | the 12 benchmark configurations, each on its reference line and on the photopic lines |
| `suites/features.json` | one lens for each kind of surface or aperture the benchmark lacks |

## The rungs

| Rung | Compares | Gate |
|---|---|---|
| R0 | the system each engine built: vertices, shapes, apertures, indices, sag | equal; sag to rounding |
| R1 | focal length, focal and principal points, back focus, pupils | 1e-9 mm |
| R2 | the same rays in every engine: hits, exit direction, landing, which rays pass | 1e-8 mm; 1e-9 in direction; no ray passing in one engine only |
| R3 | optical path of those rays | 2e-5 waves |

Verdicts are `PASS`, `FLOOR` (a pass: LensVisualizer's own intersection tolerance, confirmed by `ref`), `FAIL`,
`BLOCKED`, `UNSUPPORTED` and `ERROR`. MTF rungs arrive with Phase 3.

## More

- [docs/REFERENCE.md](docs/REFERENCE.md): every command's options and exit codes, the engines, the rungs with
  their measured results, configuration and workers.
- [contract/CONTRACT.md](contract/CONTRACT.md): the engine-neutral contract every engine speaks.
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md): the phases, stages and comparison ladder.
- [docs/gotchas.md](docs/gotchas.md): what an engine does that a comparison has to know about.
