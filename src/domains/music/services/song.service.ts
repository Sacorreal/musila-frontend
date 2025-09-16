import { Song, SongDetail, SongRequest, IntProperty  } from '../types';

export const fetchUserSongs = async (): Promise<Song[]> => {
  console.log("Fetching user songs from API...");
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return [
    { id: 1, cover: '/cover1.jpg', title: 'Melodía de un Sueño', visible: true, genre: 'Pop', subgenre: 'Indie Pop' },
    { id: 2, cover: '/cover2.jpg', title: 'Ecos de la Ciudad', visible: true, genre: 'Rock', subgenre: 'Alternativo' },
    { id: 3, cover: '/cover3.jpg', title: 'Ritmo Nocturno', visible: false, genre: 'Electronic', subgenre: 'House' },
  ];
};

export const fetchSongDetails = async (id: string): Promise<SongDetail | null> => {
    console.log(`Fetching details for song ${id} from API...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id,
        cover: '/cover1.jpg',
        title: 'Melodía de un Sueño',
        visible: true,
        genre: 'Pop',
        subgenre: 'Indie Pop',
        iswc: 'T-123.456.789-0',
        lyrics: 'En el silencio de la noche, una estrella fugaz...'
    };
}

export const saveSongChanges = async (songData: SongDetail): Promise<{ success: boolean }> => {
    console.log("Saving changes for song:", songData);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}


export const fetchRequestsForSong = async (songId: string): Promise<SongRequest[]> => {
  console.log(`Buscando solicitudes para la canción ${songId}...`);
  return [
    { songTitle: 'Melody of Dreams', requestedBy: 'Olivia Bennett', requestDate: '2023-08-15', status: 'Pending', licenseType: 'Sincronización' },
    { songTitle: 'Melody of Dreams', requestedBy: 'Ethan Carter', requestDate: '2023-08-10', status: 'Approved', licenseType: 'Master' },
    { songTitle: 'Melody of Dreams', requestedBy: 'Sophia Davis', requestDate: '2023-08-05', status: 'Rejected', licenseType: 'Sincronización' },
  ];
};


export const fetchSongDocuments = async (songId: string): Promise<IntProperty[]> => {
  console.log(`Buscando documentos para la canción ${songId}...`);
  return [
    { id: '1', title: 'Split Sheet', url: '/docs/split-sheet.pdf' },
    { id: '2', title: 'DNDA', url: '/docs/dnda.pdf' },
  ];
};

export const uploadSongDocument = async (songId: string, formData: FormData): Promise<{ success: boolean }> => {
  const title = formData.get('documentTitle');
  const file = formData.get('documentFile') as File;
  console.log(`Subiendo documento para la canción ${songId}:`);
  console.log(`- Título: ${title}`);
  console.log(`- Archivo: ${file.name}, Tamaño: ${file.size} bytes`);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};