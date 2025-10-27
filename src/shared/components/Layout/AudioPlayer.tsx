"use client";

import {
  Heart,
  ListMusic,
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Track,
  usePlayerStore,
} from "../../../domains/music/store/playerStore";
import PlaylistModal from "./PlaylistModal";

type Props = {
  className?: string;
  initialQueue?: Track[];
  startIndex?: number;
  playlists?: {
    id: string;
    name: string;
    author?: string;
    coverUrl?: string;
  }[];
  onCreateList?: (name: string) => void;
  onAddToList?: (playlistId: string, track?: Track) => void;
};

export default function AudioPlayer({
  className,
  initialQueue,
  startIndex = 0,
  playlists = [],
  onCreateList,
  onAddToList,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const {
    isPlaying,
    volume,
    muted,
    repeat,
    setQueue,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    toggleMute,
    // --- CORRECCIÓN AQUÍ ---
    // La función se llama getCurrentTrack en el store
    getCurrentTrack,
  } = usePlayerStore();

  const current = getCurrentTrack();
  const getArtistName = (track: Track | undefined) => {
    if (!track?.authors?.length) {
      return "Artista Desconocido";
    }
    // Concatena Nombre y Apellido de todos los autores
    return track.authors.map((a) => `${a.name} ${a.lastName}`).join(", ");
  };

  useEffect(() => {
    if (initialQueue && initialQueue.length) {
      console.log(
        `[PLAYER-INIT] Setting initial queue of ${initialQueue.length} tracks starting at index ${startIndex}.`
      );
      setQueue(initialQueue, startIndex);
    } else {
      console.log("[PLAYER-INIT] No initial queue provided.");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueue, startIndex]);

  useEffect(() => {
    if (!audioRef.current) {
      console.log("[PLAYER-ERROR] Audio element not ready.");
      return;
    }
    if (!current) {
      console.log("[PLAYER-STATUS] No current track set.");
      audioRef.current.pause();
      return;
    }

    const audioEl = audioRef.current;
    const currentAudioUrl = current.url; 

    if (typeof currentAudioUrl !== 'string' || currentAudioUrl.length === 0) {
      console.error(`[PLAYER-ERROR] Track URL is invalid or undefined for track: ${current.title}. Cannot load audio.`);
      audioEl.pause();
      return;
    }

    console.log(
      `[PLAYER-CURRENT] Track: ${
        current.title
      }, URL: ${currentAudioUrl.substring(0, 50)}...` 
    );

    if (audioEl.src !== currentAudioUrl) {
      console.log(
        `[PLAYER-SRC-CHANGE] Loading new source for ${
          current.title
        }. Old SRC: ${audioEl.src.substring(0, 50)}...`
      );
      audioEl.src = currentAudioUrl;
      audioEl.load();

      if (isPlaying) {
        console.log("[PLAYER-ACTION] Attempting play after SRC change.");
        audioEl
          .play()
          .catch((error) =>
            console.error(
              "[PLAYER-ERROR] Error al reproducir audio tras cambio de src (CORS/Format):",
              error
            )
          );
      }
    }
    else {
      console.log(`[PLAYER-STATUS] SRC is same. isPlaying: ${isPlaying}`);
      if (isPlaying) {
        console.log("[PLAYER-ACTION] Playing.");
        audioEl
          .play()
          .catch((error) =>
            console.error(
              "[PLAYER-ERROR] Error al reproducir audio (CORS/Format):",
              error
            )
          );
      } else {
        console.log("[PLAYER-ACTION] Pausing.");
        audioEl.pause();
      }
    }
  }, [current, isPlaying]); 

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const setProgressBarBackground = (percent: number) => {
    const el = progressRef.current as HTMLInputElement | null;
    if (!el) return;
    const played = Math.max(0, Math.min(100, percent));
    el.style.background = `linear-gradient(to right, rgb(239 68 68) ${played}%, rgb(71 85 105) ${played}%)`;
    el.style.height = "6px";
    el.style.borderRadius = "9999px";
  };

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
    if (progressRef.current && el.duration) {
      const percent = (el.currentTime / el.duration) * 100;
      progressRef.current.value = String(percent);
      setProgressBarBackground(percent);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const percent = Number(e.target.value);
    el.currentTime = (percent / 100) * el.duration;
    setProgressBarBackground(percent);
  };

  const onEnded = () => {
    console.log(`[PLAYER-ENDED] Track ended. Repeat mode: ${repeat}`);
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    next();
  };

  const formatTime = (sec: number) => {
    if (!sec || Number.isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const [showPlaylists, setShowPlaylists] = useState(false);

  return (
    <div
      className={`w-full bg-card-bg text-bg-card px-3 sm:px-4 md:px-6 py-3 md:py-4 border-t border-white/10 ${
        className ?? ""
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        {/* Izquierda: carátula y info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 md:flex-[2]">
          {current?.cover ? (
            <Image
              src={current.cover}
              alt={current.title}
              width={56}
              height={56}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-gray-700 flex items-center justify-center">
              <Music className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold truncate text-base sm:text-lg">
              {current?.title ?? "Ninguna canción"}
            </div>
            <div className="text-xs sm:text-sm  truncate">
                           {" "}
              {current
                ? getArtistName(current)
                : "Selecciona una canción para reproducir"}
                         {" "}
            </div>
          </div>
          <button
            className="ml-2 hover:scale-105 transition-transform hidden sm:inline-flex"
            title="Me gusta"
          >
            <Heart className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Centro: controles principales */}
        <div className="flex items-center gap-4 sm:gap-5 justify-center md:flex-1">
          <button
            onClick={prev}
            title="Anterior"
            className=" transition-colors disabled:opacity-50"
            disabled={!current}
          >
            <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title={isPlaying ? "Pausar" : "Reproducir"}
            disabled={!current}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
          <button
            onClick={next}
            title="Siguiente"
            className=" transition-colors disabled:opacity-50"
            disabled={!current}
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Derecha: lista, volumen, shuffle, repeat, fullscreen placeholder */}
        <div className="flex items-center gap-3 sm:gap-5 justify-end md:flex-1">
          <button
            className=" transition-colors hidden sm:inline-flex"
            title="Lista"
            onClick={() => setShowPlaylists(true)}
          >
            <ListMusic className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="transition-colors"
              title={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 sm:w-24 md:w-28 hidden sm:block bg-primary"
            />
          </div>
          <button
            onClick={toggleShuffle}
            className="transition-colors hidden sm:inline-flex"
            title="Aleatorio"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={cycleRepeat}
            className="transition-colors hidden sm:inline-flex"
            title="Repetir"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center gap-3 mt-3 md:mt-4">
        <span className="text-[11px] sm:text-xs tabular-nums text-white/90">
          {formatTime(currentTime)}
        </span>
        <input
          ref={progressRef}
          type="range"
          min={0}
          max={100}
          step={0.1}
          defaultValue={0}
          onChange={handleSeek}
          className="w-full accent-primary cursor-pointer disabled:cursor-not-allowed"
          disabled={!current}
        />
        <span className="text-[11px] sm:text-xs tabular-nums text-white/90">
                   {" "}
          {audioRef.current?.duration
            ? formatTime(audioRef.current.duration)
            : "0:00"}
                 {" "}
        </span>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />

      <PlaylistModal
        isOpen={showPlaylists}
        onClose={() => setShowPlaylists(false)}
        playlists={playlists}
        onCreateList={(name) => onCreateList?.(name)}
        onAddToList={(id) => onAddToList?.(id, current ?? undefined)}
      />
    </div>
  );
}
