import type { FakeLensData } from "../../optics/types.js";

// A synthetic zoom for tests, with quoted keys as some LV lens files have: the numbers describe no real design.
const LENS: FakeLensData = {
  "key": "acme-zoom-24-48",
  "name": "ACME Zoom 24-48mm f/4",
  "zoomPositions": [24, 48],
  "zoomStopSDs": [3, 6],
  "zoomGaps": [0, 10],
  "fopen": 4,
  "rearPlate": { "d": 1.5, "nd": 1.5, "gap": 0.5, "sd": 12 },
  "surfaces": [
    { "label": "1", "R": 40, "d": 3, "nd": 1.6, "sd": 9 },
    { "label": "2A", "R": -80, "d": 2, "nd": 1, "sd": 9, "asphere": { "K": -1, "A4": 1e-6 } },
    { "label": "STO", "R": 1e15, "d": 2, "nd": 1, "sd": 3 },
    { "label": "4", "R": 60, "d": 3, "nd": 1.7, "sd": 7 },
    { "label": "5", "R": -60, "d": 30, "nd": 1, "sd": 7 },
  ],
};

export default LENS;
