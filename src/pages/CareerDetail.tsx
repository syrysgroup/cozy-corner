import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, FileText, MapPin, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { vacancyStatus } from "@/lib/opportunity-filters";
import { fetchVacancyBySlug, type Vacancy } from "@/lib/careers-data";

const formatDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return <section className="border-t border-border py-6"><h2 className="font-display text-h3">{title}</h2><ul className="mt-4 grid gap-3">{items.map((item, index) => <li key={`${title}-${index}`} className="flex gap-3 text-body text-ink-soft"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{item}</li>)}</ul></section>;
}

export default function CareerDetail() {
  const { slug } = useParams();
  const [vacancy, setVacancy] = useState<Vacancy | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  const load = () => {
    if (!slug) return;
    setFailed(false);
    setVacancy(undefined);
    fetchVacancyBySlug(slug).then(setVacancy).catch(() => setFailed(true));
  };

  useEffect(() => { load(); }, [slug]);

  return (
    <section lang="en" className="container py-section-sm lg:py-section">
      <Button asChild variant="tertiary"><Link to="/opportunities/careers"><ArrowLeft /> All current vacancies</Link></Button>
      {failed ? (
        <div role="alert" className="mt-8"><h1 className="font-display text-h3">Vacancy could not be loaded</h1><p className="mt-2 text-ink-soft">Please try again. Availability cannot be confirmed right now.</p><Button className="mt-4" variant="secondary" onClick={load}>Try again</Button></div>
      ) : vacancy === undefined ? (
        <p className="mt-8 text-muted-foreground" role="status">Loading vacancy…</p>
      ) : vacancy === null ? (
        <div className="mt-8 border border-border bg-surface-sunken p-8"><h1 className="font-display text-h2">Vacancy not available</h1><p className="mt-3 max-w-2xl text-body text-ink-soft">This role is not currently published. It may have closed or the link may be incorrect.</p></div>
      ) : (
        <article className="mt-8 max-w-4xl">
          <p className="overline text-primary">{vacancy.career_area} · {vacancy.employment_status}</p>
          <h1 className="mt-3 font-display text-h1">{vacancy.official_title}</h1>
          <p className="mt-3 inline-block border border-border px-3 py-1 text-small font-semibold uppercase text-primary">{vacancyStatus(vacancy.closing_date)}</p>
          <p className="mt-3 text-body text-ink-soft">{vacancy.institution}</p>
          <dl className="mt-7 grid gap-x-8 gap-y-5 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="overline text-muted-foreground">Job code</dt><dd className="mt-1 font-mono text-body">{vacancy.job_code}</dd></div>
            <div><dt className="overline text-muted-foreground">Grade</dt><dd className="mt-1 text-body">{vacancy.grade}</dd></div>
            <div className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden /><div><dt className="overline text-muted-foreground">Duty station</dt><dd className="mt-1 text-body">{vacancy.duty_station}</dd></div></div>
            <div className="flex items-start gap-2"><CalendarDays className="mt-1 size-4 shrink-0 text-primary" aria-hidden /><div><dt className="overline text-muted-foreground">Published</dt><dd className="mt-1 text-body">{formatDate(vacancy.publication_date)}</dd></div></div>
            <div className="flex items-start gap-2"><CalendarDays className="mt-1 size-4 shrink-0 text-primary" aria-hidden /><div><dt className="overline text-muted-foreground">Closing date</dt><dd className="mt-1 text-body">{formatDate(vacancy.closing_date)}</dd></div></div>
            {vacancy.salary_notes && <div><dt className="overline text-muted-foreground">Published remuneration</dt><dd className="mt-1 text-body">{vacancy.salary_notes}</dd><dd className="mt-1 text-small text-ink-soft">Published starting-grade remuneration stated in the official ECOWAS job profile.</dd></div>}
          </dl>
          <p className="mt-7 text-lead text-ink-soft">{vacancy.role_overview}</p>

          <dl className="mt-7 grid gap-5 border-b border-border pb-7 sm:grid-cols-2">
            {vacancy.directorate && <div><dt className="overline text-muted-foreground">Directorate</dt><dd className="mt-1 text-body">{vacancy.directorate}</dd></div>}
            {vacancy.division && <div><dt className="overline text-muted-foreground">Division</dt><dd className="mt-1 text-body">{vacancy.division}</dd></div>}
            {vacancy.reports_to && <div><dt className="overline text-muted-foreground">Reports to</dt><dd className="mt-1 text-body">{vacancy.reports_to}</dd></div>}
            {vacancy.supervises.length > 0 && <div><dt className="overline text-muted-foreground">Supervises</dt><dd className="mt-1 text-body">{vacancy.supervises.join(", ")}</dd></div>}
            {vacancy.language_requirements && <div><dt className="overline text-muted-foreground">Languages</dt><dd className="mt-1 text-body">{vacancy.language_requirements}</dd></div>}
            {vacancy.age_requirement && <div><dt className="overline text-muted-foreground">Age requirement</dt><dd className="mt-1 text-body">{vacancy.age_requirement}{vacancy.age_exemption_notes ? ` · ${vacancy.age_exemption_notes}` : ""}</dd></div>}
          </dl>

          <DetailList title="Key responsibilities" items={vacancy.responsibilities} />
          <DetailList title="Qualifications" items={vacancy.qualifications} />
          <DetailList title="Experience" items={vacancy.experience} />
          <DetailList title="Core competencies" items={vacancy.competencies} />

          {vacancy.documents_required.length > 0 && <section className="border-t border-border py-6"><h2 className="font-display text-h3">Documents required</h2><ul className="mt-4 grid gap-2">{vacancy.documents_required.map((document) => <li key={document} className="flex items-center gap-3 text-body text-ink-soft"><FileText className="size-4 shrink-0 text-primary" aria-hidden />{document}</li>)}</ul></section>}
          {vacancy.assessment_information && <section className="border-t border-border py-6"><h2 className="font-display text-h3">Assessment</h2><p className="mt-3 text-body text-ink-soft">{vacancy.assessment_information}</p></section>}

          <section className="border-y border-border py-7">
            <h2 className="font-display text-h3">Application</h2>
            {vacancy.application_method && <p className="mt-3 text-body text-ink-soft">{vacancy.application_method}</p>}
            {vacancy.application_email && <p className="mt-3 text-body">Email: <a className="font-semibold text-primary underline underline-offset-4" href={`mailto:${vacancy.application_email}?subject=${encodeURIComponent(`Application: ${vacancy.official_title} (${vacancy.job_code})`)}`}>{vacancy.application_email}</a> <Button variant="tertiary" onClick={() => navigator.clipboard?.writeText(vacancy.application_email!)}>Copy email</Button></p>}
            <div className="mt-5 flex flex-wrap gap-4">
              {vacancy.official_source_url && <Button asChild><a href={vacancy.official_source_url} target="_blank" rel="noreferrer">View official ECOWAS vacancy <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a></Button>}
              {vacancy.official_job_profile_url && <Button asChild variant="secondary"><a href={vacancy.official_job_profile_url} target="_blank" rel="noreferrer">View official job profile <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a></Button>}
            </div>
          </section>
          <p className="mt-6 flex items-start gap-2 text-small text-ink-soft"><ShieldAlert className="size-4 shrink-0 text-accent" aria-hidden /><span>Never pay to apply. Use only the application channel named in the official notice.</span></p>
          <Button asChild variant="tertiary" className="mt-6"><Link to="/opportunities/careers">Return to current vacancies <ArrowRight /></Link></Button>
        </article>
      )}
    </section>
  );
}