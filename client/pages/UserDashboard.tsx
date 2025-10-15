import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  Package,
  TrendingUp,
  ShoppingCart,
  Heart,
  Clock,
  Star,
  Users,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Camera,
  Award,
  Shield,
  Plus,
  Filter,
  Download,
  Eye,
  Menu,
  Home,
  LogOut,
  ArrowRight,
  MessageCircle,
  Briefcase,
  Stethoscope,
  FileText,
  Store,
  Building,
  UserPlus,
  Activity,
  CreditCard,
  Truck,
  GitBranch,
  PieChart,
  Target,
  Zap,
  Brain,
  Map,
  Bot,
  FileBarChart,
  Key,
  Globe,
  Database,
  Cpu,
  BookOpen,
  Info,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";

// Mock user data for different types
const mockUsers = {
  dentist: {
    id: "1",
    type: "dentist",
    name: "د. أحمد محمد",
    email: "ahmed.mohammed@email.com",
    phone: "+964 770 123 4567",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    clinicName: "عيادة النجمة لطب الأسنان",
    specialization: "طب الأسنان التجميلي",
    location: "بغداد، العراق",
    joinDate: "2023-03-15",
    verification: "verified",
    stats: {
      totalOrders: 145,
      totalSpent: "IQD 2,450,000",
      savedAmount: "IQD 485,000",
      favoriteProducts: 23,
    },
  },
  supplier: {
    id: "2",
    type: "supplier",
    name: "شركة الر��ئد للمستلزمات الطبية",
    email: "info@alraed-medical.com",
    phone: "+964 780 987 6543",
    avatar:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    companyName: "شركة الرائد للمستلزمات الطبية",
    businessType: "تجارة الجملة",
    location: "الكرخ، بغداد",
    joinDate: "2022-08-10",
    verification: "verified",
    stats: {
      totalProducts: 234,
      totalSales: "IQD 15,670,000",
      activeOrders: 12,
      customerRating: 4.8,
    },
  },
  admin: {
    id: "3",
    type: "admin",
    name: "إدارة المنصة",
    email: "admin@dentalstore.com",
    phone: "+964 770 000 0000",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    role: "مدير المنصة",
    department: "الإدارة التقنية",
    location: "بغداد، العراق",
    joinDate: "2022-01-01",
    verification: "admin",
    stats: {
      totalUsers: 1245,
      totalSuppliers: 67,
      totalOrders: 3421,
      platformRevenue: "IQD 89,560,000",
    },
  },
};

export default function UserDashboard() {
  const [userType, setUserType] = useState<"dentist" | "supplier" | "admin">(
    "dentist",
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API Settings States
  const [aiDiagnosisAPI, setAiDiagnosisAPI] = useState({
    apiKey: "",
    endpoint: "",
    customInstructions: "",
    enabled: false,
  });

  const [clinicManagementAPI, setClinicManagementAPI] = useState({
    apiKey: "",
    endpoint: "",
    enabled: false,
  });

  const [mapsAPI, setMapsAPI] = useState({
    apiKey: "",
    provider: "google", // google, openstreetmap, mapbox
    enabled: false,
  });

  // System Settings
  const { settings, updateSetting, resetToDefaults, isFeatureEnabled } =
    useSystemSettings();

  const currentUser = mockUsers[userType];

  // Quick shortcuts for different user types
  const getQuickShortcuts = () => {
    const shortcuts = {
      dentist: [
        {
          icon: MessageCircle,
          label: "التواصل",
          description: "المجتمع المهني",
          href: "/community",
          color: "blue",
        },
        {
          icon: Briefcase,
          label: "الوظائف",
          description: "الفرص المهنية",
          href: "/jobs",
          color: "green",
        },
        {
          icon: Stethoscope,
          label: "العيادة",
          description: "إدارة المرضى",
          href: "/admin",
          color: "cyan",
        },
        {
          icon: FileText,
          label: "المقالات",
          description: "المحتوى العلمي",
          href: "/articles",
          color: "indigo",
        },
        {
          icon: Calendar,
          label: "المواعيد",
          description: "جدولة المرضى",
          href: "/admin/reservations",
          color: "orange",
        },
        {
          icon: Heart,
          label: "المفضلة",
          description: "منتجاتي المفضلة",
          href: "/favorites",
          color: "red",
        },
        {
          icon: BarChart3,
          label: "التقارير",
          description: "��قارير العيادة",
          href: "/admin/reports",
          color: "teal",
        },
        {
          icon: Bell,
          label: "الإشعارات",
          description: "التنبيهات والتحديثات",
          href: "/dentist-hub/notifications",
          color: "purple",
        },
      ],
      supplier: [
        {
          icon: Store,
          label: "متجري",
          description: "إدارة المتجر",
          href: "/supplier/store",
          color: "green",
        },
        {
          icon: ShoppingCart,
          label: "الطلبات",
          description: "طلبات العملاء",
          href: "/supplier/orders",
          color: "blue",
        },
        {
          icon: Users,
          label: "العملاء",
          description: "إدارة العملاء",
          href: "/supplier/customers",
          color: "cyan",
        },
        {
          icon: BarChart3,
          label: "المبيعات",
          description: "تقارير المبيعات",
          href: "/supplier/analytics",
          color: "orange",
        },
        {
          icon: MessageCircle,
          label: "التواصل",
          description: "المجتمع التجاري",
          href: "/community",
          color: "indigo",
        },
        {
          icon: Truck,
          label: "الشحن",
          description: "إدارة الشحنات",
          href: "/supplier/shipping",
          color: "yellow",
        },
        {
          icon: CreditCard,
          label: "المدفوعات",
          description: "المعاملات المالية",
          href: "/supplier/payments",
          color: "emerald",
        },
        {
          icon: Package,
          label: "المنتجا��",
          description: "إدارة منتجاتي",
          href: "/supplier/products",
          color: "purple",
        },
      ],
      admin: [
        {
          icon: Users,
          label: "المستخدمين",
          description: "إدارة المستخدمين",
          href: "/admin/users",
          color: "blue",
        },
        {
          icon: Package,
          label: "الموردين",
          description: "إدارة الموردين",
          href: "/admin/suppliers",
          color: "green",
        },
        {
          icon: ShoppingCart,
          label: "الطلبات",
          description: "مراقبة الطلبات",
          href: "/admin/orders",
          color: "purple",
        },
        {
          icon: BarChart3,
          label: "الإحصائيات",
          description: "تقارير المنصة",
          href: "/admin/reports",
          color: "orange",
        },
        {
          icon: Settings,
          label: "النظام",
          description: "إعدادات المنصة",
          href: "/admin/settings",
          color: "gray",
        },
        {
          icon: MessageCircle,
          label: "المجتمع",
          description: "إدارة المحتوى",
          href: "/admin/community",
          color: "indigo",
        },
        {
          icon: Building,
          label: "العيادات",
          description: "إدارة العيادات",
          href: "/admin/clinics",
          color: "cyan",
        },
        {
          icon: Activity,
          label: "النشاط",
          description: "مراقبة النشاط",
          href: "/admin/activity",
          color: "red",
        },
      ],
    };
    return shortcuts[userType] || [];
  };

  const QuickShortcuts = () => {
    const shortcuts = getQuickShortcuts();

    const getColorClasses = (color: string) => {
      const colorMap = {
        purple:
          "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
        blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
        green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
        cyan: "bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border-cyan-200",
        indigo:
          "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200",
        orange:
          "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200",
        red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
        teal: "bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200",
        yellow:
          "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200",
        emerald:
          "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200",
        gray: "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200",
      };
      return colorMap[color as keyof typeof colorMap] || colorMap.purple;
    };

    // فلترة الاختصارات حسب الأقسام المفعلة
    const filteredShortcuts = shortcuts.filter((shortcut) => {
      if (
        shortcut.href.includes("/dental-supply") ||
        shortcut.href.includes("/marketplace")
      ) {
        return isFeatureEnabled("marketplace");
      }
      if (shortcut.href.includes("/community")) {
        return isFeatureEnabled("community");
      }
      if (shortcut.href.includes("/jobs")) {
        return isFeatureEnabled("jobs");
      }
      if (shortcut.href.includes("/favorites")) {
        return isFeatureEnabled("favorites");
      }
      if (
        shortcut.href.includes("/clinic-admin") ||
        shortcut.href.includes("/admin")
      ) {
        return isFeatureEnabled("clinicAdmin");
      }
      if (
        shortcut.href.includes("/education") ||
        shortcut.href.includes("/articles")
      ) {
        return isFeatureEnabled("education");
      }
      return true; // باقي الاختصارات متاحة دائماً
    });

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              اختصارات سريعة
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              الوصول السريع للأقسام المتاحة في المنصة
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            {filteredShortcuts.length} قسم متاح
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {filteredShortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={index}
                to={shortcut.href}
                className={cn(
                  "group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 hover:shadow-sm hover:scale-105",
                  getColorClasses(shortcut.color),
                )}
                title={shortcut.description}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-xs font-medium leading-tight">
                    {shortcut.label}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5 hidden lg:block">
                    {shortcut.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const DentistDashboard = () => (
    <div className="space-y-6">
      <QuickShortcuts />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalOrders || 0}
              </div>
              <div className="text-sm text-gray-600">إجمالي الطلبات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalSpent || "0"}
              </div>
              <div className="text-sm text-gray-600">إجمالي المشتريات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.savedAmount || "0"}
              </div>
              <div className="text-sm text-gray-600">المبلغ المُوفر</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.favoriteProducts || 0}
              </div>
              <div className="text-sm text-gray-600">المنتجات المفضل��</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">الطلبات الأخيرة</h3>
          <Link
            to="/orders"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div
              key={order}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    طلب #{1000 + order}
                  </div>
                  <div className="text-sm text-gray-600">
                    3 منتجات • IQD 125,000
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  تم التوصيل
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  منذ {order} أي��م
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SupplierDashboard = () => (
    <div className="space-y-6">
      <QuickShortcuts />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalProducts || 0}
              </div>
              <div className="text-sm text-gray-600">إجمالي المنتجات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalSales || "0"}
              </div>
              <div className="text-sm text-gray-600">إجمالي المبيعات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.activeOrders || 0}
              </div>
              <div className="text-sm text-gray-600">الطلبات النشطة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.customerRating || 0}
              </div>
              <div className="text-sm text-gray-600">تقييم العملاء</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors">
            <Plus className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              إضافة منتج
            </span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              تقارير المبيعات
            </span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              إ��ارة العملاء
            </span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors">
            <Settings className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              إعدادات المتجر
            </span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">الطلبات الجديدة</h3>
          <Link
            to="/supplier/orders"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div
              key={order}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    طلب #{2000 + order}
                  </div>
                  <div className="text-sm text-gray-600">
                    د. محمد أحمد • 5 منتجات
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  قيد المعالجة
                </div>
                <div className="text-sm text-gray-600 mt-1">IQD 85,000</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <QuickShortcuts />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalSuppliers || 0}
              </div>
              <div className="text-sm text-gray-600">إجمالي الموردين</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.totalOrders || 0}
              </div>
              <div className="text-sm text-gray-600">إجمالي الطلبات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentUser.stats as any)?.platformRevenue || "0"}
              </div>
              <div className="text-sm text-gray-600">إيرادات المنصة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">إدارة المنصة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              إدارة المستخدمين
            </span>
          </Link>
          <Link
            to="/admin/suppliers"
            className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
          >
            <Package className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              إدارة الموردين
            </span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              إ��ارة الطلبات
            </span>
          </Link>
          <Link
            to="/admin/reports"
            className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              التقارير والإحصائيات
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">النشاطات الأخيرة</h3>
          <Link
            to="/admin/activity"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="space-y-4">
          {[
            {
              type: "user",
              action: "انضم مستخدم جديد",
              user: "د. علي أحمد",
              time: "منذ 5 دقائق",
            },
            {
              type: "order",
              action: "طلب جديد",
              user: "طلب #3422",
              time: "منذ 15 دقيقة",
            },
            {
              type: "supplier",
              action: "مورد جديد",
              user: "شركة الابتكار الطبي",
              time: "منذ ساعة",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                {activity.type === "user" && (
                  <Users className="w-5 h-5 text-purple-600" />
                )}
                {activity.type === "order" && (
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                )}
                {activity.type === "supplier" && (
                  <Package className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {activity.action}
                </div>
                <div className="text-sm text-gray-600">{activity.user}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 with-floating-nav"
      dir="rtl"
    >
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  الملف الشخصي
                </h1>
                <p className="text-xs text-gray-500">لوحة التحكم</p>
              </div>
            </div>

            {/* User Type Switcher (For Demo) */}
            <div className="flex items-center gap-4">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
              >
                <option value="dentist">طبيب أسنان</option>
                <option value="supplier">مورد</option>
                <option value="admin">مدير المنصة</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="hidden sm:block text-sm">
                  <div className="font-medium text-gray-900">
                    {currentUser.name}
                  </div>
                  <div className="text-gray-600">
                    {currentUser.type === "dentist"
                      ? "طبيب أسنان"
                      : currentUser.type === "supplier"
                        ? "مورد"
                        : "مدير"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-16 right-0 bottom-0 z-40 transition-transform duration-300 ease-in-out bg-white border-l border-gray-200",
            "lg:w-64 w-16",
            sidebarOpen ? "translate-x-0" : "lg:translate-x-0 translate-x-full",
          )}
        >
          <div className="p-4">
            <nav className="space-y-2">
              {[
                { id: "overview", label: "نظرة عامة", icon: Home },
                { id: "profile", label: "الملف الشخصي", icon: User },
                {
                  id: "orders",
                  label: userType === "supplier" ? "الطلبات" : "مشترياتي",
                  icon: ShoppingCart,
                },
                { id: "settings", label: "الإعدادات", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-right",
                    activeTab === item.id
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 text-right">
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block">تسجيل الخروج</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:mr-64 mr-0 min-h-screen">
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {activeTab === "overview" && "نظرة عامة"}
                    {activeTab === "profile" && "الملف الشخصي"}
                    {activeTab === "orders" &&
                      (userType === "supplier" ? "إدارة ال��لبات" : "مشترياتي")}
                    {activeTab === "settings" && "الإعدادات"}
                  </h1>
                  <p className="text-gray-600">
                    {currentUser.type === "dentist" &&
                      "مر��باً بك في لوحة تحكم طبيب الأسنان"}
                    {currentUser.type === "supplier" &&
                      "مرحباً بك ف�� لوحة تحكم المورد"}
                    {currentUser.type === "admin" &&
                      "مرحباً بك في لوحة تحكم المدير"}
                  </p>
                </div>

                {currentUser.verification === "verified" && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">محقق</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {activeTab === "overview" && (
              <>
                {userType === "dentist" && <DentistDashboard />}
                {userType === "supplier" && <SupplierDashboard />}
                {userType === "admin" && <AdminDashboard />}
              </>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    معلومات الملف الشخصي
                  </h3>
                  <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl hover:bg-purple-200 transition-colors">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                </div>

                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentUser.name}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{currentUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{currentUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{currentUser.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>انضم في {currentUser.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {userType === "dentist" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        معلومات العيادة
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم العيادة
                          </label>
                          <input
                            type="text"
                            value={(currentUser as any)?.clinicName || ""}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            التخصص
                          </label>
                          <input
                            type="text"
                            value={(currentUser as any)?.specialization || ""}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {userType === "supplier" ? "إدارة الطلبات" : "مشترياتي"}
                  </h3>
                  <div className="flex items-center gap-4">
                    <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      <option>جميع ��لطلبات</option>
                      <option>قيد المعالجة</option>
                      <option>تم التوصيل</option>
                      <option>مُلغاة</option>
                    </select>
                    <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      <Filter className="w-4 h-4" />
                      فلترة
                    </button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    لا توجد طلبات
                  </h3>
                  <p className="text-gray-600">
                    {userType === "supplier"
                      ? "لم تتلق أي طلبات جديدة بعد"
                      : "لم تقم بإجراء أي طلبات شراء بعد"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    إعدادات الحساب
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900">
                          إشعارات البريد الإلكتروني
                        </div>
                        <div className="text-sm text-gray-600">
                          ��لقي إشعارات حول الطلبات والعروض
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900">
                          إشعارات الهاتف
                        </div>
                        <div className="text-sm text-gray-600">
                          تلقي رسائل SMS للطلبات المهمة
                        </div>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    الأمان
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          تغيير كلمة المرور
                        </div>
                        <div className="text-sm text-gray-600">
                          آخر تغيير منذ 3 أشهر
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          المصادقة ال��نائية
                        </div>
                        <div className="text-sm text-gray-600">
                          حماية إضافية لحسابك
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* إعدادات API والذكاء الاصطناعي */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        إعدادات API والذكاء الاصطناعي
                      </h3>
                      <p className="text-sm text-gray-600">
                        ربط النظام بخدمات الذكاء الاصطناعي والخرائط
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* API التشخيص الذكي */}
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            API التشخيص الذكي
                          </h4>
                          <p className="text-sm text-gray-600">
                            ربط نظام التشخيص بالذكاء الاصطناعي
                          </p>
                        </div>
                        <div className="mr-auto">
                          <input
                            type="checkbox"
                            checked={aiDiagnosisAPI.enabled}
                            onChange={(e) =>
                              setAiDiagnosisAPI({
                                ...aiDiagnosisAPI,
                                enabled: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Key className="w-4 h-4 inline mr-2" />
                            مفتاح API
                          </label>
                          <input
                            type="password"
                            value={aiDiagnosisAPI.apiKey}
                            onChange={(e) =>
                              setAiDiagnosisAPI({
                                ...aiDiagnosisAPI,
                                apiKey: e.target.value,
                              })
                            }
                            placeholder="sk-..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!aiDiagnosisAPI.enabled}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Globe className="w-4 h-4 inline mr-2" />
                            نقطة النهاية (Endpoint)
                          </label>
                          <input
                            type="url"
                            value={aiDiagnosisAPI.endpoint}
                            onChange={(e) =>
                              setAiDiagnosisAPI({
                                ...aiDiagnosisAPI,
                                endpoint: e.target.value,
                              })
                            }
                            placeholder="https://api.openai.com/v1/chat/completions"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!aiDiagnosisAPI.enabled}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FileBarChart className="w-4 h-4 inline mr-2" />
                          تعليمات مخصصة للذكاء الاصطناعي
                        </label>
                        <textarea
                          value={aiDiagnosisAPI.customInstructions}
                          onChange={(e) =>
                            setAiDiagnosisAPI({
                              ...aiDiagnosisAPI,
                              customInstructions: e.target.value,
                            })
                          }
                          placeholder="أنت مساعد ذكي متخصص في تشخيص أمراض الأسنان. يجب عليك تحليل الأعراض المقدمة وتقديم تشخيص أولي مع التوصيات المناسبة..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          disabled={!aiDiagnosisAPI.enabled}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          �� اكتب تعليمات واضحة لتوجيه الذك��ء الاصطناعي حول دوره
                          في التشخيص والأسلوب المطلوب
                        </p>
                      </div>
                    </div>

                    {/* API إدارة العيادة والتقارير */}
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-green-50 to-teal-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <FileBarChart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            API إدارة العيادة والتقارير
                          </h4>
                          <p className="text-sm text-gray-600">
                            نظام ذكي لإدارة العيادة وتوليد التقارير
                          </p>
                        </div>
                        <div className="mr-auto">
                          <input
                            type="checkbox"
                            checked={clinicManagementAPI.enabled}
                            onChange={(e) =>
                              setClinicManagementAPI({
                                ...clinicManagementAPI,
                                enabled: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Key className="w-4 h-4 inline mr-2" />
                            مفتاح API
                          </label>
                          <input
                            type="password"
                            value={clinicManagementAPI.apiKey}
                            onChange={(e) =>
                              setClinicManagementAPI({
                                ...clinicManagementAPI,
                                apiKey: e.target.value,
                              })
                            }
                            placeholder="clinic_api_key_..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={!clinicManagementAPI.enabled}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Database className="w-4 h-4 inline mr-2" />
                            نقطة النهاية (Endpoint)
                          </label>
                          <input
                            type="url"
                            value={clinicManagementAPI.endpoint}
                            onChange={(e) =>
                              setClinicManagementAPI({
                                ...clinicManagementAPI,
                                endpoint: e.target.value,
                              })
                            }
                            placeholder="https://api.clinic-manager.com/v1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={!clinicManagementAPI.enabled}
                          />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <Cpu className="w-4 h-4" />
                          <span className="font-medium">الميزات المتاحة:</span>
                        </div>
                        <ul className="text-sm text-green-700 mt-2 space-y-1">
                          <li>• توليد تقارير ذكية للمرضى والإيرادات</li>
                          <li>• إدارة المواعيد والتذكيرات التلقائية</li>
                          <li>• تحليل بيانات العيادة وتقديم توصيات</li>
                          <li>• إنشاء خطط علاج مخصصة</li>
                        </ul>
                      </div>
                    </div>

                    {/* API الخرائط */}
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-orange-50 to-red-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Map className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            API الخرائط والمواقع
                          </h4>
                          <p className="text-sm text-gray-600">
                            خدمات الخرائط لعرض مواقع العيادات والموردين
                          </p>
                        </div>
                        <div className="mr-auto">
                          <input
                            type="checkbox"
                            checked={mapsAPI.enabled}
                            onChange={(e) =>
                              setMapsAPI({
                                ...mapsAPI,
                                enabled: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Globe className="w-4 h-4 inline mr-2" />
                            مقدم الخدمة
                          </label>
                          <select
                            value={mapsAPI.provider}
                            onChange={(e) =>
                              setMapsAPI({
                                ...mapsAPI,
                                provider: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={!mapsAPI.enabled}
                          >
                            <option value="google">Google Maps</option>
                            <option value="openstreetmap">OpenStreetMap</option>
                            <option value="mapbox">Mapbox</option>
                            <option value="here">HERE Maps</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Key className="w-4 h-4 inline mr-2" />
                            مفتاح API
                          </label>
                          <input
                            type="password"
                            value={mapsAPI.apiKey}
                            onChange={(e) =>
                              setMapsAPI({ ...mapsAPI, apiKey: e.target.value })
                            }
                            placeholder={`${mapsAPI.provider === "google" ? "AIza..." : mapsAPI.provider === "mapbox" ? "pk.ey..." : "maps_api_key_..."}`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={!mapsAPI.enabled}
                          />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-orange-100 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-800">
                          <Map className="w-4 h-4" />
                          <span className="font-medium">الاستخدامات:</span>
                        </div>
                        <ul className="text-sm text-orange-700 mt-2 space-y-1">
                          <li>• عرض مواقع العيا��ات والموردين</li>
                          <li>• حساب المسافات وأوقات الوصول</li>
                          <li>• البحث الجغرافي للخدمات القريبة</li>
                          <li>• تتبع تسليم المنتجات الطبية</li>
                        </ul>
                      </div>
                    </div>

                    {/* أزرار الحفظ */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          // حفظ الإعدادات
                          console.log("حفظ إعدادات API:", {
                            aiDiagnosisAPI,
                            clinicManagementAPI,
                            mapsAPI,
                          });
                          alert("تم حفظ إعدادات API بنجاح!");
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Database className="w-5 h-5" />
                        حفظ إعدادات API
                      </button>

                      <button
                        onClick={() => {
                          // اختبار الاتصال
                          console.log("اختبار اتصال APIs");
                          alert("جاري اختبار الاتصال بجميع الخدمات...");
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Cpu className="w-5 h-5" />
                        اختبار الاتصال
                      </button>
                    </div>
                  </div>
                </div>

                {/* إعدادات أقسام النظام */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        إعدادات أقسام النظام
                      </h3>
                      <p className="text-sm text-gray-600">
                        تفعيل وإيقاف الأقسام المختلفة في المنصة
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* قسم المتجر */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-emerald-50 to-green-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              متجر المستلزمات
                            </h4>
                            <p className="text-sm text-gray-600">
                              تسوق المعدات الطبية
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.marketplace}
                          onChange={(e) =>
                            updateSetting("marketplace", e.target.checked)
                          }
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </div>
                      <div className="text-xs text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg">
                        {settings.marketplace
                          ? "المتجر متاح في الشريط السفلي والرواب��"
                          : "تم إخفاء جميع روابط واختصارات المتجر"}
                      </div>
                    </div>

                    {/* قسم التواصل */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              منصة التواصل
                            </h4>
                            <p className="text-sm text-gray-600">
                              المجتمع والمناقشات
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.community}
                          onChange={(e) =>
                            updateSetting("community", e.target.checked)
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                        {settings.community
                          ? "منصة التواصل متاحة للمستخدمين"
                          : "تم إخفاء جميع روابط التواصل والمجتمع"}
                      </div>
                    </div>

                    {/* قسم الوظائف */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-green-50 to-teal-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              قسم الوظائف
                            </h4>
                            <p className="text-sm text-gray-600">
                              التوظيف والفرص
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.jobs}
                          onChange={(e) =>
                            updateSetting("jobs", e.target.checked)
                          }
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                        {settings.jobs
                          ? "قسم الوظائف متاح في النظام"
                          : "تم إخفاء جميع روابط الوظائف"}
                      </div>
                    </div>

                    {/* قسم المفضلة */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-red-50 to-pink-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              المفضلة
                            </h4>
                            <p className="text-sm text-gray-600">
                              المنتجات المفضلة
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.favorites}
                          onChange={(e) =>
                            updateSetting("favorites", e.target.checked)
                          }
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                      </div>
                      <div className="text-xs text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                        {settings.favorites
                          ? "ميزة المفضلة متاحة للمستخدمين"
                          : "تم إخفاء جميع خيارات المفضلة"}
                      </div>
                    </div>

                    {/* إدارة العيادة */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-purple-50 to-violet-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              إدارة العيادة
                            </h4>
                            <p className="text-sm text-gray-600">
                              نظام إدارة العيادات
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.clinicAdmin}
                          onChange={(e) =>
                            updateSetting("clinicAdmin", e.target.checked)
                          }
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </div>
                      <div className="text-xs text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">
                        {settings.clinicAdmin
                          ? "نظام إدارة العيادة متاح"
                          : "تم إخفاء جميع خيارات إدارة العيادة"}
                      </div>
                    </div>

                    {/* التعليم والمقالات */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              التعليم والمقالات
                            </h4>
                            <p className="text-sm text-gray-600">
                              المحتوى التعليمي
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.education}
                          onChange={(e) =>
                            updateSetting("education", e.target.checked)
                          }
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                      </div>
                      <div className="text-xs text-orange-700 bg-orange-100 px-3 py-2 rounded-lg">
                        {settings.education
                          ? "قسم التعليم والمقالات متاح"
                          : "تم إخفاء جميع روابط التعليم"}
                      </div>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        console.log("حفظ إعدادات الأقسام:", settings);
                        alert(
                          "تم حفظ إعدادات الأقسام بنجاح!\nسيتم تطبيق التغييرات عند إعادة تحميل الصفحة.",
                        );
                      }}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      حف�� إعدادات الأقسام
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "هل أنت متأكد من إعادة تعيين جميع الأقسام للحالة الافتراضية؟",
                          )
                        ) {
                          resetToDefaults();
                          alert(
                            "تم إعادة تعيين جميع الأقسام للحالة الافتراضية!",
                          );
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      إعادة تعيين للافتراضي
                    </button>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-800 mb-2">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">ملاحظة مهمة:</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • عند إيقاف أي قسم، سيتم إخفاء جميع روابطه واختصاراته
                        تلقائياً
                      </li>
                      <li>
                        • التغييرات تؤثر على الشريط العلوي والسفلي وجميع صفحات
                        النظام
                      </li>
                      <li>
                        • الإعدادات محفوظة محلياً ويمكن استرجاعها في أي وقت
                      </li>
                      <li>
                        • يُنصح بعمل إعادة تحميل للصفحة لضمان تطبيق جميع
                        التغييرات
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* الشريط السفلي */}

      {/* مساحة إضافية للشر��ط السفلي */}
      <div className="h-20"></div>
    </div>
  );
}
