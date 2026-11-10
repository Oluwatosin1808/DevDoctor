import type { Metadata } from "next";
import Link from "next/link";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { Container } from "@/components/ui/Container";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { COMMANDS, LINKS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Install DevDoctor, run your first checkup, and understand the five diagnostic checks, the scoring model and the exit codes.",
  alternates: {
    canonical: "/docs",
  },
};

const TOC = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage and options" },
  { id: "checks", label: "The five checks" },
  { id: "scoring", label: "Scoring" },
  { id: "exit-codes", label: "Exit codes" },
  { id: "troubleshooting", label: "Troubleshooting" },
] as const;

const OPTIONS: Array<[string, string]> = [
  ["--cwd <path>", "Scan a directory other than the current one."],
  ["--json", "Emit machine-readable JSON instead of the terminal report."],
  [
    "--strict",
    "Exit non-zero on warnings as well as errors — useful in CI.",
  ],
  ["--color", "Force ANSI colour on, even when output is piped."],
  ["--no-color", "Force ANSI colour off."],
  ["-h, --help", "Show usage."],
  ["-v, --version", "Show the installed version."],
];

const EXIT_CODES: Array<[string, string]> = [
  ["0", "The scan completed with no errors."],
  ["1", "Errors were found — or warnings, when --strict is set."],
  ["2", "Invalid usage, such as an unknown option."],
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
      <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-foreground sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
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
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <div className="mt-1.5 space-y-2 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
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
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-raised">
            <th
              scope="col"
              className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-dim uppercase"
            >
              {head[0]}
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-dim uppercase"
            >
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key} className="border-b border-line last:border-b-0">
              <td className="w-[38%] px-4 py-3 align-top font-mono text-[13px] text-foreground">
                {key}
              </td>
              <td className="px-4 py-3 align-top text-muted">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  const npmLive = LINKS.npm !== null;

  return (
    <>
      {/* Page header */}
      <div className="border-b border-line bg-panel">
        <Container className="pt-16 pb-14 sm:pt-20 sm:pb-16">
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
            <span aria-hidden className="h-px w-6 shrink-0 bg-accent/50" />
            Documentation
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.06] font-medium tracking-[-0.03em] text-balance text-foreground sm:text-5xl">
            Run your first checkup.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Everything you need to install {SITE.name}, understand what it looks
            at, and read the report it produces.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
          {/* On-this-page navigation */}
          <nav
            aria-label="On this page"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-dim uppercase">
              On this page
            </p>
            <ul className="mt-4 space-y-1 border-l border-line">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <article className="min-w-0 space-y-14">
            <DocSection id="introduction" title="Introduction">
              <p>
                {SITE.name} examines a JavaScript or TypeScript project and
                reports what needs attention across five areas: project
                configuration, dependencies, environment variables, git
                configuration and security. Every finding is graded, and the
                findings reduce to a single score out of 100.
              </p>
              <p>
                It runs entirely on your machine. Nothing is uploaded, no
                account is required, and it never modifies your source files —
                it only reads them.
              </p>
            </DocSection>

            <DocSection id="installation" title="Installation">
              <p>Install the CLI globally:</p>
              <CommandBlock
                command={COMMANDS.installGlobal}
                caption="Installs the CLI globally."
                copyLabel="Copy the global install command"
              />

              <p className="pt-2">Or run a scan without installing anything:</p>
              <CommandBlock
                command={COMMANDS.installNpx}
                caption="Or run a scan without installing anything."
                copyLabel="Copy the npx command"
              />

              {npmLive ? null : (
                <div className="rounded-xl border border-line bg-raised p-4">
                  <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase">
                    Not published yet
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    The package is not on npm yet, so those commands will not
                    resolve. Until the first release, clone{" "}
                    <ExternalAction
                      linkKey="github"
                      href={LINKS.github}
                      className="whitespace-nowrap text-foreground underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-accent focus-visible:outline-none"
                    >
                      the repository
                    </ExternalAction>{" "}
                    and run it from source with{" "}
                    <code className="font-mono text-[13px] text-foreground">
                      npm install
                    </code>{" "}
                    followed by{" "}
                    <code className="font-mono text-[13px] text-foreground">
                      node packages/cli/bin/devdoctor.js scan
                    </code>
                    .
                  </p>
                </div>
              )}
            </DocSection>

            <DocSection id="usage" title="Usage and options">
              <p>
                <code className="font-mono text-[13px] text-foreground">
                  scan
                </code>{" "}
                is the default command, so these are equivalent:
              </p>
              <CommandBlock
                command="devdoctor"
                prompt="›"
                copyLabel="Copy the bare command"
              />
              <CommandBlock
                command="devdoctor scan"
                prompt="›"
                copyLabel="Copy the scan command"
              />

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
                Each check emits individual findings marked as passing, a
                warning or an error.
              </p>

              <DocSub title="Project configuration">
                <p>
                  Confirms <code className="font-mono text-[13px] text-foreground">package.json</code>{" "}
                  exists and parses, declares{" "}
                  <code className="font-mono text-[13px] text-foreground">name</code>,{" "}
                  <code className="font-mono text-[13px] text-foreground">version</code>,{" "}
                  <code className="font-mono text-[13px] text-foreground">description</code> and{" "}
                  <code className="font-mono text-[13px] text-foreground">license</code>,
                  pins <code className="font-mono text-[13px] text-foreground">engines.node</code>,
                  defines scripts, and ships a{" "}
                  <code className="font-mono text-[13px] text-foreground">tsconfig.json</code>{" "}
                  when TypeScript sources are present.
                </p>
              </DocSub>

              <DocSub title="Dependencies">
                <p>
                  Requires a lockfile so installs are reproducible, flags any
                  dependency range that pins nothing at all, and catches
                  packages declared in both{" "}
                  <code className="font-mono text-[13px] text-foreground">dependencies</code> and{" "}
                  <code className="font-mono text-[13px] text-foreground">devDependencies</code>.
                </p>
              </DocSub>

              <DocSub title="Environment variables">
                <p>
                  Confirms local <code className="font-mono text-[13px] text-foreground">.env</code>{" "}
                  files are git-ignored and untracked, and that a committable{" "}
                  <code className="font-mono text-[13px] text-foreground">.env.example</code>{" "}
                  documents the required variables. Environment files are never
                  read — only their presence, ignore status and track status.
                </p>
              </DocSub>

              <DocSub title="Git configuration">
                <p>
                  Checks that a repository exists, that{" "}
                  <code className="font-mono text-[13px] text-foreground">.gitignore</code>{" "}
                  covers <code className="font-mono text-[13px] text-foreground">node_modules</code> and{" "}
                  <code className="font-mono text-[13px] text-foreground">.env</code>, and that no
                  build output or dependencies are tracked.
                </p>
              </DocSub>

              <DocSub title="Security checks">
                <p>
                  Scans the files git tracks for credential-shaped strings —
                  private keys and AWS, GitHub, Slack, npm, Stripe and Google
                  tokens — and flags any npm script that pipes a download
                  straight into a shell. It prefers{" "}
                  <code className="font-mono text-[13px] text-foreground">git ls-files</code>{" "}
                  because that is what actually leaves your machine, and falls
                  back to a filesystem walk when git is unavailable.
                </p>
              </DocSub>
            </DocSection>

            <DocSection id="scoring" title="Scoring">
              <p>
                The scan starts at 100 and deducts points for every finding that
                is not a pass. The score is floored at 0.
              </p>

              <Table
                caption="Points deducted per finding severity"
                head={["Severity", "Deduction"]}
                rows={[
                  ["Pass", "0 points"],
                  ["Warning", "4 points"],
                  ["Error", "12 points"],
                ]}
              />

              <Table
                caption="Score bands"
                head={["Score", "Meaning"]}
                rows={[
                  ["90–100", "Healthy."],
                  ["70–89", "Needs attention."],
                  ["0–69", "At risk."],
                ]}
              />
            </DocSection>

            <DocSection id="exit-codes" title="Exit codes">
              <p>
                Exit codes are designed to be scripted, so CI can gate on a
                scan without parsing the report.
              </p>

              <Table
                caption="Process exit codes"
                head={["Code", "Meaning"]}
                rows={EXIT_CODES}
              />
            </DocSection>

            <DocSection id="troubleshooting" title="Troubleshooting">
              <DocSub title="“No lockfile found”">
                <p>
                  Run <code className="font-mono text-[13px] text-foreground">npm install</code>{" "}
                  to generate <code className="font-mono text-[13px] text-foreground">package-lock.json</code>,
                  or commit the lockfile your package manager already produced.
                </p>
              </DocSub>

              <DocSub title="“TypeScript sources found but no tsconfig.json”">
                <p>
                  The check searches the whole project, not just the directory
                  you scanned, so a config in a parent folder counts. If nothing
                  is found anywhere, add one with{" "}
                  <code className="font-mono text-[13px] text-foreground">npx tsc --init</code>.
                </p>
              </DocSub>

              <DocSub title="Colour codes appear in my output file">
                <p>
                  Colour is enabled automatically only when stdout is a
                  terminal. Force it off with{" "}
                  <code className="font-mono text-[13px] text-foreground">--no-color</code>, or set
                  the <code className="font-mono text-[13px] text-foreground">NO_COLOR</code>{" "}
                  environment variable.
                </p>
              </DocSub>
            </DocSection>

            {/* Footer nav */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
              <Link
                href="/"
                className="text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              >
                ← Back to the homepage
              </Link>
              <ExternalAction
                linkKey="github"
                href={LINKS.github}
                className="text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
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
