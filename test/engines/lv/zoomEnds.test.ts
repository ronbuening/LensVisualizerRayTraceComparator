import assert from "node:assert/strict";
import { test } from "node:test";

import { ZOOM_ENDS, primeZoomNote, teleHint, zoomEndAt } from "../../../src/engines/lv/zoomEnds.ts";

test("the ends of a zoom are wide at 0 and tele at 1, in that order, and a position between them is neither", () => {
  assert.deepEqual(ZOOM_ENDS, [
    { end: "wide", zoomT: 0 },
    { end: "tele", zoomT: 1 },
  ]);
  assert.deepEqual([0, -0, 1, 0.5, 1e-9, 1 - 2 ** -53, Number.NaN].map(zoomEndAt), [
    "wide",
    "wide",
    "tele",
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
});

test("a tool of one state names the lens, the end it shows and the option that gives the other", () => {
  assert.equal(
    teleHint("acme-zoom-24-48"),
    "acme-zoom-24-48 is a zoom lens: this is its wide end (zoom 0); --zoom 1 gives the tele end",
  );
  assert.equal(
    primeZoomNote("acme-singlet-50"),
    "acme-singlet-50 is a prime: it has no zoom position, and --zoom is ignored",
  );
});
