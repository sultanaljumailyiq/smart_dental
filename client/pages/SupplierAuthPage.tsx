import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SmartLandingHeader from "@/components/SmartLandingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";
import { toast } from "sonner";
import { usePlatformName } from "@/hooks/usePlatformName";
import {
  Package,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Star,
  ShieldCheck,
  TrendingUp,
  Building2,
  MapPin,
} from "lucide-react";

// قائمة المحافظات العراقية - 18 محافظة
const IRAQI_PROVINCES = [
  { nameEn: "Baghdad", nameAr: "بغداد" },
  { nameEn: "Babil", nameAr: "بابل" },
  { nameEn: "Karbala", nameAr: "كربلاء" },
  { nameEn: "Wasit", nameAr: "واسط" },
  { nameEn: "Najaf", nameAr: "النجف" },
  { nameEn: "Qadisiyyah", nameAr: "القادسية" },
  { nameEn: "Basra", nameAr: "البصرة" },
  { nameEn: "Dhi Qar", nameAr: "ذي قار" },
  { nameEn: "Maysan", nameAr: "ميسان" },
  { nameEn: "Muthanna", nameAr: "المثنى" },
  { nameEn: "Nineveh", nameAr: "نينوى" },
  { nameEn: "Erbil", nameAr: "أربيل" },
  { nameEn: "Dohuk", nameAr: "دهوك" },
  { nameEn: "Sulaymaniyah", nameAr: "السليمانية" },
  { nameEn: "Kirkuk", nameAr: "كركوك" },
  { nameEn: "Salah al-Din", nameAr: "صلاح الدين" },
  { nameEn: "Anbar", nameAr: "الأنبار" },
  { nameEn: "Diyala", nameAr: "ديالى" },
];

export default function SupplierAuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { platformName } = usePlatformName();
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    arabicName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    province: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/supplier/dashboard");
    } catch (error) {
      toast.error("فشل تسجيل الدخول. تحقق من البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من اختيار المحافظة
    if (!registerData.province) {
      toast.error("يرجى اختيار المحافظة");
      return;
    }
    
    setIsLoading(true);
    try {
      await register({
        ...registerData,
        role: UserRole.SUPPLIER,
      });
      toast.success("تم إنشاء الحساب بنجاح! سيتم مراجعته قريباً.");
      navigate("/supplier/dashboard");
    } catch (error) {
      toast.error("فشل إنشاء الحساب. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Create a demo supplier user
    const demoUser = {
      id: "demo-supplier-" + Date.now(),
      email: "demo@supplier.com",
      name: "Demo Supplier",
      arabicName: "مورد تجريبي",
      role: UserRole.SUPPLIER,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active" as const,
      isActive: true,
      phone: "07700000000",
      province: "Baghdad",
      companyName: "Demo Medical Supplies",
    };

    // Save to localStorage
    localStorage.setItem("auth_token", "demo_supplier_token_" + Date.now());
    localStorage.setItem("user_data", JSON.stringify(demoUser));
    
    toast.success("جاري الدخول بحساب تجريبي...");
    
    // Reload to apply auth state
    window.location.href = "/supplier/dashboard";
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <SmartLandingHeader type="supplier" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="space-y-8">
              <div>
                <Link 
                  to="/supplier" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
                >
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  العودة للصفحة الرئيسية
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
                  انضم إلى {platformName}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  ابدأ البيع لآلاف أطباء الأسنان في العراق اليوم
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">زيادة مبيعاتك 60%</h3>
                    <p className="text-gray-600 text-sm">وصول مباشر لأكبر قاعدة عملاء</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">إدارة سهلة وسريعة</h3>
                    <p className="text-gray-600 text-sm">أضف منتجاتك وابدأ البيع فوراً</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">دفع آمن ومضمون</h3>
                    <p className="text-gray-600 text-sm">نظام دفع موثوق بطرق عراقية</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-100 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-6 w-6 text-blue-600" />
                  <h3 className="font-bold text-blue-900">انضم مجاناً</h3>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  ابدأ بدون رسوم، ادفع فقط عند البيع. رسوم تنافسية وشفافة.
                </p>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <Card className="shadow-2xl border-none">
              <CardHeader className="text-center pb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">حساب المورد</CardTitle>
                <CardDescription>سجل دخولك أو أنشئ حساب جديد</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                    <TabsTrigger value="register">حساب جديد</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            required
                            className="pr-10"
                            placeholder="supplier@example.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="login-password">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            required
                            className="pr-10"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري التسجيل..." : "تسجيل الدخول"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">اسم الشركة</Label>
                        <div className="relative">
                          <Building2 className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="companyName"
                            required
                            className="pr-10"
                            placeholder="شركة المستلزمات الطبية"
                            value={registerData.companyName}
                            onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name">اسم المسؤول (إنجليزي)</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            required
                            className="pr-10"
                            placeholder="Ahmed Ali"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="arabicName">اسم المسؤول (عربي)</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="arabicName"
                            required
                            className="pr-10"
                            placeholder="أحمد علي"
                            value={registerData.arabicName}
                            onChange={(e) => setRegisterData({ ...registerData, arabicName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            required
                            className="pr-10"
                            placeholder="supplier@example.com"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            required
                            className="pr-10"
                            placeholder="+964 750 123 4567"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="province">المحافظة <span className="text-red-500">*</span></Label>
                        <Select
                          value={registerData.province}
                          onValueChange={(value) => setRegisterData({ ...registerData, province: value })}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <SelectValue placeholder="اختر المحافظة" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {IRAQI_PROVINCES.map((province) => (
                              <SelectItem key={province.nameEn} value={province.nameEn}>
                                {province.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="password">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            required
                            className="pr-10"
                            placeholder="••••••••"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                        <p className="text-yellow-800 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          سيتم مراجعة حسابك من قبل الإدارة خلال 24 ساعة
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 hover:bg-blue-50" 
                    onClick={handleDemoLogin}
                  >
                    <Star className="ml-2 h-5 w-5 text-yellow-500" />
                    دخول تجريبي سريع
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    استكشف لوحة التحكم بدون تسجيل
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
