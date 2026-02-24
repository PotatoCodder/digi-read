import HeroSection from "@/components/layout/hero";
import DemoFeature from "@/components/layout/features/demo";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DemoFeature />
    </div>
  );
}