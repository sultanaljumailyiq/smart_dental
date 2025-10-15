import { Request, Response, NextFunction } from 'express';
import { db } from '../storage';
import { usageTracking, subscriptionPlans, clinicPayments, clinics } from '../../shared/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

// Fallback subscription plans data
const FALLBACK_PLANS = {
  free: {
    id: 1,
    name: 'Free',
    maxPatients: 30,
    maxClinics: 1,
    aiUsagePerDay: 5,
  },
  basic: {
    id: 2,
    name: 'Basic',
    maxPatients: -1, // unlimited
    maxClinics: 1,
    aiUsagePerDay: -1, // unlimited
  },
  premium: {
    id: 3,
    name: 'Premium',
    maxPatients: -1, // unlimited
    maxClinics: -1, // unlimited
    aiUsagePerDay: -1, // unlimited
  },
};

interface SubscriptionCheckRequest extends Request {
  user?: {
    id: number;
    subscriptionTier?: string;
  };
}

export const checkSubscriptionLimits = async (
  req: SubscriptionCheckRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userId from requireAuth middleware (it sets req.userId as string)
    const userIdStr = (req as any).userId;
    
    if (!userIdStr) {
      return res.status(401).json({ 
        error: 'غير مصرح',
        message: 'يجب تسجيل الدخول أولاً' 
      });
    }

    const userId = parseInt(userIdStr);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'طلب غير صالح',
        message: 'معرف المستخدم غير صحيح' 
      });
    }

    // Get user's current subscription through clinic
    let userSubscription;
    try {
      // First, get user's clinics (userId is the owner)
      const userClinics = await db
        .select()
        .from(clinics)
        .where(eq(clinics.userId, userId))
        .limit(1);

      if (userClinics.length > 0) {
        const subscriptions = await db
          .select()
          .from(clinicPayments)
          .where(
            and(
              eq(clinicPayments.clinicId, userClinics[0].id),
              eq(clinicPayments.status, 'active')
            )
          )
          .orderBy(sql`${clinicPayments.createdAt} DESC`)
          .limit(1);
        
        userSubscription = subscriptions[0];
      }
    } catch (error) {
      console.log('Database error, using fallback:', error);
    }

    // Determine subscription tier (fallback to 'free' if no active subscription)
    const tier = userSubscription?.planId 
      ? (userSubscription.planId === 1 ? 'free' : userSubscription.planId === 2 ? 'basic' : 'premium')
      : 'free';

    const plan = FALLBACK_PLANS[tier as keyof typeof FALLBACK_PLANS];

    // Get today's date for tracking
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create usage tracking record
    let usage;
    try {
      const usageRecords = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, userId),
            gte(usageTracking.trackingDate, today)
          )
        )
        .limit(1);

      usage = usageRecords[0];

      if (!usage) {
        // Create new tracking record for today
        const [newUsage] = await db
          .insert(usageTracking)
          .values({
            userId,
            trackingDate: new Date(),
            patientsCount: 0,
            patientsAddedToday: 0,
            aiUsageToday: 0,
            aiUsageTotal: 0,
            clinicsCount: 0,
          })
          .returning();
        
        usage = newUsage;
      }
    } catch (error) {
      console.log('Database error getting usage, using defaults:', error);
      usage = {
        patientsCount: 0,
        patientsAddedToday: 0,
        aiUsageToday: 0,
        clinicsCount: 0,
      };
    }

    // Attach subscription info to request
    (req as any).subscription = {
      tier,
      plan,
      usage,
      canAddPatients: plan.maxPatients === -1 || (usage.patientsCount || 0) < plan.maxPatients,
      canAddClinics: plan.maxClinics === -1 || (usage.clinicsCount || 0) < plan.maxClinics,
      canUseAI: plan.aiUsagePerDay === -1 || (usage.aiUsageToday || 0) < plan.aiUsagePerDay,
    };

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    // Allow request to proceed with free tier limits in case of error
    (req as any).subscription = {
      tier: 'free',
      plan: FALLBACK_PLANS.free,
      usage: {
        patientsCount: 0,
        aiUsageToday: 0,
        clinicsCount: 0,
      },
      canAddPatients: true,
      canAddClinics: false,
      canUseAI: true,
    };
    next();
  }
};

// Middleware to block actions based on limits
export const enforcePatientLimit = (
  req: SubscriptionCheckRequest,
  res: Response,
  next: NextFunction
) => {
  const subscription = (req as any).subscription;
  
  if (!subscription?.canAddPatients) {
    return res.status(403).json({
      error: 'تجاوزت الحد المسموح',
      message: `لقد تجاوزت الحد المسموح به (${subscription.plan.maxPatients} مريض). الرجاء ترقية الباقة الحالية.`,
      limit: subscription.plan.maxPatients,
      current: subscription.usage.patientsCount,
      upgradeRequired: true,
    });
  }
  
  next();
};

export const enforceClinicLimit = (
  req: SubscriptionCheckRequest,
  res: Response,
  next: NextFunction
) => {
  const subscription = (req as any).subscription;
  
  if (!subscription?.canAddClinics) {
    return res.status(403).json({
      error: 'تجاوزت الحد المسموح',
      message: 'الرجاء ترقية الباقة لإضافة المزيد من العيادات.',
      limit: subscription.plan.maxClinics,
      current: subscription.usage.clinicsCount,
      upgradeRequired: true,
    });
  }
  
  next();
};

export const enforceAILimit = (
  req: SubscriptionCheckRequest,
  res: Response,
  next: NextFunction
) => {
  const subscription = (req as any).subscription;
  
  if (!subscription?.canUseAI) {
    return res.status(403).json({
      error: 'تجاوزت الحد المسموح',
      message: `لقد استخدمت الحد المسموح من الذكاء الاصطناعي اليوم (${subscription.plan.aiUsagePerDay} محاولات). الرجاء ترقية الباقة أو انتظر حتى الغد.`,
      limit: subscription.plan.aiUsagePerDay,
      current: subscription.usage.aiUsageToday,
      upgradeRequired: true,
    });
  }
  
  next();
};

// Helper function to increment usage
export const incrementUsage = async (userId: number, type: 'patient' | 'ai' | 'clinic') => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageRecords = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, userId),
          gte(usageTracking.trackingDate, today)
        )
      )
      .limit(1);

    if (usageRecords[0]) {
      // Update existing record
      const updates: any = {};
      
      if (type === 'patient') {
        updates.patientsCount = sql`${usageTracking.patientsCount} + 1`;
        updates.patientsAddedToday = sql`${usageTracking.patientsAddedToday} + 1`;
      } else if (type === 'ai') {
        updates.aiUsageToday = sql`${usageTracking.aiUsageToday} + 1`;
        updates.aiUsageTotal = sql`${usageTracking.aiUsageTotal} + 1`;
      } else if (type === 'clinic') {
        updates.clinicsCount = sql`${usageTracking.clinicsCount} + 1`;
      }

      await db
        .update(usageTracking)
        .set(updates)
        .where(eq(usageTracking.id, usageRecords[0].id));
    }
  } catch (error) {
    console.log('Error incrementing usage (fallback mode):', error);
  }
};
