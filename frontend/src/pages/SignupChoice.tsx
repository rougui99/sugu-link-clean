import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SignupChoice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-20">
        <div className="mx-auto max-w-xl space-y-6">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold">Je suis un Professionnel</h2>
              <p className="mb-4 text-sm text-muted-foreground">Pour trouver un emploi, stage ou mission</p>
              <Link to="/signup/professional">
                <Button>Je suis un Professionnel</Button>
              </Link>
            </div>
            <div className="rounded-lg border p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold">Je suis une Entreprise</h2>
              <p className="mb-4 text-sm text-muted-foreground">Pour recruter, publier des offres, ou trouver des fournisseurs</p>
              <Link to="/signup/enterprise">
                <Button>Je suis une Entreprise</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupChoice;
