# LensVisualizer export census

Every lens of the LensVisualizer catalog, exported as an optical case at infinity focus, wide open, at the
design image plane, on its reference line: a prime in its one state, a zoom at both ends, wide (zoom 0) and
tele (zoom 1). A census is a snapshot of one LensVisualizer checkout. It is informational: nothing asserts it,
and it holds counts, hashes and lens keys only.

This census records declared geometry. Folded-path confirmation on a run's coarse/fine ray sets is recorded
when that run is prepared.

Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

| Input | Value |
| --- | --- |
| LensVisualizer commit | `2e046d712fa5f6631ace3b8963d18827b909a37f` (clean) |
| Engine closure | `45a0b6c967b4fedafa92410f94bbbf77db5cfde20e2da87b331dfd6ed9258d12` (177 files) |
| Contract | 1.0 |

## Outcome

995 lenses, 325 of them zooms, in 1320 states; 0 lens files not indexed.

| States | Count | Exported | Not exportable | Threw |
| --- | --- | --- | --- | --- |
| Primes | 670 | 656 | 14 | 0 |
| Zooms, wide end | 325 | 324 | 1 | 0 |
| Zooms, tele end | 325 | 324 | 1 | 0 |
| All | 1320 | 1304 | 16 | 0 |

A state that is not exportable has a reason with a code, below. A state whose export threw is a defect of the
exporter; a healthy census has none.

## Not exportable, by reason

A state with several reasons is counted under each. A zoom is named once, with the end where a reason
applies to one end only.

| Reason | States | Lenses |
| --- | --- | --- |
| `diffractive-surface` | 9 | 8 |
| `folded-auto-path` | 6 | 6 |
| `mixed-reference` | 1 | 1 |
| `off-axis-image-plane` | 2 | 2 |
| `surface-profile-unsupported` | 2 | 2 |
| `tilted-image-plane` | 2 | 2 |
| `tilted-surface` | 1 | 1 |

### `diffractive-surface` (9 states, 8 lenses)

- `canon-ef-400mm-f4-do-is-usm`
- `canon-ef-70-300mm-f45-56-do-is-usm`
- `canon-rf-800mm-f11-is-stm`
- `canon-rf600mmf11-is-stm`
- `nikon-af-s-nikkor-300mm-f4e-pf-ed-vr`
- `nikon-af-s-nikkor-500mm-f56e-pf-ed-vr`
- `nikon-nikkor-z-800mm-f63-vr-s`
- `reference-folded-diffractive-plate`

### `folded-auto-path` (6 states, 6 lenses)

- `carl-zeiss-mirotar-500f45`
- `minolta-250mm-f56-rf`
- `reference-annular-ring-blocker`
- `reference-cassegrain-back-focus`
- `reference-newtonian-side-focus`
- `vivitar-s1-450-f45`

### `mixed-reference` (1 state, 1 lens)

LensVisualizer data issue: d- and e-referenced glasses lack wavelength data for a common reference line.

- `samyang-af-35mm-f2p8-fe`

### `off-axis-image-plane` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `surface-profile-unsupported` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `tilted-image-plane` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `tilted-surface` (1 state, 1 lens)

- `reference-folded-diffractive-plate`

## Feature flags of the exported cases

| Flag | Cases |
| --- | --- |
| `aperture.annular` | 7 |
| `aperture.unclipped` | 253 |
| `lines.multiple` | 0 |
| `object.finite` | 0 |
| `path.folded` | 9 |
| `surface.asphere.even` | 634 |
| `surface.asphere.flat-base` | 2 |
| `surface.asphere.odd` | 81 |
| `surface.conic` | 295 |

## Provenance notes of the exported cases

| Note | Cases |
| --- | --- |
| `bulk-absorption` | 2 |
| `projection:fisheye-equidistant` | 4 |
| `projection:fisheye-equisolid` | 15 |

## Limits: the largest value an exported case needs

| Limit | Largest | Lens |
| --- | --- | --- |
| `asphere.maxPower` | 20 | `fujifilm-fujinon-gf-30mm-f35-r-wr` |
| `lines.count` | 1 | `agfa-color-magnolar-ii-100f45` |
| `surfaces.count` | 63 | `nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in` (wide) |
