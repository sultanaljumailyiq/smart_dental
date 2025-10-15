import express, { type Request, type Response } from "express";
import { db } from "../storage";
import { 
  communityPosts, 
  communityComments, 
  communityPostLikes, 
  communityPostSaves,
  communityCommentLikes,
  users 
} from "../../shared/schema";
import { eq, desc, and, sql, or } from "drizzle-orm";

const router = express.Router();

// Get all posts with filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, userId } = req.query;
    
    // Build conditions
    const conditions: any[] = [eq(communityPosts.isApproved, true)];
    
    // Filter by post type
    if (type === 'elite') {
      conditions.push(eq(communityPosts.postType, 'elite'));
    } else if (type === 'trusted') {
      conditions.push(eq(communityPosts.postType, 'trusted'));
    }

    const posts = await db
      .select({
        id: communityPosts.id,
        authorId: communityPosts.authorId,
        content: communityPosts.content,
        image: communityPosts.image,
        images: communityPosts.images,
        postType: communityPosts.postType,
        visibility: communityPosts.visibility,
        isPinned: communityPosts.isPinned,
        isApproved: communityPosts.isApproved,
        likeCount: communityPosts.likeCount,
        commentCount: communityPosts.commentCount,
        shareCount: communityPosts.shareCount,
        viewCount: communityPosts.viewCount,
        createdAt: communityPosts.createdAt,
        updatedAt: communityPosts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(communityPosts.isPinned), desc(communityPosts.createdAt));

    // If userId provided, check if user liked/saved each post
    if (userId) {
      const userIdNum = parseInt(userId as string);
      const postsWithUserData = await Promise.all(posts.map(async (post) => {
        const [liked] = await db
          .select()
          .from(communityPostLikes)
          .where(
            and(
              eq(communityPostLikes.postId, post.id),
              eq(communityPostLikes.userId, userIdNum)
            )
          )
          .limit(1);

        const [saved] = await db
          .select()
          .from(communityPostSaves)
          .where(
            and(
              eq(communityPostSaves.postId, post.id),
              eq(communityPostSaves.userId, userIdNum)
            )
          )
          .limit(1);

        return {
          ...post,
          isLiked: !!liked,
          isSaved: !!saved,
        };
      }));

      res.json(postsWithUserData);
    } else {
      res.json(posts);
    }
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get single post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { userId } = req.query;

    const [post] = await db
      .select({
        id: communityPosts.id,
        authorId: communityPosts.authorId,
        content: communityPosts.content,
        image: communityPosts.image,
        images: communityPosts.images,
        postType: communityPosts.postType,
        visibility: communityPosts.visibility,
        isPinned: communityPosts.isPinned,
        isApproved: communityPosts.isApproved,
        likeCount: communityPosts.likeCount,
        commentCount: communityPosts.commentCount,
        shareCount: communityPosts.shareCount,
        viewCount: communityPosts.viewCount,
        createdAt: communityPosts.createdAt,
        updatedAt: communityPosts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(eq(communityPosts.id, postId));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment view count
    await db
      .update(communityPosts)
      .set({ 
        viewCount: sql`${communityPosts.viewCount} + 1` 
      })
      .where(eq(communityPosts.id, postId));

    // Check if user liked/saved
    let isLiked = false;
    let isSaved = false;

    if (userId) {
      const userIdNum = parseInt(userId as string);

      const [liked] = await db
        .select()
        .from(communityPostLikes)
        .where(
          and(
            eq(communityPostLikes.postId, postId),
            eq(communityPostLikes.userId, userIdNum)
          )
        )
        .limit(1);

      const [saved] = await db
        .select()
        .from(communityPostSaves)
        .where(
          and(
            eq(communityPostSaves.postId, postId),
            eq(communityPostSaves.userId, userIdNum)
          )
        )
        .limit(1);

      isLiked = !!liked;
      isSaved = !!saved;
    }

    res.json({
      ...post,
      viewCount: post.viewCount + 1,
      isLiked,
      isSaved,
    });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Create new post
router.post("/", async (req: Request, res: Response) => {
  try {
    const { authorId, content, image, images, postType, visibility } = req.body;

    const [newPost] = await db
      .insert(communityPosts)
      .values({
        authorId,
        content,
        image,
        images: images || [],
        postType: postType || 'general',
        visibility: visibility || 'public',
        isApproved: true, // Auto-approve for now
      })
      .returning();

    res.status(201).json(newPost);
  } catch (error: any) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Update post
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { content, image, images, postType, visibility } = req.body;

    const [updatedPost] = await db
      .update(communityPosts)
      .set({
        content,
        image,
        images,
        postType,
        visibility,
        updatedAt: new Date(),
      })
      .where(eq(communityPosts.id, postId))
      .returning();

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error: any) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    // Delete related data first
    await db.delete(communityComments).where(eq(communityComments.postId, postId));
    await db.delete(communityPostLikes).where(eq(communityPostLikes.postId, postId));
    await db.delete(communityPostSaves).where(eq(communityPostSaves.postId, postId));

    const [deletedPost] = await db
      .delete(communityPosts)
      .where(eq(communityPosts.id, postId))
      .returning();

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Like/Unlike post
router.post("/:id/like", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { userId } = req.body;

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(communityPostLikes)
      .where(
        and(
          eq(communityPostLikes.postId, postId),
          eq(communityPostLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike) {
      // Unlike
      await db
        .delete(communityPostLikes)
        .where(eq(communityPostLikes.id, existingLike.id));

      await db
        .update(communityPosts)
        .set({ 
          likeCount: sql`${communityPosts.likeCount} - 1` 
        })
        .where(eq(communityPosts.id, postId));

      res.json({ liked: false, message: "Post unliked" });
    } else {
      // Like
      await db
        .insert(communityPostLikes)
        .values({ postId, userId });

      await db
        .update(communityPosts)
        .set({ 
          likeCount: sql`${communityPosts.likeCount} + 1` 
        })
        .where(eq(communityPosts.id, postId));

      res.json({ liked: true, message: "Post liked" });
    }
  } catch (error: any) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// Save/Unsave post
router.post("/:id/save", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { userId } = req.body;

    // Check if already saved
    const [existingSave] = await db
      .select()
      .from(communityPostSaves)
      .where(
        and(
          eq(communityPostSaves.postId, postId),
          eq(communityPostSaves.userId, userId)
        )
      )
      .limit(1);

    if (existingSave) {
      // Unsave
      await db
        .delete(communityPostSaves)
        .where(eq(communityPostSaves.id, existingSave.id));

      res.json({ saved: false, message: "Post unsaved" });
    } else {
      // Save
      await db
        .insert(communityPostSaves)
        .values({ postId, userId });

      res.json({ saved: true, message: "Post saved" });
    }
  } catch (error: any) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Failed to save post" });
  }
});

// Share post (increment count)
router.post("/:id/share", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    await db
      .update(communityPosts)
      .set({ 
        shareCount: sql`${communityPosts.shareCount} + 1` 
      })
      .where(eq(communityPosts.id, postId));

    res.json({ message: "Share count incremented" });
  } catch (error: any) {
    console.error("Error sharing post:", error);
    res.status(500).json({ error: "Failed to share post" });
  }
});

// Get saved posts for user
router.get("/user/:userId/saved", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const savedPosts = await db
      .select({
        id: communityPosts.id,
        authorId: communityPosts.authorId,
        content: communityPosts.content,
        image: communityPosts.image,
        images: communityPosts.images,
        postType: communityPosts.postType,
        likeCount: communityPosts.likeCount,
        commentCount: communityPosts.commentCount,
        shareCount: communityPosts.shareCount,
        viewCount: communityPosts.viewCount,
        createdAt: communityPosts.createdAt,
        savedAt: communityPostSaves.createdAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityPostSaves)
      .innerJoin(communityPosts, eq(communityPostSaves.postId, communityPosts.id))
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(eq(communityPostSaves.userId, userId))
      .orderBy(desc(communityPostSaves.createdAt));

    res.json(savedPosts);
  } catch (error: any) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ error: "Failed to fetch saved posts" });
  }
});

export default router;
