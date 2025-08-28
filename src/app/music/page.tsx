import React from "react";
import { UserSongsManager } from "../../domains/music/components/UserSongsManager";

type UserRole = "Autor" | "Cantautor" | "Interprete" | "Invitado" | "Editor";

const getCurrentUserRole = (): UserRole => {
  return "Autor";
};

const MusicHomePage = () => {
  const userRole = getCurrentUserRole();

  const renderContentByRole = () => {
    switch (userRole) {
      case "Autor":
      case "Cantautor":
        return <UserSongsManager />;

      case "Interprete":
      case "Invitado":
        return (
          <div className="p-8">
            <h1>Bienvenido, Intérprete/Invitado</h1>
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h1>Dashboard Principal</h1>
          </div>
        );
    }
  };

  return renderContentByRole();
};

export default MusicHomePage;
