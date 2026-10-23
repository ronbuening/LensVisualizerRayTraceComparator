// Suite-only process isolation, outside every optical engine's adapter-revision closure.
import { randomBytes } from "node:crypto";
import { renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fork } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";

import { engineStamp } from "../contract/engine.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import { deepFreeze } from "../contract/json.ts";
import { makeResult } from "../contract/result.ts";
import type { ResultEnvelope } from "../contract/result.ts";
import { EngineUnavailableError } from "../engines/adapter.ts";
import type { EngineAdapter } from "../engines/adapter.ts";
import { createEngineRegistry, engineTimeouts } from "../engines/registry.ts";
import type { EngineRegistry } from "../engines/registry.ts";
import { DEFAULT_ENGINE_TIMEOUTS } from "../engines/remote.ts";
import type { LoadedConfig } from "./config.ts";
import { UsageError } from "./usageError.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";
import type { OpticalCase } from "../contract/case.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { RunSpec } from "../contract/runSpec.ts";
import type { CaseResolution, CaseSources, LoadedRun, SourceAudit } from "./suite.ts";
import type { StoredAnswer, WirePlan } from "./poolProtocol.ts";
import { askEngine } from "./orchestrator.ts";
import { QUANTITIES } from "../quantities/index.ts";
import { createResultStore } from "./resultStore.ts";
import { createInputReader } from "./poolInputs.ts";
import type { PreparedInput } from "./poolInputs.ts";
import { profileAsync, profileSync } from "./profile.ts";
import type { PoolReply, PoolRequest } from "./poolProtocol.ts";

type Message = PoolRequest extends infer R ? (R extends PoolRequest ? Omit<R, "id"> : never) : never;

class PoolTaskError extends Error {}

/**
 * How much longer than an engine's own run wait a slot waits for a job before it kills the child. The child also
 * reads, validates, gzips and stages the answer, which no engine timeout covers; an engine that times out is still
 * ended by its own transport, as in a serial run.
 */
const SLOT_MARGIN_MS = 60_000;

class Slot {
  readonly child: ChildProcess;
  #next = 0;
  #calls: Promise<void> = Promise.resolve();
  #gone: Error | undefined;
  #pending: { resolve(reply: PoolReply): void; reject(error: Error): void } | undefined;
  readonly ended: Promise<void>;
  constructor() {
    this.child = fork(fileURLToPath(new URL("./poolWorker.ts", import.meta.url)), [], {
      execArgv: [],
      serialization: "advanced",
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    });
    this.child.on("error", (error) => this.#fail(error));
    this.child.on("message", (reply: PoolReply) => {
      if (reply.id !== this.#next || this.#pending === undefined) {
        this.#fail(new Error("pool worker sent an unexpected reply"));
        this.child.kill("SIGKILL");
        return;
      }
      this.#pending.resolve(reply);
      this.#pending = undefined;
    });
    this.ended = new Promise((resolve) => {
      this.child.once("close", () => {
        this.#fail(new Error("pool worker exited"));
        resolve();
      });
    });
  }
  #fail(error: Error): void {
    this.#gone ??= error;
    this.#pending?.reject(error);
    this.#pending = undefined;
  }
  alive(): boolean {
    return this.#gone === undefined;
  }
  call(message: Message, timeoutMs: number): Promise<PoolReply> {
    const answer = this.#calls.then(() => this.#call(message, timeoutMs));
    this.#calls = answer.then(
      () => {},
      () => {},
    );
    return answer;
  }
  async #call(message: Message, timeoutMs: number): Promise<PoolReply> {
    if (this.#gone !== undefined) throw this.#gone;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.child.kill("SIGKILL");
        this.#fail(new Error("pool worker timed out"));
      }, timeoutMs);
      this.#pending = {
        resolve: (reply) => {
          clearTimeout(timer);
          resolve(reply);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      };
      this.child.send({ ...message, id: ++this.#next }, (error) => {
        if (error !== null) {
          this.#fail(error);
          this.child.kill("SIGKILL");
        }
      });
    });
  }
  async close(): Promise<void> {
    try {
      await this.call({ method: "close" }, 15_000);
    } catch {
      this.child.kill("SIGKILL");
    }
    await this.ended;
  }
}

/**
 * A shared bounded pool, with no slot or engine replacement during a suite. Every replica negotiates its own
 * hello. Results are admitted in request order per engine: after a terminal transport failure, speculative later
 * replies are discarded, and subsequent requests fail as on the serial engine. Other engines continue.
 */
export interface PoolJobTicket {
  readonly previous: Promise<void>;
  readonly ready: Promise<void>;
  release(): void;
}
export interface StoredAdapter extends EngineAdapter {
  askStored?(
    request: QuantityRequest,
    opticalCase: OpticalCase,
    warnings: string[],
    ticket?: PoolJobTicket,
  ): Promise<StoredAnswer>;
}
export interface ProcessRegistry extends EngineRegistry {
  readonly sources: CaseSources;
  enqueue(engine: string): PoolJobTicket;
  warm(engines: readonly string[]): Promise<void>;
  planRun(
    run: LoadedRun,
    engines: readonly string[] | undefined,
    rungs: readonly string[] | undefined,
    retainSpecsFor: readonly string[],
  ): Promise<WirePlan>;
  close(): Promise<void>;
}
export function createProcessRegistry(loaded: Pick<LoadedConfig, "rootDir" | "config">, jobs: number): ProcessRegistry {
  if (!Number.isSafeInteger(jobs) || jobs < 1) throw new UsageError("--jobs must be a positive integer");
  const serial = createEngineRegistry(loaded);
  const slots: Slot[] = [];
  const idle: Slot[] = [];
  const waiting: ((slot: Slot) => void)[] = [];
  let owners = 0;
  let closed: Promise<void> | undefined;
  const acquire = async (): Promise<Slot> => {
    let free = idle.shift();
    while (free !== undefined && !free.alive()) free = idle.shift();
    if (free !== undefined) return free;
    if (slots.length < jobs) {
      const slot = new Slot();
      slots.push(slot);
      try {
        await profileAsync("startup.worker", () => slot.call({ method: "init", loaded }, 180_000));
      } catch {
        slot.child.kill("SIGKILL");
      }
      return slot;
    }
    if (slots.every((slot) => !slot.alive())) return slots[0];
    return new Promise((resolve) => waiting.push(resolve));
  };
  const use = async <T>(act: (slot: Slot) => Promise<T>): Promise<T> => {
    const slot = await acquire();
    try {
      return await act(slot);
    } finally {
      if (slot.alive()) {
        const next = waiting.shift();
        if (next === undefined) idle.push(slot);
        else next(slot);
      } else if (slots.every((candidate) => !candidate.alive())) {
        for (const next of waiting.splice(0)) next(slot);
      }
    }
  };
  // A native MTF can outlast many small ray jobs. Enough bounded on-disk staging lets those jobs fill the
  // other CPUs while admission waits; it retains no result arrays in the controller and survives child death.
  const maxBuffered = 32 * jobs;
  let buffered = 0;
  const buffering: (() => void)[] = [];
  const reserve = async (): Promise<void> => {
    if (buffered < maxBuffered) {
      buffered++;
      return;
    }
    await new Promise<void>((resolve) => buffering.push(resolve));
  };
  const unreserve = (): void => {
    const next = buffering.shift();
    if (next) next();
    else buffered--;
  };
  const orders = new Map<string, Promise<void>>();
  const enqueue = (engine: string): PoolJobTicket => {
    const previous = orders.get(engine) ?? Promise.resolve();
    let finish!: () => void;
    const ended = new Promise<void>((resolve) => {
      finish = resolve;
    });
    orders.set(
      engine,
      previous.then(() => ended),
    );
    const ready = reserve();
    let released = false;
    return {
      previous,
      ready,
      release: () => {
        if (released) return;
        released = true;
        finish();
        void ready.then(unreserve);
      },
    };
  };
  const prefix = `.pool-${process.pid}-${randomBytes(8).toString("hex")}`;
  let nextTemporary = 0;
  const temporaries = new Set<string>();
  const inputDirectory = join(loaded.config.runsDir, `${prefix}-inputs`);
  let nextInput = 0;
  const references = new WeakMap<QuantityRequest, PreparedInput>();
  const fallbackInputs = createInputReader();
  const storeDirectory = join(loaded.config.runsDir, "store");
  const audits: SourceAudit[] = [];
  const call = async (message: Message): Promise<PoolReply & { ok: true }> =>
    use(async (slot) => {
      const reply = await slot.call(message, 600_000);
      if (!reply.ok) throw new Error(reply.message);
      return reply;
    });
  const sources: CaseSources = Object.fromEntries(
    (["fixture", "lv"] as const).map((kind) => [
      kind,
      {
        expand: async (run: RunSpec) =>
          (await call({ method: "source", kind, action: "expand", run })).value as readonly RunSpec[],
        resolve: async (run: RunSpec) =>
          (await call({ method: "source", kind, action: "resolve", run })).value as CaseResolution,
        audit: () =>
          kind !== "lv" || audits.length === 0
            ? null
            : {
                fingerprint: audits[0].fingerprint,
                changed: [...new Set(audits.flatMap((audit) => audit.changed))].sort(),
              },
      },
    ]),
  );
  const removeTransient = (): void => {
    for (const file of temporaries) rmSync(file, { force: true });
    rmSync(inputDirectory, { force: true, recursive: true });
  };
  // An interrupted suite runs no finally block: end the children (their engine workers see their input close) and
  // remove the staged entries and prepared inputs, which can be gigabytes, then die of the signal as before.
  const onSignal = (signal: NodeJS.Signals): void => {
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    for (const slot of slots) slot.child.kill("SIGTERM");
    removeTransient();
    process.kill(process.pid, signal);
  };
  process.on("SIGINT", onSignal);
  process.on("SIGTERM", onSignal);
  const close = (): Promise<void> =>
    (closed ??= (async () => {
      try {
        const settled = await Promise.allSettled(
          slots.map(async (slot) => {
            try {
              if (slot.alive()) {
                const reply = await slot.call({ method: "audit" }, 30_000);
                if (reply.ok) {
                  const audit = (reply.value as { lv: SourceAudit | null }).lv;
                  if (audit) {
                    if (audits[0] && canonicalJson(audits[0].fingerprint) !== canonicalJson(audit.fingerprint))
                      throw new Error("pool case source identities differ");
                    audits.push(audit);
                  }
                }
              }
            } finally {
              await slot.close();
            }
          }),
        );
        const failure = settled.find((result) => result.status === "rejected");
        if (failure?.status === "rejected") throw failure.reason;
      } finally {
        process.off("SIGINT", onSignal);
        process.off("SIGTERM", onSignal);
        removeTransient();
      }
    })());
  return {
    sources,
    close,
    enqueue,
    // Warming is only a head start: a slot that is gone, or cannot warm, is found out by the jobs it is given.
    warm: async (engines) => {
      await Promise.all(
        slots
          .filter((slot) => slot.alive())
          .map((slot) => slot.call({ method: "warm", engines }, 30_000).catch(() => undefined)),
      );
    },
    planRun: async (run, engines, rungs, retainSpecsFor) => {
      const inputsFile = join(inputDirectory, `${++nextInput}.bin`);
      const plan = (await call({ method: "plan", run, engines, rungs, retainSpecsFor, inputsFile })).value as WirePlan;
      for (const [index, job] of plan.jobs.entries()) references.set(job.request, { file: inputsFile, index });
      return plan;
    },
    ids: () => serial.ids(),
    builtinIds: () => serial.builtinIds(),
    create: async (id): Promise<StoredAdapter> => {
      owners++;
      const timeouts = { ...DEFAULT_ENGINE_TIMEOUTS, ...engineTimeouts(loaded, id) };
      let handshake: Promise<EngineDescriptor> | undefined;
      let admission: Promise<void> = Promise.resolve();
      let broken = false;
      let closing: Promise<void> | undefined;
      const replicas = new Map<Slot, EngineDescriptor>();
      const describeOn = async (slot: Slot): Promise<EngineDescriptor> => {
        const known = replicas.get(slot);
        if (known !== undefined) return known;
        const reply = await slot.call({ method: "describe", engine: id }, timeouts.helloMs + 5_000);
        if (!reply.ok) throw new EngineUnavailableError(id, reply.code ?? "hello-failed", reply.message);
        const descriptor = deepFreeze(reply.value as EngineDescriptor);
        replicas.set(slot, descriptor);
        return descriptor;
      };
      const describe = (): Promise<EngineDescriptor> =>
        (handshake ??= use(describeOn).catch((error: unknown) => {
          if (error instanceof EngineUnavailableError) throw error;
          throw new EngineUnavailableError(id, "hello-failed", error instanceof Error ? error.message : String(error));
        }));
      const definition = loaded.config.engineDefinitions[id];
      const persistent =
        definition === undefined ? ["optiland", "optiland-wave"].includes(id) : definition.transport === "stdio";
      return {
        id,
        describe,
        askStored: async (request, opticalCase, warnings, ticket) => {
          const descriptor = await describe();
          const failed = (message: string): StoredAnswer => ({
            result: makeResult(request, engineStamp(descriptor.identity), {
              status: "error",
              error: { code: "transport-error", message },
            }),
            storeKey: null,
            source: "computed",
          });
          const previous = ticket?.previous ?? admission;
          let admitted = false;
          let release = () => {};
          if (ticket === undefined) {
            admission = new Promise<void>((resolve) => {
              release = resolve;
            });
            await reserve();
          } else await ticket.ready;
          const temporary = join(storeDirectory, `${prefix}-${++nextTemporary}.tmp`);
          temporaries.add(temporary);
          try {
            const computed = await use(async (slot) => {
              const replica = broken ? descriptor : await describeOn(slot);
              if (canonicalJson(replica) !== canonicalJson(descriptor))
                throw new Error(`engine ${id}: pool identities differ`);
              const reply = await slot.call(
                {
                  method: "ask",
                  engine: id,
                  descriptor,
                  broken,
                  temporary,
                  ...(references.has(request) ? { prepared: references.get(request)! } : { request, opticalCase }),
                },
                timeouts.runMs + SLOT_MARGIN_MS,
              );
              if (!reply.ok) throw new PoolTaskError(reply.message);
              return { value: reply.value as { answer: StoredAnswer; warnings: readonly string[] } };
            });
            const {
              value: { answer, warnings: said },
            } = computed;
            await previous;
            const keep = !broken || answer.source !== "computed";
            if (persistent && ["transport-error", "transport-timeout"].includes(answer.result.error?.code ?? ""))
              broken = true;
            admitted = true;
            release();
            if (keep && answer.source === "computed" && answer.storeKey !== null) {
              profileSync("store.publish", () =>
                renameSync(temporary, join(storeDirectory, `${answer.storeKey}.json.gz`)),
              );
            }
            if (!keep) return failed("the worker is gone");
            warnings.push(...said);
            return answer;
          } catch (error) {
            if (admitted || error instanceof PoolTaskError) throw error;
            await previous;
            broken = true;
            const message = error instanceof Error ? error.message : String(error);
            // Losing the last CPU slot must not turn already stored answers into transport errors.
            if (slots.every((slot) => !slot.alive())) {
              const actual = fallbackInputs(
                references.has(request) ? { prepared: references.get(request)! } : { request, opticalCase },
              );
              return askEngine({
                descriptor,
                ...actual,
                quantity: QUANTITIES.get(request.quantity)!,
                store: createResultStore(storeDirectory),
                warnings,
                adapter: {
                  id,
                  describe: async () => descriptor,
                  close: async () => {},
                  run: async (asked) =>
                    makeResult(asked, engineStamp(descriptor.identity), {
                      status: "error",
                      error: { code: "transport-error", message },
                    }),
                },
              });
            }
            return failed(message);
          } finally {
            if (ticket === undefined) {
              release();
              unreserve();
            }
            rmSync(temporary, { force: true });
          }
        },
        run: async (request, opticalCase) => {
          const descriptor = await describe();
          const failed = (message: string): ResultEnvelope =>
            makeResult(request, engineStamp(descriptor.identity), {
              status: "error",
              error: { code: "transport-error", message },
            });
          // Start now, but settle in submission order, independently of the order the slots answer in.
          const previous = admission;
          const computed = broken
            ? Promise.resolve(failed("the worker is gone"))
            : use(async (slot) => {
                if (broken) return failed("the worker is gone");
                const replica = await describeOn(slot);
                if (broken) return failed("the worker is gone");
                if (canonicalJson(replica) !== canonicalJson(descriptor))
                  throw new Error(`engine ${id}: pool identities differ`);
                const reply = await slot.call(
                  {
                    method: "run",
                    engine: id,
                    ...(references.has(request) ? { prepared: references.get(request)! } : { request, opticalCase }),
                  },
                  timeouts.runMs + SLOT_MARGIN_MS,
                );
                if (!reply.ok) throw new Error(reply.message);
                return deepFreeze(reply.value as ResultEnvelope);
              });
          // Attach a rejection handler immediately, including while an earlier request is still running.
          const settled = computed.then(
            (result) => ({ result, lost: false }),
            (error: unknown) => ({
              result: failed(error instanceof Error ? error.message : String(error)),
              lost: true,
            }),
          );
          const admitted = previous.then(async () => {
            const { result, lost } = await settled;
            if (broken) return failed("the worker is gone");
            if (lost || (persistent && ["transport-error", "transport-timeout"].includes(result.error?.code ?? "")))
              broken = true;
            return result;
          });
          admission = admitted.then(() => undefined);
          return admitted;
        },
        close: () =>
          (closing ??= (async () => {
            if (--owners === 0) await close();
          })()),
      };
    },
  };
}
