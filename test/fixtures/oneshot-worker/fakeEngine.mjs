// The comparator's TypeScript fake engine as a one-shot worker: `node fakeEngine.mjs`, started once per message. Its
// options come from LVRTC_ENGINE_OPTIONS; it answers the message in LVRTC_REQUEST_FILE into LVRTC_RESULT_FILE, written
// atomically, and exits with code 0. It lets the one-shot path be tested end to end with a real engine and no Python.
import { readFileSync, renameSync, writeFileSync } from "node:fs";

import { createEngine } from "../../../src/engines/fake/engine.ts";

const handler = createEngine(JSON.parse(process.env.LVRTC_ENGINE_OPTIONS ?? "{}"));
const message = JSON.parse(readFileSync(process.env.LVRTC_REQUEST_FILE, "utf8"));
const reply = await handler(message);
const resultFile = process.env.LVRTC_RESULT_FILE;
const temporary = `${resultFile}.${process.pid}.tmp`;
writeFileSync(temporary, `${JSON.stringify(reply)}\n`);
renameSync(temporary, resultFile);
