import {
  Home,
  Music,
  Send,
  MessageSquare,
  LayoutDashboard,
  Search,
  UserPlus,
  FileText,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission: string; 
}

export const SIDEBAR_LINKS: NavItem[] = [
  { name: 'Inicio', href: '/music', icon: Home, permission: 'inicio' },
  { name: 'Buscar', href: '/music/genres', icon: Search, permission: 'buscar' },
  { name: 'Solicitudes', href: '/music/solicitudes', icon: FileText, permission: 'solicitudes' },
  { name: 'Publicar', href: '/music/publicar', icon: Send, permission: 'publicar' },
  { name: 'Mensajes', href: '/music/mensajes', icon: MessageSquare, permission: 'mensajes' },
  { name: 'Mi Música', href: '/music/mi-musica', icon: Music, permission: 'mi musica' },
  { name: 'Dashboard', href: '/music/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { name: 'Invitar Usuario', href: '/music/invitar', icon: UserPlus, permission: 'invitar usuario' },
];