import React, { useState } from "react";
import { Link } from "react-router-dom";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import {
  Star,
  Heart,
  Eye,
  Plus,
  Grid3X3,
  List,
  Award,
  Crown,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample featured products data
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
    premium: true,
    inStock: true,
    features: ["مقاوم للبقع", "شفاف", "مريح"],
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
    premium: true,
    inStock: true,
    features: ["دقة عالية", "سريع", "سهل الاستخدام"],
  },
  {
    id: 3,
    name: "Laser Therapy Device",
    arabicName: "جهاز العلاج بالليزر",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 34,
    category: "أجهزة ليزر",
    brand: "LaserPro",
    featured: true,
    premium: true,
    inStock: true,
    features: ["أمان عالي", "فعال", "متعدد الاستخدامات"],
  },
  {
    id: 4,
    name: "3D Dental Printer",
    arabicName: "طابعة الأسنان ثلاثية الأبعاد",
    price: 18000000,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 28,
    category: "طابعات ثلاثية الأبعاد",
    brand: "Print3D",
    featured: true,
    premium: true,
    inStock: true,
    features: ["دقة عالية", "سرعة طباعة", "مواد متنوعة"],
  },
  {
    id: 5,
    name: "Intraoral Camera",
    arabicName: "كاميرا داخل الفم",
    price: 2800000,
    originalPrice: 3200000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 156,
    category: "كاميرات طبية",
    brand: "CameraDent",
    discount: 12,
    featured: true,
    premium: true,
    inStock: true,
    features: ["وضوح عالي", "مقاوم للماء", "سهل التنظيف"],
  },
  {
    id: 6,
    name: "Surgical Microscope",
    arabicName: "مجهر جراحي",
    price: 25000000,
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 19,
    category: "مجاهر",
    brand: "MicroSurg",
    featured: true,
    premium: true,
    inStock: true,
    features: ["تكبير متغير", "إضاءة LED", "استقرار عالي"],
  },
];

export default function Featured() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("rating");

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative bg-gradient-to-br from-white to-yellow-50 unified-product-card">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Premium Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Crown className="w-3 h-3" />
          مميز
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
          <button className="w-7 h-7 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {product.arabicName}
        </h3>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features
            .slice(0, 2)
            .map((feature: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-2 py-0.5 rounded-full"
              >
                {feature}
              </span>
            ))}
        </div>

        {/* Rating & Reviews */}
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
          <div className="mr-auto">
            <Award className="w-3 h-3 text-yellow-500" />
          </div>
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
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
            متوفر
          </span>
        </div>
      </div>
    </div>
  );

  const filteredProducts = featuredProducts.filter(
    (product) =>
      product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price":
        return a.price - b.price;
      case "name":
        return a.arabicName.localeCompare(b.arabicName);
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
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                المنتجات المميزة
              </h1>
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                بريميوم
              </span>
            </div>
            <p className="text-gray-600">
              منتجات مختارة بعناية من أفضل العلامات التجارية العالمية
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المنتجات المميزة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right text-sm"
              />
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="price">الأقل سعراً</option>
              <option value="name">ترتيب أبجدي</option>
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

      {/* Featured Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">
                المنتجات المميزة
              </p>
              <p className="text-2xl font-bold">{featuredProducts.length}</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                متوسط التقييم
              </p>
              <p className="text-2xl font-bold">
                {(
                  featuredProducts.reduce((sum, p) => sum + p.rating, 0) /
                  featuredProducts.length
                ).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">المتوفر</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
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
    </div>
  );
}
