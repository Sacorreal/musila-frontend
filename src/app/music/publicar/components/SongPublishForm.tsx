"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUpload } from "./FileUpload";
import { Select } from "./Select";
import { Notification } from "./Notification";
import { useNotification } from "../hooks/useNotification";
import { useUpload } from "../hooks/useUpload";
import { songSchema } from "../types";

type SongFormData = z.infer<typeof songSchema>;

export function SongPublishForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useNotification();
    const { uploadStatus } = useUpload();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SongFormData>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            name: "",
            author: "",
            genre: "Rock",
            image: null,
            song: null,
        },
    });

    // const watchedImage = watch("image");
    // const watchedSong = watch("song");

    const handleImageUpload = async (file: File) => {
        try {
            setValue("image", file);
            showSuccess("Imagen seleccionada", "La imagen se subirá cuando envíes el formulario");
        } catch {
            showError("Error al procesar la imagen", "Por favor, intenta con otra imagen");
        }
    };

    const handleSongUpload = async (file: File) => {
        try {
            setValue("song", file);
            showSuccess("Canción seleccionada", "La canción se subirá cuando envíes el formulario");
        } catch {
            showError("Error al procesar la canción", "Por favor, intenta con otro archivo");
        }
    };

    const onSubmit = async (data: SongFormData) => {
        setIsSubmitting(true);
        try {
            // Simulación de envío al backend
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Datos del formulario:", data);
            showSuccess("Canción publicada exitosamente", "La canción ha sido publicada correctamente");

            // Reset form
            setValue("name", "");
            setValue("author", "");
            setValue("genre", "Rock");
            setValue("image", null);
            setValue("song", null);
        } catch {
            showError("Error al publicar la canción", "Hubo un problema al publicar la canción");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Publicar Nueva Canción</h1>
                    <p className="text-text-secondary text-sm">Comparte tu música con el mundo</p>
                </div>

                {/* Form Container */}
                <div className="bg-card-bg dark:bg-[#1e1834] rounded-xl shadow-lg border border-[#3c3069]/20 p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombre de la canción */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-main dark:text-gray-100 mb-2">
                                Nombre de la Canción *
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                id="name"
                                className={`w-full px-3 py-2.5 bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors ${
                                    errors.name ? "border-error" : "border-gray-300 dark:border-gray-600"
                                } dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                                placeholder="Ingresa el nombre de la canción"
                            />
                            {errors.name && <p className="mt-2 text-error text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Autor */}
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-text-main dark:text-gray-100 mb-2">
                                Autor *
                            </label>
                            <input
                                {...register("author")}
                                type="text"
                                id="author"
                                className={`w-full px-3 py-2.5 bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors ${
                                    errors.author ? "border-error" : "border-gray-300 dark:border-gray-600"
                                } dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                                placeholder="Ingresa el nombre del autor"
                            />
                            {errors.author && <p className="mt-2 text-error text-sm">{errors.author.message}</p>}
                        </div>

                        {/* Género */}
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-text-main dark:text-gray-100 mb-2">
                                Género *
                            </label>
                            <Select
                                {...register("genre")}
                                id="genre"
                                className={`w-full px-3 py-2.5 bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors ${
                                    errors.genre ? "border-error" : "border-gray-300 dark:border-gray-600"
                                } dark:bg-gray-700 dark:text-white`}
                            >
                                <option value="">Selecciona un género</option>
                                <option value="pop">Pop</option>
                                <option value="rock">Rock</option>
                                <option value="jazz">Jazz</option>
                                <option value="classical">Clásica</option>
                                <option value="electronic">Electrónica</option>
                                <option value="hip-hop">Hip Hop</option>
                                <option value="country">Country</option>
                                <option value="reggae">Reggae</option>
                                <option value="blues">Blues</option>
                                <option value="folk">Folk</option>
                                <option value="r&b">R&B</option>
                                <option value="latin">Latina</option>
                                <option value="other">Otro</option>
                            </Select>
                            {errors.genre && <p className="mt-2 text-error text-sm">{errors.genre.message}</p>}
                        </div>

                        {/* Imagen */}
                        <div>
                            <FileUpload
                                label="Imagen de Portada"
                                id="image"
                                error={errors.image}
                                accept="image/jpeg,image/png,image/webp"
                                maxSize={5}
                                fileType="image"
                                onFileSelect={handleImageUpload}
                                progress={uploadStatus.progress.image}
                                isUploading={uploadStatus.isUploading}
                            />
                        </div>

                        {/* Canción */}
                        <div>
                            <FileUpload
                                label="Archivo de Audio *"
                                id="song"
                                error={errors.song}
                                accept="audio/mpeg,audio/wav,audio/ogg"
                                maxSize={50}
                                fileType="audio"
                                onFileSelect={handleSongUpload}
                                progress={uploadStatus.progress.song}
                                isUploading={uploadStatus.isUploading}
                            />
                        </div>

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={isSubmitting || uploadStatus.isUploading}
                            className={`w-full bg-primary text-white focus:ring-2 focus:outline-none focus:ring-primary/50 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors shadow-lg ${
                                isSubmitting || uploadStatus.isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90 cursor-pointer"
                            }`}
                        >
                            {isSubmitting ? "Publicando..." : "Publicar Canción"}
                        </button>
                    </form>
                </div>

                <Notification />
            </div>
        </div>
    );
}
