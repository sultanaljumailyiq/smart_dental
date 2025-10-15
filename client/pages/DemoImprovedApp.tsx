import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  Home,
  Briefcase,
  BookOpen,
  Bell,
  User,
  Search,
  Heart,
  ArrowRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// استيراد الصفحات المحسنة
import JobsNew from "./JobsNew";
import Education from "./Education";

// صفحة رئيسية بسيطة
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط علوي ثابت */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  منصة طب الأسنان
                </h1>
                <p className="text-xs text-gray-500">النسخة المحسنة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              منصة طب الأسنان المحسنة
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              تجربة محسنة للهاتف النقال مع أشرطة ثابتة وعرض أفقي للبطاقات
            </p>
          </div>

          {/* إحصائيات التحسينات */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">5x</div>
              <div className="text-sm text-blue-700">بطاقات في السطر</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">75%</div>
              <div className="text-sm text-green-700">تقليل التمرير</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                100%
              </div>
              <div className="text-sm text-purple-700">أشرطة ثابتة</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">2x</div>
              <div className="text-sm text-orange-700">سرعة التصفح</div>
            </div>
          </div>

          {/* البطاقات المحسنة */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              التحسينات الجديدة
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* قسم التوظيف */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      قسم التوظيف المحسن
                    </h3>
                    <p className="text-sm text-gray-600">
                      بطاقات أفقية مع خريطة تفاعلية
                    </p>
                  </div>
                </div>

                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• عرض 3-5 بطاقات في السطر الواحد</li>
                  <li>• أقسام أفقية في أعلى الصفحة</li>
                  <li>• صفحة عامة مع ملخصات سريعة</li>
                  <li>• خريطة تفاعلية للعيادات</li>
                  <li>• فلترة أفقية فوق العناصر</li>
                </ul>

                <Link
                  to="/jobs"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  استكشف التحسينات
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* قسم التطوير */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      قسم التطوير المتكامل
                    </h3>
                    <p className="text-sm text-gray-600">منصة تعليمية شاملة</p>
                  </div>
                </div>

                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• دورات تدريبية مع معاينة سريعة</li>
                  <li>• ندوات مباشرة وتفاعلية</li>
                  <li>• برامج شهادات معتمدة</li>
                  <li>• مكتبة كتب ومراجع</li>
                  <li>• تتبع التقدم الشخصي</li>
                </ul>

                <Link
                  to="/education"
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  اكتشف المنصة التعليمية
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ميزات التصميم الجديد */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">ميزات التصميم الجديد</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📱 صديق للهاتف النقال</h3>
                <p className="text-blue-100 text-sm">
                  تصميم محسن للهواتف مع عرض أفقي للبطاقات وتقليل الحاجة للتمرير
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🎯 أشرطة ثابتة</h3>
                <p className="text-blue-100 text-sm">
                  شريط علوي وسفلي ثابتين لا يتغيران عند التنقل بين الصفحات
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">⚡ تجربة سريعة</h3>
                <p className="text-blue-100 text-sm">
                  تحميل أسرع ومعلومات مضغوطة لفهم أسرع للمحتوى
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط سفلي ثابت */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            <button className="flex flex-col items-center p-2 text-blue-600">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">الرئيسية</span>
            </button>
            <Link
              to="/jobs"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs mt-1">الوظائف</span>
            </Link>
            <Link
              to="/education"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs mt-1">التطوير</span>
            </Link>
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
              <Bell className="w-5 h-5" />
              <span className="text-xs mt-1">الإشعارات</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">الملف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// التطبيق الرئيسي
export default function DemoImprovedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsNew />} />
        <Route path="/education" element={<Education />} />
      </Routes>
    </BrowserRouter>
  );
}
