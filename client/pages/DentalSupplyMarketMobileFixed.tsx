import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowRight,
  Search,
  X,
  Gift,
  Package,
  Truck,
  Award,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFeaturedProducts,
  getNewProducts,
  getDiscountedProducts,
  getRandomProducts,
  searchProducts,
} from "@/data/dentalProducts";

// Mobile-first promotional banners
const promoSlides = [
  {
    id: 1,
    title: "عروض خاصة",
    subtitle: "خصم 50%",
    buttonText: "تسوق الآن",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=300&fit=crop",
    gradient: "from-purple-600 to-blue-600",
    badge: "توفير 50%",
  },
  {
    id: 2,
    title: "معدات حديثة",
    subtitle: "تكنولوجيا متقدمة",
    buttonText: "اكتشف",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=300&fit=crop",
    gradient: "from-blue-600 to-indigo-600",
    badge: "جديد",
  },
];

// Mobile-optimized categories
const categories = [
  { id: "1", name: "أدوات الأسنان", icon: "🦷", count: 150, color: "bg-blue-500" },
  { id: "2", name: "حشوات الأسنان", icon: "🔧", count: 89, color: "bg-purple-500" },
  { id: "3", name: "معدات التنظيف", icon: "🧽", count: 67, color: "bg-green-500" },
  { id: "4", name: "أجهزة الأشعة", icon: "📱", count: 45, color: "bg-orange-500" },
  { id: "5", name: "معدات التعقيم", icon: "🧼", count: 78, color: "bg-teal-500" },
  { id: "6", name: "مواد التجميل", icon: "✨", count: 123, color: "bg-pink-500" },
];

import UnifiedProductCard from "@/components/UnifiedProductCard";

// Mobile Category Card
const MobileCategoryCard = ({ category }: any) => {
  return (
    <Link
      to={`/dental-supply/category/${category.id}`}
      className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 w-24"
    >
      <div className="text-center">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-2 mx-auto", category.color)}>
          <span className="text-2xl">{category.icon}</span>
        </div>
        <h3 className="font-semibold text-xs text-gray-900 mb-1 leading-tight">{category.name}</h3>
        <p className="text-xs text-gray-500">{category.count}</p>
      </div>
    </Link>
  );
};

// Mobile Section Header
const MobileSectionHeader = ({ title, subtitle, viewAllLink }: any) => {
  return (
    <div className="flex items-center justify-between mb-4 w-full">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 flex-shrink-0"
        >
          عرض الكل
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
};

export default function DentalSupplyMarketMobileFixed() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Get product data
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewProducts();
  const flashDealsProducts = getDiscountedProducts();
  const trendingProducts = getRandomProducts(20);

  // Enhanced products with mobile-optimized data
  const enhancedProducts = featuredProducts.slice(0, 20).map((product, index) => ({
    id: String(product.id || `product-${index}`),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    rating: product.rating || (4.2 + Math.random() * 0.8),
    discount: product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined,
    isNew: index < 3,
  }));

  // Auto-changing banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchProducts(searchQuery);
      setSearchResults(results.slice(0, 8));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden" dir="rtl" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتجات طب الأسنان..."
            className="w-full pr-10 pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-3 right-3 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/dental-supply/product/${product.id}`}
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-green-600 font-bold text-sm">${product.price}</div>
              </Link>
            ))}
            <Link
              to="/dental-supply/products"
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="block p-3 text-center text-purple-600 font-semibold text-sm hover:bg-purple-50"
            >
              عرض جميع النتائج
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Hero Banner */}
      <div className="relative h-48 mb-4 mx-3 mt-3 rounded-2xl overflow-hidden" style={{ maxWidth: 'calc(100vw - 24px)' }}>
        <div className="absolute inset-0 w-full h-full">
          <img
            src={promoSlides[currentSlide].image}
            alt={promoSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r opacity-80", promoSlides[currentSlide].gradient)} />
        </div>

        <div className="relative z-10 h-full flex items-center p-6">
          <div className="max-w-sm">
            <div className="mb-3">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                {promoSlides[currentSlide].badge}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
              {promoSlides[currentSlide].title}
            </h1>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              {promoSlides[currentSlide].subtitle}
            </p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-all duration-300 shadow-lg">
              {promoSlides[currentSlide].buttonText}
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-6 flex gap-2">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          <Link
            to="/dental-supply/offers"
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Gift className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-sm text-center">العروض</span>
          </Link>

          <Link
            to="/dental-supply/products"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Package className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-sm text-center">المنتجات</span>
          </Link>

          <Link
            to="/dental-supply/suppliers"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Truck className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-sm text-center">الموردين</span>
          </Link>

          <Link
            to="/dental-supply/brands"
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Award className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-sm text-center">العلامات التجارية</span>
          </Link>

          <Link
            to="/dental-supply/students"
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <GraduationCap className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-sm text-center">طلاب طب الأسنان</span>
          </Link>
        </div>
      </div>

      {/* Mobile Categories */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <MobileSectionHeader 
          title="التصنيفات" 
          subtitle="تسوق حسب التخصص"
          viewAllLink="/dental-supply/categories"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%' }}>
          {categories.map((category) => (
            <MobileCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <MobileSectionHeader 
          title="⚡ عروض البرق" 
          subtitle="لفترة محدودة فقط"
          viewAllLink="/dental-supply/flash-deals"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%' }}>
          {flashDealsProducts.slice(0, 15).map((product, index) => (
            <div key={`flash-${index}`} className="flex-shrink-0 w-32">
              <UnifiedProductCard
                product={{
                  ...product,
                  id: `flash-${index}`,
                  arabicName: product.name,
                  discount: 25 + Math.floor(Math.random() * 25),
                  originalPrice: product.price * 1.4,
                  rating: 4 + Math.random(),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <MobileSectionHeader 
          title="⭐ المنتجات المميزة" 
          subtitle="الأكثر شعبية"
          viewAllLink="/dental-supply/featured"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%' }}>
          {enhancedProducts.slice(0, 15).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-32">
              <UnifiedProductCard
                product={{
                  ...product,
                  arabicName: product.name,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <MobileSectionHeader 
          title="✨ وصل حديثاً" 
          subtitle="أحدث المنتجات"
          viewAllLink="/dental-supply/new-arrivals"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%' }}>
          {newArrivals.slice(0, 15).map((product, index) => (
            <div key={`new-${index}`} className="flex-shrink-0 w-32">
              <UnifiedProductCard
                product={{
                  ...product,
                  id: `new-${index}`,
                  arabicName: product.name,
                  isNew: true,
                  rating: 4 + Math.random(),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="w-full px-3 mb-6" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        <MobileSectionHeader 
          title="🔥 الأكثر طلباً" 
          subtitle="الأعلى مبيعاً"
          viewAllLink="/dental-supply/trending"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%' }}>
          {trendingProducts.slice(0, 15).map((product, index) => (
            <div key={`trending-${index}`} className="flex-shrink-0 w-32">
              <UnifiedProductCard
                product={{
                  ...product,
                  id: `trending-${index}`,
                  arabicName: product.name,
                  rating: 4.5 + Math.random() * 0.5,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20 w-full"></div>
    </div>
  );
}