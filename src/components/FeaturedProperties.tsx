import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Language, useTranslation } from "@/lib/i18n";
import { MOCK_PROPERTIES, MOCK_AGENTS, getPropertyTitle, MockProperty } from "@/data/mockData";
import { Link } from "react-router-dom";

interface FeaturedPropertiesProps {
  lang: Language;
}

export const FeaturedProperties = ({ lang }: FeaturedPropertiesProps) => {
  const t = useTranslation(lang);

  // Get 6 featured properties
  const featuredProperties = MOCK_PROPERTIES.filter(p => p.featured).slice(0, 6);

  const formatPrice = (property: MockProperty) => {
    const price = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(property.price);

    if (property.listing_type === 'rent' || property.listing_type === 'student' || property.listing_type === 'shared') {
      return `${price}/${lang === 'fr' ? 'mois' : 'mo'}`;
    }
    return price;
  };

  const getAgent = (agentId?: string) => {
    return MOCK_AGENTS.find(a => a.id === agentId);
  };

  const getListingTypeBadge = (type: string) => {
    const labels: Record<string, { en: string; fr: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      sale: { en: "For Sale", fr: "À vendre", variant: "default" },
      rent: { en: "For Rent", fr: "À louer", variant: "secondary" },
      student: { en: "Student", fr: "Étudiant", variant: "outline" },
      shared: { en: "Shared", fr: "Colocation", variant: "outline" },
      co_ownership: { en: "Co-ownership", fr: "Copropriété", variant: "secondary" },
      auction: { en: "Auction", fr: "Enchères", variant: "destructive" },
    };
    return labels[type] || { en: type, fr: type, variant: "default" as const };
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
          {featuredProperties.map((property, index) => {
            const agent = getAgent(property.agent_id);
            const badge = getListingTypeBadge(property.listing_type);
            
            return (
              <Card
                key={property.id}
                className="overflow-hidden group hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-scale-in border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image_urls[0]}
                    alt={getPropertyTitle(property, lang)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price tag */}
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold shadow-lg">
                    {formatPrice(property)}
                  </div>
                  
                  {/* Listing type badge */}
                  <Badge 
                    variant={badge.variant}
                    className="absolute top-4 left-4"
                  >
                    {lang === 'fr' ? badge.fr : badge.en}
                  </Badge>
                  
                  {/* Save button */}
                  <button className="absolute bottom-4 right-4 p-2 bg-background/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
                    <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>

                  {/* Image count indicator */}
                  {property.image_urls.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {property.image_urls.slice(0, 4).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} 
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">
                        {getPropertyTitle(property, lang)}
                      </h3>
                      <p className="text-muted-foreground">{property.city}, {property.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">{property.property_size.toLocaleString()} {t.featured.sqft}</span>
                    </div>
                  </div>

                  {/* Agent info */}
                  {agent && (
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <img 
                        src={agent.avatar} 
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.city}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/properties">
            <Button size="lg" variant="outline" className="text-lg px-8">
              {t.featured.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
