import { Building2, ShieldCheck, FileText, Star } from "lucide-react";

const stats = [
  { value: "500+", label: "PME référencées", icon: Building2 },
  { value: "85%", label: "Taux de vérification", icon: ShieldCheck },
  { value: "120+", label: "Appels d'offres actifs", icon: FileText },
  { value: "4.8", label: "Score moyen fournisseur", icon: Star },
];

const StatsSection = () => {
  return (
    <section className="border-b border-border bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center animate-count-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <stat.icon className="mb-3 h-8 w-8 text-secondary" />
              <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
