import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  city: string;
  verified: boolean;
  employees: string;
  created: string;
}

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("tous");

  const companies: Company[] = [
    {
      id: "comp1",
      name: "Tech Guinée SA",
      email: "contact@techguinee.com",
      phone: "+224 622 12 34 56",
      sector: "Technologies",
      city: "Conakry",
      verified: true,
      employees: "45",
      created: "2024-05-10",
    },
    {
      id: "comp2",
      name: "Mines Guinée SARL",
      email: "info@minesguinee.com",
      phone: "+224 633 45 67 89",
      sector: "Mines",
      city: "Boké",
      verified: true,
      employees: "120",
      created: "2023-11-20",
    },
    {
      id: "comp3",
      name: "Agri Solutions",
      email: "contact@agrisolutions.com",
      phone: "+224 655 78 90 12",
      sector: "Agriculture",
      city: "Kindia",
      verified: false,
      employees: "15",
      created: "2025-01-05",
    },
    {
      id: "comp4",
      name: "Build Construction",
      email: "info@buildconst.com",
      phone: "+224 677 89 01 23",
      sector: "BTP",
      city: "Conakry",
      verified: false,
      employees: "78",
      created: "2024-08-15",
    },
  ];

  const sectors = ["Technologies", "Mines", "Agriculture", "BTP", "Transport", "Énergie"];

  const filteredCompanies = companies.filter((company) => {
    const matchSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchSector = sectorFilter === "all" || company.sector === sectorFilter;
    
    const matchVerified = 
      verifiedFilter === "tous" || 
      (verifiedFilter === "vérifiée" && company.verified) ||
      (verifiedFilter === "non vérifiée" && !company.verified);

    return matchSearch && matchSector && matchVerified;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des entreprises</h2>
          <p className="text-muted-foreground">Gérez les entreprises inscrites sur la plateforme</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-foreground">Rechercher</label>
                <div className="relative mt-1">
                  <Input
                    placeholder="Nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Secteur</label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Statut vérification</label>
                <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes</SelectItem>
                    <SelectItem value="vérifiée">Vérifiée</SelectItem>
                    <SelectItem value="non vérifiée">Non vérifiée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchTerm("");
                  setSectorFilter("all");
                  setVerifiedFilter("tous");
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entreprises ({filteredCompanies.length})</CardTitle>
            <CardDescription>Liste de toutes les entreprises inscrites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Entreprise</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Téléphone</th>
                    <th className="px-4 py-2 text-left font-semibold">Secteur</th>
                    <th className="px-4 py-2 text-left font-semibold">Ville</th>
                    <th className="px-4 py-2 text-left font-semibold">Vérification</th>
                    <th className="px-4 py-2 text-left font-semibold">Employés</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="border-b border-border hover:bg-muted">
                      <td className="px-4 py-3 font-medium">{company.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{company.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{company.phone}</td>
                      <td className="px-4 py-3">{company.sector}</td>
                      <td className="px-4 py-3">{company.city}</td>
                      <td className="px-4 py-3">
                        {company.verified ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifiée
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            En attente
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">{company.employees}</td>
                      <td className="px-4 py-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/admin/companies/${company.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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

export default AdminCompanies;