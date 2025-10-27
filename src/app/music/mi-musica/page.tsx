import React from "react";

const MiMusicPage = () => {
  return (
    <div className="max-w-4xl">
      <p>
        Dentro de la ruta mi musica se debe crear el componente que liste todas
        las playlists creadas por el usuario y al darle click en el boton nueva
        lista, desplegar un modal que me despliegue el form para crear una nueva
        playlist, incluir imagen de la playlists si el usuario asigno una, sino
        por defecto el logo de la app, el numero de canciones.
      </p>
      <br />
      <ul>
        <li>1. necesito poder crear una playlist</li>
        <li>2. necesito poder consumir una api de las playlist guardadas</li>
        <li>3. con que informacion se crea una playlist (MUS 79)</li>
      </ul>
    </div>
  );
};

export default MiMusicPage;
