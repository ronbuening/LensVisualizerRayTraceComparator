// `lvrtc check-lv`: the front door for a reviewer. It is `npm run verify:real` under another name: the same runner,
// the same refusal of a machine that is not ready, the same checks one at a time (`src/cli/verifyReal.ts`).
import { REPO_ROOT } from "../../core/config.ts";
import type { CliCommand } from "../command.ts";
import { helpText } from "../help.ts";
import { verifyReal, verifyRealHelpBody, verifyRealHere } from "../verifyReal.ts";
import type { PlanMachine, SignalSource, VerifyRealProgram, VerifyRealRunner } from "../verifyReal.ts";

const SYNOPSIS =
  "Usage: lvrtc check-lv [--all | --suite <name> | --suites <a,b,...>] [--jobs <n>] [--root <dir>] [--details]\n";

/** How `lvrtc check-lv` names itself. */
export const CHECK_LV_PROGRAM: VerifyRealProgram = {
  prefix: "lvrtc check-lv",
  synopsis: SYNOPSIS,
  help: helpText([SYNOPSIS, ...verifyRealHelpBody(), "npm run verify:real runs the same check."]),
};

/** What `lvrtc check-lv` is wired to; a test hands it a scripted runner in place of child processes. */
export interface CheckLvInputs {
  readonly rootDir: string;
  readonly cwd: string;
  readonly runner?: VerifyRealRunner;
  readonly machine?: PlanMachine;
  readonly source?: SignalSource;
}

/** Builds `lvrtc check-lv`: `verifyReal` with its own name, on a scripted runner when one is given. */
export function createCheckLvCommand(inputs: CheckLvInputs): CliCommand {
  return {
    name: "check-lv",
    summary: "Check LensVisualizer: run every committed check again against the live LensVisualizer and optiland",
    run: (args, io) => {
      if (inputs.runner === undefined) {
        return verifyRealHere(args, {
          io,
          program: CHECK_LV_PROGRAM,
          rootDir: inputs.rootDir,
          cwd: inputs.cwd,
          ...(inputs.source === undefined ? {} : { source: inputs.source }),
        });
      }
      return verifyReal(args, {
        rootDir: inputs.rootDir,
        cwd: inputs.cwd,
        io,
        runner: inputs.runner,
        program: CHECK_LV_PROGRAM,
        ...(inputs.machine === undefined ? {} : { machine: inputs.machine }),
      });
    },
  };
}

/** `lvrtc check-lv` on this repository and this machine. */
export const checkLvCommand: CliCommand = createCheckLvCommand({ rootDir: REPO_ROOT, cwd: process.cwd() });
