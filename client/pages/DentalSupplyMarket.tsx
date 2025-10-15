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

// Promotional banners data
const promoSlides = [
  {
    id: 1,
    title: "عروض خاصة على منتجات طب الأسنان",
    subtitle: "خصومات تصل إلى 50% على مستلزمات طب الأسنان",
    buttonText: "تسوق الآن",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=400&fit=crop",
    gradient: "from-purple-600 to-blue-600",
    badge: "توفير 50%",
  },
  {
    id: 2,
    title: "أحدث معدات طب الأسنان",
    subtitle: "تكنولوجيا متقدمة لعيادات أسنان عصرية",
    buttonText: "اكتشف المزيد",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    gradient: "from-blue-600 to-indigo-600",
    badge: "جديد",
  },
  {
    id: 3,
    title: "مستلزمات التعقيم والنظافة",
    subtitle: "أفضل منتجات التعقيم لحماية مرضاك",
    buttonText: "شراء الآن",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&h=400&fit=crop",
    gradient: "from-green-600 to-teal-600",
    badge: "الأكثر مبيعاً",
  },
];

// Sample data for different sections
const brands = [
  {
    name: "Kerr",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
  },
  {
    name: "Dentsply",
    logo: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=50&fit=crop",
  },
  {
    name: "3M",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7b5?w=100&h=50&fit=crop",
  },
  {
    name: "Ivoclar",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=50&fit=crop",
  },
  {
    name: "Nobel",
    logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=50&fit=crop",
  },
  {
    name: "Straumann",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=50&fit=crop",
  },
];

const categories = [
  {
    name: "General Dentistry",
    icon: "🦷",
    arabicName: "طب الأسنان العام",
    count: "2,450",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Consumables",
    icon: "📦",
    arabicName: "المستهلكات",
    count: "1,890",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Endodontics",
    icon: "🔬",
    arabicName: "علاج الجذور",
    count: "856",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Orthodontics",
    icon: "⚕️",
    arabicName: "تقويم الأسنان",
    count: "1,234",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Instruments",
    icon: "🔧",
    arabicName: "الأدوات",
    count: "3,421",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Equipments",
    icon: "🏥",
    arabicName: "المعدات",
    count: "567",
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Paedodontics",
    icon: "👶",
    arabicName: "أسنان الأطفال",
    count: "432",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Prosthodontics",
    icon: "🦷",
    arabicName: "التركيبات",
    count: "789",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    name: "Periodontics",
    icon: "🦷",
    arabicName: "أمراض اللثة",
    count: "345",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Oral Surgery",
    icon: "⚔️",
    arabicName: "جراحة الفم",
    count: "234",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Implantology",
    icon: "🔩",
    arabicName: "زراعة الأسنان",
    count: "678",
    color: "bg-violet-100 text-violet-600",
  },
  {
    name: "Sterilization",
    icon: "🧼",
    arabicName: "التعقيم",
    count: "445",
    color: "bg-teal-100 text-teal-600",
  },
];

const flashDeals = [
  {
    id: 1,
    name: "VITA Filament Biceramic",
    price: "IQD 35,500",
    originalPrice: "IQD 71,000",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    discount: "50%",
    rating: 4.8,
    timeLeft: "2:45:30",
  },
  {
    id: 2,
    name: "Dental Cone Sealer",
    price: "IQD 45,500",
    originalPrice: "IQD 65,000",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
    discount: "30%",
    rating: 4.6,
    timeLeft: "1:15:45",
  },
  {
    id: 3,
    name: "Orthodontic Kit Pro",
    price: "IQD 125,000",
    originalPrice: "IQD 180,000",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
    discount: "31%",
    rating: 4.9,
    timeLeft: "5:30:20",
  },
];

const newArrivals = [
  {
    id: 1,
    name: "Ortho Clean Cleaner",
    price: "IQD 65,000",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    isNew: true,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Fissure Tool",
    price: "IQD 7,500",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop",
    isNew: true,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Amalgam Paper Point",
    price: "IQD 3,500",
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=200&fit=crop",
    isNew: true,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Dental Safety Service",
    price: "IQD 5,500",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=200&fit=crop",
    isNew: true,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Digital X-Ray Sensor",
    price: "IQD 125,000",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
    isNew: true,
    rating: 4.9,
  },
];

const mostDemanded = [
  {
    id: 1,
    name: "Composite Filling Kit",
    price: "IQD 45,000",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
    rating: 4.8,
    soldCount: "1,250+ مبيع",
  },
  {
    id: 2,
    name: "Dental Handpiece",
    price: "IQD 85,000",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
    rating: 4.9,
    soldCount: "890+ مبيع",
  },
  {
    id: 3,
    name: "Sterilization Pouches",
    price: "IQD 12,500",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    rating: 4.7,
    soldCount: "2,100+ مبيع",
  },
  {
    id: 4,
    name: "Orthodontic Brackets",
    price: "IQD 35,000",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
    rating: 4.6,
    soldCount: "750+ مبيع",
  },
  {
    id: 5,
    name: "Dental Gloves Box",
    price: "IQD 8,500",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
    rating: 4.8,
    soldCount: "3,200+ مبيع",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Premium LED Curing Light",
    price: "IQD 185,000",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    rating: 4.9,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Ultrasonic Scaler",
    price: "IQD 95,000",
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=200&fit=crop",
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Digital Impression Kit",
    price: "IQD 250,000",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=200&fit=crop",
    rating: 4.9,
    isFeatured: true,
  },
  {
    id: 4,
    name: "Apex Locator Device",
    price: "IQD 125,000",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
    rating: 4.7,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Rotary Endodontic System",
    price: "IQD 165,000",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop",
    rating: 4.8,
    isFeatured: true,
  },
];

const limitedOffers = [
  {
    id: 1,
    name: "Complete Extraction Kit",
    price: "IQD 75,000",
    originalPrice: "IQD 150,000",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
    discount: "50%",
    rating: 4.8,
    timeLeft: "2 أيام متبقية",
    stockLeft: 5,
  },
  {
    id: 2,
    name: "Dental Impression Materials Set",
    price: "IQD 42,000",
    originalPrice: "IQD 70,000",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    discount: "40%",
    rating: 4.7,
    timeLeft: "1 يوم متبقي",
    stockLeft: 3,
  },
  {
    id: 3,
    name: "Professional Teeth Whitening Kit",
    price: "IQD 95,000",
    originalPrice: "IQD 135,000",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
    discount: "30%",
    rating: 4.9,
    timeLeft: "3 أيام متبقية",
    stockLeft: 8,
  },
  {
    id: 4,
    name: "Orthodontic Complete Set",
    price: "IQD 220,000",
    originalPrice: "IQD 320,000",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
    discount: "31%",
    rating: 4.6,
    timeLeft: "5 أيام متبقية",
    stockLeft: 2,
  },
  {
    id: 5,
    name: "Advanced Sterilization System",
    price: "IQD 180,000",
    originalPrice: "IQD 280,000",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
    discount: "36%",
    rating: 4.8,
    timeLeft: "1 أسبوع متبقي",
    stockLeft: 4,
  },
];

const topSuppliers = [
  {
    id: 1,
    name: "Kerr Corporation",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    rating: 4.9,
    productsCount: 450,
    verified: true,
  },
  {
    id: 2,
    name: "Dentsply Sirona",
    logo: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop",
    rating: 4.8,
    productsCount: 380,
    verified: true,
  },
  {
    id: 3,
    name: "3M Dental",
    logo: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7b5?w=100&h=100&fit=crop",
    rating: 4.7,
    productsCount: 290,
    verified: true,
  },
  {
    id: 4,
    name: "Ivoclar Vivadent",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4.9,
    productsCount: 320,
    verified: true,
  },
];

export default function DentalSupplyMarket() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    inStock: false,
    hasDiscount: false,
  });

  // Cart and Favorites contexts
  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Get real product data
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewProducts();
  const flashDealsProducts = getDiscountedProducts();
  const mostDemanded = getRandomProducts(5);
  const limitedOffers = getDiscountedProducts().slice(0, 5);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categoriesPerPage = 6;
  const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
  const currentCategories = categories.slice(
    currentCategoryPage * categoriesPerPage,
    (currentCategoryPage + 1) * categoriesPerPage,
  );

  // Auto-changing promotional banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-changing categories with touch support
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategoryPage((prev) => (prev + 1) % totalCategoryPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalCategoryPages]);

  const ModernProductCard = ({
    product,
    badge,
  }: {
    product: any;
    badge?: string;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative transform hover:-translate-y-1">
      {/* Badge */}
      {badge && (
        <div className="absolute top-1 left-1 z-10">
          <span
            className={cn(
              "px-1 py-0.5 text-xs font-bold text-white rounded-xl",
              badge === "NEW" &&
                "bg-gradient-to-r from-green-500 to-emerald-500",
              badge === "FEATURED" &&
                "bg-gradient-to-r from-purple-500 to-violet-500",
              badge === "BEST SELLING" &&
                "bg-gradient-to-r from-blue-500 to-indigo-500",
            )}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Rating overlay */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {product.rating}
          </span>
        </div>

        {/* Favorites button */}
        <button
          onClick={() =>
            toggleFavorite({
              id: product.id,
              name: product.name,
              arabicName: product.arabicName,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
              brand: product.brand,
              rating: product.rating,
              supplier: product.supplier,
              addedDate: new Date().toISOString(),
            })
          }
          className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite(product.id)
                ? "text-red-500 fill-current"
                : "text-gray-600 hover:text-red-500",
            )}
          />
        </button>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-sm">
            -{product.discount}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {product.price}
            </span>
          </div>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 py-1 px-2 rounded-lg sm:rounded-xl text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 text-center"
          >
            تفاصيل
          </Link>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                arabicName: product.arabicName,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                brand: product.brand,
                supplier: product.supplier,
                inStock: product.inStock,
                maxQuantity: product.maxQuantity,
              })
            }
            className={cn(
              "flex-1 py-1 px-2 rounded-lg sm:rounded-xl text-xs font-medium hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]",
              isInCart(product.id)
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
            )}
          >
            {isInCart(product.id)
              ? `في السلة (${getItemQuantity(product.id)})`
              : "إضافة"}
          </button>
        </div>
      </div>
    </div>
  );

  const FlashDealCard = ({ product }: { product: any }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      {/* Timer Badge */}
      <div className="absolute top-1 left-1 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-1 py-0.5 rounded-lg sm:rounded-xl text-xs font-bold flex items-center gap-0.5">
        <Timer className="w-2 h-2" />
        <span className="hidden sm:inline">
          {product.timeLeft || "24:00:00"}
        </span>
        <span className="sm:hidden">
          {product.timeLeft ? product.timeLeft.split(":")[0] + "h" : "24h"}
        </span>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-1 py-0.5 rounded-lg sm:rounded-xl text-xs font-bold">
          -{product.discount}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-1.5">
        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-1 min-h-[1rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-2 h-2",
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-xs font-bold text-red-600">
            {product.price}
          </span>
          <span className="text-xs text-gray-500 line-through">
            {product.originalPrice}
          </span>
        </div>

        <div className="flex gap-1">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 py-1 px-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 text-center"
          >
            تفاصيل
          </Link>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                arabicName: product.arabicName,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                brand: product.brand,
                supplier: product.supplier,
                inStock: product.inStock,
                maxQuantity: product.maxQuantity,
              })
            }
            className={cn(
              "flex-1 py-1 px-2 rounded-xl text-xs font-medium hover:shadow-md transition-all duration-300",
              isInCart(product.id)
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-red-500 to-orange-500 text-white",
            )}
          >
            {isInCart(product.id)
              ? `في السلة (${getItemQuantity(product.id)})`
              : "اشتري"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 with-floating-nav"
      dir="rtl"
    >
      {/* Market Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-4">
            <button
              onClick={() => setActiveTab("home")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "home"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Package className="w-4 h-4" />
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "categories"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
              الفئات
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "featured"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Star className="w-4 h-4" />
              المميزة
            </button>
            <button
              onClick={() => setActiveTab("deals")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "deals"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Zap className="w-4 h-4" />
              العروض
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "new"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Plus className="w-4 h-4" />
              الجديد
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <main className="p-2 sm:p-4 lg:p-6">
            {/* Hero/Promotional Banner */}
            <div className="relative mb-4 sm:mb-8 h-48 sm:h-64 lg:h-80 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
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

              <div className="relative z-10 h-full flex items-center justify-between p-8 text-white">
                <div className="flex-1">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium w-fit mb-4">
                    {promoSlides[currentSlide].badge}
                  </div>
                  <h2 className="text-4xl font-bold mb-4 leading-tight">
                    {promoSlides[currentSlide].title}
                  </h2>
                  <p className="text-xl mb-6 text-white/90">
                    {promoSlides[currentSlide].subtitle}
                  </p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {promoSlides[currentSlide].buttonText}
                  </button>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 flex gap-2">
                {promoSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index === currentSlide ? "bg-white" : "bg-white/40",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Promotional Discount Banner */}
            <div className="relative mb-8 h-32 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/90" />
              <div className="relative z-10 h-full flex items-center justify-between p-6 text-white">
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Percent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      تخفيضات تصل إلى 70%
                    </h3>
                    <p className="text-white/90">
                      على مجموعة واسعة من منتجات طب الأسنان
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    تسوق الآن
                  </button>
                  <p className="text-sm text-white/80 mt-2">
                    العرض ساري حتى نفاذ الكمية
                  </p>
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Grid3X3 className="w-4 h-4 text-white" />
                  </div>
                  تصفح الفئات
                </h2>
                <Link
                  to="/categories"
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  عرض الكل
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative">
                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setCurrentCategoryPage((prev) =>
                      prev > 0 ? prev - 1 : totalCategoryPages - 1,
                    )
                  }
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() =>
                    setCurrentCategoryPage((prev) =>
                      prev < totalCategoryPages - 1 ? prev + 1 : 0,
                    )
                  }
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>

                {/* Categories Grid */}
                <div
                  className="grid grid-cols-6 gap-4 px-8 touch-pan-x"
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const startX = touch.clientX;

                    const handleTouchMove = (e: TouchEvent) => {
                      const currentX = e.touches[0].clientX;
                      const diff = startX - currentX;

                      if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                          // Swipe left - next page
                          setCurrentCategoryPage((prev) =>
                            prev < totalCategoryPages - 1 ? prev + 1 : 0,
                          );
                        } else {
                          // Swipe right - previous page
                          setCurrentCategoryPage((prev) =>
                            prev > 0 ? prev - 1 : totalCategoryPages - 1,
                          );
                        }
                        document.removeEventListener(
                          "touchmove",
                          handleTouchMove,
                        );
                        document.removeEventListener(
                          "touchend",
                          handleTouchEnd,
                        );
                      }
                    };

                    const handleTouchEnd = () => {
                      document.removeEventListener(
                        "touchmove",
                        handleTouchMove,
                      );
                      document.removeEventListener("touchend", handleTouchEnd);
                    };

                    document.addEventListener("touchmove", handleTouchMove);
                    document.addEventListener("touchend", handleTouchEnd);
                  }}
                >
                  {currentCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-blue-50 rounded-2xl p-4 text-center group transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <div
                        className={cn(
                          "w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl transition-colors",
                          category.color,
                        )}
                      >
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                        {category.arabicName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category.count} منتج
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({ length: totalCategoryPages }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCategoryPage(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === currentCategoryPage
                            ? "bg-purple-600 w-6"
                            : "bg-gray-300 hover:bg-gray-400",
                        )}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Flash Deals */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  عروض البرق
                </h2>
                <Link
                  to="/offers"
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {flashDeals.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                    <FlashDealCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrivals */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  وصل حديثاً
                </h2>
                <Link
                  to="/new-arrivals"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {newArrivals.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                    <ModernProductCard
                      product={product}
                      badge="NEW"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Most Demanded */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  الأكثر طلباً
                </h2>
                <Link
                  to="/most-demanded"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {mostDemanded.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                    <ModernProductCard
                      product={product}
                      badge="BEST SELLING"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  المنتجات المميزة
                </h2>
                <Link
                  to="/featured"
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {featuredProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                    <ModernProductCard
                      product={product}
                      badge="FEATURED"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Limited Time Offers */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  لا تفوت الفرصة
                </h2>
                <Link
                  to="/limited-offers"
                  className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {limitedOffers.map((product) => (
                  <div key={product.id} className="relative flex-shrink-0 w-72 sm:w-80 snap-start">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative transform hover:-translate-y-1">
                      {/* Urgency Badge */}
                      <div className="absolute top-1 left-1 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-1 py-0.5 rounded-xl text-xs font-bold">
                        {product.timeLeft}
                      </div>

                      {/* Product Image */}
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Stock Badge */}
                        <div className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 rounded-xl text-xs font-bold">
                          {product.stockLeft} متبقي
                        </div>

                        {/* Discount Badge */}
                        <div className="absolute bottom-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-1 py-0.5 rounded-xl text-xs font-bold">
                          -{product.discount}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-1.5">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-1 min-h-[1rem]">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-0.5 mb-1">
                          <Star className="w-2 h-2 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">
                            ({product.rating})
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="text-xs font-bold text-red-600">
                            {product.price}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        </div>

                        <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-1 px-2 rounded-xl text-xs font-medium hover:shadow-md transition-all duration-300">
                          اشتري الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Suppliers */}
            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  أبرز الموردين
                </h2>
                <Link
                  to="/suppliers"
                  className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 text-sm sm:text-base"
                >
                  عرض الكل
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {topSuppliers.map((supplier) => (
                  <Link
                    key={supplier.id}
                    to={`/suppliers/${supplier.id}`}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 rounded-2xl p-4 text-center group transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      {supplier.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {supplier.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {supplier.productsCount} منتج
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </main>
      </div>
    </div>
  );
}
