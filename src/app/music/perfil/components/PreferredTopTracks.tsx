"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/store/authStore";
import { fetchPreferredTracks, PreferredTracksResponse } from "@/domains/music/services/song.service";
import { hasUserPreferredGenres } from "@/domains/music/services/userGenres.service";
import { EllipsisVertical, Music2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SongUsageRequestForm } from "@/domains/music/components";
import Image from "next/image";

export const PreferredTopTracks: React.FC = () => {
    const router = useRouter();
    const { token } = useAuth();
    const [data, setData] = useState<PreferredTracksResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [requestFormSongId, setRequestFormSongId] = useState<string | null>(null);
    const [hasGenres, setHasGenres] = useState<boolean>(false);

    const loadTracks = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError(null);
            const [result, hasGenresResult] = await Promise.all([fetchPreferredTracks(token), hasUserPreferredGenres(token)]);
            setData(result);
            setHasGenres(hasGenresResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar canciones");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadTracks();
        }
    }, [token, loadTracks]);

    if (loading) {
        return (
            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Canciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/10" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                </div>
                                <div className="w-6 h-6 bg-white/10 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Canciones</h2>
                <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between">
                    <span className="text-sm text-red-300">No pudimos cargar tus canciones preferidas.</span>
                    <button onClick={loadTracks} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (data?.emptyPreferredGenres) {
        return (
            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Canciones</h2>
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                        <Music2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">Aún no tienes géneros preferidos.</h3>
                    <p className="text-sm text-white/70">Agrega algunos géneros para ver recomendaciones personalizadas.</p>
                    <button
                        onClick={() => router.push("/perfil/generos")}
                        className="mt-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        Agregar géneros
                    </button>
                </div>
            </div>
        );
    }

    const songs = data?.items || [];

    if (songs.length === 0) {
        return (
            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Canciones</h2>
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                    <p className="text-sm text-white/70">No hay canciones disponibles en tus géneros preferidos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold">Top Canciones</h2>
                <div className="flex items-center gap-2">
                    {hasGenres ? (
                        <button aria-disabled="true" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-sm cursor-default select-none transition-colors">
                            Editar géneros
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push("/perfil/generos")}
                            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm active:scale-95 transition-all"
                        >
                            Agregar géneros
                        </button>
                    )}
                    <button
                        onClick={() => router.push("/music/perfil/preferidos/tracks")}
                        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-sm transition-colors"
                    >
                        Ver más
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {songs.map((song) => (
                    <div key={song.id} className="relative w-full rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-3">
                            <Image src={song.cover} alt={song.title} width={48} height={48} className="rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
                                <p className="text-sm text-white/70 truncate">{song.genre}</p>
                            </div>
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === String(song.id) ? null : String(song.id))}
                                    className="text-text-secondary hover:text-foreground p-1 rounded-full hover:bg-white/10 transition-colors"
                                    aria-label="Opciones"
                                >
                                    <EllipsisVertical className="w-5 h-5" />
                                </button>
                                <AnimatePresence>
                                    {openMenuId === String(song.id) && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full mb-2 right-0 z-20 bg-[#0b0f1a] rounded-lg shadow-xl border border-white/10 py-1 min-w-[160px]"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setRequestFormSongId(String(song.id));
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                >
                                                    Solicitar uso
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                >
                                                    Añadir a lista
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {requestFormSongId && (
                    <SongUsageRequestForm
                        songId={requestFormSongId}
                        variant="modal"
                        open={!!requestFormSongId}
                        onOpenChange={(open) => !open && setRequestFormSongId(null)}
                        onSuccess={() => setRequestFormSongId(null)}
                        onCancel={() => setRequestFormSongId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
