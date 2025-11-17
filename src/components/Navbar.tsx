import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Language, useTranslation } from "@/lib/i18n";

export const Navbar = () => {
  const [lang, setLang] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslation(lang);

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Multilisting</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              {t.nav.home}
            </a>
            <a href="#properties" className="text-foreground hover:text-primary transition-colors">
              {t.nav.properties}
            </a>
            <a href="#agents" className="text-foreground hover:text-primary transition-colors">
              {t.nav.agents}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              {t.nav.about}
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
            <Button variant="ghost">{t.nav.signIn}</Button>
            <Button className="bg-primary hover:bg-primary/90">{t.nav.getStarted}</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.home}
              </a>
              <a href="#properties" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.properties}
              </a>
              <a href="#agents" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.agents}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.about}
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="w-full">{t.nav.signIn}</Button>
                <Button className="w-full bg-primary hover:bg-primary/90">{t.nav.getStarted}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
