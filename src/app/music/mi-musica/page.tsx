"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/domains/auth/store/authStore";

import {
  Music,
  ListPlus,
  Loader2,
  PlusCircle,
  AlertTriangle,
  LogIn,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/UI/card";
import { Skeleton } from "@/shared/components/UI/skeleton";
import { Modal } from "@/shared/components/UI/Modal";
import { Input } from "@/shared/components/UI/Inputs";

// --- Tipos de Datos---
type Owner = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
};

type Playlist = {
  id: string;
  title: string;
  owner: Owner;
  cover: string | null;
  guests: unknown[];
  tracks: unknown[];
  updatedAt: string;
  deletedAt: string | null;
};

const playlistSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(50, "El título no puede tener más de 50 caracteres."),
});

type PlaylistFormValues = z.infer<typeof playlistSchema>;

// --- Componente del Formulario  ---
interface CreatePlaylistFormProps {
  onSuccess: (newPlaylist: Playlist) => void;
  userId: string;
}

const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = ({
  onSuccess,
  userId,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: { title: "" },
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit: SubmitHandler<PlaylistFormValues> = async (data) => {
    setServerError(null);

    if (!userId) {
      setServerError(
        "Error de autenticación. No se pudo identificar al usuario."
      );
      return;
    }
    if (!API_URL) {
      setServerError(
        "Error de configuración: La URL de la API no está definida."
      );
      return;
    }

    try {
      const newPlaylistData = {
        title: data.title,
        owner: userId,
        cover: null,
        guestIds: [],
        trackIds: [],
      };

      const response = await fetch(`${API_URL}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlaylistData),
      });

      if (response.status !== 201) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No se pudo crear la playlist.");
      }

      const newPlaylist: Playlist = await response.json();

      console.log("Playlist creada:", newPlaylist);
      reset();
      onSuccess(newPlaylist);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al crear la playlist."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input<PlaylistFormValues>
        id="title"
        label="Título de la playlist"
        type="text"
        placeholder="Ej. Playlist de Verano 2025"
        register={register}
        error={errors.title}
        disabled={isSubmitting}
      />

      {serverError && <p className="text-sm text-error">{serverError}</p>}

      <div className="flex justify-end pt-2">
        <button
          className="flex items-center bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg cursor-pointer"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ListPlus className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Creando..." : "Crear Playlist"}
        </button>
      </div>
    </form>
  );
};

// --- Componente de Tarjeta de Playlist (Sin cambios) ---
const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const [imgSrc, setImgSrc] = useState(
    playlist.cover || "https://placehold.co/300x300/151123/9b8fcc?text=Musila"
  );

  return (
    <Link href={`/music/mi-musica/${playlist.id}`} passHref>
      <Card className="h-full bg-color-card-bg border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-1 group">
        <CardContent className="p-4">
          <div className="aspect-square w-full overflow-hidden rounded-md mb-4 relative">
            <Image
              src={imgSrc}
              alt={playlist.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover bg-assets transition-transform duration-500 group-hover:scale-110"
              onError={() => {
                setImgSrc(
                  "https://placehold.co/300x300/151123/9b8fcc?text=Musila"
                );
              }}
            />
          </div>
        </CardContent>
        <CardHeader className="p-4 pt-0">
          <CardTitle className="text-base font-bold truncate text-color-text-main group-hover:text-primary">
            {playlist.title}
          </CardTitle>
          <CardDescription className="text-sm text-color-text-secondary">
            {playlist.tracks.length} canciones
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

// --- Componente Principal de la Página (Actualizado) ---
const MiMusicPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Carga de playlists
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- OBTENER ID DE USUARIO (con tu hook useAuth) ---
  const { userId, isAuthLoading, isLoggedIn } = useAuth();

  // --- Carga de Datos ---
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!API_URL) {
        setFetchError(
          "Error de configuración: La URL de la API no está definida."
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError(null);
      try {
        // TODO: Usar el token de autenticación en la cabecera
        const response = await fetch(`${API_URL}/playlists`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar las playlists.");
        }
        const data: Playlist[] = await response.json();
        setPlaylists(data);
      } catch (err) {
        console.error(err);
        setFetchError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido."
        );
        setPlaylists([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [API_URL]);

  // --- Handlers ---
  const handleFormSuccess = (newPlaylist: Playlist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setIsModalOpen(false);
  };

  // --- Renderizado del Modal (Contenido dinámico) ---
  const renderModalContent = () => {
    if (isAuthLoading) {
      return (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    // Si la carga terminó, está logueado y tenemos el ID
    if (isLoggedIn && userId) {
      return (
        <>
          <p className="text-sm text-color-text-secondary mb-4">
            Dale un nombre a tu nueva colección de música. Podrás añadir
            canciones después.
          </p>
          <CreatePlaylistForm onSuccess={handleFormSuccess} userId={userId} />
        </>
      );
    }

    // Si la carga terminó, pero no está logueado
    return (
      <div className="text-center">
        <LogIn className="mx-auto h-10 w-10 text-color-text-secondary mb-3" />
        <p className="text-color-text-secondary">
          Debes iniciar sesión para poder crear una playlist.
        </p>
      </div>
    );
  };

  // --- Renderizado del Contenido Principal ---
  const renderContent = () => {
    // Mostramos Skeletons si las playlists están cargando O si la sesión se está verificando
    if (isLoading || isAuthLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-auto w-full aspect-square rounded-md" />
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      );
    }

    if (fetchError) {
      return (
        <Card className="w-full border-2 border-dashed border-error bg-card-bg/50 text-center p-10">
          <AlertTriangle
            className="mx-auto h-12 w-12 text-error"
            strokeWidth={1}
          />
          <CardTitle className="mt-4 text-xl font-semibold text-color-text-main">
            Error al cargar
          </CardTitle>
          <CardDescription className="mt-2 text-color-text-secondary">
            {fetchError}
          </CardDescription>
        </Card>
      );
    }

    if (playlists.length === 0) {
      return (
        <Card className="w-full border-2 border-dashed bg-card-bg/50 text-center p-10">
          <Music
            className="mx-auto h-12 w-12 text-color-text-secondary"
            strokeWidth={1}
          />
          <CardTitle className="mt-4 text-xl font-semibold text-color-text-main">
            Tu música vive aquí
          </CardTitle>
          <CardDescription className="mt-2 text-color-text-secondary">
            Aún no has creado ninguna playlist. <br />
            {isLoggedIn
              ? 'Haz clic en "Nueva Lista" para empezar.'
              : "Inicia sesión para crear tu primera playlist."}
          </CardDescription>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 text-color-text-main">
      {/* --- Cabecera y Botón de Acción --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mi Música</h1>
        <button
          className="flex items-center bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed" // Estilos para deshabilitado
          onClick={() => setIsModalOpen(true)}
          disabled={!isLoggedIn || isAuthLoading} // Deshabilitado si no está logueado o si está cargando
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Lista
        </button>
      </div>

      {/* --- Contenido Principal (Grilla o Estado Vacío) --- */}
      <div className="mt-4">{renderContent()}</div>

      {/* --- Modal para Crear Playlist (Actualizado) --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear nueva playlist"
      >
        {renderModalContent()} {/* Renderiza el contenido dinámico */}
      </Modal>
    </div>
  );
};

export default MiMusicPage;
