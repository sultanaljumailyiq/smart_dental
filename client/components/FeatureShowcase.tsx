import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Camera,
  MapPin,
  BookOpen,
  Shield,
  Clock,
  Star,
  Award,
  Users,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Smartphone,
  Globe,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  benefits: string[];
  cta: string;
  link: string;
  stats: {
    number: string;
    label: string;
  };
}

const features: Feature[] = [
  {
    id: "ai-diagnosis",
    title: "التشخيص الذكي",
    description: "احصل على تشخيص مبدئي دقيق باستخدام الذكاء الاصطناعي في دقائق قليلة",
    icon: Brain,
    color: "from-purple-500 to-indigo-600",
    benefits: [
      "دقة 95% في التشخيص",
      "نتائج فورية خلال دقيقتين",
      "تقرير طبي مفصل",
      "توصيات علاجية مخصصة"
    ],
    cta: "ابدأ التشخيص",
    link: "/ai-diagnosis",
    stats: {
      number: "95%",
      label: "دقة"
    }
  },
  {
    id: "smart-chat",
    title: "الدردشة الذكية",
    description: "تحدث مع مساعد ذكي متخصص في طب الأسنان واحصل على إجابات فورية",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
    benefits: [
      "متاح 24/7 للإجابة على أسئلتك",
      "نصائح وقائية مخصصة",
      "توجيه للأخصائي المناسب",
      "دعم باللغة العربية"
    ],
    cta: "ابدأ المحادثة",
    link: "/smart-chat",
    stats: {
      number: "24/7",
      label: "متاح"
    }
  },
  {
    id: "photo-analysis",
    title: "تحليل الصور",
    description: "قم برفع صورة لأسنانك واحصل على تحليل ذكي للمشاكل المحتملة",
    icon: Camera,
    color: "from-orange-500 to-red-600",
    benefits: [
      "تحليل صور الأسنان واللثة",
      "كشف المشاكل المبكرة",
      "تقييم صحة الفم",
      "توصيات علاجية فورية"
    ],
    cta: "حلل صورة",
    link: "/photo-analysis",
    stats: {
      number: "92%",
      label: "دقة"
    }
  }
];

export default function FeatureShowcase() {
  const { language } = useI18n();
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-600 font-semibold">منصة متطورة</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            مميزات تجعلنا الأفضل
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف كيف نستخدم التكنولوجيا الحديثة لتقديم أفضل خدمات الرعاية الصحية لأسنانك
          </p>
        </div>

        {/* Main Feature Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Feature Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(index)}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    activeFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-110`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  <feature.icon className="w-6 h-6" />
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {features[activeFeature].description}
                </p>
              </div>

              <div className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <Link
                  to={features[activeFeature].link}
                  className={cn(
                    "inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105",
                    `bg-gradient-to-r ${features[activeFeature].color}`
                  )}
                >
                  <span>{features[activeFeature].cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {features[activeFeature].stats.number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {features[activeFeature].stats.label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Demonstration */}
          <div className="relative">
            <div className={cn(
              "relative bg-gradient-to-br rounded-3xl p-8 shadow-2xl",
              features[activeFeature].color
            )}>
              {/* Phone mockup */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-r ${features[activeFeature].color}`
                    )}>
                      {React.createElement(features[activeFeature].icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {features[activeFeature].title}
                      </div>
                      <div className="text-sm text-gray-500">جاري التحضير...</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={cn(
                          "h-2 rounded-full transition-all duration-1000",
                          `bg-gradient-to-r ${features[activeFeature].color}`
                        )} style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      معالجة البيانات...
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-gray-600">مستخدم نشط</div>
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-gray-600">تقييم المستخدمين</div>
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">3</div>
              <div className="text-gray-600">جوائز دولية</div>
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-gray-600">آمن ومعتمد</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              جرب جميع الميزات مجاناً الآن
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المرضى الذين يثقون بنا للعناية بصحة أسنانهم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ai-diagnosis"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                ابدأ التشخيص الذكي
              </Link>
              <Link
                to="/smart-chat"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                دردشة مع المساعد
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
