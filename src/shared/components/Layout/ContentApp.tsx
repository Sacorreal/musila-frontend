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
    <main className="flex-1 flex flex-col bg-transparent overflow-y-auto">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-assets p-6 flex items-center justify-between z-20">
        <button
          onClick={onToggleSidebar}
          className="text-text-main dark:text-white focus:outline-none md:hidden"
          aria-label="Abrir menú"
        >
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

        <h2 className="text-xl font-semibold text-foreground hidden sm:block">
          Contenido de la Aplicación
        </h2>

        <ToggleSwitch />
      </header>

      <div className="flex-1 p-6 pb-32">{children}</div>
    </main>
  );
}