const REQUIRED_FIELDS = ["name", "version", "description", "license"];
/** Project configuration: is this a well-formed, discoverable package? */
export function checkProject(ctx) {
  const findings = [];
  const pkg = ctx.json("package.json");

  if (pkg.reason === "missing") {
    findings.push({ status: "error", message: "package.json is missing" });
    return findings;
  }

  if (!pkg.ok) {
    findings.push({
      status: "error",
      message: `package.json is not valid JSON — ${pkg.error}`,
    });
    return findings;
  }

  findings.push({
    status: "pass",
    message: "package.json is present and parses",
  });

  const data = pkg.data ?? {};
  const missing = REQUIRED_FIELDS.filter((field) => !data[field]);

  if (missing.length === 0) {
    findings.push({
      status: "pass",
      message: `package.json declares ${REQUIRED_FIELDS.join(", ")}`,
    });
  } else {
    findings.push({
      status: "warn",
      message: `package.json is missing: ${missing.join(", ")}`,
    });
  }

  if (data.engines?.node) {
    findings.push({
      status: "pass",
      message: `engines.node constrains Node to ${data.engines.node}`,
    });
  } else {
    findings.push({
      status: "warn",
      message: "engines.node is not declared, so supported Node versions are unclear",
    });
  }

  const scripts = data.scripts ?? {};
  const scriptCount = Object.keys(scripts).length;
  if (scriptCount > 0) {
    findings.push({
      status: "pass",
      message: `${scriptCount} npm script(s) defined`,
    });
  } else {
    findings.push({ status: "warn", message: "no npm scripts are defined" });
  }

  const usesTypeScript = ctx.files.some(
    (file) => file.endsWith(".ts") || file.endsWith(".tsx"),
  );

  if (usesTypeScript) {
    // Searched across the whole tree rather than only the scan root, so a
    // monorepo package that keeps its tsconfig one level up still passes.
    const hasTsconfig = ctx.files.some((file) => {
      const base = ctx.rel(file).split("/").pop();
      return base.startsWith("tsconfig") && base.endsWith(".json");
    });

    if (hasTsconfig) {
      findings.push({
        status: "pass",
        message: "TypeScript sources have a tsconfig.json",
      });
    } else {
      findings.push({
        status: "warn",
        message: "TypeScript sources found but no tsconfig.json anywhere in the project",
      });
    }
  }

  return findings;
}
