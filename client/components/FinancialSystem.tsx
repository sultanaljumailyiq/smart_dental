import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Calculator,
  Wallet,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Filter,
  Search,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./LoadingIndicators";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string;
  reference?: string;
  tags: string[];
}

interface FinancialReport {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  growthRate: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    change: number;
  }[];
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "مبيعات المنتجات",
    description: "طلب #ORD-2024-001234 - د. أحمد محمد",
    amount: 125000,
    date: "2024-01-15",
    status: "completed",
    paymentMethod: "تحويل بنكي",
    reference: "TXN-001234",
    tags: ["مبيعات", "منتجات طبية"],
  },
  {
    id: "2",
    type: "expense",
    category: "مشتريات البضائع",
    description: "شراء مخزون مواد التخدير",
    amount: 75000,
    date: "2024-01-14",
    status: "completed",
    paymentMethod: "شيك",
    reference: "CHK-567890",
    tags: ["مشتريات", "مخزون"],
  },
  {
    id: "3",
    type: "expense",
    category: "المصاريف التشغيلية",
    description: "إيجار المخزن - يناير 2024",
    amount: 30000,
    date: "2024-01-01",
    status: "completed",
    paymentMethod: "نقدي",
    tags: ["إيجار", "مخزن"],
  },
];

const mockReport: FinancialReport = {
  period: "يناير 2024",
  revenue: 2850000,
  expenses: 1650000,
  profit: 1200000,
  profitMargin: 42.1,
  growthRate: 15.8,
  categories: [
    {
      name: "مبيعات المنتجات",
      amount: 2400000,
      percentage: 84.2,
      change: 12.5,
    },
    { name: "خدمات الاستشارة", amount: 300000, percentage: 10.5, change: 8.3 },
    { name: "رسوم الشحن", amount: 150000, percentage: 5.3, change: 22.1 },
  ],
};

interface FinancialSystemProps {
  className?: string;
}

export function FinancialSystem({ className }: FinancialSystemProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3 },
    { id: "transactions", label: "المعاملات", icon: Receipt },
    { id: "reports", label: "التقارير", icon: FileText },
    { id: "budgets", label: "الميزانيات", icon: Target },
    { id: "taxes", label: "الضرائب", icon: Calculator },
  ];

  return (
    <div className={cn("space-y-6", className)} dir="rtl">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+15.8%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">+8.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">صافي الربح</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(netProfit)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">+22.4%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">هامش الربح</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockReport.profitMargin}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600">+3.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 border-b-2 font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <Plus className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    إضافة إيراد
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                  <Minus className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    إضافة مصروف
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    إنشاء تقرير
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <Download className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    تصدير البيانات
                  </span>
                </button>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    تفصيل الإيرادات - {mockReport.period}
                  </h3>
                  <div className="space-y-3">
                    {mockReport.categories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              {category.name}
                            </h4>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(category.amount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {category.percentage}% من الإجمالي
                            </span>
                            <span
                              className={cn(
                                "flex items-center gap-1",
                                category.change > 0
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            >
                              {category.change > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {Math.abs(category.change)}%
                            </span>
                          </div>
                          <ProgressBar
                            progress={category.percentage}
                            color="blue"
                            className="mt-2"
                            showPercentage={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    الأهداف المالية
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">
                          هدف الإيرادات الشهرية
                        </span>
                        <span className="font-bold text-blue-900">
                          {formatCurrency(3000000)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                        <span>
                          المحقق: {formatCurrency(mockReport.revenue)}
                        </span>
                        <span>
                          {Math.round((mockReport.revenue / 3000000) * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        progress={(mockReport.revenue / 3000000) * 100}
                        color="blue"
                        showPercentage={false}
                      />
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">
                          هدف هامش الربح
                        </span>
                        <span className="font-bold text-green-900">45%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-green-700 mb-2">
                        <span>المحقق: {mockReport.profitMargin}%</span>
                        <span>
                          {Math.round((mockReport.profitMargin / 45) * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        progress={(mockReport.profitMargin / 45) * 100}
                        color="green"
                        showPercentage={false}
                      />
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">
                          هدف النمو السنوي
                        </span>
                        <span className="font-bold text-purple-900">20%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-purple-700 mb-2">
                        <span>المحقق: {mockReport.growthRate}%</span>
                        <span>
                          {Math.round((mockReport.growthRate / 20) * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        progress={(mockReport.growthRate / 20) * 100}
                        color="blue"
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في المعاملات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">جميع المعاملات</option>
                    <option value="income">الإيرادات</option>
                    <option value="expense">المصروفات</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    إضافة معاملة
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            transaction.type === "income"
                              ? "bg-green-100"
                              : "bg-red-100",
                          )}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-6 h-6 text-green-600" />
                          ) : (
                            <ArrowDownLeft className="w-6 h-6 text-red-600" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {transaction.description}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                          {transaction.reference && (
                            <div className="text-xs text-gray-500 mt-1">
                              المرجع: {transaction.reference}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-left">
                        <div
                          className={cn(
                            "text-xl font-bold mb-1",
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700",
                          )}
                        >
                          {transaction.status === "completed" && "مكتملة"}
                          {transaction.status === "pending" && "معلقة"}
                          {transaction.status === "cancelled" && "ملغية"}
                        </span>
                      </div>
                    </div>

                    {transaction.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        {transaction.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-right">
                  <FileText className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    تقرير الأرباح والخسائر
                  </h3>
                  <p className="text-sm text-gray-600">
                    تحليل مفصل للإيرادات والمصروفات
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-right">
                  <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    تقرير التدفقات النقدية
                  </h3>
                  <p className="text-sm text-gray-600">
                    متابعة حركة النقد الداخل والخارج
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-right">
                  <Calculator className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    تقرير الضرائب
                  </h3>
                  <p className="text-sm text-gray-600">
                    حساب الالتزامات الضريبية
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialSystem;
