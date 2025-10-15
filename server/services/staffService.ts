import { db } from "../storage";
import { staff, users, userRoles, roles, rolePermissions, permissions, userPermissions } from "../../shared/schema";
import { eq, and, or } from "drizzle-orm";

export interface StaffMember {
  id: number;
  userId: number | null;
  name: string;
  arabicName: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  specialization: string | null;
  arabicSpecialization: string | null;
  clinicId: number;
  role: string;
  arabicRole: string | null;
  roleId: number | null;
  permissions: string[];
  status: string | null;
  createdAt: Date;
}

export interface CreateStaffInput {
  clinicId: number;
  userId?: number | null; // Optional - if linking to existing user
  name: string;
  arabicName: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  avatar?: string;
  role: string;
  arabicRole?: string;
  specialization?: string;
  arabicSpecialization?: string;
  roleId?: number; // The role to assign (from roles table)
}

export interface UpdateStaffInput {
  name?: string;
  arabicName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  specialization?: string;
  arabicSpecialization?: string;
  role?: string;
  arabicRole?: string;
  roleId?: number;
  status?: string;
}

class StaffService {
  // Get all staff for a clinic
  async getClinicStaff(clinicId: number): Promise<StaffMember[]> {
    const staffMembers = await db
      .select({
        id: staff.id,
        userId: staff.userId,
        name: staff.name,
        arabicName: staff.arabicName,
        email: staff.email,
        phone: staff.phone,
        avatar: staff.avatar,
        specialization: staff.specialization,
        arabicSpecialization: staff.arabicSpecialization,
        clinicId: staff.clinicId,
        role: staff.role,
        arabicRole: staff.arabicRole,
        roleId: userRoles.roleId,
        status: staff.status,
        createdAt: staff.createdAt,
      })
      .from(staff)
      .leftJoin(userRoles, and(
        eq(userRoles.userId, staff.userId),
        or(
          eq(userRoles.clinicId, clinicId),
          eq(userRoles.clinicId, null) // Global roles
        )
      ))
      .where(eq(staff.clinicId, clinicId));

    // Get permissions for each staff member
    const result: StaffMember[] = [];
    for (const member of staffMembers) {
      const perms = member.userId ? await this.getUserPermissions(member.userId, clinicId) : [];
      result.push({
        ...member,
        permissions: perms,
      });
    }

    return result;
  }

  // Get staff member by ID
  async getStaffById(id: number): Promise<StaffMember | null> {
    const [staffMember] = await db
      .select({
        id: staff.id,
        userId: staff.userId,
        name: staff.name,
        arabicName: staff.arabicName,
        email: staff.email,
        phone: staff.phone,
        avatar: staff.avatar,
        specialization: staff.specialization,
        arabicSpecialization: staff.arabicSpecialization,
        clinicId: staff.clinicId,
        role: staff.role,
        arabicRole: staff.arabicRole,
        roleId: userRoles.roleId,
        status: staff.status,
        createdAt: staff.createdAt,
      })
      .from(staff)
      .leftJoin(userRoles, eq(userRoles.userId, staff.userId))
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) return null;

    const perms = staffMember.userId ? await this.getUserPermissions(staffMember.userId, staffMember.clinicId) : [];
    return {
      ...staffMember,
      permissions: perms,
    };
  }

  // Create new staff member
  async createStaff(input: CreateStaffInput): Promise<StaffMember> {
    let userId = input.userId;

    // If username/email and password provided but no userId, create a user account
    if (!userId && (input.username || input.email) && input.password) {
      // Hash password
      const crypto = await import('crypto');
      const hashedPassword = crypto.createHash('sha256').update(input.password).digest('hex');

      const [newUser] = await db
        .insert(users)
        .values({
          email: input.email || `${input.username}@staff.local`,
          password: hashedPassword,
          name: input.name,
          arabicName: input.arabicName || input.name,
          role: "staff",
          phone: input.phone || null,
          verified: true,
        })
        .returning();
      
      userId = newUser.id;
    }

    // Hash password for staff table if provided
    let staffHashedPassword = null;
    if (input.password) {
      const crypto = await import('crypto');
      staffHashedPassword = crypto.createHash('sha256').update(input.password).digest('hex');
    }

    // Create staff record
    const [newStaff] = await db
      .insert(staff)
      .values({
        userId: userId || null,
        clinicId: input.clinicId,
        name: input.name,
        arabicName: input.arabicName,
        email: input.email || null,
        phone: input.phone || null,
        username: input.username || null,
        password: staffHashedPassword,
        avatar: input.avatar || null,
        role: input.role,
        arabicRole: input.arabicRole || null,
        specialization: input.specialization || null,
        arabicSpecialization: input.arabicSpecialization || null,
        status: "active",
      })
      .returning();

    // If we have userId and roleId, assign role to user
    if (userId && input.roleId) {
      await db
        .insert(userRoles)
        .values({
          userId,
          roleId: input.roleId,
          clinicId: input.clinicId,
        })
        .onConflictDoNothing(); // In case role already assigned
    }

    return this.getStaffById(newStaff.id) as Promise<StaffMember>;
  }

  // Update staff member
  async updateStaff(id: number, input: UpdateStaffInput): Promise<StaffMember | null> {
    const existing = await this.getStaffById(id);
    if (!existing) return null;

    // Update staff record
    const updates: any = {};
    if (input.name) updates.name = input.name;
    if (input.arabicName) updates.arabicName = input.arabicName;
    if (input.phone) updates.phone = input.phone;
    if (input.email) updates.email = input.email;
    if (input.avatar) updates.avatar = input.avatar;
    if (input.specialization) updates.specialization = input.specialization;
    if (input.arabicSpecialization) updates.arabicSpecialization = input.arabicSpecialization;
    if (input.role) updates.role = input.role;
    if (input.arabicRole) updates.arabicRole = input.arabicRole;
    if (input.status) updates.status = input.status;

    if (Object.keys(updates).length > 0) {
      await db
        .update(staff)
        .set(updates)
        .where(eq(staff.id, id));
    }

    // Update role if provided and user is linked
    if (input.roleId && existing.userId) {
      await db
        .update(userRoles)
        .set({ roleId: input.roleId })
        .where(and(
          eq(userRoles.userId, existing.userId),
          eq(userRoles.clinicId, existing.clinicId)
        ));
    }

    return this.getStaffById(id);
  }

  // Delete staff member
  async deleteStaff(id: number): Promise<boolean> {
    const result = await db.delete(staff).where(eq(staff.id, id)).returning();
    return result.length > 0;
  }

  // Get user permissions (from roles + direct permissions)
  async getUserPermissions(userId: number, clinicId: number): Promise<string[]> {
    // Get permissions from roles
    const rolePerms = await db
      .select({
        resource: permissions.resource,
        action: permissions.action,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(and(
        eq(userRoles.userId, userId),
        or(
          eq(userRoles.clinicId, clinicId),
          eq(userRoles.clinicId, null)
        )
      ));

    // Get direct user permissions
    const directPerms = await db
      .select({
        resource: permissions.resource,
        action: permissions.action,
      })
      .from(userPermissions)
      .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
      .where(and(
        eq(userPermissions.userId, userId),
        or(
          eq(userPermissions.clinicId, clinicId),
          eq(userPermissions.clinicId, null)
        )
      ));

    // Combine and format permissions
    const allPerms = [...rolePerms, ...directPerms];
    return allPerms.map(p => `${p.resource}:${p.action}`);
  }

  // Check if user has permission
  async hasPermission(userId: number, resource: string, action: string, clinicId?: number): Promise<boolean> {
    const perms = await this.getUserPermissions(userId, clinicId || 0);
    return perms.includes(`${resource}:${action}`);
  }

  // Authenticate staff member
  async authenticateStaff(username: string, password: string): Promise<{ success: boolean; staff?: any }> {
    try {
      // Hash the provided password
      const crypto = await import('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      // Find staff by username and password
      const [staffMember] = await db
        .select()
        .from(staff)
        .where(and(
          eq(staff.username, username),
          eq(staff.password, hashedPassword)
        ))
        .limit(1);

      if (!staffMember) {
        return { success: false };
      }

      // Return staff data without password
      const { password: _, ...staffData } = staffMember;
      return {
        success: true,
        staff: staffData
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false };
    }
  }
}

export const staffService = new StaffService();
