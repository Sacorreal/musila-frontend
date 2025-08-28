"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Track = {
    id: string;
    title: string;
    artist: string;
    coverUrl?: string;
    audioUrl: string;
    duration?: number; 
};

export type RepeatMode = "off" | "one" | "all";

// Definimos un tipo parcial para las funciones auxiliares, para mayor claridad
type PlayerSlice = Pick<PlayerState, 'queue' | 'currentIndex' | 'shuffle' | 'repeat'>;

type PlayerState = {
    queue: Track[];
    currentIndex: number;
    isPlaying: boolean;
    volume: number; 
    muted: boolean;
    shuffle: boolean;
    repeat: RepeatMode;
    
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

// --- Funciones Auxiliares con Tipos Corregidos ---

function getNextIndex(state: PlayerSlice): number {
    if (state.queue.length === 0) return -1;
    if (state.shuffle) {
        if (state.queue.length === 1) return state.currentIndex;
        let idx = state.currentIndex;
        while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * state.queue.length);
        }
        return idx;
    }
    const nextIdx = state.currentIndex + 1;
    if (nextIdx >= state.queue.length) {
        return state.repeat === "all" ? 0 : state.currentIndex;
    }
    return nextIdx;
}

function getPrevIndex(state: PlayerSlice): number {
    if (state.queue.length === 0) return -1;
    if (state.shuffle) {
        if (state.queue.length === 1) return state.currentIndex;
        let idx = state.currentIndex;
        while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * state.queue.length);
        }
        return idx;
    }
    const prevIdx = state.currentIndex - 1;
    if (prevIdx < 0) {
        return state.repeat === "all" ? state.queue.length - 1 : state.currentIndex;
    }
    return prevIdx;
}

// --- Store de Zustand ---

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

            setQueue: (tracks, startIndex = 0) => set({ 
                queue: tracks, 
                currentIndex: tracks.length ? startIndex : -1, 
                isPlaying: !!tracks.length 
            }),

            playTrack: (track, queue) =>
                set((state) => {
                    const newQueue = queue ?? (state.queue.length ? state.queue : [track]);
                    let trackIndex = newQueue.findIndex((t) => t.id === track.id);

                    if (trackIndex === -1) {
                        newQueue.unshift(track);
                        trackIndex = 0;
                    }
                    
                    return {
                        queue: newQueue,
                        currentIndex: trackIndex,
                        isPlaying: true,
                    };
                }),

            togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
            pause: () => set(() => ({ isPlaying: false })),
            play: () => set(() => ({ isPlaying: true })),

            next: () =>
                set((state) => {
                    const idx = getNextIndex(state);
                    if (idx === -1) return {};
                    if (idx === state.currentIndex && state.repeat === "off" && !state.shuffle) {
                        return { isPlaying: false };
                    }
                    return { currentIndex: idx, isPlaying: true }; 
                }),

            prev: () =>
                set((state) => {
                    const idx = getPrevIndex(state);
                    if (idx === -1) return {};
                    return { currentIndex: idx, isPlaying: true }; 
                }),

            toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
            cycleRepeat: () =>
                set((state) => {
                    const order: RepeatMode[] = ["off", "all", "one"];
                    const nextIndex = (order.indexOf(state.repeat) + 1) % order.length;
                    return { repeat: order[nextIndex] };
                }),
            setVolume: (v) => set(() => ({ volume: Math.max(0, Math.min(1, v)), muted: v === 0 })),
            toggleMute: () => set((state) => ({ muted: !state.muted })),
            getCurrent: () => {
                const { queue, currentIndex } = get();
                return currentIndex >= 0 ? queue[currentIndex] : undefined;
            },
        }),
        { name: "musila-player" },
    ),
);
