import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Pill, IceCream2, Phone, Shield, Clock } from "lucide-react";

export default function PainManagement() {
  const steps = [
    { icon: IceCream2, title: "كمادات باردة", desc: "ضع كمادات باردة خارج الخد لمدة 10 دقائق لتخفيف ��لتورم." },
    { icon: Pill, title: "مسكن مناسب", desc: "تناول مسكن ألم آمن مثل الإيبوبروفين وفق الإرشادات، وتجنب وضع الأقراص على اللثة." },
    { icon: Shield, title: "نظافة لطيفة", desc: "اغسل الفم بماء فاتر وملح برفق، واستخدم الخيط لإزالة بقايا الطعام." },
    { icon: Clock, title: "احجز موعد", desc: "إذا استمر الألم أو ازداد، احجز موعداً عاجلاً لدى طبيب الأسنان." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/emergency" className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى الطوارئ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة ألم الأسنان</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon; 
            return (
              <div key={i} className="bg-white rounded-xl shadow-md p-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-3">متى تتصل بالطوارئ؟</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>ألم شديد لا يتحسن بالمسكنات</li>
            <li>تورم في الوجه أو صعوبة في البلع/التنفس</li>
            <li>حمى مع ألم الأسنان</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="tel:911" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold text-center">اتصال بالطوارئ 911</a>
            <Link to="/medical-services" className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold text-center">احجز موعداً قريباً</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
