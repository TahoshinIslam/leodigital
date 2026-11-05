/**
 * Role-based access control. Roles are stored on the user row; what each role
 * may do lives here, in one typed table, so the admin UI (hiding buttons) and
 * the server (enforcing) read the same source of truth. The server check is
 * the one that counts — UI hiding is only a convenience.
 */
export const ROLES = ["super_admin", "admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "dashboard:view",
  "services:read",
  "services:create",
  "services:update",
  "services:publish",
  "services:delete",
  "media:upload",
  "users:read",
  "users:manage",
  "audit:read",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const editor: Permission[] = [
  "dashboard:view",
  "services:read",
  "services:create",
  "services:update",
  "media:upload",
];
const admin: Permission[] = [...editor, "services:publish", "services:delete", "users:read", "audit:read"];

export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  super_admin: new Set(PERMISSIONS),
  admin: new Set(admin),
  editor: new Set(editor),
  viewer: new Set(["dashboard:view", "services:read"]),
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Everything, including managing users and roles.",
  admin: "Publish, unpublish and delete services; view users and the audit log.",
  editor: "Create and edit services and upload images. Cannot publish or delete.",
  viewer: "Read-only access to the dashboard and services.",
};

export function can(role: Role | undefined | null, permission: Permission): boolean {
  return !!role && ROLE_PERMISSIONS[role].has(permission);
}

/** Rank for "can't manage someone above you" checks. */
export const ROLE_RANK: Record<Role, number> = { viewer: 0, editor: 1, admin: 2, super_admin: 3 };
