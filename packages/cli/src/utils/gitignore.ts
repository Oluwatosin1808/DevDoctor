/**
 * Small, self-contained .gitignore matcher. It implements the rules cDoc needs:
 * comments, negation, anchored and basename patterns, directory-only patterns,
 * `*`/`?`/`**` wildcards, and nested .gitignore files scoped to their directory.
 * It deliberately does not try to be a complete git implementation.
 */

export interface IgnoreRule {
  /** POSIX path of the directory containing the .gitignore ("" for root). */
  base: string;
  pattern: string;
  regex: RegExp;
  negated: boolean;
  directoryOnly: boolean;
  anchored: boolean;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function globToRegExp(pattern: string): RegExp {
  let source = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "*") {
      if (pattern[index + 1] === "*") {
        while (pattern[index + 1] === "*") index += 1;
        if (pattern[index + 1] === "/") {
          index += 1;
          source += "(?:.*/)?";
        } else {
          source += ".*";
        }
      } else {
        source += "[^/]*";
      }
    } else if (char === "?") {
      source += "[^/]";
    } else if (char !== undefined) {
      source += escapeRegExp(char);
    }
  }
  return new RegExp(`${source}$`);
}

function stripTrailingSpaces(line: string): string {
  let end = line.length;
  while (end > 0 && (line[end - 1] === " " || line[end - 1] === "\t")) end -= 1;
  return line.slice(0, end);
}

export function parseGitignore(contents: string, base = ""): IgnoreRule[] {
  const rules: IgnoreRule[] = [];

  for (const rawLine of contents.split(/\r?\n/)) {
    let line = stripTrailingSpaces(rawLine);
    if (line === "" || line.startsWith("#")) continue;

    if (line.startsWith("\\#") || line.startsWith("\\!")) line = line.slice(1);
    const negated = line.startsWith("!");
    if (negated) line = line.slice(1);
    if (line === "") continue;

    const directoryOnly = line.endsWith("/");
    if (directoryOnly) line = line.slice(0, -1);
    const anchored = line.startsWith("/") || line.includes("/");
    if (line.startsWith("/")) line = line.slice(1);
    if (line === "") continue;

    const pattern = line.split("\\").join("/");
    rules.push({
      base,
      pattern,
      regex: globToRegExp(pattern),
      negated,
      directoryOnly,
      anchored,
    });
  }

  return rules;
}

function ruleMatches(rule: IgnoreRule, relativePath: string, isDirectory: boolean): boolean {
  if (rule.directoryOnly && !isDirectory) return false;

  let candidate = relativePath;
  if (rule.base !== "") {
    if (candidate === rule.base || candidate.startsWith(`${rule.base}/`)) {
      candidate = candidate.slice(rule.base.length + 1);
    } else {
      return false;
    }
  }
  if (candidate === "") return false;

  if (rule.anchored || rule.pattern.includes("**/")) {
    return rule.regex.test(candidate);
  }
  return candidate.split("/").some((segment) => rule.regex.test(segment));
}

/** Last matching rule wins, mirroring gitignore precedence within a file tree. */
export function isIgnored(
  relativePath: string,
  isDirectory: boolean,
  rules: readonly IgnoreRule[],
): boolean {
  let ignored = false;
  for (const rule of rules) {
    if (ruleMatches(rule, relativePath, isDirectory)) ignored = !rule.negated;
  }
  return ignored;
}

/** Glob matching for future include/exclude options, anchored at the project root. */
export function matchesPattern(relativePath: string, pattern: string): boolean {
  const normalised = pattern.replace(/^\.\//, "").replace(/^\/+/, "");
  const regex = globToRegExp(normalised);
  // A pattern without a slash applies to a file name at any depth.
  if (!normalised.includes("/")) {
    return relativePath.split("/").some((segment) => regex.test(segment));
  }
  return regex.test(relativePath);
}
