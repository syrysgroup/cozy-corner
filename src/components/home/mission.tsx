import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ds/shell/layout-parts";
import { cn } from "@/lib/utils";

const PARTS: [string, boolean][] = [
  ["The Office of the Auditor General is ", false], ["an independent assurance office", true],
  [" supporting ", false], ["accountability", true], [", ", false], ["good corporate governance", true],
  [" and ", false], ["value for money", true], [" across ECOWAS Institutions — so that every Community resource is ", false],
  ["used as intended", true], [".", false],
];

export function MissionStatement() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.1))));
    }); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const keys = PARTS.filter(([, k]) => k).length;
  let k = 0;
  return (
    <section id="mission" ref={ref} aria-labelledby="mission-title" className="py-section-lg">
      <Container>
        <p className="overline flex items-center gap-3 text-primary"><span className="h-1 w-10 band" aria-hidden />01 · The Office</p>
        <h2 id="mission-title" className="sr-only">Who we are</h2>
        <p className="mt-8 max-w-3xl text-lead leading-relaxed text-muted-foreground md:text-h3 md:leading-relaxed">
          {PARTS.map(([t, key], i) => {
            if (!key) return <span key={i}>{t}</span>;
            const lit = progress > (k++ + 0.5) / (keys + 0.5);
            return <span key={i} className={cn("mission-phrase", lit && "is-lit")}>{t}</span>;
          })}
        </p>
      </Container>
    </section>
  );
}
