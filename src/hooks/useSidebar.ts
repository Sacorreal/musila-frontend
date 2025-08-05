import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Store/authStore';
import { routes } from '@/app/routes';

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
