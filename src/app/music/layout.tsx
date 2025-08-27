"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/shared/components/Layout/Sidebar";
import ContentApp from "@/shared/components/Layout/ContentApp";
import { useRouter } from "next/navigation";
import { mockTracks } from "./Mocks/tracks";
import { Spinner } from "@/shared/components/UI/Spinner";
import AudioPlayer from "./components/AudioPlayer";

const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 relative flex flex-col overflow-hidden">
        <ContentApp onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}>
          {children}
        </ContentApp>

        <div className="absolute bottom-0 left-0 right-0 z-30">
          <AudioPlayer initialQueue={mockTracks} />
        </div>
      </div>
    </div>
  );
}