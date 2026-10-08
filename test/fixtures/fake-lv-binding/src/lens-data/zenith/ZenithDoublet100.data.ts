import type { FakeLensData } from "../../optics/types.js";

// A synthetic lens for tests: the numbers describe no real design.
const LENS: FakeLensData = {
  key: "zenith-doublet-100",
  name: "ZENITH Doublet 100mm f/8",
  // Its glasses have no dispersion data: the fake's gate refuses it every spectrum but the reference line.
  noDispersionData: true,
  surfaces: [
    { label: "STO", R: 1e15, d: 0.5, nd: 1, sd: 6.25 },
    { label: "2", R: 60, d: 5, nd: 1.52, sd: 8 },
    { label: "3", R: -45, d: 2, nd: 1.62, sd: 8 },
    { label: "4", R: -130, d: 96, nd: 1, sd: 8 },
  ],
};

export default LENS;
