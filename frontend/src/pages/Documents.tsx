// src/pages/Documents.tsx
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

// 🔴 AJOUT : Interface pour typer les documents
interface Document {
  id: number;
  document_type: string;
  document_url: string;
  document_number: string;
  verified: boolean;
  created_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      // ✅ CORRECTION : Typer la réponse Axios
      const response = await axios.get<Document[]>('/api/verification/my-documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('documentType', selectedType);
    formData.append('documentNumber', documentNumber);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/verification/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Réinitialiser le formulaire
      setSelectedFile(null);
      setSelectedType('');
      setDocumentNumber('');
      fetchDocuments();
      
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'RCCM': 'Registre du Commerce',
      'NIF': 'Numéro d\'Identification Fiscale',
      'QUITUS_FISCAL': 'Quitus Fiscal',
      'CNSS': 'Attestation CNSS',
      'IDENTITE': 'Pièce d\'identité'
    };
    return types[type] || type;
  };

  const getStatusBadge = (verified: boolean) => {
    if (verified) {
      return <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /> Vérifié</span>;
    }
    return <span className="flex items-center gap-1 text-yellow-600"><Clock className="h-4 w-4" /> En attente</span>;
  };

  const handleVerificationRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const documentIds = documents.map(d => d.id);
      
      await axios.post('/api/verification/request-verification', 
        { documentIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Demande de vérification envoyée avec succès !');
    } catch (error) {
      console.error('Erreur demande vérification:', error);
      alert('Erreur lors de la demande');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Documents de vérification</h1>
          <p className="text-muted-foreground mb-8">
            Téléchargez vos documents pour obtenir le badge "Entreprise vérifiée"
          </p>

          {/* Formulaire d'upload */}
          <div className="bg-card rounded-lg border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Ajouter un document</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de document</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Sélectionner...</option>
                  <option value="RCCM">Registre du Commerce (RCCM)</option>
                  <option value="NIF">NIF</option>
                  <option value="QUITUS_FISCAL">Quitus Fiscal</option>
                  <option value="CNSS">Attestation CNSS</option>
                  <option value="IDENTITE">Pièce d'identité</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Numéro du document</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: RCCM-2025-00123"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Fichier (PDF, JPEG, PNG - max 5MB)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedType || uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Upload en cours...' : 'Télécharger le document'}
            </Button>
          </div>

          {/* Liste des documents */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Mes documents</h2>
            
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun document téléchargé pour l'instant
              </p>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{getDocumentTypeLabel(doc.document_type)}</p>
                        <p className="text-sm text-muted-foreground">N°: {doc.document_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(doc.verified)}
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.document_url} target="_blank" rel="noopener noreferrer">Voir</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton de demande de vérification */}
            {documents.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleVerificationRequest}
                  className="w-full"
                >
                  Demander la vérification
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documents;