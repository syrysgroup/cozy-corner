import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { I18nProvider } from "@/lib/i18n";
import DesignSystem from "@/pages/DesignSystem";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Transparency from "@/pages/Transparency";
import DocumentDetail from "@/pages/DocumentDetail";
import IntegrityLine from "@/pages/IntegrityLine";
import NotFound from "@/pages/NotFound";
import { SectionPage, StatesPage } from "@/pages/SectionPage";
import { SiteLayout } from "@/components/ds/shell/SiteLayout";
import AboutOAG, { ContactPage } from "@/pages/AboutOAG";
import { PortalLayout } from "@/components/portal/PortalLayout";
import PortalDashboard from "@/pages/portal/Dashboard";
import { AuditList, AuditDetail } from "@/pages/portal/Audits";
import Recommendations from "@/pages/portal/Recommendations";
import RiskPage from "@/pages/portal/Risk";
import { Investigations, IntegrityCases } from "@/pages/portal/Investigations";
import { Documents, KnowledgePage, Tasks, Notifications } from "@/pages/portal/Workspace";
import Admin from "@/pages/portal/Admin";

export default function App() {
  return (
    <I18nProvider>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
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
              <Route path="tasks" element={<Tasks />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route element={<SiteLayout />}>
              <Route path="/about" element={<AboutOAG />} />
              <Route path="/about/:sub" element={<AboutOAG />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/integrityline" element={<IntegrityLine />} />
              <Route path="/integrityline/:sub" element={<IntegrityLine />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/transparency/:sub" element={<Transparency />} />
              <Route path="/publications" element={<Library />} />
              <Route path="/publications/document/:id" element={<DocumentDetail />} />
              <Route path="/publications/:sub" element={<Library />} />
              <Route path="/design-system/states" element={<StatesPage />} />
              <Route path="/:section" element={<SectionPage />} />
              <Route path="/:section/:sub" element={<SectionPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ className: "font-sans" }} />
      </TooltipProvider>
    </I18nProvider>
  );
}
