import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Calendar, MapPin, DollarSign, Clock, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categories = [
  "Tous", "BTP", "Transport & Logistique", "Restauration", 
  "Sécurité", "Nettoyage", "Fournitures", "Génie civil",
  "Électricité", "Plomberie", "Maintenance"
];

export const callsForTender = [
  {
    id: 1,
    title: "Construction de route d'accès - projet minier",
    category: "BTP",
    company: "MinéGuinée SA",
    location: "Boké, Guinée",
    budget: "2.5M USD",
    deadline: "2024-03-15",
    posted: "2024-02-10",
    status: "Ouvert",
    description: "Appel d'offres pour la construction d'une route d'accès de 45 km vers le site d'exploitation minière.",
    requirements: [
      "Expérience minimum 5 ans en BTP",
      "Certification ISO 9001",
      "Équipement disponible pour génie civil"
    ],
    contact: "tender@mineguinee.gn"
  },
  {
    id: 2,
    title: "Fourniture et logistique de matériel - 200 tonnes",
    category: "Transport & Logistique",
    company: "TradeGN Inc",
    location: "Conakry, Guinée",
    budget: "450K USD",
    deadline: "2024-03-20",
    posted: "2024-02-12",
    status: "Ouvert",
    description: "Transport et fourniture de 200 tonnes de matériel industriel depuis Conakry vers Boké.",
    requirements: [
      "Flotte de 5+ camions maximum 5 ans",
      "Licence transport actuelle",
      "Assurance responsabilité civile"
    ],
    contact: "logistics@tradegn.com"
  },
  {
    id: 3,
    title: "Services de catering pour 500 personnes - 6 mois",
    category: "Restauration",
    company: "ProjetsIndustriels GN",
    location: "Kindia, Guinée",
    budget: "180K USD",
    deadline: "2024-03-10",
    posted: "2024-02-08",
    status: "Urgent",
    description: "Services de restauration complète pour projet industriel avec 500 employés sur 6 mois.",
    requirements: [
      "Certification hygiène alimentaire",
      "Capacité 500+ repas par jour",
      "Emploi minimum 15 cuisiniers"
    ],
    contact: "catering@projetsgn.com"
  },
  {
    id: 4,
    title: "Gardiennage et sécurité - Site minier 24/7",
    category: "Sécurité",
    company: "MinéGuinée SA",
    location: "Boké, Guinée",
    budget: "1.2M USD",
    deadline: "2024-03-25",
    posted: "2024-02-14",
    status: "Ouvert",
    description: "Services de sécurité 24/7 pour site d'exploitation minière - effectif 50 gardiens.",
    requirements: [
      "Agrément gouvernemental sécurité",
      "Personnel formé tactique et sécurité",
      "Équipements surveillance (caméras, radios)"
    ],
    contact: "security@mineguinee.gn"
  },
  {
    id: 5,
    title: "Nettoyage industriel mensuel - 3 années",
    category: "Nettoyage",
    company: "MégaIndustrie Guinée",
    location: "Coyah, Guinée",
    budget: "360K USD",
    deadline: "2024-03-18",
    posted: "2024-02-11",
    status: "Ouvert",
    description: "Contrat de nettoyage industriel mensuel avec décontamination pour usine de transformation.",
    requirements: [
      "Expérience nettoyage industriel minimum 3 ans",
      "Certification environnementale",
      "Équipement décontamination complet"
    ],
    contact: "maintenance@megaindustrie.gn"
  },
  {
    id: 6,
    title: "Installation électrique - Sous-station 110kV",
    category: "Électricité",
    company: "ÉnergieGN",
    location: "Dubréka, Guinée",
    budget: "800K USD",
    deadline: "2024-04-01",
    posted: "2024-02-13",
    status: "Ouvert",
    description: "Installation complète d'une sous-station électrique 110kV avec tous équipements et tests.",
    requirements: [
      "Certification haute tension obligatoire",
      "Expérience 7+ ans installations électriques",
      "Assurance grand travaux"
    ],
    contact: "projects@energiegn.gn"
  }
];

const AppelOffres = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const filtered = callsForTender.filter((call) => {
    const matchCategory = activeCategory === "Tous" || call.category === activeCategory;
    const matchSearch = call.title.toLowerCase().includes(search.toLowerCase()) ||
      call.company.toLowerCase().includes(search.toLowerCase()) ||
      call.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tous" || call.status === statusFilter;
    return matchCategory && matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Ouvert":
        return "bg-green-100 text-green-800";
      case "Fermé":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-white">
            Appels d'offres
          </h1>
          <p className="mb-6 text-blue-100">
            Découvrez les opportunités de contrats auprès des plus grandes entreprises de Guinée.
          </p>

          <div className="flex overflow-hidden rounded-xl bg-white/10 backdrop-blur-md">
            <Search className="m-4 h-5 w-5 text-white/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un appel d'offres, une entreprise..."
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/50 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-white py-6">
        <div className="container">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Catégories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Statut</span>
          </div>
          <div className="mt-2 flex gap-2">
            {["Tous", "Urgent", "Ouvert"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="border-b bg-white py-3">
        <div className="container text-sm text-gray-600">
          {filtered.length} appel{filtered.length > 1 ? "s" : ""} d'offre{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </div>
      </section>

      {/* Call List */}
      <section className="bg-white py-8">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Aucun appel d'offres ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((call) => (
                <div key={call.id} className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 font-display text-lg font-bold text-gray-900">
                        {call.title}
                      </h3>
                      <p className="text-sm text-gray-600">{call.company}</p>
                    </div>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                  </div>

                  <p className="mb-4 text-gray-700">{call.description}</p>

                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{call.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">{call.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-gray-600">Avant {formatDate(call.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Publié {formatDate(call.posted)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">Critères requis:</p>
                    <ul className="space-y-1">
                      {call.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600">• {req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-600">
                      Contact: <span className="font-semibold">{call.contact}</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = `/tenders/${call.id}`}>
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            Vous êtes intéressé?
          </h2>
          <p className="mb-6 text-blue-100">
            Consultez les détails complets et soumettez votre candidature dès maintenant.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Parcourir les offres
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppelOffres;
