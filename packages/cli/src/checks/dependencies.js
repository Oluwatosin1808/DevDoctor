const LOCKFILES = [
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "bun.lock",
];

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

/** Ranges that pin nothing at all. */
const UNPINNED = new Set(["*", "latest", ">", "x", "X", ""]);

/** Dependency health: reproducible installs and explicit ranges. */
export function checkDependencies(ctx) {
  const findings = [];

  const lockfile = LOCKFILES.find((name) => ctx.has(name));
  if (lockfile) {
    findings.push({
      status: "pass",
      message: `Lockfile present (${lockfile})`,
    });
  } else {
    findings.push({
      status: "error",
      message: "No lockfile found, so installs are not reproducible",
    });
  }

  const pkg = ctx.json("package.json");
  if (!pkg.ok) {
    findings.push({
      status: "warn",
      message: "Dependencies could not be inspected because package.json is unavailable",
    });
    return findings;
  }

  const data = pkg.data ?? {};
  const unpinned = [];
  let total = 0;

  for (const field of DEP_FIELDS) {
    const entries = data[field];
    if (!entries || typeof entries !== "object") continue;

    for (const [name, range] of Object.entries(entries)) {
      total += 1;
      if (typeof range !== "string" || UNPINNED.has(range.trim())) {
        unpinned.push(`${name}@${String(range)}`);
      }
    }
  }

  if (total === 0) {
    findings.push({ status: "pass", message: "No dependencies declared" });
  } else if (unpinned.length === 0) {
    findings.push({
      status: "pass",
      message: `All ${total} dependency range(s) specify a version`,
    });
  } else {
    const shown = unpinned.slice(0, 5).join(", ");
    const rest = unpinned.length > 5 ? `, …and ${unpinned.length - 5} more` : "";
    findings.push({
      status: "warn",
      message: `${unpinned.length} dependency range(s) pin nothing: ${shown}${rest}`,
    });
  }

  const deps = data.dependencies ?? {};
  const devDeps = data.devDependencies ?? {};
  const duplicated = Object.keys(deps).filter((name) => name in devDeps);

  if (duplicated.length > 0) {
    findings.push({
      status: "warn",
      message: `Listed in both dependencies and devDependencies: ${duplicated.join(", ")}`,
    });
  } else if (total > 0) {
    findings.push({
      status: "pass",
      message: "No dependency is declared twice",
    });
  }

  return findings;
}
