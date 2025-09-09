"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { IntModal } from "@/domains/music/ui/IntModal";
import { Modal } from "@/shared/components/UI/Modal";
import { SongDetail } from "@/domains/music/types";
import {
  fetchSongDetails,
  saveSongChanges,
} from "@/domains/music/services/song.service";
import { SongRequestsForSongTable } from "@/domains/music/ui/SongRequestsTable";

// --- Componente de Carga ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <LoaderCircle className="animate-spin text-primary h-12 w-12" />
  </div>
);

// --- Componente Principal del Formulario ---
export const EditForm = () => {
  const router = useRouter();
  const params = useParams();
  const songId = params.songId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songData, setSongData] = useState<SongDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (songId) {
      const loadDetails = async () => {
        setIsLoading(true);
        const details = await fetchSongDetails(songId);
        setSongData(details);
        setIsLoading(false);
      };
      loadDetails();
    }
  }, [songId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!songData) return;
    const { name, value } = e.target;
    setSongData({ ...songData, [name]: value });
  };

  const handleToggleVisibility = () => {
    if (!songData) return;
    setSongData({ ...songData, visible: !songData.visible });
  };

  const handleSaveChanges = async () => {
    if (!songData) return;
    setIsSaving(true);
    await saveSongChanges(songData);
    setIsSaving(false);
    alert("Cambios guardados");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!songData) {
    return <div>No se encontró la canción.</div>;
  }

  return (
    <div className="p-4 sm:p-8 text-foreground">
      {/* --- Encabezado con Botón de Volver y Guardar --- */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary/90 transition-colors disabled:bg-gray-500 cursor-pointer"
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* --- Contenido Principal --- */}
      <h1 className="text-4xl font-bold mb-4">{songData.title}</h1>

      <div className="w-full max-w-2xl mx-auto mb-8">
        <Image
          src={songData.cover}
          alt={songData.title}
          width={800}
          height={450}
          className="rounded-xl object-cover aspect-video"
        />
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded-full cursor-pointer"
        >
          Propiedad Intelectual
        </button>
        <button className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded-full">
          Códigos ISRC
        </button>
      </div>

      {/* --- Formulario de Detalles --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-assets pb-2">
          Detalle de la Canción
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Género y Subgénero */}
          <label className="flex flex-col gap-2">
            <span className="font-medium">Género</span>
            <select
              name="genre"
              value={songData.genre}
              onChange={handleChange}
              className="bg-secondary border border-assets rounded-lg p-3"
            >
              <option>Rock</option>
              <option>Pop</option>
              <option>Electronic</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium">SubGénero</span>
            <select
              name="subgenre"
              value={songData.subgenre}
              onChange={handleChange}
              className="bg-secondary border border-assets rounded-lg p-3"
            >
              <option>Paseo</option>
              <option>Alternativo</option>
              <option>House</option>
            </select>
          </label>
        </div>

        {/* Visible y Código ISWC */}
        <div className="flex items-center justify-between bg-secondary p-4 rounded-lg">
          <span className="font-medium">Visible</span>
          {/* Simple Toggle Switch */}
          <button
            onClick={handleToggleVisibility}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              songData.visible ? "bg-primary" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                songData.visible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="font-medium text-sm">
            Código ISWC: {songData.iswc}
          </span>
        </div>

        {/* Letra */}
        <label className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold border-b border-assets pb-2">
            Letra
          </h2>
          <textarea
            name="lyrics"
            value={songData.lyrics}
            onChange={handleChange}
            rows={10}
            className="bg-secondary border border-assets rounded-lg p-3 w-full leading-relaxed"
          />
        </label>

        <div>
          <h2 className="text-2xl font-bold border-b border-assets pb-2 mb-4">
            Solicitudes
          </h2>
           
          <SongRequestsForSongTable songId={songId} />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propiedad Intelectual"
      >
        <IntModal songId={songId} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
