import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Star,
  TrendingUp,
  Package,
  Search,
  Grid3X3,
  List,
  Globe,
  MapPin,
  Calendar,
  Users,
  Crown,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample brands data
const brands = [
  {
    id: 1,
    name: "3M ESPE",
    arabicName: "ثري إم إيسبي",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 567,
    productsCount: 120,
    country: "الولايات المتحدة",
    established: 1902,
    specialities: ["مواد الترميم", "التركيبات", "المواد اللاصقة"],
    description: "الرائدة عالمياً في مواد طب الأسنان والحلول المبتكرة",
    verified: true,
    premium: true,
    growth: "+15%",
    popularity: 95,
  },
  {
    id: 2,
    name: "Dentsply Sirona",
    arabicName: "دينتسبلاي سيرونا",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 434,
    productsCount: 89,
    country: "ألمانيا",
    established: 1899,
    specialities: ["معدات رقمية", "زراعة الأسنان", "تقويم الأسنان"],
    description: "شركة رائدة في التقنيات الرقمية لطب الأسنان",
    verified: true,
    premium: true,
    growth: "+22%",
    popularity: 92,
  },
  {
    id: 3,
    name: "Ivoclar Vivadent",
    arabicName: "إيفوكلار فيفادنت",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
    rating: 4.7,
    reviewCount: 298,
    productsCount: 75,
    country: "سويسرا",
    established: 1923,
    specialities: ["السيراميك", "التبييض", "طب الأسنان التجميلي"],
    description: "متخصصون في المواد عالية الجودة لطب الأسنان التجميلي",
    verified: true,
    premium: true,
    growth: "+18%",
    popularity: 88,
  },
  {
    id: 4,
    name: "Straumann",
    arabicName: "شتراومان",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h-200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 389,
    productsCount: 45,
    country: "سويسرا",
    established: 1954,
    specialities: ["زراعة الأسنان", "التجديد", "الحلول الرقمية"],
    description: "الرائدة عالمياً في حلول زراعة الأسنان والتجديد",
    verified: true,
    premium: true,
    growth: "+28%",
    popularity: 94,
  },
  {
    id: 5,
    name: "Kerr Corporation",
    arabicName: "كير كوربوريشن",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&fit=crop",
    rating: 4.6,
    reviewCount: 234,
    productsCount: 68,
    country: "الولايات المتحدة",
    established: 1891,
    specialities: ["أدوات القطع", "مواد الحشو", "التعقيم"],
    description: "خبرة أكثر من 130 عاماً في تطوير منتجات طب الأسنان",
    verified: true,
    premium: false,
    growth: "+12%",
    popularity: 85,
  },
  {
    id: 6,
    name: "GC Corporation",
    arabicName: "جي سي كوربوريشن",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=200&fit=crop",
    rating: 4.5,
    reviewCount: 187,
    productsCount: 52,
    country: "اليابان",
    established: 1921,
    specialities: ["الزجاج الأيونومري", "المواد الوقائية", "التبييض"],
    description: "ابتكار مستمر في مواد طب الأسنان الوقائية والترميمية",
    verified: true,
    premium: false,
    growth: "+9%",
    popularity: 78,
  },
];

export default function Brands() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");

  const BrandCard = ({ brand }: { brand: any }) => (
    <Link
      to={`/brand/${brand.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden p-3 block"
    >
      {/* Horizontal Layout: Image + Info Side by Side */}
      <div className="flex items-center gap-3">
        {/* Brand Logo */}
        <div className="w-12 h-12 bg-gray-50 rounded-lg relative overflow-hidden flex-shrink-0">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {brand.verified && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
        </div>

        {/* Brand Info - Next to Image */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1 leading-tight group-hover:text-purple-600 transition-colors">
            {brand.arabicName}
          </h3>
          <p className="text-xs text-gray-500 mb-1 truncate">{brand.country}</p>
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {brand.productsCount} منتج
            </div>
            {brand.specialities && brand.specialities.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                {brand.specialities[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "premium" && brand.premium) ||
      (filterType === "verified" && brand.verified);
    return matchesSearch && matchesFilter;
  });

  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity;
      case "rating":
        return b.rating - a.rating;
      case "products":
        return b.productsCount - a.productsCount;
      case "established":
        return a.established - b.established;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen p-6" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                العلامات التجارية
              </h1>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                🏆 عالمية
              </span>
            </div>
            <p className="text-gray-600">
              أشهر وأفضل العلامات التجارية في مجال طب الأسنان
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في العلامات التجارية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">جميع العلامات</option>
              <option value="premium">بريميوم فقط</option>
              <option value="verified">موثقة فقط</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="popularity">الأكثر شعبية</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="products">الأكثر منتجات</option>
              <option value="established">الأقدم تأسيساً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brands Grid - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {sortedBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">���</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد علامات تجارية
          </h3>
          <p className="text-gray-600">
            جرب تغيير الفلاتر أو البحث بكلمات مختلفة
          </p>
        </div>
      )}
    </div>
  );
}
