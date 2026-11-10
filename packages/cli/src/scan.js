import { join, relative, sep } from "node:path";
import { CHECKS } from "./checks/index.js";
import { exists, gitTracked, readJson, readText, walkFiles } from "./util.js";

/** Points deducted per finding. Errors cost three times what warnings do. */
const PENALTY = { pass: 0, warn: 4, error: 12 };

/**
 * Runs every registered check against `root` and reduces the findings to a
 * score out of 100.
 *
 * @param {string} root - absolute path to scan
 */
export function runScan(root) {
  const files = walkFiles(root);
  const tracked = gitTracked(root);

  const ctx = {
    root,
    files,
    tracked,
    has: (name) => exists(join(root, name)),
    read: (name) => readText(join(root, name)),
    json: (name) => readJson(join(root, name)),
    rel: (path) => relative(root, path).split(sep).join("/"),
  };

  const categories = CHECKS.map((check) => ({
    id: check.id,
    title: check.title,
    findings: check.run(ctx),
  }));

  const totals = { pass: 0, warn: 0, error: 0 };
  let penalty = 0;

  for (const category of categories) {
    for (const finding of category.findings) {
      totals[finding.status] += 1;
      penalty += PENALTY[finding.status];
    }
  }

  const score = Math.max(0, 100 - penalty);
  const attention = totals.warn + totals.error;

  return {
    tool: "devdoctor",
    root,
    filesScanned: files.length,
    score,
    status: attention === 0 ? "healthy" : "attention",
    totals,
    attention,
    categories,
  };
}
