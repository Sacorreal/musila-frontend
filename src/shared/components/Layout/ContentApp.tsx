"use client";

import React from "react";
import ToggleSwitch from "@/shared/components/UI/Toggle";

export default function ContentApp({
  children,
  onToggleSidebar,
}: Readonly<{
  children: React.ReactNode;
  onToggleSidebar: () => void;
}>) {
  return (
    <main className="flex-1 flex flex-col">
      {/* Barra superior para móvil */}
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between md:hidden">
        <button
          onClick={onToggleSidebar}
          className="text-text-main dark:text-white focus:outline-none"
          aria-label="Abrir menú"
        >
          {/* Icono de hamburguesa */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <span className="text-xl font-semibold text-text-main dark:text-white">
          Musila App
        </span>
        <ToggleSwitch />
      </header>

      <div className="flex-1 p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-main dark:text-white">
            Contenido de la Aplicación
          </h1>

          <div className="hidden md:block">
            <ToggleSwitch />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
