import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  Grid3X3,
  ShoppingCart,
  Heart,
  MoreHorizontal,
  MapPin,
  Package,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function StoreLayout() {
  const [showMore, setShowMore] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Cart and Favorites contexts
  const { state: cartState } = useCart();
  const { favorites } = useFavorites();
  const cartItems = cartState?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Main Content */}
      <div className="pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar - Mobile and Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
          {/* Home */}
          <Link
            to="/dental-supply"
            className={cn(
              "flex flex-col items-center gap-0.5 p-1.5 transition-all duration-200 min-h-[48px] touch-manipulation flex-1",
              location.pathname === "/dental-supply"
                ? "text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors relative",
                location.pathname === "/dental-supply" && "bg-purple-100"
              )}
            >
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-center leading-none truncate max-w-full">
              الرئيسية
            </span>
          </Link>

          {/* Categories */}
          <Link
            to="/dental-supply/categories"
            className={cn(
              "flex flex-col items-center gap-0.5 p-1.5 transition-all duration-200 min-h-[48px] touch-manipulation flex-1",
              location.pathname === "/dental-supply/categories"
                ? "text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors relative",
                location.pathname === "/dental-supply/categories" && "bg-purple-100"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-center leading-none truncate max-w-full">
              جميع الفئات
            </span>
          </Link>

          {/* More Menu */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center gap-0.5 p-1.5 transition-all duration-200 min-h-[48px] touch-manipulation flex-1",
              showMore
                ? "text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors relative",
                showMore && "bg-purple-100"
              )}
            >
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-center leading-none truncate max-w-full">
              المزيد
            </span>
          </button>
        </div>
      </div>

      {/* More Menu Modal */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">القائمة</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 pb-8 grid grid-cols-2 gap-3">
              {/* Favorites */}
              <Link
                to="/dental-supply/favorites"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-md transition-all"
              >
                <div className="p-2 bg-pink-500 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">المفضلة</div>
                  {favorites.length > 0 && (
                    <div className="text-xs text-gray-600">{favorites.length} منتج</div>
                  )}
                </div>
              </Link>

              {/* Cart */}
              <Link
                to="/dental-supply/cart"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">سلة التسوق</div>
                  {cartItems.length > 0 && (
                    <div className="text-xs text-gray-600">{cartItems.length} منتج</div>
                  )}
                </div>
              </Link>

              {/* Orders */}
              <Link
                to="/dental-supply/orders"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all"
              >
                <div className="p-2 bg-green-500 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">الطلبات</div>
                </div>
              </Link>

              {/* Addresses */}
              <Link
                to="/dental-supply/addresses"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all"
              >
                <div className="p-2 bg-purple-500 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">العناوين</div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
