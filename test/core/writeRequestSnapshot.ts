// Rewrites test/fixtures/request-snapshot.json: every check's requests and engine options on the fake LensVisualizer
// tree. Run it after a change that is meant to move a request id or an option, and read the diff:
//
//   node test/core/writeRequestSnapshot.ts
//
// A rename of a check or an engine id moves no request id and no option; it changes only the ids the snapshot files
// the jobs under.
import { writeFileSync } from "node:fs";

import { SNAPSHOT_FILE, freshSnapshot, snapshotText } from "./requestSnapshot.ts";

const { snapshot } = await freshSnapshot();
writeFileSync(SNAPSHOT_FILE, snapshotText(snapshot));
const jobs = snapshot.checks.reduce((sum, check) => sum + check.jobs.length, 0);
process.stdout.write(`${SNAPSHOT_FILE}: ${snapshot.checks.length} checks, ${jobs} jobs\n`);
