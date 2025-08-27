'use client';

import React, { useState, useEffect } from 'react';
import { SongRequest, Status } from '@/domains/music/types';
import { fetchRequestsForSong } from '@/domains/music/services/song.service';
import { useRouter } from 'next/navigation';

interface Props {
  songId: string;
}

const getStatusClasses = (status: Status) => {
  if (status === "Approved") return "bg-green-500/20 text-approved";
  if (status === "Rejected") return "bg-red-500/20 text-rejected";
  return "bg-secondary text-text-secondary";
};

export const SongRequestsForSongTable: React.FC<Props> = ({ songId }) => {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      const data = await fetchRequestsForSong(songId);
      setRequests(data);
      setIsLoading(false);
    };
    loadRequests();
  }, [songId]);

  if (isLoading) return <p className="text-text-secondary">Cargando solicitudes...</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-assets bg-card-bg">
      <table className="w-full text-left">
        <thead className="bg-secondary">
          <tr>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Solicitante</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Fecha</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Estado</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index} className="border-t border-t-assets">
              <td className="h-[72px] px-4 py-2 text-foreground">{request.requestedBy}</td>
              <td className="h-[72px] px-4 py-2 text-text-secondary">{request.requestDate}</td>
              <td className="h-[72px] px-4 py-2">
                <div className={`flex min-w-[70px] max-w-[100px] items-center justify-center rounded-full h-8 px-4 text-sm font-medium w-full ${getStatusClasses(request.status)}`}>
                  <span className="truncate">{request.status}</span>
                </div>
              </td>
              <td className="h-[72px] px-4 py-2">
                <button
                  onClick={() => router.push(`/music/song-requests/${'some-request-id'}`)} // Navegaría al detalle de la solicitud
                  className="text-foreground font-bold hover:text-primary transition-colors"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};