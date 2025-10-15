import express, { type Request, type Response } from "express";
import { db } from "../storage";
import { 
  communityComments, 
  communityCommentLikes,
  communityPosts,
  users 
} from "../../shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const router = express.Router();

// Get comments for a post
router.get("/post/:postId", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { userId } = req.query;

    const comments = await db
      .select({
        id: communityComments.id,
        postId: communityComments.postId,
        authorId: communityComments.authorId,
        parentCommentId: communityComments.parentCommentId,
        content: communityComments.content,
        likeCount: communityComments.likeCount,
        isApproved: communityComments.isApproved,
        createdAt: communityComments.createdAt,
        updatedAt: communityComments.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityComments)
      .leftJoin(users, eq(communityComments.authorId, users.id))
      .where(
        and(
          eq(communityComments.postId, postId),
          eq(communityComments.isApproved, true)
        )
      )
      .orderBy(desc(communityComments.createdAt));

    // If userId provided, check if user liked each comment
    if (userId) {
      const userIdNum = parseInt(userId as string);
      const commentsWithUserData = await Promise.all(comments.map(async (comment) => {
        const [liked] = await db
          .select()
          .from(communityCommentLikes)
          .where(
            and(
              eq(communityCommentLikes.commentId, comment.id),
              eq(communityCommentLikes.userId, userIdNum)
            )
          )
          .limit(1);

        return {
          ...comment,
          isLiked: !!liked,
        };
      }));

      res.json(commentsWithUserData);
    } else {
      res.json(comments);
    }
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Create new comment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { postId, authorId, parentCommentId, content } = req.body;

    const [newComment] = await db
      .insert(communityComments)
      .values({
        postId,
        authorId,
        parentCommentId: parentCommentId || null,
        content,
        isApproved: true,
      })
      .returning();

    // Increment comment count on post
    await db
      .update(communityPosts)
      .set({ 
        commentCount: sql`${communityPosts.commentCount} + 1` 
      })
      .where(eq(communityPosts.id, postId));

    // Get comment with author info
    const [commentWithAuthor] = await db
      .select({
        id: communityComments.id,
        postId: communityComments.postId,
        authorId: communityComments.authorId,
        parentCommentId: communityComments.parentCommentId,
        content: communityComments.content,
        likeCount: communityComments.likeCount,
        isApproved: communityComments.isApproved,
        createdAt: communityComments.createdAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityComments)
      .leftJoin(users, eq(communityComments.authorId, users.id))
      .where(eq(communityComments.id, newComment.id));

    res.status(201).json(commentWithAuthor);
  } catch (error: any) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Update comment
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;

    const [updatedComment] = await db
      .update(communityComments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(communityComments.id, commentId))
      .returning();

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(updatedComment);
  } catch (error: any) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete comment
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    // Get comment to find postId
    const [comment] = await db
      .select()
      .from(communityComments)
      .where(eq(communityComments.id, commentId))
      .limit(1);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Delete related likes
    await db
      .delete(communityCommentLikes)
      .where(eq(communityCommentLikes.commentId, commentId));

    // Delete comment
    await db
      .delete(communityComments)
      .where(eq(communityComments.id, commentId));

    // Decrement comment count on post
    await db
      .update(communityPosts)
      .set({ 
        commentCount: sql`GREATEST(${communityPosts.commentCount} - 1, 0)` 
      })
      .where(eq(communityPosts.id, comment.postId));

    res.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Like/Unlike comment
router.post("/:id/like", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { userId } = req.body;

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(communityCommentLikes)
      .where(
        and(
          eq(communityCommentLikes.commentId, commentId),
          eq(communityCommentLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike) {
      // Unlike
      await db
        .delete(communityCommentLikes)
        .where(eq(communityCommentLikes.id, existingLike.id));

      await db
        .update(communityComments)
        .set({ 
          likeCount: sql`${communityComments.likeCount} - 1` 
        })
        .where(eq(communityComments.id, commentId));

      res.json({ liked: false, message: "Comment unliked" });
    } else {
      // Like
      await db
        .insert(communityCommentLikes)
        .values({ commentId, userId });

      await db
        .update(communityComments)
        .set({ 
          likeCount: sql`${communityComments.likeCount} + 1` 
        })
        .where(eq(communityComments.id, commentId));

      res.json({ liked: true, message: "Comment liked" });
    }
  } catch (error: any) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Failed to like comment" });
  }
});

// Get replies for a comment
router.get("/:id/replies", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { userId } = req.query;

    const replies = await db
      .select({
        id: communityComments.id,
        postId: communityComments.postId,
        authorId: communityComments.authorId,
        parentCommentId: communityComments.parentCommentId,
        content: communityComments.content,
        likeCount: communityComments.likeCount,
        isApproved: communityComments.isApproved,
        createdAt: communityComments.createdAt,
        author: {
          id: users.id,
          name: users.name,
          arabicName: users.arabicName,
          avatar: users.avatar,
          role: users.role,
          verified: users.verified,
        }
      })
      .from(communityComments)
      .leftJoin(users, eq(communityComments.authorId, users.id))
      .where(
        and(
          eq(communityComments.parentCommentId, commentId),
          eq(communityComments.isApproved, true)
        )
      )
      .orderBy(communityComments.createdAt);

    // If userId provided, check if user liked each reply
    if (userId) {
      const userIdNum = parseInt(userId as string);
      const repliesWithUserData = await Promise.all(replies.map(async (reply) => {
        const [liked] = await db
          .select()
          .from(communityCommentLikes)
          .where(
            and(
              eq(communityCommentLikes.commentId, reply.id),
              eq(communityCommentLikes.userId, userIdNum)
            )
          )
          .limit(1);

        return {
          ...reply,
          isLiked: !!liked,
        };
      }));

      res.json(repliesWithUserData);
    } else {
      res.json(replies);
    }
  } catch (error: any) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

export default router;
