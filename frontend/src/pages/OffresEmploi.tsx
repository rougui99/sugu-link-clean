// src/pages/OffresEmploi.tsx
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, X } from 'lucide-react';

// Interface complète pour les offres d'emploi
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedAt: string;
  expiresAt?: string;
  description: string;
  fullDescription?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  category?: string;
  logo?: string;
}

// Données mockées enrichies
export const jobListings: Job[] = [
  {
    id: 1,
    title: "Développeur Full Stack React/Node.js",
    company: "Tech Solutions Sénégal",
    location: "Dakar, Sénégal",
    type: "CDI",
    salary: "400 000 - 600 000 FCFA",
    postedAt: "2024-03-01",
    expiresAt: "2024-04-01",
    category: "Développement",
    description: "Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe dynamique.",
    fullDescription: "Au sein de notre équipe technique, vous serez responsable du développement et de la maintenance de nos applications web.",
    responsibilities: [
      "Développer des applications web responsive avec React et Node.js",
      "Participer à la conception technique",
      "Assurer la qualité du code"
    ],
    requirements: [
      "3+ ans d'expérience en développement web",
      "Maîtrise de React, Node.js et TypeScript",
      "Expérience avec Git"
    ],
    benefits: [
      "Travail à distance possible",
      "Mutuelle prise en charge",
      "Formation continue"
    ]
  },
  {
    id: 2,
    title: "Ingénieur DevOps",
    company: "Cloud Services Africa",
    location: "Dakar, Sénégal",
    type: "CDI",
    salary: "500 000 - 700 000 FCFA",
    postedAt: "2024-02-28",
    expiresAt: "2024-03-28",
    category: "Infrastructure",
    description: "Gestion de l'infrastructure cloud et automatisation des déploiements.",
    fullDescription: "Nous cherchons un ingénieur DevOps pour renforcer notre équipe infrastructure.",
    responsibilities: [
      "Gérer l'infrastructure cloud (AWS/Azure)",
      "Automatiser les déploiements avec CI/CD",
      "Mettre en place la supervision"
    ],
    requirements: [
      "2+ ans d'expérience en DevOps",
      "Maîtrise de Docker et Kubernetes",
      "Bonne connaissance Linux"
    ],
    benefits: [
      "Télétravail flexible",
      "Budget formation",
      "Matériel haut de gamme"
    ]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio Dakar",
    location: "Remote",
    type: "Freelance",
    salary: "300 000 - 450 000 FCFA",
    postedAt: "2024-02-27",
    expiresAt: "2024-03-15",
    category: "Design",
    description: "Création d'interfaces utilisateur modernes et intuitives.",
    fullDescription: "Nous recherchons un designer UI/UX talentueux pour des missions freelance.",
    responsibilities: [
      "Concevoir des interfaces utilisateur intuitives",
      "Réaliser des maquettes et prototypes",
      "Mener des tests utilisateurs"
    ],
    requirements: [
      "Portfolio de projets UI/UX",
      "Maîtrise de Figma et Adobe XD",
      "Sens de l'esthétique"
    ],
    benefits: [
      "Missions variées",
      "Horaires flexibles",
      "Travail 100% remote"
    ]
  },
  {
    id: 4,
    title: "Chef de projet digital",
    company: "Agence Web Sénégal",
    location: "Dakar, Sénégal",
    type: "CDI",
    salary: "600 000 - 800 000 FCFA",
    postedAt: "2024-02-26",
    expiresAt: "2024-03-26",
    category: "Management",
    description: "Management d'équipes projets et relation client.",
    fullDescription: "Nous recrutons un chef de projet digital pour piloter nos projets web et mobile.",
    responsibilities: [
      "Cadrer les besoins clients",
      "Planifier l'avancement des projets",
      "Assurer la qualité des livrables"
    ],
    requirements: [
      "3+ ans en gestion de projet digital",
      "Connaissance des méthodologies agiles",
      "Excellente communication"
    ],
    benefits: [
      "Participation aux bénéfices",
      "Tickets restaurant",
      "Évolution de carrière"
    ]
  }
];

const OffresEmploi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // ✅ Logique de filtrage améliorée
  const filteredJobs = useMemo(() => {
    return jobListings.filter(job => {
      // Recherche textuelle (titre, entreprise, description, catégorie)
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre par type de contrat
      const matchesType = selectedType === "" || job.type === selectedType;
      
      // Filtre par localisation
      const matchesLocation = selectedLocation === "" || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [searchTerm, selectedType, selectedLocation]);

  // Extraire les types uniques pour le filtre
  const jobTypes = [...new Set(jobListings.map(job => job.type))];

  // Compter les résultats
  const resultsCount = filteredJobs.length;

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedLocation("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Offres d'emploi</h1>
          <p className="text-muted-foreground">
            {resultsCount} offre{resultsCount > 1 ? 's' : ''} trouvée{resultsCount > 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Filtres */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Titre, entreprise, mot-clé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtre par type */}
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Tous les types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            {/* Filtre par localisation */}
            <Input
              placeholder="Localisation..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
            
            {/* Bouton reset */}
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block p-6 rounded-lg border bg-card hover:shadow-md transition-all hover:border-blue-200 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h2>
                      {job.category && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {job.category}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {job.company} — {job.location}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block mb-2">
                      {new Date(job.postedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {job.expiresAt ? `Expire le ${new Date(job.expiresAt).toLocaleDateString('fr-FR')}` : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-lg text-muted-foreground mb-2">Aucune offre trouvée</p>
              <p className="text-sm text-muted-foreground mb-4">
                Essayez de modifier vos filtres de recherche
              </p>
              <Button onClick={resetFilters} variant="outline">
                Voir toutes les offres
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OffresEmploi;