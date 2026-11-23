import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { realpathSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { detectProject } from "../detection/project.js";
import { discoverFiles } from "../files/discovery.js";
import { CdocError } from "../errors.js";
import { buildReport } from "../report/model.js";
import type { CheckContext, ReadResult, ScanReport } from "../types.js";
import {
  exists,
  isDirectory,
  readJsonFile,
  readTextFile,
  resolveInside,
  toPosix,
} from "../utils/fs.js";
import type { CheckRegistry } from "./registry.js";
import { runChecks } from "./runner.js";

export interface ScanOptions {
  registry: CheckRegistry;
  verbose?: boolean;
}

/** Resolve and validate a user-supplied target without ever modifying it. */
export function resolveTarget(target: string, cwd: string): string {
  if (typeof target !== "string" || target.trim() === "") {
    throw new CdocError("MISSING_TARGET", "A target directory is required.");
  }
  const absolute = resolve(cwd, target);
  if (!exists(absolute)) {
    throw new CdocError("MISSING_TARGET", `No such path: ${absolute}`);
  }
  if (!isDirectory(absolute)) {
    throw new CdocError("INVALID_TARGET", `Not a directory: ${absolute}`);
  }
  try {
    statSync(absolute);
    return realpathSync(absolute);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CdocError("INVALID_TARGET", `Cannot access ${absolute}: ${message}`);
  }
}

function gitTrackedFiles(root: string): string[] | null {
  try {
    const output = execFileSync("git", ["-C", root, "ls-files", "-z"], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: 15000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output
      .split("\0")
      .filter((path) => path !== "" && resolveInside(root, path) !== null)
      .map(toPosix);
  } catch {
    return null;
  }
}

function makeContext(
  root: string,
  profile: CheckContext["profile"],
  files: readonly string[],
  verbose: boolean,
): CheckContext {
  let cachedTracked: string[] | null | undefined;

  const pathFor = (relativePath: string): string | null =>
    resolveInside(root, relativePath);

  return {
    rootPath: root,
    profile,
    files,
    verbose,
    has(relativePath) {
      const path = pathFor(relativePath);
      return path !== null && exists(path);
    },
    readText(relativePath: string): ReadResult<string> {
      const path = pathFor(relativePath);
      return path === null
        ? { ok: false, value: null, reason: "unreadable", message: "Path escapes the project root" }
        : readTextFile(path);
    },
    readJson<T>(relativePath: string): ReadResult<T> {
      const path = pathFor(relativePath);
      return path === null
        ? { ok: false, value: null, reason: "unreadable", message: "Path escapes the project root" }
        : readJsonFile<T>(path);
    },
    trackedFiles() {
      if (cachedTracked === undefined) cachedTracked = gitTrackedFiles(root);
      return cachedTracked;
    },
  };
}

/** The full pipeline: validate, discover, detect, execute checks, report. */
export function scanProject(
  target: string,
  cwd: string,
  options: ScanOptions,
): ScanReport {
  const root = resolveTarget(target, cwd);
  const startedAt = new Date();

  const discovery = discoverFiles(root);
  const profile = detectProject(root, discovery.files);
  const context = makeContext(root, profile, discovery.files, options.verbose ?? false);
  const checks = runChecks(context, options.registry);

  return buildReport({
    scanId: randomUUID(),
    target: root,
    project: profile,
    startedAt,
    finishedAt: new Date(),
    discovery: {
      files: discovery.files.length,
      ignored: discovery.ignored,
      truncated: discovery.truncated,
    },
    checks,
  });
}
