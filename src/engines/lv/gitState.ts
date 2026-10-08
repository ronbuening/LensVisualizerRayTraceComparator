import { realpathSync } from "node:fs";
import { resolve } from "node:path";

import { commandSucceeded } from "../../core/systemCommand.ts";
import type { CommandRunner } from "../../core/systemCommand.ts";

/** The git identity of a LensVisualizer tree: the commit it is at and whether anything under it differs. */
export interface LvGitState {
  readonly commit: string;
  readonly dirty: boolean;
}

/** The path with symlinks resolved; as written when it does not exist. */
function realPath(path: string): string {
  try {
    return realpathSync(path);
  } catch {
    return resolve(path);
  }
}

/**
 * The git state of the tree at `lvPath`, restricted to that tree, or null when it has none.
 *
 * When `lvPath` is the top of its own repository the commit is `HEAD`. When it is a directory inside another
 * repository, `HEAD` would be that repository's commit, moved by changes that have nothing to do with LensVisualizer,
 * so the commit is the last one that touched the directory, and null is returned when no commit has. `dirty` is
 * true when `git status` lists anything under the directory, untracked files included.
 *
 * Every command only reads: `--no-optional-locks` keeps `status` from refreshing the index. The commit is asked of
 * `rev-parse` and `rev-list`, whose output no user configuration decorates.
 */
export function lvGitState(lvPath: string, run: CommandRunner): LvGitState | null {
  const top = run("git", ["-C", lvPath, "rev-parse", "--show-toplevel"]);
  if (!commandSucceeded(top)) return null;
  const ownRepository = realPath(top.stdout.trim()) === realPath(lvPath);
  const head = ownRepository
    ? run("git", ["-C", lvPath, "rev-parse", "HEAD"])
    : run("git", ["-C", lvPath, "rev-list", "-1", "HEAD", "--", "."]);
  if (!commandSucceeded(head) || head.stdout.trim() === "") return null;
  const status = run("git", ["--no-optional-locks", "-C", lvPath, "status", "--porcelain", "--", "."]);
  if (!commandSucceeded(status)) return null;
  return { commit: head.stdout.trim(), dirty: status.stdout.trim() !== "" };
}
