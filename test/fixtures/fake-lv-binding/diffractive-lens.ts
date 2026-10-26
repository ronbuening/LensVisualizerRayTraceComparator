export default { schema: 2, key: "zz-diffractive", name: "Fake diffractive plate", fopen: 4, surfaces: [
  { label: "STO", R: 1e15, d: 100, nd: 1, sd: 10, diffractive: { kind: "radial-polynomial", referenceWavelengthNm: 587.5618, diffractionOrder: 1, quadraticCoefficient: -.005, terms: [{ radialPower: 2, coefficient: -.005, derivativeCoefficient: -.01 }] } }
] };
