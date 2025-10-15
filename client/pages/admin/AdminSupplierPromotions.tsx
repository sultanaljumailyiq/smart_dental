import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Building2,
  BarChart3,
  MessageSquare,
  Upload,
  X,
  Tag,
  Image as ImageIcon,
  Store,
  Users,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface PromotionalCard {
  id: string;
  title: string;
  arabicTitle: string;
  description?: string;
  arabicDescription?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  arabicTags?: string[];
  displayType: "card" | "popup" | "banner";
  targetSection?: string[];
  linkUrl?: string;
  buttonText?: string;
  arabicButtonText?: string;
  supplierId?: number;
  discountPercentage?: number;
  priority: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  views: number;
  clicks: number;
  conversions: number;
}

const SECTIONS = [
  { id: "marketplace", label: "المتجر", icon: Store },
  { id: "dentist_center", label: "مركز الأطباء", icon: Users },
  { id: "supplier_pages", label: "صفحات الموردين", icon: Package },
];

const DISPLAY_TYPES = [
  { value: "card", label: "بطاقة", description: "بطاقة ترويجية عادية" },
  { value: "popup", label: "نافذة منبثقة", description: "نافذة منبثقة تظهر للمستخدم" },
  { value: "banner", label: "بانر", description: "بانر في أعلى الصفحة" },
];

export default function AdminSupplierPromotions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [promotions, setPromotions] = useState<PromotionalCard[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionalCard | null>(null);
  
  const [formData, setFormData] = useState<Partial<PromotionalCard>>({
    displayType: "card",
    targetSection: [],
    tags: [],
    arabicTags: [],
    images: [],
    priority: 0,
    isActive: true,
  });

  const [newTag, setNewTag] = useState("");
  const [newArabicTag, setNewArabicTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/promotional-cards");
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ خطأ",
        description: "فشل في تحميل البطاقات الترويجية",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCards: promotions.length,
    activeCards: promotions.filter((p) => p.isActive).length,
    totalViews: promotions.reduce((sum, p) => sum + p.views, 0),
    totalClicks: promotions.reduce((sum, p) => sum + p.clicks, 0),
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
          image: prev.image || imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || undefined,
      };
    });
  };

  const addTag = (type: "english" | "arabic") => {
    if (type === "english" && newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    } else if (type === "arabic" && newArabicTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        arabicTags: [...(prev.arabicTags || []), newArabicTag.trim()],
      }));
      setNewArabicTag("");
    }
  };

  const removeTag = (type: "english" | "arabic", index: number) => {
    setFormData((prev) => {
      if (type === "english") {
        const newTags = [...(prev.tags || [])];
        newTags.splice(index, 1);
        return { ...prev, tags: newTags };
      } else {
        const newTags = [...(prev.arabicTags || [])];
        newTags.splice(index, 1);
        return { ...prev, arabicTags: newTags };
      }
    });
  };

  const toggleSection = (sectionId: string) => {
    setFormData((prev) => {
      const sections = prev.targetSection || [];
      if (sections.includes(sectionId)) {
        return {
          ...prev,
          targetSection: sections.filter((s) => s !== sectionId),
        };
      } else {
        return {
          ...prev,
          targetSection: [...sections, sectionId],
        };
      }
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const method = editingPromotion ? "PUT" : "POST";
      const url = editingPromotion 
        ? `/api/admin/promotional-cards/${editingPromotion.id}`
        : "/api/admin/promotional-cards";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast({
        title: "✅ تم الحفظ",
        description: editingPromotion 
          ? "تم تحديث البطاقة الترويجية بنجاح"
          : "تم إنشاء البطاقة الترويجية بنجاح",
      });

      await loadPromotions();
      setCreateDialogOpen(false);
      setEditingPromotion(null);
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ خطأ",
        description: "فشل في حفظ البطاقة",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه البطاقة؟")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/promotional-cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "✅ تم الحذف",
        description: "تم حذف البطاقة الترويجية بنجاح",
      });

      await loadPromotions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ خطأ",
        description: "فشل في حذف البطاقة",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (promotion: PromotionalCard) => {
    try {
      const response = await fetch(`/api/admin/promotional-cards/${promotion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...promotion, 
          isActive: !promotion.isActive 
        }),
      });

      if (!response.ok) throw new Error("Failed to toggle");

      await loadPromotions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ خطأ",
        description: "فشل في تحديث الحالة",
      });
    }
  };

  const openEditDialog = (promotion: PromotionalCard) => {
    setEditingPromotion(promotion);
    setFormData(promotion);
  };

  const resetForm = () => {
    setFormData({
      displayType: "card",
      targetSection: [],
      tags: [],
      arabicTags: [],
      images: [],
      priority: 0,
      isActive: true,
    });
    setEditingPromotion(null);
  };

  const displayTypeColors = {
    card: "bg-blue-500",
    popup: "bg-purple-500",
    banner: "bg-green-500",
  };

  const displayTypeLabels = {
    card: "بطاقة",
    popup: "نافذة منبثقة",
    banner: "بانر",
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
      dir="rtl"
    >
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-blue-600" />
                مركز إدارة الموردين
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                مراقبة وإدارة جميع الموردين في المنصة
              </p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers")}
            >
              <Building2 className="w-4 h-4 ml-2" />
              الموردين
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/analytics")}
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              الإحصائيات
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/admin/suppliers/promotions")}
            >
              <Megaphone className="w-4 h-4 ml-2" />
              الحملات الترويجية
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/support")}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              الدعم
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                إدارة البطاقات الترويجية
              </h1>
              <p className="text-gray-600">
                التحكم الكامل بالبطاقات الترويجية، النوافذ المنبثقة، والبانرات في جميع أقسام المنصة
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setCreateDialogOpen(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 ml-2" />
              بطاقة ترويجية جديدة
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي البطاقات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalCards}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">بطاقات نشطة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeCards}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المشاهدات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">النقرات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalClicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Promotions List */}
        {promotions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد بطاقات ترويجية بعد
              </h3>
              <p className="text-gray-600 mb-4">
                ابدأ بإنشاء أول بطاقة ترويجية لعرض محتوى مميز في المنصة
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setCreateDialogOpen(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء بطاقة ترويجية
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {promotions.map((promotion) => (
              <Card
                key={promotion.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {promotion.image && (
                        <img
                          src={promotion.image}
                          alt={promotion.arabicTitle}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {promotion.arabicTitle}
                          </h3>
                          <Badge
                            className={cn(
                              "text-white",
                              displayTypeColors[promotion.displayType]
                            )}
                          >
                            {displayTypeLabels[promotion.displayType]}
                          </Badge>
                          {promotion.discountPercentage && (
                            <Badge variant="secondary">
                              خصم {promotion.discountPercentage}%
                            </Badge>
                          )}
                        </div>
                        {promotion.arabicDescription && (
                          <p className="text-gray-600 mb-3">
                            {promotion.arabicDescription}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {promotion.targetSection?.map((section) => {
                            const sectionData = SECTIONS.find(
                              (s) => s.id === section
                            );
                            return (
                              <Badge key={section} variant="outline">
                                {sectionData?.label}
                              </Badge>
                            );
                          })}
                        </div>
                        {promotion.arabicTags && promotion.arabicTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {promotion.arabicTags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-purple-100 text-purple-700"
                              >
                                <Tag className="w-3 h-3 ml-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Switch
                        checked={promotion.isActive}
                        onCheckedChange={() => toggleActive(promotion)}
                        disabled={loading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(promotion)}
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(promotion.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={createDialogOpen || !!editingPromotion}
          onOpenChange={(open) => {
            if (!open) {
              setCreateDialogOpen(false);
              setEditingPromotion(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "تعديل البطاقة" : "بطاقة ترويجية جديدة"}
              </DialogTitle>
              <DialogDescription>
                {editingPromotion
                  ? "قم بتعديل معلومات البطاقة الترويجية"
                  : "قم بإنشاء بطاقة ترويجية جديدة للعرض في المنصة"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* نوع العرض */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  نوع العرض <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {DISPLAY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          displayType: type.value as any,
                        }))
                      }
                      className={cn(
                        "p-4 border-2 rounded-lg text-right transition-all",
                        formData.displayType === type.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* العنوان */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    العنوان (عربي) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.arabicTitle || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arabicTitle: e.target.value,
                      }))
                    }
                    placeholder="عنوان البطاقة بالعربية"
                  />
                </div>
                <div>
                  <Label>العنوان (إنجليزي)</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Card Title"
                  />
                </div>
              </div>

              {/* الوصف */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الوصف (عربي)</Label>
                  <Textarea
                    value={formData.arabicDescription || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arabicDescription: e.target.value,
                      }))
                    }
                    placeholder="وصف البطاقة بالعربية"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>الوصف (إنجليزي)</Label>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Card Description"
                    rows={3}
                  />
                </div>
              </div>

              {/* الصور */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  الصور
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    رفع الصور
                  </Button>
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`صورة ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 left-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* الأقسام المستهدفة */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  الأقسام المستهدفة <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-3">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div
                        key={section.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          checked={formData.targetSection?.includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <Label className="flex-1 cursor-pointer">
                          {section.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* الوسوم */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">الوسوم (عربي)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newArabicTag}
                      onChange={(e) => setNewArabicTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addTag("arabic")
                      }
                      placeholder="أضف وسم..."
                    />
                    <Button
                      type="button"
                      onClick={() => addTag("arabic")}
                      size="sm"
                    >
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.arabicTags?.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag("arabic", idx)}
                          className="mr-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">الوسوم (إنجليزي)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addTag("english")
                      }
                      placeholder="Add tag..."
                    />
                    <Button
                      type="button"
                      onClick={() => addTag("english")}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                        <button
                          onClick={() => removeTag("english", idx)}
                          className="mr-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* الرابط والزر */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رابط الزر</Label>
                  <Input
                    value={formData.linkUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label>نسبة الخصم (%)</Label>
                  <Input
                    type="number"
                    value={formData.discountPercentage || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountPercentage: parseInt(e.target.value) || undefined,
                      }))
                    }
                    placeholder="25"
                  />
                </div>
              </div>

              {/* نص الزر */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نص الزر (عربي)</Label>
                  <Input
                    value={formData.arabicButtonText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arabicButtonText: e.target.value,
                      }))
                    }
                    placeholder="اطلب الآن"
                  />
                </div>
                <div>
                  <Label>نص الزر (إنجليزي)</Label>
                  <Input
                    value={formData.buttonText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        buttonText: e.target.value,
                      }))
                    }
                    placeholder="Order Now"
                  />
                </div>
              </div>

              {/* التواريخ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ البداية</Label>
                  <Input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>تاريخ النهاية</Label>
                  <Input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* الأولوية */}
              <div>
                <Label>الأولوية (الأعلى يظهر أولاً)</Label>
                <Input
                  type="number"
                  value={formData.priority || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              {/* حالة التفعيل */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label>تفعيل البطاقة فوراً</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setEditingPromotion(null);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={loading}
              >
                {loading ? "جاري الحفظ..." : editingPromotion ? "حفظ التعديلات" : "إنشاء البطاقة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
