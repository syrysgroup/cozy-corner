import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, EyeOff, Lock, UserCheck, Search, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { GOVERNANCE_ARMS, OAG_POSITIONING } from "@/components/ds/institutional";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

const SLUGS = ["commission", "parliament", "court"];

export function InstitutionsExplainer() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-labelledby="home-institutions" className="py-section-lg">
      <Container>
        <p className="overline text-primary">08 · ECOWAS Institutions</p>
        <h2 id="home-institutions" className="mt-3 font-display text-h1">Three arms of governance.</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ul className="grid gap-3">
            {GOVERNANCE_ARMS.map(({ arm, body, icon: Icon, role }, i) => {
              const isOpen = open === i;
              return (
                <li key={arm} className={cn("border border-border bg-card transition-shadow duration-base", isOpen && "shadow-raised")}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(i)} className="flex w-full items-center gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className={cn("grid size-12 place-items-center transition-colors duration-base", isOpen ? "bg-primary text-primary-foreground" : "bg-surface-sunken text-ink")}><Icon className="size-5" aria-hidden /></span>
                    <span className="flex-1"><span className="overline">{arm}</span><span className="block font-display text-h3">{body}</span></span>
                    <Plus className={cn("size-5 transition-transform duration-base", isOpen && "rotate-45")} aria-hidden />
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-slow", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden"><div className="flex flex-wrap items-end justify-between gap-4 border-t border-border px-5 py-5">
                      <p className="max-w-md text-small text-ink-soft">{role}</p>
                      <Link to={`/institutions/${SLUGS[i]}`} className="inline-flex items-center gap-1 text-small font-semibold text-primary hover:underline">About the {body} <ArrowRight className="size-4" /></Link>
                    </div></div>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="relative flex flex-col justify-between overflow-hidden border-2 border-dashed border-primary bg-surface-sunken p-6">
            <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
            <div>
              <p className="overline flex items-center gap-2 text-primary"><ShieldCheck className="size-4" aria-hidden />Independent assurance</p>
              <h3 className="mt-3 font-display text-h2">OAG — not a fourth arm.</h3>
              <p className="mt-3 text-small text-ink-soft">{OAG_POSITIONING}</p>
            </div>
            <Button asChild variant="secondary" className="mt-6 w-fit"><Link to="/institutions">Explore ECOWAS Institutions <ArrowRight /></Link></Button>
          </aside>
        </div>
      </Container>
    </section>
  );
}

export function IntegrityBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const opts = [
    { icon: EyeOff, t: "Report anonymously", d: "No name, no contact details required.", c: "border-l-ecowas-yellow" },
    { icon: Lock, t: "Report confidentially", d: "Your identity is known only to authorised staff.", c: "border-l-ecowas-lime" },
    { icon: UserCheck, t: "Identify myself", d: "Share your details so we can follow up with you.", c: "border-l-ecowas-sky" },
    { icon: Search, t: "Track existing report", d: "Use your case reference to check progress.", c: "border-l-ecowas-orange" },
  ];
  const move = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--rx", `${((e.clientX - r.left) / r.width - 0.5) * 40}px`);
    ref.current.style.setProperty("--ry", `${((e.clientY - r.top) / r.height - 0.5) * 40}px`);
  };
  return (
    <section ref={ref} onPointerMove={move} aria-labelledby="home-integrity" className="relative overflow-hidden bg-ecowas-green py-section-lg text-primary-foreground">
      {[36, 26, 16].map((s, i) => (
        <span key={s} aria-hidden className="pointer-events-none absolute -right-24 -top-24 rounded-full border border-primary-foreground/15 transition-transform duration-slow ease-out"
          style={{ width: `${s}rem`, height: `${s}rem`, transform: `translate(calc(var(--rx,0px) * ${(i + 1) * 0.5}), calc(var(--ry,0px) * ${(i + 1) * 0.5}))` }} />
      ))}
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="reveal">
          <p className="text-overline uppercase text-primary-foreground/75">09 · IntegrityLine</p>
          <h2 id="home-integrity" className="mt-4 font-display text-display-lg text-primary-foreground">See something.<br />Say something.</h2>
          <p className="mt-6 max-w-md text-lead text-primary-foreground/85">IntegrityLine provides protected channels for reporting matters within the Office’s mandate — fraud, waste, abuse or misconduct involving Community resources.</p>
          <p className="mt-4 max-w-md text-small text-primary-foreground/75">Secure case handling is being finalised; reporting channels are not yet in production use.</p>
          <Link to="/integrityline/protection" className="mt-6 inline-flex items-center gap-2 text-small font-semibold underline-offset-4 hover:underline">How reporters are protected <ArrowRight className="size-4" /></Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {opts.map((o, i) => (
            <li key={o.t} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <Link to="/integrityline/report" className={cn("group flex h-full flex-col gap-6 border border-l-4 border-primary-foreground/20 bg-primary-foreground/5 p-6 transition-all duration-base hover:-translate-y-1 hover:bg-primary-foreground hover:text-ecowas-green hover:shadow-raised", o.c)}>
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

export function ClosingBand() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "unavailable">("idle");
  const links = [{ t: "Audit & Assurance", to: "/audit" }, { t: "Publications", to: "/publications" }, { t: "IntegrityLine", to: "/integrityline" }, { t: "Knowledge", to: "/knowledge" }];
  return (
    <section aria-labelledby="home-closing" className="bg-ink text-background">
      <div className="h-1.5 band" aria-hidden />
      <Container className="grid gap-14 py-section-lg lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 id="home-closing" className="reveal font-display text-display-lg text-background">Explore the work of the Office.</h2>
          <form className="mt-10 max-w-md" onSubmit={(e) => { e.preventDefault(); setStatus("unavailable"); }}>
            <label htmlFor={`${id}-email`} className="text-small font-semibold">Stay informed — newsletter</label>
            <div className="mt-2 flex gap-2">
              <input id={`${id}-email`} type="email" required autoComplete="email" placeholder="you@example.org" className="min-h-11 flex-1 border border-background/30 bg-transparent px-3 text-small text-background placeholder:text-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ecowas-yellow" />
              <Button type="submit" variant="inverse">Subscribe</Button>
            </div>
            <p role="status" className="mt-3 text-small text-background/70">{status === "unavailable" && "Subscriptions are not yet open — the mailing service is still being connected, so your details were not saved."}</p>
          </form>
        </div>
        <ul className="grid content-end border-t border-background/20">
          {links.map((l) => (
            <li key={l.t} className="border-b border-background/20">
              <Link to={l.to} className="group flex items-center justify-between py-5 font-display text-h2 transition-colors hover:text-ecowas-yellow">
                <span className="transition-transform duration-base group-hover:translate-x-2">{l.t}</span>
                <ArrowRight className="size-7 -translate-x-3 opacity-40 transition-all duration-base group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
