import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Properties from "./pages/Properties";
import Search from "./pages/Search";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import DashboardProperties from "./pages/DashboardProperties";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import KYC from "./pages/KYC";
import OnboardingWizard from "./components/OnboardingWizard";
import UpdatePassword from "./pages/UpdatePassword";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import PropertyDetails from "./pages/PropertyDetails";
import UserList from "./pages/Admin/UserList";
import KYCReview from "./pages/Admin/KYCReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/search" element={<Search />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/about" element={<About />} />
            
            {/* Onboarding - don't require onboarding completion */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <OnboardingWizard />
                </ProtectedRoute>
              }
            />
            
            {/* Password update */}
            <Route
              path="/update-password"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
            
            {/* Dashboard routes - require onboarding */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/kyc"
              element={
                <ProtectedRoute>
                  <KYC />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties"
              element={
                <ProtectedRoute>
                  <DashboardProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* Listing routes */}
            <Route
              path="/listings/create"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/edit/:id"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kyc-review"
              element={
                <ProtectedRoute>
                  <KYCReview />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
