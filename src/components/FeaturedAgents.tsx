import { Language, useTranslation } from "@/lib/i18n";
import { getTopAgents, getAgentBio } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Home, Mail, Phone } from "lucide-react";

interface FeaturedAgentsProps {
  lang: Language;
}

export const FeaturedAgents = ({ lang }: FeaturedAgentsProps) => {
  const t = useTranslation(lang);
  const agents = getTopAgents();

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.featuredAgents?.title || "Meet Our Top Agents"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.featuredAgents?.subtitle || "Work with experienced professionals who know your market"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => (
            <Card 
              key={agent.id} 
              className="bg-card border-border overflow-hidden hover:shadow-xl transition-all duration-300 group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                {/* Agent Photo */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm">{agent.rating}</span>
                </div>
              </div>

              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1">{agent.name}</h3>
                
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{agent.city}, {agent.province}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{agent.listings_count} {t.featuredAgents?.listingsLabel || "listings"}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agent.reviews_count} {t.featuredAgents?.reviewsLabel || "reviews"}
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    {t.featuredAgents?.emailLabel || "Email"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {t.featuredAgents?.callLabel || "Call"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" size="lg">
            {t.featuredAgents?.viewAllButton || "View All Agents"}
          </Button>
        </div>
      </div>
    </section>
  );
};
