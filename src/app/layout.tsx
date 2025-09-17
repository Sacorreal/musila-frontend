import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../domains/auth/store/authStore";
import { AppThemeProvider } from "@/shared/ThemeProvider";

export const metadata: Metadata = {
    title: "Musila app",
    description: "Descubre canciones inéditas de tus compositores favoritos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="antialiased">
                <AppThemeProvider>
                    <AuthProvider>{children}</AuthProvider>
                </AppThemeProvider>
            </body>
        </html>
    );
}
