import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Users, Building, Package, BarChart3, Globe, MessageSquare, Stethoscope, Activity, Shield, Database, Bot, Map, ToggleLeft, ToggleRight, Save, Bell, Palette, Monitor, Smartphone, Languages, Mail, Phone, CreditCard, Lock, Key, Cloud, HardDrive, Cpu, RefreshCw, Download, Upload, FileText, Search, Filter, Plus, Edit, Trash2, Eye, EyeOff, GraduationCap, Store, MessageCircle, Briefcase, Crown } from "lucide-react";
import AdminTopNavbar from "@/components/AdminTopNavbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSystemSettings, type SystemSettings } from "@/contexts/SystemSettingsContext";
import { toast } from "sonner";

interface PlatformSection {
  id: keyof SystemSettings;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "platform" | "features";
}

const platformSections: PlatformSection[] = [
  {
    id: "community",
    name: "المجتمع الطبي",
    description: "منتديات ونقاشات المجتمع الطبي",
    icon: MessageCircle,
    category: "platform"
  },
  {
    id: "jobs",
    name: "الوظائف الطبية",
    description: "إعلانات الوظائف الطبية",
    icon: Briefcase,
    category: "platform"
  },
  {
    id: "medicalServices",
    name: "الخدمات الطبية",
    description: "خدمات التشخيص والاستشارات الطبية",
    icon: Stethoscope,
    category: "platform"
  },
  {
    id: "dentalSupply",
    name: "متجر المستلزمات",
    description: "متجر المعدات والمستلزمات الطبية",
    icon: Store,
    category: "platform"
  },
  {
    id: "education",
    name: "التعليم الطبي",
    description: "الدورات والمواد التعليمية",
    icon: GraduationCap,
    category: "platform"
  },
  {
    id: "articles",
    name: "المقالات",
    description: "المقالات والنصائح الطبية",
    icon: FileText,
    category: "features"
  },
  {
    id: "favorites",
    name: "المفضلة",
    description: "حفظ العناصر المفضلة",
    icon: Eye,
    category: "features"
  },
  {
    id: "cart",
    name: "سلة التسوق",
    description: "إدارة سلة التسوق",
    icon: Package,
    category: "features"
  }
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("sections");
  const [sectionsTab, setSectionsTab] = useState<"app-owner" | "system">("app-owner");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { settings, updateSetting, updateMultipleSettings } = useSystemSettings();

  const toggleSection = (sectionId: keyof SystemSettings) => {
    updateSetting(sectionId, !settings[sectionId]);
    toast.success(`تم ${settings[sectionId] ? 'إيقاف' : 'تفعيل'} ${platformSections.find(s => s.id === sectionId)?.name}`);
  };

  const saveAllSettings = () => {
    toast.success("تم حفظ جميع الإعدادات بنجاح");
  };

  const filteredSections = platformSections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "جميع الأقسام", count: platformSections.length },
    { id: "platform", name: "أقسام المنصة", count: platformSections.filter(s => s.category === "platform").length },
    { id: "features", name: "المميزات", count: platformSections.filter(s => s.category === "features").length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminTopNavbar />
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  إعدادات النظام
                </h1>
                <p className="text-sm text-gray-600">إدارة أقسام المنصة وإعدادات النظام</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to="/settings/maps">
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  <Map className="w-4 h-4 ml-1" />
                  إعدادات الخرائط
                </Button>
              </Link>
              <Link to="/settings/clinics">
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  <Building className="w-4 h-4 ml-1" />
                  إدارة العيادات
                </Button>
              </Link>
              <Link to="/settings/subscription-plans">
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  <Crown className="w-4 h-4 ml-1" />
                  خطط الاشتراك
                </Button>
              </Link>
              <Link to="/settings/clinic-settings">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Settings className="w-4 h-4 ml-1" />
                  إعدادات العيادة
                </Button>
              </Link>
              <Link to="/settings/subscription-management">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <CreditCard className="w-4 h-4 ml-1" />
                  إدارة الاشتراكات
                </Button>
              </Link>
              <Link to="/admin/platform-admin">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  إدارة المنصة
                </Button>
              </Link>
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  العودة للوحة التحكم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-6">
          <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 text-xs sm:text-sm">
              <TabsTrigger value="sections" className="text-xs sm:text-sm whitespace-nowrap">
                <Settings className="w-4 h-4 ml-2" />
                إدارة الأقسام
              </TabsTrigger>
              <TabsTrigger value="general" className="text-xs sm:text-sm whitespace-nowrap">
                <Globe className="w-4 h-4 ml-2" />
                عام
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs sm:text-sm whitespace-nowrap">
                <Palette className="w-4 h-4 ml-2" />
                المظهر
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs sm:text-sm whitespace-nowrap">
                <Database className="w-4 h-4 ml-2" />
                النظام
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  إدارة أقسام المنصة
                </CardTitle>
                <CardDescription>
                  تفعيل وإيقاف الأقسام والميزات في المنصة - التغييرات تحفظ تلقائياً
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={sectionsTab} onValueChange={(val) => setSectionsTab(val as "app-owner" | "system")}>
                  <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-2">
                      <TabsTrigger value="app-owner" className="whitespace-nowrap">
                        <Crown className="w-4 h-4 ml-2" />
                        إعدادات مالك التطبيق
                      </TabsTrigger>
                      <TabsTrigger value="system" className="whitespace-nowrap">
                        <Database className="w-4 h-4 ml-2" />
                        إدارة النظام
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="app-owner" className="space-y-6 mt-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="البحث في الأقسام..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name} ({category.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSections.map((section) => {
                        const Icon = section.icon;
                        const isEnabled = settings[section.id];
                        return (
                          <Card
                            key={section.id}
                            className={cn(
                              "transition-all duration-200",
                              isEnabled
                                ? "border-green-200 bg-green-50/50"
                                : "border-gray-200 bg-gray-50/50"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 sm:gap-3 flex-1">
                                  <div
                                    className={cn(
                                      "w-6 h-6 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
                                      isEnabled
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-400"
                                    )}
                                  >
                                    <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1 text-xs sm:text-sm">
                                      {section.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                                      {section.description}
                                    </p>
                                    <Badge
                                      variant={
                                        section.category === "platform"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {section.category === "platform" && "قسم منصة"}
                                      {section.category === "features" && "ميزة"}
                                    </Badge>
                                  </div>
                                </div>
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={() => toggleSection(section.id)}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">ملاحظة هامة</h4>
                          <p className="text-sm text-blue-700">
                            عند إيقاف قسم، سيتم إخفاؤه من القوائم والتنقل ولكن الروابط المباشرة ستظل تعمل. 
                            التغييرات تُحفظ تلقائياً في المتصفح.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="system" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">إعدادات النظام المتقدمة</CardTitle>
                        <CardDescription>
                          إدارة إعدادات النظام الأساسية والمتقدمة
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Label>وضع الصيانة</Label>
                            <p className="text-sm text-gray-600">تعطيل الموقع مؤقتاً للصيانة</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Label>التسجيل الجديد</Label>
                            <p className="text-sm text-gray-600">السماح بتسجيل مستخدمين جدد</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Label>التحقق من البريد الإلكتروني</Label>
                            <p className="text-sm text-gray-600">مطالبة المستخدمين بتأكيد بريدهم</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    إعدادات عامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">اسم المنصة</Label>
                    <Input id="site-name" defaultValue="منصة الأسنان الرقمية" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">وصف المنصة</Label>
                    <Textarea
                      id="site-description"
                      defaultValue="منصة شاملة للخدمات الطبية وإدارة العيادات"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                    <Input id="contact-email" type="email" defaultValue="info@dentalplatform.com" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    اللغة والمنطقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select defaultValue="asia/baghdad">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia/baghdad">Asia/Baghdad</SelectItem>
                        <SelectItem value="asia/riyadh">Asia/Riyadh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  إعدادات المظهر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الوضع الليلي</Label>
                    <p className="text-sm text-gray-600">تفعيل المظهر الداكن</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>اتجاه النص RTL</Label>
                    <p className="text-sm text-gray-600">من اليمين إلى اليسار</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    النسخ الاحتياطي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <p className="text-sm text-gray-600">جدولة النسخ الاحتياطي</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>تكرار النسخ</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومياً</SelectItem>
                        <SelectItem value="weekly">أسبوعياً</SelectItem>
                        <SelectItem value="monthly">شهرياً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    مراقبة الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام المعالج</span>
                      <span className="text-green-600">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام الذاكرة</span>
                      <span className="text-blue-600">62%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-8">
          <Button
            size="lg"
            onClick={saveAllSettings}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="w-5 h-5 mr-2" />
            حفظ جميع الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
}
