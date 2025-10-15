import React, { useState, useEffect } from "react";
import { CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";

interface PaymentMethod {
  id: number;
  arabicName: string;
  type: string;
  icon: string;
  arabicDescription: string;
  fees: number;
}

export default function TestPaymentStep() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">اختبار خطوة الدفع</h1>
        <p className="text-center text-gray-600 mb-8">عدد طرق الدفع المحملة: {paymentMethods.length}</p>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4">اختر طريقة الدفع</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const Icon = getPaymentIcon(method.icon);
              return (
                <button
                  key={method.id}
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
          
          {paymentMethods.length === 0 && (
            <div className="text-center text-red-600 mt-4">
              ⚠️ لا توجد طرق دفع! البيانات الاحتياطية لم تُحمّل!
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/doctor/subscription" className="text-purple-600 hover:underline">
            ← العودة لصفحة الاشتراكات
          </a>
        </div>
      </div>
    </div>
  );
}
