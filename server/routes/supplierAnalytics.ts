import { Router, Request, Response } from "express";

const router = Router();

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  percentage: number;
}

router.get("/:supplierId/revenue-trend", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const { period = "month" } = req.query;

    const data: RevenueData[] = [];
    const days = period === "week" ? 7 : period === "month" ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 5000000),
        orders: Math.floor(Math.random() * 50),
      });
    }

    res.json({ data, period });
  } catch (error) {
    console.error("Error fetching revenue trend:", error);
    res.status(500).json({ error: "فشل في جلب بيانات الإيرادات" });
  }
});

router.get("/:supplierId/top-products", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const { limit = 10 } = req.query;

    const products: TopProduct[] = [
      {
        id: "1",
        name: "حشوة الأسنان الفضية",
        sales: 150,
        revenue: 7500000,
        trend: 15.5,
      },
      {
        id: "2",
        name: "قفازات طبية (حجم M)",
        sales: 300,
        revenue: 7500000,
        trend: -5.2,
      },
      {
        id: "3",
        name: "أدوات الفحص الأساسية",
        sales: 80,
        revenue: 4000000,
        trend: 22.1,
      },
      {
        id: "4",
        name: "مادة التخدير الموضعي",
        sales: 120,
        revenue: 3600000,
        trend: 8.7,
      },
      {
        id: "5",
        name: "ماسك طبي (50 قطعة)",
        sales: 200,
        revenue: 3000000,
        trend: -2.1,
      },
    ];

    res.json({
      products: products.slice(0, Number(limit)),
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "فشل في جلب المنتجات الأكثر مبيعاً" });
  }
});

router.get("/:supplierId/customer-segments", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;

    const segments: CustomerSegment[] = [
      {
        segment: "عيادات خاصة",
        count: 45,
        revenue: 35000000,
        percentage: 45,
      },
      {
        segment: "مستشفيات",
        count: 12,
        revenue: 28000000,
        percentage: 28,
      },
      {
        segment: "مراكز طبية",
        count: 30,
        revenue: 18000000,
        percentage: 18,
      },
      {
        segment: "أطباء أفراد",
        count: 50,
        revenue: 7000000,
        percentage: 9,
      },
    ];

    res.json({ segments });
  } catch (error) {
    console.error("Error fetching customer segments:", error);
    res.status(500).json({ error: "فشل في جلب شرائح العملاء" });
  }
});

router.get("/:supplierId/order-status-distribution", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;

    const distribution = [
      { status: "pending", count: 25, percentage: 15 },
      { status: "processing", count: 35, percentage: 21 },
      { status: "shipped", count: 45, percentage: 27 },
      { status: "delivered", count: 55, percentage: 33 },
      { status: "cancelled", count: 7, percentage: 4 },
    ];

    res.json({ distribution });
  } catch (error) {
    console.error("Error fetching order distribution:", error);
    res.status(500).json({ error: "فشل في جلب توزيع الطلبات" });
  }
});

router.get("/:supplierId/performance-metrics", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;

    const metrics = {
      averageOrderValue: 850000,
      averageResponseTime: 2.5,
      customerSatisfaction: 4.7,
      orderFulfillmentRate: 96.5,
      returnRate: 1.8,
      repeatCustomerRate: 65,
    };

    res.json({ metrics });
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    res.status(500).json({ error: "فشل في جلب مؤشرات الأداء" });
  }
});

export default router;
