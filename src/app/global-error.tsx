"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="es">
            <body>
                <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
                    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-center">
                        <h1 className="text-2xl font-bold">Error global</h1>
                        <p className="text-sm opacity-70">Hubo un problema con la aplicación.</p>
                        <button onClick={() => reset()} className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                            Reintentar
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
