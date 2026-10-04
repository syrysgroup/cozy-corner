import { cn } from "@/lib/utils";
import type { LibraryDoc } from "@/lib/library-data";

const tone: Record<LibraryDoc["cover"], string> = {
  green: "bg-ecowas-green", ocean: "bg-ecowas-ocean", brown: "bg-ecowas-brown",
  slate: "bg-ecowas-slate", orange: "bg-ecowas-orange", sky: "bg-ecowas-sky",
};

/** Generated typographic cover — stands in until official cover artwork is supplied. */
export function DocCover({ doc, className, large }: { doc: LibraryDoc; className?: string; large?: boolean }) {
  return (
    <div className={cn("relative flex aspect-[3/4] flex-col justify-between overflow-hidden text-primary-foreground shadow-raised", tone[doc.cover], className)} aria-hidden>
      <div className="band h-1.5" />
      <div className="absolute -right-10 top-10 size-40 rounded-full border-[18px] border-primary-foreground/10" />
      <div className="absolute -bottom-16 -left-8 size-48 rounded-full bg-primary-foreground/5" />
      <div className={cn("relative px-4 pt-4", large && "px-7 pt-7")}>
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] opacity-80">OAG · ECOWAS</p>
        <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] opacity-80">{doc.type}</p>
      </div>
      <div className={cn("relative px-4 pb-5", large && "px-7 pb-8")}>
        <p className={cn("font-serif font-semibold leading-tight line-clamp-5", large ? "text-h3" : "text-[0.95rem]")}>{doc.title}</p>
        <div className="mt-3 flex items-center justify-between text-[0.6875rem] font-semibold opacity-85">
          <span>{doc.year}</span><span className="font-mono">{doc.ref}</span>
        </div>
      </div>
    </div>
  );
}
