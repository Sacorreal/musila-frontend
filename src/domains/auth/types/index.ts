export type User = {
    id: string;
    nombre: string;
    email: string;
    bio?: string;
    avatar?: string;
    ubicacion?: string;
    links?: {
        web?: string;
        instagram?: string;
        youtube?: string;
        soundcloud?: string;
    };
};
