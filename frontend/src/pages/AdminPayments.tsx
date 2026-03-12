import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, AlertTriangle } from "lucide-react";

interface Payment {
  id: string;
  company: string;
  amount: number;
  type: "subscription" | "license" | "transaction";
  status: "completed" | "pending" | "failed";
  date: string;
  method?: string;
}

const AdminPayments = () => {
  const payments: Payment[] = [
    {
      id: "pay1",
      company: "MinéGuinée SA",
      amount: 500,
      type: "subscription",
      status: "completed",
      date: "2025-02-14",
      method: "Carte bancaire",
    },
    {
      id: "pay2",
      company: "TechSolutions GN",
      amount: 300,
      type: "license",
      status: "completed",
      date: "2025-02-12",
      method: "Mobile Money",
    },
    {
      id: "pay3",
      company: "Projets Industriels GN",
      amount: 250,
      type: "subscription",
      status: "pending",
      date: "2025-02-10",
      method: "Virement",
    },
    {
      id: "pay4",
      company: "Supply Chain Solutions",
      amount: 150,
      type: "transaction",
      status: "failed",
      date: "2025-02-08",
      method: "Carte bancaire",
    },
  ];

  const stats = {
    totalRevenue: payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    failedPayments: payments.filter(p => p.status === "failed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Paiements & abonnements</h2>
          <p className="text-muted-foreground">Gestion des revenus et abonnements</p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Revenus complétés</p>
              <p className="mt-2 text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Paiements en attente</p>
              <p className="mt-2 text-2xl font-bold text-warning">${stats.pendingPayments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Paiements échoués</p>
              <p className="mt-2 text-2xl font-bold text-destructive">{stats.failedPayments}</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des paiements */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Entreprise</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold">Méthode</th>
                    <th className="px-4 py-2 text-left font-semibold">Statut</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted">
                      <td className="px-4 py-3 font-medium">{payment.company}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{payment.type}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold">${payment.amount}</td>
                      <td className="px-4 py-3 text-sm">{payment.method}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {payment.status === "failed" && (
                            <Button variant="ghost" size="sm">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
