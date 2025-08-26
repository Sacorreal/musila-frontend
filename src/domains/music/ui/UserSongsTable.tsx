'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Song } from '@/domains/music/types';

interface UserSongsTableProps {
  songs: Song[];
}

export const UserSongsTable: React.FC<UserSongsTableProps> = ({ songs }) => {
  const router = useRouter();

  const handleSongClick = (songId: number | string) => {
    router.push(`/music/song/${songId}/edit`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-assets bg-card-bg">
      <table className="w-full text-left">
        <thead className="bg-secondary">
          <tr>
            <th className="px-4 py-3 text-foreground text-sm font-medium">#</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Cover</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Título</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Visible</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Género</th>
            <th className="px-4 py-3 text-foreground text-sm font-medium">Subgénero</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className="border-t border-t-assets hover:bg-secondary transition-colors duration-200 cursor-pointer"
              onClick={() => handleSongClick(song.id)}
            >
              <td className="h-[72px] px-4 py-2 text-foreground text-sm">{index + 1}</td>
              <td className="h-[72px] px-4 py-2">
                <Image src={song.cover} alt={song.title} width={48} height={48} className="rounded-full object-cover" />
              </td>
              <td className="h-[72px] px-4 py-2 text-foreground text-sm font-bold">{song.title}</td>
              <td className="h-[72px] px-4 py-2">
                <div className={`w-3 h-3 rounded-full ${song.visible ? 'bg-green-500' : 'bg-gray-500'}`} title={song.visible ? 'Visible' : 'Oculto'}></div>
              </td>
              <td className="h-[72px] px-4 py-2 text-text-secondary text-sm">{song.genre}</td>
              <td className="h-[72px] px-4 py-2 text-text-secondary text-sm">{song.subgenre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};