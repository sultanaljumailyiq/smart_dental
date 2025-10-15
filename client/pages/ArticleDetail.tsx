import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Star,
  MapPin,
  Phone,
  Award,
  ThumbsUp,
  MessageCircle,
  Tag,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

// بيانات تجريبية للمقال
const articleData = {
  id: 1,
  title: "أهمية العناية بصحة الأسنان يومياً",
  content: `
    <div class="prose max-w-none">
      <p class="text-lg leading-relaxed mb-6">
        العناية بصحة الأسنان أمر بالغ الأهمية للحفاظ على صحة الفم والأسنان بشكل عام. 
        في هذا المقال، سنتناول أهم الطرق والممارسات اليومية التي تساعد في الحفاظ على صحة أسنانك.
      </p>

      <h2 class="text-2xl font-bold mb-4 mt-8">لماذا العناية اليومية مهمة؟</h2>
      <p class="mb-6">
        العناية اليومية بالأسنان تساعد في منع تراكم البلاك والجير، والذي يمكن أن يؤدي إلى:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2">
        <li>تسوس الأسنان</li>
        <li>التهاب اللثة</li>
        <li>رائحة الفم الكريهة</li>
        <li>فقدان الأسنان في المراحل المتقدمة</li>
      </ul>

      <h2 class="text-2xl font-bold mb-4 mt-8">الخطوات الأساسية للعناية اليومية</h2>
      
      <h3 class="text-xl font-semibold mb-3 mt-6">1. تنظيف الأسنان بالفرشاة</h3>
      <p class="mb-4">
        يجب تنظيف الأسنان مرتين يومياً على الأقل باستخدام معجون أسنان يحتوي على الفلورايد. 
        استخدم فرشاة أسنان ��اعمة وقم بتنظيف كل سن لمدة دقيقتين.
      </p>

      <h3 class="text-xl font-semibold mb-3 mt-6">2. استخدام خيط الأسنان</h3>
      <p class="mb-4">
        خيط الأسنان يساعد في إزالة بقايا الطعام والبلاك من بين الأسنان والأماكن التي 
        لا تستطيع فرشاة الأسنان الوصول إليها.
      </p>

      <h3 class="text-xl font-semibold mb-3 mt-6">3. استخدام غسول الفم</h3>
      <p class="mb-4">
        غسول الفم المطهر يساعد في قتل البكتيريا والجراثيم التي قد تسبب رائحة الفم الكريهة 
        والتهاب اللثة.
      </p>

      <h2 class="text-2xl font-bold mb-4 mt-8">نصائح إضافية مهمة</h2>
      <ul class="list-disc list-inside mb-6 space-y-2">
        <li>تجنب الأطعمة السكرية بكثرة</li>
        <li>اشرب الكثير من الماء</li>
        <li>تناول الأطعمة الغنية بالكالسيوم</li>
        <li>تجنب التدخين</li>
        <li>قم بزيارة طبيب الأسنان كل 6 أشهر</li>
      </ul>

      <h2 class="text-2xl font-bold mb-4 mt-8">الخلاصة</h2>
      <p class="mb-6">
        العناية اليومية بالأسنان ليس�� مجرد روتين، بل استثمار في صحتك العامة. 
        اتباع هذه النصائح البسيطة يمكن أن يوفر عليك الكثير من المشاكل والتكاليف في المستقبل.
      </p>
    </div>
  `,
  category: "صحة الأسنان",
  author: "د. أحمد الطبيب",
  authorImage: "/placeholder.svg",
  publishDate: "2024-01-15",
  readTime: "5 دقائق",
  views: 1250,
  likes: 89,
  image: "/placeholder.svg",
  tags: ["صحة الأسنان", "نظافة الفم", "الوقاية", "طب الأسنان"],
};

// أطباء وعيادات مقترحة
const recommendedDoctors = [
  {
    id: 1,
    name: "د. سارة الدمرداش",
    specialty: "طب الأسنان",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg",
    clinic: "عيادة الابتسامة الذهبية",
    location: "الرياض، السليمانية",
    phone: "+966501234567",
    experience: "15 سنة خبرة",
  },
  {
    id: 2,
    name: "د. محمد العنزي",
    specialty: "جراحة الأسنان",
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg",
    clinic: "مركز الأسنان المتقدم",
    location: "جدة، الصفا",
    phone: "+966507654321",
    experience: "12 سنة خبرة",
  },
];

// مقالات مقترحة من نفس التصنيف
const relatedArticles = [
  {
    id: 2,
    title: "كيفية اختيار فرشاة الأسنان المناسبة",
    excerpt: "دليل شامل لاختيار فرشاة الأسنان التي تناسب احتياجاتك",
    readTime: "3 دقائق",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "أعراض التهاب اللثة وعلاجها",
    excerpt: "تعرف على علامات التهاب اللثة وطرق الوقاية والعلاج",
    readTime: "6 دقائق",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "التغذية السليمة لصحة الأسنان",
    excerpt: "الأطعمة المفيدة والضارة لصحة أسنانك",
    readTime: "4 دقائق",
    image: "/placeholder.svg",
  },
];

export default function ArticleDetail() {
  const { id } = useParams();
  const { language } = useI18n();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: articleData.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/articles"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span>العودة للمقالات</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                  liked
                    ? "bg-red-100 text-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                <span>{articleData.likes + (liked ? 1 : 0)}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Article Image */}
          <div className="aspect-video bg-gradient-to-r from-purple-100 to-pink-100">
            <img
              src={articleData.image}
              alt={articleData.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full font-medium">
                {articleData.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {articleData.title}
            </h1>


            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: require("@/utils/sanitizer").sanitizeHtml(articleData.content) }}
            />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">الكلمات المفتاحية</h3>
              <div className="flex flex-wrap gap-2">
                {articleData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="mt-8 pt-8 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                  <span>أعجبني ({articleData.likes + (liked ? 1 : 0)})</span>
                </button>
                
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تعليقات</span>
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        </article>

        {/* Recommended Doctors Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              أطباء وعيادات نوصي بهم
            </h2>
            <p className="text-gray-600">
              اختر من أفضل أطباء الأسنان في منطقتك للحصول على أفضل رعاية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {doctor.specialty}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{doctor.rating}</span>
                        <span>({doctor.reviews} تقييم)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.clinic} - {doctor.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        احجز موعد
                      </button>
                      <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        عرض الملف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              مقالات ذات صلة من نفس التصنيف
            </h2>
            <Link
              to="/articles"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <span>عرض المزيد</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
