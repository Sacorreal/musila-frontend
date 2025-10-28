"use client";

import React, { useState, useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { PreferredTopTracks } from "./components/PreferredTopTracks";
import { User } from "@/domains/auth/types";
import { getCurrentUser } from "@/domains/auth/services/userService";
import { useAuth } from "@/domains/auth/store/authStore";
import { LoaderCircle } from "lucide-react";

export default function PerfilPage() {
    const { setUser: setContextUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            // Guard para asegurar que estamos en el cliente
            if (typeof window === "undefined") {
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userData = await getCurrentUser();
                setUser(userData);

                // Sincronizar con el contexto global
                setContextUser(userData);

                if (process.env.NODE_ENV !== "production") {
                    console.log("Perfil cargado:", userData);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error desconocido";
                setError(errorMessage);
                console.error("Error al cargar perfil:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        // Sincronizar con el contexto global inmediatamente
        setContextUser(updatedUser);

        if (process.env.NODE_ENV !== "production") {
            console.log("Usuario actualizado:", updatedUser);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <LoaderCircle className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-foreground">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">No se pudo cargar el perfil del usuario</h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error || "No hay sesión activa"}</p>
                    <button onClick={() => (window.location.href = "/login")} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <PreferredTopTracks />
            <ProfileForm user={user} onSuccess={handleProfileUpdate} />
        </div>
    );
}
