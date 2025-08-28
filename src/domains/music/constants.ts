import {
  Home,
  Music,
  Send,
  MessageSquare,
  LayoutDashboard,
  Search,
  UserPlus,
  FileText,
  PenSquare,
} from 'lucide-react';
import { ROLES } from '@/lib/permissions';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export const SIDEBAR_LINKS: Record<string, NavItem[]> = {
  [ROLES.AUTOR]: [
    { name: 'Inicio', href: '/music', icon: Home },
    { name: 'Solicitudes', href: '/music/solicitudes', icon: FileText },
    { name: 'Publicar', href: '/music/publicar', icon: Send },
    { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare },
    { name: 'Dashboard', href: '/music/dashboard', icon: LayoutDashboard },
  ],
  [ROLES.CANTAUTOR]: [
    { name: 'Inicio', href: '/music', icon: Home },
    { name: 'Buscar', href: '/music/buscar', icon: Search },
    { name: 'Publicar', href: '/music/publicar', icon: Send },
    { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare },
    { name: 'Mi Música', href: '/music/mi-musica', icon: Music },
    { name: 'Solicitudes', href: '/music/solicitudes', icon: FileText },
    { name: 'Dashboard', href: '/music/dashboard', icon: LayoutDashboard },
    { name: 'Invitar Usuario', href: '/music/invitar', icon: UserPlus },
  ],
  [ROLES.INTERPRETE]: [
    { name: 'Inicio', href: '/music', icon: Home },
    { name: 'Buscar', href: '/music/buscar', icon: Search },
    { name: 'Mi Música', href: '/music/mi-musica', icon: Music },
    { name: 'Solicitudes', href: '/music/solicitudes', icon: FileText },
    { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare },
    { name: 'Invitar Usuario', href: '/music/invitar', icon: UserPlus },
  ],
  [ROLES.INVITADO]: [
    { name: 'Inicio', href: '/music', icon: Home },
    { name: 'Buscar', href: '/music/buscar', icon: Search },
    { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare },
    { name: 'Mi Música', href: '/music/mi-musica', icon: Music },
  ],
  [ROLES.EDITOR]: [
    { name: 'Inicio', href: '/music', icon: Home },
    { name: 'Solicitudes', href: '/music/solicitudes', icon: FileText },
    { name: 'Publicar', href: '/music/publicar', icon: PenSquare },
    { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare },
    { name: 'Dashboard', href: '/music/dashboard', icon: LayoutDashboard },
  ],
};