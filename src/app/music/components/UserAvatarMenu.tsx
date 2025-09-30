"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/store/authStore";
import { User, Settings, X } from "lucide-react";

export const UserAvatarMenu: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const avatarButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleProfileClick = () => {
        setOpenProfileModal(false);
        router.push("/music/perfil");
    };

    const handleSettingsClick = () => {
        setOpenProfileModal(false);
    };

    const handleCloseModal = () => {
        setOpenProfileModal(false);
        avatarButtonRef.current?.focus();
    };

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape" && openProfileModal) {
                handleCloseModal();
            }
        };

        if (openProfileModal) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "auto";
        };
    }, [openProfileModal]);

    const modalContent = openProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={handleCloseModal}>
            <div className="absolute inset-0 bg-black/60 transition-opacity" aria-hidden="true" />
            <div
                ref={modalRef}
                className="relative w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl bg-card-bg p-6 shadow-2xl ring-1 ring-white/10 transition-all duration-150 ease-out"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
            >
                <button onClick={handleCloseModal} className="absolute right-3 top-3 text-text-secondary hover:text-foreground transition-colors" aria-label="Cerrar modal">
                    <X className="w-5 h-5" />
                </button>

                <h2 id="modal-title" className="text-xl font-bold text-foreground mb-6">
                    Cuenta
                </h2>

                <div className="space-y-2">
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-3 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        <User className="w-4 h-4 mr-3" />
                        Mi Perfil
                    </button>

                    <button
                        onClick={handleSettingsClick}
                        className="flex items-center w-full px-4 py-3 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                        disabled
                    >
                        <Settings className="w-4 h-4 mr-3" />
                        Configuración
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isLoggedIn) return null;

    return (
        <>
            <button
                ref={avatarButtonRef}
                onClick={() => setOpenProfileModal(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Abrir menú de usuario"
            >
                <User className="w-4 h-4" />
            </button>

            {typeof window !== "undefined" && createPortal(modalContent, document.body)}
        </>
    );
};
