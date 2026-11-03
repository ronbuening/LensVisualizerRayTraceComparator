// A worker for the one-shot transport's tests: `node worker.mjs <mode>`, started once per message. It reads the
// message from the file LVRTC_REQUEST_FILE names and answers it into the file LVRTC_RESULT_FILE names, well or, by
// its mode, badly in one particular way. The mode `per-message` takes the mode from the message's `params.mode`, so
// that one transport can be asked to fail and then to answer. A message whose params name a `pidFile` has the
// worker's process id written there first. It knows nothing of the contract: the transport does not either.
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const requestFile = process.env.LVRTC_REQUEST_FILE;
const resultFile = process.env.LVRTC_RESULT_FILE;

/** Writes the result file as a worker should: a temporary file beside it, then a rename. */
function writeResult(text) {
  const temporary = `${resultFile}.${process.pid}.tmp`;
  writeFileSync(temporary, text);
  renameSync(temporary, resultFile);
}

function answer(message, result) {
  writeResult(`${JSON.stringify({ contract: "1.0", id: message.id, ok: true, result })}\n`);
}

// Every worker announces itself in its log, so a test can find the process it started.
process.stderr.write(`pid ${process.pid}\n`);
const text = readFileSync(requestFile, "utf8");
const message = JSON.parse(text);
const mode = process.argv[2] === "per-message" ? message.params.mode : (process.argv[2] ?? "well");
if (typeof message.params?.pidFile === "string") {
  writeFileSync(`${message.params.pidFile}.tmp`, String(process.pid));
  renameSync(`${message.params.pidFile}.tmp`, message.params.pidFile);
}

switch (mode) {
  case "well":
    answer(message, {
      method: message.method,
      params: message.params,
      requestText: text,
      argv: process.argv.slice(2),
      cwd: process.cwd(),
      env: process.env,
      stdin: (() => {
        try {
          return readFileSync(0, "utf8");
        } catch (error) {
          return `unreadable: ${error.code}`;
        }
      })(),
    });
    break;
  case "noisy":
    // Lines on standard output that look like replies, and a log on standard error: neither is the reply.
    process.stdout.write(`${JSON.stringify({ contract: "1.0", id: message.id, ok: true, result: { from: "stdout" } })}\n`);
    process.stdout.write("starting up\n");
    process.stderr.write("warming the cache\n");
    answer(message, { from: "file" });
    process.stdout.write(`${JSON.stringify({ contract: "1.0", id: message.id, ok: false, error: { code: "x", message: "y" } })}\n`);
    break;
  case "crash":
    process.stderr.write("Traceback (most recent call last):\n  File worker.py, line 1\nRuntimeError: boom\n");
    process.exit(3);
    break;
  case "answer-then-crash":
    // A whole result file, and an exit that says the worker failed all the same: the file is not read.
    answer(message, { from: "file" });
    process.exit(4);
    break;
  case "signal":
    process.kill(process.pid, "SIGTERM");
    setInterval(() => {}, 1000);
    break;
  case "no-result":
    process.stdout.write("nothing to say\n");
    break;
  case "garbage":
    process.stderr.write("about to write nonsense\n");
    writeResult("this is not json");
    break;
  case "partial":
    // Written in place and cut short, as a worker that does not write atomically might leave it.
    writeFileSync(resultFile, '{"contract":"1.0","id":');
    break;
  case "oversized":
    answer(message, { filler: "x".repeat(message.params.bytes) });
    break;
  case "litter":
    // Temporary files beside the result, as a worker killed while it wrote would leave them, and a failure.
    writeFileSync(`${resultFile}.${process.pid}.tmp`, "half a reply");
    writeFileSync(`${resultFile}.other.tmp`, "another half");
    process.exit(5);
    break;
  case "hang":
    process.stderr.write(`thinking about ${message.method}\n`);
    setInterval(() => {}, 1000);
    break;
  case "rendezvous": {
    // Answers only once the other worker of the pair has started: two calls answered this way ran at once.
    const { directory, me, other } = message.params;
    writeFileSync(join(directory, me), "");
    const waiting = setInterval(() => {
      if (!existsSync(join(directory, other))) return;
      clearInterval(waiting);
      answer(message, { me, pid: process.pid });
    }, 10);
    break;
  }
  default:
    process.stderr.write(`unknown mode ${mode}\n`);
    process.exit(64);
}
