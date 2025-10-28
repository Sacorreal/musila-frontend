import { Track } from "../store/playerStore";

export interface PreferredTracksPageResponse {
    emptyPreferredGenres: boolean;
    items: Track[];
    nextPage: number | null;
}

export const fetchPreferredTracksPage = async (token: string, page: number, limit: number): Promise<PreferredTracksPageResponse> => {
    try {
        const res = await fetch(`/api/tracks/by-preferred-genres?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (res.status === 404) {
            return { emptyPreferredGenres: true, items: [], nextPage: null };
        }

        if (!res.ok) {
            throw new Error("Error al obtener canciones por géneros preferidos");
        }

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];

        const nextPage = items.length === limit ? page + 1 : null;

        return { emptyPreferredGenres: false, items, nextPage };
    } catch (error) {
        throw error;
    }
};
