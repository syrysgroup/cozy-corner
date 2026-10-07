import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ExternalLink, MapPin, ShieldAlert, Briefcase, ChevronDown } from "lucide-react";
import { Button, Band, Wordmark } from "@/components/ds/primitives";
import heroImg from "@/assets/hero-auditors.jpg";
import meetingImg from "@/assets/editorial-meeting.jpg";
import {
  CAREER_AREAS, PROCESS_STEPS, FAQS, OFFICIAL_RECRUITMENT_URL, fetchVacancies,
  type Vacancy, type CareerArea, type ContractType,
} from "@/lib/careers-data";

const CONTRACTS: ContractType[] = ["Permanent", "Fixed-term", "Internship", "Consultancy"];

export default function Careers() {
  const [vacancies, setVacancies] = useState<Vacancy[] | null>(null);
  const [area, setArea] = useState<CareerArea | "all">("all");
  const [contract, setContract] = useState<ContractType | "all">("all");

  useEffect(() => { fetchVacancies().then(setVacancies); }, []);
  const filtered = useMemo(
    () => (vacancies ?? []).filter((v) => (area === "all" || v.area === area) && (contract === "all" || v.contract === contract)),
    [vacancies, area, contract],
  );

  return (
    <>
      {/* Hero, white editorial */}
      <section className="container grid gap-10 py-section-sm lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-section">
        <div>
          <nav aria-label="Breadcrumb" className="mb-6 text-small text-muted-foreground">
            <Link to="/" className="hover:text-primary hover:underline">Home</Link> / <Link to="/opportunities" className="hover:text-primary hover:underline">Opportunities</Link> / <span aria-current="page" className="text-ink">Careers</span>
          </nav>
          <Wordmark />
          <h1 className="mt-8 font-display text-display-lg text-ink">Build your career.<br />Strengthen accountability.</h1>
          <p className="mt-6 max-w-xl text-lead text-ink-soft">
            Join the Office of the Auditor General of ECOWAS Institutions and contribute to independent assurance, accountability, good corporate governance and value for money across the ECOWAS Community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#vacancies">View opportunities <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="secondary"><a href="#process">How recruitment works</a></Button>
          </div>
        </div>
        <figure className="relative">
          <img src={heroImg} alt="Audit professionals reviewing documents together" className="aspect-[4/3] w-full object-cover" />
          <Band className="absolute inset-x-0 bottom-0" />
        </figure>
      </section>

      {/* Green feature, purpose */}
      <section className="bg-primary text-primary-foreground">
        <div className="container grid gap-10 py-section-sm md:grid-cols-3 lg:py-section">
          <h2 className="font-display text-h2 text-primary-foreground md:col-span-1">Why work at the OAG</h2>
          <div className="grid gap-8 sm:grid-cols-3 md:col-span-2">
            {[
              ["Regional impact", "Your work informs decisions across ECOWAS Institutions and the citizens they serve."],
              ["Professional excellence", "Apply international auditing standards within a multidisciplinary, multilingual team."],
              ["Career development", "Structured learning, certification support and exposure to diverse audit engagements."],
            ].map(([t, b]) => (
              <div key={t} className="border-t-2 border-ecowas-yellow pt-4">
                <h3 className="font-display text-h4 text-primary-foreground">{t}</h3>
                <p className="mt-2 text-body text-primary-foreground/90">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vacancies, white */}
      <section id="vacancies" className="container scroll-mt-24 py-section-sm lg:py-section" aria-labelledby="vac-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="overline text-primary">Professional opportunities</p>
            <h2 id="vac-h" className="mt-3 font-display text-h2">Current vacancies</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="grid gap-1 text-small font-semibold text-ink">
              Career area
              <select className="form-control min-h-11" value={area} onChange={(e) => setArea(e.target.value as CareerArea | "all")}>
                <option value="all">All areas</option>
                {CAREER_AREAS.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-small font-semibold text-ink">
              Contract type
              <select className="form-control min-h-11" value={contract} onChange={(e) => setContract(e.target.value as ContractType | "all")}>
                <option value="all">All types</option>
                {CONTRACTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div aria-live="polite">
          {vacancies === null ? (
            <p className="text-muted-foreground">Loading vacancies…</p>
          ) : filtered.length === 0 ? (
            <div className="grid gap-4 border border-border bg-surface-sunken p-8 md:grid-cols-[auto_1fr] md:items-start">
              <Briefcase className="size-8 text-primary" aria-hidden />
              <div>
                <h3 className="font-display text-h3">No open vacancies at present</h3>
                <p className="mt-2 max-w-2xl text-body text-ink-soft">
                  Approved vacancy notices are published here and on the official ECOWAS recruitment channel. Please check back, or follow the official channel for announcements.
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

      {/* Yellow-12 accent, fraud notice */}
      <section className="bg-ecowas-yellow-12">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center">
          <ShieldAlert className="size-8 shrink-0 text-ecowas-brown" aria-hidden />
          <p className="flex-1 text-body text-ink">
            <strong>Recruitment fraud notice.</strong> The OAG never asks for payment at any stage of recruitment. Report suspicious requests confidentially.
          </p>
          <Button asChild variant="secondary"><Link to="/integrityline">Report through IntegrityLine</Link></Button>
        </div>
      </section>

      {/* Career areas, white */}
      <section className="container py-section-sm lg:py-section" aria-labelledby="areas-h">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="overline text-primary">Where you could contribute</p>
            <h2 id="areas-h" className="mt-3 font-display text-h2">Career areas</h2>
            <img src={meetingImg} alt="Colleagues in a working meeting" className="mt-8 hidden aspect-[4/3] w-full object-cover lg:block" />
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {CAREER_AREAS.map((a) => (
              <li key={a.id} className="border-t border-border py-6">
                <h3 className="font-display text-h4 text-ink">{a.title}</h3>
                <p className="mt-2 text-body text-ink-soft">{a.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ocean, process timeline */}
      <section id="process" className="scroll-mt-24 bg-ecowas-ocean text-background" aria-labelledby="proc-h">
        <div className="container py-section-sm lg:py-section">
          <h2 id="proc-h" className="font-display text-h2 text-background">How recruitment works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ecowas-sky pt-4">
                <span className="font-mono text-small text-background/80">Step {i + 1}</span>
                <h3 className="mt-1 font-display text-h4 text-background">{s.title}</h3>
                <p className="mt-2 text-body text-background/90">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ, white */}
      <section className="container py-section-sm lg:py-section" aria-labelledby="faq-h">
        <h2 id="faq-h" className="font-display text-h2">Frequently asked questions</h2>
        <div className="mt-8 max-w-3xl divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-h4 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 transition-transform duration-base group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <p className="pb-5 text-body text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Green CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container flex flex-col gap-6 py-section-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-h2 text-primary-foreground">Contribute to regional accountability</h2>
            <p className="mt-2 text-lead text-primary-foreground/90">Follow official ECOWAS channels for new professional opportunities.</p>
          </div>
          <Button asChild size="lg" variant="inverse">
            <a href={OFFICIAL_RECRUITMENT_URL} target="_blank" rel="noreferrer">Official ECOWAS channel <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a>
          </Button>
        </div>
      </section>
    </>
  );
}
