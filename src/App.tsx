import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import PricingPage from "./pages/PricingPage";
import WebsiteSuggestionPage from "./pages/WebsiteSuggestionPage";
import ServicesPage from "./pages/ServicesPage";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import PaymentPage from "./pages/PaymentPage";
import MentorshipPage from "./pages/MentorshipPage";
import MentorshipPaymentPage from "./pages/MentorshipPaymentPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminAnalysesPage from "./pages/admin/AdminAnalysesPage";
import AdminVisitorsPage from "./pages/admin/AdminVisitorsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminSecurityPage from "./pages/admin/AdminSecurityPage";
import AdminFollowUpsPage from "./pages/admin/AdminFollowUpsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminMentorshipPage from "./pages/admin/AdminMentorshipPage";
import AdminMentorshipSettingsPage from "./pages/admin/AdminMentorshipSettingsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminTrackingPage from "./pages/admin/AdminTrackingPage";
import AdminPaymentMethodsPage from "./pages/admin/AdminPaymentMethodsPage";
import AdminDodoProductsPage from "./pages/admin/AdminDodoProductsPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminWebsiteLeadsPage from "./pages/admin/AdminWebsiteLeadsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ChatWidget />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/website-suggestion" element={<WebsiteSuggestionPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/mentorship/payment" element={<MentorshipPaymentPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/admin/analyses" element={<AdminAnalysesPage />} />
            <Route path="/admin/visitors" element={<AdminVisitorsPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/security" element={<AdminSecurityPage />} />
            <Route path="/admin/follow-ups" element={<AdminFollowUpsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/mentorship" element={<AdminMentorshipPage />} />
            <Route path="/admin/mentorship-settings" element={<AdminMentorshipSettingsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/tracking" element={<AdminTrackingPage />} />
            <Route path="/admin/payment-methods" element={<AdminPaymentMethodsPage />} />
            <Route path="/admin/dodo-products" element={<AdminDodoProductsPage />} />
            <Route path="/admin/chat" element={<AdminChatPage />} />
            <Route path="/admin/website-leads" element={<AdminWebsiteLeadsPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
