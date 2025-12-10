import { Language, useTranslation } from "@/lib/i18n";
import { MOCK_TESTIMONIALS, getTestimonialText } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials = ({ lang }: TestimonialsProps) => {
  const t = useTranslation(lang);

  const roleLabels: Record<string, { en: string; fr: string }> = {
    buyer: { en: "Home Buyer", fr: "Acheteur" },
    seller: { en: "Home Seller", fr: "Vendeur" },
    renter: { en: "Renter", fr: "Locataire" },
    landlord: { en: "Landlord", fr: "Propriétaire" }
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.testimonials?.title || "What Our Clients Say"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.testimonials?.subtitle || "Join thousands of satisfied buyers, sellers, and renters"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{getTestimonialText(testimonial, lang)}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'fr' ? roleLabels[testimonial.role].fr : roleLabels[testimonial.role].en} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
