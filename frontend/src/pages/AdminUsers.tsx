import React, { useState, useEffect } from "react";
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
import { Search, Filter, Eye, Ban, RotateCcw, Loader2 } from "lucide-react";
import axios from "axios";

// Interface pour les données de l'API
interface ApiUser {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  user_type: "professional" | "enterprise" | "admin";
  is_verified: boolean;
  created_at: string;
}

// Interface pour l'affichage
interface DisplayUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  city: string;
  status: "actif" | "suspendu" | "supprimé";
  verified: boolean;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Charger les vrais utilisateurs depuis la base
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("sugu_admin_token");
    
    console.log("🔑 Token:", token);
    
    // ✅ URL COMPLÈTE DU BACKEND
    const response = await axios.get<ApiUser[]>('http://localhost:3000/api/admin/users', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Utilisateurs reçus:", response.data);
    
    const formattedUsers: DisplayUser[] = response.data.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name || ''}`.trim(),
      email: user.email,
      phone: user.phone || 'Non renseigné',
      type: user.user_type === 'professional' ? 'Professionnel' : 'Entreprise',
      city: user.city || 'Non renseigné',
      status: user.is_verified ? 'actif' : 'suspendu',
      verified: user.is_verified
    }));
    
    setUsers(formattedUsers);
  } catch (error) {
    console.error("❌ Erreur chargement utilisateurs:", error);
  } finally {
    setLoading(false);
  }
};

  // Types pour le filtre
  const types = ["Professionnel", "Entreprise"];

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchType = typeFilter === "all" || user.type === typeFilter;
    const matchStatus = statusFilter === "all" || user.status === statusFilter;

    return matchSearch && matchType && matchStatus;
  });

  // Badge de statut
  const getStatusBadge = (status: string) => {
    if (status === "actif") {
      return <Badge className="bg-green-600">Actif</Badge>;
    } else if (status === "suspendu") {
      return <Badge variant="destructive">Suspendu</Badge>;
    } else {
      return <Badge variant="secondary">Supprimé</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les professionnels inscrits</p>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Recherche */}
              <div>
                <label className="text-sm font-medium">Rechercher</label>
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

              {/* Filtre par type */}
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par statut */}
              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton reset */}
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
            <CardDescription>Liste des professionnels inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-semibold">Nom</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Téléphone</th>
                      <th className="px-4 py-2 text-left font-semibold">Type</th>
                      <th className="px-4 py-2 text-left font-semibold">Ville</th>
                      <th className="px-4 py-2 text-left font-semibold">Statut</th>
                      <th className="px-4 py-2 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted">
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.phone}</td>
                          <td className="px-4 py-3">{user.type}</td>
                          <td className="px-4 py-3">{user.city}</td>
                          <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;