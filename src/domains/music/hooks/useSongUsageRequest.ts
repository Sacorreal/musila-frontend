"use client";

import { useState } from "react";
import { postSongUsageRequest } from "../services/usageRequests";

interface UseSongUsageRequestResult {
    submit: (songId: string, formData: FormData, token: string) => Promise<void>;
    loading: boolean;
    error: string | null;
    success: boolean;
    reset: () => void;
}

export function useSongUsageRequest(): UseSongUsageRequestResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = async (songId: string, formData: FormData, token: string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await postSongUsageRequest(songId, formData, token);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al enviar solicitud");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    };

    return { submit, loading, error, success, reset };
}

