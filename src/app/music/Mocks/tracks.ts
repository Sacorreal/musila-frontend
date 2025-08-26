import type { Track } from "../store/playerStore";
// Import estático de la carátula (Next transformará a una URL accesible en tiempo de ejecución)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Next.js provee tipos para imports de imágenes; usamos un fallback a string
import cover from "./387682.webp";

const coverUrl: string = typeof cover === "string" ? cover : (cover as any)?.src;

export const blackHoleSunTrack: Track = {
    id: "black-hole-sun",
    title: "Black Hole Sun",
    artist: "Soundgarden",
    coverUrl,
    // Audio de ejemplo para desarrollo. Sustituir por el preview o stream real cuando esté disponible.
    audioUrl: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
    // 5:18 → 318 segundos
    duration: 318,
};

export const mockTracks: Track[] = [blackHoleSunTrack];
