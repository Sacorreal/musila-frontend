export const ROLES = {
  AUTOR: 'Autor',
  CANTAUTOR: 'Cantautor',
  INTERPRETE: 'Interprete',
  INVITADO: 'Invitado',
  EDITOR: 'Editor',
} as const;

type Role = typeof ROLES[keyof typeof ROLES];

const permissionsByRole: Record<Role, string[]> = {
  [ROLES.AUTOR]: ['inicio', 'solicitudes', 'publicar', 'mensajes', 'dashboard'],
  [ROLES.CANTAUTOR]: ['inicio', 'buscar', 'publicar', 'mensajes', 'mi musica', 'solicitudes', 'dashboard', 'invitar usuario'],
  [ROLES.INTERPRETE]: ['inicio', 'buscar', 'mi musica', 'solicitudes', 'mensajes', 'invitar usuario'],
  [ROLES.INVITADO]: ['inicio', 'buscar', 'mensajes', 'mi musica'],
  [ROLES.EDITOR]: ['inicio', 'solicitudes', 'publicar', 'mensajes', 'dashboard'],
};

export const userHasPermission = (role: Role, requiredPermission: string): boolean => {
  return permissionsByRole[role]?.includes(requiredPermission) ?? false;
};