import { Link } from "react-router-dom";
import { ArrowRight, Landmark } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { useAuthorityChairs, formatChairDate } from "@/lib/authority-data";

/** ECOWAS Authority leadership — deliberately separate from OAG leadership. */
export function AuthorityChairFeature() {
  const { current, archive, loading } = useAuthorityChairs();
  if (!loading && !current) return null;
  const since = formatChairDate(current?.startDate);
  const initials = current?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <section aria-labelledby="home-chair" className="relative overflow-hidden bg-ecowas-ocean py-section-lg text-primary-foreground">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 border-r border-primary-foreground/10 pattern-dots opacity-20" aria-hidden />
      <Container>
        <p className="overline flex items-center gap-3 text-primary-foreground/80"><span className="h-px w-10 bg-ecowas-yellow" aria-hidden />01 · Chairman of the Authority</p>
        <p className="mt-3 max-w-3xl text-small text-primary-foreground/75">Chairman of the Authority of Heads of State and Government of the Economic Community of West African States (ECOWAS)</p>

        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(16rem,0.85fr)_1.15fr] md:items-center">
          <div className="reveal relative"><span className="absolute -bottom-3 -right-3 left-3 top-3 band opacity-90" aria-hidden /><figure className="group relative aspect-[4/5] overflow-hidden bg-ecowas-ocean ring-1 ring-primary-foreground/20 transition-transform duration-slow hover:-translate-x-1 hover:-translate-y-1">
            {current?.portrait ? (
              <img src={current.portrait.src} alt={current.portrait.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.03]" />
            ) : (
              <div className="grid h-full place-items-center">
                <span className="font-display text-display-lg text-primary-foreground/30" aria-hidden>{initials}</span>
                <figcaption className="absolute inset-x-4 bottom-4 text-xs text-primary-foreground/70">Official ECOWAS portrait to be published once supplied.</figcaption>
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-ecowas-yellow transition-transform duration-slow group-hover:scale-x-100" aria-hidden />
          </figure></div>

          <div className="reveal" aria-live="polite">
            <p className="overline flex items-center gap-2 text-ecowas-yellow"><Landmark className="size-4" aria-hidden />ECOWAS Authority</p>
            {loading ? (
              <div className="mt-4 h-24 w-3/4 animate-pulse bg-primary-foreground/10" />
            ) : current && (
              <>
                <h2 id="home-chair" className="mt-4 font-display text-h1 md:text-display-lg text-primary-foreground">{current.honorific} {current.fullName}</h2>
                <p className="mt-4 text-lead font-semibold text-primary-foreground">{current.officialTitle}</p>
                <p className="mt-1 text-primary-foreground/85">{current.role}</p>
                {since && <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-primary-foreground/70">Chairmanship assumed {since}</p>}
                <p className="mt-6 max-w-xl border-l-2 border-ecowas-yellow pl-4 text-small text-primary-foreground/80">
                  The Authority of Heads of State and Government is the highest decision-making body of ECOWAS. The Chairmanship rotates among Heads of State and Government and is held for a defined term.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="inverse" size="lg">
                    <Link to="/institutions/authority#leadership" className="group/cta">View ECOWAS Leadership <ArrowRight className="transition-transform group-hover/cta:translate-x-1" /></Link>
                  </Button>
                  <Button asChild size="lg" className="border border-primary-foreground/50 bg-transparent hover:bg-primary-foreground/10"><Link to="/institutions/authority">About the Authority</Link></Button>
                </div>
                {archive.length > 0 && (
                  <p className="mt-8 text-xs text-primary-foreground/65">
                    Previous Chairman: {archive.map((c) => `${c.honorific} ${c.fullName} (${c.countryName})`).join(" · ")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
