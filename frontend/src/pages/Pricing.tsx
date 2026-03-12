// src/pages/Pricing.tsx
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom'; // ✅ Ajout de useNavigate
import { Check, X } from 'lucide-react';

interface PlanFeature {
    name: string;
    included: boolean;
}

interface Plan {
    name: string;
    price: string;
    description: string;
    features: PlanFeature[];
    cta: string;
    popular?: boolean;
}

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // ✅ Initialisation de navigate
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // ✅ Plans avec prix en GNF (francs guinéens)
    const plans: Plan[] = [
        {
            name: "Gratuit",
            price: "0 GNF",
            description: "Pour découvrir la plateforme",
            features: [
                { name: "Consultation des offres", included: true },
                { name: "Sauvegarde d'offres (5 max)", included: true },
                { name: "Candidatures (3 par mois)", included: true },
                { name: "Statistiques de base", included: false },
                { name: "Mise en avant du profil", included: false },
                { name: "Support prioritaire", included: false },
            ],
            cta: "Commencer gratuitement"
        },
        {
            name: "Professionnel",
            price: "100 000 GNF/mois",
            description: "Pour les chercheurs d'emploi actifs",
            popular: true,
            features: [
                { name: "Consultation des offres", included: true },
                { name: "Sauvegarde illimitée", included: true },
                { name: "Candidatures illimitées", included: true },
                { name: "Statistiques avancées", included: true },
                { name: "Mise en avant du profil", included: true },
                { name: "Support prioritaire", included: true },
            ],
            cta: "Choisir ce plan"
        },
        {
            name: "Entreprise",
            price: "200 000 GNF/mois",
            description: "Pour les recruteurs et entreprises",
            features: [
                { name: "Publication d'offres (10/mois)", included: true },
                { name: "Recherche de profils", included: true },
                { name: "Statistiques recrutement", included: true },
                { name: "Mise en avant des offres", included: true },
                { name: "Gestion des candidatures", included: true },
                { name: "Support prioritaire 24/7", included: true },
            ],
            cta: "Contacter les ventes"
        }
    ];

    // ✅ Fonction handleSubscribe corrigée
    const handleSubscribe = (planName: string, price: string) => {
        if (!user) {
            // Rediriger vers inscription si non connecté
            navigate(`/signup?plan=${encodeURIComponent(planName)}`);
            return;
        }

        // Logique de paiement à implémenter plus tard
        if (planName === "Entreprise") {
            navigate('/contact', { 
                state: { 
                    subject: "Demande de plan Entreprise",
                    message: `Je suis intéressé par le plan Entreprise à ${price}.` 
                }
            });
        } else {
            navigate('/checkout', {
                state: { plan: planName, price: price }
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-16">
                <div className="mx-auto max-w-6xl">
                    {/* En-tête */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choisissez le plan qui correspond le mieux à vos besoins. Annulation à tout moment.
                        </p>

                        {/* Bascule mensuel/annuel - Gardé mais adapté */}
                        <div className="flex items-center justify-center mt-8 space-x-4">
                            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-bold' : 'text-muted-foreground'}`}>
                                Mensuel
                            </span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={`text-sm ${billingCycle === 'yearly' ? 'font-bold' : 'text-muted-foreground'}`}>
                                Annuel <span className="text-green-600 font-normal">-20%</span>
                            </span>
                        </div>
                    </div>

                    {/* Grille des plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-lg border bg-card p-8 ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Populaire
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-2">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            {feature.included ? (
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? '' : 'text-muted-foreground'}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleSubscribe(plan.name, plan.price)}
                                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                                        }`}
                                    variant={plan.popular ? 'default' : 'outline'}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold mb-8">Questions fréquentes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
                            <div>
                                <h3 className="font-semibold mb-2">Puis-je changer de plan ?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Comment fonctionne l'essai gratuit ?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Le plan gratuit est sans engagement. Vous pouvez passer à un plan payant quand vous voulez.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Quels moyens de paiement ?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Carte bancaire, Orange Money, Wave. (À implémenter)
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Puis-je résilier ?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Oui, résiliation à tout moment depuis votre tableau de bord.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section contact */}
                    <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Besoin d'un plan personnalisé ?</h2>
                        <p className="text-muted-foreground mb-6">
                            Contactez-nous pour une offre adaptée à vos besoins spécifiques.
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/contact">Nous contacter</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;