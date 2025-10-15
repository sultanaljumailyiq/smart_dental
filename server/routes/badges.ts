import express from 'express';
import { db } from '../storage';
import { subscriptionBadges, userBadges, users, subscriptionPlans } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Fallback badges data
const FALLBACK_BADGES = [
  {
    id: 1,
    name: 'Free User',
    arabicName: 'مستخدم مجاني',
    description: 'Free subscription user',
    arabicDescription: 'مستخدم الباقة المجانية',
    icon: '🆓',
    color: '#6b7280',
    planId: 1,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Basic Subscriber',
    arabicName: 'مشترك أساسي',
    description: 'Basic plan subscriber',
    arabicDescription: 'مشترك في الباقة الأساسية',
    icon: '⭐',
    color: '#3b82f6',
    planId: 2,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'Premium Member',
    arabicName: 'عضو مميز',
    description: 'Premium plan member',
    arabicDescription: 'عضو في الباقة المميزة',
    icon: '👑',
    color: '#f59e0b',
    planId: 3,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    name: 'Early Adopter',
    arabicName: 'مستخدم مبكر',
    description: 'One of our first users',
    arabicDescription: 'من أوائل المستخدمين',
    icon: '🚀',
    color: '#8b5cf6',
    planId: null,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 5,
    name: 'Loyal Member',
    arabicName: 'عضو مخلص',
    description: 'Active for over a year',
    arabicDescription: 'نشط لأكثر من سنة',
    icon: '💎',
    color: '#10b981',
    planId: null,
    isActive: true,
    displayOrder: 5,
  },
];

// GET /api/badges - Get all badges (Public)
router.get('/', async (req, res) => {
  try {
    const badges = await db
      .select()
      .from(subscriptionBadges)
      .where(eq(subscriptionBadges.isActive, true))
      .orderBy(subscriptionBadges.displayOrder);

    if (badges.length === 0) {
      return res.json(FALLBACK_BADGES);
    }

    res.json(badges);
  } catch (error) {
    console.log('Database error, using fallback badges:', error);
    res.json(FALLBACK_BADGES);
  }
});

// GET /api/badges/user/:userId - Get user's badges (Authenticated)
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt((req as any).userId);

    // Verify access: user can only see their own badges (unless admin)
    if (userId !== currentUserId && (req as any).userRole !== 'platform_admin') {
      return res.status(403).json({ 
        error: 'غير مصرح',
        message: 'لا يمكنك الوصول إلى شارات مستخدم آخر' 
      });
    }

    const userBadgesData = await db
      .select({
        id: userBadges.id,
        badgeId: userBadges.badgeId,
        earnedAt: userBadges.earnedAt,
        isVisible: userBadges.isVisible,
        badge: {
          id: subscriptionBadges.id,
          name: subscriptionBadges.name,
          arabicName: subscriptionBadges.arabicName,
          description: subscriptionBadges.description,
          arabicDescription: subscriptionBadges.arabicDescription,
          icon: subscriptionBadges.icon,
          color: subscriptionBadges.color,
        },
      })
      .from(userBadges)
      .innerJoin(subscriptionBadges, eq(userBadges.badgeId, subscriptionBadges.id))
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.isVisible, true)
        )
      );

    if (userBadgesData.length === 0) {
      return res.json([FALLBACK_BADGES[0]]);
    }

    res.json(userBadgesData);
  } catch (error) {
    console.log('Database error, using fallback user badges:', error);
    res.json([FALLBACK_BADGES[0]]);
  }
});

// POST /api/badges - Create a new badge (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      arabicName,
      description,
      arabicDescription,
      icon,
      color,
      planId,
      displayOrder,
    } = req.body;

    const [newBadge] = await db
      .insert(subscriptionBadges)
      .values({
        name,
        arabicName,
        description,
        arabicDescription,
        icon,
        color,
        planId: planId || null,
        isActive: true,
        displayOrder: displayOrder || 0,
      })
      .returning();

    res.json(newBadge);
  } catch (error) {
    console.log('Database error creating badge:', error);
    res.status(500).json({ 
      error: 'فشل في إنشاء الشارة',
      message: 'حدث خطأ أثناء إنشاء الشارة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// POST /api/badges/assign - Assign badge to user (Admin only)
router.post('/assign', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    // Check if user already has this badge
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'الشارة موجودة',
        message: 'المستخدم لديه هذه الشارة بالفعل' 
      });
    }

    const [newUserBadge] = await db
      .insert(userBadges)
      .values({
        userId,
        badgeId,
        isVisible: true,
      })
      .returning();

    res.json(newUserBadge);
  } catch (error) {
    console.log('Database error assigning badge:', error);
    res.status(500).json({ 
      error: 'فشل في إسناد الشارة',
      message: 'حدث خطأ أثناء إسناد الشارة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// DELETE /api/badges/:id - Delete a badge (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const badgeId = parseInt(req.params.id);

    await db
      .update(subscriptionBadges)
      .set({ isActive: false })
      .where(eq(subscriptionBadges.id, badgeId));

    res.json({ success: true, message: 'تم حذف الشارة بنجاح' });
  } catch (error) {
    console.log('Database error deleting badge:', error);
    res.status(500).json({ 
      error: 'فشل في حذف الشارة',
      message: 'حدث خطأ أثناء حذف الشارة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

// PUT /api/badges/:id - Update badge (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const badgeId = parseInt(req.params.id);
    const {
      name,
      arabicName,
      description,
      arabicDescription,
      icon,
      color,
      planId,
      displayOrder,
      isActive,
    } = req.body;

    const [updatedBadge] = await db
      .update(subscriptionBadges)
      .set({
        name,
        arabicName,
        description,
        arabicDescription,
        icon,
        color,
        planId,
        displayOrder,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(subscriptionBadges.id, badgeId))
      .returning();

    res.json(updatedBadge);
  } catch (error) {
    console.log('Database error updating badge:', error);
    res.status(500).json({ 
      error: 'فشل في تحديث الشارة',
      message: 'حدث خطأ أثناء تحديث الشارة. الرجاء المحاولة مرة أخرى.' 
    });
  }
});

export default router;
