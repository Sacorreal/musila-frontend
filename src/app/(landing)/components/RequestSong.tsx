import React from "react";

// --- Datos de Contenido ---
const timelineData = [
  {
    title: "Autores publican sus canciones",
    description:
      "Los autores y cantautores suben sus composiciones originales a la plataforma.",
  },
  {
    title: "Intérprete solicita el uso",
    description:
      "Los intérpretes escuchan canciones pueden agregarlas en listas de reproducción, compartirla con sus colaboradores y envían solicitudes a los autores para que les permitan usarlas.",
  },
  {
    title: "Acuerdo de Uso",
    description:
      "Autores e intérpretes negocian y llegan a un acuerdo para el uso de la canción.",
  },
];

// --- Componente Principal Corregido ---
export function RequestSongSection() {
  return (
    <section className="w-full max-w-5xl py-10 px-4">
      <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white mb-8">
        ¿Cómo solicitar una canción?
      </h2>

      {/* El grid con la definición de columnas corregida para que coincida con tu HTML */}
      <div className="grid grid-cols-[40px_1fr] gap-x-4">
        {timelineData.map((item, index) => (
          <React.Fragment key={index}>
            {/* --- Columna 1: Lógica de la Línea de Tiempo --- */}
            {(() => {
              // Caso 1: Primer elemento
              if (index === 0) {
                return (
                  <div className="flex flex-col items-center gap-1 pt-3">
                    {" "}
                    {/* Ajuste de padding para alinear con el texto */}
                    <div className="h-2 w-2 rounded-full bg-white shrink-0"></div>
                    <div className="w-[1px] bg-[#3c3069] flex-grow"></div>
                  </div>
                );
              }
              // Caso 2: Último elemento
              if (index === timelineData.length - 1) {
                return (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-[1px] h-4 bg-[#3c3069]"></div>
                    <div className="h-2 w-2 rounded-full bg-white shrink-0"></div>
                  </div>
                );
              }
              // Caso 3: Elementos intermedios
              return (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[1px] h-4 bg-[#3c3069]"></div>
                  <div className="h-2 w-2 rounded-full bg-white shrink-0"></div>
                  <div className="w-[1px] bg-[#3c3069] flex-grow"></div>
                </div>
              );
            })()}

            {/* --- Columna 2: Contenido de Texto --- */}
            <div className="flex flex-1 flex-col py-2 mb-8">
              {" "}
              {/* Ajuste de padding para mejor espaciado */}
              <p className="text-white text-base font-medium leading-normal">
                {item.title}
              </p>
              <p className="text-text-secondary text-sm font-normal leading-normal mt-1">
                {item.description}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
