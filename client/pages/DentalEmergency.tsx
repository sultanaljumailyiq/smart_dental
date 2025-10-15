import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Activity, Bandage, AlertTriangle, Phone, BookOpenCheck } from "lucide-react";

export default function DentalEmergency() {
  const topics = [
    { id: "pain", title: "ألم الأسنان الحاد", path: "/emergency/pain-management", icon: Activity, color: "red" },
    { id: "broken", title: "كسر أو تصدع السن", path: "/emergency/first-aid#fractures", icon: Bandage, color: "orange" },
    { id: "avulsed", title: "سقوط السن بالكامل", path: "/emergency/first-aid#tooth-avulsion", icon: AlertTriangle, color: "amber" },
    { id: "abscess", title: "خراج والتهاب شديد", path: "/emergency/first-aid#infection", icon: AlertTriangle, color: "rose" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/emergency" className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى الطوارئ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">طوارئ الأسنان</h1>
        </div>
        <p className="text-gray-600 mb-6">تعلم كيف تتصرف فورًا في حالات طوارئ الأسنان الشائعة. كل بطاقة تنقلك إلى الإرشادات التفصيلية.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.id} to={t.path} className="bg-white rounded-xl shadow-sm p-3 border hover:shadow-md transition-all">
                <div className={`w-8 h-8 rounded-lg bg-${t.color}-100 text-${t.color}-700 flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{t.title}</div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><BookOpenCheck className="w-5 h-5 text-orange-600" /> مصادر سريعة</h2>
          <div className="flex gap-2 flex-wrap">
            <Link to="/emergency/first-aid" className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm">دليل الإسعافات الأولية</Link>
            <Link to="/emergency/hospitals" className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm">المراكز القريبة</Link>
            <a href="tel:911" className="px-3 py-1.5 rounded-full bg-red-600 text-white text-sm flex items-center gap-1"><Phone className="w-4 h-4" /> 911</a>
          </div>
        </div>
      </div>
    </div>
  );
}
