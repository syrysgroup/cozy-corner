import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Language, useTranslation } from '@/lib/i18n';
import { Building2, Users, Shield } from 'lucide-react';

export default function About() {
  const [lang] = useState<Language>('en');
  const t = useTranslation(lang);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              {t.about.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.about.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 animate-scale-in">
              <Building2 className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.about.mission}</h2>
              <p className="text-muted-foreground">{t.about.missionText}</p>
            </div>

            <div className="p-8 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <Shield className="h-12 w-12 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.about.vision}</h2>
              <p className="text-muted-foreground">{t.about.visionText}</p>
            </div>
          </div>

          <div className="text-center p-12 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-fade-up">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{t.trust.title}</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-lg font-semibold text-foreground">{t.trust.verified}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{t.trust.secure}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{t.trust.support}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
