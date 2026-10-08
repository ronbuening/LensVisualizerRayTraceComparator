// The fake's aspheric schema, under LV's name for it: the polynomial coefficients the sag evaluates, in LV's order
// (even powers, then odd ones). A coefficient that is not listed here is not part of any surface.
export const ASPHERIC_POLYNOMIAL_TERMS: readonly { key: string; power: number; parity: "even" | "odd" }[] = [
  { key: "A4", power: 4, parity: "even" },
  { key: "A6", power: 6, parity: "even" },
  { key: "A8", power: 8, parity: "even" },
  { key: "A3", power: 3, parity: "odd" },
  { key: "A5", power: 5, parity: "odd" },
];
