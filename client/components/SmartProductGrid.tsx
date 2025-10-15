import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, ShoppingCart, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
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
  timeLeft?: string;
  inStock: boolean;
}

interface SmartProductGridProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  className?: string;
  gridType?: "featured" | "flash" | "new" | "trending" | "compact";
  showProgressBar?: boolean;
}

export default function SmartProductGrid({
  title,
  products,
  viewAllLink,
  className,
  gridType = "featured",
  showProgressBar = false,
}: SmartProductGridProps) {
  const { addItem: addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Grid configurations based on type (like Google Play Store)
  const getGridConfig = () => {
    switch (gridType) {
      case "featured":
        return {
          containerClass:
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4",
          cardClass:
            "group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden",
          imageClass: "aspect-[4/3] bg-gray-50 relative overflow-hidden",
          contentClass: "p-2 lg:p-3",
          titleClass:
            "font-semibold text-gray-900 text-xs lg:text-sm mb-1 line-clamp-2 leading-tight",
          priceClass: "font-bold text-gray-900 text-xs lg:text-sm",
        };

      case "flash":
        return {
          containerClass:
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6",
          cardClass:
            "group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden",
          imageClass: "aspect-[5/4] bg-gray-50 relative overflow-hidden",
          contentClass: "p-3 lg:p-4",
          titleClass:
            "font-bold text-gray-900 text-sm lg:text-base mb-2 line-clamp-2 leading-tight",
          priceClass: "font-bold text-gray-900 text-sm lg:text-lg",
        };

      case "compact":
        return {
          containerClass:
            "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 lg:gap-3",
          cardClass:
            "group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden",
          imageClass: "aspect-square bg-gray-50 relative overflow-hidden",
          contentClass: "p-1.5 lg:p-2",
          titleClass:
            "font-medium text-gray-900 text-xs mb-1 line-clamp-2 leading-tight",
          priceClass: "font-semibold text-gray-900 text-xs",
        };

      default:
        return {
          containerClass:
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4",
          cardClass:
            "group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden",
          imageClass: "aspect-[4/3] bg-gray-50 relative overflow-hidden",
          contentClass: "p-2 lg:p-3",
          titleClass:
            "font-semibold text-gray-900 text-xs lg:text-sm mb-1 line-clamp-2 leading-tight",
          priceClass: "font-bold text-gray-900 text-xs lg:text-sm",
        };
    }
  };

  const config = getGridConfig();
  const displayProducts = products.slice(
    0,
    gridType === "flash" ? 4 : gridType === "compact" ? 12 : 8,
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <div className={config.cardClass}>
      {/* Product Image */}
      <div className={config.imageClass}>
        <Link to={`/dental-supply/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.arabicName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        {product.discount && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {product.timeLeft && (
          <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5">
            <Timer className="w-2.5 h-2.5" />
            <span className="hidden sm:inline text-xs">{product.timeLeft}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite({...product, id: product.id.toString(), addedDate: new Date().toISOString()});
            }}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
              isFavorite(product.id.toString())
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500",
            )}
          >
            <Heart className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className={config.contentClass}>
        {/* Brand - Only show on larger cards */}
        {gridType !== "compact" && (
          <div className="text-xs text-gray-500 mb-1 truncate">
            {product.brand}
          </div>
        )}

        {/* Product Name */}
        <Link to={`/dental-supply/product/${product.id}`}>
          <h3 className={config.titleClass}>{product.arabicName}</h3>
        </Link>

        {/* Rating - Only show on larger cards */}
        {gridType === "flash" && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Progress Bar for Flash Deals */}
        {showProgressBar && product.timeLeft && gridType === "flash" && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>المباع 78%</span>
              <span>متبقي 44</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: "78%" }}
              />
            </div>
          </div>
        )}

        {/* Price and Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={config.priceClass}>
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()} د.ع
              </span>
            )}
          </div>

          {/* Cart Button - Only show on larger cards */}
          {(gridType === "flash" || gridType === "featured") && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({...product, id: product.id.toString()});
              }}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isInCart(product.id.toString())
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              <ShoppingCart className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("mb-6 lg:mb-8", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h2
          className={cn(
            "font-bold text-gray-900",
            gridType === "flash" ? "text-xl lg:text-2xl" : "text-lg lg:text-xl",
          )}
        >
          {title}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm lg:text-base transition-colors"
          >
            عرض الكل
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className={config.containerClass}>
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600 text-sm">لم نجد أي منتجات في هذا القسم</p>
        </div>
      )}
    </div>
  );
}
