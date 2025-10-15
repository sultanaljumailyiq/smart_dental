import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  Brain,
  Camera,
  FileText,
  Users,
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  ArrowRight,
  Heart,
  Eye,
  Pill,
  Activity,
  Shield,
  BookOpen,
  MessageCircle,
  Zap,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisitorHeader } from "@/components/VisitorHeader";

interface MedicalService {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  gradient: string;
  features: string[];
  availability: "متاح" | "قريباً" | "محدود";
  rating: number;
  estimatedTime: string;
}

const medicalServices: MedicalService[] = [
  {
    id: "ai-diagnosis",
    title: "التشخيص الذكي",
    description: "تشخيص طبي دقيق باستخدام الذكاء الاصطناعي",
    icon: Brain,
    path: "/ai-diagnosis",
    color: "purple",
    gradient: "from-purple-600 to-indigo-600",
    features: ["تشخيص فوري", "دقة عالية", "متاح 24/7"],
    availability: "متاح",
    rating: 4.8,
    estimatedTime: "5-10 دقائق",
  },
  {
    id: "photo-analysis",
    title: "تحليل الصور الطبية",
    description: "تحليل الأشعة والصور الطبية بالذكاء الاصطناعي",
    icon: Camera,
    path: "/photo-analysis",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    features: ["تحليل سريع", "تقارير مفصلة", "دعم جميع أنواع الأشعة"],
    availability: "متاح",
    rating: 4.7,
    estimatedTime: "10-15 دقيقة",
  },
  {
    id: "clinic-booking",
    title: "حجز المواعيد",
    description: "احجز موعدك مع أفضل أطباء الأسنان",
    icon: Calendar,
    path: "/simplified-booking/1",
    color: "green",
    gradient: "from-green-600 to-emerald-600",
    features: ["حجز فوري", "اختيار الطبيب", "تذكير آلي"],
    availability: "متاح",
    rating: 4.9,
    estimatedTime: "2-3 دقائق",
  },
  {
    id: "consultations",
    title: "الاستشارات الطبية",
    description: "استشارات طبية مع أطباء متخصصين",
    icon: MessageCircle,
    path: "/smart-chat",
    color: "orange",
    gradient: "from-orange-600 to-red-600",
    features: ["استشارة مباشرة", "أطباء معتمدين", "سرية تامة"],
    availability: "متاح",
    rating: 4.6,
    estimatedTime: "15-30 دقيقة",
  },
  {
    id: "patient-files",
    title: "الملفات الطبية الإ��كترونية",
    description: "إدارة ملفاتك الطبية بشكل آمن",
    icon: FileText,
    path: "/admin/patients",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-600",
    features: ["حفظ آمن", "وصول سريع", "مشاركة مع الأطباء"],
    availability: "متاح",
    rating: 4.5,
    estimatedTime: "دائم",
  },
  {
    id: "clinic-finder",
    title: "البحث عن العيادات",
    description: "اعثر على أقرب العيادات إليك",
    icon: MapPin,
    path: "/search?type=clinics",
    color: "teal",
    gradient: "from-teal-600 to-green-600",
    features: ["خريطة تفاعلية", "معلومات شاملة", "تقييمات المرضى"],
    availability: "متاح",
    rating: 4.4,
    estimatedTime: "1-2 دقيقة",
  },
  {
    id: "treatments",
    title: "إدارة العلاجات",
    description: "تتبع ومتابعة خطط العلاج",
    icon: Activity,
    path: "/admin/treatments",
    color: "pink",
    gradient: "from-pink-600 to-rose-600",
    features: ["متابعة دقيقة", "تذكير بالأدوية", "تقارير التقدم"],
    availability: "متاح",
    rating: 4.7,
    estimatedTime: "مستمر",
  },
  {
    id: "emergency",
    title: "ا��طوارئ الطبية",
    description: "خدمة طوارئ سريعة ومتاحة 24/7",
    icon: Zap,
    path: "/emergency",
    color: "red",
    gradient: "from-red-600 to-pink-600",
    features: ["استجابة فورية", "متاح 24/7", "طاقم متخصص"],
    availability: "قريباً",
    rating: 5.0,
    estimatedTime: "فوري",
  },
];

const specializedServices = [
  {
    title: "طب الأسنان التجميلي",
    icon: Star,
    description: "تبييض وتجميل الأسنان",
    path: "/services/cosmetic",
  },
  {
    title: "جراحة الفم والأسنان",
    icon: Shield,
    description: "العمليات الجراحية المتقدمة",
    path: "/services/surgery",
  },
  {
    title: "تقويم الأسنان",
    icon: Activity,
    description: "تصحيح وتقويم الأسنان",
    path: "/services/orthodontics",
  },
  {
    title: "طب أسنان الأطفال",
    icon: Heart,
    description: "رعاية طبية للأطفال",
    path: "/services/pediatric",
  },
];

export default function MedicalServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = medicalServices.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <VisitorHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                الخدمات الطبية
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                مجموعة شاملة من الخدمات الطبية المتق��مة لأسنانك وصحتك
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الخدمات الطبية..."
                    className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Main Services Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              الخدمات الأساسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    to={service.path}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                      {/* Header */}
                      <div
                        className={cn(
                          "bg-gradient-to-r p-6 text-white relative",
                          service.gradient,
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {service.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm">
                                    {service.rating}
                                  </span>
                                </div>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    service.availability === "متاح"
                                      ? "bg-green-500/20 text-green-100"
                                      : service.availability === "قريباً"
                                        ? "bg-orange-500/20 text-orange-100"
                                        : "bg-yellow-500/20 text-yellow-100",
                                  )}
                                >
                                  {service.availability}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-600 mb-4">
                          {service.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          {service.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            بدء الخدمة
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Specialized Services */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              الخدمات المتخصصة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializedServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={index}
                    to={service.path}
                    className="group block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Assistant is now globally available via UnifiedAIAssistant */}

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">تحتاج مساعدة؟</h2>
            <p className="mb-6 text-blue-100">
              فريقنا الطبي متاح للإجابة على استفساراتك على مدار الساعة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                <Phone className="w-5 h-5" />
                اتصل بنا الآن
              </button>
              <Link
                to="/smart-chat"
                className="bg-blue-500/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2 justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                دردشة مباشرة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
