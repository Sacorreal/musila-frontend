"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/shared/components/UI/Buttons";
import {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/shared/components/UI/table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/UI/card";
import { Skeleton } from "@/shared/components/UI/skeleton";

// Importando tus componentes reutilizables
import { Input } from "@/shared/components/UI/Inputs";
import { Modal } from "@/shared/components/UI/Modal";

type Collaborator = {
  id: string;
  email: string;
  status: "pending" | "accepted";
  invitedAt: string; 
};

// --- Esquema de Validación para React Hook Form ---
const invitationSchema = z.object({
  email: z
    .string()
    .min(1, "El email no puede estar vacío.")
    .email("Debe ser un email válido."),
});

type InvitationFormValues = z.infer<typeof invitationSchema>;


const InvitarPage = () => {
  // Estado para la lista de colaboradores
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para manejar errores DEL SERVIDOR (los de validación los maneja react-hook-form)
  const [serverError, setServerError] = useState<string | null>(null);

  // --- Configuración de React Hook Form ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
    },
  });

  // --- Simulación de Carga de Datos ---
  useEffect(() => {
    // Simulamos un fetch a tu API
    const fetchCollaborators = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/music/invitations");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los colaboradores.");
        }
        const data: Collaborator[] = await response.json();
        setCollaborators(data);

        const mockData: Collaborator[] = [];

        setTimeout(() => {
          setCollaborators(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Ocurrió un error");
        setIsLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  // --- Manejador para Enviar Invitación ---
  const onInviteSubmit: SubmitHandler<InvitationFormValues> = async (data) => {
    setServerError(null);

    try {
      const response = await fetch('/api/music/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'No se pudo enviar la invitación.');
      }
      const newInvitation: Collaborator = await response.json();
      
      // Añadimos el nuevo colaborador a la lista
      setCollaborators((prev) => [...prev, newInvitation]);
      
      // Reseteamos el formulario y cerramos el modal
      reset();
      setIsModalOpen(false);

    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo enviar la invitación.');
    }
  };

  // --- Renderizado del Contenido Principal ---
  const renderMainContent = () => {
    // 1. Estado de Carga
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      );
    }

    // 2. Estado Vacío (como solicitaste)
    if (collaborators.length === 0) {
      return (
          <CardHeader className="text-center p-10">
            <PlusCircle className="mx-auto h-12 w-12 text-assets" />
            <CardTitle className="mt-4 text-xl font-semibold text-main">
              Empieza a invitar colaboradores
            </CardTitle>
            <CardDescription className="mt-2 text-text-secondary">
              Aún no has invitado a nadie a tu proyecto. <br />
              Haz clic en &quot;Añadir Colaborador&quot; para enviar tu
              primera invitación.
            </CardDescription>
          </CardHeader>
      );
    }

    // 3. Estado con Datos (Tabla)
    return (
      <Card className="bg-color-card-bg">
        <Table>
          <TableCaption>
            Una lista de los colaboradores que has invitado a Musila.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Invitado el</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators.map((collab) => (
              <TableRow key={collab.id}>
                <TableCell className="font-medium text-color-text-main">
                  {collab.email}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      collab.status === "accepted"
                        ? "bg-color-approved/20 text-color-approved"
                        : "bg-color-warning/20 text-color-warning"
                    }`}
                  >
                    {collab.status === "accepted" ? "Aceptado" : "Pendiente"}
                  </span>
                </TableCell>
                <TableCell className="text-color-text-secondary">
                  {new Date(collab.invitedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {/* Aquí puedes añadir botones de acción (ej. reenviar, eliminar) */}
                  <Button>...</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  // --- Clausura del Modal ---
  const handleCloseModal = () => {
    if (isSubmitting) return; // Evita cerrar si se está enviando
    reset(); // Resetea el formulario al cerrar
    setServerError(null); // Limpia errores de servidor
    setIsModalOpen(false);
  };

  return (
    // Usamos las variables de color de tu globals.css
    <div className="container mx-auto p-4 md:p-8 text-color-text-main">
      {/* --- Cabecera y Botón del Modal --- */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold">Colaboradores</h1>

        {/* El botón ahora solo abre el modal usando el estado */}
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-full cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Colaborador
        </button>
      </div>

      {/* --- Contenido Principal --- */}
      <div className="mt-4">{renderMainContent()}</div>

      {/* --- Modal Reutilizable --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Invitar colaborador"
      >
        <p className="text-sm text-color-text-secondary mb-2">
          Ingresa el email del usuario que quieres invitar a tu proyecto Musila.
        </p>

        <form onSubmit={handleSubmit(onInviteSubmit)} className="space-y-2">
          {/* Tu componente Input reutilizable */}
          <Input<InvitationFormValues>
            id="email"
            label="Email del colaborador"
            type="email"
            placeholder="nombre@ejemplo.com"
            register={register}
            error={errors.email}
            disabled={isSubmitting}
          />

          {/* Muestra de error del servidor */}
          {serverError && (
            <p className="text-sm text-color-error text-center">
              {serverError}
            </p>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Invitación"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InvitarPage;
