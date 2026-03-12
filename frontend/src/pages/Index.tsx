// src/pages/Index.tsx
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import TrendsSection from "@/components/TrendsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection /> {/* ← Widget maintenant intégré ici */}
      <StatsSection />
      <FeaturesSection />
      <TrendsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;