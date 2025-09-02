"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, Maximize2, Heart, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { Track, usePlayerStore } from "../store/playerStore";
import PlaylistModal from "./PlaylistModal";

type Props = {
    className?: string;
    // opcional: pasar una cola inicial
    initialQueue?: Track[];
    startIndex?: number;
    playlists?: { id: string; name: string; author?: string; coverUrl?: string }[];
    onCreateList?: (name: string) => void;
    onAddToList?: (playlistId: string, track?: Track) => void;
};

export default function AudioPlayer({ className, initialQueue, startIndex = 0, playlists = [], onCreateList, onAddToList }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLInputElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    const { isPlaying, volume, muted, shuffle, repeat, setQueue, togglePlay, play, next, prev, toggleShuffle, cycleRepeat, setVolume, toggleMute, getCurrent } = usePlayerStore();

    const current = getCurrent();

    useEffect(() => {
        if (initialQueue && initialQueue.length) {
            setQueue(initialQueue, startIndex);
        }
    }, [initialQueue, setQueue, startIndex]);

    useEffect(() => {
        if (!audioRef.current || !current) return;
        audioRef.current.src = current.audioUrl;
        audioRef.current.load();
        if (isPlaying) {
            void audioRef.current.play();
        }
    }, [current, isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = muted ? 0 : volume;
    }, [volume, muted]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) void audioRef.current.play();
        else audioRef.current.pause();
    }, [isPlaying]);

    const setProgressBarBackground = (percent: number) => {
        const el = progressRef.current as HTMLInputElement | null;
        if (!el) return;
        const played = Math.max(0, Math.min(100, percent));
        // Degradado que simula progreso: rojo (reproducido) + gris (restante)
        el.style.background = `linear-gradient(to right, rgb(239 68 68) ${played}%, rgb(71 85 105) ${played}%)`;
        el.style.height = "6px"; // ~ h-1.5
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
        if (repeat === "one") {
            audioRef.current?.play();
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
        <div className={`w-full bg-[#0c1420] text-white px-4 py-3 border-t border-white/10 shadow-lg ${className ?? ""}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 md:flex-[2]">
                    {current?.coverUrl && <Image src={current.coverUrl} alt={current.title} width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover" />}
                    <div className="min-w-0">
                        <div className="font-semibold truncate text-base sm:text-lg">{current?.title ?? "Título de la canción"}</div>
                        <div className="text-xs sm:text-sm text-white/70 truncate">{current?.artist ?? "Autor"}</div>
                        {!isPlaying && current && <div className="text-xs text-white/50 truncate">Haz clic en play para reproducir</div>}
                    </div>
                    <button className="ml-2 text-white/70 hover:text-white transition-colors hidden sm:inline-flex" title="Opciones">
                        <EllipsisVertical className="w-5 h-5" />
                    </button>
                    <button className="ml-2 hover:scale-105 transition-transform hidden sm:inline-flex" title="Me gusta">
                        <Heart className="w-5 h-5 text-pink-500" />
                    </button>
                </div>

                <div className="flex items-center gap-4 sm:gap-5 justify-center md:flex-1">
                    <button onClick={prev} title="Anterior" className="text-white/80 hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={isPlaying ? togglePlay : play}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                        title={isPlaying ? "Pausar" : "Reproducir"}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                    <button onClick={next} title="Siguiente" className="text-white/80 hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Derecha: lista, volumen, shuffle, repeat, fullscreen placeholder */}
                <div className="flex items-center gap-3 sm:gap-5 justify-end md:flex-1">
                    <button className="text-white/80 hover:text-white transition-colors hidden sm:inline-flex" title="Lista" onClick={() => setShowPlaylists(true)}>
                        <ListMusic className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors" title={muted ? "Activar sonido" : "Silenciar"}>
                            {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={muted ? 0 : volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-20 sm:w-24 md:w-28 accent-white/90 hidden sm:block"
                        />
                    </div>
                    <button
                        onClick={toggleShuffle}
                        className={`text-white/80 hover:text-white transition-colors hidden sm:inline-flex ${shuffle ? "text-red-400" : ""}`}
                        title="Aleatorio"
                    >
                        <Shuffle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={cycleRepeat}
                        className={`text-white/80 hover:text-white transition-colors hidden sm:inline-flex ${repeat !== "off" ? "text-red-400" : ""}`}
                        title="Repetir"
                    >
                        <Repeat className="w-5 h-5" />
                    </button>
                    <button className="text-white/80 hover:text-white transition-colors hidden sm:inline-flex" title="Pantalla completa">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="flex items-center gap-3 mt-3">
                <span className="text-[11px] sm:text-xs tabular-nums text-white/90">{formatTime(currentTime)}</span>
                <input ref={progressRef} type="range" min={0} max={100} step={0.1} defaultValue={0} onChange={handleSeek} className="w-full accent-red-500 cursor-pointer" />
                <span className="text-[11px] sm:text-xs tabular-nums text-white/90">
                    {audioRef.current?.duration ? formatTime(audioRef.current.duration) : current?.duration ? formatTime(current.duration) : "4:00"}
                </span>
            </div>

            <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} preload="metadata" />

            <PlaylistModal
                isOpen={showPlaylists}
                onClose={() => setShowPlaylists(false)}
                playlists={playlists}
                onCreateList={(name) => onCreateList?.(name)}
                onAddToList={(id) => onAddToList?.(id, current)}
            />
        </div>
    );
}
