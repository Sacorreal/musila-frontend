"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "@/shared/components/UI/Searchbar";
import { Urls } from "@/shared/constants";

// --- Tipos de datos ---
type Genre = {
  id: string | number;
  genre: string;
};

// Paleta de colores para los géneros
const genreColors = [
  "bg-emerald-900 hover:bg-emerald-600",
  "bg-blue-900 hover:bg-blue-600",
  "bg-purple-900 hover:bg-purple-600",
  "bg-pink-900 hover:bg-pink-600",
  "bg-red-900 hover:bg-red-600",
  "bg-orange-900 hover:bg-orange-600",
  "bg-yellow-900 hover:bg-yellow-600",
  "bg-lime-900 hover:bg-lime-600",
  "bg-cyan-900 hover:bg-cyan-600",
  "bg-indigo-900 hover:bg-indigo-600",
  "bg-rose-900 hover:bg-rose-600",
  "bg-amber-900 hover:bg-amber-600",
];

// --- Componente Principal de la Página de Géneros ---
export default function GenresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(Urls.genres.all);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const validGenres = data.filter(
            (item) => item && typeof item.genre === "string"
          );
          setGenres(validGenres);
        } else {
          throw new Error("La respuesta de la API no es un array.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = genres.filter((item) =>
    item.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-grow">
          <SearchBar
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            placeholder="Filtrar géneros..."
          />
        </div>
      </header>

      <main>
        <h1 className="text-2xl font-bold mb-6">Explorar Géneros</h1>
        {loading && <p className="text-gray-400">Cargando géneros...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

       {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Usa la lista filtrada */}
            {filteredGenres.length > 0 ? (
              filteredGenres.map((item, index) => {
                const colorClass = genreColors[index % genreColors.length];
                return (
               <a
                    key={item.id}
                    href={`/music/genres/${item.id}`}
                    className={`rounded-lg p-4 aspect-video flex items-end justify-start cursor-pointer ${colorClass}`}
                  >
                    <h2 className="font-semibold text-lg text-white">
                      {item.genre}
                    </h2>
                  </a>
                );
              })
            ) : (
              <p className="text-gray-400">No se encontraron géneros que coincidan con &quot;{searchTerm}&quot;.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}