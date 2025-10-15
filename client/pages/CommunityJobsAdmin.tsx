import React, { useState } from "react";
import {
  Users,
  Briefcase,
  Home,
  ShoppingCart,
  Stethoscope,
  Settings,
  BarChart3,
  UserCheck,
  Award,
  MessageSquare,
  Calendar,
  TrendingUp,
  Package,
  Star,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Building,
  MapPin,
  Crown,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickAccessCard {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  forRoles: string[];
}

interface AdminSection {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
    change: string;
    changeType: "positive" | "negative";
  }>;
}

const quickAccessCards: QuickAccessCard[] = [
  {
    title: "الصفحة الرئيسية",
    description: "العودة إلى الصفحة الرئيسية للمنصة",
    icon: Home,
    href: "/",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    forRoles: ["dentist", "admin"],
  },
  {
    title: "متجر المستلزمات",
    description: "تصفح وشراء المستلزمات الطبية",
    icon: ShoppingCart,
    href: "/dental-supply",
    color: "text-green-600",
    bgColor: "bg-green-100",
    forRoles: ["dentist", "admin"],
  },
  {
    title: "المجتمع الطبي",
    description: "التواصل مع الأطباء والمهنيين",
    icon: Users,
    href: "/community",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    forRoles: ["dentist", "admin"],
  },
  {
    title: "الوظائف",
    description: "البحث عن وظائف أو نشر فرص عمل",
    icon: Briefcase,
    href: "/jobs",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    forRoles: ["dentist", "admin"],
  },
  {
    title: "إدارة العيادة",
    description: "لوحة تحكم إدارة العيادة والمرضى",
    icon: Stethoscope,
    href: "/admin",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    forRoles: ["dentist"],
  },
  {
    title: "لوحة المورد",
    description: "إدارة المنتجات والطلبات",
    icon: Package,
    href: "/supplier/dashboard",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    forRoles: ["supplier", "admin"],
  },
  {
    title: "إدارة المنصة",
    description: "إدارة شاملة للمنصة والمستخدمين",
    icon: Crown,
    href: "/admin/platform-admin",
    color: "text-red-600",
    bgColor: "bg-red-100",
    forRoles: ["admin"],
  },
];

const communityStats: AdminSection = {
  title: "إحصائيات المجتمع",
  description: "نظرة عامة على نشاط المجتمع الطبي",
  stats: [
    {
      label: "الأعضاء النشطين",
      value: "2,847",
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "المنشورات اليوم",
      value: "156",
      change: "+8%",
      changeType: "positive",
    },
    {
      label: "التفاعلات",
      value: "1,234",
      change: "+15%",
      changeType: "positive",
    },
    {
      label: "المناقشات الجديدة",
      value: "43",
      change: "+5%",
      changeType: "positive",
    },
  ],
};

const jobsStats: AdminSection = {
  title: "إحصائيات ��لوظائف",
  description: "نظرة عامة على سوق العمل الطبي",
  stats: [
    {
      label: "الوظائف المتاحة",
      value: "89",
      change: "+20%",
      changeType: "positive",
    },
    {
      label: "المتقدمين الجدد",
      value: "234",
      change: "+18%",
      changeType: "positive",
    },
    {
      label: "التوظيفات المكتملة",
      value: "12",
      change: "+25%",
      changeType: "positive",
    },
    {
      label: "الشركات النشطة",
      value: "45",
      change: "+10%",
      changeType: "positive",
    },
  ],
};

export default function CommunityJobsAdmin() {
  const [selectedRole, setSelectedRole] = useState<
    "dentist" | "supplier" | "admin"
  >("dentist");

  const filteredQuickAccess = quickAccessCards.filter((card) =>
    card.forRoles.includes(selectedRole),
  );

  const getRoleName = (role: string) => {
    switch (role) {
      case "dentist":
        return "طبيب أسنان";
      case "supplier":
        return "مورد";
      case "admin":
        return "مدير المنصة";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "dentist":
        return <Stethoscope className="w-5 h-5" />;
      case "supplier":
        return <Package className="w-5 h-5" />;
      case "admin":
        return <Crown className="w-5 h-5" />;
      default:
        return <UserCheck className="w-5 h-5" />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة إدارة المجتمع والوظائف
              </h1>
              <p className="text-gray-600">
                مركز التحكم الموحد للمجتمع الطبي وسوق العمل
              </p>
            </div>

            {/* Role Selector */}
            <div className="bg-gray-50 rounded-2xl p-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 px-3">اختر دورك:</span>
                {["dentist", "supplier", "admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                      selectedRole === role
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {getRoleIcon(role)}
                    <span className="text-sm">{getRoleName(role)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Access Cards */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">الوصول السريع</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {getRoleName(selectedRole)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuickAccess.map((card, index) => (
              <Link
                key={index}
                to={card.href}
                className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      card.bgColor,
                    )}
                  >
                    <card.icon className={cn("w-6 h-6", card.color)} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Stats */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {communityStats.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {communityStats.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {communityStats.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/community"
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              إدارة المجتمع
            </Link>
          </div>

          {/* Jobs Stats */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {jobsStats.title}
                </h3>
                <p className="text-gray-600 text-sm">{jobsStats.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {jobsStats.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/jobs"
              className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              إدارة الوظائف
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  النشاط الأخير
                </h3>
                <p className="text-gray-600 text-sm">آخر الأحداث في المنصة</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
              <Eye className="w-4 h-4" />
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-800">
                  عضو جديد
                </span>
              </div>
              <p className="text-sm text-green-700">
                انضم د. محمد أحمد للمجتمع
              </p>
              <span className="text-xs text-green-600">منذ 5 دقائق</span>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-800">
                  وظيفة جديدة
                </span>
              </div>
              <p className="text-sm text-blue-700">
                تم نشر وظيفة طبيب أسنان في بغداد
              </p>
              <span className="text-xs text-blue-600">منذ 15 دقيقة</span>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-800">
                  مناقشة جديدة
                </span>
              </div>
              <p className="text-sm text-purple-700">
                مناقشة حول تقنيات الحشو الحديثة
              </p>
              <span className="text-xs text-purple-600">منذ 30 دقيقة</span>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {selectedRole === "admin" && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">
                  إجراءات الإدارة
                </h3>
                <p className="text-red-700 text-sm">أدوات إدارية متقدمة</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white p-4 rounded-2xl border border-red-100 hover:shadow-md transition-all">
                <Users className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-red-800">
                  إدارة المستخدمين
                </span>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-red-100 hover:shadow-md transition-all">
                <Settings className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-red-800">
                  إعدادات المنصة
                </span>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-red-100 hover:shadow-md transition-all">
                <BarChart3 className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-red-800">
                  التقارير المتقدمة
                </span>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-red-100 hover:shadow-md transition-all">
                <Shield className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-red-800">
                  الأمان والخصوصية
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
