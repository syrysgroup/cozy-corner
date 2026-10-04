import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Landmark, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { GOVERNANCE_ARMS, ECOSYSTEM, OAG_POSITIONING, OAG_ROLES } from "@/components/ds/institutional";
import { ECOWAS_LINKS } from "@/lib/site";
import { useOfficialAsset } from "@/lib/public-site";
import { useAuthorityChairs, formatChairDate } from "@/lib/authority-data";

const ARMS = [
  { slug: "commission", key: "commission", site: "https://ecowas.int", ...GOVERNANCE_ARMS[0] },
  { slug: "parliament", key: "parliament", site: "https://parl.ecowas.int", ...GOVERNANCE_ARMS[1] },
  { slug: "court", key: "court", site: "https://www.courtecowas.org", ...GOVERNANCE_ARMS[2] },
];

const SECTIONS = [
  ["authority", "The Authority"], ["governance", "ECOWAS Governance"], ["other", "Other Institutions"], ["agencies", "Specialized Agencies"],
  ["directory", "Institution Directory"], ["audit-universe", "OAG Audit Universe"],
] as const;

function ArmLogo({ k, fallback, body }: { k: string; fallback: string; body: string }) {
  const logo = useOfficialAsset(k, fallback);
  return <img src={logo.src} alt={logo.alt ?? `${body} logo`} width={72} height={72} loading="lazy" className="size-[4.5rem] object-contain" />;
}

function Pending({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-border bg-surface-sunken p-5 text-small text-muted-foreground">{children}</p>;
}

function ArmDetail({ slug }: { slug: string }) {
  const a = ARMS.find((x) => x.slug === slug)!;
  return (
    <Container as="section" className="py-section">
      <nav aria-label="Breadcrumb" className="text-small text-muted-foreground"><Link to="/institutions" className="hover:text-primary">ECOWAS Institutions</Link> / {a.arm}</nav>
      <div className="mt-6 flex items-center gap-5"><ArmLogo k={a.key} fallback={a.logo} body={a.body} /><div><p className="overline text-primary">{a.arm}</p><h1 className="font-display text-h1">{a.body}</h1></div></div>
      <p className="mt-6 max-w-2xl text-lead text-muted-foreground">{a.role}</p>
      <a href={a.site} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">Official website <ArrowUpRight className="size-4" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>
      <div className="mt-10 max-w-2xl"><Pending>Published OAG audit information for this institution will appear here once approved for release.</Pending></div>
    </Container>
  );
}

function AuthoritySection() {
  const { current, archive, loading } = useAuthorityChairs();
  const since = formatChairDate(current?.startDate);
  const initials = current?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <section id="authority" aria-labelledby="h-authority" className="scroll-mt-28 border border-border bg-card p-6 md:p-8">
      <p className="overline flex items-center gap-2 text-primary"><Landmark className="size-4" aria-hidden />Highest decision-making body</p>
      <h2 id="h-authority" className="mt-2 font-display text-h2">The Authority of Heads of State and Government</h2>
      <p className="mt-3 max-w-2xl text-small text-muted-foreground">
        The Authority is the supreme institution of ECOWAS. Its Chairmanship rotates among Heads of State and Government and is held for a defined term.
      </p>
      {loading ? (
        <div className="mt-6 h-20 w-2/3 animate-pulse bg-surface-sunken" />
      ) : current ? (
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <figure className="relative aspect-[4/5] w-36 overflow-hidden bg-surface-sunken">
            {current.portrait ? (
              <img src={current.portrait.src} alt={current.portrait.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center">
                <span className="font-display text-h2 text-muted-foreground/40" aria-hidden>{initials}</span>
                <figcaption className="absolute inset-x-2 bottom-2 text-[0.65rem] text-muted-foreground">Official portrait to be published once supplied.</figcaption>
              </div>
            )}
          </figure>
          <div>
            <p className="font-display text-h3">{current.honorific} {current.fullName}</p>
            <p className="mt-1 text-small font-semibold text-ink-soft">{current.officialTitle}</p>
            <p className="text-small text-muted-foreground">{current.role}</p>
            {since && <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Chairmanship assumed {since}</p>}
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-2xl"><Pending>The current Chairman of the Authority will be shown here once published.</Pending></div>
      )}
      {archive.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          Previous Chairman: {archive.map((c) => `${c.honorific} ${c.fullName} (${c.countryName})`).join(" · ")}
        </p>
      )}
    </section>
  );
}

export default function Institutions() {
  const { sub } = useParams();
  if (sub && ARMS.some((a) => a.slug === sub)) return <ArmDetail slug={sub} />;
  return (
    <>
      <section className="border-b border-border bg-surface-sunken py-section">
        <Container>
          <p className="overline text-primary">Institutions Hub</p>
          <h1 className="mt-3 max-w-3xl font-display text-h1">ECOWAS Institutions</h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">ECOWAS has three arms of governance, supported by other institutions and specialized agencies. OAG provides independent assurance across them.</p>
          <nav aria-label="On this page" className="mt-8"><ul className="flex flex-wrap gap-2">{SECTIONS.map(([id, t]) => <li key={id}><a href={`#${id}`} className="inline-flex min-h-11 items-center border border-border bg-card px-4 text-small font-semibold hover:border-primary hover:text-primary">{t}</a></li>)}</ul></nav>
        </Container>
      </section>
      <Container className="grid gap-section py-section">
        <section id="governance" aria-labelledby="h-gov" className="scroll-mt-28">
          <h2 id="h-gov" className="font-display text-h2">ECOWAS Governance</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {ARMS.map(({ slug, key, arm, body, icon: Icon, logo, role }) => (
              <li key={slug}>
                <Link to={`/institutions/${slug}`} className="group flex h-full flex-col border border-border border-t-2 border-t-ink bg-card p-6 hover:shadow-raised">
                  <ArmLogo k={key} fallback={logo} body={body} />
                  <span className="mt-4 flex items-center gap-2 text-ink-soft"><Icon className="size-4" aria-hidden /><span className="overline">{arm}</span></span>
                  <span className="mt-2 font-display text-h4 group-hover:text-primary">{body}</span>
                  <span className="mt-2 flex-1 text-small text-muted-foreground">{role}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-primary">View institution <ArrowRight className="size-4" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section id="other" aria-labelledby="h-other" className="scroll-mt-28"><h2 id="h-other" className="font-display text-h2">{ECOSYSTEM[0].label}</h2><div className="mt-4 max-w-2xl"><Pending>The approved list of other ECOWAS institutions will be published here.</Pending></div></section>
        <section id="agencies" aria-labelledby="h-ag" className="scroll-mt-28"><h2 id="h-ag" className="font-display text-h2">{ECOSYSTEM[1].label}</h2><div className="mt-4 max-w-2xl"><Pending>The approved list of specialized agencies will be published here.</Pending></div></section>
        <section id="directory" aria-labelledby="h-dir" className="scroll-mt-28">
          <h2 id="h-dir" className="font-display text-h2">Institution Directory</h2>
          <ul className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
            {ECOWAS_LINKS.map(([n, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between bg-card px-5 py-4 text-small font-semibold hover:text-primary">{n}<ArrowUpRight className="size-4" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a></li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Partial directory. The complete approved directory will be added.</p>
        </section>
        <section id="audit-universe" aria-labelledby="h-au" className="scroll-mt-28 border-2 border-primary bg-card p-6 md:p-8">
          <p className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" aria-hidden /><span className="overline">Independent assurance — not an arm of governance</span></p>
          <h2 id="h-au" className="mt-2 font-display text-h2">OAG Audit Universe</h2>
          <p className="mt-3 max-w-2xl text-small text-muted-foreground">{OAG_POSITIONING}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{OAG_ROLES.map((r) => <li key={r} className="border border-primary/40 px-2 py-1 text-xs font-semibold text-primary">{r}</li>)}</ul>
          <Link to="/transparency/institutions" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">Published coverage by institution <ArrowRight className="size-4" aria-hidden /></Link>
        </section>
      </Container>
    </>
  );
}
