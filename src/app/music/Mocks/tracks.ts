import type { Track } from "../../../domains/music/store/playerStore";
import cover from "./387682.webp";

const coverUrl: string = cover.src;

export const blackHoleSunTrack: Track = {
  id: "black-hole-sun",
  title: "Black Hole Sun",
  artist: "Soundgarden",
  coverUrl,
  audioUrl: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
  duration: 318,
};

export const mockTracks: Track[] = [blackHoleSunTrack];
