import { exec, spawnSync } from "node:child_process";
import { compileAll } from "zap-es/compiler";
import { test } from "vitest";
import { writeFile } from "node:fs/promises";

const projectDir = new URL("../../", import.meta.url);

// This fixture relies on an external schema-frontend compiler that parses
// *.zap text into a CodeGeneratorRequest on stdout (the project itself only
// ships the code-generator plugins). Resolve it from $ZAP_COMPILER or fall
// back to "zapc" on PATH; skip when no compiler is installed.
const compiler = process.env.ZAP_COMPILER ?? "zapc";
const hasCompiler =
  spawnSync(compiler, ["--version"], { stdio: "ignore" }).error === undefined;

test.skipIf(!hasCompiler)("compiler:compile fixture", async () => {
  const stdout = await new Promise<Buffer>((resolve, reject) => {
    exec(
      `${compiler} -o- test/fixtures/*.zap`,
      {
        encoding: "buffer",
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(error.message, { cause: stderr }));
        } else {
          resolve(stdout);
        }
      },
    );
  });
  const { files } = await compileAll(stdout, {
    ts: true,
    js: false /* TODO */,
    dts: false /* TODO */,
  });
  for (const [name, content] of files) {
    if (name.endsWith(".ts")) {
      writeFile(
        new URL(name, projectDir),
        content.replace(/^\s+/gm, (match) => " ".repeat(match.length / 2)),
      );
    }
  }
});
