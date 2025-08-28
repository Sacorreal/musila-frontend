"use client";

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

interface JwtPayload {
  id: string;
  name: string;
  rol: string; 
  iat: number;
  exp: number;
}

export const useUserSession = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserRole(decodedToken.rol);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userRole, isLoading };
};