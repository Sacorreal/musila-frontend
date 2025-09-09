"use client";

import React from 'react';
import { useAuth } from '@/domains/auth/store/authStore'; 
import { UserSongsManager } from '../../shared/components/Layout/UserSongsManager';
import { Spinner } from '@/shared/components/UI/Spinner';
import { userHasPermission, RoleKey } from '@/lib/permissions'; 

const MusicHomePage = () => {
  const { role, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (role && userHasPermission(role as RoleKey, 'publicar')) {
    return <UserSongsManager />;
  }
  
  if (role && userHasPermission(role as RoleKey, 'buscar')) {
    return <div className="p-8"><h1>Bienvenido, aquí puedes buscar y escuchar música.</h1></div>;
  }

  return <div className="p-8"><h1>No tienes un rol asignado o permisos para ver esta sección.</h1></div>;
};

export default MusicHomePage;