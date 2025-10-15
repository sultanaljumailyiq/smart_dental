import { Router, Request, Response } from "express";
import { db } from "../storage";
import { promotionalCards } from "../../shared/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

// Get all promotional cards
router.get("/", async (req: Request, res: Response) => {
  try {
    const { section, active } = req.query;
    
    const now = new Date();
    
    // Build conditions
    const conditions: any[] = [];
    
    if (section && typeof section === 'string') {
      conditions.push(
        sql`${promotionalCards.targetSection} @> ${JSON.stringify([section])}`
      );
    }
    
    if (active === 'true') {
      conditions.push(eq(promotionalCards.isActive, true));
      conditions.push(gte(promotionalCards.endDate, now));
      conditions.push(lte(promotionalCards.startDate, now));
    }
    
    // Execute query
    const cards = conditions.length > 0
      ? await db.select()
          .from(promotionalCards)
          .where(and(...conditions))
          .orderBy(desc(promotionalCards.priority), desc(promotionalCards.createdAt))
      : await db.select()
          .from(promotionalCards)
          .orderBy(desc(promotionalCards.priority), desc(promotionalCards.createdAt));
    
    res.json(cards);
  } catch (error) {
    console.error("Error fetching promotional cards:", error);
    res.status(500).json({ error: "فشل في جلب البطاقات الترويجية" });
  }
});

// Get single promotional card
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const card = await db.select()
      .from(promotionalCards)
      .where(eq(promotionalCards.id, parseInt(req.params.id)))
      .limit(1);
    
    if (!card.length) {
      return res.status(404).json({ error: "البطاقة غير موجودة" });
    }
    
    res.json(card[0]);
  } catch (error) {
    console.error("Error fetching promotional card:", error);
    res.status(500).json({ error: "فشل في جلب البطاقة" });
  }
});

// Create promotional card
router.post("/", async (req: Request, res: Response) => {
  try {
    const newCard = await db.insert(promotionalCards)
      .values({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    res.status(201).json(newCard[0]);
  } catch (error) {
    console.error("Error creating promotional card:", error);
    res.status(500).json({ error: "فشل في إنشاء البطاقة الترويجية" });
  }
});

// Update promotional card
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await db.update(promotionalCards)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(promotionalCards.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated.length) {
      return res.status(404).json({ error: "البطاقة غير موجودة" });
    }
    
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating promotional card:", error);
    res.status(500).json({ error: "فشل في تحديث البطاقة" });
  }
});

// Delete promotional card
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(promotionalCards)
      .where(eq(promotionalCards.id, parseInt(req.params.id)));
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting promotional card:", error);
    res.status(500).json({ error: "فشل في حذف البطاقة" });
  }
});

// Track view
router.post("/:id/view", async (req: Request, res: Response) => {
  try {
    const card = await db.select()
      .from(promotionalCards)
      .where(eq(promotionalCards.id, parseInt(req.params.id)))
      .limit(1);
    
    if (!card.length) {
      return res.status(404).json({ error: "البطاقة غير موجودة" });
    }
    
    await db.update(promotionalCards)
      .set({ views: (card[0].views || 0) + 1 })
      .where(eq(promotionalCards.id, parseInt(req.params.id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ error: "فشل في تسجيل المشاهدة" });
  }
});

// Track click
router.post("/:id/click", async (req: Request, res: Response) => {
  try {
    const card = await db.select()
      .from(promotionalCards)
      .where(eq(promotionalCards.id, parseInt(req.params.id)))
      .limit(1);
    
    if (!card.length) {
      return res.status(404).json({ error: "البطاقة غير موجودة" });
    }
    
    await db.update(promotionalCards)
      .set({ clicks: (card[0].clicks || 0) + 1 })
      .where(eq(promotionalCards.id, parseInt(req.params.id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ error: "فشل في تسجيل النقرة" });
  }
});

// Track conversion
router.post("/:id/conversion", async (req: Request, res: Response) => {
  try {
    const card = await db.select()
      .from(promotionalCards)
      .where(eq(promotionalCards.id, parseInt(req.params.id)))
      .limit(1);
    
    if (!card.length) {
      return res.status(404).json({ error: "البطاقة غير موجودة" });
    }
    
    await db.update(promotionalCards)
      .set({ conversions: (card[0].conversions || 0) + 1 })
      .where(eq(promotionalCards.id, parseInt(req.params.id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    res.status(500).json({ error: "فشل في تسجيل التحويل" });
  }
});

export default router;
