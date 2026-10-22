import type { FakeLensData } from "../../optics/types.js";

// A synthetic lens for tests, with a rear plate that publishes no rim: the numbers describe no real design.
const LENS: FakeLensData = {
  schema: 2,
  key: "zenith-plate-35",
  name: "ZENITH Plate 35mm f/2.8",
  fopen: 2.8,
  // No `sd`: the fake generates the rim of the two plate surfaces, and they clip no ray.
  rearPlate: { d: 2, nd: 1.5, gap: 1 },
  surfaces: [
    { label: "1", R: 30, d: 4, nd: 1.6, sd: 7 },
    { label: "2", R: -90, d: 1.5, nd: 1, sd: 7 },
    { label: "STO", R: 1e15, d: 28, nd: 1, sd: 5 },
  ],
};

export default LENS;
