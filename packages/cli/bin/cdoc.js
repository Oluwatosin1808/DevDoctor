#!/usr/bin/env node
import { runCli } from "../dist/cli/commands.js";

process.exitCode = runCli(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
  isTty: Boolean(process.stdout.isTTY),
  env: process.env,
});
