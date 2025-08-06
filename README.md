# 🎶 Musila - Guía de Contribución y Flujo de Trabajo

## Este documento define la estrategia de ramas, convenciones de nombres y flujo de desarrollo utilizado por el equipo de Musila. Está diseñado para equipos pequeños que trabajan en ciclos rápidos, con enfoque en calidad, trazabilidad y automatización CI/CD.

## 🏗️ 1. Arquitectura aplicada

la arquitectura utilizada es _Screaming Architecture_ donde la estructura de carpetas “grita” lo que hace la aplicación. Por ejemplo, en lugar de /components, usamos /tracks, /users, /requests, etc. Así, el foco es el dominio del negocio, no la tecnología.

Ejemplo: `/domains/tracks/`

- `track.entity.ts`: aquí defines la entidad Track (de tu modelo), sus validaciones y lógica pura de dominio.

- `services/`: funciones que obtienen tracks desde el backend, llamados a la API (getTracksByUserId, createTrack, etc).

- `components/`: tarjetas de canción, formularios para subir tracks, reproductores, todos los componentes reutilizables.

- `types.ts`: incluye el tipo Track, TrackStatus, etc.

---

## 🌿 2. Estrategia de ramas: Feature Branching + CI/CD

- Una tarea = Una rama = Un desarrollador
- No se trabaja directamente sobre `main` o `production`
- Toda contribución pasa por Pull Request (PR)
- CI/CD corre automáticamente para cada PR

---

## 📛 3. Convención de nombres de ramas (formato Jira)

- `tipo`: feature, bugfix, hotfix, refactor, chore.
- `PROJECTKEY`: Clave del proyecto en Jira (ej. `MUS`)
- `numero`: Número del ticket en Jira (ej. `101`)
- `slug`: Descripción corta en minúscula y con guiones

### Ejemplos:

| Tipo       | Rama                                    | Uso                       |
| ---------- | --------------------------------------- | ------------------------- |
| `feature`  | `feature/MUS-101-login-form`            | Nueva funcionalidad       |
| `bugfix`   | `bugfix/MUS-203-fix-navbar`             | Corrección de errores     |
| `hotfix`   | `hotfix/MUS-309-prod-crash`             | Fix urgente en producción |
| `refactor` | `refactor/MUS-180-cleanup-auth-service` | Limpieza de código        |
| `chore`    | `chore/MUS-012-update-dependencies`     | Tarea menor               |

---

## ✅ 4. Convención de mensajes de commit (Conventional Commits + Jira)

### Tipos válidos:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `refactor`: Refactorización sin cambio de lógica
- `style`: Cambios visuales o de estilo
- `test`: Adición o modificación de pruebas
- `chore`: Cambios menores (dependencias, scripts)

### Ejemplos:

```bash
feat: [MUS-101] agregar formulario de login
fix: [MUS-203] corregir error de navegación en el navbar
refactor: [MUS-180] extraer lógica de autenticación
chore: [MUS-012] actualizar dependencias de NextJS
```

---

## 🔁 5. Flujo de trabajo con Pull Requests

- Clona el repositorio en tu local con el comando `git clone https://github.com/Sacorreal/musila-frontend.git ` (**solo se hace una única vez**).

- Actualiza los cambios del repositorio en GitHub a tu repositorio local con `git pull origin main` (**se debe hacer siempre, antes de crear una nueva rama**).

- En tu repositorio local ubicate en la rama `develop`, ingresando el comando `git checkout -b develop`.

- Toma una de las tareas asignadas en el tablero en Jira, sigue el mismo orden de asignación de tareas.

- Estando en la rama `develop` crea una nueva rama, copiando el nombre de la rama que se encuentra en la tarea en Jira `git checkout -b "nombre de tu rama"`.

- Al terminar de trabajar en tu rama local, agrega los cambios `git add .` y envía commit siguiendo la convención, ejemplo: `git commit -m "feature/MUS-101-login-form" `.

- Envia los cambios desde tu repositorio local al repositorio remoto en Github con el comando `git push origin "nombre de tu rama"`.

- Desde Github crea el **Pull Requests** asociando el ticket de Jira ejemplo: _(MUS-101)_, hacia la rama `develop`del repositorio de Musila.

---

## ‼️6. Reglas importantes

- No commits directos a main, todo cambio va vía Pull Requests.
- No trabajar en ramas ajenas, cada rama tiene un responsable único.
- Revisión obligatoria de PR, nadie aprueba su propio código.
- Relación clara PR y Ticket de Jira usa el formato [Mus-XXX] en el commit y PR.
