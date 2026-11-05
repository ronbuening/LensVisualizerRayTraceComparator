// The dashboard is in no engine's import closure: no file of `src/**` outside `src/dashboard` and `src/cli` reaches
// a file of `src/dashboard`, directly or through others. It keeps every fingerprint and adapter revision where it is.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../../src", import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|mjs|js)$/.test(entry.name) ? [path] : [];
  });
}

/** The files of `src` a file imports, types and re-exports included: every relative specifier it names. */
function importsOf(file: string): string[] {
  const text = readFileSync(file, "utf8");
  const specifiers = [
    ...text.matchAll(/\b(?:import|export)\s[^;]*?\bfrom\s*["']([^"']+)["']/g),
    ...text.matchAll(/\bimport\s*["']([^"']+)["']/g),
    ...text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g),
  ].map((match) => match[1]);
  return specifiers
    .filter((specifier) => specifier.startsWith("."))
    .map((specifier) => resolve(dirname(file), specifier));
}

test("no file outside src/dashboard and src/cli imports src/dashboard, directly or through another file", () => {
  const files = sourceFiles(SRC);
  const graph = new Map(files.map((file) => [file, importsOf(file)]));
  const inDashboard = (file: string): boolean => relative(SRC, file).startsWith(`dashboard/`);
  const allowed = (file: string): boolean => inDashboard(file) || relative(SRC, file).startsWith("cli/");
  assert.ok(files.some(inDashboard), "the walk finds the dashboard");
  const offenders: string[] = [];
  for (const file of files.filter((each) => !allowed(each))) {
    const seen = new Set<string>([file]);
    const stack = [file];
    while (stack.length > 0) {
      const at = stack.pop() as string;
      for (const next of graph.get(at) ?? []) {
        if (seen.has(next)) continue;
        seen.add(next);
        if (inDashboard(next)) offenders.push(`${relative(SRC, file)} reaches ${relative(SRC, next)}`);
        else stack.push(next);
      }
    }
  }
  assert.deepEqual(offenders, []);
  // And the walk reads imports at all: the server's own reach the views.
  assert.ok((graph.get(join(SRC, "dashboard", "server.ts")) ?? []).includes(join(SRC, "dashboard", "views.ts")));
});
