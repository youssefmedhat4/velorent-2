import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata: Metadata = {
  title: "VeloRent — Drive the Future",
  description:
    "Premium car rental for those who demand the extraordinary. Browse 500+ vehicles across 50+ cities.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedCars />
      <HowItWorks />
    </>
  );
}
