import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Receipt,
  CreditCard,
  Banknote,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const salesData = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    patientName: "أحمد علي محمد",
    services: ["علاج جذور الأسنان", "تنظيف الأسنان"],
    totalAmount: 950000,
    paidAmount: 950000,
    paymentMethod: "نقدي",
    date: "2024-01-15",
    status: "��كتمل",
    doctor: "د. سارة أحمد",
    discount: 50000,
    notes: "مريض دائم - خصم خاص",
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    patientName: "فاطمة حسن علي",
    services: ["زراعة الأسنان", "تقويم الأسنان"],
    totalAmount: 2200000,
    paidAmount: 1500000,
    paymentMethod: "بطاقة ائتمان",
    date: "2024-01-14",
    status: "جزئي",
    doctor: "د. أحمد محمد",
    discount: 0,
    notes: "دفع على مراحل",
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    patientName: "محمد خالد حسين",
    services: ["تبييض الأسنان", "حشو تجميلي"],
    totalAmount: 750000,
    paidAmount: 0,
    paymentMethod: "معلق",
    date: "2024-01-13",
    status: "معلق",
    doctor: "د. سارة أحمد",
    discount: 0,
    notes: "في انتظار موافقة التأمين",
  },
  {
    id: 4,
    invoiceNumber: "INV-2024-004",
    patientName: "زينب محمود",
    services: ["فحص دوري", "تنظيف الأسنان"],
    totalAmount: 200000,
    paidAmount: 200000,
    paymentMethod: "تحويل بنكي",
    date: "2024-01-12",
    status: "مكتمل",
    doctor: "د. علي حسن",
    discount: 20000,
    notes: "خصم كبار السن",
  },
  {
    id: 5,
    invoiceNumber: "INV-2024-005",
    patientName: "سارة أحمد علي",
    services: ["تقويم الأسنان"],
    totalAmount: 1800000,
    paidAmount: 600000,
    paymentMethod: "نقدي",
    date: "2024-01-11",
    status: "جزئي",
    doctor: "د. علي حسن",
    discount: 100000,
    notes: "خطة دفع شهرية",
  },
];

const Sales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "جزئي":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Timer className="w-3 h-3" />
            جزئي
          </span>
        );
      case "معلق":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            معلق
          </span>
        );
      default:
        return null;
    }
  };

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || sale.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = salesData.reduce((sum, sale) => sum + sale.paidAmount, 0);
  const totalPending = totalSales - totalPaid;
  const totalDiscount = salesData.reduce((sum, sale) => sum + sale.discount, 0);
  const avgSaleAmount = totalSales / salesData.length;

  const monthlySalesData = [
    { month: "يناير", sales: 5200000, transactions: 23 },
    { month: "فبراير", sales: 4800000, transactions: 19 },
    { month: "مارس", sales: 6100000, transactions: 28 },
    { month: "أبريل", sales: 5500000, transactions: 25 },
    { month: "مايو", sales: 6800000, transactions: 31 },
    { month: "يونيو", sales: 7200000, transactions: 34 },
  ];

  const topServices = [
    { name: "زراعة الأسنان", revenue: 2200000, count: 8 },
    { name: "تقويم الأسنان", revenue: 1800000, count: 12 },
    { name: "علاج الجذور", revenue: 1200000, count: 15 },
    { name: "تبييض الأسنان", revenue: 900000, count: 20 },
    { name: "تنظيف الأسنان", revenue: 600000, count: 35 },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المبيعات</h1>
              <p className="text-blue-100 text-lg mb-4">
                تتبع شامل للمبيعات والفواتير والأرباح
              </p>
              <p className="text-blue-100">
                إجمالي المبيعات: {(totalSales / 1000000).toFixed(1)}M د.ع |
                المحصل: {(totalPaid / 1000000).toFixed(1)}M د.ع
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير المبيعات
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                فاتورة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Overview - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Sales Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              نظرة عامة على المبيعات
            </h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {(totalSales / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-blue-700">
                إجمالي المبيعات
              </p>
              <p className="text-xs text-blue-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {(totalPaid / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-green-700">المحصل</p>
              <p className="text-xs text-green-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {(totalPending / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-red-700">المعلق</p>
              <p className="text-xs text-red-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {(avgSaleAmount / 1000).toFixed(0)}K
              </p>
              <p className="text-sm font-medium text-purple-700">
                متوسط الفاتورة
              </p>
              <p className="text-xs text-purple-600 mt-1">د.ع</p>
            </div>
          </div>

          {/* Monthly Sales Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              اتجاه المبيعات الشهرية
            </h4>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="grid grid-cols-6 gap-4 h-full">
                {monthlySalesData.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end space-y-2"
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {data.transactions}
                      </div>
                      <div
                        className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg w-8 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                        style={{ height: `${(data.sales / 8000000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 rotate-45 origin-bottom-left">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Services & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Top Services */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  أفضل الخدمات
                </h3>
                <p className="text-sm text-gray-600">حسب الإيرادات</p>
              </div>
            </div>

            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {service.count} معاملة
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {(service.revenue / 1000000).toFixed(1)}M د.ع
                    </p>
                    <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-yellow-500 h-1 rounded-full"
                        style={{
                          width: `${(service.revenue / 2200000) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
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
              <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-800">فاتورة جديدة</p>
                  <p className="text-sm text-blue-600">إنشاء فاتورة مبيعات</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-800">تسجيل دفعة</p>
                  <p className="text-sm text-green-600">تحصيل مستحقات</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all group">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-purple-800">تقرير المبيعات</p>
                  <p className="text-sm text-purple-600">تحليل شامل</p>
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
                placeholder="البحث في الفواتير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="جزئي">جزئي</option>
              <option value="معلق">معلق</option>
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذا العام</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">سجل المبيعات</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  رقم الفاتورة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  المريض
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  الخدمات
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  المبلغ الكلي
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  المدفوع
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  الطبيب
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sale.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.date).toLocaleDateString("ar-IQ")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.patientName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {sale.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {sale.totalAmount.toLocaleString()} د.ع
                    </p>
                    {sale.discount > 0 && (
                      <p className="text-xs text-red-600">
                        خصم: {sale.discount.toLocaleString()} د.ع
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-green-600">
                      {sale.paidAmount.toLocaleString()} د.ع
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.paymentMethod}
                    </p>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(sale.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {sale.doctor}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
