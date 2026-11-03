// A fake human operator of a file-exchange engine: `node operator.mjs <exchange directory of one engine>`. It does
// what a person would: takes every job in outbox/ by moving it to pending/, answers each taken job's message.json
// with the comparator's TypeScript fake engine (`src/engines/fake/engine.ts`, made from the options in the job's
// job.json, so it is the engine the definition's descriptor describes), and writes the result envelope as
// inbox/<job>.json, whole (a temporary file beside it, then a rename). It prints one line per job it answered. A job in
// pending/ that has an answer already is left as it is.
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createEngine } from "../../../src/engines/fake/engine.ts";

const directory = process.argv[2];
if (directory === undefined) {
  process.stderr.write("usage: node operator.mjs <exchange directory of one engine>\n");
  process.exit(2);
}
const folder = (name) => join(directory, name);
const jobs = (name) =>
  existsSync(folder(name)) ? readdirSync(folder(name)).filter((entry) => !entry.startsWith(".")).sort() : [];

mkdirSync(folder("pending"), { recursive: true });
mkdirSync(folder("inbox"), { recursive: true });
for (const job of jobs("outbox")) renameSync(join(folder("outbox"), job), join(folder("pending"), job));

for (const job of jobs("pending")) {
  const answer = join(folder("inbox"), `${job}.json`);
  if (existsSync(answer)) continue;
  const taken = join(folder("pending"), job);
  const { options } = JSON.parse(readFileSync(join(taken, "job.json"), "utf8"));
  const message = JSON.parse(readFileSync(join(taken, "message.json"), "utf8"));
  const reply = await createEngine(options)(message);
  if (!reply.ok) throw new Error(`the fake engine refused job ${job}: ${reply.error.message}`);
  const temporary = `${answer}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(reply.result, null, 2)}\n`);
  renameSync(temporary, answer);
  process.stdout.write(`answered ${job}\n`);
}
