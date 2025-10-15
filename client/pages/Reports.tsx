import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Users,
  DollarSign,
  Activity,
  Target,
  Clock,
  Star,
  Package,
  Stethoscope,
  FileText,
  Eye,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Award,
  Heart,
  Shield,
  Layers,
  Grid3X3,
  List,
  Search,
  Plus,
  Settings,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Receipt,
  Bookmark,
  Bell,
  Info,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Edit,
  Copy,
  Save,
  Printer,
  ExternalLink,
  Percent,
  Calculator,
  TrendingUp as Growth,
  Wallet,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reportCategories = [
  {
    id: "financial",
    name: "التقارير المالية",
    icon: DollarSign,
    color: "green",
    reports: [
      {
        id: "revenue",
        name: "الإيرادات الشهرية",
        description: "تقرير تفصيلي عن الإيرادات",
      },
      {
        id: "expenses",
        name: "المصروفات والتكاليف",
        description: "تحليل المصروفات الشهرية",
      },
      {
        id: "profit_loss",
        name: "الأرباح والخسائر",
        description: "بيان الأرباح والخسائر",
      },
      {
        id: "cash_flow",
        name: "التدفق النقدي",
        description: "تحليل التدفق النقدي",
      },
    ],
  },
  {
    id: "patients",
    name: "تقارير المرضى",
    icon: Users,
    color: "blue",
    reports: [
      {
        id: "patient_statistics",
        name: "إحصائيات المرضى",
        description: "إحصائيات شاملة عن المرضى",
      },
      {
        id: "appointments",
        name: "تقرير المواعيد",
        description: "تحليل المواعيد والحجوزات",
      },
      {
        id: "patient_satisfaction",
        name: "رضا المرضى",
        description: "تقييمات ورضا المرضى",
      },
      {
        id: "patient_demographics",
        name: "تصنيف المرضى",
        description: "توزيع المرضى حسب العمر والجنس",
      },
    ],
  },
  {
    id: "treatments",
    name: "تقارير العلاجات",
    icon: Stethoscope,
    color: "purple",
    reports: [
      {
        id: "treatment_analysis",
        name: "تحليل العلاجات",
        description: "إحصائيات العلاجات المقدمة",
      },
      {
        id: "success_rates",
        name: "معدلات النجاح",
        description: "معدلات نجاح العلاجات",
      },
      {
        id: "treatment_duration",
        name: "مدة العلاجات",
        description: "تحليل أوقات العلاجات",
      },
      {
        id: "ai_performance",
        name: "أداء الذكاء الاصطناعي",
        description: "تقييم أداء نظام الذكاء الاصطناعي",
      },
    ],
  },
  {
    id: "inventory",
    name: "تقارير المخزون",
    icon: Package,
    color: "orange",
    reports: [
      {
        id: "stock_levels",
        name: "م��تويات المخزون",
        description: "حالة المخزون الحالية",
      },
      {
        id: "purchase_analysis",
        name: "تحليل المشتريات",
        description: "تحليل عمليات الشراء",
      },
      {
        id: "supplier_performance",
        name: "أداء الموردين",
        description: "تقييم أداء الموردين",
      },
      {
        id: "inventory_turnover",
        name: "دوران المخزون",
        description: "معدل دوران المواد",
      },
    ],
  },
  {
    id: "staff",
    name: "تقارير الموظفين",
    icon: Briefcase,
    color: "indigo",
    reports: [
      {
        id: "staff_performance",
        name: "أداء الموظفين",
        description: "تقييم أداء فريق العمل",
      },
      {
        id: "attendance",
        name: "الحضور والغياب",
        description: "تقرير الحضور والغياب",
      },
      {
        id: "productivity",
        name: "الإنتاجية",
        description: "مؤشرات الإنتاجية",
      },
      {
        id: "training",
        name: "التدريب والتطوير",
        description: "برامج التدريب والتطوير",
      },
    ],
  },
  {
    id: "operational",
    name: "التقارير التشغيلية",
    icon: Activity,
    color: "teal",
    reports: [
      {
        id: "clinic_efficiency",
        name: "كفاءة ا��عيادة",
        description: "مؤشرات الكفاءة التشغيلية",
      },
      {
        id: "equipment_utilization",
        name: "استخدام المعدات",
        description: "معدل استخدام المعدات",
      },
      {
        id: "quality_metrics",
        name: "مؤشرات الجودة",
        description: "مقاييس ج��دة الخدمة",
      },
      {
        id: "compliance",
        name: "الامتثال واللوائح",
        description: "تقارير الامتثال والمعايير",
      },
    ],
  },
];

const sampleData = {
  revenue: {
    current: 125000,
    previous: 115000,
    change: 8.7,
    trend: "up",
    data: [
      { month: "يناير", value: 98000 },
      { month: "فبراير", value: 105000 },
      { month: "مارس", value: 118000 },
      { month: "أبريل", value: 125000 },
    ],
  },
  patients: {
    total: 1250,
    new: 85,
    returning: 1165,
    satisfaction: 4.8,
    data: [
      { category: "جدد", value: 85, percentage: 6.8 },
      { category: "عائدون", value: 1165, percentage: 93.2 },
    ],
  },
  treatments: {
    total: 890,
    completed: 820,
    success_rate: 92.1,
    ai_accuracy: 96.5,
    data: [
      { type: "علاج جذور", count: 145, success: 94 },
      { type: "حشوات", count: 230, success: 98 },
      { type: "تنظيف", count: 315, success: 99 },
      { type: "تقويم", count: 85, success: 89 },
      { type: "زراعة", count: 115, success: 87 },
    ],
  },
  inventory: {
    total_items: 450,
    low_stock: 12,
    out_of_stock: 3,
    value: 89500,
    data: [
      { category: "مواد طبية", value: 45000, percentage: 50.3 },
      { category: "معدات", value: 30000, percentage: 33.5 },
      { category: "أدوات", value: 14500, percentage: 16.2 },
    ],
  },
};

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState("financial");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState("this_month");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentCategory = reportCategories.find(
    (cat) => cat.id === selectedCategory,
  );

  const generateReport = async (reportId: string) => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // Show success message or open report
    }, 2000);
  };

  const ReportCard = ({ report, category }: { report: any; category: any }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group">
      <div
        className={cn(
          "p-6 bg-gradient-to-r relative overflow-hidden",
          category.color === "green" &&
            "from-green-50 to-emerald-50 border-b border-green-100",
          category.color === "blue" &&
            "from-blue-50 to-indigo-50 border-b border-blue-100",
          category.color === "purple" &&
            "from-purple-50 to-pink-50 border-b border-purple-100",
          category.color === "orange" &&
            "from-orange-50 to-red-50 border-b border-orange-100",
          category.color === "indigo" &&
            "from-indigo-50 to-purple-50 border-b border-indigo-100",
          category.color === "teal" &&
            "from-teal-50 to-cyan-50 border-b border-teal-100",
        )}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                category.color === "green" && "bg-green-500",
                category.color === "blue" && "bg-blue-500",
                category.color === "purple" && "bg-purple-500",
                category.color === "orange" && "bg-orange-500",
                category.color === "indigo" && "bg-indigo-500",
                category.color === "teal" && "bg-teal-500",
              )}
            >
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-600 hover:bg-white/80">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-600 hover:bg-white/80">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {report.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{report.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              آخر تحديث: اليوم
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              PDF
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2">
          <button
            onClick={() => generateReport(report.id)}
            disabled={isGenerating}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
              category.color === "green" &&
                "bg-green-600 hover:bg-green-700 text-white",
              category.color === "blue" &&
                "bg-blue-600 hover:bg-blue-700 text-white",
              category.color === "purple" &&
                "bg-purple-600 hover:bg-purple-700 text-white",
              category.color === "orange" &&
                "bg-orange-600 hover:bg-orange-700 text-white",
              category.color === "indigo" &&
                "bg-indigo-600 hover:bg-indigo-700 text-white",
              category.color === "teal" &&
                "bg-teal-600 hover:bg-teal-700 text-white",
              isGenerating && "opacity-50 cursor-not-allowed",
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                عرض التقرير
              </>
            )}
          </button>
          <button className="p-3 border border-gray-300 rounded-xl hover:border-gray-400 transition-all">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-3 border border-gray-300 rounded-xl hover:border-gray-400 transition-all">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                مركز التقارير والتحليلات
              </h1>
              <p className="text-indigo-100 text-lg mb-4">
                تقارير شاملة وتحليلات ذكية لإدارة العيادة
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">24 تقرير متاح</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">تحليل ذكي</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">تحديث فوري</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                تقرير مخصص
              </button>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير الكل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "الإيرادات الشهرية",
            value: `$${sampleData.revenue.current.toLocaleString()}`,
            change: `+${sampleData.revenue.change}%`,
            icon: DollarSign,
            color: "green",
            trend: "up",
          },
          {
            title: "إجمالي المرضى",
            value: sampleData.patients.total.toLocaleString(),
            change: `+${sampleData.patients.new}`,
            icon: Users,
            color: "blue",
            trend: "up",
          },
          {
            title: "العلاجات المكتملة",
            value: sampleData.treatments.completed,
            change: `${sampleData.treatments.success_rate}%`,
            icon: Stethoscope,
            color: "purple",
            trend: "up",
          },
          {
            title: "قيمة المخزون",
            value: `$${sampleData.inventory.value.toLocaleString()}`,
            change: `${sampleData.inventory.low_stock} ناقص`,
            icon: Package,
            color: "orange",
            trend: "down",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
                  stat.color === "green" && "bg-green-100",
                  stat.color === "blue" && "bg-blue-100",
                  stat.color === "purple" && "bg-purple-100",
                  stat.color === "orange" && "bg-orange-100",
                )}
              >
                <stat.icon
                  className={cn(
                    "w-6 h-6",
                    stat.color === "green" && "text-green-600",
                    stat.color === "blue" && "text-blue-600",
                    stat.color === "purple" && "text-purple-600",
                    stat.color === "orange" && "text-orange-600",
                  )}
                />
              </div>
              <div className="flex items-center gap-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.trend === "up" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="today">اليوم</option>
              <option value="this_week">هذا الأسبوع</option>
              <option value="this_month">هذا الشهر</option>
              <option value="this_quarter">هذا الربع</option>
              <option value="this_year">هذا العام</option>
              <option value="custom">فترة مخصصة</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في التقارير..."
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200",
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200",
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all">
              <RefreshCw className="w-4 h-4" />
              تحديث البيانات
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all">
              <Settings className="w-4 h-4" />
              إعدادات التقارير
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {reportCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all text-center group hover:scale-105",
              selectedCategory === category.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300 bg-white",
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform",
                selectedCategory === category.id
                  ? "bg-indigo-600"
                  : category.color === "green" && "bg-green-100",
                category.color === "blue" && "bg-blue-100",
                category.color === "purple" && "bg-purple-100",
                category.color === "orange" && "bg-orange-100",
                category.color === "indigo" && "bg-indigo-100",
                category.color === "teal" && "bg-teal-100",
              )}
            >
              <category.icon
                className={cn(
                  "w-6 h-6",
                  selectedCategory === category.id
                    ? "text-white"
                    : category.color === "green" && "text-green-600",
                  category.color === "blue" && "text-blue-600",
                  category.color === "purple" && "text-purple-600",
                  category.color === "orange" && "text-orange-600",
                  category.color === "indigo" && "text-indigo-600",
                  category.color === "teal" && "text-teal-600",
                )}
              />
            </div>
            <h3
              className={cn(
                "font-semibold text-sm",
                selectedCategory === category.id
                  ? "text-indigo-700"
                  : "text-gray-900",
              )}
            >
              {category.name}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {category.reports.length} تقرير
            </p>
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {currentCategory && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentCategory.name}
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {currentCategory.reports.length} تقرير متاح
            </span>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentCategory.reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  category={currentCategory}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {currentCategory.reports.map((report, index) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          currentCategory.color === "green" && "bg-green-100",
                          currentCategory.color === "blue" && "bg-blue-100",
                          currentCategory.color === "purple" && "bg-purple-100",
                          currentCategory.color === "orange" && "bg-orange-100",
                          currentCategory.color === "indigo" && "bg-indigo-100",
                          currentCategory.color === "teal" && "bg-teal-100",
                        )}
                      >
                        <currentCategory.icon
                          className={cn(
                            "w-6 h-6",
                            currentCategory.color === "green" &&
                              "text-green-600",
                            currentCategory.color === "blue" && "text-blue-600",
                            currentCategory.color === "purple" &&
                              "text-purple-600",
                            currentCategory.color === "orange" &&
                              "text-orange-600",
                            currentCategory.color === "indigo" &&
                              "text-indigo-600",
                            currentCategory.color === "teal" && "text-teal-600",
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {report.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            آخر تحديث: اليوم
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF, Excel
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => generateReport(report.id)}
                          className={cn(
                            "px-4 py-2 rounded-xl font-medium transition-all",
                            currentCategory.color === "green" &&
                              "bg-green-600 hover:bg-green-700 text-white",
                            currentCategory.color === "blue" &&
                              "bg-blue-600 hover:bg-blue-700 text-white",
                            currentCategory.color === "purple" &&
                              "bg-purple-600 hover:bg-purple-700 text-white",
                            currentCategory.color === "orange" &&
                              "bg-orange-600 hover:bg-orange-700 text-white",
                            currentCategory.color === "indigo" &&
                              "bg-indigo-600 hover:bg-indigo-700 text-white",
                            currentCategory.color === "teal" &&
                              "bg-teal-600 hover:bg-teal-700 text-white",
                          )}
                        >
                          عرض التقرير
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">رؤى الذكاء الاصطناعي</h3>
              <p className="text-white/90">
                تحليلات ذكية ونصائح مخصصة لتحسين الأداء
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "توقعات الإيرادات",
                value: "نمو 15%",
                description: "متوقع نمو الإيرادات بنسبة 15% الشهر القادم",
                icon: TrendingUp,
                color: "green",
              },
              {
                title: "رضا المرضى",
                value: "95% إيجابي",
                description: "تحسن ملحوظ في تقييمات المرضى",
                icon: Heart,
                color: "pink",
              },
              {
                title: "كفاءة العمليات",
                value: "مُحسنة",
                description: "تحسن في أوقات الانتظار وجودة الخدمة",
                icon: Zap,
                color: "yellow",
              },
            ].map((insight, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <insight.icon className="w-8 h-8 text-white" />
                  <span className="text-lg font-bold">{insight.value}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                <p className="text-white/90 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
