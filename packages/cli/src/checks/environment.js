import { gitignoreIgnores } from "../util.js";

const ENV_EXAMPLES = new Set([
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.example.local",
]);

function classifyEnvFile(relPath) {
  const base = relPath.split("/").pop();
  if (ENV_EXAMPLES.has(base)) return "example";
  if (base === ".env" || base.startsWith(".env.")) return "file";
  return null;
}

/**
 * Environment validation: local secrets stay local and the required
 * variables are documented somewhere committable.
 *
 * Never reads the contents of an environment file — only whether it exists,
 * whether git ignores it and whether git is tracking it.
 */
export function checkEnvironment(ctx) {
  const findings = [];

  const envPaths = ctx.files
    .map((file) => ctx.rel(file))
    .filter((rel) => classifyEnvFile(rel) !== null);

  const local = envPaths.filter((rel) => classifyEnvFile(rel) === "file");
  const examples = envPaths.filter((rel) => classifyEnvFile(rel) === "example");

  if (local.length === 0) {
    findings.push({
      status: "pass",
      message: "No local .env files, so there is nothing local to leak",
    });
  } else {
    findings.push({
      status: "pass",
      message: `Found ${local.length} local environment file(s)`,
    });

    if (examples.length > 0) {
      findings.push({
        status: "pass",
        message: `A committed example documents the required variables (${examples[0]})`,
      });
    } else {
      findings.push({
        status: "warn",
        message:
          "Local .env files exist but no .env.example documents the required variables",
      });
    }

    if (ctx.tracked !== null) {
      const committed = local.filter((rel) => ctx.tracked.includes(rel));
      if (committed.length > 0) {
        findings.push({
          status: "error",
          message: `Committed to git: ${committed.join(", ")} — rotate anything in them`,
        });
      } else {
        findings.push({
          status: "pass",
          message: "No .env file is tracked by git",
        });
      }
    }
  }

  const ignoreText = ctx.read(".gitignore");
  if (ignoreText === null) {
    findings.push({
      status: "warn",
      message: "No .gitignore at the scan root to keep environment files out",
    });
  } else if (gitignoreIgnores(ignoreText, ".env")) {
    findings.push({
      status: "pass",
      message: ".gitignore excludes .env files",
    });
  } else {
    findings.push({
      status: "warn",
      message: ".gitignore does not exclude .env files",
    });
  }

  return findings;
}
