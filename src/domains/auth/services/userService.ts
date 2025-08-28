import { User } from "../types";

const USER_STORAGE_KEY = "musila:user";

const createDefaultUser = (email: string): User => ({
    id: "1",
    nombre: "Usuario Demo",
    email,
    bio: "Músico apasionado por crear y compartir música",
    ubicacion: "Bogotá, Colombia",
    links: {
        web: "https://mi-sitio-web.com",
        instagram: "https://instagram.com/miusuario",
        youtube: "https://youtube.com/@miusuario",
        soundcloud: "https://soundcloud.com/miusuario",
    },
});

export const getCurrentUser = async (): Promise<User> => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
        return JSON.parse(storedUser);
    }

    const session = localStorage.getItem("userSession");
    if (session) {
        const { email } = JSON.parse(session);
        const defaultUser = createDefaultUser(email);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
        return defaultUser;
    }

    throw new Error("No hay sesión activa");
};

export const updateUser = async (input: Partial<User> & { passwordActual?: string; passwordNueva?: string }): Promise<User> => {
    const currentUser = await getCurrentUser();

    if (input.passwordActual && input.passwordNueva) {
        if (input.passwordActual !== "demo123") {
            throw new Error("La contraseña actual es incorrecta");
        }
    }

    const updatedUser = {
        ...currentUser,
        ...input,
    };

    delete (updatedUser as Partial<User> & { passwordActual?: string; passwordNueva?: string }).passwordActual;
    delete (updatedUser as Partial<User> & { passwordActual?: string; passwordNueva?: string }).passwordNueva;

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

    return updatedUser;
};
