import { z } from "zod";

export const songSchema = z.object({
    name: z.string().min(1, "El nombre de la canción es requerido").max(100, "El nombre es demasiado largo"),
    author: z.string().min(1, "El autor es requerido").max(100, "El nombre del autor es demasiado largo"),
    genre: z.string().min(1, "El género es requerido"),
    image: z.instanceof(File).nullable().optional(),
    song: z.instanceof(File).nullable().refine((file) => file !== null, {
        message: "El archivo de audio es requerido",
    }),
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
