import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminProvider";
import { useAuth } from "@/contexts/AuthContext";

// Pages existantes
import Index from "./pages/Index";
import Annuaire from "./pages/Annuaire";
import NetworkPro from "./pages/NetworkPro";
import AppelOffres from "./pages/AppelOffres";
import OffresEmploi from "./pages/OffresEmploi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SignupChoice from "./pages/SignupChoice";
import SignupProfessional from "./pages/SignupProfessional";
import SignupEnterprise from "./pages/SignupEnterprise";
import Company from "./pages/Company";
import JobDetail from "./pages/JobDetail";
import TenderDetail from "./pages/TenderDetail";
import Trends from "./pages/Trends";
import NotFound from "./pages/NotFound";
import Search from './pages/Search';
import Pricing from './pages/Pricing';

// Nouvelles pages
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Documents from './pages/Documents';
import { NotificationProvider } from './contexts/NotificationContext';
import Messages from './pages/Messages';

// Admin imports
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminDocuments from "./pages/AdminDocuments";
import AdminJobs from "./pages/AdminJobs";
import AdminTenders from "./pages/AdminTenders";
import AdminApplications from "./pages/AdminApplications";
import AdminReviews from "./pages/AdminReviews";
import AdminReports from "./pages/AdminReports";
import AdminPayments from "./pages/AdminPayments";
import AdminMessages from './pages/AdminMessages';

const queryClient = new QueryClient();

// ===== COMPOSANTS DE PROTECTION =====
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ===== PROTECTION ADMIN INDÉPENDANTE =====
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("sugu_admin_token");
  const adminUser = localStorage.getItem("sugu_admin_user");

  if (!token || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// ===== COMPOSANT PRINCIPAL =====
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          {/* ✅ NotificationProvider CORRECTEMENT PLACÉ - IL ENVELOPPE AdminProvider */}
          <NotificationProvider>
            <AdminProvider>
              <Routes>
                {/* ===== ROUTES PUBLIQUES ===== */}
                <Route path="/" element={<Index />} />
                <Route path="/annuaire" element={<Annuaire />} />
                <Route path="/appels-offres" element={<AppelOffres />} />
                <Route path="/offres-emploi" element={<OffresEmploi />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<SignupChoice />} />
                <Route path="/signup/professional" element={<SignupProfessional />} />
                <Route path="/signup/enterprise" element={<SignupEnterprise />} />
                <Route path="/company/:slug" element={<Company />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/tenders/:id" element={<TenderDetail />} />
                <Route path="/tarifs" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />

                {/* ===== ROUTES PROTÉGÉES UTILISATEUR ===== */}
                <Route path="/reseau-pro" element={<ProtectedRoute><NetworkPro /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/tendances" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

                {/* ===== ROUTES ADMIN ===== */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
                <Route path="/admin/companies" element={<ProtectedAdminRoute><AdminCompanies /></ProtectedAdminRoute>} />
                <Route path="/admin/documents" element={<ProtectedAdminRoute><AdminDocuments /></ProtectedAdminRoute>} />
                <Route path="/admin/jobs" element={<ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>} />
                <Route path="/admin/tenders" element={<ProtectedAdminRoute><AdminTenders /></ProtectedAdminRoute>} />
                <Route path="/admin/applications" element={<ProtectedAdminRoute><AdminApplications /></ProtectedAdminRoute>} />
                <Route path="/admin/reviews" element={<ProtectedAdminRoute><AdminReviews /></ProtectedAdminRoute>} />
                <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
                <Route path="/admin/payments" element={<ProtectedAdminRoute><AdminPayments /></ProtectedAdminRoute>} />
                <Route path="/admin/messages" element={<ProtectedAdminRoute><AdminMessages /></ProtectedAdminRoute>} />
                {/* ===== ROUTE 404 ===== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;