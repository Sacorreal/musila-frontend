"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from 'next/navigation'; 
import { useAuth } from "@/domains/auth/store/authStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  AlertTriangle,
  Play,
  Pencil,
  ShoppingCart,
  MoreHorizontal,
  Clock,
  UserPlus,
  Trash2,
  Edit,
  User,
} from "lucide-react";

// --- Componentes de UI (Simulados o importados) ---
import { Skeleton } from "@/shared/components/UI/skeleton";
import { Modal } from "@/shared/components/UI/Modal";
import { Input } from "@/shared/components/UI/Inputs";


// --- Tipos de Datos (Basados en API y Captura) ---
type Owner = {
  id: string;
  name: string;
  lastName: string;
  avatar: string | null;
};

// Tipo para Colaboradores (Guests)
type Guest = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  avatar: string | null;
  // ... otros campos
};

// Tipo para Canciones (Tracks)
type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string | null;
};

// Tipo para el detalle de la Playlist
type PlaylistDetail = {
  id: string;
  title: string;
  owner: Owner;
  cover: string | null;
  guests: Guest[];
  tracks: Track[];
  // ... otros campos
};

// --- Esquema para el Formulario de Colaborador ---
const collaboratorSchema = z.object({
  email: z.string().email("Por favor, introduce un email válido."),
});
type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

// --- Componente: Encabezado de la Playlist ---
const PlaylistHeader: React.FC<{ playlist: PlaylistDetail }> = ({
  playlist,
}) => {
  // Función para calcular duración total (simulada)
  const totalDuration = "4 minutos"; // TODO: Calcular esto desde los tracks
  const trackCount = playlist.tracks.length;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-4 md:p-0">
      <div className="w-40 h-40 md:w-48 md:h-48 relative shrink-0">
        <Image
          src={
            playlist.cover ||
            "https://placehold.co/300x300/151123/9b8fcc?text=Musila"
          }
          alt={playlist.title}
          fill
          className="object-cover rounded-md shadow-lg"
          sizes="(max-width: 768px) 160px, 192px"
        />
      </div>
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-color-text-main">
          {playlist.title}
        </h1>
        <p className="text-sm text-color-text-secondary mt-2">
          {playlist.owner.name} {playlist.owner.lastName} • {trackCount}{" "}
          {trackCount === 1 ? "Canción" : "Canciones"} • {totalDuration}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <button className="flex items-center bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/80 transition-all">
            <Play className="h-5 w-5 mr-1.5 fill-white" />
            Play
          </button>
          <button className="p-2.5 bg-gray-200/10 text-color-text-secondary rounded-full hover:text-white hover:bg-gray-200/20">
            <Pencil className="h-5 w-5" />
          </button>
          <button className="p-2.5 bg-gray-200/10 text-color-text-secondary rounded-full hover:text-white hover:bg-gray-200/20">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="p-2.5 bg-gray-200/10 text-color-text-secondary rounded-full hover:text-white hover:bg-gray-200/20">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Fila de Canción ---
const TrackItem: React.FC<{ track: Track; index: number }> = ({
  track,
  index,
}) => {
  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] items-center gap-4 p-3 hover:bg-gray-500/10 rounded-lg group text-color-text-secondary">
      <span className="text-center">{index + 1}</span>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative rounded overflow-hidden">
          <Image
            src={
              track.imageUrl ||
              "https://placehold.co/100x100/151123/9b8fcc?text=?"
            }
            alt={track.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <span className="font-medium text-color-text-main">
          {track.title}
        </span>
      </div>
      <span>{track.artist}</span>
      <span>{track.album}</span>
      <div className="flex items-center gap-3">
        <span>{track.duration}</span>
        <button className="text-color-text-secondary opacity-0 group-hover:opacity-100 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// --- Componente: Lista de Canciones ---
const TrackList: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  return (
    <div className="mt-8">
      {/* Encabezado de la tabla */}
      <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] items-center gap-4 px-3 py-2 border-b border-gray-200/10 text-xs font-medium text-color-text-secondary uppercase tracking-wider">
        <span>#</span>
        <span>Título</span>
        <span>Artista</span>
        <span>Álbum</span>
        <span className="flex justify-end">
          <Clock className="h-4 w-4" />
        </span>
      </div>
      {/* Lista de canciones */}
      <div className="flex flex-col gap-1 mt-2">
        {tracks.map((track, i) => (
          <TrackItem key={track.id} track={track} index={i} />
        ))}
      </div>
    </div>
  );
};

// --- Componente: Fila de Colaborador ---
const CollaboratorItem: React.FC<{
  collaborator: Guest;
  isOwner: boolean;
  onEdit: (collaborator: Guest) => void;
  onDelete: (collaborator: Guest) => void;
}> = ({ collaborator, isOwner, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-500/10 rounded-lg group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200/10 flex items-center justify-center">
          {collaborator.avatar ? (
            <Image
              src={collaborator.avatar}
              alt={collaborator.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <User className="w-6 h-6 text-color-text-secondary" />
          )}
        </div>
        <div>
          <p className="font-semibold text-color-text-main">
            {collaborator.name} {collaborator.lastName}
          </p>
          <p className="text-sm text-color-text-secondary">
            {collaborator.email}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(collaborator)}
            className="p-2 text-color-text-secondary hover:text-primary"
            title="Editar permisos (TODO)"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(collaborator)}
            className="p-2 text-color-text-secondary hover:text-error"
            title="Eliminar colaborador"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Componente: Formulario de Colaborador ---
const CollaboratorForm: React.FC<{
  playlistId: string;
  onSuccess: (newGuest: Guest) => void;
  onClose: () => void;
}> = ({ playlistId, onSuccess, onClose }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
  });

  const onSubmit: SubmitHandler<CollaboratorFormValues> = async (data) => {
    setServerError(null);
    console.log("Intentando añadir colaborador:", data.email);

    try {
      // --- TODO: Implementar API para añadir colaborador ---
      const response = await fetch(
        `/api/playlists/${playlistId}/collaborators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${playlistId}`,
          },
          body: JSON.stringify({ email: data.email }),
        }
      );
      if (!response.ok) throw new Error("No se pudo añadir al colaborador");
      const newCollaborator = await response.json();

      onSuccess(newCollaborator);
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al añadir colaborador"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-color-text-secondary">
        Invita a alguien a colaborar en esta playlist. Podrá añadir o eliminar
        canciones.
      </p>
      <Input<CollaboratorFormValues>
        id="email"
        label="Email del colaborador"
        type="email"
        placeholder="ejemplo@musila.com"
        register={register}
        error={errors.email}
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
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Invitando..." : "Invitar"}
        </button>
      </div>
    </form>
  );
};

// --- Componente Principal de la Página de Detalle ---
const PlaylistDetailPage: React.FC = () => { 
  const params = useParams();
  const playlistId = typeof params.playlistId === 'string' ? params.playlistId : null;
  
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, isAuthLoading } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Cargar datos de la playlist
  useEffect(() => {
    if (!playlistId || !API_URL) return;

    const fetchPlaylist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/playlists/${playlistId}`);
        if (!response.ok) {
          if (response.status === 404)
            throw new Error("Playlist no encontrada.");
          throw new Error("No se pudo cargar la playlist.");
        }
        const data: PlaylistDetail = await response.json();

        if (data.tracks.length === 0) {
          data.tracks = [
            {
              id: "t1",
              title: "La Última Vez",
              artist: "Silvestre Dangond",
              album: "Las Locuras Mías",
              duration: "04:08",
              imageUrl:
                "https://placehold.co/100x100/3a2f5c/9b8fcc?text=Track1",
            },
          ];
        }

        setPlaylist(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, API_URL]);

  // Handlers de Colaboradores
  const handleAddCollaboratorSuccess = (newGuest: Guest) => {
    setPlaylist((prev) =>
      prev ? { ...prev, guests: [...prev.guests, newGuest] } : null
    );
  };

  const handleEditCollaborator = (collaborator: Guest) => {
    console.log("TODO: Abrir modal de edición para:", collaborator.email);
    setIsModalOpen(true);
    // setModalMode('edit');
    // setSelectedCollaborator(collaborator);
  };

  const handleDeleteCollaborator = (collaborator: Guest) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar a ${collaborator.name} de esta playlist?`
      )
    ) {
      return;
    }
  };

  // --- Renderizado ---
  if (isLoading || isAuthLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-color-text-main">
        {/* Skeleton Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-4 md:p-0">
          <Skeleton className="w-40 h-40 md:w-48 md:h-48 rounded-md shrink-0" />
          <div className="flex flex-col items-center md:items-start gap-3">
            <Skeleton className="h-12 w-64 rounded-lg" />
            <Skeleton className="h-5 w-48 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
        {/* Skeleton List */}
        <div className="mt-12">
          <Skeleton className="h-8 w-full rounded-lg mb-4" />
          <Skeleton className="h-16 w-full rounded-lg mb-2" />
          <Skeleton className="h-16 w-full rounded-lg mb-2" />
          <Skeleton className="h-16 w-full rounded-lg mb-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-color-text-main flex flex-col items-center justify-center min-h-[50vh]">
        <AlertTriangle className="h-16 w-16 text-error" strokeWidth={1} />
        <h2 className="mt-4 text-2xl font-bold">Error al cargar</h2>
        <p className="text-color-text-secondary mt-2">{error}</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-color-text-main flex flex-col items-center justify-center min-h-[50vh]">
        <AlertTriangle className="h-16 w-16 text-color-text-secondary" />
        <h2 className="mt-4 text-2xl font-bold">Playlist no encontrada</h2>
      </div>
    );
  }

  // Comprobar si el usuario actual es el dueño
  const isOwner = !isAuthLoading && userId === playlist.owner.id;

  return (
    <div className="container mx-auto p-4 md:p-8 text-color-text-main">
      {/* Encabezado */}
      <PlaylistHeader playlist={playlist} />

      {/* Lista de Canciones */}
      <div className="mt-10">
        <TrackList tracks={playlist.tracks} />
      </div>

      {/* Sección de Colaboradores */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Colaboradores</h2>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-medium"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Añadir
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 bg-gray-500/5 rounded-lg">
          {playlist.guests.length > 0 ? (
            playlist.guests.map((guest) => (
              <CollaboratorItem
                key={guest.id}
                collaborator={guest}
                isOwner={isOwner}
                onEdit={handleEditCollaborator}
                onDelete={handleDeleteCollaborator}
              />
            ))
          ) : (
            <p className="text-sm text-color-text-secondary text-center py-4">
              {isOwner
                ? "Aún no has añadido colaboradores."
                : "No hay colaboradores en esta playlist."}
            </p>
          )}
        </div>
      </div>

      {/* Modal para Añadir Colaborador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir colaborador"
      >
        <CollaboratorForm
          playlistId={playlist.id}
          onSuccess={handleAddCollaboratorSuccess}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlaylistDetailPage;
