import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Menu, X, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, Wordmark } from "@/components/ds/primitives";
import { LANGS, useI18n } from "@/lib/i18n";
import { NAV, UI } from "@/lib/site";
import { Container } from "./layout-parts";
import { SearchOverlay } from "./SearchOverlay";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { hidden, scrolled };
}

function LanguageSelect({ className, inverse }: { className?: string; inverse?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <label className={cn("flex items-center gap-1.5", className)}>
      <Globe className="size-4" aria-hidden />
      <span className="sr-only">Language</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}
        className={cn("cursor-pointer bg-transparent font-semibold outline-none", inverse && "[&>option]:text-ink")}>
        {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
    </label>
  );
}

export function SiteHeader() {
  const { lang } = useI18n();
  const ui = UI[lang];
  const { hidden, scrolled } = useHideOnScroll();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea,select")) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isHidden = hidden && !menuOpen && !searchOpen;

  return (
    <>
      <a href="#main" className="fixed left-3 top-3 z-[60] -translate-y-20 bg-primary px-4 py-2 font-semibold text-primary-foreground focus:translate-y-0">{ui.skip}</a>
      <header className={cn("sticky top-0 z-40 transition-transform duration-base ease-institutional motion-reduce:transition-none", isHidden && "-translate-y-full")}>
        <Band />
        {/* Utility layer */}
        <div className="hidden bg-ecowas-ocean text-primary-foreground md:block">
          <Container className="flex h-9 items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-primary-foreground/80"><span className="size-1.5 rounded-full bg-ecowas-yellow" aria-hidden />Independent assurance for ECOWAS Institutions</span>
            <nav aria-label="Utility" className="flex items-center gap-5">
              {ui.utility.map(([label, to]) => <Link key={to} to={to} className="text-primary-foreground/85 hover:text-primary-foreground hover:underline underline-offset-4">{label}</Link>)}
              <Link to="/integrityline" className="flex items-center gap-1.5 font-semibold text-ecowas-yellow hover:underline underline-offset-4"><ShieldCheck className="size-3.5" aria-hidden />IntegrityLine</Link>
              <span className="h-4 w-px bg-primary-foreground/25" aria-hidden />
              <LanguageSelect inverse />
            </nav>
          </Container>
        </div>
        {/* Main bar */}
        <div className={cn("border-b border-border bg-background/95 backdrop-blur transition-shadow duration-base", scrolled && "shadow-hairline")}>
          <Container className="flex h-[4.5rem] items-center justify-between gap-6 xl:h-20">
            <Link to="/" aria-label="Office of the Auditor General — home" className="shrink-0 py-2 pr-2"><Wordmark /></Link>
            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {NAV.map((s) => (
                  <li key={s.slug}>
                    <NavLink to={`/${s.slug}`} className={({ isActive }) => cn("relative block px-2.5 py-2 text-small font-semibold text-ink-soft transition-colors duration-fast hover:text-primary after:absolute after:inset-x-2.5 after:-bottom-[1.05rem] after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform after:duration-base", isActive && "text-primary after:scale-x-100")}>
                      {s.label[lang]}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSearchOpen(true)} className="flex h-10 items-center gap-2 rounded-md px-2.5 text-small font-semibold text-ink hover:bg-muted" aria-label={ui.search} aria-keyshortcuts="Control+K">
                <Search className="size-5" aria-hidden /><span className="hidden lg:inline">{ui.search}</span>
                <kbd className="hidden rounded-xs border border-border px-1 font-mono text-[0.65rem] text-muted-foreground 2xl:inline">⌘K</kbd>
              </button>
              <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
                <Dialog.Trigger className="flex h-10 items-center gap-2 rounded-md px-2.5 text-small font-semibold text-ink hover:bg-muted xl:hidden" aria-label={ui.menu}>
                  <Menu className="size-5" aria-hidden /><span className="hidden sm:inline">{ui.menu}</span>
                </Dialog.Trigger>
                <MobileMenu onClose={() => setMenuOpen(false)} />
              </Dialog.Root>
            </div>
          </Container>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { lang } = useI18n();
  const ui = UI[lang];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-overlay data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right motion-reduce:animate-none">
        <Band />
        <div className="flex h-[4.5rem] items-center justify-between border-b border-border px-5">
          <Dialog.Title asChild><span><Wordmark compact /></span></Dialog.Title>
          <Dialog.Close className="flex h-10 items-center gap-2 rounded-md px-2.5 text-small font-semibold hover:bg-muted"><X className="size-5" aria-hidden />{ui.close}</Dialog.Close>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="divide-y divide-border">
            {NAV.map((s, i) => {
              const open = expanded === s.slug;
              return (
                <li key={s.slug}>
                  <div className="flex items-center">
                    <Link to={`/${s.slug}`} onClick={onClose} className="flex flex-1 items-baseline gap-3 py-4 font-display text-h4 text-ink hover:text-primary">
                      <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>{s.label[lang]}
                    </Link>
                    <button type="button" aria-expanded={open} aria-controls={`m-${s.slug}`} aria-label={`${s.label[lang]} sections`} onClick={() => setExpanded(open ? null : s.slug)}
                      className="grid size-10 place-items-center rounded-md text-ink-soft hover:bg-muted">
                      <span className={cn("text-xl leading-none transition-transform duration-base", open && "rotate-45")} aria-hidden>+</span>
                    </button>
                  </div>
                  {open && (
                    <ul id={`m-${s.slug}`} className="grid gap-1 pb-4 pl-8 animate-fade-in">
                      {s.children.map((c) => <li key={c.slug}><Link to={`/${s.slug}/${c.slug}`} onClick={onClose} className="flex items-center gap-2 py-1.5 text-body text-ink-soft hover:text-primary"><ArrowRight className="size-3.5" aria-hidden />{c.label[lang]}</Link></li>)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="grid gap-4 border-t border-border bg-surface-sunken px-5 py-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-small">
            {ui.utility.map(([label, to]) => <Link key={to} to={to} onClick={onClose} className="font-semibold text-ink-soft hover:text-primary">{label}</Link>)}
          </div>
          <LanguageSelect className="text-small text-ink" />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
