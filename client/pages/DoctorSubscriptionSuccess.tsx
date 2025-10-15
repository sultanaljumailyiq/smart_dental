import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Crown, Calendar, CreditCard, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function DoctorSubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Load subscription details
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await fetch("/api/doctor/current-subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        // Fallback: Read from URL params if API fails
        const planName = searchParams.get("plan") || searchParams.get("planName");
        const amount = searchParams.get("amount");
        const endDate = searchParams.get("endDate");
        const status = searchParams.get("status");
        
        if (planName || amount) {
          setSubscription({
            planName: planName || "اشتراك جديد",
            amount: amount ? parseFloat(amount) : 0,
            endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: status || "active"
          });
        }
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
      // Fallback: Read from URL params on network error
      const planName = searchParams.get("plan") || searchParams.get("planName");
      const amount = searchParams.get("amount");
      const endDate = searchParams.get("endDate");
      const status = searchParams.get("status");
      
      if (planName || amount) {
        setSubscription({
          planName: planName || "اشتراك جديد",
          amount: amount ? parseFloat(amount) : 0,
          endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: status || "active"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!subscription) return;
    
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة الاشتراك</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>فاتورة الاشتراك</h1>
            <p>المنصة العراقية لطب الأسنان</p>
          </div>
          <div class="details">
            <div class="row"><span>الخطة:</span><span>${subscription.planName || 'الخطة المميزة'}</span></div>
            <div class="row"><span>المبلغ:</span><span>${subscription.amount?.toLocaleString() || '0'} IQD</span></div>
            <div class="row"><span>تاريخ الاشتراك:</span><span>${new Date().toLocaleDateString('ar-IQ')}</span></div>
            <div class="row"><span>تاريخ الانتهاء:</span><span>${new Date(subscription.endDate).toLocaleDateString('ar-IQ')}</span></div>
            <div class="total">المجموع الكلي: ${subscription.amount?.toLocaleString() || '0'} IQD</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-6 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎉 تم الاشتراك بنجاح!
          </h1>
          <p className="text-lg text-gray-600">
            تهانينا! تم تفعيل اشتراكك بنجاح
          </p>
        </div>

        {/* Subscription Details Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">تفاصيل الاشتراك</h2>
              <p className="text-gray-600">معلومات خطتك الحالية</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">الخطة</span>
                </div>
                <span className="text-gray-900 font-bold">{subscription.planName || "الخطة المميزة"}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">المبلغ المدفوع</span>
                </div>
                <span className="text-gray-900 font-bold">
                  {subscription.amount?.toLocaleString() || "0"} IQD
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">صالح حتى</span>
                </div>
                <span className="text-gray-900 font-bold">
                  {subscription.endDate 
                    ? new Date(subscription.endDate).toLocaleDateString("ar-EG")
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("ar-EG")
                  }
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">الحالة</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {subscription.status === "completed" || subscription.status === "active" ? "مفعّل" : "قيد المراجعة"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">لا توجد بيانات اشتراك</p>
          )}
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">✨ المزايا المفعّلة الآن</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>ظهور عيادتك في الصفحة الرئيسية</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>أولوية في نتائج البحث</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>علامة "مميز" على بطاقة العيادة</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>تقارير وإحصائيات متقدمة</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="w-full py-6 text-lg"
          >
            <Download className="w-5 h-5 ml-2" />
            تحميل الفاتورة
          </Button>
          <Button
            onClick={() => navigate("/dentist-hub/clinics")}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            الذهاب لعياداتي
          </Button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">الخطوات التالية</h3>
          <p className="text-gray-700 text-sm">
            يمكنك الآن إدارة عياداتك والاستفادة من جميع المزايا المتقدمة
          </p>
        </div>
      </div>
    </div>
  );
}
