import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  ShoppingCart,
  Calendar,
  Clock,
  Target,
  Activity,
  Zap,
  Shield,
  Box,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  Star,
  Grid3X3,
  List,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LegacyInventoryItem } from "@/services/clinicDataAdapter";

interface StocksProps {
  stockData?: LegacyInventoryItem[];
}

interface StockItemDisplay {
  id: string | number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: string | number;
  supplier: string;
  lastOrder: string;
  expiryDate: string;
  status: string;
  location: string;
  barcode: string;
  usageRate: string;
}

const Stocks: React.FC<StocksProps> = ({ stockData: propStockData }) => {
  const convertToDisplayFormat = (items: LegacyInventoryItem[]): StockItemDisplay[] => {
    return items.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      currentStock: item.quantity,
      minStock: item.minQuantity,
      maxStock: item.minQuantity * 5,
      unit: item.unit,
      price: item.price,
      supplier: "شركة المستلزمات الطبية",
      lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiryDate: item.expiryDate || "لا ينتهي",
      status: item.status,
      location: `المخزن - رف ${String.fromCharCode(65 + index)}`,
      barcode: `ITM${String(item.id).padStart(3, '0')}`,
      usageRate: item.quantity < item.minQuantity ? "عالي" : item.quantity > item.minQuantity * 2 ? "منخفض" : "متوسط",
    }));
  };

  const stockData = propStockData ? convertToDisplayFormat(propStockData) : [];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "منخفض":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <AlertTriangle className="w-3 h-3" />
            منخفض
          </span>
        );
      case "متوفر":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            متوفر
          </span>
        );
      case "غير متوفر":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            غير متوفر
          </span>
        );
      case "منتهي الصلاحية":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertCircle className="w-3 h-3" />
            منتهي الصلاحية
          </span>
        );
      case "طبيعي":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            طبيعي
          </span>
        );
      case "جيد":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Shield className="w-3 h-3" />
            جيد
          </span>
        );
      case "نفذ":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertCircle className="w-3 h-3" />
            نفذ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const getUsageRateBadge = (rate: string) => {
    const rateConfig = {
      عالي: { color: "bg-red-100 text-red-700", icon: TrendingUp },
      متوسط: { color: "bg-yellow-100 text-yellow-700", icon: Activity },
      منخفض: { color: "bg-blue-100 text-blue-700", icon: TrendingDown },
    };

    const config = rateConfig[rate as keyof typeof rateConfig];
    if (!config) return null;

    const IconComponent = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
          config.color,
        )}
      >
        <IconComponent className="w-3 h-3" />
        {rate}
      </span>
    );
  };

  const filteredStocks = stockData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockStats = {
    totalItems: stockData.length,
    lowStock: stockData.filter((item) => item.status === "منخفض").length,
    outOfStock: stockData.filter((item) => item.status === "نفذ" || item.status === "غير متوفر").length,
    totalValue: stockData.reduce(
      (sum, item) => sum + item.currentStock * (typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0),
      0,
    ),
    expiringItems: stockData.filter((item) => {
      if (!item.expiryDate || item.expiryDate === "لا ينتهي") return false;
      const expiryDate = new Date(item.expiryDate);
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length,
  };

  const categories = Array.from(
    new Set(stockData.map((item) => item.category)),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المخزون</h1>
              <p className="text-orange-100 text-lg mb-4">
                تتبع شامل للمستلزمات الطبية والأدوات والمواد
              </p>
              <p className="text-orange-100">
                {stockStats.totalItems} صنف، {stockStats.lowStock} منخفض، قيمة
                المخزون: {(stockStats.totalValue / 1000000).toFixed(1)}M د.ع
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير المخزون
              </button>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                صنف جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Overview - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Stock Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              نظرة عامة على المخزون
            </h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {stockStats.totalItems}
              </p>
              <p className="text-sm font-medium text-blue-700">
                إجمالي الأصناف
              </p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {stockStats.lowStock}
              </p>
              <p className="text-sm font-medium text-red-700">مخزون منخفض</p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">
                {stockStats.expiringItems}
              </p>
              <p className="text-sm font-medium text-yellow-700">
                ينتهي قريباً
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {(stockStats.totalValue / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-green-700">قيمة المخزون</p>
              <p className="text-xs text-green-600 mt-1">د.ع</p>
            </div>
          </div>

          {/* Stock Level Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              مستويات المخزون حسب الفئة
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const categoryItems = stockData.filter(
                  (item) => item.category === category,
                );
                const lowStockItems = categoryItems.filter(
                  (item) => item.status === "منخفض",
                );
                const percentage =
                  categoryItems.length > 0
                    ? (lowStockItems.length / categoryItems.length) * 100
                    : 0;
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-orange-500",
                ];

                return (
                  <div
                    key={category}
                    className="text-center p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="mb-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl mx-auto flex items-center justify-center",
                          index === 0
                            ? "bg-blue-100"
                            : index === 1
                              ? "bg-green-100"
                              : index === 2
                                ? "bg-purple-100"
                                : "bg-orange-100",
                        )}
                      >
                        <Package
                          className={cn(
                            "w-6 h-6",
                            index === 0
                              ? "text-blue-600"
                              : index === 1
                                ? "text-green-600"
                                : index === 2
                                  ? "text-purple-600"
                                  : "text-orange-600",
                          )}
                        />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {categoryItems.length}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{category}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          colors[index % colors.length],
                        )}
                        style={{ width: `${100 - percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="col-span-1 lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Critical Alerts */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  تنبيهات عاجلة
                </h3>
                <p className="text-sm text-gray-600">تحتاج إلى اهتمام فوري</p>
              </div>
            </div>

            <div className="space-y-3">
              {stockData
                .filter((item) => item.status === "منخفض")
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 rounded-xl border border-red-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-red-800">
                        {item.name}
                      </p>
                      <span className="text-xs text-red-600">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      أقل من الحد الأدنى ({item.minStock})
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              إ��راءات سريعة
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all group">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-800">إضافة صنف</p>
                  <p className="text-sm text-orange-600">تسجيل صنف جديد</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-800">طلب شراء</p>
                  <p className="text-sm text-blue-600">إنشاء أمر شراء</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-800">جرد المخزون</p>
                  <p className="text-sm text-green-600">تحديث الكميات</p>
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
                placeholder="البحث في المخزون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">جميع ا��فئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="منخفض">منخفض</option>
              <option value="طبيعي">طبيعي</option>
              <option value="جيد">جيد</option>
              <option value="نفذ">نفذ</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "grid"
                  ? "bg-orange-600 text-white"
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
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stock Items Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {filteredStocks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(item.status)}
                    {getUsageRateBadge(item.usageRate)}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Level */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  المخزون الحالي
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {item.currentStock} {item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={cn(
                    "h-3 rounded-full transition-all duration-300",
                    item.currentStock <= item.minStock
                      ? "bg-red-500"
                      : item.currentStock >= item.maxStock * 0.8
                        ? "bg-green-500"
                        : "bg-yellow-500",
                  )}
                  style={{
                    width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>الحد الأدنى: {item.minStock}</span>
                <span>الحد الأقصى: {item.maxStock}</span>
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">السعر</span>
                <span className="font-semibold text-gray-900">
                  {item.price.toLocaleString()} د.ع
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">المورد</span>
                <span className="text-gray-700">{item.supplier}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الموقع</span>
                <span className="text-gray-700">{item.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">تاريخ الانتهاء</span>
                <span
                  className={cn(
                    "text-gray-700",
                    item.expiryDate !== "لا ينتهي" &&
                      new Date(item.expiryDate) <
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? "text-red-600 font-semibold"
                      : "",
                  )}
                >
                  {item.expiryDate === "لا ينتهي"
                    ? "لا ينتهي"
                    : new Date(item.expiryDate).toLocaleDateString("ar-IQ")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-xl transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all">
                  <ShoppingCart className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-500">{item.barcode}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stocks;
