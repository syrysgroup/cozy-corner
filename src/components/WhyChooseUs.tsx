import { Language, useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Brain, Lock, Headphones, Globe2, TrendingUp } from "lucide-react";

interface WhyChooseUsProps {
  lang: Language;
}

export const WhyChooseUs = ({ lang }: WhyChooseUsProps) => {
  const t = useTranslation(lang);

  const features = [
    {
      icon: ShieldCheck,
      title: t.whyChoose?.verified?.title || "Verified Listings",
      description: t.whyChoose?.verified?.description || "All properties are verified by our team for authenticity and accuracy",
      color: "text-emerald-500"
    },
    {
      icon: Brain,
      title: t.whyChoose?.ai?.title || "Smart Search",
      description: t.whyChoose?.ai?.description || "AI-powered search helps you find the perfect property faster",
      color: "text-primary"
    },
    {
      icon: Lock,
      title: t.whyChoose?.secure?.title || "Secure Transactions",
      description: t.whyChoose?.secure?.description || "Your data and transactions are protected with bank-level security",
      color: "text-amber-500"
    },
    {
      icon: Headphones,
      title: t.whyChoose?.support?.title || "24/7 Support",
      description: t.whyChoose?.support?.description || "Our dedicated team is here to help you every step of the way",
      color: "text-rose-500"
    },
    {
      icon: Globe2,
      title: t.whyChoose?.bilingual?.title || "Fully Bilingual",
      description: t.whyChoose?.bilingual?.description || "Complete English and French support across the entire platform",
      color: "text-sky-500"
    },
    {
      icon: TrendingUp,
      title: t.whyChoose?.insights?.title || "Market Insights",
      description: t.whyChoose?.insights?.description || "Access real-time market data and pricing trends",
      color: "text-violet-500"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.whyChoose?.title || "Why Choose Multilisting"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.whyChoose?.subtitle || "The most trusted platform for real estate in Canada"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-muted mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
