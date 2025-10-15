import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Package,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  Search,
  Truck,
  Shield,
  Heart,
  Eye,
  ShoppingCart,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";

// Badge definitions
interface SupplierBadge {
  slug: string;
  arabicName: string;
  color: string;
  icon: string;
}

const AVAILABLE_BADGES: SupplierBadge[] = [
  { slug: "trusted", arabicName: "موثوق", color: "blue", icon: "Shield" },
  { slug: "featured", arabicName: "مميز", color: "purple", icon: "Star" },
  { slug: "new", arabicName: "جديد", color: "green", icon: "CheckCircle" },
  { slug: "certified", arabicName: "معتمد", color: "gold", icon: "Award" },
  { slug: "syndicate_verified", arabicName: "موثوق من النقابة", color: "indigo", icon: "Building2" },
  { slug: "syndicate_supported", arabicName: "مدعوم من النقابة", color: "teal", icon: "Users" },
];

const getBadgeDetails = (slug: string): SupplierBadge | undefined => {
  return AVAILABLE_BADGES.find(b => b.slug === slug);
};

const getBadgeColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    green: "bg-green-100 text-green-700 border-green-300",
    gold: "bg-yellow-100 text-yellow-700 border-yellow-300",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
    teal: "bg-teal-100 text-teal-700 border-teal-300",
  };
  return colors[color] || "bg-gray-100 text-gray-700 border-gray-300";
};

// بيانات المورد
// NOTE: In production, this will be fetched from API using supplierId from useParams
// TODO: Replace with actual API call: const supplierData = await fetchSupplierBySlug(supplierId)
const supplierData = {
  id: 1,
  userId: 1, // Mock: Owner's user ID. In production, fetched from suppliers.userId
  name: "DentalTech Solutions",
  arabicName: "شركة حلول الأسنان التقنية",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
  cover:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
  rating: 4.9,
  reviewCount: 234,
  location: "بغداد، العراق",
  address: "منطقة الكرادة، شارع أبو نواس، مجمع الأطباء",
  speciality: "معدات طبية متقدمة",
  productsCount: 450,
  customersCount: 1250,
  verified: true,
  established: 2015,
  description:
    "شركة رائدة في توفير معدات طب الأسنان المتقدمة وا��تقنيات الحديثة. نفخر بخدمة أكثر من 1000 عيادة أسنان في العراق ومنطقة الشرق الأوسط.",
  contact: {
    phone: "+964 770 123 4567",
    whatsapp: "+964 770 123 4567",
    email: "info@dentaltech.iq",
    website: "www.dentaltech.iq",
  },
  services: [
    "توريد المعدات الطبية",
    "الصيانة والدعم الفني",
    "التدريب على الأجهزة",
    "الضمان الشامل",
    "الشحن السريع",
    "الاستشارات الفنية",
  ],
  certifications: [
    "ISO 13485",
    "CE المعتمدة",
    "FDA معتمدة",
    "وزارة الصحة العراقية",
  ],
  badges: ["trusted", "featured", "syndicate_verified"], // Array of badge slugs
  growth: "+25%",
  responseTime: "خلال ساعة واحدة",
};

// منتجات المورد
const supplierProducts = [
  {
    id: 1,
    name: "Digital X-ray Sensor",
    arabicName: "مستشعر الأشعة الرقمية",
    price: 2400000,
    originalPrice: 2800000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    category: "أجهزة أشعة",
    brand: "XrayTech",
    discount: 14,
    inStock: true,
  },
  {
    id: 2,
    name: "Dental Chair Unit",
    arabicName: "وحدة كرسي الأسنان",
    price: 15600000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 45,
    category: "معدات كبيرة",
    brand: "ChairPro",
    inStock: true,
  },
  {
    id: 3,
    name: "Ultrasonic Scaler",
    arabicName: "منظف الأسنان بالموجات فوق الصوتية",
    price: 1250000,
    originalPrice: 1400000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 67,
    category: "أدوات تنظيف",
    brand: "CleanTech",
    discount: 11,
    inStock: true,
  },
  {
    id: 4,
    name: "LED Curing Light",
    arabicName: "ضوء المعالجة LED",
    price: 890000,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 123,
    category: "معدات ضوئية",
    brand: "LightCure",
    inStock: true,
  },
];

export default function SupplierProfile() {
  const { supplierId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [supplierData, setSupplierData] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch supplier data from API
  useEffect(() => {
    // Define fallback data
    const fallbackSupplierData = {
      id: 1,
      userId: 1,
      name: "DentalTech Solutions",
      arabicName: "شركة حلول الأسنان التقنية",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
      cover: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 234,
      location: "بغداد، العراق",
      address: "منطقة الكرادة، شارع أبو نواس، مجمع الأطباء",
      speciality: "معدات طبية متقدمة",
      productsCount: 450,
      customersCount: 1250,
      verified: true,
      established: 2015,
      description: "شركة رائدة في توفير معدات طب الأسنان المتقدمة والتقنيات الحديثة. نفخر بخدمة أكثر من 1000 عيادة أسنان في العراق ومنطقة الشرق الأوسط.",
      contact: {
        phone: "+964 770 123 4567",
        whatsapp: "+964 770 123 4567",
        email: "info@dentaltech.iq",
        website: "www.dentaltech.iq",
      },
      services: ["توريد المعدات الطبية", "الصيانة والدعم الفني", "التدريب على الأجهزة", "الضمان الشامل", "الشحن السريع", "الاستشارات الفنية"],
      certifications: ["ISO 13485", "CE المعتمدة", "FDA معتمدة", "وزارة الصحة العراقية"],
      badges: ["trusted", "featured", "syndicate_verified"],
      responseTime: "خلال ساعة واحدة",
      growth: "+25%"
    };

    const fallbackProducts = [
      {
        id: 1,
        name: "Digital X-ray Sensor",
        arabicName: "مستشعر الأشعة الرقمية",
        price: 2400000,
        originalPrice: 2800000,
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
        rating: 4.8,
        reviewCount: 89,
        category: "أجهزة أشعة",
        brand: "XrayTech",
        discount: 14,
        inStock: true,
      },
      {
        id: 2,
        name: "Dental Chair Unit",
        arabicName: "وحدة كرسي الأسنان",
        price: 15600000,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
        rating: 4.9,
        reviewCount: 45,
        category: "معدات كبيرة",
        brand: "ChairPro",
        inStock: true,
      }
    ];

    const fetchSupplierData = async () => {
      if (!supplierId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch supplier profile
        const supplierRes = await fetch(`/api/suppliers/${supplierId}`);
        if (supplierRes.ok) {
          const data = await supplierRes.json();
          
          // Transform API data to match component structure
          setSupplierData({
            id: data.id,
            userId: data.userId,
            name: data.companyName || data.name,
            arabicName: data.arabicCompanyName || data.arabicName || data.companyName,
            logo: data.logo || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
            cover: data.coverImage || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
            rating: parseFloat(data.rating) || 0,
            reviewCount: data.totalReviews || 0,
            location: data.location || "العراق",
            address: data.location || "",
            speciality: data.speciality || "معدات طبية",
            productsCount: data.productsCount || data.totalProducts || 0,
            customersCount: data.totalOrders || 0,
            verified: data.verified || false,
            established: data.established || new Date().getFullYear(),
            description: data.arabicDescription || data.description || "",
            contact: {
              phone: data.phone || "",
              whatsapp: data.whatsapp || data.phone || "",
              email: data.email || "",
              website: data.website || "",
            },
            services: Array.isArray(data.services) ? data.services : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            badges: Array.isArray(data.badges) ? data.badges : [],
            responseTime: data.responseTime || "قريباً",
            growth: "+0%"
          });
        } else {
          // API returned non-OK status (e.g., 500), use fallback
          console.warn(`Supplier API returned ${supplierRes.status}, using fallback`);
          setSupplierData(fallbackSupplierData);
        }

        // Fetch supplier products
        const productsRes = await fetch(`/api/suppliers/${supplierId}/products`);
        if (productsRes.ok) {
          const data = await productsRes.json();
          // API returns { products: [...], count: ... } or just array
          const products = data.products || data;
          setSupplierProducts(products);
        } else {
          // API returned non-OK status, use fallback
          console.warn(`Products API returned ${productsRes.status}, using fallback`);
          setSupplierProducts(fallbackProducts);
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        // Network error or exception, use fallback
        setSupplierData(fallbackSupplierData);
        setSupplierProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplierData();
  }, [supplierId]);
  
  // Check if current user is the owner of this supplier profile
  const isSupplierOwner = 
    isAuthenticated && 
    user?.role === UserRole.SUPPLIER &&
    supplierData?.userId !== null &&
    String(user?.id) === String(supplierData?.userId);

  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden unified-product-card">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <Link to={`/dental-supply/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.arabicName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
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

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">
            {product.brand}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <Link to={`/dental-supply/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.arabicName}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()} د.ع
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className={cn(
              "p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md",
              isInCart(product.id)
                ? "bg-green-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700",
            )}
          >
            {isInCart(product.id) ? (
              <span className="text-xs font-bold px-1">
                {getItemQuantity(product.id)}
              </span>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const filteredProducts = supplierProducts.filter(
    (product) =>
      product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory),
  );

  const categories = [...new Set(supplierProducts.map((p) => p.category))];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Breadcrumb */}
      <div className="p-6 pb-0">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dental-supply" className="hover:text-blue-600">
            الرئيسية
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <Link to="/dental-supply/suppliers" className="hover:text-blue-600">
            الموردين
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-gray-900">{supplierData.arabicName}</span>
        </nav>
      </div>

      {/* Supplier Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-teal-600 to-cyan-600 relative overflow-hidden">
          <img
            src={supplierData.cover}
            alt={supplierData.arabicName}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Supplier Info */}
        <div className="relative -mt-16 mx-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Logo and Basic Info */}
              <div className="flex items-start gap-4">
                <img
                  src={supplierData.logo}
                  alt={supplierData.arabicName}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {supplierData.arabicName}
                    </h1>
                    {supplierData.verified && (
                      <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        موثق
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{supplierData.name}</p>
                  
                  {/* Supplier Badges */}
                  {supplierData.badges && supplierData.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {supplierData.badges.map((badgeSlug) => {
                        const badge = getBadgeDetails(badgeSlug);
                        if (!badge) return null;
                        return (
                          <Badge
                            key={badgeSlug}
                            variant="outline"
                            className={cn("text-sm font-medium flex items-center gap-1.5 px-3 py-1", getBadgeColorClass(badge.color))}
                          >
                            {badge.icon === "Shield" && <Shield className="w-3.5 h-3.5" />}
                            {badge.icon === "Star" && <Star className="w-3.5 h-3.5" />}
                            {badge.icon === "CheckCircle" && <CheckCircle className="w-3.5 h-3.5" />}
                            {badge.icon === "Award" && <Award className="w-3.5 h-3.5" />}
                            {badge.icon === "Building2" && <Building2 className="w-3.5 h-3.5" />}
                            {badge.icon === "Users" && <Users className="w-3.5 h-3.5" />}
                            {badge.arabicName}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(supplierData.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{supplierData.rating}</span>
                    <span className="text-gray-600">
                      ({supplierData.reviewCount} تقييم)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{supplierData.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:min-w-80">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {supplierData.productsCount}
                  </div>
                  <div className="text-xs text-gray-500">منتج</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {supplierData.customersCount}
                  </div>
                  <div className="text-xs text-gray-500">عميل</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {supplierData.established}
                  </div>
                  <div className="text-xs text-gray-500">تأسست</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">
                    {supplierData.growth}
                  </div>
                  <div className="text-xs text-gray-500">نمو</div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              {/* Supplier Dashboard Link - Only visible to supplier owner */}
              {isSupplierOwner && (
                <Link
                  to="/supplier/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Package className="w-4 h-4" />
                  مركز الموردين
                </Link>
              )}
              <a
                href={`tel:${supplierData.contact.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                اتصال
              </a>
              <a
                href={`https://wa.me/${supplierData.contact.whatsapp.replace(/\+|\s/g, "")}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                واتساب
              </a>
              <a
                href={`mailto:${supplierData.contact.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                إيميل
              </a>
              <a
                href={`https://${supplierData.contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
                الموقع
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="p-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {[
            { id: "products", label: "المنتجات", icon: Package },
            { id: "about", label: "عن الشركة", icon: Award },
            { id: "services", label: "الخدمات", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في منتجات المورد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="popular">الأكثر شهرة</option>
                <option value="price-low">السعر من الأقل</option>
                <option value="price-high">السعر من الأعلى</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((product) => (
                <UnifiedProductCard
                  key={product.id}
                  product={product}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">عن الشركة</h3>
                <p className="text-gray-700 leading-relaxed">
                  {supplierData.description}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">الشهادات والاعتمادات</h4>
                <div className="grid grid-cols-2 gap-3">
                  {supplierData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold mb-3">معلومات الاتصال</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {supplierData.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {supplierData.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {supplierData.contact.email}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">معلومات إضافية</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">وقت الاستجابة</span>
                    <span className="font-medium text-gray-900">
                      {supplierData.responseTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">التخصص</span>
                    <span className="font-medium text-gray-900">
                      {supplierData.speciality}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div>
            <h3 className="text-xl font-bold mb-6">الخدمات المقدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplierData.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="font-medium text-gray-900">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
