import { Shield, Lock, Headphones } from "lucide-react";
import { Language, useTranslation } from "@/lib/i18n";

interface TrustBadgesProps {
  lang: Language;
}

export const TrustBadges = ({ lang }: TrustBadgesProps) => {
  const t = useTranslation(lang);

  const badges = [
    {
      icon: Shield,
      text: t.trust.verified,
    },
    {
      icon: Lock,
      text: t.trust.secure,
    },
    {
      icon: Headphones,
      text: t.trust.support,
    },
  ];

  return (
    <section className="py-16 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-up">
          {t.trust.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Icon className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium">{badge.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
