import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroAuditors from "@/assets/hero-auditors.jpg";
import editorialBuilding from "@/assets/editorial-building.jpg";
import editorialMeeting from "@/assets/editorial-meeting.jpg";
import newsConference from "@/assets/news-conference.jpg";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

const HEADLINE = "Strengthening accountability across ECOWAS institutions.";
const TICKER = ["Independent assurance", "Audit", "Accountability", "Transparency", "Integrity", "ECOWAS Institutions"];

const SLIDES = [
  { src: heroAuditors, alt: "Auditors reviewing printed reports together" },
  { src: editorialBuilding, alt: "ECOWAS institution building" },
  { src: editorialMeeting, alt: "Delegates at an ECOWAS meeting" },
  { src: newsConference, alt: "Press conference at an ECOWAS event" },
];
const SLIDE_MS = 6000;

export function CinematicHero() {
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  // Auto-advance; paused on hover/focus or when reduced motion is preferred.
  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [reduced, paused]);

  useEffect(() => {
    let raf = 0; let px = 0; let py = 0;
    const apply = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (reduced) return;
      if (back.current) back.current.style.transform = `translate3d(${px * -14}px, ${y * 0.18 + py * -10}px, 0) scale(1.1)`;
      if (front.current) front.current.style.transform = `translate3d(${px * 10}px, ${y * -0.06 + py * 6}px, 0)`;
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    const onMove = (e: PointerEvent) => { px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5; onScroll(); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [reduced]);

  const words = HEADLINE.split(" ");
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ecowas-ocean text-primary-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={back} className="absolute inset-0 -z-20 will-change-transform" aria-hidden={false}>
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={i === index ? s.alt : ""}
            aria-hidden={i !== index}
            width={1920}
            height={1088}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-60 transition-opacity duration-1000 motion-reduce:transition-none",
              i === index ? "opacity-60" : "opacity-0",
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ecowas-ocean via-ecowas-ocean/85 to-ecowas-ocean/10 max-lg:via-ecowas-ocean/80 max-lg:to-ecowas-ocean/50" aria-hidden />
      <div ref={front} className="pointer-events-none absolute -right-24 top-24 -z-10 size-[30rem] rounded-full border border-primary-foreground/15 will-change-transform max-md:hidden" aria-hidden>
        <span className="absolute inset-12 rounded-full border border-ecowas-yellow/30" />
        <span className="absolute inset-28 rounded-full border border-primary-foreground/10" />
      </div>

      <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-10 pt-28 md:pb-14">
        <div className="max-w-4xl">
          <p className="flex items-center gap-3 text-overline uppercase text-primary-foreground/80"><span className="h-px w-10 bg-ecowas-yellow" aria-hidden />Office of the Auditor General · ECOWAS</p>
          <h1 id="hero-title" aria-label={HEADLINE} className="mt-6 font-display text-display-lg text-primary-foreground md:text-display-xl">
            {words.map((w, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="hero-word" style={{ animationDelay: `${120 + i * 70}ms` }}>{w}&nbsp;</span>
              </span>
            ))}
          </h1>
          <span className="band-grow mt-4 block h-1.5 w-48 band" aria-hidden />
          <p className="mt-6 max-w-[38rem] text-lead text-primary-foreground/85 animate-fade-in motion-reduce:animate-none">The Office provides independent audit and assurance on how Community resources are used — turning evidence into recommendations, and recommendations into public trust.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="inverse" size="lg"><Link to="/audit" className="group/cta">Explore Audit &amp; Assurance <ArrowRight className="transition-transform group-hover/cta:translate-x-1" /></Link></Button>
            <Button asChild size="lg" className="border border-primary-foreground/50 bg-transparent hover:bg-primary-foreground/10"><Link to="/publications">View Publications</Link></Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <a href="#mission" className={`inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.14em] text-primary-foreground/70 transition-opacity duration-slow hover:text-primary-foreground ${scrolled ? "opacity-0" : "opacity-100"}`}>
            <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden />Scroll to explore
          </a>
          <div className="flex items-center gap-3" aria-label="Banner images">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="grid size-10 place-items-center border border-primary-foreground/40 text-primary-foreground/80 transition-colors hover:border-ecowas-yellow hover:text-ecowas-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ecowas-yellow"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner image">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Image ${i + 1} of ${SLIDES.length}: ${s.alt}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-1.5 w-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ecowas-yellow",
                    i === index ? "bg-ecowas-yellow" : "bg-primary-foreground/30 hover:bg-primary-foreground/60",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="grid size-10 place-items-center border border-primary-foreground/40 text-primary-foreground/80 transition-colors hover:border-ecowas-yellow hover:text-ecowas-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ecowas-yellow"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </Container>

      <div className="relative overflow-hidden border-t border-primary-foreground/15 bg-ink/30 py-4" aria-label="Mandate keywords">
        <ul className="marquee flex w-max gap-12 whitespace-nowrap font-display text-h4 text-primary-foreground/85">
          {[...TICKER, ...TICKER].map((w, i) => (
            <li key={i} aria-hidden={i >= TICKER.length} className="flex items-center gap-4"><span className="font-mono text-xs text-ecowas-yellow">0{(i % TICKER.length) + 1}</span>{w}<span className="size-1.5 rounded-full bg-ecowas-yellow" aria-hidden /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
