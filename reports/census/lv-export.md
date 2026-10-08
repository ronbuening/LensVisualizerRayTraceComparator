# LensVisualizer export census

Every lens of the LensVisualizer catalog, exported as an optical case at its default state: zoom 0, infinity
focus, wide open, the design image plane, on its reference line. A census is a snapshot of one LensVisualizer
checkout. It is informational: nothing asserts it, and it holds counts, hashes and lens keys only.

Rewrite it with `node bin/lvrtc.mjs export --all --census reports/census`.

| Input | Value |
| --- | --- |
| LensVisualizer commit | `d36f44b34473cf74c8a64889f38de893702fa26d` (clean) |
| Engine closure | `7eebe2396fae83736c6a3cfee1fe7de0137fc520dde3da67dced78446047b88f` (141 files) |
| Contract | 1.0 |

## Outcome

| Lenses | Exported | Not exportable | Threw | Lens files not indexed |
| --- | --- | --- | --- | --- |
| 891 | 868 | 23 | 0 | 0 |

A lens that is not exportable has a reason with a code, below. A lens whose export threw is a defect of the
exporter; a healthy census has none.

## Not exportable, by reason

A lens with several reasons is counted under each.

| Reason | Lenses |
| --- | --- |
| `diffractive-surface` | 8 |
| `folded-path` | 15 |
| `mixed-reference` | 1 |
| `non-refract-interaction` | 15 |
| `off-axis-image-plane` | 2 |
| `surface-profile-unsupported` | 2 |
| `tilted-image-plane` | 2 |

### `diffractive-surface` (8)

- `canon-ef-400mm-f4-do-is-usm`
- `canon-ef-70-300mm-f45-56-do-is-usm`
- `canon-rf-800mm-f11-is-stm`
- `canon-rf600mmf11-is-stm`
- `nikon-af-s-nikkor-300mm-f4e-pf-ed-vr`
- `nikon-af-s-nikkor-500mm-f56e-pf-ed-vr`
- `nikon-nikkor-z-800mm-f63-vr-s`
- `reference-folded-diffractive-plate`

### `folded-path` (15)

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

### `mixed-reference` (1)

- `sony-fe-14mm-f18-gm`

### `non-refract-interaction` (15)

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

### `off-axis-image-plane` (2)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `surface-profile-unsupported` (2)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

### `tilted-image-plane` (2)

- `reference-folded-diffractive-plate`
- `reference-newtonian-side-focus`

## Feature flags of the exported cases

| Flag | Cases |
| --- | --- |
| `aperture.annular` | 0 |
| `lines.multiple` | 0 |
| `object.finite` | 0 |
| `surface.asphere.even` | 392 |
| `surface.asphere.flat-base` | 2 |
| `surface.asphere.odd` | 52 |
| `surface.conic` | 181 |

## Provenance notes of the exported cases

| Note | Cases |
| --- | --- |
| `bulk-absorption` | 1 |
| `projection:fisheye-equidistant` | 3 |
| `projection:fisheye-equisolid` | 9 |

## Limits: the largest value an exported case needs

| Limit | Largest | Lens |
| --- | --- | --- |
| `asphere.maxPower` | 20 | `fujifilm-fujinon-gf-30mm-f35-r-wr` |
| `lines.count` | 1 | `agfa-color-magnolar-ii-100f45` |
| `surfaces.count` | 63 | `nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in` |
