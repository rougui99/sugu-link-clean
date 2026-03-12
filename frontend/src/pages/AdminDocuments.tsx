import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, XCircle, Download, Eye, Clock } from "lucide-react";

interface Document {
  id: string;
  type: string;
  company: string;
  submittedDate: string;
  expiryDate: string;
  status: "en attente" | "validé" | "rejeté";
  fileName: string;
}

const AdminDocuments = () => {
  const [statusFilter, setStatusFilter] = useState("en attente");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Données de démonstration
  const documents: Document[] = [
    {
      id: "doc1",
      type: "RCCM",
      company: "MinéGuinée SA",
      submittedDate: "2025-02-10",
      expiryDate: "2026-06-15",
      status: "en attente",
      fileName: "RCCM_MinéGuinée_2024.pdf",
    },
    {
      id: "doc2",
      type: "NIF",
      company: "TechSolutions GN",
      submittedDate: "2025-02-08",
      expiryDate: "2025-12-31",
      status: "validé",
      fileName: "NIF_TechSolutions.pdf",
    },
    {
      id: "doc3",
      type: "Quitus fiscal",
      company: "Projets Industriels GN",
      submittedDate: "2025-02-05",
      expiryDate: "2025-03-15",
      status: "en attente",
      fileName: "Quitus_Fiscal_2024.pdf",
    },
    {
      id: "doc4",
      type: "CNSS",
      company: "Supply Chain Solutions",
      submittedDate: "2025-01-28",
      expiryDate: "2025-06-30",
      status: "validé",
      fileName: "CNSS_Certificate_2024.pdf",
    },
    {
      id: "doc5",
      type: "RCCM",
      company: "TechSolutions GN",
      submittedDate: "2025-02-01",
      expiryDate: "2024-12-20",
      status: "rejeté",
      fileName: "RCCM_TechSolutions_expired.pdf",
    },
  ];

  const docTypes = ["RCCM", "NIF", "Quitus fiscal", "CNSS", "Licence", "Assurance"];

  const filteredDocs = documents.filter(
    (doc) => statusFilter === "tous" || doc.status === statusFilter
  );

  const getStatusBadge = (status: Document["status"]) => {
    const variants: Record<Document["status"], "default" | "destructive" | "secondary"> = {
      validé: "default",
      "en attente": "secondary",
      rejeté: "destructive",
    };
    const icons: Record<Document["status"], React.ReactNode> = {
      validé: <CheckCircle className="h-3 w-3 mr-1" />,
      "en attente": <Clock className="h-3 w-3 mr-1" />,
      rejeté: <XCircle className="h-3 w-3 mr-1" />,
    };
    return (
      <Badge variant={variants[status]} className="flex items-center w-fit">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const daysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vérification documentaire</h2>
          <p className="text-muted-foreground">Validation des documents soumis par les entreprises</p>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-foreground">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en attente">En attente ({documents.filter(d => d.status === "en attente").length})</SelectItem>
                    <SelectItem value="validé">Validé</SelectItem>
                    <SelectItem value="rejeté">Rejeté</SelectItem>
                    <SelectItem value="tous">Tous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Trier par</label>
                <Select defaultValue="recent">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récents</SelectItem>
                    <SelectItem value="expiry">À expirer bientôt</SelectItem>
                    <SelectItem value="oldest">Plus anciens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertes d'expiration */}
        {documents.some(d => isExpired(d.expiryDate)) && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Documents expirés</p>
                  <p className="text-sm text-muted-foreground">
                    {documents.filter(d => isExpired(d.expiryDate)).length} document(s) ont expiré. Action requise.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents à vérifier ({filteredDocs.length})</CardTitle>
            <CardDescription>Cliquez sur un document pour voir les détails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Entreprise</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Soumis</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Expiration</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Statut</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const daysLeft = daysUntilExpiry(doc.expiryDate);
                    return (
                      <tr key={doc.id} className="border-b border-border hover:bg-muted">
                        <td className="px-4 py-3 font-medium">{doc.type}</td>
                        <td className="px-4 py-3">{doc.company}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(doc.submittedDate).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {new Date(doc.expiryDate).toLocaleDateString("fr-FR")}
                            </span>
                            {daysLeft < 30 && daysLeft >= 0 && (
                              <Badge variant="secondary" className="text-xs">{daysLeft}j</Badge>
                            )}
                            {daysLeft < 0 && (
                              <Badge variant="destructive" className="text-xs">Expiré</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" title="Voir">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </Button>
                            {doc.status === "en attente" && (
                              <>
                                <Button variant="ghost" size="sm" title="Valider">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Rejeter">
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de validation */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">En attente de validation</p>
              <p className="mt-2 text-2xl font-bold text-warning">
                {documents.filter(d => d.status === "en attente").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Documents validés</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === "validé").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Documents rejetés</p>
              <p className="mt-2 text-2xl font-bold text-destructive">
                {documents.filter(d => d.status === "rejeté").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
