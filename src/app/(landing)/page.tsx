"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "./components/Header";
import { Pricing } from "./components/Pricing";
import { HowItWorks } from "./components/How";
import { RequestSongSection } from "./components/RequestSong";
import { Faq } from "./components/Faq";
import { ContactForm } from "./components/ContactForm";
import { motion, easeOut } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="relative bg-background dark: flex size-full min-h-screen flex-col text-text-main group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section */}
            <motion.section
              className="@container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col text-white gap-6 bg-cover bg-center bg-no-repeat @[480px]:rounded-xl items-center justify-center p-4 text-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn0.uncomo.com/es/posts/2/6/6/como_escribir_una_cancion_49662_orig.jpg")`,
                  }}
                >
                  <motion.h1
                    className="text-4xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Crea, publica y descubre canciones inéditas
                  </motion.h1>
                  <motion.p
                    className="text-md font-normal leading-normal max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Musila es la plataforma para que compositores e intérpretes
                    colaboren y den vida a la música.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Link
                      href="/login?plan=true"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-foreground text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base hover:bg-main-landing/90"
                    >
                      <span className="truncate">Elige un plan</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <HowItWorks />
            </motion.div>

            <motion.section
              id="benefits"
              className="flex w-full flex-col gap-8 py-10 px-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Beneficios de Musila
                </h2>
                <p className="max-w-[600px] text-base font-medium leading-normal text-text-main">
                  Musila ofrece una plataforma integral que facilita la
                  colaboración entre compositores, intérpretes y editoras.
                </p>
              </div>

              <motion.div
                className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={cardContainerVariants}
              >
                <motion.div
                  variants={cardVariants}
                  className="flex flex-col gap-3 rounded-lg border border-[#3c3069] bg-card-bg p-6 text-left"
                >
                  <div className="w-full aspect-[5/3] overflow-hidden rounded-md">
                    <Image
                      src="/autores.png"
                      alt="Autores y Cantautores"
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-foreground text-base font-bold leading-tight">
                    Autores y Cantautores
                  </h3>
                  <p className="text-text-secondary text-sm font-medium leading-normal">
                    Sube, organiza y gestiona fácilmente tu catálogo de
                    canciones inéditas con metadatos detallados y configuración
                    de permisos.
                  </p>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="flex flex-col gap-3 rounded-lg border border-[#3c3069] bg-card-bg p-6 text-left"
                >
                  <div className="w-full aspect-[5/3] overflow-hidden rounded-md">
                    <Image
                      src="/interpretes.jpeg"
                      alt="Intérpretes"
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-foreground text-base font-bold leading-tight">
                    Intérpretes
                  </h3>
                  <p className="text-text-secondary text-sm font-medium leading-normal">
                    Descubre canciones inéditas, crea listas de reproducción,
                    trabaja en equipo para facilitar la selección de canciones y
                    solicita permisos para usarlas.
                  </p>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="flex flex-col gap-3 rounded-lg border border-[#3c3069] bg-card-bg p-6 text-left"
                >
                  <div className="w-full aspect-[5/3] overflow-hidden rounded-md">
                    <Image
                      src="/publishing.png"
                      alt="Editoras"
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-foreground text-base font-bold leading-tight">
                    Editoras
                  </h3>
                  <p className="text-text-secondary text-sm font-medium leading-normal">
                    Administra el catálogo de canciones de tus autores, obten
                    información detallada sobre el uso de licencias, lleva un
                    registro del uso de cada canción para facilitar la gestión
                    de derechos y cobro de regalías.
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <RequestSongSection />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <Pricing />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <Faq />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <ContactForm />
            </motion.div>
          </div>
        </main>

        <footer className="flex justify-center border-t border-solid border-assets">
          <div className="flex max-w-[960px] flex-1 flex-col items-center gap-6 px-5 py-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 @[480px]:justify-around">
              <Link
                className="text-text-secondary text-base font-normal leading-normal min-w-40 hover:text-main-landing"
                href="/terms"
              >
                Terminos de uso
              </Link>
              <Link
                className="text-text-secondary text-base font-normal leading-normal min-w-40 hover:text-main-landing"
                href="/privacy"
              >
                Politica de privacidad
              </Link>
              <Link
                className="text-text-secondary text-base font-normal leading-normal min-w-40 hover:text-main-landing"
                href="/contact"
              >
                Contáctanos
              </Link>
            </div>
            <p className="text-text-secondary text-base font-normal leading-normal">
              © 2025 Musila. Hecho en Colombia con ❤️.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
