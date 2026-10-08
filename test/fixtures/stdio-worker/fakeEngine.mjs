// The comparator's TypeScript fake engine as a stdio worker: `node fakeEngine.mjs`. Its options come from
// LVRTC_ENGINE_OPTIONS, where the stdio transport puts an engine's configured options. It lets the stdio path be
// tested end to end with a real engine and no Python.
//
// FAKE_WORKER_ENDS says how it ends once shutdown is answered: "lingers" stays, deaf to the end of its input too,
// and a number is its exit code; by default it exits with code 0, as a worker should. "refuses" does not know
// shutdown: it refuses the message as an unknown method, and exits with code 0 when its input ends.
import { createInterface } from "node:readline";

import { createEngine } from "../../../src/engines/fake/engine.ts";

const handler = createEngine(JSON.parse(process.env.LVRTC_ENGINE_OPTIONS ?? "{}"));
const ends = process.env.FAKE_WORKER_ENDS ?? "0";
if (ends === "lingers") setInterval(() => {}, 1000);
const end = () => {
  if (ends !== "lingers") process.exit(ends === "refuses" ? 0 : Number(ends));
};
const refusal = (message) => {
  const error = { code: "unknown-method", message: `unknown method ${JSON.stringify(message.method)}` };
  return { contract: "1.0", id: message.id, ok: false, error };
};
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
let last = Promise.resolve();
lines.on("line", (line) => {
  last = last.then(async () => {
    const message = JSON.parse(line);
    const refused = ends === "refuses" && message.method === "shutdown";
    process.stdout.write(`${JSON.stringify(refused ? refusal(message) : await handler(message))}\n`);
    if (message.method === "shutdown" && !refused) end();
  });
});
lines.on("close", () => last.then(end));
