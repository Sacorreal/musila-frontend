"use client";

import React, { useState, useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { User } from "@/domains/auth/types";

export default function PerfilPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular obtención de datos del usuario desde localStorage o API
        const userSession = localStorage.getItem("userSession");
        if (userSession) {
            const sessionData = JSON.parse(userSession);
            // Crear un usuario mock basado en la sesión
            const mockUser: User = {
                id: "1",
                nombre: "Usuario",
                email: sessionData.email || "usuario@example.com",
                bio: "",
                ubicacion: "",
                avatarUrl: "",
                links: {
                    web: "",
                    instagram: "",
                    youtube: "",
                    soundcloud: "",
                },
            };
            setUser(mockUser);
        }
        setLoading(false);
    }, []);

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        // Aquí podrías actualizar el localStorage o hacer una llamada a la API
        console.log("Usuario actualizado:", updatedUser);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Cargando perfil...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">No se pudo cargar el perfil del usuario</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
            <ProfileForm user={user} onSuccess={handleProfileUpdate} />
        </div>
    );
}
