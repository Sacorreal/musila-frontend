import React from 'react';

export const Button = ({ children, onClick, type = "submit", disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors shadow-lg cursor-pointer"
  >
    {children}
  </button>
);
