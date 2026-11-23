import { readdirSync } from "node:fs";
import { join } from "node:path";
import { joinRelative, readTextFile, safeRelative } from "../utils/fs.js";
import {
  isIgnored,
  matchesPattern,
  parseGitignore,
  type IgnoreRule,
} from "../utils/gitignore.js";

/** Generated or VCS directories that are never traversed. */
export const EXCLUDED_DIRECTORIES: readonly string[] = [
  ".git",
  ".svn",
  ".hg",
  "node_modules",
  "bower_components",
  ".pnpm-store",
  "dist",
  "build",
  "out",
  "coverage",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".output",
  ".turbo",
  ".cache",
  ".vercel",
  ".idea",
  ".vscode",
];

const MAX_FILES = 2500;
const MAX_DEPTH = 64;
const MAX_GITIGNORE_BYTES = 256 * 1024;

export interface DiscoveryOptions {
  /** Optional root-anchored glob patterns; an empty list means all files. */
  include?: readonly string[];
  exclude?: readonly string[];
  maxFiles?: number;
  maxDepth?: number;
}

export interface DiscoveryResult {
  /** Sorted, project-relative POSIX paths, safe to display and join to the root. */
  files: string[];
  /** Count of entries skipped by ignore rules, safety rules or external symlinks. */
  ignored: number;
  truncated: boolean;
}

interface PendingDirectory {
  absolutePath: string;
  relativePath: string;
  rules: readonly IgnoreRule[];
  depth: number;
}

function loadRules(directory: PendingDirectory): IgnoreRule[] {
  const gitignorePath = join(directory.absolutePath, ".gitignore");
  const text = readTextFile(gitignorePath, MAX_GITIGNORE_BYTES);
  if (!text.ok || text.value === null) return [...directory.rules];
  return [...directory.rules, ...parseGitignore(text.value, directory.relativePath)];
}

function isExcludedByDefault(name: string): boolean {
  return EXCLUDED_DIRECTORIES.includes(name);
}

/**
 * Breadth-first, non-recursive walk of a project. It never follows symbolic
 * links, never leaves the canonical root, and reads only .gitignore files.
 */
export function discoverFiles(root: string, options: DiscoveryOptions = {}): DiscoveryResult {
  const maxFiles = options.maxFiles ?? MAX_FILES;
  const maxDepth = options.maxDepth ?? MAX_DEPTH;
  const include = options.include ?? [];
  const exclude = options.exclude ?? [];
  const files: string[] = [];
  const pending: PendingDirectory[] = [
    { absolutePath: root, relativePath: "", rules: [], depth: 0 },
  ];
  let ignored = 0;
  let truncated = false;

  while (pending.length > 0 && !truncated) {
    const directory = pending.shift();
    if (directory === undefined) continue;

    let entries;
    try {
      entries = readdirSync(directory.absolutePath, { withFileTypes: true });
    } catch {
      // Inaccessible directories are skipped, not fatal.
      continue;
    }
    entries.sort((left, right) => left.name.localeCompare(right.name));

    const rules = loadRules(directory);

    for (const entry of entries) {
      // Symlinks are never followed: a link inside the project can point outside it.
      if (entry.isSymbolicLink() || (!entry.isFile() && !entry.isDirectory())) {
        ignored += 1;
        continue;
      }

      const absolutePath = join(directory.absolutePath, entry.name);
      const relativePath = joinRelative(directory.relativePath, entry.name);
      if (safeRelative(root, absolutePath) === null) {
        ignored += 1;
        continue;
      }

      if (entry.isDirectory()) {
        if (
          directory.depth >= maxDepth ||
          isExcludedByDefault(entry.name) ||
          isIgnored(relativePath, true, rules)
        ) {
          ignored += 1;
          continue;
        }
        pending.push({
          absolutePath,
          relativePath,
          rules,
          depth: directory.depth + 1,
        });
        continue;
      }

      if (
        isIgnored(relativePath, false, rules) ||
        (include.length > 0 && !include.some((pattern) => matchesPattern(relativePath, pattern))) ||
        exclude.some((pattern) => matchesPattern(relativePath, pattern))
      ) {
        ignored += 1;
        continue;
      }

      files.push(relativePath);
      if (files.length >= maxFiles) {
        truncated = true;
        break;
      }
    }
  }

  files.sort((left, right) => left.localeCompare(right));
  return { files, ignored, truncated };
}
