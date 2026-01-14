"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { EllipsisVertical, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Track } from "../store/playerStore";

interface PreferredTracksFullItemProps {
  track: Track;
  onPlay: (track: Track) => void;
  onOpenRequest: (trackId: string) => void;
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const PreferredTracksFullItem: React.FC<
  PreferredTracksFullItemProps
> = ({ track, onPlay, onOpenRequest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="group relative w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all p-3 sm:p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className="relative shrink-0 cursor-pointer"
          onClick={() => onPlay(track)}
        >
          <Image
            src={
              track.cover || "https://placehold.co/40x40/18181b/ffffff?text=?"
            }
            alt={track.title}
            height={56}
            width={56}
            className="object-cover bg-zinc-700"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onPlay(track)}
        >
          <h3 className="font-semibold text-foreground truncate">
            {track.title}
          </h3>
          <p className="text-sm text-white/70 truncate">
            {track.authors
              ?.filter((author) => author.role === "autor")
              .map((a) => `${a.name} ${a.lastName}`)
              .join(", ") || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-sm text-white/60 hidden sm:block">
            {formatDuration(track.duration)}
          </span>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-text-secondary hover:text-foreground p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Opciones"
            >
              <EllipsisVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 right-0 z-20 bg-[#0b0f1a] rounded-lg shadow-xl border border-white/10 py-1 min-w-[180px]"
                  >
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      Añadir a playlist
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      Ir a artista
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      Ir a álbum
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      Compartir
                    </button>
                    <button
                      onClick={() => {
                        onOpenRequest(track.id);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      Solicitar uso
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
