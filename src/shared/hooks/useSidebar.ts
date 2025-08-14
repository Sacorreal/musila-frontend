// src/shared/hooks/useSidebar.ts
import { useState } from "react";
import { useAuth } from "@/domains/auth/store/authStore";

export const useSidebar = () => {
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return {
    isLoggedIn,
    isAuthLoading,
    isSidebarOpen,
    setIsSidebarOpen,
  };
};
