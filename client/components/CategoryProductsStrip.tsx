import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Eye, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { dentalProducts, getProductsByCategory } from "@/data/dentalProducts";
import { getCategoryByName } from "@/data/categories";

interface CategoryProductsStripProps {
  categoryName: string;
  title?: string;
  excludeProductId?: number;
  limit?: number;
  className?: string;
}

export default function CategoryProductsStrip({
  categoryName,
  title,
  excludeProductId,
  limit = 8,
  className = "mb-6",
}: CategoryProductsStripProps) {
  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Get products from the category
  const categoryProducts = getProductsByCategory(categoryName)
    .filter((product) => product.id !== excludeProductId)
    .slice(0, limit);

  // Get category info for Arabic name
  const category = getCategoryByName(categoryName);
  const displayTitle =
    title || `منتجات ${category?.arabicName || categoryName}`;

  if (categoryProducts.length === 0) {
    return null;
  }

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative unified-product-card">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <Link to={`/dental-supply/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.arabicName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isNew && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              جديد
            </div>
          )}
          {product.isExclusive && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              حصري
            </div>
          )}
          {product.discount && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product);
            }}
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

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/dental-supply/product/${product.id}`} className="block">
          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
            {product.arabicName}
          </h3>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.arabicName.includes("حزمة") && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              أدوات فحص
            </span>
          )}
          {product.arabicName.includes("تبييض") && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              جل تبييض
            </span>
          )}
        </div>

        {/* Rating and Sales */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
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
              ({product.reviewCount})
            </span>
          </div>
          <span className="text-xs text-gray-500">89 مُباع</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()} د.ع
              </span>
            )}
          </div>
          {product.discount && (
            <div className="text-left">
              <span className="inline-block bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                وفر {(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
        <Link
          to={`/dental-supply/category/${category?.id || categoryName.toLowerCase()}`}
          className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
        >
          عرض الكل
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Horizontal Scroll - Unified Design */}
      <div className="unified-product-grid product-scroll-enhanced">
        {categoryProducts.map((product) => (
          <UnifiedProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </div>
  );
}
