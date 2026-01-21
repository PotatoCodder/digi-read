import Image from "next/image";
import HeroSection from "@/components/layout/hero";
import Features from "@/components/layout/marque/features";
import Insights from "@/components/layout/insights";
import RealtimeReadingTracker from "@/components/layout/features/SpeechRecognition";
import DemoFeature from "@/components/layout/features/demo";
import SchoolTestimonials from "@/components/layout/marque/tesstemonials";
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <DemoFeature />
      <Insights />
      <SchoolTestimonials />
    </div>
  );
}