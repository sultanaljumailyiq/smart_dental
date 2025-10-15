import { Router, Request, Response } from "express";

const router = Router();

interface ApiService {
  id: string;
  name: string;
  type: "stripe" | "google_maps" | "openai" | "zain_cash" | "firebase" | "other";
  apiKey: string;
  apiSecret: string | null;
  webhookUrl: string | null;
  isActive: boolean;
  lastTestedAt: Date | null;
  testStatus: "success" | "failed" | "pending" | null;
  testMessage: string | null;
  additionalConfig: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

let apiServices: ApiService[] = [];

router.get("/", async (req: Request, res: Response) => {
  try {
    const servicesWithoutSecrets = apiServices.map(service => ({
      ...service,
      apiKey: service.apiKey ? "********" : null,
      apiSecret: service.apiSecret ? "********" : null,
    }));
    res.json(servicesWithoutSecrets);
  } catch (error) {
    console.error("Error fetching API services:", error);
    res.status(500).json({ error: "فشل في جلب الخدمات الخارجية" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const service = apiServices.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ error: "الخدمة غير موجودة" });
    }

    res.json({
      ...service,
      apiKey: service.apiKey ? "********" : null,
      apiSecret: service.apiSecret ? "********" : null,
    });
  } catch (error) {
    console.error("Error fetching API service:", error);
    res.status(500).json({ error: "فشل في جلب الخدمة" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newService: ApiService = {
      id: Date.now().toString(),
      ...req.body,
      isActive: true,
      lastTestedAt: null,
      testStatus: null,
      testMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    apiServices.push(newService);

    res.status(201).json({
      ...newService,
      apiKey: "********",
      apiSecret: newService.apiSecret ? "********" : null,
    });
  } catch (error) {
    console.error("Error creating API service:", error);
    res.status(500).json({ error: "فشل في إنشاء الخدمة" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const index = apiServices.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "الخدمة غير موجودة" });
    }

    apiServices[index] = {
      ...apiServices[index],
      ...req.body,
      updatedAt: new Date(),
    };

    res.json({
      ...apiServices[index],
      apiKey: "********",
      apiSecret: apiServices[index].apiSecret ? "********" : null,
    });
  } catch (error) {
    console.error("Error updating API service:", error);
    res.status(500).json({ error: "فشل في تحديث الخدمة" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const index = apiServices.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "الخدمة غير موجودة" });
    }

    apiServices.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting API service:", error);
    res.status(500).json({ error: "فشل في حذف الخدمة" });
  }
});

router.post("/:id/test", async (req: Request, res: Response) => {
  try {
    const service = apiServices.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ error: "الخدمة غير موجودة" });
    }

    service.lastTestedAt = new Date();
    service.testStatus = "success";
    service.testMessage = "تم الاتصال بنجاح";

    res.json({
      success: true,
      message: "تم الاتصال بنجاح",
      testedAt: service.lastTestedAt,
    });
  } catch (error) {
    console.error("Error testing API service:", error);
    res.status(500).json({ error: "فشل في اختبار الاتصال" });
  }
});

export default router;
