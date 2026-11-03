import { statSync } from "node:fs";
import { resolve } from "node:path";

import { writeFileAtomic } from "../../core/atomicFile.ts";
import { REPO_ROOT } from "../../core/config.ts";
import { UsageError } from "../../core/usageError.ts";
import { MATRIX_JSON, MATRIX_MARKDOWN, readMatrixInputs, renderMatrix } from "../../report/matrix.ts";
import { parseArguments } from "../arguments.ts";
import { EXIT_OK, EXIT_USAGE } from "../command.ts";
import type { CliCommand } from "../command.ts";

const HELP =
  "Usage: lvrtc matrix [--root <dir>]\n\nWrites reports/benchmark/validation-matrix.{json,md} from the benchmark's two baselines alone (baselines/benchmark.json and benchmark.mtf.json): a row for each LensVisualizer analysis tab, with the rungs that cover it, the counts the baselines hold of each baselined rung, and the quantity and engines of each rung that is in no baseline. No engine is read. Missing or inconsistent inputs write nothing.\n";

/** The matrix command reads the benchmark's baselines only, without resolving any engine or configuration. */
export function createMatrixCommand(inputs: { rootDir: string; cwd: string }): CliCommand {
  return {
    name: "matrix",
    summary: "Write the benchmark's validation matrix from its two baselines alone",
    run: async (args, io) => {
      if (args.includes("--help") || args.includes("-h")) {
        io.stdout(HELP);
        return EXIT_OK;
      }
      let root: string;
      try {
        const { positionals, values } = parseArguments(args, ["--root"], []);
        if (positionals.length) throw new UsageError(`unexpected argument "${positionals[0]}"`);
        root = values.has("--root") ? resolve(inputs.cwd, values.get("--root")!) : inputs.rootDir;
        if (!statSync(root, { throwIfNoEntry: false })?.isDirectory())
          throw new UsageError(`--root ${root}: not a directory`);
      } catch (error) {
        if (!(error instanceof UsageError)) throw error;
        io.stderr(`lvrtc matrix: ${error.message}\n${HELP}`);
        return EXIT_USAGE;
      }
      const rendered = renderMatrix(readMatrixInputs(root));
      writeFileAtomic(resolve(root, MATRIX_JSON), rendered.json);
      writeFileAtomic(resolve(root, MATRIX_MARKDOWN), rendered.markdown);
      io.stdout(
        `${MATRIX_JSON} and ${MATRIX_MARKDOWN}: written from the benchmark's two baselines; no engine was read.\n`,
      );
      return EXIT_OK;
    },
  };
}

export const matrixCommand = createMatrixCommand({ rootDir: REPO_ROOT, cwd: process.cwd() });
