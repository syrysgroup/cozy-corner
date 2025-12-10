import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Language, useTranslation } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FooterProps {
  lang: Language;
}

export const Footer = ({ lang }: FooterProps) => {
  const t = useTranslation(lang);

  return (
    <footer className="bg-card border-t border-border py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Multilisting</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">{t.footer.description}</p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.forBuyers}</Link></li>
              <li><Link to="/create-listing" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.forSellers}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.forAgents}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t.footer.company}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.aboutUs}</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.careers}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t.footer.contact}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t.footer.newsletter}</h3>
            <div className="flex gap-2">
              <Input placeholder={t.footer.newsletterPlaceholder} className="bg-muted border-border" />
              <Button size="icon" className="shrink-0"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-primary transition-colors">{t.footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
