import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center px-5 py-28 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
          Error 404
        </p>

        <h1 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-balance text-foreground sm:text-4xl">
          This page needs a checkup.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist. Head back to the
          homepage and try again.
        </p>

        <div className="mt-8 flex justify-center">
          <ButtonLink href="/" size="lg">
            Back to homepage
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
