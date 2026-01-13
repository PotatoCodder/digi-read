import Image from "next/image";
import HeroSection from "@/components/layout/hero";
import Features from "@/components/layout/marque/features";
import Insights from "@/components/layout/insights";
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <Insights />
    </div>
  );
}