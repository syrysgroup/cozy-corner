import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ExternalLink, MapPin, ShieldAlert, Briefcase } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import {
  CAREER_AREAS, OFFICIAL_RECRUITMENT_URL, fetchVacancies,
  type Vacancy, type CareerArea, type ContractType,
} from "@/lib/careers-data";

const CONTRACTS: ContractType[] = ["Permanent", "Fixed-term", "Internship", "Consultancy"];

export default function Careers() {
  const [vacancies, setVacancies] = useState<Vacancy[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [area, setArea] = useState<CareerArea | "all">("all");
  const [contract, setContract] = useState<ContractType | "all">("all");

  const load = () => { setFailed(false); setVacancies(null); fetchVacancies().then(setVacancies).catch(() => setFailed(true)); };
  useEffect(load, []);
  const filtered = useMemo(
    () => (vacancies ?? []).filter((v) => (area === "all" || v.area === area) && (contract === "all" || v.contract === contract)),
    [vacancies, area, contract],
  );

  return (
    <>
      <section className="container pt-section-sm pb-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-small text-muted-foreground"><Link to="/" className="hover:text-primary">Home</Link> / <Link to="/opportunities" className="hover:text-primary">Opportunities</Link> / <span aria-current="page">Careers</span></nav>
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="overline text-primary">Professional opportunities</p><h1 className="mt-3 font-display text-h1">Careers</h1><p className="mt-4 text-lead text-ink-soft">Published vacancies and official application channels.</p></div><Button asChild variant="tertiary"><Link to="/opportunities#careers-guidance">Recruitment guidance <ArrowRight /></Link></Button></div>
      </section>

      {/* Vacancies, white */}
      <section id="vacancies" className="container scroll-mt-24 pb-section pt-3" aria-labelledby="vac-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="overline text-primary">Professional opportunities</p>
            <h2 id="vac-h" className="mt-3 font-display text-h2">Current vacancies</h2>
          </div>
          <div className="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
            <label className="grid gap-1 text-small font-semibold text-ink">
              Career area
              <select className="form-control min-h-11 w-full" value={area} onChange={(e) => setArea(e.target.value as CareerArea | "all")}>
                <option value="all">All areas</option>
                {CAREER_AREAS.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-small font-semibold text-ink">
              Contract type
              <select className="form-control min-h-11 w-full" value={contract} onChange={(e) => setContract(e.target.value as ContractType | "all")}>
                <option value="all">All types</option>
                {CONTRACTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div aria-live="polite">
          {failed ? (<div role="alert"><h3 className="font-display text-h3">Vacancies could not be loaded</h3><p className="mt-2 text-ink-soft">Please try again. Availability cannot be confirmed right now.</p><Button className="mt-4" variant="secondary" onClick={load}>Try again</Button></div>) : vacancies === null ? (
            <p className="text-muted-foreground">Loading vacancies…</p>
          ) : filtered.length === 0 ? (
            <div className="grid gap-4 border border-border bg-surface-sunken p-8 md:grid-cols-[auto_1fr] md:items-start">
              <Briefcase className="size-8 text-primary" aria-hidden />
              <div>
                <h3 className="font-display text-h3">{vacancies.length === 0 ? "No vacancies are currently published here" : "No vacancies match your filters"}</h3>
                <p className="mt-2 max-w-2xl text-body text-ink-soft">
                  {vacancies.length === 0 ? "There are no approved vacancy notices listed on this page. Check the official ECOWAS channel for further announcements." : "Try another career area or contract type."}
                </p>
                <Button asChild variant="secondary" className="mt-5">
                  <a href={OFFICIAL_RECRUITMENT_URL} target="_blank" rel="noreferrer">Visit official ECOWAS channel <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {filtered.map((v) => (
                <li key={v.id} className="flex flex-col border border-border border-l-4 border-l-primary bg-card p-6 transition-shadow duration-base hover:shadow-raised">
                  <p className="text-small font-semibold text-ink-soft">{CAREER_AREAS.find((a) => a.id === v.area)?.title} · {v.contract}</p>
                  <h3 className="mt-2 font-display text-h3 text-ink">{v.title}{v.grade && ` (${v.grade})`}</h3>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
                    <div className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden /><dt className="sr-only">Location</dt><dd>{v.location}</dd></div>
                    <div className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden /><dt>Closes</dt><dd>{new Date(v.closes).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                  </dl>
                  <Button asChild className="mt-6 self-start">
                    <a href={v.officialUrl} target="_blank" rel="noreferrer">Apply through official channel <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="container pb-section"><p className="flex items-start gap-2 border-t border-border pt-5 text-small text-ink-soft"><ShieldAlert className="size-4 shrink-0 text-accent" aria-hidden /><span>Never pay to apply. Use the channel named in the vacancy notice. <Link to="/opportunities#careers-guidance" className="font-semibold text-primary hover:underline">Read recruitment guidance</Link>.</span></p></div>
    </>
  );
}
