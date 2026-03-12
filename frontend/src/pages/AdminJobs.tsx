import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Trash2, AlertTriangle, Ban } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  company: string;
  category: string;
  status: "en ligne" | "brouillon" | "expirée" | "supprimée";
  postedDate: string;
  expiryDate: string;
  applicants: number;
  flagged: boolean;
}

const AdminJobs = () => {
  const [statusFilter, setStatusFilter] = useState("en ligne");

  const jobs: JobListing[] = [
    {
      id: "job1",
      title: "Ingénieur minier - Exploitation de bauxite",
      company: "MinéGuinée SA",
      category: "Ingénierie",
      status: "en ligne",
      postedDate: "2025-02-05",
      expiryDate: "2025-03-15",
      applicants: 45,
      flagged: false,
    },
    {
      id: "job2",
      title: "Chef de projet BTP",
      company: "Projets Industriels GN",
      category: "Gestion de projet",
      status: "en ligne",
      postedDate: "2025-02-01",
      expiryDate: "2025-03-01",
      applicants: 28,
      flagged: true,
    },
    {
      id: "job3",
      title: "Développeur React/Node.js",
      company: "TechSolutions GN",
      category: "IT/Informatique",
      status: "en ligne",
      postedDate: "2025-01-20",
      expiryDate: "2025-02-20",
      applicants: 67,
      flagged: false,
    },
  ];

  const filteredJobs = jobs.filter((job) => statusFilter === "tous" || job.status === statusFilter);

  const getStatusBadge = (status: JobListing["status"]) => {
    const variants: Record<JobListing["status"], "default" | "secondary" | "destructive"> = {
      "en ligne": "default",
      brouillon: "secondary",
      expirée: "destructive",
      supprimée: "destructive",
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des offres d'emploi</h2>
          <p className="text-muted-foreground">Modération et gestion des offres publiées</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en ligne">En ligne</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="expirée">Expirée</SelectItem>
                  <SelectItem value="supprimée">Supprimée</SelectItem>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offres d'emploi ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Titre</th>
                    <th className="px-4 py-2 text-left font-semibold">Entreprise</th>
                    <th className="px-4 py-2 text-left font-semibold">Catégorie</th>
                    <th className="px-4 py-2 text-center font-semibold">Candidatures</th>
                    <th className="px-4 py-2 text-left font-semibold">Statut</th>
                    <th className="px-4 py-2 text-left font-semibold">Expiration</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b border-border hover:bg-muted">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          {job.flagged && <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />}
                          <span className="font-medium">{job.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{job.company}</td>
                      <td className="px-4 py-3">{job.category}</td>
                      <td className="px-4 py-3 text-center">{job.applicants}</td>
                      <td className="px-4 py-3">{getStatusBadge(job.status)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(job.expiryDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          <Button variant="ghost" size="sm"><Ban className="h-4 w-4 text-warning" /></Button>
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

export default AdminJobs;
