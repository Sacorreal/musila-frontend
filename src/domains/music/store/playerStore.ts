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

type PlayerState = {
  queue: Track[];
  currentIndex: number; 
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  // Acciones
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  getCurrentTrack: () => Track | undefined;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // --- ESTADO INICIAL ---
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 0.8,
      muted: false,
      shuffle: false,
      repeat: "off",

      // --- ACCIONES ---

      setQueue: (tracks, startIndex = 0) => {
        const hasTracks = tracks.length > 0;
        set({
          queue: tracks,
          currentIndex: hasTracks ? startIndex : -1,
          isPlaying: hasTracks,
        });
      },

      playTrack: (track, newQueue) => {
        set((state) => {
          const queue = newQueue || state.queue;
          let trackIndex = queue.findIndex((t) => t.id === track.id);

          if (trackIndex === -1) {
            queue.push(track);
            trackIndex = queue.length - 1;
          }
          
          return {
            queue,
            currentIndex: trackIndex,
            isPlaying: true,
          };
        });
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      pause: () => set({ isPlaying: false }),

      next: () => {
        set((state) => {
          const { queue, currentIndex, shuffle, repeat } = state;
          if (queue.length === 0) return {};

          if (shuffle) {
            if (queue.length === 1) return { currentIndex };
            let nextIndex = currentIndex;
            while (nextIndex === currentIndex) {
              nextIndex = Math.floor(Math.random() * queue.length);
            }
            return { currentIndex: nextIndex, isPlaying: true };
          }
          
          if (repeat === "one") {
            return { isPlaying: true };
          }

          const isLastTrack = currentIndex === queue.length - 1;

          if (isLastTrack && repeat === "all") {
            return { currentIndex: 0, isPlaying: true };
          }

          if (isLastTrack) {
            return { isPlaying: false };
          }

          return { currentIndex: currentIndex + 1, isPlaying: true };
        });
      },

      prev: () => {
        set((state) => {
          const { queue, currentIndex, shuffle, repeat } = state;
          if (queue.length === 0) return {};

          if (shuffle) {
             if (queue.length === 1) return { currentIndex };
             let prevIndex = currentIndex;
             while (prevIndex === currentIndex) {
               prevIndex = Math.floor(Math.random() * queue.length);
             }
             return { currentIndex: prevIndex, isPlaying: true };
          }

          const isFirstTrack = currentIndex === 0;

          if (isFirstTrack && repeat === "all") {
            return { currentIndex: queue.length - 1, isPlaying: true };
          }

          if (isFirstTrack) {
            return {}; 
          }

          return { currentIndex: currentIndex - 1, isPlaying: true };
        });
      },

      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

      cycleRepeat: () => {
        set((state) => {
          const order: RepeatMode[] = ["off", "all", "one"];
          const currentOrderIndex = order.indexOf(state.repeat);
          const nextRepeatMode = order[(currentOrderIndex + 1) % order.length];
          return { repeat: nextRepeatMode };
        });
      },

      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),

      toggleMute: () => set((state) => ({ muted: !state.muted })),

      getCurrentTrack: () => {
        const { queue, currentIndex } = get();
        if (currentIndex >= 0 && queue[currentIndex]) {
          return queue[currentIndex];
        }
        return undefined;
      },
    }),
    {
      name: "musila-player", 
      // Opcional: solo persistir ciertas partes del estado para no guardar todo
      partialize: (state) => ({
          queue: state.queue,
          currentIndex: state.currentIndex,
          volume: state.volume,
          muted: state.muted,
          shuffle: state.shuffle,
          repeat: state.repeat,
      }),
    }
  )
);
