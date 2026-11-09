// The migration guard: today's adapter revisions of every built-in engine, and the fingerprints of the engines whose
// code is this repository's, pinned in full. The result store keys an answer by them, and the committed baselines
// record them (benchmark.json and benchmark.mtf.json hold lv, ref, replay, wave, optiland and optiland-wave). A move
// here means the code closure of an engine changed: its stored answers are computed again and its baseline records
// are out of date. When the opaque engine ids are renamed, exactly the six renamed engines move (ref, ref-seidel,
// replay, wave, flux, optiland-wave), each by its own id constant; lv's and optiland's must not. Pin anew only for a
// change meant to move a revision, and say so in the commit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { LV_FLUX_ENGINE_MODULE } from "../../src/engines/lv/fluxEngine.ts";
import { LV_REPLAY_ENGINE_MODULE } from "../../src/engines/lv/replayEngine.ts";
import { LV_WAVE_ENGINE_MODULE } from "../../src/engines/lv/waveEngine.ts";
import { REF_ENGINE_MODULE } from "../../src/engines/ref/engine.ts";
import { refFingerprint } from "../../src/engines/ref/fingerprint.ts";
import { REF_SEIDEL_ENGINE_MODULE, refSeidelFingerprint } from "../../src/engines/refSeidel/engine.ts";
import { PYTHON, PYTHON_MISSING } from "../engines/support.ts";

const MOVED =
  "an engine's code closure changed, so its stored answers are computed again and its baseline records go out of " +
  "date; when the opaque engine ids are renamed exactly the six renamed engines move, never lv or optiland";

/** The adapter revisions of today, by engine, of the TypeScript modules they start from. */
const ADAPTER_REVISIONS: Readonly<Record<string, readonly [module: string, revision: string]>> = {
  lv: [LV_ENGINE_MODULE, "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5"],
  ref: [REF_ENGINE_MODULE, "2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357"],
  replay: [LV_REPLAY_ENGINE_MODULE, "99024448fdb11f7eb293d0e54cf8281dc5272c57c468beeb30d66bb53ecf3409"],
  wave: [LV_WAVE_ENGINE_MODULE, "956fcaf5a64e0a0873c6514edd117b9d5002f92623e4f05f6c06faa409926182"],
  flux: [LV_FLUX_ENGINE_MODULE, "973a417397ef718c252acf3df77fa746782fa17b20b4f22373171e8295ccba58"],
  "ref-seidel": [REF_SEIDEL_ENGINE_MODULE, "03133c53f44f6447bb439ce5b5f93a35904efdcf1679e52bad425882d025f6cc"],
  // The TypeScript part of optiland-wave's revision; the whole is this combined with the worker's (below).
  "optiland-wave (TypeScript)": [
    "engines/optiland/wavefrontEngine.ts",
    "4d547ec4020250ea5d9f978249f20b654ce9d6f91746e2aa37234b48898e75f9",
  ],
};

/** The optiland worker's adapter revision of today: optiland's, and the Python half of optiland-wave's. */
const WORKER_REVISION = "98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb";
/** optiland-wave's adapter revision as the baselines record it: the worker's and the TypeScript closure's. */
const OPTILAND_WAVE_REVISION = "f6e596a0a856e4c27449919d31e73b446c909add6809cbfdfbdf8ae6718b818f";

/** The fingerprints of the engines whose code is this repository's own (lv's, replay's, wave's, flux's are LV's). */
const FINGERPRINTS = {
  ref: "b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e",
  "ref-seidel": "51ad78e8ecb40277d4bc35183a5112f12d866459cd737be3735f2ca582a49d8c",
} as const;

const WORKERS = fileURLToPath(new URL("../../workers/python", import.meta.url));

/**
 * The worker's adapter revision as `lvrtc_optiland/identity.py` (`adapter_revision`) computes it, restated: a SHA-256
 * over every `.py` file of `lvrtc_optiland` and `lvrtc_worker_kit`, by POSIX path relative to `workers/python`, sorted,
 * each its path, a NUL, its bytes with CRLF read as LF, and a NUL.
 */
function workerRevision(root: string = WORKERS): string {
  const files = ["lvrtc_optiland", "lvrtc_worker_kit"]
    .flatMap((pkg) =>
      readdirSync(join(root, pkg), { recursive: true, encoding: "utf8" })
        .filter((file) => file.endsWith(".py"))
        .map((file) => `${pkg}/${file.split(sep).join("/")}`),
    )
    .sort();
  const parts = files.flatMap((file) => {
    const bytes = Buffer.from(
      readFileSync(join(root, ...file.split("/")), "latin1").replaceAll("\r\n", "\n"),
      "latin1",
    );
    return [Buffer.from(`${file}\0`, "utf8"), bytes, Buffer.from("\0")];
  });
  return sha256Hex(Buffer.concat(parts));
}

test("the adapter revision of every built-in engine's TypeScript closure is today's", () => {
  for (const [engine, [module, revision]] of Object.entries(ADAPTER_REVISIONS)) {
    assert.equal(adapterRevision(module).revision, revision, `${engine}: ${MOVED}`);
  }
});

test("the optiland worker's adapter revision is today's, and optiland-wave's combines it with its own", () => {
  assert.equal(workerRevision(), WORKER_REVISION, `optiland: ${MOVED}`);
  const typescript = adapterRevision("engines/optiland/wavefrontEngine.ts").revision;
  // As wavefrontTransport combines them.
  assert.equal(sha256Hex(`${WORKER_REVISION}\n${typescript}`), OPTILAND_WAVE_REVISION, `optiland-wave: ${MOVED}`);
});

test("the restated worker revision is the worker's own", { skip: PYTHON_MISSING }, () => {
  const script =
    "import sys; sys.path.insert(0, sys.argv[1]); from lvrtc_optiland.identity import adapter_revision; print(adapter_revision())";
  const ran = spawnSync(PYTHON, ["-B", "-c", script, WORKERS], {
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    timeout: 60_000,
  });
  assert.equal(ran.status, 0, ran.stderr);
  assert.equal(ran.stdout.trim(), workerRevision());
});

test("the fingerprints of the engines whose code is this repository's are today's", () => {
  assert.equal(refFingerprint().fingerprint, FINGERPRINTS.ref, `ref: ${MOVED}`);
  assert.equal(refSeidelFingerprint().fingerprint, FINGERPRINTS["ref-seidel"], `ref-seidel: ${MOVED}`);
});
