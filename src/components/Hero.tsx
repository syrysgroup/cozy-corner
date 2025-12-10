import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Language, useTranslation } from "@/lib/i18n";
import { MOCK_STATS } from "@/data/mockData";

interface HeroProps {
  lang: Language;
}

const listingTypes = [
  { key: 'buy', en: 'Buy', fr: 'Acheter' },
  { key: 'rent', en: 'Rent', fr: 'Louer' },
  { key: 'student', en: 'Student', fr: 'Étudiant' },
  { key: 'shared', en: 'Shared', fr: 'Colocation' },
  { key: 'auction', en: 'Auction', fr: 'Enchères' },
];

export const Hero = ({ lang }: HeroProps) => {
  const t = useTranslation(lang);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('buy');

  const handleSearch = () => {
    const typeMap: Record<string, string> = {
      buy: 'sale',
      rent: 'rent',
      student: 'student',
      shared: 'shared',
      auction: 'auction',
    };
    navigate(`/search?city=${encodeURIComponent(searchQuery)}&type=${typeMap[selectedType]}`);
  };

  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
          alt="Luxury home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {lang === 'fr' ? 'Propulsé par l\'IA' : 'AI-Powered Search'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {t.hero.title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {listingTypes.map((type) => (
              <Badge
                key={type.key}
                variant={selectedType === type.key ? "default" : "outline"}
                className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                  selectedType === type.key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedType(type.key)}
              >
                {lang === 'fr' ? type.fr : type.en}
              </Badge>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex gap-2 p-2 bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t.hero.searchPlaceholder}
                  className="border-0 focus-visible:ring-0 bg-transparent text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-lg h-12 rounded-xl"
                onClick={handleSearch}
              >
                {t.hero.searchButton}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {MOCK_STATS.properties.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">{t.stats.properties}</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {MOCK_STATS.agents.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">{t.stats.agents}</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {MOCK_STATS.cities}+
              </div>
              <div className="text-muted-foreground font-medium">{t.stats.cities}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
