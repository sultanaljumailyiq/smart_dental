import React, { useState, useEffect } from "react";
import { Crown, Check, CreditCard, Wallet, Banknote, Smartphone, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface SubscriptionPlan {
  id: number;
  arabicName: string;
  arabicDescription: string;
  price: number;
  durationMonths: number;
  arabicFeatures: string[];
  canBePromoted: boolean;
  maxPriorityLevel: number;
}

interface PaymentMethod {
  id: number;
  arabicName: string;
  type: string;
  icon: string;
  arabicDescription: string;
  fees: number;
}

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/doctor/subscription/success",
      },
    });

    if (error) {
      toast.error(error.message || "فشلت عملية الدفع");
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      >
        {processing ? "جاري المعالجة..." : "إتمام الدفع"}
      </Button>
    </form>
  );
}

export default function DoctorSubscription() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"plans" | "payment" | "confirm">("plans");
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    loadPlans();
    loadPaymentMethods();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch("/api/subscription-plans?active=true");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        // Fallback to mock data if DB fails
        setPlans([
          {
            id: 1,
            arabicName: "الباقة الأساسية",
            arabicDescription: "مثالية للعيادات الصغيرة",
            price: 100000,
            durationMonths: 1,
            arabicFeatures: [
              "ظهور في نتائج البحث",
              "صفحة عيادة كاملة",
              "إحصائيات أساسية"
            ],
            canBePromoted: false,
            maxPriorityLevel: 0
          },
          {
            id: 2,
            arabicName: "الباقة المميزة",
            arabicDescription: "الأكثر شعبية للعيادات المتوسطة",
            price: 250000,
            durationMonths: 3,
            arabicFeatures: [
              "جميع مزايا الباقة الأساسية",
              "أولوية في البحث",
              "علامة 'مميز'",
              "تقارير متقدمة"
            ],
            canBePromoted: true,
            maxPriorityLevel: 5
          },
          {
            id: 3,
            arabicName: "الباقة الذهبية",
            arabicDescription: "للعيادات الكبرى والمراكز",
            price: 600000,
            durationMonths: 6,
            arabicFeatures: [
              "جميع مزايا الباقة المميزة",
              "ظهور في الصفحة الرئيسية",
              "أولوية قصوى (مستوى 10)",
              "دعم فني مخصص",
              "تحليلات شاملة"
            ],
            canBePromoted: true,
            maxPriorityLevel: 10
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error("تعذر تحميل الخطط، جاري استخدام البيانات التجريبية");
      // Fallback to mock data on network error
      setPlans([
        {
          id: 1,
          arabicName: "الباقة الأساسية",
          arabicDescription: "مثالية للعيادات الصغيرة",
          price: 100000,
          durationMonths: 1,
          arabicFeatures: [
            "ظهور في نتائج البحث",
            "صفحة عيادة كاملة",
            "إحصائيات أساسية"
          ],
          canBePromoted: false,
          maxPriorityLevel: 0
        },
        {
          id: 2,
          arabicName: "الباقة المميزة",
          arabicDescription: "الأكثر شعبية للعيادات المتوسطة",
          price: 250000,
          durationMonths: 3,
          arabicFeatures: [
            "جميع مزايا الباقة الأساسية",
            "أولوية في البحث",
            "علامة 'مميز'",
            "تقارير متقدمة"
          ],
          canBePromoted: true,
          maxPriorityLevel: 5
        },
        {
          id: 3,
          arabicName: "الباقة الذهبية",
          arabicDescription: "للعيادات الكبرى والمراكز",
          price: 600000,
          durationMonths: 6,
          arabicFeatures: [
            "جميع مزايا الباقة المميزة",
            "ظهور في الصفحة الرئيسية",
            "أولوية قصوى (مستوى 10)",
            "دعم فني مخصص",
            "تحليلات شاملة"
          ],
          canBePromoted: true,
          maxPriorityLevel: 10
        }
      ]);
    }
  };

  const loadPaymentMethods = async () => {
    // Set default payment methods immediately
    const defaultPaymentMethods = [
      {
        id: 1,
        arabicName: "بطاقة ائتمانية (Stripe)",
        type: "stripe",
        icon: "CreditCard",
        arabicDescription: "Visa, Mastercard, American Express",
        fees: 2.9
      },
      {
        id: 2,
        arabicName: "زين كاش",
        type: "zain_cash",
        icon: "Smartphone",
        arabicDescription: "الدفع عبر زين كاش",
        fees: 0
      },
      {
        id: 3,
        arabicName: "تحويل بنكي",
        type: "bank_transfer",
        icon: "Banknote",
        arabicDescription: "تحويل مباشر إلى الحساب البنكي",
        fees: 0
      },
      {
        id: 4,
        arabicName: "نقداً",
        type: "cash",
        icon: "Wallet",
        arabicDescription: "الدفع نقداً عند الزيارة",
        fees: 0
      }
    ];

    // Set default first to ensure UI is never empty
    setPaymentMethods(defaultPaymentMethods);

    // Then try to load from API
    try {
      const response = await fetch("/api/payment-methods?active=true");
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPaymentMethods(data);
        }
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
      // Default data already set above
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch("/api/doctor/current-subscription");
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep("payment");
  };

  const handlePaymentMethodSelect = async (method: string) => {
    setSelectedPaymentMethod(method);
    
    if (method === "stripe" && selectedPlan) {
      setLoading(true);
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlan.id,
            amount: selectedPlan.price,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setClientSecret(data.clientSecret);
          setStep("confirm");
        }
      } catch (error) {
        toast.error("فشل إنشاء طلب الدفع");
      } finally {
        setLoading(false);
      }
    } else {
      handleNonStripePayment(method);
    }
  };

  const handleNonStripePayment = async (method: string) => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const response = await fetch("/api/doctor/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethod: method,
        }),
      });

      if (response.ok) {
        toast.success("تم إنشاء طلب الاشتراك بنجاح");
        toast.info("سيتم تفعيل اشتراكك بعد تأكيد الدفع");
        loadCurrentSubscription();
        setStep("plans");
        setSelectedPlan(null);
      } else {
        toast.error("فشل إنشاء الاشتراك");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      CreditCard,
      Wallet,
      Banknote,
      Smartphone,
    };
    return icons[iconName] || CreditCard;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-6 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الاشتراكات والترويج</h1>
              <p className="text-gray-600">اختر الخطة المناسبة لعيادتك</p>
            </div>
          </div>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">اشتراكك الحالي</h3>
                <p className="text-purple-100">{currentSubscription.planName}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-purple-100">ينتهي في</p>
                <p className="text-lg font-bold">
                  {new Date(currentSubscription.endDate).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans Selection */}
        {step === "plans" && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-blue-900 text-center">
                💡 اختر الباقة المناسبة لعيادتك، ثم اختر طريقة الدفع المفضلة لديك
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.filter(plan => plan.price > 0).map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.arabicName}</h3>
                  {plan.canBePromoted && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>

                <p className="text-gray-600 mb-6">{plan.arabicDescription}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">IQD</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">لمدة {plan.durationMonths} شهر</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.arabicFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.canBePromoted && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-yellow-900">
                      <TrendingUp className="w-4 h-4 inline ml-1" />
                      أولوية عرض حتى مستوى {plan.maxPriorityLevel}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  اختر هذه الخطة
                </Button>
              </div>
            ))}
            </div>
          </>
        )}

        {/* Payment Method Selection */}
        {step === "payment" && selectedPlan && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">الخطة المختارة</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{selectedPlan.arabicName}</p>
                  <p className="text-sm text-gray-600">{selectedPlan.durationMonths} شهر</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedPlan.price.toLocaleString()} IQD
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">اختر طريقة الدفع</h3>
              
              <div className="grid gap-4">
                {paymentMethods.map((method) => {
                  const Icon = getPaymentIcon(method.icon);
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.type)}
                      disabled={loading}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{method.arabicName}</p>
                          <p className="text-sm text-gray-600">{method.arabicDescription}</p>
                        </div>
                      </div>
                      {method.fees > 0 && (
                        <span className="text-sm text-gray-600">رسوم: {method.fees}%</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => {
                  setStep("plans");
                  setSelectedPlan(null);
                }}
                variant="outline"
                className="w-full mt-4"
              >
                العودة للخطط
              </Button>
            </div>
          </div>
        )}

        {/* Stripe Payment Confirmation */}
        {step === "confirm" && clientSecret && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">إتمام الدفع</h3>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  onSuccess={() => {
                    toast.success("تم الدفع بنجاح!");
                    loadCurrentSubscription();
                    setStep("plans");
                    setSelectedPlan(null);
                    setClientSecret("");
                  }}
                />
              </Elements>

              <Button
                onClick={() => {
                  setStep("payment");
                  setClientSecret("");
                }}
                variant="outline"
                className="w-full mt-4"
              >
                العودة لطرق الدفع
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
