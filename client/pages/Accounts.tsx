import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart,
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Receipt,
  Calculator,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PatientQuickView, {
  PatientQuickInfo,
} from "@/components/PatientQuickView";

const accountData = [
  {
    id: 1,
    type: "income",
    category: "علاج جذور الأسنان",
    amount: 850000,
    description: "حشو جذور - مريض أحمد علي",
    date: "2024-01-15",
    method: "نقدي",
    status: "مكتمل",
    patientId: "P001",
    patientName: "أحمد علي محمد",
    doctor: "د. أحمد السعدي",
    invoiceNumber: "INV-2024-001",
  },
  {
    id: 2,
    type: "expense",
    category: "المعدات الطبية",
    amount: 450000,
    description: "شراء أدوات تنظيف الأسنان",
    date: "2024-01-14",
    method: "تحويل بنكي",
    status: "مكتمل",
    supplier: "شركة المستلزمات الطبية",
    invoiceNumber: "PUR-2024-001",
  },
  {
    id: 3,
    type: "income",
    category: "زراعة الأسنان",
    amount: 1200000,
    description: "زراعة أسنان - مريضة فاطمة حسن",
    date: "2024-01-13",
    method: "بطاقة ائتمان",
    status: "مكتمل",
    patientId: "P002",
    patientName: "فاطمة حسن علي",
    doctor: "د. سارة أحمد",
    invoiceNumber: "INV-2024-002",
  },
  {
    id: 4,
    type: "expense",
    category: "رواتب الموظفين",
    amount: 2500000,
    description: "راتب د. سارة أحمد - يناير 2024",
    date: "2024-01-01",
    method: "تحويل بنكي",
    status: "مكتمل",
    employeeName: "د. سارة أحمد",
    invoiceNumber: "SAL-2024-001",
  },
  {
    id: 5,
    type: "income",
    category: "تنظيف الأسنان",
    amount: 150000,
    description: "تنظيف أسنان دوري - مريض محمد خالد",
    date: "2024-01-12",
    method: "نقدي",
    status: "معلق",
    patientId: "P003",
    patientName: "محمد خالد حسين",
    doctor: "د. محمد صالح",
    invoiceNumber: "INV-2024-003",
  },
  {
    id: 6,
    type: "expense",
    category: "إيجار العيادة",
    amount: 800000,
    description: "إيجار العيادة - يناير 2024",
    date: "2024-01-01",
    method: "تحويل بنكي",
    status: "مكتمل",
    landlord: "شركة العقارات المتحدة",
    invoiceNumber: "RENT-2024-001",
  },
];

const doctorColor = (doctor?: string) => {
  switch (doctor) {
    case "د. سارة أحمد":
      return "text-purple-600";
    case "د. أحمد السعدي":
      return "text-blue-600";
    case "د. محمد صالح":
      return "text-emerald-600";
    default:
      return "text-gray-900";
  }
};

const Accounts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientQuickInfo | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "معلق":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            معلق
          </span>
        );
      case "ملغى":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            ملغى
          </span>
        );
      default:
        return null;
    }
  };

  const filteredAccounts = accountData.filter((account) => {
    const term = searchTerm.toLowerCase();
    const searchTarget =
      `${account.category} ${(account as any).patientName ?? ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(term);
    const matchesType = selectedType === "all" || account.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalIncome = accountData
    .filter((a) => a.type === "income")
    .reduce((sum, a) => sum + a.amount, 0);
  const totalExpenses = accountData
    .filter((a) => a.type === "expense")
    .reduce((sum, a) => sum + a.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin =
    totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  const monthlyData = [
    { month: "يناير", income: 3200000, expenses: 1750000 },
    { month: "فبراير", income: 2800000, expenses: 1600000 },
    { month: "مارس", income: 3500000, expenses: 1900000 },
    { month: "أبريل", income: 3100000, expenses: 1700000 },
    { month: "مايو", income: 3400000, expenses: 1800000 },
    { month: "يونيو", income: 3800000, expenses: 2000000 },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الحسابات</h1>
              <p className="text-green-100 text-lg mb-4">
                نظام شامل لإدارة الوضع المالي وتتبع الإيرادات والمصروفات
              </p>
              <p className="text-green-100">
                صافي الربح: {netProfit.toLocaleString()} د.ع ({profitMargin}%
                هامش ربح)
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير التقرير
              </button>
              <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                معاملة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Financial Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              نظرة مالية شاملة
            </h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {(totalIncome / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-green-700">
                إجمالي الإيرادات
              </p>
              <p className="text-xs text-green-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowDownRight className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {(totalExpenses / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-red-700">
                إجمالي المصروفات
              </p>
              <p className="text-xs text-red-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {(netProfit / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm font-medium text-blue-700">صافي الربح</p>
              <p className="text-xs text-blue-600 mt-1">د.ع</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {profitMargin}%
              </p>
              <p className="text-sm font-medium text-purple-700">هامش الربح</p>
              <p className="text-xs text-purple-600 mt-1">معدل العائد</p>
            </div>
          </div>

          {/* Monthly Comparison Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              مقارنة الإيرادات والمصروفات الشهرية
            </h4>
            <div className="h-48 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="grid grid-cols-6 gap-4 h-full">
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end space-y-2"
                  >
                    <div className="flex flex-col items-center space-y-1 w-full">
                      <div
                        className="bg-green-500 rounded-t-lg w-6 transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(data.income / 4000000) * 100}%` }}
                      ></div>
                      <div
                        className="bg-red-500 rounded-t-lg w-6 transition-all duration-300 hover:bg-red-600"
                        style={{
                          height: `${(data.expenses / 4000000) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 rotate-45 origin-bottom-left">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">الإيرادات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">المصروفات</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              إجراءات سريعة
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-800">إضافة إيراد</p>
                  <p className="text-sm text-green-600">تسجيل دخل جديد</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-800">إضافة مصروف</p>
                  <p className="text-sm text-red-600">تسجيل مصروف جديد</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-800">إنشاء تقرير</p>
                  <p className="text-sm text-blue-600">تقرير مالي شامل</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Methods Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">طرق الدفع</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    نقدي
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">60%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    بطاقة ائتمان
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">25%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    تحويل بنكي
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">15%</span>
              </div>
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
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">جميع المعاملات</option>
              <option value="income">الإيرادات</option>
              <option value="expense">المصروفات</option>
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذا العام</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">سجل المعاملات</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  التاريخ
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  اسم المريض
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  نوع العلاج
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  الحالة
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(account.date).toLocaleDateString("ar-IQ", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(account as any).patientName ? (
                      <button
                        onClick={() => {
                          const p: PatientQuickInfo = {
                            id: (account as any).patientId || "",
                            name: (account as any).patientName,
                            lastVisit: account.date,
                            recentTreatments: [
                              {
                                date: account.date,
                                treatment: account.category,
                              },
                            ],
                          };
                          setSelectedPatient(p);
                          setQuickViewOpen(true);
                        }}
                        className={cn(
                          "font-semibold hover:underline",
                          doctorColor((account as any).doctor),
                        )}
                        title={
                          (account as any).doctor
                            ? `الطبيب: ${(account as any).doctor}`
                            : undefined
                        }
                      >
                        {(account as any).patientName}
                      </button>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {account.category}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(account.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(account as any).patientName && (
                        <button
                          onClick={() => {
                            const p: PatientQuickInfo = {
                              id: (account as any).patientId || "",
                              name: (account as any).patientName,
                              lastVisit: account.date,
                              recentTreatments: [
                                {
                                  date: account.date,
                                  treatment: account.category,
                                },
                              ],
                            };
                            setSelectedPatient(p);
                            setQuickViewOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PatientQuickView
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Accounts;
