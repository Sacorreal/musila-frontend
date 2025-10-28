import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-center">
                <h1 className="text-4xl font-bold text-foreground">404</h1>
                <h2 className="text-xl font-semibold text-foreground">Página no encontrada</h2>
                <p className="text-sm text-text-secondary">La página que buscas no existe.</p>
                <Link href="/" className="inline-block px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

