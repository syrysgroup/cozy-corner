import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrowseByCities } from "@/components/BrowseByCities";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedAgents } from "@/components/FeaturedAgents";
import { DualCTA } from "@/components/DualCTA";
import { TrustBadges } from "@/components/TrustBadges";
import { Footer } from "@/components/Footer";
import { Language } from "@/lib/i18n";

const Index = () => {
  const [lang] = useState<Language>('en');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero lang={lang} />
      <BrowseByCities lang={lang} />
      <FeaturedProperties lang={lang} />
      <WhyChooseUs lang={lang} />
      <HowItWorks lang={lang} />
      <Testimonials lang={lang} />
      <FeaturedAgents lang={lang} />
      <DualCTA lang={lang} />
      <TrustBadges lang={lang} />
      <Footer lang={lang} />
    </div>
  );
};

export default Index;
