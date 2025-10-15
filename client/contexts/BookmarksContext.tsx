import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface BookmarkItem {
  id: number;
  title: string;
  type: 'article' | 'discussion' | 'case_study' | 'video' | 'post';
  author?: {
    name: string;
    avatar: string;
    title: string;
    verified?: boolean;
    location?: string;
  } | string;
  image?: string;
  excerpt?: string;
  content?: string;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  tags?: string[];
  posted: string;
  addedDate: string;
  section: 'marketplace' | 'community' | 'jobs' | 'education';
  featured?: boolean;
}

interface BookmarksContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  getBookmarksBySection: (section: string) => BookmarkItem[];
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

interface BookmarksProviderProps {
  children: ReactNode;
}

export const BookmarksProvider: React.FC<BookmarksProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('medicalPlatformBookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('medicalPlatformBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: BookmarkItem) => {
    setBookmarks(prev => {
      // Check if already bookmarked
      if (prev.some(bookmark => bookmark.id === item.id && bookmark.section === item.section)) {
        return prev;
      }
      
      const newBookmark = {
        ...item,
        addedDate: new Date().toISOString().split('T')[0]
      };
      
      return [...prev, newBookmark];
    });
  };

  const removeBookmark = (id: number) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const isBookmarked = (id: number) => {
    return bookmarks.some(bookmark => bookmark.id === id);
  };

  const getBookmarksBySection = (section: string) => {
    return bookmarks.filter(bookmark => bookmark.section === section);
  };

  const value: BookmarksContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarksBySection,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};
