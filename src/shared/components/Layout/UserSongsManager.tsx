"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Song } from "@/domains/music/types";
import { fetchUserSongs } from "@/domains/music/services/song.service";
import { UserSongsTable } from "@/domains/music/ui/UserSongsTable";
import {SearchBar} from "@/shared/components/UI/Searchbar";

export const UserSongsManager: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      const userSongs = await fetchUserSongs();
      setSongs(userSongs);
      setIsLoading(false);
    };
    loadSongs();
  }, []);

  const filteredSongs = useMemo(
    () =>
      songs.filter((song) =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [songs, searchTerm]
  );

  return (
    <div className="p-8">
      <div className="mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <p className="mb-6 text-gray-400">
        Total de canciones: {filteredSongs.length}
      </p>

      {isLoading ? (
        <div>Cargando tus canciones...</div>
      ) : (
        <UserSongsTable songs={filteredSongs} />
      )}
    </div>
  );
};
