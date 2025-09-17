"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/components/UI/Inputs";
import { Textarea } from "@/shared/components/UI/Textarea";
import { Button } from "@/shared/components/UI/Buttons";
import { AvatarUploader } from "../../components/AvatarUploader";
import { updateUser } from "@/domains/auth/services/userService";
import { ChevronDown, ChevronUp } from "lucide-react";
import { User } from "@/domains/auth/types";

const profileSchema = z
    .object({
        nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres"),
        email: z.string().email("Email inválido"),
        bio: z.string().max(280, "La biografía no puede exceder 280 caracteres").optional(),
        ubicacion: z.string().max(60, "La ubicación no puede exceder 60 caracteres").optional(),
        links: z
            .object({
                web: z.string().url("URL inválida").optional().or(z.literal("")),
                instagram: z.string().url("URL inválida").optional().or(z.literal("")),
                youtube: z.string().url("URL inválida").optional().or(z.literal("")),
                soundcloud: z.string().url("URL inválida").optional().or(z.literal("")),
            })
            .optional(),
        passwordActual: z.string().optional(),
        passwordNueva: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula, una minúscula y un número")
            .optional(),
        passwordConfirmacion: z.string().optional(),
        avatarUrl: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.passwordActual || data.passwordNueva) {
                return data.passwordActual && data.passwordNueva && data.passwordConfirmacion;
            }
            return true;
        },
        {
            message: "Todos los campos de contraseña son requeridos para cambiar la contraseña",
            path: ["passwordConfirmacion"],
        },
    )
    .refine(
        (data) => {
            if (data.passwordNueva && data.passwordConfirmacion) {
                return data.passwordNueva === data.passwordConfirmacion;
            }
            return true;
        },
        {
            message: "Las contraseñas no coinciden",
            path: ["passwordConfirmacion"],
        },
    );

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    user: User;
    onSuccess: (updatedUser: User) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nombre: user.nombre,
            email: user.email,
            bio: user.bio || "",
            ubicacion: user.ubicacion || "",
            links: {
                web: user.links?.web || "",
                instagram: user.links?.instagram || "",
                youtube: user.links?.youtube || "",
                soundcloud: user.links?.soundcloud || "",
            },
            avatarUrl: user.avatarUrl || "",
        },
    });

    const handleAvatarChange = (avatarUrl: string) => {
        setValue("avatarUrl", avatarUrl);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const updatedUser = await updateUser(data);
            onSuccess(updatedUser);
            setSuccessMessage("Perfil actualizado exitosamente");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error al actualizar el perfil");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setShowPasswordSection(false);
        setSuccessMessage("");
        setErrorMessage("");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-card-bg dark:bg-[#1e1834] rounded-xl shadow-lg border border-[#3c3069]/20 p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Información Personal</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <AvatarUploader currentAvatarUrl={user.avatarUrl} onAvatarChange={handleAvatarChange} disabled={isSubmitting} />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <Input label="Nombre completo" id="nombre" type="text" placeholder="Tu nombre completo" register={register} error={errors.nombre} />

                            <Input label="Email" id="email" type="email" placeholder="tu@email.com" register={register} error={errors.email} disabled />

                            <Textarea label="Biografía" id="bio" placeholder="Cuéntanos sobre ti y tu música..." register={register} error={errors.bio} rows={3} />

                            <Input label="Ubicación" id="ubicacion" type="text" placeholder="Ciudad, País" register={register} error={errors.ubicacion} />
                        </div>
                    </div>
                </div>

                <div className="bg-card-bg dark:bg-[#1e1834] rounded-xl shadow-lg border border-[#3c3069]/20 p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Enlaces</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Sitio web" id="links.web" type="url" placeholder="https://tu-sitio.com" register={register} error={errors.links?.web} />

                        <Input
                            label="Instagram"
                            id="links.instagram"
                            type="url"
                            placeholder="https://instagram.com/tuusuario"
                            register={register}
                            error={errors.links?.instagram}
                        />

                        <Input label="YouTube" id="links.youtube" type="url" placeholder="https://youtube.com/@tucanal" register={register} error={errors.links?.youtube} />

                        <Input
                            label="SoundCloud"
                            id="links.soundcloud"
                            type="url"
                            placeholder="https://soundcloud.com/tuusuario"
                            register={register}
                            error={errors.links?.soundcloud}
                        />
                    </div>
                </div>

                <div className="bg-card-bg dark:bg-[#1e1834] rounded-xl shadow-lg border border-[#3c3069]/20 p-6">
                    <button
                        type="button"
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="flex items-center justify-between w-full text-xl font-semibold text-foreground mb-6"
                    >
                        Seguridad
                        {showPasswordSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {showPasswordSection && (
                        <div className="space-y-4">
                            <Input
                                label="Contraseña actual"
                                id="passwordActual"
                                type="password"
                                placeholder="Tu contraseña actual"
                                register={register}
                                error={errors.passwordActual}
                            />

                            <Input label="Nueva contraseña" id="passwordNueva" type="password" placeholder="Nueva contraseña" register={register} error={errors.passwordNueva} />

                            <Input
                                label="Confirmar nueva contraseña"
                                id="passwordConfirmacion"
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                register={register}
                                error={errors.passwordConfirmacion}
                            />
                        </div>
                    )}
                </div>

                {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-green-800 dark:text-green-200">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting} onClick={() => {}}>
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};
