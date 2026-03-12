// src/components/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Site minier en Guinée" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-dark opacity-80" />
        <div className="absolute inset-0 bg-gradient-hero opacity-40" />
      </div>

      <div className="container relative z-10 flex flex-col items-center py-24 text-center lg:py-36">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light animate-fade-in">
          🇬🇳 Plateforme B2B — Contenu Local Guinée
        </span>

        <h1 className="mb-6 max-w-4xl font-display text-4xl font-extrabold leading-tight text-primary-foreground animate-fade-in-up md:text-5xl lg:text-6xl">
          Connectez les grands projets aux{" "}
          <span className="text-gradient-gold">PME guinéennes vérifiées</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-primary-foreground/70 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Sugu-Link centralise l'annuaire des fournisseurs locaux, la vérification documentaire
          et les appels d'offres pour accélérer la conformité au contenu local.
        </p>

        {/* Search bar */}
        <div className="mb-8 w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-md">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un fournisseur, secteur, service..."
              className="flex-1 bg-transparent px-5 py-4 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
            />
            <Button variant="hero" size="lg" className="m-1.5 rounded-lg" onClick={() => navigate(`/annuaire?q=${encodeURIComponent(q)}`)}>
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-primary-foreground/50 animate-fade-in" style={{ animationDelay: "0.45s" }}>
          <span>Populaire :</span>
          {["BTP", "Transport", "Restauration", "Sécurité", "Nettoyage"].map((tag) => (
            <span
              key={tag}
              className="cursor-pointer rounded-full border border-primary-foreground/10 px-3 py-1 transition-colors hover:border-gold/40 hover:text-gold-light"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;