import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import {
  Star,
  Globe,
  MapPin,
  Calendar,
  Award,
  Package,
  Users,
  CheckCircle,
  ArrowRight,
  Search,
  Crown,
  TrendingUp,
  Heart,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

// بيانات العلامة التجارية
const brandData = {
  id: 1,
  name: "3M ESPE",
  arabicName: "ثري إم إيسبي",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
  cover:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
  rating: 4.9,
  reviewCount: 567,
  productsCount: 120,
  country: "الولايات المتحدة",
  headquarters: "مينيسوتا، الولايات المتحدة الأمريكية",
  established: 1902,
  specialities: [
    "مواد الترميم",
    "التركيبات",
    "المواد اللاصقة",
    "أدوات التعقيم",
  ],
  description:
    "شركة 3M ESPE هي الرائدة عالمياً في مجال مواد طب الأسنان والحلول المبتكرة. تتميز بأكثر من 120 عاماً من الخبرة في تطوير منتجات عالية الجودة تلبي احتياجات أطباء الأسنان حول العالم.",
  verified: true,
  premium: true,
  growth: "+15%",
  popularity: 95,
  website: "www.3m.com/dental",
  awards: [
    "جائزة الابتكار في طب الأسنان 2023",
    "أفضل علامة تجارية للمواد التجميلية",
    "شهادة الجودة ISO 13485",
    "اعتماد FDA الأمريكية",
  ],
  history:
    "تأسست شركة 3M في عام 1902، وبدأت قسم طب الأسنان ESPE في عام 1951. منذ ذلك الحين، أصبحت رائدة في تطوير المواد التجميلية والترميمية.",
  vision:
    "نسعى لتحسين صحة الفم والأسنان من خلال الابتكار المستمر وتقديم حلول متقدمة تساعد أطباء الأسنان على تقديم أفضل رعاية لمرضاهم.",
};

// منتجات العلامة التجارية
const brandProducts = [
  {
    id: 1,
    name: "Filtek Supreme XTE",
    arabicName: "فيلتيك سوبريم اكس تي إي",
    price: 450000,
    originalPrice: 520000,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 234,
    category: "مواد حشو",
    discount: 13,
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "RelyX Ultimate",
    arabicName: "ريلاي اكس التيميت",
    price: 320000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 156,
    category: "مواد لاصقة",
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "Scotchbond Universal",
    arabicName: "سكوتش بوند يونيفرسال",
    price: 280000,
    originalPrice: 330000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 189,
    category: "مواد ربط",
    discount: 15,
    inStock: true,
  },
  {
    id: 4,
    name: "Ketac Cem Radiopaque",
    arabicName: "كيتاك سيم راديو أوبيك",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 98,
    category: "سمنت طبي",
    inStock: true,
  },
];

export default function BrandDetail() {
  const { brandId } = useParams();
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative unified-product-card">
      <div className="aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
        <Link to={`/dental-supply/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.arabicName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {product.featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Crown className="w-3 h-3" />
            مميز
          </div>
        )}

        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
            3M ESPE
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <Link to={`/dental-supply/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-yellow-600 transition-colors">
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
                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg",
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

  const filteredProducts = brandProducts.filter(
    (product) =>
      product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory),
  );

  const categories = [...new Set(brandProducts.map((p) => p.category))];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Breadcrumb */}
      <div className="p-6 pb-0">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/dental-supply" className="hover:text-blue-600">
            الرئيسية
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <Link to="/dental-supply/brands" className="hover:text-blue-600">
            العلامات التجارية
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-gray-900">{brandData.arabicName}</span>
        </nav>
      </div>

      {/* Brand Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-yellow-500 to-orange-500 relative overflow-hidden">
          <img
            src={brandData.cover}
            alt={brandData.arabicName}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Premium Badge */}
          <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Crown className="w-5 h-5" />
            علامة تجارية بريميوم
          </div>
        </div>

        {/* Brand Info */}
        <div className="relative -mt-16 mx-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Logo and Basic Info */}
              <div className="flex items-start gap-4">
                <img
                  src={brandData.logo}
                  alt={brandData.arabicName}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {brandData.arabicName}
                    </h1>
                    {brandData.verified && (
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        موثقة
                      </div>
                    )}
                    {brandData.premium && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        بريميوم
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{brandData.name}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(brandData.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{brandData.rating}</span>
                    <span className="text-gray-600">
                      ({brandData.reviewCount} تقييم)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{brandData.country}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:min-w-80">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {brandData.productsCount}
                  </div>
                  <div className="text-xs text-gray-500">منتج</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {brandData.established}
                  </div>
                  <div className="text-xs text-gray-500">تأسست</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900">
                    {brandData.popularity}%
                  </div>
                  <div className="text-xs text-gray-500">شعبية</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">
                    {brandData.growth}
                  </div>
                  <div className="text-xs text-gray-500">نمو</div>
                </div>
              </div>
            </div>

            {/* Popularity Bar */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>مستوى الشعبية العالمي</span>
                <span>{brandData.popularity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${brandData.popularity}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="p-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {[
            { id: "products", label: "المنتجات", icon: Package },
            { id: "about", label: "عن العلامة", icon: Award },
            { id: "specialities", label: "التخصصات", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white text-yellow-600 shadow-sm"
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
                  placeholder="ابحث في منتجات العلامة التجارية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="featured">المنتجات المميزة</option>
                <option value="popular">الأكثر شهرة</option>
                <option value="price-low">السعر من الأقل</option>
                <option value="price-high">السعر من الأعلى</option>
                <option value="rating">الأعل�� تقييماً</option>
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
                <h3 className="text-xl font-bold mb-4">عن العلامة التجارية</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {brandData.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">سنة التأسيس</div>
                    <div className="font-bold">{brandData.established}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">المقر الرئيسي</div>
                    <div className="font-bold">{brandData.headquarters}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">ال��اريخ والإنجازات</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {brandData.history}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold mb-3">الجوائز والشهادات</h4>
                <div className="space-y-3">
                  {brandData.awards.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                    >
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-700 font-medium">{award}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">الرؤية</h4>
                <p className="text-gray-700 leading-relaxed">
                  {brandData.vision}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">الموقع الإلكتروني</h4>
                <a
                  href={`https://${brandData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>{brandData.website}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specialities" && (
          <div>
            <h3 className="text-xl font-bold mb-6">مجالات التخصص</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandData.specialities.map((speciality, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-lg">
                      {speciality}
                    </span>
                    <p className="text-gray-600 text-sm">
                      منتجات متخصصة وعالية الجودة
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
