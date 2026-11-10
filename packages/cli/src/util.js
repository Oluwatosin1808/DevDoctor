import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

/** Directories never descended into while scanning a project. */
const EXCLUDED_DIRS = new Set([
  ".git",
  "node_modules",
  "bower_components",
  "dist",
  "build",
  "out",
  "coverage",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  ".vercel",
  ".idea",
  ".vscode",
]);

/** Extensions treated as binary and skipped during text scans. */
const BINARY_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".ico",
  ".pdf",
  ".zip",
  ".gz",
  ".tar",
  ".bz2",
  ".7z",
  ".rar",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".mp3",
  ".mp4",
  ".mov",
  ".webm",
  ".wav",
  ".ogg",
  ".db",
  ".sqlite",
  ".bin",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".class",
  ".jar",
  ".wasm",
]);

const MAX_FILE_BYTES = 512 * 1024;

export function exists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

export function isBinaryPath(path) {
  return BINARY_EXT.has(extname(path).toLowerCase());
}

/**
 * Reads a file as UTF-8, or returns `null` when it is missing, empty, larger
 * than the scan cap, or contains null bytes (i.e. is binary).
 */
export function readText(path) {
  try {
    const stat = statSync(path);
    if (stat.size === 0 || stat.size > MAX_FILE_BYTES) return null;
    const text = readFileSync(path, "utf8");
    return text.includes("\u0000") ? null : text;
  } catch {
    return null;
  }
}

export function readJson(path) {
  const text = readText(path);
  if (text === null) return { ok: false, reason: "missing", data: null };
  try {
    return { ok: true, reason: null, data: JSON.parse(text) };
  } catch (error) {
    return { ok: false, reason: "invalid", data: null, error: error.message };
  }
}

/** Breadth-first walk of readable text files, skipping excluded directories. */
export function walkFiles(root, { limit = 2500 } = {}) {
  const found = [];
  const stack = [root];

  while (stack.length > 0 && found.length < limit) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (found.length >= limit) break;
      const full = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name)) continue;
        stack.push(full);
      } else if (entry.isFile()) {
        if (isBinaryPath(full)) continue;
        found.push(full);
      }
    }
  }

  return found;
}

/**
 * Files git is tracking, as repository-relative POSIX paths, or `null` when
 * this is not a git repository or git is unavailable.
 */
export function gitTracked(root) {
  try {
    const output = execFileSync("git", ["-C", root, "ls-files", "-z"], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: 15000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.split("\0").filter(Boolean);
  } catch {
    return null;
  }
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Does a `.gitignore`'s contents exclude `needle`? Handles plain names,
 * leading and trailing slashes, double-star prefixes, and wildcard rules such
 * as `node_modules` or `.env*`.
 */
export function gitignoreIgnores(contents, needle) {
  return contents.split(/\r?\n/).some((raw) => {
    const line = raw.trim().replace(/^\/+/, "").replace(/\/+$/, "");
    if (line === "" || line.startsWith("#")) return false;
    if (line === needle || line === `**/${needle}` || line === "*") return true;
    if (!line.includes("*")) return false;

    try {
      const pattern = line.split("*").map(escapeRegExp).join(".*");
      return new RegExp(`^${pattern}$`).test(needle);
    } catch {
      return false;
    }
  });
}

const ANSI = { bold: 1, dim: 2, red: 31, green: 32, yellow: 33, cyan: 36 };

/** Wraps text in an ANSI sequence when colour is enabled, passthrough otherwise. */
export function makePaint(enabled) {
  return (name, text) => {
    const code = ANSI[name];
    if (!enabled || code === undefined) return text;
    return `\u001b[${code}m${text}\u001b[0m`;
  };
}
