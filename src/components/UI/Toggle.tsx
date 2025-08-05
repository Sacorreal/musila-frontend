"use client";

import React, { useState, useEffect } from "react";

export default function ToggleSwitch() {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsChecked(true);
    } else if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsChecked(false);
    } else {
      
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setIsChecked(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsChecked(false);
      }
    }
  }, []);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    if (newCheckedState) {
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
        checked={isChecked}
        onChange={handleToggle}
      />

      <label
        htmlFor="darkModeToggle"
        className={`
          relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
          flex items-center p-1
          ${isChecked ? "bg-primary" : "bg-gray-500"}
        `}
      >
        <span
          className={`
            w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </label>
    </div>
  );
}
