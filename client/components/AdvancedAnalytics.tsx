import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Brain,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./LoadingIndicators";

interface AnalyticsData {
  userBehavior: {
    avgSessionTime: number;
    bounceRate: number;
    conversionRate: number;
    topPages: Array<{ page: string; views: number; conversionRate: number }>;
  };
  predictions: {
    nextMonthRevenue: number;
    inventoryNeeds: Array<{
      product: string;
      predictedDemand: number;
      currentStock: number;
    }>;
    customerChurn: { risk: "low" | "medium" | "high"; percentage: number };
  };
  insights: Array<{
    type: "opportunity" | "warning" | "success";
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    action?: string;
  }>;
}

const mockAnalytics: AnalyticsData = {
  userBehavior: {
    avgSessionTime: 8.5,
    bounceRate: 32.1,
    conversionRate: 4.8,
    topPages: [
      { page: "صفحة المنتجات", views: 15420, conversionRate: 6.2 },
      { page: "صفحة العروض", views: 12350, conversionRate: 8.9 },
      { page: "صفحة الموردين", views: 9800, conversionRate: 3.4 },
    ],
  },
  predictions: {
    nextMonthRevenue: 3250000,
    inventoryNeeds: [
      {
        product: "مادة التخدير الموضعي",
        predictedDemand: 120,
        currentStock: 85,
      },
      { product: "حشوة الكومبوزيت", predictedDemand: 65, currentStock: 45 },
      { product: "أدوات الفحص", predictedDemand: 95, currentStock: 110 },
    ],
    customerChurn: { risk: "low", percentage: 8.3 },
  },
  insights: [
    {
      type: "opportunity",
      title: "فرصة زيادة المبيعات",
      description:
        "منتجات التخدير تحقق معدل تحويل عالي - يُنصح بزيادة التسويق لها",
      impact: "high",
      action: "إنشاء حملة تسويقية مستهدفة",
    },
    {
      type: "warning",
      title: "تحذير نفاد المخزون",
      description:
        "من المتوقع نفاد حشوة الكومبوزيت خلال 10 أيام بناءً على معدل الاستهلاك",
      impact: "medium",
      action: "طلب مخزون إضافي فوراً",
    },
    {
      type: "success",
      title: "تحسن في معدل الاحتفاظ",
      description: "معدل الاحتفاظ بالعملاء تحسن بنسبة 15% هذا الشهر",
      impact: "high",
    },
  ],
};

interface AdvancedAnalyticsProps {
  className?: string;
}

export function AdvancedAnalytics({ className }: AdvancedAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [analytics] = useState<AnalyticsData>(mockAnalytics);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Eye className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={cn("space-y-6", className)} dir="rtl">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          التحليلات المتقدمة والذكاء الاصطناعي
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط وقت الجلسة</p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.userBehavior.avgSessionTime} دقيقة
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">معدل التحويل</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.userBehavior.conversionRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">معدل الارتداد</p>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.userBehavior.bounceRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">-5.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مخاطر فقدان العملاء</p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.predictions.customerChurn.percentage}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={cn(
                    "text-sm px-2 py-1 rounded-full",
                    analytics.predictions.customerChurn.risk === "low"
                      ? "bg-green-100 text-green-700"
                      : analytics.predictions.customerChurn.risk === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700",
                  )}
                >
                  {analytics.predictions.customerChurn.risk === "low" &&
                    "منخفض"}
                  {analytics.predictions.customerChurn.risk === "medium" &&
                    "متوسط"}
                  {analytics.predictions.customerChurn.risk === "high" &&
                    "عالي"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            رؤى الذكاء الاصطناعي
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl border",
                getInsightColor(insight.type),
              )}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        insight.impact === "high"
                          ? "bg-red-100 text-red-700"
                          : insight.impact === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700",
                      )}
                    >
                      تأثير{" "}
                      {insight.impact === "high"
                        ? "عالي"
                        : insight.impact === "medium"
                          ? "متوسط"
                          : "منخفض"}
                    </span>
                    {insight.action && (
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Prediction */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">التنبؤ بالإيرادات</h3>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(analytics.predictions.nextMonthRevenue)}
            </div>
            <p className="text-gray-600">الإيرادات المتوقعة للشهر القادم</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">الثقة في التنبؤ</span>
              <span className="font-medium">89%</span>
            </div>
            <ProgressBar progress={89} color="blue" showPercentage={false} />
          </div>
        </div>

        {/* Inventory Predictions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              التنبؤ باحتياجات المخزون
            </h3>
          </div>

          <div className="space-y-4">
            {analytics.predictions.inventoryNeeds.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.product}</h4>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      item.currentStock < item.predictedDemand
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700",
                    )}
                  >
                    {item.currentStock < item.predictedDemand
                      ? "نقص متوقع"
                      : "مخزون كافي"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">المخزون الحالي: </span>
                    <span className="font-medium">{item.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الطلب المتوقع: </span>
                    <span className="font-medium">{item.predictedDemand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">
          أداء الصفحات الرئيسية
        </h3>

        <div className="space-y-4">
          {analytics.userBehavior.topPages.map((page, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{page.page}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <span>المشاهدات: {page.views.toLocaleString()}</span>
                  <span>معدل التحويل: {page.conversionRate}%</span>
                </div>
                <ProgressBar
                  progress={page.conversionRate * 10}
                  color="blue"
                  className="mt-2"
                  showPercentage={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalytics;
