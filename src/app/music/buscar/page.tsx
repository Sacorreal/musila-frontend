"use client";

import React, { useState } from "react";
import { SearchBar } from "@/shared/components/UI/Searchbar";

// --- Datos de ejemplo para los géneros ---
const musicGenres = [
  { name: "Top Países", color: "bg-amber-800/80" },
  { name: "Reggaetón", color: "bg-red-800/80" },
  { name: "Salsa", color: "bg-green-800/80" },
  { name: "Vallenato", color: "bg-slate-600/80" },
  { name: "Pop", color: "bg-blue-800/80" },
  { name: "Música Popular", color: "bg-purple-800/80" },
  { name: "Tropical", color: "bg-orange-800/80" },
  { name: "Música Religiosa", color: "bg-cyan-800/80" },
  { name: "Infantil", color: "bg-lime-800/80" },
  { name: "Románticas", color: "bg-rose-800/80" },
  { name: "Electrónica/Dance", color: "bg-indigo-800/80" },
  { name: "Rock en Inglés", color: "bg-stone-700/80" },
];

// --- Componente Principal de la Página de Búsqueda ---
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-grow">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="¿Qué quieres escuchar?"
          />
        </div>
      </header>

      <main>
        <h1 className="text-2xl font-bold mb-6">Géneros más buscados</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {musicGenres.map((genre) => (
            <div
              key={genre.name}
              className={`rounded-lg p-4 aspect-video flex items-end justify-start cursor-pointer transition-transform hover:scale-101 ${genre.color}`}
            >
              <h2 className="font-semibold text-lg">{genre.name}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
