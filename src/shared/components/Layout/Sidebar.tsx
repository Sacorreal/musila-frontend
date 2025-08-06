"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/domains/auth/store/authStore";
import { routes } from "@/routes";
import { House, ListMusic, Users } from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar principal */}
      <aside
        className={`
        w-64 bg-secondary dark:bg-gray-800 text-text-main dark:text-white
        flex flex-col p-4 shadow-lg
        fixed inset-y-0 left-0 z-50 // Posición fija para móvil
        md:static md:translate-x-0 // Estático y visible en desktop
        transform transition-transform duration-300 ease-in-out // Transición para el deslizamiento
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del Sidebar */}
        <div className="flex items-center mb-6">
          <Image
            className="w-10 h-10 mr-2 rounded-lg"
            src="/logo.webp"
            alt="logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold">Musila App</span>
          {/* Botón de cerrar para móvil */}
          <button
            onClick={onClose}
            className="ml-auto text-text-main dark:text-white focus:outline-none md:hidden"
            aria-label="Cerrar menú"
          >
            {/* Icono de cerrar (X) */}
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navegación del Sidebar */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <a
                href={routes.dashboard}
                className="flex items-center p-2 text-text-main dark:text-gray-100 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary-dark transition-colors"
              >
                {/* Icono de Dashboard */}
                <House className="pr-1" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href={routes.songs}
                className="flex items-center p-2 text-text-main dark:text-gray-100 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary-dark transition-colors"
              >
                {/* Icono de Canciones */}
                <ListMusic className="pr-1" />
                Canciones
              </a>
            </li>
            <li>
              <a
                href={routes.artists}
                className="flex items-center p-2 text-text-main dark:text-gray-100 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary-dark transition-colors"
              >
                {/* Icono de Artistas */}
                <Users className="pr-1" />
                Artistas
              </a>
            </li>
          </ul>
        </nav>

        {/* Botón de Cerrar Sesión */}
        <div className="mt-auto">
          <div className="flex justify-center mb-4"></div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2 mt-4 text-white bg-[#ef4444] rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
          >
            {/* Icono de Salir */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
