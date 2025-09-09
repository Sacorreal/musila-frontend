"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Buscar...",
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-secondary border border-assets rounded-full py-2 pl-11 pr-4 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
