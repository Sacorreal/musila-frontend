/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        text: {
          main: "var(--color-text-main)",
          secondary: "var(--color-text-secondary)",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
