import { LoginSchema } from "@/app/login/components/LoginForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://musila-develop-flke3.ondigitalocean.app";

interface LoginResponse {
    token: string;
}

export const loginUser = async (credentials: LoginSchema): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data: LoginResponse = await response.json();

    if (!data.token) {
        throw new Error("La respuesta de la API no contiene el token o el userId.");
    }

    return data;
};
