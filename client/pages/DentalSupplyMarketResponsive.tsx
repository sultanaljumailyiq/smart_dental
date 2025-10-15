import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Filter,
  Star,
  Grid3X3,
  List,
  ArrowRight,
  Plus,
  Zap,
  Gift,
  Clock,
  Eye,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Percent,
  Timer,
  PlayCircle,
  Package,
  Heart,
  Menu,
  X,
  Search,
  ShoppingCart,
  Home,
  Award,
  Truck,
  CreditCard,
  Phone,
  Tag,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import SmartProductGrid from "@/components/SmartProductGrid";
import CompactSuppliersSection from "@/components/CompactSuppliersSection";
import SmartCategoriesNavigation from "@/components/SmartCategoriesNavigation";
import SmartProductsGrid from "@/components/SmartProductsGrid";
import MobileProductGrid from "@/components/MobileProductGrid";
import PromoCard from "@/components/PromoCard";
import HorizontalProductScroll from "@/components/HorizontalProductScroll";
import CategoryStrip from "@/components/CategoryStrip";
import {
  dentalProducts,
  getFeaturedProducts,
  getNewProducts,
  getDiscountedProducts,
  getRandomProducts,
} from "@/data/dentalProducts";

// Promotional banners data
const promoSlides = [
  {
    id: 1,
    title: "عروض خاصة على منتجات طب الأسنان",
    subtitle: "خصومات تصل ��لى 50% على ��ستلزمات ط�� الأسنان",
    buttonText: "تسوق الآن",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=400&fit=crop",
    gradient: "from-purple-600 to-blue-600",
    badge: "توفير 50%",
  },
  {
    id: 2,
    title: "أحدث معدات طب الأسنان",
    subtitle: "تكنولوجيا متقد��ة لعيادات أسنان عصرية",
    buttonText: "اكتشف المزيد",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    gradient: "from-blue-600 to-indigo-600",
    badge: "جديد",
  },
  {
    id: 3,
    title: "مستلزمات التعقيم والنظافة",
    subtitle: "أفضل منتجات التعقيم ل��ماية مرضاك",
    buttonText: "شراء الآن",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&h=400&fit=crop",
    gradient: "from-green-600 to-teal-600",
    badge: "الأ����ر مبيعاً",
  },
];

// Categories data
const categories = [
  {
    name: "General Dentistry",
    arabicName: "طب الأسنان الع��م",
    icon: "🦷",
    productsCount: 2450,
    bgColor: "from-blue-500 to-cyan-600",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
  },
  {
    name: "Orthodontics",
    arabicName: "تقويم الأسنان",
    icon: "🔧",
    productsCount: 1650,
    bgColor: "from-purple-500 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
  },
  {
    name: "Oral Surgery",
    arabicName: "جراحة الفم",
    icon: "⚕️",
    productsCount: 890,
    bgColor: "from-red-500 to-rose-600",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
  },
  {
    name: "Preventive Care",
    arabicName: "الرعاية الوقائية",
    icon: "������️",
    productsCount: 1340,
    bgColor: "from-green-500 to-emerald-600",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop",
  },
  {
    name: "Endodontics",
    arabicName: "علاج العصب",
    icon: "🔬",
    productsCount: 780,
    bgColor: "from-yellow-500 to-orange-600",
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=200&fit=crop",
  },
  {
    name: "Prosthetics",
    arabicName: "التركيبات",
    icon: "🦷",
    productsCount: 1120,
    bgColor: "from-indigo-500 to-purple-600",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=200&fit=crop",
  },
];

const quickFilters = [
  { label: "جميع المنتجات", value: "all", active: true },
  { label: "الأكثر مبيعاً", value: "bestseller", active: false },
  { label: "الأحدث", value: "newest", active: false },
  { label: "أقل سعر", value: "price_low", active: false },
  { label: "أعلى تقييم", value: "rating", active: false },
];

export default function DentalSupplyMarketResponsive() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const isMobile = useIsMobile();

  // Get real product data
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewProducts();
  const flashDealsProducts = getDiscountedProducts();
  const mostDemanded = getRandomProducts(8);

  // Smart Categories Data
  const smartCategories = [
    {
      id: "1",
      name: "أدوا�� الأسنان",
      icon: "🦷",
      slug: "dental-tools",
      count: 150,
    },
    {
      id: "2",
      name: "حشوات الأسنان",
      icon: "🔧",
      slug: "dental-fillings",
      count: 89,
    },
    {
      id: "3",
      name: "معدات التنظيف",
      icon: "🧽",
      slug: "cleaning-equipment",
      count: 67,
    },
    {
      id: "4",
      name: "أجهزة الأشعة",
      icon: "📱",
      slug: "x-ray-equipment",
      count: 45,
    },
    {
      id: "5",
      name: "معدات التعقيم",
      icon: "🧼",
      slug: "sterilization",
      count: 78,
    },
    {
      id: "6",
      name: "مواد التجميل",
      icon: "✨",
      slug: "cosmetic-materials",
      count: 123,
    },
    {
      id: "7",
      name: "أدوات الجراحة",
      icon: "🔪",
      slug: "surgery-tools",
      count: 56,
    },
    {
      id: "8",
      name: "أجهزة الليزر",
      icon: "⚡",
      slug: "laser-equipment",
      count: 34,
    },
  ];

  // Enhanced Products with smart data
  const enhancedProducts = featuredProducts.map((product, index) => ({
    id: product.id || `product-${index}`,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    rating: product.rating || 4.5,
    reviewsCount: Math.floor(Math.random() * 200) + 10,
    discount: product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : undefined,
    isNew: index < 3,
    isFeatured: index % 2 === 0,
    category: smartCategories[index % smartCategories.length].name,
    supplier: [
      "حلول الأسنان التقنية",
      "المعدات الطبية العراقية",
      "مستلزمات طب الأسنان",
    ][index % 3],
  }));

  // Auto-changing promotional banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <main className="p-2 md:p-4 lg:p-6">
        {/* Hero/Promotional Banner - Compact for Mobile */}
        <div className="relative mb-3 md:mb-6 h-20 md:h-28 lg:h-36 rounded-lg md:rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="absolute inset-0">
            <img
              src={promoSlides[currentSlide].image}
              alt={promoSlides[currentSlide].title}
              className="w-full h-full object-cover opacity-20"
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-90",
                promoSlides[currentSlide].gradient,
              )}
            />
          </div>

          <div className="relative z-10 h-full flex items-center p-3 md:p-6 lg:p-12">
            <div className="max-w-lg">
              <div className="mb-3">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                  {promoSlides[currentSlide].badge}
                </span>
              </div>
              <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight">
                {promoSlides[currentSlide].title}
              </h1>
              <p className="text-white/90 text-xs md:text-sm lg:text-base mb-3 md:mb-6 leading-relaxed hidden sm:block">
                {promoSlides[currentSlide].subtitle}
              </p>
              <button className="bg-white text-purple-600 px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                {promoSlides[currentSlide].buttonText}
              </button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-2 md:bottom-4 left-3 md:left-6 flex gap-2">
            {promoSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300",
                  currentSlide === index ? "bg-white" : "bg-white/50",
                )}
              />
            ))}
          </div>
        </div>

        {/* Smart Categories Navigation */}
        <SmartCategoriesNavigation
          categories={smartCategories}
          baseUrl="/dental-supply"
          className="mb-4 md:mb-6"
        />

        {/* المنتجات المميزة */}
        <SmartProductsGrid
          title="المنتجات المميزة ⭐"
          subtitle="أفضل المنتجات المختارة بعناية"
          products={enhancedProducts.slice(0, 20).map(p => ({ ...p, id: String(p.id) }))}
          viewAllLink="/dental-supply/featured"
          gridType="featured"
          className="mb-4 md:mb-6"
        />

        {/* Promotional Card 1 */}
        <PromoCard
          title="عروض حصرية"
          subtitle="خصومات تصل إلى 40% على المنتجات المختارة"
          buttonText="تسوق الآن"
          link="/dental-supply/special-offers"
          gradient="from-purple-600 to-pink-600"
          icon="percent"
          className="mb-4 md:mb-6"
        />

        {/* عروض البرق */}
        <SmartProductsGrid
          title="عروض البرق ⚡"
          subtitle="عروض محدودة الوقت - لا تفوتها!"
          products={flashDealsProducts.slice(0, 20).map((product, index) => ({
            ...product,
            id: String(product.id || `flash-${index}`),
            discount: 25 + Math.floor(Math.random() * 25),
            originalPrice: product.price * 1.4,
          }))}
          viewAllLink="/dental-supply/offers"
          gridType="mobile-4"
          className="mb-4 md:mb-6"
        />

        {/* وصل حديثاً */}
        <SmartProductsGrid
          title="وصل حديثاً ✨"
          subtitle="أحدث المنتجات في السوق"
          products={newArrivals.slice(0, 20).map((product, index) => ({
            ...product,
            id: String(product.id || `new-${index}`),
            isNew: true,
            rating: 4.3 + Math.random() * 0.7,
          }))}
          viewAllLink="/dental-supply/new-arrivals"
          gridType="mobile-3"
          className="mb-4 md:mb-6"
        />

        {/* Promotional Card 2 */}
        <PromoCard
          title="من��جات جديدة"
          subtitle="اكتشف أحدث الابتكارات في مجال طب الأسنان"
          buttonText="استكشف"
          link="/dental-supply/new-arrivals"
          gradient="from-blue-600 to-cyan-600"
          icon="gift"
          className="mb-4 md:mb-6"
        />

        {/* الأكثر طلباً */}
        <SmartProductsGrid
          title="الأكثر طلباً 🔥"
          subtitle="المنتجات الأكثر مبيعاً هذا الشهر"
          products={mostDemanded.slice(0, 20).map((product, index) => ({
            ...product,
            id: String(product.id || `trending-${index}`),
            isFeatured: index < 3,
            reviewsCount: 50 + Math.floor(Math.random() * 150),
          }))}
          viewAllLink="/dental-supply/trending"
          gridType="desktop-10"
          className="mb-4 md:mb-6"
        />

        {/* العلامات التجارية */}
        <CompactSuppliersSection
          title="العلامات المميزة 🏆"
          suppliers={[
            {
              name: "3M ESPE",
              logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
              productsCount: 120,
            },
            {
              name: "Dentsply",
              logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
              productsCount: 89,
            },
            {
              name: "Ivoclar",
              logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
              productsCount: 75,
            },
            {
              name: "Straumann",
              logo: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=100&h=100&fit=crop",
              productsCount: 45,
            },
            {
              name: "Zimmer",
              logo: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100&h=100&fit=crop",
              productsCount: 65,
            },
            {
              name: "Nobel",
              logo: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=100&h=100&fit=crop",
              image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=100&h=100&fit=crop",
              productsCount: 92,
            },
          ]}
          viewAllLink="/dental-supply/brands"
          type="brands"
          className="mb-4 md:mb-6"
        />

        {/* Featured Suppliers Section - Horizontal with Images */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-600" />
              الم��ردين المعتمدين
            </h2>
            <Link
              to="/dental-supply/suppliers"
              className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1"
            >
              عرض الكل
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="unified-product-grid product-scroll-enhanced">
            {[
              {
                name: "حلول الأسنان التقنية",
                verified: true,
                rating: 4.9,
                image:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
              },
              {
                name: "المعدات الطبية العراقية",
                verified: true,
                rating: 4.7,
                image:
                  "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
              },
              {
                name: "مستلزمات ��ب الأسنان",
                verified: true,
                rating: 4.8,
                image:
                  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
              },
            ].map((supplier, index) => (
              <Link
                key={index}
                to={`/dental-supply/supplier/${supplier.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex-shrink-0 bg-white p-2 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group w-20 h-16"
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-6 h-6 mx-auto mb-1 bg-gray-50 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-300 relative">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                    {supplier.verified && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-[10px] line-clamp-1 group-hover:text-teal-600 transition-colors">
                    {supplier.name}
                  </h3>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    <Star className="w-2 h-2 text-yellow-400 fill-current" />
                    <span className="text-[10px] text-gray-600">
                      {supplier.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
