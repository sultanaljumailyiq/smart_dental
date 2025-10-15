import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Stethoscope,
  Users,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Award,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  color: string;
  path: string;
}

const bookingOptions: BookingOption[] = [
  {
    id: "classic",
    title: "الحجز التقليدي",
    description: "نظام الح��ز البسيط والسريع",
    icon: Calendar,
    features: [
      "واجهة بسيطة وسهلة",
      "حجز سريع في خطوات قليلة",
      "مناسب للاستخدام العا��ي",
      "معلومات أساسية فقط",
    ],
    color: "from-blue-500 to-blue-600",
    path: "/simplified-booking/1",
  },
  {
    id: "modern",
    title: "الحجز المبسط",
    description: "نظام حجز مبسط وسريع بدون تعقيدات",
    icon: Stethoscope,
    features: [
      "تصميم مبسط وسريع",
      "بدون أسعار أو تكاليف",
      "اختيار الطبيب والخدمة",
      "معلومات مريض أساسية فقط",
      "شريط تقدم واضح",
      "تاريخ ووقت في صفحة واحدة",
    ],
    color: "from-purple-500 to-pink-600",
    path: "/simplified-booking/1",
  },
];

export default function BookingShowcase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              أنظمة حجز المواعيد
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            اختر نظام الحجز المناسب لك - سواء كنت تفضل البساطة أو التفاصيل
            الشاملة
          </p>
        </div>

        {/* Booking Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {bookingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Header */}
                <div
                  className={cn(
                    "relative p-8 text-white bg-gradient-to-br",
                    option.color,
                  )}
                >
                  <div className="absolute top-4 right-4 opacity-20">
                    <IconComponent className="w-20 h-20" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{option.title}</h2>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-300 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    المميزات المتاحة
                  </h3>
                  <div className="space-y-4 mb-8">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(option.path)}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 bg-gradient-to-r text-white shadow-lg hover:shadow-xl group-hover:scale-105",
                      option.color,
                    )}
                  >
                    <span>جرب النظام الآن</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinic Stats */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            إحصائيات العيادة
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-gray-600">طبيب متخصص</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">1000+</div>
              <div className="text-gray-600">مريض سعيد</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5000+</div>
              <div className="text-gray-600">موعد مكتمل</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600">خدمة متواصلة</div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">أو انتقل مباشرة إلى:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/medical-services")}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-xl font-medium text-gray-700 transition-all"
            >
              الخدمات الطبية
            </button>
            <button
              onClick={() => navigate("/emergency")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              الطوارئ
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              عن العيادة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
