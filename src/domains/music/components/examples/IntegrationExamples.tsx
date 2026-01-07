"use client";

import { useState } from "react";
import { SongUsageRequestForm } from "../SongUsageRequestForm";
import { Play, MoreVertical } from "lucide-react";

export function ExampleFromAudioPlayer({ songId }: { songId: string }) {
    const [showRequestForm, setShowRequestForm] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <button className="p-2 bg-primary text-white rounded-full">
                <Play className="w-5 h-5" />
            </button>

            <button onClick={() => setShowRequestForm(true)} className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-secondary">
                Solicitar Uso
            </button>

            <SongUsageRequestForm
                songId={songId}
                variant="modal"
                open={showRequestForm}
                onOpenChange={setShowRequestForm}
                onSuccess={() => {
                    alert("¡Solicitud enviada con éxito!");
                    setShowRequestForm(false);
                }}
            />
        </div>
    );
}

export function ExampleFromSongCard({ song }: { song: { id: string; title: string; artist: string } }) {
    const [showDrawer, setShowDrawer] = useState(false);

    return (
        <div className="bg-card-bg p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-foreground">{song.title}</h3>
                    <p className="text-sm text-text-secondary">{song.artist}</p>
                </div>

                <button onClick={() => setShowDrawer(true)} className="p-2 hover:bg-secondary rounded-full">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <SongUsageRequestForm songId={song.id} variant="drawer" open={showDrawer} onOpenChange={setShowDrawer} />
        </div>
    );
}

export function ExampleFromSongDetailPage({ songId }: { songId: string }) {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Detalles de la Canción</h1>
                <p className="text-text-secondary">ID: {songId}</p>
            </div>

            <div className="bg-card-bg p-6 rounded-xl border border-[#3c3069]/20">
                <h2 className="text-xl font-bold text-foreground mb-4">Solicitar Permiso de Uso</h2>
                <SongUsageRequestForm
                    songId={songId}
                    variant="inline"
                    onSuccess={() => {
                        alert("¡Tu solicitud ha sido enviada!");
                    }}
                />
            </div>
        </div>
    );
}

export function ExampleWithCustomLicenses({ songId }: { songId: string }) {
    const [showModal, setShowModal] = useState(false);

    const customLicenses = [
        { value: "basic", label: "Licencia Básica - $50" },
        { value: "standard", label: "Licencia Estándar - $100" },
        { value: "premium", label: "Licencia Premium - $200" },
        { value: "exclusive", label: "Licencia Exclusiva - $500" },
    ];

    return (
        <div>
            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90">
                Ver Opciones de Licencia
            </button>

            <SongUsageRequestForm
                songId={songId}
                variant="modal"
                open={showModal}
                onOpenChange={setShowModal}
                licenseOptions={customLicenses}
                onSuccess={() => {
                    console.log("Solicitud enviada");
                    setShowModal(false);
                }}
            />
        </div>
    );
}

