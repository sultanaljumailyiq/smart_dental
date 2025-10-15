import { Router, Request, Response } from "express";
import { db } from "../storage";
import { commissionInvoices, suppliers } from "../../shared/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { supplierId, status, startDate, endDate } = req.query;
    
    const conditions = [];
    
    if (supplierId) {
      const supplierIdNum = parseInt(supplierId as string);
      if (isNaN(supplierIdNum)) {
        return res.status(400).json({ error: "معرف المورد غير صحيح" });
      }
      conditions.push(eq(commissionInvoices.supplierId, supplierIdNum));
    }
    
    if (status) {
      conditions.push(eq(commissionInvoices.status, status as string));
    }
    
    if (startDate) {
      conditions.push(gte(commissionInvoices.periodStart, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(commissionInvoices.periodEnd, new Date(endDate as string)));
    }
    
    const invoices = await db
      .select({
        id: commissionInvoices.id,
        invoiceNumber: commissionInvoices.invoiceNumber,
        supplierId: commissionInvoices.supplierId,
        supplierName: suppliers.companyName,
        supplierArabicName: suppliers.arabicCompanyName,
        periodStart: commissionInvoices.periodStart,
        periodEnd: commissionInvoices.periodEnd,
        totalSales: commissionInvoices.totalSales,
        totalCommission: commissionInvoices.totalCommission,
        status: commissionInvoices.status,
        dueDate: commissionInvoices.dueDate,
        paidAt: commissionInvoices.paidAt,
        paidAmount: commissionInvoices.paidAmount,
        paymentMethod: commissionInvoices.paymentMethod,
        paymentReference: commissionInvoices.paymentReference,
        notes: commissionInvoices.notes,
        createdAt: commissionInvoices.createdAt,
        updatedAt: commissionInvoices.updatedAt,
      })
      .from(commissionInvoices)
      .leftJoin(suppliers, eq(commissionInvoices.supplierId, suppliers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(commissionInvoices.createdAt));
    
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching commission invoices:", error);
    res.status(500).json({ error: "فشل في جلب فواتير العمولات" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "معرف الفاتورة غير صحيح" });
    }
    
    const invoice = await db
      .select({
        id: commissionInvoices.id,
        invoiceNumber: commissionInvoices.invoiceNumber,
        supplierId: commissionInvoices.supplierId,
        supplierName: suppliers.companyName,
        supplierArabicName: suppliers.arabicCompanyName,
        periodStart: commissionInvoices.periodStart,
        periodEnd: commissionInvoices.periodEnd,
        totalSales: commissionInvoices.totalSales,
        totalCommission: commissionInvoices.totalCommission,
        status: commissionInvoices.status,
        dueDate: commissionInvoices.dueDate,
        paidAt: commissionInvoices.paidAt,
        paidAmount: commissionInvoices.paidAmount,
        paymentMethod: commissionInvoices.paymentMethod,
        paymentReference: commissionInvoices.paymentReference,
        notes: commissionInvoices.notes,
        createdAt: commissionInvoices.createdAt,
        updatedAt: commissionInvoices.updatedAt,
      })
      .from(commissionInvoices)
      .leftJoin(suppliers, eq(commissionInvoices.supplierId, suppliers.id))
      .where(eq(commissionInvoices.id, id))
      .limit(1);
    
    if (!invoice || invoice.length === 0) {
      return res.status(404).json({ error: "الفاتورة غير موجودة" });
    }
    
    res.json(invoice[0]);
  } catch (error) {
    console.error("Error fetching commission invoice:", error);
    res.status(500).json({ error: "فشل في جلب بيانات الفاتورة" });
  }
});

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { supplierId, periodStart, periodEnd } = req.body;
    
    if (!supplierId || !periodStart || !periodEnd) {
      return res.status(400).json({ error: "البيانات المطلوبة غير مكتملة" });
    }
    
    const supplierIdNum = parseInt(supplierId);
    if (isNaN(supplierIdNum)) {
      return res.status(400).json({ error: "معرف المورد غير صحيح" });
    }

    const year = new Date(periodEnd).getFullYear();
    const month = new Date(periodEnd).getMonth() + 1;
    const invoiceCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(commissionInvoices)
      .where(sql`date_part('year', ${commissionInvoices.periodEnd}) = ${year}`);
    
    const nextNumber = (invoiceCount[0]?.count || 0) + 1;
    const invoiceNumber = `INV-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    const dueDate = new Date(new Date(periodEnd).getTime() + 15 * 24 * 60 * 60 * 1000);
    
    const newInvoice = await db
      .insert(commissionInvoices)
      .values({
        invoiceNumber,
        supplierId: supplierIdNum,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        totalSales: req.body.totalSales || "0.00",
        totalCommission: req.body.totalCommission || "0.00",
        status: "pending",
        dueDate,
        paidAmount: "0.00",
      })
      .returning();
    
    res.status(201).json(newInvoice[0]);
  } catch (error) {
    console.error("Error generating commission invoice:", error);
    res.status(500).json({ error: "فشل في إنشاء الفاتورة" });
  }
});

router.put("/:id/pay", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "معرف الفاتورة غير صحيح" });
    }
    
    const { paidAmount, paymentMethod, paymentReference, notes } = req.body;
    
    const updated = await db
      .update(commissionInvoices)
      .set({
        status: "paid",
        paidAt: new Date(),
        paidAmount: paidAmount || sql`${commissionInvoices.totalCommission}`,
        paymentMethod,
        paymentReference,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(commissionInvoices.id, id))
      .returning();
    
    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: "الفاتورة غير موجودة" });
    }
    
    res.json(updated[0]);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    res.status(500).json({ error: "فشل في تحديث حالة الدفع" });
  }
});

router.put("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "معرف الفاتورة غير صحيح" });
    }
    
    const updated = await db
      .update(commissionInvoices)
      .set({
        status: "cancelled",
        notes: req.body.notes,
        updatedAt: new Date(),
      })
      .where(eq(commissionInvoices.id, id))
      .returning();
    
    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: "الفاتورة غير موجودة" });
    }
    
    res.json(updated[0]);
  } catch (error) {
    console.error("Error cancelling invoice:", error);
    res.status(500).json({ error: "فشل في إلغاء الفاتورة" });
  }
});

router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.query;
    
    let condition = undefined;
    if (supplierId) {
      const supplierIdNum = parseInt(supplierId as string);
      if (isNaN(supplierIdNum)) {
        return res.status(400).json({ error: "معرف المورد غير صحيح" });
      }
      condition = eq(commissionInvoices.supplierId, supplierIdNum);
    }
    
    const stats = await db
      .select({
        totalCommissions: sql<string>`COALESCE(SUM(CAST(${commissionInvoices.totalCommission} AS NUMERIC)), 0)`,
        totalPaid: sql<string>`COALESCE(SUM(CASE WHEN ${commissionInvoices.status} = 'paid' THEN CAST(${commissionInvoices.paidAmount} AS NUMERIC) ELSE 0 END), 0)`,
        totalPending: sql<string>`COALESCE(SUM(CASE WHEN ${commissionInvoices.status} = 'pending' THEN CAST(${commissionInvoices.totalCommission} AS NUMERIC) ELSE 0 END), 0)`,
        totalOverdue: sql<string>`COALESCE(SUM(CASE WHEN ${commissionInvoices.status} = 'pending' AND ${commissionInvoices.dueDate} < NOW() THEN CAST(${commissionInvoices.totalCommission} AS NUMERIC) ELSE 0 END), 0)`,
        invoiceCount: sql<number>`COUNT(*)`,
        paidCount: sql<number>`COUNT(CASE WHEN ${commissionInvoices.status} = 'paid' THEN 1 END)`,
        pendingCount: sql<number>`COUNT(CASE WHEN ${commissionInvoices.status} = 'pending' THEN 1 END)`,
        overdueCount: sql<number>`COUNT(CASE WHEN ${commissionInvoices.status} = 'pending' AND ${commissionInvoices.dueDate} < NOW() THEN 1 END)`,
      })
      .from(commissionInvoices)
      .where(condition);
    
    const result = stats[0] || {
      totalCommissions: "0",
      totalPaid: "0",
      totalPending: "0",
      totalOverdue: "0",
      invoiceCount: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
    };
    
    res.json({
      totalCommissions: parseFloat(result.totalCommissions).toFixed(2),
      totalPaid: parseFloat(result.totalPaid).toFixed(2),
      totalPending: parseFloat(result.totalPending).toFixed(2),
      totalOverdue: parseFloat(result.totalOverdue).toFixed(2),
      invoiceCount: Number(result.invoiceCount),
      paidCount: Number(result.paidCount),
      pendingCount: Number(result.pendingCount),
      overdueCount: Number(result.overdueCount),
    });
  } catch (error) {
    console.error("Error fetching commission stats:", error);
    res.status(500).json({ error: "فشل في جلب إحصائيات العمولات" });
  }
});

export default router;
