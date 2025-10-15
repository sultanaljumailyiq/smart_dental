import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Sparkles,
  Gift,
  Clock,
  Users,
  Star,
  ArrowRight,
  Heart,
  Zap,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface PromoMessage {
  id: number;
  text: string;
  cta: string;
  link: string;
  icon: React.ElementType;
  bgColor: string;
  urgent?: boolean;
}

const promoMessages: PromoMessage[] = [
  {
    id: 1,
    text: "🎉 احصل على استشارة مجانية مع أطباء معتمدين",
    cta: "ابدأ الآن",
    link: "/smart-chat",
    icon: Heart,
    bgColor: "from-pink-500 to-rose-600",
    urgent: true,
  },
  {
    id: 2,
    text: "⚡ تشخيص ذكي فوري بدقة 95% - مجاناً تماماً",
    cta: "جرب الآن",
    link: "/ai-diagnosis",
    icon: Zap,
    bgColor: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    text: "📍 اكتشف أقرب عيادة معتمدة في منطقتك",
    cta: "ا��ثر على عيادة",
    link: "/marketplace",
    icon: Star,
    bgColor: "from-green-500 to-emerald-600",
  },
  {
    id: 4,
    text: "📞 دعم فني متاح 24/7 لمساعدتك",
    cta: "تواصل معنا",
    link: "/admin/support",
    icon: Phone,
    bgColor: "from-purple-500 to-indigo-600",
  },
];

export default function FloatingPromoBar() {
  const { language } = useI18n();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % promoMessages.length);
        setIsAnimating(false);
      }, 300);
    }, 5000); // تغيير كل 5 ثوانٍ

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentPromo = promoMessages[currentMessage];
  const CurrentIcon = currentPromo.icon;

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto",
      language === "ar" ? "text-right" : "text-left"
    )}>
      <div className={cn(
        "relative overflow-hidden rounded-2xl shadow-2xl border border-white/20",
        "bg-gradient-to-r",
        currentPromo.bgColor,
        "transition-all duration-500",
        isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\"/%3E%3C/g%3E%3C/svg%3E')]"}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-white" />
              </div>

              {/* Message content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  {currentPromo.urgent && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      عاجل
                    </span>
                  )}
                  <span className="text-yellow-300 text-sm font-medium">
                    عرض محدود
                  </span>
                </div>
                <p className="text-white font-medium text-sm lg:text-base">
                  {currentPromo.text}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* CTA Button */}
              <Link
                to={currentPromo.link}
                className="bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>{currentPromo.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-1 mt-3">
            {promoMessages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-1 rounded-full transition-all duration-300",
                  index === currentMessage
                    ? "bg-white"
                    : "bg-white/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-2 right-4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-100"></div>
        <div className="absolute bottom-2 left-8 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Statistics bar */}
      <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Users className="w-4 h-4" />
            <span className="font-semibold">50,000+</span>
            <span className="text-gray-600">مريض راضٍ</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2 text-green-600">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">4.9/5</span>
            <span className="text-gray-600">تقييم المستخدمين</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2 text-purple-600">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">24/7</span>
            <span className="text-gray-600">دعم فني</span>
          </div>
        </div>
      </div>
    </div>
  );
}
