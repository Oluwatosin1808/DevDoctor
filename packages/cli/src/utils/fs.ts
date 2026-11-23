import { readFileSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import type { ReadResult } from "../types.js";

export const MAX_TEXT_BYTES = 512 * 1024;

const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".pdf",
  ".zip", ".gz", ".tar", ".bz2", ".7z", ".rar", ".woff", ".woff2",
  ".ttf", ".otf", ".eot", ".mp3", ".mp4", ".mov", ".webm", ".wav",
  ".ogg", ".db", ".sqlite", ".bin", ".exe", ".dll", ".so", ".dylib",
  ".class", ".jar", ".wasm",
]);

export function isBinaryPath(path: string): boolean {
  return BINARY_EXTENSIONS.has(extensionOf(path));
}

function extensionOf(path: string): string {
  const base = path.split(/[\\/]/).pop() ?? path;
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot).toLowerCase();
}

export function exists(path: string): boolean {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

export function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** Normalise any host separator to POSIX for stable, portable output. */
export function toPosix(path: string): string {
  return path.split(sep).join("/").replace(/^\.\//, "");
}

/** Convert an absolute path to a safe project-relative POSIX path, or null if it escapes. */
export function safeRelative(root: string, absolute: string): string | null {
  const rel = relative(root, absolute);
  if (rel === "") return ".";
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return null;
  return toPosix(rel);
}

/** Resolve a project-relative path without allowing traversal outside the root. */
export function resolveInside(root: string, relativePath: string): string | null {
  if (isAbsolute(relativePath)) return null;
  const candidate = resolve(root, relativePath);
  const rel = relative(root, candidate);
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return null;
  return candidate;
}

export function readTextFile(
  path: string,
  maxBytes: number = MAX_TEXT_BYTES,
): ReadResult<string> {
  try {
    const stat = statSync(path);
    if (!stat.isFile()) return { ok: false, value: null, reason: "unreadable" };
    if (stat.size > maxBytes) {
      return { ok: false, value: null, reason: "too-large" };
    }
    const text = readFileSync(path, "utf8");
    if (text.includes("\u0000")) {
      return { ok: false, value: null, reason: "unreadable" };
    }
    return { ok: true, value: text, reason: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, value: null, reason: "unreadable", message };
  }
}

export function readJsonFile<T = unknown>(
  path: string,
  maxBytes: number = MAX_TEXT_BYTES,
): ReadResult<T> {
  const text = readTextFile(path, maxBytes);
  if (!text.ok) return { ok: false, value: null, reason: text.reason, message: text.message };
  try {
    return { ok: true, value: JSON.parse(text.value ?? "") as T, reason: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, value: null, reason: "invalid-json", message };
  }
}

/** Join a project-relative path using POSIX separators internally. */
export function joinRelative(base: string, name: string): string {
  return base === "" ? name : `${base}/${name}`;
}
