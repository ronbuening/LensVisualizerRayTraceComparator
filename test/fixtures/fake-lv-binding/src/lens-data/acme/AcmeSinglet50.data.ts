import type { FakeLensData } from "../../optics/types.js";

// A synthetic lens for tests: the numbers describe no real design.
const LENS: FakeLensData = {
  key: "acme-singlet-50",
  name: "ACME Singlet 50mm f/4",
  focusTravel: 5,
  surfaces: [
    { label: "1", R: 50, d: 4, nd: 1.5, sd: 8 },
    { label: "2", R: -50, d: 1, nd: 1, sd: 8 },
    { label: "STO", R: 1e15, d: 47.5, nd: 1, sd: 6.25 },
  ],
};

export default LENS;
