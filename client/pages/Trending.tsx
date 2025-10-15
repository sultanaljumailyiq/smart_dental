import React, { useState } from "react";
import { Link } from "react-router-dom";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import {
  TrendingUp,
  ArrowRight,
  Search,
  Heart,
  Star,
  Eye,
  Plus,
  Filter,
  Grid3X3,
  List,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample trending products data
const trendingProducts = [
  {
    id: 1,
    name: "Pro Ⅱ Composite Resin",
    arabicName: "راتنج مركب برو 2",
    price: 385000,
    originalPrice: 450000,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 324,
    category: "مواد حشو",
    brand: "DentalTech",
    discount: 15,
    salesCount: 1250,
    growth: "+25%",
    inStock: true,
    trending: true,
  },
  {
    id: 2,
    name: "Digital X-ray Sensor",
    arabicName: "مستشعر الأشعة الرقمية",
    price: 2400000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 189,
    category: "أجهزة أشعة",
    brand: "XrayPro",
    salesCount: 890,
    growth: "+40%",
    inStock: true,
    trending: true,
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
    reviewCount: 156,
    category: "أدوات تنظيف",
    brand: "CleanTech",
    discount: 11,
    salesCount: 670,
    growth: "+18%",
    inStock: true,
    trending: true,
  },
  {
    id: 4,
    name: "LED Curing Light",
    arabicName: "ضوء المعالجة LED",
    price: 890000,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 203,
    category: "معدات ضوئية",
    brand: "LightCure",
    salesCount: 445,
    growth: "+32%",
    inStock: true,
    trending: true,
  },
  {
    id: 5,
    name: "Dental Drill Set",
    arabicName: "مجموعة مثاقب الأسنان",
    price: 320000,
    originalPrice: 380000,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 298,
    category: "أدوات جراحية",
    brand: "DrillMaster",
    discount: 16,
    salesCount: 780,
    growth: "+22%",
    inStock: true,
    trending: true,
  },
  {
    id: 6,
    name: "Dental Chair Unit",
    arabicName: "وحدة كرسي الأسنان",
    price: 15600000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 87,
    category: "معدات كبيرة",
    brand: "ChairPro",
    salesCount: 145,
    growth: "+55%",
    inStock: true,
    trending: true,
  },
];

export default function Trending() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("sales");

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative unified-product-card">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Trending Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Flame className="w-3 h-3" />
          الأكثر مبيعاً
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
            <Heart className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
            <Eye className="w-3.5 h-3.5 text-gray-600 hover:text-blue-500" />
          </button>
          <button className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {product.arabicName}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
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
          <div className="mr-auto flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 font-semibold">
              {product.growth}
            </span>
          </div>
        </div>

        {/* Sales Count */}
        <div className="flex items-center gap-1 mb-2">
          <Flame className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-gray-600">
            {product.salesCount} مبيعة
          </span>
        </div>

        {/* Price */}
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
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              product.inStock
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600",
            )}
          >
            {product.inStock ? "متوفر" : "نفذ"}
          </span>
        </div>
      </div>
    </div>
  );

  const filteredProducts = trendingProducts.filter(
    (product) =>
      product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "sales":
        return b.salesCount - a.salesCount;
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "growth":
        return (
          parseFloat(b.growth.replace("%", "").replace("+", "")) -
          parseFloat(a.growth.replace("%", "").replace("+", ""))
        );
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
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                الأكثر مبيعاً
              </h1>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                🔥 ترندينغ
              </span>
            </div>
            <p className="text-gray-600">
              المنتجات الأكثر مبيعاً والأسرع نمواً في المتجر
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المنتجات الترندية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right text-sm"
              />
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="sales">الأكثر مبيعاً</option>
              <option value="growth">الأسرع نمواً</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price">الأقل سعراً</option>
            </select>

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

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                المنتجات الترندية
              </p>
              <p className="text-2xl font-bold">{trendingProducts.length}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                إجمالي المبيعات
              </p>
              <p className="text-2xl font-bold">
                {trendingProducts
                  .reduce((sum, p) => sum + p.salesCount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">متوسط التقييم</p>
              <p className="text-2xl font-bold">
                {(
                  trendingProducts.reduce((sum, p) => sum + p.rating, 0) /
                  trendingProducts.length
                ).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">متوسط النمو</p>
              <p className="text-2xl font-bold">+28%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6">
        {sortedProducts.map((product) => (
          <UnifiedProductCard key={product.id} product={product} compact />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
        </div>
      )}

      {/* Load More */}
      {sortedProducts.length > 0 && (
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
            عرض المزيد من المنتجات الترندية
          </button>
        </div>
      )}
    </div>
  );
}
