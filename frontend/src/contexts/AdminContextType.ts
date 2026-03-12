import { createContext } from "react";

export type AdminUser = {
  id: string;
  email: string;
  role: "superadmin" | "admin" | "moderator";
  name: string;
};

export type AdminContextType = {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  logout: () => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);
