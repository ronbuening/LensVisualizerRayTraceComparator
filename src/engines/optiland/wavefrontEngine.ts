// A comparator adapter with a worker-owned lifetime. Raw wavefronts come through the ordinary validated
// optiland adapter; the pure comparator estimators run in TypeScript: the wave OTF for `mtf.native` (rung R6c) and the
// Zernike fit for `zernike.native` (rung R14b). Existing engine closures stay unchanged.
import type { EngineDescriptor } from "../../contract/engine.ts";
import { engineStamp } from "../../contract/engine.ts";
import { MTF_NATIVE, MTF_NATIVE_VERSION } from "../../contract/quantities/mtfNative.ts";
import type { MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import { WAVEFRONT_NATIVE } from "../../contract/quantities/wavefrontNative.ts";
import type { WavefrontNativeData, WavefrontNativeSpec } from "../../contract/quantities/wavefrontNative.ts";
import { ZERNIKE_NATIVE, ZERNIKE_NATIVE_VERSION } from "../../contract/quantities/zernikeNative.ts";
import type { ZernikeNativeSpec } from "../../contract/quantities/zernikeNative.ts";
import type { OpticalCase } from "../../contract/case.ts";
import type { QuantityRequest } from "../../contract/request.ts";
import type { ResultEnvelope } from "../../contract/result.ts";
import { makeRequest } from "../../contract/request.ts";
import { makeResult } from "../../contract/result.ts";
import type { LoadedConfig } from "../../core/config.ts";
import { negotiate } from "../../core/negotiate.ts";
import { sha256Hex } from "../../core/numeric/hash.ts";
import { decodeNdArray } from "../../core/numeric/ndarray.ts";
import { mtfNativeQuantity } from "../../quantities/mtfNative.ts";
import { wavefrontNativeQuantity } from "../../quantities/wavefrontNative.ts";
import { zernikeNativeQuantity } from "../../quantities/zernikeNative.ts";
import { createStdioTransport, workerEnvironment } from "../../transports/stdio.ts";
import type { Transport } from "../../transports/transport.ts";
import { adapterRevision } from "../adapterRevision.ts";
import { createProtocolHandler } from "../protocolHandler.ts";
import { RemoteEngineAdapter } from "../remote.ts";
import { OPTILAND_TIMEOUTS, optilandDefinition } from "./definition.ts";
import { polychromaticWavefrontMtf, wavefrontMtf } from "./wavefrontMtf.ts";
import { wavefrontZernike } from "./wavefrontZernike.ts";

export const OPTILAND_WAVE_ENGINE_ID = "optiland-wave";

/** How far from the case's image plane the centre of a reference sphere may be, mm: the worker's own limit. */
const IMAGE_PLANE_MM = 1e-9;

/** The wrapper is also used with stand-in transports in hermetic tests. */
export function wavefrontTransport(transport: Transport): Transport {
  const source = new RemoteEngineAdapter({ id: "optiland", transport, timeouts: OPTILAND_TIMEOUTS });
  let handler: ReturnType<typeof createProtocolHandler> | undefined;
  let closed = false;
  return {
    kind: "in-process",
    open: async () => {
      if (closed) throw new Error("optiland-wave transport is closed");
      const native = await source.describe();
      const revision = adapterRevision("engines/optiland/wavefrontEngine.ts").revision;
      const descriptor: EngineDescriptor = {
        ...native,
        identity: {
          ...native.identity,
          id: OPTILAND_WAVE_ENGINE_ID,
          adapterRevision: sha256Hex(`${native.identity.adapterRevision ?? ""}\n${revision}`),
        },
        capabilities: {
          ...native.capabilities,
          quantities: {
            [MTF_NATIVE]: { version: MTF_NATIVE_VERSION },
            [ZERNIKE_NATIVE]: { version: ZERNIKE_NATIVE_VERSION },
          },
        },
      };
      handler = createProtocolHandler({
        descriptor,
        run: async (request, opticalCase) => {
          const stamp = engineStamp(descriptor.identity);
          if (request.quantity === ZERNIKE_NATIVE) return zernikeOf(source, native, request, opticalCase, stamp);
          const spec = request.spec as MtfNativeSpec;
          if (
            request.quantity !== MTF_NATIVE ||
            spec.method !== "diffraction" ||
            spec.focus !== "design" ||
            spec.profile !== undefined
          ) {
            return makeResult(request, stamp, {
              status: "unsupported",
              unsupported: [
                {
                  code: "quantity",
                  item: request.quantity,
                  message: "the adapter answers unprofiled design-plane diffraction only",
                },
              ],
            });
          }
          const specIssues = mtfNativeQuantity.validateSpec(spec);
          if (specIssues.length > 0)
            return makeResult(request, stamp, {
              status: "error",
              error: {
                code: "bad-spec",
                message: JSON.stringify(specIssues),
              },
            });
          const grids = request.engineOptions?.wavefrontGrids ?? [128, 256];
          const lines: WavefrontNativeData[] = [];
          for (const [line, expected] of opticalCase.conditions.lines.entries()) {
            const rawSpec: WavefrontNativeSpec = { fields: spec.fields, line, grids: grids as number[] };
            const problems = wavefrontNativeQuantity.validateSpec(rawSpec);
            if (problems.length > 0)
              return makeResult(request, stamp, {
                status: "error",
                error: { code: "bad-spec", message: JSON.stringify(problems) },
              });
            const raw = makeRequest({
              caseId: request.caseId,
              quantity: WAVEFRONT_NATIVE,
              spec: rawSpec,
              ...(request.engineOptions === undefined ? {} : { engineOptions: request.engineOptions }),
            });
            const negotiation = negotiate(opticalCase, raw, native, wavefrontNativeQuantity.version);
            if (negotiation.length > 0)
              return makeResult(request, stamp, { status: "unsupported", unsupported: negotiation });
            const result = await source.run(raw, opticalCase);
            if (result.status !== "ok")
              return makeResult(request, stamp, {
                ...result,
                ...(result.error === undefined
                  ? {}
                  : { error: { ...result.error, message: `line ${line}: ${result.error.message}` } }),
                ...(result.unsupported === undefined
                  ? {}
                  : {
                      unsupported: result.unsupported.map((item) => ({
                        ...item,
                        message: `line ${line}: ${item.message}`,
                      })),
                    }),
              });
            const issues = wavefrontNativeQuantity.validateData(result.data);
            if (issues.length > 0)
              return makeResult(request, stamp, {
                status: "error",
                error: { code: "invalid-wavefront", message: JSON.stringify(issues) },
              });
            const data = result.data as WavefrontNativeData;
            const indices = decodeNdArray(opticalCase.conditions.indexAfterSurface).values;
            const angleValues =
              spec.fields.kind === "angles-deg" ? spec.fields.values : request.engineOptions?.fieldAnglesDeg;
            if (
              data.fields.length !== spec.fields.values.length ||
              data.fields.some((field, i) => field.field !== spec.fields.values[i]) ||
              data.line.index !== line ||
              data.line.wavelengthNm !== expected.wavelengthNm ||
              data.line.weight !== expected.weight ||
              data.line.imageIndex !== indices[(line + 1) * opticalCase.system.surfaces.length - 1] ||
              !Array.isArray(angleValues) ||
              data.fields.some((field, i) => field.fieldAngleDeg !== angleValues[i]) ||
              data.fields.some((field) =>
                field.samples.some(
                  // The worker's own tolerance on the chief landing's plane (`IMAGE_PLANE_TOLERANCE_MM`): optiland
                  // lands a ray on a plane by z + (-z / N) N, which need not be the plane's z to the last bit.
                  (sample) =>
                    !(Math.abs(sample.reference.sphereCenterMm[2] - opticalCase.conditions.imageZ) <= IMAGE_PLANE_MM),
                ),
              ) ||
              data.fields.some(
                (field) => field.status === "ok" && String(field.samples.map((s) => s.gridSize)) !== String(grids),
              )
            ) {
              return makeResult(request, stamp, {
                status: "error",
                error: {
                  code: "wavefront-request-mismatch",
                  message: `line ${line}: the wavefront answers other fields, grids or line`,
                },
              });
            }
            lines.push(data);
          }
          const mtf = lines.length === 1 ? wavefrontMtf(lines[0], spec) : polychromaticWavefrontMtf(lines, spec);
          return makeResult(request, stamp, { status: "ok", data: mtf, method: mtf.method });
        },
      });
    },
    call: async (message) => {
      if (handler === undefined) throw new Error("optiland-wave transport is not open");
      return handler(message);
    },
    close: async () => {
      closed = true;
      handler = undefined;
      await source.close();
    },
  };
}

/**
 * `zernike.native` of the comparator's estimator on optiland's raw wavefront: one `wavefront.native` request of the
 * spec's line, angles and grid to the worker, its answer validated and held to what was asked (its line, fields and
 * grid, each sphere's centre on the case's image plane), then `wavefrontZernike`. A spec that is not the quantity's is
 * `bad-spec`; a refusal or an error of the worker is passed on with its line named.
 */
async function zernikeOf(
  source: RemoteEngineAdapter,
  native: EngineDescriptor,
  request: QuantityRequest,
  opticalCase: OpticalCase,
  stamp: ResultEnvelope["engine"],
): Promise<ResultEnvelope> {
  const issues = zernikeNativeQuantity.validateSpec(request.spec);
  if (issues.length > 0)
    return makeResult(request, stamp, {
      status: "error",
      error: { code: "bad-spec", message: JSON.stringify(issues) },
    });
  const spec = request.spec as ZernikeNativeSpec;
  const rawSpec: WavefrontNativeSpec = {
    line: spec.line,
    fields: { kind: "angles-deg", values: spec.fieldAnglesDeg },
    grids: [spec.grid],
  };
  const raw = makeRequest({
    caseId: request.caseId,
    quantity: WAVEFRONT_NATIVE,
    spec: rawSpec,
    ...(request.engineOptions === undefined ? {} : { engineOptions: request.engineOptions }),
  });
  const negotiation = negotiate(opticalCase, raw, native, wavefrontNativeQuantity.version);
  if (negotiation.length > 0) return makeResult(request, stamp, { status: "unsupported", unsupported: negotiation });
  const result = await source.run(raw, opticalCase);
  if (result.status !== "ok") {
    return makeResult(request, stamp, {
      ...result,
      ...(result.error === undefined
        ? {}
        : { error: { ...result.error, message: `line ${spec.line}: ${result.error.message}` } }),
      ...(result.unsupported === undefined
        ? {}
        : {
            unsupported: result.unsupported.map((item) => ({ ...item, message: `line ${spec.line}: ${item.message}` })),
          }),
    });
  }
  const problems = wavefrontNativeQuantity.validateData(result.data);
  if (problems.length > 0)
    return makeResult(request, stamp, {
      status: "error",
      error: { code: "invalid-wavefront", message: JSON.stringify(problems) },
    });
  const data = result.data as WavefrontNativeData;
  const expected = opticalCase.conditions.lines[spec.line];
  if (
    data.line.index !== spec.line ||
    data.line.wavelengthNm !== expected.wavelengthNm ||
    data.fields.length !== spec.fieldAnglesDeg.length ||
    data.fields.some((field, at) => field.fieldAngleDeg !== spec.fieldAnglesDeg[at]) ||
    data.fields.some(
      (field) => field.status === "ok" && String(field.samples.map((s) => s.gridSize)) !== String([spec.grid]),
    ) ||
    data.fields.some((field) =>
      field.samples.some(
        (sample) => !(Math.abs(sample.reference.sphereCenterMm[2] - opticalCase.conditions.imageZ) <= IMAGE_PLANE_MM),
      ),
    )
  ) {
    return makeResult(request, stamp, {
      status: "error",
      error: {
        code: "wavefront-request-mismatch",
        message: `line ${spec.line}: the wavefront answers other fields, grids or line`,
      },
    });
  }
  const zernike = wavefrontZernike(data, spec);
  return makeResult(request, stamp, { status: "ok", data: zernike, method: zernike.method });
}

export function optilandWaveTransport(loaded: Pick<LoadedConfig, "rootDir" | "config">): Transport {
  const definition = optilandDefinition(loaded);
  if (definition.transport !== "stdio") throw new Error("optiland's built-in worker must use stdio");
  return wavefrontTransport(
    createStdioTransport({
      command: definition.command,
      cwd: loaded.rootDir,
      env: workerEnvironment(process.env, definition.options, definition.env),
    }),
  );
}
