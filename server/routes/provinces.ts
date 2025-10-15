import { Router, Request, Response } from 'express';
import { db } from '../storage';
import { iraqiProvinces } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { iraqiProvincesData } from '../seeds/iraqiProvinces';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const provinces = await db.select().from(iraqiProvinces).where(eq(iraqiProvinces.isActive, true));

    if (provinces.length === 0) {
      await seedProvinces();
      const newProvinces = await db.select().from(iraqiProvinces).where(eq(iraqiProvinces.isActive, true));
      return res.json({
        success: true,
        data: newProvinces,
        message: 'تم تحميل المحافظات العراقية'
      });
    }

    return res.json({
      success: true,
      data: provinces
    });
  } catch (error) {
    console.error('خطأ في جلب المحافظات:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب المحافظات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const [province] = await db
      .select()
      .from(iraqiProvinces)
      .where(eq(iraqiProvinces.code, code.toUpperCase()));

    if (!province) {
      return res.status(404).json({ 
        success: false, 
        message: 'المحافظة غير موجودة' 
      });
    }

    return res.json({
      success: true,
      data: province
    });
  } catch (error) {
    console.error('خطأ في جلب المحافظة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب المحافظة',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

router.post('/seed', async (req: Request, res: Response) => {
  try {
    const result = await seedProvinces();
    return res.json({
      success: true,
      message: 'تم تحميل المحافظات العراقية بنجاح',
      data: result
    });
  } catch (error) {
    console.error('خطأ في تحميل المحافظات:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في تحميل المحافظات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

async function seedProvinces() {
  const existingProvinces = await db.select().from(iraqiProvinces);
  
  if (existingProvinces.length > 0) {
    return { message: 'المحافظات موجودة مسبقاً', count: existingProvinces.length };
  }

  const result = await db.insert(iraqiProvinces).values(iraqiProvincesData).returning();
  
  return { 
    message: 'تم إدخال المحافظات بنجاح', 
    count: result.length,
    data: result 
  };
}

export default router;
