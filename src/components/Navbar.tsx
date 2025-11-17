import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Language, useTranslation } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [lang, setLang] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const t = useTranslation(lang);

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Multilisting</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/properties" className="text-foreground hover:text-primary transition-colors">
              {t.nav.properties}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {t.nav.about}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                {t.nav.dashboard}
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
            {user ? (
              <Button onClick={signOut}>{t.nav.signOut}</Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">{t.nav.signIn}</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/auth">{t.nav.getStarted}</Link>
                </Button>
              </>
            )}
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
              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.home}
              </Link>
              <Link to="/properties" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.properties}
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors py-2">
                {t.nav.about}
              </Link>
              {user && (
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors py-2">
                  {t.nav.dashboard}
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <Button onClick={signOut} className="w-full">{t.nav.signOut}</Button>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/auth">{t.nav.signIn}</Link>
                    </Button>
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link to="/auth">{t.nav.getStarted}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
