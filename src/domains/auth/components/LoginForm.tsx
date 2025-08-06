"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/components/UI/Inputs";
import { Button } from "@/shared/components/UI/Buttons";
import { useRouter } from "next/navigation";
import { routes } from "@/routes";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Introduce un correo electrónico válido" }),
  password: z
    .string()
    .min(5, { message: "La contraseña debe tener al menos 5 caracteres" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm({
  onLoginSuccess,
}: {
  onLoginSuccess: (email: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    setIsSubmitting(true);
    // llamada a una API en services/auth.ts
    setTimeout(() => {
      onLoginSuccess(data.email);
      setIsSubmitting(false);
      router.push(routes.music);
    }, 1000);
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Tu correo"
        id="email"
        type="email"
        placeholder="name@company.com"
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
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          ¿Olvidaste la contraseña?
        </a>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
      <p className="text-sm font-light text-text-secondary dark:text-gray-400">
        ¿No tienes una cuenta?{" "}
        <a
          href="#"
          className="font-medium text-primary hover:underline dark:text-primary"
        >
          Regístrate
        </a>
      </p>
    </form>
  );
}
