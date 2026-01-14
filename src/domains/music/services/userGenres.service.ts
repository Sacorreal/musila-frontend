export async function hasUserPreferredGenres(token: string): Promise<boolean> {
    try {
        const genresRes = await fetch("/api/users/me/genres", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (genresRes.ok) {
            const data = await genresRes.json();
            const items = Array.isArray(data) ? data : data.items || [];
            return items.length > 0;
        }
    } catch {}

    try {
        const tracksRes = await fetch("/api/tracks/by-preferred-genres", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (tracksRes.status === 200) return true;
        if (tracksRes.status === 404) return false;
    } catch {}

    return false;
}

