import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy,
  Brain,
  MessageSquare,
  Camera,
  BookOpen,
  MapPin,
  Phone,
  Award,
  Target,
  TrendingUp,
  Globe,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface PromoSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  bgGradient: string;
  icon: React.ElementType;
  stats: Array<{
    number: string;
    label: string;
    icon: React.ElementType;
  }>;
}

const promoSlides: PromoSlide[] = [
  {
    id: 1,
    title: "منصة طبية متكاملة",
    subtitle: "كل ما تحتاجه لصحة أسنانك",
    description: "تشخيص ذكي، استشارات فورية، وعيادات معتمدة في مكان واحد",
    features: [
      "تشخيص بالذكاء الاصطناعي",
      "استشارات طبية مباشرة",
      "عيادات معتمدة قريبة",
      "متابعة صحية شاملة",
    ],
    cta: "ابدأ الآن",
    ctaLink: "/ai-diagnosis",
    bgGradient: "from-blue-600 via-purple-600 to-indigo-700",
    icon: Heart,
    stats: [
      { number: "50K+", label: "مريض", icon: Users },
      { number: "1000+", label: "طبيب", icon: Award },
      { number: "24/7", label: "دعم", icon: Clock },
    ],
  },
  {
    id: 2,
    title: "ذكاء اصطناعي متقدم",
    subtitle: "تشخيص دقيق في ثوانٍ",
    description: "تقنيات الذكاء الاصطناعي لتشخيص سريع ودقيق لحالات الأسنان",
    features: [
      "تحليل فوري للأعراض",
      "دقة عالية في التشخيص",
      "توصيات علاجية مخصصة",
      "تقارير مفصلة",
    ],
    cta: "جرب الآن",
    ctaLink: "/ai-diagnosis",
    bgGradient: "from-emerald-500 via-teal-600 to-cyan-700",
    icon: Brain,
    stats: [
      { number: "95%", label: "دقة", icon: Target },
      { number: "2 ثانية", label: "سرعة", icon: Zap },
      { number: "10K+", label: "تشخيص", icon: TrendingUp },
    ],
  },
  {
    id: 3,
    title: "شبكة طبية واسعة",
    subtitle: "أفضل الأطباء في منطقتك",
    description: "اكتشف أقرب العيادات المعتمدة واحجز موعدك فوراً",
    features: ["عيادات معتمدة", "حجز فوري", "تقييمات حقيقية", "أسعار شفافة"],
    cta: "اكتشف",
    ctaLink: "/marketplace",
    bgGradient: "from-orange-500 via-red-500 to-pink-600",
    icon: MapPin,
    stats: [
      { number: "500+", label: "عيادة", icon: Shield },
      { number: "100+", label: "مركز", icon: Globe },
      { number: "4.9⭐", label: "تقييم", icon: Star },
    ],
  },
];

export default function DynamicPromoCard() {
  const { language } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(0);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
        setIsAnimating(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 100 / 70));
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentSlide]);

  const currentPromo = promoSlides[currentSlide];
  const CurrentIcon = currentPromo.icon;

  const handleSlideChange = (index: number) => {
    if (index === currentSlide || isAnimating) return;
    setProgress(0);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % promoSlides.length);
  };

  const prevSlide = () => {
    handleSlideChange(
      currentSlide === 0 ? promoSlides.length - 1 : currentSlide - 1,
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 max-md:mx-4 border border-white/10"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Background with enhanced gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
          currentPromo.bgGradient,
        )}
      >
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] animate-pulse"></div>

        {/* Dynamic floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute bg-white/10 rounded-full animate-float",
                i % 2 === 0 ? "animate-bounce" : "animate-pulse",
              )}
              style={{
                width: `${8 + i * 2}px`,
                height: `${8 + i * 2}px`,
                left: `${15 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-white to-yellow-200 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 max-md:w-8 max-md:h-8 max-md:left-2"
      >
        <ChevronLeft className="w-5 h-5 text-white max-md:w-4 max-md:h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 max-md:w-8 max-md:h-8 max-md:right-2"
      >
        <ChevronRight className="w-5 h-5 text-white max-md:w-4 max-md:h-4" />
      </button>

      {/* Main content - Reduced padding */}
      <div className="relative z-10 p-4 max-md:p-3">
        {/* Compact Header */}
        <div className="flex items-start justify-between mb-3 max-md:mb-2">
          <div className="flex items-center gap-3 max-md:gap-2 flex-1">
            <div className="relative">
              <div className="w-10 h-10 bg-white/25 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center shadow-xl max-md:w-8 max-md:h-8">
                <CurrentIcon className="w-5 h-5 text-white max-md:w-4 max-md:h-4" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse max-md:w-3 max-md:h-3">
                <Sparkles className="w-2 h-2 text-gray-900 max-md:w-1.5 max-md:h-1.5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className={cn(
                  "text-xl font-bold text-white leading-tight mb-1 max-md:text-lg max-md:mb-0.5 transition-all duration-500",
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0",
                )}
              >
                {currentPromo.title}
              </h2>
              <p
                className={cn(
                  "text-sm text-white/90 font-medium max-md:text-xs transition-all duration-500 delay-100",
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0",
                )}
              >
                {currentPromo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content with staggered animations */}
        <div
          className={cn(
            "transition-all duration-500 delay-200",
            isAnimating
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0",
          )}
        >
          {/* Compact Description */}
          <p className="text-white/85 text-sm leading-tight mb-3 max-md:text-xs max-md:mb-2">
            {currentPromo.description}
          </p>

          {/* Horizontal Features Cards */}
          <div className="flex gap-2 mb-3 max-md:gap-1 max-md:mb-2 overflow-x-auto pb-1">
            {currentPromo.features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex-shrink-0 min-w-0",
                  "animate-fade-in-up max-md:p-1.5",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-5 h-5 bg-green-400/20 rounded-md flex items-center justify-center flex-shrink-0 max-md:w-4 max-md:h-4">
                  <CheckCircle className="w-3 h-3 text-green-300 max-md:w-2.5 max-md:h-2.5" />
                </div>
                <span className="text-white font-medium text-xs whitespace-nowrap max-md:text-[10px]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Horizontal Stats and CTA */}
          <div className="flex gap-2 items-stretch max-md:gap-1">
            {/* Compact Stats */}
            {currentPromo.stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "text-center bg-white/15 backdrop-blur-md border border-white/30 rounded-lg p-2 flex-1 transition-all duration-300 hover:bg-white/25 hover:scale-105",
                    "animate-fade-in-scale max-md:p-1.5",
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-6 h-6 bg-white/25 rounded-lg flex items-center justify-center mx-auto mb-1 max-md:w-5 max-md:h-5 max-md:mb-0.5">
                    <StatIcon className="w-3 h-3 text-white max-md:w-2.5 max-md:h-2.5" />
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5 max-md:text-xs">
                    {stat.number}
                  </div>
                  <div className="text-xs text-white/80 max-md:text-[9px]">
                    {stat.label}
                  </div>
                </div>
              );
            })}

            {/* Compact CTA Button */}
            <Link
              to={currentPromo.ctaLink}
              className="group relative overflow-hidden bg-white text-gray-900 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 py-2 px-4 text-sm max-md:py-1.5 max-md:px-3 max-md:text-xs border border-white/20 hover:border-white/40 flex-1 max-w-[120px] max-md:max-w-[100px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 transition-all duration-300 group-hover:from-gray-50 group-hover:to-white"></div>
              <Play className="relative w-3 h-3 max-md:w-2.5 max-md:h-2.5 transition-transform group-hover:scale-110" />
              <span className="relative">{currentPromo.cta}</span>
              <ArrowRight className="relative w-3 h-3 max-md:w-2.5 max-md:h-2.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Compact indicators */}
        <div className="flex justify-center gap-2 mt-3 max-md:mt-2">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={cn(
                "relative w-8 h-2 rounded-full transition-all duration-300 max-md:w-6 max-md:h-1.5",
                index === currentSlide
                  ? "bg-white shadow-lg scale-110"
                  : "bg-white/30 hover:bg-white/50",
              )}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compact badge */}
      <div className="absolute top-3 right-3 max-md:top-2 max-md:right-2">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-2 py-1 rounded-xl font-bold text-xs shadow-lg border border-yellow-300/50 backdrop-blur-sm animate-pulse max-md:px-1.5 max-md:py-0.5 max-md:text-[10px]">
          🎁 مجاني
        </div>
      </div>
    </div>
  );
}
