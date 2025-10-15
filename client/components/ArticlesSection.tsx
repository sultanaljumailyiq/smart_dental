import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Calendar,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

// بيانات المقالات التجريبية
const articlesData = [
  {
    id: 1,
    title: "أهمية العناية بصحة الأسنان يومياً",
    excerpt: "تعرف على الطرق الصحيحة للعناية بأسنانك وحمايتها من التسوس والأمراض",
    category: "صحة الأسنان",
    author: "د. أحمد الطبيب",
    publishDate: "2024-01-15",
    readTime: "5 دقائق",
    views: 1250,
    likes: 89,
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 2,
    title: "التغذية السليمة وأثرها على الصحة العامة",
    excerpt: "دليل شامل للتغذية الصحية وكيفية اختيار الأطعمة المناسبة لصحة أفضل",
    category: "التغذية",
    author: "د. سارة النصار",
    publishDate: "2024-01-14",
    readTime: "8 دقائق",
    views: 2100,
    likes: 156,
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 3,
    title: "كيفية التعامل مع القلق والتوتر",
    excerpt: "نصائح عملية للتخلص من القل�� والتوتر وتحسين الصحة النفسية",
    category: "الصحة النفسية",
    author: "د. محمد ��لزهراني",
    publishDate: "2024-01-13",
    readTime: "6 دقائق",
    views: 1890,
    likes: 234,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 4,
    title: "أساسيات الرياضة للمبتدئين",
    excerpt: "تعرف على أفضل التمارين الرياضية للمبتدئين وكيفية البدء بروتين صحي",
    category: "اللي��قة البدنية",
    author: "د. عمر الرياضي",
    publishDate: "2024-01-12",
    readTime: "7 دقائق",
    views: 1650,
    likes: 98,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 5,
    title: "الوقاية من أمراض القلب",
    excerpt: "معلومات مهمة حول كيفية الحفاظ على صحة القلب والوقاية من الأمراض",
    category: "أمراض القلب",
    author: "د. فاطمة الكردي",
    publishDate: "2024-01-11",
    readTime: "9 دقائق",
    views: 3200,
    likes: 287,
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 6,
    title: "نصائح للنوم ا��صحي",
    excerpt: "تعرف على أهمية النوم الجيد وكيفية تحسين جودة نومك للحصول على راحة أفضل",
    category: "نمط الحياة",
    author: "د. خالد النوم",
    publishDate: "2024-01-10",
    readTime: "4 دقائق",
    views: 1100,
    likes: 76,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 7,
    title: "العناية بصحة العينين",
    excerpt: "نصائح مهمة للحفاظ على صحة العينين وتجنب مشاك�� البصر الشائعة",
    category: "صحة الأسنان",
    author: "د. نورا البصري",
    publishDate: "2024-01-09",
    readTime: "6 دقائق",
    views: 1450,
    likes: 112,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 8,
    title: "فوائد المشي اليومي",
    excerpt: "اكتشف الفوائد الصحية المذهلة للمشي اليومي وكيف يمكن أن يحسن حياتك",
    category: "اللياقة البدنية",
    author: "د. أمين الرياضي",
    publishDate: "2024-01-08",
    readTime: "5 دقائق",
    views: 1750,
    likes: 134,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 9,
    title: "الإ��عافات الأولية الأساسية",
    excerpt: "دليل شامل للإسعافات الأولية التي يجب على الجميع معرفتها",
    category: "صحة الأسنان",
    author: "د. ليلى الطبيبة",
    publishDate: "2024-01-07",
    readTime: "10 دقائق",
    views: 2300,
    likes: 189,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 10,
    title: "التعامل مع الضغط النفسي",
    excerpt: "طرق فعالة للتعامل مع ا��ضغط النفسي في العمل والحياة اليومية",
    category: "الصحة النفسية",
    author: "د. هاني النفسي",
    publishDate: "2024-01-06",
    readTime: "8 دقائق",
    views: 1980,
    likes: 156,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 11,
    title: "فوائد الماء للجسم",
    excerpt: "أهمية شرب الماء بكميات كافية وتأثيره على وظائف الجسم المختلفة",
    category: "التغذية",
    author: "د. مريم الباحثة",
    publishDate: "2024-01-05",
    readTime: "4 دقائق",
    views: 1320,
    likes: 89,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 12,
    title: "تقوية جهاز المناعة",
    excerpt: "طرق طبيعية وفعالة لتقوية جهاز المناعة والوقاية من الأمراض",
    category: "نمط الحياة",
    author: "د. عبدالله المناعي",
    publishDate: "2024-01-04",
    readTime: "7 دقائق",
    views: 2100,
    likes: 178,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 13,
    title: "أساسيات التغذية الصحية",
    excerpt: "دليل شامل للتغذي�� الصحية والعادات الغذائية الصحيحة",
    category: "التغذية",
    author: "د. رانيا الغذائية",
    publishDate: "2024-01-03",
    readTime: "9 دقائق",
    views: 1890,
    likes: 145,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 14,
    title: "الوقاية من آلام الظهر",
    excerpt: "نصائح عملية للوقاية من آلام الظهر وتحسين وضعية الجسم",
    category: "اللياقة البدنية",
    author: "د. سامي العظام",
    publishDate: "2024-01-02",
    readTime: "6 دقائق",
    views: 1650,
    likes: 121,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 15,
    title: "صحة الأطفال النفسية",
    excerpt: "كيفية دعم الصحة النفسية للأطفال وتنمية ثقتهم بأنفسهم",
    category: "الصحة النفسية",
    author: "د. أحلام الطفولة",
    publishDate: "2024-01-01",
    readTime: "8 دقائق",
    views: 1780,
    likes: 167,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 16,
    title: "أهمية الفحص الدوري للثدي",
    excerpt: "دليل شامل للكشف المبكر عن سرطان الثدي وطرق الوقاية الفعالة",
    category: "صحة المرأة",
    author: "د. نادية الأورام",
    publishDate: "2024-02-15",
    readTime: "10 دقائق",
    views: 2800,
    likes: 245,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 17,
    title: "إدارة مرض السكري",
    excerpt: "نصائح عملية للتعايش مع مرض السكري والحفاظ على مستوى السكر الطبيعي",
    category: "الأمراض المزمنة",
    author: "د. خالد الغدد",
    publishDate: "2024-02-14",
    readTime: "12 دقائق",
    views: 3500,
    likes: 298,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 18,
    title: "العناية بصحة المسنين",
    excerpt: "أهم النصائح للعناية بكبار السن والوقاية من أمراض الشيخوخة",
    category: "رعاية المسنين",
    author: "د. حسام الشيخوخة",
    publishDate: "2024-02-13",
    readTime: "9 دقائق",
    views: 1950,
    likes: 167,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 19,
    title: "فوائد اليوغا للصحة النفسية",
    excerpt: "كيف تساهم ممارسة اليوغا في تحسين الصحة النفسية وتقليل التوتر",
    category: "الصحة النفسية",
    author: "د. سلمى الاسترخاء",
    publishDate: "2024-02-12",
    readTime: "7 دقائق",
    views: 1680,
    likes: 134,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 20,
    title: "التعامل مع ضغط الدم المرتفع",
    excerpt: "استراتيجيات فعالة للتحكم في ضغط الدم والوقاية من مضاعفاته",
    category: "أمراض القلب",
    author: "د. أحمد القلب",
    publishDate: "2024-02-11",
    readTime: "11 دقائق",
    views: 2650,
    likes: 201,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 21,
    title: "صحة العظام والمفاصل",
    excerpt: "كيفية الحفاظ على صحة العظام والوقاية من هشاشة العظام",
    category: "أمراض العظام",
    author: "د. مريم العظام",
    publishDate: "2024-02-10",
    readTime: "8 دقائق",
    views: 1780,
    likes: 145,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 22,
    title: "العلاج الطبيعي وفوائده",
    excerpt: "أهمية العلاج الطبيعي في تأهيل المرضى وعلاج الإصابات",
    category: "العلاج الطبيعي",
    author: "د. طارق التأهيل",
    publishDate: "2024-02-09",
    readTime: "6 دقائق",
    views: 1420,
    likes: 98,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 23,
    title: "الصحة الجنسية والإنجابية",
    excerpt: "معلومات مهمة حول الصحة الجنسية والإنجابية للرجال والنساء",
    category: "الصحة الإنجابية",
    author: "د. ليلى النساء",
    publishDate: "2024-02-08",
    readTime: "13 دقائق",
    views: 2100,
    likes: 187,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 24,
    title: "التطعيمات والوقاية من الأمراض",
    excerpt: "جدول التطعيمات الأساسية وأهميتها في الوقاية من الأمراض المعدية",
    category: "الوقاية",
    author: "د. عبدالرحمن الوقاية",
    publishDate: "2024-02-07",
    readTime: "9 دقائق",
    views: 1850,
    likes: 156,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 25,
    title: "العناية بالبشرة والشعر",
    excerpt: "نصائح للعناية بالبشرة والشعر والحفاظ على مظهر صحي وجميل",
    category: "الجمال والعناية",
    author: "د. رانيا الجلدية",
    publishDate: "2024-02-06",
    readTime: "7 دقائق",
    views: 2300,
    likes: 298,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 26,
    title: "إدارة الألم المزمن",
    excerpt: "طرق التعامل مع الألم المزمن وتحسين نوعية الحياة للمرضى",
    category: "إدارة الألم",
    author: "د. سامي الألم",
    publishDate: "2024-02-05",
    readTime: "10 دق��ئق",
    views: 1750,
    likes: 134,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 27,
    title: "الصحة المهنية وبيئة العمل",
    excerpt: "كيفية الحفاظ على الصحة في بيئة العمل وتجنب الإصابات المهنية",
    category: "الصحة المهنية",
    author: "د. هشام البيئة",
    publishDate: "2024-02-04",
    readTime: "8 دقائق",
    views: 1450,
    likes: 112,
    image: "/placeholder.svg",
    featured: false,
  },
];

const categories = [
  "الكل",
  "صحة الأسنان",
  "التغذية",
  "الصحة النفسية",
  "اللياقة البدنية",
  "أمراض القلب",
  "نمط الحياة",
  "صحة المرأة",
  "الأمراض المزمنة",
  "رعاية المسنين",
  "أمراض العظام",
  "العلاج الطبيعي",
  "الصحة الإنجابية",
  "الوقاية",
  "الجمال والعناية",
  "إدارة الألم",
  "الصحة المهنية",
];

export default function ArticlesSection() {
  const { language } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // تصفية المقالا�� حسب البحث والتصنيف
  const filteredArticles = articlesData.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ترتيب المقالات
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case "popular":
        return b.views - a.views;
      case "liked":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const featuredArticles = sortedArticles.filter(article => article.featured).slice(0, 3);
  const regularArticles = sortedArticles.filter(article => !article.featured);

  // حساب الصفحات
  const totalPages = Math.ceil(regularArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = regularArticles.slice(startIndex, endIndex);

  // إعادة تعيين الص��حة عند تغيير التصف��ة
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* البحث والتصفية المحسن بتصميم عصري */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 backdrop-blur-sm">
        <div className="space-y-6">
          {/* شريط البحث المركزي */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-purple-400 transition-all">
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
                <input
                  type="text"
                  placeholder="🔍 ابحث في أكثر من 150 مقالاً طبياً متخصصاً..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-16 pl-6 py-5 text-lg bg-transparent border-none focus:outline-none placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-all flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* الفلاتر المتقدمة */}
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* التصنيفات */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">التصنيف:</span>
            </div>
            <div className="flex flex-wrap gap-2 max-w-4xl">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all transform hover:scale-105",
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 border border-gray-200"
                  )}
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="mr-2 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* شريط الترتيب والإحصائيات */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                عرض <span className="font-bold text-purple-600">{filteredArticles.length}</span> من أصل <span className="font-bold">{articlesData.length}</span> مقال
              </div>
              {searchQuery && (
                <div className="bg-purple-50 px-3 py-1 rounded-full">
                  <span className="text-sm text-purple-700 font-medium">
                    نتائج البحث: "{searchQuery}"
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">ترتيب:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="latest">📅 الأحدث أولاً</option>
                  <option value="popular">👁️ الأكثر مشاهدة</option>
                  <option value="liked">❤️ الأكثر إعجاباً</option>
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ��لمقالات المميزة */}
      {featuredArticles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">المقالات المميزة</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                      ⭐ مميز
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{article.publishDate}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-purple-600 text-sm font-bold bg-purple-50 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{article.author}</div>
                        <div className="text-xs text-gray-500">{article.readTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-600">{article.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* باقي المقالات */}
      {regularArticles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">جميع المقالات</h2>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
                {regularArticles.length} مقال
              </span>
            </div>
            <div className="text-sm text-gray-500">
              صفحة {currentPage} من {totalPages}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible">
            {currentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.01] border border-gray-100 min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-start"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-purple-600 text-sm font-semibold bg-purple-50 px-2 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{article.author}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-600">{article.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* نظام التصفح */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  {/* السابق */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="hidden sm:inline">السابق</span>
                  </button>

                  {/* أرقام الصفحات */}
                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isCurrentPage = pageNum === currentPage;
                      const isNearCurrent = Math.abs(pageNum - currentPage) <= 2;
                      const isFirst = pageNum === 1;
                      const isLast = pageNum === totalPages;
                      const shouldShow = isNearCurrent || isFirst || isLast;

                      if (!shouldShow) {
                        if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                          return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-semibold transition-all",
                            isCurrentPage
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-110"
                              : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 hover:scale-105"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* التالي */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* معلومات إضافية */}
                <div className="text-center mt-3 text-sm text-gray-500">
                  عرض {startIndex + 1} - {Math.min(endIndex, regularArticles.length)} من أصل {regularArticles.length} مقال
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* رسالة عدم و��ود نتائج */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد مقالات
          </h3>
          <p className="text-gray-500">
            جرب تغيير كلمات البحث أو التصنيف المختار
          </p>
        </div>
      )}
    </div>
  );
}
