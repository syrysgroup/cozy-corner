import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero-auditors.jpg";
import conference from "@/assets/news-conference.jpg";
import meeting from "@/assets/editorial-meeting.jpg";
import building from "@/assets/editorial-building.jpg";
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
    <Link to={it.to} className="reveal group relative flex flex-col overflow-hidden border border-primary-foreground/15 bg-primary-foreground/5 p-6 transition-colors duration-base hover:border-primary-foreground/40" style={{ transitionDelay: `${i * 90}ms` }}>
      <img src={it.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-slow group-hover:opacity-25" />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs text-ecowas-yellow">0{i + 1}</span>
        <ArrowUpRight className="size-5 transition-transform duration-base group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
      </div>
      <div className="relative mx-auto mt-4 size-40">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--primary-foreground) / 0.12)" strokeWidth="5" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={`hsl(var(${it.c}))`} strokeWidth="5" strokeLinecap="butt" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
        </svg>
        <span ref={ref as React.RefObject<HTMLSpanElement>} className="num absolute inset-0 grid place-items-center font-display text-4xl font-bold">{Math.round(value).toLocaleString("en")}{it.s}</span>
      </div>
      <h3 className="relative mt-5 font-display text-h4 text-primary-foreground">{it.k}</h3>
      <p className="relative mt-1 text-small text-primary-foreground/75">{it.d}</p>
    </Link>
  );
}

export function TransparencyDashboard() {
  return (
    <section aria-labelledby="home-transparency" className="bg-ecowas-ocean py-section-lg text-primary-foreground">
      <Container>
        <p className="overline flex items-center gap-3 text-primary-foreground/80"><span className="h-1 w-10 band" aria-hidden />05 · Transparency in numbers</p>
        <h2 id="home-transparency" className="mt-3 max-w-3xl font-display text-h1 text-primary-foreground">From institutional information to public knowledge.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ITEMS.map((it, i) => <Stat key={it.k} it={it} i={i} />)}</div>
        <p className="mt-6 text-xs text-primary-foreground/70">{PLACEHOLDER_NOTICE}</p>
      </Container>
    </section>
  );
}
