"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchBar } from "@/shared/components/UI/Searchbar";
import { Loader2, AlertTriangle } from "lucide-react";

const API_BASE_URL = "https://musila-develop-flke3.ondigitalocean.app";

// --- Tipos de datos ---

// Define la interfaz del Track basado en la respuesta que proporcionaste
interface Track {
  id: string;
  title: string;
  subGenre: string;
  year: number;
  language: string;
  // Puedes añadir otros campos necesarios
}

// Hook personalizado para Debounce (IMPORTANTE para no saturar la API)
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aplica debounce al término de búsqueda (ej. 500ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchResults = async () => {
      // Si el término de búsqueda está vacío, borra los resultados y detente
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Usa el endpoint que te proporcionó el back-end
        const url = `${API_BASE_URL}/tracks/search?q=${encodeURIComponent(
          debouncedSearchTerm
        )}`;

        const response = await axios.get(url);

        setSearchResults(response.data || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(
          "Ocurrió un error al buscar. Asegúrate de que el servidor esté activo."
        );
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]); // Se ejecuta solo cuando el término de búsqueda debounced cambia

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-gray-400">
            Buscando canciones, autores y géneros...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center p-8 text-red-500">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>{error}</p>
        </div>
      );
    }

    if (!debouncedSearchTerm.trim()) {
      return (
        <p className="text-center text-gray-500 p-8">
          Ingresa un término para comenzar la búsqueda.
        </p>
      );
    }

    if (searchResults.length === 0) {
      return (
        <p className="text-center text-gray-500 p-8">
          No se encontraron resultados para &quot;{debouncedSearchTerm}&quot;.
        </p>
      );
    }

    // Muestra la lista de resultados de la búsqueda
    return (
      <ul className="space-y-4 p-4">
        {searchResults.map((track) => (
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
            {/* Si el back-end incluyera el autor, lo mostrarías aquí */}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Búsqueda Global</h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Busca canciones, autores y géneros..."
        className="mb-8"
      />

      {/* Resultados de la Búsqueda */}
      <div className="mt-6 border rounded-xl bg-background shadow-lg min-h-[200px]">
        {renderContent()}
      </div>
    </div>
  );
}
