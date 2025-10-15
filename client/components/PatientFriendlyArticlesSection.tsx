import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Heart,
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
import { UserRole, isPatient } from "@shared/permissions";

interface PatientFriendlyArticlesSectionProps {
  userRole?: UserRole;
}

// بيانات المقالات التجريبية - نفس الب��انات مع إخفاء معلومات الناشر للمرضى
const articlesData = [
  {
    id: 1,
    title: "أهمية العناية بصحة الأسنان يومياً",
    excerpt:
      "تعرف على الطرق الصحيحة للعناية بأسنانك وحمايتها من التسوس والأمراض",
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
    excerpt:
      "دليل شامل للتغذية الصحية وكيفية اختيار الأطعمة المناسبة لصحة أفضل",
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
    excerpt: "نصائح عملية للتخلص من القلق والتوتر وتحسين الصحة النفسية",
    category: "الصحة النفسية",
    author: "د. محمد الزهراني",
    publishDate: "2024-01-13",
    readTime: "6 دق��ئق",
    views: 1890,
    likes: 234,
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 4,
    title: "أساسيات الرياضة للمبتدئين",
    excerpt:
      "تعرف على أفضل التمارين الرياضية للمبتدئين وكيفية البدء بروتين صحي",
    category: "اللياقة البدنية",
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
    title: "نصائح للنوم الصحي",
    excerpt:
      "تعرف على أهمية النوم الجيد وكيفية تحسين جودة نومك للحصول على راحة أفضل",
    category: "نمط الحياة",
    author: "د. خالد النوم",
    publishDate: "2024-01-10",
    readTime: "4 دقائق",
    views: 1100,
    likes: 76,
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
];

export default function PatientFriendlyArticlesSection({
  userRole = "patient",
}: PatientFriendlyArticlesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [filteredArticles, setFilteredArticles] = useState(articlesData);
  const [showFilters, setShowFilters] = useState(false);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);
  const { language } = useI18n();

  const currentUserIsPatient = isPatient(userRole);

  // تصفية المقالات
  useEffect(() => {
    let filtered = articlesData;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory,
      );
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory]);

  const handleLike = (articleId: number) => {
    setLikedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId],
    );
  };

  const ArticleCard = ({
    article,
    featured = false,
  }: {
    article: any;
    featured?: boolean;
  }) => (
    <div
      className={cn(
        "group relative rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100",
        featured 
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ring-2 ring-purple-500/20 shadow-md"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50",
      )}
    >
      <Link to={`/articles/${article.id}`} className="absolute inset-0 z-10" aria-label={article.title} />
      {/* صورة المقال */}
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              مميز
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
            {article.category}
          </span>
        </div>
      </div>

      {/* محتوى المقال */}
      <div className="p-3">
        {/* العنوان */}
        <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {article.title}
        </h3>

        {/* المقطع */}
        <p className="text-gray-600 text-xs mb-0 line-clamp-2">
          {article.excerpt}
        </p>

        {/* معلومات إضافية - مخفية للمرضى */}
        <div className="hidden">
          <div className="flex items-center gap-4">
            {/* وقت القراءة */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>

            {/* تاريخ النشر */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(article.publishDate).toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>

          {/* معلومات الناشر - مخفية للمرضى */}
          {!currentUserIsPatient && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>بواسطة {article.author}</span>
              <span>{article.views.toLocaleString()} مشاهدة</span>
            </div>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="hidden">
          <Link
            to={`/articles/${article.id}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm group/link"
          >
            <span>اقرأ المزيد</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            {/* زر الإعجاب */}
            <button
              onClick={() => handleLike(article.id)}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all",
                likedArticles.includes(article.id)
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600",
              )}
            >
              <Heart
                className={cn(
                  "w-3 h-3",
                  likedArticles.includes(article.id) && "fill-current",
                )}
              />
              {!currentUserIsPatient && (
                <span>
                  {article.likes + (likedArticles.includes(article.id) ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* البحث */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث في المقالات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* فلتر الفئات */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[140px]"
          >
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">{selectedCategory}</span>
          </button>

          {showFilters && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(false);
                  }}
                  className={cn(
                    "w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                    selectedCategory === category &&
                      "bg-purple-50 text-purple-600 font-medium",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* المقالات المميزة */}
      {selectedCategory === "الكل" && searchTerm === "" && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              المقالات المميزة
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 mb-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {filteredArticles
              .filter((article) => article.featured)
              .slice(0, 3)
              .map((article) => (
                <div key={article.id} className="min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-start"><ArticleCard article={article} featured /></div>
              ))}
          </div>
        </div>
      )}

      {/* جميع المقالات */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "الكل"
                ? "جميع المقالات"
                : `مقالات ${selectedCategory}`}
            </h2>
          </div>

          {filteredArticles.length > 0 && (
            <span className="text-sm text-gray-500">
              {filteredArticles.length} مقال
            </span>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {filteredArticles.map((article) => (
              <div key={article.id} className="min-w-[240px] sm:min-w-[300px] md:min-w-0 snap-start"><ArticleCard article={article} /></div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد مقالات
            </h3>
            <p className="text-gray-500">
              لم نجد أي مقالات تطابق بحثك. جرب كلمات مختلفة أو اختر فئة أخرى.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
