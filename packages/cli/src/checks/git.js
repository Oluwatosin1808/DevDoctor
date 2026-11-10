import { gitignoreIgnores } from "../util.js";

/** Directory prefixes that should never be under version control. */
const SHOULD_NOT_BE_TRACKED = [
  "node_modules/",
  ".next/",
  "dist/",
  "build/",
  "coverage/",
];

/** Git configuration: a repository exists and ignores what it should. */
export function checkGit(ctx) {
  const findings = [];

  if (ctx.has(".git")) {
    findings.push({ status: "pass", message: "Directory is a git repository" });
  } else {
    findings.push({
      status: "warn",
      message: "Not a git repository — version control is not set up here",
    });
  }

  const ignoreText = ctx.read(".gitignore");
  if (ignoreText === null) {
    findings.push({ status: "error", message: ".gitignore is missing" });
    return findings;
  }

  findings.push({ status: "pass", message: ".gitignore is present" });

  if (gitignoreIgnores(ignoreText, "node_modules")) {
    findings.push({
      status: "pass",
      message: ".gitignore excludes node_modules",
    });
  } else {
    findings.push({
      status: "warn",
      message: ".gitignore does not exclude node_modules",
    });
  }

  if (gitignoreIgnores(ignoreText, ".env")) {
    findings.push({ status: "pass", message: ".gitignore excludes .env files" });
  } else {
    findings.push({
      status: "warn",
      message: ".gitignore does not exclude .env files",
    });
  }

  if (ctx.tracked !== null) {
    const leaked = ctx.tracked.filter((rel) =>
      SHOULD_NOT_BE_TRACKED.some((dir) => rel.includes(dir)),
    );

    if (leaked.length > 0) {
      const shown = leaked.slice(0, 3).join(", ");
      const rest = leaked.length > 3 ? ` …and ${leaked.length - 3} more` : "";
      findings.push({
        status: "warn",
        message: `Build output or dependencies are tracked: ${shown}${rest}`,
      });
    } else {
      findings.push({
        status: "pass",
        message: "No build output or dependencies are tracked",
      });
    }
  }

  return findings;
}
