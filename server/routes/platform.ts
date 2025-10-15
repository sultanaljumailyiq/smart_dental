import { Router, Request, Response } from "express";
import { db } from "../storage";
import { platformCommissions, commissionSettings, suppliers, orders, orderItems } from "../../shared/schema";
import { eq, desc, sql, and, gte, lte, sum, count } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Apply admin authentication to all routes
router.use(requireAuth);
router.use(requireAdmin);

// Get platform commission statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter;
    if (startDate && endDate) {
      dateFilter = and(
        gte(platformCommissions.createdAt, new Date(startDate as string)),
        lte(platformCommissions.createdAt, new Date(endDate as string))
      );
    }

    // Get total commissions
    const [totalStats] = await db
      .select({
        totalCommissions: sum(platformCommissions.commissionAmount),
        totalOrders: count(platformCommissions.id),
        pendingCommissions: sum(
          sql`CASE WHEN ${platformCommissions.status} = 'pending' THEN ${platformCommissions.commissionAmount} ELSE 0 END`
        ),
        collectedCommissions: sum(
          sql`CASE WHEN ${platformCommissions.status} = 'paid' THEN ${platformCommissions.commissionAmount} ELSE 0 END`
        ),
      })
      .from(platformCommissions)
      .where(dateFilter);

    // Get commission by supplier
    const commissionBySupplier = await db
      .select({
        supplierId: platformCommissions.supplierId,
        supplierName: suppliers.companyName,
        totalCommissions: sum(platformCommissions.commissionAmount),
        totalOrders: count(platformCommissions.id),
        avgCommissionRate: sql<number>`AVG(${platformCommissions.commissionRate})`,
      })
      .from(platformCommissions)
      .leftJoin(suppliers, eq(platformCommissions.supplierId, suppliers.id))
      .where(dateFilter)
      .groupBy(platformCommissions.supplierId, suppliers.companyName)
      .orderBy(desc(sum(platformCommissions.commissionAmount)))
      .limit(10);

    res.json({
      totalStats: {
        totalCommissions: totalStats?.totalCommissions || "0",
        totalOrders: totalStats?.totalOrders || 0,
        pendingCommissions: totalStats?.pendingCommissions || "0",
        collectedCommissions: totalStats?.collectedCommissions || "0",
      },
      topSuppliers: commissionBySupplier,
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ error: "Failed to fetch platform statistics" });
  }
});

// Get all platform commissions with filters
router.get("/commissions", async (req: Request, res: Response) => {
  try {
    const { status, supplierId, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let conditions = [];
    
    if (status) {
      conditions.push(eq(platformCommissions.status, status as string));
    }
    
    if (supplierId) {
      conditions.push(eq(platformCommissions.supplierId, Number(supplierId)));
    }
    
    if (startDate && endDate) {
      conditions.push(
        and(
          gte(platformCommissions.createdAt, new Date(startDate as string)),
          lte(platformCommissions.createdAt, new Date(endDate as string))
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const commissions = await db
      .select({
        id: platformCommissions.id,
        orderId: platformCommissions.orderId,
        orderNumber: orders.orderNumber,
        supplierId: platformCommissions.supplierId,
        supplierName: suppliers.companyName,
        orderTotal: platformCommissions.orderTotal,
        commissionRate: platformCommissions.commissionRate,
        commissionAmount: platformCommissions.commissionAmount,
        status: platformCommissions.status,
        paidAt: platformCommissions.paidAt,
        createdAt: platformCommissions.createdAt,
      })
      .from(platformCommissions)
      .leftJoin(suppliers, eq(platformCommissions.supplierId, suppliers.id))
      .leftJoin(orders, eq(platformCommissions.orderId, orders.id))
      .where(whereClause)
      .orderBy(desc(platformCommissions.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ commissions, count: commissions.length });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ error: "Failed to fetch commissions" });
  }
});

// Get commission settings for all suppliers
router.get("/commission-settings", async (req: Request, res: Response) => {
  try {
    const settings = await db
      .select({
        id: commissionSettings.id,
        supplierId: commissionSettings.supplierId,
        supplierName: suppliers.companyName,
        commissionRate: commissionSettings.commissionRate,
        minCommission: commissionSettings.minCommission,
        isActive: commissionSettings.isActive,
        notes: commissionSettings.notes,
      })
      .from(commissionSettings)
      .leftJoin(suppliers, eq(commissionSettings.supplierId, suppliers.id))
      .orderBy(desc(commissionSettings.createdAt));

    res.json({ settings });
  } catch (error) {
    console.error("Error fetching commission settings:", error);
    res.status(500).json({ error: "Failed to fetch commission settings" });
  }
});

// Update commission settings for a supplier
router.put("/commission-settings/:supplierId", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const { commissionRate, minCommission, isActive, notes } = req.body;

    // Check if settings exist
    const [existing] = await db
      .select()
      .from(commissionSettings)
      .where(eq(commissionSettings.supplierId, supplierId))
      .limit(1);

    let result;
    if (existing) {
      // Update existing
      [result] = await db
        .update(commissionSettings)
        .set({
          commissionRate,
          minCommission,
          isActive,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(commissionSettings.supplierId, supplierId))
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(commissionSettings)
        .values({
          supplierId,
          commissionRate,
          minCommission,
          isActive,
          notes,
        })
        .returning();
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating commission settings:", error);
    res.status(500).json({ error: "Failed to update commission settings" });
  }
});

// Mark commission as paid
router.post("/commissions/:id/mark-paid", async (req: Request, res: Response) => {
  try {
    const commissionId = parseInt(req.params.id);

    const [updated] = await db
      .update(platformCommissions)
      .set({
        status: "paid",
        paidAt: new Date(),
      })
      .where(eq(platformCommissions.id, commissionId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Commission record not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error marking commission as paid:", error);
    res.status(500).json({ error: "Failed to mark commission as paid" });
  }
});

export default router;
