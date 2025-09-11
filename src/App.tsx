
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";
import { usePageLoading } from "./hooks/usePageLoading";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import OneWayTrips from "./pages/OneWayTrips";
import RoundTrips from "./pages/RoundTrips";
import Pricing from "./pages/Pricing";
import ContactWithForm from "./pages/ContactWithForm";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import BookingConfirmation from "./pages/BookingConfirmation";
import CorporateTravel from "./pages/CorporateTravel";
import CorporateQuote from "./pages/CorporateQuote";

import OutstationTrips from "./pages/OutstationTrips";
import { AdminProvider } from "./contexts/AdminContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import BookingNotifications from "./components/BookingNotifications";
import BookingStatusUpdater from "./components/BookingStatusUpdater";

const queryClient = new QueryClient();

const AppContent = () => {
  const isLoading = usePageLoading();
  const isAdminDomain = window.location.hostname.includes('admin') || window.location.pathname.startsWith('/admin');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // For admin domain, only show admin routes
  if (isAdminDomain) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  // Regular domain routes
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/one-way-trips" element={<OneWayTrips />} />
      <Route path="/round-trips" element={<RoundTrips />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<ContactWithForm />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/corporate-travel" element={<CorporateTravel />} />
      <Route path="/corporate-quote" element={<CorporateQuote />} />
      
      <Route path="/outstation-trips" element={<OutstationTrips />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      {/* Redirect /admin to /admin/login */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <BookingNotifications />
          <BookingStatusUpdater />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
