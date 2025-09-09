"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  role: string | null;
  userId: string | null;
  login: (token: string) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Solo necesitamos verificar el token
      const token = localStorage.getItem("jwt_token");

      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);

        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setRole(decodedToken.role.toUpperCase());
          setUserId(decodedToken.id); 
        } else {
          localStorage.removeItem("jwt_token");
        }
      }
    } catch (error) {
      console.error("Error al leer el token:", error);
      localStorage.removeItem("jwt_token");
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = (token: string) => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      localStorage.setItem("jwt_token", token);
      setIsLoggedIn(true);
      setRole(decodedToken.role.toUpperCase());
      setUserId(decodedToken.id); 
    } catch (error) {
      console.error("Error al procesar el token de login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthLoading, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

