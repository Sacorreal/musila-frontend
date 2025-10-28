"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../types";
import { fetchUserById, updateAvatar as updateAvatarService } from "../services/userService";

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
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    updateUserData: (userData: Partial<User>) => Promise<void>;
    updateAvatar: (avatarUrl: string) => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "musila:user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUserState] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Hidratación inicial: verificar token y cargar usuario desde backend
    useEffect(() => {
        const hydrateSession = async () => {
            try {
                const storedToken = localStorage.getItem("jwt_token");

                if (storedToken) {
                    const decodedToken = jwtDecode<JwtPayload>(storedToken);

                    // Verificar si el token expiró
                    if (decodedToken.exp * 1000 > Date.now()) {
                        setToken(storedToken);
                        setIsLoggedIn(true);
                        setRole(decodedToken.role.toUpperCase());
                        setUserId(decodedToken.id);

                        // Intentar cargar desde caché primero
                        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
                        if (storedUser) {
                            try {
                                const parsedUser = JSON.parse(storedUser);
                                if (parsedUser.id === decodedToken.id) {
                                    setUserState(parsedUser);
                                }
                            } catch (error) {
                                console.error("Error al parsear usuario:", error);
                            }
                        }

                        // Hidratar desde backend (fuente de verdad)
                        try {
                            const userFromBackend = await fetchUserById(decodedToken.id, storedToken);
                            setUserState(userFromBackend);
                        } catch (error) {
                            console.error("Error al obtener usuario desde backend:", error);
                            // Si falla, mantener el usuario del caché
                        }
                    } else {
                        // Token expirado
                        localStorage.removeItem("jwt_token");
                        localStorage.removeItem(USER_STORAGE_KEY);
                    }
                }
            } catch (error) {
                console.error("Error al hidratar sesión:", error);
                localStorage.removeItem("jwt_token");
                localStorage.removeItem(USER_STORAGE_KEY);
            } finally {
                setIsAuthLoading(false);
            }
        };

        hydrateSession();
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem(USER_STORAGE_KEY);
        setIsLoggedIn(false);
        setRole(null);
        setUserId(null);
        setUserState(null);
        setToken(null);
    }, []);

    const login = useCallback(
        async (newToken: string) => {
            try {
                const decodedToken = jwtDecode<JwtPayload>(newToken);
                localStorage.setItem("jwt_token", newToken);
                setToken(newToken);
                setIsLoggedIn(true);
                setRole(decodedToken.role.toUpperCase());
                setUserId(decodedToken.id);

                // Intentar cargar desde caché primero
                const storedUser = localStorage.getItem(USER_STORAGE_KEY);
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        if (parsedUser.id === decodedToken.id) {
                            setUserState(parsedUser);
                        }
                    } catch (error) {
                        console.error("Error al parsear usuario en login:", error);
                    }
                }

                // Hidratar desde backend
                try {
                    const userFromBackend = await fetchUserById(decodedToken.id, newToken);
                    setUserState(userFromBackend);
                } catch (error) {
                    console.error("Error al obtener usuario en login:", error);
                }
            } catch (error) {
                console.error("Error al procesar el token de login:", error);
                logout();
            }
        },
        [logout],
    );

    const setUser = useCallback((userData: User | null) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, []);

    const updateUserData = useCallback(
        async (userData: Partial<User>) => {
            if (!user || !userId || !token) {
                throw new Error("No hay sesión activa");
            }

            // Actualización optimista
            const updatedUser = { ...user, ...userData };
            setUserState(updatedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

            // TODO: Implementar llamada real al backend cuando exista endpoint PUT /users/{id}
            // Por ahora solo actualiza localmente
        },
        [user, userId, token],
    );

    const updateAvatar = useCallback(
        async (avatarUrl: string) => {
            if (!user || !userId || !token) {
                throw new Error("No hay sesión activa");
            }

            try {
                // Actualización optimista
                const updatedUser = { ...user, avatar: avatarUrl };
                setUserState(updatedUser);

                // Llamada al backend
                const userFromBackend = await updateAvatarService(userId, token, avatarUrl);
                setUserState(userFromBackend);
            } catch (error) {
                // Revertir cambio optimista en caso de error
                setUserState(user);
                throw error;
            }
        },
        [user, userId, token],
    );

    const value = useMemo(
        () => ({ isLoggedIn, isAuthLoading, role, userId, user, token, login, logout, updateUserData, updateAvatar, setUser }),
        [isLoggedIn, isAuthLoading, role, userId, user, token, login, logout, updateUserData, updateAvatar, setUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
