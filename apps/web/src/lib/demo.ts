/**
 * Illustrative data for the interactive product preview.
 *
 * This is fictional project data, not a live scan of anyone's codebase. It is
 * shared by the hero demo and the detailed finding showcase so their check
 * names and summary always agree.
 */

export type Tone = "prompt" | "command" | "muted" | "dim" | "success" | "warning" | "accent";

export interface ScriptLine {
  text: string;
  tone: Tone;
  /** Milliseconds to wait before this line appears. */
  delay: number;
}

export type CheckStatus = "pass" | "warning";

export interface DemoCheck {
  label: string;
  status: CheckStatus;
  count: number;
}

export interface DemoFinding {
  id: string;
  severity: "warning" | "info";
  category: string;
  title: string;
  location: string;
  confidence: string;
  why: string;
  recommendation: string;
  evidence: string[];
}

export const DEMO_PROJECT = {
  name: "northstar-web",
  path: "~/projects/northstar-web",
} as const;

export const DEMO_SCRIPT: readonly ScriptLine[] = [
  { text: "$ node packages/cli/bin/cdoc.js scan ./northstar-web", tone: "command", delay: 240 },
  { text: "cDoc scan — local-first project diagnostics", tone: "muted", delay: 360 },
  { text: "", tone: "dim", delay: 160 },
  { text: "Project", tone: "accent", delay: 260 },
  { text: "  Name        northstar-web", tone: "muted", delay: 260 },
  { text: "  Frameworks  next, react", tone: "muted", delay: 260 },
  { text: "  Package mgr npm", tone: "muted", delay: 240 },
  { text: "", tone: "dim", delay: 160 },
  { text: "Progress", tone: "accent", delay: 240 },
  { text: "  ✓ Target validated", tone: "success", delay: 300 },
  { text: "  ✓ 62 file(s) discovered, 4 skipped", tone: "success", delay: 340 },
  { text: "  ✓ Profile detected", tone: "success", delay: 300 },
  { text: "  ✓ 5 check(s) executed in 31 ms", tone: "success", delay: 340 },
  { text: "", tone: "dim", delay: 160 },
  { text: "Checks", tone: "accent", delay: 240 },
  { text: "  ✓ Project configuration — passed (1 finding)", tone: "success", delay: 300 },
  { text: "  ! Git configuration — warning (2 findings)", tone: "warning", delay: 320 },
  { text: "  ✓ Dependencies — passed (2 findings)", tone: "success", delay: 300 },
  { text: "  ! Environment files — warning (1 finding)", tone: "warning", delay: 320 },
  { text: "  ✓ Security basics — passed (1 finding)", tone: "success", delay: 300 },
  { text: "", tone: "dim", delay: 160 },
  { text: "Summary", tone: "accent", delay: 240 },
  { text: "  5 checks · 3 passed · 2 warning · 0 failed", tone: "muted", delay: 340 },
  { text: "  Status: warning", tone: "warning", delay: 300 },
  { text: "  Findings are advisory. Nothing was changed.", tone: "dim", delay: 300 },
] as const;

export const DEMO_CHECKS: readonly DemoCheck[] = [
  { label: "Project configuration", status: "pass", count: 1 },
  { label: "Git configuration", status: "warning", count: 2 },
  { label: "Dependencies", status: "pass", count: 2 },
  { label: "Environment files", status: "warning", count: 1 },
  { label: "Security basics", status: "pass", count: 1 },
] as const;

export const DEMO_FINDINGS: readonly DemoFinding[] = [
  {
    id: "env-001",
    severity: "warning",
    category: "environment files",
    title: "Local .env file is not git-ignored",
    location: ".gitignore",
    confidence: "high",
    why:
      "A local .env file can hold credentials and other values that should never be committed. cDoc checks ignore and track status without reading the file contents.",
    recommendation:
      "Add .env to .gitignore, then run git rm --cached .env if the file is already tracked. Keep a committable .env.example with placeholder values instead.",
    evidence: [".env present: yes", "ignored by git: no", "tracked by git: no", "contents read: no"],
  },
  {
    id: "git-001",
    severity: "warning",
    category: "git configuration",
    title: "Common generated paths are not ignored",
    location: ".gitignore",
    confidence: "medium",
    why:
      "Build output and dependency folders can add thousands of unrelated files to a repository and make future scans slower and noisier.",
    recommendation:
      "Add ignore rules for node_modules and the build output directory used by this project.",
    evidence: ["node_modules ignored: no", "dist ignored: no"],
  },
  {
    id: "config-001",
    severity: "info",
    category: "project configuration",
    title: "package.json is present and parses",
    location: "package.json",
    confidence: "high",
    why:
      "A valid manifest gives cDoc a reliable starting point for detecting the project profile and package manager.",
    recommendation: "No action needed.",
    evidence: ["JSON parse: ok", "name: present", "version: present"],
  },
] as const;

export const DEMO_SUMMARY = "5 checks · 3 passed · 2 warning · 0 failed";

export const REDUCED_MOTION_STATUS =
  "Illustrative scan complete. Five checks ran: three passed and two have warnings. No project files were changed.";
