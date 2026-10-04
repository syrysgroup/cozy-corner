/**
 * IntegrityLine client service — PLACEHOLDER.
 * The frontend performs NO real cryptography. Swap each function body for calls to the
 * secure backend (identity vault + evidence service) keeping the same shapes.
 * Identity details must go to the vault only; the case interface never receives them.
 */
export type ReportMode = "anonymous" | "confidential" | "identified";

export const CATEGORIES = [
  "Fraud", "Corruption", "Bribery", "Procurement irregularities", "Misuse of ECOWAS resources",
  "Conflict of interest", "Financial misconduct", "Abuse of authority", "Serious administrative wrongdoing",
  "Manipulation of ECOWAS processes", "Other OAG-mandate matter",
] as const;

export type EvidenceFile = { id: string; name: string; size: number; type: string; state: "uploading" | "encrypting" | "secured" | "rejected"; progress: number; error?: string };

export type ReportDraft = {
  mode: ReportMode;
  category: string;
  summary: string;
  details: string;
  institution: string;
  location: string;
  when: "exact" | "range" | "ongoing" | "unknown";
  dateFrom: string;
  dateTo: string;
  involved: string;
  witnesses: string;
  evidence: EvidenceFile[];
  contactPref: "portal" | "email" | "none";
  identity: { name: string; email: string; phone: string };
};

export type CaseMessage = { id: string; from: "reporter" | "investigator"; body: string; at: string };
export type CaseRecord = { reference: string; status: "Received" | "Under assessment" | "Information requested" | "Closed"; submittedAt: string; category: string; messages: CaseMessage[] };

const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "audio/mpeg"];
export const MAX_FILE_MB = 25;

export function validateFile(f: File): string | null {
  if (!ALLOWED.includes(f.type)) return "File type not accepted. Use PDF, Word, Excel, image, text or MP3.";
  if (f.size > MAX_FILE_MB * 1024 * 1024) return `File exceeds ${MAX_FILE_MB} MB.`;
  return null;
}

/** Simulated upload → server-side encryption. Replace with evidence-service upload. */
export function uploadEvidence(f: EvidenceFile, onUpdate: (u: Partial<EvidenceFile>) => void) {
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(100, p + 12 + Math.random() * 18);
    onUpdate({ progress: Math.round(p) });
    if (p >= 100) {
      clearInterval(t);
      onUpdate({ state: "encrypting" });
      setTimeout(() => onUpdate({ state: "secured" }), 900);
    }
  }, 250);
  return () => clearInterval(t);
}

const cases = new Map<string, CaseRecord>();
const genRef = () => "PROTECTED-" + Array.from(crypto.getRandomValues(new Uint8Array(3))).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase().slice(0, 5);

export async function submitReport(d: ReportDraft): Promise<{ reference: string; accessKey: string }> {
  await new Promise((r) => setTimeout(r, 1100));
  const reference = genRef();
  const accessKey = Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b) => b.toString(36).padStart(2, "0")).join("").toUpperCase().match(/.{1,4}/g)!.join("-");
  cases.set(reference, {
    reference, status: "Received", submittedAt: new Date().toISOString(), category: d.category,
    messages: [{ id: "m0", from: "investigator", at: new Date().toISOString(), body: "Thank you. Your report has been received and will be assessed by an authorised member of the OAG integrity team. You may be asked follow-up questions here." }],
  });
  return { reference, accessKey };
}

export async function getCase(reference: string, accessKey: string): Promise<CaseRecord | null> {
  await new Promise((r) => setTimeout(r, 600));
  const ref = reference.trim().toUpperCase();
  if (!accessKey.trim()) return null;
  if (cases.has(ref)) return cases.get(ref)!;
  if (ref === "PROTECTED-7F82A") {
    const demo: CaseRecord = { reference: ref, status: "Information requested", submittedAt: "2026-09-12T09:14:00Z", category: "Procurement irregularities", messages: [
      { id: "a", from: "investigator", at: "2026-09-12T10:02:00Z", body: "Thank you for your report. It has been received and assigned for assessment." },
      { id: "b", from: "investigator", at: "2026-09-20T14:30:00Z", body: "Could you indicate approximately when the contract award you mention was published? Please do not include details that could identify you unless you choose to." },
    ] };
    cases.set(ref, demo);
    return demo;
  }
  return null;
}

export async function sendMessage(reference: string, body: string): Promise<CaseMessage> {
  await new Promise((r) => setTimeout(r, 500));
  const m: CaseMessage = { id: crypto.randomUUID(), from: "reporter", body, at: new Date().toISOString() };
  cases.get(reference)?.messages.push(m);
  return m;
}
