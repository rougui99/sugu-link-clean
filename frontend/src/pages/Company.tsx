import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { suppliers, slugify } from "@/lib/suppliers";
import { Mail, Phone, Globe, MapPin, ShieldCheck, Star, MessageSquare, Share2, Download, MessageCircle, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Company = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const company = suppliers.find(s => slugify(s.name) === slug) as any;

  const handleContact = () => {
    if (!user) {
      toast({
        description: "⚠️ Vous devez être connecté pour contacter cette entreprise",
        duration: 2000,
      });
      navigate("/login");
      return;
    }
    toast({
      description: "📧 Email de contact envoyé!",
      duration: 2000,
    });
  };

  const handleQuoteRequest = () => {
    if (!user) {
      toast({
        description: "⚠️ Vous devez être connecté pour demander un devis",
        duration: 2000,
      });
      navigate("/login");
      return;
    }
    toast({
      description: "✅ Votre demande de devis a été envoyée!",
      duration: 2000,
    });
  };

  const handleSave = () => {
    if (!user) {
      toast({
        description: "⚠️ Vous devez être connecté",
        duration: 2000,
      });
      navigate("/login");
      return;
    }
    setIsSaved(!isSaved);
    toast({
      description: isSaved ? "❌ Retiré des favoris" : "⭐ Ajouté aux favoris",
      duration: 2000,
    });
  };

  const handleFollow = () => {
    if (!user) {
      toast({
        description: "⚠️ Vous devez être connecté",
        duration: 2000,
      });
      navigate("/login");
      return;
    }
    setIsFollowing(!isFollowing);
    toast({
      description: isFollowing ? "❌ Suivi annulé" : "✅ Vous suivez maintenant cette entreprise",
      duration: 2000,
    });
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-20">
          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-8 text-center">
            <h2 className="text-xl font-bold">Entreprise introuvable</h2>
            <p className="mt-2 text-muted-foreground">L'entreprise que vous recherchez n'existe pas ou a été supprimée.</p>
            <Button className="mt-4" onClick={() => navigate("/annuaire")}>Retourner à l'annuaire</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="container">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-border bg-white text-6xl">
                {company.logo}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                  {company.verified && (
                    <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
                      <ShieldCheck className="h-4 w-4" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{company.sector}</p>
                <div className="mt-3 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="font-semibold">{company.score}/5</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📅 Depuis {company.foundedYear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{company.employees} employés</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <Button variant="default" size="sm" className="gap-2" onClick={handleContact}>
                <Mail className="h-4 w-4" />
                Contacter
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleQuoteRequest}>
                <MessageSquare className="h-4 w-4" />
                Devis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`gap-2 ${isSaved ? 'bg-yellow-100 text-yellow-700' : ''}`}
                onClick={handleSave}
              >
                ⭐
                {isSaved ? "Sauveg." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* À propos */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">À propos</h2>
              <p className="leading-relaxed text-muted-foreground">{company.about}</p>
            </section>

            {/* Services */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">Services & Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {company.services.map((service: string) => (
                  <Badge key={service} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Certifications & Approvals
                </h2>
                <div className="space-y-2">
                  {company.certifications.map((cert: string) => (
                    <div key={cert} className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Projects */}
            {company.recentProjects && company.recentProjects.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold">Projets Récents</h2>
                <ul className="space-y-3">
                  {company.recentProjects.map((project: string) => (
                    <li key={project} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                      <span className="text-xl">📋</span>
                      <span className="text-sm">{project}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Testimonials */}
            {company.testimonials && company.testimonials.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold">Témoignages</h2>
                <div className="space-y-4">
                  {company.testimonials.map((testimonial: any, index: number) => (
                    <div key={index} className="rounded-lg bg-blue-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - Contact info */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 sticky top-20">
              <h3 className="text-lg font-bold">Informations de Contact</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Adresse</p>
                    <p className="text-sm text-muted-foreground">{company.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <a href={`tel:${company.phone}`} className="text-sm text-primary hover:underline">
                      {company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${company.email}`} className="text-sm text-primary hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Site Web</p>
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <Button 
                  className="w-full gap-2" 
                  onClick={handleContact}
                >
                  <Mail className="h-4 w-4" />
                  Contacter directement
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handleQuoteRequest}
                >
                  <Download className="h-4 w-4" />
                  Demander un devis
                </Button>
              </div>
            </div>

            {/* Stats card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Score de confiance</span>
                  <span className="font-bold">{company.score}/5.0</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Années d'expérience</span>
                  <span className="font-bold">{new Date().getFullYear() - company.foundedYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emplacement</span>
                  <span className="font-bold">{company.location}</span>
                </div>
              </div>
            </div>

            {/* Follow card */}
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Restez informé des dernières actualités</p>
              <Button 
                onClick={handleFollow}
                className={`w-full ${isFollowing ? 'bg-primary' : 'bg-secondary'}`}
              >
                {isFollowing ? '✅ Vous suivez' : '+ Suivre'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Company;
