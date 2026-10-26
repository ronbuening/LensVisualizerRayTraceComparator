# Contract v1

The engine-neutral exchange format of the comparator. Everything that crosses a boundary is one of the documents
defined here: between a case source and the orchestrator, between the orchestrator and an engine over any
transport, and between a run and the result store. TypeScript and Python read the same files.

- **Source of truth**: the JSON Schema files in [`schema/v1/`](schema/v1). The TypeScript types in `src/contract/`
  mirror them.
- **Validator**: a small subset validator, `src/contract/validate.ts`, ported to Python for the worker kit. A
  schema that uses a keyword outside the subset is refused when it is loaded.
- **Fixtures**: [`fixtures/v1/`](fixtures/v1) holds valid and invalid documents of every kind. Both
  implementations must accept and reject them identically.

This document fixes what the schemas cannot say: frame, units, signs, identity and versioning.

## Conventions

| Subject | Rule |
|---|---|
| Lengths | millimetres |
| Wavelengths | nanometres |
| Angles | degrees |
| Spatial frequency | cycles per millimetre |
| Propagation | light travels toward +z |
| Origin | the first lens vertex is at z = 0; every other `z` is measured from it |
| Transverse axes | x is sagittal, y is meridional: field points lie in the y-z plane |
| Radius sign | `radius` > 0 puts the centre of curvature toward +z |
| Index after a surface | the refractive index of the medium that follows the surface; air is 1 |
| Field angle sign | a positive field angle is an object toward +y |
| MTF axes | sagittal MTF is for frequency along image x; tangential MTF is for frequency along image y |
| Timestamps | none, anywhere; nor machine information |

**Field angle.** For a positive field angle θ and an object at infinity, the rays arrive travelling toward −y:
the chief ray has slope dy/dz = −tan θ, direction cosines (0, −sin θ, cos θ). A positive lens images that object
at −y. This is LensVisualizer's frame, so its rays need no transform. An engine with the opposite convention
mirrors y in its adapter.

**Sag.** A surface's sag at radial height r, measured from its vertex along +z, is

```
z(r) = c r^2 / (1 + sqrt(1 - (1 + conic) c^2 r^2)) + sum over terms of coeff * r^power
```

with `c = 1/radius`, and `c = 0` when `radius` is null. `conic` is the conic constant: 0 for a sphere, −1 for a
paraboloid. A term's `power` is any integer of at least 1, so even and odd aspheres are the same shape kind.

**Planes.** A flat surface is the shape kind `plane`. It is never written as a large radius: a radius of 1e15 is a
different document with a different identity, and an engine may treat it differently.

**Apertures.** `semiDiameter` is the effective clip radius, and the limit is inclusive: a ray at exactly that
height passes. `innerSemiDiameter` above 0 is a central obstruction: a ray below it is stopped.

**A surface that does not clip** (minor 2) has no clip radius: its `semiDiameter` is null. It stops no ray at any
height, and has no central obstruction either. It is a surface all the same: a ray's line is met with its sag
wherever the two cross, and the ray is refracted there. Its `nominalSemiDiameter` is its extent, the size someone
drew it or generated it at, and limits nothing: the heights at which `system.describe` gives its sag are fractions
of it. The stop is never such a surface. It is how a case states a cover glass or a filter whose prescription
publishes no rim: a rim somebody made up for it would clip rays, and limit the field, that the lens does not.

**The stop** clips like every other surface, by its own `aperture`, which a case source writes for the stop setting
of the case. `conditions.stopSemiDiameter` states that setting as a radius, for what is derived from the stop and
not from a clip: the entrance pupil, the f-number, a ray aimed at the stop's rim.

## Numbers and arrays

A plain JSON number is always finite. `NaN`, `Infinity` and `-Infinity` are not JSON and appear nowhere, not even
as tokens some parsers tolerate; the validator rejects a document that holds one, whatever its schema says. That
includes a literal too large for a float64: `1e400` is JSON by its grammar, and ECMAScript and Python both read it
as an infinity.

Arrays of numbers travel in the **NdArray wire form**, which is bit-exact and can carry NaN, the infinities and −0
where a quantity needs them:

```json
{ "$nd": { "dtype": "f8", "shape": [2, 3], "data": "<base64>", "sha256": "<hex>" } }
```

| Member | Meaning |
|---|---|
| `dtype` | `f8` (IEEE 754 float64), `i4` (two's-complement int32) or `u1` (uint8) |
| `shape` | non-negative integers; their product is the element count; `[]` is a single element |
| `data` | the elements in C (row-major) order as little-endian bytes, in standard padded base64 |
| `sha256` | lowercase hex SHA-256 of those bytes |

The schema checks the structure. The array codec (`src/core/numeric/ndarray.ts`) checks that `data` is canonical
base64 of the right length and that it hashes to `sha256`; a worker verifies the digest of every array it receives.

## Identity and hashing

Identity is content, never a commit or a version string.

**Canonical JSON** (`src/core/numeric/canonicalJson.ts`) is the text every hash is computed over: object keys
sorted by UTF-16 code unit at every depth, arrays in order, no whitespace, strings escaped as `JSON.stringify`
escapes them, and numbers in ECMAScript's shortest round-trip form, so −0 is `0`. An NdArray is hashed as the
object it is, so its `dtype`, `shape`, `data` and `sha256` are all covered.

| Hash | Is the SHA-256 of the canonical JSON of |
|---|---|
| `OpticalCase.systemId` | `system` |
| `OpticalCase.id` | `{ system, conditions }` |
| `QuantityRequest.id` | `{ caseId, quantity, spec }` |

- `label`, `features` and `provenance` are in no hash. Two cases that differ only there are the same case.
- `system` is the lens as it is set: at one zoom and focus position, which place its surfaces, and at one stop
  setting, which is the stop surface's aperture. Cases of it that differ in lines or image plane share a `systemId`.
- `engineOptions` is not in a request's `id`, so one request sent to several engines keeps one id.
- **Hashes are computed only in TypeScript.** Other languages do not write numbers the way ECMAScript does
  (`1.2e-6` is `0.0000012` in ECMAScript and `1.2e-06` in Python), so a worker never recomputes an id: it echoes
  the ids it was given and hashes its own sources for its fingerprint.

`finalizeCase` (`src/contract/case.ts`) turns a draft into a case: it validates, derives `features`, computes both
ids and returns the case frozen. `verifyCaseIdentity` recomputes all three for a stored case and reports each
mismatch. `makeRequest` (`src/contract/request.ts`) does the same for a request.

## Versioning

Every document carries the contract version it was written to, as `<major>.<minor>`. This is version `1.5`.
Everything the stages of Phases 0 to 2 added was added to `1.0`: until a baseline was committed, nothing had been
written down that a later reader must still read. The first baselines (`baselines/`) are written to `1.0` as it
stands with them, the kind `baseline` included, so no document needs a `1.1` to tell it from an earlier one. From
here on the rules below hold, and what a stage adds raises the minor.

**Minor 1** (Stage 3.8) adds four optional members to the kind `baseline`, for the MTF baselines
(`baselines/<suite>.mtf.json`): a metric's `measured`, and a rung's `steps`, `bands` and `sets`. A baseline that
has one of them states `1.1`, and code refuses one that has them and states `1.0`. **A document that uses nothing
minor 1 added is still written as `1.0`** (`CONTRACT_VERSION`): every case, request, result, manifest, comparison
and rays baseline. A case's identity, a request's id and a key of the result store are therefore what they were,
and no engine's `contract.min` or `contract.max` moves; a reader of `1.0` reads all of them, and only an MTF
baseline needs a reader of `1.1`.

**Minor 2** (Stage 3.10) adds to the kind `optical-case` the surface that does not clip: `aperture.semiDiameter`
may be null, and a case with such a surface carries the feature flag `aperture.unclipped`. A case that has one
states `1.2` (`caseContractVersion`), and code refuses one that has one and states `1.0` or `1.1`
(`caseInvariantProblems`). **A case without such a surface is still written as `1.0`**, with the identity it had:
its `system` holds nothing new, so its `systemId`, its `id`, the ids of the requests about it and the keys of the
result store are what they were. A request and a result are written as `1.0` whatever case they are about. The
engines of this repository state `contract.max` `1.2` and list the flag; an engine that does neither is not asked
about such a case and is asked about every other as before (`negotiate`). No quantity's version changes:
`system.describe` answers `clipRadius` with an infinity for such a surface, which is the number its definition
asks for, the largest height at which a ray passes.

**Minor 3** (Stages 4.3/4.4) adds policy metric `attentionSeveralLines`, the alternate recorded attention
band when either answer records several lines, and to the kinds `run-spec` and `suite` the member `stations`
of a LensVisualizer lens
([stations selected by LensVisualizer](#stations-selected-by-lensvisualizer)). A run that has one states `1.3`, in
itself or through its suite, and code refuses one that states an earlier version (`runContractProblems`). The
selector is consumed when the suite is loaded: the runs it gives, and every case, request, result, manifest,
comparison and baselines without source problems are written as before, and no engine's `contract.max` moves, since no engine reads a run
spec. The suites `states` and `focus-stations` state `1.3`; every other suite is still `1.0`, with its hash.
A policy using `attentionSeveralLines` states `1.3` or later; the schema and loader refuse earlier minors.
`policy/rungs.v1.json` states `1.3`, version 14: its text changed from version 13, without changing any limit.
Baselines that record coded source problems state `1.3`, with `runs[].problems` and nullable `caseId`; a run
without a case has problems and no rungs. Other baselines retain their versions. Refusals fail no comparison.

- **A major mismatch is incompatible.** The major is in the schema directory (`schema/v1`), in the fixture
  directory (`fixtures/v1`) and in every schema `$id` (`urn:lvrtc:contract:v1:...`).
- **A minor only adds**: an optional member, an alternative of a union, a value of an enum, a feature flag, a
  quantity. It never removes, renames or changes the meaning of anything.
- A reader at minor n accepts every document of the same major at minor n or lower. A document at a higher minor
  is valid for it only if it happens to use nothing new, which the schemas decide: an unknown member is an error,
  not something to skip.
- An engine states the inclusive range of versions it speaks in its descriptor (`contract.min`, `contract.max`).

## Kinds

| Kind | Schema | TypeScript | Is |
|---|---|---|---|
| `optical-case` | `optical-case.schema.json`, `provenance.schema.json` | `case.ts`, `provenance.ts`, `features.ts` | one optical system under one set of conditions |
| `run-spec` | `run-spec.schema.json` | `runSpec.ts` | one lens in one state and what to compute for it |
| `suite` | `suite.schema.json` | `runSpec.ts` | a list of runs with shared defaults |
| `request` | `request.schema.json` | `request.ts` | one quantity asked of an engine for one case |
| `result` | `result.schema.json` | `result.ts` | an engine's answer to one request |
| `engine-descriptor` | `engine-descriptor.schema.json` | `engine.ts` | who an engine is and what it can do |
| `protocol-request` | `protocol-request.schema.json` | `protocol.ts` | a message to an engine |
| `protocol-response` | `protocol-response.schema.json` | `protocol.ts` | an engine's reply |
| `policy` | `policy.schema.json` | `policy.ts` | how the results of each rung are judged |
| `comparison` | `comparison.schema.json` | `comparison.ts` | the answers of several engines to one request, compared pair by pair |
| `baseline` | `baseline.schema.json` | `baseline.ts` | the committed record of one compared run of a suite |

`common.schema.json` holds the definitions the others share. `validateKind(kind, value)` in
`src/contract/schemas.ts` validates a document against the schema of its kind. In the tables below a member is
required unless its name ends in `?`.

### `optical-case`

The unit every engine is asked about. It is built only from a prepared runtime state, never from authored surface
fields.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"optical-case"` | |
| `id` | sha256 | identity of the case; see above |
| `systemId` | sha256 | identity of the lens alone |
| `label` | object | `name`, `lensKey?`, `zoomT?`, `focusT?` (both 0..1): what people call the case |
| `system` | object | the lens |
| `conditions` | object | how it is used |
| `features` | string[] | derived feature flags, sorted |
| `provenance` | object | where the case came from |

`system`:

| Member | Type | Meaning |
|---|---|---|
| `surfaces` | SurfaceIR[] | at least one, in the order light meets them |
| `stopIndex` | integer | index of the stop surface |
| `lastLensSurfaceIndex` | integer | index of the rear lens vertex: the last surface that is not a synthetic plate |
| `designImageZ` | number | the design image plane: the last vertex plus the last thickness |

SurfaceIR:

| Member | Type | Meaning |
|---|---|---|
| `label` | string | the surface's name in its prescription |
| `z` | number | vertex position |
| `thickness` | number ≥ 0 | distance to the next vertex; after the last surface, to the design image plane |
| `shape` | object | `{ kind: "plane" }`, `{ kind: "conic", radius, conic }` or `{ kind: "asphere", radius, conic, terms }` |
| `aperture` | object | `semiDiameter` > 0, or null for a surface that does not clip (minor 2); `nominalSemiDiameter` > 0 (the clear semi-diameter the clip is derived from: the prescription's; on the stop surface, the stop setting; on a surface that does not clip, its extent); `innerSemiDiameter` ≥ 0 |
| `elementId` | integer ≥ 0 | the element whose glass follows the surface; 0 when no element does |
| `synthetic?` | `"rearPlate"` | set on a surface the case source generated for a cover glass or filter |

A `radius` is never 0. An asphere's `radius` may be null (a flat base); its `terms` are one or more
`{ power, coeff }` with `power` an integer of at least 1.

`conditions`:

| Member | Type | Meaning |
|---|---|---|
| `object` | object | `{ kind: "infinity" }` or `{ kind: "finite", z }` with `z` < 0, the object plane |
| `stopSemiDiameter` | number > 0 | the stop's radius under these conditions |
| `imageZ` | number | the image plane: the design image plane plus any focus shift |
| `lines` | object[] | at least one `{ wavelengthNm, weight, indexSource }`; `lines[0]` is the reference line |
| `indexAfterSurface` | NdArray | float64, shape `[lines, surfaces]`: the index after each surface, per line |

`indexSource` is `authored` when the prescription states the index at that line and `anchored` when a dispersion
model anchored to the authored index supplied it.

`provenance` is `source` (`{ kind: "lv-lens", lensKey, file, fileSha256, zoomT?, focusT? }` or
`{ kind: "fixture", name }`), `lv?` (`commit` and `dirty`, each null when unknown, and `closureHash`, the hash of
the LensVisualizer engine files, of which no lens file is one), `notes?` and `producer`
(`{ tool: "lvrtc", version }`). `zoomT` and `focusT`, each 0..1, are the zoom and focus position the lens was in on
LensVisualizer's own sliders, a focus position of 0 being infinity focus: with the lens file they say which state
the case was read from, so that LensVisualizer can be asked about the same one again. `notes` lists, as codes and
each once, what the source knows about the lens or a run's path confirmation that the case does not carry; the codes LensVisualizer's exporter
writes are under [Cases from LensVisualizer](#cases-from-lensvisualizer).

**Invariants checked in code** (`caseInvariantProblems`), because a schema cannot state them:

- `stopIndex` and `lastLensSurfaceIndex` are indices of `surfaces`, and `lastLensSurfaceIndex` is that of the last
  surface that is not a synthetic plate;
- each `z` equals the sum of the thicknesses before it within 1e-9 mm, so the first vertex is at 0, and
  `designImageZ` equals the sum of all thicknesses within the same tolerance;
- an asphere has at most one term of each power;
- a surface that does not clip (`semiDiameter` null) has an `innerSemiDiameter` of 0 and is not the stop, and its
  case states the contract `1.2` or later;
- there is at least one line, and every weight is positive;
- `indexAfterSurface` decodes, is float64 of shape `[lines, surfaces]`, and holds positive finite indices.

**Feature flags** (`src/contract/features.ts`) are derived from `system` and `conditions` alone:

| Flag | The case has |
|---|---|
| `aperture.annular` | a surface with `innerSemiDiameter` > 0 |
| `aperture.unclipped` | a surface that does not clip: `semiDiameter` null (minor 2) |
| `lines.multiple` | more than one line |
| `object.finite` | a finite object |
| `surface.asphere.even` | an asphere term of even power, whatever its coefficient |
| `surface.asphere.odd` | an asphere term of odd power, whatever its coefficient |
| `surface.asphere.flat-base` | an asphere whose `radius` is null |
| `surface.conic` | a curved surface, conic or asphere, with `conic` other than 0 |

Three numeric limits go with them: `asphere.maxPower` (0 without an asphere), `lines.count` and `surfaces.count`.
A case stores its flags; the limits are derived when capabilities are negotiated. An engine lists the flags it
supports and the largest value of each limit it handles in its descriptor.

### Cases from LensVisualizer

`exportCase` (`src/engines/lv/exportCase.ts`) writes the case of one LensVisualizer lens in the state a run asks
for. It reads LensVisualizer's **prepared state**, `prepareRuntimeState(L, focusT, zoomT)`, and the functions
LensVisualizer's own tracers call; it reads no authored surface field, and it computes no index, no aperture and no
conjugate of its own. A lens it cannot write exactly is reported with a code, never approximated.

| Member of the case | Is, in LensVisualizer |
|---|---|
| state | `zoomT` of the run, 0 without one, and 0 for a prime (`L.isZoom` false) whatever the run states; `focusT` 0 for infinity focus, else the run's value. A suite run of a zoom without `zoomT` has been made two runs before it is exported ([a zoom without a position](#a-zoom-without-a-position)) |
| `surfaces[i].label`, `elementId` | `state.surfaces[i].label`, `elemId` |
| `surfaces[i].z` | `state.z[i]` |
| `surfaces[i].thickness` | the resolved gap `state.surfaces[i].d`; after the last surface, the distance to `state.imgZ` (the last `d`, which reaches it in every lens that is not folded) |
| `shape`, no asphere | `plane` when `abs(R)` > 1e10 (`FLAT_R_THRESHOLD`; LensVisualizer writes a plane as 1e15), else `conic` of radius `R` with conic constant 0 |
| `shape`, an asphere | `conic` is `K`; one term per coefficient `A<n>` that is not zero, `power` n from its name (even `A4`..`A20`, odd `A3`..`A19`), in order of power; `radius` null on a flat base. LensVisualizer's sag (`conicPolySag`) is the contract's, so no number is converted |
| `shape`, an asphere without a term | the `conic` it equals, with its `K`; a `plane` on a flat base |
| `aperture.nominalSemiDiameter` | the semi-diameter LensVisualizer traces the surface with: `evaluateAperture(...).semiDiameter`, which is `state.surfaces[i].sd`, or the run's stop radius on the stop surface |
| `aperture.semiDiameter` | LensVisualizer's inclusive clip limit for it, found by asking `evaluateAperture` for the largest radius it does not call outside: today `sd + max(1e-9, abs(sd) × 1e-12)` |
| `aperture.innerSemiDiameter` | `innerSd`, or 0 |
| `aperture` of a surface LensVisualizer does not clip at | `semiDiameter` null, `nominalSemiDiameter` `state.surfaces[i].sd`, `innerSemiDiameter` 0; see below |
| `synthetic` | `"rearPlate"` on the two flat surfaces LensVisualizer generates for a rear plate, which are surfaces of the state like any other |
| `stopIndex` | `state.lens.stop.surfaceIndex` |
| `lastLensSurfaceIndex` | `L.lastLensSurfaceIdx` |
| `designImageZ` | `state.imgZ` |
| `conditions.stopSemiDiameter` | from the run's aperture, below; the stop surface's aperture carries the same radius |
| `conditions.imageZ` | `state.imgZ`, plus the run's shift; for the image plane `lv-best-axial`, plus LensVisualizer's own best axial focus shift, below |
| `conditions.object` | `infinity` at `focusT` 0; else `finite` at the z of `mtfFiniteObjectPoint` for the conjugate LensVisualizer certifies for exactly that focus and zoom position (`MtfSupport.conjugate`) |
| `conditions.lines` | a named set: `MtfSupport.spectralLines` of `assessMtfSupport` for that spectrum, with LensVisualizer's weights, its reference line first. An explicit list: its own wavelengths and weights (1 each without weights), the first the reference line |
| `conditions.indexAfterSurface` | per line, `mtfIndexResolver(state, support, wavelength)`: its indices where it gives a resolver (`indexSource` `anchored`), each surface's `nd` where it gives none (`authored`); air is exactly 1 |
| `provenance.source` | the lens's key, its file and the hash of the file's bytes, and `zoomT` and `focusT` of the state: `state.zoomT`, `state.focusT` |

**A rear plate without a published rim.** A lens file may declare a cover glass or a filter behind the lens
(`rearPlates`) without its semi-diameter. LensVisualizer then generates a rim for the plate's two surfaces, 1.5
times the larger of the largest authored semi-diameter and the image semi-diagonal, and from commit `31c34396` on
marks both surfaces `clips: false`: its tracers clip no ray there (`evaluateAperture` reports no semi-diameter), its
half-field search skips them, and their `sd` is only an envelope that its ray launch and its intersection bounds
read. Such a surface is exported as one that does not clip, and only after LensVisualizer was asked
(`surfaceAperture`, `src/engines/lv/exportAperture.ts`): the state must mark it, `evaluateAperture` must report no
semi-diameter and no central obstruction, and must call no height outside, of the envelope as little as of a
million of them. A plate whose rim is published is an aperture like any other and is exported with its clip limit.
Every other surface is held to what it was held to: a semi-diameter that is the state's `sd`. An answer of
LensVisualizer's that fits neither is thrown, naming the surface, and nothing is exported. Before that commit the
generated rim clipped, and limited the field of a compact lens; the cases of such lenses are other cases now.

**The stop radius.** `wide-open` is `wideOpenStopAtZoom(zoomT, L)`, which is the prepared stop surface's `sd`.
An f-number N is LensVisualizer's linear stop-down, `(wide-open radius × fopenAtZoomClamped(zoomT, L)) / N`.
The hook imports `fopenAtZoomClamped as fopenAtZoom`; `fopenAtZoom` in the expressions below is that alias. The rule is
written only in LensVisualizer's React hook (`useLensComputation.ts`, `currentPhysStopSD`), so the exporter restates
it, in the hook's order of operations, and a test against LensVisualizer's source fails when the hook's expression
changes. An N below the widest f-number of that zoom position is a problem, not a clamp. `stop-radius` is taken as
given.

`lv-f8-comparison` is the stop of the f/8 comparison of LensVisualizer's MTF tab
([the request of the MTF tab](#the-request-of-the-mtf-tab)): the radius the hook hands the tab wide open,
`(wide-open radius × fopenAtZoom) / fNumber` with the f-number of the aperture slider at wide open, times
`fNumber / 8`. It is not the hook's own f/8, `(wide-open radius × fopenAtZoom) / 8`: the two are the same number
on many lenses and one unit in the last place apart on others, and a case is its numbers to the bit. A lens the tab
offers no comparison for (it is not faster than f/7.95 wide open, or does not stop down to f/8) has no such stop:
the run has the problem `f8-comparison-unavailable`, with the tab's reason. Both expressions are the tab's and the
hook's, restated (`lvHookStop`, `lvTabComparison` in `src/engines/lv/tabRequest.ts`) with source canaries.

**The image plane `lv-best-axial`** is LensVisualizer's own best axial focus for the stop radius and the lines of
the case: `conditions.imageZ` is `state.imgZ` plus the shift its MTF applies to every field when it is asked for
its best focus, added as LensVisualizer adds it. The shift is asked of LensVisualizer, never computed
(`lvBestAxialFocus`, `src/engines/lv/focus.ts`): the first step of its `computeMtfSteps`, before any field is
traced, states the focus of the request, found by its own search on the axial beam.

| Of the request the focus is asked with | Is |
|---|---|
| `stopSemiDiameterMm`, `pupilSemiDiameterMm` | the stop radius of the case, and the seed the tab's hook would hand over for it (`lvPupilSeed`) |
| `spectrum` | the one of LensVisualizer's three whose lines the case has. Lines that are none of them have no focus of LensVisualizer's: `lv-best-axial-needs-lv-spectrum` |
| `focus` | `best-axial` |
| `maxGridSize` | `sampling.lvGridCap` of the run, where it states one; LensVisualizer's own default, 128, without |

So the plane is that of one stop, one spectrum and one grid cap: the reference line and the photopic lines of one
lens have two best planes, and so have wide open and f/8. The grid cap matters only below 64: the search is of an
axial bundle of 64 cells, or of the cap when that is smaller. A state LensVisualizer's MTF does not cover has the
problem of its gate's reason, and a search that finds no focus `lv-best-axial-unavailable`. A case at that plane is
a case like any other: every engine is asked about `conditions.imageZ`, and none is told where the number came
from. The engine `lv` recognises it ([its product MTF](#lensvisualizers-product-mtf)), and the
[MTF recipe](#the-mtf-recipe) of a run names it.

**Lines and indices** are LensVisualizer's decision, not the exporter's. The reference line is the d line, or the
e line for a lens whose glasses are all e-referenced, and it is traced with the authored `nd`; several lines, and
a lens that mixes d- and e-referenced glasses, are traced with indices anchored to the authored one. Which applies,
and whether LensVisualizer has the glass data for it, is what `assessMtfSupport` says. An explicit list of
wavelengths takes the indices of a spectral run, where LensVisualizer has them and every wavelength lies between
its g and C lines, which its anchored indices are fitted between.

**What is reported instead of exported**, each with its code (`src/engines/lv/exportProblems.ts`):

| Code | The lens, or the run |
|---|---|
| `folded-path`, `non-refract-interaction` | has a path that turns at a mirror; a surface that reflects or blocks |
| `diffractive-surface` | has a surface with a diffractive phase |
| `tilted-image-plane`, `off-axis-image-plane` | has an image plane that is not perpendicular to the axis, or not on it |
| `surface-profile-unsupported`, `asphere-coefficient-unknown`, `synthetic-surface-unknown` | has a surface LensVisualizer describes in a way the exporter does not know: a guard against a change in LensVisualizer |
| `aperture-faster-than-wide-open` | asks for an f-number below the lens's widest |
| `aperture-beyond-slider-range` | asks for an f-number above the lens's aperture slider maximum |
| `f8-comparison-unavailable` | asks for the aperture `lv-f8-comparison` of a lens LensVisualizer's MTF tab offers no f/8 comparison for |
| `lv-best-axial-needs-lv-spectrum`, `lv-best-axial-unavailable` | asks for the image plane `lv-best-axial` on lines that are none of LensVisualizer's spectra, or in a state its focus search finds no focus for |
| `wavelength-outside-fitted-range` | lists a wavelength outside LensVisualizer's g to C lines |
| `finite-conjugate-unavailable` | asks for a focus position that is not a station LensVisualizer certifies. A refocused lens is never exported with its object at infinity |
| `mixed-reference`, `spectral-data-unavailable` | has no glass data for what was asked: LensVisualizer's own reasons, under its own codes |
| `unsupported-path`, `unverified-scale` | is outside LensVisualizer's MTF path, which is the only source of indices at several lines |
| `unknown-lens`, `lens-build-failed`, `state-prepare-failed` | is not in the catalog, or LensVisualizer cannot build or prepare it |
| `lv-<why>` | LensVisualizer itself is not configured or cannot be loaded |

Tilt and shift are not states a run can ask for, so a case is always the lens unmoved.

**What changes no surface is a provenance note, not a feature flag.** Two things LensVisualizer knows about a lens
leave every surface, gap and index of the case as it is:

| Note | The lens |
|---|---|
| `bulk-absorption` | has a glass that absorbs (`absorptionCoefficientPerMm`): it weights rays and bends none |
| `projection:<kind>` | maps field angle to image height otherwise than rectilinearly (`projection:fisheye-equisolid`) |

A feature flag is derived from `system` and `conditions` alone, and is what an engine is negotiated against. Neither
of these is in either: carrying them would mean new members that change the identity of every case, for no rung
that reads them. The gated rungs trace rays that are given, with weights that are given, so no engine needs to
know of absorption or projection to answer them. A later stage that asks an engine for an analysis of its own, for
which these matter, adds the member and the flag then; until then the note keeps the fact with the case. A fisheye
lens and a lens with an annular aperture are outside LensVisualizer's own MTF path, so they are exported on their
reference line only, with the indices their prescription states.

**A case can be asked for again.** What a case states of its origin and its conditions is enough to export it a
second time: the lens of `provenance.source` at its `zoomT` and `focusT`, with the stop radius
`conditions.stopSemiDiameter`, the image plane at `conditions.imageZ`, and the case's own lines. A single line of
`indexSource` `authored` is LensVisualizer's reference line; any other lines are asked for by wavelength and
weight, which gives the same anchored indices whether they came from a named spectrum or from a list
(`exportOptionsOf`, `src/engines/lv/caseModel.ts`). The second export has the `systemId` and the `id` of the first
for as long as the lens file and LensVisualizer's code give the same numbers. The engine `lv` holds every case it
is asked about to this; see [The engine `lv`](#the-engine-lv).

**No constraint of the schema had to be relaxed for a real lens.** The limits a prescription could have broken (an
asphere needs a term, a thickness is not negative, a finite object lies ahead of the first vertex, the image plane
sits one last gap behind the last vertex) hold for every lens that is exported: a negative gap and an image plane
elsewhere occur only in folded systems, and an asphere without a term is the conic it equals. The census in
`reports/census/` counts what was exported, and what was not and why.

### The engine `lv`

The LV binding uses the public barrels `src/optics/{buildLens,optics,fieldGeometry,analysis,mtf,geometry,chromatic}.ts`
where they export the required name, and defining deep modules otherwise (the manifest is authoritative).
It requires the engine rewrite at `460f841f` or later. MTF entry points take an analysis request made by
`createAnalysisRequest` from `src/optics/analysis.ts`, beside settings without aperture radii; lower-level helpers
in `src/optics/analysis/mtf/` retain their state and resolved options form. Lens files use V2 `zoom.stations`;
finite conjugates live in `focus.conjugates`, addressed by zoom station and focus keyframe. `buildLens` takes
the V2 default export directly; the runtime's canonical lens is `source`. `evaluateAperture` takes
`state.traceGeometry`. The source stop's `sd` may be a placeholder 0: the prepared stop supplies the radius.

LensVisualizer is also an engine, `lv` (`src/engines/lv/engine.ts`): it answers a request from its own prepared
state and its own functions, and reads nothing of the surfaces of the case it is handed. Its `fingerprint` is the
closure hash of LensVisualizer's engine files, the `closureHash` of a case's provenance; its `adapterRevision` is
the hash of the comparator's own code behind it ([fingerprint and adapter revision](#engine-descriptor)); and its
`details` are the checkout's `commit` and `dirty` flag and the number of engine files.

| The case | `lv` answers |
|---|---|
| came from a LensVisualizer lens, and is what LensVisualizer gives now | the quantity, from the state of that lens |
| came from a LensVisualizer lens, and is not | status `error`, code `stale-case` |
| came from any other source | status `unsupported`, one item `{ code: "case-source", item }`, `item` the kind of the source (`fixture`) |

- **Stale.** `lv` exports the case again ([as above](#cases-from-lensvisualizer)) and answers only when that
  export has the `systemId` and the `id` of the case. Otherwise an answer from LensVisualizer's present state would
  be about another system than the one the other engines were asked about. The message names what differs from
  the case's provenance: the lens file's hash, the engine closure, or neither, in which case the case was altered
  after it was exported. A lens file or an engine file that changed without changing the case leaves it fresh:
  identity is content. A case that does not state `zoomT` and `focusT` is stale.
- **`system.describe`** is the state read back: `vertexZ` is `state.z`; `curvature` is one division `1 / R`, and 0
  above LensVisualizer's own flat threshold; `conic` is the asphere's `K`, and 0 for a surface without curvature
  and without a term; `terms` are the coefficients of LensVisualizer's own list of polynomial terms that are not 0;
  `clipRadius` is the largest height its `evaluateAperture` passes a ray at, the stop surface asked with the stop
  radius of the case, and an infinity for a surface it clips nothing at; `sag` is its surface profile's, and NaN beyond the height at which the profile says the
  surface ends; `indexAfterSurface` is its index resolver's table for the case's lines. So R0 of `lv` against any
  engine holds the exporter, and that engine's reading of the case, to what LensVisualizer traces.
- **`paraxial.first-order`** is LensVisualizer's paraxial kernel (`paraxialTrace`) on the rows
  `{ R, d, n }` of the state, with `n` the index of the line: two basis rays give the system matrix, its own
  `buildCardinalElementsFromMatrix` the cardinal points and the back focus, two rays to the stop's plane the
  entrance pupil and a ray from the stop's centre the exit pupil. LensVisualizer's own first-order module answers
  for the authored indices only; at such a line the cardinal points and the back focus of `lv` are that module's,
  bit for bit. The method is named `paraxial-kernel`: the values are the kernel's, and none is a number
  LensVisualizer displays. The kernel is handed the radius of a surface and nothing else of its shape, so a case
  with a term of power 1 or of power 2 is answered `unsupported`, with the item `surface.asphere.linear-term` or
  `surface.asphere.quadratic-term`, before the kernel is asked. No lens of LensVisualizer has either: its
  coefficients start at `A3`.
- **`rays.trace`** is every ray of the request traced for real by LensVisualizer's sequential tracer,
  `traceEngineRay`, on the state: clear apertures checked, the stop surface with the stop radius of the case, the
  ray ended at the first surface that stops it, the indices of the spec's line handed over as the case states them
  (which are LensVisualizer's own for that line), the direction taken as the unit vector it is, and the optical
  path recorded. These are the options of LensVisualizer's own MTF bundle. What became of a ray is what
  LensVisualizer's `mtfTraceClassification` says: `valid` is status 0, `blocked` (an aperture, a total internal
  reflection, a miss it can prove) status 1, `failed` status 2. `hits` are its hit points, `exitPoint` and
  `exitDirection` its `terminalPoint` and `terminalDirection`, `opticalPath` its `opticalPathLengthMm`.
  LensVisualizer's trace ends on the last surface, so `imagePoint` is the comparator's own projection of that end
  (`src/estimators/imageProjection.ts`) and `opticalPathToImage` the path continued over the projection's distance
  in the index LensVisualizer ends in; a test holds the projection to LensVisualizer's own `mtfImagePoint`, bit for
  bit. The end surface of a ray that did not pass is the first surface it did not pass: the one that clipped or
  reflected it, or the one LensVisualizer could not intersect it with. LensVisualizer does compute a hit on a
  surface that clips a ray, by rules of its own beyond a clear aperture; it is not reported.
- **`mtf.native`** is LensVisualizer's product MTF, `computeMtf`, on the state: the MTF its MTF tab draws. The
  method, the sampling, the focus search and the spectra are LensVisualizer's; the engine builds the request and
  writes the answer down. See [LensVisualizer's product MTF](#lensvisualizers-product-mtf) below.
- **`recorded`** carries LensVisualizer's stored pupil constants, where they are defined: at infinity focus, and
  at a line traced with the authored indices (NaN at any other line of such a case; a case without such a line has
  none). Every name says that the value is stored or nominal, because none is the paraxial image of the stop that
  the compared value of a like name is:

| Recorded | Is, in LensVisualizer |
|---|---|
| `lvStoredEntrancePupilZ` | the stop vertex plus `epZRelStopAtZoom(zoomT, L)`: found with real rays near the axis |
| `lvStoredExitPupilZ` | the last vertex, rear plates included, plus `xpZRelLastSurfAtZoom(zoomT, L)`: likewise |
| `lvNominalEntrancePupilSemiDiameter` | `epAtZoomClamped(zoomT, L)`: focal length over twice the nominal f-number |
| `lvStoredExitPupilSemiDiameter` | `xpAtZoom(zoomT, L)`: scaled from that nominal entrance pupil |
| `lvNominalFNumber` | `fopenAtZoomClamped(zoomT, L)`: the wide-open f-number at the zoom position, whatever the stop of the case |

#### LensVisualizer's product MTF

`lv` answers `mtf.native` (`src/engines/lv/mtf.ts`) with one call of `computeMtf(request, settings)`.
`lvMtfInputs` builds the analysis request with `createAnalysisRequest`, the prepared state, `dynamicEFL: 0`
as in LV's worker, and the two current radii. The settings carry no radii. The tables below use the resolved
options' radius names: `stopSemiDiameterMm` is `request.aperture.stopSemiDiameterMm`, and
`pupilSemiDiameterMm` is `request.aperture.entrancePupilSemiDiameterMm`. Lower-level helpers receive these as
resolved options through `lvResolvedMtfOptions`, including `request.pose?.active ?? settings.movementActive`.

| Of the request | Is |
|---|---|
| `method`, `frequenciesPerMm` | the spec's |
| `fieldFractions` | the spec's fractions. LensVisualizer takes them of its reference image height, the format corner where the lens declares a format and the modeled edge where it does not, and solves each to a chief-ray angle, which the answer states |
| `spectrum` | the one of LensVisualizer's three whose lines the case has: `reference`, `cdf` or `photopic`, the same wavelengths with the same weights, as its support gate lists them, traced with the indices of the case |
| `focus` | `design` for the spec's `design`; `best-axial`, LensVisualizer's axial best-focus search, for `engine-best`. For a case at LensVisualizer's own best axial focus, `best-axial` for the spec's `design` ([below](#a-case-at-lensvisualizers-best-axial-focus)) |
| `stopSemiDiameterMm` | `conditions.stopSemiDiameter` |
| `pupilSemiDiameterMm` | the seed of LensVisualizer's footprint scan: the pupil radius the hook of its MTF tab hands over for that stop radius (`lvPupilSeed`). It is never the nominal pupil of the lens, which LensVisualizer's audit scripts pass and which gives another MTF |
| `maxGridSize` | the engine option `lvGridCap`: 32, 64, 128 or 256, the grid LensVisualizer's refinement may go up to; 128 without it. It is what `sampling.lvGridCap` of a run is for |

| Of the answer | Is, in LensVisualizer's result |
|---|---|
| a field's `fieldAngleDeg`, `imageHeightMm`, curves | `fieldAngleDeg`, `imageHeightMm` (the reference chief ray's landing on the analysed plane), `sagittal`, `tangential` |
| `status` | `ok` for `converged`; `unconverged`; `unavailable`, with NaN curves and LensVisualizer's `reason` (`outside-modeled-field`, `vignetted`, `chief-ray-failed`, `empty-pupil`, `trace-failed`) |
| `sampling` | `gridSize`, the grid the field's refinement ended at; `validRays`, `blockedRays`, `failedRays`, summed over the lines; `unknownFluxFraction`; and, where it has them, `maxDelta` and `convergedThroughLpMm` |
| `method` | `name` is LensVisualizer's (`diffraction`, `geometric`); `params` hold the request as it was made (`spectrum`, `focus`, `maxGridSize`, both radii) and the height the fractions are of (`referenceHeightMm`, `fieldBasis`) |
| `focus` | `mode` and `appliedShiftMm` of its focus record: `design`, or `best-axial` with its shift, positive away from the lens |
| `aperture` | `tracedFNumber`, and `limitingSurfaceIndex` from `limitingSurfaceLabel`: the stop's index where LensVisualizer says the iris limits the beam |
| `lines` | the lines of its support record |
| `notes` | what it says of a field in words (`message` of a field that is not converged, and its `notes`), each prefixed with the field |

**What LensVisualizer's MTF does not compute** is answered `unsupported`, each with one item:

| Code, item | When |
|---|---|
| `feature`, a reason of LensVisualizer's support gate (`unsupported-path`, `unverified-scale`, ...) | the gate refuses the state, on any spectrum: a fisheye projection, an annular aperture, a scale it has not verified. The message is the gate's, word for word. It is decided first, whatever the spec asks |
| `feature`, `image-plane.shifted` | `conditions.imageZ` is neither the design image plane nor LensVisualizer's own best axial focus for the request: its MTF is of one of those two, and of no plane it is given. Also: `engine-best`, or a profile, asked of a case that is not at its design plane |
| `feature`, `lines.custom-spectrum` | the lines of the case are none of its three spectra: it has no spectrum by wavelength |
| `feature`, `aperture.f8-comparison` | the case is stopped down as the tab's f/8 comparison would be, for a lens the tab offers none for |
| `option`, `fields.angles-deg` | fields as angles: it takes fractions of its reference image height |
| `option`, `profile` | a profile other than `lv-tab-default` |
| `option`, `lvGridCap` | a grid cap that is none of the four |
| `option`, `fields.limits` or `frequenciesPerMm.limits` | without a profile, more fields or frequencies, or a higher frequency, than LensVisualizer takes in one request (at `ed78cf40`: 101 fields, 501 frequencies, 1000 cycles/mm). The limits are not restated: its gate is asked with the spec's fields and then with its frequencies, and the message ends with the gate's |

##### A case at LensVisualizer's best axial focus

LensVisualizer's MTF cannot be handed a plane: it evaluates the design plane, or the plane its own focus search
finds. So a case whose image plane is not its design plane has an MTF of LensVisualizer's only when that plane
**is** the one its search finds for the very request: `lv` asks LensVisualizer for its best axial focus at the stop
radius, the lines and the grid cap of the request (`lvBestAxialFocus`) and holds `state.imgZ` plus that shift to
`conditions.imageZ`, to the bit. It is what a run with the image plane `lv-best-axial` exports.

| The case is at | The spec's `focus` | `lv` asks LensVisualizer for | The answer's `focus` |
|---|---|---|---|
| its design plane | `design` | `design` | `{ mode: "design", appliedShiftMm: 0 }` |
| its design plane | `engine-best` | `best-axial` | `{ mode: "best-axial", appliedShiftMm }`, LensVisualizer's shift |
| LensVisualizer's best axial focus | `design` | `best-axial` | `{ mode: "design", appliedShiftMm: 0 }`: the plane of the case as it is. `method.params.focus` says `best-axial` |
| LensVisualizer's best axial focus | `engine-best` | nothing | `unsupported`, `image-plane.shifted` |
| any other plane | either | nothing | `unsupported`, `image-plane.shifted` |

The check is of the request, not of the run's words: a case at the best focus of a grid cap of 32 is at no best
focus of a request capped at 128, and the same plane asked for as a shift by its number is the same case and is
answered. Should LensVisualizer's result then be of another plane than the case's, the engine fails
(`engine-failure`) and gives no answer.

##### The request of the MTF tab

The profile **`lv-tab-default`** is the request LensVisualizer's MTF tab makes for a lens as it opens: what
"the MTF LensVisualizer presents" was asked with. The tab builds it in a React component from numbers of a React
hook, neither of which can be imported, so both are restated (`src/engines/lv/tabRequest.ts`), expression by
expression, on the functions and the defaults they themselves read, which are imported. Nothing of the request is
the comparator's: every value is LensVisualizer's own when the engine runs.

| Of the request | Is, in LensVisualizer |
|---|---|
| `method`, `focus`, `maxGridSize` | `DEFAULT_MTF_PREFERENCES` (`src/utils/state/mtfPreferences.ts`): today `diffraction`, `best-axial` and 128 |
| `spectrum` | `resolveMtfSpectrum(state, preferences.spectrum).spectrum`: the preferred spectrum, today `photopic`, or the reference line for a lens without the glass data. Its note, when it has one, is the first of the answer's `notes` |
| `fieldFractions` | `mtfFieldFractions(preferences.fieldStepPercent)`: today the eleven fractions i/10 |
| frequencies | none are named, so LensVisualizer computes its `MTF_FREQUENCIES`: today 0 to 100 cycles/mm in steps of 2. The tab draws `preferences.frequencies` of them, today 10 and 30 |
| `stopSemiDiameterMm` | the hook's `currentPhysStopSD`, `(wideOpenStopAtZoom × fopenAtZoom) / fNumber`, with `fNumber` that of the aperture slider at wide open, `fNumberAtStopdown(0, zoomT, L)` |
| `pupilSemiDiameterMm` | the hook's `currentEPSD`, `(baseEPSD × fopenAtZoom) / fNumber`, with `baseEPSD` the entrance pupil of the wide-open iris, `entrancePupilAtState(wideOpenStopAtZoom, focusT, zoomT, L, fieldGeometry, 0).epSD`, found with the hook's analysis field geometry |
| `movementActive` | false |

The tab also makes a second request, its **f/8 comparison**: the same options with both radii multiplied by
`fNumber / 8`. It makes it only for a lens that is faster than f/7.95 wide open and stops down to f/8. For any
other lens the radii that scaling gives are still a case, and the answer to it is `unsupported`
(`aperture.f8-comparison`), with one exception that no case can tell apart: a lens that is f/8 wide open is scaled
by 8 / 8, so its comparison is its wide-open case, and that is what is answered (`view` `wide-open`, `fNumber` 8).

- **The spec** of the profile states the frequencies LensVisualizer computes, the tab's fractions, its method and
  its focus (`design`, or `engine-best` for either of LensVisualizer's other modes), and names the profile
  (`lvTabSpec`). `lv` builds the tab's request again from the case and answers `bad-spec` when the spec states
  anything else.
- **The case says which of the two requests.** Its stop radius is the tab's wide-open radius, or that of the
  tab's f/8 comparison, to the bit; with any other the profile is not about the case (`bad-spec`). The tab's
  wide-open radius is a product divided by one of its factors, which is not always the other factor again: on some
  lenses it lies one unit in the last place from the iris of the prepared state, and the case of the profile is
  then not the case a run exports for `wide-open`. `lvrtc mtf` builds the case of the profile
  (`src/engines/lv/tabProfile.ts`).
- **The lines of the case are the spectrum the tab resolves.** A case on other lines is not what the tab traces
  (`bad-spec`, with the lines to export it on).
- **The grid cap is the profile's.** The engine option `lvGridCap`, when given, must be the same.
- **The answer** says under `method.params` which request it was: `profile`, `view` (`wide-open` or
  `f8-comparison`), `fNumber`, the f-number the view is labelled with, and `displayedFrequenciesPerMm`, the
  frequencies of the request that the tab draws.

Source canaries (`test/integration/lv/canaries.test.ts`) pin every restated expression, the defaults and the
worker's call; an integration test holds the answers for the 12 benchmark configurations to `computeMtf` called
with a request spelled out a second time, bit for bit.

### The engine `replay`

`replay` (`src/engines/lv/replayEngine.ts`) is the comparator's own estimators on a replay of LensVisualizer's
sampling. It is built in, runs on the same LensVisualizer checkout as `lv`, and is no independent engine: its rays
are LensVisualizer's, launched and traced by LensVisualizer. What is its own is which bundles it asks for, what it
sums and how: the comparator's reading of LensVisualizer's MTF. Rung `r4f` holds it to `lv`. Its `fingerprint` is
LensVisualizer's engine closure, as `lv`'s is; its `adapterRevision` is the hash of the comparator's code behind
it, in which the replay and the estimator are and which is not `lv`'s.

It answers **`mtf.native`** with the method `geometric`, for the request `lv` would make for the same case and
spec (`lvMtfRequest`, one function for both): what `lv` answers `unsupported`, `replay` answers `unsupported`
with the same item, a case at LensVisualizer's own best axial focus is answered by both, and a case that is stale
or came from no LensVisualizer lens is treated as `lv` treats it. Its own two refusals, both of code `option`:
`method.diffraction` (it has the geometric estimator and no other) and `profile` (it is asked by a spec).

Where `lv` hands the request to `computeMtf`, `replay` replays the sampling (`replayLvMtf`,
`src/engines/lv/replay.ts`):

| Step | Is |
|---|---|
| the request before a field is traced | LensVisualizer's own: the first step of `computeMtfSteps` states the support record, the frequencies, the field axis, the focus and each field's target, pending or outside the model |
| the ladder | `MTF_GRID_LADDER` up to the request's `maxGridSize`, restated from `computeMtfSteps` |
| the image plane | `state.imgZ` plus the focus's applied shift, restated likewise |
| a field's launch and footprint | LensVisualizer's `prepareMtfFieldLaunch` and `findMtfFieldFootprint`; a field without the one is `chief-ray-failed`, without the other `vignetted` |
| a grid of a field | every line traced by LensVisualizer's `traceMtfBundle` over the footprint. The first line's chief ray, traced with no aperture checked, is the reference of every line. The counts add up over the lines. Fewer rays at a line than `MTF_MIN_RAYS`, or no flux, is `empty-pupil`, which a finer grid may mend; too much unresolved flux, by LensVisualizer's own `assessUnresolvedFlux`, is `trace-failed`. Restated from `fieldAtGrid` |
| widening | a grid whose rays reach the guard band of the footprint is traced again over LensVisualizer's `expandMtfFootprint` of it, at most `MTF_MAX_FOOTPRINT_EXPANSIONS` times for a field over all its grids. Restated from `traceField` |
| the walk through the ladder | LensVisualizer's own `refineMtfField`, on the replay's curves: which grids are traced, and whether a field is converged, are decided by LensVisualizer's code |
| the curves | the comparator's `polychromaticOtf` (`src/estimators/geometricOtf.ts`) on the landings and weights of the bundles, about the reference: the one thing that is not LensVisualizer's |

Every restated line has a source canary (`test/integration/lv/canaries.test.ts`). The answer has the form `lv`
gives LensVisualizer's own result, member for member, so the two can be held to each other: a field's status,
reason, angle and image height; under `sampling` the same names (`gridSize`, `validRays`, `blockedRays`,
`failedRays`, `unknownFluxFraction`, `maxDelta`, `convergedThroughLpMm`) and two of its own, `gridSizesTraced` and
`footprintExpansions`; `method.name` is `replay-geometric`, and `method.params` hold the request and the `ladder`.
A value the rounding of a modulus left above 1 is written as 1, the range the contract gives an MTF. A field the
estimator has no value for is `unavailable` with the reason `estimator-<why>`
(`OtfUnavailableReason`): it is never left out, and since LensVisualizer has no such reason, rung `r4f` counts it.

### The engine `wave`

`wave` (`src/engines/lv/waveEngine.ts`) is the comparator's wave estimator on LensVisualizer's own rays. It is built
in, runs on the same LensVisualizer checkout as `lv`, and is no independent engine: its rays are LensVisualizer's,
launched and traced by LensVisualizer. What is its own is the estimate, Hopkins' autocorrelation of the pupil
function from the optical paths (`src/estimators/waveOtf.ts`), and whether a lattice may carry it. Rung `r6b` sets
it beside `lv`. Its `fingerprint` is LensVisualizer's engine closure; its `adapterRevision` is the hash of the
comparator's code behind it, in which the estimator is and which is not `lv`'s.

It answers **`mtf.native`** with the method `diffraction`, on the image plane of the case as it is:

| Step | Is |
|---|---|
| the rays of a field | the run's own [ray sets](#ray-sets) for it (`lvFieldRaySets`): LensVisualizer's launch lattice over the footprint it finds, at `bundleGrid` cells across the beam and at twice as many, each at every line of the case. `bundleGrid` is the engine option of that name, a run's `sampling.bundleGrid`; 32 without it |
| the trace | LensVisualizer's own, as `lv` answers [`rays.trace`](#raystrace) (`answerLvRays`): the rays taken are the ones it brings to the image |
| the reference point | the flux-weighted centroid of the first line's landings, on `conditions.imageZ` |
| the curves | the moduli of the comparator's `polychromaticWaveOtf` on the finer lattice, at the frequencies of the spec; a value the rounding of a modulus left above 1 is written as 1 |
| a field's `status` | `ok` where the finer lattice may be used as an arbiter; `unconverged`, with the flags joined by `+` as its `reason`, where it may not: `undersampled` (neighbouring cells more than a quarter wave apart), `not-converged` (the MTF moved by more than 0.005 on the axis, 0.01 off it, from the coarser lattice to the finer) or `convergence-unknown` (the coarser lattice has no estimate); `unavailable`, with LensVisualizer's code or the estimator's reason, where the field has no chief-ray angle, no rays or no estimate |

Under `sampling` a field states `gridSize` and `coarseGridSize` (the cells its two lattices were asked for across
the beam, as LensVisualizer states its own grid), `validRays`, `blockedRays` and `failedRays` (the cells of the
finer lattice by how LensVisualizer ended them, summed over the lines), `phaseStepWaves` (the largest step of the
path between neighbouring lit cells, in waves) and `maxDelta` (how far the MTF moved from the coarser lattice to
the finer). `method.name` is `hopkins-autocorrelation`, and `method.params` hold the two grids and the limits.

Its refusals, all of code `option`: `method.geometric` (it has the wave estimator and no other), `profile` (it is
asked by a spec), `focus.engine-best` (the estimator has no focus criterion) and `option.bundleGrid` (no whole
number from 2 to 128). A state LensVisualizer's launch does not cover is `unsupported` as a `feature`, with the
reason of LensVisualizer's gate; a case that is stale or came from no LensVisualizer lens is treated as `lv`
treats it.

### `run-spec`

The user's specification of one run. Only `contract`, `kind`, `name` and `lens` are required; an option left out
takes the comparator's default.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"run-spec"` | |
| `name` | string | letters, digits, `.`, `_` and `-`; safe as a file name |
| `lens` | object | `{ kind: "lv", key, stations? }`, or `{ kind: "fixture", path }` naming an `optical-case` file; a relative path is resolved against the configuration root: the repository root, unless `lvrtc run --root` names another. `stations` (minor 3) selects states of a LensVisualizer lens ([below](#stations-selected-by-lensvisualizer)) |
| `state?` | object | `zoomT?` 0..1 and `focus?`: `{ kind: "infinity" }` or `{ kind: "focusT", value }` 0..1. Without `zoomT`, a zoom is run at both ends ([below](#a-zoom-without-a-position)) |
| `aperture?` | object | `{ kind: "wide-open" }`, `{ kind: "f-number", value }`, `{ kind: "stop-radius", mm }`, or `{ kind: "lv-f8-comparison" }`: the stop of the f/8 comparison of LensVisualizer's MTF tab, which only a LensVisualizer lens has |
| `lines?` | object | `{ kind: "reference" \| "cdf" \| "photopic" }` or `{ kind: "explicit", wavelengthsNm, weights? }` |
| `fields?` | object | `{ kind: "image-height-fractions", values }` 0..1, or `{ kind: "angles-deg", values }` in (−90, 90) |
| `imagePlane?` | object | `{ kind: "design" }`, `{ kind: "shift", mm }` along +z from the design plane, or `{ kind: "lv-best-axial" }`: LensVisualizer's own best axial focus for the stop and the lines of the run, which only a LensVisualizer lens has |
| `frequenciesPerMm?` | number[] | spatial frequencies, each ≥ 0, no repeats |
| `sampling?` | object | `lvGridCap?` (32, 64, 128 or 256), `bundleGrid?` (integer ≥ 1), `engines?` (options per engine id) |
| `rungs?` | string[] | rungs of the comparison ladder to evaluate |
| `engines?` | string[] | engine ids to run |
| `referenceEngine?` | string | the engine the others are compared against |

`weights`, when given, has one entry per wavelength; without it the lines weigh the same.

For the rays of a run ([ray sets](#ray-sets)), a run without `fields` takes the image-height fractions 0, 0.5 and
1, and one without `sampling.bundleGrid` 32 cells across the beam. `sampling.lvGridCap` is the largest pupil grid
LensVisualizer's own MTF may refine to, which the engine `lv` takes as its option `lvGridCap`
([its product MTF](#lensvisualizers-product-mtf)). The rung `r4f` hands it to its two engines, and the image plane
`lv-best-axial` and the MTF recipe of a run are of that cap.

How the stop of `lv-f8-comparison` and the plane of `lv-best-axial` are found is said under
[Cases from LensVisualizer](#cases-from-lensvisualizer). Both are asked of LensVisualizer when the case is
exported, so a run with either is a case of its own, with an id of its own, and every engine is asked about that
case. A case file is taken as it is: neither option moves it.

#### The MTF recipe

An MTF is of a plane, of fields, of lines and of frequencies, and for a LensVisualizer lens each of those is
LensVisualizer's to state. The **recipe** of a run states them once, as numbers, so that every MTF request about
the run's case, whichever engine it is asked of, is made from the same ones and no engine resolves a fraction of an
image height or a best focus by a rule of its own. It comes from the source of the run's case
(`CaseSource.recipe`), is a pure function of the run and the case, and is recorded in the run's manifest
(`runs[].recipe`) whenever a rung that is made from it is run. It is no document of the contract: nothing is
exchanged in it, and a request states what it needs of it in its own spec.

| Member | Type | Meaning |
|---|---|---|
| `source` | `"lv"` \| `"run"` | who resolved it: LensVisualizer, or the run itself, for a case read from a file |
| `plane` | object | `kind`: `design`, `lv-best-axial` or `shift`, read off the case; `shiftMm`: `conditions.imageZ` minus the design plane; `lvBestAxialShiftMm?`: LensVisualizer's best axial shift for the stop and the lines of the case, whatever plane the case is at, null where it finds none |
| `imageZ`, `stopSemiDiameter`, `lines` | | the case's: `conditions.imageZ`, `conditions.stopSemiDiameter`, and each line's wavelength and weight |
| `frequenciesPerMm` | number[] | the run's `frequenciesPerMm`, ascending; without them LensVisualizer's own `MTF_FREQUENCIES` (0 to 100 cycles/mm in steps of 2), and 10, 30 and 50 for a case file |
| `referenceHeightMm` | number \| null | the image height the fractions are of: LensVisualizer's reference image height |
| `fields` | object[] | in the order of the run: `fraction` (null for a field asked as an angle), `angleDeg` (the chief-ray angle, null where none was found), `targetImageHeightMm`, and `problem?`, why the field has no angle |
| `lvGridCap?` | integer | the run's `sampling.lvGridCap`, where it states one |

- **For a LensVisualizer lens** (`lvMtfRecipe`, `src/engines/lv/recipe.ts`) everything is the first step of
  LensVisualizer's own `computeMtfSteps` for the comparator's general request on the spectrum of the case's lines:
  the angle it solves for each fraction of its reference image height (the run's `fields`, or its own `MTF_FIELDS`:
  0, 25, 50, 75 and 100 %), and its best axial focus. `plane.kind` is `lv-best-axial` exactly when the image
  plane of the case is `state.imgZ` plus that shift, to the bit. `shiftMm` is a difference of two rounded numbers
  and need not be `lvBestAxialShiftMm` in its last bits. A fraction beyond the modeled edge, or without an angle,
  is a field with a `problem` under LensVisualizer's own code, and the others are not affected. There is no recipe,
  and a coded problem instead, where LensVisualizer's gate refuses the state (its reason), where the lines of the
  case are none of its spectra (`lines.custom-spectrum`), and where the run states fields as angles
  (`fields.angles-deg`).
- **For a case read from a file** (`fixtureRecipe`, `src/core/mtfRecipe.ts`) the run states the recipe, or there is
  none. Its `fields` as angles, `{ kind: "angles-deg", values }`, are the recipe's fields, with no fraction and no
  image height; the plane is the image plane the file has (`design`, or a `shift` of the difference); the stop
  and the lines are the case's. A run that states no fields, or fractions of an image height, has no recipe
  (`recipe-needs-field-angles`): nothing says which angle a fraction of a case file's image height is.

#### A zoom without a position

**A zoom lens is compared at both ends wherever no zoom position is stated.** A run of a LensVisualizer lens whose
`state` states no `zoomT` stands for two runs when the lens is a zoom: `<name>-wide` with `state.zoomT` 0 and
`<name>-tele` with `state.zoomT` 1, in that order and alike in everything else. A run that states `zoomT` is that
one state, an end included, and keeps its name. A prime has one state and no zoom position: a `zoomT` stated for
it is taken as 0, so its case and its provenance are those of a run that states none.

- Whether a lens is a zoom is LensVisualizer's own answer, as the catalog indexes it (`LvCatalogEntry.zoom`). So
  the rule is the LensVisualizer case source's (`CaseSource.expand`, `src/engines/lv/caseSource.ts`), applied when
  a suite is loaded; `expandSuite` knows nothing of it, and a fixture lens is one case whatever its file holds.
- The two runs are runs like any other: each has its own case, ray sets, jobs, comparisons and rows of a report,
  under its own name. A name that the rule gives and another run of the suite already has is a suite that cannot
  be used, as two runs written alike are.
- A suite's hash is that of the suite as written (`expandSuite`), with or without a LensVisualizer at hand.
  Without one nothing says which lens is a zoom: the run is one run, which cannot be started.
- The ends are the only states the rule adds. The authored zoom stations between them are not run unless a run
  states one, or selects the stations LensVisualizer publishes ([below](#stations-selected-by-lensvisualizer)).

`lvrtc export --all` follows the same rule (every zoom at both ends), and so does `lvrtc mtf <lensKey>` without
`--zoom`. `lvrtc export <lensKey>` and `lvrtc lenses show <lensKey>` are tools of one state, zoom 0 unless `--zoom`
names another, and say so on the error stream for a zoom.

#### Stations selected by LensVisualizer

**A run of a LensVisualizer lens may select its states from LensVisualizer** (minor 3, Stage 4.4) with
`lens.stations`; a run spec or suite that has one states `1.3` or later, and code refuses one that states an earlier
version (`runContractProblems`, applied when a suite is loaded). Like the ends of a zoom, the selection is the
LensVisualizer case source's (`CaseSource.expand`, `src/engines/lv/stations.ts`): the runs it gives state their
coordinates and no selector, and are runs like any other. A suite's hash is that of the file as written, selectors
and all; a baseline names the runs as run.

- `"published-zoom"`: a zoom at both ends and at every zoom position LensVisualizer publishes
  (`publishedZoomStations`), in ascending order and each once, named `<name>-wide`, `<name>-zoom<zoomT>` and
  `<name>-tele`. An authored station LensVisualizer does not publish is not run. A prime is one run, with no state.
- `"certified-focus"`: every finite-conjugate station the lens declares certified (`focus.conjugates`), each once,
  named `<name>-<key>-zoom<station>-focus<keyframe>`. All declared stations are expanded, including a station
  LV's MTF gate refuses: without the gate's conjugate it records `finite-conjugate-unavailable` as a run problem,
  with no comparison pairs and no failure. At `ab0fd4cf`, 55 stations on 35 lenses include two such fisheye
  stations (gate reason `unsupported-path`). `key: "*"` selects over the whole catalog, and only for this selector.
- A run that selects stations and also states `state.zoomT` or `state.focus` is one run that cannot be started
  (`station-selection-conflict`), and so is a selection of nothing (`no-certified-stations`): neither is a suite of
  no runs. Without a LensVisualizer the run is one run, which cannot be started.

**Invariant checked in code** (`runInvariantProblems` in `src/contract/runSpec.ts`), because a schema cannot count
one list against another: explicit lines that give `weights` give exactly one for each wavelength. It holds for a
RunSpec, for a run of a suite and for a suite's defaults.

<!-- fixture: valid/run-spec/worked-example.json -->

```json
{
  "contract": "1.0",
  "kind": "run-spec",
  "name": "double-gauss-f5",
  "lens": { "kind": "fixture", "path": "contract/fixtures/v1/valid/optical-case/double-gauss.json" },
  "aperture": { "kind": "wide-open" },
  "lines": { "kind": "reference" },
  "fields": { "kind": "angles-deg", "values": [0, 10, 14] },
  "imagePlane": { "kind": "design" },
  "frequenciesPerMm": [10, 20, 40],
  "sampling": { "lvGridCap": 64, "bundleGrid": 33, "engines": { "optiland": { "numRays": 512 } } },
  "rungs": ["r0", "r1", "r2", "r3", "r4"],
  "engines": ["ref", "optiland"],
  "referenceEngine": "ref"
}
```

It reads: take the Double-Gauss fixture as it is, wide open, on its reference line; evaluate on axis and at 10°
and 14° off axis, at the design image plane, at 10, 20 and 40 cycles/mm; run rungs r0 to r4 with the engines
`ref` and `optiland`, comparing against `ref`. The object under `sampling.engines.optiland` is read by that
engine only.

### `suite`

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"suite"` | |
| `name` | string | as a RunSpec's |
| `defaults?` | object | any RunSpec option; never `contract`, `kind`, `name` or `lens` |
| `runs` | object[] | at least one RunSpec, in which `contract` and `kind` may be left out |

`expandSuite` (`src/contract/runSpec.ts`) turns a suite into complete RunSpecs. Each option is the run's own value
when the run states one, else the default: an option is replaced whole, never merged into. Run names are unique
within a suite. A run of a zoom lens that states no zoom position is then made two runs by the case source, one
for each end ([a zoom without a position](#a-zoom-without-a-position)).

<!-- fixture: valid/suite/worked-example.json -->

```json
{
  "contract": "1.0",
  "kind": "suite",
  "name": "contract-example",
  "defaults": {
    "aperture": { "kind": "wide-open" },
    "lines": { "kind": "reference" },
    "fields": { "kind": "image-height-fractions", "values": [0, 0.5, 1] },
    "imagePlane": { "kind": "lv-best-axial" },
    "frequenciesPerMm": [10, 30],
    "sampling": { "lvGridCap": 64, "bundleGrid": 33 },
    "rungs": ["r0", "r1", "r2", "r3", "r4"],
    "engines": ["lv", "ref", "optiland"],
    "referenceEngine": "lv"
  },
  "runs": [
    { "name": "nikon-z-24-70f4s-wide", "lens": { "kind": "lv", "key": "nikon-z-24-70f4s" }, "state": { "zoomT": 0 } },
    {
      "name": "nikon-z-24-70f4s-tele",
      "lens": { "kind": "lv", "key": "nikon-z-24-70f4s" },
      "state": { "zoomT": 1 },
      "frequenciesPerMm": [10, 30, 50],
      "sampling": { "lvGridCap": 128 }
    },
    {
      "name": "double-gauss",
      "lens": { "kind": "fixture", "path": "contract/fixtures/v1/valid/optical-case/double-gauss.json" },
      "fields": { "kind": "angles-deg", "values": [0, 10, 14] },
      "imagePlane": { "kind": "design" },
      "engines": ["ref", "optiland"],
      "referenceEngine": "ref"
    }
  ]
}
```

The second run replaces `sampling` whole, so it has no `bundleGrid`. The third replaces the fields, the image
plane and the engines, and keeps the other defaults.

### `request`

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"request"` | |
| `id` | sha256 | identity of the request; see above |
| `caseId` | sha256 | the `id` of the case it is about |
| `quantity` | string | a dotted quantity id, such as `rays.trace` |
| `spec` | object | what to compute; its schema belongs to the quantity |
| `engineOptions?` | object | options for the engine the request is sent to; not part of `id` |

### `result`

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"result"` | |
| `requestId`, `caseId` | sha256 | echoed from the request |
| `engine` | object | `id`, `fingerprint`, `adapterRevision?` and `details`, a flat map of strings, numbers, booleans and nulls |
| `status` | string | `ok`, `unsupported`, `error` or `pending` |
| `unsupported?` | object[] | each `{ code, item, message }`; `code` is `feature`, `quantity`, `option`, `contract` or `case-source` |
| `error?` | object | `{ code, message }` |
| `method?` | object | `{ name, params }`: how the engine computed the data |
| `data?` | object | the quantity's data; its schema belongs to the quantity |
| `diagnostics` | object | `warnings`, a list of strings, and `counts`, a map of numbers |

`unsupported` is a first-class answer, not a failure: it is what fills a support matrix. `pending` is a job handed
to an engine that answers later, such as one a person operates.

An unsupported item's `item` says what exactly, by its `code`: the feature flag or limit of the case (`feature`),
the quantity id (`quantity`), the option's name (`option`), the contract version (`contract`), or, for an engine
that answers only about cases of its own source, the kind of the source the case came from, its
`provenance.source.kind` (`case-source`). A quantity, or an engine's answer to it, may name further things under
`feature` and `option`: what about the case, or about the spec, it has no answer for (`system.afocal`,
`lines.custom-spectrum`, `fields.angles-deg`). Each is listed with the quantity or with the engine.

The `code` of a result's `error` is the engine's to choose. Four are written by the comparator's own engines:
`engine-failure` for an exception while an engine computed, `bad-spec` for a spec that is not the quantity's or that
cannot be about the case (a line the case does not have), `stale-case` for a case that is no longer what its
source gives ([the engine `lv`](#the-engine-lv)), and `build-mismatch` for a case that an engine's own model did
not come to hold as the case states it ([the engine `optiland`](#the-engine-optiland)).

**Invariants checked in code** (`resultInvariantProblems`): status `ok` needs `data`; status `unsupported` needs a
non-empty `unsupported` list; status `error` needs `error`.

### `engine-descriptor`

| Member | Type | Meaning |
|---|---|---|
| `contract` | object | `min` and `max`: the range of contract versions the engine speaks, both included |
| `identity` | object | `id`, `version`, `fingerprint`, `adapterRevision?`, `details` |
| `capabilities.features` | object | `supported`, a list of feature flags, and `limits`, a map from limit to the largest value handled |
| `capabilities.quantities` | object | a map from quantity id to `{ version }`: the version of the quantity's definition that the engine implements, an integer of at least 1. An engine that implements another version than the comparator's is not asked for that quantity: the job is `unsupported`, with an item of the code `quantity` whose message states both versions |
| `capabilities.deterministic` | boolean | whether equal requests give bit-equal results |
| `capabilities.maxConcurrency` | integer ≥ 1 | how many requests the engine works on at once |

`fingerprint` is a content hash of the engine's own sources. Results are keyed by it; `version` is for people.
A limit an engine leaves out is unbounded.

**Fingerprint and adapter revision.** An answer depends on two bodies of code: the engine, and whatever of the
comparator stands between the contract and the engine. For an engine whose worker is someone else's the second is
that worker, whose sources its fingerprint covers. For an engine that is part of the comparator, and for one whose
worker is the comparator's own, the two are apart, and each has its own hash:

| | Is the hash of | Changes when |
|---|---|---|
| `fingerprint` | the engine itself: LensVisualizer's engine files for `lv`, the reference engine's own files for `ref`, optiland and what it computes with for `optiland` | the engine changes |
| `adapterRevision` | the comparator's code the answer passes through. For `lv` and `ref`: the engine's module and every TypeScript file of the comparator it imports a value from, directly or through other files (`src/engines/adapterRevision.ts`); for `lv` that is its adapter, the exporter it holds a case to, the array codec, the validator and the image projection. For `optiland`: the Python sources of its worker and of the worker kit (`workers/python/lvrtc_optiland`, `workers/python/lvrtc_worker_kit`) | the comparator changes how it asks the engine, reads its answer or writes it down |

`adapterRevision` is a SHA-256, stated by `lv`, `ref` and `optiland`; an engine whose worker is not the
comparator's states none. A result carries the one of its engine's descriptor, and the result store keys an answer
by both: so a fix to the adapter retires the answers the old adapter wrote, and the fingerprint of `lv` stays what
it says it is, the identity of LensVisualizer's code. A run's manifest records both for each engine.

**The identity of `optiland`.** optiland states no version of its own, and the version of its distribution ends in
the day it was installed, so neither identifies its code. The fingerprint is a SHA-256 over these, each of which
the descriptor's `details` also carry:

| Detail | Is |
|---|---|
| `commit`, `dirty` | the commit of the optiland checkout the package is imported from, and whether `git status` lists anything in it; both `null` for a package that is in no checkout of its own |
| `sourceHash` | a SHA-256 over every `.py` file of the package: its path relative to the package, a NUL, its bytes, a NUL, in the order of the paths |
| `python`, `numpy`, `scipy`, `numba` | the versions of the interpreter and of what optiland computes with |
| `jit` | whether numba's JIT is on. The worker leaves it on; it is off only in a worker that was started with `LVRTC_OPTILAND_JIT=off`, which nothing sets but a test that compares the two, and which is then another engine to the result store |

`details` carry beside them `sourceFiles` (how many files the hash covers), `distVersion` (the distribution's
version string without the day of the install, which is also the descriptor's `version`), `backend` (`numpy`) and
`precision` (`float64`): the worker computes in nothing else and refuses `hello` when optiland is in another state.
The day is left off wherever the engine states its version: an ending `.dYYYYMMDD`, as in
`0.6.2.post117+g4e893f53.d20261007`, is removed, so that a manifest and a report that name the engine hold no date,
and two installs of one commit say the same of themselves.

### The engine `optiland`

`optiland` (`workers/python/lvrtc_optiland`) answers a request by building the case in optiland: one `Optic` for
each line of the case, with that line's indices and that line's wavelength as its only one (`build.py`). It
declares every feature flag and no limit, and offers `system.describe`, `paraxial.first-order`, `rays.trace` and
`mtf.native`.

| The case | `optiland` answers |
|---|---|
| is built by optiland as it is stated | the quantity, from the optics it built |
| comes back from optiland as another system | status `error`, code `build-mismatch` |

- **Verified before it is answered.** Every value handed to optiland is read back from optiland's own objects and
  must be the number of the case: each vertex, in the geometry's frame and on the paraxial axis; the class of each
  geometry, its radius, conic constant and terms; the tolerance and the iteration count of an asphere's
  intersection; the class of each aperture and its two radii, and for a surface of the case that does not clip
  that it has no aperture at all; the stop; that each surface refracts by optiland's
  ordinary model, which a mirror, a thin lens or a coating is not; the index after each surface, and the index
  optiland has in front of it, which it finds by a link to the surface before and which is what it refracts a ray
  out of and charges the ray's stretch to the surface to; the object and image planes; the index of the image
  space, which optiland reads from the image surface, and the index in front of that surface; the stop diameter;
  the wavelength. Then the sag optiland evaluates on each surface, at a quarter, a half, three quarters and the
  whole of its nominal semi-diameter, must be the contract's sag of the case's surface within 1e-9 on the scale of
  the sag's rounding (the scale of `sag.maxScaled`, below). The first thing that differs is the error's message,
  with the surface, the field and both values. Nothing is answered about such an optic: a translation error is an
  error of the engine, never a difference between engines.
- **`system.describe`** is written from the optics, by a function that is not given the case. `vertexZ` and
  `imageZ` are the `z` of each surface's coordinate system; `curvature` is one division, 1 over the radius the
  geometry holds, which is 0 for an infinite one; `conic` is the geometry's conic constant, and 0 for a plane,
  which has none; `terms` are the coefficients of an asphere read by optiland's rule, an entry of an even asphere
  being the term of twice its place, those that are not 0; `clipRadius` and `innerClipRadius` are the two radii of
  the surface's aperture, and an infinity and 0 for a surface optiland holds no aperture for, at which it clips
  nothing; `stopSemiDiameter` is half the stop diameter the system's aperture states;
  `indexAfterSurface` has a row from each line's optic, the index of each surface's material at that optic's
  wavelength; `sagRadii` are the fractions of the semi-aperture optiland holds for each surface, which the builder
  set to the nominal semi-diameter; and `sag` is the geometry's own sag at those heights. The method is named
  `optic-readback`, and its `params` say how the optic was made: `asphereTolerance`, `asphereMaxIterations` and
  `positioning`, which is `absolute-z`.
- **Where a surface stands** is the case's `z`, given to optiland as a position. A thickness is not given: optiland
  would place the surface at a sum of thicknesses, which is the case's `z` within the 1e-9 mm the invariants of a
  case allow and not always to the bit, and no thickness states an image plane that was shifted.
- **The image space** is the medium after the last surface of the case, and the image surface of the optic states
  it: optiland takes the index of the image space from the image surface and refracts its paraxial rays there.
- **`paraxial.first-order`** is optiland's own first-order data, each line's from that line's optic
  (`first_order.py`): what `optic.paraxial` gives, with only its reference changed to the contract's, as the table
  below states. The method is named `paraxial-accessors`, and its `params` state `afocalRelativePower`.
- **`rays.trace`** is optiland's own sequential trace of the rays as they are given (`trace.py`): every origin and
  direction goes into a `RealRays` as the float64 it is, with the wavelength of the spec's line, and
  `optic.surfaces.trace` carries them through that line's optic, the only one built for the request. Before
  anything is read, what optiland holds at its object surface is held to the rays it was given, bit for bit. The
  method is named `surfaces-trace`, and its `params` state `asphereTolerance`, `asphereMaxIterations`, the two
  tolerances of the rules below (`onSurfaceTolerance`, `imagePlaneTolerance`), `maxBatchRays`, the most rays handed
  to optiland at once, `landing`, which is `image-surface`, and `opticalPath`, which is
  `opd-stretches-times-direction-length`. How its rows become an answer is below.
- **What it does not answer** is said in two ways. A quantity it does not offer, a contract version it does
  not speak and what its first-order data has no answer for, below, are `unsupported`, by items as those of
  negotiation. A spec that is not the quantity's is `bad-spec`: fractions that do not ascend, rays whose arrays
  are not one set or whose directions are not unit vectors toward +z, a line the case does not have.

| Of `paraxial.first-order` | Is, in optiland | Which optiland measures from |
|---|---|---|
| `efl` | `f2()` | nothing: a length |
| `frontFocalZ`, `frontPrincipalZ` | `F1()`, `P1()`, plus the first vertex | the first surface |
| `rearFocalZ`, `rearPrincipalZ` | `F2()`, `P2()`, plus the image plane | the image surface, wherever the case put it |
| `backFocus` | that `rearFocalZ` minus the vertex of the surface `lastLensSurfaceIndex` | optiland reports its back focal point from the image surface, and knows no rear plate: the index is the one number taken from the case |
| `entrancePupilZ` | `EPL()`, plus the first vertex | the first surface |
| `exitPupilZ` | `XPL()`, plus the image plane | the image surface |
| `entrancePupilSemiDiameter`, `exitPupilSemiDiameter` | half of `EPD()` and of `XPD()`, without the sign | a diameter of optiland is negative where the stop is imaged upside down |
| `recorded.optilandFNumber` | `FNO()`, which for a stop given by its size is `f2() / EPD()`: the focal length over the diameter of the entrance pupil, whatever the object distance, with the sign of that diameter | |
| `recorded.magnification`, for a finite object | `magnification()` | |

The vertices and the image plane are read from the optic (`surfaces.positions`). The pupils are images of the stop
radius of the case: `EPD()` divides the stop diameter of the system's aperture, which the builder set to twice
`conditions.stopSemiDiameter`, and never reads the clip limit of the stop surface. A pupil at infinity in image
space is what optiland's own division gives, an infinity in position and in diameter.

`optiland` answers `paraxial.first-order` with status `unsupported`, each with one item of code `feature`, for:

| Item | The case | Decided |
|---|---|---|
| `surface.asphere.linear-term` | has a term of power 1 with a coefficient other than 0, as for every engine | from the case, before anything is built |
| `surface.asphere.quadratic-term` | has a term of power 2 with a coefficient other than 0, as for every engine whose paraxial model reads the radius alone ([`paraxial.first-order`](#paraxialfirst-order)): optiland's paraxial power of a surface is `(n2 − n1) / radius`. `system.describe` of such a case is answered: the term is in the surface optiland builds | from the case, before anything is built |
| `system.afocal` | has no finite focal length at a line: `f2()` is an infinity, or the power it stands for is at most 1e-12 of the sum of the magnitudes of the surfaces' powers. optiland has no test of its own | from optiland's answer |
| `system.telecentric.object-space` | has its entrance pupil at infinity (`EPL()` or `EPD()` is an infinity). optiland sizes the exit pupil with a marginal ray it launches at the rim of the entrance pupil, so its `XPD()` is a NaN there, and a NaN is never a value | from optiland's answer |

A value of optiland that is a NaN for any other reason, or an infinity that is no pupil's, is no answer and no
`unsupported`: it is the engine's failure on that request (`engine-failure`).

optiland records, on every surface, each ray's point, its direction behind the surface, its intensity and its
optical path from where it was launched. The answer to `rays.trace` is those rows:

| Of `rays.trace` | Is, in optiland |
|---|---|
| `hits` | the point each surface of the case recorded (`surfaces.x`, `y`, `z`), which is global |
| `exitPoint`, `exitDirection` | the point and the direction cosines the last surface of the case recorded |
| `opticalPath` | optiland's own sum (`opd`) on the last surface of the case, with each stretch of it a length (below, "The optical path is optiland's own sum"). It starts at 0 where the ray was launched, and a step backwards counts with its sign |
| `imagePoint`, `opticalPathToImage` | the point optiland's image surface recorded, and its sum there, made of lengths in the same way: optiland carries a ray to the image plane itself, by the division, the multiplication and the addition of the comparator's own projection, and charges that stretch to the medium in front of the image surface, which is the one after the last surface of the case. The point's z is written as the plane's own number. For a ray whose exit point lies behind the plane within the contract's 1e-9 mm they are the exit point and its path, as the contract says, where optiland would step back |
| `status`, `endSurface` | the worker's, from the rows, by the rules below |

optiland carries every ray to the image surface whatever became of it, and says of a ray only its intensity: 0
once an aperture has stopped it, with coordinates that go on. A ray that missed a surface, or was totally
reflected, has NaN from there. It has no word for why a ray ended, and none for a failure of its own: its
iteration on an asphere ends after its last step whether or not it met its tolerance, and its conic solver falls
back to a root on the other sheet of a conic where none is admissible. So the worker decides, surface by surface:

| A ray | Is |
|---|---|
| has an intensity above 0 and a number for its point, its direction and its path on every surface, and for its point and its path on the image surface | *ok*: optiland's own measure of a ray that arrived. Its hits are the points optiland has, whether or not one lies on the surface: what optiland lets through is answered as it is, and R2 judges it |
| travels toward +z no longer in front of a surface | *blocked* there, by the contract's rule, whatever optiland has on that surface |
| has an intensity of 0 at a point that lies on optiland's own sag of the surface, within 1e-6 mm along the normal | *blocked* there: an aperture stopped it |
| has such a point, an intensity, and no direction behind it, and optiland's radicand of Snell's law is negative there | *blocked* there: it was totally reflected |
| has no point on a conic, and the discriminant of its line with the conic is below 0 by more than a rounding of its terms | *blocked* there: it provably misses the surface |
| passed every surface and travels away from the image plane, or has the plane more than 1e-9 mm behind its exit point | *blocked*, with S as its end surface |
| ended in any other way | *failed* at that surface: no point on an asphere, where optiland's iteration starts from the base conic's hit and has none when the line misses that, whether or not it meets the asphere; a point that does not lie on the surface, at which optiland's aperture test stopped the ray; a direction lost where Snell's law has one |

Every value of a ray that did not arrive is NaN from its end surface on, as for every engine, whatever optiland
recorded there. The 1e-6 mm tells a point of the surface from a point that is somewhere else, and is no judge of
precision: a conic that optiland meets from far away is off its own sag by rounding that grows with the square of
the distance ([docs/gotchas.md](../docs/gotchas.md#optiland)). Warnings of numpy inside the trace, of the square
root of a negative number for a miss or a reflection, are not passed on. What the rule means for a comparison:
a ray that optiland could not trace is counted as failed and is in no mask count, and a ray that optiland passes
where the surface of the case is not, as on the far side of a hemisphere, is a ray it lands, and a mismatch of
the mask in R2.

**The optical path is optiland's own sum, and one thing is made of it.**
What optiland's `opd` holds was read in its source (`Surface._trace_real`, `RealRays`, at `4e893f53`) against each
rule of [`rays.trace`](#raystrace):

| The contract's path | optiland's `opd` |
|---|---|
| starts at the ray's own origin | is 0 in a new `RealRays`, and the object surface adds nothing to it, wherever it stands. The worker holds the first row to 0 |
| adds, for each stretch, the index of the medium the ray is in | adds `t` times the index of `material_pre`, the medium after the surface before, on the way to every surface. In front of the first surface that is the object surface's medium, air of index 1, which the worker holds to 1. A refraction adds nothing; the interaction models that would (a phase profile, a thin lens) are refused when the optic is verified |
| counts a stretch that runs backwards with its sign | has `t` with its sign: a step backwards is subtracted |
| continues to the image plane in the index after the last surface | adds the step to the image surface times the index in front of it, which is the index after the last surface of the case whatever the image surface itself states; the worker reads that index back |
| times the **length** of the stretch | times the **step** `t`: the parameter of the line `p + t d` along the direction `d` optiland holds, which it takes for a unit vector and never makes one |

The last row is the one difference, and it is one of definition: a ray's first direction is the one it was given
with, which a spec may state within 1e-12 of a unit vector, and every later one is what optiland's refraction
computed from the one before, without making it a unit vector again, so that its length keeps what each
refraction rounded. The length of a stretch from `p` to `p + t d` is `t |d|`. So the worker takes each stretch
optiland added (the difference of `opd` between two surfaces) times the length of the direction it was travelled
along, as what that changes, `stretch × (|d| − 1)`, with `|d| − 1` computed without the rounding that loses it,
and adds that to optiland's sum. LensVisualizer's launch directions are within 1.6e-16 of unit vectors and
optiland's own, behind the 18 to 39 surfaces of a benchmark lens, within 7.8e-15: the paths of the benchmark move
by up to twenty units of their last place, 1.9e-9 waves, and toward the contract's. For a direction 4.5e-13
longer than a unit vector and an origin 16 m away it is 7.3e-9 mm, 1.2e-5 waves, most of the gate of R3. Nothing
else is made of optiland's number: its sum is a plain one, and what its arithmetic costs a path is left in the
answer for R3 to measure ([docs/gotchas.md](../docs/gotchas.md#optiland)).

The path is that of the ray optiland traced, and for a direction that is given off a unit vector that is not
quite the contract's ray. optiland's refraction takes the direction for a unit vector as its steps do, and bends
one that is e longer as if its sine of incidence were e larger: behind 100 mm of glass met 30° off the normal, a
direction 4.5e-13 longer has its hit 1.0e-11 mm from the contract's and its path 8.6e-9 waves, and at the 1e-12
a spec may be off by, 2.2e-11 mm and 1.9e-8 waves. The worker moves no point and bends no ray: that difference is
optiland's, in R2 and in R3, and is in the answer. No ray set of LensVisualizer or of a case file has such a
direction: theirs are unit vectors to a rounding, LensVisualizer's within 1.6e-16.

**`mtf.native`** is answered by either method, each with a class of optiland's own, of fields stated as angles, on
the image plane of the case as it is: `diffraction` with its FFT MTF, and `geometric` with its geometric MTF,
which follows it here. Fields stated as fractions of an image height are answered, by either method, only with the
engine option `fieldAnglesDeg`, the angle of each in degrees in the order of the spec, which is what a run's
[recipe](#the-mtf-recipe) resolved them to: the answer then names each field by its fraction (`field`) and states
the angle it computed with (`fieldAngleDeg`). For a spec of angles the option is not read.

The method `diffraction` is optiland's class `ScalarFFTMTF`, asked as anyone would ask it and read from its own
attributes (`lvrtc_optiland/mtf.py`). Nothing of the transfer function is the worker's. What is, is stated in the
answer:

| Step | Is |
|---|---|
| the line | one line of the case: its only one, or the one the engine option `line` names by its index in `conditions.lines`. optiland's class is of one wavelength and gives a modulus, and a polychromatic MTF is the modulus of a sum of complex transfer functions about one image point: of the lines' moduli, each about its own chief ray, none can be formed (the lateral colour and every phase between the lines are lost). `lines` of the answer holds the one line |
| the call | one field, one sampling and one new optic a call: optiland computes every field of a call before it gives any, and one it cannot compute raises for all. The optic is the builder's, verified as above, with the field added and read back |
| the field | optiland's field type `angle`, the only field of the optic, at the angle of the spec, without a vignetting factor. optiland's positive angle is an object toward −y: the optic is the mirror image in y of the contract's system, which changes no MTF of a system of revolution. `fieldAngleDeg` is the angle optiland holds, and the direction it launches the chief ray in is held to (0, sin, cos) of it |
| the pupil | optiland's own grid of `num_rays` by `num_rays` normalised pupil coordinates, laid on the stop surface by its ray aiming (`robust`, 50 iterations, 1e-10 mm), out to the clip radius of that surface (`aperture.aimedStopRadiusMm`), and clipped by the aperture of every surface. `conditions.stopSemiDiameter` takes no part: it is the paraxial pupils' |
| the reference | optiland's `chief_ray` strategy, tilt not removed: a sphere centred where the chief ray, through the centre of the stop, meets the image plane, with the distance to the paraxial exit pupil for its radius. `imageHeightMm` is how far from the axis that ray lands, by the call optiland's strategy makes |
| the sampling | `num_rays` 128 and then 256, each with `grid_size` twice that, stated to optiland (a call without a grid size takes `num_rays` for OpticStudio's sampling number: 64 rays across the pupil for 128). The curves are the finer step's. The engine option `fftRays` 512 asks for 256 and 512 instead; 128 selects the diagnostic 64/128 pair (default remains 128/256) |
| the frequencies | optiland gives each cut at the lags of its grid, on an axis of its own (`freq_tang`, `freq_sag`: cycles/mm on the image surface, calibrated with the four rays through the rim of its pupil). A frequency of the spec is interpolated linearly between the two samples that enclose it, on the axis of its cut; `tangential` is optiland's `mtf[0][0]` and `sagittal` its `mtf[0][1]` |
| a field's `status` | `ok` where no value moved by more than 0.005 on the axis, 0.01 off it, from the coarser step to the finer; `unconverged` with the reason `not-converged` where one did, or `convergence-unknown` where the coarser step has no curve; `unavailable` where the finer step has none: `optiland-raised-<class>` (an exception of optiland, which ends the field's ladder), `no-frequency-axis` (an axis that does not start at 0 and ascend: a rim ray that did not arrive leaves a NaN in its step), `frequency-beyond-axis` (a frequency above the last sample of an axis, the cut-off: nothing is extrapolated) or `mtf-not-a-modulus` (a sample that is a NaN or outside 0 to 1). `notes` says of each such field what optiland said, and both steps' figures where it moved |

Under `sampling` a field states `numRays`, `gridSize` and `coarseNumRays`; `frequencyStepTangentialPerMm` and
`frequencyStepSagittalPerMm`, the lag of one ray on each axis; `maxDelta`, the largest move between the two steps;
`workingFNumber`, optiland's working f-number of the field; `rimRaysLit` and `rimRaysLost`, how many of the four
rim rays reach the image with light and how many have no landing; `rimLandingSpreadMm`, the largest distance from
the chief ray's landing to a rim ray's (optiland calibrates its axes with the rim rays whatever became of them, and
a ray an aperture stopped is traced on: a path that leaves the lens shows here); and `optilandWarnings`. `aperture`
states `tracedFNumber` (optiland's working f-number on the axis, of the rays through the rim of the stop),
`limitingSurfaceIndex` and `aimedStopRadiusMm`. `method.name` is `scalar-fft-mtf`, and `method.params` hold every
setting above.

The refusals of either method: of code `option`, `profile` (it is asked by a spec), `focus.engine-best` (optiland
has no focus search for an MTF), `fields.image-height-fractions` (a case states no image height, and the option `fieldAnglesDeg` was not given),
`option.fieldAnglesDeg` (not one finite angle for each field of the spec), `option.fftRays`
(not 128, 256 or 512), `option.geometricRays` (not 256 or 512; only the option of the method asked is read)
and `option.line` (no index of a line of the case); of code `feature`, `lines.polychromatic` (a case of several lines asked for the method
`diffraction` without the option `line`) and `object.finite` (optiland measures a field angle at its paraxial
entrance pupil then, and no spec says where the contract's is measured). An optic or an analysis that is not what
was asked is the error `build-mismatch`, as for every quantity. A request that has taken five minutes when its next
field is to be begun is the error `time-budget`: an error is not kept by the result store, and the worker lives on.

**The method `geometric`** is optiland's class `GeometricMTF`, asked with every option stated and read from its own
attributes (`lvrtc_optiland/geometric.py`). The line, the call, the field, the aiming and `imageHeightMm` are the
FFT's above: one line, one field and one sampling a call, each on a new optic that is built, verified and given
its field; the chief ray through the centre of the stop. What the class computes, and what the worker adds:

| Step | Is |
|---|---|
| the rays | optiland's pupil distribution `uniform` with `num_rays`: the points of `linspace(-1, 1, num_rays)` in both normalised pupil coordinates that lie within the unit circle (51040 of 256 by 256), traced in one batch. With the worker's aiming a pupil coordinate is a point of the stop surface, out to its clip radius: the grid is even on the stop |
| the spot | where optiland's image surface recorded each ray whose intensity there is above 0, in the coordinates of that surface, millimetres from the axis on the plane of the case. A ray an aperture stopped is left out; every other counts once, whatever its intensity. `raysLaunched` and `raysLit` say how many of each |
| the reference | none. The class takes the landings as they are; the reference of its spot diagram, the chief ray, is not read for the MTF |
| the transform | the landings along one axis counted into `num_points + 1` bins from the least landing to the greatest, and at each frequency the modulus of the sum of `count × exp(2πi ν centre)` over the bins, over the number of rays: a direct sum, no FFT, 1 at no frequency. `tangential` is optiland's `mtf[0][0]`, of the landings' y, and `sagittal` its `mtf[0][1]`, of their x; the mirror in y changes neither |
| the frequencies | `linspace(0, max_freq, num_points)`, cycles/mm on the image surface, as stated: no rim ray calibrates them. The worker states the largest frequency of the spec for `max_freq` (1 cycle/mm where that is 0) and 2048 for `num_points`, and interpolates linearly between the two samples that enclose a frequency |
| no diffraction | the class multiplies its curve by the diffraction limit of a circular pupil at the paraxial f-number unless told otherwise. The worker states `scale=False` and reads back the flag and the factor |
| the sampling | `num_rays` 128 and then 256; the curves are the finer step's. The engine option `geometricRays` 512 asks for 256 and 512 instead |
| the bins | a ray counts at the centre of its bin, so optiland's value is that of its own landings moved by up to half a bin of width w: lower by about `sin(πνw) / (πνw)`, off by at most `2 sin(πνw / 2)`, and of no meaning above `1 / (2w)`. The worker sums the same landings without bins and gives optiland's value only where it lies within 0.005 of that sum on the axis, 0.01 off it; `binningMaxDelta` states how far they lie apart, and `binWidthTangentialMm` and `binWidthSagittalMm` the width of a bin of each cut |
| several lines | optiland's class is of one wavelength and gives a modulus about no stated point. A case of several lines asked without the option `line` is answered by the worker's sum of optiland's landings: each line asked as above, and `OTF(ν) = Σ W_l S_l(ν) / Σ W_l T_l` with `W_l` the weight of the line, `S_l` the sum of `w × exp(−2πi ν u)` over the landings `u` of its lit rays about the axis point of the image plane, `w` the intensity optiland gives a ray (1 for every case, which has no coating), and `T_l` the sum of those: the lines added as complex numbers before the modulus, by the convention of the comparator's `polychromaticOtf`, without bins. `lines` holds every line, and `binningMaxDelta` is then how far optiland's own curve of a line lies from that line's sum, the largest of the lines, which gates nothing |
| a field's `status` | as for the FFT, `ok`, `unconverged` (`not-converged`, `convergence-unknown`) or `unavailable`: `optiland-raised-<class>`, `no-rays` (no ray of a line arrives: optiland's class gives NaN and does not raise), `no-flux`, `frequency-beyond-bins` (of one line: a value of optiland's further from the sum of its landings than the band), `frequency-beyond-axis`, `no-frequency-axis` or `mtf-not-a-modulus`. A modulus within 1e-12 above 1 is written as 1 |

`method.name` is `geometric-mtf` for one line, whose curves are optiland's own, and `spot-landings-sum` for
several, whose rays are optiland's and whose sum is the worker's; `method.params` hold every setting above, and
`curves`, `transform`, `rayWeight` and `polychromatic` say which of the two it was. Under `sampling` a field states
`numRays`, `coarseNumRays`, `numPoints`, `raysLaunched`, `raysLit`, the two bin widths, `binningMaxDelta`,
`maxDelta` and `optilandWarnings`: the counts and the widths are the finer step's, of its first line. `aperture` is
the FFT's.

**The rays of a request are one batch to optiland**, or several of `maxBatchRays`, and what it answers of a ray
is not always that ray's alone: the tolerance of its iteration on an asphere is the batch's, raised by the ray
that is furthest from the surface, a ray that has ended among them. On a curved base that is a matter of
rounding. On an asphere of a flat base one ray of the batch that was totally reflected further up leaves every
ray on the base plane, off the surface by its sag, and optiland carries each on from there as a ray that
arrived: the worker answers it so, and R2 fails the pairs of optiland on that set
([docs/gotchas.md](../docs/gotchas.md#the-tolerance-of-an-aspheres-iteration-is-that-of-the-batch-it-is-traced-in)).

### `protocol-request` and `protocol-response`

One stateless protocol over every transport. Every `run` carries the whole case, so an engine keeps nothing
between messages.

| Method | `params` | `result` of the response |
|---|---|---|
| `hello` | `{}` | an `engine-descriptor` |
| `run` | `{ request, case }`: a `request` and the `optical-case` it is about | a `result` |
| `shutdown` | `{}` | `{}` |

A request is `{ contract, id, method, params }`. A response is `{ contract, id, ok: true, result }` or
`{ contract, id, ok: false, error: { code, message } }`, with the `id` of the request it answers. `ok: false`
means the message could not be handled at all. An engine that handled a `run` and failed answers `ok: true` with a
`result` of status `error`: an exception while it computed is a result with the code `engine-failure`, from an
engine in the comparator's process and from a worker of the Python kit alike. A worker refuses with `ok: false`
and that code only where no result can be written: an exception while it describes itself, which `hello` asks
for and which every result is stamped with.

A protocol message is one of two whole shapes, so the validator reports any fault in one at the root of the
message, with the keyword `oneOf`; the issue's message quotes the first fault of each shape with its own path.
A transport that wants the precise issue validates `params.case`, `params.request` or `result` by its own kind.

An error's `code` is the engine's to choose. Two are agreed, so that every engine refuses alike: `bad-request` for
a `run` whose request or case is not valid by its own kind or whose request is about another case, and
`unknown-method` for any other method. An engine echoes the ids it is given: `id` of the message in its reply, and
`request.id` and `case.id` as the result's `requestId` and `caseId`.

Over a byte stream (the stdio transport) a message is one line of JSON and so is its reply: UTF-8, no line break
inside, a newline after. A worker answers every line it reads with exactly one line, and writes nothing else to
that stream. A line it cannot read an `id` from, because it is not JSON or not an object or has no usable `id`, is
answered under the id `"?"`. `lvrtc engine conformance` checks an engine against this section.

### `policy`

How the results of each rung of the comparison ladder are judged. The comparator's own policy is
`policy/rungs.v1.json`; `lvrtc compare` reads it, and a report states its version.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"policy"` | |
| `version` | integer ≥ 1 | rises whenever a rung, a class or a limit changes |
| `rungs` | object | a map from rung id to how the rung is judged |

A rung:

| Member | Type | Meaning |
|---|---|---|
| `quantity` | string | the quantity whose results the rung compares |
| `mode` | string | `direct`: closed-form numbers set against each other; `identical-rays`: one estimator applied to every engine's trace of the same rays; `independent-method`: each engine's own sampling and algorithm |
| `class` | string | `gated`: a difference passes or fails against a tolerance; `recorded`: it is written down and never fails |
| `metrics` | object | a map from metric name to `{ tolerance?, attention?, attentionSeveralLines?, unit, floor? }` |
| `blocksLaterRungs?` | boolean | true: two engines whose pair in this rung is `FAIL` or `ERROR` are not judged against each other in any later rung of the ladder, for the same case |
| `floor?` | object | `{ engine, arbiter }`: the engine whose known numerical floor may exceed a tolerance of this rung without failing, and the engine the others are held to |

`tolerance` is the largest value a metric of a gated rung may have and pass; `attention` is the largest value a
metric of a recorded rung may have without the pair being marked for attention. Both are ≥ 0 and in `unit`, which
is `1` for a number without one. A metric the comparison reports and the policy does not name is shown and not
judged. Several rungs may compare one quantity, each by metrics of its own: `r2`, `r3` and `r4` all compare
`rays.trace`, and so does `r6a`.

`attentionSeveralLines` is an optional nonnegative alternate band of a recorded metric that also has
`attention`. R6c's `chiefLanding.maxAbs` keeps `attention: 1e-7` mm for two one-line answers and uses
`attentionSeveralLines: 1e-3` mm if either answer records more than one line. The case alone never selects it.
R5 stays at 1e-7 mm; R5g keeps its single 1e-3 mm band. The comparator records each answer's selected
`chiefLandingLimitMm` beside each field whenever the policy supplies the alternate, along with its
`lineWavelengthNm` list. Field facts and report sorting read those same values, including later steps;
MTF baselines retain these recorded limits so their reports need no current policy to repeat the sorting.
On several lines LV's shared launch and optiland's line-0 chief are different rays; a common reference point
preserves the modulus, so this limit identifies the field rather than asserting one ray's landing.

The comparator's policy, version 13:

| Rung | Quantity | Mode | Judged |
|---|---|---|---|
| `selftest` | `selftest.echo` | direct | `sum.abs`, `values.maxAbs` ≤ 1e-12 |
| `r0` | `system.describe` | direct | every count of mismatches 0; `sag.maxScaled` ≤ 1e-12. Blocks the later rungs |
| `r1` | `paraxial.first-order` | direct | `firstOrder.maxAbs`, `pupilZ.maxScaled`, `pupilRadius.maxScaled` ≤ 1e-9 mm |
| `r2` | `rays.trace` | identical-rays | hits and landing ≤ 1e-8 mm, direction ≤ 1e-9, `mask.mismatches` 0; no floor |
| `r3` | `rays.trace` | identical-rays | the three optical paths ≤ 2e-5 waves; no floor |
| `r4` | `rays.trace` | identical-rays | `mtf.maxAbs` ≤ 1e-7, of a field at every line of the case; no floor ([`rays.trace`](#raystrace)) |
| `r4f` | `mtf.native` | direct | `mtf.maxAbs` ≤ 1e-9; `sampling.mismatches` and `fields.mismatches` 0. Of the engines `lv` and `replay` only ([`mtf.native`](#mtfnative)) |
| `r5` | `mtf.native` | independent-method | recorded: `mtfOnAxis.maxAbs` in a band of 0.005, `mtfOffAxis.maxAbs` of 0.01, `chiefLanding.maxAbs` of 1e-7 mm. Of the engines `lv`, `optiland` and `wave` only, and run only where it is named ([`mtf.native`](#rung-r5-the-engines-own-mtf)) |
| `r5g` | `mtf.native` | independent-method | recorded: `mtfOnAxis.maxAbs` in a band of 0.005, `mtfOffAxis.maxAbs` of 0.01, `chiefLanding.maxAbs` of 1e-3 mm. Of the engines `lv`, `optiland` and `replay` only, and run only where it is named |
| `r6a` | `rays.trace` | identical-rays | `waveMtf.maxAbs` ≤ 2e-8, of a field at every line of the case on a lattice that is an arbiter; no floor ([`rays.trace`](#raystrace)) |
| `r6b` | `mtf.native` | independent-method | recorded: `mtfOnAxis.maxAbs` in a band of 0.005, `mtfOffAxis.maxAbs` of 0.01. Of the engines `lv` and `wave` only ([`mtf.native`](#mtfnative)) |
| `r6c` | `mtf.native` | independent-method | recorded: R5 sorting and its 0.005 / 0.01 bands, chief landing 1e-7 mm for two one-line answers, 1e-3 mm when either records several lines; reference or photopic, only where named; `lv`, `wave`, `optiland`, `optiland-wave` |

**The floor.** Policy versions 11 and 12 give no rung or metric a floor. At Stage 3.12, LensVisualizer `ab0fd4cf`
(closure `94778d3d`, 175 files) uses an intersection tolerance of 1e-12 mm; its worst R2/R3 distances from `ref`
over the benchmark and features suites are four to seven orders of magnitude inside the gates. The larger of a
gate and ten times its measured residual is the gate itself, where a floor cannot be granted. A pair above a gate
is `FAIL`. The schema and machinery retain the following rule for a future policy; Phase 5's catalog sweep is
where a steep lens would show whether it still needs one.

One engine of a comparison may be known to compute to a coarser tolerance than a gate. A rung with a `floor`
says which engine that is and which engine arbitrates, and each metric the floor may excuse carries
`floor: { limit, agreement }`, both in the metric's unit. A pair of
`floor.engine` that is above a tolerance is then `FLOOR`, which is a pass, when all of these hold, and `FAIL`
otherwise:

1. every metric of the pair that is above its tolerance is a number and has floor limits. A metric without them
   is never excused: a count of rays the two engines disagree about is right or it is not;
2. the arbiter answered, and `floor.engine` is within `limit` of it in every metric that has floor limits: what it
   is off by is of the size of its known tolerance, and not a defect of another kind;
3. no **witness** sides with `floor.engine` against the arbiter. A witness is every other engine of the
   comparison that answered. In each metric that has floor limits, a witness within `agreement` of the arbiter
   corroborates it. A witness beyond `agreement`, or one that cannot be measured against the arbiter, does not
   corroborate, and withholds nothing: the pair is still `FLOOR`, and its `reason` names the witness with its own
   distance from the arbiter. Only a witness that is beyond `agreement` and nearer to `floor.engine` than to the
   arbiter in that metric blocks the floor: two engines of different code that agree against the arbiter make the
   arbiter suspect, and the pair is `FAIL` with a `reason` that says `arbiter-suspect`;
4. in the pair of `floor.engine` with a witness, no metric above its tolerance has the witness as far from the
   arbiter as `floor.engine` is, or farther: there the excess is the witness's own and no floor of anybody.

A metric that two answers have nothing to measure on takes no part in 2, 3 or 4. Every metric that has floor
limits takes part in 2 and 3, whether or not it is the one above its tolerance: a direction within its limit
excuses no hit beyond its own. Historically, policy version 10 gave `lv` this floor against `ref` in `r2` and `r3`
(at LensVisualizer `33ebdb30`, intersection tolerance 1e-9 mm):
lengths with `limit` 1e-7 mm and `agreement` 1e-10 mm, a component of the exit direction with 1e-8 and 1e-12,
optical paths with 2e-4 waves and 1e-7 waves; each limit is ten times its tolerance. Which rays got through,
`mask.mismatches`, had none. Those limits were in the policy, never in the code, and are removed in version 11.

Until policy version 5 a witness beyond `agreement` withheld the floor. A third engine has rounding of its own:
optiland is about 9e-10 mm from the exact hit on lenses where `ref` is 6e-12 mm and LensVisualizer 2e-8 mm from
it, beyond the 1e-10 mm of agreement and twenty-five times nearer to `ref` than to LensVisualizer. Its own error
said nothing about whose the excess was, and no longer decides it.

**Blocking.** A rung with `blocksLaterRungs` establishes what the rungs after it take for granted: two engines
that built different systems would differ in every ray traced through them, and each such difference would be the
first one again. So where the pair of two engines in that rung is `FAIL` or `ERROR`, their pair in every later
rung of the same run is `BLOCKED`: not judged, with a `reason` that names the rung. "Later" is the order of the
ladder, in which a run evaluates its rungs and its manifest lists their jobs: `selftest`, `r0`, `r1`, `r2`, `r3`,
`r4`, `r4f`.
Blocking is per pair of engines and per case; two engines that agree on the system are judged whatever a third one
built.

**Invariants checked in code** (`policyProblems`): a rung of mode `independent-method` is never gated; a gated
rung judges at least one metric; every metric of a gated rung has a `tolerance`; only a gated rung blocks later
ones; only a gated rung has a floor, whose engine is not its own arbiter and which has at least one metric with
floor limits; floor limits belong to a metric of a rung with a floor and enclose its tolerance (`agreement` ≤
`tolerance` ≤ `limit`). A test holds the policy file to the code: every rung has an entry and every entry a rung,
with the rung's quantity and a comparator of that quantity for the rung, and every metric it names is one that
comparator reports, in the same unit.

### `comparison`

A `ComparisonSet`: the answers of N engines to one request, compared pair by pair. A comparison of two engines is
the same document with N = 2.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"comparison"` | |
| `suite`, `run` | string | the names of the suite and of its run |
| `caseId`, `requestId` | sha256 | the case and the request the answers are to |
| `rung`, `quantity` | string | the rung, and the quantity it compares |
| `participants` | object[] | each `{ engine, fingerprint, status, recorded? }`, sorted by engine id |
| `mode` | string | `reference-vs-each` or `pairwise` |
| `reference?` | string | the engine every other is compared against; stated exactly in the mode `reference-vs-each` |
| `pairs` | object[] | the pairs, below |

A participant's `status` is that of its result (`ok`, `unsupported`, `error`, `pending`), or `missing` when there
is no result of it to compare: an engine named as the reference that was not run, or an answer that is no longer
in the store. Its `fingerprint` is null when the engine could not be described. Its `recorded` holds what its
answer reports beside what is compared, where the quantity has such values: a map from name to a list of numbers,
with null for one that is not finite. They are listed with the comparison, side by side, and never judged.

In the mode `reference-vs-each` there are N − 1 pairs, the reference first in each, in the order of the other
engines' ids. In the mode `pairwise` there are N(N − 1)/2, every two engines once, in the order of their ids.

A pair:

| Member | Type | Meaning |
|---|---|---|
| `a`, `b` | string | the two engines |
| `metrics` | object[] | each `{ name, value, unit, where? }`, in the order the quantity's comparator reports them; empty when nothing could be measured, and without a metric the two answers had nothing to measure on |
| `class` | string | `gated` or `recorded`, from the policy of the rung |
| `verdict` | string | below |
| `reason?` | string | why the verdict is what it is, wherever the metrics do not show it |

A metric's `value` is null when it is not a finite number; where the policy judges the metric, the pair's `reason`
says what it is. `where` says where the value occurs, as a flat map of numbers and strings: an element index, a
field, a frequency. A metric that the two answers have nothing to measure on is not among the metrics: it is not
judged, and the pair's `reason` says that it was not measured, and why, whatever the verdict (the path of a ray
relative to a chief ray that one engine stopped, for one).

**Verdicts**, decided in this order:

| Verdict | When |
|---|---|
| `UNSUPPORTED` | either engine's status is `unsupported`. It is an answer, not a failure |
| `ERROR` | either engine's status is `error`, `pending` or `missing` |
| `BLOCKED` | both engines answered, and their pair in an earlier rung that blocks later ones is `FAIL` or `ERROR`. The two answers are not set against each other |
| `ERROR` | the two answers cannot be compared at all, as arrays of different shapes cannot |
| `PASS` | the rung is gated and every metric the policy names is at or below its `tolerance` |
| `FLOOR` | the rung is gated, a metric the policy names is above its `tolerance`, and the excess is the numerical floor of the rung's floored engine, by the conditions of [the floor](#policy). The `reason` gives what exceeded its tolerance and the figures against the arbiter, and names a witness that did not corroborate the arbiter |
| `FAIL` | the rung is gated and a metric the policy names is above its `tolerance`, or is not a number, and the pair is no floor. Where the rung has a floor and the pair is of its engine, the `reason` says which condition did not hold |
| `RECORDED` | the rung is recorded and no metric that has an `attention` band is above it |
| `ATTENTION` | the rung is recorded and a metric that has an `attention` band is above it, or is not a number. It is not a failure |

Only `FAIL` and `ERROR` fail a comparison. `FLOOR` is a pass, and is counted apart from `PASS` wherever verdicts
are counted. `BLOCKED` is not a failure of its own: the failure is the blocking rung's.

**Invariants checked in code** (`comparisonInvariantProblems`): no engine is a participant twice; `reference` is
stated exactly in the mode `reference-vs-each` and names a participant; every pair names two different
participants, the first of them the reference when there is one.

`lvrtc compare` writes the sets of one run of a suite to `comparisons.json` in the run directory, as
`{ contract, kind: "comparison-file", suite, manifest, policy, comparisons }`: the suite's name, the content hash
of the manifest and of the policy the sets were made from, and the sets ordered by run, rung, request and mode.

A comparator is given the two answers and what they are answers to: the spec of the request, which the result
store keeps with each answer, the case of the run, which the run directory keeps under `cases/`, and the MTF
recipe of the run, where its manifest records one. Some need them: a clip radius says which rays lie in a rim
band, a line's wavelength turns a path into waves, an image plane gives a pupil's distance, a recipe's frequencies
say where an MTF is taken. Where a comparator needs one that is not there, its pairs are `ERROR` with that reason;
nothing is guessed in its place.

**A set that spans requests.** A figure may be of several requests of a run at once: the MTF of a spectrum is of
the rays of every line, and each line's rays are a request of their own. The comparator of such a figure says
which requests belong together (`QuantityComparator.spanOf`, from a request's spec), and the requests of one run
and rung that do are compared as **one** set: it stands where the first of them stands, its `requestId` is that
first request's, and each of its participants is one engine's answers to all of them (`SpanAnswer`,
`src/compare/span.ts`). An engine that has no `ok` answer to one request of a span has no answer to the span: it
is a participant with the status of the first such request, so its pairs say why nothing of the span was measured,
and no figure is taken of the requests that are left. A request whose spec is not at hand, because no engine
answered it, is a set of its own. Today two comparators are of spans: R4's, [a field at every line of its
case](#raystrace), and R6a's, a field at every line on both of its lattices. The schema of a set is what it was:
the requests a set spans beyond the first are those of the same field, and its pairs say how many
(`lines.compared`).

### `baseline`

The committed record of one compared run of a suite (`baselines/<suite>.json`): what the engines agreed on, and
of what. It is built from the run's manifest, its comparisons and the policy (`buildBaseline`,
`src/baseline/build.ts`), and holds numbers, hashes, counts and names only: no ray, no prescription, no time, no
path.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | the contract version |
| `kind` | `"baseline"` | |
| `suite` | `{ name, hash }` | the suite, and the hash of the suite file as written |
| `policy` | `{ version, hash }` | the policy the pairs were judged by |
| `engines` | engine[] | every engine, sorted by id: `{ id, version, fingerprint, adapterRevision?, details }` |
| `runs` | run[] | every run **as it was run**, in suite order: `{ name, caseId, rungs }` |

A record is keyed on the run's `name` and its `caseId`, the content hash of the case that was computed, never on
the suite file alone: a zoom that a suite names once is two runs, `<name>-wide` and `<name>-tele`, each with its
own case and its own records. A rung of a run is `{ rung, quantity, requests, support, rays?, pairs }`:

- `requests`: how many sets of the rung the engines were compared on: one per request, which in `r2` and `r3` is
  one per ray set, and in `r4`, whose sets span requests, one per field;
- `support`: per engine, sorted, `{ engine, status, detail? }`: `ok` when every job of the engine ended so, else
  the status of the first that did not, with its codes (`quantity rays.trace`, an error code);
- `rays`: per engine, sorted, `{ engine, ok, blocked, failed }`, added up over the requests; left out by a rung
  whose answers record no rays;
- `pairs`: every two engines, the first before the second by id, sorted: `{ a, b, verdict, verdicts, metrics }`.
  `verdicts` counts the requests by verdict, in the order of the verdicts; `verdict` is the gravest of them
  (`PASS`, `RECORDED`, `FLOOR`, `UNSUPPORTED`, `ATTENTION`, `BLOCKED`, `FAIL`, `ERROR`, from the least);
- a metric is `{ name, unit, value, where?, tolerance? }`: the largest value over the requests with where it
  occurs, or the sum of a metric counted in `rays` or `elements` (the rim band is `mask.rimBand`); null when a
  value is not a finite number; `tolerance` is what the policy judges it by, when it judges it.

**Since 1.1**, in an MTF baseline (`buildBaseline` with `MTF_BASELINE`: the rungs `r4`, `r4f`, `r5`, `r5g`, `r6a`
and `r6b` of a run, in a file of its own, `baselines/<suite>.mtf.json`):

- a metric's `measured`: in how many requests of the rung the pair has a value of the metric. A rung may measure a
  figure only where its sampling can arbitrate: of `r6a`, `waveMtf.maxAbs` is measured in the fields that are
  judged and `waveMtf.flagged` in the others, so the two counts say how many fields the gate was held on;
- a rung's `steps`: per engine and step, sorted, `{ engine, step, jobs, status, detail? }`: the jobs that asked an
  engine a request once more (`fft512`, `geo512`), how many, and `ok` or the status of the first that did not end
  so. Such a job is no part of `support`, which says how an engine's first answers ended;
- a rung's `bands`: the attention bands of the policy for the rung, by metric; left out by a rung without one;
- a rung's `sets`, for a rung of the engines' own MTF (`r5`, `r5g`): each request as it was compared, in the order
  of the requests: `{ participants, pairs }`, with every engine's `{ engine, status, recorded? }` (the values its
  answer records: every field's status, sampling, chief-ray landing and its curves at every frequency of the
  request, a later step under `<name>#<step>`) and every two engines' `{ a, b, verdict, reason?, metrics }`. The
  tables of the MTF report are made from these and from `bands`, with nothing else at hand.

**Invariants checked in code** (`baselineProblems`): engines sorted, each once; no run and no rung of a run twice;
the engines of `support` and `rays` are engines of the baseline, sorted; a pair names two engines of its rung's
`support` in order, and the pairs are sorted; a pair's verdicts are in order, add up to the rung's `requests`, and
its `verdict` is the gravest of them. A baseline with a member of 1.1 states a contract of that minor or later;
its `sets` are one for each request of the rung, each with its engines sorted and its pairs of two of them in
order; a step is of an engine of the rung's `support`; no metric is `measured` in more requests than the rung has.
A baseline file is the canonical JSON of its content and a newline (`parseBaseline` refuses any other text of the
same content, which is what an edit by hand looks like).

`lvrtc baseline write` writes it, `lvrtc baseline check` sets it against the suite as it runs today, and
`lvrtc verify` holds it and the reports rendered from it together with no engine at hand (docs/REFERENCE.md);
each with `--mtf` for the MTF baseline, whose reports are `reports/<suite>/mtf.md` and `mtf.json`.

## Quantities

A quantity is what a request asks for, identified by a dotted id (`system.describe`, `paraxial.first-order`,
`rays.trace`, `mtf.native`). Each has two schema files under
[`schema/v1/quantities/`](schema/v1/quantities/README.md): `<id>.spec.schema.json` for the `spec` of a request and
`<id>.data.schema.json` for the `data` of a result of status `ok`. The definition of a quantity, which is its two
schemas and what this document says they mean, has a version: an integer from 1 that rises when the definition
changes incompatibly. An engine states the version it implements under `capabilities.quantities`, and is asked for
a quantity only when that is the version of the table below (`negotiate`, `src/core/negotiate.ts`).

The schemas of `request` and `result` accept any object as `spec` and `data`. Whoever knows the quantity validates
them against its own schemas; in TypeScript that is the quantity's module in `src/quantities/`, with `validateSpec`
and `validateData`.

| Quantity | Version | TypeScript | Is |
|---|---|---|---|
| `selftest.echo` | 1 | `quantities/selftestEcho.ts` | an array sent back scaled: a conformance check that needs no optics |
| `system.describe` | 2 | `quantities/systemDescribe.ts` | the system an engine built for the case, re-read from the engine's own model |
| `paraxial.first-order` | 1 | `quantities/paraxialFirstOrder.ts` | focal length, cardinal points, back focus and pupils, per line |
| `paraxial.first-order` | 2 | `quantities/paraxialFirstOrder.ts` | includes diffractive phase power; selected only for diffractive cases |
| `rays.trace` | 1 | `quantities/raysTrace.ts` | given rays, traced through every surface and on to the image plane, at one line |
| `rays.trace` | 2 | `quantities/raysTrace.ts` | fixed folded visits, reverse propagation, explicit unavailable OPL and unrecorded passive visits |
| `rays.trace` | 3 | `quantities/raysTrace.ts` | separate geometric OPL and per-visit signed phasePath; selected only for diffractive cases |
| `mtf.native` | 1 | `quantities/mtfNative.ts` | an engine's own MTF of the case, by its own method and sampling |
| `wavefront.native` | 1 | `quantities/wavefrontNative.ts` | one line of an engine's raw reference-sphere wavefront, with pupil points, OPD, intensity and validity; no OTF |
| `spot.native` | 1 | `quantities/spotNative.ts` | an engine's own spot (centroid and RMS radius about it) or ray fan of a field, relative to its chief ray, by its own pupil sampling |
| `axial.native` | 1 | `quantities/axialNative.ts` | an engine's own figures of the beam along the axis (spherical aberration at a line, axial colour over lines) by its own pupil, or the real rays it traced for them, and its paraxial focus at each line |
| `chief.native` | 1 | `quantities/chiefNative.ts` | an engine's own figures of the chief rays across the field (distortion and pupils at a line, lateral colour over lines) at given field angles, or the chief rays it traced for them, and what its figures are relative to |

A quantity may have rules that its schemas cannot state: two arrays of one length, a list that ascends. Its module
checks them on a value the schema accepts, and reports each as an issue whose `keyword` is `invariant`. Such a
value is no fixture of the invalid corpus, which holds what a schema rejects.

A quantity that a rung of the ladder asks for has a comparator, and its section says how it is compared. A
quantity that no rung asks for has none: it is presented, engine by engine, and not yet set against another
engine's. Today that is `mtf.native` alone.

### `selftest.echo`

The conformance quantity. It needs no optics and ignores the case, so every engine, worker kit and test double can
answer it; one that answers it correctly has shown that it reads requests, carries arrays bit for bit and writes
results.

`spec`:

| Member | Type | Meaning |
|---|---|---|
| `values` | NdArray | float64, any shape: the elements to scale |
| `scale` | number | the factor |

`data`:

| Member | Type | Meaning |
|---|---|---|
| `values` | NdArray | float64, in the shape of the spec's `values`: the scaled elements |
| `sum` | number or null | the sum of the scaled elements; null when it is not finite |

Each element is produced by a rule that fixes every bit of it, so that two engines answer one request with
byte-equal arrays:

1. An element that is a NaN is copied bit for bit (sign, quiet bit and payload) and takes no part in arithmetic,
   which may replace a NaN's payload and quiets a signalling NaN.
2. Any other element becomes `element × scale`: one IEEE 754 double multiplication, rounded to nearest, ties to
   even. With a `scale` of 1 every element therefore comes back unchanged: −0 stays −0, and an infinity and a
   subnormal keep their bits.
3. A product that is a NaN, which only an infinity times 0 is, is written as the quiet NaN `7ff8000000000000`:
   processors do not agree on the sign of the NaN they produce.

`sum` is a running sum. It starts at 0 and adds the scaled elements in index order (C order), each addition
rounded on its own; the sum of no elements is 0. It is not a compensated sum and not an exactly rounded one:
Python's `math.fsum` is, and so is its built-in `sum` from Python 3.12 on, and both give another number. A sum
that is a NaN or an infinity is null.

The valid fixtures of the quantity are its conformance examples:
`valid/quantities/selftest.echo.data/<name>.json` is the answer to
`valid/quantities/selftest.echo.spec/<name>.json`, byte for byte in `values`.

### `system.describe`

The system an engine actually built for a case, re-read from the engine's own model and never copied from the case
it was given: an engine that mistranslated a surface says so here, before a ray is traced. It is what rung `r0`
compares. S is the number of surfaces, L the number of lines and K the number of sag radii per surface.

`spec`:

| Member | Type | Meaning |
|---|---|---|
| `sagFractions?` | number[] | fractions of each surface's nominal semi-diameter at which its sag is given: at least one, each in [0, 1], ascending. Without it: the nine fractions 0, 1/8, ..., 1 |

`data`:

| Member | Type | Meaning |
|---|---|---|
| `surfaceCount` | integer ≥ 1 | S |
| `stopIndex` | integer | the index of the stop surface |
| `imageZ` | number | the image plane |
| `stopSemiDiameter` | number > 0 | the stop's radius, from which the engine derives the pupils |
| `vertexZ` | NdArray | float64 `[S]`: the vertex position of each surface |
| `curvature` | NdArray | float64 `[S]`: the base curvature, `1/radius` as one division; 0 for a plane and for a flat base |
| `conic` | NdArray | float64 `[S]`: the conic constant the engine holds; 0 for a plane |
| `clipRadius` | NdArray | float64 `[S]`: the largest radial height at which the engine lets a ray pass the surface; +Infinity for a surface at which it stops no ray at any height |
| `innerClipRadius` | NdArray | float64 `[S]`: the radial height below which the engine stops a ray at the surface, the radius of a central obstruction; 0 for a surface without one |
| `indexAfterSurface` | NdArray | float64 `[L, S]`: the index of the medium that follows each surface, per line |
| `sagRadii` | NdArray | float64 `[S, K]`: the heights the sag is given at, each fraction times the surface's `nominalSemiDiameter` as one multiplication |
| `sag` | NdArray | float64 `[S, K]`: the sag at those heights as the engine itself evaluates it; NaN where the surface has no real sag |
| `terms` | object[][] | S lists: the polynomial terms `{ power, coeff }` the engine holds for each surface |

- **The stop row is the stop of the case.** `clipRadius` of the stop surface is the limit the engine clips with at
  the stop setting of the case, which is the stop surface's own `aperture.semiDiameter`; it is never the limit of the
  stop wide open, nor `stopSemiDiameter` itself. `sagRadii` of the stop surface scale with its
  `nominalSemiDiameter`, which a case source writes as the stop setting.
- **A surface the engine does not clip at** has the `clipRadius` +Infinity, and an `innerClipRadius` of 0. That is
  the answer to what the member asks, and no addition to it: an array holds an infinity as it holds any double. An
  engine that built a rim on a surface of the case that does not clip (`aperture.semiDiameter` null), however wide,
  answers a finite number there, and R0 counts it under `aperture.mismatches`. `sagRadii` of such a surface are
  fractions of its `nominalSemiDiameter` like any other's.
- **`innerClipRadius`** is the engine's own limit, like `clipRadius`: a ray at exactly that height passes, and one
  below it is stopped. It was added in version 2 of the quantity, with the first engine beside `ref` that builds an
  annular aperture: a central obstruction an engine left out, or built another size, is found here and not in the
  rays it lets through. `lv` states the inner semi-diameter LensVisualizer's `evaluateAperture` reports, which is
  the case's `innerSemiDiameter`; LensVisualizer itself lets a ray pass down to `max(1e-9, 1e-12 × that radius)` mm
  below it, a tolerance the case carries for the outer limit, in `semiDiameter`, and not for the inner one. A ray
  that close to either limit is in the rim band of R2, and no lens LensVisualizer exports has an annular aperture.
- **`terms`** lists only terms whose coefficient is not 0, in ascending order of power, each power once. A
  coefficient of 0 adds nothing to a surface, and an engine that stores one cannot tell it from none.
- **Zeros.** −0 is written as 0, in the arrays as in the numbers: a case's identity does not tell the two apart.
- **`sag`** is the one member an engine computes. It is NaN beyond the height at which a conic ends, where
  `1 − (1 + conic) c² r²` is negative.

**Invariants checked in code** (`src/quantities/systemDescribe.ts`): a spec's fractions ascend; in the data,
`stopIndex` is below S, the five per-surface arrays have S elements, `indexAfterSurface` has S columns and at
least one row, `sagRadii` has S rows and at least one column and `sag` its shape, and `terms` has S lists, each
ascending in power.

**Compared** (`src/compare/systemDescribe.ts`) by six metrics. Four count the elements that are not the same
number in two answers, where −0 is 0 and a NaN is a NaN and nothing else is the same; `where` names the first
such element by `field`, with its `surface` and, where the field has them, its `line`, `sample` or `power`:

| Metric | Unit | Counts, in this order |
|---|---|---|
| `layout.mismatches` | elements | `surfaceCount`, `vertexZ`, `imageZ` |
| `shape.mismatches` | elements | `curvature`, `conic`, and `terms`: a surface counts once when its two lists are not the same list |
| `aperture.mismatches` | elements | `stopIndex`, `stopSemiDiameter`, `clipRadius`, `innerClipRadius`, `sagRadii` |
| `index.mismatches` | elements | `indexAfterSurface` |

Two are of the sag, each with the `surface` and the `sample` (the index of the radius) of its largest value. A sag
that neither answer has is no difference; a sag that only one has is a NaN, which no tolerance admits.

| Metric | Unit | Is |
|---|---|---|
| `sag.maxAbs` | mm | the largest \|a − b\| |
| `sag.maxScaled` | 1 | the largest \|a − b\| / max(1 mm, scale) |

The scale is how large a rounding error of that sag can be. With `u = c r`, `q = (1 + conic) u²` and
`root = sqrt(1 − q)`, the sag is `u r / (1 + root)` plus the terms, and

```
scale = |u r / (1 + root)| (1 + |q| / (root (1 + root))) + sum over terms of |coeff| r^power
```

The first part is the conic sag, once more for each time the root magnifies a rounding, which grows without bound
as the height nears the one at which the conic ends; the second is the size of what the polynomial adds up, however
far its terms cancel. So `sag.maxScaled` is the difference in mm for a sag below 1 mm that is evaluated without
cancellation, and a relative difference for a sag that is large or ill-conditioned. Two engines that add the same
terms in another order differ by a few units of 1e-16 in it on every lens; a gate on `sag.maxAbs` alone would fail
a surface whose terms of some 1e5 mm cancel to a sag of 1 mm, where the two legitimately differ by 1e-11 mm.

Answers for different numbers of lines, or with the sag at different numbers of radii, are not comparable. Answers
with different numbers of surfaces are: `surfaceCount` is a mismatch, and each per-surface field is compared over
the surfaces both have.

`valid/quantities/system.describe.data/singlet.json` is the answer to the spec `three-fractions.json` about the
case `valid/optical-case/singlet.json`, worked out from the formula of a sphere: exact in everything but the sag,
which an engine reproduces to rounding.

### `paraxial.first-order`

The first-order data of the case's system at every line of the case. It is what rung `r1` compares. The `spec` is
an empty object: there is nothing to choose.

A paraxial ray sees of a surface its vertex position, the indices on its two sides and the curvature at its
vertex. That curvature is the base curvature `c`, plus twice the coefficient of a term of power 2; a term of power
3 or more and the conic constant do not enter. The gap between two surfaces is the difference of their vertices.
The medium in front of the first surface is air, of index 1; the medium behind the last one has the index the case
states after it.

`data`: every array is float64 of shape `[L]`, one value per line, in mm; a position is a z in the contract frame.

| Member | Meaning |
|---|---|
| `efl` | the effective focal length: `rearFocalZ − rearPrincipalZ`, which is 1/power for an image space in air |
| `frontFocalZ`, `rearFocalZ` | the focal points |
| `frontPrincipalZ`, `rearPrincipalZ` | the principal points |
| `backFocus` | `rearFocalZ` minus the vertex of the surface `lastLensSurfaceIndex`: a rear plate lies inside it |
| `entrancePupilZ`, `exitPupilZ` | the paraxial images of the stop surface's vertex plane: through the surfaces in front of it into object space, and through the surfaces behind it into image space |
| `entrancePupilSemiDiameter`, `exitPupilSemiDiameter` | the radii of those images of a stop of radius `stopSemiDiameter`: never a nominal pupil, nor one found by tracing real rays |
| `recorded` | a map from name to float64 `[L]`: values of the engine's own, reported and never judged |

- **The stop surface's own refraction** bends a ray without moving it, so it changes neither pupil: with the stop
  on the first surface the entrance pupil is the stop, and with the stop on the last surface the exit pupil is.
- **A pupil at infinity**, as a telecentric system has, is the infinity of its sign in position, and the positive
  infinity in radius: a radius is a size, and is never below 0 on either side of the lens. A NaN is never a value.
- **`recorded`** is where an engine puts what it knows and no other engine need have: LensVisualizer's stored
  pupil constants, for one, under the names listed with [the engine `lv`](#the-engine-lv), and optiland's paraxial
  f-number, `optilandFNumber`, listed with [the engine `optiland`](#the-engine-optiland). For a finite object
  every engine gives the paraxial lateral magnification of the object plane there, as `magnification`. A recorded
  value may be a NaN, where the engine has no such value at that line.
- **No first-order data.** Two kinds of case are answered with status `unsupported` by every engine, each with
  one item of code `feature`: `system.afocal`, when the system has no finite focal length at a line (its power is
  zero, or zero to rounding); and `surface.asphere.linear-term`, when a surface has a term of power 1 with a
  coefficient other than 0, since a cone has a corner at its vertex and no curvature there.
- **A term of power 2 that an engine's own model does not see.** An engine whose paraxial model reads the base
  radius of a surface alone has no first-order data of a case with a term of power 2 whose coefficient is not 0:
  it answers `unsupported` with one item of code `feature`, `surface.asphere.quadratic-term`, and never with the
  focal length of the lens without the term. `lv` and `optiland` are such engines; `ref`, whose model is the rule
  above, answers. An engine may name further things of its own model, listed with the engine: `optiland` an
  entrance pupil at infinity ([the engine `optiland`](#the-engine-optiland)).

**Invariant checked in code** (`src/quantities/paraxialFirstOrder.ts`): every array, the recorded ones included,
has the same length, of at least 1.

**Compared** (`src/compare/paraxialFirstOrder.ts`) by five metrics, each in mm, with the `quantity` and the `line`
of its largest value in `where`:

| Metric | Is the largest, over the lines, of |
|---|---|
| `firstOrder.maxAbs` | \|a − b\| of the six values that are neither the position nor the radius of a pupil |
| `pupilZ.maxScaled` | \|a − b\| / max(1, d / 1000 mm) of `entrancePupilZ` and `exitPupilZ`, with d the pupil's distance from the image plane of the case, the farther of the two answers |
| `pupilZ.maxAbs` | \|a − b\| of the same two |
| `pupilRadius.maxScaled` | \|a − b\| / max(1, d / 1000 mm) of `entrancePupilSemiDiameter` and `exitPupilSemiDiameter`, with d the distance of the pupil the radius is of, as above: by `entrancePupilZ` for the first and `exitPupilZ` for the second |
| `pupilRadius.maxAbs` | \|a − b\| of the same two |

The position of a pupil is a quotient, a height over an angle, and in a nearly telecentric system the angle is the
small remainder of a sum that cancels: a pupil 20 m away cannot be placed to 1e-9 mm by any arithmetic in doubles,
of which one unit in the last place is 3.6e-12 mm there. So a pupil's position is judged on the scale of its
distance: `pupilZ.maxScaled` is the plain difference for a pupil within a metre of the image plane, and beyond that
the difference as a fraction of the distance, in units of 1e-3, so that a gate of 1e-9 mm on it is 1e-12 of the
distance. The plain difference is reported beside it and not judged.

The radius of a pupil is the stop's radius times that same quotient: a pupil metres away is metres wide, and its
radius is known as well as the pupil is placed and no better. So it is judged on the same scale, the distance of
its own pupil from the image plane, and never on its own size: `pupilRadius.maxScaled`, with the plain
`pupilRadius.maxAbs` beside it. The radius of a pupil within a metre of the image plane is held to the plain
difference, however wide the pupil. Where that distance is no finite number, because an answer puts the pupil at
infinity or gives it no position, there is no scale, and two radii that are numbers are compared plainly. A pupil
at infinity has the infinity for its radius, and the same infinity in both answers is no difference. Every other
value keeps the plain measure.

Two values that are the same infinity differ by 0 in every metric, an infinity against anything else by an
infinity, and a NaN is a NaN. `recorded` is not compared: each participant of a comparison carries its own, and a
report lists them side by side. Answers for different numbers of lines are not comparable, and no two answers are
without the case, whose image plane a pupil is measured from.

`valid/quantities/paraxial.first-order.data/singlet.json` is the answer about the case
`valid/optical-case/singlet.json`, worked out from the formulas of a thick lens in air.

### `rays.trace`

Given rays, traced as they are given through every surface of the case and on to its image plane, at one line of
the case. It is what the identical-ray rungs compare: every engine is handed the same rays, so no engine's own
sampling, aiming or pupil takes part. n is the number of rays and S the number of surfaces.

**Frame and signs**, stated here once for everything about rays. Points and directions are in the contract frame,
in mm: x sagittal, y meridional, z along the axis from the first vertex, light travelling toward +z. A direction is
a unit vector `(dx, dy, dz)`. The rays of a field at a positive angle θ travel toward −y: a collimated bundle has
the direction `(0, −sin θ, cos θ)`. An engine traces the rays as they are given and answers in the same frame and
the same order: nothing is mirrored, aimed again, normalised again, sorted or left out. An engine whose own frame
differs converts in its adapter, in both directions.

`spec`:

| Member | Type | Meaning |
|---|---|---|
| `line` | integer ≥ 0 | the index, in the case's `conditions.lines`, of the line whose indices the rays are traced with |
| `origins` | NdArray | float64 `[n, 3]`: where each ray starts |
| `directions` | NdArray | float64 `[n, 3]`: the unit direction of each ray |
| `weights` | NdArray | float64 `[n]`: the flux each ray stands for |
| `groups?` | object | what the rays are, for whoever reads the answer: `field?`, `lattice?`, `chiefIndex?` |

- **Origins** lie strictly in front of the first surface: the z of an origin is below the smallest z the surface
  has anywhere within its clear aperture, which is its vertex when it is convex toward the object and its rim when
  it is concave. So every ray has all of the first element ahead of it, whatever its direction and however far
  from the axis it starts.
- **Directions** have a length within 1e-12 of 1 and a z component above 0.
- **Weights** are finite and not negative. They are for the estimators that sum over rays, each of which uses
  them unchanged; an engine traces a ray of weight 0 like any other.
- **`groups`** changes nothing an engine computes. `field` is `{ angleDeg, heightFraction? }`: the field angle in
  degrees, between −90 and 90, and the fraction of the full image height it was resolved from. `lattice` is
  `{ columns, rows, step }`: the first `columns × rows` rays are the cells of a square lattice, row by row, so the
  cell of row r and column c is ray `r × columns + c`; `step` is the side of a cell, mm, on the plane the lattice
  is laid on. `chiefIndex` is the index of the field's chief ray, a reference for the other rays and no sample of
  the pupil. `groups` is part of the spec, and so of the request's `id`.

`data`:

| Member | Type | Meaning |
|---|---|---|
| `status` | NdArray | uint8 `[n]`: how each ray ended: 0 ok, 1 blocked, 2 failed |
| `endSurface` | NdArray | int32 `[n]`: the index of the surface at which the ray ended; −1 for a ray that is ok |
| `hits` | NdArray | float64 `[S, n, 3]`: where each ray meets each surface |
| `exitPoint` | NdArray | float64 `[n, 3]`: where each ray leaves the last surface: its hit on it |
| `exitDirection` | NdArray | float64 `[n, 3]`: the unit direction of each ray behind the last surface |
| `imagePoint` | NdArray | float64 `[n, 3]`: where each ray meets the plane z = `conditions.imageZ`; its z is that number |
| `opticalPath` | NdArray | float64 `[n]`, mm: the sum of index × length along the ray from its origin to its hit on the last surface |
| `opticalPathToImage` | NdArray | float64 `[n]`, mm: the same sum continued to the image plane |

- **A ray is carried surface by surface**, in the order of the case: it is intersected with the surface, tested
  against the surface's aperture at the hit (its distance from the axis against `semiDiameter`, inclusive, and
  against `innerSemiDiameter`, below which it is stopped; a surface that does not clip stops it at no height), and
  refracted into the medium that follows, whose index is that of the spec's line. The medium in front of the first surface is air, of index 1.
- **The order is the order of the case, not of z.** Where two neighbouring surfaces cross within their clear
  apertures, as a stop set into the curve of the surface before it, the next surface lies behind the ray's last
  hit: the ray's line is met with it there, by a step backwards, and the stretch counts in the optical path with
  its sign. That is what a sequential trace is. A ray that no longer travels toward +z behind a surface, as one
  that a steep surface has bent past the perpendicular to the axis, goes to no further surface: it is blocked at
  the next one, because the point where its line crosses that surface lies behind the ray.
- **A surface is its sag within its clear aperture.** What the sag formula gives beyond `semiDiameter` is no part
  of the system: a polynomial fitted to a clear aperture diverges outside it, and a conic may have ended. A ray
  whose line meets the surface within the clear aperture passes it there; a ray whose line does not is blocked at
  that surface, wherever, and whether, it meets the formula's continuation. A line that meets a steep surface more
  than once within the clear aperture passes it at the meeting nearest the surface's vertex plane: on a sphere of
  either curvature that is where a ray in front of the surface enters it.
- **A surface that does not clip is its sag wherever it has one.** A ray whose line meets it passes it there, at
  the meeting nearest the surface's vertex plane, however far from the axis that is; a ray whose line provably
  meets it nowhere, as one that passes a sphere by, is blocked at it. Such a surface is a plane in every case a
  lens of LensVisualizer's gives. On a curved one whose formula goes on without end, an engine that cannot decide
  whether a line meets it says *failed*, as of any ray it could not trace: the reference engine does so for a line
  on which its iteration finds no hit, since no stretch of such a line is the last to look at.
- **Status.** *ok* (0): the ray passed every surface and reached the image plane. *blocked* (1): the ray carries no
  light to the image and the engine knows why: it met a surface outside its clear aperture or inside its central
  obstruction, it was totally reflected, it provably does not meet a surface, it no longer travels toward +z, or
  it passed every surface and cannot reach the image plane. *failed* (2): the engine could not trace the ray, by a
  numerical failure of its own; that says nothing about the light, and whoever sums over rays must account for it.
- **`endSurface`** of a ray that is not ok is the surface it did not pass: the one that clipped or reflected it,
  or the one it was not, or could not be, intersected with. It is S, one past the last surface, for a ray that
  passed every surface and cannot reach the image plane: it does not travel toward +z, or the plane lies behind its
  exit point by more than 1e-9 mm along the ray.
- **NaN from where a ray ended.** A ray that is ok has a number in every member. Any other ray has a hit on every
  surface before its end surface and NaN from that surface on, the end surface itself included: engines compute a
  point beyond a clear aperture in ways of their own, where they compute one at all. Its `exitPoint`,
  `exitDirection` and `opticalPath` are numbers only when it passed every surface (`endSurface` is S); its
  `imagePoint` and `opticalPathToImage` are NaN.
- **The optical path** is the sum, over the stretches of the ray from its origin to its hit on the last surface, of
  the index of the medium times the length of the stretch. It is measured from the ray's origin, so the paths of
  two rays of a set differ by where the set starts them as well as by the lens; an estimator takes differences
  against the chief ray or a reference sphere. `opticalPathToImage` adds the index after the last surface, at the
  spec's line, times the length from `exitPoint` to `imagePoint`.
- **The image plane within reach.** An exit point that lies behind the image plane by no more than 1e-9 mm along
  the ray, as a plate whose rear face is the image plane puts it to within an engine's intersection tolerance, is
  on the plane: the ray lands at its exit point.

**Invariants checked in code** (`src/quantities/raysTrace.ts`). A spec: `origins` and `directions` are `[n, 3]`
and `weights` is `[n]` for one n of at least 1; every origin is finite; every direction is a unit vector within
1e-12 with a z component above 0; every weight is finite and at least 0; `chiefIndex` is below n, and a lattice has
at most n cells. That the origins lie in front of the first surface, and that `line` is a line of the case, needs
the case, which a spec is validated without: the generators see to the first (`startsInFront`,
`src/rays/probe.ts`: a field whose rays would not is the problem `launch-behind-first-surface`), and an engine
answers a line the case does not have with the error `bad-spec`. Data: the shapes agree on one n and one S of at
least 1; `status` is 0, 1 or 2; `endSurface` is −1 exactly for a ray that is ok and else from 0 to S; and the rule
above for where a ray has numbers and where NaN holds for every ray.

**Compared by three rungs**, which ask the same requests, so that an engine traces a set once for all of them
and the result store holds one answer. Each has a comparator of its own. Positions, paths and the MTF are compared
on the rays that are ok in both answers; in R2 and R3 every metric's `where` has the `ray` of its largest value,
with the `line` of the spec and, where the set states one, its `field` angle in degrees.

*R2, the geometry* (`src/compare/raysGeometry.ts`):

| Metric | Unit | Is |
|---|---|---|
| `hits.maxDistance` | mm | the largest distance between the two hits of a ray on a surface, over every surface; `where` has the `surface` |
| `direction.maxAbs` | 1 | the largest difference of a component of `exitDirection` |
| `landing.maxDistance` | mm | the largest distance between the two `imagePoint`s |
| `mask.mismatches` | rays | the rays the two engines disagree about, outside the rim band |
| `mask.rimBand` | rays | the rays they disagree about within it: counted, never judged |
| `rays.compared` | rays | the rays that are ok in both |

- **A disagreement** is a ray that one engine stopped at a surface the other let it pass: ok in one and blocked in
  the other, or blocked in both at different surfaces. It is at the first surface the two part at, where the
  engine that passed the ray has a hit. Two engines that stopped a ray at one surface agree, whatever each would
  call the reason.
- **The rim band.** A disagreement is in the band when that hit lies within 1e-8 mm (`RIM_BAND_MM`) of the
  surface's `semiDiameter`, or of its `innerSemiDiameter` where it has one: each engine has placed the hit to its
  own tolerance, and the limit is inclusive on a number neither holds exactly. A surface that does not clip has no
  rim and no band: an engine that stopped a ray there, at whatever height, built an aperture the case does not
  have, and the ray is a mismatch. A ray that passed every surface in
  both engines and reaches the image plane in only one is a mismatch: there is no rim there.
- **A ray either engine failed** is in neither count: a failure says nothing about the light. How many rays of
  each answer are ok, blocked and failed is listed with the comparison, as `rays.ok`, `rays.blocked` and
  `rays.failed` under the participant's `recorded`.
- Where no ray is ok in both, the three distances are not measured, and the mask is judged all the same.

*R3, the optical path* (`src/compare/raysPath.ts`), each a difference in waves of the spec's line, which is the
difference in mm over `wavelengthNm` × 1e-6:

| Metric | Is the largest difference of |
|---|---|
| `opticalPath.maxAbs` | `opticalPath` |
| `opticalPathToImage.maxAbs` | `opticalPathToImage` |
| `opd.maxAbs` | the path to the image relative to the chief ray's, W = path(chief) − path(ray): what two engines differ by on every ray alike has cancelled in it |

`opd.maxAbs` is measured where the set states a `chiefIndex` and that ray is ok in both answers; elsewhere it is
not measured, which fails nothing, and the two raw paths stand alone. A ray that is not ok in both has no path in
one answer: that is a matter of the mask, which R2 judges.

*R4, the geometric MTF* (`src/compare/raysMtf.ts`): the comparator's own binless estimator
(`src/estimators/geometricOtf.ts`: one term a ray, no bin, no transform, every sum compensated) applied to where
each of two engines lands the rays of a field, and the two curves set against each other. The rung asks the
requests of R2 and R3, and only of a run that has an [MTF recipe](#the-mtf-recipe). Its sets
[span requests](#comparison): the sets of one field, one for each line of the case (those whose `groups` are
equal and state a `field`), are one comparison.

| Metric | Unit | Is |
|---|---|---|
| `mtf.maxAbs` | 1 | the largest difference of the two MTFs, over the sagittal and the tangential cut and every frequency of the recipe; `where` has the `field` angle in degrees, the `cut` and the `frequencyPerMm` |
| `rays.compared` | rays | the rays that are ok in both answers, over the lines |
| `rays.dropped` | rays | the rays that are ok in one answer and not in the other, over the lines: left out of both sums, counted and never judged; `where` has the `line` and the `ray` of the first |
| `lines.compared` | lines | how many lines of the case, and so how many requests, the figure is of |

- **The rays** of each line are the ones both engines brought to the image. A ray one engine lost is in neither
  engine's sum, so the two curves are of one bundle; that the engines disagree about a ray is R2's to judge, and
  here it is only counted. "Valid in every engine" is of the two engines of a pair: what a third engine lost
  changes nothing between two others, and a pair's figures depend on its own two answers alone.
- **The landing** is the engine's own `imagePoint`, on `conditions.imageZ`. That is the plane of the recipe: a run
  at another focus (`imagePlane: lv-best-axial`) has a case at that plane, so nothing is projected a second time.
  A recipe of another plane than the case's is not comparable.
- **The weights**: a ray counts by its `weights` element in the request, the flux it carries to the image, which
  is the same number for both engines; a line counts by its `weight` in the case times the flux of its rays
  (`polychromaticOtf`): OTF(ν) = Σ W_l S_l(ν) / Σ W_l T_l, the lines added as complex numbers before the modulus
  is taken. With one line it is that line's MTF.
- **The reference point** is one for both engines and for every line: midway between the two engines'
  flux-weighted centroids of the first line's rays. No chief ray is needed for it, so it is not lost when a chief
  ray is clipped; and the modulus does not depend on it (moving it turns every term of the sum by one phase), so
  it decides nothing but how small the phases are.
- **Not measured** where a line has no ray that is ok in both answers, or none that carries flux: the pair says
  so and fails for none of it. **Not comparable** without the recipe or the case, with a recipe of another plane
  or without a frequency, and where the sets of a field are not of every line of the case, each once: a spectrum
  from which a line is missing is another spectrum. A ray that an engine calls ok and lands at no finite point is
  a defect of the answer and no ray to leave out: the pair is `ERROR`.

*R6a, the wave MTF* (`src/compare/raysWaveMtf.ts`): the comparator's own wave estimator
(`src/estimators/waveOtf.ts`: Hopkins' autocorrelation of the pupil function in direction-cosine space, from the
optical paths) applied to each of two engines' traces of the rays of a field, and the two curves set against each
other. The rung asks the requests of R2 to R4 and, after them, those of the same fields on a lattice of twice as
many cells across (the run's `fineRaySets`, [below](#ray-sets)), and only of a run that has an
[MTF recipe](#the-mtf-recipe). Its sets [span requests](#comparison): the sets of one field on both lattices and
at every line of the case (those that state the same `groups.field`, and a `lattice`) are one comparison.

| Metric | Unit | Is |
|---|---|---|
| `waveMtf.maxAbs` | 1 | the largest difference of the two wave MTFs on the finer lattice, over both cuts and the frequencies; `where` has the `field` angle, the `cut` and the `frequencyPerMm`. Reported, and so judged, only where the lattice is an arbiter |
| `waveMtf.flagged` | 1 | the same figure where the lattice is no arbiter: written down, named by no policy and judged by nothing |
| `phaseStep.waves` | waves | the largest step of the path between neighbouring lit cells of the finer lattice, of either engine's estimate; `where` has the `line` and the `ray` |
| `convergence.maxAbs` | 1 | the largest difference between the wave MTF of the finer lattice and that of the coarser, of either engine; left out where there is no coarser estimate |
| `lattice.columns` | cells | the columns of the finer lattice |
| `rays.compared`, `rays.dropped`, `lines.compared` | | as R4 counts them, on the finer lattice |

- **An arbiter** is a lattice whose estimate may be believed (`waveFlags`, `src/estimators/waveValidity.ts`): its
  neighbouring cells are within a quarter wave of each other in both estimates, and neither estimate moved by more
  than 0.005 for a field on the axis, 0.01 for one off it, from the coarser lattice to the finer: the bands within
  which an MTF is held to another method's. A field that fails either, or has rays on one lattice only, is
  **flagged**: `waveMtf.maxAbs` is not measured, the pair's reason says which fact flagged it with its figure, and
  the difference of the two engines is recorded as `waveMtf.flagged`. A flagged field passes, as every metric that
  was not measured does: it is no evidence for the gate and none against it.
- **The rays, the weights and the reference point** are R4's: the rays both engines brought to the image, the
  request's weights, the case's line weights, and one reference point for both engines and every line, midway
  between the two engines' flux-weighted centroids of the first line's rays on that lattice. The modulus does not
  depend on the point; the step from cell to cell does, and it is smallest amid the spot.
- **What is read** of an answer is `imagePoint` with `opticalPathToImage`, the better conditioned of the two
  points a trace has behind the last surface, and `exitDirection`; of the request the weights, and from origins
  and directions the path from the incident wavefront to each origin (`launchPaths`); of the case each line's
  wavelength and weight, the object's conjugate and the index behind the last surface.
- **The frequencies** are the recipe's, thinned to at most eleven, evenly spaced by their place in the list with
  the first and the last kept (`waveFrequencies`, `src/core/mtfRecipe.ts`): of LensVisualizer's 51, every fifth, 0
  to 100 cycles/mm in steps of 10. A wave transfer function costs a search of the pupil for every cell and
  frequency.
- **Not measured** where a line has no ray that is ok in both answers, none that carries flux, or lit cells that
  cannot be laid out as a pupil (`degenerate-pupil`). **Not comparable** as R4 is not, and for a set that states no
  field or no lattice.

The gate of 2e-8 is pinned at Stage 3.12 under policy version 11 (the plan, "Amendments since approval"):
ten times the largest judged figure, 1.18e-9, rounded up to one digit. At LensVisualizer `ab0fd4cf` (closure
`94778d3d`, 175 files) and optiland `4e893f53`, 208 of 288 benchmark fields are judged per pair: `lv/ref` reaches
1.18e-9, optiland against `ref` 1.16e-9, and `lv` against optiland 1.6e-10. The bound is now the exact tracers'
agreement. The ref–optiland test holds an absolute 2e-9, including flagged fields. The former gate of 4e-5 was
pinned on LensVisualizer `33ebdb30`'s 1e-9 mm rounding, carried into the optical path; it is historical.

Answers for different numbers of rays or surfaces are not comparable; nor are any two without the case (R2: its
apertures) or without the request and the case (R3: the line and its wavelength).

`valid/quantities/rays.trace.data/singlet-axis-and-rim.json` is the answer to the spec of the same name about the
case `valid/optical-case/singlet.json`, exact in every number: a ray along the axis, which nothing bends, and a
ray 12 mm off the axis, which meets the first surface outside its clip radius and ends there.

#### Ray sets

The rays of a run are **ray sets**: `rays.trace` specs, one for each field of the run and each line of the case.
Where they come from is the business of the case source (`CaseSource.raySets`, `src/core/suite.ts`), because what
"the same rays as the engine under test uses" means depends on where the case came from. A rung's request builder
only wraps the sets it is handed, so it is the same function for every engine and every source. A set is content:
its arrays are in the spec, the spec is in the request's `id`, and its identity, the SHA-256 of the canonical JSON
of the spec, is what a run's manifest records under `runs[].raySets.sets`. Nothing of a set is kept in the
repository. A field that has no rays is a coded problem of that field, recorded under `runs[].raySets.problems`
as `<code>: <message>`; the other fields are traced, and the run fails for none of it.

**The finer lattice.** A rung that takes a wave transfer function of the traced rays (`r6a`) asks for a field's
rays on two lattices, the run's own and one of twice as many cells across (`fineSampling`, `src/rays/raySets.ts`),
and says by the two whether the finer has converged. The finer sets are made by the same source, asked with
`sampling.bundleGrid` doubled, and are recorded under `runs[].fineRaySets`, sets and problems as above. They are
generated only when such a rung is run and are asked of no other rung: R2, R3 and R4 judge the run's own sets.

**For a case read from a file** (`src/rays/probe.ts`) the sets are probe lattices made from the case alone:

| | Is |
|---|---|
| lattice | `sampling.bundleGrid` cells across (an odd number is raised to the next even one, so that no ray lies on the axis or in a plane through it), laid on the first surface's vertex plane and centred on the axis, with a half width of 1.125 clip radii of the first surface: the cells past the rim are stopped at once. A first surface that does not clip is probed over 1.125 times its extent, `nominalSemiDiameter` |
| object at infinity | a collimated bundle with the field's direction, each ray started on the plane 10 mm in front of the first surface: of its vertex, or of its rim when it is concave toward the object; every weight is 1 |
| finite object | every ray starts at the object point of the field, `(0, −object.z × tan θ, object.z)`: the field angle is measured at the first vertex; a ray's weight is the solid angle of its cell relative to a cell straight ahead of the point, `(D / d)³`, with D the point's distance from the lattice plane and d its distance from the cell. An object point that is not in front of the first surface, inside the bowl of a concave one, is the problem `launch-behind-first-surface` |
| fields | angles in degrees as given; of image-height fractions only 0, the axis, since a case states no image height: any other is the problem `field-fraction-unresolved` |
| lines | the same rays at every line of the case |
| `groups` | `field` and `lattice`; no chief ray |

The generators under them (`src/rays/generators.ts`: a collimated lattice, a diverging lattice from a point, a
collimated fan along x or y) need nothing but numbers.

**For a LensVisualizer lens** (`src/engines/lv/raySets.ts`) the sets are LensVisualizer's own launch rays, the
ones its MTF samples a pupil with:

| | Is, in LensVisualizer |
|---|---|
| request | its MTF options with the stop radius of the case and, as the seed of the footprint scan, the pupil radius the hook of its MTF tab hands over for that stop radius (`lvPupilSeed`, `src/engines/lv/tabRequest.ts`; see [the tab's request](#the-request-of-the-mtf-tab)); its support record (`assessMtfSupport`) with the lines of the case, so that everything below is found at the case's reference line with LensVisualizer's indices for it |
| fields, as fractions | the field axis `resolveMtfFieldGeometry(state, mtfModeledHalfField(state), mtfChiefHeight(…), { reference: mtfChiefHeight(…, false), beam: mtfBeamHeight(…) })`, then `resolveMtfFieldTargets`: the chief-ray angle of each fraction of LensVisualizer's reference image height, as its MTF resolves it. That solved angle is the field of the set |
| fields, as angles | taken as given |
| chief ray and beam | `prepareMtfFieldLaunch`, `findMtfFieldFootprint` |
| lattice | `mtfLaunchGrid(footprint, bundleGrid)`: square cells, an even number of columns |
| rays | every cell, the ones an aperture will stop included and none mirrored: the cell of row r and column c is `mtfLaunchRay(launch, x0 + (c + 0.5) step, y0 + (r + 0.5) step)`, which is where LensVisualizer's own bundle launches it; then the chief ray, `mtfLaunchRay(launch, 0, 0)`, which is no cell of the lattice, as the last ray, with its index under `groups.chiefIndex` |
| weights | LensVisualizer's weight of a pupil sample: 1 in a collimated bundle and `(chief distance / ray distance)³` from the object point of a certified finite conjugate, times its bulk transmission where a glass of the lens absorbs, which it states as the weight of `mtfImagePoint` at that line. The chief ray weighs 0 |
| lines | the same rays at every line, as LensVisualizer finds a field's chief ray and footprint once, at the reference line; only the weights are a line's |

A field without rays has LensVisualizer's own reason as its code: `outside-modeled-field` for an image height
beyond the modeled edge, `chief-ray-failed` where it finds no chief ray, `vignetted` where no ray of the field
reaches the image. LensVisualizer launches from a plane 10 mm or more in front of the first surface's vertex and
rim, which is in front of the surface as the contract asks; the sets are checked for it all the same, and a field
that broke it would be `launch-behind-first-surface`. Where its MTF gate does not pass for the state at all (a
fisheye projection, an annular aperture, an unverified scale), there is no launch of its own to take, and the
gate's reason is the one problem of every field. LensVisualizer's `traceMtfBundle` traces half the columns and
mirrors the rest; the sets hold every cell as a ray of its own, and `lv` traces each. Two things `traceMtfBundle`
and `computeMtfSteps` do inline, and export no function for, are restated: the lattice point and weight of a cell,
and the assembly of the field axis.
Tests hold both to LensVisualizer, the rays to those of its own bundle bit for bit and the source lines to their
text. The seed is the one LensVisualizer's MTF tab asks with: for a case whose stop is the tab's, the rays of a
set are the tab's own launch rays at that grid, to the bit.

#### Spot sets and rung R7a

**Spot sets** (`CaseSource.spotRaySets`, `src/rays/spotSets.ts`) are the rays of LensVisualizer's coma and bokeh
tabs, and no part of a run's ray sets: R2 to R4 never see them. Only a LensVisualizer lens has them
(`src/engines/lv/spotRaySets.ts`); the manifest records them under `runs[].spotRaySets`, sets and problems as above,
exactly when a rung that needs them (`RungDefinition.needsSpotRaySets`: `r7a`, `r7b`) was run.

| | Is, in LensVisualizer |
|---|---|
| request | the analysis drawer's: the prepared state, the hook's pupil radius for the case's stop radius (`lvPupilSeed`), the stop radius of the case, the hook's field geometry, the quality "settled", whose sampling is every family default |
| patterns | the coma tab's point cloud (`COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES` at `COMA_PREVIEW_FIELD_FRACTIONS`), its tangential and sagittal fans of `MERIDIONAL_COMA_SAMPLE_COUNT` samples (made odd) at the lens's authored `offAxisFieldFrac`, and the bokeh tab's tiles (`BOKEH_CIRCULAR_PUPIL_RING_SAMPLES` at `BOKEH_PREVIEW_FIELD_FRACTIONS`), in that order. Fractions are of the half-field angle of the state |
| field | `computeOffAxisFieldGeometry(state, fraction, fieldGeometry)`: the slope `uField` of the field and the height `yChief` at which its chief ray crosses the first vertex plane |
| rays | every sample of the pattern (`sampleCircularPupil`, `sampleOrthogonalPupilFan`), the ones an aperture stops included, crossing the first vertex plane at `(xFraction × r, yChief + yFraction × r)` with `r` the pupil radius, collimated along `(0, uField, 1)` made a unit vector (`directionFromSkewSlope`), and started `rayLead` ahead of that plane as LensVisualizer's skew launch starts them; then the chief ray, `(0, yChief)`, as the last ray, with its index under `groups.chiefIndex`. `groups.field.angleDeg` is LensVisualizer's angle of the fraction |
| weights | a point of the cloud its area weight (`1/N`), a fan's sample 1, a ray of a tile its area weight times LensVisualizer's bulk transmission at the line (`lvRayWeights`); the chief ray 0 |
| lines | the same rays at every line of the case |

A fisheye field LensVisualizer launches from a bounding sphere (`lv-vector-launch`), a field it has no launch for
(`lv-no-launch`), a coma fan on the axis (`lv-no-fan-on-axis`) and rays that would not start in front of the first
surface (`launch-behind-first-surface`) are coded problems of that field. A folded case (`folded-path`) and a case
whose object is not at infinity (`object-not-at-infinity`) have no spot sets: LensVisualizer's tabs launch collimated
rays at every focus, and they are compared at infinity focus. Every restated line has a source canary, and the sets,
traced as the tabs trace them, give the tabs' point cloud, fans and tiles to the bit
(`test/integration/lv/spotRays.test.ts`).

**Rung R7a** asks one `rays.trace` request of each spot set and compares each pair of answers with the comparator's
spot estimator (`src/estimators/spot.ts`), on the rays both answers landed, each spot relative to its own engine's
landing of the chief ray, as the tabs draw them: `transverseError.maxAbs` (the largest difference of a ray's
chief-relative landing, along x or y), `centroid.maxAbs` (of the flux-weighted centroids, chief-relative) and
`rmsRadius.maxAbs` (of the RMS radii about them), each gated at 1e-8 mm, and `mask.mismatches` at 0 with
`mask.rimBand` counted, as R2 counts them: no other rung traces these rays. Without a chief ray both answers
landed, or without another ray, the spot's three figures are not measured, and the pair says why.

#### Axial sets and rung R8a

**Axial sets** (`CaseSource.axialRaySets`, `src/rays/axialSets.ts`) are the rays of LensVisualizer's
spherical-aberration section (its aberrations tab) and its axial-colour section (its chromatic tab), and no part of a
run's ray sets. Only a LensVisualizer lens has them (`src/engines/lv/axialRaySets.ts`, zones in `axialZones.ts`); the
manifest records them under `runs[].axialRaySets`, sets and problems as above, exactly when a rung that needs them
(`RungDefinition.needsAxialRaySets`: `r8a`, `r8b`) was run.

| | Is, in LensVisualizer |
|---|---|
| request | the analysis drawer's, as for the spot sets: the hook's pupil radius `r` for the case's stop radius |
| zones | of spherical aberration the near-axis zone (`NEAR_AXIS_REAL_FRAC`), the marginal candidates in the order tried (`MARGINAL_PUPIL_FRACTIONS`) and the profile (`PROFILE_FRACS`); of axial colour its candidates (`DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS`, each once, clamped, above 0) |
| rays | two sets: the profile's zones, and the near-axis zone, the marginal candidates and the colour candidates not among them, each zone once; each zone `f` the ray launched at the height `f × r` and its mirror image at `-f × r`, in that order, on the meridian, parallel to the axis (`(0, 0, 1)`), started `rayLead` ahead of the first vertex plane as LensVisualizer's meridional launch starts it. Weight 1; `groups.field.angleDeg` 0; no chief ray |
| lines | the same rays at every line of the case, as the axial-colour section traces the same heights at each channel |

A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`), a pupil radius not
above 0 (`no-pupil`) and rays that would not start in front of the first surface (`launch-behind-first-surface`) have
no axial sets. Every restated line has a source canary, and the sets, traced as the sections trace them (the authored
indices, or a channel's), give the sections' intercepts, best focus, RMS, profile and channel foci to the bit
(`test/integration/lv/axialRays.test.ts`).

**Rung R8a** asks one `rays.trace` request of each axial set and compares each pair of answers with the comparator's
axial estimator (`src/estimators/axialIntercept.ts`), on the rays both answers brought to the image: where each ray's
exit (`exitPoint`, `exitDirection`) crosses the axis, `z - y n / m`, and the least-squares focus of the set's mirror
pairs whose two rays both cross it, `sum u^2 z / sum u^2` with `u = m / n`, and the RMS of their heights there. An
intercept is judged on the transverse scale: `intercept.maxScaled`, the largest difference of a ray's two intercepts
times the larger of its two slopes (the height at which each engine's ray passes the other's crossing), gated at
1e-8 mm, with `intercept.maxAbs` along the axis shown beside it; `focus.maxScaled`, the difference of the two foci
times the larger RMS slope, gated at 1e-8 mm, with `focus.maxAbs` beside it; `focusRms.maxAbs` gated at 1e-8 mm; and
`mask.mismatches` at 0 with `mask.rimBand` counted. Each figure takes the larger slope of the two answers, so that
an engine whose slope is wrong and small cannot scale its own difference away; the focus figures are the rung's only
sign of exit slopes that differ where the intercepts agree. A ray whose intercept or slope is no finite double
(`out-of-range`) has none. A ray that crosses the axis in one answer and not in the other, and a set off the
meridional plane, are not comparable; a set of no mirror pairs has no focus.

#### Chief sets and rung R9a

**Chief sets** (`CaseSource.chiefRaySets`, `src/rays/chiefSets.ts`) are the chief rays of LensVisualizer's distortion
tab (its curve and its traced field grid), its pupils tab and the lateral-colour section of its chromatic tab, and no
part of a run's ray sets. Only a LensVisualizer lens has them (`src/engines/lv/chiefRaySets.ts`, the request and the
reference in `chiefSetup.ts`); the manifest records them under `runs[].chiefRaySets`, sets and problems as above,
exactly when a rung that needs them (`RungDefinition.needsChiefRaySets`: `r9a`, `r9b`) was run.

| | Is, in LensVisualizer |
|---|---|
| request | the analysis drawer's, as for the spot sets: the hook's field geometry, whose half field (`halfFieldDeg`) and paraxial pupil ratio (`epRatio`) the tabs read |
| `distortion-curve` | the probe of the rectilinear reference (`min(max(0.01 × halfField, 0.02), 0.5)` degrees, launched from the paraxial pupil, `ray(-epRatio × uField, uField)`), the edge chief ray (`halfField`), and the chief ray of every sample of `computeDistortionCurve` after the axis, at the angle its inversion solved for the sample's target height; each a meridional launch `ray(solve.yLaunch, uField)` of `solveChiefRayForRuntimeLens`. `groups.chiefIndex` 0: the probe |
| `distortion-grid` | the probe, then every point `computeDistortionFieldGrid` traces, in its order: the slopes of its ideal point (`projectionFieldSlopesForImagePoint`), launched as the skew ray `skew(-e × sx, -e × sy, sx, sy)` with `e` the paraxial pupil ratio times the grid's interpolated pupil correction (17 entries, 9 for a heavy lens, of `solveChiefRay` over the paraxial launch). `groups.chiefIndex` 0: the probe |
| `pupils` | the solved chief ray of every field of the pupils tab off the axis (`uniformFieldFraction(i, PUPIL_ABERRATION_SAMPLE_COUNT)` of the half field), launched `ray(solve.yLaunch, uField)` |
| `lateral-colour` | the chief ray of every field of the lateral-colour section (`DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS` of the half field, each once, clamped, at least 0), the coma tab's chief launch `skew(0, yChief, 0, uField)` of `computeOffAxisFieldGeometry` |
| launches | a meridional ray starts `rayLead` ahead of the first vertex plane at `(0, y0 - u0 × rayLead)` along `(0, u0, 1)` made a unit vector (`directionFromMeridionalSlope`; `(0, 0, 1)` for a slope of 0), a skew ray as for the spot sets; weight 1 |
| lines | the same rays at every line of the case, as the lateral-colour section traces the same chief ray at each channel |

A folded case (`folded-path`), a case whose object is not at infinity (`object-not-at-infinity`) and a state without a
half field (`no-half-field`) have no chief sets. A fisheye lens has no distortion sets (`lv-fisheye-projection`), nor
has a state without a rectilinear reference (`lv-no-distortion-reference`), an empty curve (`lv-no-distortion-curve`) or
a grid with no line or no traced point (`lv-no-distortion-grid`); a lens whose paraxial exit pupil is at infinity has no
pupil set (`lv-exit-pupil-at-infinity`); a field launched from a bounding sphere (`lv-vector-launch`) or without a
launch (`lv-no-launch`) is a coded problem of that field, and no field of the `chief.native` asks either
(`src/engines/lv/chiefFields.ts` decides the fields of the sets, the asks and `lv`'s answer alike); a pattern whose rays
would not start in front of the first surface is `launch-behind-first-surface`. Every restated line has a source canary,
and the sets, traced as the tabs trace them, give the curve's probe, edge, ideal heights and percent distortion, every
grid point, every field's real exit pupil and every channel's chief landing to the bit
(`test/integration/lv/chiefRays.test.ts`).

**Rung R9a** asks one `rays.trace` request of each chief set at each line, and compares the requests of one set at
every line as one span (`spanOf`: the rays of a set apart from its line), on the rays both answers brought to the
image. `landing.maxAbs` is the largest difference of a landing (`imagePoint`), along x or y; `lateralColour.maxAbs`
the largest difference of the two engines' moves of a landing from the span's first line to another, along x or y;
`distortion.maxScaled`, of a set that states its probe, the largest difference of a ray's displacement from the ideal
point of the rectilinear reference the engine's own probe landing scales (`src/estimators/distortion.ts`: the ideal
point is the probe's landing height times the ray's launch slopes over the probe's; a probe off the meridian, by its x
slope or its x landing, scales nothing), along x or y, which is what the percent distortion is a percentage of (a
difference of the probe's landing enters it times the ray's slope over the probe's, so it is not on the transverse
scale for the probe); and `exitPupil.maxScaled` the largest difference of where a chief ray
crosses the axis behind the system (`axialIntercept`) times the larger of its two slopes there. Each is gated at
1e-8 mm, with `mask.mismatches` at 0 and `mask.rimBand` counted. Shown beside them and never judged:
`distortion.maxAbs`, the difference of the radial percent distortion, and `exitPupil.maxAbs`, the crossing's
difference along the axis. Lateral colour is inapplicable to a case of one line, distortion to a set without a probe;
a line whose probe gives no distortion while other lines do is named in the pair's reason. A ray that crosses the axis
in one answer and not in the other, or has a distortion in one and not in the other, is not comparable.

### `axial.native`

Version 1, added at Stage 6.3, changes no existing quantity, contract version or identity. It is an engine's own
figures of the beam along the axis of a system whose object is at infinity, from rays launched parallel to the axis
at fractions of the engine's own pupil radius at the first line asked, the same heights at every line: what
LensVisualizer's spherical-aberration and axial-colour sections present, and what optiland traces with its own pupil
and paraxial focus at each line. Nothing of an answer is gated: rung R8b records it.

The spec is one of two kinds:

| Kind | Members | Meaning |
|---|---|---|
| `spherical` | `lines` (one index), `nearAxis`, `marginal`, `profile` | spherical aberration at one line: each zone a ray and its mirror image; the near-axis pair the reference, the first marginal candidate whose two rays cross the axis the marginal pair, the profile's pairs the bundle whose least-squares focus is the best focus |
| `colour` | `lines` (each once; the first the reference), `marginal` | axial colour: one ray at each line, the first candidate whose ray crosses the axis at two lines or more (at the one line of a request of one) |

Every fraction lies in (0, 1].

| Answer member | Meaning |
|---|---|
| `kind` | the kind of the spec |
| `pupilRadiusMm` | the radius the fractions are of, above 0 |
| `fields[]` | one per asked line, in order: `line`, `wavelengthNm` traced, `status` `ok` or `unavailable`, `reason` (always for `unavailable`), `paraxialFocusZ` (the paraxial rear focal point, or null), `figures`, `rays`, `sampling` |
| `figures` | an engine's own: `landingMm` (the height on the image plane of the case of the ray the line is identified by: the near-axis pair's mean, or the marginal ray of colour), `marginalFraction`, `marginalInterceptZ`; of spherical aberration also `nearAxisInterceptZ`, `bestFocusZ`, `bestFocusRmsMm` and `profileMm` (float64, one value a profile zone: its plus ray at the best focus relative to the near-axis plus ray, NaN where its pair did not arrive), null for colour |
| `rays` | the real rays an engine traced, for figures the comparator forms: float64 `fractions` (signed), uint8 `arrived`, float64 `exitPoint` and `exitDirection` `[m, 3]`, NaN where a ray did not arrive |
| `method`, `notes` | the engine's name for its method with its settings, and words for people |

Every z is of the contract frame, mm. An `ok` line has exactly one of `figures` and `rays`; an `unavailable` line
neither. The schemas, corpus, quantity invariants and the stdlib Python port (`validate_axial_native`) enforce these
definitions. The engines `lv` (figures) and `optiland` (rays) answer it; `ref` does not.

#### Rung R8b: LensVisualizer's axial sections beside optiland's own rays and focus

`r8b` asks one `axial.native` request of each section (the case source's asks): spherical aberration at the case's
reference line and axial colour at every line, at the sections' own zones, of `lv` and `optiland` only, and only
where it is named. `lv` answers from `computeSphericalAberration` and `computeSAProfile` at the authored indices, and
from `computeLongitudinalChromaticFocus` at each line whose wavelength is one of its channels' (C, d, F, g, or C′, e,
F′, g for a lens of native e-line indices), stating under `sampling.indexMaxDelta` how far the channel's indices are
from the case's; both on the design plane only. optiland answers with the rays its own ray generator launches at
`(0, f)` of the axial field with its default aiming (paraxial), at the first line's optic, traced at every line, each
setting read back, and `F2()` plus the image plane. optiland refuses, before anything is built, the cases whose
first-order data its paraxial model does not see, as for `paraxial.first-order`: a phase profile
(`optiland-phase-paraxial-unseen`) and a term of power 1 or 2 (`surface.asphere.linear-term`,
`surface.asphere.quadratic-term`); its pupil and its focus would be those of another lens.

The comparator forms the figures of rays with its estimator, at the marginal fraction the other answer took where it
states one. A line is sorted before any difference (`classifyAxialLine`): R5's `classifyNativeField` first,
unsupported (no figures) and data of other wavelengths; then the rung's own data, an answer that traced the line at
indices other than the case's (`sampling.indexMaxDelta` above 0: `indices-differ`) and pupils whose radii differ by
more than the relative limit (`pupils-apart`; the near-axis pair's mean lands on the axis by symmetry and so cannot
tell pupils apart); then R5's landing of the identifying rays; then method. The figures are `pupilRadius.relative`
(how far apart the pupils' radii are, of the larger) and `landing.maxAbs`; of spherical aberration
`marginalIntercept.maxAbs`, `nearAxisIntercept.maxAbs`, `longitudinalSa.maxAbs`, `bestFocus.maxAbs`,
`bestFocusRms.maxAbs`, `profile.maxAbs`; of colour `lineFocus.maxAbs` (each line's real focus),
`relativeFocus.maxAbs` (each line's real focus relative to the first) and `paraxialFocalShift.maxAbs` (one engine's
real relative focus beside the other's paraxial chromatic focal shift, a different quantity); and counts of lines of
each kind. Policy 17 gives `landing.maxAbs` a limit of 1e-5 mm and `pupilRadius.relative` one of 2e-10, the limits of
the sorting, and each spherical figure an attention band of 1e-10 mm; the colour figures have none, and
`paraxialFocalShift.maxAbs` never has one. `axialFactsOfRecorded` repeats the sorting from the values a comparison
records.

### `chief.native`

Version 1, added at Stage 6.4, changes no existing quantity, contract version or identity. It is an engine's own
figures of the chief rays of a system whose object is at infinity, at field angles in object space, degrees, in the
meridional plane (an object toward +y): what LensVisualizer's distortion tab (its curve), its pupils tab and the
lateral-colour section of its chromatic tab present, and what optiland's distortion model, its own chief rays and its
paraxial pupils give. Nothing of an answer is gated: rung R9b records it.

| Spec member | Meaning |
|---|---|
| `kind` | `distortion` (at one line: each field's real and ideal image heights and percent distortion against the engine's own rectilinear reference), `pupils` (at one line: where each field's real chief ray crosses the axis ahead of the system and behind it), or `lateral-colour` (at each line: where each field's chief ray lands; the first line is the reference) |
| `lines` | indices of lines of the case, each once: one for distortion and pupils |
| `maxFieldDeg` | the half field the angles are of, above 0 and below 90; an engine that states its fields as fractions of a half field takes it for that |
| `fieldAnglesDeg` | each at least 0 and at most `maxFieldDeg`; above 0 for distortion and pupils |

| Answer member | Meaning |
|---|---|
| `kind` | the kind of the spec |
| `fields[]` | one per asked line and field: the lines in the order asked, and within a line the angles in order: `line`, `wavelengthNm` traced, `fieldAngleDeg` traced, `status` `ok` or `unavailable`, `reason` (always for `unavailable`), `chiefLandingMm`, `figures`, `chiefRay`, `sampling` |
| `chiefLandingMm` | the y at which the field's chief ray lands on the image plane of the case, mm: what identifies the field |
| `figures` | an engine's own: of distortion `realHeightMm` (the real height its curve plots), `idealHeightMm` and `percent` (100 (real - ideal) / ideal); of pupils `entrancePupilZ` and `exitPupilZ` (where the real chief ray's line in object space and in image space crosses the axis); every other member null; null for lateral colour |
| `chiefRay` | of pupils, the chief ray an engine traced, for pupils the comparator forms: `entryPoint` and `entryDirection` (where it meets the first surface, its unit direction in front of it), `exitPoint` and `exitDirection` (where it leaves the last surface, its unit direction behind it), three finite numbers each |
| `reference` | `focalScaleMm` (the scale of the rectilinear distortion reference: an ideal height is minus the scale times the tangent of the field angle), `probeAngleDeg` (the field angle the scale was measured at), `paraxialEntrancePupilZ`, `paraxialExitPupilZ`; null where the engine states none |
| `method`, `notes` | the engine's name for its method with its settings, and words for people |

Heights and z are of the contract frame, mm. An `ok` field has its landing; of distortion its figures, of lateral
colour neither figures nor a chief ray, of pupils its figures or its chief ray and not both; an `unavailable` field
neither. The schemas, corpus, quantity invariants and the stdlib Python port (`validate_chief_native`) enforce these
definitions. The engines `lv` (figures) and `optiland` (figures of distortion, chief rays of pupils) answer it; `ref`
does not.

#### Rung R9b: LensVisualizer's chief-ray tabs beside optiland's own

`r9b` asks one `chief.native` request of each tab (the case source's asks): the distortion curve and the pupils at the
case's reference line and the lateral colour at every line, at the tabs' own field angles whose chief ray a set states,
of `lv` and `optiland` only, and only where it is named. `lv` answers from `computeDistortionCurve` (each sample's
target height as its real height, its ideal height and percent, the scale of its reference),
`computeBothPupilAberrationProfiles` (each field's entrance pupil at `z[0] + epRatio + epShiftMm`, its exit pupil at
`z[last] + xpZRelLastSurf`, the stored paraxial pupils) and `computeLateralColorCurve` at each line whose wavelength is
one of its channels', stating `sampling.indexMaxDelta`; its identifying landing is its solved chief ray's
(`chiefRayImageHeightAccurateForRuntimeLens`) or the lateral-colour section's own; all on the design plane only, decided
before any tab is asked. optiland answers distortion with its `RotationalDistortionModel`
(`create_distortion_model("paraxial", distortion_type="f-tan")`, what its `Distortion` computes with) under its default
aiming on an optic whose one field is the half field, every setting read back; its identifying landing, its lateral
colour and its pupils' chief rays are its robust-aimed chief rays through the centre of the stop (`mtf.probe_field`),
and its paraxial pupils `EPL()` and `XPL()`. optiland refuses distortion and pupils of a case whose first-order data its
paraxial model does not see, as for `paraxial.first-order`.

A field is sorted before any difference (`classifyChiefField`): R5's `classifyNativeField` first, unsupported (no
landing) and data of other wavelengths; then the rung's own data, an answer that traced the field at indices other
than the case's (`indices-differ`); then R5's landing of the chief rays (`chiefLanding.maxAbs`); then method. The
figures are `chiefLanding.maxAbs`; of distortion `distortionPercent.maxAbs` (percent points), `realHeight.maxAbs`,
`idealHeight.maxAbs` and `focalScale.relative`; of lateral colour `lateralColour.maxAbs` (each field's landing
relative to the first line); of pupils `entrancePupil.maxAbs`, `exitPupil.maxAbs`, `paraxialEntrancePupil.maxAbs` and
`paraxialExitPupil.maxAbs`; and counts of fields of each kind. Policy 18 gives `chiefLanding.maxAbs` a limit of
1e-5 mm, the limit of the sorting, and no figure an attention band. `chiefFactsOfRecorded` repeats the sorting from the
values a comparison records.

### `wavefront.native`

Version 1 adds an engine's raw wavefront without changing any existing quantity or contract version. The spec is
`{ line, fields, grids }`: a zero-based line index, fields as for `mtf.native`, and ascending even grid sizes of at
least four. Each grid is the square of midpoint coordinates `(2 column + 1)/n - 1`, `(2 row + 1)/n - 1`, in row-major
order; only centers strictly within the unit circle are traced. With optiland's aiming they are stop coordinates,
not an even grid in image-side direction cosines. Fractions need the recipe angles in `fieldAnglesDeg`.

| Answer member | Meaning |
|---|---|
| `line` | `index`, vacuum `wavelengthNm`, `weight`, image-space `imageIndex` actually used |
| `fields[]` | `field` as asked, `fieldAngleDeg`, `imageHeightMm`, `status`, optional `reason`, `samples[]` |
| `status` | `ok` for raw samples, never a convergence claim about an OTF; `unavailable` needs a reason and no samples |
| `samples[].gridSize` | even grid size, ascending; N is its square |
| `normalizedPupil` | float64 `[N,2]`, the full midpoint square, including untraced cells outside the circle |
| `pupilMm` | float64 `[N,3]`, optiland's intersections with its reference sphere, in its stated frame |
| `opdWaves` | float64 `[N]`, optiland's `(reference path - sample path) / vacuum wavelength`, including its launch phase; no tilt removal |
| `intensity`, `valid` | float64 `[N]` nonnegative intensity; uint8 `[N]`, 1 iff intensity is positive, 0 otherwise |
| `reference` | `strategy: chief_ray`, `removeTilt: false`, `sphereCenterMm[3]`, positive `radiusMm`, `exitPupilMm[3]` |
| `method`, `notes` | algorithm with parameters and human notes; no transfer function |

All arrays are finite. Cells with validity 0 contribute nothing. The worker fills untraced square cells with
zero pupil, OPD and intensity and validity 0; optiland also zero-fills nonfinite samples. A zero OPD alone is never evidence of light. No positive-intensity cell lies outside the circle.
The reference sphere is centered on the chief ray's landing on the case image plane; its radius is the distance
to optiland's paraxial exit pupil. Coordinates and OPD are returned as optiland gave them; the optic is mirrored in
y as for its FFT. The schemas, corpus, quantity invariants and the stdlib Python port enforce these definitions.
An absent line, unresolved fractions or a finite object is unsupported; a field optiland raises on has its own
unavailable row, and the other fields remain. BuildMismatch, MemoryError and ImportError are FATAL. The worker
checks REQUEST_BUDGET_S between fields, returns `time-budget`, and the result store keeps no such error.

### `spot.native`

Version 1, added at Stage 6.2, changes no existing quantity, contract version or identity. It is an engine's own
spot of a bundle, or its own ray fan, of the case at one line and at given fields, on the image plane of the case,
by the engine's own sampling of the pupil and its own aiming: what LensVisualizer's coma and bokeh tabs present,
and what optiland's `SpotDiagram` and `RayFan` give. Nothing of it is the comparator's, and no two engines are
expected to agree on it within a tolerance: rung R7b records it.

The spec is `{ line, fields, pupil }`:

| Member | Meaning |
|---|---|
| `line` | the index of the case's line the rays are traced at |
| `fields` | `half-field-fractions`: fractions of the half-field angle of the state as the engine that models the lens defines it (LensVisualizer's tabs); another engine is handed the angles with its option `fieldAnglesDeg`. Or `angles-deg`, an object toward +y positive |
| `pupil` | `{ kind: "rings", rings, weighting }`: a spot, a centre and rings of the given numbers of rays as the requesting tab samples it, each ray counted for its `area` or for its area times the bulk transmission of its path (`area-transmission`). Or `{ kind: "fan", axis, samples }`: an odd number of samples evenly from -1 to 1 along the `tangential` (y) or `sagittal` (x) axis of the pupil |

An engine samples by its own pattern, states it under `method.params`, and need not use the request's rings.

| Answer member | Meaning |
|---|---|
| `pattern` | `rings` or `fan`: the kind of the spec's pupil |
| `fields[]` | `field` as asked, `fieldAngleDeg`, `imageHeightMm` (the distance of the engine's chief ray landing from the axis), `status` `ok` or `unavailable`, `reason` (always for `unavailable`), `spot`, `fan`, `sampling` |
| `spot` | of a rings pattern: `centroidMm` `[x, y]` relative to the chief ray's landing and `rmsRadiusMm`, the RMS distance from that centroid, by the engine's own weights |
| `fan` | of a fan: float64 `pupil` coordinates from -1 to 1 and `errorMm`, the transverse error along the fan's axis relative to the chief ray's landing, NaN where a sample did not land |
| `lines` | the one line traced |
| `method`, `notes` | the engine's name for its method with its settings, and words for people |

Lengths are mm, x sagittal and y tangential in the contract frame. An `ok` field has exactly the member of its
pattern and a null for the other; an `unavailable` field has neither. The schemas, corpus, quantity invariants and
the stdlib Python port (`validate_spot_native`) enforce these definitions. The engines `lv` and `optiland` answer
it; `ref` does not.

#### Rung R7b: LensVisualizer's coma and bokeh tabs beside optiland's spot and fan

`r7b` asks one `spot.native` request for each pattern of the tabs (`SpotNativeAsk`), at the case's reference line
and the tabs' own fractions of the half field, of `lv` and `optiland` only, and only where it is named. optiland is
handed LensVisualizer's angle of each fraction as its option `fieldAnglesDeg`. `lv` answers from its coma tab's
`computeComaAnalysis` (a cloud, a fan) on the design plane, and from its bokeh tab's `computeBokehFieldFootprint` at
the plane of the case; it answers only a case whose line 0 holds the authored indices it traces at. optiland answers
with `SpotDiagram` (hexapolar, the number of rings nearest the pattern's rays, global coordinates, centroid
reference) and `RayFan` (`line_y` or `line_x`, mirrored to the contract's frame), each setting read back.

A field is sorted by R5's `classifyNativeField` before any difference: unsupported (no spot or fan), data (other
lines; chief rays that land apart beyond the rung's limit; no landing), method. The figures are
`chiefLanding.maxAbs`, `spotCentroid.maxAbs`, `spotRmsRadius.maxAbs` (a spot) or `fanError.maxAbs` with
`fanSamples.unpaired` (a fan), and counts of fields of each kind. The rung is recorded. Policy 16 gives
`chiefLanding.maxAbs` a limit of 1e-5 mm, the limit of the sorting: a field whose two chief rays land further apart
is data, and its pair ATTENTION. The spot and fan figures have no band. A policy without the limit sets no field
aside by its landing, and every pair then says so.

### Rung R6c and the adapter `optiland-wave`

`r6c` uses the one `mtf.native` request of R5, at the recipe's resolved fractions and thinned frequencies, on the
case plane, on reference or several-line cases. Its four columns are LV's own sheared estimate (`lv`), the wave
estimator on LV's rays (`wave`), optiland's own FFT MTF (`optiland`), and the comparator's OTF of optiland's raw
wavefront (`optiland-wave`). It runs only where named. No existing TypeScript optical engine gained a quantity or a new estimator.
The last adapter owns an ordinary optiland worker connection, negotiates `wavefront.native` version 1 before a
request, validates its response and its field/line/grid correspondence, and applies the pure TypeScript estimator.
Its fingerprint is optiland's; its adapter revision combines the worker revision with its own import closure.
Its lifetime closes the underlying worker. The derived native-shaped answer is the comparator's, never optiland's
own MTF. Raw requests remain directly available through `optiland`.

The raw grids are 128 and 256 by default (`wavefrontGrids` may name other ascending even grids). The estimator
uses each sphere point Q about center C as the radial reference direction `(C-Q)/|C-Q|`, coordinates n times its
transverse components, optical path W = -lambda OPD, and intensity as cell flux. It calls the unchanged Hopkins
kernel of `waveOtf.ts` through a synthetic lattice about C; it claims no traced exit direction. This reference-
sphere model, its flux convention and the FFT's different mapping remain method choices. No operation of the old
wave estimator moved, and the closures of `lv`, `ref`, `replay` and `wave` remain byte-identical.

A fine estimate is numerical when neighboring lit cells exceed a quarter wave, when its modulus moved on doubling
by more than 0.005 on axis or 0.01 off axis, or when convergence is unknown. Failed fine estimates become unavailable;
no line or field is dropped. On several lines the adapter makes one raw request per case line and requires every
line. At each grid `polychromaticWavefrontOtf` evaluates each line's complex `wavefrontOtf` directly at the
requested frequencies, without frequency interpolation. It multiplies by exp(-2 pi i nu (chief_l-chief_0)),
x sagittal and y tangential in the declared mirrored frame, and by case weight times transmitted cell flux.
Compensated complex sums are divided by total weighted flux before the modulus. Line 0's chief landing is the
common origin; the other adapters retain their own single common origins, which cannot change a sum's modulus.
Each line retains its chief-relative phase-step check; doubling compares the complete spectral sums. An
unavailable line makes its field unavailable with that line named. FFT remains unsupported on several lines.
The case plane already includes LV's photopic best-axial shift for a best-photopic run; no line searches for
focus. This expands R6c under policy 13 and changes no quantity version, spec or contract identity.

The comparator reuses R5's `classifyNativeField`, `factsOfField` and recording. The report reuses `factsOfRecorded`,
sorting each difference before subtraction: unsupported, data, numerical, method. The table records all four
columns and three separately classified differences against `optiland-wave` (LV, wave, FFT). Only method fields
standing by their curves enter R5's bands; numerical differences are shown apart. Chief-landing sorting uses
R6c's 1e-7 mm for two one-line answers and its policy `attentionSeveralLines` of 1e-3 mm when either answer
records several lines. A common reference point preserves the modulus; the several-line chief landings
identify the field, not one shared ray. No gate or floor is added. R6c asks no automatic follow-up: the two raw grids already state
its convergence; optiland's FFT remains its default ladder. No span is needed because one request has all fields
and each answer all sampling steps. MTF baselines can add R6c records and render these tables from the records alone;
Stages 4.1 and 4.3 do not rewrite any baseline or committed report.

### `mtf.native`

An engine's own MTF of the case: by its own method, with its own sampling of the pupil and its own aiming, as the
engine presents it to whoever uses it. Nothing of it is the comparator's, and no two engines are expected to
agree on it within a tolerance: it is what the independent-method rungs of the ladder record. No rung sets the MTF
of two independent engines against each other yet; `lvrtc mtf` presents each engine's answer by itself. One rung,
`r4f`, asks for it of two engines that are not independent ([below](#rung-r4f-the-fidelity-of-the-replay)). It is
answered by `lv` ([LensVisualizer's product MTF](#lensvisualizers-product-mtf)), `replay`, `wave` and
[`optiland`](#the-engine-optiland), each by a method of its own. F is the number of frequencies.

`spec`:

| Member | Type | Meaning |
|---|---|---|
| `frequenciesPerMm` | number[] | spatial frequencies in image space, cycles/mm: at least one, each ≥ 0, ascending |
| `fields` | object | `{ kind: "image-height-fractions", values }`: fractions 0..1 of the full image height, which the engine resolves to field angles by its own rule; or `{ kind: "angles-deg", values }`: field angles in (−90, 90) |
| `method` | string | `geometric`: from where rays land, without diffraction; `diffraction`: with the diffraction of the aperture |
| `focus` | string | `design`: on the image plane of the case, `conditions.imageZ`; `engine-best`: on the plane the engine's own focus criterion moves it to |
| `profile?` | string | a named, documented bundle of settings of one engine |

- **The light, the stop and the object are the case's.** The MTF is that of the lines of `conditions.lines` with
  their weights, at the stop setting of the case and for its object. An engine that cannot compute with exactly
  those says so with `unsupported`; it does not substitute.
- **`method` says what kind of MTF**, not how it is computed: every engine has algorithms of its own for either,
  and names the one it used in its answer.
- **A profile** stands for what a spec does not state and only one engine has: a grid cap, a seed, a rule of that
  engine's own product. A spec that names one still states its frequencies, fields, method and focus, and they are
  the profile's, so that a request says what was computed whoever reads it. An engine that knows the profile
  answers the error `bad-spec` where the spec states anything else, and where the profile cannot be about the
  case; an engine that does not know it answers `unsupported`, with the item `profile` under the code `option`.
  The profiles there are are listed with the engine that has them ([the engine `lv`](#the-engine-lv)).

`data`:

| Member | Type | Meaning |
|---|---|---|
| `fields` | object[] | one entry per requested field, in the order of the request |
| `method` | object | `{ name, params }`: the engine's own name for how it computed the curves, and the settings it computed them with, by names of its own |
| `focus` | object | `{ mode, appliedShiftMm }`: the plane the curves are of |
| `aperture` | object | a map from name to number: what the engine measured of the aperture it computed with |
| `lines` | object[] | each `{ wavelengthNm, weight }`: the lines the engine actually computed with, the reference line first |
| `notes` | string[] | what the engine says about the answer, for people |

A field:

| Member | Type | Meaning |
|---|---|---|
| `field` | number | the field as it was requested: the fraction, or the angle |
| `fieldAngleDeg` | number or null | the chief-ray field angle the engine used, degrees; null where it found none |
| `imageHeightMm` | number or null | how far from the axis the field's reference chief ray lands on the plane the curves are of, ≥ 0; null where there is none |
| `sagittal` | NdArray | float64 `[F]`: MTF for frequency along image x |
| `tangential` | NdArray | float64 `[F]`: MTF for frequency along image y |
| `status` | string | `ok`, `unconverged` or `unavailable` |
| `reason?` | string | the engine's own code for why the field is as its status says |
| `sampling` | object | a map from name to number: how the engine sampled the field (a grid size, counts of rays) |

- **A value** is a modulus, from 0 to 1, at one frequency of the spec, in the spec's order.
- **Status.** `ok`: the engine stands by the curves. `unconverged`: it has curves, and says that its own sampling
  did not settle; the curves are given as they are. `unavailable`: it has none; every value of both curves is NaN,
  and `reason` says why in the engine's own code. An engine's own word for a status (`converged`) is mapped to one
  of the three and not passed on.
- **Focus.** `mode` is `design` when the curves are of the image plane of the case as it is, and `appliedShiftMm`
  is then 0. Any other `mode` is the engine's own name for the criterion that moved the plane, and
  `appliedShiftMm` is how far along +z the plane lies from `conditions.imageZ`. The answer says what was applied,
  not what was asked: an engine that was asked for `engine-best` and found no plane to move to answers `design`.
- **`aperture` and `sampling`** are recorded, like the `recorded` values of `paraxial.first-order`: listed beside an
  answer and never judged. Two names are agreed, so that whoever reads an answer can find them: `tracedFNumber`,
  the working f-number of the axial beam as the engine traced it, and `limitingSurfaceIndex`, the index, in the
  surfaces of the case, of the surface that bounds that beam: the stop's own index when the stop does.

**Invariants checked in code** (`src/quantities/mtfNative.ts`). A spec's frequencies ascend. In the data, every
curve has F values, for one F of at least 1; a field that is `unavailable` holds NaN at every frequency and states
a `reason`, and any other field holds a number from 0 to 1 at every frequency; a plane whose `mode` is `design`
has an `appliedShiftMm` of 0. That F is the number of the spec's frequencies, and the fields those of the spec,
needs the spec, which data is validated without: whoever sets an answer beside its request checks it
(`mtfTableRows`, `src/report/mtfTable.ts`).

#### Rung R4f: the fidelity of the replay

`r4f` asks one `mtf.native` request for a run: the geometric MTF of the run's [recipe](#the-mtf-recipe), with its
fields as the fractions they were resolved from, its frequencies, and the focus `design`, the image plane of the
case as it is. It is asked of exactly two engines, `lv` and `replay`, whatever engines the run names, and only for
a recipe LensVisualizer resolved: a case file has no sampling of LensVisualizer's to replay, and no request. Both
engines are handed the run's `sampling.lvGridCap` as their option `lvGridCap`. `lv` answers with LensVisualizer's
own `computeMtf`; `replay` with the comparator's estimator on a replay of the same sampling
([the engine `replay`](#the-engine-replay)). If the two agree, the comparator understands LensVisualizer's
sampling: which rays, which reference, which weights, which grids.

The comparator of `mtf.native` for `r4f` (`src/compare/mtfFidelity.ts`):

| Metric | Unit | Is | Gate |
|---|---|---|---|
| `mtf.maxAbs` | 1 | the largest difference of two MTF values, over every field with curves in both answers, both cuts and every frequency; `where` names the `field` as requested, the `cut` and the `frequencyPerMm`, the first on a tie | 1e-9 |
| `sampling.mismatches` | elements | how many of `gridSize`, `validRays`, `blockedRays` and `failedRays`, over the fields, are not the same number in both answers; a value only one answer states is one | 0 |
| `fields.mismatches` | elements | how many fields have another `status` in one answer than in the other, or another `reason` | 0 |

Where no field has curves in both answers `mtf.maxAbs` is not measured. Answers for different numbers of fields,
for other fields, of other planes or with curves of different lengths are not comparable (`ERROR`). What each
answer states of every field's sampling is recorded beside the pair under the four names, one value a field. The
rung has no floor and blocks nothing; `r4f` compares no other two engines, and the other rungs that compare
`mtf.native` are [`r5`](#rung-r5-the-engines-own-mtf) and
[`r6b`](#rung-r6b-lensvisualizers-diffraction-mtf-beside-the-wave-estimator).

The gate of 1e-9 was provisional and is pinned from measurement (the plan, "Amendments since approval"): on the
96 runs of the benchmark suite, 480 fields at 51 frequencies in both cuts, the largest difference is 1.25e-14,
which is rounding. LensVisualizer adds a field's terms up plainly and, for an evenly spaced list of frequencies,
rotates one phasor from frequency to frequency; the estimator compensates its sums and evaluates each frequency on
its own.

`valid/quantities/mtf.native.data/every-status.json` is a format example of an answer to the spec
`three-fractions.json`, with a field of each status; `best-focus-three-lines.json` one of an answer to
`angles-and-profile.json`. Their numbers describe no lens.

#### Rung R6b: LensVisualizer's diffraction MTF beside the wave estimator

`r6b` asks one `mtf.native` request for a run: the diffraction MTF of the run's [recipe](#the-mtf-recipe), at the
fields the run traces rays for (0, 0.5 and 1 of the image height unless it states others), as fractions, of those
the recipe resolved to an angle; at the recipe's frequencies thinned to at most eleven (`waveFrequencies`); with
the focus `design`, the image plane of the case as it is. It is asked of exactly two engines, `lv` and `wave`,
whatever engines the run names, and only for a recipe LensVisualizer resolved. Both are handed the run's
`sampling.lvGridCap` and `sampling.bundleGrid` as the options `lvGridCap` and `bundleGrid`; each reads its own.
`lv` answers with LensVisualizer's own `computeMtf`, whose diffraction estimate is its own;
[`wave`](#the-engine-wave) with the comparator's wave estimator on the rays LensVisualizer launches and traces.
Two methods, each with its own sampling: the rung is **recorded**, and no figure of it fails anything.

The comparator of `mtf.native` for `r6b` (`src/compare/mtfWave.ts`) gives each field the class of its difference,
and each class its own figure:

| Class | A field is of it when | Its figure | Band |
|---|---|---|---|
| method | both answers stand by its curves (`status` `ok` in both) | `mtfOnAxis.maxAbs` for the field requested as 0, `mtfOffAxis.maxAbs` for every other: the largest difference of two MTF values over both cuts and every frequency | 0.005 and 0.01 |
| numerical | an answer says its sampling did not settle (`unconverged`) | `mtfFlagged.maxAbs`: the same, written down and in no band | none |
| unsupported | an answer has no curve of it (`unavailable`) | none | none |

`fields.compared`, `fields.flagged` and `fields.unavailable` count the fields of each class. A pair is `ATTENTION`
when a figure of the class method is outside its band, else `RECORDED`. A band that has no field is not measured,
and the reason says what each answer said of the fields left out, by its method's name. What each answer states
of every field's sampling is recorded beside the pair (`gridSize`, `validRays`, `maxDelta`, `phaseStepWaves`,
`convergedThroughLpMm`, one value a field), and under `settled` whether it stands by the field: 1 for `ok`, 0 for
`unconverged`. Answers for different numbers of fields, for other fields, of other planes or with curves of
different lengths are not comparable (`ERROR`).

#### Rung R5: the engines' own MTF

`r5` asks the one request of `r6b` of three engines, `lv`, [`optiland`](#the-engine-optiland) and
[`wave`](#the-engine-wave), whatever engines the run names, only for a recipe LensVisualizer resolved, and only
where the rung is named. `lv` and `wave` are handed the options `r6b` hands them; `optiland` is handed the recipe's
angle of each field of the spec as its option `fieldAnglesDeg`. Three methods, each with its own sampling: the rung
is **recorded**, and no figure of it fails anything.

The comparator of `mtf.native` for `r5` (`src/compare/mtfNative.ts`) sorts each field before any difference is
taken, by the classes of a difference in their order, and each kind of field has its own figure:

| Class | Reason | A field is of it when | Its figure | Band |
|---|---|---|---|---|
| unsupported | `no-curve` | an answer has no curve of it (`unavailable`) | none | none |
| data | `lines-differ` | the two answers are of other lines | none: no difference is shown | none |
| data | `chief-landing-unknown` | an answer states no `imageHeightMm` for it | none | none |
| data | `chief-landing-apart` | the two `imageHeightMm` differ by more than the band of `chiefLanding.maxAbs` | none | none |
| numerical | `unconverged` | an answer says its sampling did not settle | `mtfFlagged.maxAbs` | none |
| method | `rim-rays-lost` | an answer states `rimRaysLost` above 0 in its sampling | `mtfRimLost.maxAbs` | none |
| method | `two-methods` | both answers stand by its curves | `mtfOnAxis.maxAbs` for the field requested as 0, `mtfOffAxis.maxAbs` for every other: the largest difference of two MTF values over both cuts and every frequency | 0.005 and 0.01 |

The class `convention` (a declared transform that is missing) is never given: both answers state their cuts by the
image axes of the contract, on the plane of the case. `chiefLanding.maxAbs`, in mm, is the largest distance
between the two answers' chief-ray landings over the fields both have curves and a landing for; its band, 1e-7
mm, is the limit of the sorting, and a pair with a field beyond it is `ATTENTION`. `fields.compared`,
`fields.flagged`, `fields.rimLost`, `fields.data` and `fields.unavailable` count the fields of each kind. A pair is
`ATTENTION` when a figure with a band is outside it, else `RECORDED`; a band that has no field is not measured.
The reason of a pair names every field that is in no band, with its class, its reason and what the answers say.
The comparator needs the spec of the request and the policy of the rung; answers for different numbers of fields,
for other fields, of other planes or with curves that have not one value a frequency are not comparable (`ERROR`).

**The second step.** When the jobs of the rung for a run have ended and the pair of `lv` and `optiland` has
`mtfOnAxis.maxAbs` or `mtfOffAxis.maxAbs` outside its band, optiland is asked the same request once more with the
option `fftRays: 512`. The run manifest records that as a job of `optiland` with `step: "fft512"`, after the
rung's other jobs of the run. In a comparison a step is no participant: it is its engine's later answer. A pair
of that engine is judged by the last step, with the two band figures of the first answers beside them
(`mtfOnAxis.firstStepMaxAbs`, `mtfOffAxis.firstStepMaxAbs`), and a step that is no answer is named in the reason.

**Recorded** beside the pair, one value a field: `field`, `fieldAngleDeg`, `imageHeightMm`, `settled` (1 for `ok`,
0 for `unconverged`), the sampling an answer states (`gridSize`, `numRays`, `coarseNumRays`, `validRays`,
`maxDelta`, `phaseStepWaves`, `convergedThroughLpMm`, `rimRaysLit`, `rimRaysLost`, `rimLandingSpreadMm`,
`workingFNumber`), and every MTF value as `sagittal@<frequency>` and `tangential@<frequency>`;
`lineWavelengthNm` has one value a line. The values of a later step have the same names followed by `#<step>`.
A report makes its table of the rung from these alone.

## Schemas and the validator

The schemas are JSON Schema draft 2020-12, restricted to what the validator implements:

| | Keywords |
|---|---|
| Assertions | `type`, `enum`, `const`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `minLength`, `pattern`, `minItems`, `maxItems`, `uniqueItems`, `items`, `required`, `properties`, `additionalProperties`, `oneOf`, `anyOf` |
| Structure | `$ref`, `$defs`, `$id`, `$schema` |
| Annotations | `title`, `description` |

**Any other keyword is an error when the schemas are loaded**, so the two implementations cannot silently
disagree about a schema. Within the subset the schemas are narrower than the draft in six ways, also checked at
load time:

- `$id`, `$schema` and `$defs` appear only at the root of a file;
- a `$ref` is `#/$defs/<name>`, `<$id>` or `<$id>#/$defs/<name>`, and must name a loaded schema;
- a `$ref` stands alone: only `title` and `description` sit beside it, so a tool that ignores whatever is beside a
  `$ref`, as drafts before 2019-09 did, reads the same schema;
- `enum` and `const` hold primitives only, compared by JSON type and value (1 equals 1.0; neither equals `true`);
- `uniqueItems` needs a sibling `items` whose `type` names only primitive types;
- a `pattern` is anchored with `^` and `$` and uses neither `\d`, `\w`, `\s`, `\b` nor a dot outside a character
  class, because ECMAScript and Python's `re` match different characters with those, nor a character class that
  starts with its closing bracket: `[]` and `[^]` are whole classes in ECMAScript, and in Python the start of a
  class that holds `]`.

Whatever is accepted means what the draft says it means. `integer` is a number without a fraction, however it was
written (`4`, `4.0` and `4e0` alike); a boolean is never a number, and 1 is never `true`; `minLength` counts
Unicode code points. A pattern's closing `$` is the very end of the string: a string that ends in a newline does
not match a pattern that allows none. (Python's own `$` would let it through, so the port writes `\Z`.)

An **issue** has an instance `path` (a JSON Pointer; `""` is the document), the `keyword` that failed and a
`message` for people. Only `path` and `keyword` are the same in every implementation. Three rules decide them:

- a document that is not JSON data is rejected before any schema is consulted, with the keyword `finite` for a
  non-finite number and `json` for anything else JSON cannot carry;
- a value of the wrong `type` gets that one issue, and the other keywords of the same schema node are not
  evaluated for it;
- a value that fits no alternative of a `oneOf` or `anyOf` gets one issue, at the value, with that keyword.

A schema's `$id` is `urn:lvrtc:contract:v1:` followed by its path below `schema/v1` without `.schema.json`, with
`:` for `/`.

## Fixtures

```
fixtures/v1/valid/<schema>/<name>.json
fixtures/v1/invalid/<schema>/<name>.json
fixtures/v1/invalid/<schema>/<name>.expect.json
```

`<schema>` is the path of a schema file below `schema/v1` without `.schema.json`: a kind, such as `optical-case`,
or the spec or data of a quantity, such as `quantities/selftest.echo.spec`. Every valid fixture passes that schema.
Every invalid fixture is a valid one with a single fault, and its `.expect.json` names where the validator reports
it:

```json
{ "path": "/system/stopIndex", "keyword": "type" }
```

An implementation is correct when each invalid fixture yields exactly one issue, with that `path` and that
`keyword`.

The fixtures are generated. Their source is `test/contract/corpus.ts`, where each valid one is written against the
TypeScript type of its kind; `node test/contract/writeCorpus.ts` rewrites the files, and the tests fail when the
files and the source differ. Two files are not generated: the Double-Gauss case, below, and
`valid/engine-descriptor/integers-as-floats.json`, written by hand because its point is the spelling of its
numbers.

Five cases are generated: `singlet`, the case the example requests and results are about; `all-features`, which
carries every feature flag of contract `1.0` and every optional member; and `unclipped-plate`, the singlet behind
a rear plate whose two surfaces do not clip, the one valid case that states `1.2` and carries the flag minor 2
added. The every-feature case was not given such a plate: it is the case half the tests are written on, and a
minor does not change a document that uses nothing of it. The synthetic `folded-spherical-mirror` and
`folded-mangin` cases state 1.4; the latter visits its entrance surface twice. The corpus also carries a v2
request, its analytically derived Mangin trace, a v2 geometry answer with explicitly unavailable path arrays, and
a v2 answer with an unrecorded visit (a ray through a mirror's hole).

Some fixtures exist for what one language gets wrong by default, and an implementation in any language must pass
them:

| Fixture | Guards against |
|---|---|
| `valid/engine-descriptor/integers-as-floats` | an `integer` test that looks at how the number was written (`4.0`, `2e0`) |
| `invalid/optical-case/number-overflow`, `invalid/request/spec-number-overflow` | a parser that turns `1e400` into an infinity and a validator that lets it pass; keyword `finite` |
| `invalid/run-spec/name-with-trailing-newline` | a `$` that matches before a trailing newline |
| `invalid/engine-descriptor/concurrency-as-boolean`, `invalid/result/count-as-boolean` | a boolean counted as a number |
| `invalid/protocol-response/ok-as-number` | `1` counted as equal to `true` |

### The Double-Gauss case

`fixtures/v1/valid/optical-case/double-gauss.json` is optiland's `DoubleGauss` sample
(`optiland/samples/objectives.py`), so that later stages can replay it against optiland. It was derived once,
read-only, from optiland at commit `4e893f53aee1312f2d091680b93dd2279711e197` (the checkout's only local changes
were to `pyproject.toml` and `uv.lock`), with a script that is not kept here because it needs optiland:

- **Surfaces**: optiland's surfaces 1 to 11; its object surface 0 and image surface 12 are not surfaces of the
  case. `label` is optiland's surface number. A surface of infinite radius is a `plane`, any other a `conic` with
  conic constant 0. `z` is the running sum of the thicknesses.
- **Indices**: `material_post.n(0.5875618)` of each surface, the index of the medium after it at the d line. One
  line: 587.5618 nm, weight 1, `authored`.
- **Stop**: optiland's surface 6, index 5 here. `stopSemiDiameter` is the paraxial marginal-ray height at the
  stop for the sample's image-space f/5 aperture, evaluated at the d line: 6.341241012139779 mm.
- **Clear apertures**: the sample states no semi-apertures, so each `semiDiameter` is the paraxial bound
  |marginal height| + |chief height| at that surface, for f/5 and the sample's largest field of 14°, at the
  d line, rounded up to 0.01 mm. `nominalSemiDiameter` is the same and `innerSemiDiameter` is 0.
- **Conjugates**: object at infinity. `designImageZ` and `imageZ` are the sample's image position, 139.454938 mm
  from the first vertex.
- **Elements**: `elementId` numbers the glass elements 1 to 6 in order; a surface followed by air has 0.

The paraxial data came from optiland's own paraxial module on an in-memory copy of the sample whose only
wavelength was the d line. Nothing was written to the optiland checkout. `test/contract/case.test.ts` rederives the
focal length (100.00372050801042 mm, optiland's `paraxial.f2()`), the f-number and every clear aperture from the
fixture alone.

## Folded traversal (minor 4, Stage 5.2a)

Only a case with `system.opticalPath` states **1.4**. The surfaces remain the physical surface table, including
surfaces not visited by the path. Their `z` values and signed `thickness` values are LV's prepared physical-list
coordinates and gaps. The image plane is independent of the last gap: `designImageZ` and `conditions.imageZ`
state its actual global z. The first physical vertex is still 0. Tilted or off-axis surfaces and image planes
remain coded source problems (`tilted-surface`, `surface-profile-unsupported`, `tilted-image-plane`,
`off-axis-image-plane`). A normal parallel to either +z or -z describes the same supported axial plane.

`opticalPath` is a nonempty array of visits. A physical `surfaceIndex` may occur repeatedly. Each visit carries
`interaction` (`refract`, `reflect`, `block`, `pass`), optional `incidentSide` (`front`, `rear`, `both`, default
`both`) and `inactiveSide` (`ignore`, `block`, default `ignore`). The surface normal is the sag normal oriented
toward +z. A nonnegative incoming-direction dot normal is front incidence. On an inactive side, a ray is stopped
only within the active band when `inactiveSide` is `block`; otherwise it passes unchanged. `pass` bends and
clips nothing. `block` stops the closed active band and transmits both complements. Active refractive/reflective
visits clip above the outer band boundary; below the inner boundary they transmit unchanged. Thus an active
mirror's hole is transparent space, and an opaque ring is the complement of a transmitting annulus.

A refractive visit requires `mediumAfter`: a physical index-table column, or null for air. It may also carry
`reverseMediumAfter` for rear incidence; omitted, `mediumAfter` applies on either side. No other interaction
carries medium references. Reflection and pass retain the actual incident medium. Exported LV visits carry both
references, using LV's `rearMediumSurfaceIndex`, including its overlapping-zone lookup for a Mangin return pass.
The exporter copies side filters, interactions and visit order; it does not choose an interaction by tracing a
sample ray. Both outer and inner active limits are queried from `evaluateAperture` for folded cases. Ordinary
sequential exports retain their original numbers and identities.

Only fixed visit lists are represented. `folded-auto-path` declares LV's ray-dependent next-hit search unsupported;
no central-ray order is substituted. `folded-interaction-budget` declares an LV budget that cannot finish the
listed visits and reach the image. `diffractive-surface` remains outside this stage. `mixed-reference`, including
Samyang AF 35/2.8's d/e glasses without wavelength data, is an **LV data issue**, not a translator approximation.

Owner decision 2026-10-23: raw export keeps the declared path. During run preparation, after the selected rungs'
coarse and fine ray sets have been generated and before any engine request is planned, the LV case source traces
exactly those sets with LV's own tracer and existing post-path detector. A recorded interaction after the declared
visits refuses the **whole run** with `folded-post-path-reflection`: its case is null, its source problem is
recorded in the manifest, and no engine, including ref and optiland, is compared for that run. Passive post-path
crossings without a recorded interaction remain allowed. There is no static geometric check or additional sampling.

An accepted folded run adds an existing `provenance.notes` code (no schema member or identity change):
`folded-declared-path-confirmed:run:<utf8hex>:coarse:<sets>:fine:<sets>`. `<utf8hex>` reversibly encodes the run
name in lowercase hexadecimal UTF-8 bytes. `<sets>` is the ordered SHA-256 `raySetId` list joined by `.`, `empty`
when generation was requested but supplied no sets, or `unrequested` when no selected rung requested that
resolution. These are exactly the manifest's `raySets.sets` and `fineRaySets.sets`; the hashes include every
spec member, field, line and encoded ray array. Confirmation covers only these finite sets, never other rays,
field angles or states. Coarse/fine field problems retain their own manifest entries. Runs sharing an optical
case id retain all their distinct confirmation notes in the saved case. A raw export or the geometry census has
no run's ray sets to confirm and carries no such note. The request-time `lv-folded-post-path-interaction` remains
a backstop for direct engine calls or other, unconfirmed ray sets.

### Quantity selection and compatibility

A request may state `quantityVersion` (minor 4); omitted, the original module version applies. It enters the
request hash **only when present**, and a request using it states 1.4. Engine quantity capabilities may add
`versions`, the explicit supported definitions, alongside the original `version` default. LV, ref and optiland
state `rays.trace: { version: 1, versions: [1, 2] }`. Negotiation selects the definition per request. A folded
ray request requires version 2; sequential generators omit the member and keep v1, the original hash expression,
and their existing case/request identities. Store keys additionally include source fingerprints and adapter
revisions: changing engine/adapter code legitimately retires those keys even with identical requests.

`system.describe` remains v2: physical rows keep physical indices, and the optional `opticalPath`,
`pathSurfaceIndices`, `pathInteractions` and `pathIndexAfterSurface` read back the traversal and its nominal
per-visit media. The physical aperture rows describe active surface bands; the visit policy states what those
bands do in a folded path. R0 compares the complete conditional policy as well as order and indices using its
existing zero-mismatch gates. No sequential output acquires these members.

`paraxial.first-order` remains v1: positions are global z, EFL is rear focal z minus rear principal z, and back
focus is measured from the physical `lastLensSurfaceIndex`, even when that surface is not the last visit.
An odd reflection can therefore give a negative EFL. The formal centered first-order path ignores masks, uses
signed global gaps, and flips the signed reduced index at reflection: with parity p, w=p*n*dy/dz, a reflection
changes p to -p; its power is `(n_signed_after - n_signed_before)/R`. These matrices have determinant +1. Ref
compensates its matrix sums; an exact rational matrix test on the original radii, indices and coordinates
recognizes singular pupils without a threshold. Pupils at infinity retain the physical-slope sign convention.
The first visit to the physical stop defines its formal pupil conjugates; later visits to the same physical
stop remain ordinary path masks. A path not visiting its stop is `folded-stop-not-visited`. LV's higher-level folded cardinal function can return
null (`lv-folded-first-order-unavailable`); no sequential substitute is returned. Values LV does supply are
returned as supplied, including a measured odd-reflection front-principal defect described in gotchas.md.

### `rays.trace` version 2

Version 1's text above remains the sequential definition. In version 2, P is the path length and `hits` has shape
`[P, n, 3]`; `endSurface` is a **path-step index**, P after all visits when the image cannot be reached, and -1 on
arrival. A repeated physical surface has an independent hit at every visit. A pass or a transmitted band
complement also has a geometric sheet crossing. An ended ray has NaN from its end step onward, including that
step's hit, exactly as v1 does by surface. Points and directions stay in the fixed Cartesian frame; reflection
never mirrors an axis or resets the path. Reverse z propagation is allowed. A visit requiring a negative line
parameter beyond 1e-9 mm is blocked; a real return stretch along -z has a positive parameter and adds positive
optical path. The image plane is reached in either z direction when its forward parameter is nonnegative, with
the existing 1e-9 mm landing tolerance. Reflection is `d - 2(d dot N)N`, normalized, and retains the medium.

Optical path is the sum of actual incident index times the signed geometric stretch; a real reflection adds no
phase or length at the hit. `opticalPathToImage` continues in the actual final medium. No diffraction or coating
phase is introduced. A v2 answer may state `pathUnavailable`, a coded reason, with **both path arrays all NaN**
while still supplying valid geometry. R2 compares that geometry; R3 is explicitly UNSUPPORTED for that pair,
with the code, never a measured zero or a passing optical-path test. V1 refuses this partial-answer member.
A v2 answer may also state `unrecordedHits`, uint8 `[P, n]`: 1 at a visit before a ray's end that the ray
crossed without any interaction (a hole, an ignored inactive side, a blocker outside its band) and for which
the engine records no point; `hits` is NaN there. The last visit of a ray that passed every visit is its exit
point and is never unrecorded. R2 compares every other point, the exit direction, the landing and the mask,
and lists the count per engine (`hits.unrecorded`); no point is computed for an unrecorded visit. V1 refuses
this member too.
LV's generalized tracer explicitly makes OPL unavailable until phase-aware validation
(`lv-folded-optical-path-unavailable`). It records no hit for a passive visit, but under `recordHeights` keeps a
height for every visit whose intersection it found. The adapter places each recorded hit on the one declared step
whose kept height is that hit's own (LV's `projectCoordinateToZ`, to the bit), requires the direction to be
unchanged across the steps between, and answers the rest as unrecorded. After the declared visits LV's explicit
traversal goes on with a search of its reflective surfaces; a ray that meets one there is
`lv-folded-post-path-interaction` (the fixed path does not state that search). A record that fits the path in no
single way is `lv-folded-unaligned-visits`, and an unrecorded exit visit `lv-folded-unrecorded-visit`. Each makes
the request unsupported, with no invented points or termination indices.

Folded LV cases use the case source's deterministic probe lattice at explicitly stated field angles. LV's MTF
launch gate refuses folded systems, so these rays are not presented as LV MTF launch rays. The same probes go to
all engines. R2 maps each visit to its physical aperture for mask/rim tests; R3 retains the existing path gates.
No gate, policy version, floor or baseline is changed by this stage.

## Stage 5.2b: diffractive surfaces (minor 5)

Owner decision 2026-10-25 adds contract **1.5**, stated only by a document that uses these additions. A case with
`surfaces[].diffractive` states 1.5 and derives `surface.diffractive`. R0's answer with the added `diffractive`
list, and requests/results using the definitions below, state 1.5. Ordinary cases, requests and answers retain
all previous version/identity rules. Engine maximums become 1.5. The request's explicit `quantityVersion` enters
its hash only when present, as in minor 4. A suite merely naming the lenses needs no new member or minor.

The optional `SurfaceIR.diffractive` is the phase **on that substrate surface**, not another geometric sheet:

| Member | Meaning |
|---|---|
| `kind` | `radial-polynomial` |
| `referenceWavelengthNm` | positive design wavelength lambda0, nm |
| `diffractionOrder` | signed integer m, including zero |
| `terms` | 1 to 16 terms, ascending distinct integer powers 2 <= p <= 32, each `{ radialPower: p, coefficient: Cp }` |

With r = sqrt(x²+y²) in mm, W(r) = sum Cp r^p in mm; Cp has units mm^(1-p). W is **unwrapped**, with W(0)=0:
there is no modulo, zone rounding, piston or hidden normalization. LV's compiled representation has no radius
normalization. A future prepared normalized profile must be refused until expressed exactly by a contract addition.
Its cached derivatives/quadratic coefficient are checked against the literal terms and are not extra optical data.
The phase does not change substrate sag, aperture, incident medium or outgoing medium. Its transmission has unit
flux here; diffraction efficiency, other orders and polarization are outside this model.

### Ray interaction and signed phase delay

Let N be the unit substrate normal oriented into the outgoing hemisphere, P=I-NNᵀ the tangent projection, and
D the incoming unit direction. The physical Cartesian gradient is g=grad W=(W'(r)x/r,W'(r)y/r,0), with g=0 on
axis. With s=m lambda/lambda0, tangential outgoing optical momentum is

```
t = n_in P D + s P g
D_out = (t + N sqrt(n_out² - t dot t)) / n_out
```

A negative radicand is an evanescent order, blocked at that surface. This is the local grating equation on the
actual substrate, with its gradient projected onto the sheet, not a separate refraction followed by an axial kick.
The global gradient retains its sign for reverse incidence; orienting N chooses the transmitted hemisphere.
For a locally linear W with gradient G, n_out sin(theta_out)-n_in sin(theta_in)=m lambda G/lambda0.

The radian phase is phi=2 pi m W/lambda0_mm. The signed phase path at a successful refracting interaction is **+phi/k0**,
where k0=2 pi/lambda_mm: **m lambda/lambda0 W**, in mm. The plus sign agrees with the plus gradient in t. A
negative converging quadratic W therefore adds negative phase path. No geometric propagation distance is added
at a zero-thickness phase interaction. Phase paths can cancel and must be summed with compensated arithmetic.
The wave path to the final sheet/image is geometric OPL plus the sum of these per-visit delays; geometric OPL
alone is not the wave eikonal through a phase-bearing system.

### `rays.trace` version 3

Only a diffractive case requests v3. It retains the geometric arrays and their definitions unchanged. Sequential
systems retain sequential stepping (including signed backwards sequential stretches); fixed folded systems use
v2's visit order and reverse propagation. S below means physical sequential rows, or path visits when a path is
stated. Versions 1 and 2 retain every earlier meaning and remain offered.

| Additional data member | Definition |
|---|---|
| `phasePath` | required float64 NdArray `[S,n]`, mm: signed delay at each successfully passed surface/visit; zero for a passed visit without a phase interaction, NaN at the ray's end and thereafter |
| `phasePathUnavailable?` | nonempty coded reason: the engine does not expose phase delay; every phasePath entry is NaN, geometry and geometric OPL remain answerable |

`phasePathUnavailable` does not imply `pathUnavailable`. LV's sequential `recordOpticalPath` exposes geometric
segments only and returns `lv-phase-path-unavailable`; the adapter never computes a replacement phase from its
hits. V3 can also retain v2's explicitly unavailable geometric paths for generalized traversal. Earlier versions
refuse phase members. Validators check rank, shape, valid/ended values, unavailability and version selection.

R3 keeps its three existing geometric metrics unchanged. Policy **15** adds `phasePath.maxAbs`: maximum absolute
per-visit/per-ray phase-delay difference in waves of the request line, over rays ok in both answers. Its sole
gate is **2e-5 waves**, in `policy/rungs.v1.json` only. Basis: the identical-ray signed phase delay is held to the
same absolute path accuracy as a geometric segment; this is a new figure, not an empirical floor or a widened
geometric gate. `where` gives visit/surface, ray, field and line. Unavailable phase is an explicit unmeasured
`UNSUPPORTED: <code>` metric while geometric metrics are still judged; no unavailable phase becomes a measured
zero. No phase surface makes the metric not applicable. A geometry PASS with unsupported phase is not a phase
validation claim. The pair's verdict still fails if any measured geometric or phase metric exceeds its gate.

### `paraxial.first-order` version 2

Only a diffractive case requests v2. Add **phiD=-2 C2 m lambda/lambda0** to each refracting surface's ordinary
power `(n_after-n_before)*vertexCurvature`. On (height, reduced angle), the surface matrix is
`[[1,0],[-(phiR+phiD),1]]`. Higher radial powers have zero first-order power. Cardinal/pupil definitions and all
existing R1 gates stay unchanged; pupils exclude the stop's own power as before. A model that cannot see phase
answers `unsupported`, never the system without it. LV's kernel uses its default d wavelength for phase power;
a different requested phase wavelength is `lv-phase-paraxial-wavelength`. Optiland's first-order accessor bypasses
native phase profiles: `optiland-phase-paraxial-unseen`. Ref evaluates the requested line analytically.

### `system.describe` addition and translation

`system.describe` stays v2, as in minor 4's optional folded-path description. On a phase-bearing system its answer
adds `diffractive`: S physical-surface entries, null without phase and otherwise the phase profile above, read
from the built model. Answers without phase omit the member. R0 counts each different profile/order/wavelength
under `shape.mismatches`, whose gate remains zero. The phase profile is separate from geometric `terms`.

Optiland receives `RadialPhaseProfile.coefficients[p/2-1] = 2 pi m Cp / lambda0_mm`, padding absent powers with
zero, attached via `PhaseInteractionModel` on the actual geometry. Built design-coordinate metadata permits
lossless R0 description; verification holds every native radian coefficient to its scaled design coefficient,
plus both parents, model/profile classes, efficiency and reflection state. Describe takes no case. Native OPD
contains +phi/k0: the worker reads each native profile's phase at its recorded hit, preserves that signed delay
in phasePath, subtracts accumulated phase from native OPD, and applies its existing geometric direction-length
correction only to the geometric stretches. No phase is counted twice. Native first-order behavior is not repaired.

The exporter reports `diffractive-phase-unsupported` for an unknown prepared phase kind/member, a normalized
profile it cannot express, invalid powers/order/wavelength, or inconsistent cached derivative/quadratic values.
The old `diffractive-surface` reason remains readable in historical census documents.

`verify` accepts an existing policy-14 baseline only for the exact additive transition to policy 15: removing
phasePath.maxAbs and resetting the version must reproduce the pinned policy-14 hash, and the added gate must
be exactly 2e-5 waves. The retained `policy/rungs.v14.json` records those previous bytes. Policy 14 predates any
exportable diffractive case. Any change to another gate, class, unit or policy member is still stale and refused;
no baseline or report is rewritten. Live comparisons use policy 15.

LV permits odd radial powers as well as even ones. Ref and LV retain those terms literally; optiland refuses
`optiland-odd-radial-phase`, because its native RadialPhaseProfile has only even powers. No power is rounded
or assigned to another coefficient slot. Every sequential state of the diffractive suite has even powers.

A passed non-refracting visit (a passive crossing or an ordinary reflection) has zero phasePath in this model.
No coating/reflection phase is introduced; the diffractive polynomial is the transmitted phase of its substrate.
An ended visit has NaN, rather than a physical phase assigned to a ray that did not pass it.

### Catalog baseline annotations (minor 6)

Only catalog baselines state contract `1.6` for the additive baseline metadata `runs[].features` (the validated
case's source flags), `censusReasons` (distinct source/field/recipe codes) and pair `failures` (classified FAIL
metrics). No engine request, result, case or descriptor changes for this addition. Other baseline versions remain
content-selected as before. The schema accepts these optional fields; invariants require minor 6, restrict them
to suite `catalog`, require its feature inventory, and restrict failure annotations to a FAIL pair. Each annotation
records metric/class/gotcha/reproducer/evidenceHash. CLI admission and hermetic verify require exact agreement with
`docs/known-failures.json`; the actual verdict, metrics and policy tolerances are preserved.
