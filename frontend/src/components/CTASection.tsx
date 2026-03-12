import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
          Prêt à rejoindre Sugu-Link ?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-primary-foreground/70">
          Rejoignez des centaines de PME et grands groupes qui utilisent Sugu-Link
          pour le contenu local en Guinée.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {!user ? (
            <>
              <Button variant="hero" size="lg" onClick={() => navigate('/signup/enterprise')}>
                Créer un compte entreprise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate('/signup/professional')}>
                Je suis un professionnel
              </Button>
            </>
          ) : (
            <>
              <Button variant="hero" size="lg" onClick={() => navigate('/annuaire')}>
                Annuaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate('/appels-offres')}>
                Appels d'offres
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
