// src/pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Check, CreditCard, Smartphone, ArrowLeft, Lock } from 'lucide-react';

interface LocationState {
  plan: string;
  price: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'orange' | 'wave'>('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Rediriger si pas de plan sélectionné
  useEffect(() => {
    if (!state?.plan) {
      navigate('/tarifs');
    }
  }, [state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simuler un traitement de paiement
    setTimeout(() => {
      setProcessing(false);
      navigate('/payment-success', {
        state: { plan: state.plan, price: state.price }
      });
    }, 2000);
  };

  if (!state?.plan) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-4xl">
          {/* Bouton retour */}
          <button
            onClick={() => navigate('/tarifs')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux tarifs
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Formulaire de paiement */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg border p-6">
                <h1 className="text-2xl font-bold mb-6">Finaliser votre abonnement</h1>
                
                {/* Méthodes de paiement */}
                <div className="mb-6">
                  <h2 className="font-semibold mb-3">Méthode de paiement</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition ${
                        paymentMethod === 'card' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-blue-600' : ''}`} />
                      <span className="text-sm">Carte bancaire</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('orange')}
                      className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition ${
                        paymentMethod === 'orange' 
                          ? 'border-orange-600 bg-orange-50' 
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <Smartphone className={`h-6 w-6 ${paymentMethod === 'orange' ? 'text-orange-600' : ''}`} />
                      <span className="text-sm">Orange Money</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wave')}
                      className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition ${
                        paymentMethod === 'wave' 
                          ? 'border-green-600 bg-green-50' 
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <Smartphone className={`h-6 w-6 ${paymentMethod === 'wave' ? 'text-green-600' : ''}`} />
                      <span className="text-sm">Wave</span>
                    </button>
                  </div>
                </div>

                {/* Formulaire selon la méthode */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+224 6XX XXX XXX"
                    />
                  </div>

                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Numéro de carte</label>
                        <Input
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date d'expiration</label>
                          <Input
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <Input
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            placeholder="123"
                            type="password"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={processing}
                  >
                    {processing ? (
                      <>Traitement en cours...</>
                    ) : (
                      <>Payer {state.price}</>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Paiement sécurisé - Vos informations sont cryptées
                  </p>
                </form>
              </div>
            </div>

            {/* Récapitulatif de la commande */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg border p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Récapitulatif</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{state.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix</span>
                    <span className="font-medium">{state.price}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{state.price}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-800 flex items-start gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>
                      En cliquant sur payer, vous acceptez nos conditions d'utilisation et vous vous engagez à payer le montant indiqué.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;