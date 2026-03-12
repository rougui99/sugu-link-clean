import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, AlertCircle } from "lucide-react";

interface Report {
  id: string;
  type: "fraud" | "abuse" | "fake" | "dispute";
  reporter: string;
  subject: string;
  description: string;
  status: "ouvert" | "en cours" | "résolu" | "fermé";
  reportedDate: string;
}

const AdminReports = () => {
  const reports: Report[] = [
    {
      id: "rep1",
      type: "fraud",
      reporter: "Utilisateur anonyme",
      subject: "MinéGuinée SA - Document falsifié",
      description: "Documents suspect soumis pour vérification",
      status: "en cours",
      reportedDate: "2025-02-12",
    },
    {
      id: "rep2",
      type: "abuse",
      reporter: "Alpha Diallo",
      subject: "Conduite inappropriée d'un candidat",
      description: "Harcèlement lors d'entretien d'embauche",
      status: "ouvert",
      reportedDate: "2025-02-13",
    },
    {
      id: "rep3",
      type: "fake",
      reporter: "Système auto",
      subject: "Offre d'emploi suspecte",
      description: "Prix incohérent et description vague",
      status: "résolu",
      reportedDate: "2025-02-01",
    },
  ];

  const typeLabels: Record<Report["type"], string> = {
    fraud: "Fraude",
    abuse: "Abus",
    fake: "Faux",
    dispute: "Litige",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Signalements & litiges</h2>
          <p className="text-muted-foreground">Gestion des signalements et des litiges</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Signalements ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-muted">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={report.status === "ouvert" ? "destructive" : "secondary"}>
                        {typeLabels[report.type]}
                      </Badge>
                      <Badge variant="outline">{report.status}</Badge>
                    </div>
                    <p className="font-semibold">{report.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Signalé par: {report.reporter}</p>
                <p className="text-sm mb-3">{report.description}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(report.reportedDate).toLocaleDateString("fr-FR")}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" /> Voir détails
                  </Button>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4 text-green-600" /> Résoudre
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
