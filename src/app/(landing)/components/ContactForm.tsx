"use client";

import { Button } from "@/shared/components/UI/Buttons";
import { useState } from "react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "573142461052";
    const message = `¡Hola! Me pongo en contacto a través de la web.\n\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Compañía:* ${formData.company}\n\n*Mensaje:*\n${formData.message}`;
    const encodedMessage = encodeURIComponent(message.trim());
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <section className="max-w-xl px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Contactanos</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm text-foreground">
            Tu nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="ingresa tu nombre"
            required
            className="w-full p-3 bg-card-bg border border-assets rounded-lg placeholder:text-color--text-secondary focus:outline-none focus:ring-2 focus:ring-color--primary"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-foreground">Tu Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ingresa tu email"
            required
            className="w-full p-3 bg-card-bg border border-assets rounded-lg placeholder:text-color--text-secondary focus:outline-none focus:ring-2 focus:ring-color--primary"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-foreground">
            Nombre de tu compañía
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nombre de tu compañía"
            className="w-full p-3 bg-card-bg border border-assets rounded-lg placeholder:text-color--text-secondary focus:outline-none focus:ring-2 focus:ring-color--primary"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-foreground">
            Tu mensaje
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Escribí tu mensaje..."
            rows={4}
            required
            className="w-full p-3 bg-card-bg border border-assets rounded-lg placeholder:text-color--text-secondary focus:outline-none focus:ring-2 focus:ring-color--primary"
          />
        </div>
        <div>
          <Button type="submit">Enviar Mensaje</Button>
        </div>
      </form>
    </section>
  );
};
