// A pool slot owns one configuration, one LV tree, and one adapter per engine for its entire lifetime.
import { engineStamp } from "../contract/engine.ts";
import { makeResult } from "../contract/result.ts";
import type { EngineAdapter } from "../engines/adapter.ts";
import { EngineUnavailableError } from "../engines/adapter.ts";
import { createEngineRegistry } from "../engines/registry.ts";
import type { EngineRegistry } from "../engines/registry.ts";
import { join, dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { createLvCaseSource } from "../engines/lv/caseSource.ts";
import { loadLvBinding } from "../engines/lv/binding.ts";
import { askEngine, planJobs } from "./orchestrator.ts";
import { createResultStore, STORE_DIRECTORY } from "./resultStore.ts";
import type { ResultStore } from "./resultStore.ts";
import { QUANTITIES } from "../quantities/index.ts";
import { createFixtureCaseSource } from "./suite.ts";
import type { CaseSources } from "./suite.ts";
import { createInputReader, writePreparedInputs } from "./poolInputs.ts";
import type { PoolReply, PoolRequest } from "./poolProtocol.ts";

import { profileAsync, profileStart } from "./profile.ts";

const inputsOf = createInputReader();
let endLifetime = () => {};
let registry: EngineRegistry;
let sources: CaseSources;
let store: ResultStore;
const adapters = new Map<string, Promise<EngineAdapter>>();
const adapterOf = (id: string): Promise<EngineAdapter> => {
  let adapter = adapters.get(id);
  if (adapter === undefined) {
    adapter = registry.create(id);
    adapters.set(id, adapter);
  }
  return adapter;
};
let closing: Promise<void> | undefined;
function close(): Promise<void> {
  closing ??= (async () => {
    await Promise.allSettled([...adapters.values()].map(async (adapter) => (await adapter).close()));
  })();
  return closing;
}

async function answer(message: PoolRequest): Promise<PoolReply> {
  const { id } = message;
  try {
    switch (message.method) {
      case "init":
        endLifetime = profileStart("worker.lifetime");
        registry = createEngineRegistry(message.loaded);
        sources = {
          lv: createLvCaseSource(message.loaded.config.lvPath),
          fixture: createFixtureCaseSource(message.loaded.rootDir),
        };
        store = createResultStore(join(message.loaded.config.runsDir, STORE_DIRECTORY));
        // Explicit timing of the binding, once per child. An unavailable tree is still a coded source/engine refusal.
        if (message.loaded.config.lvPath) {
          await profileAsync("startup.lv-binding", () => loadLvBinding(message.loaded.config.lvPath)).catch(() => {});
        }
        return { id, ok: true, value: null };
      case "describe":
        return {
          id,
          ok: true,
          value: await profileAsync(`hello.${message.engine}`, async () =>
            (await adapterOf(message.engine)).describe(),
          ),
        };
      case "run": {
        const { request, opticalCase } = inputsOf(message);
        return {
          id,
          ok: true,
          value: await profileAsync(`execute.${message.engine}`, async () =>
            (await adapterOf(message.engine)).run(request, opticalCase),
          ),
        };
      }
      case "source": {
        const source = sources[message.kind]!;
        const value =
          message.action === "expand"
            ? await profileAsync("source.expand", async () => (await source.expand?.(message.run)) ?? [message.run])
            : await profileAsync("case.export", () => source.resolve(message.run));
        return { id, ok: true, value };
      }
      case "plan": {
        const plan = await profileAsync("plan", () =>
          planJobs({
            suite: { name: "pool-preparation", hash: "", runs: [message.run] },
            registry,
            sources,
            runsDir: "",
            engines: message.engines,
            rungs: message.rungs,
          }),
        );
        writePreparedInputs(message.inputsFile, {
          opticalCase: plan.runs[0].opticalCase,
          requests: plan.jobs.map((job) => job.request),
        });
        return {
          id,
          ok: true,
          value: {
            ...plan,
            jobs: plan.jobs.map((job) => {
              const { opticalCase: _opticalCase, ...rest } = job;
              // Only the suite pool sees these opaque headers. Full specs stay available for any follow-up.
              const request =
                job.quantity.id === "rays.trace" && !message.retainSpecsFor.includes(job.rung.id)
                  ? { ...job.request, spec: {} }
                  : job.request;
              return { ...rest, request, rung: job.rung.id, quantity: job.quantity.id };
            }),
          },
        };
      }
      case "warm":
        // Begin backend hello while this child prepares LV recipes/rays; every later describe awaits that hello.
        for (const engine of message.engines)
          void profileAsync(`startup.hello.${engine}`, async () => (await adapterOf(engine)).describe()).catch(
            () => {},
          );
        return { id, ok: true, value: null };
      case "audit":
        return { id, ok: true, value: { lv: sources.lv?.audit?.() ?? null } };
      case "ask": {
        const { request, opticalCase } = inputsOf(message);
        const descriptor = message.descriptor;
        const adapter: EngineAdapter = message.broken
          ? {
              id: message.engine,
              describe: async () => descriptor,
              close: async () => {},
              run: async (request) =>
                makeResult(request, engineStamp(descriptor.identity), {
                  status: "error",
                  error: { code: "transport-error", message: "the worker is gone" },
                }),
            }
          : await adapterOf(message.engine);
        const warnings: string[] = [];
        // The complete gzip is written before replying, but is invisible to store readers until ordered admission.
        // A later job may kill this child; the controller can still publish this earlier completed answer.
        const staged = createResultStore(store.directory, {
          publish: (_key, bytes) => {
            mkdirSync(dirname(message.temporary), { recursive: true });
            writeFileSync(message.temporary, bytes, { flag: "wx" });
          },
        });
        const answer = await askEngine({
          adapter,
          descriptor,
          quantity: QUANTITIES.get(request.quantity)!,
          request,
          opticalCase,
          store: staged,
          warnings,
        });
        const { status, unsupported, error } = answer.result;
        return {
          id,
          ok: true,
          value: { warnings, answer: { ...answer, result: { status, unsupported, error } } },
        };
      }
      case "close":
        await close();
        endLifetime();
        return { id, ok: true, value: null };
    }
  } catch (error) {
    return {
      id,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      ...(error instanceof EngineUnavailableError ? { code: error.code } : {}),
    };
  }
}
process.on("message", (message: PoolRequest) => {
  void answer(message).then((reply) => {
    process.send?.(reply, () => {
      if (message.method === "close") process.disconnect();
    });
  });
});
// Losing the controller must also release Python workers owned by this slot.
process.on("disconnect", () => {
  void close().finally(() => process.exit());
});
