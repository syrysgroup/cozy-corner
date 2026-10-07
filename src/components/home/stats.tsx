import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero-auditors.jpg";
import conference from "@/assets/news-conference.jpg";
import meeting from "@/assets/editorial-meeting.jpg";
import building from "@/assets/editorial-building.jpg";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { useCountUp } from "@/hooks/use-motion";
import { PLACEHOLDER_NOTICE } from "@/lib/home-data";

const ITEMS = [
  { k: "Audit reports", v: 126, max: 150, img: building, to: "/publications/reports", d: "Final reports published after due process.", c: "--ecowas-lime" },
  { k: "Recommendations", v: 940, max: 1000, img: meeting, to: "/audit/recommendations", d: "Tracked from issue to implementation.", c: "--ecowas-orange" },
  { k: "Publications", v: 58, max: 80, img: conference, to: "/publications", d: "Annual reports, guidance and studies.", c: "--ecowas-sky" },
  { k: "Institutional coverage", v: 100, max: 100, s: "%", img: hero, to: "/transparency/institutions", d: "Institutions within the audit mandate.", c: "--ecowas-yellow" },
];

function Stat({ it, i }: { it: typeof ITEMS[number]; i: number }) {
  const { ref, value } = useCountUp(it.v, 1600);
  const r = 44, C = 2 * Math.PI * r;
  const pct = value / it.max;
  return (
    <Link to={it.to} className="reveal group relative flex h-full min-h-[13rem] flex-col overflow-hidden border border-primary-foreground/15 bg-primary-foreground/5 p-5 transition-colors duration-base hover:border-primary-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ecowas-yellow" style={{ transitionDelay: `${i * 90}ms` }}>
      <img src={it.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-slow group-hover:opacity-20" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs opacity-75">0{i + 1}/04</span>
        <ArrowUpRight className="size-4 transition-transform duration-base group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
      </div>
      <div className="relative mx-auto mt-3 size-24">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--primary-foreground) / 0.12)" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={`hsl(var(${it.c}))`} strokeWidth="7" strokeLinecap="butt" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
        </svg>
        <span ref={ref as React.RefObject<HTMLSpanElement>} className="num absolute inset-0 grid place-items-center font-display text-2xl font-bold">{Math.round(value).toLocaleString("en")}{it.s}</span>
      </div>
      <h3 className="relative mt-3 font-display text-h4 text-primary-foreground">{it.k}</h3>
      <p className="relative mt-1 text-small text-primary-foreground/80">{it.d}</p>
    </Link>
  );
}

export function TransparencyDashboard() {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector("li"); const w = card ? card.getBoundingClientRect().width + 12 : el.clientWidth;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <section aria-labelledby="home-transparency" className="relative overflow-hidden bg-ecowas-ocean py-section text-primary-foreground">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 band" />
      <Container className="relative">
        <div className="grid gap-6 xl:grid-cols-[minmax(15rem,0.85fr)_minmax(0,3.15fr)] xl:items-center">
          <div className="reveal">
            <p className="text-overline uppercase text-ecowas-yellow">Transparency in numbers</p>
            <h2 id="home-transparency" className="mt-3 font-display text-h2 text-primary-foreground">From institutional information to public knowledge.</h2>
            <p className="mt-3 max-w-sm text-xs text-primary-foreground/80">{PLACEHOLDER_NOTICE}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/transparency" className="inline-flex min-h-11 items-center gap-2 text-small font-semibold underline-offset-4 hover:underline">Explore transparency data <ArrowRight className="size-4" aria-hidden /></Link>
              <div className="flex gap-2 xl:hidden">
                <Button type="button" variant="inverse" size="icon" aria-label="Previous figures" onClick={() => scroll(-1)}><ChevronLeft /></Button>
                <Button type="button" variant="inverse" size="icon" aria-label="Next figures" onClick={() => scroll(1)}><ChevronRight /></Button>
              </div>
            </div>
          </div>
          <ul ref={track} aria-label="Transparency figures" className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-4 xl:overflow-x-visible xl:pb-0">
            {ITEMS.map((it, i) => (
              <li key={it.k} className="w-[85%] shrink-0 snap-start xs:w-[64%] sm:w-[calc((100%-0.75rem)/2)] xl:w-auto">
                <Stat it={it} i={i} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
