import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, EyeOff, Lock, UserCheck, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { GOVERNANCE_ARMS, OAG_POSITIONING } from "@/components/ds/institutional";
import { useOfficialAsset } from "@/lib/public-site";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";
import commissionLogo from "@/assets/commission-logo.png.asset.json";
import parliamentLogo from "@/assets/parliament-logo.png.asset.json";
import courtLogo from "@/assets/court-logo.png.asset.json";

const SLUGS = ["commission", "parliament", "court"];
const LOGOS = [commissionLogo.url, parliamentLogo.url, courtLogo.url];

/** Official institution logo — always on a white tile with clear space, per the ECOWAS Design Manual. */
function ArmLogo({ armKey, fallback, body }: { armKey: string; fallback: string; body: string }) {
  const logo = useOfficialAsset(armKey, fallback);
  return (
    <span className="grid size-14 shrink-0 place-items-center border border-border bg-card p-1.5">
      <img src={logo.src} alt={logo.alt ?? `${body} logo`} width={48} height={48} loading="lazy" className="max-h-full max-w-full object-contain" />
    </span>
  );
}

export function InstitutionsExplainer() {
  const accents = ["bg-ecowas-green", "bg-ecowas-yellow", "bg-ecowas-ocean"];
  return (
    <section aria-labelledby="home-institutions" className="relative overflow-hidden bg-surface-sunken py-section-lg">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div className="reveal">
            <p className="overline text-primary">04 · ECOWAS Institutions</p>
            <h2 id="home-institutions" className="mt-3 font-display text-h1">Three arms of governance.</h2>
          </div>
          <p className="reveal max-w-xl text-lead text-ink-soft">ECOWAS governance is exercised by the Executive, the Legislature and the Judiciary — each with a distinct Community mandate.</p>
        </div>

        <ol className="mt-6 grid gap-px border border-border bg-border md:grid-cols-3">
          {GOVERNANCE_ARMS.map(({ arm, body, icon: Icon, role }, i) => (
            <li key={arm} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <Link to={`/institutions/${SLUGS[i]}`} className="group relative flex h-full flex-col bg-card p-8 transition-colors duration-base hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-slow group-hover:scale-x-100", accents[i])} />
                <div className="flex items-start justify-between">
                  <ArmLogo armKey={SLUGS[i]} fallback={LOGOS[i]} body={body} />
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <p className="overline mt-8 flex items-center gap-1.5 text-ink-soft"><Icon className="size-3.5" aria-hidden />{arm}</p>
                <h3 className="mt-2 font-display text-h3 transition-colors group-hover:text-primary">{body}</h3>
                <p className="mt-3 flex-1 text-small text-muted-foreground">{role}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-small font-semibold text-primary">
                  Learn more <ArrowRight className="size-4 transition-transform duration-base group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <aside className="reveal relative mt-8 overflow-hidden bg-ecowas-green p-8 text-primary-foreground md:p-10">
          <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
          <span aria-hidden className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full border border-primary-foreground/15" />
          <span aria-hidden className="pointer-events-none absolute -right-4 -bottom-12 size-44 rounded-full border border-primary-foreground/15" />
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <ShieldCheck className="size-12 text-ecowas-yellow" aria-hidden />
            <div>
              <p className="text-overline uppercase text-primary-foreground/75">Independent assurance</p>
              <h3 className="mt-1 font-display text-h2 text-primary-foreground">OAG — not a fourth arm.</h3>
              <p className="mt-2 max-w-2xl text-small text-primary-foreground/85">{OAG_POSITIONING}</p>
            </div>
            <Link to="/institutions" className="inline-flex min-h-11 w-fit items-center gap-2 bg-primary-foreground px-5 text-small font-semibold text-ecowas-green transition-transform duration-base hover:-translate-y-0.5">
              Explore ECOWAS Institutions <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </aside>
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
          <form className="mt-6 max-w-md" onSubmit={(e) => { e.preventDefault(); setStatus("unavailable"); }}>
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
