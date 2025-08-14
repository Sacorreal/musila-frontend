import React from "react";
import { SongRequest, Status } from "@/domains/music/types";


interface SongRequestsTableProps {
  requests: SongRequest[];
  onViewRequest: (request: SongRequest) => void;
}

const SongRequestsTable = ({ requests, onViewRequest }: SongRequestsTableProps) => {
  const getStatusClasses = (status: Status) => {
    let statusStyles = "bg-secondary text-text-secondary";
    if (status === "Approved") {
      statusStyles = "bg-green-500/20 text-approved";
    } else if (status === "Rejected") {
      statusStyles = "bg-red-500/20 text-rejected";
    }
    return `flex min-w-[70px] max-w-[100px] items-center justify-center rounded-full h-8 px-4 text-sm font-medium w-full ${statusStyles}`;
  };

  
  return (
    <div className="@container">
      <div className="flex overflow-hidden rounded-xl border border-assets bg-card-bg">
        <table className="w-full text-left">
          <thead className="bg-assets">
            <tr>
              <th className={`px-4 py-3 text-foreground text-sm font-medium `}>
                Song Title
              </th>
              <th className={`px-4 py-3 text-foreground text-sm font-medium `}>
                Request Date
              </th>
              <th className={`px-4 py-3 text-foreground text-sm font-medium `}>
                Requested By
              </th>
              <th className={`px-4 py-3 text-foreground text-sm font-medium `}>
                Status
              </th>
              <th className={`px-4 py-3 text-foreground text-sm font-medium `}>
                License Type
              </th>
              <th
                className={`px-4 py-3 text-foreground text-sm font-medium `}
              ></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.songTitle} className="border-t border-t-assets">
                <td className={`h-[72px] px-4 py-2 text-foreground text-sm `}>
                  {request.songTitle}
                </td>
                <td
                  className={`h-[72px] px-4 py-2 text-text-secondary text-sm `}
                >
                  {request.requestDate}
                </td>
                <td
                  className={`h-[72px] px-4 py-2 text-text-secondary text-sm `}
                >
                  {request.requestedBy}
                </td>
                <td className={`h-[72px] px-4 py-2`}>
                  <div className={getStatusClasses(request.status)}>
                    <span className="truncate">{request.status}</span>
                  </div>
                </td>
                <td
                  className={`h-[72px] px-4 py-2 text-text-secondary text-sm`}
                >
                  {request.licenseType}
                </td>
                <td
                  className={`h-[72px] px-4 py-2 text-text-secondary text-sm font-bold`}
                >
                  <button
                    onClick={() => onViewRequest(request)}
                    className="text-foreground cursor-pointer hover:text-white"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongRequestsTable;
