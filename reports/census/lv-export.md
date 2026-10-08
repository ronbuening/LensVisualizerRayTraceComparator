# LensVisualizer export census

Every lens of the LensVisualizer catalog, exported as an optical case at infinity focus, wide open, at the
design image plane, on its reference line: a prime in its one state, a zoom at both ends, wide (zoom 0) and
tele (zoom 1). A census is a snapshot of one LensVisualizer checkout. It is informational: nothing asserts it,
and it holds counts, hashes and lens keys only.

Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

| Input | Value |
| --- | --- |
| LensVisualizer commit | `ed78cf40b6ebf24d6583003eaa6e77c1ba8bac62` (clean) |
| Engine closure | `1827eefe0737daa58c8e34ba1b8e570986fc081fef8b467e325d4896375b16b0` (151 files) |
| Contract | 1.0 |

## Outcome

891 lenses, 297 of them zooms, in 1188 states; 0 lens files not indexed.

| States | Count | Exported | Not exportable | Threw |
| --- | --- | --- | --- | --- |
| Primes | 594 | 572 | 22 | 0 |
| Zooms, wide end | 297 | 296 | 1 | 0 |
| Zooms, tele end | 297 | 296 | 1 | 0 |
| All | 1188 | 1164 | 24 | 0 |

A state that is not exportable has a reason with a code, below. A state whose export threw is a defect of the
exporter; a healthy census has none.

## Not exportable, by reason

A state with several reasons is counted under each. A zoom is named once, with the end where a reason
applies to one end only.

| Reason | States | Lenses |
| --- | --- | --- |
| `diffractive-surface` | 9 | 8 |
| `folded-path` | 15 | 15 |
| `mixed-reference` | 1 | 1 |
| `non-refract-interaction` | 15 | 15 |
| `off-axis-image-plane` | 2 | 2 |
| `surface-profile-unsupported` | 2 | 2 |
| `tilted-image-plane` | 2 | 2 |

### `diffractive-surface` (9 states, 8 lenses)

- `canon-ef-400mm-f4-do-is-usm`
- `canon-ef-70-300mm-f45-56-do-is-usm`
- `canon-rf-800mm-f11-is-stm`
- `canon-rf600mmf11-is-stm`
- `nikon-af-s-nikkor-300mm-f4e-pf-ed-vr`
- `nikon-af-s-nikkor-500mm-f56e-pf-ed-vr`
- `nikon-nikkor-z-800mm-f63-vr-s`
- `reference-folded-diffractive-plate`

### `folded-path` (15 states, 15 lenses)

- `carl-zeiss-mirotar-500f45`
- `minolta-af-reflex-500mm-f8`
- `nikon-reflex-nikkor-1000mm-f11`
- `nikon-reflex-nikkor-500mm-f8-new`
- `nikon-reflex-nikkor-c-500mm-f8`
- `reference-annular-obscured-mirror`
- `reference-annular-ring-blocker`
- `reference-cassegrain-back-focus`
- `reference-folded-diffractive-plate`
- `reference-gregorian-secondary`
- `reference-maksutov-cassegrain-meniscus`
- `reference-mangin-second-surface-mirror`
- `reference-newtonian-side-focus`
- `reference-spherical-primary-mirror`
- `vivitar-s1-450-f45`

### `mixed-reference` (1 state, 1 lens)

- `sony-fe-14mm-f18-gm`

### `non-refract-interaction` (15 states, 15 lenses)

- `carl-zeiss-mirotar-500f45`
- `minolta-af-reflex-500mm-f8`
- `nikon-reflex-nikkor-1000mm-f11`
- `nikon-reflex-nikkor-500mm-f8-new`
- `nikon-reflex-nikkor-c-500mm-f8`
- `reference-annular-obscured-mirror`
- `reference-annular-ring-blocker`
- `reference-cassegrain-back-focus`
- `reference-folded-diffractive-plate`
- `reference-gregorian-secondary`
- `reference-maksutov-cassegrain-meniscus`
- `reference-mangin-second-surface-mirror`
- `reference-newtonian-side-focus`
- `reference-spherical-primary-mirror`
- `vivitar-s1-450-f45`

### `off-axis-image-plane` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `surface-profile-unsupported` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `tilted-image-plane` (2 states, 2 lenses)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

## Feature flags of the exported cases

| Flag | Cases |
| --- | --- |
| `aperture.annular` | 0 |
| `lines.multiple` | 0 |
| `object.finite` | 0 |
| `surface.asphere.even` | 580 |
| `surface.asphere.flat-base` | 2 |
| `surface.asphere.odd` | 78 |
| `surface.conic` | 270 |

## Provenance notes of the exported cases

| Note | Cases |
| --- | --- |
| `bulk-absorption` | 1 |
| `projection:fisheye-equidistant` | 3 |
| `projection:fisheye-equisolid` | 12 |

## Limits: the largest value an exported case needs

| Limit | Largest | Lens |
| --- | --- | --- |
| `asphere.maxPower` | 20 | `fujifilm-fujinon-gf-30mm-f35-r-wr` |
| `lines.count` | 1 | `agfa-color-magnolar-ii-100f45` |
| `surfaces.count` | 63 | `nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in` (wide) |
