import { Router, Request, Response } from "express";
import { db } from "../storage";
import { supplierApprovals, suppliers } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Protect admin-only routes
router.use(requireAuth);
router.use(requireAdmin);

// Get all pending supplier approvals
router.get("/pending", async (req: Request, res: Response) => {
  try {
    const pendingApprovals = await db
      .select({
        id: supplierApprovals.id,
        supplierId: supplierApprovals.supplierId,
        status: supplierApprovals.status,
        createdAt: supplierApprovals.createdAt,
        supplier: {
          id: suppliers.id,
          companyName: suppliers.companyName,
          arabicCompanyName: suppliers.arabicCompanyName,
          description: suppliers.description,
          arabicDescription: suppliers.arabicDescription,
          logo: suppliers.logo,
          email: suppliers.email,
          phone: suppliers.phone,
        },
      })
      .from(supplierApprovals)
      .innerJoin(suppliers, eq(supplierApprovals.supplierId, suppliers.id))
      .where(eq(supplierApprovals.status, "pending"));

    res.json(pendingApprovals);
  } catch (error: any) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({ error: "Failed to fetch pending approvals" });
  }
});

// Get all supplier approvals (with filter)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let query = db
      .select({
        id: supplierApprovals.id,
        supplierId: supplierApprovals.supplierId,
        status: supplierApprovals.status,
        reviewedBy: supplierApprovals.reviewedBy,
        reviewedAt: supplierApprovals.reviewedAt,
        rejectionReason: supplierApprovals.rejectionReason,
        arabicRejectionReason: supplierApprovals.arabicRejectionReason,
        notes: supplierApprovals.notes,
        createdAt: supplierApprovals.createdAt,
        supplier: {
          id: suppliers.id,
          companyName: suppliers.companyName,
          arabicCompanyName: suppliers.arabicCompanyName,
          logo: suppliers.logo,
          email: suppliers.email,
          phone: suppliers.phone,
        },
      })
      .from(supplierApprovals)
      .innerJoin(suppliers, eq(supplierApprovals.supplierId, suppliers.id));

    if (status) {
      const approvals = await query.where(
        eq(supplierApprovals.status, status as string)
      );
      return res.json(approvals);
    }

    const approvals = await query;
    res.json(approvals);
  } catch (error: any) {
    console.error("Error fetching approvals:", error);
    res.status(500).json({ error: "Failed to fetch approvals" });
  }
});

// Get approval status for a specific supplier
router.get("/supplier/:supplierId", async (req: Request, res: Response) => {
  try {
    const supplierId = parseInt(req.params.supplierId);

    const [approval] = await db
      .select()
      .from(supplierApprovals)
      .where(eq(supplierApprovals.supplierId, supplierId))
      .limit(1);

    if (!approval) {
      return res.status(404).json({ error: "Approval record not found" });
    }

    res.json(approval);
  } catch (error: any) {
    console.error("Error fetching supplier approval:", error);
    res.status(500).json({ error: "Failed to fetch supplier approval" });
  }
});

// Approve a supplier
router.post("/:id/approve", async (req: Request, res: Response) => {
  try {
    const approvalId = parseInt(req.params.id);
    const { reviewedBy, notes } = req.body;

    const [updated] = await db
      .update(supplierApprovals)
      .set({
        status: "approved",
        reviewedBy,
        reviewedAt: new Date(),
        notes,
      })
      .where(eq(supplierApprovals.id, approvalId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Approval record not found" });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Error approving supplier:", error);
    res.status(500).json({ error: "Failed to approve supplier" });
  }
});

// Reject a supplier
router.post("/:id/reject", async (req: Request, res: Response) => {
  try {
    const approvalId = parseInt(req.params.id);
    const { reviewedBy, rejectionReason, arabicRejectionReason, notes } =
      req.body;

    const [updated] = await db
      .update(supplierApprovals)
      .set({
        status: "rejected",
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason,
        arabicRejectionReason,
        notes,
      })
      .where(eq(supplierApprovals.id, approvalId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Approval record not found" });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Error rejecting supplier:", error);
    res.status(500).json({ error: "Failed to reject supplier" });
  }
});

// Create supplier approval record when a new supplier registers
router.post("/", async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.body;

    // Check if approval record already exists
    const [existing] = await db
      .select()
      .from(supplierApprovals)
      .where(eq(supplierApprovals.supplierId, supplierId))
      .limit(1);

    if (existing) {
      return res.status(409).json({ 
        error: "Approval record already exists",
        approval: existing
      });
    }

    const [approval] = await db
      .insert(supplierApprovals)
      .values({
        supplierId,
        status: "pending",
      })
      .returning();

    res.json(approval);
  } catch (error: any) {
    console.error("Error creating supplier approval:", error);
    res.status(500).json({ error: "Failed to create supplier approval" });
  }
});

export default router;
