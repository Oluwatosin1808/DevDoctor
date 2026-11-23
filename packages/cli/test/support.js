import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { runCli } from "../dist/cli/commands.js";

export function writeFiles(root, files) {
  for (const [name, contents] of Object.entries(files)) {
    const target = join(root, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
}

export function withTempProject(files, run) {
  const root = mkdtempSync(join(tmpdir(), "cdoc-test-"));
  try {
    writeFiles(root, files);
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export function capture(argv, cwd, env = {}) {
  let out = "";
  let err = "";
  const code = runCli(argv, {
    cwd,
    isTty: false,
    env,
    stdout: { write(chunk) { out += chunk; } },
    stderr: { write(chunk) { err += chunk; } },
  });
  return { code, out, err };
}
