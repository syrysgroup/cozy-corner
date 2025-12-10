import { Link } from "react-router-dom";
import { Language, useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowRight } from "lucide-react";

interface DualCTAProps {
  lang: Language;
}

export const DualCTA = ({ lang }: DualCTAProps) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Looking to Buy/Rent */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-primary-foreground animate-fade-up group">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full filter blur-2xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-6">
                <Search className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t.dualCta?.buy?.title || "Looking to Buy or Rent?"}
              </h3>
              
              <p className="text-primary-foreground/80 mb-6 text-lg leading-relaxed">
                {t.dualCta?.buy?.description || "Explore thousands of verified listings across Canada. Find your perfect home today."}
              </p>

              <Link to="/search">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="group/btn"
                >
                  {t.dualCta?.buy?.button || "Browse Properties"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Looking to Sell/List */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent/80 p-8 md:p-12 text-accent-foreground animate-fade-up group" style={{ animationDelay: '0.1s' }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full filter blur-2xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-6">
                <Home className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t.dualCta?.sell?.title || "Ready to List Your Property?"}
              </h3>
              
              <p className="text-accent-foreground/80 mb-6 text-lg leading-relaxed">
                {t.dualCta?.sell?.description || "Reach thousands of potential buyers and renters. List your property in minutes."}
              </p>

              <Link to="/create-listing">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="group/btn"
                >
                  {t.dualCta?.sell?.button || "Create Listing"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
