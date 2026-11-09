// The migration guard: today's adapter revisions of every built-in engine, and the fingerprints of the engines whose
// code is this repository's, pinned in full. The result store keys an answer by them, and the committed baselines
// record them (benchmark.json and benchmark.mtf.json hold lv, optiland and, under the ids they had before Stage 9.8,
// the reference tracer, the replay, the wave estimate and the OTF of optiland's wavefront). A move here means the code
// closure of an engine changed: its stored answers are computed again and its baseline records are out of date.
// Stage 9.8 renamed the six engines this tool builds (ref, ref-seidel, replay, wave, flux, optiland-wave), and each
// moved by its own id constant, as did the fingerprints of the reference tracer and the reference Seidel sums (which
// hash their source directories); lv's and optiland's did not, and are pinned as they were before the rename (Stage
// 9.6). Pin anew only for a change meant to move a revision, and say so in the commit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { LEGACY_ENGINE_IDS } from "../../src/core/legacyIds.ts";
import { LV_FLUX_ENGINE_ID, LV_FLUX_ENGINE_MODULE } from "../../src/engines/lv/fluxEngine.ts";
import { LV_REPLAY_ENGINE_ID, LV_REPLAY_ENGINE_MODULE } from "../../src/engines/lv/replayEngine.ts";
import { LV_WAVE_ENGINE_ID, LV_WAVE_ENGINE_MODULE } from "../../src/engines/lv/waveEngine.ts";
import { OPTILAND_WAVE_ENGINE_ID } from "../../src/engines/optiland/wavefrontEngine.ts";
import { REF_ENGINE_ID, REF_ENGINE_MODULE } from "../../src/engines/ref/engine.ts";
import { refFingerprint } from "../../src/engines/ref/fingerprint.ts";
import {
  REF_SEIDEL_ENGINE_ID,
  REF_SEIDEL_ENGINE_MODULE,
  refSeidelFingerprint,
} from "../../src/engines/refSeidel/engine.ts";
import { PYTHON, PYTHON_MISSING } from "../engines/support.ts";

const MOVED =
  "an engine's code closure changed, so its stored answers are computed again and its baseline records go out of " +
  "date; the engine rename of Stage 9.8 moved exactly the six renamed engines, never lv or optiland";

/** The module the TypeScript part of otf-of-optiland-wavefront's revision starts from. */
const OPTILAND_WAVE_MODULE = "engines/optiland/wavefrontEngine.ts";

/**
 * The adapter revisions of today, by engine, of the TypeScript modules they start from, each beside the revision it
 * had before the engine rename of Stage 9.8 (the one the committed baselines record): lv's is the same.
 */
const ADAPTER_REVISIONS: Readonly<Record<string, readonly [module: string, revision: string, before: string]>> = {
  lv: [
    LV_ENGINE_MODULE,
    "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5",
    "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5",
  ],
  "reference-tracer": [
    REF_ENGINE_MODULE,
    "49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117",
    "2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357",
  ],
  "replay-of-lv-mtf": [
    LV_REPLAY_ENGINE_MODULE,
    "6f0c41d6724506c0039cbda51bb3d3eba51eeb667b0654a5d47246e1ee0349d7",
    "99024448fdb11f7eb293d0e54cf8281dc5272c57c468beeb30d66bb53ecf3409",
  ],
  "wave-mtf-of-lv-rays": [
    LV_WAVE_ENGINE_MODULE,
    "8a272b3a3d8efb701c1227738ece2c40e753e5c2efcc7bee68f1f3e14a22d14c",
    "956fcaf5a64e0a0873c6514edd117b9d5002f92623e4f05f6c06faa409926182",
  ],
  "flux-of-lv-rays": [
    LV_FLUX_ENGINE_MODULE,
    "6ecb3bb3f39951e6c1d5ed314ae1bbf84bdc2ba0ce0a986d75caf0e7a378db56",
    "973a417397ef718c252acf3df77fa746782fa17b20b4f22373171e8295ccba58",
  ],
  "reference-seidel": [
    REF_SEIDEL_ENGINE_MODULE,
    "c847050f84aaebc7c882ee558c083a92dadbc65329d13b8bf5bd2c83949dbe32",
    "03133c53f44f6447bb439ce5b5f93a35904efdcf1679e52bad425882d025f6cc",
  ],
  // The TypeScript part of otf-of-optiland-wavefront's revision; the whole is this combined with the worker's (below).
  "otf-of-optiland-wavefront (TypeScript)": [
    OPTILAND_WAVE_MODULE,
    "501c2a99038a4076512a4bf437a97674c403c832f3ae38ce6784bef67ab976a0",
    "4d547ec4020250ea5d9f978249f20b654ce9d6f91746e2aa37234b48898e75f9",
  ],
};

/**
 * The optiland worker's adapter revision of today: optiland's, and the Python half of otf-of-optiland-wavefront's. The
 * same as before the engine rename: no file of the worker moved.
 */
const WORKER_REVISION = "98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb";
/** otf-of-optiland-wavefront's adapter revision: the worker's and the TypeScript closure's. */
const OPTILAND_WAVE_REVISION = "9cdfad1afca8def499bfb1e4a66cdb35d08ba5295c0275ea81c036669af6160f";
/** optiland-wave's adapter revision as the committed baselines record it, before the engine rename. */
const OPTILAND_WAVE_REVISION_BEFORE = "f6e596a0a856e4c27449919d31e73b446c909add6809cbfdfbdf8ae6718b818f";

/**
 * The fingerprints of the engines whose code is this repository's own (lv's, replay's, wave's, flux's are
 * LensVisualizer's), today and before the engine rename: each hashes its source directory, the id constant included.
 */
const FINGERPRINTS = {
  "reference-tracer": [
    "1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3",
    "b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e",
  ],
  "reference-seidel": [
    "0b0d10279991780a3aee74bed1bf3b8c856eed2a44d0201645e79d6ff33ea63c",
    "51ad78e8ecb40277d4bc35183a5112f12d866459cd737be3735f2ca582a49d8c",
  ],
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
  const moved = Object.entries(ADAPTER_REVISIONS)
    .filter(([, [module, revision]]) => adapterRevision(module).revision !== revision)
    .map(([engine, [module]]) => `${engine} is ${adapterRevision(module).revision}`);
  assert.deepEqual(moved, [], MOVED);
});

test("the engine rename moved exactly the six renamed engines, each by its own id, and never lv or optiland", () => {
  // lv's revision is pinned as before the rename, literally (Stage 9.6's pin).
  assert.equal(
    adapterRevision(LV_ENGINE_MODULE).revision,
    "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5",
  );
  const movedBy = Object.entries(ADAPTER_REVISIONS)
    .filter(([, [, revision, before]]) => revision !== before)
    .map(([engine]) => engine.replace(" (TypeScript)", ""))
    .sort();
  assert.deepEqual(movedBy, Object.values(LEGACY_ENGINE_IDS).sort());
  // Each renamed engine's id constant is its id of today, its old id the map's.
  const constants: Readonly<Record<string, string>> = {
    ref: REF_ENGINE_ID,
    "ref-seidel": REF_SEIDEL_ENGINE_ID,
    replay: LV_REPLAY_ENGINE_ID,
    wave: LV_WAVE_ENGINE_ID,
    flux: LV_FLUX_ENGINE_ID,
    "optiland-wave": OPTILAND_WAVE_ENGINE_ID,
  };
  assert.deepEqual(constants, LEGACY_ENGINE_IDS);
  assert.notEqual(OPTILAND_WAVE_REVISION, OPTILAND_WAVE_REVISION_BEFORE);
  for (const [today, before] of Object.values(FINGERPRINTS)) assert.notEqual(today, before);
});

test("the optiland worker's adapter revision is today's, and otf-of-optiland-wavefront's combines it with its own", () => {
  // optiland's revision is pinned as before the rename, literally (Stage 9.6's pin).
  assert.equal(
    workerRevision(),
    "98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb",
    `optiland: ${MOVED}`,
  );
  assert.equal(workerRevision(), WORKER_REVISION, `optiland: ${MOVED}`);
  const typescript = adapterRevision(OPTILAND_WAVE_MODULE).revision;
  // As wavefrontTransport combines them.
  assert.equal(
    sha256Hex(`${WORKER_REVISION}\n${typescript}`),
    OPTILAND_WAVE_REVISION,
    `otf-of-optiland-wavefront: ${MOVED}`,
  );
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
  assert.equal(refFingerprint().fingerprint, FINGERPRINTS["reference-tracer"][0], `reference-tracer: ${MOVED}`);
  assert.equal(refSeidelFingerprint().fingerprint, FINGERPRINTS["reference-seidel"][0], `reference-seidel: ${MOVED}`);
});
