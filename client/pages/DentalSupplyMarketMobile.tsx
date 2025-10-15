import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Star,
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
  Package,
  Heart,
  Search,
  ShoppingCart,
  Award,
  Truck,
  Tag,
  Sparkles,
  Filter,
  Grid3X3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  dentalProducts,
  getFeaturedProducts,
  getNewProducts,
  getDiscountedProducts,
  getRandomProducts,
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
  {
    id: 3,
    title: "معدات التعقيم",
    subtitle: "حماية مضمونة",
    buttonText: "شراء",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=300&fit=crop",
    gradient: "from-green-600 to-teal-600",
    badge: "الأكثر مبيعاً",
  },
];

// Mobile-optimized categories
const categories = [
  {
    id: "1",
    name: "أدوات الأسنان",
    icon: "🦷",
    count: 150,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "حشوات الأسنان",
    icon: "🔧",
    count: 89,
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "معدات التنظيف",
    icon: "🧽",
    count: 67,
    color: "bg-green-500",
  },
  {
    id: "4",
    name: "أجهزة الأشعة",
    icon: "📱",
    count: 45,
    color: "bg-orange-500",
  },
  {
    id: "5",
    name: "معدات التعقيم",
    icon: "🧼",
    count: 78,
    color: "bg-teal-500",
  },
  {
    id: "6",
    name: "مواد التجميل",
    icon: "✨",
    count: 123,
    color: "bg-pink-500",
  },
  {
    id: "7",
    name: "أدوات الجراحة",
    icon: "🔪",
    count: 56,
    color: "bg-red-500",
  },
  {
    id: "8",
    name: "أجهزة الليزر",
    icon: "⚡",
    count: 34,
    color: "bg-yellow-500",
  },
];

// Mobile Product Card Component
const MobileProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              جديد
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
        >
          <Heart className={cn("w-4 h-4", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(product.rating || 4.5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewsCount || 12})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-green-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          إضافة للسلة
        </button>
      </div>
    </div>
  );
};

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
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
        >
          عرض الكل
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
};

export default function DentalSupplyMarketMobile() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  // Get product data
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewProducts();
  const flashDealsProducts = getDiscountedProducts();
  const trendingProducts = getRandomProducts(8);

  // Enhanced products with mobile-optimized data
  const enhancedProducts = featuredProducts.slice(0, 10).map((product, index) => ({
    id: String(product.id || `product-${index}`),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    rating: product.rating || (4.2 + Math.random() * 0.8),
    reviewsCount: Math.floor(Math.random() * 50) + 5,
    discount: product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined,
    isNew: index < 3,
    category: categories[index % categories.length].name,
    supplier: ["حلول الأسنان", "المعدات الطبية", "مستلزمات طب الأسنان"][index % 3],
  }));

  // Auto-changing banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      id: String(product.id),
      name: product.name,
      arabicName: product.name,
      price: product.price,
      image: product.image,
      category: product.category || 'منتجات طبية',
      brand: product.supplier || 'غير محدد',
      supplier: product.supplier,
      inStock: true,
      maxQuantity: 99,
    });
  };

  const handleToggleFavorite = (productId: string) => {
    const isFavorite = favorites.some((fav) => fav.id === productId);
    if (isFavorite) {
      removeFromFavorites(productId);
    } else {
      const product = enhancedProducts.find((p) => p.id === productId);
      if (product) {
        addToFavorites({
          id: product.id,
          name: product.name,
          arabicName: product.name,
          price: product.price,
          image: product.image,
          category: product.category || 'منتجات طبية',
          brand: product.supplier || 'غير محدد',
          addedDate: new Date().toISOString(),
        });
      }
    }
  };

  return (
    <div className="mobile-container w-full max-w-full overflow-x-hidden min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Hero Banner */}
      <div className="relative h-48 mb-4 mx-3 mt-3 rounded-2xl overflow-hidden max-w-full">
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

      {/* Mobile Categories */}
      <div className="w-full max-w-full overflow-hidden px-3 mb-6">
        <MobileSectionHeader 
          title="التصنيفات" 
          subtitle="تسوق حسب التخصص"
          viewAllLink="/dental-supply/categories"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-full">
          {categories.map((category) => (
            <MobileCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="w-full max-w-full px-3 mb-6">
        <MobileSectionHeader
          title="⚡ عروض البرق" 
          subtitle="لفترة محدودة فقط"
          viewAllLink="/dental-supply/flash-deals"
        />
        <div className="grid grid-cols-2 gap-3 w-full max-w-full">
          {flashDealsProducts.slice(0, 4).map((product, index) => (
            <MobileProductCard
              key={`flash-${index}`}
              product={{
                ...product,
                id: `flash-${index}`,
                discount: 25 + Math.floor(Math.random() * 25),
                originalPrice: product.price * 1.4,
                reviewsCount: Math.floor(Math.random() * 30) + 10,
              }}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === `flash-${index}`)}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="w-full max-w-full px-3 mb-6">
        <MobileSectionHeader
          title="⭐ المنتجات المميزة" 
          subtitle="الأكثر شعبية"
          viewAllLink="/dental-supply/featured"
        />
        <div className="grid grid-cols-2 gap-3">
          {enhancedProducts.slice(0, 6).map((product) => (
            <MobileProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === product.id)}
            />
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="w-full max-w-full px-3 mb-6">
        <MobileSectionHeader
          title="✨ وصل حديثاً" 
          subtitle="أحدث المنتجات"
          viewAllLink="/dental-supply/new-arrivals"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-full">
          {newArrivals.slice(0, 8).map((product, index) => (
            <div key={`new-${index}`} className="flex-shrink-0 w-40">
              <MobileProductCard
                product={{
                  ...product,
                  id: `new-${index}`,
                  isNew: true,
                  reviewsCount: Math.floor(Math.random() * 20) + 5,
                }}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some((fav) => fav.id === `new-${index}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="w-full max-w-full px-3 mb-6">
        <MobileSectionHeader
          title="🔥 الأكثر طلباً" 
          subtitle="الأعلى مبيعاً"
          viewAllLink="/dental-supply/trending"
        />
        <div className="grid grid-cols-2 gap-3">
          {trendingProducts.slice(0, 4).map((product, index) => (
            <MobileProductCard
              key={`trending-${index}`}
              product={{
                ...product,
                id: `trending-${index}`,
                reviewsCount: Math.floor(Math.random() * 100) + 20,
                rating: 4.5 + Math.random() * 0.5,
              }}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === `trending-${index}`)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
    </div>
  );
}