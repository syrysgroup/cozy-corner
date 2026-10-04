import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Download, EyeOff, Lock, UserCheck, Search } from "lucide-react";
import { AuthorityChairFeature } from "@/components/home/authority-chair";
import { HomeIntro, WhatOAGDoes, LeadershipFeature, InstitutionsTeaser, AuditAssurance, LatestNews, KnowledgeGateway, Newsletter } from "@/components/home/sections";
import hero from "@/assets/hero-auditors.jpg";
import conference from "@/assets/news-conference.jpg";
import meeting from "@/assets/editorial-meeting.jpg";
import building from "@/assets/editorial-building.jpg";
import { Button, StatusBadge, Badge } from "@/components/ds/primitives";
import { SectionHeading } from "@/components/ds/showcase";
import { Container } from "@/components/ds/shell/layout-parts";
import { useCountUp, useReveal, usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";
import {
  PLACEHOLDER_NOTICE, publications,
} from "@/lib/home-data";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const { ref, value: v } = useCountUp(value);
  return <span ref={ref as React.RefObject<HTMLSpanElement>} className="num">{Math.round(v).toLocaleString("en")}{suffix}</span>;
}

function useParallax(strength = 0.15) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * strength}px) scale(1.08)`; }); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [reduced, strength]);
  return ref;
}

const Note = () => <p className="mt-6 text-xs text-muted-foreground">{PLACEHOLDER_NOTICE}</p>;
const stagger = (i: number) => ({ transitionDelay: `${i * 80}ms` });

/* ---------------- Hero ---------------- */
function Hero() {
  const img = useParallax();
  return (
    <section className="relative isolate overflow-hidden bg-ecowas-ocean text-primary-foreground">
      <img ref={img} src={hero} alt="Auditors reviewing printed reports together" width={1920} height={1088} fetchPriority="high" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center] opacity-70 will-change-transform" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ecowas-ocean via-ecowas-ocean/85 to-ecowas-ocean/10 max-lg:via-ecowas-ocean/80 max-lg:to-ecowas-ocean/50" aria-hidden />
      <Container className="flex min-h-[86vh] flex-col justify-end pb-12 pt-28 md:pb-20">
        <div className="max-w-3xl animate-rise-in motion-reduce:animate-none">
          <p className="flex items-center gap-3 text-overline uppercase text-primary-foreground/80"><span className="h-px w-10 bg-ecowas-yellow" aria-hidden />Office of the Auditor General · ECOWAS</p>
          <h1 className="mt-6 text-primary-foreground font-display text-display-lg md:text-display-xl">Strengthening accountability across ECOWAS institutions.</h1>
          <p className="mt-6 max-w-[38rem] text-lead text-primary-foreground/85">The Office provides independent audit and assurance on how Community resources are used — turning evidence into recommendations, and recommendations into public trust.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="inverse" size="lg"><Link to="/audit">Explore Audit &amp; Assurance <ArrowRight /></Link></Button>
            <Button asChild size="lg" className="border border-primary-foreground/50 bg-transparent hover:bg-primary-foreground/10"><Link to="/publications">View Publications</Link></Button>
          </div>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-px border-t border-primary-foreground/20 pt-6 text-small text-primary-foreground/80 sm:grid-cols-3 lg:grid-cols-6">
          {["Independent assurance", "Audit", "Accountability", "Transparency", "Integrity", "ECOWAS Institutions"].map((w, i) => (
            <li key={w} className="flex items-center gap-2 py-1"><span className="font-mono text-xs text-ecowas-yellow">0{i + 1}</span>{w}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Transparency ---------------- */
function Transparency() {
  const items = [
    { k: "Audit reports", v: 126, img: building, to: "/publications/reports", d: "Final reports published after due process." },
    { k: "Recommendations", v: 940, img: meeting, to: "/audit/recommendations", d: "Tracked from issue to implementation." },
    { k: "Publications", v: 58, img: conference, to: "/publications", d: "Annual reports, guidance and studies." },
    { k: "Institutional coverage", v: 100, s: "%", img: hero, to: "/transparency/institutions", d: "Institutions within the audit mandate." },
  ];
  return (
    <Container as="section" className="py-section">
      <SectionHeading index="06" eyebrow="Transparency" title="From institutional information to public knowledge.">Audit information, recommendations, follow-up and authorised public statistics.</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Link key={it.k} to={it.to} style={stagger(i)} className="reveal group relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-ecowas-ocean p-6 text-primary-foreground max-sm:aspect-[4/3]">
            <img src={it.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-slow group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ecowas-ocean via-ecowas-ocean/60 to-transparent" aria-hidden />
            <div className="relative">
              <span className="font-mono text-xs text-ecowas-yellow">0{i + 1}</span>
              <p className="mt-2 font-display text-5xl font-bold"><Counter value={it.v} suffix={it.s} /></p>
              <h3 className="mt-2 font-display text-h4 text-primary-foreground">{it.k}</h3>
              <p className="mt-1 text-small text-primary-foreground/75">{it.d}</p>
              <ArrowUpRight className="mt-4 size-5 transition-transform duration-base group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </div>
          </Link>
        ))}
      </div>
      <Note />
    </Container>
  );
}

/* ---------------- Publications ---------------- */
const coverTone = { ocean: "bg-ecowas-ocean", green: "bg-ecowas-green", brown: "bg-ecowas-brown", slate: "bg-ecowas-slate" };
function Publications() {
  return (
    <section className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading index="08" eyebrow="Publications" title="Reports that shape the record." className="mb-0 flex-1 border-0 pb-0" />
          <Button asChild variant="secondary" size="sm"><Link to="/publications">View all publications <ArrowRight /></Link></Button>
        </div>
      </Container>
      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]">
        <ul className="mx-auto flex w-max snap-x snap-mandatory gap-6 px-5 md:px-8 xl:px-[max(3rem,calc((100vw-82rem)/2+3rem))]">
          {publications.map((p, i) => (
            <li key={p.title} className="reveal w-[15rem] shrink-0 snap-start md:w-[17rem]" style={stagger(i)}>
              <article className="group">
                <div className={cn("relative flex aspect-[3/4] flex-col justify-between p-5 text-primary-foreground shadow-raised transition-transform duration-base group-hover:-translate-y-1.5", coverTone[p.tone])}>
                  <span className="absolute inset-y-0 left-0 w-2 bg-ink/20" aria-hidden />
                  <div className="flex justify-between text-xs uppercase tracking-[0.12em] text-primary-foreground/80"><span>OAG</span><span>{p.year}</span></div>
                  <div>
                    <span className="block h-1 w-10 bg-ecowas-yellow" aria-hidden />
                    <h3 className="mt-4 font-display text-h3 leading-tight text-primary-foreground">{p.title}</h3>
                  </div>
                  <p className="text-xs text-primary-foreground/75">{p.institution}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground"><Badge tone="brown">{p.type}</Badge><span>{p.language}</span></div>
                <div className="mt-3 flex gap-4 text-small font-semibold text-primary">
                  <Link to="/publications/reports" className="inline-flex items-center gap-1 hover:underline">View</Link>
                  <button type="button" className="inline-flex items-center gap-1 hover:underline" aria-label={`Download ${p.title}`}><Download className="size-4" aria-hidden />PDF</button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- IntegrityLine ---------------- */
function IntegrityLine() {
  const opts = [
    { icon: EyeOff, t: "Report anonymously", d: "No name, no contact details required." },
    { icon: Lock, t: "Report confidentially", d: "Your identity is known only to authorised staff." },
    { icon: UserCheck, t: "Identify myself", d: "Share your details so we can follow up with you." },
    { icon: Search, t: "Track existing report", d: "Use your case reference to check progress." },
  ];
  return (
    <section className="relative overflow-hidden bg-ecowas-green py-section-lg text-primary-foreground">
      <span className="absolute -right-32 -top-32 size-[28rem] rounded-full border border-primary-foreground/10" aria-hidden />
      <span className="absolute -right-12 -top-12 size-[18rem] rounded-full border border-primary-foreground/10" aria-hidden />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="reveal">
          <p className="text-overline uppercase text-primary-foreground/75">06 · IntegrityLine</p>
          <h2 className="mt-4 font-display text-display-lg text-primary-foreground">See something.<br />Say something.</h2>
          <p className="mt-6 max-w-md text-lead text-primary-foreground/85">IntegrityLine provides protected channels for reporting matters within the Office’s mandate — fraud, waste, abuse or misconduct involving Community resources.</p>
          <p className="mt-4 max-w-md text-small text-primary-foreground/75">Secure case handling is being finalised; reporting channels are not yet in production use.</p>
          <Link to="/integrityline/protection" className="mt-6 inline-flex items-center gap-2 text-small font-semibold underline-offset-4 hover:underline">How reporters are protected <ArrowRight className="size-4" /></Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {opts.map((o, i) => (
            <li key={o.t} className="reveal" style={stagger(i)}>
              <Link to="/integrityline/report" className="group flex h-full flex-col gap-6 border border-primary-foreground/20 bg-primary-foreground/5 p-6 transition-colors duration-base hover:bg-primary-foreground hover:text-ecowas-green">
                <o.icon className="size-6" aria-hidden />
                <span><span className="block font-display text-h4">{o.t}</span><span className="mt-1 block text-small opacity-80">{o.d}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  const links = [
    { t: "Audit & Assurance", to: "/audit" },
    { t: "Publications", to: "/publications" },
    { t: "IntegrityLine", to: "/integrityline" },
  ];
  return (
    <section className="bg-ink py-section-lg text-background">
      <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <h2 className="reveal font-display text-display-lg text-background">Explore the work of the Office of the Auditor General.</h2>
        <ul className="grid border-t border-background/20">
          {links.map((l) => (
            <li key={l.t} className="border-b border-background/20">
              <Link to={l.to} className="group flex items-center justify-between py-5 font-display text-h3 hover:text-ecowas-yellow">
                {l.t}<ArrowRight className="size-6 transition-transform duration-base group-hover:translate-x-2" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero />
      <HomeIntro />
      <WhatOAGDoes />
      <LeadershipFeature />
      <AuthorityChairFeature />
      <InstitutionsTeaser />
      <AuditAssurance />
      <Transparency />
      <LatestNews />
      <Publications />
      <KnowledgeGateway />
      <IntegrityLine />
      <Newsletter />
      <FinalCta />
    </div>
  );
}
