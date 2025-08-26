"use client";

import React from "react";
import ToggleSwitch from "@/shared/components/UI/Toggle";
import Link from "next/link";
import Image from "next/image";

export default function PublicarLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-solid border-[#3c3069] bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.webp" alt="Musila Logo" width={40} height={40} className="rounded-lg" />
                        <span className="text-xl font-medium text-foreground">Musila</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/music" className="text-sm font-medium text-text-secondary transition-colors hover:text-primary">
                            Volver a Música
                        </Link>
                        <div className="h-6 w-[1px] bg-[#3c3069]"></div>
                        <ToggleSwitch />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}

