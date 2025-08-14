export type Status = "Approved" | "Rejected" | "Pending";

export interface SongRequest {
//   id: string; 
  songTitle: string;
  requestDate: string;
  requestedBy: string;
  status: Status;
  licenseType: string;
}