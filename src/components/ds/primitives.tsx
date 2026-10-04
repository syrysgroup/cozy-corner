import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, Circle, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Button ---------------- */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-base ease-institutional disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-raised",
        secondary: "border border-ink/80 text-ink bg-transparent hover:bg-ink hover:text-background",
        tertiary: "text-primary underline-offset-4 hover:underline px-0 h-auto",
        ghost: "text-ink hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground",
        filter: "border border-border bg-card text-ink-soft hover:border-ink/40 data-[active=true]:border-primary data-[active=true]:bg-primary-soft data-[active=true]:text-primary",
        inverse: "bg-background text-ink hover:bg-background/90",
      },
      size: {
        sm: "h-9 px-3.5 text-small rounded-md",
        md: "h-11 px-5 text-body rounded-md",
        lg: "h-13 px-7 text-[1.0625rem] rounded-md py-3.5",
        icon: "h-10 w-10 rounded-md",
      },
    },
    compoundVariants: [{ variant: "tertiary", class: "px-0 h-auto" }],
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
        {asChild ? children : <>{loading && <Loader2 className="animate-spin" aria-hidden />}{children}</>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

/* ---------------- Status ---------------- */
export type Status = "positive" | "attention" | "warning" | "critical" | "info" | "neutral";
export const statusMeta: Record<Status, { icon: React.ElementType; cls: string; dot: string; label: string }> = {
  positive: { icon: CheckCircle2, cls: "text-status-positive bg-status-positive/10 border-status-positive/25", dot: "bg-status-positive", label: "Implemented" },
  attention: { icon: Eye, cls: "text-status-attention bg-ecowas-yellow/15 border-ecowas-yellow/50", dot: "bg-ecowas-yellow", label: "Attention" },
  warning: { icon: AlertTriangle, cls: "text-status-warning bg-ecowas-orange/10 border-ecowas-orange/30", dot: "bg-ecowas-orange", label: "Warning" },
  critical: { icon: AlertOctagon, cls: "text-status-critical bg-status-critical/10 border-status-critical/25", dot: "bg-status-critical", label: "Critical" },
  info: { icon: Info, cls: "text-status-info bg-status-info/10 border-status-info/25", dot: "bg-status-info", label: "Information" },
  neutral: { icon: Circle, cls: "text-status-neutral bg-status-neutral/10 border-status-neutral/25", dot: "bg-status-neutral", label: "Not started" },
};

export function StatusBadge({ status, children, className }: { status: Status; children?: React.ReactNode; className?: string }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-small font-semibold leading-5", m.cls, className)}>
      <Icon className="size-3.5" aria-hidden />
      {children ?? m.label}
    </span>
  );
}

export function Badge({ children, tone = "default", className }: { children: React.ReactNode; tone?: "default" | "outline" | "brand" | "brown"; className?: string }) {
  const tones = {
    default: "bg-muted text-ink-soft",
    outline: "border border-border text-ink-soft",
    brand: "bg-primary text-primary-foreground",
    brown: "bg-accent/10 text-accent",
  };
  return <span className={cn("inline-flex items-center rounded-xs px-2 py-0.5 text-[0.75rem] font-semibold uppercase tracking-wider", tones[tone], className)}>{children}</span>;
}

export function Band({ className }: { className?: string }) {
  return <div className={cn("band h-1 w-full", className)} aria-hidden />;
}

/* Official ECOWAS emblem, supplied by the Office — rendered as-is (no redraw, no distortion). */
import ecowasLogo from "@/assets/ecowas-logo.png.asset.json";

export const OFFICIAL_LOGO_SRC: string = ecowasLogo.url;

export function Wordmark({ inverse, compact }: { inverse?: boolean; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img src={OFFICIAL_LOGO_SRC} alt="" className={cn("size-10 shrink-0 object-contain", compact && "size-9")} />
      {!compact && (
        <div className={cn("leading-tight", inverse ? "text-background" : "text-ink")}>
          <div className="text-[0.95rem] font-bold">Office of the Auditor General</div>
          <div className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.12em]", inverse ? "text-background/70" : "text-muted-foreground")}>ECOWAS Institutions</div>
        </div>
      )}
    </div>
  );
}
