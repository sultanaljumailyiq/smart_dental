export interface CommunityPost {
  id: number;
  authorId: number;
  content: string;
  image?: string | null;
  images?: string[];
  postType: 'general' | 'elite' | 'trusted';
  visibility: string;
  isPinned: boolean;
  isApproved: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: {
    id: number;
    name: string;
    arabicName?: string | null;
    avatar?: string | null;
    role: string;
    verified: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CommunityComment {
  id: number;
  postId: number;
  authorId: number;
  parentCommentId?: number | null;
  content: string;
  likeCount: number;
  isApproved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: {
    id: number;
    name: string;
    arabicName?: string | null;
    avatar?: string | null;
    role: string;
    verified: boolean;
  };
  isLiked?: boolean;
}

// Helper for retrying failed requests
async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryFetch(fetchFn, retries - 1, delay);
    }
    throw error;
  }
}

export const communityService = {
  // Fetch posts with filters
  async getPosts(type?: 'all' | 'elite' | 'trusted', userId?: number): Promise<CommunityPost[]> {
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type);
      if (userId) params.append('userId', userId.toString());

      const response = await retryFetch(() => 
        fetch(`/api/community/posts?${params.toString()}`)
      );

      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  // Get single post
  async getPost(postId: number, userId?: number): Promise<CommunityPost | null> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());

      const response = await retryFetch(() => 
        fetch(`/api/community/posts/${postId}?${params.toString()}`)
      );

      if (!response.ok) throw new Error('Failed to fetch post');
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  // Create new post
  async createPost(data: {
    authorId: number;
    content: string;
    image?: string;
    images?: string[];
    postType?: string;
    visibility?: string;
  }): Promise<CommunityPost | null> {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create post');
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Like/Unlike post
  async toggleLike(postId: number, userId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      return data.liked;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Save/Unsave post
  async toggleSave(postId: number, userId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/community/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to toggle save');
      const data = await response.json();
      return data.saved;
    } catch (error) {
      console.error('Error toggling save:', error);
      throw error;
    }
  },

  // Share post (increment count)
  async sharePost(postId: number): Promise<void> {
    try {
      const response = await fetch(`/api/community/posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to share post');
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  },

  // Get saved posts
  async getSavedPosts(userId: number): Promise<CommunityPost[]> {
    try {
      const response = await retryFetch(() => 
        fetch(`/api/community/posts/user/${userId}/saved`)
      );

      if (!response.ok) throw new Error('Failed to fetch saved posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return [];
    }
  },

  // Get comments for a post
  async getComments(postId: number, userId?: number): Promise<CommunityComment[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());

      const response = await retryFetch(() => 
        fetch(`/api/community/comments/post/${postId}?${params.toString()}`)
      );

      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Create comment
  async createComment(data: {
    postId: number;
    authorId: number;
    parentCommentId?: number;
    content: string;
  }): Promise<CommunityComment | null> {
    try {
      const response = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create comment');
      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Like/Unlike comment
  async toggleCommentLike(commentId: number, userId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/community/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to toggle comment like');
      const data = await response.json();
      return data.liked;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  },

  // Get replies for a comment
  async getReplies(commentId: number, userId?: number): Promise<CommunityComment[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());

      const response = await retryFetch(() => 
        fetch(`/api/community/comments/${commentId}/replies?${params.toString()}`)
      );

      if (!response.ok) throw new Error('Failed to fetch replies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  },

  // Delete post
  async deletePost(postId: number): Promise<void> {
    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Delete comment
  async deleteComment(commentId: number): Promise<void> {
    try {
      const response = await fetch(`/api/community/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};
