import { Request, Response, NextFunction } from "express";
import { supabaseAdmin, supabaseEnabled } from "../config/supabase";
import { db } from "../storage";
import { users, suppliers } from "../../shared/schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  supplierId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized - Authentication token required",
      });
    }

    const token = authHeader.substring(7);

    if (supabaseEnabled && supabaseAdmin) {
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          error: "Unauthorized - Invalid or expired token",
        });
      }

      let [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.supabaseId, user.id))
        .limit(1);

      if (!dbUser && user.email) {
        [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);
      }

      if (!dbUser) {
        return res.status(401).json({
          error: "Unauthorized - User not found",
        });
      }

      req.userId = dbUser.id.toString();
      req.userRole = dbUser.role;

      if (dbUser.role === "supplier") {
        const [supplier] = await db
          .select()
          .from(suppliers)
          .where(eq(suppliers.userId, dbUser.id))
          .limit(1);

        if (supplier) {
          req.supplierId = supplier.id.toString();
        }
      }

      next();
    } else {
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized - Development mode: x-user-id header required",
        });
      }

      req.userId = userId;
      req.userRole = userRole || "customer";

      next();
    }
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Internal server error during authentication",
    });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userRole || req.userRole !== "platform_admin") {
    return res.status(403).json({
      error: "Forbidden - Admin access required",
    });
  }

  next();
}

export function requireSupplier(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userRole || req.userRole !== "supplier") {
    return res.status(403).json({
      error: "Forbidden - Supplier access required",
    });
  }

  if (!req.supplierId) {
    return res.status(403).json({
      error: "Forbidden - Supplier ID not found",
    });
  }

  next();
}

export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized - Authentication required",
      });
    }

    next();
  };
}
