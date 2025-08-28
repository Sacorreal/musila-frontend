import { useState } from "react";
import { useAuth } from "@/domains/auth/store/authStore";

export const useSidebar = () => {
  const { isLoggedIn, isAuthLoading, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return {
    isLoggedIn,
    isAuthLoading,
    role,
    isSidebarOpen,
    setIsSidebarOpen,
    isLoading: isAuthLoading,
  };
};
