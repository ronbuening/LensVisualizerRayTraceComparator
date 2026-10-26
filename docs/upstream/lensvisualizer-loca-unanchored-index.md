# LensVisualizer: chromatic channels of d-line catalog glasses are not anchored to the authored index

Status: **open**. For the owner; not filed. Observed at LV `45e6f852d` (clean; engine closure `afef1f81`); the
census below was taken at `36b5768bf` (clean), which changes nothing under `src/optics` or `src/lens-data` since.
The comparator reports LensVisualizer's sections as they are and changes no gate for this. Rung R8b sets every
affected line aside as data (`indices-differ`) before any figure is taken. This brief changes no LV source or
prescription. It holds results and lens keys only.

## What LensVisualizer does

The chromatic tab traces each medium at its channel's index (`src/optics/trace/rayAdapters.ts:526`):
`indexAtSurface: channel ? (i, nd) => state.lens.dispersion[i]?.indexAt(channel) ?? nd : undefined`.
Its four channels are R, G, B and V. **LensVisualizer's G channel is its reference channel, not the Fraunhofer g
line.** It is the d line (587.56 nm) for a lens of d-line indices, and the e line (546.07 nm) for one whose
elements all state e-line indices. V is the g line (435.83 nm).

The channel indices come from `makeSurfaceDispersion` in `src/optics/chromatic/materialResolver.ts`. For a glass it
matched to a catalog entry, the two reference lines are treated differently:

- **A native e-line element is anchored** (`materialResolver.ts:184-188`). The anchor is
  `const anchor = ne - evaluateSellmeier(entry, E_LINE_CHANNEL_NM.G);`, R, B and V add it, and the G channel
  returns the authored `ne` itself.
- **A d-line element is not anchored** (`materialResolver.ts:196-198, 208`). Every channel, G included, is the
  catalog's own value: `const nG = evaluateSellmeier(entry, CHANNEL_NM.G);`. At the d line that is not the
  authored `nd`. It is off by as much as the catalog match accepts, which is `GLASS_ND_TOLERANCE = 3e-3` in
  `glassCatalog.ts:33`.
- **The MTF path is anchored for both lines** (`anchoredIndexAtWavelength`, `src/optics/chromatic/indexResolver.ts:130-146`).
  Its index is `surface.nd + evaluateSellmeier(entry, λ) - evaluateSellmeier(entry, referenceNm)`. Its own
  comment (lines 117-121) names the defect this prevents: a substituted glass "would then defocus the design by that
  offset rather than by dispersion".
- **The aberrations tab traces the authored indices.**

So two of LensVisualizer's own sections give different d-line foci for the same lens. The aberrations tab traces
the authored `nd`; the chromatic tab's G channel traces the catalog's index at d.

## Measured

**Rays are not the cause.** R8a traces LensVisualizer's own axial rays in `lv`, `ref` and `optiland`, at the case's
indices, and they agree within 4.7e-13 mm (transverse) over 1,728 pairs of the benchmark. The difference below
comes from the indices. Each row is a benchmark configuration on its reference line, at the design plane:

- **Index offset:** the largest |G-channel index − authored nd| over the lens's media (`sampling.indexMaxDelta`).
- **Focus difference:** LensVisualizer's G-channel marginal focus minus optiland's at the authored indices, at the
  same pupil fraction.

| Lens key | Index offset | Focus difference, wide open | Focus difference, f/8 |
|---|---:|---:|---:|
| `nikon-z-24-70f4s` (tele) | 2.30e-4 | −2.97e-2 mm | −2.88e-2 mm |
| `nikon-z-24-70f4s` (wide) | 2.30e-4 | −7.03e-3 mm | −7.04e-3 mm |
| `nikkor-z50f12` | 7.00e-4 | +4.28e-3 mm | +1.94e-2 mm |
| `sigma-35mm-f14-dg-hsm-a` | 6.79e-6 | −1.85e-3 mm | −1.37e-3 mm |
| `canon-ef-135-f2l-usm` | 5.30e-6 | +1.74e-3 mm | +1.53e-3 mm |
| `sony-fe-400mm-f28-gm-oss` | 6.79e-6 | +1.55e-3 mm | +1.46e-3 mm |
| `nikon-z-135f18-plena` | 4.89e-6 | −1.40e-3 mm | −1.21e-3 mm |
| `sigma-45mm-f28-dg-dn-contemporary` | 4.93e-6 | −7.47e-4 mm | −6.18e-4 mm |
| `sigma-105mm-f28-dg-dn-macro-art` | 4.89e-6 | −6.72e-4 mm | −6.81e-4 mm |
| `nikon-z-mc-105f28` | 5.46e-6 | +2.40e-4 mm | +1.98e-4 mm |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` | 6.79e-6 | −1.43e-4 mm | −1.09e-4 mm |
| `sony-fe-20mm-f18-g` | 7.68e-9 | −2.01e-6 mm | −1.36e-6 mm |

The Z 50 mm f/1.2 has three media off their catalog matches, by 4.3e-4, −6.5e-4 and 7.0e-4. The Z 24-70 mm f/4
has one. One catalog glass, whose fit misses its nd by 6.79e-6, is shared by three of the lenses: Sigma 35 mm,
Sony FE 400 mm and GF 63 mm.

The relative focus that the chart plots (C − d and F − d) moves by 1e-4 mm at most. The offset moves the three
lines nearly alike. The absolute focus shift the section returns (`focusShiftMm`) and the image-plane span of its
fans are those of the catalog's lens, not the authored one.

## Which lenses are affected

The census asks the prepared state of every catalog lens (`prepareRuntimeState(L, 0, 0)`) for the G-channel index
of each medium (`state.lens.dispersion[i].indexAt("G")`) and compares it with the medium's authored `nd`. It runs
through the comparator's binding and traces nothing.

- **881 of the 1,014 lenses** have at least one medium whose G-channel index is not its authored index.
- Every one of those 9,537 media is resolved by the `sellmeier` tier.
- The other 133 lenses have none. That includes the 41 lenses of native e-line indices, whose tier is anchored.

| Largest offset of a lens | Lenses |
|---|---:|
| 0 | 133 |
| below 1e-8 | 5 |
| 1e-8 to 1e-6 | 50 |
| 1e-6 to 1e-5 | 397 |
| 1e-5 to 1e-4 | 101 |
| 1e-4 and above | 328 |

The largest offset is 3.0e-3, which is the acceptance tolerance itself. Examples are `viltrox-af-35f18-fe`,
`viltrox-af-50mm-f18-fe`, `viltrox-af-56mm-f14-e`, `nikkor-105-f14e-ed` and `sony-fe-400-800-f63-8-g-oss`.

## Suggested fix

Anchor the d-line Sellmeier tier as the e-line tier and the MTF path already are. Inside `if (entry)` of
`makeSurfaceDispersion`:

- Let `const nd = surface.nd; const anchor = nd - evaluateSellmeier(entry, CHANNEL_NM.G);`.
- Add `anchor` to the catalog R and B values, and to V where V comes from the catalog. The `dPgF` branch already
  builds V from the anchored B and R.
- Return `nd` for G.

The tier then borrows only the catalog's dispersion, which is what `anchoredIndexAtWavelength` does. Its G channel
equals the authored index, as the Abbe and line-index tiers' do by construction.

Expected effects:

- **Unchanged:** the aberrations tab and every MTF.
- **Changed:**
  - the chromatic tab's absolute foci, lateral colour and fan spans of the 881 lenses;
  - every other reader of `state.lens.dispersion[i].indexAt(channel)`, such as the coloured ray diagram.
- **In the comparator:** R8b's colour lines would have `indexMaxDelta` 0 and enter its figures, and the
  `materialResolver` canaries in `test/integration/lv/canaries.test.ts` would need the new lines.

Suggested LV regression tests:

- A d-line element matched to a catalog glass whose nd differs from the authored one: its G channel equals the
  authored `nd` to the bit, and its R, B and V channels equal `anchoredIndexAtWavelength` at C, F and g.
- A native e-line element: unchanged, bit for bit.
- A lens with no catalog match: its channels unchanged, bit for bit.
