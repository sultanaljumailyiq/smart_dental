import React, { useState } from "react";
import {
  Settings,
  Building2,
  Upload,
  Save,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Award,
  Shield,
  Clock,
  Camera,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface SupplierData {
  companyName: string;
  arabicCompanyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  location: string;
  established: number;
  speciality: string;
  description: string;
  arabicDescription: string;
  logo: string;
  coverImage: string;
  services: string[];
  certifications: string[];
  responseTime: string;
  verified: boolean;
  isApproved: boolean;
}

export default function SupplierSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<SupplierData>({
    companyName: "DentalTech Solutions",
    arabicCompanyName: "شركة حلول الأسنان التقنية",
    email: "info@dentaltech.iq",
    phone: "+964 770 123 4567",
    whatsapp: "+964 770 123 4567",
    website: "www.dentaltech.iq",
    location: "بغداد، العراق",
    established: 2015,
    speciality: "معدات طبية متقدمة",
    description: "Leading company in providing advanced dental equipment and modern technologies.",
    arabicDescription: "شركة رائدة في توفير معدات طب الأسنان المتقدمة والتقنيات الحديثة.",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
    services: [
      "توريد المعدات الطبية",
      "الصيانة والدعم الفني",
      "التدريب على الأجهزة",
      "الضمان الشامل",
      "الشحن السريع",
      "الاستشارات الفنية",
    ],
    certifications: [
      "ISO 13485",
      "CE المعتمدة",
      "FDA معتمدة",
      "وزارة الصحة العراقية",
    ],
    responseTime: "خلال ساعة واحدة",
    verified: true,
    isApproved: true,
  });

  const [newService, setNewService] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم حفظ التغييرات",
        description: "تم تحديث معلومات ملفك الشخصي بنجاح",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <SupplierHeader />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
            <TabsTrigger value="media">الصور</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="certifications">الشهادات</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  معلومات الشركة
                </CardTitle>
                <CardDescription>المعلومات الأساسية عن شركتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">اسم الشركة (English)</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arabicCompanyName">اسم الشركة (العربية)</Label>
                    <Input
                      id="arabicCompanyName"
                      name="arabicCompanyName"
                      value={formData.arabicCompanyName}
                      onChange={handleInputChange}
                      placeholder="اسم الشركة"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+964 770 123 4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      واتساب
                    </Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+964 770 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      الموقع الإلكتروني
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="www.example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      الموقع
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="بغداد، العراق"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="established" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      سنة التأسيس
                    </Label>
                    <Input
                      id="established"
                      name="established"
                      type="number"
                      value={formData.established}
                      onChange={handleInputChange}
                      placeholder="2015"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responseTime" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      وقت الاستجابة
                    </Label>
                    <Input
                      id="responseTime"
                      name="responseTime"
                      value={formData.responseTime}
                      onChange={handleInputChange}
                      placeholder="خلال ساعة واحدة"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speciality">التخصص</Label>
                  <Input
                    id="speciality"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    placeholder="معدات طبية متقدمة"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف (English)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Company description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arabicDescription">الوصف (العربية)</Label>
                  <Textarea
                    id="arabicDescription"
                    name="arabicDescription"
                    value={formData.arabicDescription}
                    onChange={handleInputChange}
                    placeholder="وصف الشركة..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  الشعار وصورة الغلاف
                </CardTitle>
                <CardDescription>تحديث الصور المرئية لشركتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>شعار الشركة</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {formData.logo ? (
                          <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500">
                          الحجم المفضل: 400x400 بكسل. الحد الأقصى: 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>صورة الغلاف</Label>
                    <div className="mt-2 space-y-4">
                      <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {formData.coverImage ? (
                          <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500">
                          الحجم المفضل: 1200x400 بكسل. الحد الأقصى: 3MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  الخدمات المقدمة
                </CardTitle>
                <CardDescription>قائمة الخدمات التي تقدمها شركتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="أضف خدمة جديدة..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <Button onClick={handleAddService} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{service}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveService(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  الشهادات والاعتمادات
                </CardTitle>
                <CardDescription>الشهادات المهنية والاعتمادات الحاصل عليها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="أضف شهادة جديدة..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                  />
                  <Button onClick={handleAddCertification} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900 font-medium">{cert}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCertification(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 sticky bottom-4 shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                تأكد من حفظ التغييرات قبل المغادرة
              </p>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
