import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Percent,
  Clock,
  Star,
  ArrowRight,
  X,
  ShoppingCart,
  Gift,
  Zap,
  Truck,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupplyPromoCardProps {
  className?: string;
}

// Mock promotional data
const currentPromo = {
  id: 1,
  title: "🔥 عرض محدود: تخفيضات على المعدات المتميزة",
  subtitle: "وفر حتى ٤٠٪ على معدات طب الأسنان الأساسية",
  provider: "شركة حلول تقنيات الأسنان",
  discount: 40,
  validUntil: "٣١ كانون الأول ٢٠٢٤",
  timeLeft: "٢٣ س ٤٥ د",
  minOrder: 5000,
  products: [
    {
      name: "نظام الأشعة السينية الرقمي",
      originalPrice: 15999,
      salePrice: 12999,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop",
      inStock: true,
    },
    {
      name: "كرسي أسنان LED",
      originalPrice: 8999,
      salePrice: 6299,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=150&fit=crop",
      inStock: true,
    },
    {
      name: "جهاز التعقيم بالبخار",
      originalPrice: 5299,
      salePrice: 3999,
      image:
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=150&fit=crop",
      inStock: false,
    },
  ],
  features: ["تركيب مجاني", "ضمان ٣ سنوات", "دعم ٢٤/٧"],
  urgent: true,
};

export default function SupplyPromoCard({ className }: SupplyPromoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2 relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div className="flex-1 mr-auto">
            <div className="flex gap-8 justify-start flex-row">
              <div className="text-xl font-bold w-auto">
                {currentPromo.title}
              </div>
              <div className="flex flex-col ml-auto w-auto">
                <div className="flex flex-row">
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full flex justify-end items-center ml-auto">
                    <span className="font-bold text-lg">
                      {currentPromo.discount}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center mx-auto">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      ينتهي خلال {currentPromo.timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center">
              <p className="text-red-100 ml-0 mr-auto">
                {currentPromo.subtitle}
              </p>
              <div className="flex items-center gap-6 text-sm text-red-100">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  توصيل مجاني
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  يشمل الضمان
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  تركيب سريع
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Products Preview */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {currentPromo.products.map((product, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 rounded-lg pt-3 px-3 pb-0 backdrop-blur-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <div className="flex flex-row">
                <div className="text-xs font-medium mb-1">{product.name}</div>
                {!product.inStock && (
                  <div className="text-xs text-red-200 mx-auto">
                    مخزون محدود
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs line-through text-red-200">
                  {product.originalPrice.toLocaleString()} د.ع
                </span>
                <span className="text-sm font-bold">
                  {product.salePrice.toLocaleString()} د.ع
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-white border-opacity-20 p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">المزايا المشمولة:</h4>
              <ul className="space-y-2">
                {currentPromo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">تفاصيل العرض:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-red-200">صالح حتى:</span>{" "}
                  {currentPromo.validUntil}
                </div>
                <div>
                  <span className="text-red-200">الحد الأدنى للطلب:</span>
                  {currentPromo.minOrder.toLocaleString()} د.ع
                </div>
                <div>
                  <span className="text-red-200">المورد:</span>{" "}
                  {currentPromo.provider}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">🎯 موصى به لعيادتك</h4>
            <p className="text-sm text-red-100">
              بناءً على مشترياتك الأخيرة وحجم عيادتك، يمكن لهذه العناصر أن تحسن
              من الكفاءة وتجربة المريض. نظام الأشعة السينية الرقمي سيكون ترقية
              رائعة من معداتك الحالية.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pb-[9px]">
        <div className="flex gap-3">
          <Link
            to="/dental-supply"
            className="flex-1 bg-white text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
          >
            تسوق الآن
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-3 border border-white border-opacity-30 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            {isExpanded ? "معلومات أقل" : "معلومات أكثر"}
          </button>
        </div>
      </div>

      {/* Quick Add to Cart */}
      <div className="px-6 pb-6">
        <div className="bg-white bg-opacity-10 rounded-lg pl-[21px]">
          <div className="flex flex-row justify-start items-center">
            <div className="flex items-center justify-center -ml-[13px]">
              <span className="font-medium mr-5">
                طلب سريع للمنتجات الشائعة:
              </span>
              <div className="flex items-center gap-1 text-sm mr-0 ml-auto">
                <Star className="w-4 h-4 fill-current" />
                <span>تقييم ٤.٨/٥</span>
              </div>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 py-0 px-3 pr-3 pl-[13px] rounded-lg text-sm font-medium transition-colors flex flex-row justify-center items-center text-left ml-auto mr-[26px]">
              <ShoppingCart className="w-9 h-4 flex flex-col mx-auto" />
              <span>حزمة المواد المستهلكة</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 pr-3 rounded-lg text-sm font-medium transition-colors flex flex-row justify-end items-center">
              <Package className="w-11 h-4 flex flex-row justify-center items-center mr-auto" />
              <span>عدة الصيانة</span>
            </button>
          </div>
          <div className="flex flex-row justify-center gap-[25px]"></div>
        </div>
      </div>
    </div>
  );
}
