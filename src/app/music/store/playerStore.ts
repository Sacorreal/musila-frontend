"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Track = {
    id: string;
    title: string;
    artist: string;
    coverUrl?: string;
    audioUrl: string;
    duration?: number; // segundos si se conoce
};

export type RepeatMode = "off" | "one" | "all";

type PlayerState = {
    queue: Track[];
    currentIndex: number; // -1 si vacío
    isPlaying: boolean;
    volume: number; // 0..1
    muted: boolean;
    shuffle: boolean;
    repeat: RepeatMode;
    // acciones
    setQueue: (tracks: Track[], startIndex?: number) => void;
    playTrack: (track: Track, queue?: Track[]) => void;
    togglePlay: () => void;
    play: () => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    toggleShuffle: () => void;
    cycleRepeat: () => void;
    setVolume: (v: number) => void;
    toggleMute: () => void;
    getCurrent: () => Track | undefined;
};

function getNextIndex(state: PlayerState & { queue: Track[]; currentIndex: number }) {
    if (state.queue.length === 0) return -1;
    if (state.shuffle) {
        if (state.queue.length === 1) return state.currentIndex;
        let idx = state.currentIndex;
        while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * state.queue.length);
        }
        return idx;
    }
    const next = state.currentIndex + 1;
    if (next >= state.queue.length) {
        return state.repeat === "all" ? 0 : state.currentIndex;
    }
    return next;
}

function getPrevIndex(state: PlayerState & { queue: Track[]; currentIndex: number }) {
    if (state.queue.length === 0) return -1;
    if (state.shuffle) {
        if (state.queue.length === 1) return state.currentIndex;
        let idx = state.currentIndex;
        while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * state.queue.length);
        }
        return idx;
    }
    const prev = state.currentIndex - 1;
    if (prev < 0) {
        return state.repeat === "all" ? state.queue.length - 1 : state.currentIndex;
    }
    return prev;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            queue: [],
            currentIndex: -1,
            isPlaying: false,
            volume: 0.8,
            muted: false,
            shuffle: false,
            repeat: "off",

            setQueue: (tracks, startIndex = 0) => set(() => ({ queue: tracks, currentIndex: tracks.length ? startIndex : -1, isPlaying: false })),

            playTrack: (track, queue) =>
                set((state) => {
                    const list = queue ?? state.queue;
                    const index = list.findIndex((t) => t.id === track.id);
                    const newQueue = queue ? queue : state.queue.length ? state.queue : [track];
                    const idx = index >= 0 ? index : newQueue.findIndex((t) => t.id === track.id);
                    return {
                        queue: newQueue,
                        currentIndex: idx >= 0 ? idx : 0,
                        isPlaying: false, // No reproducir automáticamente
                    };
                }),

            togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
            pause: () => set(() => ({ isPlaying: false })),
            play: () => set(() => ({ isPlaying: true })),

            next: () =>
                set((state) => {
                    const idx = getNextIndex(state as PlayerState & { queue: Track[]; currentIndex: number });
                    if (idx === -1) return state;
                    if (idx === state.currentIndex && state.repeat !== "one" && state.repeat !== "all" && !state.shuffle) {
                        return { ...state, isPlaying: false };
                    }
                    return { ...state, currentIndex: idx, isPlaying: false }; // No reproducir automáticamente
                }),

            prev: () =>
                set((state) => {
                    const idx = getPrevIndex(state as PlayerState & { queue: Track[]; currentIndex: number });
                    if (idx === -1) return state;
                    return { ...state, currentIndex: idx, isPlaying: false }; // No reproducir automáticamente
                }),

            toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
            cycleRepeat: () =>
                set((s) => {
                    const order: RepeatMode[] = ["off", "one", "all"];
                    const next = order[(order.indexOf(s.repeat) + 1) % order.length];
                    return { repeat: next };
                }),
            setVolume: (v) => set(() => ({ volume: Math.max(0, Math.min(1, v)) })),
            toggleMute: () => set((s) => ({ muted: !s.muted })),
            getCurrent: () => {
                const { queue, currentIndex } = get();
                return currentIndex >= 0 ? queue[currentIndex] : undefined;
            },
        }),
        { name: "musila-player" },
    ),
);
