import { CommunitySection } from "@/components/sections/CommunitySection";
import { DiagnosticShowcase } from "@/components/sections/DiagnosticShowcase";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Hero } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { InstallSection } from "@/components/sections/InstallSection";
import { PrivacySection } from "@/components/sections/PrivacySection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { TerminalDemo } from "@/components/sections/TerminalDemo";

export default function Home() {
  return (
    <>
      <Hero />
      <TerminalDemo />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DiagnosticShowcase />
      <PrivacySection />
      <CommunitySection />
      <InstallSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
