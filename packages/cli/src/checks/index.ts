import { CheckRegistry } from "../engine/registry.js";
import { dependenciesCheck } from "./dependencies.js";
import { environmentCheck } from "./environment.js";
import { gitCheck } from "./git.js";
import { projectCheck } from "./project.js";
import { securityCheck } from "./security.js";

/**
 * The default check set. Checks are registered, never hard-coded into the
 * scanner, so future checks can be added here or supplied by a caller.
 */
export function createDefaultRegistry(): CheckRegistry {
  return new CheckRegistry()
    .register(projectCheck)
    .register(gitCheck)
    .register(dependenciesCheck)
    .register(environmentCheck)
    .register(securityCheck);
}

export {
  dependenciesCheck,
  environmentCheck,
  gitCheck,
  projectCheck,
  securityCheck,
};
