/**
 * Defence in depth: findings never carry file contents, but every free-text
 * field is also scrubbed so a malformed call cannot leak a credential-shaped
 * value into terminal or JSON output.
 */
const REDACTIONS: readonly RegExp[] = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
  /\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{16,}\b/g,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  /\bnpm_[A-Za-z0-9]{20,}\b/g,
  /\bsk_live_[0-9A-Za-z]{20,}\b/g,
  /\bAIza[0-9A-Za-z_-]{30,}\b/g,
  /\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*[^\s,;"']+/gi,
];

export function redactSensitiveText(text: string): string {
  let redacted = text;
  for (const pattern of REDACTIONS) {
    redacted = redacted.replace(pattern, "[redacted]");
  }
  return redacted;
}
