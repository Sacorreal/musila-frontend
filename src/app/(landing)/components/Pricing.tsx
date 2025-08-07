"use client";

import React, { useState } from "react";

const IconCheck = () => (
  <svg
    className="w-5 h-5 text-white shrink-0"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
  </svg>
);

const pricingData: Plan[] = [
  {
    type: "Autor",
    prices: { monthly: 50000, annually: 500000 },
    billingUnit: "/mes",
    annualBillingUnit: "/año",
    features: [
      "Sube canciones ilimitadas.",
      "Lleva el historial de cada canción.",
      "Compartir canciones con intérpretes.",
    ],
    buttonText: "Seleccionar plan",
    layout: "main",
  },
  {
    type: "Cantautor",
    prices: { monthly: 70000, annually: 700000 },
    billingUnit: "/mes",
    annualBillingUnit: "/año",
    prelude: "Además de las funcionalidades del plan Autor incluye:",
    features: [
      "Herramientas de descubrimiento y búsqueda de canciones inéditas.",
      "Agregar invitados a tus listas de reproducción.",
      "Crear listas de reproducción de canciones inéditas, para faciliar la selección de canciones.",
    ],
    buttonText: "Seleccionar plan",
    layout: "main",
  },
  {
    type: "Intérprete",
    prices: { monthly: 100000, annually: 100000 },
    billingUnit: "/único pago",
    annualBillingUnit: "/único pago",
    features: [
      "Crear listas de reproducción de canciones inéditas, para faciliar la selección de canciones.",
      "Herramientas de descubrimiento y búsqueda de canciones inéditas.",
      "Agregar invitados a tus listas de reproducción.",
    ],
    buttonText: "Seleccionar plan",
    layout: "main",
  },
  {
    type: "Editora (Publisher)",
    features: [
      "Administra el catálogo de tus autores y cantautores.",
      "Sube canciones ilimitadas.",
      "Analíticas de uso y monitoreo.",
      "Herramientas de colaboración.",
      "Soporte personalizado.",
    ],
    buttonText: "Hablemos",
    customCTA: true,
    layout: "enterprise",
  },
];

interface Plan {
  type: string;
  prices?: { monthly: number; annually: number };
  billingUnit?: string;
  annualBillingUnit?: string;
  prelude?: string;
  features: string[];
  buttonText: string;
  customCTA?: boolean;
  layout: "main" | "enterprise";
}

const PricingCard = ({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: "monthly" | "annually";
}) => {
  const price = plan.prices ? plan.prices[billingCycle] : null;
  const formattedPrice = price
    ? new Intl.NumberFormat("es-AR").format(price)
    : null;
  const billingUnit =
    billingCycle === "annually" && plan.annualBillingUnit
      ? plan.annualBillingUnit
      : plan.billingUnit;

  return (
    <div
      className={`flex flex-1 flex-col gap-4 rounded-xl border border-solid border-border-color bg-card-bg p-6 h-full ${
        plan.layout === "enterprise" ? "lg:col-span-2" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-white text-base font-bold leading-tight">
          {plan.type}
        </h3>
        {formattedPrice && (
          <p className="flex items-baseline gap-1 text-white">
            <span className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              ${formattedPrice}
            </span>
            <span className="text-white text-base font-bold leading-tight">
              {billingUnit}
            </span>
          </p>
        )}
      </div>
      <button
        className={`flex w-full cursor-pointer items-center justify-center rounded-full h-10 px-4 text-white text-sm font-bold ${
          plan.customCTA
            ? "bg-primary hover:bg-primary/90"
            : "bg-border-color-light hover:bg-primary"
        }`}
      >
        <span className="truncate">{plan.buttonText}</span>
      </button>
      <div className="flex flex-col gap-2 text-[13px] font-normal leading-normal text-white">
        {plan.prelude && <p className="mb-2">{plan.prelude}</p>}
        {plan.features.map((feature, index) => (
          <div key={index} className="flex gap-3 items-start">
            <IconCheck />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};



//  Componente Principal 
export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  const mainPlans = pricingData.filter((p) => p.layout === "main");
  const enterprisePlan = pricingData.find((p) => p.layout === "enterprise");

  return (
    <section
      id="pricing"
      className="w-full max-w-6xl flex flex-col items-center gap-2 px-4 py-10"
    >
      <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-center text-white">
        Precios
      </h2>
      <div className="flex justify-center py-3 w-full max-w-sm">
        <div className="flex h-10 w-full items-center justify-center rounded-full bg-border-color-light p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`h-full w-full rounded-full text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-background shadow-md text-white"
                : "text-text-secondary"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`h-full w-full rounded-full text-sm font-medium transition-colors ${
              billingCycle === "annually"
                ? "bg-background shadow-md text-white"
                : "text-text-secondary"
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
        {mainPlans.map((plan) => (
          <PricingCard
            key={plan.type}
            plan={plan}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      {enterprisePlan && (
        <div className="w-full mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PricingCard plan={enterprisePlan} billingCycle={billingCycle} />
        </div>
      )}
    </section>
  );
}
