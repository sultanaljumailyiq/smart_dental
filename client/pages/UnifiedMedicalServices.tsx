import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  MapPin,
  Brain,
  BookOpen,
  Phone,
  ArrowRight,
  Clock,
  Star,
  Users,
  Building,
  Activity,
  Target,
  Sparkles,
  CheckCircle,
  Globe,
  Shield,
  HeartHandshake,
  Zap,
  Search,
  FileText,
  Camera,
  MessageCircle,
  Award,
  Navigation,
  Heart,
  Ambulance,
  AlertCircle,
  Map,
  BookOpenCheck,
  GraduationCap,
  Info,
  ExternalLink,
  BadgeCheck,
  Headphones,
  Filter,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedInteractiveMap from "@/components/UnifiedInteractiveMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  gradient: string;
  features: string[];
  isExternal?: boolean;
  badge?: string;
}

interface MedicalSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  cards: ServiceCard[];
}

const medicalSections: MedicalSection[] = [
  {
    id: "emergency",
    title: "الطوارئ والخدمات القريبة",
    subtitle: "خدمات سريعة ومتاحة",
    description:
      "خدمة طوارئ فورية والبحث عن العيادات القريبة باستخدا�� الخريطة التفاعلية",
    icon: Ambulance,
    color: "red",
    gradient: "from-red-500 to-orange-500",
    cards: [
      {
        id: "emergency-call",
        title: "خط الطوارئ المجاني",
        description: "اتصل الآن للحصول على مساعدة فورية - متاح 24/7",
        icon: Phone,
        path: "tel:911",
        color: "red",
        gradient: "from-red-500 to-red-600",
        features: ["متاح 24/7", "استجابة ��ورية", "مجاني"],
        isExternal: true,
        badge: "عاجل",
      },
      {
        id: "interactive-map",
        title: "الخريطة التفاعلية",
        description: "اعثر على العيادات والمستشفيات القريبة منك",
        icon: Map,
        path: "#medical-map",
        color: "teal",
        gradient: "from-teal-500 to-green-500",
        features: ["خريطة تفاعلية", "بحث بالموقع", "تفاصيل شاملة"],
        badge: "مميز",
      },
      {
        id: "emergency-guide",
        title: "دليل الإسعافات الأولية",
        description: "خطوات مهمة للتعامل مع الحالات الطارئة",
        icon: AlertCircle,
        path: "/emergency",
        color: "orange",
        gradient: "from-orange-500 to-red-500",
        features: ["خطوات واضحة", "صور توضيحية", "سهل التطبيق"],
      },
      {
        id: "emergency-locations",
        title: "أقرب مستشفى للطوارئ",
        description: "العثور على أقرب مستشفيات الطوارئ مع التوجيه",
        icon: Navigation,
        path: "/emergency",
        color: "red",
        gradient: "from-red-600 to-orange-600",
        features: ["GPS دقيق", "معلومات التواصل", "أوقات العمل"],
      },
      {
        id: "clinic-reviews",
        title: "تقييمات العيادات",
        description: "اقرأ تجارب المرضى الحقيقية وتقييماتهم",
        icon: Star,
        path: "/emergency",
        color: "yellow",
        gradient: "from-yellow-500 to-orange-500",
        features: ["تقييمات حقيقية", "تعليقات مفصلة", "تقييمات متنوعة"],
      },
      {
        id: "doctor-profiles",
        title: "ملفات الأطباء",
        description: "تعرف على تخصصات وخبرات الأطباء",
        icon: Users,
        path: "/emergency",
        color: "blue",
        gradient: "from-blue-500 to-teal-500",
        features: ["سيرة ذاتية", "التخصصات", "سنوات الخبرة"],
      },
    ],
  },
  {
    id: "smart-diagnosis",
    title: "التشخيص الذكي",
    subtitle: "ذكاء اصطناعي متقدم",
    description:
      "احصل على تشخيص أولي دقيق باستخدام الذكاء الاصطناعي وتحليل الصور الطبية",
    icon: Brain,
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    cards: [
      {
        id: "symptoms-checker",
        title: "فحص الأعراض الذكي",
        description: "ادخل أعراضك واحصل على تشخيص أولي دقيق",
        icon: Activity,
        path: "/ai-diagnosis",
        color: "purple",
        gradient: "from-purple-500 to-indigo-500",
        features: ["تشخيص فوري", "دقة عالية", "سهل الاستخدام"],
        badge: "ذكي",
      },
      {
        id: "photo-analysis",
        title: "تحليل الصور الطبية",
        description: "ارفع صور الأشعة أو التحاليل للحصول على تحليل دقيق",
        icon: Camera,
        path: "/photo-analysis",
        color: "blue",
        gradient: "from-blue-500 to-purple-500",
        features: ["تحليل دقيق", "نتائج سريعة", "تقارير مفصلة"],
        badge: "متقدم",
      },
      {
        id: "ai-consultation",
        title: "استشارة ذكية",
        description: "احصل على استشارة طبية بالذكاء الاصطناعي",
        icon: MessageCircle,
        path: "/smart-chat",
        color: "indigo",
        gradient: "from-indigo-500 to-purple-500",
        features: ["استشارة فورية", "إجابات دقيقة", "متاح دائماً"],
      },
    ],
  },
  {
    id: "education",
    title: "المحتوى والمقالات التعليمية",
    subtitle: "تعليم طبي موثوق",
    description:
      "تعلم عن صحتك من خلال مقالات طبية موثوقة ومحتوى تعليمي من أطباء متخصصين",
    icon: BookOpen,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    cards: [
      {
        id: "health-articles",
        title: "مقالات طبية شاملة",
        description: "مقالات مفصلة عن مختلف المواضيع الطبية",
        icon: FileText,
        path: "/articles/",
        color: "emerald",
        gradient: "from-emerald-500 to-green-500",
        features: ["محتوى موث��ق", "مواضيع متنوعة", "سهل الفهم"],
        badge: "موثوق",
      },
      {
        id: "health-tips",
        title: "نصائح صحية يومية",
        description: "نصائح عملية يومية للحفاظ على صحتك",
        icon: Sparkles,
        path: "/articles/",
        color: "green",
        gradient: "from-green-500 to-emerald-500",
        features: ["نصائح عملية", "سهلة التطبيق", "محدثة باستمرار"],
      },
      {
        id: "disease-info",
        title: "معلومات الأمراض",
        description: "دليل شامل عن الأمراض وطرق الوقاية والعلاج",
        icon: Info,
        path: "/articles/",
        color: "blue",
        gradient: "from-blue-500 to-emerald-500",
        features: ["معلومات شاملة", "طرق الوقاية", "العلاجات المتاحة"],
      },
    ],
  },
];

const quickStats = [
  { label: "مريض سعيد", value: "50K+", icon: Users, color: "blue" },
  { label: "طبيب متخصص", value: "200+", icon: Stethoscope, color: "green" },
  { label: "عيادة شريكة", value: "150+", icon: Building, color: "purple" },
  { label: "معدل الرضا", value: "98%", icon: Star, color: "orange" },
];

export default function UnifiedMedicalServices() {
  const [activeSection, setActiveSection] = useState<string>("emergency");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const currentSection =
    medicalSections.find((section) => section.id === activeSection) ||
    medicalSections[0];

  const handleCardClick = (path: string) => {
    if (path === "#medical-map") {
      document.getElementById("medical-map")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-6 pb-20">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                منصتك الطبية الشاملة
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
                احصل على أفضل الخدمات الطبية من التشخيص الذكي إلى البحث عن
                العيادات القريبة
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Horizontal Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              {medicalSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "p-6 transition-all duration-300 text-center border-r border-gray-100 last:border-r-0",
                      isActive
                        ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <section.icon
                        className={cn(
                          "w-8 h-8 transition-transform",
                          isActive && "scale-110",
                        )}
                      />
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {section.title}
                        </h3>
                        <p
                          className={cn(
                            "text-xs",
                            isActive ? "text-white/80" : "text-gray-500",
                          )}
                        >
                          {section.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Section Content */}
          <div className="transition-all duration-500">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg",
                    `bg-gradient-to-r ${currentSection.gradient}`,
                  )}
                >
                  <currentSection.icon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentSection.title}
                  </h2>
                  <p className="text-gray-600">{currentSection.description}</p>
                </div>
              </div>
            </div>

            {/* Interactive Map for Emergency Section */}
            {activeSection === "emergency" && (
              <div id="medical-map" className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <Map className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      الخريطة التفاعلية للعيادات القريبة
                    </h3>
                  </div>
                  
                  <UnifiedInteractiveMap />

                  {/* Quick Links */}
                  <div className="mt-6 -mx-1">
                    <div className="flex flex-row flex-wrap justify-center items-start gap-2 overflow-x-auto snap-x snap-mandatory px-1">
                      <Link to="/emergency/first-aid" className="snap-start whitespace-nowrap px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200">دليل الإسعافات الأولية</Link>
                      <Link to="/emergency/hospitals" className="snap-start whitespace-nowrap px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200">المستشفيات القريبة</Link>
                      <Link to="/emergency/pain-management" className="snap-start whitespace-nowrap px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200">إدارة الألم</Link>
                      <Link to="/emergency/dental" className="snap-start whitespace-nowrap px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium hover:bg-amber-200">طوارئ الأسنان</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Emergency Main Cards */}
            {activeSection === "emergency" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                {/* Dental Emergency main card */}
                <div onClick={() => setExpandedCard(expandedCard === "dental-emergency-main" ? null : "dental-emergency-main")} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Heart className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base leading-tight">طوارئ الأسنان</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">إرشادات ومراكز طوارئ الأسنان</p>
                    {expandedCard === "dental-emergency-main" && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {["كسر الأسنان","خلع سن مفاجئ","التهاب شديد","نزيف اللثة","خراج"].map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full text-xs bg-red-50 text-red-700">{t}</span>
                          ))}
                        </div>
                        <Link to="/emergency/dental" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                          المزيد والتفاصيل
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                    <Link to="/emergency/dental" className="block w-full py-2 rounded-lg font-semibold text-white transition-all text-sm shadow-md text-center bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-lg">ابدأ الخدمة</Link>
                  </div>
                </div>

                {/* Pain Management main card */}
                <div onClick={() => setExpandedCard(expandedCard === "pain-management-main" ? null : "pain-management-main")} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base leading-tight">إدارة ألم الأسنان</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">طرق سريعة لتخفيف الألم</p>
                    {expandedCard === "pain-management-main" && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {["مسكنات آمنة","كمادات باردة","تنظيف لطيف","متى تراجع الطوارئ"].map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full text-xs bg-orange-50 text-orange-700">{t}</span>
                          ))}
                        </div>
                        <Link to="/emergency/pain-management" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                          المزيد والتفاصيل
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                    <Link to="/emergency/pain-management" className="block w-full py-2 rounded-lg font-semibold text-white transition-all text-sm shadow-md text-center bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg">ابدأ الخدمة</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentSection.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.path)}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div
                    className={cn(
                      "bg-gradient-to-r text-white p-4 relative",
                      card.gradient,
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <card.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base leading-tight">
                            {card.title}
                          </h3>
                          {card.badge && (
                            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                              {card.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      {card.isExternal ? (
                        <ExternalLink className="w-4 h-4 opacity-70" />
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {card.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {card.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle
                            className={cn("w-4 h-4", `text-${card.color}-500`)}
                          />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {card.path !== "#medical-map" && (
                      <Link
                        to={card.path}
                        target={card.isExternal ? "_blank" : undefined}
                        rel={
                          card.isExternal ? "noopener noreferrer" : undefined
                        }
                        className={cn(
                          "w-full py-2 rounded-lg font-semibold text-white transition-all text-sm shadow-md block text-center",
                          `bg-gradient-to-r ${card.gradient}`,
                          "hover:shadow-lg",
                        )}
                      >
                        {card.isExternal ? "اتصل الآن" : "ابدأ الخدمة"}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Section-specific Additional Content */}
            {activeSection === "smart-diagnosis" && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center mb-8">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">
                  تقنية الذكاء الاصطناعي المتقدمة
                </h3>
                <p className="mb-6 text-purple-100 max-w-2xl mx-auto">
                  نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم تشخيص دقيق وسريع
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-xs text-purple-200">دقة التشخيص</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2 دقيقة</div>
                    <div className="text-xs text-purple-200">وقت التحليل</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs text-purple-200">متاح دائماً</div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "education" && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">مكتبة طبية شاملة</h3>
                <p className="mb-6 text-emerald-100 max-w-2xl mx-auto">
                  اكتشف مئات المقالات والنصائح الطبية الموثوقة مع أطباء متخصصين
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs text-emerald-200">مقال طبي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs text-emerald-200">طبيب كاتب</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">يومي</div>
                    <div className="text-xs text-emerald-200">
                      تحديث المحتوى
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    هل تحتاج مساعدة عاجلة؟
                  </h3>
                  <p className="text-red-100 text-lg">
                    اتصل بخط الطوارئ المجاني الآن - متاح على مدار الساعة
                  </p>
                </div>
              </div>
              <div className="text-center">
                <a
                  href="tel:911"
                  className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-2xl hover:bg-red-50 transition-colors block"
                >
                  911
                </a>
                <div className="text-red-100 text-sm mt-2">اتصل الآن</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
