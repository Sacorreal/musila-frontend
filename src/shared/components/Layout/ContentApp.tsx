"use client";

import React from "react";
import ToggleSwitch from "@/shared/components/UI/Toggle";
import { UserAvatarMenu } from "@/app/music/components/UserAvatarMenu";

export default function ContentApp({
    children,
    onToggleSidebar,
}: Readonly<{
    children: React.ReactNode;
    onToggleSidebar: () => void;
}>) {
    return (
        <main className="flex-1 flex flex-col bg-transparent">
            <header className="bg-background shadow-md p-4 flex items-center justify-between">
                <button onClick={onToggleSidebar} className="text-text-main dark:text-white focus:outline-none md:hidden" aria-label="Abrir menú">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>

                <h2 className="text-xl font-semibold text-foreground">Contenido de la Aplicación</h2>

                <div className="flex items-center gap-4">
                    <ToggleSwitch />
                    <UserAvatarMenu />
                </div>
            </header>

            <div className="flex-1 p-6">{children}</div>
        </main>
    );
}
