import { Navigate } from 'react-router-dom';
import { useStaffAuth } from '../contexts/StaffAuthContext';

interface ProtectedStaffRouteProps {
  children: React.ReactNode;
  requiredSection?: string;
}

export default function ProtectedStaffRoute({ children, requiredSection }: ProtectedStaffRouteProps) {
  const { staff, hasPermission, isLoading } = useStaffAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return <Navigate to="/staff/login" replace />;
  }

  if (requiredSection && !hasPermission(requiredSection)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50" dir="rtl">
        <div className="text-center max-w-lg p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">غير مصرح لك بالدخول</h2>
          <p className="text-lg text-gray-600 mb-6">ليس لديك صلاحية للوصول إلى هذا القسم</p>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">
              يرجى التواصل مع مدير النظام أو مالك العيادة للحصول على الصلاحيات المطلوبة
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
