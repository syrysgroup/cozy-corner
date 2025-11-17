import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { Footer } from "@/components/Footer";
import { Language } from "@/lib/i18n";

const Index = () => {
  const [lang] = useState<Language>('en');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero lang={lang} />
      <FeaturedProperties lang={lang} />
      <HowItWorks lang={lang} />
      <TrustBadges lang={lang} />
      <Footer lang={lang} />
    </div>
  );
};

export default Index;
