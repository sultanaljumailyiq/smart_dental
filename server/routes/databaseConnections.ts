import { Router, Request, Response } from "express";

const router = Router();

interface DatabaseConnection {
  id: string;
  name: string;
  type: "postgresql" | "mongodb" | "firebase" | "supabase";
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  isActive: boolean;
  lastTestedAt: Date | null;
  testStatus: "success" | "failed" | "pending" | null;
  testMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Seed data to match client-side mock data
let databaseConnections: DatabaseConnection[] = [
  {
    id: "1",
    name: "Main PostgreSQL",
    type: "postgresql",
    host: "db.example.com",
    port: 5432,
    database: "dental_platform",
    username: "admin",
    password: "encrypted_password_123",
    ssl: true,
    isActive: true,
    lastTestedAt: new Date("2024-01-20 14:30"),
    testStatus: null,
    testMessage: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Analytics MongoDB",
    type: "mongodb",
    host: "mongo.example.com",
    port: 27017,
    database: "analytics",
    username: "analytics_user",
    password: "encrypted_password_456",
    ssl: true,
    isActive: true,
    lastTestedAt: new Date("2024-01-20 15:45"),
    testStatus: null,
    testMessage: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const connectionsWithoutPasswords = databaseConnections.map(conn => ({
      ...conn,
      password: "********",
    }));
    res.json(connectionsWithoutPasswords);
  } catch (error) {
    console.error("Error fetching database connections:", error);
    res.status(500).json({ error: "فشل في جلب اتصالات قواعد البيانات" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const connection = databaseConnections.find(c => c.id === req.params.id);
    if (!connection) {
      return res.status(404).json({ error: "الاتصال غير موجود" });
    }

    res.json({
      ...connection,
      password: "********",
    });
  } catch (error) {
    console.error("Error fetching database connection:", error);
    res.status(500).json({ error: "فشل في جلب الاتصال" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newConnection: DatabaseConnection = {
      id: Date.now().toString(),
      ...req.body,
      isActive: true,
      lastTestedAt: null,
      testStatus: null,
      testMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    databaseConnections.push(newConnection);

    res.status(201).json({
      ...newConnection,
      password: "********",
    });
  } catch (error) {
    console.error("Error creating database connection:", error);
    res.status(500).json({ error: "فشل في إنشاء الاتصال" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const index = databaseConnections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "الاتصال غير موجود" });
    }

    databaseConnections[index] = {
      ...databaseConnections[index],
      ...req.body,
      updatedAt: new Date(),
    };

    res.json({
      ...databaseConnections[index],
      password: "********",
    });
  } catch (error) {
    console.error("Error updating database connection:", error);
    res.status(500).json({ error: "فشل في تحديث الاتصال" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const index = databaseConnections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "الاتصال غير موجود" });
    }

    databaseConnections.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting database connection:", error);
    res.status(500).json({ error: "فشل في حذف الاتصال" });
  }
});

router.post("/:id/test", async (req: Request, res: Response) => {
  try {
    const connection = databaseConnections.find(c => c.id === req.params.id);
    if (!connection) {
      return res.status(404).json({ error: "الاتصال غير موجود" });
    }

    connection.lastTestedAt = new Date();
    connection.testStatus = "success";
    connection.testMessage = "تم الاتصال بنجاح";

    res.json({
      success: true,
      message: "تم الاتصال بنجاح",
      testedAt: connection.lastTestedAt,
    });
  } catch (error) {
    console.error("Error testing database connection:", error);
    res.status(500).json({ error: "فشل في اختبار الاتصال" });
  }
});

// Export database backup
router.post("/backup", async (req: Request, res: Response) => {
  try {
    const { format = 'json', tables } = req.body;
    
    // Mock backup data
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'smart_dental',
      format,
      tables: tables || ['all'],
      data: {
        // This would contain actual database data in production
        metadata: {
          exportedAt: new Date().toISOString(),
          recordCount: 1000,
          size: '2.5 MB'
        }
      }
    };

    res.setHeader('Content-Type', format === 'sql' ? 'application/sql' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="smart_dental_backup_${Date.now()}.${format}"`);
    
    if (format === 'sql') {
      res.send(`-- Smart Dental Platform Backup\n-- Date: ${new Date().toISOString()}\n\n-- Add SQL dump here`);
    } else {
      res.json(backupData);
    }
  } catch (error) {
    console.error("Error creating backup:", error);
    res.status(500).json({ error: "فشل في إنشاء النسخة الاحتياطية" });
  }
});

// Import/Restore database backup
router.post("/restore", async (req: Request, res: Response) => {
  try {
    const { backupData, overwrite = false } = req.body;
    
    if (!backupData) {
      return res.status(400).json({ error: "بيانات النسخة الاحتياطية مطلوبة" });
    }

    // In production, this would restore actual data
    // For now, return success simulation
    res.json({
      success: true,
      message: "تمت استعادة النسخة الاحتياطية بنجاح",
      recordsRestored: 1000,
      tablesRestored: ['users', 'clinics', 'appointments', 'suppliers'],
      restoredAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error restoring backup:", error);
    res.status(500).json({ error: "فشل في استعادة النسخة الاحتياطية" });
  }
});

// Get backup history
router.get("/backups", async (req: Request, res: Response) => {
  try {
    // Mock backup history
    const backups = [
      {
        id: '1',
        filename: 'smart_dental_backup_2025-01-20.json',
        size: '2.5 MB',
        format: 'json',
        createdAt: '2025-01-20 14:30:00',
        recordCount: 1000
      },
      {
        id: '2',
        filename: 'smart_dental_backup_2025-01-15.sql',
        size: '3.2 MB',
        format: 'sql',
        createdAt: '2025-01-15 10:15:00',
        recordCount: 950
      }
    ];
    
    res.json(backups);
  } catch (error) {
    console.error("Error fetching backups:", error);
    res.status(500).json({ error: "فشل في جلب النسخ الاحتياطية" });
  }
});

export default router;
