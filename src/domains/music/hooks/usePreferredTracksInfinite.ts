import useSWRInfinite from "swr/infinite";
import { fetchPreferredTracksPage } from "../services/preferredTracks.service";
import { Track } from "../store/playerStore";

interface UsePreferredTracksInfiniteResult {
    items: Track[];
    isLoading: boolean;
    isValidating: boolean;
    loadMore: () => void;
    hasMore: boolean;
    emptyPreferredGenres: boolean;
    error: Error | undefined;
    mutate: () => void;
}

export const usePreferredTracksInfinite = (token: string | null, limit: number = 20): UsePreferredTracksInfiniteResult => {
    const getKey = (pageIndex: number, previousPageData: { nextPage: number | null } | null) => {
        if (!token) return null;
        if (previousPageData && !previousPageData.nextPage) return null;
        return ["preferred-tracks", token, limit, pageIndex + 1];
    };

    const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
        getKey,
        async ([, tokenKey, limitKey, pageKey]: [string, string, number, number]) => {
            return await fetchPreferredTracksPage(tokenKey, pageKey, limitKey);
        },
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        },
    );

    const isLoading = !data && !error;
    const emptyPreferredGenres = data?.[0]?.emptyPreferredGenres || false;
    const items = data ? data.flatMap((page) => page.items) : [];
    const hasMore = data && data[data.length - 1]?.nextPage !== null;

    const loadMore = () => {
        if (!isValidating && hasMore) {
            setSize(size + 1);
        }
    };

    return {
        items,
        isLoading,
        isValidating,
        loadMore,
        hasMore: hasMore || false,
        emptyPreferredGenres,
        error,
        mutate: () => mutate(),
    };
};
