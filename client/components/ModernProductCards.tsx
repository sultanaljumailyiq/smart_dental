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
  ChevronLeft,
  ChevronRight,
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
  discount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ModernProductCardsProps {
  title: string;
  products: Product[];
  showCarousel?: boolean;
  className?: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Pro Ⅱ Composite Resin",
    arabicName: "راتنج مركب برو 2",
    price: 385,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    badge: "جديد",
    badgeColor: "bg-green-500",
    inStock: true,
    category: "مواد حشو",
    brand: "DentalTech",
    isNew: true,
  },
  {
    id: 2,
    name: "X-ray Composite Resin GI",
    arabicName: "راتنج مركب للأشعة السينية",
    price: 24000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    badge: "الأكثر مبيعاً",
    badgeColor: "bg-orange-500",
    inStock: true,
    category: "مواد تشخيص",
    brand: "XrayTech",
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Reinforced Support Kit",
    arabicName: "طقم الدعم الم��وى",
    price: 63000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    category: "أطقم دعم",
    brand: "SupportPro",
  },
  {
    id: 4,
    name: "Micro Maintenance Oil",
    arabicName: "زيت الصيانة الدقيقة",
    price: 25000,
    originalPrice: 28000,
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 78,
    inStock: false,
    category: "صيانة",
    brand: "MicroCare",
    discount: 11,
  },
  {
    id: 5,
    name: "Swissruc Light-Curing Kit",
    arabicName: "طقم المعالجة بالضوء",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    category: "معالجة ضوئية",
    brand: "Swissruc",
  },
];

export default function ModernProductCards({
  title,
  products = sampleProducts,
  showCarousel = false,
  className,
}: ModernProductCardsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(products.length / 4)) %
        Math.ceil(products.length / 4),
    );
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
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

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
            <Heart className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
            <Eye className="w-3.5 h-3.5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-800">
              نفد المخزون
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            disabled={!product.inStock}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all",
              product.inStock
                ? "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed",
            )}
          >
            <Plus className="w-4 h-4" />
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

        {/* Rating */}
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
          <span className="text-xs text-gray-600 truncate">
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="font-bold text-base text-blue-600">
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!product.inStock}
          className={cn(
            "w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5",
            product.inStock
              ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-md"
              : "bg-gray-200 text-gray-500 cursor-not-allowed",
          )}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.inStock ? "أضف للسلة" : "غير متوفر"}
        </button>
      </div>
    </div>
  );

  return (
    <section className={cn("space-y-6", className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600">{products.length} منتج متوفر</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows for Carousel */}
          {showCarousel && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
            عرض الكل
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {showCarousel ? (
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${currentSlide * -100}%)` }}
          >
            {Array.from({ length: Math.ceil(products.length / 4) }).map(
              (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                    {products
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(products.length / 4) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400",
                  )}
                />
              ),
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "gap-4",
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
              : "flex flex-col space-y-4",
          )}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
