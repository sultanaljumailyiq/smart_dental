import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Stethoscope, MapPin, Brain, BookOpen, Phone, ArrowRight, Clock, Star, Users, Building, Activity, Target, Sparkles, CheckCircle, Globe, Shield, HeartHandshake, Zap, Search, FileText, Camera, MessageCircle, Award, Navigation, Heart, Ambulance, AlertCircle, Map, Calendar, BookOpenCheck, GraduationCap, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompactHeroSection, CompactCategoryNav } from "@/components/MobileOptimizedHeader";
import MobileDentalWidgets from "@/components/MobileDentalWidgets";
import NotificationBell from "@/components/NotificationBell";
import CompactAIAssistant, { FloatingAIButton, useAIAssistant } from "@/components/CompactAIAssistant";
import UnifiedInteractiveMap from "@/components/UnifiedInteractiveMap";
import { VisitorHeader } from "@/components/VisitorHeader";
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
}
interface MedicalCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  mainAction: {
    title: string;
    path: string;
    icon: React.ComponentType<any>;
  };
  cards: ServiceCard[];
}
const medicalCategories: MedicalCategory[] = [{
  id: "directory",
  title: "العيادات والمراكز القريبة",
  description: "اعثر على أقرب العيادات والمستشفيات عبر خريطة موحدة وبطاقات مصغرة موحدة",
  icon: MapPin,
  color: "teal",
  gradient: "from-teal-500 to-green-500",
  mainAction: {
    title: "البحث في الخريطة",
    path: "#directory-map",
    icon: Map
  },
  cards: [{
    id: "interactive-map",
    title: "الخريطة التفاع����ية",
    description: "اعثر على العيادات والمستشفيات القريبة منك",
    icon: Map,
    path: "#directory-map",
    color: "teal",
    gradient: "from-teal-500 to-green-500",
    features: ["خريطة تفاعلية", "��حث بالموقع", "تفاصيل شاملة"]
  }, {
    id: "emergency-call",
    title: "خط الطوارئ المجاني",
    description: "اتصل الآن للحصول على مساعدة فورية",
    icon: Phone,
    path: "tel:911",
    color: "red",
    gradient: "from-red-500 to-red-600",
    features: ["متاح 24/7", "استجابة فورية", "مجاني"],
    isExternal: true
  }, {
    id: "emergency-guide",
    title: "دليل الإسعافات الأولية",
    description: "خطوات مهمة للتعامل مع الحالات الطارئة",
    icon: AlertCircle,
    path: "/articles/#first-aid",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    features: ["خطوات واضحة", "صور ت��ضيحية", "سهل التطبيق"]
  }, {
    id: "emergency-locations",
    title: "أقرب ��ستشفى للطوارئ",
    description: "العثور على أقرب مستشفيات الطوارئ",
    icon: Navigation,
    path: "/articles/#first-aid",
    color: "red",
    gradient: "from-red-600 to-orange-600",
    features: ["GPS دقيق", "م��لومات التواصل", "أوقات العمل"]
  }]
}, {
  id: "emergency",
  title: "خدمات الطوارئ",
  description: "بطاقات صغيرة للأقسام الرئيسية: طوارئ عامة، طوارئ أسنان، الإسعافات الأولية، المراكز القريبة",
  icon: AlertCircle,
  color: "red",
  gradient: "from-red-500 to-orange-500",
  mainAction: {
    title: "اذهب للطوارئ",
    path: "/emergency",
    icon: AlertCircle
  },
  cards: [{
    id: "general-emergency",
    title: "طوارئ عامة",
    description: "دليل وأرقام الطوارئ",
    icon: Phone,
    path: "/emergency",
    color: "red",
    gradient: "from-red-500 to-red-600",
    features: ["911", "إرشادات"]
  }, {
    id: "dental-emergency",
    title: "طوارئ أسنان",
    description: "خدم��ت طوارئ الأسنان",
    icon: Stethoscope,
    path: "/emergency",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    features: ["استجابة سريعة", "حجز عاجل"]
  }, {
    id: "first-aid",
    title: "الإسعافات الأولية",
    description: "خطوات فورية للإنقاذ",
    icon: BookOpenCheck,
    path: "/emergency/first-aid",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    features: ["خطوات واضحة", "صور"]
  }]
}, {
  id: "removed-section",
  title: "البحث عن العيادات القريبة",
  description: "اعثر على أفضل العيادات والأطباء في منطقتك بالخريطة التفاعلية",
  icon: MapPin,
  color: "teal",
  gradient: "from-teal-500 to-green-500",
  mainAction: {
    title: "البحث في الخريطة",
    path: "#clinic-map",
    icon: Map
  },
  cards: [{
    id: "interactive-map",
    title: "الخريطة التفاعلية",
    description: "اعثر على العيادات القريبة منك بالخريطة",
    icon: Map,
    path: "#clinic-map",
    color: "teal",
    gradient: "from-teal-500 to-green-500",
    features: ["خريطة تفاعلية", "بحث بالموقع", "تفاصيل شاملة"]
  }, {
    id: "clinic-reviews",
    title: "تقييمات العيادات",
    description: "اقرأ تجارب المرضى الحقيقية",
    icon: Star,
    path: "/clinic-reviews",
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500",
    features: ["تقييمات حقيقية", "تعليقات مفصلة", "تقييمات متنوعة"]
  }, {
    id: "doctor-profiles",
    title: "ملفات الأطباء",
    description: "تعرف على تخصصات وخبرات الأطباء",
    icon: Users,
    path: "/doctor-profiles",
    color: "blue",
    gradient: "from-blue-500 to-teal-500",
    features: ["سيرة ذاتية", "التخصصات", "سنوات الخبرة"]
  }, {
    id: "clinic-facilities",
    title: "إمكانيات العيا��ات",
    description: "تعرف على كل الخدمات والأجهزة المتوفرة",
    icon: Building,
    path: "/clinic-facilities",
    color: "purple",
    gradient: "from-purple-500 to-blue-500",
    features: ["أجهزة حديثة", "خدمات متنوعة", "معايير الجودة"]
  }]
}, {
  id: "smart-diagnosis",
  title: "التشخيص الذكي",
  description: "احصل على تشخيص أولي دقيق باستخدام الذكاء الاصطناعي",
  icon: Brain,
  color: "purple",
  gradient: "from-purple-500 to-indigo-500",
  mainAction: {
    title: "ابدأ التشخيص الذكي",
    path: "/ai-diagnosis",
    icon: Brain
  },
  cards: [{
    id: "symptoms-checker",
    title: "فحص الأعراض",
    description: "ادخل أعراضك واحصل على تشخيص أولي",
    icon: Activity,
    path: "/ai-diagnosis",
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    features: ["تشخيص فوري", "دقة عالية", "سهل الاستخدام"]
  }, {
    id: "photo-analysis",
    title: "تحليل الصور الطبية",
    description: "ارفع صور الأشعة أو التحاليل للحصول على تحليل",
    icon: Camera,
    path: "/photo-analysis",
    color: "blue",
    gradient: "from-blue-500 to-purple-500",
    features: ["تحليل دقيق", "نتائج سريعة", "تقارير مفصلة"]
  }, {
    id: "ai-consultation",
    title: "استشارة ذكية",
    description: "احصل على استشارة طبية بالذكاء الاصطناعي",
    icon: MessageCircle,
    path: "/smart-chat",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-500",
    features: ["استشارة فورية", "إجابات دقي��ة", "متاح دائماً"]
  }]
}, {
  id: "education",
  title: "المحتوى التعليمي",
  description: "تعلم عن صحتك من خلال مقالات طبية موثوقة ومحتوى تعليمي متخصص",
  icon: BookOpen,
  color: "emerald",
  gradient: "from-emerald-500 to-teal-500",
  mainAction: {
    title: "تصفح المقالات",
    path: "/articles/",
    icon: BookOpenCheck
  },
  cards: [{
    id: "health-articles",
    title: "مقالات طبية",
    description: "مقالات شاملة عن مختلف المواضيع الطبية",
    icon: FileText,
    path: "/articles/",
    color: "emerald",
    gradient: "from-emerald-500 to-green-500",
    features: ["محتوى موثوق", "مواضيع متنوعة", "سهل الفهم"]
  }, {
    id: "health-tips",
    title: "نصائح صحية",
    description: "نصائح يومية للحفاظ على صحتك",
    icon: Sparkles,
    path: "/articles/",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    features: ["نصائح عملية", "سهلة التطبيق", "محدثة باستمرار"]
  }, {
    id: "disease-info",
    title: "معلومات الأمراض",
    description: "دليل شامل عن الأمراض وطرق الوقاية",
    icon: Info,
    path: "/articles/",
    color: "blue",
    gradient: "from-blue-500 to-emerald-500",
    features: ["معلومات شاملة", "طرق الوقاية", "العلاجات المتاحة"]
  }]
}];
const quickStats = [{
  label: "مريض سعيد",
  value: "50K+",
  icon: Users,
  color: "blue"
}, {
  label: "طبيب متخصص",
  value: "200+",
  icon: Stethoscope,
  color: "green"
}, {
  label: "عيادة شريكة",
  value: "150+",
  icon: Building,
  color: "purple"
}, {
  label: "معدل الرضا",
  value: "98%",
  icon: Star,
  color: "orange"
}];
const mainFeatures = [{
  title: "خريطة تفاعلية ذكية",
  description: "ابحث عن العيادات ��الأطباء بالق��ب منك",
  icon: Map,
  color: "teal"
}, {
  title: "تشخيص بالذكاء الاصطناعي",
  description: "احصل على تشخيص أولي دقيق في دقائق",
  icon: Brain,
  color: "purple"
}, {
  title: "طوارئ على مدار السا��ة",
  description: "خدمة طوارئ متاحة 24/7",
  icon: Ambulance,
  color: "red"
}, {
  title: "محتوى تعليمي موثوق",
  description: "مقالات ونصائح طبية من مصادر موثوقة",
  icon: BookOpen,
  color: "emerald"
}, {
  title: "أمان وخصوصية",
  description: "حماية كاملة لبياناتك الطبية",
  icon: Shield,
  color: "blue"
}, {
  title: "دعم متعدد اللغات",
  description: "خدماتنا م��احة بجميع اللغات",
  icon: Globe,
  color: "indigo"
}];
export default function ModernMedicalServices() {
  const [activeCategory, setActiveCategory] = useState<string>("directory");
  const {
    isOpen: isAIOpen,
    openAssistant,
    closeAssistant
  } = useAIAssistant();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);
  useEffect(() => {
    // Check URL parameters for section
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section && medicalCategories.find(cat => cat.id === section)) {
      setActiveCategory(section);

      // Auto-scroll to map if coming from landing page clinic search
      if (section === "directory" && location.hash === "#directory-map") {
        setTimeout(() => {
          document.getElementById("directory-map")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 500);
      }
    }
  }, [location]);
  const currentCategory = medicalCategories.find(cat => cat.id === activeCategory) || medicalCategories[0];

  const handleCardClick = (path: string) => {
    // التنقل للخرائط ضمن نفس الصفحة
    if (path === "#clinic-map" || path === "#emergency-map" || path === "#directory-map") {
      const targetId = path === "#directory-map" ? "directory-map" : path.substring(1);
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
    // الاتصال الهاتفي
    else if (path.startsWith("tel:")) {
      window.location.href = path;
    }
    // التنقل للصفحات الخارجية
    else if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    }
    // التنقل للصفحات داخل التطبيق
    else if (path.startsWith("/")) {
      navigate(path);
    }
    // التنقل للأقسام داخل نفس الصفحة
    else if (path.startsWith("#")) {
      const targetId = path.substring(1);
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  // Preferred order for categories
  const preferredOrder = ["smart-diagnosis", "directory", "emergency", "education"];

  // Prepare categories for compact nav
  const compactCategories = medicalCategories.filter(cat => cat.id !== "removed-section").sort((a, b) => preferredOrder.indexOf(a.id) - preferredOrder.indexOf(b.id)).map(cat => ({
    id: cat.id,
    title: cat.title,
    icon: cat.icon,
    gradient: cat.gradient,
    count: cat.cards?.length || 0
  }));
  return <>
    <VisitorHeader />
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="pb-20">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-3.5 pb-1">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                منصتك الطبية الشاملة
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-3">
                احصل على أفضل الخدمات الطبية من التشخيص الذكي إلى البحث عن
                العيادات القريبة
              </p>

              {/* Quick Access Buttons */}
              
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
          {/* Horizontal Category Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mx-auto mb-8 overflow-hidden">
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-0">
              {medicalCategories.filter(cat => cat.id !== "removed-section").sort((a, b) => preferredOrder.indexOf(a.id) - preferredOrder.indexOf(b.id)).map(category => {
              const isActive = activeCategory === category.id;
              return <button key={category.id} onClick={() => setActiveCategory(category.id)} className={cn("p-4 transition-all duration-300 text-center border-r border-gray-100 last:border-r-0", isActive ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg` : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}>
                      <div className="flex flex-col items-center gap-2">
                        <category.icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
                        <div>
                          <h3 className="font-bold text-xs mb-1">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                    </button>;
            })}
            </div>
          </div>

          {/* Active Category Content */}
          <div className="transition-all duration-500">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", `bg-gradient-to-r ${currentCategory.gradient}`)}>
                <currentCategory.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-row">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentCategory.title}
                  </h2>
                  
                </div>
                {activeCategory === "emergency"}
              </div>
            </div>

            {/* Interactive Map for Emergency and Clinic Search */}
            {activeCategory === "directory" && <div id="directory-map" className="mb-8">
                {/* Enhanced Promotional Cards Above Map */}
                <div className="flex flex-wrap justify-center md:gap-4 gap-0.5 mb-5">
                  {/* Interactive Map Card */}
                  <div onClick={() => handleCardClick("#directory-map")} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
                            <Map className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm leading-tight">
                            الخريطة التفاعلية
                          </h3>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-70 hover:opacity-100 hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                        اعثر على العيادات والمستشفيات القريبة منك
                      </p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-gray-800" />
                          <span className="text-gray-700 text-xs">
                            خريطة تفاعلية
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-gray-800" />
                          <span className="text-gray-700 text-xs">
                            بحث بالموقع
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Locations Card */}
                  <div onClick={() => handleCardClick("/emergency")} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
                            <Navigation className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm leading-tight">
                            أقرب مستشفى للطوارئ
                          </h3>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-70 hover:opacity-100 hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                        العثور على أقرب مستشفيات الطوارئ
                      </p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-red-500" />
                          <span className="text-gray-700 text-xs">
                            GPS دقيق
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-red-500" />
                          <span className="text-gray-700 text-xs">
                            معلومات التواصل
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* بطاقة إضافية موجهة للمرضى لحجز المواعيد */}
                <div className="mb-5">
                  <div onClick={() => handleCardClick("#directory-map")} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group transform hover:-translate-y-1">
                    
                    
                  </div>
                </div>

                <div className="bg-white rounded-xl border shadow p-6">
                  <UnifiedInteractiveMap />
                </div>
              </div>}

            {/* Interactive Map for Clinic Search */}
            {activeCategory === "clinic-search" && <div id="clinic-map" className="mb-8">
                <div className="bg-white rounded-xl border shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Map className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      خريطة العيادات القريبة
                    </h3>
                  </div>
                  <UnifiedInteractiveMap />
                </div>
              </div>}

            {/* Service Cards Section - Only show for non-emergency categories */}
            {activeCategory !== "directory" && <div className="flex flex-row gap-3 overflow-x-auto md:flex-wrap justify-center mb-8">
                {currentCategory.cards.map(card => <div key={card.id} onClick={() => handleCardClick(card.path)} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                    {/* Compact Card Header */}
                    <div className={cn("bg-gradient-to-r text-white p-3", card.gradient)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <card.icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm leading-tight">
                            {card.title}
                          </h3>
                        </div>
                        {card.isExternal ? <ExternalLink className="w-4 h-4 opacity-70" /> : <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                      </div>
                    </div>

                    {/* Compact Card Content */}
                    <div className="p-3">
                      <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                        {card.description}
                      </p>

                      {/* Compact Features */}
                      <div className="space-y-1 mb-3">
                        {card.features.slice(0, 2).map((feature, index) => <div key={index} className="flex items-center gap-1">
                            <CheckCircle className={cn("w-3 h-3", `text-${card.color}-500`)} />
                            <span className="text-gray-700 text-xs">
                              {feature}
                            </span>
                          </div>)}
                      </div>
                    </div>
                  </div>)}
              </div>}

            {/* Category-specific Additional Content */}
            {activeCategory === "smart-diagnosis" && <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center mb-8">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-3">
                  تقنية الذكاء الاصطناعي المتقدمة
                </h3>
                <p className="mb-4 text-purple-100 max-w-2xl mx-auto text-sm">
                  نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم تشخيص دقيق وسريع
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">95%</div>
                    <div className="text-xs text-purple-200">دقة التشخيص</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">2 دقيقة</div>
                    <div className="text-xs text-purple-200">وقت التحليل</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">24/7</div>
                    <div className="text-xs text-purple-200">متاح دائماً</div>
                  </div>
                </div>
              </div>}

            {activeCategory === "education" && <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl md:p-6 p-2 text-white text-center md:mb-8 mb-1">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-3">مكتبة طبية شاملة</h3>
                <p className="mb-4 text-emerald-100 max-w-2xl mx-auto text-sm">
                  اكتشف مئات المقالات والنصائح الطبية الموثوقة مع أطباء متخصصين
                </p>
                
              </div>}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                لماذا تختارنا؟
              </h2>
              <p className="text-gray-600">
                نوفر لك أفضل الخدمات الطبية بأحدث التقن��ات وأعلى معايير الجودة
                والأمان
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:gap-4 gap-1">
              {mainFeatures.map((feature, index) => <div key={index} className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={cn("w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-white mb-2 shadow-md", `bg-${feature.color}-500`)}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs">{feature.description}</p>
                </div>)}
            </div>
          </div>

          {/* Emergency Contact */}
          
        </div>
      </div>

      {/* AI Assistant */}
      <FloatingAIButton onClick={openAssistant} />
      <CompactAIAssistant isOpen={isAIOpen} onClose={closeAssistant} position="bottom-right" />
    </div>
  </>;
}