"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ToggleSwitch from "@/shared/components/UI/Toggle";
import { Menu } from "lucide-react";
import { motion, AnimatePresence, easeOut, easeInOut } from "framer-motion";

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

// --- Animation Variants ---
const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeInOut } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: easeInOut } },
};

const navContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    setMounted(true);

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-solid border-assets bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            {mounted ? (
              <Image
                src={isDarkMode ? "/musiladark.png" : "/musila.png"}
                alt="Musila Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            <span className="text-xl font-medium text-foreground">Musila</span>
          </Link>

          {/* Navegación de escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <motion.nav
              className="flex items-center gap-8"
              initial="hidden"
              animate="visible"
              variants={navContainerVariants}
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={navItemVariants}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
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

          <div className="flex items-center md:hidden">
            <ToggleSwitch />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2 text-foreground rounded-full cursor-pointer"
            >
              {isMenuOpen ? <IconClose /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-card-bg md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <motion.nav
              className="flex flex-col items-center gap-8 text-center"
              initial="hidden"
              animate="visible"
              variants={navContainerVariants}
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={navItemVariants}>
                  <Link
                    href={link.href}
                    className="text-2xl font-medium text-foreground transition-colors hover:text-text-secondary"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={navItemVariants}>
                <Link
                  href="/login"
                  className="mt-6 flex w-64 cursor-pointer items-center justify-center rounded-full h-12 px-4 bg-primary text-white text-base font-medium"
                >
                  <span className="truncate">Iniciar</span>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
