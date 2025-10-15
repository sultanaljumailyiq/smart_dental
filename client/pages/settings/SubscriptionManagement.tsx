import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Gift, 
  Ticket, 
  Users, 
  Headphones, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Calendar,
  TrendingUp,
  Brain,
  Bell,
  DollarSign,
  FileCheck,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminTopNavbar from "@/components/AdminTopNavbar";
import PlansManagement from "@/components/subscription/PlansManagement";
import PaymentMethodsManagement from "@/components/subscription/PaymentMethodsManagement";

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState("plans");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الاشتراكات والخطط</h1>
          <p className="text-gray-600">نظام شامل لإدارة الاشتراكات والعروض والقسائم</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-8 bg-white border shadow-sm h-auto p-2 gap-2">
            <TabsTrigger value="plans" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">الخطط</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white" onClick={() => navigate("/settings/subscription-requests")}>
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">طلبات الاشتراك</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white" onClick={() => navigate("/settings/cash-agents")}>
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">الوكلاء</span>
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">طرق الدفع</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">العروض</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">القسائم</span>
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">المشتركون</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">الدعم</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">التقارير</span>
            </TabsTrigger>
          </TabsList>

          {/* الخطط */}
          <TabsContent value="plans" className="space-y-6">
            <PlansManagement />
          </TabsContent>

          {/* طرق الدفع */}
          <TabsContent value="payment-methods" className="space-y-6">
            <PaymentMethodsManagement />
          </TabsContent>

          {/* العروض والتخفيضات */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">العروض والتخفيضات</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة عرض جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إنشاء عرض ترويجي جديد</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم العرض</Label>
                        <Input placeholder="عرض العيد" />
                      </div>
                      <div className="space-y-2">
                        <Label>نسبة الخصم (%)</Label>
                        <Input type="number" placeholder="20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>تاريخ البداية</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>تاريخ الانتهاء</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>الخطط المشمولة</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الخطط" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الخطط</SelectItem>
                          <SelectItem value="basic">الأساسية</SelectItem>
                          <SelectItem value="pro">الاحترافية</SelectItem>
                          <SelectItem value="premium">المتميزة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">إنشاء العرض</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم العرض</TableHead>
                      <TableHead className="text-right">الخصم</TableHead>
                      <TableHead className="text-right">الفترة</TableHead>
                      <TableHead className="text-right">المستخدمون</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">عرض رمضان 2025</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>01/03/2025 - 30/03/2025</TableCell>
                      <TableCell>143 مستخدم</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">نشط</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">عرض العودة للعيادة</TableCell>
                      <TableCell>15%</TableCell>
                      <TableCell>01/01/2025 - 31/01/2025</TableCell>
                      <TableCell>87 مستخدم</TableCell>
                      <TableCell>
                        <Badge variant="secondary">منتهي</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* القسائم */}
          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">إدارة القسائم</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    إنشاء قسيمة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إنشاء قسيمة خصم جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>كود القسيمة</Label>
                        <div className="flex gap-2">
                          <Input placeholder="WELCOME2025" />
                          <Button variant="outline" size="icon">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>نوع الخصم</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">نسبة مئوية</SelectItem>
                            <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>قيمة الخصم</Label>
                        <Input type="number" placeholder="20" />
                      </div>
                      <div className="space-y-2">
                        <Label>الحد الأقصى للاستخدام</Label>
                        <Input type="number" placeholder="100" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>تاريخ الانتهاء</Label>
                      <Input type="date" />
                    </div>
                    <Button className="w-full">إنشاء القسيمة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">إجمالي القسائم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-gray-500">12 نشطة، 12 منتهية</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">مرات الاستخدام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-gray-500">+18% هذا الشهر</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">مستخدمون فريدون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-gray-500">من 1,247 استخدام</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">الخصم</TableHead>
                      <TableHead className="text-right">الاستخدام</TableHead>
                      <TableHead className="text-right">المستخدمون</TableHead>
                      <TableHead className="text-right">الانتهاء</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono font-bold">WELCOME2025</TableCell>
                      <TableCell>30%</TableCell>
                      <TableCell>67/100</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          عرض (67 مستخدم)
                        </Button>
                      </TableCell>
                      <TableCell>31/12/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">نشطة</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">RAMADAN25</TableCell>
                      <TableCell>25%</TableCell>
                      <TableCell>143/200</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          عرض (143 مستخدم)
                        </Button>
                      </TableCell>
                      <TableCell>30/03/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">نشطة</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">FIRST50</TableCell>
                      <TableCell>50,000 د.ع</TableCell>
                      <TableCell>50/50</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          عرض (50 مستخدم)
                        </Button>
                      </TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>
                        <Badge variant="secondary">منتهية</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* المشتركون */}
          <TabsContent value="subscribers" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">الحسابات المشتركة</h2>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الخطط</SelectItem>
                    <SelectItem value="free">المجانية</SelectItem>
                    <SelectItem value="basic">الأساسية</SelectItem>
                    <SelectItem value="pro">الاحترافية</SelectItem>
                    <SelectItem value="premium">المتميزة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">إجمالي المشتركين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-gray-500">+12% من الشهر الماضي</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">المشتركون النشطون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,089</div>
                  <p className="text-xs text-gray-500">87% من الإجمالي</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">سينتهي قريباً</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">34</div>
                  <p className="text-xs text-gray-500">خلال 7 أيام</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.5M د.ع</div>
                  <p className="text-xs text-gray-500">+23% نمو</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">العيادة</TableHead>
                      <TableHead className="text-right">الطبيب</TableHead>
                      <TableHead className="text-right">الخطة</TableHead>
                      <TableHead className="text-right">تاريخ الاشتراك</TableHead>
                      <TableHead className="text-right">تاريخ التجديد</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">عيادة النور</TableCell>
                      <TableCell>د. أحمد محمد</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-600">الاحترافية</Badge>
                      </TableCell>
                      <TableCell>01/01/2025</TableCell>
                      <TableCell>01/02/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">نشطة</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">عرض التفاصيل</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">عيادة الأمل</TableCell>
                      <TableCell>د. فاطمة علي</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">المتميزة</Badge>
                      </TableCell>
                      <TableCell>15/12/2024</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-orange-600">ستنتهي قريباً</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">إرسال تذكير</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">عيادة السلام</TableCell>
                      <TableCell>د. محمود حسن</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600">الأساسية</Badge>
                      </TableCell>
                      <TableCell>20/01/2025</TableCell>
                      <TableCell>20/02/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">نشطة</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">عرض التفاصيل</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الدعم الفني */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">الدعم الفني للاشتراكات</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التذاكر</SelectItem>
                  <SelectItem value="open">مفتوحة</SelectItem>
                  <SelectItem value="pending">قيد المعالجة</SelectItem>
                  <SelectItem value="closed">مغلقة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">تذاكر مفتوحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">قيد المعالجة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">تم الحل اليوم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">متوسط وقت الاستجابة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4 س</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم التذكرة</TableHead>
                      <TableHead className="text-right">العيادة</TableHead>
                      <TableHead className="text-right">الموضوع</TableHead>
                      <TableHead className="text-right">الأولوية</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">#SUP-1247</TableCell>
                      <TableCell>عيادة النور</TableCell>
                      <TableCell>مشكلة في تجديد الاشتراك</TableCell>
                      <TableCell>
                        <Badge className="bg-red-600">عالية</Badge>
                      </TableCell>
                      <TableCell>08/10/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-orange-600">مفتوحة</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">معالجة</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">#SUP-1246</TableCell>
                      <TableCell>عيادة الأمل</TableCell>
                      <TableCell>استفسار عن ترقية الخطة</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">متوسطة</Badge>
                      </TableCell>
                      <TableCell>08/10/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600">قيد المعالجة</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">عرض</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير والتحليلات */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">تقارير وتحليلات الاشتراكات</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">المرضى الشهري</CardTitle>
                  <Users className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,247</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% من الشهر الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">استخدام AI</CardTitle>
                  <Brain className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,492</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+28% من الشهر الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">التذكيرات</CardTitle>
                  <Bell className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+8% من الشهر الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">الاقتراحات المُرسلة</CardTitle>
                  <Calendar className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,123</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+15% من الشهر الماضي</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الاستخدام حسب الخطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">المجانية - 234 عيادة</span>
                        <span className="text-sm font-medium">18.7%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-500" style={{ width: "18.7%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">الأساسية - 487 عيادة</span>
                        <span className="text-sm font-medium">39.1%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "39.1%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">الاحترافية - 398 عيادة</span>
                        <span className="text-sm font-medium">31.9%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "31.9%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">المتميزة - 128 عيادة</span>
                        <span className="text-sm font-medium">10.3%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: "10.3%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>معدل استخدام AI حسب الخطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">المجانية (5 استخدامات/شهر)</span>
                        <span className="text-sm font-medium">4.2 / 5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-500" style={{ width: "84%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">الأساسية (20 استخدام/شهر)</span>
                        <span className="text-sm font-medium">16.8 / 20</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "84%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">الاحترافية (100 استخدام/شهر)</span>
                        <span className="text-sm font-medium">73.4 / 100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "73.4%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">المتميزة (غير محدود)</span>
                        <span className="text-sm font-medium">247 متوسط</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: "100%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ملخص الأداء الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">إجمالي المرضى</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">3,247</p>
                    <p className="text-sm text-gray-600">+389 من الشهر الماضي</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">استخدامات AI</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">8,492</p>
                    <p className="text-sm text-gray-600">+1,847 من الشهر الماضي</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      <span className="font-medium">التذكيرات المُرسلة</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">12,847</p>
                    <p className="text-sm text-gray-600">+923 من الشهر الماضي</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
