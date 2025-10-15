import { Router, Request, Response } from "express";
import { db, paymentMethods } from "../storage";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    
    let methods;
    if (isActive !== undefined) {
      const activeFilter = isActive === "true";
      methods = await db.select().from(paymentMethods)
        .where(eq(paymentMethods.isActive, activeFilter))
        .orderBy(paymentMethods.displayOrder);
    } else {
      methods = await db.select().from(paymentMethods)
        .orderBy(paymentMethods.displayOrder);
    }
    
    res.json(methods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ error: "فشل في جلب طرق الدفع" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    
    if (!method) {
      return res.status(404).json({ error: "طريقة الدفع غير موجودة" });
    }
    
    res.json(method);
  } catch (error) {
    console.error("Error fetching payment method:", error);
    res.status(500).json({ error: "فشل في جلب بيانات طريقة الدفع" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newMethod] = await db.insert(paymentMethods).values({
      name: req.body.methodName || req.body.name || "",
      arabicName: req.body.methodNameArabic || req.body.arabicName || "",
      type: req.body.methodType || req.body.type || "cash",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      description: req.body.instructions || req.body.description || "",
      arabicDescription: req.body.instructionsArabic || req.body.arabicDescription || "",
      fees: req.body.fees || "0.00",
      minAmount: req.body.minAmount || "0.00",
      maxAmount: req.body.maxAmount,
      config: {
        zainCashPhoneNumber: req.body.zainCashPhoneNumber,
        zainCashAccountName: req.body.zainCashAccountName,
        exchangeOfficeName: req.body.exchangeOfficeName,
        exchangeOfficePhone: req.body.exchangeOfficePhone,
        exchangeOfficeAddress: req.body.exchangeOfficeAddress,
        ...req.body.metadata,
        ...req.body.config,
      },
      displayOrder: req.body.displayOrder ?? req.body.priority ?? 0,
    }).returning();
    
    res.status(201).json(newMethod);
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ error: "فشل في إضافة طريقة الدفع" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (req.body.methodName !== undefined || req.body.name !== undefined) {
      updateData.name = req.body.methodName || req.body.name;
    }
    if (req.body.methodNameArabic !== undefined || req.body.arabicName !== undefined) {
      updateData.arabicName = req.body.methodNameArabic || req.body.arabicName;
    }
    if (req.body.methodType !== undefined || req.body.type !== undefined) {
      updateData.type = req.body.methodType || req.body.type;
    }
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive;
    }
    if (req.body.instructions !== undefined || req.body.description !== undefined) {
      updateData.description = req.body.instructions || req.body.description;
    }
    if (req.body.instructionsArabic !== undefined || req.body.arabicDescription !== undefined) {
      updateData.arabicDescription = req.body.instructionsArabic || req.body.arabicDescription;
    }
    if (req.body.fees !== undefined) {
      updateData.fees = req.body.fees;
    }
    if (req.body.minAmount !== undefined) {
      updateData.minAmount = req.body.minAmount;
    }
    if (req.body.maxAmount !== undefined) {
      updateData.maxAmount = req.body.maxAmount;
    }
    if (req.body.displayOrder !== undefined || req.body.priority !== undefined) {
      updateData.displayOrder = req.body.displayOrder ?? req.body.priority;
    }
    
    if (req.body.config || req.body.zainCashPhoneNumber || req.body.exchangeOfficeName || req.body.metadata) {
      updateData.config = {
        zainCashPhoneNumber: req.body.zainCashPhoneNumber,
        zainCashAccountName: req.body.zainCashAccountName,
        exchangeOfficeName: req.body.exchangeOfficeName,
        exchangeOfficePhone: req.body.exchangeOfficePhone,
        exchangeOfficeAddress: req.body.exchangeOfficeAddress,
        ...req.body.metadata,
        ...req.body.config,
      };
    }
    
    const [updatedMethod] = await db.update(paymentMethods)
      .set(updateData)
      .where(eq(paymentMethods.id, id))
      .returning();
    
    if (!updatedMethod) {
      return res.status(404).json({ error: "طريقة الدفع غير موجودة" });
    }
    
    res.json(updatedMethod);
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ error: "فشل في تحديث طريقة الدفع" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const [deleted] = await db.delete(paymentMethods)
      .where(eq(paymentMethods.id, id))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: "طريقة الدفع غير موجودة" });
    }
    
    res.json({ message: "تم حذف طريقة الدفع بنجاح" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ error: "فشل في حذف طريقة الدفع" });
  }
});

export default router;
