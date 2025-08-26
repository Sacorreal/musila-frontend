"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToggleSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-16 rounded-full bg-assets" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const spring = {
    type: "spring" as const,
    stiffness: 700,
    damping: 30,
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
        isDark ? "justify-end bg-primary" : "justify-start bg-assets"
      }`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Cambiar tema</span>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
          style={isDark ? { right: '0.35rem' } : { left: '0.35rem' }}
        >
        </motion.span>
      </AnimatePresence>

      <motion.div
        className="h-5 w-5 rounded-full bg-white shadow-md"
        layout
        transition={spring}
      />
    </button>
  );
};

export default ToggleSwitch;
