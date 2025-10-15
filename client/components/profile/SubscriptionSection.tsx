import React, { useState, useEffect } from "react";
import {
  subscriptionService,
  type Subscription,
  type SubscriptionPlan
} from "@/services/subscriptionService";
import {
  Crown,
  CheckCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  RefreshCw,
  Star,
  Zap,
  Shield,
  Award,
  ArrowRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionSectionProps {
  clinicId: string;
  clinicName: string;
}

export default function SubscriptionSection({ clinicId, clinicName }: SubscriptionSectionProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, [clinicId]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      const [sub, plans] = await Promise.all([
        subscriptionService.getSubscriptionByClinicId(clinicId),
        subscriptionService.getPlans()
      ]);
      setSubscription(sub);
      setAllPlans(plans);
      if (sub) {
        const plan = await subscriptionService.getPlan(sub.planId);
        setCurrentPlan(plan);
      }
    } catch (error) {
      console.error("Failed to load subscription data:", error);
    }
    setIsLoading(false);
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diff = endDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Current Subscription Card */}
      {subscription && currentPlan ? (
        <div className={cn(
          "bg-gradient-to-br rounded-2xl p-6 text-white shadow-lg relative overflow-hidden",
          currentPlan.type === "enterprise" ? "from-purple-600 to-purple-800" :
          currentPlan.type === "premium" ? "from-blue-600 to-blue-800" :
          currentPlan.type === "basic" ? "from-green-600 to-green-800" :
          "from-gray-600 to-gray-800"
        )}>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">{currentPlan.nameAr}</h3>
                </div>
                <p className="text-white/80">{clinicName}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                subscription.status === "active" ? "bg-green-500/20 backdrop-blur-sm" :
                subscription.status === "expired" ? "bg-red-500/20 backdrop-blur-sm" :
                "bg-yellow-500/20 backdrop-blur-sm"
              )}>
                {subscription.status === "active" ? "نشط" :
                 subscription.status === "expired" ? "منتهي" :
                 subscription.status === "suspended" ? "موقوف" : "ملغي"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm text-white/80">تاريخ الانتهاء</span>
                </div>
                <p className="font-semibold">{new Date(subscription.endDate).toLocaleDateString('ar-IQ')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm text-white/80">الأيام المتبقية</span>
                </div>
                <p className={cn(
                  "font-semibold text-xl",
                  isExpired ? "text-red-300" :
                  isExpiringSoon ? "text-yellow-300" : ""
                )}>
                  {daysRemaining > 0 ? daysRemaining : 0} يوم
                </p>
              </div>
            </div>

            {isExpiringSoon && !isExpired && (
              <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">تحذير: اشتراكك ينتهي قريباً!</p>
                    <p className="text-sm text-white/90">
                      اشتراكك سينتهي خلال {daysRemaining} أيام. قم بالتجديد الآن لتجنب انقطاع الخدمة.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isExpired && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">انتهى اشتراكك!</p>
                    <p className="text-sm text-white/90">
                      اشتراكك انتهى. قم بالتجديد الآن لاستعادة الوصول الكامل لجميع الميزات.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                تجديد الاشتراك
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all">
                الترقية
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-bold mb-2">لا يوجد اشتراك نشط</h3>
            <p className="text-white/80 mb-6">اختر خطة مناسبة لعيادتك للبدء</p>
            <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 mx-auto">
              تصفح الخطط
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">الخطط المتاحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "border-2 rounded-xl p-4 transition-all cursor-pointer",
                currentPlan?.id === plan.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{plan.nameAr}</h4>
                  <p className="text-sm text-gray-600 mt-1">{plan.descriptionAr}</p>
                </div>
                {currentPlan?.id === plan.id && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-3">
                {plan.price === 0 ? "مجاني" : `${(plan.price / 1000).toFixed(0)}K د.ع`}
                <span className="text-sm font-normal text-gray-600">/شهر</span>
              </div>
              <div className="space-y-2">
                {plan.featuresAr.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {currentPlan?.id !== plan.id && (
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  اختر هذه الخطة
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Summary */}
      {currentPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">ميزات الخطة الحالية</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">الدعم</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.supportLevel === "dedicated" ? "مخصص" :
                   currentPlan.supportLevel === "priority" ? "أولوية" : "أساسي"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">العيادات</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.maxClinics === -1 ? "غير محدود" : currentPlan.maxClinics}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">AI</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.includeAI ? "مفعل" : "غير متاح"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">المختبر</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.includeLab ? "مفعل" : "غير متاح"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
