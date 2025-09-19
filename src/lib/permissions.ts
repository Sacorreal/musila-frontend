export const ROLES = {
  ADMIN: "Admin",
  AUTOR: "Autor",
  CANTAUTOR: "Cantautor",
  INTERPRETE: "Interprete",
  INVITADO: "Invitado",
  EDITOR: "Editor",
} as const;

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

export type RoleKey = keyof typeof ROLES;

const permissionsByRole: Record<RoleValue, string[]> = {
  [ROLES.ADMIN]: ["inicio", "solicitudes", "publicar", "mensajes", "dashboard"],
  [ROLES.AUTOR]: ["inicio", "solicitudes", "publicar", "mensajes", "dashboard"],
  [ROLES.CANTAUTOR]: [
    "inicio",
    "buscar",
    "publicar",
    "mensajes",
    "mi musica",
    "solicitudes",
    "dashboard",
    "invitar usuario",
  ],
  [ROLES.INTERPRETE]: [
    "inicio",
    "buscar",
    "mi musica",
    "solicitudes",
    "mensajes",
    "invitar usuario",
  ],
  [ROLES.INVITADO]: ["inicio", "buscar", "mensajes", "mi musica"],
  [ROLES.EDITOR]: [
    "inicio",
    "solicitudes",
    "publicar",
    "mensajes",
    "dashboard",
  ],
};

export const userHasPermission = (
  roleKey: RoleKey,
  requiredPermission: string
): boolean => {
  const roleValue = ROLES[roleKey];
  if (!roleValue) return false;
  return permissionsByRole[roleValue]?.includes(requiredPermission) ?? false;
};
