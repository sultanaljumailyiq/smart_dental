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

export default function TestPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
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
    setPaymentMethods(defaultPaymentMethods);
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">طرق الدفع المتاحة</h1>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">اختر طريقة الدفع</h2>
          
          <div className="grid gap-4">
            {paymentMethods.map((method) => {
              const Icon = getPaymentIcon(method.icon);
              return (
                <button
                  key={method.id}
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

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-900 text-sm">
              💡 <strong>ملاحظة:</strong> في صفحة الاشتراكات الفعلية، عليك اختيار الباقة أولاً ثم ستظهر طرق الدفع
            </p>
          </div>
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
