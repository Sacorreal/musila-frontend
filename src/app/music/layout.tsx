"use client";

import React from "react";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/shared/components/Layout/Sidebar";
import ContentApp from "@/shared/components/Layout/ContentApp";

export default function MusicAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, isSidebarOpen, setIsSidebarOpen } = useSidebar();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenido principal*/}
      <ContentApp onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}>
        {children}
      </ContentApp>
    </div>
  );
}
