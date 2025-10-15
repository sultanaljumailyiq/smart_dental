import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Camera,
  Mic,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Bot,
  Headphones,
  Video,
} from "lucide-react";

interface ConsultationType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  price: string;
  duration: string;
  available: boolean;
}

const consultationTypes: ConsultationType[] = [
  {
    id: "ai-diagnosis",
    title: "التشخيص بالذكاء الاصطناعي",
    description:
      "تحليل فوري للأعراض وتوصيات العلاج المبنية على الذكاء الاصطناعي",
    icon: Brain,
    color: "from-purple-500 to-blue-600",
    features: [
      "تحليل فوري للأعراض",
      "تشخيص أولي بدقة 95%",
      "توصيات علاجية مخصصة",
      "تقرير طبي مفصل",
    ],
    price: "مجاني",
    duration: "2-5 دقائق",
    available: true,
  },
  {
    id: "smart-chat",
    title: "الدردشة الذكية",
    description: "استشارة فورية مع مساعد ذكي متخصص في طب الأسنان",
    icon: MessageSquare,
    color: "from-green-500 to-teal-600",
    features: [
      "إجابات فورية على استفساراتك",
      "نصائح وقائية مخ��صة",
      "توجيه للأخصائي المناسب",
      "متاح 24/7",
    ],
    price: "مجاني",
    duration: "فوري",
    available: true,
  },
  {
    id: "photo-analysis",
    title: "تحليل الصور بالذكاء الاصطناعي",
    description: "تحليل صور الأسنان واللثة للكشف عن المشاكل المحتملة",
    icon: Camera,
    color: "from-orange-500 to-red-600",
    features: [
      "تحليل صور الأسنان",
      "كشف التسوس وا��مشاكل",
      "تقييم صحة اللثة",
      "توصيات علاجية",
    ],
    price: "10 د.ع",
    duration: "1-3 دقائق",
    available: true,
  },
  {
    id: "voice-consultation",
    title: "الاستشارة الصوتية",
    description: "وصف الأعراض صوتياً وتلقي إرشادات من الذكاء الاصطناعي",
    icon: Mic,
    color: "from-indigo-500 to-purple-600",
    features: [
      "وصف صوتي للأعراض",
      "تحليل نبرة الألم",
      "إرشادات صوتية",
      "دعم اللغة العربية",
    ],
    price: "5 د.ع",
    duration: "3-7 دقائق",
    available: false,
  },
];

const aiFeatures = [
  {
    icon: Zap,
    title: "سرعة فائقة",
    description: "نتائج فورية خلال ثوانٍ",
  },
  {
    icon: CheckCircle,
    title: "دقة عالية",
    description: "دقة تشخيص تصل إلى 95%",
  },
  {
    icon: Bot,
    title: "ذكاء متطور",
    description: "تقنيات الذكاء الاصطناعي الحديثة",
  },
  {
    icon: Headphones,
    title: "دعم مستمر",
    description: "متاح 24/7 لخدمتك",
  },
];

export default function AIConsultations() {
  const navigate = useNavigate();
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationType | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const handleConsultationClick = (consultation: ConsultationType) => {
    if (!consultation.available) return;

    switch (consultation.id) {
      case "ai-diagnosis":
        navigate("/ai-diagnosis");
        break;
      case "smart-chat":
        navigate("/smart-chat");
        break;
      case "photo-analysis":
        navigate("/photo-analysis");
        break;
      default:
        setSelectedConsultation(consultation);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            الاستشارات الذكية
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          احصل على استشارات فورية ومخصصة باستخدام أحدث تقنيات الذكاء الاصطناعي
          في طب الأسنان
        </p>
      </div>

      {/* AI Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Consultation Types */}
      <div className="grid lg:grid-cols-2 gap-6">
        {consultationTypes.map((consultation) => {
          const Icon = consultation.icon;
          return (
            <div
              key={consultation.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer ${
                !consultation.available ? "opacity-75" : ""
              }`}
              onClick={() => handleConsultationClick(consultation)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${consultation.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {consultation.title}
                    </h3>
                    {!consultation.available && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        قريباً
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {consultation.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {consultation.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {consultation.price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {consultation.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={!consultation.available}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultationClick(consultation);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                      consultation.available
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {consultation.available ? "ابدأ الآن" : "قريباً"}
                    {consultation.available && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">جرب التشخيص السريع الآن</h3>
            <p className="text-blue-100 mb-6">
              احصل على تشخيص أولي خلال دقائق مع تقنيات الذكاء الاصطناعي المتطورة
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/ai-diagnosis")}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                تشخيص فوري
              </button>
              <button
                onClick={() => navigate("/smart-chat")}
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                دردشة ذكية
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2">
                      <p className="text-sm">
                        مرحباً! كيف يمكنني مساعدتك اليوم؟
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div className="flex-1">
                    <div className="bg-blue-500 rounded-lg px-3 py-2">
                      <p className="text-sm">أعاني من ألم في الأسنان</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">أ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
