import { Router, Request, Response } from "express";

const router = Router();

interface AdminStats {
  platform: {
    totalRevenue: number;
    totalOrders: number;
    totalSuppliers: number;
    totalDentists: number;
    totalPatients: number;
    activeUsers: number;
  };
  suppliers: {
    pending: number;
    approved: number;
    suspended: number;
    total: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: number;
  };
  orders: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
}

interface Supplier {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "suspended";
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  joinedAt: string;
  badge: string | null;
  suspensionReason?: string;
}

const suppliersStore: Supplier[] = [
  {
    id: "1",
    companyName: "شركة حلول الأسنان التقنية",
    email: "info@dentaltech.iq",
    phone: "+964 770 123 4567",
    status: "approved",
    totalOrders: 250,
    totalRevenue: 125000000,
    rating: 4.9,
    joinedAt: "2024-01-15",
    badge: "verified",
  },
  {
    id: "2",
    companyName: "شركة الإمدادات الطبية",
    email: "contact@medicalsupply.iq",
    phone: "+964 771 234 5678",
    status: "approved",
    totalOrders: 180,
    totalRevenue: 85000000,
    rating: 4.5,
    joinedAt: "2024-02-20",
    badge: "premium",
  },
  {
    id: "3",
    companyName: "موردون جدد",
    email: "new@supplier.iq",
    phone: "+964 772 345 6789",
    status: "pending",
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    joinedAt: "2024-03-10",
    badge: null,
  },
];

let adminStats: AdminStats = {
  platform: {
    totalRevenue: 500000000,
    totalOrders: 3500,
    totalSuppliers: 120,
    totalDentists: 850,
    totalPatients: 5200,
    activeUsers: 1200,
  },
  suppliers: {
    pending: 15,
    approved: 95,
    suspended: 10,
    total: 120,
  },
  revenue: {
    today: 8500000,
    thisWeek: 45000000,
    thisMonth: 150000000,
    trend: 12.5,
  },
  orders: {
    pending: 85,
    processing: 120,
    completed: 3200,
    cancelled: 95,
  },
};

router.get("/stats", async (req: Request, res: Response) => {
  try {
    res.json(adminStats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "فشل في جلب إحصائيات المنصة" });
  }
});

router.get("/suppliers", async (req: Request, res: Response) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let suppliers = [...suppliersStore];

    if (status) {
      suppliers = suppliers.filter(s => s.status === status);
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      suppliers = suppliers.filter(
        s =>
          s.companyName.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
      );
    }

    const paginatedSuppliers = suppliers.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.json({
      suppliers: paginatedSuppliers,
      total: suppliers.length,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "فشل في جلب الموردين" });
  }
});

router.put("/suppliers/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) {
      return res.status(404).json({ error: "المورد غير موجود" });
    }

    supplier.status = status;

    res.json({
      success: true,
      message: `تم تحديث حالة المورد إلى ${status}`,
      supplier,
    });
  } catch (error) {
    console.error("Error updating supplier status:", error);
    res.status(500).json({ error: "فشل في تحديث حالة المورد" });
  }
});

router.put("/suppliers/:id/suspend", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) {
      return res.status(404).json({ error: "المورد غير موجود" });
    }

    supplier.status = "suspended";
    supplier.suspensionReason = reason;

    res.json({
      success: true,
      message: "تم تعليق حساب المورد بنجاح",
      supplier,
    });
  } catch (error) {
    console.error("Error suspending supplier:", error);
    res.status(500).json({ error: "فشل في تعليق حساب المورد" });
  }
});

router.put("/suppliers/:id/unsuspend", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) {
      return res.status(404).json({ error: "المورد غير موجود" });
    }

    supplier.status = "approved";
    supplier.suspensionReason = undefined;

    res.json({
      success: true,
      message: "تم إلغاء تعليق حساب المورد بنجاح",
      supplier,
    });
  } catch (error) {
    console.error("Error unsuspending supplier:", error);
    res.status(500).json({ error: "فشل في إلغاء تعليق حساب المورد" });
  }
});

router.post("/suppliers/:id/badge", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { badgeType } = req.body;

    const supplier = suppliersStore.find(s => s.id === id);
    if (!supplier) {
      return res.status(404).json({ error: "المورد غير موجود" });
    }

    supplier.badge = badgeType;

    res.json({
      success: true,
      message: `تم منح شارة ${badgeType} للمورد`,
      supplier,
    });
  } catch (error) {
    console.error("Error assigning badge:", error);
    res.status(500).json({ error: "فشل في منح الشارة" });
  }
});

router.get("/recent-activities", async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const activities = [
      {
        id: "1",
        type: "supplier_registered",
        description: "مورد جديد قام بالتسجيل: شركة الإمدادات الحديثة",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        user: "system",
      },
      {
        id: "2",
        type: "order_completed",
        description: "تم إكمال طلب #1234 بقيمة 500,000 د.ع",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: "د. أحمد علي",
      },
      {
        id: "3",
        type: "supplier_approved",
        description: "تمت الموافقة على مورد: شركة حلول الأسنان",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: "Admin",
      },
    ];

    res.json({
      activities: activities.slice(0, Number(limit)),
      total: activities.length,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ error: "فشل في جلب الأنشطة الأخيرة" });
  }
});

router.get("/revenue-chart", async (req: Request, res: Response) => {
  try {
    const { period = "month" } = req.query;
    const days = period === "week" ? 7 : period === "month" ? 30 : 90;

    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 10000000),
        commissions: Math.floor(Math.random() * 500000),
      });
    }

    res.json({ data, period });
  } catch (error) {
    console.error("Error fetching revenue chart:", error);
    res.status(500).json({ error: "فشل في جلب بيانات الإيرادات" });
  }
});

export default router;
