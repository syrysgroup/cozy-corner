import { Link } from "react-router-dom";
import { ArrowUpRight, Linkedin, Youtube, Twitter, ShieldCheck } from "lucide-react";
import { Band, Wordmark } from "@/components/ds/primitives";
import { LANGS, useI18n } from "@/lib/i18n";
import { ECOWAS_LINKS, NAV } from "@/lib/site";
import { Container } from "./layout-parts";

const COLS: { title: string; links: [string, string][] }[] = [
  { title: "Institution", links: [["About OAG", "/about"], ["Mandate", "/about/mandate"], ["Leadership", "/about/leadership"], ["Contact", "/contact"]] },
  { title: "Oversight", links: [["Audit & Assurance", "/audit"], ["Recommendations", "/audit/recommendations"], ["Transparency", "/transparency"], ["Publications", "/publications"]] },
  { title: "Engage", links: [["Careers", "/opportunities/careers"], ["Procurement", "/opportunities/procurement"], ["Knowledge", "/knowledge"], ["IntegrityLine", "/integrityline"]] },
];

export function SiteFooter() {
  const { lang, setLang } = useI18n();
  return (
    <footer className="mt-auto bg-ink text-background">
      <Band />
      <Container className="grid gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_2fr]">
        <div className="max-w-sm">
          <Wordmark inverse />
          <p className="mt-6 text-small text-background/70">The Office of the Auditor General provides independent assurance on the stewardship of public resources across ECOWAS Institutions.</p>
          <Link to="/integrityline" className="mt-8 flex items-start gap-3 border border-background/20 p-4 transition-colors duration-base hover:border-ecowas-yellow">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ecowas-yellow" aria-hidden />
            <span><span className="block font-semibold">Report a concern</span><span className="text-small text-background/65">Confidential reporting via IntegrityLine</span></span>
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="overline text-background/55">{c.title}</p>
              <ul className="mt-4 grid gap-2.5">{c.links.map(([l, to]) => <li key={to}><Link to={to} className="text-small text-background/85 underline-offset-4 hover:text-background hover:underline">{l}</Link></li>)}</ul>
            </nav>
          ))}
          <nav aria-label="ECOWAS institutions">
            <p className="overline text-background/55">ECOWAS</p>
            <ul className="mt-4 grid gap-2.5">{ECOWAS_LINKS.map(([l, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-small text-background/85 underline-offset-4 hover:text-background hover:underline">{l}<ArrowUpRight className="size-3" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a></li>)}</ul>
          </nav>
        </div>
      </Container>
      <div className="border-t border-background/15">
        <Container className="flex flex-col gap-5 py-6 text-xs text-background/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Office of the Auditor General of ECOWAS Institutions</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {[["Privacy", "/privacy"], ["Accessibility", "/accessibility"], ["Terms", "/terms"], ["Design system", "/design-system"]].map(([l, to]) => <Link key={to} to={to} className="hover:text-background hover:underline underline-offset-4">{l}</Link>)}
          </nav>
          <div className="flex items-center gap-5">
            <div role="group" aria-label="Language" className="flex gap-3">
              {LANGS.map((l) => <button key={l.code} type="button" aria-pressed={lang === l.code} onClick={() => setLang(l.code)} className="inline-flex min-h-11 items-center uppercase hover:text-background aria-pressed:font-bold aria-pressed:text-ecowas-yellow">{l.code}</button>)}
            </div>
            <span className="h-4 w-px bg-background/20" aria-hidden />
            <div className="flex gap-3">
              {[[Linkedin, "LinkedIn"], [Twitter, "X"], [Youtube, "YouTube"]].map(([Icon, n]) => { const I = Icon as typeof Linkedin; return <a key={n as string} href="#" aria-label={`OAG on ${n}`} className="grid min-h-11 min-w-11 place-items-center hover:text-background"><I className="size-4" aria-hidden /></a>; })}
            </div>
          </div>
        </Container>
      </div>
      <span className="sr-only">{NAV.length} main sections</span>
    </footer>
  );
}
