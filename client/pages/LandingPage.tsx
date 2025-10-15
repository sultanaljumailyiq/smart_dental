import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  User,
  Menu,
  X,
  Brain,
  Stethoscope,
  Shield,
  Clock,
  Award,
  ArrowRight,
  Phone,
  Mail,
  ChevronRight,
  Heart,
  UserCheck,
  TrendingUp,
  BookOpen,
  Map,
  Ambulance,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VisitorHeader } from "@/components/VisitorHeader";
import UnifiedInteractiveMap from "@/components/UnifiedInteractiveMap";

// Mock data for clinics in Iraq
const nearbyClinicas = [
  {
    id: 1,
    name: "مركز بغداد لطب الأسنان",
    nameEn: "Baghdad Dental Center",
    address: "شارع الكرادة، بغداد�� العراق",
    addressEn: "Al-Karrada Street, Baghdad, Iraq",
    rating: 4.8,
    reviews: 156,
    distance: "0.8 كم",
    distanceEn: "0.5 mi",
    specialties: ["طب الأسنان العام", "تقويم الأسنان"],
    specialtiesEn: ["General Dentistry", "Orthodontics"],
    phone: "+964 770 123 4567",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "عيادة الابتسامة المثالية",
    nameEn: "Perfect Smile Clinic",
    address: "شارع المنصور، بغداد، العراق",
    addressEn: "Al-Mansour Street, Baghdad, Iraq",
    rating: 4.9,
    reviews: 203,
    distance: "1.9 كم",
    distanceEn: "1.2 mi",
    specialties: ["طب الأسنان التجميلي", "زراعة الأسنان"],
    specialtiesEn: ["Cosmetic Dentistry", "Implants"],
    phone: "+964 750 987 6543",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "عيادة الأسرة لطب الأسنان",
    nameEn: "Family Dental Care",
    address: "شارع الأعظمية، بغداد، العراق",
    addressEn: "Al-Adhamiya Street, Baghdad, Iraq",
    rating: 4.7,
    reviews: 98,
    distance: "3.4 كم",
    distanceEn: "2.1 mi",
    specialties: ["طب أسنان الأطفال", "الرعاية العامة"],
    specialtiesEn: ["Pediatric Dentistry", "General Care"],
    phone: "+964 780 456 7890",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop",
  },
];

// Mock articles in Arabic
const articles = [
  {
    id: 1,
    title: "الدليل الشامل لزراعة الأسنان: كل ما تحتاج لمعرفته",
    titleEn: "The Complete Guide to Dental Implants: What You Need to Know",
    excerpt:
      "كل شيء عن زراعة الأسنان، من الإجراء إلى التعافي والعناية طويلة المدى.",
    excerptEn:
      "Everything about dental implants, from procedure to recovery and long-term care.",
    author: "د. سارة أحمد",
    authorEn: "Dr. Sarah Ahmed",
    date: "15 ديسمبر 2024",
    dateEn: "Dec 15, 2024",
    readTime: "8 دقائق قراءة",
    readTimeEn: "8 min read",
    category: "العلا��",
    categoryEn: "Treatment",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title:
      "ا��ذكاء الاصطناعي في طب الأسنان: كيف تُحدث التكنولوجيا ثورة في صحة الفم",
    titleEn: "AI in Dentistry: How Technology is Revolutionizing Oral Health",
    excerpt: "اكتشف كيف يُحول الذكاء الاصطناعي تشخيص الأسنان وتخطيط العلاج.",
    excerptEn:
      "Discover how artificial intelligence is transforming dental diagnosis and treatment planning.",
    author: "د. محمد علي",
    authorEn: "Dr. Mohammed Ali",
    date: "12 ديسمبر 2024",
    dateEn: "Dec 12, 2024",
    readTime: "6 دقائق قراءة",
    readTimeEn: "6 min read",
    category: "التكنولوجيا",
    categoryEn: "Technology",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "الرعاية الوقائية: مفتاح�� ��صحة الفم مدى الحياة",
    titleEn: "Preventive Care: Your Key to Lifelong Oral Health",
    excerpt: "عادات يومية بسيطة يمكنها منع معظم مشاك�� الأسنان وتوفير المال.",
    excerptEn:
      "Simple daily habits that can prevent most dental problems and save you money.",
    author: "د. فاطمة ح��ن",
    authorEn: "Dr. Fatima Hassan",
    date: "10 ديسمبر 2024",
    dateEn: "Dec 10, 2024",
    readTime: "5 دقائق قراءة",
    readTimeEn: "5 min read",
    category: "الوقاية",
    categoryEn: "Prevention",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop",
  },
];

// Features data (same as ModernMedicalServices)
const mainFeatures = [
  {
    title: "خريطة تفاعلية ذكية",
    description: "ابحث عن العيادات والأطباء بالقرب منك",
    icon: Map,
    color: "teal",
  },
  {
    title: "تشخيص بالذكاء الاصطناعي",
    description: "احصل على تشخيص أولي دقيق في دقائق",
    icon: Brain,
    color: "purple",
  },
  {
    title: "طوارئ على مدار الساعة",
    description: "خدمة طوارئ متاحة 24/7",
    icon: Ambulance,
    color: "red",
  },
  {
    title: "محتوى تعليمي موثوق",
    description: "مقالات ونصائح طبية من مصادر موثوقة",
    icon: BookOpen,
    color: "emerald",
  },
  {
    title: "أمان وخصوصية",
    description: "حماية كاملة لبياناتك الطبية",
    icon: Shield,
    color: "blue",
  },
  {
    title: "دعم متعدد اللغات",
    description: "خدماتنا متاحة بجميع اللغات",
    icon: Globe,
    color: "indigo",
  },
];

interface AISymptomCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

function AISymptomChecker({ isOpen, onClose }: AISymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnosis = async () => {
    setLoading(true);

    // Simulate AI diagnosis
    setTimeout(() => {
      setDiagnosis({
        condition: "التهاب اللثة المحتمل",
        confidence: 78,
        recommendations: [
          "احجز موعداً لتنظيف الأسنان خلال أسبوعين",
          "استخدم غسول الفم المضاد ل��بكتي��يا مرتين يومياً",
          "حسّن تقنية التفريش باستخدام فرشاة ناعمة",
          "فكر في علاج الفلورايد المهني",
        ],
        urgency: "moderate",
        nearbySpecialists: nearbyClinicas.slice(0, 2),
      });
      setLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            التشخيص بالذكاء الاصطناعي
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!diagnosis ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صف أعراضك
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="مثل: نزيف اللثة، ألم الأسنان، الحساسية..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شدة الألم
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mild">خفيف (1-3)</option>
                  <option value="moderate">متوسط (4-6)</option>
                  <option value="severe">شديد (7-10)</option>
                </select>
              </div>

              <button
                onClick={handleDiagnosis}
                disabled={!symptoms.trim() || loading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    احصل على التشخيص بالذكاء الاصطناعي
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  التشخيص الأولي
                </h3>
                <p className="text-purple-800 text-lg font-medium">
                  {diagnosis.condition}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  درجة الثقة: {diagnosis.confidence}%
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  الإجراءات الموصى بها:
                </h4>
                <ul className="space-y-2">
                  {diagnosis.recommendations.map(
                    (rec: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  الأخصائيون الموصى بهم:
                </h4>
                <div className="space-y-3">
                  {diagnosis.nearbySpecialists.map((clinic: any) => (
                    <div key={clinic.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {clinic.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {clinic.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-700">
                              {clinic.rating}
                            </span>
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                          احجز الآن
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>إخلاء مسؤولية:</strong> هذا التشخيص بالذكاء الاصطناعي
                  أولي ولا ينبغي أن يحل محل الاستشارة الطبية المهنية. يرجى
                  استشارة طبيب أسنان مؤهل للفحص والعلاج المناسبين.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { language, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAIDiagnosis, setShowAIDiagnosis] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Visitor Header */}
      <VisitorHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16" style={{ paddingBottom: "28px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                ��فضل صديق وفي لابتسامتك مع{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  الرعاية المدعومة بالذكاء الاصطناعي
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                احصل على تشخيص أسنان فوري بالذكاء الاصطناعي، ابحث عن أفضل
                العيادات بالقرب منك، واحجز المواعيد أونلاين. انضم للآلاف الذين
                يثقون بـ Smart لصحة أفواههم.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/medical-services?section=smart-diagnosis')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Brain className="w-5 h-5" />
                  جرب التشخيص بالذكاء الاصطناعي
                </button>
                <Link
                  to="/medical-services?section=directory#directory-map"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  البحث عن عيادات
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop"
                alt="Modern dental clinic"
                className="rounded-2xl shadow-2xl w-full h-auto"
                type="clinic"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">50,000+</p>
                    <p className="text-sm text-gray-600">مريض سعيد</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="services" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              رعاية الأسنان المدعومة بالذكاء الاصطناعي
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              اكتشف مستقبل طب الأسنان مع أدوات التشخيص المتقدمة بالذكاء
              الاصطناعي وتوصيات العلاج المتخصصة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-3 sm:overflow-x-auto sm:snap-x sm:snap-mandatory">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl w-full sm:min-w-[180px]">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                التشخيص بالذكاء الاصطناعي
              </h3>
              <p className="text-gray-600 mb-3 text-xs leading-5">
                احصل على تشخي�� أولي فوري وتوصيات علاج ذكية.
              </p>
              <button
                onClick={() => setShowAIDiagnosis(true)}
                className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-xs"
              >
                ابدأ الآن <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl w-full sm:min-w-[180px] snap-start">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                طوارئ الأسنان
              </h3>
              <p className="text-gray-600 mb-3 text-xs leading-5">
                خدمة طوارئ سريعة 24/7 للحالا�� العاجلة واستجابة فورية.
              </p>
              <Link
                to="/emergency"
                className="text-red-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-xs"
              >
                فتح الطوارئ <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl w-full sm:min-w-[180px] snap-start">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                البحث عن العيادات
              </h3>
              <p className="text-gray-600 mb-3 text-xs leading-5">
                اعثر على أقرب العيادات بخريطة تفاعلية وت��يي����ت حقيقية.
              </p>
              <a
                href="#clinics"
                className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-xs"
              >
                استكشف <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl w-full sm:min-w-[180px] snap-start">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                المقالات الطبية
              </h3>
              <p className="text-gray-600 mb-3 text-xs leading-5">
                مقالات طبية موثوقة ونصائح عملية مُحدثة.
              </p>
              <Link
                to="/articles"
                className="text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-xs"
              >
                المقالات <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* شريط روابط طوارئ ��ريع */}
          <div className="flex items-start flex-wrap justify-center gap-2 overflow-x-auto snap-x snap-mandatory px-1 -mx-1 mt-4">
            <Link
              to="/emergency/first-aid"
              className="snap-start whitespace-nowrap px-3 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200"
            >
              دليل الإسعافات الأولية
            </Link>
            <Link
              to="/emergency/hospitals"
              className="snap-start whitespace-nowrap px-3 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
            >
              المستشفيات القريبة
            </Link>
            <Link
              to="/emergency/pain-management"
              className="snap-start whitespace-nowrap px-3 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200"
            >
              إدارة الألم
            </Link>
            <Link
              to="/emergency/dental"
              className="snap-start whitespace-nowrap px-3 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium hover:bg-amber-200"
            >
              طوارئ الأسنان
            </Link>
          </div>

          {/* حقل التشخيص السريع */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">ماذا تعاني؟</h3>
              <p className="text-sm text-gray-600">اختر المشكلة للحصول على تشخيص ذكي</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "ألم" }}
                className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
              >
                ألم
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "مشكلة تجميلية" }}
                className="px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors shadow-sm"
              >
                مشكلة تجميلية
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "نزيف" }}
                className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors shadow-sm"
              >
                نزيف
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "تصبغات وتلون" }}
                className="px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                تصبغات وتلون
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "تورم وانتفاخ" }}
                className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
              >
                تورم وانتفاخ
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "رائحة كريهة" }}
                className="px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
              >
                رائحة كريهة
              </Link>
              <Link
                to="/ai-diagnosis"
                state={{ chiefComplaint: "بقعة بيضاء" }}
                className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                بقعة بيضاء
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Finder Section with Interactive Map */}
      <section id="clinics" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UnifiedInteractiveMap 
            title="عيادات الأسنان القريبة منك"
            description="اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة"
          />
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              ابق مطلعاً على أحدث المقالات
            </h2>
          </div>

          <div className="flex flex-row gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 min-w-[260px] sm:min-w-[300px] md:min-w-[340px] snap-start block bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-[1px]"
              >
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-44 object-cover"
                      type="article"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow"
            >
              <BookOpen className="w-5 h-5" />
              عرض ج��يع المقالات
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white" />


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:gap-4 gap-1">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 hover:bg-gray-800 rounded-lg transition-colors hover-scale"
              >
                <div
                  className={cn(
                    "w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-white mb-2 shadow-md",
                    `bg-${feature.color}-500`,
                  )}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* AI Diagnosis Modal */}
      <AISymptomChecker
        isOpen={showAIDiagnosis}
        onClose={() => setShowAIDiagnosis(false)}
      />
    </div>
  );
}
