import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Container, PageHeader, Prose, LoadingState, EmptyState, ErrorState, SuccessState, NotFoundState } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { useI18n } from "@/lib/i18n";
import { NAV, STANDALONE, UI } from "@/lib/site";
import NotFound from "./NotFound";

export function SectionPage() {
  const { section = "", sub } = useParams();
  const { lang } = useI18n();
  const home = { label: UI[lang].home, to: "/" };
  const s = NAV.find((n) => n.slug === section);

  if (!s) {
    const page = STANDALONE[section];
    if (!page || sub) return <NotFound />;
    return (
      <>
        <PageHeader crumbs={[home, { label: page.title }]} title={page.title} lead={page.lead} />
        <Container className="py-section"><Prose><EmptyState title="Content in preparation">This page will be published with the full website content.</EmptyState></Prose></Container>
      </>
    );
  }

  const child = sub ? s.children.find((c) => c.slug === sub) : undefined;
  if (sub && !child) return <NotFound />;

  if (child) {
    return (
      <>
        <PageHeader crumbs={[home, { label: s.label[lang], to: `/${s.slug}` }, { label: child.label[lang] }]} overline={s.label[lang]} title={child.label[lang]} lead={child.summary} />
        <Container className="grid gap-12 py-section lg:grid-cols-[14rem_1fr]">
          <nav aria-label={`${s.label[lang]} pages`} className="hidden lg:block">
            <ul className="sticky top-28 grid gap-1 border-l border-border">
              {s.children.map((c) => (
                <li key={c.slug}><Link to={`/${s.slug}/${c.slug}`} aria-current={c.slug === sub ? "page" : undefined}
                  className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-small text-ink-soft hover:text-primary aria-[current=page]:border-primary aria-[current=page]:font-semibold aria-[current=page]:text-primary">{c.label[lang]}</Link></li>
              ))}
            </ul>
          </nav>
          <Prose><LoadingState label={`Loading ${child.label[lang]}`} /><p className="mt-4 text-small text-muted-foreground">Content will load from connected OAG systems.</p></Prose>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader crumbs={[home, { label: s.label[lang] }]} overline="Section" title={s.label[lang]} lead={s.lead} />
      <Container className="py-section">
        <ul className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {s.children.map((c) => (
            <li key={c.slug} className="bg-card">
              <Link to={`/${s.slug}/${c.slug}`} className="group flex h-full flex-col p-6 hover:bg-primary-soft/50">
                <span className="font-display text-h4">{c.label[lang]}</span>
                <span className="mt-2 text-small text-muted-foreground">{c.summary}</span>
                <ArrowRight className="mt-5 size-4 text-primary transition-transform duration-base group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

/* Reference page for the reusable global states. */
export function StatesPage() {
  const [retry, setRetry] = useState(0);
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", to: "/" }, { label: "Design system", to: "/design-system" }, { label: "Global states" }]} overline="Patterns" title="Global states" lead="Reusable loading, empty, error, success and not-found states for every OAG experience." />
      <Container className="grid gap-6 py-section md:grid-cols-2">
        <LoadingState />
        <EmptyState action={<Button variant="secondary" size="sm">Browse publications</Button>} />
        <ErrorState onRetry={() => setRetry((r) => r + 1)}>{retry ? `Retried ${retry}×. ` : ""}We couldn’t load this content. Please try again.</ErrorState>
        <SuccessState>Your IntegrityLine report has been received. Reference: IL-2025-0481.</SuccessState>
        <NotFoundState />
      </Container>
    </>
  );
}
