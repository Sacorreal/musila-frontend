"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ToggleSwitch from "@/shared/components/UI/Toggle";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "#benefits", label: "Beneficios" },
  { href: "#pricing", label: "Precios" },
  { href: "#contact", label: "Contáctanos" },
];

const IconClose = () => (
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
);

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-solid border-[#3c3069]">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            <Image
              src="/logo.webp"
              alt="Musila Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-medium text-foreground">Musila</span>
          </Link>

          {/* Navegación de escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="h-6 w-[1px] bg-border-color"></div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-primary text-white text-sm font-medium transition-colors hover:bg-primary/90"
              >
                <span className="truncate">Iniciar Sesión</span>
              </Link>
              <ToggleSwitch />
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2 text-[#151123] bg-white rounded-full cursor-pointer"
            >
              {isMenuOpen ? <IconClose /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#151123] md:hidden">
          <nav className="flex flex-col items-center gap-8 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-medium text-gray-300 transition-colors hover:text-white"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-6 flex w-64 cursor-pointer items-center justify-center rounded-full h-12 px-4 bg-primary text-white text-base font-medium"
            >
              <span className="truncate">Iniciar</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
