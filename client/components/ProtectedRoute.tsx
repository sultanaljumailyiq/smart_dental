import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "dentist" | "patient" | "supplier";
  adminOnly?: boolean;
  allowedRoles?: string[];
}

// Import the real authentication context
import { useAuth as useRealAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";

// Use the real authentication instead of mock
const useAuth = () => {
  const auth = useRealAuth();
  
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    hasRole: (role: string) => auth.user?.role === role,
    hasAnyRole: (roles: string[]) => roles.some(role => auth.user?.role === role),
    isAdmin: () => auth.user?.role === UserRole.PLATFORM_ADMIN,
  };
};

const AccessDenied: React.FC<{
  requiredRole?: string;
  userRole?: string;
  onGoBack?: () => void;
}> = ({ requiredRole, userRole, onGoBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mb-2">وصول مرفوض</h1>
          <p className="text-red-100">ليس لديك صلاحية للوصول لهذه الصفحة</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">
                  صلاحية غير كافية
                </h3>
                <p className="text-red-700 text-sm">
                  هذه الصفحة مخصصة{" "}
                  {requiredRole === "admin"
                    ? "لمديري النظام"
                    : "للمستخدمين المخولين"}{" "}
                  فقط
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المستوى الحالي:</span>
              <span className="font-medium text-gray-900">
                {userRole === "admin"
                  ? "مدير النظام"
                  : userRole === "dentist"
                    ? "طبيب أسنان"
                    : userRole === "supplier"
                      ? "مورد"
                      : "مريض"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المستوى المطلوب:</span>
              <span className="font-medium text-red-600">
                {requiredRole === "admin" ? "مدير النظام" : "مستخدم مخول"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onGoBack}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للصفحة السابقة
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              الذهاب للصفحة الرئيسية
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-600">
            إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بمدير النظام
          </p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  adminOnly = false,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user, hasRole, hasAnyRole, isAdmin } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check for admin-only routes
  if (adminOnly && !isAdmin()) {
    return (
      <AccessDenied
        requiredRole="admin"
        userRole={user.role}
        onGoBack={() => window.history.back()}
      />
    );
  }

  // Check for specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <AccessDenied
        requiredRole={requiredRole}
        userRole={user.role}
        onGoBack={() => window.history.back()}
      />
    );
  }

  // Check for allowed roles
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return (
      <AccessDenied
        requiredRole="authorized user"
        userRole={user.role}
        onGoBack={() => window.history.back()}
      />
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
export { useAuth };
