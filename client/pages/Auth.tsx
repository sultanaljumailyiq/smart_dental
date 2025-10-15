import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";
import { loginSchema, registerSchema, sanitizeText } from "@/utils/validation";
import { z } from "zod";

interface AuthProps {
  mode?: "signin" | "signup";
}

interface Province {
  id: number;
  nameAr: string;
  nameEn: string;
}

const Auth: React.FC<AuthProps> = ({ mode = "signin" }) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    province: "",
    role: UserRole.CUSTOMER
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/provinces');
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.provinces || []);
        }
      } catch (error) {
        console.error('خطأ في جلب المحافظات:', error);
      }
    };

    if (authMode === 'signup') {
      fetchProvinces();
    }
  }, [authMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeText(value)
    }));
  };

  // Role-based redirect helper
  const getRoleBasedRedirect = (role: UserRole | string): string => {
    // Handle new RBAC roles
    if (role === "app_owner" || role === "platform_admin") {
      return "/platform-admin";
    }
    if (role === "clinic_owner" || role === "dentist") {
      return "/dentist-hub";
    }
    if (role === "clinic_staff" || role === "clinic_employee" || role === "staff") {
      return "/clinic_old";
    }
    if (role === "supplier") {
      return "/supplier/dashboard";
    }
    
    // Handle old UserRole enum
    switch (role) {
      case UserRole.PLATFORM_ADMIN:
        return "/platform-admin";
      case UserRole.SUPPLIER:
        return "/supplier/dashboard";
      case UserRole.CUSTOMER:
        return "/";
      default:
        return "/";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "signin") {
        // Validate login data
        const validatedData = loginSchema.parse({
          email: formData.email,
          password: formData.password
        });

        await login(validatedData.email, validatedData.password);
        
        // Get user role from auth context after login
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          const redirectPath = getRoleBasedRedirect(user.role);
          navigate(redirectPath, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        // Validate province for dentists and suppliers
        if ((formData.role === UserRole.DENTIST || formData.role === UserRole.SUPPLIER) && !formData.province) {
          setError("يرجى اختيار المحافظة");
          setLoading(false);
          return;
        }

        // Validate registration data
        const validatedData = registerSchema.parse({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        });

        await register({
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name,
          arabicName: validatedData.name, // For now, same as name
          phone: validatedData.phone,
          province: formData.province,
          role: formData.role
        });
        
        // Role-based redirect after registration
        const redirectPath = getRoleBasedRedirect(formData.role);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {authMode === "signin" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </CardTitle>
          <CardDescription className="text-center">
            {authMode === "signin" 
              ? "أدخل بياناتك للوصول إلى حسابك" 
              : "املأ البيانات التالية لإنشاء حساب جديد"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {authMode === "signup" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="أدخل رقم هاتفك"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    نوع الحساب
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                  >
                    <SelectTrigger className="w-full" dir="rtl">
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value={UserRole.CUSTOMER}>عميل</SelectItem>
                      <SelectItem value={UserRole.DENTIST}>طبيب أسنان</SelectItem>
                      <SelectItem value={UserRole.SUPPLIER}>مورد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.role === UserRole.SUPPLIER || formData.role === UserRole.DENTIST) && (
                  <div className="space-y-2">
                    <label htmlFor="province" className="text-sm font-medium">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => handleInputChange("province", value)}
                      required
                    >
                      <SelectTrigger className="w-full" dir="rtl">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="اختر المحافظة" />
                        </div>
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.nameAr}>
                            {province.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? "جارٍ التحميل..." 
                : authMode === "signin" 
                  ? "تسجيل الدخول" 
                  : "إنشاء الحساب"
              }
            </Button>
          </form>

          <div className="text-center text-sm">
            {authMode === "signin" ? (
              <p>
                ليس لديك حساب؟{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => setAuthMode("signin")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;