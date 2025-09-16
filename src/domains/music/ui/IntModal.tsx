'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, LoaderCircle } from 'lucide-react';
import { IntProperty } from '@/domains/music/types';
import { fetchSongDocuments, uploadSongDocument } from '@/domains/music/services/song.service';

interface Props {
  songId: string;
  onClose: () => void;
}

export const IntModal: React.FC<Props> = ({ songId }) => {
  const [view, setView] = useState<'list' | 'upload'>('list');
  const [documents, setDocuments] = useState<IntProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const docs = await fetchSongDocuments(songId);
      setDocuments(docs);
      setIsLoading(false);
    };
    loadDocuments();
  }, [songId]);

  const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    const formData = new FormData(event.currentTarget);
    const result = await uploadSongDocument(songId, formData);
    
    if (result.success) {
      const newDocs = await fetchSongDocuments(songId);
      setDocuments(newDocs);
      setView('list'); 
    }
    setIsUploading(false);
  };
  
  return (
    <>
      {/* --- VISTA DE LISTA DE DOCUMENTOS --- */}
      {view === 'list' && (
        <div>
          {isLoading ? <p>Cargando documentos...</p> : (
            <div className="space-y-3 mb-6">
              {documents.map(doc => (
                <div key={doc.id} className="bg-secondary p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-text-secondary" />
                    <span>{doc.title}</span>
                  </div>
                  <a href={doc.url} download className="hover:text-primary transition-colors">
                    <Download size={20} />
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={() => setView('upload')} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
              Subir Documento
            </button>
          </div>
        </div>
      )}

      {/* --- VISTA DE SUBIR DOCUMENTO --- */}
      {view === 'upload' && (
        <form onSubmit={handleUploadSubmit}>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="font-medium">Título documento</span>
              <input type="text" name="documentTitle" required className="bg-secondary border border-assets rounded-lg p-2" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium">Documento</span>
              <input type="file" name="documentFile" required className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80"/>
            </label>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => setView('list')} className="bg-secondary font-semibold py-2 px-5 rounded-lg hover:bg-secondary/80 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isUploading} className="bg-primary text-primary-foreground font-semibold py-2 px-5 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-500 flex items-center gap-2">
              {isUploading ? <LoaderCircle className="animate-spin" size={20}/> : <Upload size={20} />}
              {isUploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </form>
      )}
    </>
  );
};