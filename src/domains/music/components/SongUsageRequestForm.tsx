"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Upload, FileImage } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/domains/auth/store/authStore";
import { useSongUsageRequest } from "../hooks/useSongUsageRequest";
import { getUsageLicenseTypes, LicenseType } from "../services/usageRequests";

export interface SongUsageRequestFormProps {
    songId: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    onCancel?: () => void;
    licenseOptions?: LicenseType[];
    variant?: "inline" | "modal" | "drawer";
}

export function SongUsageRequestForm({
    songId,
    open = true,
    onOpenChange,
    onSuccess,
    onCancel,
    licenseOptions: externalLicenseOptions,
    variant = "inline",
}: SongUsageRequestFormProps) {
    const { token } = useAuth();
    const { submit, loading, error, success, reset } = useSongUsageRequest();

    const [message, setMessage] = useState("");
    const [licenseType, setLicenseType] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [licenseOptions, setLicenseOptions] = useState<LicenseType[]>(externalLicenseOptions || []);
    const [fetchingLicenses, setFetchingLicenses] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!externalLicenseOptions && token) {
            setFetchingLicenses(true);
            getUsageLicenseTypes(token)
                .then((types) => setLicenseOptions(types))
                .catch(() => setLocalError("Error al cargar tipos de licencia"))
                .finally(() => setFetchingLicenses(false));
        }
    }, [externalLicenseOptions, token]);

    useEffect(() => {
        if (success) {
            setMessage("");
            setLicenseType("");
            setFile(null);
            setLocalError(null);
            setTimeout(() => {
                onSuccess?.();
                reset();
            }, 1500);
        }
    }, [success, onSuccess, reset]);

    const handleClose = useCallback(() => {
        if (loading) return;
        onOpenChange?.(false);
        onCancel?.();
    }, [loading, onOpenChange, onCancel]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && variant !== "inline") {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [variant, handleClose]);

    useEffect(() => {
        if (open && variant !== "inline" && modalRef.current) {
            modalRef.current.focus();
        }
    }, [open, variant]);

    const validateFile = (file: File): boolean => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            setLocalError("Solo se permiten archivos PNG, JPG o GIF");
            return false;
        }

        if (file.size > maxSize) {
            setLocalError("El archivo no debe superar los 10MB");
            return false;
        }

        setLocalError(null);
        return true;
    };

    const handleFileSelect = (selectedFile: File) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragOver(true);
        } else if (e.type === "dragleave") {
            setDragOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);

        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setLocalError("El mensaje es obligatorio");
            return;
        }

        if (!licenseType) {
            setLocalError("Debes seleccionar un tipo de licencia");
            return;
        }

        if (!token) {
            setLocalError("No se encontró token de autenticación");
            return;
        }

        setLocalError(null);

        const formData = new FormData();
        formData.append("message", message.trim());
        formData.append("licenseType", licenseType);
        if (file) {
            formData.append("file", file);
        }

        try {
            await submit(songId, formData, token);
        } catch {
            setLocalError("Error al enviar la solicitud");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-6 pb-2">
            <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">
                    Mensaje *
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Escribe tu mensaje explicando el uso que le darás a la canción..."
                    className="bg-secondary border border-gray-300 dark:border-gray-600 text-text-main rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white resize-none"
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="licenseType" className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">
                    Tipo de Licencia *
                </label>
                <select
                    id="licenseType"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    disabled={loading || fetchingLicenses}
                    className="w-full px-3 py-2.5 bg-secondary border border-gray-300 dark:border-gray-600 text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Selecciona un tipo de licencia</option>
                    {licenseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {fetchingLicenses && <p className="mt-1 text-xs text-text-secondary">Cargando opciones...</p>}
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">Archivo (opcional)</label>
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
                    } ${loading ? "pointer-events-none opacity-75" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        className="hidden"
                        onChange={handleFileInputChange}
                        disabled={loading}
                    />

                    {!file ? (
                        <div className="space-y-3">
                            <FileImage className="w-10 h-10 text-primary mx-auto" />
                            <div>
                                <p className="text-sm text-text-secondary">
                                    Arrastra y suelta un archivo aquí, o{" "}
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:text-primary/80 underline" disabled={loading}>
                                        selecciona un archivo
                                    </button>
                                </p>
                                <p className="text-xs text-text-secondary mt-1">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FileImage className="w-8 h-8 text-primary" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-text-main">{file.name}</p>
                                    <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            {!loading && (
                                <button type="button" onClick={removeFile} className="p-1 text-text-secondary hover:text-error transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {(localError || error) && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                    <p className="text-sm text-error">{localError || error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-600 dark:text-green-400">Solicitud enviada con éxito</p>
                </div>
            )}

            <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 mt-6 bg-[#0b0f1a] dark:bg-[#0b0f1a] border-t border-white/10 flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-text-main hover:bg-secondary transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || !message.trim() || !licenseType}
                    className="px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Enviar Solicitud
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    if (variant === "inline") {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Solicitar Uso de la Canción</h2>
                    <p className="text-sm text-text-secondary mt-1">Completa el formulario para solicitar permiso de uso</p>
                </div>
                {formContent}
            </div>
        );
    }

    if (!open) return null;

    if (variant === "modal") {
        if (!mounted) return null;

        return createPortal(
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/60 z-[1100]"
                    onClick={handleClose}
                />
                <div
                    className="fixed inset-0 z-[1110] flex items-center justify-center p-4"
                    style={
                        {
                            "--safe-bottom": "calc(env(safe-area-inset-bottom) + var(--player-h, 80px))",
                            "paddingBottom": "var(--safe-bottom)",
                        } as React.CSSProperties
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="w-full max-w-2xl max-h-[min(88vh,720px)] overflow-y-auto rounded-2xl bg-[#0b0f1a] p-4 sm:p-6 shadow-xl text-foreground"
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                    >
                        <div className="flex justify-between items-start mb-4 sticky top-0 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 bg-[#0b0f1a] z-10 border-b border-white/10">
                            <div>
                                <h2 id="modal-title" className="text-xl font-bold text-foreground">
                                    Solicitar Uso de la Canción
                                </h2>
                                <p className="text-sm text-text-secondary mt-1">Completa el formulario para solicitar permiso de uso</p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="text-text-secondary hover:text-foreground ml-4 disabled:opacity-50 flex-shrink-0"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-4">{formContent}</div>
                    </motion.div>
                </div>
            </>,
            document.body,
        );
    }

    if (variant === "drawer") {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 z-50 flex justify-end"
                onClick={handleClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-card-bg dark:bg-[#1e1834] w-full max-w-md h-full overflow-y-auto p-6 text-foreground shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 id="drawer-title" className="text-xl font-bold text-foreground">
                                Solicitar Uso de la Canción
                            </h2>
                            <p className="text-sm text-text-secondary mt-1">Completa el formulario</p>
                        </div>
                        <button onClick={handleClose} disabled={loading} className="text-text-secondary hover:text-foreground disabled:opacity-50" aria-label="Cerrar drawer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {formContent}
                </motion.div>
            </motion.div>
        );
    }

    return null;
}
