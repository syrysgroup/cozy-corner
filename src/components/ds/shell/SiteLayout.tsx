import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <SiteHeader />
      <main id="main" tabIndex={-1} key={pathname} className="flex-1 animate-rise-in outline-none motion-reduce:animate-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
