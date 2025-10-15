import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SmartLandingHeader from "@/components/SmartLandingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/system";
import { toast } from "sonner";
import { usePlatformName } from "@/hooks/usePlatformName";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Crown,
  Zap,
} from "lucide-react";

export default function AdminAuthPage() {
  const navigate = useNavigate();
  const { platformName } = usePlatformName();
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ 
    email: "admin@platform.com", 
    password: "admin123" 
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demonstration: accept hardcoded admin credentials
      if (loginData.email === "admin@platform.com" && loginData.password === "admin123") {
        // Create admin user with all permissions
        const adminUser = {
          id: "platform-admin-" + Date.now(),
          email: loginData.email,
          name: "Platform Admin",
          arabicName: "مدير النظام",
          role: "admin" as UserRole,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "active" as const,
          isActive: true,
          phone: "07700000000",
        };

        // Save to localStorage
        localStorage.setItem("auth_token", "admin_token_" + Date.now());
        localStorage.setItem("user_data", JSON.stringify(adminUser));
        
        toast.success("تم تسجيل الدخول كمدير نظام بنجاح!");
        
        // Reload to apply auth state
        window.location.href = "/admin/dashboard";
      } else {
        toast.error("بيانات تسجيل الدخول غير صحيحة");
      }
    } catch (error) {
      toast.error("فشل تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <SmartLandingHeader type="dental" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 group"
            >
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              العودة للصفحة الرئيسية
            </Link>
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              تسجيل دخول مدير النظام
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              لوحة التحكم الكاملة لإدارة {platformName}
            </p>
          </div>

          <Card className="border-2 border-red-100 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50 border-b">
              <CardTitle className="text-2xl text-center text-red-900 flex items-center justify-center gap-3">
                <Crown className="w-6 h-6" />
                صلاحيات كاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="pr-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="admin@platform.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="pr-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg"
                >
                  {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول كمدير"}
                </Button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-900">صلاحيات المدير</h3>
                  </div>
                  <ul className="text-sm text-red-700 space-y-2 mr-8">
                    <li className="list-disc">تبديل بين جميع الأدوار (طبيب، مورد، مريض، مدير)</li>
                    <li className="list-disc">الوصول الكامل لجميع لوحات التحكم</li>
                    <li className="list-disc">إدارة المستخدمين والمحتوى والنظام</li>
                    <li className="list-disc">عرض وتحليل جميع البيانات</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-orange-800 text-center">
                    <strong>ملاحظة:</strong> بيانات تسجيل الدخول الافتراضية:
                    <br />
                    <code className="bg-orange-100 px-2 py-1 rounded mt-2 inline-block">
                      admin@platform.com / admin123
                    </code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              هل أنت مستخدم عادي؟{" "}
              <Link to="/dental-auth" className="text-red-600 hover:text-red-700 font-medium">
                تسجيل دخول أطباء الأسنان
              </Link>
              {" أو "}
              <Link to="/supplier-auth" className="text-red-600 hover:text-red-700 font-medium">
                تسجيل دخول الموردين
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
