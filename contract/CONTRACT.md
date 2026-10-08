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
height passes. `innerSemiDiameter` above 0 is a central obstruction.

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
- Cases of one lens under different conditions share a `systemId`.
- `engineOptions` is not in a request's `id`, so one request sent to several engines keeps one id.
- **Hashes are computed only in TypeScript.** Other languages do not write numbers the way ECMAScript does
  (`1.2e-6` is `0.0000012` in ECMAScript and `1.2e-06` in Python), so a worker never recomputes an id: it echoes
  the ids it was given and hashes its own sources for its fingerprint.

`finalizeCase` (`src/contract/case.ts`) turns a draft into a case: it validates, derives `features`, computes both
ids and returns the case frozen. `verifyCaseIdentity` recomputes all three for a stored case and reports each
mismatch. `makeRequest` (`src/contract/request.ts`) does the same for a request.

## Versioning

Every document carries the contract version it was written to, as `<major>.<minor>`. This is version `1.0`.

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
| `aperture` | object | `semiDiameter` > 0, `nominalSemiDiameter` > 0 (as the prescription states it), `innerSemiDiameter` ≥ 0 |
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

`provenance` is `source` (`{ kind: "lv-lens", lensKey, file, fileSha256 }` or `{ kind: "fixture", name }`), `lv?`
(`commit` and `dirty`, each null when unknown, and `closureHash`) and `producer` (`{ tool: "lvrtc", version }`).

**Invariants checked in code** (`caseInvariantProblems`), because a schema cannot state them:

- `stopIndex` and `lastLensSurfaceIndex` are indices of `surfaces`;
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

### `run-spec`

The user's specification of one run. Only `contract`, `kind`, `name` and `lens` are required; an option left out
takes the comparator's default.

| Member | Type | Meaning |
|---|---|---|
| `contract` | string | contract version |
| `kind` | `"run-spec"` | |
| `name` | string | letters, digits, `.`, `_` and `-`; safe as a file name |
| `lens` | object | `{ kind: "lv", key }`, or `{ kind: "fixture", path }` naming an `optical-case` file; a relative path is resolved against the configuration root: the repository root, unless `lvrtc run --root` names another |
| `state?` | object | `zoomT?` 0..1 and `focus?`: `{ kind: "infinity" }` or `{ kind: "focusT", value }` 0..1 |
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
  "rungs": ["R0", "R1", "R2", "R3", "R4"],
  "engines": ["ref", "optiland"],
  "referenceEngine": "ref"
}
```

It reads: take the Double-Gauss fixture as it is, wide open, on its reference line; evaluate on axis and at 10°
and 14° off axis, at the design image plane, at 10, 20 and 40 cycles/mm; run rungs R0 to R4 with the engines
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
within a suite.

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
    "rungs": ["R0", "R1", "R2", "R3", "R4"],
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
| `engine` | object | `id`, `fingerprint` and `details`, a flat map of strings, numbers, booleans and nulls |
| `status` | string | `ok`, `unsupported`, `error` or `pending` |
| `unsupported?` | object[] | each `{ code, item, message }`; `code` is `feature`, `quantity`, `option` or `contract` |
| `error?` | object | `{ code, message }` |
| `method?` | object | `{ name, params }`: how the engine computed the data |
| `data?` | object | the quantity's data; its schema belongs to the quantity |
| `diagnostics` | object | `warnings`, a list of strings, and `counts`, a map of numbers |

`unsupported` is a first-class answer, not a failure: it is what fills a support matrix. `pending` is a job handed
to an engine that answers later, such as one a person operates.

**Invariants checked in code** (`resultInvariantProblems`): status `ok` needs `data`; status `unsupported` needs a
non-empty `unsupported` list; status `error` needs `error`.

### `engine-descriptor`

| Member | Type | Meaning |
|---|---|---|
| `contract` | object | `min` and `max`: the range of contract versions the engine speaks, both included |
| `identity` | object | `id`, `version`, `fingerprint`, `details` |
| `capabilities.features` | object | `supported`, a list of feature flags, and `limits`, a map from limit to the largest value handled |
| `capabilities.quantities` | object | a map from quantity id to `{ version }`: the version of the quantity's definition that the engine implements, an integer of at least 1 |
| `capabilities.deterministic` | boolean | whether equal requests give bit-equal results |
| `capabilities.maxConcurrency` | integer ≥ 1 | how many requests the engine works on at once |

`fingerprint` is a content hash of the engine's own sources. Results are keyed by it; `version` is for people.
A limit an engine leaves out is unbounded.

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
`result` of status `error`.

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

## Quantities

A quantity is what a request asks for, identified by a dotted id (`system.describe`, `paraxial.first-order`,
`rays.trace`, `mtf.native`). Each has two schema files under
[`schema/v1/quantities/`](schema/v1/quantities/README.md): `<id>.spec.schema.json` for the `spec` of a request and
`<id>.data.schema.json` for the `data` of a result of status `ok`. The definition of a quantity, which is its two
schemas and what this document says they mean, has a version: an integer from 1 that rises when the definition
changes incompatibly. An engine states the version it implements under `capabilities.quantities`.

The schemas of `request` and `result` accept any object as `spec` and `data`. Whoever knows the quantity validates
them against its own schemas; in TypeScript that is the quantity's module in `src/quantities/`, with `validateSpec`
and `validateData`.

| Quantity | Version | TypeScript | Is |
|---|---|---|---|
| `selftest.echo` | 1 | `quantities/selftestEcho.ts` | an array sent back scaled: a conformance check that needs no optics |

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
