# SongUsageRequestForm Component

Componente modular y reutilizable para solicitar permiso de uso de canciones.

## Características

- ✅ 3 variantes: inline, modal, drawer
- ✅ Validaciones integradas
- ✅ Drag & drop para archivos
- ✅ Responsive y accesible
- ✅ Sin dependencias de routing
- ✅ TypeScript estricto
- ✅ Modo claro/oscuro

## Import Rápido

```typescript
import { SongUsageRequestForm } from "@/domains/music/components";
```

## Props

```typescript
interface SongUsageRequestFormProps {
    songId: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    onCancel?: () => void;
    licenseOptions?: LicenseType[];
    variant?: "inline" | "modal" | "drawer";
}
```

## Ejemplos Rápidos

### Modal

```typescript
const [show, setShow] = useState(false);

<button onClick={() => setShow(true)}>Solicitar</button>
<SongUsageRequestForm songId="123" variant="modal" open={show} onOpenChange={setShow} />
```

### Drawer

```typescript
const [show, setShow] = useState(false);

<button onClick={() => setShow(true)}>Solicitar</button>
<SongUsageRequestForm songId="123" variant="drawer" open={show} onOpenChange={setShow} />
```

### Inline

```typescript
<SongUsageRequestForm songId="123" variant="inline" />
```

## Ver Más

- Documentación completa: `/USAGE_REQUEST_INTEGRATION.md`
- Ejemplos de integración: `./examples/IntegrationExamples.tsx`
- Demo interactiva: `/dev/request-usage/[songId]`

## API Backend Necesaria

- `GET /api/licenses/usage-types` - Lista de tipos de licencia
- `POST /api/songs/:songId/usage-requests` - Enviar solicitud

Ver documentación completa para detalles de endpoints.

