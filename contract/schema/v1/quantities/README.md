# Quantity schemas

Contract v1 defines no quantity yet. A later stage adds two files here for each quantity it introduces:

| File | `$id` | Validates |
|---|---|---|
| `<quantity>.spec.schema.json` | `urn:lvrtc:contract:v1:quantities:<quantity>.spec` | `spec` of a request for that quantity |
| `<quantity>.data.schema.json` | `urn:lvrtc:contract:v1:quantities:<quantity>.data` | `data` of an `ok` result for that quantity |

`<quantity>` is the dotted quantity id, for example `rays.trace`. The schema loader reads this directory with the
rest of `contract/schema/v1`, so a file placed here is compiled, checked against the validator's keyword subset
and addressable by its `$id` with no code change. `quantitySchemaId` in `src/contract/schemas.ts` builds the id.

Arrays use `urn:lvrtc:contract:v1:common#/$defs/ndarray`. A quantity that needs one element type or a fixed number
of axes writes the wire form out with the narrower `dtype` and `shape`, as `f8Matrix` in `common.schema.json` does:
a `$ref` cannot be narrowed in place, because no assertion may sit beside one.
