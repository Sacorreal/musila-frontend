"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/store/authStore";
import { useModal } from "@/shared/hooks/useModal";
import { Modal } from "@/shared/components/UI/Modal";
import { User, Settings, LogOut } from "lucide-react";

export const UserAvatarMenu: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const { isOpen, open, close } = useModal();

    const handleLogout = () => {
        logout();
        close();
        router.push("/login");
    };

    const handleProfileClick = () => {
        close();
        router.push("/music/perfil");
    };

    if (!isLoggedIn) return null;

    return (
        <>
            <button
                onClick={open}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Abrir menú de usuario"
            >
                <User className="w-4 h-4" />
            </button>

            <Modal isOpen={isOpen} onClose={close}>
                <div className="space-y-2">
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        <User className="w-4 h-4 mr-3" />
                        Mi Perfil
                    </button>

                    <button
                        onClick={() => {
                            close();
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                        disabled
                    >
                        <Settings className="w-4 h-4 mr-3" />
                        Configuración
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-error hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Cerrar sesión
                    </button>
                </div>
            </Modal>
        </>
    );
};
