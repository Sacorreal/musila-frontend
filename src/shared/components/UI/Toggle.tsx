"use client";

import { useState, useEffect } from "react";

const ToggleSwitch = () => {
  // Estado para saber si el componente ya se montó en el cliente
  const [mounted, setMounted] = useState(false);
  // Estado para guardar el tema actual (light o dark)
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Al montar, leemos la preferencia guardada o la del sistema
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? "dark" : "light");
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cada vez que el tema cambie, actualizamos el localStorage y la clase en el HTML
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // No renderizamos nada en el servidor para evitar errores de hidratación
  if (!mounted) {
    // Retornamos un placeholder del mismo tamaño para evitar saltos de layout
    return <div className="h-7 w-14" />;
  }

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        isDarkMode ? 'bg-primary' : 'bg-assets'
      }`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Cambiar tema</span>
      {/* El círculo que se desliza */}
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isDarkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
