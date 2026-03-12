import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, ShieldCheck, Star, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { suppliers, slugify } from "@/lib/suppliers";

const sectors = [
  "Tous", "BTP", "Transport & Logistique", "Restauration & Catering", 
  "Sécurité", "Nettoyage", "Fournitures industrielles", "Génie civil",
  "Électricité", "Plomberie", "Formation"
];

// suppliers imported from shared lib

const Annuaire = () => {
  const [activeSector, setActiveSector] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter((s) => {
    const matchSector = activeSector === "Tous" || s.sector === activeSector;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchSector && matchSearch;
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground">
            Annuaire des fournisseurs
          </h1>
          <p className="mb-6 text-primary-foreground/70">
            Trouvez des PME guinéennes qualifiées par secteur et zone géographique.
          </p>

          <div className="flex overflow-hidden rounded-xl bg-primary-foreground/10 backdrop-blur-md">
            <Search className="m-4 h-5 w-5 text-primary-foreground/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, service..."
              className="flex-1 bg-transparent py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
            />
            <Button variant="hero" className="m-1.5">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Sector filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeSector === sector
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} fournisseur{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </p>

        {/* Supplier cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((supplier) => (
            <button
              key={supplier.name}
              onClick={() => navigate(`/company/${slugify(supplier.name)}`)}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1 text-left cursor-pointer"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {supplier.name}
                    </h3>
                    {supplier.verified && (
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{supplier.sector}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-1">
                  <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                  <span className="text-sm font-semibold text-secondary-foreground">{supplier.score}</span>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {supplier.description}
              </p>

              <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {supplier.location}
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {supplier.services.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" className="w-full" size="sm" onClick={(e) => {
                e.stopPropagation();
                navigate(`/company/${slugify(supplier.name)}`);
              }}>
                Voir le profil
              </Button>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Annuaire;
