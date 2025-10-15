import express from 'express';
import { db } from '../storage';
import { userRewards, subscriptionPlans, clinicPayments } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Fallback rewards data
const FALLBACK_REWARDS = [
  {
    id: 1,
    userId: 1,
    rewardType: 'bonus_months',
    rewardValue: 2,
    rewardDescription: '2 months bonus subscription',
    arabicDescription: 'شهرين اشتراك مجاني إضافي',
    planId: 2,
    isActive: true,
    isUsed: false,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  },
];

// GET /api/rewards/user/:userId - Get user's rewards (Authenticated)
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt((req as any).userId);

    // Verify access: user can only see their own rewards (unless admin)
    if (userId !== currentUserId && (req as any).userRole !== 'platform_admin') {
      return res.status(403).json({ 
        error: 'غير مصرح',
        message: 'لا يمكنك الوصول إلى مكافآت مستخدم آخر' 
      });
    }

    const rewards = await db
      .select({
        id: userRewards.id,
        rewardType: userRewards.rewardType,
        rewardValue: userRewards.rewardValue,
        rewardDescription: userRewards.rewardDescription,
        arabicDescription: userRewards.arabicDescription,
        planId: userRewards.planId,
        isActive: userRewards.isActive,
        isUsed: userRewards.isUsed,
        usedAt: userRewards.usedAt,
        expiresAt: userRewards.expiresAt,
        createdAt: userRewards.createdAt,
        plan: {
          id: subscriptionPlans.id,
          name: subscriptionPlans.name,
          arabicName: subscriptionPlans.arabicName,
        },
      })
      .from(userRewards)
      .leftJoin(subscriptionPlans, eq(userRewards.planId, subscriptionPlans.id))
      .where(
        and(
          eq(userRewards.userId, userId),
          eq(userRewards.isActive, true)
        )
      );

    if (rewards.length === 0) {
      return res.json([]);
    }

    res.json(rewards);
  } catch (error) {
    console.log('Database error, using fallback rewards:', error);
    res.json([]);
  }
});

// POST /api/rewards - Create a new reward (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      userId,
      rewardType,
      rewardValue,
      rewardDescription,
      arabicDescription,
      planId,
      expiresAt,
    } = req.body;

    const [newReward] = await db
      .insert(userRewards)
      .values({
        userId,
        rewardType,
        rewardValue,
        rewardDescription,
        arabicDescription,
        planId: planId || null,
        isActive: true,
        isUsed: false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    res.json(newReward);
  } catch (error) {
    console.log('Database error creating reward:', error);
    res.status(500).json({ 
      error: 'فشل في إنشاء المكافأة',
      message: 'حدث خطأ أثناء إنشاء المكافأة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// POST /api/rewards/:id/use - Use/redeem a reward (Authenticated)
router.post('/:id/use', requireAuth, async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    const currentUserId = parseInt((req as any).userId);

    // Get the reward
    const rewards = await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.id, rewardId))
      .limit(1);

    if (rewards.length === 0) {
      return res.status(404).json({ 
        error: 'المكافأة غير موجودة',
        message: 'لم يتم العثور على هذه المكافأة' 
      });
    }

    const reward = rewards[0];

    // Verify ownership: user can only redeem their own rewards (unless admin)
    if (reward.userId !== currentUserId && (req as any).userRole !== 'platform_admin') {
      return res.status(403).json({ 
        error: 'غير مصرح',
        message: 'لا يمكنك استخدام مكافأة مستخدم آخر' 
      });
    }

    if (reward.isUsed) {
      return res.status(400).json({ 
        error: 'المكافأة مستخدمة',
        message: 'تم استخدام هذه المكافأة مسبقاً' 
      });
    }

    if (!reward.isActive) {
      return res.status(400).json({ 
        error: 'المكافأة غير نشطة',
        message: 'هذه المكافأة لم تعد نشطة' 
      });
    }

    // Check expiration
    if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
      return res.status(400).json({ 
        error: 'المكافأة منتهية',
        message: 'انتهت صلاحية هذه المكافأة' 
      });
    }

    // Mark as used
    const [updatedReward] = await db
      .update(userRewards)
      .set({
        isUsed: true,
        usedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userRewards.id, rewardId))
      .returning();

    // If it's a bonus_months reward, extend the subscription
    if (reward.rewardType === 'bonus_months') {
      // This would need integration with your subscription system
      // For now, we'll just return success
      return res.json({
        success: true,
        message: `تم إضافة ${reward.rewardValue} شهر إلى اشتراكك!`,
        reward: updatedReward,
      });
    }

    res.json({
      success: true,
      message: 'تم استخدام المكافأة بنجاح',
      reward: updatedReward,
    });
  } catch (error) {
    console.log('Database error using reward:', error);
    res.status(500).json({ 
      error: 'فشل في استخدام المكافأة',
      message: 'حدث خطأ أثناء استخدام المكافأة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// POST /api/rewards/auto-assign - Auto-assign rewards based on criteria (Admin task)
router.post('/auto-assign', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { criteria, rewardType, rewardValue, description, arabicDescription, planId } = req.body;

    // Example: Assign "Early Adopter" reward to users who signed up before a certain date
    // This is a simple example - you can extend this based on your needs

    const rewards = [];
    
    // For demo purposes, we'll create a sample reward
    const [newReward] = await db
      .insert(userRewards)
      .values({
        userId: 1, // Replace with actual logic
        rewardType,
        rewardValue,
        rewardDescription: description,
        arabicDescription,
        planId: planId || null,
        isActive: true,
        isUsed: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      })
      .returning();

    rewards.push(newReward);

    res.json({
      success: true,
      message: `تم إنشاء ${rewards.length} مكافأة`,
      rewards,
    });
  } catch (error) {
    console.log('Database error auto-assigning rewards:', error);
    res.status(500).json({ 
      error: 'فشل في إنشاء المكافآت',
      message: 'حدث خطأ أثناء إنشاء المكافآت التلقائية. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// DELETE /api/rewards/:id - Delete a reward (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);

    await db
      .update(userRewards)
      .set({ 
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(userRewards.id, rewardId));

    res.json({ success: true, message: 'تم حذف المكافأة بنجاح' });
  } catch (error) {
    console.log('Database error deleting reward:', error);
    res.status(500).json({ 
      error: 'فشل في حذف المكافأة',
      message: 'حدث خطأ أثناء حذف المكافأة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// GET /api/rewards/stats - Get rewards statistics (Admin)
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await db
      .select({
        rewardType: userRewards.rewardType,
        total: sql<number>`count(*)`,
        used: sql<number>`count(*) filter (where ${userRewards.isUsed} = true)`,
        active: sql<number>`count(*) filter (where ${userRewards.isActive} = true)`,
      })
      .from(userRewards)
      .groupBy(userRewards.rewardType);

    if (stats.length === 0) {
      return res.json({
        bonus_months: { total: 0, used: 0, active: 0 },
        discount: { total: 0, used: 0, active: 0 },
        upgrade: { total: 0, used: 0, active: 0 },
      });
    }

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.rewardType] = {
        total: Number(stat.total),
        used: Number(stat.used),
        active: Number(stat.active),
      };
      return acc;
    }, {} as Record<string, { total: number; used: number; active: number }>);

    res.json(formattedStats);
  } catch (error) {
    console.log('Database error getting reward stats:', error);
    res.json({
      bonus_months: { total: 0, used: 0, active: 0 },
      discount: { total: 0, used: 0, active: 0 },
      upgrade: { total: 0, used: 0, active: 0 },
    });
  }
});

export default router;
