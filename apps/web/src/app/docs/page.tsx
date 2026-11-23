import type { Metadata } from "next";
import Link from "next/link";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { Container } from "@/components/ui/Container";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { COMMANDS, LINKS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Run cDoc from source, understand the five diagnostic checks, the report structure and the exit codes.",
  alternates: {
    canonical: "/docs",
  },
};

const TOC = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "From source" },
  { id: "usage", label: "Usage and options" },
  { id: "checks", label: "The five checks" },
  { id: "report", label: "The report" },
  { id: "exit-codes", label: "Exit codes" },
  { id: "troubleshooting", label: "Troubleshooting" },
] as const;

const OPTIONS: Array<[string, string]> = [
  ["--json", "Emit machine-readable JSON instead of the terminal report."],
  ["--verbose", "Print stack traces for unexpected errors."],
  ["--no-color", "Disable ANSI colour."],
  ["--color", "Force ANSI colour on, even when output is piped."],
  ["--strict", "Exit non-zero on warnings as well as errors."],
  ["--cwd <path>", "Legacy alias for the target directory."],
  ["-h, --help", "Show usage."],
  ["-v, --version", "Show the installed version."],
];

const EXIT_CODES: Array<[string, string]> = [
  ["0", "The scan completed with no failures or errors."],
  ["1", "Errors, failed checks, or warnings with --strict."],
  ["2", "Invalid usage or target."],
];

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[clamp(1.5rem,2.6vw,1.875rem)] leading-tight font-medium tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-7 text-ink/80">{children}</div>
    </section>
  );
}

function DocSub({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-ink">{title}</h3>
      <div className="mt-1.5 space-y-2 text-[15px] leading-7 text-ink/75">{children}</div>
    </div>
  );
}

function Table({
  head,
  rows,
  caption,
}: {
  head: [string, string];
  rows: Array<[string, string]>;
  caption: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-rule bg-canvas">
            <th
              scope="col"
              className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-muted uppercase"
            >
              {head[0]}
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-muted uppercase"
            >
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key} className="border-b border-rule last:border-b-0">
              <td className="w-[38%] px-4 py-3 align-top font-mono text-[13px] text-ink">
                {key}
              </td>
              <td className="px-4 py-3 align-top text-ink/75">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <>
      <div data-theme="dark" className="border-b border-rule-dark bg-charcoal text-dark-ink">
        <Container className="pt-16 pb-14 sm:pt-20 sm:pb-16">
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.18em] text-lime uppercase">
            <span aria-hidden className="size-1.5 bg-lime" />
            Documentation
          </p>

          <h1 className="mt-5 max-w-3xl text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.04em] text-balance">
            Run your first diagnostic pass.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-dark-muted sm:text-lg">
            Everything you need to run {SITE.name} from this checkout, understand what it looks at,
            and read the report it produces.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
              On this page
            </p>
            <ul className="mt-4 space-y-1 border-l border-rule">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors duration-150 hover:border-ink hover:text-ink focus-visible:border-ink focus-visible:text-ink focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 space-y-14">
            <DocSection id="introduction" title="Introduction">
              <p>
                {SITE.name} examines a JavaScript or TypeScript project and reports what needs
                attention across five areas: project configuration, Git configuration, dependencies,
                environment files and basic credential-shape detection.
              </p>
              <p>
                It runs locally, reads only the files a check needs, and never modifies your source
                files. There is deliberately no numeric score to chase: findings are reported as a
                ledger with severity, category, location and a recommendation.
              </p>
            </DocSection>

            <DocSection id="installation" title="From source">
              <p>Clone the repository and build the workspace:</p>
              <CommandBlock
                command={COMMANDS.clone}
                caption="Get the cDoc monorepo."
                copyLabel="Copy the clone command"
              />
              <CommandBlock
                command={COMMANDS.build}
                caption="Run from the repository root after npm install."
                copyLabel="Copy the build command"
              />

              <div className="mt-4 rounded-lg border border-rule bg-canvas p-4">
                <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase">
                  Not an npm package
                </p>
                <p className="mt-2 text-[15px] leading-7 text-ink/75">
                  cDoc is private and is not advertised on npm. Run it from the checkout, or use the
                  workspace bin after installing dependencies. The repository is available on{" "}
                  <ExternalAction
                    linkKey="github"
                    href={LINKS.github}
                    showSoonChip={false}
                    className="whitespace-nowrap text-ink underline decoration-rule underline-offset-4 transition-colors duration-150 hover:decoration-ink focus-visible:outline-none"
                  >
                    GitHub
                  </ExternalAction>
                  .
                </p>
              </div>
            </DocSection>

            <DocSection id="usage" title="Usage and options">
              <p>
                <code className="font-mono text-[13px] text-ink">scan</code> is the default command,
                so these are equivalent when the workspace bin is available:
              </p>
              <CommandBlock command="cdoc" prompt="›" copyLabel="Copy the bare command" />
              <CommandBlock command={COMMANDS.scan} prompt="›" copyLabel="Copy the scan command" />

              <div className="pt-2">
                <Table
                  caption="Command line options"
                  head={["Option", "What it does"]}
                  rows={OPTIONS}
                />
              </div>
            </DocSection>

            <DocSection id="checks" title="The five checks">
              <p>
                Each check emits individual findings marked as passing, a warning or an error.
                Skipped and errored checks are never counted as passes.
              </p>

              <DocSub title="Project configuration">
                <p>
                  Confirms <code className="font-mono text-[13px] text-ink">package.json</code>{" "}
                  exists and parses, declares{" "}
                  <code className="font-mono text-[13px] text-ink">name</code>,{" "}
                  <code className="font-mono text-[13px] text-ink">version</code>,{" "}
                  <code className="font-mono text-[13px] text-ink">description</code> and{" "}
                  <code className="font-mono text-[13px] text-ink">license</code>, pins{" "}
                  <code className="font-mono text-[13px] text-ink">engines.node</code>, defines
                  scripts, and ships a{" "}
                  <code className="font-mono text-[13px] text-ink">tsconfig.json</code> when
                  TypeScript sources are present.
                </p>
              </DocSub>

              <DocSub title="Dependencies">
                <p>
                  Requires a lockfile so installs are reproducible, flags any dependency range that
                  pins nothing at all, and catches packages declared in both{" "}
                  <code className="font-mono text-[13px] text-ink">dependencies</code> and{" "}
                  <code className="font-mono text-[13px] text-ink">devDependencies</code>.
                </p>
              </DocSub>

              <DocSub title="Environment files">
                <p>
                  Confirms local <code className="font-mono text-[13px] text-ink">.env</code> files
                  are git-ignored and untracked, and that a committable{" "}
                  <code className="font-mono text-[13px] text-ink">.env.example</code> documents the
                  required variables. Environment file contents are never read.
                </p>
              </DocSub>

              <DocSub title="Git configuration">
                <p>
                  Checks that a repository exists, that{" "}
                  <code className="font-mono text-[13px] text-ink">.gitignore</code> covers{" "}
                  <code className="font-mono text-[13px] text-ink">node_modules</code> and{" "}
                  <code className="font-mono text-[13px] text-ink">.env</code>, and that no build
                  output or dependencies are tracked.
                </p>
              </DocSub>

              <DocSub title="Security basics">
                <p>
                  Scans tracked files for credential-shaped strings and flags npm scripts that pipe
                  a download straight into a shell. It is a basic signal check, not a complete secret
                  or vulnerability scanner.
                </p>
              </DocSub>
            </DocSection>

            <DocSection id="report" title="The report">
              <p>
                The terminal report shows the detected project profile, per-check status, findings
                grouped by severity and category, and recommended next steps. JSON mode emits the
                same data as one object with a schema version.
              </p>

              <Table
                caption="Report summary fields"
                head={["Field", "Meaning"]}
                rows={[
                  ["profile", "Detected languages, frameworks, runtime and package manager."],
                  ["checks", "Per-check status plus pass, warning, error, skipped and error counts."],
                  ["findings", "Severity, category, confidence, location and recommendation."],
                  ["status", "Overall status derived from the checks that actually ran."],
                ]}
              />
            </DocSection>

            <DocSection id="exit-codes" title="Exit codes">
              <p>
                Exit codes are designed to be scripted, so CI can gate on a scan without parsing the
                report.
              </p>

              <Table caption="Process exit codes" head={["Code", "Meaning"]} rows={EXIT_CODES} />
            </DocSection>

            <DocSection id="troubleshooting" title="Troubleshooting">
              <DocSub title="“No lockfile found”">
                <p>
                  Run <code className="font-mono text-[13px] text-ink">npm install</code> to generate{" "}
                  <code className="font-mono text-[13px] text-ink">package-lock.json</code>, or commit
                  the lockfile your package manager already produced.
                </p>
              </DocSub>

              <DocSub title="“TypeScript sources found but no tsconfig.json”">
                <p>
                  The check searches the whole project, not just the directory you scanned, so a
                  config in a parent folder counts. If nothing is found, add one with{" "}
                  <code className="font-mono text-[13px] text-ink">npx tsc --init</code>.
                </p>
              </DocSub>

              <DocSub title="Colour codes appear in my output file">
                <p>
                  Colour is enabled automatically only when stdout is a terminal. Force it off with{" "}
                  <code className="font-mono text-[13px] text-ink">--no-color</code>, or set the{" "}
                  <code className="font-mono text-[13px] text-ink">NO_COLOR</code> environment
                  variable.
                </p>
              </DocSub>
            </DocSection>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-8">
              <Link
                href="/"
                className="text-sm text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
              >
                ← Back to the homepage
              </Link>
              <ExternalAction
                linkKey="github"
                href={LINKS.github}
                showSoonChip={false}
                className="text-sm text-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink focus-visible:outline-none"
              >
                View the repository
              </ExternalAction>
            </div>
          </article>
        </div>
      </Container>
    </>
  );
}
