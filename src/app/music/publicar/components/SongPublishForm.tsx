"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUpload } from "./FileUpload";
import { Select } from "./Select";
import { Notification } from "./Notification";
import { useNotification } from "../hooks/useNotification";
import { useUpload } from "../hooks/useUpload";
import { songSchema } from "../types";
import { SUBGENRES } from "@domains/tracks/constants/genres";

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
        control,
        resetField,
    } = useForm<SongFormData>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            name: "",
            author: "",
            genre: "",
            subgenre: "",
            lyrics: "",
            image: null,
            song: null,
        },
    });

    const genre = useWatch({ control, name: 'genre' });
    const subgenreOptions = genre ? SUBGENRES[genre] : [];



    useEffect(() => { 
        resetField('subgenre', { defaultValue: '' }) 
    }, [genre, resetField]);

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
            const hasCoverFile = data.image instanceof File || (typeof File !== 'undefined' && data.image?.[0] instanceof File);
            let coverUrl = '/logo.webp';
            if (hasCoverFile) {
                coverUrl = await uploadCoverAndGetUrl(data.image);
            }

            const payload: Record<string, unknown> = {
                title: data.name,
                author: data.author,
                genre: data.genre,
                coverUrl,
                audioFile: data.song
            };

            if (data.subgenre) payload.subgenre = data.subgenre;
            if (data.lyrics && data.lyrics.trim().length > 0) payload.lyrics = data.lyrics.trim();

            console.log("Datos del formulario:", payload);
            showSuccess("Canción publicada exitosamente", "La canción ha sido publicada correctamente");

            setValue("name", "");
            setValue("author", "");
            setValue("genre", "");
            setValue("subgenre", "");
            setValue("lyrics", "");
            setValue("image", null);
            setValue("song", null);
        } catch {
            showError("Error al publicar la canción", "Hubo un problema al publicar la canción");
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadCoverAndGetUrl = async () => {
        return '/logo.webp';
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
                                <option value="Rock">Rock</option>
                                <option value="Pop">Pop</option>
                                <option value="Hip Hop">Hip Hop</option>
                                <option value="Reggaeton">Reggaeton</option>
                                <option value="Electronica">Electronica</option>
                                <option value="Jazz">Jazz</option>
                                <option value="Clasica">Clasica</option>
                                <option value="Folk">Folk</option>
                                <option value="Metal">Metal</option>
                                <option value="Indie">Indie</option>
                                <option value="R&B">R&B</option>
                                <option value="Trap">Trap</option>
                                <option value="Salsa">Salsa</option>
                                <option value="Cumbia">Cumbia</option>
                                <option value="Tango">Tango</option>
                                <option value="Latina">Latina</option>
                            </Select>
                            {errors.genre && <p className="mt-2 text-error text-sm">{errors.genre.message}</p>}
                        </div>

                        {/* Subgénero */}
                        <div>
                            <label htmlFor="subgenre" className="block text-sm font-medium text-text-main dark:text-gray-100 mb-2">
                                Subgénero *
                            </label>
                            <select
                                {...register("subgenre")}
                                disabled={!genre}
                                defaultValue=""
                                className={`w-full px-3 py-2.5 bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors ${
                                    errors.subgenre ? "border-error" : "border-gray-300 dark:border-gray-600"
                                } dark:bg-gray-700 dark:text-white ${!genre ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <option value="" disabled>Selecciona un subgénero</option>
                                {subgenreOptions.map(s => (<option key={s} value={s}>{s}</option>))}
                            </select>
                            {errors.subgenre && <p className="mt-2 text-error text-sm">{errors.subgenre.message}</p>}
                        </div>

                        {/* Letra de la canción */}
                        <div>
                            <label htmlFor="lyrics" className="block text-sm font-medium text-text-main dark:text-gray-100 mb-2">
                                Letra de la Canción
                            </label>
                            <textarea
                                {...register("lyrics")}
                                rows={6}
                                maxLength={10000}
                                placeholder="Pega aquí la letra completa…"
                                className={`w-full px-3 py-2.5 bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors resize-y ${
                                    errors.lyrics ? "border-error" : "border-gray-300 dark:border-gray-600"
                                } dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.lyrics && <p className="mt-2 text-error text-sm">{errors.lyrics.message}</p>}
                        </div>

                        {/* Imagen */}
                        <div>
                            <FileUpload
                                label="Imagen de Portada"
                                id="image"
                                register={register}
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
                                register={register}
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
