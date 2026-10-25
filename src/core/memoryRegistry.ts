// Pool-only launch instrumentation. The original factories, environment, hello, replies and identities are reused.
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BUILTIN_ENGINES } from "../engines/builtin.ts";
import { optilandDefinition } from "../engines/optiland/definition.ts";
import { wavefrontTransport } from "../engines/optiland/wavefrontEngine.ts";
import { createEngineRegistry, TRANSPORT_FACTORIES } from "../engines/registry.ts";
import type { TransportFactory } from "../engines/registry.ts";
import { createStdioTransport, workerEnvironment } from "../transports/stdio.ts";
import type { LoadedConfig } from "./config.ts";
import { writeFileSync } from "node:fs";

export function memoryRegistry(loaded: Pick<LoadedConfig, "rootDir" | "config">, directory: string) {
  const stdio: TransportFactory<"stdio"> = async (definition, { rootDir }) => transport(definition, rootDir);
  const transport = (definition: Parameters<TransportFactory<"stdio">>[0], rootDir: string) => {
    const [executable, ...args] = definition.command;
    const python =
      /^python(?:[0-9.]+)?$/.test(basename(executable)) &&
      args.length > 0 &&
      (args[0] === "-m" || !args[0].startsWith("-"));
    const node = executable === process.execPath || /^node(?:[0-9.]+)?$/.test(basename(executable));
    // Unknown custom launchers still require the process-table reader for their descendant RSS.
    if (!python && !node) writeFileSync(join(directory, "needs-ps"), "");
    const command = python
      ? [executable, fileURLToPath(new URL("./workerMemory.py", import.meta.url)), ...args]
      : node
        ? [executable, "--import", fileURLToPath(new URL("./workerMemory.mjs", import.meta.url)), ...args]
        : definition.command;
    return createStdioTransport({
      command,
      cwd: rootDir,
      env: { ...workerEnvironment(process.env, definition.options, definition.env), LVRTC_POOL_MEMORY_DIR: directory },
    });
  };
  return createEngineRegistry(
    loaded,
    { ...TRANSPORT_FACTORIES, stdio },
    {
      ...BUILTIN_ENGINES,
      "optiland-wave": {
        ...BUILTIN_ENGINES["optiland-wave"],
        transport: (context: Pick<LoadedConfig, "rootDir" | "config">) =>
          wavefrontTransport(transport(optilandDefinition(context), context.rootDir)),
      },
    },
  );
}
