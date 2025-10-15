import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Heart,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  Tag,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const cartItems = state?.items || [];
  const totalPrice = state?.totalPrice || 0;
  const shipping = totalPrice > 500000 ? 0 : 25000;
  const tax = totalPrice * 0.05;
  const promoDiscount = appliedPromo ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice + shipping + tax - promoDiscount;

  const handleApplyPromo = () => {
    if (
      promoCode.toLowerCase() === "student10" ||
      promoCode.toLowerCase() === "new2024"
    ) {
      setAppliedPromo(promoCode);
      setPromoCode("");
    }
  };

  const CartItem = ({ item }: { item: any }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.arabicName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                {item.arabicName}
              </h3>
              <p className="text-xs text-gray-500">
                {item.brand} • {item.category}
              </p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(0, item.quantity - 1))
                }
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium px-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-left">
              <div className="font-bold text-gray-900">
                {(item.price * item.quantity).toLocaleString()} د.ع
              </div>
              {item.originalPrice && (
                <div className="text-xs text-gray-500 line-through">
                  {(item.originalPrice * item.quantity).toLocaleString()} د.ع
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            سلة التسوق فارغة
          </h2>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
          </p>
          <Link
            to="/dental-supply/products"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            سلة التسوق
          </h1>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
            {cartItems.length} منتج
          </span>
        </div>
        <p className="text-gray-600">
          راجع منتجاتك المختارة وأكمل عملية الشراء
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              إفراغ سلة التسوق
            </button>
            <Link
              to="/dental-supply/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Promo Code */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              كود الخصم
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل كود الخصم"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تطبيق
              </button>
            </div>
            {appliedPromo && (
              <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                تم تطبيق كود الخصم: {appliedPromo}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">ملخص الطلب</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{totalPrice.toLocaleString()} د.ع</span>
              </div>

              <div className="flex justify-between">
                <span>الشحن</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0
                    ? "مجاني"
                    : `${shipping.toLocaleString()} د.ع`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>الضريبة (5%)</span>
                <span>{tax.toLocaleString()} د.ع</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>خصم ({appliedPromo})</span>
                  <span>-{promoDiscount.toLocaleString()} د.ع</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع الكلي</span>
                  <span>{finalTotal.toLocaleString()} د.ع</span>
                </div>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {shipping > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  أضف {(500000 - totalPrice).toLocaleString()} د.ع للحصول على
                  شحن مجاني
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              إتمام الشراء
            </button>
          </div>

          {/* Security Features */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">مميزات الأمان</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">دفع آمن ومشفر</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">توصيل سريع وآمن</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600">
                  ضمان استرداد الأموال
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
