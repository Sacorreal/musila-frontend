import React from "react";

const IconCaretDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
  </svg>
);

interface FaqItemProps {
  question: string;
  answer: string;
  isOpenDefault?: boolean;
}

const FaqItem = ({ question, answer, isOpenDefault = false }: FaqItemProps) => (
  <details className="group rounded-xl border border-border-color bg-background p-4" open={isOpenDefault}>
    <summary className="flex cursor-pointer list-none items-center justify-between">
      <p className="text-white text-sm font-medium leading-normal">{question}</p>
      <div className="text-white transition-transform duration-300 group-open:rotate-180">
        <IconCaretDown />
      </div>
    </summary>
    <p className="text-text-secondary text-sm font-normal leading-normal mt-4">
      {answer}
    </p>
  </details>
);

// --- Datos de Contenido ---
const faqData = [
  {
    question: "¿Cómo garantiza Musila la protección de los derechos de autor de las canciones?",
    answer: "Musila emplea sólidas medidas de protección de derechos de autor, como marcas de agua digitales y almacenamiento seguro de archivos, para salvaguardar tus composiciones originales. Nuestra plataforma también ofrece directrices y acuerdos claros para el uso de las canciones, lo que garantiza que los autores mantengan el control total sobre su obra y reciban la atribución y compensación adecuadas por sus interpretaciones.",
    isOpen: true, // Para que la primera pregunta aparezca abierta por defecto
  },
  {
    question: "¿En cuales tipos de géneros musicales se pueden subir canciones?",
    answer: "En Musila, puedes subir canciones de una amplia variedad de géneros musicales, desde Vallenato hasta Rock y más. Nuestra plataforma está diseñada para adaptarse a todos los estilos y preferencias musicales, permitiendo a los autores y cantautores compartir sus composiciones originales sin restricciones de género.",
  },
  {
    question: "¿Cómo puedo empezar como intérprete en Musila?",
    answer: "Primero debes seleccionar el plan de Intérprete y crear tu perfil. Una vez que estés registrado, podrás explorar el catálogo de canciones inéditas, crear listas de reproducción y solicitar permisos para usar las canciones que te interesen. Además, podrás invitar a colaboradores a tus listas de reproducción para trabajar en equipo y facilitar la selección de canciones.",
  },
];

export function Faq() {
  return (
    <section className="w-full max-w-5xl py-10 px-4">
      <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white mb-8">
        Preguntas Frecuentes
      </h2>
      <div className="flex flex-col gap-3">
        {faqData.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpenDefault={faq.isOpen}
          />
        ))}
      </div>
    </section>
  );
}