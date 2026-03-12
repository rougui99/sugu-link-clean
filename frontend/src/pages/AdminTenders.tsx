import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Trash2, Lock } from "lucide-react";

interface Tender {
  id: string;
  title: string;
  buyer: string;
  sector: string;
  status: "actif" | "expiré" | "suspendu";
  postedDate: string;
  deadline: string;
  bids: number;
}

const AdminTenders = () => {
  const [statusFilter, setStatusFilter] = useState("actif");

  const tenders: Tender[] = [
    {
      id: "tender1",
      title: "Fourniture d'équipement minier",
      buyer: "MinéGuinée SA",
      sector: "Exploitation minière",
      status: "actif",
      postedDate: "2025-01-20",
      deadline: "2025-03-20",
      bids: 12,
    },
    {
      id: "tender2",
      title: "Services de logistique",
      buyer: "Import/Export Solutions",
      sector: "Logistique",
      status: "actif",
      postedDate: "2025-02-01",
      deadline: "2025-02-25",
      bids: 8,
    },
    {
      id: "tender3",
      title: "Consulting IT",
      buyer: "Gouvernement",
      sector: "IT/Informatique",
      status: "expiré",
      postedDate: "2024-12-01",
      deadline: "2025-01-31",
      bids: 5,
    },
  ];

  const filteredTenders = tenders.filter(
    (tender) => statusFilter === "tous" || tender.status === statusFilter
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des appels d'offres</h2>
          <p className="text-muted-foreground">Modération des appels d'offres B2B</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="expiré">Expiré</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
                <SelectItem value="tous">Tous</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appels d'offres ({filteredTenders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Titre</th>
                    <th className="px-4 py-2 text-left font-semibold">Acheteur</th>
                    <th className="px-4 py-2 text-left font-semibold">Secteur</th>
                    <th className="px-4 py-2 text-center font-semibold">Offres</th>
                    <th className="px-4 py-2 text-left font-semibold">Statut</th>
                    <th className="px-4 py-2 text-left font-semibold">Deadline</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenders.map((tender) => (
                    <tr key={tender.id} className="border-b border-border hover:bg-muted">
                      <td className="px-4 py-3 font-medium">{tender.title}</td>
                      <td className="px-4 py-3">{tender.buyer}</td>
                      <td className="px-4 py-3">{tender.sector}</td>
                      <td className="px-4 py-3 text-center">{tender.bids}</td>
                      <td className="px-4 py-3">
                        <Badge variant={tender.status === "actif" ? "default" : "secondary"}>
                          {tender.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(tender.deadline).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button className="p-2 hover:bg-muted rounded"><Eye className="h-4 w-4" /></button>
                        <button className="p-2 hover:bg-muted rounded"><Trash2 className="h-4 w-4 text-destructive" /></button>
                        <button className="p-2 hover:bg-muted rounded"><Lock className="h-4 w-4 text-warning" /></button>
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

export default AdminTenders;
