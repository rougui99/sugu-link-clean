import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// ===== TYPES COMPLETS POUR POSTGRESQL =====

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type?: 'professional' | 'enterprise';
  phone?: string;
  city?: string;
  company_name?: string;
  title?: string;
  domain?: string;
  experience?: string;
  availability?: boolean;
}

interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type?: 'professional' | 'enterprise' | 'admin';
  phone?: string;
  city?: string;
  company_name?: string;
  profile_picture?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Pour le profil utilisateur (équivalent de UserAccount)
export interface UserAccount {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  user_type?: string;
  phone?: string;
  city?: string;
}

interface Job {
  id: number;
  title: string;
  description?: string;
  company_id?: number;
  location?: string;
  salary?: number;
  type?: string;
  created_at?: string;
}

interface Company {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

interface Document {
  id: number;
  name: string;
  url?: string;
  user_id?: number;
  created_at?: string;
}

// ===== CRÉATION DE L'INSTANCE AXIOS =====

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== AUTHENTIFICATION =====

// ✅ INSCRIPTION UNIFIÉE - CORRIGÉE POUR ÉVITER L'ERREUR 400
export const register = async (userData: any): Promise<AuthResponse> => {
  try {
    console.log("📤 Inscription - Données reçues:", userData);
    
    // 🔴 CORRECTION: S'assurer que first_name n'est jamais vide
    let firstName = userData.first_name || userData.firstName || '';
    
    // Si c'est une entreprise et que first_name est vide, utiliser companyName
    if (!firstName && userData.companyName) {
      firstName = userData.companyName;
    }
    
    // 🔴 CORRECTION: S'assurer que les champs obligatoires sont présents
    if (!firstName) {
      throw new Error("Le prénom ou nom d'entreprise est requis");
    }
    if (!userData.email) {
      throw new Error("L'email est requis");
    }
    if (!userData.password) {
      throw new Error("Le mot de passe est requis");
    }
    
    // ✅ Format EXACT attendu par le backend
    const backendData = {
      first_name: firstName,
      last_name: userData.last_name || userData.lastName || '',
      email: userData.email,
      password: userData.password
    };

    console.log("📤 Données envoyées au backend:", backendData);

    const response = await axiosInstance.post<AuthResponse>(`/users/register`, backendData);
    
    // Sauvegarder le token si présent
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    console.log("✅ Inscription réussie:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur register:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ CONNEXION (correspond à votre route backend /api/users/login)
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log("📤 Connexion - Email:", email);
    
    const response = await axiosInstance.post<AuthResponse>(`/users/login`, { 
      email, 
      password 
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    console.log("✅ Connexion réussie:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur login:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ RÉCUPÉRER LE PROFIL (À AJOUTER DANS VOTRE BACKEND)
export const getProfile = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/auth/profile`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getProfile:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ METTRE À JOUR LE PROFIL (À AJOUTER DANS VOTRE BACKEND)
export const updateProfile = async (profileData: { email?: string; company?: string }): Promise<UserAccount> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }

    const backendData: Record<string, any> = {};
    
    if (profileData.email) backendData.email = profileData.email;
    if (profileData.company) {
      backendData.last_name = profileData.company;
    }

    const response = await axiosInstance.put<any>(`/auth/profile`, backendData);
    
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser as UserAccount;
      } catch (e) {
        console.error("Erreur parsing currentUser:", e);
      }
    }
    
    return response.data as UserAccount;
  } catch (error: any) {
    console.error("❌ Erreur updateProfile:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DÉCONNEXION
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ===== ROUTES ADMIN =====

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>(`/admin/users`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getUsers:", error.response?.status);
    return [];
  }
};

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axiosInstance.get<Company[]>(`/admin/companies`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getCompanies:", error.response?.status);
    return [];
  }
};

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await axiosInstance.get<Job[]>(`/admin/jobs`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getJobs:", error.response?.status);
    return [];
  }
};

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await axiosInstance.get<Document[]>(`/admin/documents`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur getDocuments:", error.response?.status);
    return [];
  }
};

// ===== FONCTIONS UTILITAIRES =====

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = (): UserAccount | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr) as UserAccount;
    } catch {
      return null;
    }
  }
  return null;
};