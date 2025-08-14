"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/shared/components/Layout/Sidebar";
import ContentApp from "@/shared/components/Layout/ContentApp";
import { useRouter } from "next/navigation";
import { Spinner } from "@/shared/components/UI/Spinner";

const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Podrías poner un spinner o cualquier animación aquí */}
      <Spinner />
    </div>
  );
};

export default function MusicAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isAuthLoading, isSidebarOpen, setIsSidebarOpen } =
    useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  if (isAuthLoading) {
    return <AuthLoader />;
  }

  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <ContentApp onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}>
          {children}
        </ContentApp>
      </div>
    );
  }

  return null;
}
