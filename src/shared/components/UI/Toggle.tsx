"use client";

import React, { useState, useEffect } from "react";

export default function Toggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const handleToggle = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    if (newIsDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="darkModeToggle"
        className="sr-only"
        checked={isDarkMode}
        onChange={handleToggle}
      />

      <label
        htmlFor="darkModeToggle"
        className={`
          relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
          flex items-center p-1 
          ${isDarkMode ? "bg-[#9b8fcc]" : "bg-[#2a2249]"}
        `}
      >
        <span
          className={`
            w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md
            ${isDarkMode ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </label>
    </div>
  );
}
