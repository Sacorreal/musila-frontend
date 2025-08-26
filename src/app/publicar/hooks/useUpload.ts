"use client";

import { useState, useCallback } from "react";
import { UploadStatus } from "../types";

export const useUpload = () => {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
        isUploading: false,
        progress: { song: 0, image: 0 },
        error: null,
    });

    const simulateUpload = useCallback(async (file: File, type: "song" | "image"): Promise<string> => {
        return new Promise((resolve, reject) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);

                    setUploadStatus((prev) => ({
                        ...prev,
                        progress: {
                            ...prev.progress,
                            [type]: progress,
                        },
                    }));

                    // Simular un pequeño delay antes de completar
                    setTimeout(() => {
                        resolve(`https://example.com/uploaded-${type}-${Date.now()}`);
                    }, 500);
                } else {
                    setUploadStatus((prev) => ({
                        ...prev,
                        progress: {
                            ...prev.progress,
                            [type]: progress,
                        },
                    }));
                }
            }, 200);
        });
    }, []);

    const uploadFiles = useCallback(
        async (songFile: File, imageFile: File): Promise<{ songUrl: string; imageUrl: string }> => {
            setUploadStatus({
                isUploading: true,
                progress: { song: 0, image: 0 },
                error: null,
            });

            try {
                // Simular carga paralela de ambos archivos
                const [songUrl, imageUrl] = await Promise.all([simulateUpload(songFile, "song"), simulateUpload(imageFile, "image")]);

                setUploadStatus((prev) => ({
                    ...prev,
                    isUploading: false,
                    progress: { song: 100, image: 100 },
                }));

                return { songUrl, imageUrl };
            } catch (error) {
                setUploadStatus({
                    isUploading: false,
                    progress: { song: 0, image: 0 },
                    error: error instanceof Error ? error.message : "Error al subir archivos",
                });
                throw error;
            }
        },
        [simulateUpload],
    );

    const resetUpload = useCallback(() => {
        setUploadStatus({
            isUploading: false,
            progress: { song: 0, image: 0 },
            error: null,
        });
    }, []);

    return {
        uploadStatus,
        uploadFiles,
        resetUpload,
    };
};
