// src/pages/Dashboard.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    const key = `sugu_saved_${user.email}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        setSaved([]);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Carte de bienvenue */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-2xl font-bold mb-2">Tableau de bord</h2>
            <p className="text-muted-foreground">
              Bienvenue, <span className="font-medium text-foreground">
                {user.first_name || user.email}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Type de compte : <span className="capitalize">
                {user.user_type === 'professional' ? 'Professionnel' :
                  user.user_type === 'enterprise' ? 'Entreprise' :
                    user.user_type || 'Non spécifié'}
              </span>
            </p>
          </div>

          {/* Offres sauvegardées */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Offres sauvegardées</h3>
            {saved.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas encore sauvegardé d'offres.{" "}
                <Link to="/offres-emploi" className="text-blue-600 hover:underline">
                  Rechercher des offres
                </Link>
              </p>
            ) : (
              <ul className="space-y-3">
                {saved.map((id) => (
                  <li key={id} className="rounded border p-4 flex justify-between items-center">
                    <span>Offre #{id}</span>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/jobs/${id}`}>Voir</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newSaved = saved.filter(savedId => savedId !== id);
                          setSaved(newSaved);
                          localStorage.setItem(`sugu_saved_${user.email}`, JSON.stringify(newSaved));
                        }}
                      >
                        Retirer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ Actions rapides - Version corrigée SANS /ia */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button asChild variant="default">
                <Link to="/profile">Modifier mon profil</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/offres-emploi">Rechercher des offres</Link>
              </Button>
              {/* ✅ SUPPRIMÉ: Bouton Analyses IA */}
              <Button asChild variant="outline">
                <Link to="/tarifs">Voir les tarifs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/documents">📄 Mes documents</Link>
              </Button>
              {user.user_type === 'enterprise' && (
                <Button asChild variant="outline">
                  <Link to="/post-job">Publier une offre</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              {user.phone && (
                <div>
                  <dt className="text-muted-foreground">Téléphone</dt>
                  <dd className="font-medium">{user.phone}</dd>
                </div>
              )}
              {user.city && (
                <div>
                  <dt className="text-muted-foreground">Ville</dt>
                  <dd className="font-medium">{user.city}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;