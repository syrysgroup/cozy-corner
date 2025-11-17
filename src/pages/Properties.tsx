import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeaturedProperties } from '@/components/FeaturedProperties';
import { Language } from '@/lib/i18n';

export default function Properties() {
  const [lang] = useState<Language>('en');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FeaturedProperties lang={lang} />
      </div>
      <Footer lang={lang} />
    </div>
  );
}
