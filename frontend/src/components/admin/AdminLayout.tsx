import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, LogOut, BarChart3, Users, Building2, 
  FileCheck, Briefcase, Package, MessageSquare, 
  Star, AlertCircle, CreditCard, ChevronLeft, 
  ChevronRight, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Utilisateurs", path: "/admin/users" },
  { icon: Building2, label: "Entreprises", path: "/admin/companies" },
  { icon: FileCheck, label: "Documents", path: "/admin/documents" },
  { icon: Briefcase, label: "Offres d'emploi", path: "/admin/jobs" },
  { icon: Package, label: "Appels d'offres", path: "/admin/tenders" },
  { icon: MessageSquare, label: "Candidatures", path: "/admin/applications" },
  { icon: Star, label: "Avis & Notation", path: "/admin/reviews" },
  { icon: AlertCircle, label: "Signalements", path: "/admin/reports" },
  { icon: CreditCard, label: "Paiements", path: "/admin/payments" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const adminUserStr = localStorage.getItem("sugu_admin_user");
  const adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;
  
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("sugu_admin_token");
    localStorage.removeItem("sugu_admin_user");
    window.location.href = "/admin/login";
  };

  // Formater le rôle pour l'affichage
  const formatRole = (role: string) => {
    if (role === "superadmin") return "Super Administrateur";
    if (role === "admin") return "Administrateur";
    return role;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`relative border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo et titre */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="font-display font-bold text-slate-800">
                Sugu<span className="text-purple-600">-Link</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5 text-slate-500" /> : <ChevronRight className="h-5 w-5 text-slate-500" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profil admin */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 p-4">
          {sidebarOpen && adminUser && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {adminUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {formatRole(adminUser.role)}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-white p-2 border border-slate-200">
                <p className="text-xs text-slate-600 truncate">{adminUser.email}</p>
              </div>
            </div>
          )}
          
          {/* Bouton déconnexion */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && "Déconnexion"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-slate-800">
              {menuItems.find(item => item.path === location.pathname)?.label || "Administration"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>En ligne</span>
              </div>
              <div className="text-sm font-medium text-slate-600">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;