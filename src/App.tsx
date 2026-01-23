import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import PricingPage from "./pages/PricingPage";
import WebsiteSuggestionPage from "./pages/WebsiteSuggestionPage";
import DownloadPage from "./pages/DownloadPage";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import PaymentPage from "./pages/PaymentPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminAnalysesPage from "./pages/admin/AdminAnalysesPage";
import AdminVisitorsPage from "./pages/admin/AdminVisitorsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminSecurityPage from "./pages/admin/AdminSecurityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/website-suggestion" element={<WebsiteSuggestionPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/admin/analyses" element={<AdminAnalysesPage />} />
            <Route path="/admin/visitors" element={<AdminVisitorsPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/security" element={<AdminSecurityPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
