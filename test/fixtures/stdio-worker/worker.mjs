// A worker for the stdio transport's tests: `node worker.mjs <mode>`. It speaks NDJSON as a worker does, well or, by
// its mode, badly in one particular way. It knows nothing of the contract: the transport does not either.
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const mode = process.argv[2] ?? "well";

function write(value) {
  process.stdout.write(`${typeof value === "string" ? value : JSON.stringify(value)}\n`);
}

function answer(message, result) {
  write({ contract: "1.0", id: message.id, ok: true, result });
}

// For the tests that check no process is left behind: the log then starts with the process id.
if (process.env.WORKER_ANNOUNCES_PID === "1") process.stderr.write(`pid ${process.pid}\n`);
if (mode === "exit-on-start") {
  process.stderr.write("cannot start: the licence file is missing\n");
  process.exit(2);
}
if (mode === "unsolicited") write({ contract: "1.0", id: "0", ok: true, result: {} });
// An heir is a process the worker starts that inherits its standard output and error and outlives it, as a helper
// process of a library does: the worker's pipes stay open after the worker has ended. It ends by itself after a
// minute, should no test end it sooner. The log names it, for a test that gets no reply to read its id from.
let heir;
if (mode === "heir" || mode === "heir-crash") {
  const outlives = "setTimeout(() => {}, 60000)";
  heir = spawn(process.execPath, ["-e", outlives], { stdio: ["ignore", "inherit", "inherit"], detached: true });
  heir.unref();
  process.stderr.write(`heir ${heir.pid}\n`);
}
// Neither a shutdown nor the end of its input ends a stubborn or a hanging worker.
if (mode === "stubborn" || mode === "hang") setInterval(() => {}, 1000);

let received = 0;
let waiting = 0;
let mostWaiting = 0;

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on("close", () => {
  if (mode !== "stubborn" && mode !== "hang") process.exit(0);
});
lines.on("line", (line) => {
  const message = JSON.parse(line);
  received++;
  if (message.method === "shutdown" && mode !== "stubborn" && mode !== "hang") {
    answer(message, {});
    process.exit(0);
  }
  switch (mode) {
    case "heir-crash":
      process.exit(3);
      break;
    case "crash":
      process.stderr.write("Traceback (most recent call last):\n  File worker.py, line 1\nRuntimeError: boom\n");
      process.exit(3);
      break;
    case "signal":
      process.kill(process.pid, "SIGTERM");
      break;
    case "garbage":
      process.stderr.write("about to write nonsense\n");
      write("this is not json");
      break;
    case "hang":
      process.stderr.write(`thinking about ${message.method}\n`);
      break;
    case "wrong-id":
      write({ contract: "1.0", id: `not-${message.id}`, ok: true, result: {} });
      break;
    case "non-object":
      write("42");
      break;
    case "oversized":
      write({ contract: "1.0", id: message.id, ok: true, result: { filler: "x".repeat(message.params.bytes) } });
      break;
    case "partial":
      process.stdout.write('{"contract":"1.0","id":', () => process.exit(0));
      break;
    case "flood": {
      // Several megabytes of log before every reply: a transport that did not read them would block this write.
      const chunk = `${"log ".repeat(256)}\n`;
      for (let index = 0; index < 4096; index++) process.stderr.write(chunk);
      process.stderr.write(`the flood before message ${message.id} is over\n`);
      answer(message, { received });
      break;
    }
    case "split": {
      // One reply in two writes, cut inside a multi-byte character.
      const bytes = Buffer.from(`${JSON.stringify({ contract: "1.0", id: message.id, ok: true, result: { text: "é☃" } })}\n`);
      const cut = bytes.indexOf(0xc3) + 1;
      process.stdout.write(bytes.subarray(0, cut));
      setTimeout(() => process.stdout.write(bytes.subarray(cut)), 30);
      break;
    }
    case "slow": {
      // Counts the messages that are waiting for their reply at once: a transport sends one at a time.
      waiting++;
      mostWaiting = Math.max(mostWaiting, waiting);
      setTimeout(() => {
        waiting--;
        answer(message, { received, mostWaiting, params: message.params });
      }, message.params.delayMs ?? 0);
      break;
    }
    default:
      // "well", "stubborn" and "heir": the message comes back, with what the worker was started with.
      answer(message, {
        method: message.method,
        params: message.params,
        received,
        pid: process.pid,
        heir: heir?.pid,
        argv: process.argv.slice(2),
        cwd: process.cwd(),
        env: process.env,
      });
  }
});
