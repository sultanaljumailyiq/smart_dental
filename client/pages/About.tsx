import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Award,
  Shield,
  Target,
  Zap,
  Globe,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Star,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ModernUnifiedHeader from "@/components/ModernUnifiedHeader";

const teamMembers = [
  {
    name: "د. أحمد محمد",
    role: "المؤسس والرئيس التنفيذي",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    description: "خبرة أكثر من 15 عاماً في طب الأسنان والتكنولوجيا الطبية",
  },
  {
    name: "د. فاطمة علي",
    role: "مديرة التطوير الطبي",
    image:
      "https://images.unsplash.com/photo-1594824720259-6c73a635c9b9?w=150&h=150&fit=crop&crop=face",
    description: "متخصصة في تطوير الحلول الطبية الذكية وتحليل البيانات",
  },
  {
    name: "م. سارة خالد",
    role: "مديرة التكنولوجيا",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    description: "خبيرة في تطوير التطبيقات الطبية والذكاء الاصطناعي",
  },
];

const achievements = [
  { number: "10,000+", label: "مريض سعيد", icon: Heart },
  { number: "500+", label: "طبيب أسنان", icon: Users },
  { number: "50+", label: "عيادة شريكة", icon: Award },
  { number: "99%", label: "معدل الرضا", icon: Star },
];

const values = [
  {
    title: "الجودة والتميز",
    description: "نسعى لتقديم أعلى مستويات الجودة في جميع خدماتنا",
    icon: Award,
    color: "blue",
  },
  {
    title: "الابتكار والتطوير",
    description: "نستخدم أحدث التقنيات لتطوير حلول طبية متقدمة",
    icon: Zap,
    color: "purple",
  },
  {
    title: "الأمان والخصوصية",
    description: "نحمي بياناتك الطبية بأعلى معايير الأمان",
    icon: Shield,
    color: "green",
  },
  {
    title: "إمكانية الوصول",
    description: "نجعل الرعاية الطبية متاحة للجميع في كل مكان",
    icon: Globe,
    color: "orange",
  },
];

export default function About() {
  return (
    <>
      <ModernUnifiedHeader
        currentSection="about"
        searchPlaceholder="ابحث في معلومات عنا..."
        hidden={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">من نحن</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
                نحن منصة رائدة في تقديم الخدمات الطبية الذكية لطب الأسنان في
                العراق
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-4">
                    <Heart className="w-8 h-8 text-red-300" />
                    <span className="text-xl font-medium">
                      رسالتنا: تحسين صحة الأسنان للجميع
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Our Story */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">قصتنا</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    بدأت رحلتنا من رؤية بسيطة: جعل الرعاية الطبية للأسنان أكثر
                    سهولة وفعالية للمرضى وأطباء الأسنان في العراق.
                  </p>
                  <p>
                    منذ تأسيسنا، نحن نعمل على تطوير حلول تقنية متقدمة تجمع بين
                    الخبرة الطبية والتكنولوجيا الحديثة لتقديم خدمات استثنائية.
                  </p>
                  <p>
                    اليوم، نفخر بكوننا الخيار الأول لآلاف المرضى وأطباء الأسنان
                    الذين يثقون بخدماتنا ونظامنا المتكامل.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
                  <Target className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-4">رؤيتنا</h3>
                  <p className="text-blue-100">
                    أن نصبح المنصة الرائدة في الشرق الأوسط لخدمات طب الأسنان
                    الذكية، ونساهم في رفع مستوى الرعاية الطبية في المنطقة.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              إنجازاتنا
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {achievement.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              قيمنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          value.color === "blue" && "bg-blue-100",
                          value.color === "purple" && "bg-purple-100",
                          value.color === "green" && "bg-green-100",
                          value.color === "orange" && "bg-orange-100",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-6 h-6",
                            value.color === "blue" && "text-blue-600",
                            value.color === "purple" && "text-purple-600",
                            value.color === "green" && "text-green-600",
                            value.color === "orange" && "text-orange-600",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              فريقنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              ما يميزنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "تقنية متقدمة",
                  description: "نستخدم الذكاء الاصطناعي وأحدث التقنيات",
                  icon: Zap,
                },
                {
                  title: "فريق خبير",
                  description: "فريق من أفض�� أطباء الأسنان والمطورين",
                  icon: Users,
                },
                {
                  title: "خدمة 24/7",
                  description: "خدمة عملاء متاحة على مدار الساعة",
                  icon: MessageCircle,
                },
                {
                  title: "أمان عالي",
                  description: "حماية متقدمة لبياناتك الطبية",
                  icon: Shield,
                },
                {
                  title: "سهولة الاستخدام",
                  description: "واجهة بسيطة ومفهومة للجميع",
                  icon: CheckCircle,
                },
                {
                  title: "تغطية شاملة",
                  description: "خدمات متكاملة لجميع احتياجاتك",
                  icon: Globe,
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">تواصل معنا</h2>
            <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
              نحن هنا لخدمتك. تواصل معنا لأي استفسار أو اقتراح
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 justify-center">
                <Mail className="w-5 h-5" />
                <span>info@dentalplatform.iq</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-5 h-5" />
                <span>+964 780 123 4567</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="w-5 h-5" />
                <span>بغداد، العراق</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
