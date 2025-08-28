"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/shared/hooks/useSidebar"; 
import { useAuth } from "@/domains/auth/store/authStore";
import { SIDEBAR_LINKS } from "@/domains/music/constants";
// import { routes } from "@/routes";
// import { House, ListMusic, Users, GitPullRequestArrow } from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { logout } = useAuth();
  const { role, isLoading } = useSidebar();

  const navLinks = role ? SIDEBAR_LINKS[role] || [] : [];

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
        w-64 bg-background text-text-main
        flex flex-col p-4 border-r border-assets
        fixed inset-y-0 left-0 z-50
        md:static md:translate-x-0
        transform transition-transform duration-300 ease-in-out
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
            className="ml-auto text-text-main focus:outline-none md:hidden"
            aria-label="Cerrar menú"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navegación del Sidebar */}
        <nav className="flex-grow">
        <ul className="space-y-2">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            navLinks.map((link) => {
              const Icono = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center p-2 text-text-main rounded-lg hover:bg-primary hover:text-white transition-colors"
                    onClick={onClose} 
                  >
                    <Icono className="mr-2 h-5 w-5" /> 
                    {link.name}
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </nav>

        <div className="mt-auto">
          <div className="flex justify-center mb-4"></div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2 mt-4 text-white bg-error rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
          >
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
