// Transient suite inputs, outside every engine closure. V8 serialization preserves all numeric bits, including -0.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { deserialize, serialize } from "node:v8";
import type { OpticalCase } from "../contract/case.ts";
import { deepFreeze } from "../contract/json.ts";
import type { QuantityRequest } from "../contract/request.ts";
import { profileSync } from "./profile.ts";

export interface PreparedInput {
  readonly file: string;
  readonly index: number;
}
export interface PoolInputs {
  readonly prepared?: PreparedInput;
  readonly request?: QuantityRequest;
  readonly opticalCase?: OpticalCase;
}
interface InputFile {
  readonly opticalCase: OpticalCase | null;
  readonly requests: readonly QuantityRequest[];
}
export function writePreparedInputs(file: string, value: InputFile): void {
  profileSync("inputs.write", () => {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, serialize(value), { flag: "wx" });
  });
}
/** A small LRU bounds replica memory; files are immutable for the suite and removed after all children exit. */
export function createInputReader(): (input: PoolInputs) => { request: QuantityRequest; opticalCase: OpticalCase } {
  const files = new Map<string, InputFile>();
  return (input) => {
    if (input.prepared === undefined) {
      if (!input.request || !input.opticalCase) throw new Error("pool request has no input");
      return { request: input.request, opticalCase: input.opticalCase };
    }
    const { file, index } = input.prepared;
    let value = files.get(file);
    if (value === undefined) {
      value = profileSync("inputs.read", () => deepFreeze(deserialize(readFileSync(file)) as InputFile));
      if (files.size === 4) files.delete(files.keys().next().value!);
    } else files.delete(file);
    files.set(file, value);
    const request = value.requests[index];
    if (!value.opticalCase || !request) throw new Error("pool request names no prepared input");
    return { request, opticalCase: value.opticalCase };
  };
}
