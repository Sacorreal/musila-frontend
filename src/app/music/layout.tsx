"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/shared/components/Layout/Sidebar";
import ContentApp from "@/shared/components/Layout/ContentApp";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { mockTracks } from "./Mocks/tracks";
import { useAuth } from "@/domains/auth/store/authStore";

export default function MusicAppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isLoggedIn, isSidebarOpen, setIsSidebarOpen } = useSidebar();
    const { isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Solo redirigir si ya se inicializó la autenticación y no está logueado
        if (isInitialized && !isLoggedIn) {
            router.replace("/login");
        }
    }, [isInitialized, isLoggedIn, router]);

    // Mostrar nada mientras se inicializa la autenticación
    if (!isInitialized) {
        return null;
    }

    // Redirigir si no está logueado
    if (!isLoggedIn) {
        return null;
    }

    const AudioPlayer = dynamic(() => import("@/app/music/components/AudioPlayer"), { ssr: false });

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <ContentApp onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}>
                <div className="pb-32">{children}</div>
                <div className="fixed left-0 md:left-64 right-0 bottom-0 z-50">
                    <AudioPlayer initialQueue={mockTracks} />
                </div>
            </ContentApp>
        </div>
    );
}
