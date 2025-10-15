import { Request, Response } from "express";
import { db } from "../storage";
import { roles, permissions, rolePermissions } from "../../shared/schema";
import { eq } from "drizzle-orm";

// Get all roles
export async function getRoles(req: Request, res: Response) {
  try {
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (error) {
    console.error("Error getting roles:", error);
    res.status(500).json({ error: "Failed to get roles" });
  }
}

// Get role by ID with permissions
export async function getRoleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, parseInt(id)))
      .limit(1);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Get permissions for this role
    const rolePerms = await db
      .select({
        id: permissions.id,
        resource: permissions.resource,
        action: permissions.action,
        name: permissions.name,
        arabicName: permissions.arabicName,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, parseInt(id)));

    res.json({
      ...role,
      permissions: rolePerms,
    });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ error: "Failed to get role" });
  }
}

// Get all permissions
export async function getPermissions(req: Request, res: Response) {
  try {
    const allPermissions = await db.select().from(permissions);
    res.json(allPermissions);
  } catch (error) {
    console.error("Error getting permissions:", error);
    res.status(500).json({ error: "Failed to get permissions" });
  }
}
