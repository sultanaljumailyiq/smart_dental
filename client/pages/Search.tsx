import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  Filter,
  X,
  Clock,
  TrendingUp,
  Star,
  Eye,
  Heart,
  ShoppingBag,
  BookOpen,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for search results
const mockResults = {
  products: [
    {
      id: 1,
      title: "جهاز تبييض الأسنان المنزلي",
      description: "جهاز متطور لتبييض الأسنان ��ي المنزل بأمان",
      price: "299 ر.س",
      image:
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300&h=200&fit=crop",
      rating: 4.8,
      category: "معدات",
      inStock: true,
    },
    {
      id: 2,
      title: "فرشاة أسنان كهربائية ذكية",
      description: "فرشاة أسنان كهربائية مع تطبيق ذكي",
      price: "149 ر.س",
      image:
        "https://images.unsplash.com/photo-1576091160549-2173dba999ef?w=300&h=200&fit=crop",
      rating: 4.6,
      category: "عناية",
      inStock: true,
    },
  ],
  articles: [
    {
      id: 1,
      title: "أحدث تقنيات زراعة الأسنان",
      description: "تعرف على أحدث التقنيات في مجال زراعة الأسنان",
      author: "د. أحمد محمد",
      readTime: "5 دقائق",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
      category: "تقنيات",
    },
    {
      id: 2,
      title: "العناية بالأسنان في رمضان",
      description: "نصائح مهمة للعناية بالأسنان خلال شهر رمضان",
      author: "د. فاطمة علي",
      readTime: "3 دقائق",
      image:
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300&h=200&fit=crop",
      category: "نصائح",
    },
  ],
  professionals: [
    {
      id: 1,
      name: "د. سارة الأحمد",
      specialty: "جراحة الفم والفكين",
      location: "الرياض",
      rating: 4.9,
      experience: "15 سنة",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "د. محمد العراقي",
      specialty: "تقويم الأسنان",
      location: "جدة",
      rating: 4.8,
      experience: "12 سنة",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    },
  ],
  jobs: [
    {
      id: 1,
      title: "طبيب أسنان عام",
      company: "مجمع الطبي المتقدم",
      location: "الرياض",
      salary: "15,000 - 20,000 ر.س",
      type: "دوام كامل",
      posted: "منذ يومين",
    },
    {
      id: 2,
      title: "أخصائي تقويم أسنان",
      company: "عيادة الابتسامة",
      location: "الدمام",
      salary: "18,000 - 25,000 ر.س",
      type: "دوام كامل",
      posted: "منذ 3 أيام",
    },
  ],
};

const popularSearches = [
  "زراعة الأسنان",
  "تبييض الأسنان",
  "تقويم الأسنان",
  "علاج العصب",
  "طقم الأسنان",
  "فرشاة كهربائية",
  "غسول الفم",
  "حشوات الأسنان",
];

const categories = [
  { id: "all", label: "الكل", icon: SearchIcon },
  { id: "products", label: "المنتجات", icon: ShoppingBag },
  { id: "articles", label: "المقالات", icon: BookOpen },
  { id: "professionals", label: "الأطباء", icon: Users },
  { id: "jobs", label: "ال��ظائف", icon: Briefcase },
];

export default function Search() {
  const { language } = useI18n();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "زراعة الأسنان",
    "فرشاة كهربائية",
    "تبييض",
  ]);

  const handleSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches((prev) =>
      prev.filter((search) => search !== searchToRemove),
    );
  };

  const renderResults = () => {
    if (!searchQuery.trim()) return null;

    return (
      <div className="space-y-6">
        {(selectedCategory === "all" || selectedCategory === "products") && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              المنتجات ({mockResults.products.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {mockResults.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedCategory === "all" || selectedCategory === "articles") && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              المقالات ({mockResults.articles.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {mockResults.articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(selectedCategory === "all" ||
          selectedCategory === "professionals") && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              الأطباء ({mockResults.professionals.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {mockResults.professionals.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {doctor.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                        <span>•</span>
                        <span>{doctor.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedCategory === "all" || selectedCategory === "jobs") && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              الوظائف ({mockResults.jobs.length})
            </h3>
            <div className="grid gap-4">
              {mockResults.jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <span className="text-sm text-gray-500">{job.posted}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {job.salary}
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      التقديم
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 with-floating-nav"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن المنتجات، المقالات، الأطباء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results or Default Content */}
        {searchQuery.trim() ? (
          renderResults()
        ) : (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    البحثات الأخيرة
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    مسح الكل
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <button
                        onClick={() => handleSearch(search)}
                        className="flex-1 text-left"
                      >
                        {search}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                البحثات الشائعة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-3 rounded-lg text-sm font-medium text-gray-700 transition-colors text-center"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                روابط سريعة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/dental-supply"
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    المتجر
                  </span>
                </Link>
                <Link
                  to="/education"
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    التعليم
                  </span>
                </Link>
                <Link
                  to="/community/experts"
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    الخبراء
                  </span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    الوظائف
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
