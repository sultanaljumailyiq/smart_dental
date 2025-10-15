import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Clock,
  Percent,
  ArrowRight,
  Gift,
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCard {
  id: number;
  name: string;
  arabicName: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  discount?: number;
  category: string;
}

interface FeaturedOffersProps {
  className?: string;
}

// بيانات المنتجات المميزة للعرض
const featuredProducts: ProductCard[] = [
  {
    id: 1,
    name: "Rotating Lounge Chair",
    arabicName: "كرسي دوار مريح",
    description: "كرسي جلدي فاخر",
    price: 39.0,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    category: "أثاث",
  },
  {
    id: 2,
    name: "Pearl Beading Chair",
    arabicName: "كرسي مزين باللؤلؤ",
    description: "للمختبرات المتقدمة",
    price: 35.0,
    image:
      "https://images.unsplash.com/photo-1566913904946-ad7c0c83f6ce?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 89,
    category: "أثاث",
  },
  {
    id: 3,
    name: "Rotating Lounge Chair",
    arabicName: "كرسي دوار أبيض",
    description: "جلد أبيض فاخر",
    price: 39.0,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    category: "أثاث",
  },
];

export default function FeaturedOffers({ className }: FeaturedOffersProps) {
  return (
    <div className={cn("space-y-6", className)} dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            العروض المميزة
          </h2>
          <p className="text-gray-600">اكتشف أفضل العروض والخصومات الحصرية</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
          عرض الكل
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* التخطيط الرئيسي */}
      <div className="grid grid-cols-12 gap-4 h-[300px]">
        {/* البطاقات الثلاث على اليسار */}
        <div className="col-span-5 grid grid-cols-3 gap-3">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 relative group"
            >
              {/* صورة المنتج */}
              <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.arabicName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* زر الإضافة */}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* معلومات المنتج */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                  {product.arabicName}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {product.description}
                </p>

                {/* التقييم */}
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
                </div>

                {/* السعر */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                    Cart
                  </button>
                </div>

                {/* زر المفضلة */}
                <button className="absolute top-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                  <Heart className="w-3 h-3 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* البطاقة الترويجية الوسطى */}
        <div className="col-span-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                عرض خاص
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">خصم 20%</h3>
            <h4 className="text-lg mb-3">على المعدات المختارة</h4>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm">لفترة محدودة فقط</span>
            </div>

            <button className="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
              تسوق الآن
            </button>
          </div>

          {/* صورة المرأة */}
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-30">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F53b51ab3f16345959cd052274ebabf31?format=webp&width=800"
              alt="عرض ترويجي"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* تأثيرات بصرية */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* البطاقة اليمنى */}
        <div className="col-span-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            {/* الشعار العلوي */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">تجربة تسوق</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2">عروض الصيف</h3>
              <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                هنا عروض حصرية، شحن مجاني ومزايا خاصة لعملائنا المميزين
              </p>
            </div>

            {/* أيقونة التنبيه */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">7</span>
              </div>
              <span className="text-xs text-blue-100">أيام متبقية</span>
            </div>
          </div>

          {/* تأثيرات بصرية */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
      </div>

      {/* شريط إضافي للعروض السريعة */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">عروض البرق ⚡</h3>
              <p className="text-indigo-100">خصومات تصل إلى 60% لفترة محدودة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-indigo-200">ساعة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">35</div>
              <div className="text-xs text-indigo-200">دقيقة</div>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              تسوق الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
