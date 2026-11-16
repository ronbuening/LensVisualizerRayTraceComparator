// The migration guard: today's adapter revisions of every built-in engine, and the fingerprints of the engines whose
// code is this repository's, pinned in full. The result store keys an answer by them, and the committed baselines
// record them (benchmark.json and benchmark.mtf.json hold lv, optiland and, under the ids they had before Stage 9.8,
// the reference tracer, the replay, the wave estimate and the OTF of optiland's wavefront). A move here means the code
// closure of an engine changed: its stored answers are computed again and its baseline records are out of date.
// Stage 9.8 renamed the six engines this tool builds (ref, ref-seidel, replay, wave, flux, optiland-wave), and each
// moved by its own id constant, as did the fingerprints of the reference tracer and the reference Seidel sums (which
// hash their source directories); lv's and optiland's did not. That evidence is kept as it was measured, in columns of
// its own (the revision at the rename, and before it), apart from today's, which the first tests hold: a later change
// moves today's pins only. The adoption of LensVisualizer 420b47555 (curved image surfaces, LV #960) moved lv,
// replay-of-lv-mtf, wave-mtf-of-lv-rays and flux-of-lv-rays (spot.ts, exportCase.ts, exportProblems.ts, binding.ts and
// vignettingFields.ts are in each of their closures); the adoption of optiland a9e544a2 moved the worker's revision,
// optiland's and the Python half of otf-of-optiland-wavefront's; the adoption of LensVisualizer f5b456fec (the MTF
// audit, LV #988, and sodium-D references, LV #965) moved lv, replay-of-lv-mtf, wave-mtf-of-lv-rays and
// flux-of-lv-rays again (manifest.ts, tabRequest.ts, focus.ts, mtf.ts, axialZones.ts, axial.ts, chief.ts,
// curvature.ts, curvatureFields.ts, exportAperture.ts and exportProblems.ts are in all four closures, replay.ts in the
// replay's). Pin anew only for a change meant to move a revision, and say so in the commit.
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
  "date; pin today's revision anew only for a change meant to move it, and say so in the commit";

/** The module the TypeScript part of otf-of-optiland-wavefront's revision starts from. */
const OPTILAND_WAVE_MODULE = "engines/optiland/wavefrontEngine.ts";

/** An engine's adapter revision today, and the evidence of the engine rename of Stage 9.8, kept as it was measured. */
interface Pinned {
  /** The TypeScript module the revision starts from. */
  readonly module: string;
  /** Today's revision, which the first test holds. */
  readonly today: string;
  /** The revision the engine rename of Stage 9.8 left (`f394268`). */
  readonly atRename: string;
  /** The revision before the rename: the one the committed baselines record until the maintainer's refresh. */
  readonly beforeRename: string;
}

/**
 * The adapter revisions of today, by engine, of the TypeScript modules they start from, each beside the revision the
 * engine rename of Stage 9.8 left and the one it had before (lv's the same at both).
 */
const ADAPTER_REVISIONS: Readonly<Record<string, Pinned>> = {
  lv: {
    module: LV_ENGINE_MODULE,
    today: "674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a",
    atRename: "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5",
    beforeRename: "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5",
  },
  "reference-tracer": {
    module: REF_ENGINE_MODULE,
    today: "49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117",
    atRename: "49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117",
    beforeRename: "2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357",
  },
  "replay-of-lv-mtf": {
    module: LV_REPLAY_ENGINE_MODULE,
    today: "0f8e411dfa360a2b0db6a309e23b72c9122dd416d48e2b7c8037a2d8e713674b",
    atRename: "6f0c41d6724506c0039cbda51bb3d3eba51eeb667b0654a5d47246e1ee0349d7",
    beforeRename: "99024448fdb11f7eb293d0e54cf8281dc5272c57c468beeb30d66bb53ecf3409",
  },
  "wave-mtf-of-lv-rays": {
    module: LV_WAVE_ENGINE_MODULE,
    today: "5541b54d966ebed6bf0c0a6b17a2782bf81134a0e7dacdaeb8936b822b91a36b",
    atRename: "8a272b3a3d8efb701c1227738ece2c40e753e5c2efcc7bee68f1f3e14a22d14c",
    beforeRename: "956fcaf5a64e0a0873c6514edd117b9d5002f92623e4f05f6c06faa409926182",
  },
  "flux-of-lv-rays": {
    module: LV_FLUX_ENGINE_MODULE,
    today: "30c7115b0041e460fa43bdbcf75bfa0f9f4774e15d14ee79057709695aff88de",
    atRename: "6ecb3bb3f39951e6c1d5ed314ae1bbf84bdc2ba0ce0a986d75caf0e7a378db56",
    beforeRename: "973a417397ef718c252acf3df77fa746782fa17b20b4f22373171e8295ccba58",
  },
  "reference-seidel": {
    module: REF_SEIDEL_ENGINE_MODULE,
    today: "c847050f84aaebc7c882ee558c083a92dadbc65329d13b8bf5bd2c83949dbe32",
    atRename: "c847050f84aaebc7c882ee558c083a92dadbc65329d13b8bf5bd2c83949dbe32",
    beforeRename: "03133c53f44f6447bb439ce5b5f93a35904efdcf1679e52bad425882d025f6cc",
  },
  // The TypeScript part of otf-of-optiland-wavefront's revision; the whole is this combined with the worker's (below).
  "otf-of-optiland-wavefront (TypeScript)": {
    module: OPTILAND_WAVE_MODULE,
    today: "501c2a99038a4076512a4bf437a97674c403c832f3ae38ce6784bef67ab976a0",
    atRename: "501c2a99038a4076512a4bf437a97674c403c832f3ae38ce6784bef67ab976a0",
    beforeRename: "4d547ec4020250ea5d9f978249f20b654ce9d6f91746e2aa37234b48898e75f9",
  },
};

/** The optiland worker's adapter revision of today: optiland's, and the Python half of otf-of-optiland-wavefront's. */
const WORKER_REVISION = "59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853";
/** The worker's revision at the engine rename, and before it: no file of the worker moved for the rename. */
const WORKER_REVISION_AT_RENAME = "98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb";
const WORKER_REVISION_BEFORE_RENAME = "98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb";
/** otf-of-optiland-wavefront's adapter revision of today: the worker's and the TypeScript closure's. */
const OPTILAND_WAVE_REVISION = "3dc91d1a8ac19708f0460a1d5c1c564068891eaaad84b05dd1914e98637e10aa";
/** otf-of-optiland-wavefront's adapter revision at the engine rename. */
const OPTILAND_WAVE_REVISION_AT_RENAME = "9cdfad1afca8def499bfb1e4a66cdb35d08ba5295c0275ea81c036669af6160f";
/** optiland-wave's adapter revision as the committed baselines record it, before the engine rename. */
const OPTILAND_WAVE_REVISION_BEFORE = "f6e596a0a856e4c27449919d31e73b446c909add6809cbfdfbdf8ae6718b818f";

/**
 * The fingerprints of the engines whose code is this repository's own (lv's, replay's, wave's, flux's are
 * LensVisualizer's), today, at the engine rename and before it: each hashes its source directory, the id constant
 * included.
 */
const FINGERPRINTS = {
  "reference-tracer": {
    today: "1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3",
    atRename: "1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3",
    beforeRename: "b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e",
  },
  "reference-seidel": {
    today: "0b0d10279991780a3aee74bed1bf3b8c856eed2a44d0201645e79d6ff33ea63c",
    atRename: "0b0d10279991780a3aee74bed1bf3b8c856eed2a44d0201645e79d6ff33ea63c",
    beforeRename: "51ad78e8ecb40277d4bc35183a5112f12d866459cd737be3735f2ca582a49d8c",
  },
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
    .filter(([, { module, today }]) => adapterRevision(module).revision !== today)
    .map(([engine, { module }]) => `${engine} is ${adapterRevision(module).revision}`);
  assert.deepEqual(moved, [], MOVED);
});

test("the engine rename moved exactly the six renamed engines, each by its own id, and never lv or optiland", () => {
  // The rename's evidence, as measured at Stage 9.8: lv's revision the same at it and before it (Stage 9.6's pin).
  assert.equal(ADAPTER_REVISIONS.lv.atRename, "afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5");
  const movedBy = Object.entries(ADAPTER_REVISIONS)
    .filter(([, { atRename, beforeRename }]) => atRename !== beforeRename)
    .map(([engine]) => engine.replace(" (TypeScript)", ""))
    .sort();
  assert.deepEqual(movedBy, Object.values(LEGACY_ENGINE_IDS).sort());
  assert.equal(WORKER_REVISION_AT_RENAME, WORKER_REVISION_BEFORE_RENAME);
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
  assert.notEqual(OPTILAND_WAVE_REVISION_AT_RENAME, OPTILAND_WAVE_REVISION_BEFORE);
  // The recorded history of otf-of-optiland-wavefront holds together: at the rename and before it, its revision is the
  // worker's of then combined with its TypeScript closure's of then, as wavefrontTransport combines them today.
  const typescript = ADAPTER_REVISIONS["otf-of-optiland-wavefront (TypeScript)"];
  assert.equal(sha256Hex(`${WORKER_REVISION_AT_RENAME}\n${typescript.atRename}`), OPTILAND_WAVE_REVISION_AT_RENAME);
  assert.equal(
    sha256Hex(`${WORKER_REVISION_BEFORE_RENAME}\n${typescript.beforeRename}`),
    OPTILAND_WAVE_REVISION_BEFORE,
  );
  for (const { atRename, beforeRename } of Object.values(FINGERPRINTS)) assert.notEqual(atRename, beforeRename);
});

test("the optiland worker's adapter revision is today's, and otf-of-optiland-wavefront's combines it with its own", () => {
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
  assert.equal(refFingerprint().fingerprint, FINGERPRINTS["reference-tracer"].today, `reference-tracer: ${MOVED}`);
  assert.equal(
    refSeidelFingerprint().fingerprint,
    FINGERPRINTS["reference-seidel"].today,
    `reference-seidel: ${MOVED}`,
  );
});
