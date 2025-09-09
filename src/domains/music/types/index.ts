export type Status = "Approved" | "Rejected" | "Pending";

export interface SongRequest {
  songTitle: string;
  requestDate: string;
  requestedBy: string;
  status: Status;
  licenseType: string;
}

export interface Song {
  id: number | string;
  cover: string;
  title: string;
  visible: boolean;
  genre: string;
  subgenre: string;
}

export interface SongDetail extends Song {
  iswc: string;
  lyrics: string;
}

export interface IntProperty {
  id: string;
  title: string;
  url: string;
}


export type { Track } from "../../../domains/music/store/playerStore";
