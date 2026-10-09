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

Every document carries the contract version it was written to, as `<major>.<minor>`. This is version `1.0`.
It is still being written: until the first baseline is committed, nothing outside this repository has read a
document of it, and what a stage adds is added to `1.0`. From then on the rules below hold.

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
| `aperture` | object | `semiDiameter` > 0, `nominalSemiDiameter` > 0 (the clear semi-diameter the clip is derived from: the prescription's; on the stop surface, the stop setting), `innerSemiDiameter` ≥ 0 |
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
each once, what the source knows about the lens that the case does not carry; the codes LensVisualizer's exporter
writes are under [Cases from LensVisualizer](#cases-from-lensvisualizer).

**Invariants checked in code** (`caseInvariantProblems`), because a schema cannot state them:

- `stopIndex` and `lastLensSurfaceIndex` are indices of `surfaces`, and `lastLensSurfaceIndex` is that of the last
  surface that is not a synthetic plate;
- each `z` equals the sum of the thicknesses before it within 1e-9 mm, so the first vertex is at 0, and
  `designImageZ` equals the sum of all thicknesses within the same tolerance;
- an asphere has at most one term of each power;
- there is at least one line, and every weight is positive;
- `indexAfterSurface` decodes, is float64 of shape `[lines, surfaces]`, and holds positive finite indices.

**Feature flags** (`src/contract/features.ts`) are derived from `system` and `conditions` alone:

| Flag | The case has |
|---|---|
| `aperture.annular` | a surface with `innerSemiDiameter` > 0 |
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
| `synthetic` | `"rearPlate"` on the two flat surfaces LensVisualizer generates for a rear plate, which are surfaces of the state like any other |
| `stopIndex` | `state.lens.stop.surfaceIndex` |
| `lastLensSurfaceIndex` | `L.lastLensSurfaceIdx` |
| `designImageZ` | `state.imgZ` |
| `conditions.stopSemiDiameter` | from the run's aperture, below; the stop surface's aperture carries the same radius |
| `conditions.imageZ` | `state.imgZ`, plus the run's shift |
| `conditions.object` | `infinity` at `focusT` 0; else `finite` at the z of `mtfFiniteObjectPoint` for the conjugate LensVisualizer certifies for exactly that focus and zoom position (`MtfSupport.conjugate`) |
| `conditions.lines` | a named set: `MtfSupport.spectralLines` of `assessMtfSupport` for that spectrum, with LensVisualizer's weights, its reference line first. An explicit list: its own wavelengths and weights (1 each without weights), the first the reference line |
| `conditions.indexAfterSurface` | per line, `mtfIndexResolver(state, support, wavelength)`: its indices where it gives a resolver (`indexSource` `anchored`), each surface's `nd` where it gives none (`authored`); air is exactly 1 |
| `provenance.source` | the lens's key, its file and the hash of the file's bytes, and `zoomT` and `focusT` of the state: `state.zoomT`, `state.focusT` |

**The stop radius.** `wide-open` is `wideOpenStopAtZoom(zoomT, L)`, which is the prepared stop surface's `sd`.
An f-number N is LensVisualizer's linear stop-down, `(wide-open radius × fopenAtZoom(zoomT, L)) / N`. That rule is
written only in LensVisualizer's React hook (`useLensComputation.ts`, `currentPhysStopSD`), so the exporter restates
it, in the hook's order of operations, and a test against LensVisualizer's source fails when the hook's expression
changes. An N below the widest f-number of that zoom position is a problem, not a clamp. `stop-radius` is taken as
given.

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
| `lv-best-axial-needs-mtf-recipe` | asks for the image plane `lv-best-axial`, which only LensVisualizer's MTF result states; the MTF recipe resolves it to a shift |
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
  radius of the case; `sag` is its surface profile's, and NaN beyond the height at which the profile says the
  surface ends; `indexAfterSurface` is its index resolver's table for the case's lines. So R0 of `lv` against any
  engine holds the exporter, and that engine's reading of the case, to what LensVisualizer traces.
- **`paraxial.first-order`** is LensVisualizer's paraxial kernel (`traceParaxialSurfaces2`) on the rows
  `{ R, d, n }` of the state, with `n` the index of the line: two basis rays give the system matrix, its own
  `buildCardinalElementsFromMatrix2` the cardinal points and the back focus, two rays to the stop's plane the
  entrance pupil and a ray from the stop's centre the exit pupil. LensVisualizer's own first-order module answers
  for the authored indices only; at such a line the cardinal points and the back focus of `lv` are that module's,
  bit for bit. The method is named `paraxial-kernel`: the values are the kernel's, and none is a number
  LensVisualizer displays. The kernel is handed the radius of a surface and nothing else of its shape, so a case
  with a term of power 1 or of power 2 is answered `unsupported`, with the item `surface.asphere.linear-term` or
  `surface.asphere.quadratic-term`, before the kernel is asked. No lens of LensVisualizer has either: its
  coefficients start at `A3`.
- **`rays.trace`** is every ray of the request traced for real by LensVisualizer's sequential tracer,
  `traceEngineRay2`, on the state: clear apertures checked, the stop surface with the stop radius of the case, the
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
| `lvNominalEntrancePupilSemiDiameter` | `epAtZoom2(zoomT, L)`: focal length over twice the nominal f-number |
| `lvStoredExitPupilSemiDiameter` | `xpAtZoom(zoomT, L)`: scaled from that nominal entrance pupil |
| `lvNominalFNumber` | `fopenAtZoom2(zoomT, L)`: the wide-open f-number at the zoom position, whatever the stop of the case |

#### LensVisualizer's product MTF

`lv` answers `mtf.native` (`src/engines/lv/mtf.ts`) with one call of `computeMtf(state, options)`.

| Of the request | Is |
|---|---|
| `method`, `frequenciesPerMm` | the spec's |
| `fieldFractions` | the spec's fractions. LensVisualizer takes them of its reference image height, the format corner where the lens declares a format and the modeled edge where it does not, and solves each to a chief-ray angle, which the answer states |
| `spectrum` | the one of LensVisualizer's three whose lines the case has: `reference`, `cdf` or `photopic`, the same wavelengths with the same weights, as its support gate lists them, traced with the indices of the case |
| `focus` | `design` for the spec's `design`; `best-axial`, LensVisualizer's axial best-focus search, for `engine-best` |
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
| `feature`, `image-plane.shifted` | `conditions.imageZ` is not the design image plane: LensVisualizer's MTF is of that plane or of its own best focus, and of no plane it is given |
| `feature`, `lines.custom-spectrum` | the lines of the case are none of its three spectra: it has no spectrum by wavelength |
| `feature`, `aperture.f8-comparison` | the case is stopped down as the tab's f/8 comparison would be, for a lens the tab offers none for |
| `option`, `fields.angles-deg` | fields as angles: it takes fractions of its reference image height |
| `option`, `profile` | a profile other than `lv-tab-default` |
| `option`, `lvGridCap` | a grid cap that is none of the four |
| `option`, `fields.limits` or `frequenciesPerMm.limits` | without a profile, more fields or frequencies, or a higher frequency, than LensVisualizer takes in one request (at `ed78cf40`: 101 fields, 501 frequencies, 1000 cycles/mm). The limits are not restated: its gate is asked with the spec's fields and then with its frequencies, and the message ends with the gate's |

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

### `run-spec`

The user's specification of one run. Only `contract`, `kind`, `name` and `lens` are required; an option left out
takes the comparator's default.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"run-spec"` | |
| `name` | string | letters, digits, `.`, `_` and `-`; safe as a file name |
| `lens` | object | `{ kind: "lv", key }`, or `{ kind: "fixture", path }` naming an `optical-case` file; a relative path is resolved against the configuration root: the repository root, unless `lvrtc run --root` names another |
| `state?` | object | `zoomT?` 0..1 and `focus?`: `{ kind: "infinity" }` or `{ kind: "focusT", value }` 0..1. Without `zoomT`, a zoom is run at both ends ([below](#a-zoom-without-a-position)) |
| `aperture?` | object | `{ kind: "wide-open" }`, `{ kind: "f-number", value }` or `{ kind: "stop-radius", mm }` |
| `lines?` | object | `{ kind: "reference" \| "cdf" \| "photopic" }` or `{ kind: "explicit", wavelengthsNm, weights? }` |
| `fields?` | object | `{ kind: "image-height-fractions", values }` 0..1, or `{ kind: "angles-deg", values }` in (−90, 90) |
| `imagePlane?` | object | `{ kind: "design" \| "lv-best-axial" }` or `{ kind: "shift", mm }` along +z from the design plane |
| `frequenciesPerMm?` | number[] | spatial frequencies, each ≥ 0, no repeats |
| `sampling?` | object | `lvGridCap?` (32, 64, 128 or 256), `bundleGrid?` (integer ≥ 1), `engines?` (options per engine id) |
| `rungs?` | string[] | rungs of the comparison ladder to evaluate |
| `engines?` | string[] | engine ids to run |
| `referenceEngine?` | string | the engine the others are compared against |

`weights`, when given, has one entry per wavelength; without it the lines weigh the same.

For the rays of a run ([ray sets](#ray-sets)), a run without `fields` takes the image-height fractions 0, 0.5 and
1, and one without `sampling.bundleGrid` 32 cells across the beam. `sampling.lvGridCap` is the largest pupil grid
LensVisualizer's own MTF may refine to, which the engine `lv` takes as its option `lvGridCap`
([its product MTF](#lensvisualizers-product-mtf)); no rung asks for that quantity yet, so no run hands it on yet.

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
  states one (Stage 4.4 of the plan).

`lvrtc export --all` follows the same rule (every zoom at both ends), and so does `lvrtc mtf <lensKey>` without
`--zoom`. `lvrtc export <lensKey>` and `lvrtc lenses show <lensKey>` are tools of one state, zoom 0 unless `--zoom`
names another, and say so on the error stream for a zoom.

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
declares every feature flag and no limit, and offers `system.describe`, `paraxial.first-order` and `rays.trace`.

| The case | `optiland` answers |
|---|---|
| is built by optiland as it is stated | the quantity, from the optics it built |
| comes back from optiland as another system | status `error`, code `build-mismatch` |

- **Verified before it is answered.** Every value handed to optiland is read back from optiland's own objects and
  must be the number of the case: each vertex, in the geometry's frame and on the paraxial axis; the class of each
  geometry, its radius, conic constant and terms; the tolerance and the iteration count of an asphere's
  intersection; the class of each aperture and its two radii; the stop; that each surface refracts by optiland's
  ordinary model, which a mirror, a thin lens or a coating is not; the index after each surface; the object
  and image planes; the index of the image space, which optiland reads from the image surface; the stop diameter;
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
  the surface's aperture; `stopSemiDiameter` is half the stop diameter the system's aperture states;
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
  to optiland at once, and `landing`, which is `image-surface`. How its rows become an answer is below.
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
| `exitPoint`, `exitDirection`, `opticalPath` | the point, the direction cosines and the path (`opd`) the last surface of the case recorded. The path starts at 0 where the ray was launched, and a step backwards counts with its sign |
| `imagePoint`, `opticalPathToImage` | the point and the path optiland's image surface recorded: optiland carries a ray to the image plane itself, by the division, the multiplication and the addition of the comparator's own projection, in the index the image surface states. The point's z is written as the plane's own number. For a ray whose exit point lies behind the plane within the contract's 1e-9 mm they are the exit point and its path, as the contract says, where optiland would step back |
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
| `metrics` | object | a map from metric name to `{ tolerance?, attention?, unit, floor? }` |
| `blocksLaterRungs?` | boolean | true: two engines whose pair in this rung is `FAIL` or `ERROR` are not judged against each other in any later rung of the ladder, for the same case |
| `floor?` | object | `{ engine, arbiter }`: the engine whose known numerical floor may exceed a tolerance of this rung without failing, and the engine the others are held to |

`tolerance` is the largest value a metric of a gated rung may have and pass; `attention` is the largest value a
metric of a recorded rung may have without the pair being marked for attention. Both are ≥ 0 and in `unit`, which
is `1` for a number without one. A metric the comparison reports and the policy does not name is shown and not
judged. Two rungs may compare one quantity, each by metrics of its own: `r2` and `r3` both compare `rays.trace`.

**The floor.** One engine of a comparison may be known to compute to a coarser tolerance than a gate: LensVisualizer
meets a surface within 1e-9 mm of it, and behind a steep surface that becomes more than the 1e-8 mm two exact
tracers are held to. A rung with a `floor` says which engine that is and which engine arbitrates, and each of its
metrics that the floor may excuse carries `floor: { limit, agreement }`, both in the metric's unit. A pair of
`floor.engine` that is above a tolerance is then `FLOOR`, which is a pass, when all of these hold, and `FAIL`
otherwise:

1. every metric of the pair that is above its tolerance is a number and has floor limits. A metric without them
   is never excused: a count of rays the two engines disagree about is right or it is not;
2. the arbiter answered, and every other engine of the comparison that answered is within `agreement` of the
   arbiter in every metric that has floor limits: an arbiter that agrees with the others to rounding is right
   about the rays;
3. `floor.engine` is within `limit` of the arbiter in every metric that has floor limits: what it is off by is of
   the size of its known tolerance, and not a defect of another kind.

A metric that two answers have nothing to measure on takes no part in 2 or 3. Every metric that has floor limits
takes part in both, whether or not it is the one above its tolerance: a direction within its limit excuses no hit
beyond its own, and an engine whose directions are not the arbiter's is no witness for a hit. The comparator's
policy gives `lv` this floor against `ref` in `r2` and `r3`: lengths with `limit` 1e-7 mm and `agreement` 1e-10 mm,
a component of the exit direction with 1e-8 and 1e-12, optical paths with 2e-4 waves and 1e-7 waves; each limit is
ten times its tolerance. Which rays got through, `mask.mismatches`, has none. The limits are in the policy and
nowhere in the code.

**Blocking.** A rung with `blocksLaterRungs` establishes what the rungs after it take for granted: two engines
that built different systems would differ in every ray traced through them, and each such difference would be the
first one again. So where the pair of two engines in that rung is `FAIL` or `ERROR`, their pair in every later
rung of the same run is `BLOCKED`: not judged, with a `reason` that names the rung. "Later" is the order of the
ladder, in which a run evaluates its rungs and its manifest lists their jobs: `selftest`, `r0`, `r1`, `r2`, `r3`.
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
| `FLOOR` | the rung is gated, a metric the policy names is above its `tolerance`, and the excess is the numerical floor of the rung's floored engine, by the three conditions of [the floor](#policy). The `reason` gives what exceeded its tolerance and the figures against the arbiter |
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
store keeps with each answer, and the case of the run, which the run directory keeps under `cases/`. Some need
them: a clip radius says which rays lie in a rim band, a line's wavelength turns a path into waves, an image plane
gives a pupil's distance. Where a comparator needs one that is not there, its pairs are `ERROR` with that reason;
nothing is guessed in its place.

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
| `rays.trace` | 1 | `quantities/raysTrace.ts` | given rays, traced through every surface and on to the image plane, at one line |
| `mtf.native` | 1 | `quantities/mtfNative.ts` | an engine's own MTF of the case, by its own method and sampling |

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
| `clipRadius` | NdArray | float64 `[S]`: the largest radial height at which the engine lets a ray pass the surface |
| `innerClipRadius` | NdArray | float64 `[S]`: the radial height below which the engine stops a ray at the surface, the radius of a central obstruction; 0 for a surface without one |
| `indexAfterSurface` | NdArray | float64 `[L, S]`: the index of the medium that follows each surface, per line |
| `sagRadii` | NdArray | float64 `[S, K]`: the heights the sag is given at, each fraction times the surface's `nominalSemiDiameter` as one multiplication |
| `sag` | NdArray | float64 `[S, K]`: the sag at those heights as the engine itself evaluates it; NaN where the surface has no real sag |
| `terms` | object[][] | S lists: the polynomial terms `{ power, coeff }` the engine holds for each surface |

- **The stop row is the stop of the case.** `clipRadius` of the stop surface is the limit the engine clips with at
  the stop setting of the case, which is the stop surface's own `aperture.semiDiameter`; it is never the limit of the
  stop wide open, nor `stopSemiDiameter` itself. `sagRadii` of the stop surface scale with its
  `nominalSemiDiameter`, which a case source writes as the stop setting.
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
  against `innerSemiDiameter`, below which it is stopped), and refracted into the medium that follows, whose index
  is that of the spec's line. The medium in front of the first surface is air, of index 1.
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

**Compared by two rungs**, which ask the same requests, so that an engine traces a set once for both and the
result store holds one answer. Each has a comparator of its own. Positions and paths are compared on the rays
that are ok in both answers; every metric's `where` has the `ray` of its largest value, with the `line` of the
spec and, where the set states one, its `field` angle in degrees.

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
  own tolerance, and the limit is inclusive on a number neither holds exactly. A ray that passed every surface in
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

**For a case read from a file** (`src/rays/probe.ts`) the sets are probe lattices made from the case alone:

| | Is |
|---|---|
| lattice | `sampling.bundleGrid` cells across (an odd number is raised to the next even one, so that no ray lies on the axis or in a plane through it), laid on the first surface's vertex plane and centred on the axis, with a half width of 1.125 clip radii of the first surface: the cells past the rim are stopped at once |
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

### `mtf.native`

An engine's own MTF of the case: by its own method, with its own sampling of the pupil and its own aiming, as the
engine presents it to whoever uses it. Nothing of it is the comparator's, and no two engines are expected to
agree on it within a tolerance: it is what the independent-method rungs of the ladder record. No rung asks for it
yet; `lvrtc mtf` does, and presents each engine's answer by itself. F is the number of frequencies.

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

`valid/quantities/mtf.native.data/every-status.json` is a format example of an answer to the spec
`three-fractions.json`, with a field of each status; `best-focus-three-lines.json` one of an answer to
`angles-and-profile.json`. Their numbers describe no lens.

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
