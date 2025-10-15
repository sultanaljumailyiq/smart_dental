import React, { useState } from "react";
import {
  Monitor,
  Wrench,
  Calendar,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  TrendingUp,
  Battery,
  Wifi,
  Thermometer,
  Plus,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Target,
  BarChart3,
  Grid3X3,
  List,
  MoreHorizontal,
  Download,
  Upload,
  Power,
  HardDrive,
  Cpu,
  Gauge,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

const equipment = [
  {
    id: 1,
    name: "جهاز الأشعة الرقمي",
    model: "Planmeca ProMax 3D",
    location: "غرفة 1",
    status: "يعمل",
    health: 95,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    usage: 85,
    aiPrediction: "ممتاز",
    alerts: 0,
    icon: Monitor,
    color: "bg-blue-100 text-blue-700",
    temperature: 22,
    power: "تشغيل",
    serialNumber: "PMX3D-2023-001",
    warranty: "2025-12-31",
  },
  {
    id: 2,
    name: "وحدة كرسي الأسنان",
    model: "A-dec 500",
    location: "غرفة 2",
    status: "يحتاج صيانة",
    health: 78,
    lastMaintenance: "2023-12-15",
    nextMaintenance: "2024-02-15",
    usage: 92,
    aiPrediction: "يحتاج انتباه",
    alerts: 2,
    icon: Settings,
    color: "bg-orange-100 text-orange-700",
    temperature: 24,
    power: "تشغيل",
    serialNumber: "ADC500-2022-002",
    warranty: "2025-06-15",
  },
  {
    id: 3,
    name: "آلة التصوير البانورامي",
    model: "Carestream CS 8100",
    location: "غرفة الأشعة",
    status: "يعمل",
    health: 88,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-07-05",
    usage: 76,
    aiPrediction: "جيد",
    alerts: 0,
    icon: Camera,
    color: "bg-green-100 text-green-700",
    temperature: 21,
    power: "تشغيل",
    serialNumber: "CS8100-2023-003",
    warranty: "2026-03-20",
  },
  {
    id: 4,
    name: "نظام تعقيم الأدوات",
    model: "Midmark M11",
    location: "غرفة التعقيم",
    status: "متوقف",
    health: 45,
    lastMaintenance: "2023-11-20",
    nextMaintenance: "2024-01-20",
    usage: 95,
    aiPrediction: "يحتاج إصلاح",
    alerts: 5,
    icon: Shield,
    color: "bg-red-100 text-red-700",
    temperature: 0,
    power: "متوقف",
    serialNumber: "M11-2021-004",
    warranty: "2024-11-20",
  },
  {
    id: 5,
    name: "جهاز الليزر الطبي",
    model: "Biolase Waterlase",
    location: "غرفة 3",
    status: "يعمل",
    health: 92,
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-04-08",
    usage: 68,
    aiPrediction: "ممتاز",
    alerts: 0,
    icon: Zap,
    color: "bg-purple-100 text-purple-700",
    temperature: 23,
    power: "تشغيل",
    serialNumber: "BLW-2023-005",
    warranty: "2027-01-15",
  },
];

const Peripherals = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "يعمل":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            يعمل
          </span>
        );
      case "يحتاج صيانة":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            يحتاج صيانة
          </span>
        );
      case "متوقف":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            متوقف
          </span>
        );
      default:
        return null;
    }
  };

  const getPredictionBadge = (prediction: string) => {
    const predictionConfig = {
      ممتاز: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      جيد: { color: "bg-blue-100 text-blue-700", icon: Target },
      "يحتاج انتباه": { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      "يحتاج إصلاح": { color: "bg-red-100 text-red-700", icon: AlertTriangle },
    };

    const config =
      predictionConfig[prediction as keyof typeof predictionConfig];
    if (!config) return null;

    const IconComponent = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
          config.color,
        )}
      >
        <Brain className="w-3 h-3" />
        {prediction}
      </span>
    );
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const equipmentStats = {
    total: equipment.length,
    operational: equipment.filter((e) => e.status === "يعمل").length,
    needsMaintenance: equipment.filter((e) => e.status === "يحتاج صيانة")
      .length,
    offline: equipment.filter((e) => e.status === "متوقف").length,
    avgHealth: Math.round(
      equipment.reduce((sum, e) => sum + e.health, 0) / equipment.length,
    ),
    totalAlerts: equipment.reduce((sum, e) => sum + e.alerts, 0),
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الأجهزة</h1>
              <p className="text-purple-100 text-lg mb-4">
                مراقبة وصيانة المعدات ا��طبية والأجهزة التقنية
              </p>
              <p className="text-purple-100">
                {equipmentStats.total} جهاز، {equipmentStats.operational} يعمل،{" "}
                {equipmentStats.totalAlerts} تنبيه
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير التقرير
              </button>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-purple-50 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                جهاز جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Overview - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Equipment Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              نظرة عامة على الأجهزة
            </h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {equipmentStats.total}
              </p>
              <p className="text-sm font-medium text-blue-700">
                إجمالي الأجهزة
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {equipmentStats.operational}
              </p>
              <p className="text-sm font-medium text-green-700">يعمل بكفاءة</p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">
                {equipmentStats.needsMaintenance}
              </p>
              <p className="text-sm font-medium text-yellow-700">يحتاج صيانة</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {equipmentStats.totalAlerts}
              </p>
              <p className="text-sm font-medium text-red-700">تنبيهات نشطة</p>
            </div>
          </div>

          {/* Health Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              صحة الأجهزة
            </h4>
            <div className="h-32 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
              <div className="grid grid-cols-5 gap-4 h-full">
                {equipment.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end space-y-2"
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {item.health}%
                      </div>
                      <div
                        className={cn(
                          "rounded-t-lg w-8 transition-all duration-300",
                          item.health >= 90
                            ? "bg-green-500"
                            : item.health >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500",
                        )}
                        style={{ height: `${item.health}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 text-center leading-tight">
                      {item.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Schedule & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Maintenance Schedule */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  جدول الصيانة
                </h3>
                <p className="text-sm text-gray-600">المواعيد القادمة</p>
              </div>
            </div>

            <div className="space-y-3">
              {equipment
                .filter(
                  (item) =>
                    new Date(item.nextMaintenance) <=
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 rounded-xl border border-orange-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-orange-800">
                        {item.name}
                      </p>
                      <span className="text-xs text-orange-600">
                        {new Date(item.nextMaintenance).toLocaleDateString(
                          "ar-IQ",
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-orange-700">{item.location}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              إجراءات سريعة
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all group">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-purple-800">جهاز جديد</p>
                  <p className="text-sm text-purple-600">تسجيل جهاز جديد</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-800">جدولة صيانة</p>
                  <p className="text-sm text-blue-600">إضافة موعد صيانة</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-800">فحص شامل</p>
                  <p className="text-sm text-green-600">فحص جميع الأجهزة</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن جهاز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="يعمل">يعمل</option>
              <option value="يحتاج صيانة">يحتاج صيانة</option>
              <option value="متوقف">متوقف</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {filteredEquipment.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    item.color,
                  )}
                >
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.model}</p>
                  <p className="text-xs text-gray-500">{item.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(item.status)}
                    {getPredictionBadge(item.aiPrediction)}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Health Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  صحة الجهاز
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {item.health}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={cn(
                    "h-3 rounded-full transition-all duration-300",
                    item.health >= 90
                      ? "bg-green-500"
                      : item.health >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${item.health}%` }}
                ></div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الاستخدام</span>
                <span className="font-semibold text-gray-900">
                  {item.usage}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">درجة الحرارة</span>
                <span className="font-semibold text-gray-900">
                  {item.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الطاقة</span>
                <span
                  className={cn(
                    "font-semibold",
                    item.power === "تشغيل" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {item.power}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الرقم التسلسلي</span>
                <span className="font-mono text-xs text-gray-700">
                  {item.serialNumber}
                </span>
              </div>
            </div>

            {/* Maintenance Info */}
            <div className="bg-gray-50 rounded-2xl p-3 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">آخر صيانة</span>
                  <p className="font-semibold text-gray-800">
                    {new Date(item.lastMaintenance).toLocaleDateString("ar-IQ")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">الصيانة القادمة</span>
                  <p className="font-semibold text-gray-800">
                    {new Date(item.nextMaintenance).toLocaleDateString("ar-IQ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {item.alerts > 0 && (
              <div className="bg-red-50 rounded-2xl p-3 mb-4 border border-red-100">
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{item.alerts} تنبيه نشط</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-xl transition-all">
                  <Wrench className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <Power className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>AI مراقب</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Peripherals;
