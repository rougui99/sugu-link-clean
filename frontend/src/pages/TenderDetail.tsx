import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { callsForTender } from "./AppelOffres";

const TenderDetail = () => {
  const { id } = useParams();
  const tender = callsForTender.find(t => String(t.id) === String(id));

  if (!tender) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-20">Appel d'offres introuvable.</main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8">
          <h1 className="text-2xl font-bold">{tender.title}</h1>
          <p className="text-sm text-muted-foreground">{tender.company} — {tender.location}</p>
          <div className="mt-4 text-sm text-muted-foreground">{tender.description}</div>
          <div className="mt-6">
            <p className="text-sm">Contact: <strong>{tender.contact}</strong></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenderDetail;
