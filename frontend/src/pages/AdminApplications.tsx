import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, AlertTriangle } from "lucide-react";

interface Application {
  id: string;
  candidate: string;
  company: string;
  type: "emploi" | "b2b";
  status: "pending" | "reviewed" | "rejected";
  appliedDate: string;
}

const AdminApplications = () => {
  const applications: Application[] = [
    { id: "app1", candidate: "Moussa Diallo", company: "MinéGuinée SA", type: "emploi", status: "pending", appliedDate: "2025-02-14" },
    { id: "app2", candidate: "Aisatou Sow", company: "TechSolutions GN", type: "emploi", status: "reviewed", appliedDate: "2025-02-13" },
    { id: "app3", candidate: "Tech Supplier Ltd", company: "MinéGuinée SA", type: "b2b", status: "pending", appliedDate: "2025-02-12" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des candidatures</h2>
          <p className="text-muted-foreground">Suivi des candidatures (emploi + B2B)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidatures ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold">Candidat</th>
                  <th className="px-4 py-2 text-left font-semibold">Entreprise</th>
                  <th className="px-4 py-2 text-left font-semibold">Type</th>
                  <th className="px-4 py-2 text-left font-semibold">Statut</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-border hover:bg-muted">
                    <td className="px-4 py-3">{app.candidate}</td>
                    <td className="px-4 py-3">{app.company}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{app.type}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(app.appliedDate).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => alert(`Voir candidature ${app.id} - ${app.candidate}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Supprimer la candidature de ${app.candidate} ?`)) alert('Action supprimée (simulation)'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
