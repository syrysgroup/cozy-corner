import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { NAV } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useI18n();
  return (
    <Container className="grid gap-12 py-section-lg lg:grid-cols-[1fr_0.8fr] lg:items-end">
      <div>
        <p className="overline font-mono text-accent">Error 404 · Reference not found</p>
        <h1 className="mt-4 font-display text-display-lg">This page is not on the record.</h1>
        <p className="mt-5 max-w-[36rem] text-lead text-ink-soft">The address may have changed, or the document may have been moved. Every finding has a trail, let’s pick yours back up.</p>
        <div className="mt-8"><Button asChild><Link to="/">Return home <ArrowRight /></Link></Button></div>
      </div>
      <nav aria-label="Suggested sections" className="border-t-2 border-primary pt-5">
        <p className="overline mb-4">You may be looking for</p>
        <ul className="grid gap-2">{NAV.slice(0, 5).map((s) => <li key={s.slug}><Link to={`/${s.slug}`} className="flex items-center justify-between border-b border-border py-2 text-body font-semibold text-ink hover:text-primary">{s.label[lang]}<ArrowRight className="size-4" aria-hidden /></Link></li>)}</ul>
      </nav>
    </Container>
  );
}
