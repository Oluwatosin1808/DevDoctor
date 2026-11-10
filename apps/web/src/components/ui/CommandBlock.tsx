import { CopyButton } from "./CopyButton";

interface CommandBlockProps {
  command: string;
  /** Prefix shown before the command. Pass `null` to hide it. */
  prompt?: string | null;
  caption?: string;
  className?: string;
  copyLabel?: string;
}

/** A terminal-styled command row with a working copy button. */
export function CommandBlock({
  command,
  prompt = "$",
  caption,
  className = "",
  copyLabel = "Copy command",
}: CommandBlockProps) {
  return (
    <div className={className}>
      <div className="group flex items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3 transition-colors duration-200 focus-within:border-line-strong hover:border-line-strong">
        {prompt ? (
          <span
            aria-hidden
            className="shrink-0 font-mono text-sm text-accent select-none"
          >
            {prompt}
          </span>
        ) : null}

        <code className="scrollbar-slim min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-foreground">
          {command}
        </code>

        <CopyButton value={command} label={copyLabel} />
      </div>

      {caption ? (
        <p className="mt-2 pl-1 font-mono text-[11px] text-dim">{caption}</p>
      ) : null}
    </div>
  );
}
