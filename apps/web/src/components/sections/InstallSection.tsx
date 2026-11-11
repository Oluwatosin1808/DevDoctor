import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS, COMMANDS, LINKS } from "@/lib/site";

const COMMANDS_TO_SHOW = [
  {
    command: COMMANDS.installGlobal,
    caption: "Install the CLI globally.",
  },
  {
    command: COMMANDS.installNpx,
    caption: "Or run a scan without installing anything.",
  },
  {
    command: COMMANDS.scan,
    caption: "Run your first checkup inside a project.",
  },
] as const;

export function InstallSection() {
  const npmPending = LINKS.npm === null;

  return (
    <Section id={ANCHORS.install} tone="panel">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          align="center"
          eyebrow="Get started"
          title="Run your first checkup."
          description="Add DevDoctor to your workflow and scan a project in under a minute."
        />

        <Reveal delay={0.08}>
          <div className="mt-10 rounded-2xl border border-line bg-surface p-5 shadow-[0_32px_80px_-56px_rgba(0,0,0,0.9)] sm:p-6">
            <div className="flex flex-col gap-4">
              {COMMANDS_TO_SHOW.map((item) => (
                <CommandBlock
                  key={item.command}
                  command={item.command}
                  caption={item.caption}
                  copyLabel={`Copy command ${item.command}`}
                />
              ))}
            </div>

            {npmPending ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3.5">
                <span
                  aria-hidden
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                />
                <p className="text-[13px] leading-relaxed text-muted">
                  <span className="font-medium text-foreground">
                    Coming soon.
                  </span>{" "}
                  The npm package hasn&apos;t been published yet, so these
                  commands won&apos;t resolve until the first release ships.
                  They&apos;re here so you can see exactly how quick setup will
                  be.
                </p>
              </div>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-6 text-center text-[13px] text-dim">
            Requires Node.js 20 or newer. Works on macOS, Linux and Windows.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
