import { join } from "node:path";
import { isBinaryPath, readJson, readText } from "../util.js";

/**
 * High-signal secret patterns. Each is written so that the literal pattern
 * text inside this source file cannot match itself — the character class
 * immediately follows the static prefix.
 */
const SECRET_PATTERNS = [
  {
    label: "Private key material",
    re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/,
  },
  {
    label: "AWS access key id",
    re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  },
  {
    label: "GitHub token",
    re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{22,}\b/,
  },
  {
    label: "Slack token",
    re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  },
  {
    label: "npm access token",
    re: /\bnpm_[A-Za-z0-9]{36}\b/,
  },
  {
    label: "Stripe live secret key",
    re: /\bsk_live_[0-9a-zA-Z]{24,}\b/,
  },
  {
    label: "Google API key",
    re: /\bAIza[0-9A-Za-z_-]{35}\b/,
  },
];

const RISKY_DOWNLOAD = /(?:curl|wget)\b[^|\n]*\|\s*(?:ba|z|k|da)?sh\b/;

const MAX_FILES = 1500;

/**
 * Security checks: no credential-shaped strings in the files git tracks, and
 * no npm script that pipes a download straight into a shell.
 *
 * Prefers git's tracked file list — that is what actually leaves your machine.
 */
export function checkSecurity(ctx) {
  const findings = [];

  const targets =
    ctx.tracked !== null
      ? ctx.tracked.map((rel) => join(ctx.root, rel))
      : ctx.files;

  const hits = [];
  let scanned = 0;

  for (const file of targets) {
    if (scanned >= MAX_FILES) break;
    if (isBinaryPath(file)) continue;

    const text = readText(file);
    if (text === null) continue;
    scanned += 1;

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.re.test(text)) {
        hits.push({ label: pattern.label, file: ctx.rel(file) });
      }
    }
  }

  if (hits.length === 0) {
    findings.push({
      status: "pass",
      message: `No known secret patterns in ${scanned} scanned file(s)`,
    });
  } else {
    for (const hit of hits.slice(0, 10)) {
      findings.push({
        status: "error",
        message: `${hit.label} found in ${hit.file}`,
      });
    }
    if (hits.length > 10) {
      findings.push({
        status: "error",
        message: `…and ${hits.length - 10} further match(es)`,
      });
    }
  }

  const pkg = readJson(join(ctx.root, "package.json"));
  if (pkg.ok) {
    const scripts = pkg.data?.scripts ?? {};
    const risky = Object.entries(scripts).filter(
      ([, command]) =>
        typeof command === "string" &&
        (RISKY_DOWNLOAD.test(command) || /\beval\s*\(/.test(command)),
    );

    if (risky.length > 0) {
      findings.push({
        status: "warn",
        message: `Risky npm script(s): ${risky.map(([name]) => name).join(", ")}`,
      });
    } else {
      findings.push({
        status: "pass",
        message: "No npm script pipes a download into a shell",
      });
    }
  }

  return findings;
}
