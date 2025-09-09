"use client";

import React, { useRef, useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { FieldValues, Path } from "react-hook-form";
import { X, Music, Image } from "lucide-react";

interface FileUploadProps<T extends FieldValues> {
    label: string;
    id: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    accept: string;
    maxSize: number; // en MB
    fileType: "audio" | "image";
    onFileSelect?: (file: File) => void;
    progress?: number;
    isUploading?: boolean;
}

export const FileUpload = <T extends FieldValues>({
    label,
    id,
    register,
    error,
    accept,
    maxSize,
    fileType,
    onFileSelect,
    progress = 0,
    isUploading = false,
}: FileUploadProps<T>) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.size > maxSize * 1024 * 1024) {
            return;
        }
        setSelectedFile(file);
        onFileSelect?.(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = () => {
        if (fileType === "audio") {
            return <Music className="w-8 h-8 text-primary" />;
        }
        return <Image className="w-8 h-8 text-primary" />;
    };

    return (
        <div>
            <label htmlFor={id as string} className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">
                {label}
            </label>

            <div
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? "border-primary bg-primary/5" : error ? "border-error bg-error/5" : "border-gray-300 hover:border-primary/50"}
          ${isUploading ? "pointer-events-none opacity-75" : ""}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input type="file" id={id as string} accept={accept} className="hidden" {...register(id)} onChange={handleInputChange} />

                {!selectedFile ? (
                    <div className="space-y-4">
                        {getFileIcon()}
                        <div>
                            <p className="text-sm text-text-secondary">
                                Arrastra y suelta tu archivo aquí, o{" "}
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:text-primary/80 underline">
                                    selecciona un archivo
                                </button>
                            </p>
                            <p className="text-xs text-text-secondary mt-1">Máximo {maxSize}MB</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {getFileIcon()}
                                <div className="text-left">
                                    <p className="text-sm font-medium text-text-main">{selectedFile.name}</p>
                                    <p className="text-xs text-text-secondary">{formatFileSize(selectedFile.size)}</p>
                                </div>
                            </div>
                            {!isUploading && (
                                <button type="button" onClick={removeFile} className="p-1 text-text-secondary hover:text-error transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-text-secondary">
                                    <span>Subiendo...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-error">{error.message}</p>}
        </div>
    );
};


