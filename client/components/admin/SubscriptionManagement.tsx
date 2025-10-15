import React, { useState, useEffect } from "react";
import {
  subscriptionService,
  type SubscriptionPlan,
  type PromoCode,
  type ActivationRequest,
  type SubscriptionStats
} from "@/services/subscriptionService";
import {
  Crown,
  Tag,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Calendar,
  Percent,
  Gift,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<"plans" | "promos" | "activations" | "stats">("stats");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansData, promosData, activationsData, statsData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getPromoCodes(),
        subscriptionService.getActivationRequests(),
        subscriptionService.getSubscriptionStats()
      ]);
      setPlans(plansData);
      setPromoCodes(promosData);
      setActivationRequests(activationsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
    }
    setIsLoading(false);
  };

  const handleApproveActivation = async (id: string) => {
    try {
      await subscriptionService.approveActivationRequest(id, "admin");
      loadData();
    } catch (error) {
      console.error("Failed to approve activation:", error);
    }
  };

  const handleRejectActivation = async (id: string) => {
    try {
      await subscriptionService.rejectActivationRequest(id, "تم رفض الطلب");
      loadData();
    } catch (error) {
      console.error("Failed to reject activation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة الاشتراكات</h2>
        <p className="text-gray-600">إدارة خطط الاشتراك، أكواد الخصم، وطلبات التفعيل</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">إجمالي</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSubscriptions}</h3>
            <p className="text-sm text-gray-600 mt-1">إجمالي الاشتراكات</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">نشط</span>
            </div>
            <h3 className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</h3>
            <p className="text-sm text-gray-600 mt-1">اشتراكات نشطة</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">شهري</span>
            </div>
            <h3 className="text-2xl font-bold text-purple-600">
              {(stats.monthlyRevenue / 1000).toFixed(0)}K د.ع
            </h3>
            <p className="text-sm text-gray-600 mt-1">الإيرادات الشهرية</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">معلق</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingActivations}</h3>
            <p className="text-sm text-gray-600 mt-1">طلبات معلقة</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 flex gap-2">
        {[
          { id: "stats" as const, label: "الإحصائيات", icon: TrendingUp },
          { id: "plans" as const, label: "الخطط", icon: Crown },
          { id: "promos" as const, label: "أكواد الخصم", icon: Tag },
          { id: "activations" as const, label: "طلبات التفعيل", icon: CheckCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "stats" && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الاشتراكات المنتهية قريباً</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">هذا الأسبوع</span>
                <span className="text-2xl font-bold text-orange-600">{stats.expiringThisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">هذا الشهر</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.expiringThisMonth}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الإيرادات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">إجمالي الإيرادات</span>
                <span className="text-2xl font-bold text-green-600">
                  {(stats.totalRevenue / 1000).toFixed(0)}K د.ع
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الخطة الأكثر شعبية</span>
                <span className="text-sm font-medium text-blue-600">Premium Plan</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "plans" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.nameAr}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plan.descriptionAr}</p>
                </div>
                <Crown className={cn(
                  "w-8 h-8",
                  plan.type === "enterprise" ? "text-purple-600" :
                    plan.type === "premium" ? "text-blue-600" :
                      plan.type === "basic" ? "text-green-600" : "text-gray-600"
                )} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {plan.price === 0 ? "مجاني" : `${(plan.price / 1000).toFixed(0)}K د.ع`}
                <span className="text-sm font-normal text-gray-600">/{plan.duration} يوم</span>
              </div>
              <div className="space-y-2 mb-4">
                {plan.featuresAr.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "promos" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">أكواد الخصم</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              كود جديد
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الكود</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الخصم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاستخدام</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">صلاحية</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {promoCodes.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <span className="font-mono font-semibold text-gray-900">{promo.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : `${promo.discountValue.toLocaleString()} د.ع`
                      }
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {promo.currentUses} / {promo.maxUses}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {promo.validUntil}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        promo.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {promo.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "activations" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">طلبات التفعيل</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activationRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{request.clinicName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{request.planName}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    request.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      request.status === "approved" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                  )}>
                    {request.status === "pending" ? "معلق" :
                      request.status === "approved" ? "موافق عليه" : "مرفوض"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">السعر الأصلي:</span>
                    <span className="font-semibold text-gray-900 mr-2">
                      {request.originalPrice.toLocaleString()} د.ع
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">السعر النهائي:</span>
                    <span className="font-semibold text-green-600 mr-2">
                      {request.finalPrice.toLocaleString()} د.ع
                    </span>
                  </div>
                  {request.promoCode && (
                    <div>
                      <span className="text-gray-600">كود الخصم:</span>
                      <span className="font-mono font-semibold text-blue-600 mr-2">
                        {request.promoCode}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">تاريخ الطلب:</span>
                    <span className="text-gray-900 mr-2">
                      {new Date(request.requestedAt).toLocaleDateString('ar-IQ')}
                    </span>
                  </div>
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveActivation(request.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      موافقة
                    </button>
                    <button
                      onClick={() => handleRejectActivation(request.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      رفض
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
