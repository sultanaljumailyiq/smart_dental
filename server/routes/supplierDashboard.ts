import { Router, Request, Response } from "express";
import { db } from "../storage";
import { 
  suppliers, 
  orders, 
  products, 
  orderItems,
  supplierNotifications 
} from "../../shared/schema";
import { eq, and, gte, lte, desc, sql, lt, inArray } from "drizzle-orm";

const router = Router();

const LOW_STOCK_THRESHOLD = 20;

router.get("/:supplierId/stats", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "معرف المورد غير صحيح" });
    }
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const revenueStats = await db
      .select({
        today: sql<string>`COALESCE(SUM(CASE WHEN ${orderItems.createdAt} >= ${todayStart} THEN CAST(${orderItems.subtotal} AS NUMERIC) ELSE 0 END), 0)`,
        thisWeek: sql<string>`COALESCE(SUM(CASE WHEN ${orderItems.createdAt} >= ${weekStart} THEN CAST(${orderItems.subtotal} AS NUMERIC) ELSE 0 END), 0)`,
        thisMonth: sql<string>`COALESCE(SUM(CASE WHEN ${orderItems.createdAt} >= ${monthStart} THEN CAST(${orderItems.subtotal} AS NUMERIC) ELSE 0 END), 0)`,
        total: sql<string>`COALESCE(SUM(CAST(${orderItems.subtotal} AS NUMERIC)), 0)`,
      })
      .from(orderItems)
      .where(eq(orderItems.supplierId, supplierId));

    const orderIdsResult = await db
      .selectDistinct({ orderId: orderItems.orderId })
      .from(orderItems)
      .where(eq(orderItems.supplierId, supplierId));
    
    const orderIds = orderIdsResult.map(r => r.orderId);

    let orderStats;
    if (orderIds.length > 0) {
      orderStats = await db
        .select({
          pending: sql<number>`COUNT(CASE WHEN ${orders.status} = 'pending' THEN 1 END)`,
          processing: sql<number>`COUNT(CASE WHEN ${orders.status} = 'processing' THEN 1 END)`,
          completed: sql<number>`COUNT(CASE WHEN ${orders.status} = 'delivered' THEN 1 END)`,
          cancelled: sql<number>`COUNT(CASE WHEN ${orders.status} = 'cancelled' THEN 1 END)`,
          total: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .where(inArray(orders.id, orderIds));
    } else {
      orderStats = [{
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      }];
    }

    const productStats = await db
      .select({
        total: sql<number>`COUNT(*)`,
        active: sql<number>`COUNT(CASE WHEN ${products.isActive} = true THEN 1 END)`,
        outOfStock: sql<number>`COUNT(CASE WHEN ${products.stockQuantity} = 0 THEN 1 END)`,
        lowStock: sql<number>`COUNT(CASE WHEN ${products.stockQuantity} > 0 AND ${products.stockQuantity} < ${LOW_STOCK_THRESHOLD} THEN 1 END)`,
      })
      .from(products)
      .where(eq(products.supplierId, supplierId));

    const lastMonthRevenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${orderItems.subtotal} AS NUMERIC)), 0)`,
      })
      .from(orderItems)
      .where(
        and(
          eq(orderItems.supplierId, supplierId),
          gte(orderItems.createdAt, lastMonthStart),
          lte(orderItems.createdAt, lastMonthEnd)
        )
      );

    const thisMonthRev = parseFloat(revenueStats[0]?.thisMonth || "0");
    const lastMonthRev = parseFloat(lastMonthRevenue[0]?.total || "0");
    const trend = lastMonthRev > 0 
      ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 
      : 0;

    let customerStats = { total: 0, new: 0, returning: 0 };
    if (orderIds.length > 0) {
      const uniqueCustomers = await db
        .selectDistinct({ customerId: orders.customerId })
        .from(orders)
        .where(inArray(orders.id, orderIds));

      const customerOrderCounts = await db
        .select({
          customerId: orders.customerId,
          orderCount: sql<number>`COUNT(*)`,
          firstOrderDate: sql<Date>`MIN(${orders.createdAt})`,
        })
        .from(orders)
        .where(inArray(orders.id, orderIds))
        .groupBy(orders.customerId);

      const newCustomersThisMonth = customerOrderCounts.filter(
        c => new Date(c.firstOrderDate) >= monthStart
      );

      customerStats = {
        total: uniqueCustomers.length,
        new: newCustomersThisMonth.length,
        returning: uniqueCustomers.length - newCustomersThisMonth.length,
      };
    }

    res.json({
      revenue: {
        today: parseFloat(revenueStats[0]?.today || "0"),
        thisWeek: parseFloat(revenueStats[0]?.thisWeek || "0"),
        thisMonth: thisMonthRev,
        total: parseFloat(revenueStats[0]?.total || "0"),
        trend: Math.round(trend * 100) / 100,
      },
      orders: {
        pending: Number(orderStats[0]?.pending || 0),
        processing: Number(orderStats[0]?.processing || 0),
        completed: Number(orderStats[0]?.completed || 0),
        cancelled: Number(orderStats[0]?.cancelled || 0),
        total: Number(orderStats[0]?.total || 0),
      },
      products: {
        total: Number(productStats[0]?.total || 0),
        active: Number(productStats[0]?.active || 0),
        outOfStock: Number(productStats[0]?.outOfStock || 0),
        lowStock: Number(productStats[0]?.lowStock || 0),
      },
      customers: customerStats,
    });
  } catch (error) {
    console.error("Error fetching supplier stats:", error);
    res.status(500).json({ error: "فشل في جلب الإحصائيات" });
  }
});

router.get("/:supplierId/notifications", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "معرف المورد غير صحيح" });
    }
    
    const { limit = 20, offset = 0 } = req.query;
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: "حد العرض غير صحيح (1-100)" });
    }
    
    if (!Number.isInteger(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: "الإزاحة غير صحيحة" });
    }

    const notifications = await db
      .select()
      .from(supplierNotifications)
      .where(eq(supplierNotifications.supplierId, supplierId))
      .orderBy(desc(supplierNotifications.createdAt))
      .limit(limitNum)
      .offset(offsetNum);

    const totalCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(supplierNotifications)
      .where(eq(supplierNotifications.supplierId, supplierId));

    const unreadCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(supplierNotifications)
      .where(
        and(
          eq(supplierNotifications.supplierId, supplierId),
          eq(supplierNotifications.isRead, false)
        )
      );

    res.json({
      notifications,
      total: Number(totalCount[0]?.count || 0),
      unreadCount: Number(unreadCount[0]?.count || 0),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "فشل في جلب الإشعارات" });
  }
});

router.put("/:supplierId/notifications/:notificationId/read", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const notificationId = parseInt(req.params.notificationId);
    
    if (isNaN(supplierId) || isNaN(notificationId)) {
      return res.status(400).json({ error: "معرفات غير صحيحة" });
    }
    
    const updated = await db
      .update(supplierNotifications)
      .set({ 
        isRead: true,
      })
      .where(
        and(
          eq(supplierNotifications.id, notificationId),
          eq(supplierNotifications.supplierId, supplierId)
        )
      )
      .returning();
    
    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: "الإشعار غير موجود" });
    }
    
    res.json({ success: true, message: "تم تحديث الإشعار", notification: updated[0] });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "فشل في تحديث الإشعار" });
  }
});

router.get("/:supplierId/recent-orders", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "معرف المورد غير صحيح" });
    }
    
    const { limit = 10 } = req.query;
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: "حد العرض غير صحيح (1-100)" });
    }

    const recentOrderIds = await db
      .selectDistinct({ 
        orderId: orderItems.orderId,
        createdAt: sql<Date>`MAX(${orders.createdAt})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orderItems.supplierId, supplierId))
      .groupBy(orderItems.orderId)
      .orderBy(desc(sql`MAX(${orders.createdAt})`))
      .limit(limitNum);
    
    const orderIds = recentOrderIds.map(r => r.orderId);

    let recentOrders = [];
    if (orderIds.length > 0) {
      recentOrders = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          customerName: sql<string>`COALESCE(
            CAST(${orders.shippingAddress}->>'name' AS VARCHAR), 
            'عميل غير محدد'
          )`,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(inArray(orders.id, orderIds))
        .orderBy(desc(orders.createdAt));
    }

    const totalOrderIds = await db
      .selectDistinct({ orderId: orderItems.orderId })
      .from(orderItems)
      .where(eq(orderItems.supplierId, supplierId));

    res.json({
      orders: recentOrders,
      total: totalOrderIds.length,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ error: "فشل في جلب الطلبات الأخيرة" });
  }
});

router.get("/:supplierId/low-stock-products", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "معرف المورد غير صحيح" });
    }
    
    const { limit = 10 } = req.query;
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: "حد العرض غير صحيح (1-100)" });
    }

    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        arabicName: products.arabicName,
        sku: products.sku,
        currentStock: products.stockQuantity,
        minStock: sql<number>`${LOW_STOCK_THRESHOLD}`,
        price: products.price,
      })
      .from(products)
      .where(
        and(
          eq(products.supplierId, supplierId),
          lt(products.stockQuantity, LOW_STOCK_THRESHOLD)
        )
      )
      .orderBy(products.stockQuantity)
      .limit(limitNum);

    const totalCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(
        and(
          eq(products.supplierId, supplierId),
          lt(products.stockQuantity, LOW_STOCK_THRESHOLD)
        )
      );

    res.json({
      products: lowStockProducts,
      total: Number(totalCount[0]?.count || 0),
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ error: "فشل في جلب المنتجات" });
  }
});

export default router;
