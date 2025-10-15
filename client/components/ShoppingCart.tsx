import React, { useState, useEffect } from "react";
import {
  ShoppingCart as CartIcon,
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  CreditCard,
  Truck,
  Shield,
  Star,
  MapPin,
  Clock,
  Tag,
  Gift,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLoading } from "./LoadingIndicators";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category: string;
  supplierId: string;
  supplierName: string;
  inStock: number;
  minOrder: number;
  maxOrder?: number;
  specifications?: string[];
  warranty?: string;
  shippingTime?: string;
}

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  city: string;
  district: string;
  street: string;
  nearestLandmark?: string;
  isDefault: boolean;
}

interface PromoCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  description: string;
}

// Mock data
const mockCartItems: CartItem[] = [
  {
    id: "1",
    productId: "prod1",
    name: "مادة التخدير الموضعي - يدوكائين 2%",
    brand: "Septodont",
    price: 15000,
    originalPrice: 18000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=300",
    category: "أدوية التخدير",
    supplierId: "sup1",
    supplierName: "شركة الرائد للمستلزمات الطبية",
    inStock: 50,
    minOrder: 1,
    maxOrder: 10,
    specifications: ["تركيز 2%", "حجم 1.8 مل", "مع الادرينالين"],
    warranty: "ضمان سنتين",
    shippingTime: "2-3 أيام عمل",
  },
  {
    id: "2",
    productId: "prod2",
    name: "حشوة الكومبوزيت الضوئية",
    brand: "3M ESPE",
    price: 85000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300",
    category: "مواد الحشو",
    supplierId: "sup2",
    supplierName: "شركة التقنيات المتقدمة",
    inStock: 25,
    minOrder: 1,
    maxOrder: 5,
    specifications: ["مقاومة عالية", "لون طبيعي", "سهل التطبيق"],
    warranty: "ضمان 3 سنوات",
    shippingTime: "1-2 أيام عمل",
  },
];

const mockAddresses: ShippingAddress[] = [
  {
    id: "1",
    name: "د. أحمد محمد علي",
    phone: "+964 770 123 4567",
    governorate: "بغداد",
    city: "الكرخ",
    district: "حي الجامعة",
    street: "شارع الكندي، بناية 15، الطابق 3",
    nearestLandmark: "بالقرب من مستشفى الجامعة",
    isDefault: true,
  },
];

const mockPromoCodes: PromoCode[] = [
  {
    code: "DENTAL20",
    type: "percentage",
    value: 20,
    minOrder: 100000,
    maxDiscount: 50000,
    expiryDate: "2024-03-31",
    description: "خصم 20% على جميع منتجات طب الأسنان",
  },
  {
    code: "NEWUSER",
    type: "fixed",
    value: 25000,
    minOrder: 75000,
    expiryDate: "2024-02-29",
    description: "خصم 25,000 د.ع للمستخدمين الجدد",
  },
];

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ShoppingCart({
  isOpen,
  onClose,
  className,
}: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(
    mockAddresses[0],
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [step, setStep] = useState<"cart" | "checkout" | "payment">("cart");
  const [loading, setLoading] = useState(false);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxQty = item.maxOrder || item.inStock;
          const quantity = Math.min(
            Math.max(newQuantity, item.minOrder),
            maxQty,
          );
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const applyPromoCode = () => {
    const promo = mockPromoCodes.find(
      (p) => p.code.toUpperCase() === promoCode.toUpperCase(),
    );

    if (!promo) {
      // Show error message
      return;
    }

    if (subtotal < promo.minOrder) {
      // Show minimum order error
      return;
    }

    if (new Date(promo.expiryDate) < new Date()) {
      // Show expired error
      return;
    }

    setAppliedPromo(promo);
    setPromoCode("");
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? Math.min(
          subtotal * (appliedPromo.value / 100),
          appliedPromo.maxDiscount || Infinity,
        )
      : appliedPromo.value
    : 0;

  const shippingCost = subtotal >= 100000 ? 0 : 15000; // Free shipping over 100,000 IQD
  const total = subtotal - promoDiscount + shippingCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const proceedToCheckout = () => {
    setStep("checkout");
  };

  const proceedToPayment = () => {
    setStep("payment");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          className,
        )}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CartIcon className="w-6 h-6 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">
              عربة التسوق ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <CartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                عربة التسوق فارغة
              </h3>
              <p className="text-gray-600 mb-6">
                أضف منتجات إلى عربة التسوق للمتابعة
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <>
              {step === "cart" && (
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm leading-5 mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {item.brand}
                            </p>
                            <p className="text-xs text-blue-600 mb-2">
                              {item.supplierName}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-bold text-purple-600">
                                {formatCurrency(item.price)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatCurrency(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                  disabled={
                                    item.quantity >=
                                    (item.maxOrder || item.inStock)
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                  <Heart className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {item.quantity < item.minOrder && (
                              <p className="text-xs text-red-600 mt-2">
                                الحد الأدنى للطلب: {item.minOrder}
                              </p>
                            )}

                            {item.quantity >= item.inStock && (
                              <p className="text-xs text-yellow-600 mt-2">
                                الكمية المتاحة: {item.inStock}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      كود الخصم
                    </h4>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">
                              {appliedPromo.code}
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            {appliedPromo.description}
                          </p>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="أدخل كود الخصم"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={applyPromoCode}
                          disabled={!promoCode.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          تطبيق
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">ملخص الطلب</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المجموع الفرعي</span>
                        <span className="font-medium">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>المبلغ المُوفر</span>
                          <span>-{formatCurrency(savings)}</span>
                        </div>
                      )}

                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>خصم كود الخصم</span>
                          <span>-{formatCurrency(promoDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">رسوم الشحن</span>
                        <span
                          className={cn(
                            "font-medium",
                            shippingCost === 0 ? "text-green-600" : "",
                          )}
                        >
                          {shippingCost === 0
                            ? "مجاني"
                            : formatCurrency(shippingCost)}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>الإجمالي</span>
                          <span className="text-purple-600">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {shippingCost > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm">
                            أضف {formatCurrency(100000 - subtotal)} للحصول على
                            شحن مجاني
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === "checkout" && (
                <div className="p-6 space-y-6">
                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      عنوان التسليم
                    </h3>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {selectedAddress.name}
                            </span>
                            {selectedAddress.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                افتراضي
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {selectedAddress.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.governorate}،{" "}
                            {selectedAddress.city}، {selectedAddress.district}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.street}
                          </p>
                          {selectedAddress.nearestLandmark && (
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedAddress.nearestLandmark}
                            </p>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          تغيير
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      خيارات التوصيل
                    </h3>

                    <div className="space-y-3">
                      <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600"></div>
                            <div>
                              <div className="font-medium text-gray-900">
                                التوصيل العادي
                              </div>
                              <div className="text-sm text-gray-600">
                                2-4 أيام عمل
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-blue-600">
                            {shippingCost === 0
                              ? "مجاني"
                              : formatCurrency(shippingCost)}
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                            <div>
                              <div className="font-medium text-gray-900">
                                التوصيل السريع
                              </div>
                              <div className="text-sm text-gray-600">
                                24 ساعة
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-gray-600">
                            {formatCurrency(25000)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">ملخص الطلب</h4>

                    <div className="space-y-2 text-sm">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}

                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>الإجمالي</span>
                          <span className="text-purple-600">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white">
            {step === "cart" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>دفع آمن ومضمون</span>
                </div>
                <ButtonLoading
                  loading={loading}
                  onClick={proceedToCheckout}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  متابعة الطلب • {formatCurrency(total)}
                </ButtonLoading>
              </div>
            )}

            {step === "checkout" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>الدفع الآمن</span>
                </div>
                <ButtonLoading
                  loading={loading}
                  onClick={proceedToPayment}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  تأكيد الطلب والدفع • {formatCurrency(total)}
                </ButtonLoading>
                <button
                  onClick={() => setStep("cart")}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  العودة للعربة
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Cart Badge Component
interface CartBadgeProps {
  itemCount: number;
  onClick: () => void;
  className?: string;
}

export function CartBadge({ itemCount, onClick, className }: CartBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-xl transition-all duration-200",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
    >
      <CartIcon className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </div>
      )}
    </button>
  );
}

export default ShoppingCart;
