import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronDown, FileText, Landmark, UserRound } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container, PageHeader } from "@/components/ds/shell/layout-parts";
import { NAV, UI } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import auditTeam from "@/assets/hero-auditors.jpg";
import { InstitutionalArchitecture, OAG_POSITIONING } from "@/components/ds/institutional";

const stages = [
  { title: "Planning", description: "Set out the engagement and its intended scope." },
  { title: "Risk assessment", description: "Identify and assess the risks relevant to the work." },
  { title: "Audit", description: "Carry out the planned audit work and gather evidence." },
  { title: "Findings", description: "Present matters arising from the audit work." },
  { title: "Recommendations", description: "Set out actions to address the findings." },
  { title: "Management response", description: "Record management’s response to the recommendations." },
  { title: "Follow-up", description: "Review progress on agreed actions." },
  { title: "Verification", description: "Check the evidence provided on implementation." },
  { title: "Closure", description: "Conclude the engagement and record its status." },
];

const sectionCopy: Record<string, { lead: string; note: string }> = {
  mandate: {
    lead: "An independent office providing assurance on the use of public resources across ECOWAS Institutions.",
    note: "The Office’s approved legal instrument and mandate text have not been supplied for this draft.",
  },
  "role-responsibilities": {
    lead: "The Office’s role and responsibilities will be described here using approved institutional content.",
    note: "Detailed responsibilities and scope are awaiting confirmation from the Office.",
  },
  leadership: {
    lead: "Leadership profiles will be published when approved names, biographies and photographs are available.",
    note: "No individual names or biographies have been provided for this draft.",
  },
  strategy: {
    lead: "Strategic priorities and outcomes will be published when an approved plan is available.",
    note: "The current approved strategic plan has not been supplied.",
  },
  "organizational-structure": {
    lead: "Explore the structure diagram. Official unit names and reporting lines will replace these placeholders.",
    note: "The approved organizational chart has not been supplied.",
  },
  "audit-approach": {
    lead: "An overview of the audit journey, from planning through closure.",
    note: "Illustrative stage summaries based on the supplied brief; confirm against the approved OAG methodology.",
  },
  governance: {
    lead: "Governance information will be added when approved institutional content is available.",
    note: "Governance arrangements and related documents have not been supplied for this draft.",
  },
  contact: {
    lead: "Contact the Office of the Auditor General of ECOWAS Institutions.",
    note: "Contact channels and office details have not been supplied for this draft.",
  },
};

const orgNodes = ["Structure layer 01", "Structure layer 02", "Structure layer 03"];

function PlaceholderNotice({ children }: { children: string }) {
  return (
    <p className="border-l-2 border-accent pl-4 text-small text-muted-foreground" role="note">
      {children}
    </p>
  );
}

function AboutLanding() {
  const { lang } = useI18n();
  const about = NAV.find((item) => item.slug === "about");
  if (!about) return null;

  return (
    <>
      <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-ink text-background md:min-h-[39rem]">
        <img src={auditTeam} alt="Audit professionals reviewing documents together" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_58%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" aria-hidden="true" />
        <Container className="pb-12 pt-28 md:pb-16">
          
          <p className="overline text-background/75">Office of the Auditor General · ECOWAS Institutions</p>
          <h1 className="mt-4 max-w-3xl font-display text-display-xl text-background">About OAG</h1>
          <p className="mt-5 max-w-2xl text-lead text-background/90">An independent office providing assurance on the use of public resources across ECOWAS Institutions.</p>
          <a href="#about-sections" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-background underline underline-offset-4">
            Explore the Office <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </Container>
      </section>

      <section id="about-sections" className="scroll-mt-28 border-b border-border bg-card">
        <Container className="max-w-3xl py-section">
          <p className="overline text-primary">About the Office</p>
          <p className="mt-4 text-lead text-ink-soft">{OAG_POSITIONING}</p>
        </Container>
      </section>

      <Container className="py-section">
        <div className="mb-8 border-b border-border pb-5">
          <p className="overline text-primary">Inside OAG</p>
          <h2 className="mt-3 font-display text-h2">Explore the Office</h2>
        </div>
        <ul className="grid gap-x-10 md:grid-cols-2">
          {about.children.map((item, index) => (
            <li key={item.slug} className="border-b border-border">
              <Link to={`/about/${item.slug}`} className="group flex min-h-24 items-center gap-5 py-5">
                <span className="font-mono text-small text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-h4 text-ink">{item.label[lang]}</span>
                  <span className="mt-1 block text-small text-muted-foreground">{item.summary}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-base group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

function LeadershipProfiles() {
  return (
    <section aria-label="Leadership profile template" className="grid gap-8 border-y border-border py-8 md:grid-cols-[14rem_1fr] md:gap-12">
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 border border-dashed border-border bg-surface-sunken text-muted-foreground">
        <UserRound className="size-10" aria-hidden="true" />
        <span className="text-small">Photograph placeholder</span>
      </div>
      <div className="py-2">
        <p className="overline text-primary">Leadership profile</p>
        <h2 className="mt-3 font-display text-h2">Name to be confirmed</h2>
        <p className="mt-2 text-lead text-ink-soft">Auditor General</p>
        <p className="mt-5 max-w-2xl text-small text-muted-foreground">Biography and professional history will be added when approved information is available.</p>
        <div className="mt-7 grid gap-6 border-t border-border pt-5 md:grid-cols-2">
          <div><h3 className="font-display text-h4">Responsibilities</h3><p className="mt-2 text-small text-muted-foreground">Approved responsibilities to be supplied.</p></div>
          <div><h3 className="font-display text-h4">Related publications</h3><p className="mt-2 inline-flex items-center gap-2 text-small text-muted-foreground"><FileText className="size-4" aria-hidden="true" />No publications provided.</p></div>
        </div>
      </div>
    </section>
  );
}

function OrganizationStructure() {
  const [expanded, setExpanded] = useState<string[]>([orgNodes[0]]);
  const toggle = (node: string) => setExpanded((current) => current.includes(node) ? current.filter((item) => item !== node) : [...current, node]);
  return (
    <div className="max-w-4xl border-l-2 border-primary pl-5 md:pl-8">
      <div className="flex items-center gap-3 border border-border bg-card p-4 md:p-5">
        <Landmark className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <div><h2 className="font-display text-h4">Office of the Auditor General</h2><p className="mt-1 text-xs text-muted-foreground">Top-level label · structure details pending</p></div>
      </div>
      <ul className="ml-4 mt-3 grid gap-3 border-l border-border pl-4 md:ml-8 md:pl-6">
        {orgNodes.map((node, index) => {
          const isExpanded = expanded.includes(node);
          return (
            <li key={node}>
              <Button variant="filter" size="md" data-active={isExpanded} aria-expanded={isExpanded} onClick={() => toggle(node)} className="h-auto min-h-12 w-full justify-between whitespace-normal text-left">
                <span><span className="mr-3 font-mono text-xs text-primary">0{index + 1}</span>{node} <span className="ml-2 text-xs font-normal text-muted-foreground">Placeholder</span></span>
                <ChevronDown className={`size-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
              </Button>
              {isExpanded && <div className="ml-4 border-l border-border py-3 pl-5 text-small text-muted-foreground">Official unit names, reporting lines and functions have not been provided.</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AuditJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];
  return (
    <div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((item, index) => (
          <li key={item.title}>
            <Button variant="filter" size="md" data-active={activeStage === index} aria-pressed={activeStage === index} onClick={() => setActiveStage(index)} className="h-full min-h-16 w-full justify-start whitespace-normal text-left">
              <span className="grid size-8 shrink-0 place-items-center border border-current font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.title}</span>
            </Button>
          </li>
        ))}
      </ol>
      <div className="mt-6 border-l-2 border-primary py-1 pl-5" aria-live="polite">
        <p className="overline text-primary">Stage {String(activeStage + 1).padStart(2, "0")}</p>
        <h2 className="mt-2 font-display text-h3">{stage.title}</h2>
        <p className="mt-2 max-w-2xl text-small text-muted-foreground">{stage.description}</p>
      </div>
    </div>
  );
}

function PageBody({ page }: { page: string }) {
  switch (page) {
    case "leadership": return <LeadershipProfiles />;
    case "strategy":
      return <div className="grid gap-6 md:grid-cols-3">
        {["Priorities", "Outcomes", "Reporting period"].map((item, index) => <div key={item} className="border-t border-border pt-4"><span className="font-mono text-xs text-primary">0{index + 1}</span><h2 className="mt-3 font-display text-h4">{item}</h2><p className="mt-2 text-small text-muted-foreground">Approved plan details to be supplied.</p></div>)}
      </div>;
    case "organizational-structure": return <OrganizationStructure />;
    case "audit-approach": return <AuditJourney />;
    case "mandate": return <div className="grid gap-10">
      <p className="max-w-3xl text-lead text-ink-soft">{OAG_POSITIONING}</p>
      <InstitutionalArchitecture />
    </div>;
    case "role-responsibilities":
      return <div className="grid gap-0 border-y border-border">
        {["Role of the Office", "Responsibilities", "Scope of work"].map((item) => <details key={item} className="group border-b border-border last:border-0">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-h4 marker:hidden">{item}<ChevronDown className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
          <p className="max-w-3xl pb-5 text-small text-muted-foreground">Approved institutional content for this section has not been provided.</p>
        </details>)}
      </div>;
    case "governance":
      return <div className="grid gap-6 md:grid-cols-3">
        {["Governance framework", "Oversight", "Policies and documents"].map((item, index) => <div key={item} className="border-t border-border pt-4"><span className="font-mono text-xs text-primary">0{index + 1}</span><h2 className="mt-3 font-display text-h4">{item}</h2><p className="mt-2 text-small text-muted-foreground">Approved details to be supplied.</p></div>)}
      </div>;
    case "contact":
      return <div className="max-w-3xl border-t border-border pt-5"><h2 className="font-display text-h3">Contact information</h2><p className="mt-3 text-small text-muted-foreground">Official address, telephone, email and visitor information will be added once confirmed.</p></div>;
    default: return null;
  }
}

export default function AboutOAG() {
  const { sub } = useParams();
  const { lang } = useI18n();
  const about = NAV.find((item) => item.slug === "about");
  if (!about) return null;
  if (!sub) return <AboutLanding />;

  const page = about.children.find((item) => item.slug === sub);
  const copy = sectionCopy[sub];
  if (!page || !copy) return <PageHeader crumbs={[{ label: UI[lang].home, to: "/" }, { label: about.label[lang] }]} title="Page not found" />;

  return (
    <>
      <PageHeader crumbs={[{ label: UI[lang].home, to: "/" }, { label: about.label[lang], to: "/about" }, { label: page.label[lang] }]} overline="About OAG" title={page.label[lang]} lead={copy.lead} />
      <Container className="grid gap-10 py-section lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="About OAG pages" className="border-b border-border pb-5 lg:border-b-0 lg:pb-0">
          <ul className="grid gap-1 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
            {about.children.map((item) => <li key={item.slug}><Link to={`/about/${item.slug}`} aria-current={item.slug === sub ? "page" : undefined} className="block border-l-2 border-transparent px-3 py-2 text-small text-ink-soft hover:text-primary aria-[current=page]:border-primary aria-[current=page]:font-semibold aria-[current=page]:text-primary">{item.label[lang]}</Link></li>)}
          </ul>
        </nav>
        <div className="min-w-0">
          <div className="mb-8"><PlaceholderNotice>{copy.note}</PlaceholderNotice></div>
          <PageBody page={sub} />
          <div className="mt-12 border-t border-border pt-5"><Link to="/about" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4">About OAG <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
        </div>
      </Container>
    </>
  );
}

export function ContactPage() {
  const { lang } = useI18n();
  return (
    <>
      <PageHeader crumbs={[{ label: UI[lang].home, to: "/" }, { label: "Contact" }]} overline="Office of the Auditor General" title="Contact" lead={sectionCopy.contact.lead} />
      <Container className="py-section"><PlaceholderNotice>{sectionCopy.contact.note}</PlaceholderNotice><div className="mt-10 max-w-3xl border-t border-border pt-6"><h2 className="font-display text-h3">Contact channels</h2><p className="mt-3 text-small text-muted-foreground">Official contact details will be published here after confirmation.</p><Link to="/about/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4">Office contact details <ArrowRight className="size-4" aria-hidden="true" /></Link></div></Container>
    </>
  );
}