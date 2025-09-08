"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  role: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

interface JwtPayload {
  rol: string;
  exp: number;
  iat: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("jwt_token");
      const storedUserId = localStorage.getItem("user_id");

      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);

        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setRole(decodedToken.rol);
          setUserId(storedUserId); 
        } else {
          localStorage.removeItem("jwt_token");
          localStorage.removeItem("user_id");
        }
      }
    } catch (error) {
      console.error("Error al leer el token:", error);
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_id");
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // 'login'
  const login = (token: string, newUserId: string) => { 
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_id", newUserId); 
      setIsLoggedIn(true);
      setRole(decodedToken.rol);
      setUserId(newUserId);
    } catch (error) {
      console.error("Error al procesar el token de login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
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
