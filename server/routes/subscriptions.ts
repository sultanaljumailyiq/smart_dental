import { Express } from "express";
import { db, subscriptionPlans, clinicPayments, mapSettings, clinics, coupons, paymentSettings, cashPaymentCenters, subscriptionPayments, users } from "../storage";
import { eq, and, lt, gt, or, isNull, desc } from "drizzle-orm";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import fs from "fs";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" })
  : null;

// Ensure upload directory exists
const uploadDir = 'uploads/subscription-payments';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('يُسمح فقط بملفات الصور (JPEG, PNG) أو PDF'));
    }
  }
});

export function registerSubscriptionRoutes(app: Express) {
  
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const query = active 
        ? db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true))
        : db.select().from(subscriptionPlans);
      const plans = await query;
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/subscription-plans", async (req, res) => {
    try {
      const [plan] = await db.insert(subscriptionPlans).values(req.body).returning();
      res.json(plan);
    } catch (error: any) {
      console.error("Error creating plan:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/subscription-plans/:id", async (req, res) => {
    try {
      const [plan] = await db.update(subscriptionPlans)
        .set(req.body)
        .where(eq(subscriptionPlans.id, parseInt(req.params.id)))
        .returning();
      res.json(plan);
    } catch (error: any) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/subscription-plans/:id", async (req, res) => {
    try {
      await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payment-methods", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const methods = active
        ? await db.query.paymentMethods.findMany({ where: (paymentMethods, { eq }) => eq(paymentMethods.isActive, true) })
        : await db.query.paymentMethods.findMany();
      res.json(methods || []);
    } catch (error: any) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/map-settings", async (req, res) => {
    try {
      const [settings] = await db.select().from(mapSettings).limit(1);
      res.json(settings || {});
    } catch (error: any) {
      console.error("Error fetching map settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/map-settings", async (req, res) => {
    try {
      const [existing] = await db.select().from(mapSettings).limit(1);
      let settings;
      if (existing) {
        [settings] = await db.update(mapSettings).set(req.body).where(eq(mapSettings.id, existing.id)).returning();
      } else {
        [settings] = await db.insert(mapSettings).values(req.body).returning();
      }
      res.json(settings);
    } catch (error: any) {
      console.error("Error updating map settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/check-maps-key", async (req, res) => {
    try {
      const envKeyExists = !!process.env.GOOGLE_MAPS_API_KEY;
      const [settings] = await db.select().from(mapSettings).limit(1);
      const dbKeyExists = !!(settings?.googleMapsApiKey);
      
      res.json({ exists: envKeyExists || dbKeyExists });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/maps-key", async (req, res) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }
      
      const [existing] = await db.select().from(mapSettings).limit(1);
      if (existing) {
        await db.update(mapSettings).set({ googleMapsApiKey: apiKey }).where(eq(mapSettings.id, existing.id));
      } else {
        await db.insert(mapSettings).values({ googleMapsApiKey: apiKey });
      }
      
      res.json({ 
        success: true, 
        message: "Google Maps API key saved successfully" 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(400).json({ error: "Stripe not configured" });
    }

    try {
      const { amount } = req.body;
      
      const amountInUSD = Math.round((amount / 1320) * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInUSD,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/doctor/current-subscription", async (req, res) => {
    try {
      const subscription = await db.select().from(clinicPayments).limit(1);
      res.json(subscription[0] || null);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/doctor/subscribe", upload.single('transferImage'), async (req, res) => {
    try {
      const { 
        planId, 
        paymentMethod, 
        stripePaymentId, 
        zainCashTransferNumber,
        zainCashPhoneNumber,
        senderName,
        exchangeOfficeName,
        depositReceiptNumber,
        cashCenterId,
        couponCode,
        amount,
        duration,
        clinicId,
        userId
      } = req.body;
      
      const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, parseInt(planId)));
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      // Generate unique payment number
      const paymentNumber = `SUB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Handle attachments
      const attachments: string[] = [];
      if (req.file) {
        attachments.push(`/uploads/subscription-payments/${req.file.filename}`);
      }
      
      // Create subscription payment record
      const [subscription] = await db.insert(subscriptionPayments).values({
        paymentNumber,
        clinicId: parseInt(clinicId) || 1,
        userId: parseInt(userId) || 1,
        subscriptionType: plan.name,
        amount: amount || plan.price,
        duration: parseInt(duration) || plan.durationMonths,
        paymentMethod,
        status: stripePaymentId ? "activated" : "pending_verification",
        verificationStatus: stripePaymentId ? "verified" : "pending",
        zainCashPhoneNumber: zainCashPhoneNumber || null,
        zainCashTransactionRef: zainCashTransferNumber || null,
        senderName: senderName || null,
        exchangeOfficeName: exchangeOfficeName || null,
        depositReceiptNumber: depositReceiptNumber || null,
        attachments,
        activatedAt: stripePaymentId ? new Date() : null,
        expiresAt: stripePaymentId ? new Date(Date.now() + (parseInt(duration) || plan.durationMonths) * 30 * 24 * 60 * 60 * 1000) : null,
      }).returning();
      
      res.json(subscription);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/clinics", async (req, res) => {
    try {
      const allClinics = await db.select().from(clinics);
      res.json(allClinics);
    } catch (error: any) {
      console.error("Error fetching clinics:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/clinics/:id/promotion", async (req, res) => {
    try {
      const { isPromoted } = req.body;
      const [clinic] = await db.update(clinics)
        .set({ isPromoted })
        .where(eq(clinics.id, parseInt(req.params.id)))
        .returning();
      res.json(clinic);
    } catch (error: any) {
      console.error("Error updating promotion:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/clinics/:id/priority", async (req, res) => {
    try {
      const { priorityLevel } = req.body;
      const [clinic] = await db.update(clinics)
        .set({ priorityLevel })
        .where(eq(clinics.id, parseInt(req.params.id)))
        .returning();
      res.json(clinic);
    } catch (error: any) {
      console.error("Error updating priority:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/clinics/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      const [clinic] = await db.update(clinics)
        .set({ isActive })
        .where(eq(clinics.id, parseInt(req.params.id)))
        .returning();
      res.json(clinic);
    } catch (error: any) {
      console.error("Error updating status:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Coupon validation endpoint
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, planId } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "رمز الكوبون مطلوب" });
      }

      const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
      
      if (!coupon) {
        return res.status(404).json({ message: "الكوبون غير موجود" });
      }

      // Check if coupon is active
      if (!coupon.isActive) {
        return res.status(400).json({ message: "هذا الكوبون غير مفعّل" });
      }

      // Check expiry date
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: "هذا الكوبون منتهي الصلاحية" });
      }

      // Check usage limit
      if (coupon.maxUsage && coupon.maxUsage > 0 && coupon.currentUsage >= coupon.maxUsage) {
        return res.status(400).json({ message: "تم استخدام هذا الكوبون بالكامل" });
      }

      // Check if coupon applies to this plan
      if (coupon.planIds && coupon.planIds.length > 0 && planId) {
        if (!coupon.planIds.includes(planId)) {
          return res.status(400).json({ message: "هذا الكوبون لا ينطبق على هذه الباقة" });
        }
      }

      res.json({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: parseFloat(coupon.discountValue),
      });
    } catch (error: any) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ message: "حدث خطأ في التحقق من الكوبون" });
    }
  });

  // Payment settings endpoints
  app.get("/api/payment-settings", async (req, res) => {
    try {
      const [settings] = await db.select().from(paymentSettings).limit(1);
      res.json(settings || {});
    } catch (error: any) {
      console.error("Error fetching payment settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payment-settings", async (req, res) => {
    try {
      const [existing] = await db.select().from(paymentSettings).limit(1);
      let settings;
      if (existing) {
        [settings] = await db.update(paymentSettings).set(req.body).where(eq(paymentSettings.id, existing.id)).returning();
      } else {
        [settings] = await db.insert(paymentSettings).values(req.body).returning();
      }
      res.json(settings);
    } catch (error: any) {
      console.error("Error updating payment settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cash payment centers endpoints
  app.get("/api/cash-payment-centers", async (req, res) => {
    try {
      const centers = await db.select().from(cashPaymentCenters).where(eq(cashPaymentCenters.isActive, true));
      res.json(centers);
    } catch (error: any) {
      console.error("Error fetching cash centers:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cash-payment-centers", async (req, res) => {
    try {
      const [center] = await db.insert(cashPaymentCenters).values(req.body).returning();
      res.json(center);
    } catch (error: any) {
      console.error("Error creating cash center:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/cash-payment-centers/:id", async (req, res) => {
    try {
      const [center] = await db.update(cashPaymentCenters)
        .set(req.body)
        .where(eq(cashPaymentCenters.id, parseInt(req.params.id)))
        .returning();
      res.json(center);
    } catch (error: any) {
      console.error("Error updating cash center:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/cash-payment-centers/:id", async (req, res) => {
    try {
      await db.delete(cashPaymentCenters).where(eq(cashPaymentCenters.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting cash center:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Subscription Requests APIs
  app.get("/api/subscription-requests", async (req, res) => {
    try {
      const requests = await db.select({
        id: subscriptionPayments.id,
        paymentNumber: subscriptionPayments.paymentNumber,
        clinicId: subscriptionPayments.clinicId,
        clinicName: clinics.name,
        userId: subscriptionPayments.userId,
        userName: users.name,
        userEmail: users.email,
        subscriptionType: subscriptionPayments.subscriptionType,
        amount: subscriptionPayments.amount,
        duration: subscriptionPayments.duration,
        paymentMethod: subscriptionPayments.paymentMethod,
        senderName: subscriptionPayments.senderName,
        zainCashPhoneNumber: subscriptionPayments.zainCashPhoneNumber,
        zainCashTransactionRef: subscriptionPayments.zainCashTransactionRef,
        exchangeOfficeName: subscriptionPayments.exchangeOfficeName,
        depositReceiptNumber: subscriptionPayments.depositReceiptNumber,
        status: subscriptionPayments.status,
        attachments: subscriptionPayments.attachments,
        createdAt: subscriptionPayments.createdAt,
      })
      .from(subscriptionPayments)
      .leftJoin(clinics, eq(subscriptionPayments.clinicId, clinics.id))
      .leftJoin(users, eq(subscriptionPayments.userId, users.id))
      .orderBy(desc(subscriptionPayments.createdAt));
      
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching subscription requests:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/subscription-requests/:id/approve", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      
      // Get the subscription request
      const [request] = await db.select()
        .from(subscriptionPayments)
        .where(eq(subscriptionPayments.id, requestId));
      
      if (!request) {
        return res.status(404).json({ error: "Subscription request not found" });
      }

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + request.duration);

      // Update subscription status
      const [updated] = await db.update(subscriptionPayments)
        .set({
          status: "activated",
          verificationStatus: "verified",
          verifiedAt: new Date(),
          activatedAt: new Date(),
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionPayments.id, requestId))
        .returning();

      // Update clinic subscription dates
      await db.update(clinics)
        .set({
          subscriptionStart: new Date(),
          subscriptionEnd: expiresAt,
          subscriptionTier: request.subscriptionType,
          updatedAt: new Date(),
        })
        .where(eq(clinics.id, request.clinicId));

      // Prepare notification data for client
      const notificationData = {
        type: "subscription_approved",
        userId: request.userId,
        title: "تمت الموافقة على طلب الاشتراك",
        message: `تمت الموافقة على طلب الاشتراك رقم ${request.paymentNumber}. تم تفعيل باقة ${request.subscriptionType} لمدة ${request.duration} شهر.`,
        actionUrl: "/doctor/subscription",
        category: "subscription"
      };
      
      res.json({ 
        subscription: updated, 
        notification: notificationData 
      });
    } catch (error: any) {
      console.error("Error approving subscription:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/subscription-requests/:id/reject", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { reason } = req.body;

      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "سبب الرفض مطلوب" });
      }

      // Get the subscription request
      const [request] = await db.select()
        .from(subscriptionPayments)
        .where(eq(subscriptionPayments.id, requestId));

      if (!request) {
        return res.status(404).json({ error: "Subscription request not found" });
      }

      // Update subscription status
      const [updated] = await db.update(subscriptionPayments)
        .set({
          status: "rejected",
          verificationStatus: "rejected",
          rejectionReason: reason,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptionPayments.id, requestId))
        .returning();

      // Prepare rejection notification data for client
      const notificationData = {
        type: "subscription_rejected",
        userId: request.userId,
        title: "تم رفض طلب الاشتراك",
        message: `تم رفض طلب الاشتراك رقم ${request.paymentNumber}. السبب: ${reason}`,
        actionUrl: "/doctor/subscription",
        category: "subscription"
      };
      
      res.json({ 
        subscription: updated, 
        notification: notificationData 
      });
    } catch (error: any) {
      console.error("Error rejecting subscription:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
