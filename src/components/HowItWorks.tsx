import { Search, UserCheck, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Language, useTranslation } from "@/lib/i18n";

interface HowItWorksProps {
  lang: Language;
}

export const HowItWorks = ({ lang }: HowItWorksProps) => {
  const t = useTranslation(lang);

  const steps = [
    {
      icon: Search,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
    },
    {
      icon: UserCheck,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
    },
    {
      icon: KeyRound,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
