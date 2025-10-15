import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PromoSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  discount?: number;
  badge?: string;
  category: string;
}

interface MainPromoHeroProps {
  className?: string;
}

// بيانات تجريبية للشرائح الترويجية
const promoSlides: PromoSlide[] = [
  {
    id: 1,
    title: "اكتشف مستقبل طب الأسنان",
    subtitle: "تقنيات متطورة لعيادة عصرية",
    description:
      "استكشف أحدث التقنيات والمعدات الطبية المتطورة لتحسين خدماتك الطبية وراحة المرضى",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop",
    ctaText: "استكشف الآن",
    ctaLink: "/dental-equipment",
    discount: 25,
    badge: "جديد",
    category: "معدات طبية",
  },
  {
    id: 2,
    title: "عروض استثنائية على الأدوات الطبية",
    subtitle: "وفر حتى 40% على مجموعة مختارة",
    description:
      "مجموعة واسعة من الأدوات الطبية عالية الجودة بأسعار تنافسية لتلبية احتياجات عيادتك",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&h=500&fit=crop",
    ctaText: "تسوق الآن",
    ctaLink: "/dental-tools",
    discount: 40,
    badge: "عرض خاص",
    category: "أدوات طبية",
  },
  {
    id: 3,
    title: "مستلزمات التعقيم والسلامة",
    subtitle: "احم عيادتك ومرضاك",
    description:
      "أ��هزة التعقيم الأكثر تطوراً ومستلزمات السلامة لضمان بيئة طبية آمنة وصحية",
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=800&h=500&fit=crop",
    ctaText: "اطلع على المنتجات",
    ctaLink: "/sterilization",
    badge: "أساسي",
    category: "��عقيم",
  },
];

export default function MainPromoHero({ className }: MainPromoHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // التنقل التلقائي
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + promoSlides.length) % promoSlides.length,
    );
  };

  const currentPromo = promoSlides[currentSlide];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100",
        className,
      )}
    >
      {/* الخلفية والصورة */}
      <div className="relative h-[400px] lg:h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.6)), url(${currentPromo.image})`,
          }}
        />

        {/* المحتوى */}
        <div className="relative z-10 flex h-full">
          {/* النص الرئيسي */}
          <div className="flex-1 flex flex-row justify-center items-start text-white my-6 px-21 pr-14 pl-14">
            <div className="max-w-lg">
              {/* الشارة */}
              {currentPromo.badge && (
                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                  {currentPromo.badge}
                </span>
              )}

              {/* العنوان الرئيسي */}
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                {currentPromo.title}
              </h1>

              {/* العنوان الفرعي */}
              <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-blue-100">
                {currentPromo.subtitle}
              </h2>

              {/* الوصف */}
              <p className="text-lg mb-5 text-blue-50 leading-relaxed">
                {currentPromo.description}
              </p>

              <div className="flex flex-row gap-7">
                {/* زر العمل */}
                <button className="inline-flex items-center justify-center gap-1.5 bg-white text-blue-600 px-5 py-2.5 h-11 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {currentPromo.ctaText}
                </button>

                <div className="flex flex-row">
                  <div className="flex flex-row">
                    {/* الخصم */}
                    {currentPromo.discount && (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg flex flex-row justify-start gap-1">
                          <span>و وفر </span>
                          <span>{currentPromo.discount}</span>
                          <span>%</span>
                        </div>
                        <span className="text-blue-100">على منتجات مختارة</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* البطاقات الجانبية */}
          <div className="hidden lg:flex flex-col justify-center gap-7 px-8 w-111 mr-0 ml-14 mb-3">
            {/* بطاقة العرض المميز */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">
                  {currentPromo.category}
                </span>
                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">عرض اليوم المميز</h3>
              <p className="text-sm text-gray-600 mb-4">
                خصومات حصرية على أف��ل المنتجات
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
                <button className="text-blue-600 text-sm font-semibold hover:underline">
                  عرض التفاصيل
                </button>
              </div>
            </div>

            {/* بطاقة تجربة التسوق */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">تجربة تسوق متميزة</span>
              </div>
              <h3 className="font-bold mb-2">عروض الموسم</h3>
              <p className="text-sm text-indigo-100 mb-4">
                هنا عروض حصرية، شحن مجاني ومزايا خاصة لعملائنا
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                <span className="text-xs">7 أيام متبقية فقط</span>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التنقل */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* مؤشرات الشرائح */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
