// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/apiServices';

export interface UserAccount {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  company_name?: string;
  user_type?: string;
  phone?: string;
  city?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserAccount | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  updateProfile: (profileData: Partial<UserAccount>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = api.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
          company: currentUser.company || currentUser.first_name, // Si company n'existe pas, utiliser first_name
          user_type: currentUser.user_type,
          phone: currentUser.phone,
          city: currentUser.city,
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.login(email, password);
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        company: response.user.company_name || response.user.first_name, // Si company_name n'existe pas, utiliser first_name
        user_type: response.user.user_type || 'professional',
        phone: response.user.phone,
        city: response.user.city,
      });
      
      navigate('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    navigate('/');
  };

  // ✅ SIGNUP CORRIGÉ - Gère correctement les deux types d'utilisateurs
  const signup = async (userData: any) => {
    try {
      setLoading(true);
      
      console.log("📤 Signup - Données reçues:", userData);
      
      const response = await api.register(userData);
      
      console.log("✅ Signup - Réponse:", response);
      
      // Déterminer le type d'utilisateur
      const userType = userData.user_type || 
                      (userData.first_name === userData.companyName ? 'enterprise' : 'professional');
      
      // Déterminer le nom de l'entreprise (pour les pros, first_name + last_name, pour les entreprises, first_name)
      let companyName = '';
      if (userType === 'enterprise') {
        companyName = userData.first_name; // Le nom de l'entreprise est dans first_name
      } else {
        companyName = `${userData.first_name} ${userData.last_name}`.trim();
      }
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        company: companyName,
        user_type: userType,
        phone: userData.phone || '',
        city: userData.city || '',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Erreur signup:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATEPROFILE CORRIGÉ
  const updateProfile = async (profileData: Partial<UserAccount>) => {
    try {
      setLoading(true);
      
      const apiData: any = {};
      if (profileData.email) apiData.email = profileData.email;
      if (profileData.company) apiData.company = profileData.company;
      
      const updatedUser = await api.updateProfile(apiData);
      
      setUser(prev => {
        if (!prev) return null;
        
        return {
          id: prev.id,
          email: updatedUser.email || prev.email,
          first_name: updatedUser.first_name || prev.first_name,
          last_name: updatedUser.last_name || prev.last_name,
          company: updatedUser.company || updatedUser.first_name || prev.company,
          user_type: updatedUser.user_type || prev.user_type,
          phone: updatedUser.phone || prev.phone,
          city: updatedUser.city || prev.city,
        };
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};