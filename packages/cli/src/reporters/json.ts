import type { ScanReport } from "../types.js";

/** Complete structured report, with no ANSI codes or progress text. */
export function formatJson(report: ScanReport): string {
  return JSON.stringify(report, null, 2);
}

export interface JsonError {
  tool: "cdoc";
  ok: false;
  error: { code: string; message: string; stack?: string };
}

export function formatJsonError(code: string, message: string, stack?: string): string {
  const payload: JsonError = {
    tool: "cdoc",
    ok: false,
    error: { code, message, ...(stack !== undefined ? { stack } : {}) },
  };
  return JSON.stringify(payload, null, 2);
}
