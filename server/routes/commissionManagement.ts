import { Router, Request, Response } from 'express';
import { db } from '../storage';
import { suppliers, commissionSettings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/suppliers/:supplierId/commission', async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const id = Number.parseInt(supplierId);

    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف المورد غير صحيح' 
      });
    }

    const [supplier] = await db
      .select({
        id: suppliers.id,
        companyName: suppliers.companyName,
        arabicCompanyName: suppliers.arabicCompanyName,
        unionEndorsed: suppliers.unionEndorsed,
        unionEndorsedAt: suppliers.unionEndorsedAt,
        unionCertificateNumber: suppliers.unionCertificateNumber,
        province: suppliers.province,
      })
      .from(suppliers)
      .where(eq(suppliers.id, id));

    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        message: 'المورد غير موجود' 
      });
    }

    const [settings] = await db
      .select()
      .from(commissionSettings)
      .where(eq(commissionSettings.supplierId, id));

    return res.json({
      success: true,
      data: {
        supplier,
        commissionSettings: settings || {
          commissionRate: "10.00",
          minCommission: "0.00",
          isActive: true,
          notes: null
        },
        effectiveRate: supplier.unionEndorsed ? "0.00" : (settings?.commissionRate || "10.00")
      }
    });
  } catch (error) {
    console.error('خطأ في جلب إعدادات العمولة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب إعدادات العمولة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.put('/suppliers/:supplierId/commission', async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const id = Number.parseInt(supplierId);
    const { commissionRate, minCommission, isActive, notes } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف المورد غير صحيح' 
      });
    }

    if (commissionRate !== undefined) {
      const rate = Number.parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        return res.status(400).json({ 
          success: false, 
          message: 'نسبة العمولة يجب أن تكون بين 0 و 100' 
        });
      }
    }

    if (minCommission !== undefined) {
      const min = Number.parseFloat(minCommission);
      if (isNaN(min) || min < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'الحد الأدنى للعمولة يجب أن يكون رقم موجب' 
        });
      }
    }

    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));

    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        message: 'المورد غير موجود' 
      });
    }

    if (supplier.unionEndorsed) {
      return res.status(400).json({ 
        success: false, 
        message: 'لا يمكن تعديل العمولة للموردين المدعومين من النقابة - العمولة تلقائياً 0%' 
      });
    }

    const [existingSettings] = await db
      .select()
      .from(commissionSettings)
      .where(eq(commissionSettings.supplierId, id));

    let result;

    if (existingSettings) {
      [result] = await db
        .update(commissionSettings)
        .set({
          commissionRate: commissionRate?.toString() || existingSettings.commissionRate,
          minCommission: minCommission?.toString() || existingSettings.minCommission,
          isActive: isActive !== undefined ? isActive : existingSettings.isActive,
          notes: notes !== undefined ? notes : existingSettings.notes,
          updatedAt: new Date(),
        })
        .where(eq(commissionSettings.supplierId, id))
        .returning();
    } else {
      [result] = await db
        .insert(commissionSettings)
        .values({
          supplierId: id,
          commissionRate: commissionRate?.toString() || "10.00",
          minCommission: minCommission?.toString() || "0.00",
          isActive: isActive !== undefined ? isActive : true,
          notes: notes || null,
        })
        .returning();
    }

    return res.json({
      success: true,
      message: 'تم تحديث إعدادات العمولة بنجاح',
      data: result
    });
  } catch (error) {
    console.error('خطأ في تحديث إعدادات العمولة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في تحديث إعدادات العمولة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.put('/suppliers/:supplierId/union-endorsement', async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const id = Number.parseInt(supplierId);
    const { unionEndorsed, unionCertificateNumber } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف المورد غير صحيح' 
      });
    }

    if (unionEndorsed === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب تحديد حالة الدعم من النقابة' 
      });
    }

    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));

    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        message: 'المورد غير موجود' 
      });
    }

    const updateData: any = {
      unionEndorsed: unionEndorsed,
      unionEndorsedAt: unionEndorsed ? new Date() : null,
      unionCertificateNumber: unionCertificateNumber || null,
      updatedAt: new Date(),
    };

    const [result] = await db
      .update(suppliers)
      .set(updateData)
      .where(eq(suppliers.id, id))
      .returning();

    return res.json({
      success: true,
      message: unionEndorsed 
        ? 'تم اعتماد المورد من نقابة الأسنان العراقية - العمولة الآن 0%' 
        : 'تم إلغاء اعتماد المورد من النقابة',
      data: result
    });
  } catch (error) {
    console.error('خطأ في تحديث اعتماد النقابة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في تحديث اعتماد النقابة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.get('/suppliers/all-settings', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50', unionEndorsed, province } = req.query;

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

    let query = db
      .select({
        id: suppliers.id,
        companyName: suppliers.companyName,
        arabicCompanyName: suppliers.arabicCompanyName,
        province: suppliers.province,
        unionEndorsed: suppliers.unionEndorsed,
        unionEndorsedAt: suppliers.unionEndorsedAt,
        commissionRate: commissionSettings.commissionRate,
        minCommission: commissionSettings.minCommission,
        isActive: commissionSettings.isActive,
        notes: commissionSettings.notes,
      })
      .from(suppliers)
      .leftJoin(commissionSettings, eq(suppliers.id, commissionSettings.supplierId))
      .$dynamic();

    if (unionEndorsed !== undefined) {
      query = query.where(eq(suppliers.unionEndorsed, unionEndorsed === 'true'));
    }

    if (province) {
      query = query.where(eq(suppliers.province, province as string));
    }

    const results = await query
      .limit(limitNum)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: db.$count(suppliers) })
      .from(suppliers);

    const formattedResults = results.map(item => ({
      ...item,
      effectiveRate: item.unionEndorsed ? "0.00" : (item.commissionRate || "10.00"),
      commissionRate: item.commissionRate || "10.00",
      minCommission: item.minCommission || "0.00",
      isActive: item.isActive !== null ? item.isActive : true,
    }));

    return res.json({
      success: true,
      data: formattedResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount.count),
        totalPages: Math.ceil(Number(totalCount.count) / limitNum),
      }
    });
  } catch (error) {
    console.error('خطأ في جلب إعدادات العمولات:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب إعدادات العمولات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.put('/dentists/:userId/union-endorsement', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const id = Number.parseInt(userId);
    const { unionEndorsed, unionCertificateNumber } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف المستخدم غير صحيح' 
      });
    }

    if (unionEndorsed === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب تحديد حالة الدعم من النقابة' 
      });
    }

    const { users } = await import('../storage');
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'المستخدم غير موجود' 
      });
    }

    if (user.role !== 'dentist') {
      return res.status(400).json({ 
        success: false, 
        message: 'فقط الأطباء يمكن اعتمادهم من النقابة' 
      });
    }

    const updateData: any = {
      unionEndorsed: unionEndorsed,
      unionEndorsedAt: unionEndorsed ? new Date() : null,
      unionCertificateNumber: unionCertificateNumber || null,
      updatedAt: new Date(),
    };

    const [result] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return res.json({
      success: true,
      message: unionEndorsed 
        ? 'تم اعتماد الطبيب من نقابة الأسنان العراقية' 
        : 'تم إلغاء اعتماد الطبيب من النقابة',
      data: result
    });
  } catch (error) {
    console.error('خطأ في تحديث اعتماد النقابة للطبيب:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في تحديث اعتماد النقابة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

export default router;
