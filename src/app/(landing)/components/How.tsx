import React from "react";

const IconMusicNote = () => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z"></path>
  </svg>
);

const IconSearch = () => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
  </svg>
);

const IconTeam = () => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>{" "}
  </svg>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-1 flex-col gap-3 rounded-lg border border-border-color bg-card-bg p-6 text-left">
    <div className="text-white w-6 h-6">{icon}</div>
    <div className="flex flex-col gap-1">
      <h3 className="text-white text-base font-bold leading-tight">{title}</h3>
      <p className="text-text-secondary text-sm font-normal leading-normal">
        {description}
      </p>
    </div>
  </div>
);

const featuresData = [
  {
    icon: <IconMusicNote />,
    title: "Si eres Autor o Cantautor, publica tus canciones",
    description:
      "Los compositores pueden subir fácilmente sus composiciones originales, gestionar su catálogo y establecer permisos para los artistas.",
  },
  {
    icon: <IconSearch />,
    title: "Descubre canciones inéditas",
    description:
      "Los intérpretes pueden explorar una gran biblioteca de canciones, filtrando por género, estilo y otros criterios para encontrar la canción inédita perfecta.",
  },
  {
    icon: <IconTeam />,
    title: "Trabaja en equipo",
    description:
      "Musila ofrece herramientas de colaboración que permiten a los compositores e intérpretes gestionar de forma ágil el flujo de descubrimiento, solicitud y uso de canciones.",
  },
];

export function HowItWorks() {
  return (
    <section className="flex w-full flex-col items-center gap-8 py-10 px-4">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white">
          ¿Cómo funciona Musila?
        </h2>
        <p className="max-w-[600px] text-base font-normal leading-normal text-text-secondary">
          Musila simplifica el proceso de compartir e interpretar música de
          forma legal, conectando a compositores e intérpretes sin problemas.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
