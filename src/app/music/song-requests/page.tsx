'use client'

import { useState } from "react";
import SongRequestsTable from "./components/RequestsTable";
import { Modal } from "@/shared/components/UI/Modal";
import { RequestHistory } from "./components/HistorySong";
import { SongRequest } from "@/domains/music/types";

const songData: SongRequest[] = [
  {
    songTitle: "Bohemian Rhapsody",
    requestDate: "2025-08-10",
    requestedBy: "User A",
    status: "Approved",
    licenseType: "Premium",
  },
  {
    songTitle: "Stairway to Heaven",
    requestDate: "2025-08-09",
    requestedBy: "User B",
    status: "Pending",
    licenseType: "Standard",
  },
  {
    songTitle: "Hotel California",
    requestDate: "2025-08-08",
    requestedBy: "User C",
    status: "Rejected",
    licenseType: "Standard",
  },
  {
    songTitle: "Like a Rolling Stone",
    requestDate: "2025-08-07",
    requestedBy: "User D",
    status: "Pending",
    licenseType: "Premium",
  },
  {
    songTitle: "Imagine",
    requestDate: "2025-08-06",
    requestedBy: "User E",
    status: "Approved",
    licenseType: "Standard",
  },
];

export default function Solicitudes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SongRequest | null>(
    null
  );

  const handleViewRequest = (request: SongRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Mis Solicitudes
      </h1>

      <SongRequestsTable
        requests={songData}
        onViewRequest={handleViewRequest}
      />

      {selectedRequest && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Historial de solicitud"
        >
          <RequestHistory request={selectedRequest} />
        </Modal>
      )}
    </main>
  );
}
