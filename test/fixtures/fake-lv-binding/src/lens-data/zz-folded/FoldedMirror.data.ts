export default {
  schema: 2, key: "zz-folded-mirror", name: "Fake folded mirror", fopen: 4,
  opticalPath: { mode: "sequential", surfaceOrder: [0, 1], maxInteractions: 3 }, imageZ: 20,
  surfaces: [
    { label: "STO", R: 1e15, d: 80, nd: 1, sd: 12 },
    { label: "M1", R: -120, d: 20, nd: 1, sd: 12, interaction: { type: "reflect", incidentSide: "front", inactiveSide: "block" } },
  ],
};
