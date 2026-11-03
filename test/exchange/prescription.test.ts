// The prescription writer "table" on synthetic cases: a case of every surface kind the contract has and a folded
// case, each held to an exact text, every number in the shortest decimal that reads back as the same double, and a
// member the writer does not know refused by its path.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../src/contract/case.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { PRESCRIPTION_WRITER_NAMES } from "../../src/exchange/names.ts";
import { PRESCRIPTION_WRITERS, exactNumber } from "../../src/exchange/prescription.ts";
import { everyKindCase, foldedCase, requestAbout } from "./support.ts";

const HEADER = `Prescription of an optical case for an engine operated by hand, written by lvrtc (writer "table").
Every number is the shortest decimal that reads back as the same double; -0 is written -0.
Lengths are mm. Light travels toward +z and the first vertex is at z = 0. A radius above 0 puts the centre of
curvature toward +z. Sag: z(r) = c r^2 / (1 + sqrt(1 - (1 + k) c^2 r^2)) + sum of a_p r^p, with c = 1 / radius,
and c = 0 for a plane or a flat base. A clip semi-diameter stops a ray above it; a ray exactly at it passes.
`;

const REQUEST_TAIL = `  contract                1.0
  quantity                rays.trace
  version                 the original definition
  spec.fieldsDeg          [0, 1.5, -0]
  spec.groups.chiefIndex  1
  spec.groups.empty       {}
  spec.groups.flags       [true, false]
  spec.groups.none        null
  spec.label              "two rays"
  spec.line               0
  spec.rays               f8 array of shape [2, 3]; its values are in message.json
  engineOptions.fftRays   512
`;

const EVERY_KIND = `${HEADER}
Case
  id              7fe4b5a699f34174066247dc0691463b6948750f070494a342375873cd38bad1
  system id       33a48ca0ab04be0000be164a8bfc7781620ec1bf922e2791d9944b649b560e91
  contract        1.5
  name            "Every kind"
  lens key        made-up-zoom
  zoom position   0.5
  focus position  0.125
  features        aperture.annular, aperture.unclipped, lines.multiple, object.finite, surface.asphere.even, surface.asphere.flat-base, surface.asphere.odd, surface.conic, surface.diffractive
  source          LensVisualizer lens made-up-zoom, file src/lens-data/made-up/MadeUp.data.ts (sha256 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa), zoom 0.5, focus 0.125
  LensVisualizer  commit bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, work tree clean, closure cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
  notes           made-up-note
  producer        lvrtc 0.0.0

Conditions
  object              on the plane z = -200
  stop                surface 2 ("STO"), semi-diameter 4
  image plane         z = 30.25
  design image plane  z = 30
  last lens surface   4 ("C5")

Lines (line 0 is the reference line)
  line  wavelength nm  weight  index source
  0     550            1       authored
  1     650            0.5     anchored

Surfaces (thickness: to the next vertex; after the last surface, to the design image plane)
  surface  label  z    thickness  shape    radius     conic  clip semi-diameter  nominal semi-diameter  inner semi-diameter  element  note
  0        "A1"   -0   2.5        asphere  50         -1     10                  10.5                   0                    1
  1        "D2"   2.5  1.5        conic    -80        0      10                  10                     0                    0
  2        "STO"  4    3          plane    -          -      4                   4                      0                    0        stop
  3        "O4"   7    2          asphere  flat base  0      8                   8                      1.5                  2
  4        "C5"   9    20         conic    30         0.5    8                   8                      0                    0        last lens surface
  5        "RP"   29   1          plane    -          -      does not clip       12                     0                    3        rear plate the case source generated

Asphere terms (every term of every asphere)
  surface  power  coefficient
  0        4      0.00000125
  0        6      -2.5e-10
  3        1      0.0005
  3        3      0.00002

Medium after each surface: its refractive index at each line (air is 1)
  surface  line 0 (550 nm, authored)  line 1 (650 nm, anchored)
  0        1.5                        1.4921875
  1        1                          1
  2        1                          1
  3        1.625                      1.6171875
  4        1                          1
  5        1.5                        1.4921875

Diffractive phase: an optical path W(r) = sum of c_p r^p added at the surface, mm, at its design wavelength
  surface  design wavelength nm  order  power  coefficient
  1        550                   1      2      -0.001
  1        550                   1      4      3e-8

Optical path: sequential, the surfaces in their order

Request
  id                      ddad5868f8926ffb05e369bd5937ca4ad3f79ede5a5a16c0356501d202e4f9bb
  case                    7fe4b5a699f34174066247dc0691463b6948750f070494a342375873cd38bad1
${REQUEST_TAIL}`;

const FOLDED = `${HEADER}
Case
  id         58f07d8baef8690b15de8802ef75c1c23f8b00d1f232e809982f1484bd0f01ac
  system id  6d526e894024c7bfa3eca3bddc21056e9ac2711cd19eeca9c7cb22c2ce21880e
  contract   1.4
  name       "Folded"
  features   aperture.annular, path.folded, surface.conic
  source     fixture "folded"
  producer   lvrtc 0.0.0

Conditions
  object              at infinity
  stop                surface 0 ("W"), semi-diameter 20
  image plane         z = -30
  design image plane  z = -30
  last lens surface   1 ("M")

Lines (line 0 is the reference line)
  line  wavelength nm  weight  index source
  0     500            1       authored

Surfaces (thickness: to the next vertex; after the last surface, to the design image plane)
  surface  label  z   thickness  shape  radius  conic  clip semi-diameter  nominal semi-diameter  inner semi-diameter  element  note
  0        "W"    0   10         plane  -       -      20                  20                     0                    0        stop
  1        "M"    10  -40        conic  -100    -1     20                  20                     5                    0        last lens surface

Asphere terms: none

Medium after each surface: its refractive index at each line (air is 1)
  surface  line 0 (500 nm, authored)
  0        1.25
  1        1

Diffractive phase: none

Optical path: the visits in order; a medium is the index column of the surface named, or air
  step  surface  interaction  medium after         reverse medium after  incident side  inactive side
  0     0        refract      column of surface 0  -                     front          ignore
  1     1        reflect      -                    -                     -              -
  2     0        refract      air                  column of surface 0   -              -

Request
  id                      0408c1aa0b80cda8fbbe67719de951e1081759b2777edc2a1ec32a098399d4ac
  case                    58f07d8baef8690b15de8802ef75c1c23f8b00d1f232e809982f1484bd0f01ac
${REQUEST_TAIL}`;

const table = PRESCRIPTION_WRITERS.table;

test("there is a writer for every name, and the table's file is named after it", () => {
  assert.deepEqual(Object.keys(PRESCRIPTION_WRITERS).sort(), [...PRESCRIPTION_WRITER_NAMES].sort());
  assert.equal(table.file, "prescription-table.txt");
});

test("a number is the shortest decimal that reads back as the same double, and -0 stays -0", () => {
  const values = [0, -0, 1.5, 0.1 + 0.2, 2 ** -1074, -Number.MAX_VALUE, 1e21, 1.25e-6, 41.919444999999996];
  for (const value of values) assert.ok(Object.is(Number(exactNumber(value)), value), exactNumber(value));
  assert.deepEqual(values.map(exactNumber), [
    "0",
    "-0",
    "1.5",
    "0.30000000000000004",
    "5e-324",
    "-1.7976931348623157e+308",
    "1e+21",
    "0.00000125",
    "41.919444999999996",
  ]);
});

test("the table of a case with every surface kind: all of its members, every term, every index", () => {
  const opticalCase = everyKindCase();
  const request = requestAbout(opticalCase);
  assert.equal(table.write(opticalCase, request), EVERY_KIND);
  // A pure function: the same text again.
  assert.equal(table.write(opticalCase, request), EVERY_KIND);
});

test("the table of a folded case: its optical path visit by visit, with each medium and side", () => {
  const opticalCase = foldedCase();
  assert.equal(table.write(opticalCase, requestAbout(opticalCase)), FOLDED);
});

test("a member the writer does not know is an error that names it: none is left out", () => {
  const base = everyKindCase();
  const request = requestAbout(base);
  const surface = (index: number, change: (value: Record<string, unknown>) => Record<string, unknown>): OpticalCase => {
    const surfaces = base.system.surfaces.map((value, at) =>
      at === index ? (change({ ...value }) as unknown as (typeof base.system.surfaces)[number]) : value,
    );
    return { ...base, system: { ...base.system, surfaces } };
  };
  const cases: [OpticalCase, QuantityRequest, RegExp][] = [
    [{ ...base, comment: "x" } as unknown as OpticalCase, request, /case\.comment is a member it does not know/],
    [{ ...base, label: { ...base.label, colour: "red" } } as unknown as OpticalCase, request, /case\.label\.colour/],
    [{ ...base, system: { ...base.system, mirrors: [] } } as unknown as OpticalCase, request, /case\.system\.mirrors/],
    [surface(1, (value) => ({ ...value, coating: "MgF2" })), request, /case\.system\.surfaces\[1\]\.coating/],
    [
      surface(0, (value) => ({ ...value, shape: { ...(value.shape as object), normRadius: 10 } })),
      request,
      /case\.system\.surfaces\[0\]\.shape\.normRadius/,
    ],
    [
      surface(0, (value) => ({ ...value, shape: { kind: "toroid", radius: 1 } })),
      request,
      /case\.system\.surfaces\[0\]\.shape\.kind is "toroid", which it does not know/,
    ],
    [
      surface(0, (value) => ({
        ...value,
        shape: { kind: "asphere", radius: 50, conic: 0, terms: [{ power: 4, coeff: 1, norm: 2 }] },
      })),
      request,
      /case\.system\.surfaces\[0\]\.shape\.terms\[0\]\.norm/,
    ],
    [
      surface(5, (value) => ({ ...value, aperture: { ...(value.aperture as object), decenter: 1 } })),
      request,
      /case\.system\.surfaces\[5\]\.aperture\.decenter/,
    ],
    [
      surface(1, (value) => ({ ...value, diffractive: { ...(value.diffractive as object), normRadius: 5 } })),
      request,
      /case\.system\.surfaces\[1\]\.diffractive\.normRadius/,
    ],
    [
      surface(1, (value) => ({ ...value, diffractive: { ...(value.diffractive as object), kind: "grating" } })),
      request,
      /case\.system\.surfaces\[1\]\.diffractive\.kind is "grating"/,
    ],
    [
      surface(2, (value) => ({ ...value, synthetic: "filter" })),
      request,
      /case\.system\.surfaces\[2\]\.synthetic is "filter"/,
    ],
    [
      { ...base, conditions: { ...base.conditions, temperatureC: 20 } } as unknown as OpticalCase,
      request,
      /case\.conditions\.temperatureC/,
    ],
    [
      {
        ...base,
        conditions: { ...base.conditions, object: { kind: "finite", z: -200, height: 3 } },
      } as unknown as OpticalCase,
      request,
      /case\.conditions\.object\.height/,
    ],
    [
      {
        ...base,
        conditions: { ...base.conditions, lines: [{ ...base.conditions.lines[0], name: "e" }] },
      } as unknown as OpticalCase,
      request,
      /case\.conditions\.lines\[0\]\.name/,
    ],
    [
      {
        ...base,
        provenance: { ...base.provenance, source: { kind: "zemax", file: "a.zmx" } },
      } as unknown as OpticalCase,
      request,
      /case\.provenance\.source\.kind is "zemax"/,
    ],
    [
      {
        ...base,
        provenance: { ...base.provenance, lv: { ...base.provenance.lv, branch: "main" } },
      } as unknown as OpticalCase,
      request,
      /case\.provenance\.lv\.branch/,
    ],
    [
      { ...base, provenance: { ...base.provenance, signedBy: "x" } } as unknown as OpticalCase,
      request,
      /case\.provenance\.signedBy/,
    ],
    [base, { ...request, priority: 1 } as unknown as QuantityRequest, /request\.priority is a member it does not know/],
  ];
  const folded = foldedCase();
  const path = folded.system.opticalPath!.map((step, at) => (at === 1 ? { ...step, angleDeg: 45 } : step));
  cases.push([
    { ...folded, system: { ...folded.system, opticalPath: path } } as unknown as OpticalCase,
    requestAbout(folded),
    /case\.system\.opticalPath\[1\]\.angleDeg/,
  ]);
  for (const [opticalCase, asked, problem] of cases) {
    assert.throws(() => table.write(opticalCase, asked), problem, String(problem));
  }
});
