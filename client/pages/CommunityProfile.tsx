import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Award, Briefcase, GraduationCap, Calendar, Users, MessageSquare, Heart, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface DoctorProfile {
  id: number;
  name: string;
  arabicName: string;
  avatar: string;
  specialty: string;
  verified: boolean;
  bio: string;
  location: string;
  yearsOfExperience: number;
  education: string[];
  certifications: string[];
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

interface Post {
  id: number;
  content: string;
  image?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

const mockDoctor: DoctorProfile = {
  id: 1,
  name: "Dr. Ahmed Al-Saeedi",
  arabicName: "د. أحمد السعيدي",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
  specialty: "استشاري تقويم الأسنان",
  verified: true,
  bio: "استشاري تقويم الأسنان مع 15+ سنة خبرة في علاج حالات التقويم المعقدة. متخصص في التقويم الشفاف والحلول الحديثة.",
  location: "بغداد، العراق",
  yearsOfExperience: 15,
  education: [
    "دكتوراه في تقويم الأسنان - جامعة بغداد (2010)",
    "ماجستير طب الأسنان - جامعة الموصل (2006)",
    "بكالوريوس طب الأسنان - جامعة بغداد (2003)"
  ],
  certifications: [
    "شهادة البورد العراقي في تقويم الأسنان",
    "عضو الجمعية الأمريكية لتقويم الأسنان (AAO)",
    "دبلوم في التقويم الشفاف Invisalign"
  ],
  stats: {
    posts: 142,
    followers: 3845,
    following: 234,
    likes: 12543
  }
};

const mockPosts: Post[] = [
  {
    id: 1,
    content: "نصائح مهمة للعناية بالتقويم الثابت:\n\n1. تنظيف الأسنان 3 مرات يومياً\n2. استخدام الفرشاة بين الأسنان\n3. تجنب الأطعمة الصلبة\n4. المتابعة الدورية كل 4 أسابيع\n\n#تقويم_الأسنان #نصائح_طبية",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
    likeCount: 245,
    commentCount: 18,
    shareCount: 32,
    createdAt: "منذ 3 ساعات",
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    content: "حالة جديدة: تقويم شفاف لعلاج ازدحام الأسنان الأمامية. النتائج الأولية مبشرة جداً بعد 3 أشهر فقط! 🦷✨",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
    likeCount: 389,
    commentCount: 45,
    shareCount: 67,
    createdAt: "منذ يوم واحد",
    isLiked: true,
    isSaved: true
  }
];

export default function CommunityProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await fetch(`/api/users/${id}/profile`);
        const profileData = await profileResponse.json();
        
        if (!profileResponse.ok) {
          setDoctor(mockDoctor);
          setPosts(mockPosts);
          return;
        }

        setDoctor(profileData);

        const postsResponse = await fetch(`/api/users/${id}/posts`);
        const postsData = await postsResponse.json();
        
        if (postsResponse.ok && postsData.length > 0) {
          setPosts(postsData);
        } else {
          setPosts(mockPosts);
        }

        const currentUserId = 1;
        const followStatusResponse = await fetch(`/api/users/${id}/following-status?followerId=${currentUserId}`);
        const followStatus = await followStatusResponse.json();
        setIsFollowing(followStatus.following);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setDoctor(mockDoctor);
        setPosts(mockPosts);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const handleFollow = async () => {
    try {
      const currentUserId = 1;
      const response = await fetch(`/api/users/${id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId }),
      });

      const data = await response.json();
      setIsFollowing(data.following);
      toast.success(data.following ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة");

      if (doctor) {
        setDoctor(prev => prev ? ({
          ...prev,
          stats: {
            ...prev.stats,
            followers: data.following ? prev.stats.followers + 1 : prev.stats.followers - 1
          }
        }) : null);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
        };
      }
      return post;
    }));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        toast.success(post.isSaved ? "تم إلغاء الحفظ" : "تم حفظ المنشور");
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };

  const handleShare = (postId: number) => {
    toast.success("تم نسخ الرابط");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">لم يتم العثور على الملف الشخصي</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/community" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowRight className="w-5 h-5" />
          <span>رجوع للمجتمع</span>
        </Link>

        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={doctor.avatar} alt={doctor.arabicName} />
              <AvatarFallback>{doctor.arabicName.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{doctor.arabicName}</h1>
                    {doctor.verified && (
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-green-600 mb-2">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                </div>

                <Button
                  onClick={handleFollow}
                  className={isFollowing 
                    ? "bg-gray-200 text-gray-900 hover:bg-gray-300" 
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  }
                >
                  {isFollowing ? "إلغاء المتابعة" : "متابعة"}
                </Button>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{doctor.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{doctor.stats.posts}</p>
                  <p className="text-sm text-gray-600">منشور</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{doctor.stats.followers}</p>
                  <p className="text-sm text-gray-600">متابع</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{doctor.stats.following}</p>
                  <p className="text-sm text-gray-600">يتابع</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{doctor.stats.likes}</p>
                  <p className="text-sm text-gray-600">إعجاب</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="posts">المنشورات</TabsTrigger>
            <TabsTrigger value="about">نبذة</TabsTrigger>
            <TabsTrigger value="credentials">المؤهلات</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={doctor.avatar} alt={doctor.arabicName} />
                    <AvatarFallback>{doctor.arabicName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{doctor.arabicName}</h3>
                      {doctor.verified && (
                        <div className="bg-blue-500 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{post.createdAt}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />
                )}

                <div className="flex items-center gap-6 pt-4 border-t">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likeCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.commentCount}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{post.shareCount}</span>
                  </button>
                  <button
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-2 ${post.isSaved ? 'text-green-600' : 'text-gray-600'} hover:text-green-600 transition-colors mr-auto`}
                  >
                    <BookmarkPlus className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">الخبرة المهنية</h3>
              </div>
              <p className="text-gray-700">
                {doctor.yearsOfExperience}+ سنوات من الخبرة في مجال تقويم الأسنان
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">التعليم</h3>
              </div>
              <ul className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-700">{edu}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">الشهادات والعضويات</h3>
              </div>
              <div className="space-y-3">
                {doctor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-gray-800">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
