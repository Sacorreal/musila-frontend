import { SongRequest } from "@/domains/music/types";
import {
  SentIcon,
  SeenIcon,
  ApprovedIcon,
} from "@/shared/components/Icons/Icons";
import { CircleDashed, XIcon } from "lucide-react";

interface RequestHistoryProps {
  request: SongRequest;
}

export const RequestHistory = ({ request }: RequestHistoryProps) => {
  const historySteps = [
    {
      status: "Solicitud enviada",
      date: request.requestDate,
      icon: <SentIcon />,
    },
    {
      status: "Solicitud pendiente",
      date: request.requestDate,
      icon: <SeenIcon />,
    },
  ];

  const finalStep = {
    Approved: {
      status: "Solicitud Aceptada",
      date: "Hoy",
      icon: <ApprovedIcon />,
    },
    Rejected: { status: "Solicitud Rechazada", date: "Hoy", icon: <XIcon /> },
    Pending: {
      status: "Solicitud Pendiente",
      date: "",
      icon: <CircleDashed />,
    },
  }[request.status];

  if (finalStep) {
    historySteps.push(finalStep);
  }

  return (
    <div>
      <ul className="space-y-4">
        {historySteps.map((step, index) => (
          <li
            key={`${step.status}-${index}`}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="bg-primary rounded-full p-2 text-white">
                {step.icon}
              </div>
              {index < historySteps.length - 1 && (
                <div className="w-px h-8 bg-assets mt-2"></div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{step.status}</p>
              <p className="text-sm text-text-secondary">{step.date}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-3">
        <button className="flex-1 rounded-lg py-2 px-4 bg-secondary text-text-main font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          Ver Mensajes
        </button>
        {request.status === "Approved" && (
          <button className="flex-1 rounded-lg py-2 px-4 bg-primary text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            Descargar canción
          </button>
        )}
      </div>
    </div>
  );
};
