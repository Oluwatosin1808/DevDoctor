import { CdocError } from "../errors.js";
import type { DiagnosticCheck } from "../types.js";

/** Registry of independent checks. Duplicate IDs are rejected to keep findings traceable. */
export class CheckRegistry {
  readonly #checks = new Map<string, DiagnosticCheck>();

  register(check: DiagnosticCheck): this {
    if (this.#checks.has(check.id)) {
      throw new CdocError(
        "REGISTRATION_ERROR",
        `A diagnostic check with id "${check.id}" is already registered.`,
      );
    }
    this.#checks.set(check.id, check);
    return this;
  }

  get(id: string): DiagnosticCheck | undefined {
    return this.#checks.get(id);
  }

  has(id: string): boolean {
    return this.#checks.has(id);
  }

  all(): DiagnosticCheck[] {
    return [...this.#checks.values()];
  }

  get size(): number {
    return this.#checks.size;
  }
}
