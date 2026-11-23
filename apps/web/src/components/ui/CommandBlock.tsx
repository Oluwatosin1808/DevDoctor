import { CopyButton } from "./CopyButton";

interface CommandBlockProps {
  command: string;
  /** Prefix shown before the command. Pass `null` to hide it. */
  prompt?: string | null;
  caption?: string;
  className?: string;
  copyLabel?: string;
  tone?: "light" | "dark";
}

/** A terminal-styled command row with a working copy button. */
export function CommandBlock({
  command,
  prompt = "$",
  caption,
  className = "",
  copyLabel = "Copy command",
  tone = "light",
}: CommandBlockProps) {
  const dark = tone === "dark";

  return (
    <div className={className}>
      <div
        className={[
          "group flex min-w-0 items-center gap-3 rounded-lg border px-4 py-3",
          dark
            ? "border-rule-dark bg-charcoal"
            : "border-rule bg-paper hover:border-ink/30",
        ].join(" ")}
      >
        {prompt ? (
          <span aria-hidden className={`shrink-0 font-mono text-sm font-medium select-none ${dark ? "text-lime" : "text-ink"}`}>
            {prompt}
          </span>
        ) : null}

        <code className={`scrollbar-slim min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap ${dark ? "text-dark-ink" : "text-ink"}`}>
          {command}
        </code>

        <CopyButton value={command} label={copyLabel} tone={tone} />
      </div>

      {caption ? (
        <p className={`mt-2 pl-1 font-mono text-[11px] ${dark ? "text-dark-muted" : "text-muted"}`}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}
