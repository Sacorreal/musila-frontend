import { useState } from "react";
import { useAuth } from "@/domains/auth/store/authStore";

export const useSidebar = () => {
    const { isLoggedIn } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return {
        isLoggedIn,
        isSidebarOpen,
        setIsSidebarOpen,
    };
};
