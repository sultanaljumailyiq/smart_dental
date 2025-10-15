import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Timer, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

interface CompactOfferCardProps {
  product: {
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
  };
  className?: string;
}

export default function CompactOfferCard({
  product,
  className,
}: CompactOfferCardProps) {
  const { addItem: addToCart, isInCart } = useCart();

  return (
    <Link
      to={`/dental-supply/product/${product.id}`}
      className={cn(
        "group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden relative block",
        "w-full flex-shrink-0",
        className,
      )}
    >
      {/* Product Image - Very Compact */}
      <div className="h-24 bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-0.5">
            <Percent className="w-2 h-2" />
            {product.discount}%
          </div>
        )}

        {/* Timer Badge */}
        {product.timeLeft && (
          <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5">
            <Timer className="w-2 h-2" />
            <span className="hidden sm:inline">{product.timeLeft}</span>
          </div>
        )}
      </div>

      {/* Product Info - Ultra Compact */}
      <div className="p-2">
        {/* Product Name - Single Line */}
        <h3 className="font-bold text-gray-900 text-xs mb-1 line-clamp-1 leading-tight">
          {product.arabicName}
        </h3>

        {/* Price & Rating - Horizontal */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-xs">
              {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating - Compact */}
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({...product, id: product.id.toString()});
          }}
          className={cn(
            "w-full p-1.5 rounded text-xs font-medium transition-all duration-300",
            isInCart(product.id.toString())
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700",
          )}
        >
          <div className="flex items-center justify-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            {isInCart(product.id.toString()) ? "في السلة" : "أضف"}
          </div>
        </button>
      </div>
    </Link>
  );
}
