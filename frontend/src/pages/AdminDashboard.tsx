import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Briefcase,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";

const AdminDashboard = () => {
  // Données de démonstration
  const stats = {
    totalUsers: 2847,
    totalCompanies: 523,
    verifiedCompanies: 412,
    pendingCompanies: 89,
    rejectedCompanies: 22,
    activeJobListings: 1203,
    activeTenders: 456,
    totalApplications: 5234,
    monthlyRevenue: 45230,
  };

  const alerts = [
    { id: 1, type: "expired_docs", count: 12, label: "Documents expirés", severity: "warning" },
    { id: 2, type: "flagged_companies", count: 5, label: "Entreprises signalées", severity: "error" },
    { id: 3, type: "open_disputes", count: 8, label: "Litiges ouverts", severity: "warning" },
    { id: 4, type: "pending_moderation", count: 23, label: "Contenus à modérer", severity: "warning" },
  ];

  const recentActivities = [
    { id: 1, action: "Entreprise vérifiée", user: "MinéGuinée SA", time: "Il y a 2h" },
    { id: 2, action: "Offre d'emploi supprimée", user: "Projet Minier Ltd", time: "Il y a 4h" },
    { id: 3, action: "Candidature bloquée", user: "utilisateur@email.com", time: "Il y a 6h" },
    { id: 4, action: "Document validé", user: "TechSolutions GN", time: "Il y a 8h" },
    { id: 5, action: "Avis supprimé", user: "utilisateur@email.com", time: "Il y a 1j" },
  ];

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subtext?: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
            {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
          </div>
          <div className="rounded-lg bg-muted p-2 text-primary">{Icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tableau de bord administrateur</h2>
          <p className="text-muted-foreground">Bienvenue dans votre espace de gestion</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Utilisateurs (Professionnels)"
            value={stats.totalUsers}
            subtext="↑ 125 ce mois"
          />
          <StatCard
            icon={<Building2 className="h-6 w-6" />}
            label="Entreprises vérifiées"
            value={stats.verifiedCompanies}
            subtext="sur {stats.totalCompanies} total"
          />
          <StatCard
            icon={<Briefcase className="h-6 w-6" />}
            label="Offres d'emploi actives"
            value={stats.activeJobListings}
            subtext="↑ 89 ce mois"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            label="Revenus mensuels"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            subtext="↑ 12% vs mois dernier"
          />
        </div>

        {/* Deuxième rangée de stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<Package className="h-6 w-6" />}
            label="Appels d'offres actifs"
            value={stats.activeTenders}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Candidatures (total)"
            value={stats.totalApplications}
          />
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            label="Entreprises en attente"
            value={stats.pendingCompanies}
            subtext="À vérifier"
          />
        </div>

        {/* Alertes rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertes rapides
            </CardTitle>
            <CardDescription>Actions requises immédiatement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-border bg-card p-3 hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{alert.label}</span>
                    <Badge
                      variant={alert.severity === "error" ? "destructive" : "secondary"}
                      className="text-lg"
                    >
                      {alert.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions d'administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between py-3 ${
                    idx !== recentActivities.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionButtons />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

const ActionButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
        Voir utilisateurs
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/companies')}>
        Voir entreprises
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/documents')}>
        Vérifier documents
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/reports')}>
        Modérer contenu
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/reviews')}>
        Gérer signalements
      </Button>
    </div>
  );
};
