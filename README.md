# LensVisualizer Ray-Trace Comparator (lvrtc)

lvrtc checks the optics of [LensVisualizer](https://github.com/ronbuening/LensVisualizer). It exports each lens as
LensVisualizer prepares it for tracing (a *lens state*: the lens at one zoom, focus and stop, with its wavelengths),
hands that same lens state to several engines, asks each the same questions, and compares the answers check by
check. The engines are LensVisualizer itself, a small exact *reference tracer* written in this repository from the
optics alone, and [optiland](https://github.com/optiland/optiland), an independent open-source optical design
library. The words used here are explained in [docs/GLOSSARY.md](docs/GLOSSARY.md), or by `lvrtc glossary`.

Below, `lvrtc` stands for `node bin/lvrtc.mjs`, run from this repository; `alias lvrtc='node bin/lvrtc.mjs'` makes
it a command in your shell.

## What it checks, and what it does not

- **Checks held to a limit** hand two engines the same input and pass or fail. A pass shows that, handed the same
  lens state, the engines build the same system, with the same first-order data, and trace the same rays to the
  same places and optical paths, within limits such as 1e-8 mm on a ray's hit points. The geometric and wave MTF
  checks apply this tool's one MTF calculation to each engine's trace of those rays, and LensVisualizer's own
  geometric MTF is held to a replay of its own sampling. The rays of LensVisualizer's spot, aberration, distortion,
  field-curve and vignetting tabs are checked the same way.
- **Side-by-side checks** set LensVisualizer's own analyses (its MTF, spots, distortion, field curves, vignetting,
  summary figures) beside optiland's own or this tool's independent estimates. Each engine uses its own method and
  sampling, so a difference is written down, marked "worth a look" when it is outside its review band, and fails
  nothing. Neither side is taken as the reference for the other.
- **What no check shows**: whether LensVisualizer's lens data are the maker's design (its prescriptions, glass
  data and stop sizes are handed to every engine as they are); which of two MTF methods is nearer a real lens; or
  anything about lens states the suites do not name.

`lvrtc checks` lists every check; `lvrtc checks <id>` says what one compares, what it shows, what it does not show,
which engines it is asked of and its limits.

## Requirements

- **Node `>=24.15.0 <25`**: `.nvmrc` names it, so `nvm use` picks it. The sources are TypeScript run directly by
  Node; there is no build step and no runtime package.
- **Python `>=3.10` as `python3`**, for the demonstration engines and the worker kit's own tests. Checking
  LensVisualizer does not need it; optiland brings an interpreter of its own.
- **A LensVisualizer checkout**, cloned with git:
  `git clone https://github.com/ronbuening/LensVisualizer.git`, then `git checkout f5b456fec` in it for the commit
  the committed results were taken at. lvrtc reads it and never writes to it. It needs no `npm install`: lvrtc
  loads only LensVisualizer's optics and lens files, which import no package.
  <!-- Checked by walking the imports of every LensVisualizer module the binding loads, in a git archive of
  f5b456fec outside both checkouts: 193 files, no bare package import, and none in any lens file. -->
- **An optiland checkout with its own virtual environment**, made with Python 3.11 or later. lvrtc runs
  optiland with that interpreter and never installs anything into it:

  <!-- Not yet tested from an empty environment: the maintainer's environment was made with uv
  (Python 3.14.8, numpy 2.3.5, scipy 1.16.3, numba 0.65.1, an editable install). Confirm these steps. -->

  ```bash
  git clone https://github.com/optiland/optiland.git
  cd optiland
  git checkout a9e544a2
  python3.11 -m venv .venv          # or any later python3.x
  .venv/bin/python -m pip install -e .
  ```

  The install must be of the checkout itself (`-e .`): lvrtc names optiland's version by the commit of its
  checkout and a hash of its sources.

**The committed results were taken at LensVisualizer `f5b456fec` and optiland `a9e544a2`.** On other commits, or
with other versions of Python, numpy, scipy or numba under optiland, every result is first marked *out of date*
(its lens data or engine code changed); checking again then says of each whether it is *still within its limits*
or *changed beyond its limits*. A LensVisualizer commit that changes a lens marks that lens's results out of date
too.

## Setup

```bash
git clone https://github.com/ronbuening/LensVisualizerRayTraceComparator.git
cd LensVisualizerRayTraceComparator
nvm use
npm ci
cp lvrtc.local.example.json lvrtc.local.json
```

`npm ci` installs the development tools only. Then set the two paths in your `lvrtc.local.json`, which git ignores:

| Key | Set it to | Or the environment variable |
|---|---|---|
| `lvPath` | your LensVisualizer checkout | `LVRTC_LV_PATH` |
| `engines.optiland.python` | the interpreter of optiland's virtual environment, `<optiland>/.venv/bin/python` | `LVRTC_OPTILAND_PYTHON` |
| `python` | a Python 3.10 or later for the demonstration engines and the worker kit's tests (default `python3`); checking LensVisualizer does not need it | `LVRTC_PYTHON` |

Relative paths are taken from this repository. Then ask whether the machine is ready:

```bash
lvrtc doctor
```

It reports Node, every configuration value and where it was set, the LensVisualizer checkout (its commit, whether
it has uncommitted changes, whether it loads) and optiland, with a `fix` line under anything that needs fixing,
and ends with what is ready. Without optiland, `lvrtc lenses`, `export`, `mtf` (LensVisualizer's own MTF) and
`run ... --engines lv,reference-tracer` work; `lvrtc check-lv` and `lvrtc baseline check` need it.

## Try it without LensVisualizer or optiland

```bash
lvrtc run test/fixtures/suites/fake-3-engines-ts.json --root test/fixtures/fake-root
lvrtc compare fake-3-engines-ts --root test/fixtures/fake-root
lvrtc report fake-3-engines-ts --root test/fixtures/fake-root
```

These run a small suite on three fake engines that know no optics, compare their answers, and write
`test/fixtures/fake-root/runs/fake-3-engines-ts/report.md` (under `$LVRTC_RUNS_DIR/fake-3-engines-ts/` when that is
set; each command prints the path it wrote). Run them again and the report is the same file, byte
for byte. With Python, `fake-3-engines.json` adds a fake engine in a Python worker.

## Check LensVisualizer

```bash
lvrtc check-lv --suite features   # start here: one lens for each kind of lens data
lvrtc check-lv                    # the benchmark: its ray checks, then its MTF checks
lvrtc check-lv --all              # every committed suite, one after another
```

`check-lv` first checks that the machine is ready and refuses, running nothing, unless LensVisualizer is a clean
git checkout that loads and optiland answers. Then it runs the checks of each committed result again against your
LensVisualizer and optiland and prints, suite by suite, whether the check is clean and how many records came out
"Unchanged", "Out of date, still within limits", "Side-by-side figure moved" or "Changed beyond limits" (the
outcomes are under [Reading the results](#reading-the-results)). `npm run verify:real` is the same command.

Answers already computed are kept in a result cache under `runs/store` and reused, so a second check is much
faster than the first. From an empty cache, `--suite features` took under a minute when it was first measured
(51 s with 4 jobs, before the checks of the tabs' own rays were added; expect a few minutes now). The benchmark's
ray checks take minutes, but its MTF checks take many hours and some 15 GB from an empty cache, and `--all` longer
still: run those on a cache that a first run has filled. On a filled cache a suite takes minutes.

Closer looks, each with `--help`:

```bash
lvrtc baseline check features                      # one suite, record by record
lvrtc mtf nikkor-z50f12                            # the MTF LensVisualizer's tab shows
lvrtc mtf nikkor-z50f12 --profile benchmark --engines lv,reference-tracer,optiland   # one lens's MTF, compared
lvrtc lenses list                                  # every lens key
lvrtc serve                                        # a dashboard at http://127.0.0.1:8077/
```

The suites are under `suites/`: `benchmark` (twelve lens configurations in eight conditions each), `features` (a
lens for each kind of lens data the benchmark lacks), `states` (other stops and zoom positions), `focus-stations`
(close focus), `folded` (mirror lenses), `diffractive`, and `catalog` (every lens; a dated snapshot that only the
maintainer runs). The committed reports are under `reports/`; `reports/validation-statement.md` sums them up.

## Reading the results

Each pair of engines that answered one request gets one verdict:

| Label | Stored as | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | every judged figure is at or below its limit |
| Fail: beyond limit | `FAIL` | a judged figure is above its limit |
| Side by side | `RECORDED` | two methods' answers, written down; not a failure |
| Side by side, worth a look | `ATTENTION` | a figure is outside its review band; not a failure |
| Not computed | `UNSUPPORTED` | one engine cannot compute what was asked; an answer, not a failure |
| Not judged (an earlier check failed) | `BLOCKED` | a check this one rests on failed for the same two engines |
| Error | `ERROR` | an engine gave no result, or the two cannot be compared |
| Within a known numerical floor | `FLOOR` | a pass under a floor the limits file may grant; it grants none today |

Checking a committed result again gives each record one outcome:

| Label | Stored as |
|---|---|
| Unchanged | `OK` |
| Out of date, still within limits | `REFRESHABLE` |
| Side-by-side figure moved (fails nothing) | `MOVED` |
| Changed beyond limits | `DRIFT` |
| New / No longer run | `NEW` / `GONE` |

A record out of date says why: its lens data, an engine's code, or the limits file changed. Every term is in
[docs/GLOSSARY.md](docs/GLOSSARY.md); `lvrtc glossary <word>` looks one up, including the older words some files
still use.

### Older ids

The checks and some engines were renamed so that each id says what it compares or computes; `lv` and `optiland`
kept theirs. Files written before the rename keep the old ids: the catalog's results, `docs/known-failures.json` and
its reproducer commands, and older run directories. lvrtc still reads an old id as the new one, saying so once per
command. `lvrtc glossary <old id>` says what an old check or engine id is now, and `lvrtc checks <old id>` shows
that check in full. `lvrtc checks` lists every check with its old id beside it, and
[docs/GLOSSARY.md](docs/GLOSSARY.md) every engine with its own.

## Troubleshooting

- **Start with `lvrtc doctor`.** Every `fix` line names the key of `lvrtc.local.json`, or the environment
  variable, to set.
- **`check-lv` refuses a LensVisualizer checkout with uncommitted changes.** Commit or set them aside, or point
  `lvPath` at a clean clone.
- **Memory.** `lvrtc check-lv` runs up to 4 jobs at once and lowers that to what the memory budget allows. Every
  other command runs one job at a time unless `--jobs <n>` asks for more, and refuses a `--jobs` beyond the budget,
  saying the most it allows. A job is counted as 2.5 GiB (4 GiB with two optiland workers) against a budget of a
  quarter of the installed memory less 2 GiB; `--memory-budget <GiB>` sets another.
- **Disk.** Runs and the result cache are written under `runs/` in this repository. Set `LVRTC_RUNS_DIR` to
  another directory to keep a trial elsewhere.
- **optiland's first start is slow** (about 17 s while numba compiles into `.cache/`); later starts take about 3 s.

## More

- [docs/GLOSSARY.md](docs/GLOSSARY.md): every term, check, engine, suite, verdict and outcome.
- [CONTRIBUTING.md](CONTRIBUTING.md): tests, npm scripts, result-cache upkeep and the commands behind each
  comparison.
- [docs/REFERENCE.md](docs/REFERENCE.md): every command's options, the engines and what each check measured.
- [docs/HISTORY.md](docs/HISTORY.md): how the project got here.
- [contract/CONTRACT.md](contract/CONTRACT.md): the message format every engine speaks.
