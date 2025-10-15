import { Router, Request, Response } from 'express';
import { db } from '../storage';
import { suppliers, orderItems, commissionSettings, iraqiProvinces, orders } from '../../shared/schema';
import { eq, and, sql, desc, gte, lte } from 'drizzle-orm';

const router = Router();

router.get('/profits/by-province', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let dateConditions = [];
    if (startDate) {
      dateConditions.push(gte(orderItems.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      dateConditions.push(lte(orderItems.createdAt, new Date(endDate as string)));
    }

    const profitsByProvince = await db
      .select({
        province: suppliers.province,
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        totalCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        orderCount: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
        supplierCount: sql<number>`COUNT(DISTINCT ${suppliers.id})`,
      })
      .from(orderItems)
      .leftJoin(suppliers, eq(orderItems.supplierId, suppliers.id))
      .where(dateConditions.length > 0 ? and(...dateConditions) : undefined)
      .groupBy(suppliers.province)
      .orderBy(desc(sql`SUM(${orderItems.commissionAmount})`));

    return res.json({
      success: true,
      data: profitsByProvince,
      summary: {
        totalProvinces: profitsByProvince.length,
        totalCommission: profitsByProvince.reduce((sum, p) => sum + Number(p.totalCommission), 0),
        totalRevenue: profitsByProvince.reduce((sum, p) => sum + Number(p.totalRevenue), 0),
      }
    });
  } catch (error) {
    console.error('خطأ في جلب الأرباح حسب المحافظة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب الأرباح حسب المحافظة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.get('/profits/by-endorsement', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let dateConditions = [];
    if (startDate) {
      dateConditions.push(gte(orderItems.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      dateConditions.push(lte(orderItems.createdAt, new Date(endDate as string)));
    }

    const profitsByEndorsement = await db
      .select({
        unionEndorsed: suppliers.unionEndorsed,
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        totalCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        orderCount: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
        supplierCount: sql<number>`COUNT(DISTINCT ${suppliers.id})`,
        avgCommissionRate: sql<number>`COALESCE(AVG(${orderItems.commissionRate}), 0)`,
      })
      .from(orderItems)
      .leftJoin(suppliers, eq(orderItems.supplierId, suppliers.id))
      .where(dateConditions.length > 0 ? and(...dateConditions) : undefined)
      .groupBy(suppliers.unionEndorsed)
      .orderBy(desc(sql`SUM(${orderItems.commissionAmount})`));

    const formatted = profitsByEndorsement.map(item => ({
      category: item.unionEndorsed ? 'مدعوم من النقابة' : 'موردين عاديين',
      categoryEn: item.unionEndorsed ? 'Union Endorsed' : 'Regular Suppliers',
      unionEndorsed: item.unionEndorsed,
      totalRevenue: Number(item.totalRevenue),
      totalCommission: Number(item.totalCommission),
      orderCount: Number(item.orderCount),
      supplierCount: Number(item.supplierCount),
      avgCommissionRate: Number(item.avgCommissionRate),
    }));

    return res.json({
      success: true,
      data: formatted,
      summary: {
        totalCategories: formatted.length,
        totalCommission: formatted.reduce((sum, c) => sum + c.totalCommission, 0),
        totalRevenue: formatted.reduce((sum, c) => sum + c.totalRevenue, 0),
        endorsedSuppliers: formatted.find(c => c.unionEndorsed)?.supplierCount || 0,
        regularSuppliers: formatted.find(c => !c.unionEndorsed)?.supplierCount || 0,
      }
    });
  } catch (error) {
    console.error('خطأ في جلب الأرباح حسب الاعتماد:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب الأرباح حسب الاعتماد',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.get('/profits/detailed', async (req: Request, res: Response) => {
  try {
    const { province, unionEndorsed, startDate, endDate, page = '1', limit = '50' } = req.query;

    const pageNum = Number.parseInt(page as string);
    const limitNum = Number.parseInt(limit as string);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'رقم الصفحة يجب أن يكون رقم صحيح أكبر من 0' 
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'الحد الأقصى للنتائج يجب أن يكون بين 1 و 100' 
      });
    }

    const offset = (pageNum - 1) * limitNum;
    let conditions = [];

    if (province) {
      conditions.push(eq(suppliers.province, province as string));
    }
    if (unionEndorsed !== undefined) {
      conditions.push(eq(suppliers.unionEndorsed, unionEndorsed === 'true'));
    }
    if (startDate) {
      conditions.push(gte(orderItems.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      conditions.push(lte(orderItems.createdAt, new Date(endDate as string)));
    }

    const detailedProfits = await db
      .select({
        supplierId: suppliers.id,
        supplierName: suppliers.companyName,
        supplierArabicName: suppliers.arabicCompanyName,
        province: suppliers.province,
        unionEndorsed: suppliers.unionEndorsed,
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        totalCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        orderCount: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
        avgCommissionRate: sql<number>`COALESCE(AVG(${orderItems.commissionRate}), 0)`,
      })
      .from(orderItems)
      .leftJoin(suppliers, eq(orderItems.supplierId, suppliers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(suppliers.id, suppliers.companyName, suppliers.arabicCompanyName, suppliers.province, suppliers.unionEndorsed)
      .orderBy(desc(sql`SUM(${orderItems.commissionAmount})`))
      .limit(limitNum)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${suppliers.id})` })
      .from(orderItems)
      .leftJoin(suppliers, eq(orderItems.supplierId, suppliers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return res.json({
      success: true,
      data: detailedProfits.map(item => ({
        ...item,
        totalRevenue: Number(item.totalRevenue),
        totalCommission: Number(item.totalCommission),
        orderCount: Number(item.orderCount),
        avgCommissionRate: Number(item.avgCommissionRate),
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limitNum),
      }
    });
  } catch (error) {
    console.error('خطأ في جلب التفاصيل المالية:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب التفاصيل المالية',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.get('/dashboard-stats', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalStats] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        totalCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        totalOrders: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
      })
      .from(orderItems);

    const [todayStats] = await db
      .select({
        todayRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        todayCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        todayOrders: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
      })
      .from(orderItems)
      .where(gte(orderItems.createdAt, today));

    const [monthStats] = await db
      .select({
        monthRevenue: sql<number>`COALESCE(SUM(${orderItems.subtotal}), 0)`,
        monthCommission: sql<number>`COALESCE(SUM(${orderItems.commissionAmount}), 0)`,
        monthOrders: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
      })
      .from(orderItems)
      .where(gte(orderItems.createdAt, thisMonth));

    const [supplierStats] = await db
      .select({
        totalSuppliers: sql<number>`COUNT(*)`,
        endorsedSuppliers: sql<number>`COUNT(*) FILTER (WHERE ${suppliers.unionEndorsed} = true)`,
        regularSuppliers: sql<number>`COUNT(*) FILTER (WHERE ${suppliers.unionEndorsed} = false OR ${suppliers.unionEndorsed} IS NULL)`,
      })
      .from(suppliers);

    const provinceCount = await db
      .select({
        provincesWithSuppliers: sql<number>`COUNT(DISTINCT ${suppliers.province})`,
      })
      .from(suppliers)
      .where(sql`${suppliers.province} IS NOT NULL`);

    return res.json({
      success: true,
      data: {
        overall: {
          totalRevenue: Number(totalStats?.totalRevenue || 0),
          totalCommission: Number(totalStats?.totalCommission || 0),
          totalOrders: Number(totalStats?.totalOrders || 0),
        },
        today: {
          revenue: Number(todayStats?.todayRevenue || 0),
          commission: Number(todayStats?.todayCommission || 0),
          orders: Number(todayStats?.todayOrders || 0),
        },
        thisMonth: {
          revenue: Number(monthStats?.monthRevenue || 0),
          commission: Number(monthStats?.monthCommission || 0),
          orders: Number(monthStats?.monthOrders || 0),
        },
        suppliers: {
          total: Number(supplierStats?.totalSuppliers || 0),
          endorsed: Number(supplierStats?.endorsedSuppliers || 0),
          regular: Number(supplierStats?.regularSuppliers || 0),
          provincesActive: Number(provinceCount[0]?.provincesWithSuppliers || 0),
        }
      }
    });
  } catch (error) {
    console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب إحصائيات لوحة التحكم',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

export default router;
