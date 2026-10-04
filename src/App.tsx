import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { I18nProvider } from "@/lib/i18n";
import DesignSystem from "@/pages/DesignSystem";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { SectionPage, StatesPage } from "@/pages/SectionPage";
import { SiteLayout } from "@/components/ds/shell/SiteLayout";
import AboutOAG, { ContactPage } from "@/pages/AboutOAG";

export default function App() {
  return (
    <I18nProvider>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Routes>
            <Route path="/design-system" element={<DesignSystem />} />
            <Route element={<SiteLayout />}>
              <Route path="/about" element={<AboutOAG />} />
              <Route path="/about/:sub" element={<AboutOAG />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/" element={<Home />} />
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
