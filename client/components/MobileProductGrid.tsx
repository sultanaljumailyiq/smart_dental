import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Eye, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Product {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  discount?: number;
  inStock: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
}

interface MobileProductGridProps {
  products: Product[];
  title: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  sectionClassName?: string;
}

export default function MobileProductGrid({
  products,
  title,
  showViewAll = false,
  viewAllLink = "#",
  sectionClassName = "mb-8",
}: MobileProductGridProps) {
  const isMobile = useIsMobile();
  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative unified-product-card lg:w-auto">
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
              toggleFavorite({...product, id: product.id.toString(), addedDate: new Date().toISOString()});
            }}
            className={cn(
              "w-7 h-7 shadow-md rounded-full flex items-center justify-center transition-colors",
              isFavorite(product.id.toString())
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

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              نفذ المخزون
            </span>
          </div>
        )}
      </div>

      {/* Product Info - Compact Design */}
      <div className="p-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/dental-supply/product/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
            {product.arabicName}
          </h3>
        </Link>

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
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price and Cart - Inline Design */}
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

          {/* Compact Cart Button */}
          {product.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({...product, id: product.id.toString()});
              }}
              className={cn(
                "p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105",
                isInCart(product.id.toString())
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              {isInCart(product.id.toString()) ? (
                <span className="text-xs font-bold px-1">
                  {getItemQuantity(product.id.toString())}
                </span>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={sectionClassName}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <Link
            to={viewAllLink}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
          >
            عرض الكل
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div
        className={cn(
          isMobile
            ? "flex gap-3 overflow-x-auto pb-2 px-1 mobile-scroll-container scrollbar-thin"
            : "grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        )}
      >
        {products.map((product) => (
          <UnifiedProductCard key={product.id} product={product} compact />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
