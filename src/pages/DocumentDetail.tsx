import { Link, useParams } from "react-router-dom";
import { Building2, Download, Eye, FileSearch, Hash, Tag, ListChecks, ArrowRight, Calendar, Globe, Languages, FileText } from "lucide-react";
import { Badge, Button, StatusBadge } from "@/components/ds/primitives";
import { Breadcrumbs, Container, NotFoundState } from "@/components/ds/shell/layout-parts";
import { DocCover } from "@/components/ds/library/DocCover";
import { getPublicDoc, relatedDocs } from "@/lib/library-data";
import { downloadDoc } from "@/pages/Library";

const recStatus = { Implemented: "positive", "In progress": "attention", "Not started": "neutral" } as const;

export default function DocumentDetail() {
  const { id } = useParams();
  const doc = getPublicDoc(id); // restricted records are never resolvable
  if (!doc) return <Container className="py-20"><NotFoundState title="Document not available" action={<Button asChild variant="secondary"><Link to="/publications">Back to library</Link></Button>}>This document does not exist or is not available for public release.</NotFoundState></Container>;

  const related = relatedDocs(doc);
  const meta: [React.ElementType, string, string][] = [
    [Hash, "Reference", doc.ref], [FileText, "Type", doc.type], [Calendar, "Published", new Date(doc.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
    [Building2, "Institution", doc.institution], [Globe, "Country", doc.country], [Languages, "Languages", doc.languages.join(", ")],
    ...(doc.auditType ? [[FileSearch, "Audit type", doc.auditType] as [React.ElementType, string, string]] : []),
  ];

  return (
    <>
      <div className="border-b border-border bg-surface-sunken">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Publications", to: "/publications" }, { label: doc.ref }]} />
          <div className="mt-8 grid items-start gap-10 md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr]">
            <DocCover doc={doc} large className="mx-auto w-56 animate-rise-in md:w-full" />
            <div>
              <div className="flex flex-wrap gap-1.5"><Badge tone="brand">{doc.type}</Badge><Badge tone="outline">{doc.status}</Badge><Badge tone="outline">{doc.year}</Badge></div>
              <h1 className="mt-4 max-w-3xl text-h1 text-ink">{doc.title}</h1>
              <p className="mt-4 max-w-2xl text-lead text-ink-soft">{doc.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => downloadDoc(doc)}><Eye />View document</Button>
                <Button size="lg" variant="secondary" onClick={() => downloadDoc(doc)}><Download />Download PDF · {doc.sizeMb} MB</Button>
              </div>
              <p className="mt-3 text-small text-muted-foreground">{doc.pages} pages · Available in {doc.languages.join(", ")}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="desc"><h2 id="desc" className="text-h3 text-ink">Description</h2>
              <p className="mt-3 max-w-[42rem] text-body text-ink-soft">{doc.summary} The full text, including findings, recommendations and management responses where applicable, is available in the document.</p>
            </section>

            {doc.toc && (
              <section aria-labelledby="toc"><h2 id="toc" className="text-h3 text-ink">Contents</h2>
                <ol className="mt-4 divide-y divide-border border-y border-border">
                  {doc.toc.map((t, i) => (
                    <li key={t} className="flex items-baseline gap-4 py-3"><span className="font-mono text-small text-primary">{String(i + 1).padStart(2, "0")}</span><span className="text-body text-ink">{t}</span></li>
                  ))}
                </ol>
              </section>
            )}

            {(doc.recommendations?.length || doc.relatedAudits?.length) ? (
              <section aria-labelledby="conn">
                <h2 id="conn" className="text-h3 text-ink">Knowledge connections</h2>
                <p className="mt-1 text-small text-muted-foreground">How this document links to the wider body of audit work.</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {doc.recommendations?.length ? (
                    <div className="border border-border bg-card p-5"><p className="overline mb-3 flex items-center gap-2"><ListChecks className="size-3.5" />Recommendations</p>
                      <ul className="grid gap-3">{doc.recommendations.map((r) => <li key={r.title} className="flex items-start justify-between gap-3 text-small text-ink"><span>{r.title}</span><StatusBadge status={recStatus[r.status]}>{r.status}</StatusBadge></li>)}</ul>
                      <Button asChild variant="tertiary" size="sm" className="mt-4"><Link to="/audit/recommendations">Track recommendations <ArrowRight /></Link></Button>
                    </div>
                  ) : null}
                  {doc.relatedAudits?.length ? (
                    <div className="border border-border bg-card p-5"><p className="overline mb-3 flex items-center gap-2"><FileSearch className="size-3.5" />Related audits</p>
                      <ul className="grid gap-2">{doc.relatedAudits.map((a) => <li key={a}><Link to="/audit/programme" className="text-small text-ink underline-offset-4 hover:text-primary hover:underline">{a}</Link></li>)}</ul>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {related.length > 0 && (
              <section aria-labelledby="rel"><h2 id="rel" className="text-h3 text-ink">Related documents</h2>
                <ul className="mt-5 grid gap-6 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.id}><Link to={`/publications/document/${r.id}`} className="group block">
                      <DocCover doc={r} className="transition-transform duration-base group-hover:-translate-y-1" />
                      <p className="mt-3 text-small font-semibold text-ink group-hover:text-primary">{r.title}</p>
                      <p className="text-small text-muted-foreground">{r.type} · {r.year}</p>
                    </Link></li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
            <div className="border border-border bg-card"><div className="band h-1" />
              <dl className="divide-y divide-border">
                {meta.map(([Icon, k, v]) => (
                  <div key={k} className="flex gap-3 px-5 py-3"><Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><div><dt className="text-small text-muted-foreground">{k}</dt><dd className="text-small font-semibold text-ink">{v}</dd></div></div>
                ))}
              </dl>
            </div>
            <div><p className="overline mb-3 flex items-center gap-2"><Tag className="size-3.5" />Topics</p>
              <div className="flex flex-wrap gap-1.5">{doc.topics.map((t) => <Link key={t} to={`/publications?q=${encodeURIComponent(t)}`} className="rounded-xs border border-border px-2.5 py-1 text-small text-ink-soft hover:border-primary hover:text-primary">{t}</Link>)}</div>
            </div>
            <div><p className="overline mb-3 flex items-center gap-2"><Building2 className="size-3.5" />Institution</p>
              <Link to="/transparency/institutions" className="text-small font-semibold text-ink underline-offset-4 hover:text-primary hover:underline">{doc.institution}</Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
