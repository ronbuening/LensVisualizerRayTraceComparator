// Files that are whole or absent: what the result store, the cases of a run and its manifest are written with.
import { randomBytes } from "node:crypto";
import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

/** How the name of a file that is still being written ends. One left behind belonged to a writer that was killed. */
export const TEMP_SUFFIX = ".tmp";

/**
 * Writes `text` as the file `path`, creating its directory, so that the file is at every moment either what it was
 * or the whole new text, also when the process is killed part-way: the text goes to a temporary file in the same
 * directory, which is then renamed over `path`. A file that is already there is replaced. When writing fails the
 * temporary file is removed and the error is thrown; only a killed process can leave one, and its name ends in
 * `TEMP_SUFFIX`, so nothing mistakes it for the file.
 */
export function writeFileAtomic(path: string, text: string): void {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true });
  // The name is never stored, and the random part keeps two writers of one file apart.
  const unique = `${process.pid}.${randomBytes(6).toString("hex")}`;
  const temporary = join(directory, `${basename(path)}.${unique}${TEMP_SUFFIX}`);
  try {
    writeFileSync(temporary, text, { encoding: "utf8", flag: "wx" });
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}
