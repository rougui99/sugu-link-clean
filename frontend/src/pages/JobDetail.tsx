// src/pages/JobDetail.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { jobListings } from "./OffresEmploi";
import { Building2, MapPin, Calendar, Briefcase, Clock, DollarSign, CheckCircle, Bookmark, BookmarkCheck } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const job = jobListings.find(j => String(j.id) === String(id));

  // Charger les offres sauvegardées
  useEffect(() => {
    if (user?.email) {
      const key = `sugu_saved_${user.email}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const savedJobs = JSON.parse(raw);
          setSaved(savedJobs.includes(Number(id)));
        } catch {
          setSaved(false);
        }
      }
    }
  }, [user, id]);

  // Vérifier si déjà postulé (simulé)
  useEffect(() => {
    if (user?.email) {
      const appliedKey = `sugu_applied_${user.email}`;
      const raw = localStorage.getItem(appliedKey);
      if (raw) {
        try {
          const appliedJobs = JSON.parse(raw);
          setApplied(appliedJobs.includes(Number(id)));
        } catch {
          setApplied(false);
        }
      }
    }
  }, [user, id]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Offre introuvable</h1>
          <p className="text-muted-foreground mb-6">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/offres-emploi')}>
            Voir toutes les offres
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleSave = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const key = `sugu_saved_${user.email}`;
    const raw = localStorage.getItem(key);
    let savedJobs: number[] = [];
    
    if (raw) {
      try {
        savedJobs = JSON.parse(raw);
      } catch {
        savedJobs = [];
      }
    }

    if (saved) {
      savedJobs = savedJobs.filter(jobId => jobId !== Number(id));
    } else {
      savedJobs.push(Number(id));
    }

    localStorage.setItem(key, JSON.stringify(savedJobs));
    setSaved(!saved);
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (applied) {
      return;
    }

    // Simuler une candidature
    const appliedKey = `sugu_applied_${user.email}`;
    const raw = localStorage.getItem(appliedKey);
    let appliedJobs: number[] = [];
    
    if (raw) {
      try {
        appliedJobs = JSON.parse(raw);
      } catch {
        appliedJobs = [];
      }
    }

    appliedJobs.push(Number(id));
    localStorage.setItem(appliedKey, JSON.stringify(appliedJobs));
    setApplied(true);

    // Optionnel : Afficher une notification
    alert("Votre candidature a été envoyée avec succès !");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mx-auto max-w-4xl">
          {/* Fil d'Ariane */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/offres-emploi" className="hover:text-blue-600">Offres d'emploi</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">{job.title}</span>
          </div>

          {/* Carte principale */}
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            {/* En-tête */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSave}
                className={saved ? 'text-blue-600 border-blue-600' : ''}
              >
                {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </Button>
            </div>

            {/* Tags / Informations rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Type
                </p>
                <p className="font-medium">{job.type || "CDI"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Salaire
                </p>
                <p className="font-medium">{job.salary || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Publiée le
                </p>
                <p className="font-medium">{job.postedAt || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Expire le
                </p>
                <p className="font-medium">{job.expiresAt || "N/A"}</p>
              </div>
            </div>

            {/* Description complète */}
            <div className="prose prose-sm max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4">Description du poste</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {job.fullDescription || job.description}
              </div>
            </div>

            {/* Missions */}
            {job.responsibilities && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Missions</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profil recherché */}
            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Profil recherché</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {job.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avantages */}
            {job.benefits && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Avantages</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {job.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bouton de candidature */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              {applied ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Vous avez déjà postulé</span>
                </div>
              ) : (
                <Button 
                  onClick={handleApply}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {user ? "Postuler maintenant" : "Se connecter pour postuler"}
                </Button>
              )}
            </div>
          </div>

          {/* Section "Offres similaires" */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Offres similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobListings
                .filter(j => j.id !== job.id && j.company === job.company)
                .slice(0, 2)
                .map(similarJob => (
                  <Link
                    key={similarJob.id}
                    to={`/jobs/${similarJob.id}`}
                    className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold mb-1">{similarJob.title}</h3>
                    <p className="text-sm text-muted-foreground">{similarJob.location}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;