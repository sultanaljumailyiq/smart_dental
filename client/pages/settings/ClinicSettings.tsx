import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Calendar, Shield, Bell, Puzzle, Save, Clock, Users, MessageSquare, FileText } from "lucide-react";
import AdminTopNavbar from "@/components/AdminTopNavbar";

export default function ClinicSettings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />
      
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعدادات العيادة المتقدمة</h1>
          <p className="text-gray-600">إدارة شاملة لجميع جوانب العيادة</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-white border shadow-sm h-auto p-2 gap-2">
            <TabsTrigger value="general" className="gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">الإعدادات العامة</span>
            </TabsTrigger>
            <TabsTrigger value="booking" className="gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">إعدادات الحجز</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">الأمان والخصوصية</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">الإشعارات</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Puzzle className="w-4 h-4" />
              <span className="hidden sm:inline">التكامل</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  معلومات العيادة الأساسية
                </CardTitle>
                <CardDescription>تحديث البيانات الأساسية للعيادة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-name">اسم العيادة</Label>
                    <Input id="clinic-name" defaultValue="عيادة الدكتور أحمد للأسنان" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic-phone">رقم الهاتف</Label>
                    <Input id="clinic-phone" defaultValue="+964 770 123 4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-address">العنوان الكامل</Label>
                  <Input id="clinic-address" defaultValue="شارع الكرادة - بناية النور الطبية، الطابق الثالث، بغداد" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-description">وصف العيادة</Label>
                  <Textarea id="clinic-description" rows={4} defaultValue="عيادة متخصصة في طب الأسنان بأحدث التقنيات" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-email">البريد الإلكتروني</Label>
                    <Input id="clinic-email" type="email" defaultValue="ahmed.mohammed@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic-website">الموقع الإلكتروني</Label>
                    <Input id="clinic-website" defaultValue="www.clinic-example.com" />
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  ساعات العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <Switch id={`work-${day}`} defaultChecked={day !== "الجمعة"} />
                    <Label htmlFor={`work-${day}`} className="w-20">{day}</Label>
                    <Input type="time" defaultValue="09:00" className="w-32" disabled={day === "الجمعة"} />
                    <span>إلى</span>
                    <Input type="time" defaultValue="17:00" className="w-32" disabled={day === "الجمعة"} />
                  </div>
                ))}
                <Button className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  حفظ ساعات العمل
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات نظام الحجز</CardTitle>
                <CardDescription>تخصيص طريقة عمل نظام الحجز في العيادة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>السماح بالحجز الإلكتروني</Label>
                      <p className="text-sm text-gray-500">تمكين المرضى من الحجز عبر الإنترنت</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تأكيد الحجز التلقائي</Label>
                      <p className="text-sm text-gray-500">قبول الحجوزات تلقائياً دون مراجعة يدوية</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>السماح بالإلغاء الإلكتروني</Label>
                      <p className="text-sm text-gray-500">السماح للمرضى بإلغاء حجوزاتهم</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>مدة الموعد الافتراضية</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="45">45 دقيقة</SelectItem>
                        <SelectItem value="60">ساعة واحدة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الحد الأقصى للحجوزات اليومية</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>فترة الإشعار المسبق للإلغاء (بالساعات)</Label>
                  <Input type="number" defaultValue="24" />
                  <p className="text-sm text-gray-500">الحد الأدنى من الوقت المطلوب قبل الموعد للسماح بالإلغاء</p>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ إعدادات الحجز
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  الأمان والخصوصية
                </CardTitle>
                <CardDescription>حماية بيانات العيادة والمرضى</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>المصادقة الثنائية (2FA)</Label>
                      <p className="text-sm text-gray-500">طبقة أمان إضافية لتسجيل الدخول</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تسجيل نشاط المستخدمين</Label>
                      <p className="text-sm text-gray-500">تتبع جميع العمليات داخل النظام</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تشفير البيانات الحساسة</Label>
                      <p className="text-sm text-gray-500">حماية معلومات المرضى الطبية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>مدة صلاحية الجلسة (بالدقائق)</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">ساعة واحدة</SelectItem>
                      <SelectItem value="120">ساعتان</SelectItem>
                      <SelectItem value="240">4 ساعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ إعدادات الأمان
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  إعدادات الإشعارات
                </CardTitle>
                <CardDescription>التحكم في الإشعارات والتذكيرات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات الحجوزات الجديدة</Label>
                      <p className="text-sm text-gray-500">إشعار فوري عند ورود حجز جديد</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تذكير بالمواعيد القادمة</Label>
                      <p className="text-sm text-gray-500">إرسال تذكير قبل الموعد بـ 24 ساعة</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات الإلغاء</Label>
                      <p className="text-sm text-gray-500">إشعار عند إلغاء موعد من قبل المريض</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تقارير يومية</Label>
                      <p className="text-sm text-gray-500">ملخص يومي لنشاطات العيادة</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>طريقة الإرسال</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch id="notify-email" defaultChecked />
                      <Label htmlFor="notify-email">البريد الإلكتروني</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="notify-sms" />
                      <Label htmlFor="notify-sms">رسائل SMS</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="notify-push" defaultChecked />
                      <Label htmlFor="notify-push">إشعارات النظام</Label>
                    </div>
                  </div>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ إعدادات الإشعارات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="w-5 h-5" />
                  التكامل مع الخدمات الخارجية
                </CardTitle>
                <CardDescription>ربط العيادة بالخدمات والتطبيقات الأخرى</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-green-600" />
                        <div>
                          <Label className="text-base">WhatsApp Business</Label>
                          <p className="text-sm text-gray-500">إرسال الإشعارات عبر واتساب</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline" size="sm">إعداد الاتصال</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <Label className="text-base">Google Calendar</Label>
                          <p className="text-sm text-gray-500">مزامنة المواعيد مع Google Calendar</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline" size="sm">ربط الحساب</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-600" />
                        <div>
                          <Label className="text-base">Zoom</Label>
                          <p className="text-sm text-gray-500">استشارات عن بُعد عبر Zoom</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline" size="sm">ربط الحساب</Button>
                  </div>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ إعدادات التكامل
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
