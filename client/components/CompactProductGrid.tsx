import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Eye,
  Plus,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  category: string;
  brand: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
}

interface CompactProductGridProps {
  title: string;
  products: Product[];
  viewMode?: "grid" | "list";
  showFilters?: boolean;
  maxItems?: number;
  className?: string;
}

// بيانات المنتجات التجريبية
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Digital X-Ray System",
    arabicName: "نظام الأشعة السينية الرقمي",
    price: 45000,
    originalPrice: 52000,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    badge: "جديد",
    badgeColor: "bg-green-500",
    inStock: true,
    category: "أجهزة التشخيص",
    brand: "TechMed",
    isNew: true,
    discount: 13,
  },
  {
    id: 2,
    name: "Dental Chair Pro",
    arabicName: "كرسي الأسنان المتطور",
    price: 28000,
    originalPrice: 32000,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    badge: "الأكثر مبيعاً",
    badgeColor: "bg-orange-500",
    inStock: true,
    category: "أثاث طبي",
    brand: "DentalCare",
    isBestSeller: true,
    discount: 12,
  },
  {
    id: 3,
    name: "Sterilization Unit",
    arabicName: "وحدة التعقيم",
    price: 15500,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    category: "التعقيم",
    brand: "SterilTech",
  },
  {
    id: 4,
    name: "LED Dental Light",
    arabicName: "إضاءة الأسنان LED",
    price: 8500,
    originalPrice: 9500,
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 78,
    inStock: false,
    category: "الإضاءة",
    brand: "LightPro",
    discount: 10,
  },
  {
    id: 5,
    name: "Ultrasonic Scaler",
    arabicName: "جهاز التنظيف بالموجات",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    category: "أدوات التنظيف",
    brand: "UltraClean",
  },
  {
    id: 6,
    name: "Dental Handpiece",
    arabicName: "قبضة الأسنان الطبية",
    price: 3500,
    originalPrice: 4000,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 67,
    badge: "خصم",
    badgeColor: "bg-red-500",
    inStock: true,
    category: "أدوات يدوية",
    brand: "HandTool",
    discount: 12,
  },
];

export default function CompactProductGrid({
  title,
  products = sampleProducts,
  viewMode = "grid",
  showFilters = true,
  maxItems,
  className,
}: CompactProductGridProps) {
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  const categories = [
    "الكل",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts =
    selectedCategory === "الكل"
      ? displayProducts
      : displayProducts.filter((p) => p.category === selectedCategory);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* صورة المنتج */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* الشارات */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span
              className={cn(
                "px-2 py-1 text-xs font-semibold text-white rounded-full",
                product.badgeColor || "bg-blue-500",
              )}
            >
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <button className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* حالة المخزون */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
              نفد المخزون
            </span>
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="p-3">
        {/* اسم المنتج */}
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">
          {product.arabicName}
        </h3>

        {/* العلامة التجارية */}
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

        {/* التقييم */}
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
          <span className="text-xs text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* السعر */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600">
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* زر الإضافة للسلة */}
        <button
          disabled={!product.inStock}
          className={cn(
            "w-full py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            product.inStock
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed",
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? "أضف للسلة" : "غير متوفر"}
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-sm text-gray-600">
            {filteredProducts.length} منتج متوفر
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* أزرار عرض */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                currentViewMode === "grid"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                currentViewMode === "list"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 text-sm">
            عرض الكل
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* فلاتر */}
      {showFilters && (
        <div className="flex items-center gap-3 pb-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* شبكة المنتجات */}
      <div
        className={cn(
          "gap-4",
          currentViewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            : "space-y-3",
        )}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* رسالة فارغة */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600">
            لم نجد منتجات في هذه الفئة. جرب فئة أخرى.
          </p>
        </div>
      )}
    </div>
  );
}
