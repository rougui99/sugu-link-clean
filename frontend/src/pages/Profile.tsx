// src/pages/Profile.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building2, Mail, Phone, MapPin, 
  Edit2, Briefcase, 
  Star, MessageCircle, LogOut, ChevronRight,
  Camera, Save, X
} from 'lucide-react';
import axios from 'axios';

interface User {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  company?: string;
  avatar_url?: string;
}

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    company: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        company: user.company || ''
      });
      setAvatar(user.avatar_url || null);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      
      // ✅ CORRECTION ICI - Typage de la réponse
      interface UploadResponse {
        avatarUrl: string;
      }

      const response = await axios.post<UploadResponse>(
        'http://localhost:3000/api/users/avatar',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setAvatar(response.data.avatarUrl + '?t=' + Date.now());
      alert('Photo de profil mise à jour !');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const stats = {
    projects: 12,
    reviews: 24,
    rating: 4.8
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec couverture */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-48 relative">
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          {/* Avatar avec upload */}
          <div className="relative">
            <div 
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
            >
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={user.first_name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
            <button 
              onClick={handleAvatarClick}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              disabled={uploading}
            >
              {uploading ? (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              ) : (
                <Camera className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="mb-2 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {formData.first_name} {formData.last_name}
              <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                {user.user_type === 'professional' ? 'Pro' : 'Entreprise'}
              </span>
            </h1>
            <p className="text-white/90 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Espace pour compenser le header */}
      <div className="h-24"></div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Menu des onglets */}
        <div className="flex border-b mb-8 overflow-x-auto">
          {['profil', 'activité', 'documents', 'paramètres'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Infos */}
          <div className="lg:col-span-1 space-y-4">
            {/* Carte d'informations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Informations</h2>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="text-green-600 hover:text-green-700"
                      title="Enregistrer"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setEditing(false)}
                      className="text-red-600 hover:text-red-700"
                      title="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {!editing ? (
                // Mode affichage
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{formData.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{formData.city || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span>{formData.company || 'Non renseigné'}</span>
                  </div>
                </div>
              ) : (
                // Mode édition
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Entreprise</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-4">Statistiques</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.projects}</div>
                  <div className="text-xs text-gray-500">Projets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.reviews}</div>
                  <div className="text-xs text-gray-500">Avis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.rating}</div>
                  <div className="text-xs text-gray-500">Note</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button 
                onClick={() => navigate('/messages')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span>Messagerie</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between text-red-600"
              >
                <span className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span>Se déconnecter</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Colonne de droite - Activité récente */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-6">Activité récente</h2>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Candidature envoyée</p>
                      <p className="text-sm text-gray-500">Développeur Full Stack - Tech Guinée</p>
                      <p className="text-xs text-gray-400 mt-1">Il y a 2 jours</p>
                    </div>
                    <span className="text-sm text-green-600">En cours</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;