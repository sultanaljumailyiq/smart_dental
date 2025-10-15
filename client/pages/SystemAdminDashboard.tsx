import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Building2,
  Activity,
  Settings,
  BarChart3,
  Globe,
  Shield,
  Database,
  Cpu,
  Zap,
  Bell,
  Eye,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  Clock,
  Crown,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  Target,
  Briefcase,
  MessageCircle,
  Heart,
  Tag,
  Coins,
  Wallet,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminTopNavbar from "@/components/AdminTopNavbar";

// Mock system data
const mockSystemStats = {
  totalUsers: 3542,
  activeDentists: 892,
  activeSuppliers: 156,
  totalClinics: 234,
  totalOrders: 8934,
  monthlyRevenue: 156780000, // IQD
  activeUsers: 1823,
  systemUptime: "99.9%",
  totalProducts: 12456,
  pendingApprovals: 23,
  supportTickets: 12,
  systemAlerts: 3,
};

const mockRecentActivity = [
  {
    id: "1",
    type: "user_registration",
    message: "طبيب أسنان جديد انضم للمنصة",
    user: "د. علي أحمد محمود",
    location: "بغداد",
    time: "منذ 5 دقائق",
    status: "pending_verification",
  },
  {
    id: "2",
    type: "clinic_registration",
    message: "عيادة جديدة طلبت الانضمام",
    user: "عيادة الابتسامة الجميلة",
    location: "البصرة",
    time: "منذ 15 دقيقة",
    status: "pending_approval",
  },
  {
    id: "3",
    type: "supplier_order",
    message: "طلب مورد جديد",
    user: "شركة المستقبل الطبي",
    location: "أربيل",
    time: "منذ 30 دقيقة",
    status: "completed",
  },
  {
    id: "4",
    type: "system_alert",
    message: "تحديث النظام مطلوب",
    user: "نظام المراقبة",
    location: "الخادم الرئيسي",
    time: "منذ ساعة",
    status: "attention_required",
  },
];

const mockRegistrationRequests = [
  {
    id: "REQ001",
    type: "dentist",
    name: "د. سعد محمد علي",
    clinic: "عيادة النور لطب الأسنان",
    location: "الكاظمية، بغداد",
    phone: "+964 770 123 4567",
    email: "dr.saad@email.com",
    specialization: "طب الأسنان التجميلي",
    experience: "8 سنوات",
    documents: 5,
    submittedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: "REQ002",
    type: "supplier",
    name: "شركة التقنيات المتقدمة",
    businessType: "استيرا�� وتوزيع",
    location: "المنصور، بغداد",
    phone: "+964 780 987 6543",
    email: "info@advanced-tech.com",
    categories: ["أجهزة طبية", "مواد استهلاكية"],
    experience: "12 سنة",
    documents: 8,
    submittedDate: "2024-01-14",
    status: "under_review",
  },
  {
    id: "REQ003",
    type: "clinic",
    name: "مجمع الرعاية الصحية",
    owner: "د. فاطمة أحمد حسن",
    location: "الجادرية، بغداد",
    phone: "+964 771 555 6666",
    email: "info@healthcare-complex.com",
    services: ["طب أسنان عام", "تقويم", "جراحة"],
    staff: 15,
    documents: 12,
    submittedDate: "2024-01-13",
    status: "approved",
  },
];

function SystemAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const mockUsers = [
    {
      id: "u1",
      name: "د. سارة أحمد",
      email: "sara@clinic.com",
      role: "dentist",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: "u2",
      name: "شركة التقنية الطبية",
      email: "sales@medtech.com",
      role: "supplier",
      status: "active",
      createdAt: "2024-01-09",
    },
    {
      id: "u3",
      name: "د. محمد كريم",
      email: "m.karim@clinic.com",
      role: "dentist",
      status: "pending_verification",
      createdAt: "2024-01-09",
    },
    {
      id: "u4",
      name: "مركز الابتسامة",
      email: "info@smile-center.com",
      role: "clinic_admin",
      status: "active",
      createdAt: "2024-01-07",
    },
    {
      id: "u5",
      name: "د. علي حسن",
      email: "ali.hassan@clinic.com",
      role: "dentist",
      status: "suspended",
      createdAt: "2024-01-05",
    },
  ];

  const mockClinics = [
    {
      id: "c1",
      name: "عيادة الرعاية المتكاملة",
      owner: "د. هبة فؤاد",
      location: "المنصور، بغداد",
      staff: 8,
      status: "active",
    },
    {
      id: "c2",
      name: "مجمع أضراس بغداد",
      owner: "د. أثير الشمري",
      location: "الكرادة، بغداد",
      staff: 12,
      status: "pending_approval",
    },
    {
      id: "c3",
      name: "ابتسامة البصرة",
      owner: "د. قاس�� حيدر",
      location: "العشار، الب��رة",
      staff: 6,
      status: "active",
    },
  ];

  const mockSuppliers = [
    {
      id: "s1",
      name: "شركة المستقبل الطبي",
      contact: "محمد سالم",
      phone: "+964 770 111 2222",
      email: "contact@future-med.com",
      products: 420,
      status: "verified",
    },
    {
      id: "s2",
      name: "التميز للأجهزة الطبية",
      contact: "أحمد رعد",
      phone: "+964 750 333 4444",
      email: "sales@tamyuz-med.com",
      products: 210,
      status: "pending_verification",
    },
  ];

  const mockOrders = [
    {
      id: "o1",
      number: "ORD-2024-001",
      customer: "عيادة الرعاية المتكاملة",
      total: 1250000,
      status: "processing",
      date: "2024-01-18",
    },
    {
      id: "o2",
      number: "ORD-2024-002",
      customer: "ابتسامة البصرة",
      total: 860000,
      status: "delivered",
      date: "2024-01-17",
    },
    {
      id: "o3",
      number: "ORD-2024-003",
      customer: "مركز الابتسامة",
      total: 2100000,
      status: "pending",
      date: "2024-01-17",
    },
  ];

  const mockOffers = [
    {
      id: "of1",
      name: "خصم 10% على المواد الاستهلاكية",
      type: "percentage",
      status: "active",
      start: "2024-01-01",
      end: "2024-01-31",
      conversions: 124,
      discountGiven: 2750000,
    },
    {
      id: "of2",
      name: "اشترِ 2 واحصل على 1 مجاناً",
      type: "bundle",
      status: "scheduled",
      start: "2024-02-01",
      end: "2024-02-15",
      conversions: 0,
      discountGiven: 0,
    },
    {
      id: "of3",
      name: "شحن مجاني فوق 200,000 IQD",
      type: "free_shipping",
      status: "expired",
      start: "2023-12-01",
      end: "2023-12-31",
      conversions: 312,
      discountGiven: 980000,
    },
  ];

  const mockNotifications = [
    {
      id: "n1",
      title: "تنبيه نظام",
      message: "تحديث أمني متاح.",
      type: "system",
      time: "قبل دقيقة",
      read: false,
    },
    {
      id: "n2",
      title: "طلب جديد",
      message: "تم إنشاء طلب #ORD-2024-004.",
      type: "order",
      time: "قبل 10 دقائق",
      read: false,
    },
    {
      id: "n3",
      title: "مستخدم جديد",
      message: "انضم مورد جديد.",
      type: "user",
      time: "قبل ساعة",
      read: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_verification":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "attention_required":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "معلق";
      case "pending_verification":
        return "في انتظا�� التحقق";
      case "pending_approval":
        return "في انتظار الموافقة";
      case "under_review":
        return "قيد المراجعة";
      case "approved":
        return "مووافق عليه";
      case "completed":
        return "مكتمل";
      case "rejected":
        return "مرفوض";
      case "attention_required":
        return "يتطلب انتباه";
      default:
        return "غير محدد";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dentist":
        return Users;
      case "supplier":
        return Package;
      case "clinic":
        return Building2;
      case "user_registration":
        return Users;
      case "clinic_registration":
        return Building2;
      case "supplier_order":
        return ShoppingCart;
      case "system_alert":
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dentist":
        return "طبيب أسنان";
      case "supplier":
        return "مورد";
      case "clinic":
        return "عيادة";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  إدارة النظام
                </h1>
                <p className="text-sm text-gray-600">لوحة تحكم المدير العام</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                <Globe className="w-3 h-3 ml-1" />
                النظام متصل
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/admin/settings")}
                className="text-xs sm:text-sm"
              >
                <Settings className="w-4 h-4 ml-1" />
                إعدادات النظام
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-none gap-1">
            {[
              { id: "overview", label: "نظرة عامة", icon: BarChart3 },
              { id: "users", label: "المستخدمين", icon: Users },
              { id: "suppliers", label: "الموردين", icon: Package },
              { id: "notifications", label: "الإشعارات", icon: Bell },
              { id: "reports", label: "التقارير", icon: FileText },
              { id: "system", label: "النظام", icon: Cpu },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <>
            {/* System Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockSystemStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">العيادات المسجلة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockSystemStats.totalClinics}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إيرادات الشهر</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(mockSystemStats.monthlyRevenue)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">طلبات الموافقة</p>
                    <p className="text-2xl font-bold text-red-600">
                      {mockSystemStats.pendingApprovals}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                حالة النظام
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    الخادم الرئيسي
                  </div>
                  <div className="text-xs text-green-600">متصل</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    قاعدة البيانات
                  </div>
                  <div className="text-xs text-green-600">تعمل بشكل طبيعي</div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-sm font-medium text-yellow-800">
                    النسخ الاحتياطي
                  </div>
                  <div className="text-xs text-yellow-600">جاري التحديث</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    الأمان
                  </div>
                  <div className="text-xs text-green-600">محمي بالكامل</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    النشاطات الأخيرة
                  </h3>
                  <Link
                    to="/admin/activity"
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    عرض الكل
                  </Link>
                </div>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => {
                    const Icon = getTypeIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {activity.message}
                          </div>
                          <div className="text-sm text-gray-600">
                            {activity.user} • {activity.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={cn(
                              "text-xs",
                              getStatusColor(activity.status),
                            )}
                          >
                            {getStatusText(activity.status)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    طلبات الموافقة
                  </h3>
                  <Link
                    to="/admin/approvals"
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    عرض الكل
                  </Link>
                </div>
                <div className="space-y-4">
                  {mockRegistrationRequests.slice(0, 3).map((request) => {
                    const Icon = getTypeIcon(request.type);
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {getTypeLabel(request.type)} • {request.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">المستخدمون</h2>
              <div className="flex items-center gap-3">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو البريد"
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
                />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="dentist">أطباء الأسنان</option>
                  <option value="supplier">الموردين</option>
                  <option value="clinic_admin">مدراء العيادات</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSystemStats.totalUsers}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600">أطباء نشطون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSystemStats.activeDentists}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600">موردون نشطون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSystemStats.activeSuppliers}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600">المستخدمون المتفاعلون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSystemStats.activeUsers}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
                <div className="col-span-3">الاسم</div>
                <div className="col-span-3">البريد</div>
                <div className="col-span-2">الدور</div>
                <div className="col-span-2">الحالة</div>
                <div className="col-span-2 text-left">تاريخ الإنشاء</div>
              </div>
              <div className="divide-y">
                {mockUsers
                  .filter((u) =>
                    selectedFilter === "all" ? true : u.role === selectedFilter,
                  )
                  .filter(
                    (u) =>
                      !searchQuery ||
                      u.name.includes(searchQuery) ||
                      u.email.includes(searchQuery),
                  )
                  .map((u) => (
                    <div
                      key={u.id}
                      className="grid grid-cols-12 px-4 py-3 items-center text-sm"
                    >
                      <div className="col-span-3 font-medium text-gray-900">
                        {u.name}
                      </div>
                      <div className="col-span-3 text-gray-600">{u.email}</div>
                      <div className="col-span-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {u.role === "dentist"
                            ? "طبيب"
                            : u.role === "supplier"
                              ? "مورد"
                              : "مدير عيادة"}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          className={cn("text-xs", getStatusColor(u.status))}
                        >
                          {getStatusText(u.status)}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-left text-gray-600">
                        {u.createdAt}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "suppliers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إدارة الموردين</h2>
              <Link to="/admin/suppliers">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Package className="w-4 h-4" />
                  الذهاب إلى إدارة الموردين الكاملة
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
                <div className="col-span-3">الاسم</div>
                <div className="col-span-2">المسؤول</div>
                <div className="col-span-2">الهاتف</div>
                <div className="col-span-3">البريد</div>
                <div className="col-span-1">المنتجات</div>
                <div className="col-span-1 text-left">الحالة</div>
              </div>
              <div className="divide-y">
                {mockSuppliers.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-12 px-4 py-3 items-center text-sm"
                  >
                    <div className="col-span-3 font-medium text-gray-900">
                      {s.name}
                    </div>
                    <div className="col-span-2 text-gray-700">{s.contact}</div>
                    <div className="col-span-2 text-gray-700">{s.phone}</div>
                    <div className="col-span-3 text-gray-600">{s.email}</div>
                    <div className="col-span-1 font-semibold">{s.products}</div>
                    <div className="col-span-1 text-left">
                      <Badge
                        className={cn(
                          "text-xs",
                          s.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800",
                        )}
                      >
                        {s.status === "verified" ? "موثق" : "بانتظار التحقق"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">التقارير</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">الإيرادات الشهرية</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(mockSystemStats.monthlyRevenue)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المصروفات</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(56890000)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">صافي الربح</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        mockSystemStats.monthlyRevenue - 56890000,
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">التدفقات النقدية</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(32500000)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold mb-2">تقرير الأداء الشهري</h4>
                <p className="text-sm text-gray-600 mb-4">
                  ملخص الإيرادات، الطلبات، والمستخدمين.
                </p>
                <Button variant="outline">تصدير PDF</Button>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold mb-2">تقرير المستخدمين</h4>
                <p className="text-sm text-gray-600 mb-4">
                  النمو، التفعيل، والتوزيع حسب الأدوار.
                </p>
                <Button variant="outline">تصدير CSV</Button>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold mb-2">تقرير المبيعات</h4>
                <p className="text-sm text-gray-600 mb-4">
                  أفضل المنتجات والموردين أداءً.
                </p>
                <Button variant="outline">عرض التفاصيل</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <h4 className="font-semibold mb-4">تفصيل مالي</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-gray-600">ضرائب</div>
                  <div className="font-semibold">{formatCurrency(8500000)}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-gray-600">رواتب</div>
                  <div className="font-semibold">
                    {formatCurrency(22000000)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-gray-600">خدمات</div>
                  <div className="font-semibold">{formatCurrency(6400000)}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-gray-600">أخرى</div>
                  <div className="font-semibold">{formatCurrency(1990000)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إدارة العروض</h2>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 ml-1" />
                عرض جديد
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border">
                <p className="text-sm text-gray-600">عروض فعّالة</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockOffers.filter((o) => o.status === "active").length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <p className="text-sm text-gray-600">مجدولة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockOffers.filter((o) => o.status === "scheduled").length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <p className="text-sm text-gray-600">إجمالي التحويلات</p>
                <p className="text-2xl font-bold">
                  {mockOffers.reduce((s, o) => s + o.conversions, 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border">
                <p className="text-sm text-gray-600">الخصومات الممنوحة</p>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    mockOffers.reduce((s, o) => s + o.discountGiven, 0),
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
                <div className="col-span-4">الاسم</div>
                <div className="col-span-2">النوع</div>
                <div className="col-span-2">الفترة</div>
                <div className="col-span-2">الحالة</div>
                <div className="col-span-2 text-left">تحويلات</div>
              </div>
              <div className="divide-y">
                {mockOffers.map((o) => (
                  <div
                    key={o.id}
                    className="grid grid-cols-12 px-4 py-3 items-center text-sm"
                  >
                    <div className="col-span-4 font-medium text-gray-900">
                      {o.name}
                    </div>
                    <div className="col-span-2 text-gray-700">
                      {o.type === "percentage"
                        ? "نسبة"
                        : o.type === "bundle"
                          ? "حزمة"
                          : "شحن مجاني"}
                    </div>
                    <div className="col-span-2 text-gray-600">
                      {o.start} → {o.end}
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={cn("text-xs", getStatusColor(o.status))}
                      >
                        {getStatusText(o.status)}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-left font-semibold">
                      {o.conversions}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">الإشعارات</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  تحديد كمقروء
                </Button>
                <Button size="sm" variant="outline">
                  أرشفة
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="divide-y">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          n.type === "system"
                            ? "bg-yellow-100"
                            : n.type === "order"
                              ? "bg-blue-100"
                              : "bg-gray-100",
                        )}
                      >
                        <Bell
                          className={cn(
                            "w-4 h-4",
                            n.type === "system"
                              ? "text-yellow-700"
                              : n.type === "order"
                                ? "text-blue-700"
                                : "text-gray-700",
                          )}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {n.title}
                        </div>
                        <div className="text-sm text-gray-600">{n.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{n.time}</span>
                      <Badge
                        className={cn(
                          "text-xs",
                          n.read
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-800",
                        )}
                      >
                        {n.read ? "مقروء" : "جديد"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        إجراء
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">النظام</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-5 h-5" />
                  <span className="font-semibold">الخادم</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">الحالة: مستقر</p>
                <Badge className="bg-green-100 text-green-800">
                  {mockSystemStats.systemUptime} وقت تشغيل
                </Badge>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5" />
                  <span className="font-semibold">قاعدة البيانات</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  عدد المنتجات: {mockSystemStats.totalProducts}
                </p>
                <Badge className="bg-green-100 text-green-800">متصل</Badge>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">الأمان</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  تنبيهات: {mockSystemStats.systemAlerts}
                </p>
                <Button variant="outline">
                  <Shield className="w-4 h-4 ml-1" />
                  مراجعة التنبيهات
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemAdminDashboard;
