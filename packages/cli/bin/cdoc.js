#!/usr/bin/env node
import { flushTelemetry, runCli } from "../dist/cli/commands.js";

const code = runCli(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
  isTty: Boolean(process.stdout.isTTY),
  env: process.env,
});

await flushTelemetry();
process.exitCode = code;
