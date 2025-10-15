import React, { useState } from "react";
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  Bell,
  User,
  CheckCircle,
  MoreHorizontal,
  X,
  Send,
  Smile,
  Camera,
  Image as ImageIcon,
  Video,
  FileText,
  Award,
  GraduationCap,
  BookOpen,
  Users,
  ThumbsUp,
  Eye,
  Clock,
  Star,
  Target,
  PlayCircle,
  MapPin,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Filter,
  Grid3x3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type ContentType = "discussion" | "course" | "webinar" | "article" | "case-study" | "research";

interface Story {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  viewed: boolean;
}

interface Post {
  id: number;
  type: ContentType;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
    specialization?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  image?: string;
  tags: string[];
  category: string;
  difficulty?: "مبتدئ" | "متوسط" | "متقدم";
  duration?: string;
  price?: number;
  rating?: number;
  enrolled?: number;
}

const stories: Story[] = [
  {
    id: 1,
    author: { name: "قصتك", avatar: "" },
    thumbnail: "",
    viewed: false,
  },
  {
    id: 2,
    author: { name: "د. أحمد", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" },
    thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200",
    viewed: false,
  },
  {
    id: 3,
    author: { name: "د. فاطمة", avatar: "https://images.unsplash.com/photo-1594824720259-6c73a635c9b9?w=100" },
    thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200",
    viewed: true,
  },
  {
    id: 4,
    author: { name: "د. محمد", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100" },
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200",
    viewed: false,
  },
  {
    id: 5,
    author: { name: "د. عائشة", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100" },
    thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200",
    viewed: true,
  },
];

const posts: Post[] = [
  {
    id: 1,
    type: "course",
    title: "دورة زراعة الأسنان المتقدمة",
    excerpt: "دورة شاملة تغطي أحدث تقنيات زراعة الأسنان باستخدام التكنولوجيا ثلاثية الأبعاد",
    author: {
      name: "د. أحمد المهندس",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
      role: "استشاري زراعة الأسنان",
      verified: true,
      specialization: "جراحة الفم والفكين",
    },
    timestamp: "منذ يومين",
    likes: 245,
    comments: 67,
    shares: 23,
    views: 1240,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=400&fit=crop",
    tags: ["زراعة الأسنان", "جراحة", "تكنولوجيا"],
    category: "جراحة",
    difficulty: "متقدم",
    duration: "8 ساعات",
    price: 299,
    rating: 4.8,
    enrolled: 156,
  },
  {
    id: 2,
    type: "discussion",
    title: "مناقشة: أفضل الطرق لعلاج حساسية الأسنان",
    excerpt: "ما هي تجاربكم مع علاج حساسية الأسنان؟ وما أفضل المواد المستخدمة في العلاج؟",
    author: {
      name: "د. فاطمة الزهراء",
      avatar: "https://images.unsplash.com/photo-1594824720259-6c73a635c9b9?w=100",
      role: "طبيبة أسنان عامة",
      verified: true,
    },
    timestamp: "منذ 4 ساعات",
    likes: 89,
    comments: 34,
    shares: 12,
    tags: ["حساسية الأسنان", "علاج", "مناقشة"],
    category: "علاج الأسنان",
  },
  {
    id: 3,
    type: "webinar",
    title: "ندوة مباشرة: مستقبل طب الأسنان الرقمي",
    excerpt: "ندوة تفاعلية حول التطورات الحديثة في طب الأسنان الرقمي والذكاء الاصطناعي",
    author: {
      name: "د. محمد السعيد",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100",
      role: "أستاذ طب الأسنان",
      verified: true,
      specialization: "تكنولوجيا طبية",
    },
    timestamp: "غداً الساعة 8 مساءً",
    likes: 156,
    comments: 23,
    shares: 45,
    views: 890,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    tags: ["طب رقمي", "ذكاء اصطناعي", "ندوة مباشرة"],
    category: "تكنولوجيا",
    duration: "90 دقيقة",
  },
  {
    id: 4,
    type: "article",
    title: "بحث: تأثير التدخين على صحة اللثة",
    excerpt: "دراسة شاملة حول العلاقة بين التدخين وأمراض اللثة مع التوصيات العلاجية",
    author: {
      name: "د. عائشة النور",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100",
      role: "أخصائية أمراض اللثة",
      verified: true,
    },
    timestamp: "منذ أسبوع",
    likes: 267,
    comments: 89,
    shares: 78,
    views: 2340,
    tags: ["أمراض اللثة", "التدخين", "بحث علمي"],
    category: "أمراض اللثة",
  },
  {
    id: 5,
    type: "case-study",
    title: "حالة: إعادة تأهيل شامل للفم",
    excerpt: "عرض حالة مريض خضع لإعادة تأهيل شامل للفم باستخدام زراعة وتركيبات متقدمة",
    author: {
      name: "د. يوسف الطيب",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
      role: "استشاري تركيبات",
      verified: true,
    },
    timestamp: "منذ 3 أيام",
    likes: 134,
    comments: 45,
    shares: 19,
    views: 756,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop",
    tags: ["تركيبات", "إعادة تأهيل", "حالة سريرية"],
    category: "تركيبات الأسنان",
  },
];

const contentFilters = [
  { id: "all", label: "الكل", icon: Grid3x3 },
  { id: "discussion", label: "مناقشات", icon: MessageCircle },
  { id: "course", label: "دورات", icon: GraduationCap },
  { id: "webinar", label: "ندوات", icon: Video },
  { id: "article", label: "مقالات", icon: BookOpen },
  { id: "case-study", label: "حالات", icon: FileText },
];

const typeConfig: Record<ContentType, { label: string; icon: React.ComponentType<any>; color: string }> = {
  discussion: { label: "مناقشة", icon: MessageCircle, color: "bg-blue-500" },
  course: { label: "دورة", icon: GraduationCap, color: "bg-purple-500" },
  webinar: { label: "ندوة", icon: Video, color: "bg-green-500" },
  article: { label: "مقال", icon: BookOpen, color: "bg-orange-500" },
  "case-study": { label: "حالة سريرية", icon: FileText, color: "bg-teal-500" },
  research: { label: "بحث", icon: Award, color: "bg-indigo-500" },
};

export default function CommunityEducationHub() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const filteredPosts = posts.filter(post => selectedFilter === "all" || post.type === selectedFilter);

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleBookmark = (post: Post) => {
    if (bookmarks.some(b => b.id === post.id)) {
      removeBookmark(post.id);
    } else {
      addBookmark({
        id: post.id,
        title: post.title,
        type: "post",
        posted: new Date().toISOString().split('T')[0],
        addedDate: new Date().toISOString().split('T')[0],
        section: "community",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">مجتمع الأطباء</h1>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث..."
                className="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Avatar className="w-9 h-9 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors">
              <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <ScrollArea className="w-full" dir="rtl">
            <div className="flex gap-2 p-3 overflow-x-auto">
              {stories.map((story, index) => (
                <div key={story.id} className="flex-shrink-0">
                  {index === 0 ? (
                    <div className="relative w-24 h-40 rounded-xl overflow-hidden cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      <Avatar className="w-full h-full rounded-xl">
                        <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200" className="object-cover" />
                      </Avatar>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-10 left-0 right-0 text-center">
                        <p className="text-white text-xs font-semibold">أنشئ قصة</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-24 h-40 rounded-xl overflow-hidden cursor-pointer group">
                      <div className={cn(
                        "absolute inset-0 ring-4 rounded-xl z-10 pointer-events-none transition-all",
                        !story.viewed ? "ring-blue-500" : "ring-gray-300"
                      )}></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      <img 
                        src={story.thumbnail} 
                        alt={story.author.name}
                        className="w-full h-full object-cover"
                      />
                      <Avatar className="absolute top-2 right-2 w-10 h-10 border-4 border-blue-500">
                        <AvatarImage src={story.author.avatar} />
                      </Avatar>
                      <div className="absolute bottom-2 right-2 left-2">
                        <p className="text-white text-xs font-semibold truncate">{story.author.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="bg-white border-b border-gray-200 sticky top-56 z-30">
          <ScrollArea className="w-full" dir="rtl">
            <div className="flex gap-2 px-3 py-2 overflow-x-auto">
              {contentFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={cn(
                      "flex-shrink-0 gap-2 rounded-full",
                      selectedFilter === filter.id ? "bg-blue-500 text-white" : "bg-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="max-w-2xl mx-auto px-0 sm:px-4 py-4 space-y-3">
          {filteredPosts.map((post) => {
            const typeInfo = typeConfig[post.type];
            const Icon = typeInfo.icon;
            const isLiked = likedPosts.has(post.id);
            const isBookmarked = bookmarks.some(b => b.id === post.id);

            return (
              <Card key={post.id} className="overflow-hidden border-0 sm:border shadow-none sm:shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{post.author.name}</h4>
                          {post.author.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.author.role}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 -mt-2 -ml-2">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </Button>
                  </div>

                  <Badge className={cn("mb-2 gap-1", typeInfo.color, "text-white border-0")}>
                    <Icon className="w-3 h-3" />
                    {typeInfo.label}
                  </Badge>

                  <h3 className="font-bold text-base mb-2 text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>

                  {post.image && (
                    <div className="relative -mx-3 sm:-mx-4 mb-3 overflow-hidden rounded-none sm:rounded-lg">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full aspect-video object-cover"
                      />
                      {post.type === "course" && post.duration && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.duration}
                        </div>
                      )}
                      {post.type === "webinar" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <PlayCircle className="w-10 h-10 text-blue-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {post.type === "course" && (
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg p-2">
                      {post.difficulty && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {post.difficulty}
                        </div>
                      )}
                      {post.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {post.rating}
                        </div>
                      )}
                      {post.enrolled && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {post.enrolled}
                        </div>
                      )}
                      {post.price && (
                        <div className="mr-auto font-bold text-green-600">
                          ${post.price}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <ThumbsUp className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{post.comments} تعليق</span>
                      <span>{post.shares} مشاركة</span>
                      {post.views && <span>{post.views} مشاهدة</span>}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-around gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={cn(
                        "flex-1 gap-2 transition-all",
                        isLiked ? "text-blue-500 hover:text-blue-600" : "text-gray-600 hover:text-blue-500"
                      )}
                    >
                      <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
                      <span className="text-sm font-medium">إعجاب</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex-1 gap-2 text-gray-600 hover:text-blue-500"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">تعليق</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 text-gray-600 hover:text-green-500"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">مشاركة</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post)}
                      className={cn(
                        "gap-2 transition-all",
                        isBookmarked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
                      )}
                    >
                      <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                    </Button>
                  </div>

                  {showComments === post.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" />
                        </Avatar>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="اكتب تعليق..."
                            className="w-full px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                              <Smile className="w-4 h-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                              <Send className="w-4 h-4 text-blue-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-20 left-4 sm:left-auto sm:right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center z-40 hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsCreatePostOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">إنشاء منشور</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreatePostOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" />
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">د. أحمد المهندس</p>
                  <select className="text-xs bg-gray-100 rounded px-2 py-1 mt-1">
                    <option>عام</option>
                    <option>خاص</option>
                    <option>الأصدقاء فقط</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="بماذا تفكر؟"
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <ImageIcon className="w-4 h-4" />
                  صورة
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Video className="w-4 h-4" />
                  فيديو
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <GraduationCap className="w-4 h-4" />
                  دورة
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  مقال
                </Button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                نشر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
