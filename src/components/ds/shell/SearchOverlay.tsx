import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ds/primitives";
import { NotFoundState } from "./layout-parts";
import { POPULAR_SEARCHES, SEARCH_CATEGORIES, SEARCH_INDEX, type SearchCategory } from "@/lib/site";

const RECENT_KEY = "oag-recent-searches";

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SearchCategory>("All");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (open) { try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")); } catch { setRecent([]); } }
    else { setQ(""); setCat("All"); }
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return SEARCH_INDEX.filter((i) => (cat === "All" || i.category === cat) && (!term || `${i.title} ${i.meta} ${i.category}`.toLowerCase().includes(term))).slice(0, 8);
  }, [q, cat]);
  useEffect(() => setActive(0), [q, cat]);

  const showResults = q.trim().length > 0 || cat !== "All";

  const go = (href: string) => {
    if (q.trim()) {
      const next = [q.trim(), ...recent.filter((r) => r !== q.trim())].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }
    onOpenChange(false);
    navigate(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!showResults || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    if (e.key === "Enter") { e.preventDefault(); go(results[active].href); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-50 max-h-[100dvh] overflow-y-auto border-b border-border bg-background shadow-overlay data-[state=open]:animate-in data-[state=open]:slide-in-from-top-4 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none md:top-6 md:mx-auto md:max-h-[calc(100dvh-3rem)] md:max-w-3xl md:border"
          onKeyDown={onKey}
        >
          <div className="band h-1" aria-hidden />
          <Dialog.Title className="sr-only">Search the OAG website</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-5 py-3 md:px-6">
            <Search className="size-5 shrink-0 text-primary" aria-hidden />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              aria-label="Search audits, reports, recommendations and more"
              aria-controls="search-results"
              placeholder="Search audits, reports, recommendations…"
              className="h-12 min-w-0 flex-1 bg-transparent text-lead text-ink outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded-xs border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground md:inline">Esc</kbd>
            <Dialog.Close className="grid size-10 place-items-center rounded-md text-ink hover:bg-muted" aria-label="Close search"><X className="size-5" /></Dialog.Close>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 md:px-6" role="group" aria-label="Filter by category">
            {SEARCH_CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
                className={cn("shrink-0 rounded-xs border px-3 py-1.5 text-small font-semibold transition-colors duration-fast", cat === c ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-ink-soft hover:border-ink/40")}>
                {c}
              </button>
            ))}
          </div>

          <div className="px-5 py-5 md:px-6" id="search-results">
            {showResults ? (
              results.length ? (
                <>
                  <p className="overline mb-3" aria-live="polite">{results.length} result{results.length > 1 ? "s" : ""}</p>
                  <ul role="listbox" aria-label="Search results" className="grid">
                    {results.map((r, i) => (
                      <li key={r.title} role="option" aria-selected={i === active}>
                        <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(r.href)}
                          className={cn("group flex w-full items-start justify-between gap-4 border-l-2 px-3 py-3 text-left transition-colors duration-fast", i === active ? "border-primary bg-primary-soft/60" : "border-transparent hover:bg-muted")}>
                          <span className="min-w-0">
                            <Badge tone="outline">{r.category}</Badge>
                            <span className="mt-1.5 block font-semibold text-ink">{r.title}</span>
                            <span className="block text-small text-muted-foreground">{r.meta}</span>
                          </span>
                          <ArrowRight className="mt-6 size-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NotFoundState>No matches for “{q}”. Try a broader term or another category.</NotFoundState>
              )
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="overline mb-3 flex items-center gap-2"><Clock className="size-3.5" aria-hidden />Recent searches</p>
                  {recent.length ? (
                    <ul className="grid gap-1">{recent.map((r) => <li key={r}><button type="button" onClick={() => setQ(r)} className="text-body text-ink-soft underline-offset-4 hover:text-primary hover:underline">{r}</button></li>)}</ul>
                  ) : <p className="text-small text-muted-foreground">Your recent searches will appear here.</p>}
                </div>
                <div>
                  <p className="overline mb-3 flex items-center gap-2"><TrendingUp className="size-3.5" aria-hidden />Popular searches</p>
                  <ul className="grid gap-1">{POPULAR_SEARCHES.map((r) => <li key={r}><button type="button" onClick={() => setQ(r.split(" ")[0])} className="text-body text-ink-soft underline-offset-4 hover:text-primary hover:underline">{r}</button></li>)}</ul>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
