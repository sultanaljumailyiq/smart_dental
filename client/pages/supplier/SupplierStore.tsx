import React, { useState } from "react";
import {
  Store,
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Image as ImageIcon,
  Save,
  Upload,
  CheckCircle,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface WorkingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export default function SupplierStore() {
  const [storeInfo, setStoreInfo] = useState({
    name: "شركة الأسنان الطبية المتقدمة",
    nameEn: "Advanced Dental Medical Company",
    description: "نوفر أفضل المواد والأدوات الطبية لعيادات الأسنان في العراق",
    descriptionEn: "We provide the best medical materials and tools for dental clinics in Iraq",
    email: "info@advanceddental.iq",
    phone: "07901234567",
    whatsapp: "07901234567",
    website: "www.advanceddental.iq",
    address: "بغداد - المنصور - شارع الأميرات",
    mapLocation: "Baghdad, Iraq",
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "السبت", open: "09:00", close: "17:00", isOpen: true },
    { day: "الأحد", open: "09:00", close: "17:00", isOpen: true },
    { day: "الإثنين", open: "09:00", close: "17:00", isOpen: true },
    { day: "الثلاثاء", open: "09:00", close: "17:00", isOpen: true },
    { day: "الأربعاء", open: "09:00", close: "17:00", isOpen: true },
    { day: "الخميس", open: "09:00", close: "14:00", isOpen: true },
    { day: "الجمعة", open: "00:00", close: "00:00", isOpen: false },
  ]);

  const [policies, setPolicies] = useState({
    returnPolicy: "يمكن إرجاع المنتجات خلال 7 أيام من تاريخ الاستلام",
    shippingPolicy: "التوصيل مجاناً للطلبات فوق 500,000 دينار",
    warrantyPolicy: "ضمان سنة على جميع الأجهزة الطبية",
    paymentTerms: "الدفع عند الاستلام أو تحويل بنكي",
  });

  const handleSaveStoreInfo = () => {
    console.log("Saving store info:", storeInfo);
  };

  const handleSaveWorkingHours = () => {
    console.log("Saving working hours:", workingHours);
  };

  const handleSavePolicies = () => {
    console.log("Saving policies:", policies);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      dir="rtl"
    >
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                إعدادات المتجر
              </h1>
              <p className="text-gray-600">
                إدارة معلومات المتجر، ساعات العمل، والسياسات
              </p>
            </div>
            <Badge className="bg-green-500 text-white px-4 py-2">
              <CheckCircle className="w-4 h-4 ml-1" />
              متجر نشط
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="info">
              <Store className="w-4 h-4 ml-2" />
              معلومات المتجر
            </TabsTrigger>
            <TabsTrigger value="hours">
              <Clock className="w-4 h-4 ml-2" />
              ساعات العمل
            </TabsTrigger>
            <TabsTrigger value="policies">
              <FileText className="w-4 h-4 ml-2" />
              السياسات
            </TabsTrigger>
          </TabsList>

          {/* Store Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>اسم المتجر (عربي)</Label>
                    <Input
                      value={storeInfo.name}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>اسم المتجر (إنجليزي)</Label>
                    <Input
                      value={storeInfo.nameEn}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, nameEn: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>الوصف (عربي)</Label>
                  <Textarea
                    value={storeInfo.description}
                    onChange={(e) =>
                      setStoreInfo({
                        ...storeInfo,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label>الوصف (إنجليزي)</Label>
                  <Textarea
                    value={storeInfo.descriptionEn}
                    onChange={(e) =>
                      setStoreInfo({
                        ...storeInfo,
                        descriptionEn: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={storeInfo.email}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, email: e.target.value })
                        }
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={storeInfo.phone}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, phone: e.target.value })
                        }
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>واتساب</Label>
                    <Input
                      type="tel"
                      value={storeInfo.whatsapp}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, whatsapp: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>الموقع الإلكتروني</Label>
                    <div className="relative">
                      <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="url"
                        value={storeInfo.website}
                        onChange={(e) =>
                          setStoreInfo({
                            ...storeInfo,
                            website: e.target.value,
                          })
                        }
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <Textarea
                      value={storeInfo.address}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, address: e.target.value })
                      }
                      className="pr-10"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveStoreInfo}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صور المتجر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>شعار المتجر</Label>
                    <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          اضغط لرفع الشعار
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>صورة الغلاف</Label>
                    <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          اضغط لرفع صورة الغلاف
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Working Hours Tab */}
          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل الأسبوعية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div
                      key={schedule.day}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-24">
                        <span className="font-semibold text-gray-900">
                          {schedule.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={schedule.open}
                          onChange={(e) => {
                            const newHours = [...workingHours];
                            newHours[index].open = e.target.value;
                            setWorkingHours(newHours);
                          }}
                          disabled={!schedule.isOpen}
                          className="w-32"
                        />
                        <span className="text-gray-600">إلى</span>
                        <Input
                          type="time"
                          value={schedule.close}
                          onChange={(e) => {
                            const newHours = [...workingHours];
                            newHours[index].close = e.target.value;
                            setWorkingHours(newHours);
                          }}
                          disabled={!schedule.isOpen}
                          className="w-32"
                        />
                      </div>
                      <Badge
                        className={cn(
                          "mr-auto",
                          schedule.isOpen
                            ? "bg-green-500"
                            : "bg-gray-500"
                        )}
                      >
                        {schedule.isOpen ? "مفتوح" : "مغلق"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHours = [...workingHours];
                          newHours[index].isOpen = !newHours[index].isOpen;
                          setWorkingHours(newHours);
                        }}
                      >
                        {schedule.isOpen ? "إغلاق" : "فتح"}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSaveWorkingHours}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ ساعات العمل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>سياسات المتجر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>سياسة الإرجاع</Label>
                  <Textarea
                    value={policies.returnPolicy}
                    onChange={(e) =>
                      setPolicies({ ...policies, returnPolicy: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>سياسة الشحن</Label>
                  <Textarea
                    value={policies.shippingPolicy}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        shippingPolicy: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>سياسة الضمان</Label>
                  <Textarea
                    value={policies.warrantyPolicy}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        warrantyPolicy: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>شروط الدفع</Label>
                  <Textarea
                    value={policies.paymentTerms}
                    onChange={(e) =>
                      setPolicies({
                        ...policies,
                        paymentTerms: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePolicies}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ السياسات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
