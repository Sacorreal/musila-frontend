import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/Store/authStore";
import { routes } from "@/routes";

export const useSidebar = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(routes.login);
    }
  }, [isLoggedIn, router]);

  return {
    isLoggedIn,
    isSidebarOpen,
    setIsSidebarOpen,
    router,
  };
};
