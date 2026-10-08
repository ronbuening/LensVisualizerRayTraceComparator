// Run as a process of its own by binding.test.ts: prints the engine fingerprint of the LensVisualizer checkout
// given as the first argument, as one line of JSON. With "scan" as the second argument the whole lens catalog is
// imported first, so the two ways of running it show that lens files never reach the fingerprint.
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";

const [lvPath, mode] = process.argv.slice(2);
const binding = await loadLvBinding(lvPath);
const lenses = mode === "scan" ? (await binding.catalog()).entries.length : 0;
process.stdout.write(`${JSON.stringify({ fingerprint: binding.fingerprint(), changed: binding.rehash(), lenses })}\n`);
