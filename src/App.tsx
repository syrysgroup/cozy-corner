import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { I18nProvider } from "@/lib/i18n";
import DesignSystem from "@/pages/DesignSystem";

export default function App() {
  return (
    <I18nProvider>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DesignSystem />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ className: "font-sans" }} />
      </TooltipProvider>
    </I18nProvider>
  );
}
