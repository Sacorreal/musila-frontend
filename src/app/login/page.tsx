"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/domains/auth/store/authStore";
import LoginForm from "@/app/login/components/LoginForm";
import ToggleSwitch from "@/shared/components/UI/Toggle";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/music");
    }
  }, [isLoggedIn, router]);

  const handleLoginSuccess = (token: string, userId: string) => {
    login(token, userId);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="bg-background min-h-screen relative">
      <div className="absolute top-4 right-4">
        <ToggleSwitch />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-foreground"
        >
          <Image
            className="w-12 h-10 mr-2 rounded-lg"
            src="/logo.webp"
            alt="logo"
            width={36}
            height={36}
          />
          Musila{" "}
        </Link>
        <div className="w-full bg-[#111827] rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-white leading-tight tracking-tight md:text-2xl">
              Inicia sesión en tu cuenta
            </h1>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </section>
  );
}
