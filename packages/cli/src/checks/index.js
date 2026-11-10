import { checkDependencies } from "./dependencies.js";
import { checkEnvironment } from "./environment.js";
import { checkGit } from "./git.js";
import { checkProject } from "./project.js";
import { checkSecurity } from "./security.js";

/**
 * The check registry. Titles deliberately mirror the diagnostic panel on the
 * marketing site so the CLI and the website describe the same five areas.
 */
export const CHECKS = [
  {
    id: "project",
    title: "Project configuration",
    run: checkProject,
  },
  {
    id: "dependencies",
    title: "Dependencies",
    run: checkDependencies,
  },
  {
    id: "environment",
    title: "Environment variables",
    run: checkEnvironment,
  },
  {
    id: "git",
    title: "Git configuration",
    run: checkGit,
  },
  {
    id: "security",
    title: "Security checks",
    run: checkSecurity,
  },
];
