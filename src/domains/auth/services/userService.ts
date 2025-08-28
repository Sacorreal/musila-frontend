import { User } from "../types";

const USER_STORAGE_KEY = "musila:user";
const SESSION_STORAGE_KEY = "userSession";

// --- Tipos para mayor seguridad ---
type UserSessionData = {
  email: string;
  loggedIn: boolean;
};

type UserUpdateInput = Partial<Omit<User, 'id'>> & {
  passwordActual?: string;
  passwordNueva?: string;
};


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
    return JSON.parse(storedUser) as User;
  }

  const session = localStorage.getItem(SESSION_STORAGE_KEY);
  if (session) {
    const { email } = JSON.parse(session) as UserSessionData;
    const defaultUser = createDefaultUser(email);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }

  throw new Error("No hay sesión activa");
};

export const updateUser = async (input: UserUpdateInput): Promise<User> => {
  const currentUser = await getCurrentUser();
  
  const { passwordActual, passwordNueva, ...userDataToUpdate } = input;

  if (passwordActual && passwordNueva) {
    if (passwordActual !== "demo123") {
      throw new Error("La contraseña actual es incorrecta");
    }
    // En un caso real, aquí se guardaría la nueva contraseña hasheada
  }

  const updatedUser: User = {
    ...currentUser,
    ...userDataToUpdate,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};
