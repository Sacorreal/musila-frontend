"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/store/authStore";
import { usePreferredTracksInfinite } from "@/domains/music/hooks/usePreferredTracksInfinite";
import { PreferredTracksFullItem } from "@/domains/music/components/PreferredTracksFullItem";
import { SongUsageRequestForm } from "@/domains/music/components";
import { AnimatePresence } from "framer-motion";
import { Music2, Loader2 } from "lucide-react";
import { Track } from "@/domains/music/store/playerStore";
import { usePlayerStore } from "@/domains/music/store/playerStore";
import { trackEvent } from "@/lib/analytics";

export default function PreferredTracksFullPage() {
    const router = useRouter();
    const { token } = useAuth();
    const { items, isLoading, isValidating, loadMore, hasMore, emptyPreferredGenres } = usePreferredTracksInfinite(token, 20);
    const { playTrack } = usePlayerStore();
    const [requestFormSongId, setRequestFormSongId] = useState<string | null>(null);

    useEffect(() => {
        trackEvent("view_preferred_tracks_full");
    }, []);

    const handlePlay = (track: Track) => {
        trackEvent("click_play", { trackId: track.id });
        playTrack(track, items);
    };

    const handleOpenRequest = (trackId: string) => {
        trackEvent("click_request_usage", { trackId });
        setRequestFormSongId(trackId);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="text-text-secondary hover:text-foreground transition-colors" aria-label="Volver">
                        ←
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold">Tus canciones preferidas</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg bg-white/10 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                </div>
                                <div className="w-12 h-6 bg-white/10 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (emptyPreferredGenres) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="text-text-secondary hover:text-foreground transition-colors" aria-label="Volver">
                        ←
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold">Tus canciones preferidas</h2>
                </div>
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12 flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mt-12">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                        <Music2 className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold">Aún no tienes géneros preferidos.</h3>
                    <p className="text-sm sm:text-base text-white/70">Agrega algunos géneros para ver recomendaciones personalizadas de canciones que te pueden gustar.</p>
                    <button
                        onClick={() => router.push("/perfil/generos")}
                        className="mt-2 px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        Agregar géneros
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="text-text-secondary hover:text-foreground transition-colors" aria-label="Volver">
                    ←
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold">Tus canciones preferidas</h2>
            </div>

            {items.length === 0 ? (
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center max-w-2xl mx-auto mt-12">
                    <p className="text-white/70">No hay canciones disponibles en tus géneros preferidos.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                        {items.map((track) => (
                            <PreferredTracksFullItem key={track.id} track={track} onPlay={handlePlay} onOpenRequest={handleOpenRequest} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                disabled={isValidating}
                                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isValidating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cargando...
                                    </>
                                ) : (
                                    "Cargar más"
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

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
}
