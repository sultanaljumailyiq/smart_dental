import React, { useState, useEffect } from "react";
import { 
  Crown, Check, CreditCard, Wallet, Banknote, Smartphone, Calendar, TrendingUp, 
  Tag, X, MapPin, Phone, Clock, Copy, QrCode, Building2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FALLBACK_SUBSCRIPTION_PLANS, FALLBACK_PAYMENT_METHODS } from "../../shared/fallbackData";

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

interface CashCenter {
  id: number;
  governorateArabic: string;
  centerNameArabic: string;
  addressArabic: string;
  phoneNumber: string;
  alternativePhone?: string;
  workingHoursArabic: string;
}

interface PaymentSettings {
  zainCashPhoneNumber: string;
  zainCashAccountName: string;
  zainCashQrCodeUrl: string;
  rafidainPhoneNumber: string;
  rafidainAccountName: string;
  rafidainQrCodeUrl: string;
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

export default function DoctorSubscriptionEnhanced() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"plans" | "payment" | "confirm">("plans");
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Zain Cash state
  const [zainCashTransferNumber, setZainCashTransferNumber] = useState("");
  const [zainCashTransferAmount, setZainCashTransferAmount] = useState("");
  const [zainCashSenderName, setZainCashSenderName] = useState("");
  const [zainCashTransferImage, setZainCashTransferImage] = useState<File | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  
  // Cash Agents payment state
  const [cashCenters, setCashCenters] = useState<CashCenter[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<CashCenter | null>(null);
  const [agentSenderName, setAgentSenderName] = useState("");
  const [agentPhoneNumber, setAgentPhoneNumber] = useState("");
  const [agentTransferAmount, setAgentTransferAmount] = useState("");
  const [agentOfficeName, setAgentOfficeName] = useState("");
  const [agentReceiptImage, setAgentReceiptImage] = useState<File | null>(null);
  
  // Rafidain payment state
  const [rafidainSenderName, setRafidainSenderName] = useState("");
  const [rafidainPhoneNumber, setRafidainPhoneNumber] = useState("");
  const [rafidainTransferNumber, setRafidainTransferNumber] = useState("");
  const [rafidainNotes, setRafidainNotes] = useState("");
  const [rafidainTransferImage, setRafidainTransferImage] = useState<File | null>(null);

  useEffect(() => {
    loadPlans();
    loadPaymentMethods();
    loadCurrentSubscription();
    loadPaymentSettings();
    loadCashCenters();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch("/api/subscription-plans?active=true");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        // Use shared fallback data
        const fallbackPlans = FALLBACK_SUBSCRIPTION_PLANS.map(plan => ({
          id: plan.id,
          arabicName: plan.arabicName,
          arabicDescription: plan.arabicDescription,
          price: plan.price,
          durationMonths: plan.durationMonths,
          arabicFeatures: plan.arabicFeatures,
          canBePromoted: plan.canBePromoted,
          maxPriorityLevel: plan.maxPriorityLevel
        }));
        setPlans(fallbackPlans);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      // Use shared fallback data on error
      const fallbackPlans = FALLBACK_SUBSCRIPTION_PLANS.map(plan => ({
        id: plan.id,
        arabicName: plan.arabicName,
        arabicDescription: plan.arabicDescription,
        price: plan.price,
        durationMonths: plan.durationMonths,
        arabicFeatures: plan.arabicFeatures,
        canBePromoted: plan.canBePromoted,
        maxPriorityLevel: plan.maxPriorityLevel
      }));
      setPlans(fallbackPlans);
    }
  };

  const loadPaymentMethods = async () => {
    // Set shared fallback payment methods immediately
    setPaymentMethods(FALLBACK_PAYMENT_METHODS);

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
      // Shared fallback data already set above
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

  const loadPaymentSettings = async () => {
    // Set default payment settings first
    const defaultSettings = {
      zainCashPhoneNumber: "07901234567",
      zainCashAccountName: "منصة الأسنان العراقية",
      zainCashQrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZAINCASH:07901234567",
      rafidainPhoneNumber: "07801234567",
      rafidainAccountName: "منصة الأسنان العراقية",
      rafidainQrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RAFIDAIN:07801234567"
    };
    setPaymentSettings(defaultSettings);

    try {
      const response = await fetch("/api/payment-settings");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPaymentSettings(data);
        }
      }
    } catch (error) {
      console.error("Error loading payment settings:", error);
      // Default data already set above
    }
  };

  const loadCashCenters = async () => {
    try {
      const response = await fetch("/api/cash-payment-centers");
      if (response.ok) {
        const data = await response.json();
        setCashCenters(data);
      }
    } catch (error) {
      console.error("Error loading cash centers:", error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("الرجاء إدخال رمز الكوبون");
      return;
    }

    setCouponLoading(true);
    
    // Fallback coupons (تعمل بدون قاعدة بيانات)
    const fallbackCoupons: { [key: string]: any } = {
      "TEST100": {
        code: "TEST100",
        discountType: "percentage",
        discountValue: 100,
        arabicDescription: "خصم 100% للتجربة"
      },
      "WELCOME50": {
        code: "WELCOME50",
        discountType: "percentage",
        discountValue: 50,
        arabicDescription: "خصم 50% ترحيبي"
      },
      "SAVE20": {
        code: "SAVE20",
        discountType: "percentage",
        discountValue: 20,
        arabicDescription: "خصم 20%"
      }
    };

    const upperCode = couponCode.toUpperCase();
    
    // Check fallback coupons first
    if (fallbackCoupons[upperCode]) {
      setCouponApplied(fallbackCoupons[upperCode]);
      toast.success(`تم تطبيق الكوبون! خصم ${fallbackCoupons[upperCode].discountValue}${fallbackCoupons[upperCode].discountType === 'percentage' ? '%' : ' د.ع'}`);
      setCouponLoading(false);
      return;
    }

    // Try API if fallback not found
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          planId: selectedPlan?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCouponApplied(data);
        toast.success(`تم تطبيق الكوبون! خصم ${data.discountValue}${data.discountType === 'percentage' ? '%' : ' د.ع'}`);
      } else {
        const error = await response.json();
        toast.error(error.message || "كوبون غير صالح");
      }
    } catch (error) {
      toast.error("كوبون غير صالح");
    } finally {
      setCouponLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0;
    
    let price = selectedPlan.price;
    
    if (couponApplied) {
      if (couponApplied.discountType === 'percentage') {
        price = price - (price * couponApplied.discountValue / 100);
      } else {
        price = price - couponApplied.discountValue;
      }
    }
    
    return Math.max(price, 0);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setCouponApplied(null);
    setCouponCode("");
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
            amount: calculateFinalPrice(),
            couponCode: couponApplied?.code
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
    } else if (method === "zain_cash") {
      setStep("confirm");
    } else if (method === "cash_agents") {
      setStep("confirm");
    } else if (method === "rafidain") {
      setStep("confirm");
    } else if (method === "bank_transfer") {
      setStep("confirm");
    }
  };

  const handleZainCashPayment = async () => {
    if (!zainCashSenderName || !zainCashTransferNumber || !zainCashTransferAmount) {
      toast.error("الرجاء إدخال جميع المعلومات المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("planId", String(selectedPlan?.id));
      formData.append("paymentMethod", "zain_cash");
      formData.append("senderName", zainCashSenderName);
      formData.append("zainCashTransferNumber", zainCashTransferNumber);
      formData.append("zainCashTransferAmount", zainCashTransferAmount);
      formData.append("amount", String(calculateFinalPrice()));
      if (couponApplied?.code) {
        formData.append("couponCode", couponApplied.code);
      }
      if (zainCashTransferImage) {
        formData.append("transferImage", zainCashTransferImage);
      }

      const response = await fetch("/api/doctor/subscribe", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("تم استلام طلب الاشتراك بنجاح!");
        toast.info("سيتم مراجعة طلبك وتفعيل اشتراكك خلال 24 ساعة");
        setTimeout(() => {
          window.location.href = "/doctor/subscription/success";
        }, 1500);
      } else {
        toast.error("فشل إرسال طلب الاشتراك");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  const handleCashAgentsPayment = async () => {
    // Check if agent exists in governorate
    const hasAgent = selectedCenter !== null;
    
    if (!hasAgent) {
      // Using money transfer offices
      if (!agentSenderName || !agentPhoneNumber || !agentTransferAmount || !agentOfficeName) {
        toast.error("الرجاء إدخال جميع المعلومات المطلوبة");
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("planId", String(selectedPlan?.id));
      formData.append("paymentMethod", "cash_agents");
      formData.append("amount", String(calculateFinalPrice()));
      
      if (hasAgent && selectedCenter) {
        formData.append("agentId", String(selectedCenter.id));
        formData.append("senderName", agentSenderName);
      } else {
        formData.append("senderName", agentSenderName);
        formData.append("phoneNumber", agentPhoneNumber);
        formData.append("transferAmount", agentTransferAmount);
        formData.append("officeName", agentOfficeName);
      }
      
      if (couponApplied?.code) {
        formData.append("couponCode", couponApplied.code);
      }
      if (agentReceiptImage) {
        formData.append("transferImage", agentReceiptImage);
      }

      const response = await fetch("/api/doctor/subscribe", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("تم استلام طلب الاشتراك بنجاح!");
        toast.info("سيتم مراجعة طلبك وتفعيل اشتراكك خلال 24 ساعة");
        setTimeout(() => {
          window.location.href = "/doctor/subscription/success";
        }, 1500);
      } else {
        toast.error("فشل إرسال طلب الاشتراك");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  const handleRafidainPayment = async () => {
    if (!rafidainSenderName || !rafidainPhoneNumber || !rafidainTransferNumber) {
      toast.error("الرجاء إدخال جميع المعلومات المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("planId", String(selectedPlan?.id));
      formData.append("paymentMethod", "rafidain");
      formData.append("senderName", rafidainSenderName);
      formData.append("phoneNumber", rafidainPhoneNumber);
      formData.append("rafidainTransferNumber", rafidainTransferNumber);
      formData.append("notes", rafidainNotes || "");
      formData.append("amount", String(calculateFinalPrice()));
      
      if (couponApplied?.code) {
        formData.append("couponCode", couponApplied.code);
      }
      if (rafidainTransferImage) {
        formData.append("transferImage", rafidainTransferImage);
      }

      const response = await fetch("/api/doctor/subscribe", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("تم استلام طلب الاشتراك بنجاح!");
        toast.info("سيتم مراجعة طلبك وتفعيل اشتراكك خلال 24 ساعة");
        setTimeout(() => {
          window.location.href = "/doctor/subscription/success";
        }, 1500);
      } else {
        toast.error("فشل إرسال طلب الاشتراك");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
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
      MapPin,
      Building2,
    };
    return icons[iconName] || CreditCard;
  };

  // قائمة المحافظات العراقية
  const IRAQI_GOVERNORATES = [
    "بغداد", "البصرة", "نينوى", "الأنبار", "أربيل", "كركوك", 
    "ديالى", "صلاح الدين", "النجف", "كربلاء", "ذي قار", 
    "القادسية", "بابل", "واسط", "ميسان", "المثنى", "دهوك", "السليمانية"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-6 px-4 md:px-6" dir="rtl">
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
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.arabicName}</h3>
                    <p className="text-gray-600 text-sm">{plan.arabicDescription}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-purple-600">
                      {(plan.price / 1000).toLocaleString('ar-EG')}
                    </span>
                    <span className="text-gray-600">ألف د.ع</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.durationMonths} {plan.durationMonths === 1 ? 'شهر' : plan.durationMonths === 6 ? 'أشهر' : 'شهر'}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.arabicFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  اختر هذه الباقة
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Payment Method Selection */}
        {step === "payment" && selectedPlan && (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setStep("plans");
                setSelectedPlan(null);
                setCouponApplied(null);
                setCouponCode("");
              }}
              className="mb-6"
            >
              ← العودة للباقات
            </Button>

            {/* Selected Plan Summary */}
            <div className="bg-white rounded-3xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">ملخص الباقة المختارة</h3>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedPlan.arabicName}</p>
                  <p className="text-sm text-gray-600">{selectedPlan.durationMonths} {selectedPlan.durationMonths === 1 ? 'شهر' : 'أشهر'}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-purple-600">
                    {(selectedPlan.price / 1000).toLocaleString('ar-EG')} ألف د.ع
                  </p>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  هل لديك كوبون خصم؟
                </label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="أدخل رمز الكوبون"
                    className="flex-1"
                    disabled={!!couponApplied}
                  />
                  {couponApplied ? (
                    <Button
                      onClick={() => {
                        setCouponApplied(null);
                        setCouponCode("");
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      {couponLoading ? "جاري التحقق..." : "تطبيق"}
                    </Button>
                  )}
                </div>
                
                {couponApplied && (
                  <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">
                        تم تطبيق خصم {couponApplied.discountValue}
                        {couponApplied.discountType === 'percentage' ? '%' : ' د.ع'}!
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      <div className="flex justify-between">
                        <span>السعر الأصلي:</span>
                        <span className="line-through">{(selectedPlan.price / 1000).toLocaleString('ar-EG')} ألف د.ع</span>
                      </div>
                      <div className="flex justify-between font-bold mt-1">
                        <span>السعر بعد الخصم:</span>
                        <span>{(calculateFinalPrice() / 1000).toLocaleString('ar-EG')} ألف د.ع</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">اختر طريقة الدفع</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = getPaymentIcon(method.icon);
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.type)}
                      className="border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-500 transition-all text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{method.arabicName}</p>
                          <p className="text-sm text-gray-600">{method.arabicDescription}</p>
                          {method.fees > 0 && (
                            <p className="text-xs text-orange-600 mt-1">رسوم: {method.fees}%</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {step === "confirm" && (
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setStep("payment")}
              className="mb-6"
            >
              ← العودة لطرق الدفع
            </Button>

            {selectedPaymentMethod === "stripe" && clientSecret && (
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4">إتمام الدفع</h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      toast.success("تم الدفع بنجاح!");
                      loadCurrentSubscription();
                      setStep("plans");
                    }}
                  />
                </Elements>
              </div>
            )}

            {selectedPaymentMethod === "zain_cash" && paymentSettings && (
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                  الدفع عبر زين كاش
                </h3>

                {/* Zain Cash Instructions */}
                <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-purple-900 mb-3">خطوات الدفع:</h4>
                  <ol className="space-y-2 text-purple-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>افتح تطبيق زين كاش</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>قم بتحويل المبلغ المطلوب إلى الرقم أدناه</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>أدخل رقم التحويل والمبلغ في النموذج</span>
                    </li>
                  </ol>
                </div>

                {/* Zain Cash Account Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border-2 border-purple-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">رقم الحساب</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paymentSettings.zainCashPhoneNumber);
                          toast.success("تم النسخ!");
                        }}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 font-mono direction-ltr text-right">
                      {paymentSettings.zainCashPhoneNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{paymentSettings.zainCashAccountName}</p>
                  </div>

                  {paymentSettings.zainCashQrCodeUrl && (
                    <div className="border-2 border-purple-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <QrCode className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">امسح رمز QR</p>
                      <img
                        src={paymentSettings.zainCashQrCodeUrl}
                        alt="QR Code"
                        className="w-32 h-32 rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* Transfer Details Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الراسل *
                    </label>
                    <Input
                      value={zainCashSenderName}
                      onChange={(e) => setZainCashSenderName(e.target.value)}
                      placeholder="أدخل اسمك كما هو في التحويل"
                      className="text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم التحويل *
                    </label>
                    <Input
                      value={zainCashTransferNumber}
                      onChange={(e) => setZainCashTransferNumber(e.target.value)}
                      placeholder="أدخل رقم التحويل من تطبيق زين كاش"
                      className="text-center direction-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      مبلغ التحويل (د.ع) *
                    </label>
                    <Input
                      type="number"
                      value={zainCashTransferAmount}
                      onChange={(e) => setZainCashTransferAmount(e.target.value)}
                      placeholder={calculateFinalPrice().toLocaleString('ar-EG')}
                      className="text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      المبلغ المطلوب: {calculateFinalPrice().toLocaleString('ar-EG')} د.ع
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      صورة إثبات التحويل (اختياري)
                    </label>
                    <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setZainCashTransferImage(file);
                            toast.success("تم اختيار الصورة");
                          }
                        }}
                        className="hidden"
                        id="transfer-image-upload"
                      />
                      <label htmlFor="transfer-image-upload" className="cursor-pointer">
                        {zainCashTransferImage ? (
                          <div className="space-y-2">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                            <p className="text-sm font-semibold text-green-700">
                              {zainCashTransferImage.name}
                            </p>
                            <p className="text-xs text-gray-500">انقر لتغيير الصورة</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Copy className="w-12 h-12 text-purple-400 mx-auto" />
                            <p className="text-sm font-semibold text-gray-700">
                              انقر لرفع صورة التحويل
                            </p>
                            <p className="text-xs text-gray-500">
                              يساعد في التحقق السريع من طلبك
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleZainCashPayment}
                  disabled={loading || !zainCashSenderName || !zainCashTransferNumber || !zainCashTransferAmount}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  {loading ? "جاري المعالجة..." : "تأكيد الدفع"}
                </Button>
              </div>
            )}

            {selectedPaymentMethod === "cash_agents" && (
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  وكلائنا بالمحافظات
                </h3>

                {/* Governorate Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    اختر المحافظة *
                  </label>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => {
                      setSelectedGovernorate(e.target.value);
                      setSelectedCenter(null);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-right bg-white"
                  >
                    <option value="">اختر المحافظة</option>
                    {IRAQI_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                {/* Agent Info or Transfer Form */}
                {selectedGovernorate && (
                  <>
                    {cashCenters.filter(c => c.governorateArabic === selectedGovernorate).length > 0 ? (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          اختر الوكيل
                        </label>
                        <div className="space-y-3">
                          {cashCenters
                            .filter(c => c.governorateArabic === selectedGovernorate)
                            .map((center) => (
                              <button
                                key={center.id}
                                onClick={() => setSelectedCenter(center)}
                                className={`w-full text-right border-2 rounded-2xl p-4 transition-all ${
                                  selectedCenter?.id === center.id
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    selectedCenter?.id === center.id ? 'bg-purple-600' : 'bg-gray-200'
                                  }`}>
                                    <MapPin className={`w-5 h-5 ${
                                      selectedCenter?.id === center.id ? 'text-white' : 'text-gray-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{center.centerNameArabic}</p>
                                    <p className="text-sm text-gray-600 mt-1">{center.addressArabic}</p>
                                    <div className="flex gap-4 mt-2">
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span className="direction-ltr">{center.phoneNumber}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                        {selectedCenter && (
                          <div className="mt-4">
                            <Input
                              value={agentSenderName}
                              onChange={(e) => setAgentSenderName(e.target.value)}
                              placeholder="أدخل اسمك"
                              className="text-center"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-amber-50 rounded-2xl p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                              لا يوجد وكيل في محافظتك. يمكنك استخدام الحوالات العادية من مكاتب الصيرفة وتزويدنا بمعلومات الحوالة
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم الراسل *
                          </label>
                          <Input
                            value={agentSenderName}
                            onChange={(e) => setAgentSenderName(e.target.value)}
                            placeholder="أدخل اسمك"
                            className="text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الهاتف *
                          </label>
                          <Input
                            value={agentPhoneNumber}
                            onChange={(e) => setAgentPhoneNumber(e.target.value)}
                            placeholder="07XX XXX XXXX"
                            className="text-center direction-ltr"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            المبلغ (د.ع) *
                          </label>
                          <Input
                            type="number"
                            value={agentTransferAmount}
                            onChange={(e) => setAgentTransferAmount(e.target.value)}
                            placeholder={calculateFinalPrice().toLocaleString('ar-EG')}
                            className="text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم مكتب الصيرفة *
                          </label>
                          <Input
                            value={agentOfficeName}
                            onChange={(e) => setAgentOfficeName(e.target.value)}
                            placeholder="اسم المكتب"
                            className="text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            إرفاق الوصل (اختياري)
                          </label>
                          <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setAgentReceiptImage(file);
                                  toast.success("تم اختيار الصورة");
                                }
                              }}
                              className="hidden"
                              id="agent-receipt-upload"
                            />
                            <label htmlFor="agent-receipt-upload" className="cursor-pointer">
                              {agentReceiptImage ? (
                                <div className="space-y-2">
                                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                                  <p className="text-sm font-semibold text-green-700">
                                    {agentReceiptImage.name}
                                  </p>
                                  <p className="text-xs text-gray-500">انقر لتغيير الصورة</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Copy className="w-12 h-12 text-purple-400 mx-auto" />
                                  <p className="text-sm font-semibold text-gray-700">
                                    انقر لرفع صورة الوصل
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Button
                  onClick={handleCashAgentsPayment}
                  disabled={loading || !selectedGovernorate}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-6"
                >
                  {loading ? "جاري المعالجة..." : "تأكيد الطلب"}
                </Button>
              </div>
            )}

            {selectedPaymentMethod === "bank_transfer" && (
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Banknote className="w-6 h-6 text-purple-600" />
                  التحويل البنكي
                </h3>

                {/* Bank Transfer Instructions */}
                <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-purple-900 mb-3">خطوات التحويل:</h4>
                  <ol className="space-y-2 text-purple-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>قم بالتحويل من حسابك البنكي إلى الحساب أدناه</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>احتفظ بإيصال التحويل</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>أدخل رقم المعاملة من الإيصال</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>سيتم التحقق وتفعيل الاشتراك خلال 24 ساعة</span>
                    </li>
                  </ol>
                </div>

                {/* Bank Account Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border-2 border-purple-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-2">اسم الحساب</p>
                    <p className="text-lg font-bold text-purple-600">منصة Smart للأسنان</p>
                  </div>
                  
                  <div className="border-2 border-purple-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">رقم الحساب</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("1234567890");
                          toast.success("تم نسخ رقم الحساب!");
                        }}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-purple-600 font-mono direction-ltr text-right">
                      1234567890
                    </p>
                  </div>

                  <div className="border-2 border-purple-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-2">اسم البنك</p>
                    <p className="text-lg font-bold text-purple-600">مصرف الرشيد</p>
                  </div>

                  <div className="border-2 border-purple-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-2">فرع البنك</p>
                    <p className="text-lg font-bold text-purple-600">بغداد - المنصور</p>
                  </div>
                </div>

                {/* Transfer Details Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم المعاملة *
                    </label>
                    <Input
                      placeholder="أدخل رقم المعاملة من إيصال التحويل"
                      className="text-center direction-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المبلغ المحول (د.ع) *
                    </label>
                    <Input
                      type="number"
                      placeholder={calculateFinalPrice().toLocaleString('ar-EG')}
                      className="text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      المبلغ المطلوب: {calculateFinalPrice().toLocaleString('ar-EG')} د.ع
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">ملاحظة مهمة:</p>
                      <p>سيتم التحقق من التحويل وتفعيل اشتراكك خلال 24 ساعة عمل. ستصلك رسالة تأكيد عبر البريد الإلكتروني.</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    toast.success("تم إرسال طلبك! سيتم التحقق خلال 24 ساعة");
                    setTimeout(() => {
                      window.location.href = "/doctor/subscription/success";
                    }, 1500);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  تأكيد الطلب
                </Button>
              </div>
            )}

            {selectedPaymentMethod === "rafidain" && paymentSettings && (
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  الدفع عبر الرافدين
                </h3>

                {/* Rafidain Instructions */}
                <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-emerald-900 mb-3">خطوات الدفع:</h4>
                  <ol className="space-y-2 text-emerald-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>افتح تطبيق الرافدين</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>قم بتحويل المبلغ المطلوب إلى الرقم أدناه</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>أدخل رقم التحويل والمعلومات المطلوبة</span>
                    </li>
                  </ol>
                </div>

                {/* Rafidain Account Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border-2 border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">رقم الحساب</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paymentSettings.rafidainPhoneNumber);
                          toast.success("تم النسخ!");
                        }}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 font-mono direction-ltr text-right">
                      {paymentSettings.rafidainPhoneNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{paymentSettings.rafidainAccountName}</p>
                  </div>

                  {paymentSettings.rafidainQrCodeUrl && (
                    <div className="border-2 border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <QrCode className="w-6 h-6 text-emerald-600 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">امسح رمز QR</p>
                      <img
                        src={paymentSettings.rafidainQrCodeUrl}
                        alt="QR Code"
                        className="w-32 h-32 rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* Transfer Details Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الاسم *
                    </label>
                    <Input
                      value={rafidainSenderName}
                      onChange={(e) => setRafidainSenderName(e.target.value)}
                      placeholder="أدخل اسمك كما هو في التحويل"
                      className="text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <Input
                      value={rafidainPhoneNumber}
                      onChange={(e) => setRafidainPhoneNumber(e.target.value)}
                      placeholder="07XX XXX XXXX"
                      className="text-center direction-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم التحويل *
                    </label>
                    <Input
                      value={rafidainTransferNumber}
                      onChange={(e) => setRafidainTransferNumber(e.target.value)}
                      placeholder="أدخل رقم التحويل من تطبيق الرافدين"
                      className="text-center direction-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات (اختياري)
                    </label>
                    <Input
                      value={rafidainNotes}
                      onChange={(e) => setRafidainNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية"
                      className="text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      صورة إثبات التحويل (اختياري)
                    </label>
                    <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setRafidainTransferImage(file);
                            toast.success("تم اختيار الصورة");
                          }
                        }}
                        className="hidden"
                        id="rafidain-image-upload"
                      />
                      <label htmlFor="rafidain-image-upload" className="cursor-pointer">
                        {rafidainTransferImage ? (
                          <div className="space-y-2">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                            <p className="text-sm font-semibold text-green-700">
                              {rafidainTransferImage.name}
                            </p>
                            <p className="text-xs text-gray-500">انقر لتغيير الصورة</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Copy className="w-12 h-12 text-emerald-400 mx-auto" />
                            <p className="text-sm font-semibold text-gray-700">
                              انقر لرفع صورة التحويل
                            </p>
                            <p className="text-xs text-gray-500">
                              يساعد في التحقق السريع من طلبك
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRafidainPayment}
                  disabled={loading || !rafidainSenderName || !rafidainPhoneNumber || !rafidainTransferNumber}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                >
                  {loading ? "جاري المعالجة..." : "تأكيد الدفع"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
