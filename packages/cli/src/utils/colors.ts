const ANSI: Record<string, number> = {
  bold: 1,
  dim: 2,
  red: 31,
  green: 32,
  yellow: 33,
  cyan: 36,
};

export type Paint = (name: string, text: string) => string;

/** ANSI colours are opt-in; every reporter must look correct when disabled. */
export function makePaint(enabled: boolean): Paint {
  return (name, text) => {
    const code = ANSI[name];
    if (!enabled || code === undefined) return text;
    return `\u001b[${code}m${text}\u001b[0m`;
  };
}
