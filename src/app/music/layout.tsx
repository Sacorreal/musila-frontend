"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/shared/components/Layout/Sidebar";
import ContentApp from "@/shared/components/Layout/ContentApp";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { mockTracks } from "./Mocks/tracks";

export default function MusicAppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isLoggedIn, isSidebarOpen, setIsSidebarOpen } = useSidebar();

    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace("/login");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null;
    }

    const AudioPlayer = dynamic(() => import("@/app/music/components/AudioPlayer"), { ssr: false });

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <ContentApp onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}>
                {children}
                <div className="fixed left-0 md:left-64 right-0 bottom-0 px-4 py-3 z-30">
                    <AudioPlayer initialQueue={mockTracks} />
                </div>
            </ContentApp>
        </div>
    );
}
