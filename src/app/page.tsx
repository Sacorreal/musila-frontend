"use client";
import Image from "next/image";
import { useAuth } from "@/domains/auth/store/authStore";
import LoginForm from "@/domains/auth/components/LoginForm";
import ToggleSwitch from "@/shared/components/UI/Toggle";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();

  const handleLoginSuccess = (email: string) => {
    login(email);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="bg-background-light dark:bg-background-dark min-h-screen relative">
      <div className="absolute top-4 right-4">
        <ToggleSwitch />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-text-main dark:text-gray-100"
        >
          <Image
            className="w-12 h-10 mr-2 rounded-lg"
            src="/logo.webp"
            alt="logo"
            width={36}
            height={36}
          />
          Musila
        </a>
        <div className="w-full bg-background-light rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-text-main md:text-2xl dark:text-white">
              Inicia sesión en tu cuenta
            </h1>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </section>
  );
}
