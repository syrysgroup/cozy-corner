import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { I18nProvider } from "@/lib/i18n";
const DesignSystem = lazy(() => import("@/pages/DesignSystem"));
const Home = lazy(() => import("@/pages/Home"));
const Library = lazy(() => import("@/pages/Library"));
const Transparency = lazy(() => import("@/pages/Transparency"));
const DocumentDetail = lazy(() => import("@/pages/DocumentDetail"));
const IntegrityLine = lazy(() => import("@/pages/IntegrityLine"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Institutions = lazy(() => import("@/pages/Institutions"));
const SectionPage = lazy(() => import("@/pages/SectionPage").then((m) => ({ default: m.SectionPage })));
const StatesPage = lazy(() => import("@/pages/SectionPage").then((m) => ({ default: m.StatesPage })));
import { SiteLayout } from "@/components/ds/shell/SiteLayout";
const AboutOAG = lazy(() => import("@/pages/AboutOAG"));
const Careers = lazy(() => import("@/pages/Careers"));
const ContactPage = lazy(() => import("@/pages/AboutOAG").then((m) => ({ default: m.ContactPage })));
import { PortalLayout } from "@/components/portal/PortalLayout";
const PortalDashboard = lazy(() => import("@/pages/portal/Dashboard"));
const AuditList = lazy(() => import("@/pages/portal/Audits").then((m) => ({ default: m.AuditList })));
const AuditDetail = lazy(() => import("@/pages/portal/Audits").then((m) => ({ default: m.AuditDetail })));
const Recommendations = lazy(() => import("@/pages/portal/Recommendations"));
const RiskPage = lazy(() => import("@/pages/portal/Risk"));
const Investigations = lazy(() => import("@/pages/portal/Investigations").then((m) => ({ default: m.Investigations })));
const IntegrityCases = lazy(() => import("@/pages/portal/Investigations").then((m) => ({ default: m.IntegrityCases })));
const Documents = lazy(() => import("@/pages/portal/Workspace").then((m) => ({ default: m.Documents })));
const KnowledgePage = lazy(() => import("@/pages/portal/Workspace").then((m) => ({ default: m.KnowledgePage })));
const Tasks = lazy(() => import("@/pages/portal/Workspace").then((m) => ({ default: m.Tasks })));
const Notifications = lazy(() => import("@/pages/portal/Workspace").then((m) => ({ default: m.Notifications })));
const Admin = lazy(() => import("@/pages/portal/Admin"));
const OAGAssistant = lazy(() => import("@/pages/portal/Assistant"));

export default function App() {
  return (
    <I18nProvider>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Suspense fallback={<div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite"><span className="sr-only">Loading page</span><span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none" aria-hidden /></div>}>
          <Routes>
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="audits" element={<AuditList />} />
              <Route path="audits/:id" element={<AuditDetail />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="risk" element={<RiskPage />} />
              <Route path="investigations" element={<Investigations />} />
              <Route path="integrityline" element={<IntegrityCases />} />
              <Route path="documents" element={<Documents />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="assistant" element={<OAGAssistant />} />
              <Route path="assistant/:threadId" element={<OAGAssistant />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route element={<SiteLayout />}>
              <Route path="/about" element={<AboutOAG />} />
              <Route path="/about/:sub" element={<AboutOAG />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/institutions/:sub" element={<Institutions />} />
              <Route path="/" element={<Home />} />
              <Route path="/integrityline" element={<IntegrityLine />} />
              <Route path="/integrityline/:sub" element={<IntegrityLine />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/transparency/:sub" element={<Transparency />} />
              <Route path="/publications" element={<Library />} />
              <Route path="/publications/document/:id" element={<DocumentDetail />} />
              <Route path="/publications/:sub" element={<Library />} />
              <Route path="/design-system/states" element={<StatesPage />} />
              <Route path="/opportunities/careers" element={<Careers />} />
              <Route path="/:section" element={<SectionPage />} />
              <Route path="/:section/:sub" element={<SectionPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ className: "font-sans" }} />
      </TooltipProvider>
    </I18nProvider>
  );
}
