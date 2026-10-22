# LensVisualizer export census

Every lens of the LensVisualizer catalog, exported as an optical case at infinity focus, wide open, at the
design image plane, on its reference line: a prime in its one state, a zoom at both ends, wide (zoom 0) and
tele (zoom 1). A census is a snapshot of one LensVisualizer checkout. It is informational: nothing asserts it,
and it holds counts, hashes and lens keys only.

Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

| Input | Value |
| --- | --- |
| LensVisualizer commit | `ab0fd4cf94836492b28470953812ed4afc98c0c6` (clean) |
| Engine closure | `94778d3d4f0bc86fb092cbc7391f13f1b76780816257d30b074ea41a8c7a119b` (175 files) |
| Contract | 1.0 |

## Outcome

989 lenses, 319 of them zooms, in 1308 states; 0 lens files not indexed.

| States | Count | Exported | Not exportable | Threw |
| --- | --- | --- | --- | --- |
| Primes | 670 | 647 | 23 | 0 |
| Zooms, wide end | 319 | 318 | 1 | 0 |
| Zooms, tele end | 319 | 318 | 1 | 0 |
| All | 1308 | 1283 | 25 | 0 |

A state that is not exportable has a reason with a code, below. A state whose export threw is a defect of the
exporter; a healthy census has none.

## Not exportable, by reason

A state with several reasons is counted under each. A zoom is named once, with the end where a reason
applies to one end only.

| Reason | States | Lenses |
| --- | --- | --- |
| `diffractive-surface` | 9 | 8 |
| `folded-path` | 16 | 16 |
| `mixed-reference` | 1 | 1 |
| `non-refract-interaction` | 16 | 16 |
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

### `folded-path` (16 states, 16 lenses)

- `carl-zeiss-mirotar-500f45`
- `minolta-250mm-f56-rf`
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

- `samyang-af-35mm-f2p8-fe`

### `non-refract-interaction` (16 states, 16 lenses)

- `carl-zeiss-mirotar-500f45`
- `minolta-250mm-f56-rf`
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
| `aperture.unclipped` | 253 |
| `lines.multiple` | 0 |
| `object.finite` | 0 |
| `surface.asphere.even` | 632 |
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
