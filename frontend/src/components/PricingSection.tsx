import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "PME Starter",
    price: "Gratuit",
    period: "",
    description: "Pour démarrer votre visibilité",
    features: [
      "Profil de base",
      "Apparaître dans l'annuaire",
      "1 secteur d'activité",
      "Notifications basiques",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "PME Pro",
    price: "150 000",
    period: "GNF/mois",
    description: "Pour maximiser vos opportunités",
    features: [
      "Profil vérifié avec badge",
      "Secteurs illimités",
      "Alertes appels d'offres",
      "Score fournisseur visible",
      "Support prioritaire",
    ],
    cta: "S'abonner",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Pour les grands groupes et sous-traitants",
    features: [
      "Accès annuaire complet",
      "Publication appels d'offres",
      "Shortlists & comparatifs",
      "Suivi performance fournisseur",
      "Pré-qualification & audit",
      "API & intégrations",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="bg-muted/50 py-20" id="tarifs">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-secondary-foreground">
            Tarifs
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Un plan pour chaque besoin
          </h2>
          <p className="text-muted-foreground">
            Des formules adaptées aux PME et aux grands donneurs d'ordres.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 transition-all ${
                plan.popular
                  ? "border-secondary shadow-gold scale-105"
                  : "border-border shadow-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-bold text-secondary-foreground">
                  Populaire
                </span>
              )}
              <h3 className="mb-1 font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mb-6">
                <span className="font-display text-3xl font-extrabold text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="ml-1 text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "hero" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
