import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMMANDS } from "@/lib/site";

const COMMANDS_TO_SHOW = [
  {
    command: COMMANDS.clone,
    caption: "Get the repository.",
  },
  {
    command: COMMANDS.build,
    caption: "Build the CLI and site from the checkout root.",
  },
  {
    command: COMMANDS.scan,
    caption: "Run a local diagnostic pass.",
  },
] as const;

export function InstallSection() {
  return (
    <Section id="install" tone="paper">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <SectionHeading
          eyebrow="From source"
          title="Run cDoc from this checkout."
          description="The CLI is private and is not advertised as an npm package. These commands work after cloning the repository. Requires Node.js 20 or newer."
        />

        <Reveal delay={0.08}>
          <div className="flex flex-col gap-5">
            {COMMANDS_TO_SHOW.map((item) => (
              <CommandBlock
                key={item.command}
                command={item.command}
                caption={item.caption}
                copyLabel={`Copy command ${item.command}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
