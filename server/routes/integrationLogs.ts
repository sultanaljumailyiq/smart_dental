import { Router, Request, Response } from "express";

const router = Router();

interface IntegrationLog {
  id: string;
  type: "database" | "api_service";
  connectionId: string;
  connectionName: string;
  action: string;
  status: "success" | "failed" | "pending";
  requestData: Record<string, any> | null;
  responseData: Record<string, any> | null;
  errorMessage: string | null;
  duration: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

let integrationLogs: IntegrationLog[] = [];

router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, status, connectionId, limit = 100 } = req.query;
    
    let filteredLogs = [...integrationLogs];

    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type);
    }

    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    if (connectionId) {
      filteredLogs = filteredLogs.filter(log => log.connectionId === connectionId);
    }

    filteredLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const limitedLogs = filteredLogs.slice(0, Number(limit));

    res.json({
      logs: limitedLogs,
      total: filteredLogs.length,
    });
  } catch (error) {
    console.error("Error fetching integration logs:", error);
    res.status(500).json({ error: "فشل في جلب السجلات" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newLog: IntegrationLog = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
    };

    integrationLogs.push(newLog);

    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating integration log:", error);
    res.status(500).json({ error: "فشل في إنشاء السجل" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { olderThan } = req.query;
    
    if (olderThan) {
      const cutoffDate = new Date(olderThan as string);
      integrationLogs = integrationLogs.filter(log => log.createdAt > cutoffDate);
    } else {
      integrationLogs = [];
    }

    res.json({ message: "تم حذف السجلات بنجاح" });
  } catch (error) {
    console.error("Error deleting integration logs:", error);
    res.status(500).json({ error: "فشل في حذف السجلات" });
  }
});

export default router;
