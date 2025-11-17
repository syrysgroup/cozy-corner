import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Language, useTranslation } from "@/lib/i18n";

interface FeaturedPropertiesProps {
  lang: Language;
}

const properties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    price: 849000,
    address: "123 Maple Street",
    city: "Toronto, ON",
    beds: 4,
    baths: 3,
    sqft: 2400,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    price: 1250000,
    address: "456 Oak Avenue",
    city: "Vancouver, BC",
    beds: 5,
    baths: 4,
    sqft: 3200,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    price: 675000,
    address: "789 Pine Road",
    city: "Montreal, QC",
    beds: 3,
    baths: 2,
    sqft: 1800,
  },
];

export const FeaturedProperties = ({ lang }: FeaturedPropertiesProps) => {
  const t = useTranslation(lang);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="properties" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.featured.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t.featured.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.address}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold">
                  {formatPrice(property.price)}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{property.address}</h3>
                    <p className="text-muted-foreground">{property.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    <span>{property.beds} {t.featured.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    <span>{property.baths} {t.featured.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5" />
                    <span>{property.sqft.toLocaleString()} {t.featured.sqft}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="text-lg">
            {t.featured.viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
};
