import { Router, Request, Response } from "express";

const router = Router();

interface SupplierSalesReport {
  id: number;
  supplierId: number;
  reportPeriod: string;
  periodStart: Date;
  periodEnd: Date;
  totalOrders: number;
  totalRevenue: string;
  totalCommission: string;
  avgOrderValue: string;
  topProducts: Array<{
    id: number;
    name: string;
    nameArabic: string;
    quantity: number;
    revenue: string;
  }>;
  paymentMethods: {
    cash: number;
    zain_cash: number;
    exchange_office: number;
    stripe: number;
  };
  orderStatuses: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  generatedAt: Date;
  createdAt: Date;
}

let salesReports: SupplierSalesReport[] = [
  {
    id: 1,
    supplierId: 1,
    reportPeriod: "monthly",
    periodStart: new Date("2025-01-01"),
    periodEnd: new Date("2025-01-31"),
    totalOrders: 150,
    totalRevenue: "15000000.00",
    totalCommission: "1500000.00",
    avgOrderValue: "100000.00",
    topProducts: [
      {
        id: 1,
        name: "Dental Implant Set",
        nameArabic: "طقم زراعة أسنان",
        quantity: 45,
        revenue: "6750000.00",
      },
      {
        id: 2,
        name: "Composite Filling Kit",
        nameArabic: "طقم حشوات تجميلية",
        quantity: 80,
        revenue: "3200000.00",
      },
    ],
    paymentMethods: {
      cash: 60,
      zain_cash: 50,
      exchange_office: 30,
      stripe: 10,
    },
    orderStatuses: {
      pending: 10,
      confirmed: 20,
      shipped: 30,
      delivered: 85,
      cancelled: 5,
    },
    generatedAt: new Date(),
    createdAt: new Date(),
  },
];

let nextReportId = 2;

router.get("/:supplierId/reports", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const { reportPeriod, startDate, endDate } = req.query;
    
    let filtered = salesReports.filter(r => r.supplierId === supplierId);
    
    if (reportPeriod) {
      filtered = filtered.filter(r => r.reportPeriod === reportPeriod);
    }
    
    if (startDate) {
      filtered = filtered.filter(r => new Date(r.periodStart) >= new Date(startDate as string));
    }
    
    if (endDate) {
      filtered = filtered.filter(r => new Date(r.periodEnd) <= new Date(endDate as string));
    }
    
    filtered.sort((a, b) => new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime());
    
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    res.status(500).json({ error: "فشل في جلب التقارير" });
  }
});

router.get("/:supplierId/reports/:reportId", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const reportId = parseInt(req.params.reportId);
    
    const report = salesReports.find(r => r.id === reportId && r.supplierId === supplierId);
    
    if (!report) {
      return res.status(404).json({ error: "التقرير غير موجود" });
    }
    
    res.json(report);
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({ error: "فشل في جلب التقرير" });
  }
});

router.post("/:supplierId/reports/generate", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const { reportPeriod, periodStart, periodEnd } = req.body;
    
    if (!reportPeriod || !periodStart || !periodEnd) {
      return res.status(400).json({ error: "البيانات المطلوبة غير مكتملة" });
    }
    
    const existingReport = salesReports.find(
      r => r.supplierId === supplierId &&
           r.reportPeriod === reportPeriod &&
           new Date(r.periodStart).getTime() === new Date(periodStart).getTime() &&
           new Date(r.periodEnd).getTime() === new Date(periodEnd).getTime()
    );
    
    if (existingReport) {
      return res.status(400).json({ error: "التقرير لهذه الفترة موجود بالفعل" });
    }
    
    const newReport: SupplierSalesReport = {
      id: nextReportId++,
      supplierId,
      reportPeriod,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      totalOrders: req.body.totalOrders || 0,
      totalRevenue: req.body.totalRevenue || "0.00",
      totalCommission: req.body.totalCommission || "0.00",
      avgOrderValue: req.body.avgOrderValue || "0.00",
      topProducts: req.body.topProducts || [],
      paymentMethods: req.body.paymentMethods || { cash: 0, zain_cash: 0, exchange_office: 0, stripe: 0 },
      orderStatuses: req.body.orderStatuses || { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
      generatedAt: new Date(),
      createdAt: new Date(),
    };
    
    salesReports.push(newReport);
    
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ error: "فشل في إنشاء التقرير" });
  }
});

router.get("/:supplierId/stats/summary", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const supplierReports = salesReports.filter(r => r.supplierId === supplierId);
    
    if (supplierReports.length === 0) {
      return res.json({
        totalRevenue: "0.00",
        totalCommission: "0.00",
        totalOrders: 0,
        avgOrderValue: "0.00",
        reportCount: 0,
      });
    }
    
    const totalRevenue = supplierReports.reduce((sum, r) => sum + parseFloat(r.totalRevenue), 0);
    const totalCommission = supplierReports.reduce((sum, r) => sum + parseFloat(r.totalCommission), 0);
    const totalOrders = supplierReports.reduce((sum, r) => sum + r.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const latestReport = supplierReports.sort((a, b) => 
      new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime()
    )[0];
    
    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalCommission: totalCommission.toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      reportCount: supplierReports.length,
      latestReport: latestReport || null,
    });
  } catch (error) {
    console.error("Error fetching supplier stats:", error);
    res.status(500).json({ error: "فشل في جلب الإحصائيات" });
  }
});

router.delete("/:supplierId/reports/:reportId", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);
    const reportId = parseInt(req.params.reportId);
    
    const index = salesReports.findIndex(r => r.id === reportId && r.supplierId === supplierId);
    
    if (index === -1) {
      return res.status(404).json({ error: "التقرير غير موجود" });
    }
    
    salesReports.splice(index, 1);
    
    res.json({ message: "تم حذف التقرير بنجاح" });
  } catch (error) {
    console.error("Error deleting sales report:", error);
    res.status(500).json({ error: "فشل في حذف التقرير" });
  }
});

export default router;
