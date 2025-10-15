import { Router, Request, Response } from "express";
import { db } from "../storage";
import { platformSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get platform name (public endpoint)
router.get("/name", async (req: Request, res: Response) => {
  try {
    const setting = await db
      .select()
      .from(platformSettings)
      .where(eq(platformSettings.key, "platform_name"))
      .limit(1);

    const platformName = setting[0]?.value || "Smart";
    res.json({ platformName });
  } catch (error) {
    console.error("Error fetching platform name:", error);
    res.json({ platformName: "Smart" });
  }
});

// Update platform name (admin endpoint)
router.put("/name", async (req: Request, res: Response) => {
  try {
    const { platformName } = req.body;

    if (!platformName || typeof platformName !== "string") {
      return res.status(400).json({ error: "اسم المنصة مطلوب" });
    }

    const setting = await db
      .select()
      .from(platformSettings)
      .where(eq(platformSettings.key, "platform_name"))
      .limit(1);

    if (setting.length > 0) {
      await db
        .update(platformSettings)
        .set({
          value: platformName,
          updatedAt: new Date(),
        })
        .where(eq(platformSettings.key, "platform_name"));
    } else {
      await db.insert(platformSettings).values({
        key: "platform_name",
        value: platformName,
        category: "general",
        dataType: "string",
        isPublic: true,
      });
    }

    res.json({ platformName });
  } catch (error) {
    console.error("Error updating platform name:", error);
    res.status(500).json({ error: "فشل في تحديث اسم المنصة" });
  }
});

// Get all platform settings
router.get("/", async (req: Request, res: Response) => {
  try {
    const settings = await db.select().from(platformSettings);
    
    const settingsObj: Record<string, any> = {
      platformName: "Smart",
      platformLogo: null,
      platformEmail: "info@iraqidental.com",
      platformPhone: "+964 770 123 4567",
      platformAddress: "بغداد، العراق",
      currency: "IQD",
      timezone: "Asia/Baghdad",
      language: "ar",
      maintenanceMode: false,
      allowRegistration: true,
      enableNotifications: true,
      enableEmailVerification: false,
      termsOfServiceUrl: null,
      privacyPolicyUrl: null,
    };

    settings.forEach((setting) => {
      if (setting.dataType === "boolean") {
        settingsObj[setting.key] = setting.value === "true";
      } else if (setting.dataType === "number") {
        settingsObj[setting.key] = Number(setting.value);
      } else if (setting.dataType === "json") {
        settingsObj[setting.key] = JSON.parse(setting.value || "null");
      } else {
        settingsObj[setting.key] = setting.value;
      }
    });

    res.json(settingsObj);
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    res.status(500).json({ error: "فشل في جلب إعدادات المنصة" });
  }
});

// Update platform settings
router.put("/", async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      const setting = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.key, key))
        .limit(1);

      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
      const dataType = typeof value === "object" ? "json" : typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string";

      if (setting.length > 0) {
        await db
          .update(platformSettings)
          .set({ 
            value: stringValue,
            dataType,
            updatedAt: new Date() 
          })
          .where(eq(platformSettings.key, key));
      } else {
        await db.insert(platformSettings).values({
          key,
          value: stringValue,
          category: "general",
          dataType,
          isPublic: key === "platform_name" || key === "platformLogo",
        });
      }
    }

    const updatedSettings = await db.select().from(platformSettings);
    const settingsObj: Record<string, any> = {};
    
    updatedSettings.forEach((setting) => {
      if (setting.dataType === "boolean") {
        settingsObj[setting.key] = setting.value === "true";
      } else if (setting.dataType === "number") {
        settingsObj[setting.key] = Number(setting.value);
      } else if (setting.dataType === "json") {
        settingsObj[setting.key] = JSON.parse(setting.value || "null");
      } else {
        settingsObj[setting.key] = setting.value;
      }
    });

    res.json(settingsObj);
  } catch (error) {
    console.error("Error updating platform settings:", error);
    res.status(500).json({ error: "فشل في تحديث إعدادات المنصة" });
  }
});

export default router;
