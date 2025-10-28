"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SongUsageRequestForm } from "@/domains/music/components";

export default function RequestUsageDemoPage({ params }: { params: Promise<{ songId: string }> }) {
    const [showModal, setShowModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [songId, setSongId] = useState<string>("");

    useState(() => {
        params.then((p) => setSongId(p.songId));
    });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Demo: Song Usage Request Form</h1>
                    <p className="text-text-secondary">
                        Song ID: <code className="bg-secondary px-2 py-1 rounded">{songId || "loading..."}</code>
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="bg-card-bg p-6 rounded-xl border border-[#3c3069]/20">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Variante: Modal</h2>
                        <p className="text-text-secondary mb-4">El formulario se renderiza en un modal centrado con overlay con animación fade + scale</p>
                        <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                            Abrir Modal
                        </button>

                        <AnimatePresence>
                            {showModal && (
                                <SongUsageRequestForm
                                    songId={songId}
                                    variant="modal"
                                    open={showModal}
                                    onOpenChange={setShowModal}
                                    onSuccess={() => {
                                        console.log("Success callback from modal");
                                        setTimeout(() => setShowModal(false), 2000);
                                    }}
                                    onCancel={() => {
                                        console.log("Cancel callback from modal");
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-card-bg p-6 rounded-xl border border-[#3c3069]/20">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Variante: Drawer</h2>
                        <p className="text-text-secondary mb-4">El formulario se renderiza como un panel lateral desde la derecha con animación slide</p>
                        <button onClick={() => setShowDrawer(true)} className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                            Abrir Drawer
                        </button>

                        <AnimatePresence>
                            {showDrawer && (
                                <SongUsageRequestForm
                                    songId={songId}
                                    variant="drawer"
                                    open={showDrawer}
                                    onOpenChange={setShowDrawer}
                                    onSuccess={() => {
                                        console.log("Success callback from drawer");
                                        setTimeout(() => setShowDrawer(false), 2000);
                                    }}
                                    onCancel={() => {
                                        console.log("Cancel callback from drawer");
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-card-bg p-6 rounded-xl border border-[#3c3069]/20">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Variante: Inline</h2>
                        <p className="text-text-secondary mb-4">El formulario se renderiza directamente en el flujo del documento</p>
                        <div className="mt-6 border-t border-[#3c3069]/20 pt-6">
                            <SongUsageRequestForm
                                songId={songId}
                                variant="inline"
                                onSuccess={() => {
                                    console.log("Success callback from inline");
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card-bg p-6 rounded-xl border border-[#3c3069]/20">
                    <h3 className="text-xl font-bold text-foreground mb-3">Instrucciones de Uso</h3>
                    <div className="space-y-2 text-text-secondary text-sm">
                        <p>
                            <strong className="text-foreground">Import:</strong>{" "}
                            <code className="bg-secondary px-2 py-1 rounded text-xs">{`import { SongUsageRequestForm } from "@/domains/music/components"`}</code>
                        </p>
                        <p>
                            <strong className="text-foreground">Props mínimas:</strong> <code className="bg-secondary px-2 py-1 rounded text-xs">songId</code>
                        </p>
                        <p>
                            <strong className="text-foreground">Variantes:</strong> inline | modal | drawer
                        </p>
                        <p>
                            <strong className="text-foreground">Callbacks:</strong> onSuccess, onCancel, onOpenChange
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
