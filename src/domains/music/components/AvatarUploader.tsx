"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { simulateUploadAvatar } from "@/domains/auth/services/uploadService";

interface AvatarUploaderProps {
    currentAvatarUrl?: string;
    onAvatarChange: (avatarUrl: string) => void;
    disabled?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatarUrl, onAvatarChange, disabled = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona una imagen válida");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen debe ser menor a 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const avatarUrl = await simulateUploadAvatar(file);
            setPreviewUrl(avatarUrl);
            onAvatarChange(avatarUrl);
        } catch (error) {
            alert("Error al procesar la imagen");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = () => {
        setPreviewUrl(null);
        onAvatarChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const displayUrl = previewUrl || currentAvatarUrl;

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-gray-300 dark:border-gray-600">
                    {displayUrl ? (
                        <Image src={displayUrl} alt="Avatar del usuario" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {displayUrl && (
                    <button
                        onClick={handleRemoveAvatar}
                        disabled={disabled || isUploading}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                        aria-label="Quitar avatar"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center space-y-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {isUploading ? "Subiendo..." : displayUrl ? "Cambiar avatar" : "Agregar avatar"}
                </button>

                <p className="text-xs text-text-secondary text-center">JPG, PNG o WebP. Máximo 5MB</p>
            </div>

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" disabled={disabled || isUploading} />
        </div>
    );
};

