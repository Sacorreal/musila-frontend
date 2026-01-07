# Musila - Plataforma de Gestión Musical

**Musila** es una aplicación web innovadora que conecta compositores, intérpretes y editoras musicales en un ecosistema digital para la gestión, descubrimiento y licenciamiento de canciones inéditas. Desarrollada con **Next.js 15** (React 19), **TypeScript**, y **Tailwind CSS 4**, implementa una arquitectura por dominios (Screaming Architecture) que facilita escalabilidad y mantenimiento. El sistema cuenta con autenticación JWT, gestión de roles y permisos granulares (6 tipos de usuario), reproductor de audio integrado, sistema de solicitudes de licencias, subida de archivos multimedia, y validación robusta mediante React Hook Form + Zod. La interfaz incluye modo claro/oscuro con animaciones fluidas (Framer Motion), gestión de estado global con Zustand, y un diseño responsive optimizado para UX. Destacan funcionalidades como gestión de catálogos musicales con metadatos completos (ISWC, género, documentos legales), sistema de permisos para uso de canciones, búsqueda avanzada, y administración de derechos de autor para editoras.

**Stack técnico:** Next.js 15.4, React 19, TypeScript, Tailwind CSS 4, Zustand, Framer Motion, React Hook Form, Zod, JWT, next-themes.
**Arquitectura:** Screaming Architecture, separación por dominios (auth, music, tracks), componentes reutilizables, servicios API centralizados.

