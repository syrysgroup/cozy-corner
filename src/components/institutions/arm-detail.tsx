import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { useOfficialAsset } from "@/lib/public-site";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";

export type ArmInfo = { slug: string; key: string; site: string; arm: string; body: string; role: string; logo: string; icon: LucideIcon };

type Profile = {
  summary: string;
  building?: { path: string; alt: string; caption: string };
  facts: [string, string][];
  leader: { title: string; name: string; country: string; since: string; portraitPath?: string };
  additionalLeaders?: { role: string; name: string; country: string; portfolio: string; link: string; portraitPath?: string }[];
  mandate: string[];
  structure: string[];
  history: [string, string][];
};

// Commission information is centralized here so profile views and listings share one record.
const PROFILES: Record<string, Profile> = {
  commission: {
    summary: "The ECOWAS Commission is the Community’s executive arm. It implements decisions and regional programmes, coordinates Community institutions, and advances cooperation among Member States.",
    building: { path: "Building/commission headquarter.jpeg", alt: "ECOWAS Commission headquarters in Abuja, Nigeria", caption: "ECOWAS Commission headquarters · Abuja, Nigeria" },
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "1975"], ["Member States", "12"], ["Leadership term", "2026–2030"], ["Legal basis", "Revised ECOWAS Treaty, 1993"]],
    leader: { title: "President of the ECOWAS Commission", name: "H.E. General Birame Diop", country: "Senegal", since: "1 September 2026", portraitPath: "Leadership/commission-president.jpeg" },
    additionalLeaders: [
      { role: "Vice-President of the ECOWAS Commission", name: "H.E. Anthony Oluwatosin Ogunjimi", country: "Nigeria", portfolio: "Office of the Vice-President", link: "https://www.ecowas.int/departments/office-of-the-vice-president/", portraitPath: "Leadership/commission vice president.jpeg" },
      { role: "Commissioner", name: "Ms. Francess Piagie Alghali", country: "Sierra Leone", portfolio: "Political Affairs, Peace and Security", link: "https://www.ecowas.int/departments/political-affairs-peace-security/", portraitPath: "Leadership/commissioner political affairs.jpeg" },
      { role: "Commissioner", name: "Mr. Dehpue Yenpea Zuo", country: "Liberia", portfolio: "Economic Affairs and Agriculture", link: "https://www.ecowas.int/departments/economic-affairs-agriculture/", portraitPath: "Leadership/commissioner economic affairs and agriculture.jpeg" },
      { role: "Commissioner", name: "Dr. Kalilou Sylla", country: "Côte d’Ivoire", portfolio: "Internal Services", link: "https://www.ecowas.int/departments/internal-affairs/", portraitPath: "Leadership/commissioner for internal services.jpeg" },
      { role: "Commissioner", name: "Hon. Amin Amidu Sulemani", country: "Ghana", portfolio: "Infrastructure, Energy and Digitalization", link: "https://www.ecowas.int/departments/infrastructure-energy-digitalization/", portraitPath: "Leadership/commissioner for infrastructure, Energy & Digital.jpeg" },
      { role: "Commissioner", name: "Prof. Nassirou Bako-Arifari", country: "Benin", portfolio: "Human Development and Social Affairs", link: "https://www.ecowas.int/departments/human-development-social-affairs/", portraitPath: "Leadership/commissioner human development and social affairs.jpeg" },
    ],
    mandate: ["Prepare and implement decisions of the Authority and Council of Ministers", "Propose Community legislation and regional policies", "Manage Community programmes, budget and resources", "Represent the Community in international relations"],
    structure: ["President", "Vice-President", "Commissioners leading thematic departments", "Directorates and specialised agencies"],
    history: [["1975", "Treaty of Lagos creates ECOWAS and its Executive Secretariat"], ["1993", "Revised Treaty broadens Community institutions"], ["2007", "Executive Secretariat transformed into the Commission"]],
  },
  parliament: {
    summary: "The ECOWAS Parliament is the Community’s assembly of peoples. It brings together representatives of Member State parliaments to debate regional issues, give opinions on Community acts and strengthen democratic oversight.",
    building: { path: "Building/parliament building.JPG", alt: "ECOWAS Parliament building in Abuja, Nigeria", caption: "ECOWAS Parliament building · Abuja, Nigeria" },
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "Protocol of 1994; inaugurated in 2000"], ["Seats", "115 representatives from Member States"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "Speaker of the ECOWAS Parliament", name: "Rt. Hon. Hadja Mémounatou Ibrahima", country: "Togo", since: "2024", portraitPath: "Leadership/parliament speaker.jpg" },
    additionalLeaders: [
      { role: "First Deputy Speaker", name: "Rt. Hon. Jibrin Barau", country: "Nigeria", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 1st deputy speaker.jpeg" },
      { role: "Second Deputy Speaker", name: "Hon. Adjaratou Traore Coulibaly", country: "Côte d’Ivoire", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 2nd deputy speaker.jpeg" },
      { role: "Third Deputy Speaker", name: "Hon. Alexander Afenyo-Markin", country: "Ghana", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 3rd deputy speaker.jpeg" },
      { role: "Fourth Deputy Speaker", name: "Hon. Billay Tunkara", country: "Gambia", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 4th deputy speaker.jpeg" },
    ],
    mandate: ["Consider matters on human rights, integration and regional policy", "Give opinions on Community acts and the budget", "Promote democratic governance and citizen participation", "Strengthen links between national parliaments"],
    structure: ["Speaker and Bureau", "Plenary of Members of Parliament", "Standing committees", "General Secretariat"],
    history: [["1993", "Revised Treaty provides for a Community Parliament"], ["1994", "Protocol relating to the Parliament adopted"], ["2000", "First Legislature inaugurated"]],
  },
  court: {
    summary: "The Community Court of Justice is the judicial arm of ECOWAS. It interprets and applies Community law, settles disputes between Member States and institutions, and hears human rights cases brought by individuals.",
    facts: [["Seat", "Abuja, Nigeria"], ["Established", "Protocol of 1991; operational since 2001"], ["Jurisdiction", "Community law, disputes, human rights"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "President of the Court", name: "Hon. Justice Ricardo Cláudio Monteiro Gonçalves", country: "Cabo Verde", since: "2022" },
    mandate: ["Interpret and apply the Treaty and Community acts", "Settle disputes between Member States and institutions", "Hear cases on human rights violations in Member States", "Give advisory opinions on Community law"],
    structure: ["President and Vice-President", "Judges of the Court", "Registry", "Administration"],
    history: [["1991", "Protocol on the Community Court of Justice adopted"], ["2001", "Court inaugurated"], ["2005", "Supplementary Protocol extends jurisdiction to human rights"]],
  },
};

function leadershipPortraitUrl(path: string) {
  return supabase.storage.from("institution-assets").getPublicUrl(path).data.publicUrl;
}

function LeadershipPortrait({ path, name, className = "h-full w-full object-cover" }: { path: string; name: string; className?: string }) {
  const [unavailable, setUnavailable] = useState(false);
  return unavailable ? (
    <div className="grid h-full min-h-52 place-items-center bg-surface-sunken px-5 text-center text-small text-muted-foreground">
      <div className="grid justify-items-center gap-3"><UserRound className="size-10" aria-hidden /><span>Official portrait is currently unavailable.</span></div>
    </div>
  ) : (
    <img src={leadershipPortraitUrl(path)} alt={`Official portrait of ${name}`} loading="lazy" decoding="async" className={className} onError={() => setUnavailable(true)} />
  );
}

function InstitutionHero({ a, p, logo, leadershipId }: { a: ArmInfo; p: Profile; logo: { src: string; alt?: string }; leadershipId: string }) {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <section aria-labelledby="arm-title" className="institution-photo-header relative isolate overflow-hidden bg-ink">
      {p.building && !unavailable && <img src={leadershipPortraitUrl(p.building.path)} alt={p.building.alt} loading="eager" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" onError={() => setUnavailable(true)} />}
      <div className="institution-photo-overlay absolute inset-0 -z-10" aria-hidden />
      <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container className="relative py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-small text-primary-foreground/90"><Link to="/institutions" className="inline-flex min-h-11 items-center gap-1 hover:underline"><ArrowLeft className="size-4" aria-hidden />ECOWAS Institutions</Link> / {a.body}</nav>
        <div className="mt-6 flex items-center gap-4">
          <img src={logo.src} alt={logo.alt ?? `Official logo of the ${a.body}`} width={80} height={80} className="size-16 shrink-0 bg-card p-2 object-contain md:size-20" />
          <p className="text-small font-semibold uppercase text-primary-foreground"><a.icon className="mb-2 size-5" aria-hidden />{a.arm} arm of ECOWAS</p>
        </div>
        <h1 id="arm-title" className="mt-5 max-w-3xl font-display text-4xl text-primary-foreground md:text-6xl">{a.body}</h1>
        <p className="mt-5 max-w-2xl text-lead text-primary-foreground/95">{p.summary}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg"><a href={a.site} target="_blank" rel="noreferrer">Official website <ArrowUpRight /><span className="sr-only">(opens in a new tab)</span></a></Button>
          <Button asChild variant="secondary" size="lg" className="border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-ink"><a href={`#${leadershipId}`}>Current leadership</a></Button>
        </div>
        {p.building && <p className="mt-8 text-xs text-primary-foreground/80">{p.building.caption}</p>}
      </Container>
    </section>
  );
}

function CommissionProfile({ a, p, logo }: { a: ArmInfo; p: Profile; logo: { src: string; alt?: string } }) {
  const commissioners = p.additionalLeaders?.filter((leader) => leader.role === "Commissioner") ?? [];
  const vicePresident = p.additionalLeaders?.find((leader) => leader.role === "Vice-President of the ECOWAS Commission");

  return (
    <>
      <InstitutionHero a={a} p={p} logo={logo} leadershipId="leadership" />

      <Container as="section" aria-label="Commission facts" className="py-8">
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {p.facts.map(([label, value]) => <div key={label} className="bg-card p-5"><dt className="overline">{label}</dt><dd className="mt-2 font-display text-h4">{value}</dd></div>)}
        </dl>
      </Container>

      <section id="leadership" aria-labelledby="leadership-title" className="scroll-mt-24 py-section">
        <Container>
          <p className="overline text-primary">Executive leadership · 2026–2030</p>
          <h2 id="leadership-title" className="mt-3 font-display text-h1">Commission leadership</h2>
          <article className="mt-8 grid overflow-hidden border border-border bg-card md:grid-cols-[14rem_1fr]">
            <figure className="aspect-[4/5] min-h-64 overflow-hidden bg-surface-sunken">
              {p.leader.portraitPath && <LeadershipPortrait path={p.leader.portraitPath} name={`${p.leader.name}, ${p.leader.title}`} />}
            </figure>
            <div className="p-6 md:p-8">
              <p className="overline flex items-center gap-2 text-primary"><UserRound className="size-4" aria-hidden />{p.leader.title}</p>
              <h3 className="mt-3 font-display text-h2">{p.leader.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
                <li className="flex items-center gap-2"><MapPin className="size-4" aria-hidden />{p.leader.country}</li>
                <li className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />In office since {p.leader.since}</li>
              </ul>
              <a href="https://www.ecowas.int/departments/office-of-the-president/" target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary hover:underline">Office of the President <ArrowUpRight className="size-4" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>
            </div>
          </article>
          {vicePresident && (
            <article className="mt-5 grid overflow-hidden border border-border bg-card sm:grid-cols-[10rem_1fr]">
              <figure className="aspect-[4/5] overflow-hidden bg-surface-sunken sm:aspect-auto"><LeadershipPortrait path={vicePresident.portraitPath} name={`${vicePresident.name}, ${vicePresident.role}`} /></figure>
              <div className="flex flex-col justify-center p-6 md:flex-row md:items-center md:justify-between md:gap-6">
                <div><p className="overline text-primary">{vicePresident.role}</p><h3 className="mt-2 font-display text-h3">{vicePresident.name}</h3><p className="mt-1 text-small text-muted-foreground">{vicePresident.country}</p></div>
                <a href={vicePresident.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary hover:underline md:mt-0">{vicePresident.portfolio}<ArrowUpRight className="size-4" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>
              </div>
            </article>
          )}
          <div className="mt-12">
            <h3 className="font-display text-h2">Commissioners and portfolios</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,50rem)_minmax(0,1fr)]">
              <div className="min-w-0 overflow-x-auto">
                <ul className="grid w-[50rem] grid-cols-5 gap-px border border-border bg-border">
                  {commissioners.map((commissioner) => (
                    <li key={commissioner.portfolio} className="flex flex-col bg-card">
                  <figure className="aspect-[4/5] overflow-hidden bg-surface-sunken"><LeadershipPortrait path={commissioner.portraitPath} name={`${commissioner.name}, Commissioner for ${commissioner.portfolio}`} /></figure>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-semibold uppercase text-primary">{commissioner.country}</p>
                    <h4 className="mt-2 font-display text-base font-bold leading-snug text-ink">{commissioner.name}</h4>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-soft">{commissioner.portfolio}</p>
                    <a href={commissioner.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary hover:underline">Department <ArrowUpRight className="size-3.5 shrink-0" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>
                  </div>
                    </li>
                  ))}
                </ul>
              </div>
              <aside className="flex flex-col justify-center border border-border bg-surface-sunken p-6">
                <p className="overline text-primary">Portfolio overview</p>
                <h4 className="mt-2 font-display text-h3">Regional priorities, one Commission</h4>
                <p className="mt-3 text-small leading-relaxed text-muted-foreground">These portfolios cover peace and security, economic affairs and agriculture, internal services, infrastructure and digitalization, and human development and social affairs.</p>
                <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">Select a department link on a commissioner’s profile for its official ECOWAS page.</p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Mandate and structure" className="border-y border-border bg-surface-sunken py-section">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div><h2 className="font-display text-h2">Mandate</h2><ul className="mt-6 grid gap-3">{p.mandate.map((item, index) => <li key={item} className="flex gap-4 border-b border-border pb-3"><span className="font-mono text-xs text-primary">0{index + 1}</span>{item}</li>)}</ul></div>
          <div><h2 className="font-display text-h2">Departmental structure</h2><ul className="mt-6 grid gap-3">{p.structure.map((item) => <li key={item} className="border-l-4 border-ecowas-green bg-card px-4 py-3">{item}</li>)}</ul></div>
        </Container>
      </section>

      <Container as="section" className="py-section">
        <h2 className="font-display text-h2">Key milestones</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">{p.history.map(([year, item]) => <li key={year} className="border-t-4 border-ecowas-yellow pt-4"><p className="font-display text-h2 text-primary">{year}</p><p className="mt-2 text-small text-ink-soft">{item}</p></li>)}</ol>
      </Container>

      <Container as="section" className="pb-section">
        <div className="flex flex-col gap-4 border-2 border-primary bg-card p-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">Independent assurance.</strong> The Office of the Auditor General provides independent audit and assurance across ECOWAS institutions; it is not a fourth governance arm or subordinate to the Commission.</span></p>
          <Button asChild variant="secondary" className="shrink-0"><Link to="/institutions">All ECOWAS Institutions</Link></Button>
        </div>
      </Container>
    </>
  );
}

export function ArmDetailPage({ a }: { a: ArmInfo }) {
  const p = PROFILES[a.slug];
  const logo = useOfficialAsset(a.key, a.logo);
  if (a.slug === "commission") return <CommissionProfile a={a} p={p} logo={logo} />;
  const Icon = a.icon;
  return (
    <>
      {a.slug === "parliament" ? <InstitutionHero a={a} p={p} logo={logo} leadershipId="leader" /> : <section aria-labelledby="arm-title" className="relative overflow-hidden bg-surface-sunken">
        <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
        <Container className="grid gap-10 py-section lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-small text-muted-foreground"><Link to="/institutions" className="inline-flex items-center gap-1 hover:text-primary"><ArrowLeft className="size-4" aria-hidden />ECOWAS Institutions</Link> / {a.arm}</nav>
            <p className="overline mt-8 flex items-center gap-2 text-primary"><Icon className="size-4" aria-hidden />{a.arm} arm of ECOWAS</p>
            <h1 id="arm-title" className="mt-3 font-display text-display-lg">{a.body}</h1>
            <p className="mt-6 max-w-2xl text-lead text-ink-soft">{p.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href={a.site} target="_blank" rel="noreferrer">Official website <ArrowUpRight /><span className="sr-only">(opens in a new tab)</span></a></Button>
              <Button asChild variant="secondary" size="lg"><a href="#leader">Current leadership</a></Button>
            </div>
          </div>
          <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center border border-border bg-card p-10 shadow-raised">
            <span className="absolute inset-4 border border-dashed border-border" aria-hidden />
            <img src={logo.src} alt={logo.alt ?? `Official logo of the ${a.body}`} width={320} height={320} className="relative h-full w-full scale-125 object-contain" />
            <p className="absolute inset-x-0 bottom-3 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">Official emblem</p>
          </div>
        </Container>
      </section>}

      <Container as="section" className="py-10">
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {p.facts.map(([k, v]) => <div key={k} className="bg-card p-5"><dt className="overline">{k}</dt><dd className="mt-2 font-display text-h4">{v}</dd></div>)}
        </dl>
      </Container>

      <section id="leader" aria-labelledby="leader-title" className="scroll-mt-24 py-section"><Container>
        <p className="overline text-primary">Leadership</p>
        <h2 id="leader-title" className="mt-3 font-display text-h1">Current leader</h2>
        <article className="mt-8 grid overflow-hidden border border-border bg-card md:grid-cols-[16rem_1fr]">
          <figure className="aspect-[4/5] min-h-64 overflow-hidden border-r border-border bg-surface-sunken">
            {p.leader.portraitPath ? (
              <LeadershipPortrait path={p.leader.portraitPath} name={`${p.leader.name}, ${p.leader.title}`} />
            ) : (
              <div className="grid h-full place-items-center p-8">
                <img src={logo.src} alt="" className="max-h-44 w-auto object-contain" />
              </div>
            )}
          </figure>
          <div className="p-8">
            <p className="overline flex items-center gap-2 text-primary"><UserRound className="size-4" aria-hidden />{p.leader.title}</p>
            <h3 className="mt-3 font-display text-h2">{p.leader.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
              <li className="flex items-center gap-2"><MapPin className="size-4" aria-hidden />{p.leader.country}</li>
              <li className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />In office since {p.leader.since}</li>
            </ul>
            <p className="mt-6 border-l-2 border-ecowas-yellow pl-4 text-xs text-muted-foreground">Based on the institution’s latest public information.</p>
          </div>
        </article>

        {p.additionalLeaders && (
          <div className="mt-12">
            <h3 className="font-display text-h3">Bureau and Leadership</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {p.additionalLeaders.map((leader) => (
                <article key={leader.name} className="flex flex-col border border-border bg-card">
                  <figure className="aspect-[4/5] overflow-hidden bg-surface-sunken">
                    {leader.portraitPath && <LeadershipPortrait path={leader.portraitPath} name={`${leader.name}, ${leader.role}`} />}
                  </figure>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-semibold uppercase text-primary">{leader.country}</p>
                    <h4 className="mt-2 font-display text-base font-bold leading-snug text-ink">{leader.name}</h4>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-soft">{leader.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </Container></section>

      <section aria-label="Mandate and structure" className="border-y border-border bg-surface-sunken py-section">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-h2">Mandate</h2>
            <ul className="mt-6 grid gap-3">{p.mandate.map((m, i) => <li key={m} className="flex gap-4 border-b border-border pb-3"><span className="font-mono text-xs text-primary">0{i + 1}</span>{m}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-display text-h2">Structure</h2>
            <ul className="mt-6 grid gap-3">{p.structure.map((s) => <li key={s} className="border-l-4 border-ecowas-green bg-card px-4 py-3">{s}</li>)}</ul>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-section">
        <h2 id="history-title" className="font-display text-h2">Key milestones</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {p.history.map(([y, t]) => <li key={y} className="border-t-4 border-ecowas-yellow pt-4"><p className="font-display text-h2 text-primary">{y}</p><p className="mt-2 text-small text-ink-soft">{t}</p></li>)}
        </ol>
      </Container>

      <Container as="section" className="pb-section">
        <div className="flex flex-col gap-4 border-2 border-primary bg-card p-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">OAG and the {a.body}.</strong> The Office provides independent audit and assurance over this institution. Published audit information will appear here once approved for release.</span></p>
          <Button asChild variant="secondary" className="shrink-0"><Link to="/institutions">All ECOWAS Institutions</Link></Button>
        </div>
      </Container>
    </>
  );
}
