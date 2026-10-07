import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { EyeOff, Lock, UserCheck, Search, ShieldCheck, Info, ArrowLeft, ArrowRight, FileUp, FileText, CheckCircle2, X, Copy, Send, KeyRound, AlertTriangle } from "lucide-react";
import { Container, PageHeader } from "@/components/ds/shell/layout-parts";
import { Button, Badge } from "@/components/ds/primitives";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";
import {
  CATEGORIES, MAX_FILE_MB, validateFile, uploadEvidence, submitReport, getCase, sendMessage,
  type ReportDraft, type ReportMode, type EvidenceFile, type CaseRecord,
} from "@/lib/integrity-service";

const crumbs = (label?: string) => [{ label: "Home", to: "/" }, { label: "IntegrityLine", to: "/integrityline" }, ...(label ? [{ label }] : [])];

const MODES: { id: ReportMode; icon: typeof EyeOff; title: string; who: string; privacy: string; tradeoff: string }[] = [
  { id: "anonymous", icon: EyeOff, title: "Report anonymously", who: "You do not give your name or contact details.",
    privacy: "OAG does not know who you are.", tradeoff: "Investigators can only reach you through your protected reference. Follow-up depends on you checking in." },
  { id: "confidential", icon: Lock, title: "Report confidentially", who: "You give your identity, held separately in a restricted identity vault.",
    privacy: "Only a small number of authorised officers can access your identity, and only where necessary.", tradeoff: "Allows investigators to clarify facts with you and supports protection measures." },
  { id: "identified", icon: UserCheck, title: "Identify myself", who: "You are willing to be known to the investigating team.",
    privacy: "Your identity is still protected and not disclosed beyond what the investigation requires.", tradeoff: "Easiest to follow up. May be needed if you later seek formal whistleblower protection." },
];

function Callout({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  return (
    <div className={cn("flex gap-3 border-l-2 p-4 text-small", tone === "warn" ? "border-ecowas-orange bg-ecowas-orange/5" : "border-status-info bg-status-info/5")}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "warn" ? "text-status-warning" : "text-status-info")} aria-hidden />
      <div className="text-ink-soft">{children}</div>
    </div>
  );
}

function ProtectedBar() {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-primary-soft px-5 py-2 text-small text-primary md:px-8">
      <ShieldCheck className="size-4" aria-hidden /><span className="font-semibold">Protected reporting channel</span>
      <span className="hidden text-ink-soft sm:inline">· Do not use a work device or shared network if you are concerned about being identified.</span>
    </div>
  );
}

/* ================= Landing ================= */
function Landing() {
  return (
    <>
      <ProtectedBar />
      <section className="border-b border-border bg-surface-sunken">
        <Container className="grid gap-10 py-section lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="overline text-primary">OAG IntegrityLine</p>
            <h1 className="mt-4 font-display text-display-lg">See something.<br />Say something.</h1>
            <p className="mt-6 max-w-[40rem] text-lead text-ink-soft">A protected channel for reporting fraud, corruption and serious wrongdoing involving ECOWAS Institutions, resources or processes.</p>
          </div>
          <Callout>
            <strong className="block text-ink">Reports must relate to OAG’s mandate.</strong>
            IntegrityLine handles matters concerning ECOWAS Institutions, their staff, contractors and Community resources. Personal grievances, national matters or emergencies should be directed to the appropriate authority.
          </Callout>
        </Container>
      </section>

      <Container className="py-section">
        <h2 className="font-display text-h2">How would you like to proceed?</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...MODES.map((m) => ({ icon: m.icon, t: m.title, d: m.who, to: `/integrityline/report?mode=${m.id}` })),
            { icon: Search, t: "Track existing report", d: "Check status and message investigators using your protected reference.", to: "/integrityline/track" }].map((o) => (
            <li key={o.t}>
              <Link to={o.to} className="group flex h-full flex-col gap-5 border border-border bg-card p-6 transition-colors duration-base hover:border-primary focus-visible:outline-none focus-visible:shadow-focus">
                <o.icon className="size-6 text-primary" aria-hidden />
                <span className="flex-1"><span className="block font-display text-h4">{o.t}</span><span className="mt-2 block text-small text-muted-foreground">{o.d}</span></span>
                <span className="inline-flex items-center gap-1.5 text-small font-semibold text-primary">Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <section className="border-t border-border">
        <Container className="py-section">
          <h2 className="font-display text-h2">Understand your privacy options</h2>
          <p className="mt-3 max-w-[42rem] text-ink-soft">Each option protects you differently. Choose the one that fits your situation.</p>
          <div className="mt-8 overflow-x-auto border border-border">
            <table className="w-full min-w-[40rem] text-left text-small">
              <thead className="bg-surface-sunken"><tr><th className="p-4" scope="col">Option</th><th className="p-4" scope="col">Who knows your identity</th><th className="p-4" scope="col">Consider</th></tr></thead>
              <tbody>
                {MODES.map((m) => (
                  <tr key={m.id} className="border-t border-border align-top">
                    <th scope="row" className="p-4 font-semibold"><span className="flex items-center gap-2"><m.icon className="size-4 text-primary" aria-hidden />{m.title}</span></th>
                    <td className="p-4 text-ink-soft">{m.privacy}</td><td className="p-4 text-ink-soft">{m.tradeoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6"><MetadataNotice /></div>
        </Container>
      </section>
    </>
  );
}

function MetadataNotice() {
  return (
    <Callout tone="warn">
      <strong className="block text-ink">No system can guarantee absolute anonymity.</strong>
      Technical information, such as the device or network you use, document metadata (author names, locations in photos), or details only you would know, may make identification possible. Consider using a personal device on a private network, removing metadata from files, and describing events without unnecessary self-identifying detail.
    </Callout>
  );
}

/* ================= Report wizard ================= */
const STEPS = ["Report type", "Describe concern", "Where", "When", "Who or what", "Evidence", "Preferences", "Review", "Submit"];

const empty = (mode: ReportMode): ReportDraft => ({
  mode, category: "", summary: "", details: "", institution: "", location: "", when: "exact", dateFrom: "", dateTo: "",
  involved: "", witnesses: "", evidence: [], contactPref: "portal", identity: { name: "", email: "", phone: "" },
});

const schemas: Record<number, (d: ReportDraft) => Record<string, string>> = {
  1: (d) => (d.category ? {} : { category: "Select the category that best fits." }),
  2: (d) => {
    const e: Record<string, string> = {};
    const r = z.object({ summary: z.string().trim().min(10).max(160), details: z.string().trim().min(40).max(5000) }).safeParse(d);
    if (!r.success) r.error.issues.forEach((i) => (e[i.path[0] as string] = i.path[0] === "summary" ? "Give a short title (10–160 characters)." : "Describe what happened (at least 40 characters)."));
    return e;
  },
  3: (d) => (d.institution ? {} : { institution: "Select the institution or choose ‘Not sure’." }),
  4: (d) => (d.when === "exact" && !d.dateFrom ? { dateFrom: "Enter a date, or choose another option." } : d.when === "range" && (!d.dateFrom || !d.dateTo) ? { dateTo: "Enter both dates." } : {}),
  6: (d) => (d.evidence.some((f) => f.state === "uploading" || f.state === "encrypting") ? { evidence: "Wait for uploads to finish securing." } : {}),
  7: (d) => {
    if (d.mode === "anonymous") return {};
    const r = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(255).or(z.literal("")) }).safeParse(d.identity);
    return r.success ? {} : { identity: "Enter your name and a valid email (email optional)." };
  },
};

const INSTITUTIONS = ["ECOWAS Commission", "ECOWAS Parliament", "ECOWAS Court of Justice", "ECOWAS Bank for Investment and Development (EBID)", "West African Health Organisation (WAHO)", "GIABA", "Other ECOWAS agency or office", "Not sure"];

function Field({ label, hint, error, id, children }: { label: string; hint?: string; error?: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-semibold">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-small text-muted-foreground">{hint}</p>}
      {children}
      {error && <p role="alert" className="text-small font-semibold text-status-critical">{error}</p>}
    </div>
  );
}
const inputCls = "w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-body focus-visible:outline-none focus-visible:shadow-focus";

function ReportWizard() {
  const initial = (new URLSearchParams(location.search).get("mode") as ReportMode) || "anonymous";
  const [d, setD] = useState<ReportDraft>(() => empty(MODES.some((m) => m.id === initial) ? initial : "anonymous"));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string; accessKey: string } | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof ReportDraft>(k: K, v: ReportDraft[K]) => setD((p) => ({ ...p, [k]: v }));

  useEffect(() => { headRef.current?.focus(); }, [step]);

  const next = () => {
    const e = schemas[step]?.(d) ?? {};
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, 8));
  };
  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };
  const submit = async () => { setSubmitting(true); const r = await submitReport(d); setSubmitting(false); setResult(r); };

  if (result) return <Submitted {...result} />;

  return (
    <>
      <ProtectedBar />
      <PageHeader crumbs={crumbs("Make a report")} overline="Protected report" title="Make a report" lead="Take your time. You can go back to any step before submitting. Nothing is sent until you confirm." />
      <Container className="grid gap-10 py-section lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Report progress">
          <p className="text-small text-muted-foreground lg:hidden">Step {step + 1} of {STEPS.length} · <span className="font-semibold text-ink">{STEPS[step]}</span></p>
          <div className="mt-2 h-1 bg-muted lg:hidden"><div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          <ol className="hidden gap-1 lg:grid">
            {STEPS.map((s, i) => (
              <li key={s} aria-current={i === step ? "step" : undefined}
                className={cn("flex items-center gap-3 py-1.5 text-small", i === step ? "font-semibold text-primary" : i < step ? "text-ink" : "text-muted-foreground")}>
                <span className={cn("grid size-6 place-items-center rounded-full border text-[0.75rem]", i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary" : "border-border")}>
                  {i < step ? <CheckCircle2 className="size-3.5" aria-hidden /> : i + 1}
                </span>{s}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[46rem]">
          <h2 ref={headRef} tabIndex={-1} className="font-display text-h2 outline-none">{STEPS[step]}</h2>
          <div className="mt-6 grid gap-6">
            {step === 0 && (
              <>
                <fieldset className="grid gap-3">
                  <legend className="mb-2 font-semibold">How do you want to report?</legend>
                  {MODES.map((m) => (
                    <label key={m.id} className={cn("flex cursor-pointer gap-4 border p-5 transition-colors", d.mode === m.id ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-ink/40")}>
                      <input type="radio" name="mode" className="mt-1 accent-primary" checked={d.mode === m.id} onChange={() => set("mode", m.id)} />
                      <span><span className="flex items-center gap-2 font-semibold"><m.icon className="size-4 text-primary" aria-hidden />{m.title}</span>
                        <span className="mt-1 block text-small text-ink-soft">{m.privacy} {m.tradeoff}</span></span>
                    </label>
                  ))}
                </fieldset>
                <MetadataNotice />
              </>
            )}
            {step === 1 && (
              <>
                <Field id="cat" label="Category" error={errors.category} hint="Choose the closest match. Investigators can re-categorise if needed.">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORIES.map((c) => (
                      <label key={c} className={cn("flex cursor-pointer items-center gap-3 border px-4 py-3 text-small", d.category === c ? "border-primary bg-primary-soft font-semibold" : "border-border bg-card")}>
                        <input type="radio" name="cat" className="accent-primary" checked={d.category === c} onChange={() => set("category", c)} />{c}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field id="summary" label="Short title" error={errors.summary}><input id="summary" className={inputCls} maxLength={160} value={d.summary} onChange={(e) => set("summary", e.target.value)} placeholder="e.g. Contract awarded without competitive tender" /></Field>
                <Field id="details" label="What happened?" error={errors.details} hint="Describe the facts as you know them. Avoid details that identify you unless you choose to.">
                  <textarea id="details" rows={7} maxLength={5000} className={inputCls} value={d.details} onChange={(e) => set("details", e.target.value)} />
                  <span className="text-right text-small text-muted-foreground">{d.details.length}/5000</span>
                </Field>
              </>
            )}
            {step === 2 && (
              <>
                <Field id="inst" label="Institution concerned" error={errors.institution}>
                  <select id="inst" className={inputCls} value={d.institution} onChange={(e) => set("institution", e.target.value)}>
                    <option value="">Select…</option>{INSTITUTIONS.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </Field>
                <Field id="loc" label="Location, department or project (optional)"><input id="loc" maxLength={300} className={inputCls} value={d.location} onChange={(e) => set("location", e.target.value)} /></Field>
              </>
            )}
            {step === 3 && (
              <>
                <fieldset className="grid gap-2 sm:grid-cols-2">
                  <legend className="mb-2 font-semibold">When did it occur?</legend>
                  {([["exact", "On a specific date"], ["range", "Over a period"], ["ongoing", "It is ongoing"], ["unknown", "I’m not sure"]] as const).map(([v, l]) => (
                    <label key={v} className={cn("flex cursor-pointer items-center gap-3 border px-4 py-3 text-small", d.when === v ? "border-primary bg-primary-soft font-semibold" : "border-border bg-card")}>
                      <input type="radio" name="when" className="accent-primary" checked={d.when === v} onChange={() => set("when", v)} />{l}
                    </label>
                  ))}
                </fieldset>
                {(d.when === "exact" || d.when === "range" || d.when === "ongoing") && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="from" label={d.when === "exact" ? "Date" : "From"} error={errors.dateFrom}><input id="from" type="date" className={inputCls} value={d.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} /></Field>
                    {d.when === "range" && <Field id="to" label="To" error={errors.dateTo}><input id="to" type="date" className={inputCls} value={d.dateTo} onChange={(e) => set("dateTo", e.target.value)} /></Field>}
                  </div>
                )}
              </>
            )}
            {step === 4 && (
              <>
                <Field id="inv" label="People, units, companies or contracts involved (optional)" hint="Names, roles, supplier names or reference numbers, if known."><textarea id="inv" rows={4} maxLength={2000} className={inputCls} value={d.involved} onChange={(e) => set("involved", e.target.value)} /></Field>
                <Field id="wit" label="Others who may have knowledge (optional)" hint="Do not name others without good reason."><textarea id="wit" rows={3} maxLength={1000} className={inputCls} value={d.witnesses} onChange={(e) => set("witnesses", e.target.value)} /></Field>
              </>
            )}
            {step === 5 && <EvidenceUploader files={d.evidence} onChange={(f) => setD((p) => ({ ...p, evidence: typeof f === "function" ? f(p.evidence) : f }))} error={errors.evidence} />}
            {step === 6 && (
              <>
                {d.mode === "anonymous" ? (
                  <Callout>You chose to report anonymously. No identity details will be requested. You will receive a protected reference and access key to follow up.</Callout>
                ) : (
                  <div className="grid gap-4 border border-border bg-card p-5">
                    <p className="flex items-center gap-2 text-small font-semibold text-primary"><KeyRound className="size-4" aria-hidden />Sent to the restricted identity vault, not stored with your report</p>
                    <Field id="nm" label="Full name" error={errors.identity}><input id="nm" autoComplete="off" maxLength={100} className={inputCls} value={d.identity.name} onChange={(e) => set("identity", { ...d.identity, name: e.target.value })} /></Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="em" label="Email (optional)"><input id="em" type="email" autoComplete="off" maxLength={255} className={inputCls} value={d.identity.email} onChange={(e) => set("identity", { ...d.identity, email: e.target.value })} /></Field>
                      <Field id="ph" label="Phone (optional)"><input id="ph" autoComplete="off" maxLength={30} className={inputCls} value={d.identity.phone} onChange={(e) => set("identity", { ...d.identity, phone: e.target.value })} /></Field>
                    </div>
                  </div>
                )}
                <fieldset className="grid gap-2">
                  <legend className="mb-2 font-semibold">How may investigators follow up?</legend>
                  {([["portal", "Only through the protected message portal"], ...(d.mode !== "anonymous" ? [["email", "Portal, and email me a neutral notification"]] : []), ["none", "No follow-up, please"]] as [ReportDraft["contactPref"], string][]).map(([v, l]) => (
                    <label key={v} className="flex cursor-pointer items-center gap-3 text-small"><input type="radio" name="cp" className="accent-primary" checked={d.contactPref === v} onChange={() => set("contactPref", v)} />{l}</label>
                  ))}
                </fieldset>
              </>
            )}
            {step === 7 && <Review d={d} go={setStep} />}
            {step === 8 && (
              <div className="grid gap-5">
                <Callout>By submitting, you confirm the information is true to the best of your knowledge. Reports made in good faith are protected even if they are not substantiated. Knowingly false reports may be addressed under applicable rules.</Callout>
                <div className="flex items-center gap-3 border border-border bg-card p-5 text-small">
                  <Lock className="size-5 text-primary" aria-hidden />
                  <span>Your report will be sent over an encrypted connection to the OAG secure case service. {d.evidence.filter((f) => f.state === "secured").length} file(s) attached.</span>
                </div>
                <Button size="lg" onClick={submit} loading={submitting} className="justify-self-start"><Send aria-hidden />Submit protected report</Button>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button variant="ghost" onClick={back} disabled={step === 0 || submitting}><ArrowLeft aria-hidden />Back</Button>
            {step < 8 && <Button onClick={next}>{step === 7 ? "Confirm and continue" : "Continue"}<ArrowRight aria-hidden /></Button>}
          </div>
        </div>
      </Container>
    </>
  );
}

function Review({ d, go }: { d: ReportDraft; go: (n: number) => void }) {
  const mode = MODES.find((m) => m.id === d.mode)!;
  const rows: [string, string, number][] = [
    ["Report type", mode.title, 0], ["Category", d.category, 1], ["Title", d.summary, 1], ["Description", d.details, 1],
    ["Institution", [d.institution, d.location].filter(Boolean).join(", "), 2],
    ["When", d.when === "unknown" ? "Not sure" : d.when === "range" ? `${d.dateFrom} to ${d.dateTo}` : `${d.dateFrom || "N/A"}${d.when === "ongoing" ? " (ongoing)" : ""}`, 3],
    ["Involved", d.involved || "N/A", 4], ["Evidence", d.evidence.filter((f) => f.state === "secured").map((f) => f.name).join(", ") || "None", 5],
    ["Identity", d.mode === "anonymous" ? "Not provided" : "Provided, held in identity vault", 6],
  ];
  return (
    <dl className="divide-y divide-border border border-border bg-card">
      {rows.map(([k, v, s]) => (
        <div key={k} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr_auto] sm:gap-4">
          <dt className="text-small font-semibold text-muted-foreground">{k}</dt>
          <dd className="whitespace-pre-wrap break-words text-small">{v}</dd>
          <dd><button type="button" onClick={() => go(s)} className="text-small font-semibold text-primary underline-offset-4 hover:underline">Edit<span className="sr-only"> {k}</span></button></dd>
        </div>
      ))}
    </dl>
  );
}

function EvidenceUploader({ files, onChange, error }: { files: EvidenceFile[]; onChange: (f: EvidenceFile[] | ((p: EvidenceFile[]) => EvidenceFile[])) => void; error?: string }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const add = (list: FileList | null) => {
    if (!list) return;
    Array.from(list).forEach((file) => {
      const err = validateFile(file);
      const f: EvidenceFile = { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, state: err ? "rejected" : "uploading", progress: 0, error: err ?? undefined };
      onChange((p) => [...p, f]);
      if (!err) uploadEvidence(f, (u) => onChange((p) => p.map((x) => (x.id === f.id ? { ...x, ...u } : x))));
    });
  };
  const label = { uploading: "Uploading", encrypting: "Securing", secured: "Secured", rejected: "Not accepted" };
  return (
    <div className="grid gap-5">
      <MetadataNotice />
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={cn("flex flex-col items-center gap-3 border-2 border-dashed p-8 text-center transition-colors", drag ? "border-primary bg-primary-soft" : "border-border bg-card")}>
        <FileUp className="size-7 text-primary" aria-hidden />
        <p className="font-semibold">Drag files here, or</p>
        <Button variant="secondary" size="sm" type="button" onClick={() => inputRef.current?.click()}>Choose files</Button>
        <p className="text-small text-muted-foreground">PDF, Word, Excel, images, text or MP3 · up to {MAX_FILE_MB} MB each · optional</p>
        <input ref={inputRef} type="file" multiple className="sr-only" aria-label="Upload supporting documents" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>
      {error && <p role="alert" className="text-small font-semibold text-status-critical">{error}</p>}
      {files.length > 0 && (
        <ul className="grid gap-2" aria-live="polite">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-4 border border-border bg-card p-4">
              <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-small font-semibold">{f.name}</span>
                  <span className={cn("flex shrink-0 items-center gap-1.5 text-small font-semibold",
                    f.state === "secured" ? "text-status-positive" : f.state === "rejected" ? "text-status-critical" : "text-status-info")}>
                    {f.state === "secured" ? <Lock className="size-3.5" aria-hidden /> : f.state === "rejected" ? <X className="size-3.5" aria-hidden /> : null}
                    {label[f.state]}{f.state === "uploading" && ` ${f.progress}%`}
                  </span>
                </div>
                {f.state === "rejected" ? <p className="text-small text-status-critical">{f.error}</p> : (
                  <div className="mt-2 h-1 bg-muted" role="progressbar" aria-valuenow={f.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${f.name} upload`}>
                    <div className={cn("h-full transition-all", f.state === "secured" ? "bg-status-positive" : "bg-primary")} style={{ width: `${f.progress}%` }} />
                  </div>
                )}
                <p className="mt-1 text-[0.75rem] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB{f.state === "secured" && " · encrypted at rest by the evidence service"}</p>
              </div>
              <button type="button" onClick={() => onChange((p) => p.filter((x) => x.id !== f.id))} className="grid size-8 place-items-center rounded-md hover:bg-muted" aria-label={`Remove ${f.name}`}><X className="size-4" aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CopyLine({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="grid gap-1">
      <span className="text-small font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
        <code className="flex-1 font-mono text-h4 tracking-wider">{value}</code>
        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard?.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500); }}><Copy aria-hidden />{ok ? "Copied" : "Copy"}</Button>
      </div>
    </div>
  );
}

function Submitted({ reference, accessKey }: { reference: string; accessKey: string }) {
  const nav = useNavigate();
  return (
    <>
      <ProtectedBar />
      <Container className="py-section">
        <div className="mx-auto max-w-[40rem]" role="status">
          <CheckCircle2 className="size-10 text-status-positive" aria-hidden />
          <h1 className="mt-4 font-display text-h1">Your report has been received</h1>
          <p className="mt-3 text-lead text-ink-soft">Thank you. Save the details below now, they are the only way to follow up and cannot be recovered.</p>
          <div className="mt-8 grid gap-4">
            <CopyLine label="Protected reference" value={reference} />
            <CopyLine label="Access key" value={accessKey} />
          </div>
          <div className="mt-6"><Callout>Store these somewhere private. Do not save them on a shared or work device. Check back in 7–10 working days for updates or questions.</Callout></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => nav(`/integrityline/track?ref=${reference}`)}>Go to protected messages</Button>
            <Button variant="secondary" asChild><Link to="/integrityline">Return to IntegrityLine</Link></Button>
          </div>
        </div>
      </Container>
    </>
  );
}

/* ================= Track + messages ================= */
function Track() {
  const [ref, setRef] = useState(() => new URLSearchParams(location.search).get("ref") ?? "");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [c, setC] = useState<CaseRecord | null>(null);

  const open = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^PROTECTED-[A-Z0-9]{5}$/i.test(ref.trim())) return setErr("Enter a reference in the format PROTECTED-XXXXX.");
    if (!key.trim()) return setErr("Enter your access key.");
    setErr(""); setLoading(true);
    const r = await getCase(ref, key); setLoading(false);
    if (!r) setErr("We could not open a report with those details. Check both and try again."); else setC(r);
  };

  if (c) return <CaseView c={c} onClose={() => { setC(null); setKey(""); }} />;
  return (
    <>
      <ProtectedBar />
      <PageHeader crumbs={crumbs("Track a report")} overline="Protected access" title="Track an existing report" lead="Enter your protected reference and access key to view status and message investigators." />
      <Container className="py-section">
        <form onSubmit={open} className="grid max-w-[30rem] gap-5" noValidate>
          <Field id="ref" label="Protected reference"><input id="ref" autoComplete="off" spellCheck={false} className={cn(inputCls, "font-mono uppercase")} placeholder="PROTECTED-7F82A" value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
          <Field id="key" label="Access key"><input id="key" type="password" autoComplete="off" className={cn(inputCls, "font-mono")} value={key} onChange={(e) => setKey(e.target.value)} /></Field>
          {err && <p role="alert" className="text-small font-semibold text-status-critical">{err}</p>}
          <Button type="submit" loading={loading} className="justify-self-start"><Lock aria-hidden />Open protected report</Button>
          <p className="text-small text-muted-foreground">Demo: reference PROTECTED-7F82A with any access key.</p>
        </form>
      </Container>
    </>
  );
}

function CaseView({ c, onClose }: { c: CaseRecord; onClose: () => void }) {
  const [msgs, setMsgs] = useState(c.messages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = body.trim(); if (!t || t.length > 3000) return;
    setSending(true); const m = await sendMessage(c.reference, t); setSending(false);
    setMsgs((p) => (p.includes(m) ? p : [...p, m])); setBody("");
  };
  const fmt = (s: string) => new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  const stages = ["Received", "Under assessment", "Information requested", "Closed"];
  return (
    <>
      <ProtectedBar />
      <Container className="py-section">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="overline text-primary">Protected case</p>
            <h1 className="mt-2 font-mono text-h2">{c.reference}</h1>
            <p className="mt-1 text-small text-muted-foreground">{c.category} · submitted {fmt(c.submittedAt)}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}><Lock aria-hidden />Close session</Button>
        </div>
        <ol className="mt-8 grid gap-2 sm:grid-cols-4">
          {stages.map((s, i) => {
            const cur = stages.indexOf(c.status);
            return <li key={s} aria-current={i === cur ? "step" : undefined} className={cn("border-t-2 pt-2 text-small", i <= cur ? "border-primary font-semibold text-ink" : "border-border text-muted-foreground")}>{s}</li>;
          })}
        </ol>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem]">
          <section aria-labelledby="msgs" className="border border-border bg-card">
            <h2 id="msgs" className="border-b border-border p-4 font-display text-h4">Protected messages</h2>
            <ul className="grid gap-4 p-4" aria-live="polite">
              {msgs.map((m) => (
                <li key={m.id} className={cn("max-w-[85%] p-4 text-small", m.from === "reporter" ? "justify-self-end bg-primary-soft" : "bg-surface-sunken")}>
                  <p className="mb-1 font-semibold">{m.from === "reporter" ? "You" : "OAG integrity team"} <span className="font-normal text-muted-foreground">· {fmt(m.at)}</span></p>
                  <p className="whitespace-pre-wrap">{m.body}</p>
                </li>
              ))}
            </ul>
            <form onSubmit={send} className="grid gap-3 border-t border-border p-4">
              <label htmlFor="reply" className="text-small font-semibold">Reply</label>
              <textarea id="reply" rows={4} maxLength={3000} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share only what is needed. Avoid identifying yourself unless you choose to." />
              <Button type="submit" loading={sending} disabled={!body.trim()} className="justify-self-end"><Send aria-hidden />Send securely</Button>
            </form>
          </section>
          <aside className="grid content-start gap-4">
            <div className="border border-border bg-card p-5 text-small">
              <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" aria-hidden />Your identity is not shown here</p>
              <p className="mt-2 text-ink-soft">Investigators see only your reference. Any identity you provided is held separately and accessed only when strictly necessary.</p>
            </div>
            <Badge tone="outline">Status: {c.status}</Badge>
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ================= Protection ================= */
function Protection() {
  return (
    <>
      <ProtectedBar />
      <PageHeader crumbs={crumbs("Whistleblower protection")} overline="IntegrityLine" title="How reporters are protected" lead="What OAG does to protect people who report in good faith, and the limits you should know about." />
      <Container className="grid max-w-[46rem] gap-8 py-section">
        {[
          ["Separation of identity", "Identity details are designed to be held in a restricted identity vault, separate from the case record that investigators work with."],
          ["Need-to-know access", "Only authorised officers may access a reporter’s identity, and only where strictly necessary for the investigation or for protection."],
          ["Protection from retaliation", "Retaliation against a person who reports in good faith is itself misconduct and may be reported through IntegrityLine."],
          ["Good faith", "You do not need proof. Reports made honestly are protected even if not substantiated."],
        ].map(([t, d]) => (
          <div key={t}><h2 className="font-display text-h3">{t}</h2><p className="mt-2 text-ink-soft">{d}</p></div>
        ))}
        <MetadataNotice />
        <Button asChild className="justify-self-start"><Link to="/integrityline/report">Make a report<ArrowRight aria-hidden /></Link></Button>
      </Container>
    </>
  );
}

export default function IntegrityLine() {
  const { sub } = useParams();
  if (!sub) return <Landing />;
  if (sub === "report") return <ReportWizard />;
  if (sub === "track") return <Track />;
  if (sub === "protection") return <Protection />;
  return <NotFound />;
}
