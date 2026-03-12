// src/pages/PaymentSuccess.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { plan: string; price: string };

  useEffect(() => {
    if (!state?.plan) {
      navigate('/tarifs');
    }
  }, [state, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Paiement réussi !</h1>
          <p className="text-muted-foreground mb-6">
            Merci d'avoir choisi le plan {state?.plan}
          </p>

          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="font-semibold mb-4">Détails de la transaction</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{state?.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-medium">{state?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Aller au tableau de bord
            </Button>
            <Button variant="outline" onClick={() => navigate('/tarifs')} className="w-full">
              Retour aux tarifs
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;