# Quantity schemas

Two files for each quantity of the contract:

| File | `$id` | Validates |
|---|---|---|
| `<quantity>.spec.schema.json` | `urn:lvrtc:contract:v1:quantities:<quantity>.spec` | `spec` of a request for that quantity |
| `<quantity>.data.schema.json` | `urn:lvrtc:contract:v1:quantities:<quantity>.data` | `data` of an `ok` result for that quantity |

`<quantity>` is the dotted quantity id, for example `selftest.echo`. The schema loader reads this directory with
the rest of `contract/schema/v1`, so a file placed here is compiled, checked against the validator's keyword subset
and addressable by its `$id` with no code change. `quantitySchemaId` in `src/contract/schemas.ts` builds the id.

A quantity is complete when it also has TypeScript types in `src/contract/quantities/`, a module registered in
`src/quantities/`, fixtures under `contract/fixtures/v1/{valid,invalid}/quantities/<quantity>.<part>/` and an entry
in `contract/CONTRACT.md`. The tests fail on a schema file here that no registered quantity owns.

Arrays use `urn:lvrtc:contract:v1:common#/$defs/ndarray`, or `f8Array`, `f8Vector` and `f8Matrix` beside it for
float64 of any shape, of exactly one axis and of exactly two. A quantity that needs another element type or number
of axes writes the wire form out with the narrower `dtype` and `shape`, as those three do: a `$ref` cannot be
narrowed in place, because no assertion may sit beside one.

What a schema cannot state about a quantity (two arrays of one length, a list that ascends) is checked by the
quantity's module in `src/quantities/`, after the schema, and reported with the keyword `invariant`.
