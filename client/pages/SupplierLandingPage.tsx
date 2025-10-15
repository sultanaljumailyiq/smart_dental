import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Users,
  Truck,
  Star,
  ArrowRight,
  Phone,
  Globe,
  Sparkles,
  Shield,
  Clock,
  Award,
  Building2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SmartLandingHeader from "@/components/SmartLandingHeader";

// Platform features for suppliers
const supplierFeatures = [
  {
    id: 1,
    title: "سوق إلكتروني متخصص",
    description: "اعرض منتجاتك لآلاف أطباء الأسنان في العراق",
    icon: ShoppingCart,
    color: "blue",
    link: "/supplier/store"
  },
  {
    id: 2,
    title: "إدارة سهلة وسريعة",
    description: "أضف منتجاتك وابدأ البيع فوراً بدون تعقيدات",
    icon: Package,
    color: "green",
    link: "/supplier/products"
  },
  {
    id: 3,
    title: "تحليلات ومبيعات",
    description: "تقارير مفصلة عن المبيعات والعملاء",
    icon: BarChart3,
    color: "purple",
    link: "/supplier/analytics"
  },
  {
    id: 4,
    title: "دفع موثوق وآمن",
    description: "نظام دفع موثوق بطرق متعددة ومضمونة",
    icon: Shield,
    color: "orange",
    link: "/supplier/payments"
  },
];

// Success stories from suppliers
const supplierStories = [
  {
    id: 1,
    name: "شركة الأمل للمستلزمات الطبية",
    owner: "م. علي حسن",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "بعد انضمامي لـ Smart، زادت مبيعاتي 60% في أول 3 أشهر. الوصول لآلاف الأطباء أصبح سهلاً",
    rating: 5,
    sales: "+60% مبيعات",
  },
  {
    id: 2,
    name: "مؤسسة النور التجارية",
    owner: "أ. سارة محمد",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    quote: "إدارة الطلبات والمخزون أصبحت أسهل بكثير. المنصة وفرت علي الكثير من الوقت والجهد",
    rating: 5,
    sales: "+45% كفاءة",
  },
  {
    id: 3,
    name: "شركة التقدم للأدوات الطبية",
    owner: "م. أحمد كريم",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    quote: "أفضل قرار اتخذته لتطوير عملي. العملاء الجدد يتواصلون معي يومياً",
    rating: 5,
    sales: "+120 عميل",
  },
];

// Platform statistics for suppliers
const supplierStats = [
  { number: "500+", label: "مورد نشط" },
  { number: "10,000+", label: "طلب شهري" },
  { number: "95%", label: "معدل الرضا" },
  { number: "60%", label: "زيادة المبيعات" },
];

export default function SupplierLandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      {/* Smart Landing Header for Suppliers */}
      <SmartLandingHeader type="supplier" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                أكبر سوق للمستلزمات الطبية
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                ضاعف مبيعاتك مع{" "}
                <span className="text-blue-600">
                  أكبر شبكة أطباء
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                انضم إلى منصة Smart ووصّل منتجاتك إلى آلاف أطباء الأسنان في العراق.
                سوق متخصص، عملاء مضمونون، أرباح متزايدة
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/supplier/auth"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  ابدأ البيع الآن
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  اكتشف المميزات
                </button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
                alt="Medical supplies warehouse"
                className="rounded-2xl shadow-2xl w-full h-auto"
                type="clinic"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">+60%</p>
                    <p className="text-sm text-gray-600">زيادة المبيعات</p>
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
              لماذا تختار Smart؟
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              أدوات مصممة خصيصاً لتنمية أعمالك في سوق المستلزمات الطبية
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {supplierFeatures.map((feature) => (
              <Link
                key={feature.id}
                to={feature.link}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 h-full">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    feature.color === "blue" && "bg-blue-100",
                    feature.color === "green" && "bg-green-100",
                    feature.color === "purple" && "bg-purple-100",
                    feature.color === "orange" && "bg-orange-100"
                  )}>
                    <feature.icon className={cn(
                      "w-7 h-7",
                      feature.color === "blue" && "text-blue-600",
                      feature.color === "green" && "text-green-600",
                      feature.color === "purple" && "text-purple-600",
                      feature.color === "orange" && "text-orange-600"
                    )} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                    اكتشف المزيد <ArrowRight className="w-4 h-4 mr-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              قصص نجاح شركائنا
            </h2>
            <p className="text-lg text-gray-600">
              انضم إلى مئات الموردين الناجحين على منصتنا
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {supplierStories.map((story) => (
              <Card key={story.id} className="p-6 bg-white hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={story.avatar}
                    alt={story.owner}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.owner}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {story.sales}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {supplierStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              كيف تبدأ؟
            </h2>
            <p className="text-lg text-gray-600">
              3 خطوات بسيطة فقط للبدء في البيع
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. سجّل حسابك
              </h3>
              <p className="text-gray-600">
                أنشئ حساب مورد بمعلومات شركتك في دقائق
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. أضف منتجاتك
              </h3>
              <p className="text-gray-600">
                ارفع صور وتفاصيل منتجاتك بسهولة
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. ابدأ البيع
              </h3>
              <p className="text-gray-600">
                استقبل طلبات من آلاف الأطباء فوراً
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            جاهز لتنمية أعمالك؟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            انضم مجاناً وابدأ البيع لآلاف الأطباء اليوم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/supplier/auth"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              سجّل الآن مجاناً
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
