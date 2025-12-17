// app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import StudentStorySection from "@/components/home/StudentStorySection";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14 space-y-14 md:space-y-16">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
    </div>
  );
}
