import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface BaseProduct {
  id: number | string;
  name?: string;
  arabicName?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  discount?: number;
  isNew?: boolean;
  inStock?: boolean;
}

interface UnifiedProductCardProps {
  product: BaseProduct;
  className?: string;
  compact?: boolean;
  showProgressBar?: boolean;
}

export default function UnifiedProductCard({
  product,
  className,
  compact = false,
  showProgressBar = false,
}: UnifiedProductCardProps) {
  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const title = product.arabicName || product.name || "";

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden relative",
        className,
      )}
    >
      {/* Product Image */}
      <Link to={`/dental-supply/product/${product.id}`} className="block relative aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Badges */}
        {product.discount && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            جديد
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product as any);
          }}
          className={cn(
            "absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors",
            isFavorite(String(product.id))
              ? "bg-red-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white"
          )}
        >
          <Heart className="w-3 h-3" />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-2">
        {/* Name */}
        <Link to={`/dental-supply/product/${product.id}`}>
          <h3 className="font-semibold text-[11px] text-gray-900 mb-1 line-clamp-1 leading-tight hover:text-purple-600 transition-colors">
            {title}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-2 h-2",
                  i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-sm font-bold text-green-600">
            {typeof product.price === 'number' ? product.price.toLocaleString() : product.price} د.ع
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {typeof product.originalPrice === 'number' ? product.originalPrice.toLocaleString() : product.originalPrice} د.ع
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {product.inStock !== false && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product as any);
            }}
            className={cn(
              "w-full py-1 rounded-md text-[10px] font-medium transition-all duration-200 flex items-center justify-center gap-1",
              isInCart(product as any)
                ? "bg-green-600 text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            <ShoppingCart className="w-3 h-3" />
            {isInCart(product as any) ? `في السلة (${getItemQuantity(product as any)})` : "إضافة"}
          </button>
        )}
      </div>
    </div>
  );
}
