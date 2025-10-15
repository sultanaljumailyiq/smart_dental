import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Eye,
  ShoppingCart,
  Grid3X3,
  List,
  Search,
  Timer,
  Heart,
  TrendingUp,
  Flame,
  Sparkles,
  Crown,
  Zap,
  Gift,
  Tag,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import CategoryProductsStrip from "@/components/CategoryProductsStrip";

// بيانات المنتجات للأقسام المخ��لفة
const featuredProducts = [
  {
    id: 1,
    name: "Premium Ceramic Brackets",
    arabicName: "حاصرات السيراميك المتميزة",
    price: 1200000,
    originalPrice: 1500000,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 145,
    category: "تقويم أسنان",
    brand: "OrthoElite",
    discount: 20,
    featured: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Digital Impression Scanner",
    arabicName: "ماسح الطبعات الرقمية",
    price: 8500000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 67,
    category: "معدات رقمية",
    brand: "TechDental",
    featured: true,
    inStock: true,
  },
];

const flashDeals = [
  {
    id: 3,
    name: "Ultimate Dental Care Package",
    arabicName: "حزمة ال��ناية الشاملة بالأسنان",
    price: 599000,
    originalPrice: 850000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 189,
    category: "حزم متكاملة",
    brand: "DentalCare Pro",
    discount: 30,
    timeLeft: "2 أيام 5 ساعات",
    inStock: true,
  },
  {
    id: 4,
    name: "Professional Whitening Kit",
    arabicName: "طقم التبييض المهني",
    price: 224000,
    originalPrice: 320000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 134,
    category: "تبييض",
    brand: "WhitePro",
    discount: 30,
    timeLeft: "5 ساعات 23 دقيقة",
    inStock: true,
  },
];

const newArrivals = [
  {
    id: 5,
    name: "3D Dental Printer",
    arabicName: "طابعة الأسنان ثلاثية الأبعاد",
    price: 18000000,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 28,
    category: "طابعات ثلا��ية الأبعاد",
    brand: "Print3D",
    isNew: true,
    inStock: true,
  },
  {
    id: 6,
    name: "AI-Powered Diagnostic Tool",
    arabicName: "أداة التشخيص بالذكاء الاصطناعي",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 34,
    category: "أدوات تشخيص",
    brand: "AI-Dental",
    isNew: true,
    inStock: true,
  },
];

const specialOffers = [
  {
    id: 7,
    name: "Sterilization Equipment Bundle",
    arabicName: "حزمة معدات التعقيم",
    price: 1260000,
    originalPrice: 1800000,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 62,
    category: "تعقيم",
    brand: "SteriliTech",
    discount: 30,
    inStock: true,
  },
];

// التبويبات
const offerTabs = [
  {
    id: "featured",
    label: "المنتجات المميزة",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    badge: "⭐",
    description: "منتجات مختارة بعناية",
  },
  {
    id: "flash",
    label: "عروض البرق",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    badge: "⚡",
    description: "عروض لفترة محدودة",
  },
  {
    id: "new",
    label: "وصل حديثاً",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-500",
    badge: "🆕",
    description: "أحدث المنتجات",
  },
  {
    id: "special",
    label: "العروض الخاصة",
    icon: Gift,
    color: "from-green-500 to-emerald-500",
    badge: "🎁",
    description: "خصو��ات حصرية",
  },
];

// البطاقات الترويجية
const promoCards = [
  {
    id: 1,
    title: "خصم خاص للأطباء الجدد",
    subtitle: "احصل على خصم 25% على طلبك الأول",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
    gradient: "from-blue-600 to-purple-600",
    buttonText: "احصل على الخصم",
  },
  {
    id: 2,
    title: "شحن مجاني لجميع الطلبات",
    subtitle: "على جميع الطلبات أكثر من 500,000 د.ع",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=200&fit=crop",
    gradient: "from-green-600 to-teal-600",
    buttonText: "تسوق الآن",
  },
];

export default function Offers() {
  const [activeTab, setActiveTab] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { addItem: addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // الحصول على المنتجات حسب التبويب النشط
  const getActiveProducts = () => {
    switch (activeTab) {
      case "featured":
        return featuredProducts;
      case "flash":
        return flashDeals;
      case "new":
        return newArrivals;
      case "special":
        return specialOffers;
      default:
        return featuredProducts;
    }
  };

  const activeProducts = getActiveProducts();
  const filteredProducts = activeProducts.filter((product) =>
    product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {product.featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Crown className="w-3 h-3" />
            مميز
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            جديد
          </div>
        )}

        {product.timeLeft && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {product.timeLeft}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => toggleFavorite(product)}
            className={cn(
              "w-7 h-7 shadow-md rounded-full flex items-center justify-center transition-colors",
              isFavorite(product.id)
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500",
            )}
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <Link
            to={`/dental-supply/product/${product.id}`}
            className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gray-600 hover:text-blue-500" />
          </Link>
        </div>
      </div>

      {/* Product Info - Compact */}
      <div className="p-2">
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-xs mb-1 line-clamp-1 leading-tight">
          {product.arabicName}
        </h3>

        {/* Rating - Compact */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price and Cart Button - Ultra Compact */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-900">
            {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            className={cn(
              "p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors",
              isInCart(product.id) && "bg-green-500",
            )}
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const PromoCard = ({ promo }: { promo: any }) => (
    <div
      className={cn(
        "relative mb-8 h-32 rounded-2xl overflow-hidden bg-gradient-to-r",
        promo.gradient,
      )}
    >
      <div className="absolute inset-0">
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 h-full flex items-center p-6">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">{promo.title}</h3>
          <p className="text-white/90 text-sm mb-3">{promo.subtitle}</p>
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
            {promo.buttonText}
          </button>
        </div>
      </div>
    </div>
  );

  const activeTabInfo = offerTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen p-6 lg:mb-0 mb-16" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 lg:mb-2 mb-0">
              <div
                className={cn(
                  "p-2 bg-gradient-to-r rounded-xl",
                  activeTabInfo?.color || "from-purple-600 to-blue-600",
                )}
              >
                {activeTabInfo?.icon && (
                  <activeTabInfo.icon className="w-6 h-6 text-white" />
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                العروض والخصو��ات
              </h1>
              <span
                className={cn(
                  "text-white px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r",
                  activeTabInfo?.color || "from-purple-600 to-blue-600",
                )}
              >
                {activeTabInfo?.badge || "🎯"} {activeTabInfo?.description}
              </span>
            </div>
            <p className="text-gray-600">
              اكتشف أفضل العروض والخصومات على منتجات طب الأسنان
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في العروض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right text-sm"
              />
            </div>

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

      {/* Horizontal Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin lg:gap-2 gap-2 sm:flex sm:flex-row sm:overflow-auto">
          {offerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 lg:gap-3 gap-1",
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className="text-sm">{tab.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Promotional Cards */}
      {activeTab === "featured" && (
        <div className="mb-8">
          <PromoCard promo={promoCards[0]} />
        </div>
      )}

      {activeTab === "flash" && (
        <div className="mb-8">
          <PromoCard promo={promoCards[1]} />
        </div>
      )}

      {/* Products Grid - Horizontal Scroll with 3 visible items on mobile */}
      <div className="unified-product-grid product-scroll-enhanced lg:gap-6 mb-16">
        {filteredProducts.map((product) => (
          <UnifiedProductCard
            key={product.id}
            product={product as any}
            compact
            showProgressBar={Boolean((product as any).timeLeft)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
        </div>
      )}

      {/* Category Products Sections */}
      {searchQuery === "" && (
        <div className="mt-8 space-y-6">
          <CategoryProductsStrip
            categoryName="General Dentistry"
            title="منتجات طب الأسنان العام بعروض خاصة"
          />
          <CategoryProductsStrip
            categoryName="Orthodontics"
            title="عروض تقويم الأسنان"
          />
        </div>
      )}
    </div>
  );
}
