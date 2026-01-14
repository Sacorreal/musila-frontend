"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchBar } from "../../../shared/components/UI/Searchbar";
import { Loader2, AlertTriangle } from "lucide-react";
import { Urls } from "../../../shared/constants";

const API_BASE_URL = "https://musila-develop-flke3.ondigitalocean.app";

// --- Tipos de datos ---
type Genre = {
  id: string | number;
  genre: string;
};

interface Track {
  id: string;
  title: string;
  subGenre: string;
  year: number;
  language: string;
  // Puedes añadir otros campos necesarios
}

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

// Hook personalizado para Debounce 
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// --- Componente Principal de la Página de Búsqueda ---
export default function SearchPage() {
  // Estado compartido
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para Géneros
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isGenreLoading, setIsGenreLoading] = useState(true);
  const [genreError, setGenreError] = useState<string | null>(null);

  // Estados para Búsqueda de Canciones
  const [songResults, setSongResults] = useState<Track[]>([]);
  const [isSongLoading, setIsSongLoading] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);

  // Aplica debounce al término de búsqueda (ej. 500ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- EFFECT para Búsqueda de Canciones (API) ---
  useEffect(() => {
    const fetchSongResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSongResults([]);
        setSongError(null);
        setIsSongLoading(false);
        return;
      }

      setIsSongLoading(true);
      setSongError(null);

      try {
        const url = `${API_BASE_URL}/tracks/search?q=${encodeURIComponent(
          debouncedSearchTerm
        )}`;

        const response = await axios.get(url);
        setSongResults(response.data || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setSongError(
          "Ocurrió un error al buscar canciones. Asegúrate de que el servidor esté activo."
        );
        setSongResults([]);
      } finally {
        setIsSongLoading(false);
      }
    };

    fetchSongResults();
  }, [debouncedSearchTerm]);

  // --- EFFECT para Carga de Géneros ---
  useEffect(() => {
    const fetchGenres = async () => {
      setIsGenreLoading(true);
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
        setGenreError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setIsGenreLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Filtro local de géneros (rápido)
  const filteredGenres = genres.filter((item) =>
    item.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Renderizado de Búsqueda de Canciones ---
  const renderSongResults = () => {
    if (isSongLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-gray-400">Buscando canciones...</span>
        </div>
      );
    }

    if (songError) {
      return (
        <div className="flex flex-col items-center p-8 text-red-500">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>{songError}</p>
        </div>
      );
    }

    if (!debouncedSearchTerm.trim()) {
      return (
        <p className="text-center text-gray-500 p-8">
           Ingresa un término para buscar canciones.
        </p>
      );
    }

    if (songResults.length === 0) {
      return (
        <p className="text-center text-gray-500 p-8">
          No se encontraron canciones para &quot;{debouncedSearchTerm}&quot;.
        </p>
      );
    }

    return (
      <ul className="space-y-4 p-4">
        {songResults.map((track) => (
          <li
            key={track.id}
            className="p-4 border rounded-lg bg-card shadow-sm transition-colors hover:bg-muted/50 cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {track.title}
            </h2>
            <p className="text-sm text-foreground/70">
              <span className="font-medium">Género:</span> {track.subGenre} |
              <span className="font-medium ml-2">Año:</span> {track.year}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="grow">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Busca géneros y canciones..."
          />
        </div>
      </header>

      <main>
        {/* --- Sección de Géneros --- */}
        <h1 className="text-2xl font-bold mb-6">Explorar Géneros</h1>
        {isGenreLoading && (
          <p className="text-gray-400">Cargando géneros...</p>
        )}
        {genreError && <p className="text-red-500">Error: {genreError}</p>}

        {!isGenreLoading && !genreError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredGenres.length > 0 ? (
              filteredGenres.map((item, index) => {
                const colorClass = genreColors[index % genreColors.length];
                return (
                  <a
                    key={item.id}
                    href={`/music/buscar/${item.id}`} // Esto te llevará a la pág. de detalle del género
                    className={`rounded-lg p-4 aspect-video flex items-end justify-start cursor-pointer ${colorClass}`}
                  >
                    <h2 className="font-semibold text-lg text-white">
                      {item.genre}
                    </h2>
                  </a>
                );
              })
            ) : (
              <p className="text-gray-400 col-span-full">
                No se encontraron géneros que coincidan con &quot;{searchTerm}
                &quot;.
              </p>
            )}
          </div>
        )}

        {/* --- Sección de Resultados de Canciones --- */}
        <h2 className="text-2xl font-bold mb-6 mt-10">
          Resultados de Canciones
        </h2>
        <div className="mt-4 border rounded-xl bg-background shadow-lg min-h-[150px]">
          {renderSongResults()}
        </div>
        
      </main>
    </div>
  );
}

