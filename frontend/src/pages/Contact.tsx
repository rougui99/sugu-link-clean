// src/pages/Contact.tsx
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu peux ajouter la logique d'envoi d'email
    console.log('Message envoyé:', formData);
    alert('Message envoyé avec succès !');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">📬 Nous contacter</h1>
          <p className="text-muted-foreground mb-8">
            Une question ? Une suggestion ? Notre équipe est là pour vous aider.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Coordonnées */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="font-semibold mb-4">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>contact@sugu-link.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+224 621 123 456</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Conakry, Guinée</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;