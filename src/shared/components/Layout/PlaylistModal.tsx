"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    playlists: { id: string; name: string; author?: string; coverUrl?: string }[];
    onCreateList: (name: string) => void;
    onAddToList: (playlistId: string) => void;
};

export default function PlaylistModal({ isOpen, onClose, playlists, onCreateList, onAddToList }: Props) {
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-[520px] rounded-xl bg-[#121a27] text-white p-6">
                {!creating ? (
                    <>
                        <div className="text-xl font-semibold mb-4">Añadir a la lista</div>
                        <div className="max-h-80 overflow-auto space-y-3">
                            {playlists.map((pl) => (
                                <button key={pl.id} onClick={() => onAddToList(pl.id)} className="w-full flex items-center gap-3 text-left hover:bg-white/5 rounded-md p-2">
                                    {pl.coverUrl ? (
                                        <Image src={pl.coverUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-white/10" />
                                    )}
                                    <div>
                                        <div className="font-medium">{pl.name}</div>
                                        <div className="text-xs opacity-70">{pl.author ?? ""}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center gap-3 mt-6">
                            <button onClick={onClose} className="border border-gray-500 hover:bg-white/5 text-white rounded-full px-6 py-2 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={() => setCreating(true)} className="bg-red-600 hover:bg-red-500 text-white rounded-full px-6 py-2 transition-colors">
                                Nueva lista
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-3xl font-bold mb-6">Nueva lista</div>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la lista" className="w-full rounded-md bg-white/10 p-3 outline-none" />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setCreating(false);
                                    setName("");
                                }}
                                className="border border-gray-500 hover:bg-white/5 text-white rounded-full px-6 py-2 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (!name.trim()) return;
                                    onCreateList(name.trim());
                                    setCreating(false);
                                    setName("");
                                }}
                                className="bg-red-600 hover:bg-red-500 text-white rounded-full px-6 py-2 transition-colors"
                            >
                                Crear
                            </button>
                        </div>
                    </>
                )}
                <button onClick={onClose} className="absolute right-6 top-4 text-xl">
                    ✕
                </button>
            </div>
        </div>
    );
}
