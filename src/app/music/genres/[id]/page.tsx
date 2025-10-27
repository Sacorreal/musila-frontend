"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Urls } from "../../../../shared/constants";
import { ArrowLeft, Play, MoreVertical, X, ListPlus, Send } from "lucide-react";
import Image from "next/image";
import {
  usePlayerStore,
  Track as PlayerTrack,
} from "../../../../domains/music/store/playerStore";
import { Spinner } from "@/shared/components/UI/Spinner";

// --- Tipos de Datos ---
type ApiTrack = {
  id: string;
  title: string;
  cover: string | null;
  url: string;
  duration?: number | string | null;

  authors: Array<{
    name: string;
    lastName: string;
    role: string;
  }>;

  subGenre: string | null;
  language: string;
  isGospel: boolean;
  awards: string[];
};

// Adaptamos el tipo GenreDetails para que use el nuevo ApiTrack
type GenreDetails = {
  id: string | number;
  genre: string;
  tracks: ApiTrack[];
};

const ITEMS_PER_PAGE = 10;

// --- Componente Principal ---
export default function GenreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // --- Estados del Componente ---
  const [genreName, setGenreName] = useState("");
  const [allTracks, setAllTracks] = useState<ApiTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<ApiTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    isGospel: false,
    subGenre: "all",
    language: "all",
    awards: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<ApiTrack | null>(null);
  const [subGenreOptions, setSubGenreOptions] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);

  const { setQueue, playTrack } = usePlayerStore();

  // --- CAMBIO PRINCIPAL: Lógica de fetch actualizada ---
  useEffect(() => {
    if (!id) return;

    const fetchGenreDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usamos la nueva URL para obtener solo el género que necesitamos
        const response = await fetch(Urls.genres.one(id));

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`El género con ID "${id}" no fue encontrado.`);
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }

        // La respuesta ya no es un array, es un único objeto de género
        const genreData: GenreDetails = await response.json();

        if (genreData && genreData.tracks) {
          // Guardamos el nombre y las canciones en el estado
          setGenreName(genreData.genre);
          setAllTracks(genreData.tracks);

          // Esta lógica para extraer filtros sigue siendo la misma
          const subGenres = [
            ...new Set(genreData.tracks.map((t) => t.subGenre).filter(Boolean)),
          ] as string[];
          const languages = [
            ...new Set(genreData.tracks.map((t) => t.language).filter(Boolean)),
          ] as string[];
          setSubGenreOptions(subGenres);
          setLanguageOptions(languages);
        } else {
          throw new Error(
            `La respuesta para el género "${id}" no tiene el formato esperado.`
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGenreDetails();
  }, [id]);

  // El resto de la lógica de filtrado no necesita cambios
  useEffect(() => {
    let tracks = [...allTracks];
    if (filters.isGospel) {
      tracks = tracks.filter((track) => track.isGospel);
    }
    if (filters.subGenre !== "all") {
      tracks = tracks.filter((track) => track.subGenre === filters.subGenre);
    }
    if (filters.language !== "all") {
      tracks = tracks.filter((track) => track.language === filters.language);
    }
    if (filters.awards === "has_awards") {
      tracks = tracks.filter(
        (track) => track.awards && track.awards.length > 0
      );
    }
    setFilteredTracks(tracks);
    setCurrentPage(1);
  }, [filters, allTracks]);

  // Handlers (sin cambios)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleGospelToggle = () =>
    setFilters((prev) => ({ ...prev, isGospel: !prev.isGospel }));
  const clearFilters = () =>
    setFilters({
      isGospel: false,
      subGenre: "all",
      language: "all",
      awards: "all",
    });
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const openModal = (track: ApiTrack) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  // Variables de Renderizado
  const totalPages = Math.ceil(filteredTracks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTracks = filteredTracks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const mapApiTrackToPlayerTrack = (track: ApiTrack): PlayerTrack | null => {
    if (typeof track.url !== "string" || track.url.length === 0) {
      console.warn(
        `[MAPPER-SKIP] Pista omitida debido a URL inválida/faltante: ${track.title}`
      );
      return null; // Devolvemos null si la pista no es reproducible
    }

    // Mapeo al tipo PlayerTrack
    return {
      id: track.id,
      title: track.title,
      cover: track.cover || "",
      url: track.url,
      duration: typeof track.duration === "number" ? track.duration : undefined,
      authors: track.authors || [],
    } as PlayerTrack;
  };

  // 3. HANDLER para reproducir una sola pista
  const handlePlayTrack = (track: ApiTrack) => {
    const playerTrack = mapApiTrackToPlayerTrack(track);
    if (playerTrack) {
      playTrack(playerTrack);
    } else {
      console.warn(
        `[PLAYTRACK-SKIP] No se puede reproducir la pista "${track.title}" debido a URL inválida.`
      );
    }
  };

  // 4. HANDLER para reproducir toda la lista (Botón PLAY grande)
  const handlePlayAll = () => {
    if (allTracks.length === 0) return; 

    const playerQueue = allTracks
      .map(mapApiTrackToPlayerTrack)
      .filter((track): track is PlayerTrack => track !== null);

    if (playerQueue.length === 0) {
      console.error(
        "[PLAYALL-ERROR] No se encontraron pistas válidas para reproducir."
      );
      return;
    } // Establecer la cola y empezar desde la primera canción
    setQueue(playerQueue, 0);
  };

  return (
    <div className="min-h-screen">
      <header className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary"
        >
          <ArrowLeft size={20} /> Volver
        </button>
      </header>

      {loading && <Spinner />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <main>
          <h1 className="text-4xl font-bold mb-4">{genreName}</h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <button
              onClick={handlePlayAll}
              disabled={loading || allTracks.length === 0}
              className="bg-primary text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-transform cursor-pointer"
            >
              <Play size={20} /> Play
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleGospelToggle}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  filters.isGospel
                    ? "bg-white text-black"
                    : "bg-assets text-white"
                }`}
              >
                Gospel
              </button>
              <select
                name="subGenre"
                value={filters.subGenre}
                onChange={handleFilterChange}
                className="bg-assets text-white rounded-full px-4 py-1.5 text-sm appearance-none focus:outline-none"
              >
                <option value="all">Subgénero</option>
                {subGenreOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                className="bg-assets text-white rounded-full px-4 py-1.5 text-sm appearance-none focus:outline-none"
              >
                <option value="all">Idioma</option>
                {languageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                onClick={clearFilters}
                className="bg-assets text-white rounded-full px-4 py-1.5 text-sm flex items-center gap-1"
              >
                Eliminar filtros <X size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-text-secondary text-sm border-b border-assets">
                <tr>
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">TÍTULO</th>
                  <th className="p-4">AUTOR</th>
                  <th className="p-4">SUBGÉNERO</th>
                  <th className="p-4 w-16 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedTracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className="hover:bg-assets transition-colors group"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <td className="p-4 text-center text-text-secondary">
                      {startIndex + index + 1}
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <Image
                        src={
                          track.cover ||
                          "https://placehold.co/40x40/18181b/ffffff?text=?"
                        }
                        alt={track.title}
                        height={10}
                        width={20}
                        className="w-10 h-10 rounded-md object-cover bg-zinc-700"
                      />
                      <span className="font-semibold">
                        {track.title || "Título no disponible"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {
                        // Lógica correcta y segura:
                        track.authors
                          ?.filter((author) => author.role === "autor")
                          .map((a) => `${a.name} ${a.lastName}`)
                          .join(", ") ||
                          "N/A"
                      }
                    </td>
                    <td className="p-4 text-gray-400">
                      {track.subGenre || "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openModal(track)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTracks.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No se encontraron canciones con los filtros aplicados.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-800 rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zinc-800 rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      )}
      

      {isModalOpen && selectedTrack && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-assets rounded-lg p-6 w-full max-w-sm relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold mb-2">{selectedTrack.title}</h2>
            <p className="text-sm text-gray-400 mb-6">
              {
                selectedTrack.authors
                  ?.map((a) => `${a.name} ${a.lastName}`)
                  .join(", ") || 'Autor(es) no disponible(s)'
              }
            </p>
            <div className="flex flex-col gap-3">
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-md flex items-center gap-3 transition-colors">
                <ListPlus size={20} /> Agregar a lista de reproducción
              </button>
              <button className="w-full text-left p-3 hover:bg-white/10 rounded-md flex items-center gap-3 transition-colors">
                <Send size={20} /> Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
