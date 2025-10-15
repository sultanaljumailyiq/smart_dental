import express from 'express';
import { db } from '../storage';
import { 
  usageTracking, 
  subscriptionPlans, 
  clinicPayments, 
  users, 
  clinics 
} from '../../shared/schema';
import { eq, and, gte, sql, count } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Fallback stats data
const FALLBACK_STATS = {
  totalSubscribers: 0,
  activeSubscriptions: 0,
  revenue: {
    total: 0,
    thisMonth: 0,
    currency: 'IQD',
  },
  subscriptionsByPlan: {
    free: 0,
    basic: 0,
    premium: 0,
  },
  usageMetrics: {
    totalPatients: 0,
    avgPatientsPerUser: 0,
    totalAIUsage: 0,
    avgAIUsagePerDay: 0,
    totalClinics: 0,
  },
  topUsers: [],
};

// GET /api/subscription-stats - Get subscription statistics (Admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Total active subscriptions
    const activeSubscriptions = await db
      .select({ count: sql<number>`count(*)` })
      .from(clinicPayments)
      .where(eq(clinicPayments.status, 'active'));

    const activeCount = activeSubscriptions[0]?.count || 0;

    // Subscriptions by plan
    const subscriptionsByPlan = await db
      .select({
        planId: clinicPayments.planId,
        count: sql<number>`count(*)`,
      })
      .from(clinicPayments)
      .where(eq(clinicPayments.status, 'active'))
      .groupBy(clinicPayments.planId);

    const planCounts = {
      free: 0,
      basic: 0,
      premium: 0,
    };

    subscriptionsByPlan.forEach((plan) => {
      if (plan.planId === 1) planCounts.free = Number(plan.count);
      else if (plan.planId === 2) planCounts.basic = Number(plan.count);
      else if (plan.planId === 3) planCounts.premium = Number(plan.count);
    });

    // Total revenue
    const revenue = await db
      .select({
        total: sql<number>`sum(${clinicPayments.amount})`,
      })
      .from(clinicPayments)
      .where(eq(clinicPayments.status, 'active'));

    const totalRevenue = Number(revenue[0]?.total || 0);

    // Usage metrics
    const usageMetrics = await db
      .select({
        totalPatients: sql<number>`sum(${usageTracking.patientsCount})`,
        totalAIUsage: sql<number>`sum(${usageTracking.aiUsageTotal})`,
        totalClinics: sql<number>`sum(${usageTracking.clinicsCount})`,
        userCount: sql<number>`count(distinct ${usageTracking.userId})`,
      })
      .from(usageTracking);

    const metrics = usageMetrics[0] || {
      totalPatients: 0,
      totalAIUsage: 0,
      totalClinics: 0,
      userCount: 0,
    };

    const avgPatientsPerUser = metrics.userCount > 0 
      ? Math.round(Number(metrics.totalPatients) / Number(metrics.userCount))
      : 0;

    // Top users by patient count
    const topUsers = await db
      .select({
        userId: usageTracking.userId,
        userName: users.name,
        userEmail: users.email,
        patientsCount: usageTracking.patientsCount,
        aiUsageTotal: usageTracking.aiUsageTotal,
        clinicsCount: usageTracking.clinicsCount,
      })
      .from(usageTracking)
      .innerJoin(users, eq(usageTracking.userId, users.id))
      .orderBy(sql`${usageTracking.patientsCount} DESC`)
      .limit(10);

    const stats = {
      totalSubscribers: Number(activeCount),
      activeSubscriptions: Number(activeCount),
      revenue: {
        total: totalRevenue,
        thisMonth: totalRevenue, // You can calculate this month's revenue separately
        currency: 'IQD',
      },
      subscriptionsByPlan: planCounts,
      usageMetrics: {
        totalPatients: Number(metrics.totalPatients || 0),
        avgPatientsPerUser,
        totalAIUsage: Number(metrics.totalAIUsage || 0),
        avgAIUsagePerDay: Number(metrics.totalAIUsage || 0) / Math.max(Number(metrics.userCount || 1), 1),
        totalClinics: Number(metrics.totalClinics || 0),
      },
      topUsers: topUsers.map((user) => ({
        userId: user.userId,
        name: user.userName,
        email: user.userEmail,
        patientsCount: user.patientsCount,
        aiUsageTotal: user.aiUsageTotal,
        clinicsCount: user.clinicsCount,
      })),
    };

    if (stats.totalSubscribers === 0) {
      return res.json(FALLBACK_STATS);
    }

    res.json(stats);
  } catch (error) {
    console.log('Database error, using fallback stats:', error);
    res.json(FALLBACK_STATS);
  }
});

// GET /api/subscription-stats/user/:userId - Get specific user's usage stats (Authenticated)
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt((req as any).userId);

    // Verify access: user can only see their own stats (unless admin)
    if (userId !== currentUserId && (req as any).userRole !== 'platform_admin') {
      return res.status(403).json({ 
        error: 'غير مصرح',
        message: 'لا يمكنك الوصول إلى إحصائيات مستخدم آخر' 
      });
    }

    // Get today's date for tracking
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

    const usage = usageRecords[0];

    if (!usage) {
      return res.json({
        userId,
        patientsCount: 0,
        patientsAddedToday: 0,
        aiUsageToday: 0,
        aiUsageTotal: 0,
        clinicsCount: 0,
        limits: {
          maxPatients: 30,
          maxClinics: 1,
          aiUsagePerDay: 5,
        },
      });
    }

    // Get user's subscription to determine limits
    const userClinics = await db
      .select()
      .from(clinics)
      .where(eq(clinics.userId, userId))
      .limit(1);

    let limits = {
      maxPatients: 30,
      maxClinics: 1,
      aiUsagePerDay: 5,
    };

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
        .limit(1);

      if (subscriptions[0]) {
        const planId = subscriptions[0].planId;
        if (planId === 2) {
          limits = { maxPatients: -1, maxClinics: 1, aiUsagePerDay: -1 }; // Basic
        } else if (planId === 3) {
          limits = { maxPatients: -1, maxClinics: -1, aiUsagePerDay: -1 }; // Premium
        }
      }
    }

    res.json({
      userId,
      patientsCount: usage.patientsCount,
      patientsAddedToday: usage.patientsAddedToday,
      aiUsageToday: usage.aiUsageToday,
      aiUsageTotal: usage.aiUsageTotal,
      clinicsCount: usage.clinicsCount,
      limits,
      canAddPatients: limits.maxPatients === -1 || usage.patientsCount < limits.maxPatients,
      canAddClinics: limits.maxClinics === -1 || usage.clinicsCount < limits.maxClinics,
      canUseAI: limits.aiUsagePerDay === -1 || usage.aiUsageToday < limits.aiUsagePerDay,
    });
  } catch (error) {
    console.log('Database error getting user stats:', error);
    res.json({
      userId: parseInt(req.params.userId),
      patientsCount: 0,
      patientsAddedToday: 0,
      aiUsageToday: 0,
      aiUsageTotal: 0,
      clinicsCount: 0,
      limits: {
        maxPatients: 30,
        maxClinics: 1,
        aiUsagePerDay: 5,
      },
      canAddPatients: true,
      canAddClinics: false,
      canUseAI: true,
    });
  }
});

// GET /api/subscription-stats/daily - Get daily usage trends (Admin only)
router.get('/daily', requireAuth, requireAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${usageTracking.trackingDate})`,
        totalPatients: sql<number>`sum(${usageTracking.patientsAddedToday})`,
        totalAIUsage: sql<number>`sum(${usageTracking.aiUsageToday})`,
        activeUsers: sql<number>`count(distinct ${usageTracking.userId})`,
      })
      .from(usageTracking)
      .where(gte(usageTracking.trackingDate, startDate))
      .groupBy(sql`DATE(${usageTracking.trackingDate})`)
      .orderBy(sql`DATE(${usageTracking.trackingDate})`);

    if (dailyStats.length === 0) {
      return res.json([]);
    }

    res.json(dailyStats.map((stat) => ({
      date: stat.date,
      totalPatients: Number(stat.totalPatients || 0),
      totalAIUsage: Number(stat.totalAIUsage || 0),
      activeUsers: Number(stat.activeUsers || 0),
    })));
  } catch (error) {
    console.log('Database error getting daily stats:', error);
    res.json([]);
  }
});

export default router;
