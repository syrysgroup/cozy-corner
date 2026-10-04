import { useMemo, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, FileText, Globe2, Menu, Search, ShieldCheck, X } from "lucide-react";
import meetingImage from "@/assets/editorial-meeting.jpg";
import buildingImage from "@/assets/editorial-building.jpg";
import { Button } from "@/components/ds/primitives";
import { DocumentCard, EditorialCard, Field, FormControl, MetricCard, SectionHeading, Specimen } from "@/components/ds/showcase";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

type Finding = { reference: string; institution: string; subject: string; owner: string; status: "Implemented" | "In progress" | "Attention" | "Overdue"; updated: string };

const findings: Finding[] = [
  { reference: "REC-2025-014", institution: "ECOWAS Commission", subject: "Strengthen procurement oversight", owner: "Audit Directorate", status: "In progress", updated: "18 Sep 2025" },
  { reference: "REC-2025-011", institution: "WAPP", subject: "Reconcile project expenditure", owner: "Finance Unit", status: "Attention", updated: "12 Sep 2025" },
  { reference: "REC-2025-008", institution: "ECOWAS Parliament", subject: "Formalise records retention", owner: "Secretariat", status: "Implemented", updated: "08 Sep 2025" },
  { reference: "REC-2025-006", institution: "ECOWAS Commission", subject: "Review asset-register controls", owner: "Internal Audit", status: "Overdue", updated: "02 Sep 2025" },
  { reference: "REC-2025-003", institution: "GIABA", subject: "Document follow-up evidence", owner: "Programme Office", status: "In progress", updated: "27 Aug 2025" },
  { reference: "REC-2024-029", institution: "WAPP", subject: "Update risk-response plans", owner: "Risk Committee", status: "Implemented", updated: "19 Aug 2025" },
];

const trend = [
  { month: "Apr", implemented: 21, monitored: 45 }, { month: "May", implemented: 29, monitored: 53 },
  { month: "Jun", implemented: 27, monitored: 50 }, { month: "Jul", implemented: 42, monitored: 62 },
  { month: "Aug", implemented: 39, monitored: 69 }, { month: "Sep", implemented: 54, monitored: 77 },
];
const audits = [{ name: "Commission", value: 38 }, { name: "Agencies", value: 27 }, { name: "Institutions", value: 21 }, { name: "Other", value: 14 }];
const pieColors = ["var(--chart-green)", "var(--chart-ocean)", "var(--chart-yellow)", "var(--chart-slate)"];
const sections = [
  ["foundations", "Foundations"], ["components", "Components"], ["forms", "Forms"],
  ["tables", "Tables"], ["visualisation", "Data"], ["patterns", "Patterns"],
] as const;

function StatusTag({ status }: { status: Finding["status"] }) {
  const style: Record<Finding["status"], string> = {
    Implemented: "status-positive", "In progress": "status-info", Attention: "status-attention", Overdue: "status-critical",
  };
  const icon: Record<Finding["status"], string> = { Implemented: "✓", "In progress": "↗", Attention: "!", Overdue: "!" };
  return <span className={`status-tag ${style[status]}`}><span aria-hidden="true">{icon[status]}</span>{status}</span>;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="showcase-nav-link" href={href}>{children}</a>;
}

export default function DesignSystem() {
  const { lang, setLang, t } = useI18n();
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const pageSize = 4;
  const filteredFindings = useMemo(() => findings
    .filter((finding) => `${finding.reference} ${finding.institution} ${finding.subject} ${finding.owner} ${finding.status}`.toLowerCase().includes(filter.trim().toLowerCase()))
    .filter((finding) => activeFilter === "All" || finding.status === activeFilter)
    .sort((a, b) => sortAscending ? a.reference.localeCompare(b.reference) : b.reference.localeCompare(a.reference)),
  [filter, activeFilter, sortAscending]);
  const totalPages = Math.max(1, Math.ceil(filteredFindings.length / pageSize));
  const visibleFindings = filteredFindings.slice(page * pageSize, (page + 1) * pageSize);
  const allVisibleSelected = visibleFindings.length > 0 && visibleFindings.every((row) => selectedRows.includes(row.reference));

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormMessage("Enter a valid email address to continue.");
      return;
    }
    setFormMessage("Your preference has been saved.");
  };

  return (
    <main className="oag-showcase">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="band h-1" aria-hidden="true" />
      <div className="utility-bar">
        <div className="showcase-container flex items-center justify-between gap-4">
          <span className="flex items-center gap-2"><span className="utility-dot" /> Office of the Auditor General <span className="utility-divider">/</span> ECOWAS Institutions</span>
          <span className="hidden items-center gap-2 md:flex"><ShieldCheck size={14} aria-hidden="true" /> Accountability, made legible.</span>
        </div>
      </div>
      <header className="showcase-header">
        <div className="showcase-container masthead">
          <a href="#top" className="brand-lockup" aria-label="Office of the Auditor General, ECOWAS Institutions — start">
            <span className="brand-seal" aria-hidden="true"><span>OAG</span></span>
            <span className="brand-name"><strong>Office of the Auditor General</strong><small>ECOWAS Institutions</small></span>
          </a>
          <div className="header-tools">
            <span className="version-stamp"><span className="version-dot" /> DESIGN SYSTEM <span>01.0</span></span>
            <label className="language-picker"><Globe2 size={15} aria-hidden="true" /><span className="sr-only">Language</span><select aria-label="Language" value={lang} onChange={(event) => setLang(event.target.value as Lang)}>{LANGS.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select><ChevronDown size={13} aria-hidden="true" /></label>
          </div>
        </div>
        <nav className="showcase-nav" aria-label="Design system sections">
          <div className="showcase-container nav-scroll"><span className="nav-index">CONTENTS</span>{sections.map(([id, label]) => <NavLink key={id} href={`#${id}`}>{label}</NavLink>)}<a className="nav-external" href="#patterns">Guidelines <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </nav>
      </header>

      <div id="main-content" />
      <section id="top" className="intro-section">
        <div className="showcase-container intro-layout">
          <div className="intro-copy">
            <p className="overline intro-eyebrow">A shared visual language <span>—</span> v1.0</p>
            <h1 className="font-display text-display-lg">{lang === "en" ? <>OAG Design<br /><em>System.</em></> : lang === "fr" ? <>Système de design<br /><em>du BVG.</em></> : <>Sistema de design<br /><em>do GAG.</em></>}</h1>
            <p className="intro-lead">{lang === "en" ? "An editorial, data-led foundation for public accountability and institutional intelligence across West Africa." : lang === "fr" ? "Un socle éditorial et axé sur les données pour la redevabilité publique et l’intelligence institutionnelle en Afrique de l’Ouest." : "Uma base editorial orientada por dados para a prestação de contas públicas e inteligência institucional na África Ocidental."}</p>
            <a href="#foundations" className="text-link">Explore the foundations <ArrowDown size={16} aria-hidden="true" /></a>
            <div className="intro-meta"><span><span className="meta-number">01</span> Brand foundations</span><span><span className="meta-number">02</span> Public + intelligence</span><span><span className="meta-number">03</span> Accessible by design</span></div>
          </div>
          <div className="intro-visual">
            <img src={buildingImage} alt="Institutional building framed by national flags" />
            <div className="image-caption"><span>INSTITUTIONAL FRAMEWORK</span><span>WEST AFRICA · ECOWAS</span></div>
            <div className="visual-index"><span>01</span><span>IDENTITY / SYSTEMS / PEOPLE</span></div>
          </div>
        </div>
      </section>

      <div className="showcase-container">
        <section id="foundations" className="showcase-section foundations-section">
          <SectionHeading index="01" eyebrow="Core language" title="Foundations">A considered system for institutional clarity — balancing brand, legibility and visual evidence.</SectionHeading>
          <div className="foundation-grid">
            <Specimen label="Colour · ECOWAS 2020">
              <div className="swatch-grid">
                {[
                  ["ECOWAS Green", "#008244", "swatch-green"], ["ECOWAS Brown", "#AD4F2E", "swatch-brown"], ["ECOWAS Yellow", "#E4CA00", "swatch-yellow"],
                  ["Light Green", "#AEBD39", "swatch-lime"], ["Orange", "#F07E26", "swatch-orange"], ["Sky Blue", "#5EA3B3", "swatch-sky"],
                  ["Ocean Blue", "#004C71", "swatch-ocean"], ["Blue Grey", "#335D68", "swatch-slate"], ["Deep Red", "#8E1D36", "swatch-red"],
                ].map(([name, hex, className]) => <div className="swatch" key={name}><span className={`swatch-chip ${className}`} /><span className="swatch-name">{name}</span><span className="swatch-hex">{hex}</span></div>)}
              </div>
              <p className="mt-5 max-w-xl text-xs text-muted-foreground">Green carries the identity. Accent colours are reserved for status and data, paired with labels and symbols.</p>
            </Specimen>
            <Specimen label="Type · Source Sans Pro">
              <div className="type-specimen">
                <div className="type-row"><span className="type-token">Display</span><span className="type-display">Public trust.<br />Visible action.</span></div>
                <div className="type-row"><span className="type-token">Heading 1</span><span className="text-h1 font-display">Accountability, made legible.</span></div>
                <div className="type-row"><span className="type-token">Heading 2</span><span className="text-h2 font-display">Independent oversight</span></div>
                <div className="type-row"><span className="type-token">Heading 3</span><span className="text-h3 font-display">Follow-up and implementation</span></div>
                <div className="type-row"><span className="type-token">Body / Regular</span><span className="text-body">Clarity in public reporting builds confidence in institutions.</span></div>
                <div className="type-row"><span className="type-token">Small / Semibold</span><span className="text-small font-semibold">REPORTING PERIOD · SEPTEMBER 2025</span></div>
                <div className="type-row"><span className="type-token">Data / Tabular</span><span className="num font-mono text-h4">1,248 <span className="text-small font-sans text-muted-foreground">recommendations</span></span></div>
              </div>
            </Specimen>
            <Specimen label="Grid · 12 / 8 / 4 columns" className="foundation-wide">
              <div className="grid-demo" aria-label="Responsive column grid example">{Array.from({ length: 12 }, (_, i) => <span key={i}>{String(i + 1).padStart(2, "0")}</span>)}</div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"><span>1440+ · 12 columns</span><span>768 · 8 columns</span><span>360 · 4 columns</span><span>8 / 16 / 24 / 32 / 48 px rhythm</span></div>
            </Specimen>
          </div>
        </section>

        <section id="components" className="showcase-section">
          <SectionHeading index="02" eyebrow="Reusable elements" title="Components">Clear action, accountable status, and editorial storytelling — from the same visual grammar.</SectionHeading>
          <div className="component-stack">
            <Specimen label="Actions · button family">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary action <ArrowUpRight aria-hidden="true" /></Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Text action <ArrowUpRight aria-hidden="true" /></Button>
                <Button variant="success"><Check aria-hidden="true" />Mark implemented</Button>
                <Button variant="destructive">Remove item</Button>
                <Button variant="filter" data-active="true"><Search aria-hidden="true" />Filter</Button>
                <Button variant="secondary" size="icon" aria-label="Help"><CircleHelp aria-hidden="true" /></Button>
                <Button disabled>Unavailable</Button>
              </div>
            </Specimen>
            <Specimen label="Status · never colour alone">
              <div className="flex flex-wrap items-center gap-2"><StatusTag status="Implemented" /><StatusTag status="In progress" /><StatusTag status="Attention" /><StatusTag status="Overdue" /><span className="status-tag status-neutral"><span aria-hidden="true">○</span>Not started</span></div>
            </Specimen>
            <Specimen label="Cards · public / institutional">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <EditorialCard image={meetingImage} imageAlt="Audit professionals reviewing documents together" category="INSTITUTIONAL NEWS" title="Oversight through collaboration" summary="A shared view of findings helps institutions focus on the action that matters." date="18 SEPTEMBER 2025 · 4 MIN READ" />
                <DocumentCard title="Annual Audit Report: Institutions of ECOWAS" kind="AUDIT PUBLICATION" code="OAG / PUB-025" year="2025" />
                <article className="audit-card"><div className="flex items-start justify-between gap-3"><span className="audit-ref">REC-2025-014</span><StatusTag status="In progress" /></div><h3 className="mt-5 font-display text-h3">Strengthen procurement oversight</h3><p className="mt-2 text-small text-muted-foreground">ECOWAS Commission · Audit Directorate</p><div className="mt-6 border-t border-border pt-4"><div className="mb-2 flex justify-between text-xs"><span>Implementation progress</span><span className="num font-semibold">68%</span></div><div className="progress-track" role="progressbar" aria-label="Implementation progress" aria-valuenow={68} aria-valuemin={0} aria-valuemax={100}><span style={{ width: "68%" }} /></div></div></article>
              </div>
              <div className="mt-7 grid gap-6 border-t border-border pt-6 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Recommendations tracked" value="1,248" change="+8.4%" note="this quarter" />
                <MetricCard label="Implemented" value="764" change="61.2%" note="of total" />
                <MetricCard label="Institutions engaged" value="18" change="+2" note="this year" />
                <MetricCard label="Open audit actions" value="327" change="−12.1%" note="from last period" />
              </div>
            </Specimen>
          </div>
        </section>

        <section id="forms" className="showcase-section">
          <SectionHeading index="03" eyebrow="Input with purpose" title="Forms & controls">Inputs show their state, invite confident decisions, and give feedback in plain language.</SectionHeading>
          <div className="form-showcase-grid">
            <Specimen label="Core fields">
              <form className="grid gap-5" onSubmit={handleSubscribe} noValidate>
                <Field id="full-name" label="Full name" hint="As it appears on the institutional record."><FormControl id="full-name" name="name" placeholder="e.g. Ama Mensah" autoComplete="name" /></Field>
                <Field id="email-address" label="Email address" error={formMessage && formMessage.includes("valid") ? formMessage : undefined}><FormControl id="email-address" name="email" type="email" placeholder="name@institution.int" autoComplete="email" aria-invalid={!!formMessage && formMessage.includes("valid")} /></Field>
                <Field id="institution" label="Institution"><select id="institution" className="form-control" defaultValue=""><option value="" disabled>Select an institution</option><option>ECOWAS Commission</option><option>ECOWAS Parliament</option><option>West African Power Pool</option></select></Field>
                <Field id="period" label="Reporting date"><FormControl id="period" type="date" defaultValue="2025-09-18" /></Field>
                <Field id="message" label="Notes"><textarea id="message" className="form-control min-h-24 resize-y" placeholder="Add context for the audit team…" /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="choice-row"><input type="checkbox" defaultChecked /><span>Include supporting evidence</span></label>
                  <label className="choice-row"><input type="radio" name="visibility" defaultChecked /><span>Internal review</span></label>
                  <label className="choice-row"><input type="radio" name="visibility" /><span>Public record</span></label>
                  <label className="choice-row toggle-row"><input type="checkbox" role="switch" checked={subscribed} onChange={(event) => setSubscribed(event.target.checked)} /><span>{subscribed ? "Updates enabled" : "Email me about updates"}</span></label>
                </div>
                <div className="flex flex-wrap items-center gap-3"><Button type="submit">Save preferences</Button><span className={`text-xs ${formMessage.includes("saved") ? "text-status-positive" : "text-muted-foreground"}`} role="status">{formMessage}</span></div>
              </form>
            </Specimen>
            <div className="grid content-start gap-7">
              <Specimen label="Search · filters · segmented choice">
                <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Search recommendations</span><input placeholder="Search reports, institutions, recommendations…" /></label>
                <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Reporting period">
                  {[["30 days", false], ["Quarter", true], ["Year", false]].map(([label, active]) => <button type="button" key={String(label)} className={`segment-option${active ? " is-selected" : ""}`} aria-pressed={Boolean(active)}>{label}</button>)}
                </div>
                <div className="mt-5"><Field id="upload-evidence" label="Evidence files" hint="PDF, DOCX or XLSX · up to 10 MB each"><input id="upload-evidence" type="file" className="file-control" accept=".pdf,.doc,.docx,.xls,.xlsx" /></Field></div>
              </Specimen>
              <Specimen label="Inline feedback">
                <div className="form-state form-state-error"><span className="state-symbol" aria-hidden="true">!</span><div><strong>Action needed</strong><p>Enter a valid email address before saving.</p></div></div>
                <div className="form-state form-state-success mt-3"><span className="state-symbol" aria-hidden="true">✓</span><div><strong>Saved successfully</strong><p>Your reporting preferences are up to date.</p></div></div>
                <div className="mt-4"><Button loading>Saving changes</Button></div>
              </Specimen>
              <Specimen label="Language · expands gracefully">
                <div className="language-demo"><button type="button" lang="en" aria-pressed="true">English</button><button type="button" lang="fr" aria-pressed="false">Français</button><button type="button" lang="pt" aria-pressed="false">Português</button></div>
                <p className="mt-3 text-xs text-muted-foreground">A complete label remains visible when the text is longer: <span lang="fr" className="font-semibold text-ink">Consulter le rapport d’audit</span></p>
              </Specimen>
            </div>
          </div>
        </section>

        <section id="tables" className="showcase-section">
          <SectionHeading index="04" eyebrow="Operational clarity" title="Audit information">A compact pattern for scanning, filtering and prioritising institutional follow-up.</SectionHeading>
          <div className="table-toolbar">
            <label className="table-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Filter recommendations</span><input value={filter} onChange={(event) => { setFilter(event.target.value); setPage(0); }} placeholder="Filter by reference, institution or owner" /></label>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">{["All", "Implemented", "In progress", "Attention", "Overdue"].map((status) => <Button key={status} size="sm" variant="filter" data-active={activeFilter === status} aria-pressed={activeFilter === status} onClick={() => { setActiveFilter(status); setPage(0); }}>{status}</Button>)}</div>
          </div>
          <div className="table-outer">
            <table className="audit-table">
              <caption className="sr-only">Audit recommendation follow-up sample table</caption>
              <thead><tr>
                <th className="check-column"><input type="checkbox" aria-label="Select all visible recommendations" checked={allVisibleSelected} onChange={(event) => setSelectedRows(event.target.checked ? [...new Set([...selectedRows, ...visibleFindings.map((item) => item.reference)])] : selectedRows.filter((id) => !visibleFindings.some((item) => item.reference === id)))} /></th>
                <th><button type="button" className="sort-button" onClick={() => setSortAscending((value) => !value)} aria-label={`Sort by reference ${sortAscending ? "descending" : "ascending"}`}>Reference {sortAscending ? <ArrowDown size={13} aria-hidden="true" /> : <ArrowUp size={13} aria-hidden="true" />}</button></th>
                <th>Institution / subject</th><th>Owner</th><th>Status</th><th>Updated</th><th><span className="sr-only">Open</span></th>
              </tr></thead>
              <tbody>{visibleFindings.map((row) => <tr key={row.reference}>
                <td data-label="Select"><input type="checkbox" aria-label={`Select ${row.reference}`} checked={selectedRows.includes(row.reference)} onChange={(event) => setSelectedRows(event.target.checked ? [...selectedRows, row.reference] : selectedRows.filter((id) => id !== row.reference))} /></td>
                <td data-label="Reference" className="num font-mono text-xs font-semibold">{row.reference}</td>
                <td data-label="Institution / subject"><strong>{row.institution}</strong><span>{row.subject}</span></td>
                <td data-label="Owner">{row.owner}</td><td data-label="Status"><StatusTag status={row.status} /></td><td data-label="Updated" className="text-xs">{row.updated}</td>
                <td data-label="Open"><Button variant="ghost" size="icon" className="table-open" aria-label={`Open ${row.reference}`}><ArrowUpRight aria-hidden="true" /></Button></td>
              </tr>)}
                {visibleFindings.length === 0 && <tr><td colSpan={7} className="empty-table">No recommendations match this search.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-pagination"><span aria-live="polite">{filteredFindings.length} records <span className="pagination-selection">· {selectedRows.length} selected</span></span><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span><Button variant="secondary" size="icon" aria-label="Previous page" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft aria-hidden="true" /></Button><Button variant="secondary" size="icon" aria-label="Next page" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}><ChevronRight aria-hidden="true" /></Button></div></div>
        </section>

        <section id="visualisation" className="showcase-section">
          <SectionHeading index="05" eyebrow="Evidence, at a glance" title="Data visualisation">Consistent scales, meaningful labels and accessible descriptions — every chart has a readable counterpart.</SectionHeading>
          <div className="chart-grid">
            <article className="chart-panel chart-wide">
              <div className="chart-head"><div><p className="overline">FOLLOW-UP · 2025</p><h3 className="mt-2 font-display text-h3">Implementation over time</h3></div><a href="#tables" className="chart-action">View data <ArrowUpRight size={14} aria-hidden="true" /></a></div>
              <div className="chart-legend"><span><i className="legend-green" /> Implemented</span><span><i className="legend-ocean" /> Under monitoring</span></div>
              <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 12, right: 14, left: 0, bottom: 0 }}><defs><linearGradient id="implementedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-green)" stopOpacity={0.16} /><stop offset="100%" stopColor="var(--chart-green)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 12 }} width={34} /><Tooltip /><Area type="monotone" dataKey="monitored" name="Under monitoring" stroke="var(--chart-ocean)" strokeWidth={2} fill="transparent" /><Area type="monotone" dataKey="implemented" name="Implemented" stroke="var(--chart-green)" strokeWidth={2.5} fill="url(#implementedFill)" /></AreaChart></ResponsiveContainer></div>
              <p className="sr-only" role="img" aria-label="Line chart: implementation rose from 21 recommendations in April to 54 in September; monitored recommendations rose from 45 to 77." />
              <p className="chart-note">Source: OAG recommendation follow-up · Illustrative sample</p>
            </article>
            <article className="chart-panel">
              <div className="chart-head"><div><p className="overline">AUDIT COVERAGE</p><h3 className="mt-2 font-display text-h3">Engagement mix</h3></div><Button variant="ghost" size="icon" aria-label="Download engagement data"><Download aria-hidden="true" /></Button></div>
              <div className="donut-layout"><div className="donut-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={audits} dataKey="value" nameKey="name" innerRadius="63%" outerRadius="88%" strokeWidth={2} stroke="var(--chart-background)">{audits.map((item, index) => <Cell key={item.name} fill={pieColors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>18</strong><span>institutions</span></div></div><div className="donut-legend">{audits.map((item, index) => <div key={item.name}><span><i style={{ background: pieColors[index] }} />{item.name}</span><b>{item.value}%</b></div>)}</div></div>
              <p className="sr-only" role="img" aria-label="Donut chart: audit coverage is 38% Commission, 27% agencies, 21% institutions, and 14% other." />
              <p className="chart-note">Coverage by institutional group</p>
            </article>
            <article className="chart-panel">
              <div className="chart-head"><div><p className="overline">OPEN RECOMMENDATIONS</p><h3 className="mt-2 font-display text-h3">Status by institution</h3></div></div>
              <div className="chart-area chart-area-compact"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: "Commission", onTrack: 16, atRisk: 7, overdue: 3 }, { name: "Agencies", onTrack: 11, atRisk: 5, overdue: 2 }, { name: "Parliament", onTrack: 7, atRisk: 3, overdue: 1 }, { name: "Other", onTrack: 6, atRisk: 4, overdue: 2 }]} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} /><Tooltip /><Bar dataKey="onTrack" name="On track" stackId="a" fill="var(--chart-green)" /><Bar dataKey="atRisk" name="At risk" stackId="a" fill="var(--chart-yellow)" /><Bar dataKey="overdue" name="Overdue" stackId="a" fill="var(--chart-red)" /></BarChart></ResponsiveContainer></div>
              <div className="chart-legend"><span><i className="legend-green" /> On track</span><span><i className="legend-yellow" /> At risk</span><span><i className="legend-red" /> Overdue</span></div>
              <p className="sr-only" role="img" aria-label="Stacked bar chart comparing recommendations on track, at risk and overdue across four institution groups." />
            </article>
            <article className="chart-panel">
              <div className="chart-head"><div><p className="overline">RISK MATRIX</p><h3 className="mt-2 font-display text-h3">Likelihood × impact</h3></div><span className="risk-total">6 active</span></div>
              <div className="risk-layout"><div className="risk-y-label">LIKELIHOOD</div><div><div className="risk-matrix" role="img" aria-label="Risk matrix: four items have high likelihood and high impact; one has medium likelihood and high impact; one has medium likelihood and medium impact.">{Array.from({ length: 9 }, (_, index) => <span key={index} className={`risk-cell risk-${Math.floor(index / 3)}-${index % 3}`}>{[["", "", "1"], ["", "1", ""], ["", "", "4"]][Math.floor(index / 3)][index % 3]}</span>)}</div><div className="risk-x-label">IMPACT · LOW TO HIGH <ArrowUpRight size={13} aria-hidden="true" /></div></div></div>
              <div className="risk-key"><span><i className="legend-green" /> Monitor</span><span><i className="legend-yellow" /> Review</span><span><i className="legend-red" /> Priority action</span></div>
            </article>
          </div>
        </section>

        <section id="patterns" className="showcase-section patterns-section">
          <SectionHeading index="06" eyebrow="Interface patterns" title="Interaction & guidance">Shared patterns keep public communication warm and internal work focused.</SectionHeading>
          <div className="pattern-grid">
            <Specimen label="Public editorial · narrative first">
              <article className="public-pattern"><img src={meetingImage} alt="Colleagues reviewing audit evidence" /><div className="public-pattern-copy"><p className="overline text-primary">FROM THE OFFICE</p><h3 className="mt-3 font-display text-h3">Evidence in the service of public trust.</h3><p className="mt-2 text-small text-muted-foreground">Stories, reports and institutional progress — presented with clarity and context.</p><a className="text-link mt-4" href="#components">Read the latest <ArrowUpRight size={14} aria-hidden="true" /></a></div></article>
            </Specimen>
            <Specimen label="Internal intelligence · information first">
              <div className="intel-pattern"><div className="intel-top"><span className="flex items-center gap-2"><Menu size={16} aria-hidden="true" /> Follow-up overview</span><span className="intel-period">Q3 · 2025 <ChevronDown size={13} aria-hidden="true" /></span></div><div className="intel-kpis"><div><span>OPEN ACTIONS</span><strong>327</strong><small>−12% vs previous period</small></div><div><span>HIGH PRIORITY</span><strong>24</strong><small className="attention-text">6 require review</small></div><div><span>DUE THIS MONTH</span><strong>18</strong><small>Across 7 institutions</small></div></div><div className="intel-row"><FileText size={15} aria-hidden="true" /><span>Procurement compliance review</span><StatusTag status="Attention" /><ArrowUpRight size={14} aria-hidden="true" /></div><div className="intel-row"><FileText size={15} aria-hidden="true" /><span>Asset register follow-up</span><StatusTag status="Implemented" /><ArrowUpRight size={14} aria-hidden="true" /></div></div>
            </Specimen>
            <Specimen label="Alert · dismissible, announced">
              {alertVisible ? <div className="alert-message" role="status"><div className="alert-icon"><span aria-hidden="true">i</span></div><div><strong>Reporting window open</strong><p>Quarterly follow-up submissions close on 30 September 2025.</p><a href="#forms" className="text-link">Review reporting guidance <ArrowUpRight size={13} aria-hidden="true" /></a></div><Button variant="ghost" size="icon" aria-label="Dismiss reporting reminder" onClick={() => setAlertVisible(false)}><X aria-hidden="true" /></Button></div> : <div className="alert-dismissed"><Check size={16} aria-hidden="true" /> Reminder dismissed <Button variant="tertiary" size="sm" onClick={() => setAlertVisible(true)}>Undo</Button></div>}
            </Specimen>
            <Specimen label="Dialog · focused decision">
              <p className="mb-4 text-small text-muted-foreground">Confirm before completing a consequential follow-up action.</p>
              <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger asChild><Button variant="secondary">Review completion</Button></Dialog.Trigger>
                <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content"><div className="dialog-icon"><ShieldCheck size={21} aria-hidden="true" /></div><Dialog.Title className="mt-4 font-display text-h3">Mark as implemented?</Dialog.Title><Dialog.Description className="mt-2 text-small text-muted-foreground">Confirm the evidence has been reviewed and the recommendation has been completed by the responsible institution.</Dialog.Description><div className="mt-6 flex flex-wrap justify-end gap-3"><Dialog.Close asChild><Button variant="secondary">Keep in progress</Button></Dialog.Close><Dialog.Close asChild><Button><Check aria-hidden="true" />Confirm implementation</Button></Dialog.Close></div><Dialog.Close asChild><button type="button" className="dialog-close" aria-label="Close dialog"><X size={18} aria-hidden="true" /></button></Dialog.Close></Dialog.Content></Dialog.Portal>
              </Dialog.Root>
            </Specimen>
          </div>
          <div className="footer-sample"><div className="footer-sample-top"><a href="#top" className="brand-lockup"><span className="brand-seal" aria-hidden="true"><span>OAG</span></span><span className="brand-name"><strong>Office of the Auditor General</strong><small>ECOWAS Institutions</small></span></a><p>Independent oversight. Public confidence.</p></div><div className="footer-sample-bottom"><span>© 2025 · Institutional design pattern</span><nav aria-label="Footer links"><a href="#foundations">About OAG</a><a href="#components">Publications</a><a href="#forms">Contact</a></nav></div></div>
        </section>
        <footer className="showcase-end"><span>OFFICE OF THE AUDITOR GENERAL <span className="utility-divider">/</span> ECOWAS INSTITUTIONS</span><span>DESIGN LANGUAGE · VERSION 01.0</span></footer>
      </div>
    </main>
  );
}