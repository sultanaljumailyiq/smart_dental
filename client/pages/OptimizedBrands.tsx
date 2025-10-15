import React, { useState, useMemo } from "react";
import { Search, Grid3X3, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import CompactBrandCard from "@/components/CompactBrandCard";

// Sample brands data
const brandsData = [
  {
    id: "1",
    name: "AquaDent",
    arabicName: "أكوا دنت",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    country: "Germany",
    arabicCountry: "ألمانيا",
    description: "علامة تجارية رائدة في معدات طب الأسنان المتقدمة",
    productCount: 156,
    featured: true,
  },
  {
    id: "2",
    name: "BrightSmile",
    arabicName: "ابتسامة مشرقة",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
    country: "USA",
    arabicCountry: "الولايات المتحدة",
    description: "تقنيات متطورة لتبييض وعلاج الأسنان",
    productCount: 89,
    featured: false,
  },
  {
    id: "3",
    name: "ClearAlign",
    arabicName: "كلير ألاين",
    logo: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100&h=100&fit=crop",
    country: "Switzerland",
    arabicCountry: "سويسرا",
    description: "أفضل حلول تقويم الأسنان والعضة",
    productCount: 234,
    featured: true,
  },
  {
    id: "4",
    name: "DentalCare Pro",
    arabicName: "العناية المتقدمة",
    logo: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=100&h=100&fit=crop",
    country: "Japan",
    arabicCountry: "اليابان",
    description: "منتجات العناية والحماية للأسنان",
    productCount: 67,
    featured: false,
  },
  {
    id: "5",
    name: "EliteDental",
    arabicName: "إليت دنتال",
    logo: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop",
    country: "Sweden",
    arabicCountry: "السويد",
    description: "تقنيات رقمية متطورة للتشخيص والعلاج",
    productCount: 123,
    featured: false,
  },
  {
    id: "6",
    name: "FlexiDent",
    arabicName: "فليكسي دنت",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop",
    country: "France",
    arabicCountry: "فرنسا",
    description: "متخصصون في تبييض الأسنان الآمن",
    productCount: 45,
    featured: false,
  },
  {
    id: "7",
    name: "GentleCare",
    arabicName: "جنتل كير",
    logo: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100&h=100&fit=crop",
    country: "Canada",
    arabicCountry: "كندا",
    description: "منتجات لطيفة للعناية بالأسنان الحساسة",
    productCount: 78,
    featured: true,
  },
  {
    id: "8",
    name: "HygieneMax",
    arabicName: "هايجين ماكس",
    logo: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop",
    country: "Netherlands",
    arabicCountry: "هولندا",
    description: "حلول النظافة والتعقيم المتقدمة",
    productCount: 134,
    featured: false,
  },
  {
    id: "9",
    name: "InnovaDent",
    arabicName: "إنوفا دنت",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop",
    country: "Italy",
    arabicCountry: "إيطاليا",
    description: "ابتكارات حديثة في طب الأسنان",
    productCount: 167,
    featured: true,
  },
  {
    id: "10",
    name: "JetClean",
    arabicName: "جيت كلين",
    logo: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=100&h=100&fit=crop",
    country: "South Korea",
    arabicCountry: "كوريا الجنوبية",
    description: "تقنيات التنظيف بالضغط العالي",
    productCount: 92,
    featured: false,
  },
  {
    id: "11",
    name: "KlearBrace",
    arabicName: "كلير بريس",
    logo: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop",
    country: "Australia",
    arabicCountry: "أستراليا",
    description: "أقواس شفافة للتقويم الغير مرئي",
    productCount: 56,
    featured: false,
  },
  {
    id: "12",
    name: "LuminaWhite",
    arabicName: "لومينا وايت",
    logo: "https://images.unsplash.com/photo-1606166187734-a4cb973c9b6a?w=100&h=100&fit=crop",
    country: "Denmark",
    arabicCountry: "الدنمارك",
    description: "منتجات التبييض الآمنة والفعالة",
    productCount: 84,
    featured: true,
  },
];

// English alphabet for filtering
const englishAlphabet = [
  "All",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export default function OptimizedBrands() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter brands
  const filteredBrands = useMemo(() => {
    let filtered = brandsData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (brand) =>
          brand.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by letter
    if (selectedLetter !== "All") {
      filtered = filtered.filter((brand) =>
        brand.name.toUpperCase().startsWith(selectedLetter.toUpperCase()),
      );
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter((brand) => brand.featured);
    }

    return filtered;
  }, [searchQuery, selectedLetter, showFeaturedOnly]);

  return (
    <div className="min-h-screen p-4 lg:p-6 lg:mb-0 mb-20" dir="rtl">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              العلامات التجارية
            </h1>
            <p className="text-gray-600">
              اكتشف أفضل العلامات التجارية في مجال طب الأسنان
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن علامة تجارية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right text-sm"
              />
            </div>

            {/* Featured Filter */}
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors",
                showFeaturedOnly
                  ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                  : "bg-white border-gray-200 hover:bg-gray-50",
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">المميزة فقط</span>
            </button>

            {/* View Mode */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {viewMode === "grid" ? (
                <>
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">قائمة</span>
                </>
              ) : (
                <>
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">شبكة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alphabetical Filter */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            تصفح حسب الحرف الأول (English)
          </h3>
          <div className="flex flex-wrap gap-2">
            {englishAlphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-w-[2.5rem]",
                  selectedLetter === letter
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          عرض {filteredBrands.length} من {brandsData.length} علامة تجارية
        </p>
      </div>

      {/* Brands Grid */}
      <div
        className={cn(
          "gap-4 lg:gap-6",
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
            : "grid grid-cols-1 lg:grid-cols-2",
        )}
      >
        {filteredBrands.map((brand) => (
          <CompactBrandCard
            key={brand.id}
            brand={brand}
            className={
              viewMode === "list"
                ? "lg:flex lg:flex-row lg:items-center lg:p-4"
                : ""
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توج�� علامات تجارية
          </h3>
          <p className="text-gray-600">
            جرب البحث بكلمات مختلفة أو غير المرشحات
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedLetter("All");
              setShowFeaturedOnly(false);
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      )}
    </div>
  );
}
