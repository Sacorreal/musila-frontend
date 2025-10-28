# SongUsageRequestForm - Guía de Integración

## Importación

```typescript
import { SongUsageRequestForm } from "@/domains/music/components";
```

## Uso Básico

### Variante Inline

```typescript
<SongUsageRequestForm
  songId="123"
  variant="inline"
  onSuccess={() => console.log("Solicitud enviada")}
/>
```

### Variante Modal

```typescript
const [showModal, setShowModal] = useState(false);

<button onClick={() => setShowModal(true)}>
  Solicitar Uso
</button>

<SongUsageRequestForm
  songId="123"
  variant="modal"
  open={showModal}
  onOpenChange={setShowModal}
  onSuccess={() => {
    console.log("Solicitud enviada");
    setShowModal(false);
  }}
/>
```

### Variante Drawer

```typescript
const [showDrawer, setShowDrawer] = useState(false);

<button onClick={() => setShowDrawer(true)}>
  Solicitar Uso
</button>

<SongUsageRequestForm
  songId="123"
  variant="drawer"
  open={showDrawer}
  onOpenChange={setShowDrawer}
  onSuccess={() => {
    console.log("Solicitud enviada");
    setShowDrawer(false);
  }}
/>
```

## Props

| Prop             | Tipo                              | Requerido | Default    | Descripción                            |
| ---------------- | --------------------------------- | --------- | ---------- | -------------------------------------- |
| `songId`         | `string`                          | ✅        | -          | ID de la canción                       |
| `variant`        | `"inline" \| "modal" \| "drawer"` | ❌        | `"inline"` | Modo de renderizado                    |
| `open`           | `boolean`                         | ❌        | `true`     | Controla la visibilidad (modal/drawer) |
| `onOpenChange`   | `(open: boolean) => void`         | ❌        | -          | Callback para cambios de visibilidad   |
| `onSuccess`      | `() => void`                      | ❌        | -          | Callback cuando se envía con éxito     |
| `onCancel`       | `() => void`                      | ❌        | -          | Callback al cancelar                   |
| `licenseOptions` | `LicenseType[]`                   | ❌        | -          | Opciones de licencia personalizadas    |

## Integración en Vistas Existentes

### Desde el reproductor de audio

```typescript
import { useState } from "react";
import { SongUsageRequestForm } from "@/domains/music/components";

function AudioPlayer({ songId }: { songId: string }) {
  const [showRequestForm, setShowRequestForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowRequestForm(true)}>
        Solicitar Uso
      </button>

      <SongUsageRequestForm
        songId={songId}
        variant="modal"
        open={showRequestForm}
        onOpenChange={setShowRequestForm}
        onSuccess={() => {
          alert("Solicitud enviada con éxito");
          setShowRequestForm(false);
        }}
      />
    </div>
  );
}
```

### Desde una lista de canciones

```typescript
function SongCard({ song }: { song: { id: string; title: string } }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div>
      <h3>{song.title}</h3>
      <button onClick={() => setShowDrawer(true)}>
        Solicitar Permiso
      </button>

      <SongUsageRequestForm
        songId={song.id}
        variant="drawer"
        open={showDrawer}
        onOpenChange={setShowDrawer}
      />
    </div>
  );
}
```

## API Backend Requerida

El componente espera los siguientes endpoints:

### GET /licenses/usage-types

Retorna los tipos de licencia disponibles

**Response:**

```json
[
    {
        "id": "sync",
        "name": "Sincronización",
        "type": "sync"
    },
    {
        "id": "master",
        "name": "Master",
        "type": "master"
    }
]
```

### POST /songs/:songId/usage-requests

Envía una solicitud de uso

**Request (multipart/form-data):**

- `message`: string (required)
- `licenseType`: string (required)
- `file`: File (optional)

**Response:**

```json
{
    "success": true,
    "message": "Solicitud enviada con éxito"
}
```

## Validaciones

- Mensaje: obligatorio, no vacío
- Tipo de licencia: obligatorio
- Archivo: opcional, PNG/JPG/GIF, máximo 10MB

## Estados

- **pending**: Cargando datos o enviando solicitud
- **error**: Error en validación o envío
- **success**: Solicitud enviada correctamente

## Personalización

### Opciones de licencia personalizadas

```typescript
const customLicenses = [
  { value: "basic", label: "Licencia Básica" },
  { value: "premium", label: "Licencia Premium" },
];

<SongUsageRequestForm
  songId="123"
  licenseOptions={customLicenses}
/>
```

## Integración con el Audio Player

El componente ya está integrado en el reproductor de audio principal:

1. Click en el botón de tres puntos (⋮) del player
2. Selecciona "Solicitar uso"
3. Se abre el modal con animación fade + scale

Ver detalles completos en `PLAYER_INTEGRATION_SUMMARY.md`

## Animaciones

El componente incluye animaciones sutiles con framer-motion:

**Modal:**

- Backdrop: fade 0 → 1 (200ms)
- Contenido: scale 0.95 → 1 + fade (180ms)

**Drawer:**

- Backdrop: fade 0 → 1 (200ms)
- Panel: slide desde derecha (250ms)

Para que funcionen correctamente, envuelve el componente con `AnimatePresence`:

```typescript
import { AnimatePresence } from "framer-motion";

<AnimatePresence>
  {showModal && (
    <SongUsageRequestForm
      songId="123"
      variant="modal"
      open={showModal}
      onOpenChange={setShowModal}
    />
  )}
</AnimatePresence>
```

## Demo

Visita `/dev/request-usage/[songId]` para ver todas las variantes en acción.

## Debugging

Activa logs detallados con:

```
NEXT_PUBLIC_DEBUG=true
```

Los logs aparecerán en la consola con prefijo `RC:`
