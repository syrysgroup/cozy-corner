import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { useOfficialAsset } from "@/lib/public-site";
import type { LucideIcon } from "lucide-react";

export type ArmInfo = { slug: string; key: string; site: string; arm: string; body: string; role: string; logo: string; icon: LucideIcon };

type Profile = {
  summary: string;
  facts: [string, string][];
  leader: { title: string; name: string; country: string; since: string };
  mandate: string[];
  structure: string[];
  history: [string, string][];
};

// Leadership and facts as last published by the institution; verify against official sources before launch.
const PROFILES: Record<string, Profile> = {
  commission: {
    summary: "The ECOWAS Commission is the executive arm of the Community. It drafts and implements Community acts, runs regional programmes and coordinates the work of specialised agencies on behalf of Member States.",
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "1975 (as Executive Secretariat); Commission since 2007"], ["Legal basis", "Revised ECOWAS Treaty, 1993"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "President of the ECOWAS Commission", name: "H.E. Dr Omar Alieu Touray", country: "The Gambia", since: "July 2022" },
    mandate: ["Prepare and implement decisions of the Authority and Council of Ministers", "Propose Community legislation and regional policies", "Manage Community programmes, budget and resources", "Represent the Community in international relations"],
    structure: ["President", "Vice-President", "Commissioners leading thematic departments", "Directorates and specialised agencies"],
    history: [["1975", "Treaty of Lagos creates ECOWAS and its Executive Secretariat"], ["1993", "Revised Treaty broadens Community institutions"], ["2007", "Executive Secretariat transformed into the Commission"]],
  },
  parliament: {
    summary: "The ECOWAS Parliament is the Community’s assembly of peoples. It brings together representatives of Member State parliaments to debate regional issues, give opinions on Community acts and strengthen democratic oversight.",
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "Protocol of 1994; inaugurated in 2000"], ["Seats", "115 representatives from Member States"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "Speaker of the ECOWAS Parliament", name: "Rt. Hon. Hadja Mémounatou Ibrahima", country: "Togo", since: "2024" },
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

export function ArmDetailPage({ a }: { a: ArmInfo }) {
  const p = PROFILES[a.slug];
  const logo = useOfficialAsset(a.key, a.logo);
  const Icon = a.icon;
  return (
    <>
      <section aria-labelledby="arm-title" className="relative overflow-hidden bg-surface-sunken">
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
      </section>

      <Container as="section" className="py-10">
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {p.facts.map(([k, v]) => <div key={k} className="bg-card p-5"><dt className="overline">{k}</dt><dd className="mt-2 font-display text-h4">{v}</dd></div>)}
        </dl>
      </Container>

      <section id="leader" aria-labelledby="leader-title" className="scroll-mt-24 py-section"><Container>
        <p className="overline text-primary">Leadership</p>
        <h2 id="leader-title" className="mt-3 font-display text-h1">Current leader</h2>
        <article className="mt-8 grid overflow-hidden border border-border bg-card md:grid-cols-[16rem_1fr]">
          <div className="grid min-h-56 place-items-center border-r border-border bg-surface-sunken p-6">
            <img src={logo.src} alt="" className="max-h-44 w-auto object-contain" />
          </div>
          <div className="p-8">
            <p className="overline flex items-center gap-2 text-primary"><UserRound className="size-4" aria-hidden />{p.leader.title}</p>
            <h3 className="mt-3 font-display text-h2">{p.leader.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
              <li className="flex items-center gap-2"><MapPin className="size-4" aria-hidden />{p.leader.country}</li>
              <li className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />In office since {p.leader.since}</li>
            </ul>
            <p className="mt-6 border-l-2 border-ecowas-yellow pl-4 text-xs text-muted-foreground">Based on the institution’s latest public information. Official portrait and biography will be added once confirmed.</p>
          </div>
        </article>
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
