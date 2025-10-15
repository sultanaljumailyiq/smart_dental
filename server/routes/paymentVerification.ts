import { Router, Request, Response } from "express";

const router = Router();

interface SubscriptionPayment {
  id: number;
  paymentNumber: string;
  clinicId: number;
  clinicName: string;
  userId: number;
  userName: string;
  subscriptionType: string;
  amount: string;
  duration: number;
  paymentMethod: string;
  zainCashPhoneNumber?: string;
  zainCashTransactionRef?: string;
  exchangeOfficeName?: string;
  depositReceiptNumber?: string;
  status: string;
  verificationStatus: string;
  verifiedBy?: number;
  verifiedAt?: Date;
  verificationNotes?: string;
  rejectionReason?: string;
  activatedAt?: Date;
  expiresAt?: Date;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ManualPaymentReview {
  id: number;
  reviewNumber: string;
  paymentType: string;
  referenceId: number;
  referenceType: string;
  paymentMethod: string;
  amount: string;
  transactionReference?: string;
  submittedBy: number;
  submittedByName: string;
  submittedAt: Date;
  status: string;
  assignedTo?: number;
  assignedToName?: string;
  assignedAt?: Date;
  reviewedBy?: number;
  reviewedByName?: string;
  reviewedAt?: Date;
  verificationMethod?: string;
  verificationDetails: any;
  reviewNotes?: string;
  priority: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

let subscriptionPayments: SubscriptionPayment[] = [
  {
    id: 1,
    paymentNumber: "SUB-PAY-001",
    clinicId: 1,
    clinicName: "عيادة النور لطب الأسنان",
    userId: 5,
    userName: "د. أحمد علي",
    subscriptionType: "premium",
    amount: "500000.00",
    duration: 3,
    paymentMethod: "zain_cash",
    zainCashPhoneNumber: "+964 770 123 4567",
    zainCashTransactionRef: "ZC-2025-789456",
    status: "pending_verification",
    verificationStatus: "pending",
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    paymentNumber: "SUB-PAY-002",
    clinicId: 2,
    clinicName: "عيادة الياسمين",
    userId: 6,
    userName: "د. فاطمة حسن",
    subscriptionType: "basic",
    amount: "200000.00",
    duration: 1,
    paymentMethod: "exchange_office",
    exchangeOfficeName: "صيرفة الكرادة",
    depositReceiptNumber: "REC-2025-123",
    status: "pending_verification",
    verificationStatus: "pending",
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let manualPaymentReviews: ManualPaymentReview[] = [
  {
    id: 1,
    reviewNumber: "REV-2025-001",
    paymentType: "subscription",
    referenceId: 1,
    referenceType: "subscription_payment",
    paymentMethod: "zain_cash",
    amount: "500000.00",
    transactionReference: "ZC-2025-789456",
    submittedBy: 5,
    submittedByName: "د. أحمد علي",
    submittedAt: new Date(),
    status: "pending",
    priority: "normal",
    verificationDetails: {},
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    reviewNumber: "REV-2025-002",
    paymentType: "subscription",
    referenceId: 2,
    referenceType: "subscription_payment",
    paymentMethod: "exchange_office",
    amount: "200000.00",
    transactionReference: "REC-2025-123",
    submittedBy: 6,
    submittedByName: "د. فاطمة حسن",
    submittedAt: new Date(),
    status: "pending",
    priority: "normal",
    verificationDetails: {},
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextReviewId = 3;
let nextPaymentId = 3;

router.get("/queue", async (req: Request, res: Response) => {
  try {
    const { status, priority, paymentMethod, assignedTo } = req.query;
    
    let filtered = [...manualPaymentReviews];
    
    if (status) {
      filtered = filtered.filter(review => review.status === status);
    }
    
    if (priority) {
      filtered = filtered.filter(review => review.priority === priority);
    }
    
    if (paymentMethod) {
      filtered = filtered.filter(review => review.paymentMethod === paymentMethod);
    }
    
    if (assignedTo) {
      filtered = filtered.filter(review => review.assignedTo === parseInt(assignedTo as string));
    }
    
    filtered.sort((a, b) => {
      const priorityOrder: any = { urgent: 0, high: 1, normal: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });
    
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching payment verification queue:", error);
    res.status(500).json({ error: "فشل في جلب قائمة المدفوعات" });
  }
});

router.get("/queue/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const review = manualPaymentReviews.find(r => r.id === id);
    
    if (!review) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    
    let paymentDetails = null;
    if (review.referenceType === "subscription_payment") {
      paymentDetails = subscriptionPayments.find(p => p.id === review.referenceId);
    }
    
    res.json({ ...review, paymentDetails });
  } catch (error) {
    console.error("Error fetching review details:", error);
    res.status(500).json({ error: "فشل في جلب تفاصيل الطلب" });
  }
});

router.put("/queue/:id/assign", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const index = manualPaymentReviews.findIndex(r => r.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    
    const { assignedTo, assignedToName } = req.body;
    
    manualPaymentReviews[index] = {
      ...manualPaymentReviews[index],
      status: "in_review",
      assignedTo,
      assignedToName,
      assignedAt: new Date(),
      updatedAt: new Date(),
    };
    
    res.json(manualPaymentReviews[index]);
  } catch (error) {
    console.error("Error assigning review:", error);
    res.status(500).json({ error: "فشل في تعيين المراجع" });
  }
});

router.put("/queue/:id/verify", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const reviewIndex = manualPaymentReviews.findIndex(r => r.id === id);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    
    const { verificationMethod, verificationDetails, reviewNotes, reviewedBy, reviewedByName } = req.body;
    
    const review = manualPaymentReviews[reviewIndex];
    
    manualPaymentReviews[reviewIndex] = {
      ...review,
      status: "verified",
      reviewedBy,
      reviewedByName,
      reviewedAt: new Date(),
      verificationMethod,
      verificationDetails: verificationDetails || {},
      reviewNotes,
      updatedAt: new Date(),
    };
    
    if (review.referenceType === "subscription_payment") {
      const paymentIndex = subscriptionPayments.findIndex(p => p.id === review.referenceId);
      if (paymentIndex !== -1) {
        const activatedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + subscriptionPayments[paymentIndex].duration);
        
        subscriptionPayments[paymentIndex] = {
          ...subscriptionPayments[paymentIndex],
          status: "activated",
          verificationStatus: "verified",
          verifiedBy: reviewedBy,
          verifiedAt: new Date(),
          verificationNotes: reviewNotes,
          activatedAt,
          expiresAt,
          updatedAt: new Date(),
        };
      }
    }
    
    res.json(manualPaymentReviews[reviewIndex]);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "فشل في التحقق من الدفع" });
  }
});

router.put("/queue/:id/reject", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const reviewIndex = manualPaymentReviews.findIndex(r => r.id === id);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    
    const { rejectionReason, reviewedBy, reviewedByName } = req.body;
    
    const review = manualPaymentReviews[reviewIndex];
    
    manualPaymentReviews[reviewIndex] = {
      ...review,
      status: "rejected",
      reviewedBy,
      reviewedByName,
      reviewedAt: new Date(),
      reviewNotes: rejectionReason,
      updatedAt: new Date(),
    };
    
    if (review.referenceType === "subscription_payment") {
      const paymentIndex = subscriptionPayments.findIndex(p => p.id === review.referenceId);
      if (paymentIndex !== -1) {
        subscriptionPayments[paymentIndex] = {
          ...subscriptionPayments[paymentIndex],
          status: "rejected",
          verificationStatus: "rejected",
          rejectionReason,
          updatedAt: new Date(),
        };
      }
    }
    
    res.json(manualPaymentReviews[reviewIndex]);
  } catch (error) {
    console.error("Error rejecting payment:", error);
    res.status(500).json({ error: "فشل في رفض الدفع" });
  }
});

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const pending = manualPaymentReviews.filter(r => r.status === "pending").length;
    const inReview = manualPaymentReviews.filter(r => r.status === "in_review").length;
    const verified = manualPaymentReviews.filter(r => r.status === "verified").length;
    const rejected = manualPaymentReviews.filter(r => r.status === "rejected").length;
    
    const urgentCount = manualPaymentReviews.filter(r => r.priority === "urgent" && r.status === "pending").length;
    
    const totalAmount = manualPaymentReviews
      .filter(r => r.status === "pending" || r.status === "in_review")
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);
    
    res.json({
      pending,
      inReview,
      verified,
      rejected,
      urgentCount,
      totalAmount: totalAmount.toFixed(2),
      total: manualPaymentReviews.length,
    });
  } catch (error) {
    console.error("Error fetching verification stats:", error);
    res.status(500).json({ error: "فشل في جلب الإحصائيات" });
  }
});

export default router;
