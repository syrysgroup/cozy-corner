import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ds/primitives';
import { enquirySchema, ENQUIRY_TYPES, SUBMISSIONS_OPEN, type ContactContent } from '@/lib/contact-schema';
import { CONTACT_COPY } from '@/lib/contact-copy';
import type { Lang } from '@/lib/i18n';

const NOT_HERE: Record<Lang, { check: string; title: string; items: [string, string, string][]; messageHint: string; typeHint: string }> = {
  en: { check: 'Check my answers', title: 'Please do not use this form for', messageHint: 'Do not include personal, financial or confidential information.', typeHint: 'Choose the topic that best matches your enquiry.',
    items: [['Integrity reports', '/integrityline', 'Use IntegrityLine'], ['Job applications', '/opportunities/careers', 'Go to Careers'], ['Procurement bids', '/opportunities/procurement', 'Go to Procurement']] },
  fr: { check: 'Vérifier mes réponses', title: 'Merci de ne pas utiliser ce formulaire pour', messageHint: 'N’incluez pas d’informations personnelles, financières ou confidentielles.', typeHint: 'Choisissez le sujet qui correspond le mieux à votre demande.',
    items: [['Les signalements d’intégrité', '/integrityline', 'Utiliser IntegrityLine'], ['Les candidatures', '/opportunities/careers', 'Aller aux Carrières'], ['Les offres de marchés', '/opportunities/procurement', 'Aller aux Marchés']] },
  pt: { check: 'Verificar respostas', title: 'Não utilize este formulário para', messageHint: 'Não inclua informações pessoais, financeiras ou confidenciais.', typeHint: 'Escolha o tema que melhor corresponde ao seu pedido.',
    items: [['Denúncias de integridade', '/integrityline', 'Usar IntegrityLine'], ['Candidaturas a emprego', '/opportunities/careers', 'Ir para Carreiras'], ['Propostas de aquisições', '/opportunities/procurement', 'Ir para Aquisições']] },
};

type Receipt = { reference: string };

export function EnquiryForm({ lang, type, onType, content }: { lang: Lang; type: string; onType: (v: string) => void; content?: ContactContent }) {
  const c = CONTACT_COPY[lang]; const n = NOT_HERE[lang];
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Only ever set from a confirmed service response containing a reference.
  const [receipt] = useState<Receipt | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const countries = new Intl.DisplayNames([lang], { type: 'region' });
  const codes = 'DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW US GB FR PT DE BE NL ES IT CA BR IN CN JP'.split(' ').map((code) => ({ code, name: countries.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name, lang));
  const control = 'mt-2 min-h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-body text-left aria-[invalid=true]:border-destructive';
  const labels: Record<string, string> = { first_name: c.first, last_name: c.last, email: c.email, organization: c.organization, subject: c.subject };

  function validate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = enquirySchema.safeParse({ ...data, organization: data.organization ?? '', country: data.country ?? '', preferred_language: lang, consent_recorded: data.consent_recorded === 'on' });
    if (!result.success) {
      const e: Record<string, string> = {};
      for (const issue of result.error.issues) { const field = String(issue.path[0]); e[field] ??= field === 'email' ? c.invalidEmail : field === 'consent_recorded' ? c.consentError : c.invalid; }
      setErrors(e); requestAnimationFrame(() => summary.current?.focus());
    } else setErrors({});
    // Submission stays closed until approved spam protection and secure processing exist.
  }

  const describe = (field: string, hint?: string) => [hint, errors[field] && `${field}-error`].filter(Boolean).join(' ') || undefined;
  const Err = ({ field }: { field: string }) => errors[field] ? <p id={`${field}-error`} className="mt-1 text-small text-destructive">{errors[field]}</p> : null;
  const Marker = ({ optional }: { optional?: boolean }) => <span className="ml-1 text-small font-normal text-muted-foreground">({optional ? c.optional : c.required})</span>;

  if (receipt) return <div role="status" className="border-l-4 border-primary bg-primary-soft p-6 text-left"><p className="font-semibold">{receipt.reference}</p></div>;

  return <form noValidate onSubmit={validate} className="min-w-0 text-left" aria-describedby="submission-notice">
    <div id="submission-notice" role="status" className="mb-6 flex gap-3 border-l-4 border-ecowas-yellow bg-ecowas-yellow-12 p-5"><LockKeyhole className="mt-1 size-5 shrink-0 text-ecowas-ocean" aria-hidden /><div><p className="font-semibold">{c.closed}</p><p className="mt-1 text-small text-ink-soft">{c.closedBody}</p></div></div>
    <aside aria-labelledby="not-here-title" className="mb-8 border border-border bg-surface-sunken p-5">
      <p id="not-here-title" className="font-semibold">{n.title}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">{n.items.map(([what, to, cta]) => <li key={to} className="text-small"><span className="block text-ink-soft">{what}</span><Link to={to} className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:underline">{cta}<ArrowRight className="size-4" aria-hidden /></Link></li>)}</ul>
    </aside>
    {Object.keys(errors).length > 0 && <div ref={summary} tabIndex={-1} role="alert" className="mb-6 border border-destructive p-4"><h3 className="font-semibold">{c.error}</h3><ul className="mt-2 list-disc pl-5">{Object.entries(errors).map(([field, error]) => <li key={field}><a className="underline" href={`#contact-${field}`}>{labels[field] ?? (field === 'message' ? c.message : field === 'enquiry_type' ? c.type : c.consent)}: {error}</a></li>)}</ul></div>}
    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {Object.entries(labels).map(([field, label]) => <div key={field} className={field === 'subject' ? 'sm:col-span-2' : ''}>
        <label htmlFor={`contact-${field}`} className="font-semibold">{label}<Marker optional={field === 'organization'} /></label>
        <input id={`contact-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required={field !== 'organization'} aria-required={field !== 'organization'} autoComplete={field === 'first_name' ? 'given-name' : field === 'last_name' ? 'family-name' : field === 'email' ? 'email' : field === 'organization' ? 'organization' : 'off'} maxLength={field === 'email' ? 255 : field === 'subject' || field === 'organization' ? 200 : 100} className={control} aria-invalid={!!errors[field]} aria-describedby={describe(field)} />
        <Err field={field} />
      </div>)}
      <div><label htmlFor="contact-country" className="font-semibold">{c.country}<Marker optional /></label><select id="contact-country" name="country" className={control} aria-describedby={describe('country')}><option value="">{c.select}</option>{codes.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select><Err field="country" /></div>
      <div><label htmlFor="contact-enquiry_type" className="font-semibold">{c.type}<Marker /></label><select id="contact-enquiry_type" name="enquiry_type" value={type} onChange={(e) => onType(e.target.value)} className={control} aria-required aria-invalid={!!errors.enquiry_type} aria-describedby={describe('enquiry_type', 'type-hint')}>{ENQUIRY_TYPES.map((value, i) => <option key={value} value={value}>{content?.categories?.find((cat) => cat.value === value)?.label ?? c.types[i]}</option>)}</select><p id="type-hint" className="mt-1 text-small text-muted-foreground">{n.typeHint}</p><Err field="enquiry_type" /></div>
      <div className="sm:col-span-2"><label htmlFor="contact-message" className="font-semibold">{c.message}<Marker /></label><textarea id="contact-message" name="message" required aria-required maxLength={5000} rows={7} value={message} onChange={(e) => setMessage(e.target.value)} className={`${control} resize-y`} aria-invalid={!!errors.message} aria-describedby={describe('message', 'message-hint message-count')} /><p id="message-hint" className="mt-1 text-small text-muted-foreground">{n.messageHint}</p><p id="message-count" className="text-small text-muted-foreground" aria-live="polite">{5000 - message.length} {c.remaining}</p><Err field="message" /></div>
    </div>
    <fieldset className="my-6" aria-describedby={describe('consent_recorded')}>
      <legend className="sr-only">{c.consent}</legend>
      <label className="flex min-h-11 items-start gap-3 text-small text-ink-soft"><input id="contact-consent_recorded" type="checkbox" name="consent_recorded" aria-required className="mt-1 size-5 shrink-0 accent-primary" aria-invalid={!!errors.consent_recorded} aria-describedby={describe('consent_recorded')} /><span>{c.consent} <span className="text-muted-foreground">({c.required})</span></span></label>
      <Err field="consent_recorded" />
    </fieldset>
    <div className="flex flex-wrap items-center gap-4">
      <Button type="submit" variant="secondary" className="w-full sm:w-auto">{n.check}</Button>
      <Button type="button" disabled={!SUBMISSIONS_OPEN} aria-describedby="submission-notice" className="w-full sm:w-auto"><LockKeyhole aria-hidden />{c.send}</Button>
    </div>
  </form>;
}
