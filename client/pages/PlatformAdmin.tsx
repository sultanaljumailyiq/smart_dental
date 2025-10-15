import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, Briefcase, TrendingUp, Eye, BarChart3, AlertTriangle, CheckCircle, Clock, Star, Settings, Filter, Search, Plus, Edit, Trash2, Flag, Shield, Award, Target, Calendar, DollarSign, UserCheck, MessageSquare, Bell, Activity, Download, Upload, Globe, Database, Server, Lock, Key, RefreshCw, Monitor, Cpu, HardDrive, Wifi, Zap, Brain, Crown, Building, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminTopNavbar from "@/components/AdminTopNavbar";
const platformStats = {
  community: {
    totalUsers: 12456,
    activeUsers: 8932,
    posts: 3421,
    comments: 15678,
    engagement: 78.5
  },
  jobs: {
    totalJobs: 1234,
    activeJobs: 892,
    applications: 5678,
    placements: 234,
    successRate: 85.2
  },
  revenue: {
    monthly: 2450000,
    growth: 15.3,
    subscriptions: 456,
    transactions: 1234
  },
  system: {
    uptime: 99.9,
    responseTime: 120,
    activeConnections: 2847,
    storageUsed: 67.3
  }
};
const adminModules = [{
  id: 1,
  title: "إدارة المستخدمين",
  description: "إدارة حسابات المستخدمين والصلاحيات",
  icon: Users,
  color: "bg-blue-100 text-blue-700",
  stats: {
    total: platformStats.community.totalUsers,
    active: platformStats.community.activeUsers,
    growth: "+12%"
  },
  actions: ["عرض المستخدمين", "إضافة مستخدم", "إدارة الأدوار"]
}, {
  id: 2,
  title: "إدارة المحتوى",
  description: "مراقبة وإدارة المنشورات والتعليقات",
  icon: MessageCircle,
  color: "bg-green-100 text-green-700",
  stats: {
    total: platformStats.community.posts,
    active: platformStats.community.comments,
    growth: "+8%"
  },
  actions: ["مراجعة المحتوى", "إدارة التقارير", "إعدادات النشر"]
}, {
  id: 3,
  title: "إدارة الوظائف",
  description: "مراقبة سوق العمل والتوظيف",
  icon: Briefcase,
  color: "bg-purple-100 text-purple-700",
  stats: {
    total: platformStats.jobs.totalJobs,
    active: platformStats.jobs.activeJobs,
    growth: "+20%"
  },
  actions: ["مراجعة الوظائف", "إدارة الشركات", "إحصائيات التوظيف"]
}, {
  id: 4,
  title: "الإدارة المالية",
  description: "تتبع الإيرادات والمدفوعات",
  icon: DollarSign,
  color: "bg-yellow-100 text-yellow-700",
  stats: {
    total: platformStats.revenue.monthly,
    active: platformStats.revenue.subscriptions,
    growth: `+${platformStats.revenue.growth}%`
  },
  actions: ["عرض الإيرادات", "إدارة الاشتراكات", "تقارير مالية"]
}, {
  id: 5,
  title: "مراقبة النظام",
  description: "مراقبة أداء الخوادم والبنية التحتية",
  icon: Monitor,
  color: "bg-red-100 text-red-700",
  stats: {
    total: platformStats.system.uptime,
    active: platformStats.system.activeConnections,
    growth: "مستقر"
  },
  actions: ["حالة الخوادم", "سجلات النظام", "النسخ الاحتياطي"]
}, {
  id: 6,
  title: "الأمان والخصوصية",
  description: "إدارة الأمان وحماية البيانات",
  icon: Shield,
  color: "bg-indigo-100 text-indigo-700",
  stats: {
    total: 0,
    active: 24,
    growth: "آمن"
  },
  actions: ["سجل الأمان", "إدارة الصلاحيات", "مراجعة التهديدات"]
}];
const recentActivities = [{
  id: 1,
  type: "user",
  title: "مستخدم جديد",
  description: "انضم د. محمد أحمد للمنصة",
  time: "منذ 5 دقائق",
  icon: UserCheck,
  color: "bg-green-100 text-green-700"
}, {
  id: 2,
  type: "content",
  title: "منشور جديد",
  description: "تم نشر مناقشة حول تقويم الأسنان",
  time: "منذ 15 دقيقة",
  icon: MessageSquare,
  color: "bg-blue-100 text-blue-700"
}, {
  id: 3,
  type: "job",
  title: "وظيفة جديدة",
  description: "تم نشر وظيفة طبيب أسنان في بغداد",
  time: "منذ 30 دقيقة",
  icon: Briefcase,
  color: "bg-purple-100 text-purple-700"
}, {
  id: 4,
  type: "system",
  title: "تحديث النظام",
  description: "تم تحديث خادم قاعدة البيانات",
  time: "منذ ساعة",
  icon: Server,
  color: "bg-orange-100 text-orange-700"
}];
const PlatformAdmin = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformCommissions, setPlatformCommissions] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        // Fetch commission stats
        const statsRes = await fetch("/api/platform/stats");
        if (statsRes.ok) {
          const data = await statsRes.json();
          setPlatformCommissions(data);
        }

        // Fetch pending approvals
        const approvalsRes = await fetch("/api/supplier-approvals/pending");
        if (approvalsRes.ok) {
          const data = await approvalsRes.json();
          setPendingApprovals(data.approvals || []);
        }
      } catch (error) {
        console.error("Error fetching platform data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
  }, []);

  const filteredModules = adminModules.filter(module => module.title.toLowerCase().includes(searchTerm.toLowerCase()) || module.description.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const handleModuleAction = (moduleId: number, actionName: string) => {
    const moduleRoutes: Record<number, Record<string, string>> = {
      1: { // User Management
        "عرض المستخدمين": "/admin/users",
        "إضافة مستخدم": "/admin/users/new",
        "إدارة الأدوار": "/admin/roles"
      },
      2: { // Content Management
        "مراجعة المحتوى": "/admin/content",
        "إدارة التقارير": "/admin/reports",
        "إعدادات النشر": "/admin/publishing"
      },
      3: { // Jobs Management
        "مراجعة الوظائف": "/admin/jobs",
        "إدارة الشركات": "/admin/companies",
        "إحصائيات التوظيف": "/admin/employment-stats"
      },
      4: { // Financial Management
        "عرض الإيرادات": "/admin/revenue",
        "إدارة الاشتراكات": "/admin/subscriptions",
        "تقارير مالية": "/admin/financial-reports"
      },
      5: { // System Monitoring
        "حالة الخوادم": "/admin/server-status",
        "سجلات النظام": "/admin/system-logs",
        "النسخ الاحتياطي": "/admin/backups"
      },
      6: { // Security
        "سجل الأمان": "/admin/security-log",
        "إدارة الصلاحيات": "/admin/permissions",
        "مراجعة التهديدات": "/admin/threats"
      }
    };

    const route = moduleRoutes[moduleId]?.[actionName];
    if (route) {
      navigate(route);
    } else if (actionName === "settings") {
      navigate("/admin/settings");
    } else {
      toast.success(`تم تنفيذ: ${actionName}`);
    }
  };
  
  const handleViewDetails = (moduleId: number) => {
    setSelectedModule(moduleId);
    const module = adminModules.find(m => m.id === moduleId);
    if (module) {
      toast.info(`عرض تفاصيل: ${module.title}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">إدارة المنصة</h1>
                <p className="text-white/90 text-sm">نظرة شاملة على المنصة</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => navigate("/admin/dashboard")}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                لوحة المعلومات
              </button>
              <button 
                onClick={() => navigate("/admin/settings")}
                className="bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                الإعدادات
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Platform Commissions & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Commissions */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">أرباح المنصة</h3>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold text-emerald-600 mb-2">
                {platformCommissions?.totalStats?.totalCommissions || "0"} IQD
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-emerald-700 font-semibold">معلق</p>
                  <p className="text-emerald-600">{platformCommissions?.totalStats?.pendingCommissions || "0"} IQD</p>
                </div>
                <div>
                  <p className="text-emerald-700 font-semibold">محصل</p>
                  <p className="text-emerald-600">{platformCommissions?.totalStats?.collectedCommissions || "0"} IQD</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pending Supplier Approvals */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">موافقات معلقة</h3>
          </div>
          <p className="text-4xl font-bold text-amber-600 mb-2">
            {loading ? "..." : pendingApprovals.length}
          </p>
          <p className="text-sm text-amber-700">طلبات موردين تنتظر المراجعة</p>
          <button 
            onClick={() => navigate("/admin/supplier-approvals")}
            className="w-full mt-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-all font-medium text-sm"
          >
            مراجعة الطلبات
          </button>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">إجمالي الطلبات</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {loading ? "..." : platformCommissions?.totalStats?.totalOrders || "0"}
          </p>
          <p className="text-sm text-blue-700">طلبات تم احتساب العمولة منها</p>
        </div>
      </div>

      {/* Platform Overview - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* System Health */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">صحة النظام</h3>
            <Monitor className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {platformStats.system.uptime}%
              </p>
              <p className="text-sm font-medium text-green-700">وقت التشغيل</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {platformStats.system.responseTime}
              </p>
              <p className="text-sm font-medium text-blue-700">
                وقت الاستجابة (مللي ثانية)
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {platformStats.system.activeConnections.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-purple-700">اتصال نشط</p>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HardDrive className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-2">
                {platformStats.system.storageUsed}%
              </p>
              <p className="text-sm font-medium text-orange-700">
                استخدام التخزين
              </p>
            </div>
          </div>

          {/* Performance Chart */}
          
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">النشاط الأخير</h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivities.map(activity => <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activity.color)}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>)}
          </div>

          <button 
            onClick={() => navigate("/admin/activities")}
            className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
          >
            عرض جميع الأنشطة
          </button>
        </div>
      </div>

      {/* Search */}
      

      {/* Admin Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map(module => <div key={module.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", module.color)}>
                <module.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-lg">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>

            {/* Module Stats */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {typeof module.stats.total === "number" && module.stats.total > 1000 ? `${(module.stats.total / 1000).toFixed(1)}K` : module.stats.total}
                  </p>
                  <p className="text-xs text-gray-600">الإجمالي</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {typeof module.stats.active === "number" && module.stats.active > 1000 ? `${(module.stats.active / 1000).toFixed(1)}K` : module.stats.active}
                  </p>
                  <p className="text-xs text-gray-600">النشط</p>
                </div>
                <div>
                  <p className={cn("text-lg font-bold", module.stats.growth.includes("+") ? "text-green-600" : "text-gray-900")}>
                    {module.stats.growth}
                  </p>
                  <p className="text-xs text-gray-600">النمو</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-4">
              {module.actions.map((action, index) => <button 
                key={index} 
                onClick={() => handleModuleAction(module.id, action)}
                className="w-full text-right p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-sm font-medium text-gray-700"
              >
                  {action}
                </button>)}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleViewDetails(module.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
              >
                <Eye className="w-4 h-4" />
                عرض التفاصيل
              </button>
              <button 
                onClick={() => handleModuleAction(module.id, "settings")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                <Settings className="w-4 h-4" />
                إعدادات
              </button>
            </div>
          </div>)}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              رؤى الذكاء الاصطناعي للمنصة
            </h3>
            <p className="text-indigo-700">تحليلات متقدمة وتوصيات ذكية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h4 className="font-semibold text-gray-800">نمو المستخدمين</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              من المتوقع زيادة المستخدمين بنسبة 25% خلال الشهر القادم.
            </p>
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <Target className="w-4 h-4" />
              <span>ثقة 92%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              <h4 className="font-semibold text-gray-800">
                الإيرادات المتوقعة
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              توقع زيادة الإيرادات بـ 18% مع نمو الاشتراكات المدفوعة.
            </p>
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <Award className="w-4 h-4" />
              <span>أداء ممتاز</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h4 className="font-semibold text-gray-800">الأمان والاستقرار</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              النظام يعمل بكفاءة عالية مع مستوى أمان ممتاز.
            </p>
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <CheckCircle className="w-4 h-4" />
              <span>آمن 100%</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default PlatformAdmin;