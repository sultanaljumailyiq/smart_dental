import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRole } from "@shared/permissions";
import UnifiedNavigationHeader from "./UnifiedNavigationHeader";
import FixedBottomNavigation, { ProfileSidebar } from "./FixedBottomNavigation";
import PatientFriendlyArticlesSection from "./PatientFriendlyArticlesSection";
import EnhancedBookingSystem from "./EnhancedBookingSystem";

// صفحة رئيسية بسيطة
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            منصة طب الأسنان المتطورة
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نظام صلاحيات محدث، شريط علوي وسفلي ثابت، ونظام حجز محسن مع خريطة
            تفاعلية
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              نظام الصلاحيات الجديد
            </h3>
            <p className="text-gray-600 mb-4">
              صلاحيات محددة لكل نوع مستخدم مع إخفاء المحتوى غير المناسب للمرضى
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• مالك التطبيق - صلاحيات كاملة</li>
              <li>• مالك العيادة - إدارة العيادة والطاقم</li>
              <li>• المريض - الرئيسية والخدمات الطبية فقط</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              التن��ل الموحد
            </h3>
            <p className="text-gray-600 mb-4">
              شريط علوي وسفلي ثابت مع عناصر متسقة عبر جميع الصفحات
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• شريط علوي موحد وثابت</li>
              <li>• شريط سفلي مع مركز الأطباء</li>
              <li>• ملف شخصي مدموج مع قائمة جانبية</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              الميزات المحسنة
            </h3>
            <p className="text-gray-600 mb-4">
              نظام حجز متطور مع خريطة تفاعلية ومقالات محسنة للمرضى
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• نظام حجز مع تمييز الحجز أونلاين</li>
              <li>• خريطة تفاعلية للوظائف</li>
              <li>• مقالات بدون معلومات ناشر للمرضى</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// صفحة الخدمات الطبية
function MedicalServicesPage({ userRole }: { userRole: UserRole }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            الخدمات الطبية
          </h1>
          <p className="text-gray-600">احجز موعداً مع أفضل أطباء الأسنان</p>
        </div>

        <EnhancedBookingSystem />
      </div>
    </div>
  );
}

// صفحة مركز الأطباء
function DentistHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            مركز الأطباء
          </h1>
          <p className="text-gray-600">
            منصة شاملة لإدارة العيادة والتطوير المهني
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              إدارة العيادة
            </h3>
            <p className="text-gray-600">إدارة شاملة للعيادات والكادر الطبي</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              إدارة المرضى
            </h3>
            <p className="text-gray-600">
              نظام متكامل لمتابعة المرضى والمواعيد
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              التقارير والإحصائيات
            </h3>
            <p className="text-gray-600">تقارير مفصلة عن أداء العيادة</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// صفحة المقالات المحدثة
function ArticlesPage({ userRole }: { userRole: UserRole }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            المقالات الطبية
          </h1>
          <p className="text-gray-600">محتوى طبي موثوق ونصائح صحية متخصصة</p>
        </div>

        <PatientFriendlyArticlesSection userRole={userRole} />
      </div>
    </div>
  );
}

// مكون التطبيق الرئيسي المحدث
export default function UpdatedApp() {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("patient");
  const [currentUserName, setCurrentUserName] = useState("أحمد المريض");
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  // دالة لتبديل دور المستخدم (للاختبار)
  const switchUserRole = (role: UserRole) => {
    setCurrentUserRole(role);
    switch (role) {
      case "patient":
        setCurrentUserName("أحمد المريض");
        break;
      case "clinic_owner":
        setCurrentUserName("د. سارة العيادة");
        break;
      case "app_owner":
        setCurrentUserName("محمد المدير");
        break;
      default:
        setCurrentUserName("مستخدم");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* الشريط العلوي الثابت */}
        <UnifiedNavigationHeader
          userRole={currentUserRole}
          userName={currentUserName}
        />

        {/* شريط تبديل الأدوار للاختبار */}
        <div className="fixed top-20 left-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">
            تبديل الدور (للاختبار):
          </div>
          <div className="space-y-1">
            {[
              { role: "patient" as UserRole, label: "مريض" },
              { role: "clinic_owner" as UserRole, label: "مالك عيادة" },
              { role: "app_owner" as UserRole, label: "مالك التطبيق" },
            ].map(({ role, label }) => (
              <button
                key={role}
                onClick={() => switchUserRole(role)}
                className={`w-full text-left px-2 py-1 text-xs rounded ${
                  currentUserRole === role
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/medical-services"
              element={<MedicalServicesPage userRole={currentUserRole} />}
            />
            <Route path="/dentist-hub" element={<DentistHubPage />} />
            <Route
              path="/articles"
              element={<ArticlesPage userRole={currentUserRole} />}
            />
            <Route
              path="/profile"
              element={
                <div className="min-h-screen bg-gray-50 pt-20 pb-20 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      الملف الشخصي
                    </h1>
                    <p className="text-gray-600">
                      صفحة الملف الشخصي قيد التطوير
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* الشريط السفلي الثابت */}
        <FixedBottomNavigation
          userRole={currentUserRole}
          notificationCount={3}
        />

        {/* القائمة الجانبية للملف الشخصي */}
        <ProfileSidebar
          isOpen={showProfileSidebar}
          onClose={() => setShowProfileSidebar(false)}
          userRole={currentUserRole}
          userName={currentUserName}
        />
      </div>
    </BrowserRouter>
  );
}
