import { createInterface } from "node:readline";
import { createEngine } from "./engine.mjs";
const handler = createEngine(JSON.parse(process.env.LVRTC_ENGINE_OPTIONS));
const lines = createInterface({ input: process.stdin });
for await (const line of lines) {
  const message = JSON.parse(line);
  process.stdout.write(`${JSON.stringify(await handler(message))}\n`);
  if (message.method === "shutdown") break;
}
