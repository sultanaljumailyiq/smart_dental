import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, GraduationCap, Users, MessageCircle, Grid, Plus, Heart, Share2, 
  Eye, Send, Search, Filter, Star, Clock, Calendar, MapPin, Settings,
  UserPlus, Check, X, MoreVertical, Image as ImageIcon, Video, Smile,
  Bookmark, TrendingUp, Award, Bell, LogOut, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { communityService, type CommunityPost, type CommunityComment } from "@/services/communityService";
import { useAuth } from "@/contexts/AuthContext";

const Community = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("main");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [learningSubsection, setLearningSubsection] = useState<"events" | "courses" | "content" | "global" | "3d">("events");
  const [postsFilter, setPostsFilter] = useState<"all" | "elite" | "trusted">("all");
  const [promotionalCards, setPromotionalCards] = useState<any[]>([]);
  const [hiddenCards, setHiddenCards] = useState<Set<number>>(new Set());
  
  // API-connected state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Record<number, CommunityComment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const currentUserId = parseInt(user?.id || "1");

  const sections = [
    { id: "main", label: "الرئيسية", icon: Home },
    { id: "learning", label: "التعليم", icon: GraduationCap },
    { id: "friends", label: "الأصدقاء", icon: Users },
    { id: "messages", label: "الرسائل", icon: MessageCircle },
    { id: "others", label: "أخرى", icon: Grid },
  ];

  const learningCategories = [
    { id: 1, name: "تقويم الأسنان", courses: 24, icon: "🦷" },
    { id: 2, name: "زراعة الأسنان", courses: 18, icon: "🔧" },
    { id: 3, name: "علاج العصب", courses: 31, icon: "💉" },
    { id: 4, name: "تجميل الأسنان", courses: 15, icon: "✨" },
    { id: 5, name: "جراحة الفم", courses: 22, icon: "🏥" },
    { id: 6, name: "طب أسنان الأطفال", courses: 19, icon: "👶" }
  ];

  const courses = [
    { 
      id: 1, 
      title: "دورة تقويم الأسنان الحديثة", 
      instructor: "د. علي حسين",
      type: "فيديو", 
      duration: "8 ساعات", 
      students: 1234,
      rating: 4.8,
      level: "متقدم",
      price: "مجاني",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400"
    },
    { 
      id: 2, 
      title: "علاج العصب المتقدم - تقنيات حديثة", 
      instructor: "د. سارة أحمد",
      type: "مقال", 
      duration: "4 ساعات", 
      students: 856,
      rating: 4.9,
      level: "متوسط",
      price: "50,000 IQD",
      thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400"
    },
    { 
      id: 3, 
      title: "زراعة الأسنان الفورية - ورشة عملية", 
      instructor: "د. حسام الدين",
      type: "ورشة عمل", 
      duration: "12 ساعة", 
      students: 567,
      rating: 5.0,
      level: "متقدم",
      price: "150,000 IQD",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"
    }
  ];

  const educationalContent = [
    { 
      id: 1, 
      title: "دليل شامل: علاج التهاب اللثة المزمن", 
      author: "د. سارة أحمد",
      type: "مقال",
      readTime: "10 دقائق",
      views: 2345,
      date: "منذ يومين",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
      category: "علاج اللثة"
    },
    { 
      id: 2, 
      title: "أحدث تقنيات التبييض الضوئي", 
      author: "د. علي حسين",
      type: "فيديو",
      readTime: "15 دقيقة",
      views: 4521,
      date: "منذ 3 أيام",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400",
      category: "تجميل"
    },
    { 
      id: 3, 
      title: "بروتوكولات التعقيم الحديثة في العيادات", 
      author: "د. حسام الدين",
      type: "دليل",
      readTime: "20 دقيقة",
      views: 3112,
      date: "منذ أسبوع",
      thumbnail: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
      category: "إدارة عيادات"
    }
  ];

  const globalResources = [
    { 
      id: 1, 
      title: "PubMed - Dentistry",
      description: "قاعدة بيانات الأبحاث العلمية الطبية",
      url: "pubmed.ncbi.nlm.nih.gov",
      type: "قاعدة بيانات",
      language: "English",
      icon: "📚"
    },
    { 
      id: 2, 
      title: "American Dental Association",
      description: "الجمعية الأمريكية لطب الأسنان - موارد ومعايير",
      url: "ada.org",
      type: "منظمة",
      language: "English",
      icon: "🏛️"
    },
    { 
      id: 3, 
      title: "Journal of Dental Research",
      description: "مجلة أبحاث طب الأسنان الدولية",
      url: "journals.sagepub.com/jdr",
      type: "مجلة علمية",
      language: "English",
      icon: "📰"
    },
    { 
      id: 4, 
      title: "Cochrane Oral Health",
      description: "مراجعات منهجية لأبحاث صحة الفم",
      url: "cochranelibrary.com/oral-health",
      type: "مراجعات",
      language: "English",
      icon: "🔬"
    }
  ];

  const models3D = [
    { 
      id: 1, 
      title: "تشريح الأسنان الكامل",
      description: "نموذج ثلاثي الأبعاد تفاعلي لجميع أنواع الأسنان",
      views: 5234,
      category: "تشريح",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400"
    },
    { 
      id: 2, 
      title: "زراعة الأسنان - الخطوات التفصيلية",
      description: "محاكاة ثلاثية الأبعاد لعملية زراعة الأسنان",
      views: 8921,
      category: "زراعة",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"
    },
    { 
      id: 3, 
      title: "تقويم الأسنان - حركة الأسنان",
      description: "عرض توضيحي لحركة الأسنان خلال فترة التقويم",
      views: 6543,
      category: "تقويم",
      thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400"
    }
  ];

  const friends = [
    { id: 1, name: "د. محمد العراقي", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100", specialty: "جراحة فم", online: true, mutualFriends: 12, location: "بغداد" },
    { id: 2, name: "د. زينب الحسن", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", specialty: "تقويم أسنان", online: false, mutualFriends: 8, location: "البصرة" },
    { id: 3, name: "د. حسام الدين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", specialty: "علاج عصب", online: true, mutualFriends: 15, location: "أربيل" },
    { id: 4, name: "د. فاطمة كريم", avatar: "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=100", specialty: "أسنان أطفال", online: true, mutualFriends: 6, location: "النجف" }
  ];

  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "د. علي حسين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", mutualFriends: 5, specialty: "تجميل أسنان" },
    { id: 2, name: "د. مريم صالح", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", mutualFriends: 3, specialty: "زراعة أسنان" }
  ]);

  const conversations = [
    { id: 1, sender: "د. فاطمة حسن", avatar: "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=100", lastMessage: "شكراً على المشاركة المفيدة", time: "منذ 5 دقائق", unread: 2, online: true },
    { id: 2, sender: "د. علي حسين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", lastMessage: "هل يمكننا مناقشة الحالة؟", time: "منذ 1 ساعة", unread: 0, online: false },
    { id: 3, sender: "د. زينب محمد", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", lastMessage: "سأرسل لك التقرير قريباً", time: "منذ 3 ساعات", unread: 1, online: true }
  ];

  const conversationMessages = [
    { id: 1, text: "مرحباً، كيف حالك؟", sent: false, time: "10:30 ص" },
    { id: 2, text: "بخير والحمد لله، شكراً لسؤالك", sent: true, time: "10:32 ص" },
    { id: 3, text: "أريد استشارتك بخصوص حالة معقدة", sent: false, time: "10:35 ص" },
    { id: 4, text: "بالتأكيد، ارسل لي التفاصيل", sent: true, time: "10:36 ص" }
  ];

  const groups = [
    { id: 1, name: "أطباء الأسنان في العراق", members: 15234, icon: "👥", category: "عام" },
    { id: 2, name: "تقويم الأسنان المتقدم", members: 3456, icon: "🦷", category: "تخصص" },
    { id: 3, name: "الزراعة الفورية", members: 2134, icon: "🔧", category: "تخصص" },
    { id: 4, name: "حالات سريرية معقدة", members: 5678, icon: "🏥", category: "علمي" }
  ];

  const events = [
    { id: 1, title: "مؤتمر طب الأسنان الدولي 2025", date: "15 نوفمبر 2025", location: "بغداد - فندق راديسون", attendees: 450, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400" },
    { id: 2, title: "ورشة عمل: زراعة الأسنان الفورية", date: "22 نوفمبر 2025", location: "أربيل - مركز التدريب الطبي", attendees: 89, image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400" }
  ];

  const handleAcceptFriend = (id: number, name: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.success(`تم قبول طلب الصداقة من ${name}`);
  };

  const handleRejectFriend = (id: number, name: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.error(`تم رفض طلب الصداقة من ${name}`);
  };

  const handleEnrollCourse = (courseId: number, title: string) => {
    setEnrolledCourses(prev => new Set(prev).add(courseId));
    toast.success(`تم التسجيل في ${title}`);
  };

  // Load promotional cards from API
  useEffect(() => {
    const loadPromotionalCards = async () => {
      try {
        const response = await fetch('/api/admin/promotional-cards');
        if (response.ok) {
          const data = await response.json();
          // Filter active cards and cards that target community section
          // Support both Arabic "المجتمع" and English "Community"
          const activeCards = data.filter((card: any) => 
            card.isActive && 
            (card.targetSections?.includes('المجتمع') || card.targetSections?.includes('Community'))
          );
          setPromotionalCards(activeCards);
        }
      } catch (error) {
        console.error('Failed to load promotional cards:', error);
      }
    };
    
    loadPromotionalCards();
    
    // Load hidden cards from localStorage
    const savedHidden = localStorage.getItem('hiddenPromotionalCards');
    if (savedHidden) {
      try {
        const parsed = JSON.parse(savedHidden);
        const normalizedSet = new Set<number>(
          parsed.map((id: any) => typeof id === 'number' ? id : parseInt(id)).filter((id: number) => !isNaN(id))
        );
        setHiddenCards(normalizedSet);
      } catch (e) {
        console.error('Failed to parse hidden cards:', e);
      }
    }
  }, []);

  // Load posts when filter changes
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await communityService.getPosts(postsFilter, currentUserId);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
        toast.error('فشل تحميل المنشورات');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [postsFilter, currentUserId]);

  const handleHideCard = (cardId: number | string) => {
    const newHidden = new Set(hiddenCards);
    // Normalize to number if possible, otherwise keep as-is
    const normalizedId = typeof cardId === 'string' ? (Number(cardId) || cardId) : cardId;
    newHidden.add(normalizedId as number);
    setHiddenCards(newHidden);
    localStorage.setItem('hiddenPromotionalCards', JSON.stringify(Array.from(newHidden)));
    toast.success("تم إخفاء البطاقة");
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("الرجاء كتابة محتوى المنشور");
      return;
    }
    
    try {
      const newPost = await communityService.createPost({
        authorId: currentUserId,
        content: newPostContent,
        postType: postsFilter === 'all' ? 'general' : postsFilter,
      });

      if (newPost) {
        setPosts(prev => [newPost, ...prev]);
        setNewPostContent("");
        setShowCreatePost(false);
        toast.success("تم نشر المنشور بنجاح!");
      }
    } catch (error) {
      toast.error("فشل نشر المنشور");
    }
  };

  // Handle like toggle
  const handleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const wasLiked = post.isLiked;
    
    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            isLiked: !wasLiked, 
            likeCount: wasLiked ? p.likeCount - 1 : p.likeCount + 1 
          }
        : p
    ));

    try {
      await communityService.toggleLike(postId, currentUserId);
    } catch (error) {
      // Rollback on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              isLiked: wasLiked, 
              likeCount: wasLiked ? p.likeCount + 1 : p.likeCount - 1 
            }
          : p
      ));
      toast.error("فشل تحديث الإعجاب");
    }
  };

  // Handle save toggle
  const handleSave = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const wasSaved = post.isSaved;
    
    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isSaved: !wasSaved }
        : p
    ));

    try {
      await communityService.toggleSave(postId, currentUserId);
      toast.success(wasSaved ? "تم إلغاء الحفظ" : "تم حفظ المنشور");
    } catch (error) {
      // Rollback on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isSaved: wasSaved }
          : p
      ));
      toast.error("فشل تحديث الحفظ");
    }
  };

  // Handle share
  const handleShare = async (postId: number) => {
    try {
      await communityService.sharePost(postId);
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, shareCount: p.shareCount + 1 }
          : p
      ));
      toast.success("تمت المشاركة بنجاح");
    } catch (error) {
      toast.error("فشلت المشاركة");
    }
  };

  // Load comments for a post
  const handleLoadComments = async (postId: number) => {
    if (showComments === postId) {
      setShowComments(null);
      return;
    }

    setShowComments(postId);

    if (!comments[postId]) {
      try {
        const fetchedComments = await communityService.getComments(postId, currentUserId);
        setComments(prev => ({ ...prev, [postId]: fetchedComments }));
      } catch (error) {
        toast.error("فشل تحميل التعليقات");
      }
    }
  };

  // Add comment
  const handleAddComment = async (postId: number, content: string) => {
    if (!content.trim()) {
      toast.error("الرجاء كتابة تعليق");
      return;
    }

    try {
      const newComment = await communityService.createComment({
        postId,
        authorId: currentUserId,
        content,
      });

      if (newComment) {
        setComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, commentCount: p.commentCount + 1 }
            : p
        ));
      }
    } catch (error) {
      toast.error("فشل إضافة التعليق");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-all",
                activeSection === section.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Main Feed */}
        {activeSection === "main" && (
          <div className="space-y-4">

            {/* Promotional Cards - Dynamic from Admin */}
            {promotionalCards
              .filter(card => !hiddenCards.has(card.id))
              .map((card) => (
                <div 
                  key={card.id}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
                  style={{
                    background: card.displayType === 'card' 
                      ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'
                      : undefined
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => handleHideCard(card.id)}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6" />
                      <h3 className="font-bold text-lg">عرض مميز</h3>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">إعلان</span>
                  </div>

                  {/* Card Image */}
                  {card.images && card.images.length > 0 && (
                    <img 
                      src={card.images[0]} 
                      alt={card.arabicTitle} 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <h4 className="text-xl font-bold mb-2">{card.arabicTitle}</h4>
                  <p className="text-purple-100 mb-4">{card.arabicDescription}</p>
                  
                  {card.discountPercentage && (
                    <div className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold mb-4">
                      خصم {card.discountPercentage}%
                    </div>
                  )}

                  {card.ctaButtonUrl && (
                    <a 
                      href={card.ctaButtonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-semibold transition-all"
                    >
                      {card.ctaButtonText || 'اعرف المزيد'}
                    </a>
                  )}
                </div>
              ))}
            
            {/* Fallback if no promotional cards */}
            {promotionalCards.filter(card => !hiddenCards.has(card.id)).length === 0 && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    <h3 className="font-bold text-lg">عرض مميز</h3>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">إعلان</span>
                </div>
                <h4 className="text-xl font-bold mb-2">احصل على خصم 30% على جميع الدورات</h4>
                <p className="text-purple-100 mb-4">استفد من عرضنا الحصري لفترة محدودة على جميع الدورات التعليمية</p>
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  اعرف المزيد
                </Button>
              </div>
            )}

            {/* Recent Events Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  آخر الندوات والدورات
                </h3>
                <button 
                  onClick={() => setActiveSection("learning")}
                  className="text-green-600 text-sm hover:underline font-medium"
                >
                  عرض الكل
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {events.slice(0, 2).map((event) => (
                  <Link 
                    key={event.id} 
                    to={`/community/event/${event.id}`}
                    className="flex-shrink-0 w-64"
                  >
                    <div className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all border border-gray-200">
                      <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
                      <div className="p-3 bg-white">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <button 
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                إنشاء منشور جديد
              </button>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">صورة</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">فيديو</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Smile className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700">شعور</span>
                </button>
              </div>
            </div>

            {/* Posts Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setPostsFilter("all")}
                  className={cn(
                    "flex-1 px-6 py-3 text-center font-medium whitespace-nowrap transition-all border-b-2",
                    postsFilter === "all"
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  عامة
                </button>
                <button
                  onClick={() => setPostsFilter("elite")}
                  className={cn(
                    "flex-1 px-6 py-3 text-center font-medium whitespace-nowrap transition-all border-b-2 flex items-center justify-center gap-2",
                    postsFilter === "elite"
                      ? "border-purple-600 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Award className="w-4 h-4" />
                  مميزون
                </button>
                <button
                  onClick={() => setPostsFilter("trusted")}
                  className={cn(
                    "flex-1 px-6 py-3 text-center font-medium whitespace-nowrap transition-all border-b-2 flex items-center justify-center gap-2",
                    postsFilter === "trusted"
                      ? "border-green-600 text-green-600 bg-green-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  مصادر موثوقة
                </button>
              </div>
            </div>

            {/* Posts */}
            {isLoading ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">جاري التحميل...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">لا توجد منشورات حالياً</p>
              </div>
            ) : posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/community/profile/${post.author.id}`}>
                        <img 
                          src={post.author.avatar || "https://via.placeholder.com/100"} 
                          alt={post.author.arabicName || post.author.name} 
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 hover:ring-green-500 transition-all cursor-pointer" 
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link to={`/community/profile/${post.author.id}`} className="hover:underline">
                            <h3 className="font-semibold text-gray-900">{post.author.arabicName || post.author.name}</h3>
                          </Link>
                          {post.author.verified && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{post.author.role === 'dentist' ? 'طبيب أسنان' : 'مستخدم'}</p>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('ar-IQ')}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                </div>
                
                {post.image && (
                  <img src={post.image} alt="" className="w-full h-80 object-cover" />
                )}
                
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.viewCount}
                      </span>
                      <span>{post.commentCount} تعليق</span>
                      <span>{post.shareCount} مشاركة</span>
                    </div>
                    <button 
                      onClick={() => handleSave(post.id)}
                      className={cn(
                        "hover:text-blue-600 transition-colors",
                        post.isSaved && "text-blue-600"
                      )}
                    >
                      <Bookmark className={cn("w-4 h-4", post.isSaved && "fill-blue-600")} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all",
                        post.isLiked
                          ? "bg-red-50 text-red-600"
                          : "hover:bg-gray-50 text-gray-600"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", post.isLiked && "fill-red-600")} />
                      <span className="text-sm font-medium">{post.likeCount}</span>
                    </button>
                    <button 
                      onClick={() => handleLoadComments(post.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">تعليق</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">مشاركة</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments === post.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img 
                            src={comment.author.avatar || "https://via.placeholder.com/32"} 
                            alt={comment.author.arabicName || comment.author.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-medium text-sm text-gray-900">{comment.author.arabicName || comment.author.name}</p>
                              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 px-3">
                              <button className="text-xs text-gray-600 hover:text-blue-600">إعجاب</button>
                              <button className="text-xs text-gray-600 hover:text-blue-600">رد</button>
                              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('ar-IQ')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex-shrink-0" />
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="اكتب تعليقاً..." 
                            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                handleAddComment(post.id, target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <button 
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              handleAddComment(post.id, input.value);
                              input.value = '';
                            }}
                            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Section */}
        {activeSection === "learning" && (
          <div className="space-y-4">
            {/* Header with Search */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">مركز التعليم المستمر</h2>
              <p className="text-blue-100 mb-4">طور مهاراتك مع أفضل الخبراء في المجال</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث..." 
                    className="w-full pr-10 pl-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Learning Subsections Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
                <button
                  onClick={() => setLearningSubsection("events")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all flex items-center justify-center gap-2",
                    learningSubsection === "events"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  الندوات
                </button>
                <button
                  onClick={() => setLearningSubsection("courses")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "courses"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  الدورات
                </button>
                <button
                  onClick={() => setLearningSubsection("content")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "content"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المحتوى التعليمي
                </button>
                <button
                  onClick={() => setLearningSubsection("global")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "global"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المصادر العالمية
                </button>
                <button
                  onClick={() => setLearningSubsection("3d")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "3d"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  3D
                </button>
              </div>
            </div>

            {/* Events Subsection */}
            {learningSubsection === "events" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">الندوات والفعاليات القادمة</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">عرض الكل</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                      <Link to={`/community/event/${event.id}`}>
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover hover:opacity-90 transition-opacity" />
                      </Link>
                      <div className="p-4">
                        <Link to={`/community/event/${event.id}`}>
                          <h3 className="font-bold text-lg text-gray-900 mb-3 hover:text-blue-600 transition-colors">{event.title}</h3>
                        </Link>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span>{event.attendees} مشارك</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            toast.success(`سيتم توجيهك لصفحة التسجيل في: ${event.title}`);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          التسجيل في الندوة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Subsection */}
            {learningSubsection === "courses" && (
              <>
                {/* My Enrolled Courses */}
                {enrolledCourses.size > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      الدورات المسجل بها ({enrolledCourses.size})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => enrolledCourses.has(c.id)).map((course) => (
                        <div key={course.id} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3">
                            <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{course.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">مُسجّل</span>
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">متابعة</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">التخصصات</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {learningCategories.map((cat) => (
                      <button 
                        key={cat.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg p-4 text-center transition-all border border-blue-100 hover:border-blue-300"
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{cat.name}</h4>
                        <p className="text-xs text-gray-600">{cat.courses} دورة</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">الدورات المميزة</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</button>
                  </div>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <Link 
                        key={course.id} 
                        to={`/community/course/${course.id}`}
                        className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="md:flex">
                          <img src={course.thumbnail} alt={course.title} className="w-full md:w-48 h-48 object-cover" />
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">{course.type}</span>
                                  <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">{course.level}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">المدرب: {course.instructor}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{course.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{course.students} طالب</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-left mr-4">
                                <p className="text-2xl font-bold text-blue-600">{course.price}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={(e) => {
                                e.preventDefault();
                                handleEnrollCourse(course.id, course.title);
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              disabled={enrolledCourses.has(course.id)}
                            >
                              {enrolledCourses.has(course.id) ? "تم التسجيل ✓" : "التسجيل الآن"}
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Educational Content Subsection */}
            {learningSubsection === "content" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">المحتوى التعليمي</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</button>
                </div>
                {educationalContent.map((content) => (
                  <div key={content.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="md:flex">
                      <img src={content.thumbnail} alt={content.title} className="w-full md:w-48 h-48 object-cover" />
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">{content.type}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{content.category}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{content.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">بقلم: {content.author}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{content.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{content.views} مشاهدة</span>
                          </div>
                          <span className="text-xs">{content.date}</span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          قراءة المزيد
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Global Resources Subsection */}
            {learningSubsection === "global" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">المصادر العالمية</h3>
                  <p className="text-sm text-gray-600">أفضل المصادر العلمية والأكاديمية الدولية في طب الأسنان</p>
                </div>
                {globalResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{resource.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{resource.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{resource.type}</span>
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{resource.language}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => window.open(`https://${resource.url}`, '_blank')}
                          >
                            زيارة الموقع
                          </Button>
                          <p className="text-xs text-gray-500">{resource.url}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3D Models Subsection */}
            {learningSubsection === "3d" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">النماذج ثلاثية الأبعاد</h3>
                  <p className="text-sm text-gray-600">نماذج تفاعلية ثلاثية الأبعاد لفهم أفضل</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models3D.map((model) => (
                    <div key={model.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                      <div className="relative">
                        <img src={model.thumbnail} alt={model.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 text-white w-full">
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">{model.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2">{model.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{model.views} مشاهدة</span>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            عرض النموذج
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friends Section */}
        {activeSection === "friends" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن أصدقاء..." 
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  طلبات الصداقة ({friendRequests.length})
                </h3>
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.name}</h4>
                          <p className="text-sm text-gray-600">{request.specialty}</p>
                          <p className="text-xs text-gray-500">{request.mutualFriends} أصدقاء مشتركين</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptFriend(request.id, request.name)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          قبول
                        </button>
                        <button 
                          onClick={() => handleRejectFriend(request.id, request.name)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">أصدقائك ({friends.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white" />
                        {friend.online && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-600">{friend.specialty}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{friend.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{friend.mutualFriends} أصدقاء مشتركين</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        رسالة
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                        الملف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">مقترحات الصداقة</h3>
              <p className="text-sm text-gray-600">سيتم إضافة اقتراحات بناءً على التخصص والموقع</p>
            </div>
          </div>
        )}

        {/* Messages Section */}
        {activeSection === "messages" && (
          <div className="space-y-4">
            {selectedConversation === null ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="ابحث في المحادثات..." 
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  {conversations.map((conv) => (
                    <div 
                      key={conv.id} 
                      onClick={() => setSelectedConversation(conv.id)}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={conv.avatar} alt={conv.sender} className="w-14 h-14 rounded-full object-cover" />
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{conv.sender}</h3>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            {conv.unread > 0 && (
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mr-2">
                                {conv.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img src={conversations.find(c => c.id === selectedConversation)?.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{conversations.find(c => c.id === selectedConversation)?.sender}</h3>
                    <p className="text-sm text-green-600">نشط الآن</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 h-96 overflow-y-auto space-y-3">
                  {conversationMessages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.sent ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      )}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sent ? "text-blue-100" : "text-gray-500")}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <input 
                      type="text" 
                      placeholder="اكتب رسالة..." 
                      className="flex-1 bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Others Section */}
        {activeSection === "others" && (
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/community/groups')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <Users className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">المجموعات</h3>
                <p className="text-xs text-blue-100 mt-1">{groups.length} مجموعة</p>
              </button>
              <button 
                onClick={() => navigate('/community/statistics')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">الإحصائيات</h3>
                <p className="text-xs text-green-100 mt-1">نشاطك</p>
              </button>
              <button 
                onClick={() => navigate('/community/settings')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <Settings className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">الإعدادات</h3>
                <p className="text-xs text-orange-100 mt-1">حسابك</p>
              </button>
              <button 
                onClick={() => setActiveSection("learning")}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <GraduationCap className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">التعليم</h3>
                <p className="text-xs text-purple-100 mt-1">الندوات والدورات</p>
              </button>
            </div>

            {/* Groups */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">المجموعات الشائعة</h3>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-2xl">
                        {group.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span>{group.members.toLocaleString()} عضو</span>
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{group.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">انضم</Button>
                  </div>
                ))}
              </div>
            </div>


            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">إعدادات الحساب</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">الإشعارات</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">الخصوصية والأمان</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreatePost(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">إنشاء منشور</h3>
              <button onClick={() => setShowCreatePost(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">د. أحمد محمد</h4>
                  <select className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1 mt-1">
                    <option>عام</option>
                    <option>أصدقاء فقط</option>
                    <option>خاص</option>
                  </select>
                </div>
              </div>
              <textarea 
                placeholder="ما الذي تريد مشاركته؟" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button className="flex-1 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm">صورة</span>
                </button>
                <button className="flex-1 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  <span className="text-sm">فيديو</span>
                </button>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleCreatePost}
              >
                نشر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
