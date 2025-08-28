import { z } from "zod";
import { GENRES } from "@domains/tracks/constants/genres";

export const songSchema = z.object({
    name: z.string().min(2, "Requerido"),
    author: z.string().min(2, "Requerido"),
    genre: z.enum(GENRES),
    subgenre: z.string().min(1, "Selecciona un subgénero"),
    lyrics: z.string().max(10000, "Máximo 10000 caracteres").optional(),
    image: z.any().optional(),
    song: z.any()
});

export type SongFormData = z.infer<typeof songSchema>;

export interface Notification {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    duration?: number;
}

export interface UploadProgress {
    song: number;
    image: number;
}

export interface UploadStatus {
    isUploading: boolean;
    progress: UploadProgress;
    error: string | null;
}

export interface FileUploadProps {
    onFileSelect: (file: File) => void;
    acceptedTypes: string[];
    maxSize: number;
    isUploading?: boolean;
    currentFile?: File | null;
    placeholder?: string;
}
