// src/contexts/AdminProvider.tsx
import React, { createContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  logout: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Vérification unique au montage
  useEffect(() => {
    const token = localStorage.getItem('sugu_admin_token');
    const userStr = localStorage.getItem('sugu_admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAdminUser(user);
        setIsAdmin(true);
      } catch (e) {
        localStorage.removeItem('sugu_admin_token');
        localStorage.removeItem('sugu_admin_user');
      }
    }
    setLoading(false);
  }, []); // ← Dépendances vides

  const logout = () => {
    localStorage.removeItem('sugu_admin_token');
    localStorage.removeItem('sugu_admin_user');
    setIsAdmin(false);
    setAdminUser(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, loading, logout }}>
      {children}
    </AdminContext.Provider>
  );
};