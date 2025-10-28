import { User } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://musila-develop-flke3.ondigitalocean.app";
const USER_STORAGE_KEY = "musila:user";

/**
 * Obtiene el usuario desde el backend
 */
export const fetchUserById = async (userId: string, token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("No autorizado");
        }
        if (response.status === 404) {
            throw new Error("Usuario no encontrado");
        }
        throw new Error("Error al obtener usuario");
    }

    const user = await response.json();

    // Guardar en caché localStorage
    if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    return user;
};

/**
 * Obtiene el usuario actual (desde caché o backend)
 */
export const getCurrentUser = async (): Promise<User> => {
    // Intentar leer desde caché primero
    if (typeof window !== "undefined") {
        const storedUserRaw = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUserRaw) {
            try {
                const storedUser = JSON.parse(storedUserRaw);
                // Retornar usuario en caché (la hidratación desde backend se hace en el provider)
                return storedUser;
            } catch (error) {
                console.error("Error al parsear usuario guardado:", error);
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
    }

    throw new Error("No hay usuario en caché");
};

/**
 * Actualiza el usuario en el backend
 */
export const updateUser = async (userId: string, token: string, input: Partial<User> & { passwordActual?: string; passwordNueva?: string }): Promise<User> => {
    const { passwordActual, passwordNueva, ...userData } = input;
    void passwordActual;
    void passwordNueva;
    const body: Partial<User> = userData;

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("No autorizado");
        }
        throw new Error("Error al actualizar usuario");
    }

    const updatedUser = await response.json();

    // Actualizar caché
    if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
};

/**
 * Actualiza solo el avatar del usuario
 */
export const updateAvatar = async (userId: string, token: string, avatarUrl: string): Promise<User> => {
    return updateUser(userId, token, { avatar: avatarUrl });
};
