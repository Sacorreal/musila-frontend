"use client";

import React from 'react';
import { useAuth } from '@/domains/auth/store/authStore'; 
import { ROLES } from '@/lib/permissions'; 
import { UserSongsManager } from '../../shared/components/Layout/UserSongsManager';
import { Spinner } from '@/shared/components/UI/Spinner';

const MusicHomePage = () => {
  const { role, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const renderContentByRole = () => {
    switch (role) {
      case ROLES.AUTOR:
      case ROLES.CANTAUTOR:
        return <UserSongsManager />;
      
      case ROLES.INTERPRETE:
      case ROLES.INVITADO:
        return <div className="p-8"><h1>Bienvenido, aquí puedes buscar y escuchar música.</h1></div>;
      
      case ROLES.EDITOR:
        return <div className="p-8"><h1>Dashboard de Editor</h1></div>;

      default:
        return <div className="p-8"><h1>No tienes un rol asignado.</h1></div>;
    }
  };

  return renderContentByRole();
};

export default MusicHomePage;