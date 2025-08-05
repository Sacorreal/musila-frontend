/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', 
    content: [
      './app/**/*.{ts,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'var(--color-primary)',
            dark: 'var(--color-background-dark)', 
          },
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          background: {
            DEFAULT: 'var(--color-background)', 
            dark: 'var(--color-background-dark)',
          },
          text: {
            main: 'var(--color-text-main)',
            secondary: 'var(--color-text-secondary)',
          },
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
        },
        fontFamily: {
          manrope: ['var(--font-manrope)', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  