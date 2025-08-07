import React from "react";
import Link from "next/link";
import Image from "next/image";
import ToggleSwitch from "@/shared/components/UI/Toggle";

const navLinks = [
  { href: "#benefits", label: "Beneficios" },
  { href: "#pricing", label: "Precios" },
  { href: "#contact", label: "Contáctanos" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-border-color-light bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Musila Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-medium text-foreground">Musila</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium leading-normal text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden h-6 w-[1px] bg-border-color md:block"></div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-primary text-white text-sm font-bold transition-colors hover:bg-primary/90"
            >
              <span className="truncate">Iniciar</span>
            </Link>

            <ToggleSwitch />
          </div>

          <div className="md:hidden">
            <button className="p-2 text-white">
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
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
