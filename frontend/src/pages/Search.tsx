// src/pages/Search.tsx
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  description: string;
  postedAt: string;
}

const Search = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Charger les offres sauvegardées
  useEffect(() => {
    if (user?.email) {
      const key = `sugu_saved_${user.email}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          setSavedJobs(JSON.parse(raw));
        } catch {
          setSavedJobs([]);
        }
      }
    }
  }, [user]);

  // Fonction de recherche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Pour l'instant, utilisons des données mockées
      // Plus tard, vous remplacerez par un vrai appel API
      setTimeout(() => {
        const mockJobs: Job[] = [
          {
            id: 1,
            title: "Développeur Full Stack React/Node.js",
            company: "Tech Solutions",
            location: "Dakar, Sénégal",
            salary: "400 000 - 600 000 FCFA",
            type: "CDI",
            description: "Nous recherchons un développeur Full Stack passionné...",
            postedAt: "2024-03-01"
          },
          {
            id: 2,
            title: "Ingénieur DevOps",
            company: "Cloud Services",
            location: "Dakar, Sénégal",
            salary: "500 000 - 700 000 FCFA",
            type: "CDI",
            description: "Gestion de l'infrastructure cloud et déploiement continu...",
            postedAt: "2024-02-28"
          },
          {
            id: 3,
            title: "UI/UX Designer",
            company: "Design Studio",
            location: "Remote",
            salary: "300 000 - 450 000 FCFA",
            type: "Freelance",
            description: "Création d'interfaces utilisateur modernes et intuitives...",
            postedAt: "2024-02-27"
          },
          {
            id: 4,
            title: "Chef de projet digital",
            company: "Agence Web",
            location: "Dakar, Sénégal",
            salary: "600 000 - 800 000 FCFA",
            type: "CDI",
            description: "Management d'équipes projets et relation client...",
            postedAt: "2024-02-26"
          },
          {
            id: 5,
            title: "Community Manager",
            company: "Social Media Agency",
            location: "Dakar, Sénégal",
            salary: "200 000 - 300 000 FCFA",
            type: "Stage",
            description: "Gestion des réseaux sociaux et création de contenu...",
            postedAt: "2024-02-25"
          }
        ].filter(job => 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (location === '' || job.location.toLowerCase().includes(location.toLowerCase())) &&
          (contractType === '' || job.type === contractType)
        );
        
        setJobs(mockJobs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setLoading(false);
    }
  };

  // Sauvegarder/Retirer une offre
  const toggleSaveJob = (jobId: number) => {
    if (!user?.email) return;
    
    const key = `sugu_saved_${user.email}`;
    let newSaved: number[];
    
    if (savedJobs.includes(jobId)) {
      newSaved = savedJobs.filter(id => id !== jobId);
    } else {
      newSaved = [...savedJobs, jobId];
    }
    
    setSavedJobs(newSaved);
    localStorage.setItem(key, JSON.stringify(newSaved));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Rechercher des offres</h1>
          
          {/* Formulaire de recherche */}
          <form onSubmit={handleSearch} className="bg-card rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mot-clé</label>
                <Input
                  type="text"
                  placeholder="Titre, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Localisation</label>
                <Input
                  type="text"
                  placeholder="Ville, pays..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type de contrat</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Tous</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </div>
          </form>

          {/* Résultats */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <p className="text-muted-foreground">Aucune offre trouvée</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {jobs.length} offre(s) trouvée(s)
                </p>
                {jobs.map((job) => (
                  <div key={job.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2">
                          <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
                            {job.title}
                          </Link>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Entreprise:</span>
                            <p className="font-medium">{job.company}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Localisation:</span>
                            <p className="font-medium">{job.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Salaire:</span>
                            <p className="font-medium">{job.salary || 'Non spécifié'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{job.type}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Publiée le {new Date(job.postedAt).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/jobs/${job.id}`}>Voir l'offre</Link>
                            </Button>
                            <Button 
                              size="sm" 
                              variant={savedJobs.includes(job.id) ? "default" : "outline"}
                              onClick={() => toggleSaveJob(job.id)}
                            >
                              {savedJobs.includes(job.id) ? '✓ Sauvegardée' : 'Sauvegarder'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;