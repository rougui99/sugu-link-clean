import { Search, ShieldCheck, FileText, Star, Bell, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Annuaire structuré",
    description: "Trouvez des PME par secteur, zone géographique et compétences spécifiques.",
    forWho: "Grands groupes",
  },
  {
    icon: ShieldCheck,
    title: "Vérification documentaire",
    description: "RCCM, NIF, quitus fiscal, CNSS — conformité vérifiée automatiquement.",
    forWho: "Tous",
  },
  {
    icon: FileText,
    title: "Appels d'offres",
    description: "Publiez des besoins, recevez des devis et créez des shortlists qualifiées.",
    forWho: "Grands groupes",
  },
  {
    icon: Star,
    title: "Score fournisseur",
    description: "Système de réputation basé sur les performances et la conformité.",
    forWho: "Tous",
  },
  {
    icon: Bell,
    title: "Notifications ciblées",
    description: "Recevez des alertes sur les opportunités correspondant à votre profil.",
    forWho: "PME",
  },
  {
    icon: Users,
    title: "Profil professionnel",
    description: "Créez un profil visible et attractif pour les donneurs d'ordres.",
    forWho: "PME",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-background py-20" id="fonctionnalites">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Fonctionnalités
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Tout pour le contenu local
          </h2>
          <p className="text-muted-foreground">
            Sugu-Link offre les outils nécessaires aux grands groupes et PME guinéennes
            pour collaborer efficacement.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {feature.forWho}
                </span>
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
