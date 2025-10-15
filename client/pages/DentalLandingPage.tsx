import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  AlertTriangle,
  Activity,
  Users,
  FileText,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SmartLandingHeader from "@/components/SmartLandingHeader";

// Platform features for dentists
const dentistFeatures = [
  {
    id: 1,
    title: "إدارة متكاملة للعيادة",
    description: "نظام شامل لإدارة المواعيد، المرضى، والملفات الطبية",
    icon: Users,
    color: "purple",
    link: "/dentist-hub"
  },
  {
    id: 2,
    title: "ذكاء اصطناعي متقدم",
    description: "مساعد ذكي للتشخيص وتخطيط العلاج بدقة عالية",
    icon: Brain,
    color: "blue",
    link: "/smart-chat"
  },
  {
    id: 3,
    title: "نظام حجز ذكي",
    description: "رابط حجز مخصص لعيادتك مع تذكيرات تلقائية",
    icon: Calendar,
    color: "green",
    link: "/clinic-booking"
  },
  {
    id: 4,
    title: "تقارير وإحصائيات",
    description: "لوحة تحكم تحليلية لمتابعة أداء العيادة",
    icon: BarChart3,
    color: "orange",
    link: "/reports"
  },
];

// Success stories from dentists
const successStories = [
  {
    id: 1,
    name: "د. أحمد الخفاجي",
    clinic: "عيادة بغداد للأسنان",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    quote: "Smart ساعدتني في تنظيم عيادتي بشكل احترافي. نظام الحجز الذكي وفر علي الكثير من الوقت",
    rating: 5,
    patients: "500+ مريض",
  },
  {
    id: 2,
    name: "د. سارة محمود",
    clinic: "مركز النور لطب الأسنان",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    quote: "الذكاء الاصطناعي في التشخيص أداة رائعة تساعدني في اتخاذ قرارات علاجية أفضل",
    rating: 5,
    patients: "800+ مريض",
  },
  {
    id: 3,
    name: "د. كريم العبيدي",
    clinic: "عيادة الابتسامة المثالية",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    quote: "منذ استخدام المنصة، زاد عدد مرضاي بنسبة 40% والتنظيم أصبح أسهل بكثير",
    rating: 5,
    patients: "1000+ مريض",
  },
];

// Platform statistics
const platformStats = [
  { number: "2,500+", label: "طبيب أسنان" },
  { number: "50,000+", label: "مريض سعيد" },
  { number: "98%", label: "معدل الرضا" },
  { number: "24/7", label: "دعم متواصل" },
];

export default function DentalLandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      {/* Smart Landing Header for Dentists */}
      <SmartLandingHeader type="dental" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                منصة Smart - الأولى في العراق
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                نقلة نوعية في{" "}
                <span className="text-purple-600">
                  إدارة عيادتك
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                منصة متكاملة مدعومة بالذكاء الاصطناعي لأطباء الأسنان في العراق.
                وفر وقتك، زد دخلك، حسّن خدماتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dental/auth"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-5 h-5" />
                  ابدأ مجاناً الآن
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  اكتشف المميزات
                </button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop"
                alt="Modern dental practice"
                className="rounded-2xl shadow-2xl w-full h-auto"
                type="clinic"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2,500+</p>
                    <p className="text-sm text-gray-600">طبيب أسنان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              كل ما تحتاجه لإدارة عيادتك
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              أدوات احترافية مصممة خصيصاً لأطباء الأسنان في العراق
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {dentistFeatures.map((feature) => (
              <Link
                key={feature.id}
                to={feature.link}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 h-full">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    feature.color === "purple" && "bg-purple-100",
                    feature.color === "blue" && "bg-blue-100",
                    feature.color === "green" && "bg-green-100",
                    feature.color === "orange" && "bg-orange-100"
                  )}>
                    <feature.icon className={cn(
                      "w-7 h-7",
                      feature.color === "purple" && "text-purple-600",
                      feature.color === "blue" && "text-blue-600",
                      feature.color === "green" && "text-green-600",
                      feature.color === "orange" && "text-orange-600"
                    )} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
                    اكتشف المزيد <ArrowRight className="w-4 h-4 mr-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              قصص نجاح زملائك
            </h2>
            <p className="text-lg text-gray-600">
              انضم إلى آلاف الأطباء الذين حسّنوا عياداتهم مع Smart
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story) => (
              <Card key={story.id} className="p-6 bg-white hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.clinic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                  <Users className="w-4 h-4" />
                  {story.patients}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-purple-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            جاهز لتحويل عيادتك؟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            انضم الآن واحصل على 30 يوم تجربة مجانية - بدون بطاقة ائتمانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dental/auth"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ التجربة المجانية
            </Link>
            <Link
              to="/about"
              className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
