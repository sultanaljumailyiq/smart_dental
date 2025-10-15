import { Router } from "express";
import { db } from "../storage";
import { users, communityPosts, communityFollows, suppliers } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

router.get("/api/users/:userId/profile", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        arabicName: users.arabicName,
        avatar: users.avatar,
        role: users.role,
        verified: users.verified,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const followersCount = await db
      .select()
      .from(communityFollows)
      .where(eq(communityFollows.followedId, userId));

    const followingCount = await db
      .select()
      .from(communityFollows)
      .where(eq(communityFollows.followerId, userId));

    const posts = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.authorId, userId));

    const likesCount = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

    const profile = {
      ...user[0],
      bio: "طبيب أسنان محترف",
      location: "بغداد، العراق",
      specialty: "استشاري تقويم الأسنان",
      yearsOfExperience: 15,
      education: ["دكتوراه في طب الأسنان"],
      certifications: ["شهادة البورد العراقي"],
      stats: {
        posts: posts.length,
        followers: followersCount.length,
        following: followingCount.length,
        likes: likesCount,
      },
    };

    res.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.get("/api/users/:userId/posts", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const userPosts = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        image: communityPosts.image,
        images: communityPosts.images,
        likeCount: communityPosts.likeCount,
        commentCount: communityPosts.commentCount,
        shareCount: communityPosts.shareCount,
        viewCount: communityPosts.viewCount,
        createdAt: communityPosts.createdAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        },
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(eq(communityPosts.authorId, userId))
      .orderBy(desc(communityPosts.createdAt));

    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

router.post("/api/users/:userId/follow", async (req, res) => {
  try {
    const followedId = parseInt(req.params.userId);
    const { followerId } = req.body;

    const existing = await db
      .select()
      .from(communityFollows)
      .where(
        and(
          eq(communityFollows.followerId, followerId),
          eq(communityFollows.followedId, followedId)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(communityFollows)
        .where(
          and(
            eq(communityFollows.followerId, followerId),
            eq(communityFollows.followedId, followedId)
          )
        );

      return res.json({ following: false });
    }

    await db.insert(communityFollows).values({
      followerId,
      followedId,
    });

    res.json({ following: true });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ error: "Failed to toggle follow" });
  }
});

router.get("/api/users/:userId/following-status", async (req, res) => {
  try {
    const followedId = parseInt(req.params.userId);
    const followerId = parseInt(req.query.followerId as string);

    const existing = await db
      .select()
      .from(communityFollows)
      .where(
        and(
          eq(communityFollows.followerId, followerId),
          eq(communityFollows.followedId, followedId)
        )
      );

    res.json({ following: existing.length > 0 });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
});

// Get supplier ID by user ID
router.get("/api/users/:userId/supplier-id", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const supplier = await db
      .select({ id: suppliers.id })
      .from(suppliers)
      .where(eq(suppliers.userId, userId))
      .limit(1);

    if (!supplier || supplier.length === 0) {
      return res.status(404).json({ error: "Supplier not found for this user" });
    }

    res.json({ supplierId: supplier[0].id });
  } catch (error) {
    console.error("Error fetching supplier ID:", error);
    res.status(500).json({ error: "Failed to fetch supplier ID" });
  }
});

// Get user extended profile (bio, specialization, location)
// Note: Stored in memory cache for now (will be in database when available)
const extendedProfiles = new Map<number, any>();

router.get("/api/users/:userId/extended-profile", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const profile = extendedProfiles.get(userId);
    if (!profile) {
      return res.status(404).json({ error: "Extended profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching extended profile:", error);
    res.status(500).json({ error: "Failed to fetch extended profile" });
  }
});

// Save user extended profile
router.post("/api/users/:userId/extended-profile", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { bio, specialization, location } = req.body;

    const profileData = {
      bio,
      specialization,
      location,
      updatedAt: new Date().toISOString(),
    };

    extendedProfiles.set(userId, profileData);

    res.json({ success: true, data: profileData });
  } catch (error) {
    console.error("Error saving extended profile:", error);
    res.status(500).json({ error: "Failed to save extended profile" });
  }
});

export default router;
