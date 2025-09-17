import type { Track } from "../../../domains/music/store/playerStore";
// Import estático de la carátula (Next transformará a una URL accesible en tiempo de ejecución)
import cover from "./387682.webp";

type StaticImageImport = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
};

const coverUrl: string = typeof cover === "string" ? cover : (cover as StaticImageImport)?.src;

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
