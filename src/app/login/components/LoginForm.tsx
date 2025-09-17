"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/components/UI/Inputs";
import { Button } from "@/shared/components/UI/Buttons";
import Link from "next/link";
import { loginUser } from "@/domains/auth/services/auth.service";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Introduce un correo electrónico válido" }),
  password: z
    .string()
    .min(5, { message: "La contraseña debe tener al menos 5 caracteres" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const { token } = await loginUser(data);
      onLoginSuccess(token);
    } catch (error: unknown) {
      console.error("Error de login:", error);
      setLoginError(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Credenciales incorrectas. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Tu correo"
        id="email"
        type="email"
        placeholder="name@correo.com"
        register={register}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        id="password"
        type="password"
        placeholder="••••••••"
        register={register}
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="remember"
              className="text-gray-500 dark:text-gray-300"
            >
              Recuérdame
            </label>
          </div>
        </div>
        <Link
          href="#"
          className="text-sm font-medium text-white hover:underline "
        >
          ¿Olvidaste la contraseña?
        </Link>
      </div>

      {loginError && (
        <p className="text-sm font-medium text-red-500">{loginError}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
      <p className="text-sm font-light text-secondary dark:text-gray-400">
        ¿No tienes una cuenta?{" "}
        <a href="#" className="font-medium text-white hover:underline">
          Regístrate
        </a>
      </p>
    </form>
  );
}
