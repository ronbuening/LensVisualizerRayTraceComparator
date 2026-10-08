// The check an "ok" result's data must pass before it is stored or compared. An adapter validates the envelope;
// the data belongs to the quantity, and the bytes of its arrays to the array codec.
import { formatIssues } from "../contract/schemas.ts";
import type { QuantityModule } from "../quantities/module.ts";
import { decodeNdArray } from "./numeric/ndarray.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Every NdArray wire form in a JSON value that does not decode, as `<JSON Pointer>: <reason>`, in document order. */
function arrayProblems(value: unknown, pointer: string, problems: string[]): string[] {
  if (Array.isArray(value)) {
    value.forEach((element, index) => arrayProblems(element, `${pointer}/${index}`, problems));
  } else if (isRecord(value) && Object.hasOwn(value, "$nd")) {
    try {
      decodeNdArray(value);
    } catch (error) {
      problems.push(`${pointer || "(root)"}: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else if (isRecord(value)) {
    for (const [key, member] of Object.entries(value)) {
      arrayProblems(member, `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`, problems);
    }
  }
  return problems;
}

/**
 * Everything that keeps `data` from being the data of an "ok" result of `quantity`; empty exactly when it can be
 * stored and compared. First the quantity's own schema, as one problem that lists every issue. When that holds,
 * every array in the data is decoded, wherever it sits, and each one that does not decode is a problem: bytes that
 * are not canonical base64, are not as many as the shape needs or do not hash to the digest they travel with.
 * Deterministic: equal data gives equal problems.
 */
export function resultDataProblems(quantity: QuantityModule, data: unknown): string[] {
  const issues = quantity.validateData(data);
  if (issues.length > 0) return [`it is not ${quantity.id} data: ${formatIssues(issues)}`];
  return arrayProblems(data, "", []);
}
