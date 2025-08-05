import { ApolloWrapper } from "@/lib/apollo-wrapper";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./Store/authStore";

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
    <html lang="es">
      <ApolloWrapper>
        <AuthProvider>
          <body className={`antialiased`}>
            {children}
          </body>
        </AuthProvider>
      </ApolloWrapper>
    </html>
  );
}
