import { appendFileSync } from "node:fs";
import { createEngine as fake } from "../../../src/engines/fake/engine.ts";

export function createEngine({ log, crashScale, invalidScale, delay = 0, ...options }) {
  const handler = fake(options);
  return async (message) => {
    const record = (event) => { if (log) appendFileSync(log, `${JSON.stringify({ pid: process.pid, engine: options.id, event, method: message.method })}\n`); };
    record("start");
    if (message.method === "run") {
      if (crashScale !== undefined && message.params.request.spec.scale === crashScale) process.exit(3);
      // CPU work blocks this process, so overlapping starts prove process isolation.
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
    }
    const answer = await handler(message);
    record("end");
    if (message.method === "run" && invalidScale !== undefined && message.params.request.spec.scale === invalidScale && answer.ok) {
      return { ...answer, result: { ...answer.result, data: { deliberatelyInvalid: true } } };
    }
    return answer;
  };
}
