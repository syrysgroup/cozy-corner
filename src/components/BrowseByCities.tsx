import { Link } from "react-router-dom";
import { Language, useTranslation } from "@/lib/i18n";
import { MOCK_CITIES } from "@/data/mockData";
import { MapPin } from "lucide-react";

interface BrowseByCitiesProps {
  lang: Language;
}

export const BrowseByCities = ({ lang }: BrowseByCitiesProps) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.browseCities?.title || "Browse by City"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.browseCities?.subtitle || "Discover properties in Canada's most vibrant cities"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CITIES.map((city, index) => (
            <Link
              key={city.id}
              to={`/search?city=${city.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{city.province}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {city.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {city.properties_count.toLocaleString()} {t.browseCities?.propertiesLabel || "properties"}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
