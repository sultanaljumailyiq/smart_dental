import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentMethod {
  id: number;
  methodType: string;
  methodName: string;
  methodNameArabic: string;
  isActive: boolean;
  priority: number;
  zainCashPhoneNumber?: string;
  zainCashAccountName?: string;
  exchangeOfficeName?: string;
  exchangeOfficePhone?: string;
  exchangeOfficeAddress?: string;
  instructions?: string;
  instructionsArabic?: string;
  fees: string;
  minAmount?: string;
  maxAmount?: string;
  metadata: any;
}

const methodTypeOptions = [
  { value: "cash_on_delivery", label: "الدفع عند الاستلام", labelEn: "Cash on Delivery" },
  { value: "zain_cash", label: "زين كاش", labelEn: "Zain Cash" },
  { value: "exchange_office", label: "مكتب صيرفة", labelEn: "Exchange Office" },
  { value: "stripe", label: "بطاقة ائتمان", labelEn: "Credit/Debit Card" },
  { value: "voucher", label: "قسيمة", labelEn: "Voucher" },
];

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    methodType: "cash_on_delivery",
    isActive: true,
    priority: 0,
    fees: "0.00",
    metadata: {},
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/admin/payment-methods");
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("فشل في تحميل طرق الدفع");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingMethod
        ? `/api/admin/payment-methods/${editingMethod.id}`
        : "/api/admin/payment-methods";
      const method = editingMethod ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingMethod ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
        fetchPaymentMethods();
        handleCloseDialog();
      } else {
        toast.error("فشل في حفظ البيانات");
      }
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف طريقة الدفع هذه؟")) return;

    try {
      const response = await fetch(`/api/admin/payment-methods/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم الحذف بنجاح");
        fetchPaymentMethods();
      } else {
        toast.error("فشل في الحذف");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData(method);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMethod(null);
    setFormData({
      methodType: "cash_on_delivery",
      isActive: true,
      priority: 0,
      fees: "0.00",
      metadata: {},
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMethod(null);
    setFormData({
      methodType: "cash_on_delivery",
      isActive: true,
      priority: 0,
      fees: "0.00",
      metadata: {},
    });
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "cash_on_delivery":
        return <DollarSign className="h-5 w-5" />;
      case "zain_cash":
        return <Phone className="h-5 w-5" />;
      case "exchange_office":
        return <MapPin className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة طرق الدفع</h1>
          <p className="text-muted-foreground mt-2">
            إضافة وإدارة طرق الدفع المتاحة للمستخدمين
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة طريقة دفع
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {getMethodIcon(method.methodType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{method.methodNameArabic}</h3>
                    <Badge variant={method.isActive ? "default" : "secondary"}>
                      {method.isActive ? "مفعّل" : "معطّل"}
                    </Badge>
                    <Badge variant="outline">أولوية: {method.priority}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {method.methodName}
                  </p>

                  {method.methodType === "zain_cash" && method.zainCashPhoneNumber && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-sm font-medium">رقم الهاتف: </span>
                        <span className="text-sm">{method.zainCashPhoneNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">اسم الحساب: </span>
                        <span className="text-sm">{method.zainCashAccountName}</span>
                      </div>
                    </div>
                  )}

                  {method.methodType === "exchange_office" && method.exchangeOfficeName && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-sm font-medium">اسم المكتب: </span>
                        <span className="text-sm">{method.exchangeOfficeName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">الهاتف: </span>
                        <span className="text-sm">{method.exchangeOfficePhone}</span>
                      </div>
                      {method.exchangeOfficeAddress && (
                        <div className="col-span-2">
                          <span className="text-sm font-medium">العنوان: </span>
                          <span className="text-sm">{method.exchangeOfficeAddress}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {method.instructionsArabic && (
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {method.instructionsArabic}
                    </p>
                  )}

                  <div className="flex gap-4 mt-3">
                    {method.fees !== "0.00" && (
                      <div className="text-sm">
                        <span className="font-medium">الرسوم: </span>
                        <span>{method.fees} دينار</span>
                      </div>
                    )}
                    {method.minAmount && (
                      <div className="text-sm">
                        <span className="font-medium">الحد الأدنى: </span>
                        <span>{method.minAmount} دينار</span>
                      </div>
                    )}
                    {method.maxAmount && (
                      <div className="text-sm">
                        <span className="font-medium">الحد الأقصى: </span>
                        <span>{method.maxAmount} دينار</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(method)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "تعديل طريقة الدفع" : "إضافة طريقة دفع جديدة"}
            </DialogTitle>
            <DialogDescription>
              أدخل البيانات المطلوبة لطريقة الدفع
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>نوع طريقة الدفع</Label>
              <Select
                value={formData.methodType}
                onValueChange={(value) =>
                  setFormData({ ...formData, methodType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methodTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>الاسم بالعربي</Label>
                <Input
                  value={formData.methodNameArabic || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, methodNameArabic: e.target.value })
                  }
                  placeholder="زين كاش"
                />
              </div>
              <div className="grid gap-2">
                <Label>الاسم بالإنجليزي</Label>
                <Input
                  value={formData.methodName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, methodName: e.target.value })
                  }
                  placeholder="Zain Cash"
                />
              </div>
            </div>

            {formData.methodType === "zain_cash" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={formData.zainCashPhoneNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, zainCashPhoneNumber: e.target.value })
                    }
                    placeholder="+964 770 123 4567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>اسم الحساب</Label>
                  <Input
                    value={formData.zainCashAccountName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, zainCashAccountName: e.target.value })
                    }
                    placeholder="منصة طب الأسنان"
                  />
                </div>
              </div>
            )}

            {formData.methodType === "exchange_office" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>اسم مكتب الصيرفة</Label>
                    <Input
                      value={formData.exchangeOfficeName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, exchangeOfficeName: e.target.value })
                      }
                      placeholder="صيرفة الكرادة"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={formData.exchangeOfficePhone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, exchangeOfficePhone: e.target.value })
                      }
                      placeholder="+964 770 888 9999"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>العنوان</Label>
                  <Input
                    value={formData.exchangeOfficeAddress || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, exchangeOfficeAddress: e.target.value })
                    }
                    placeholder="شارع الكرادة الداخلية، بغداد"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>التعليمات (عربي)</Label>
                <Textarea
                  value={formData.instructionsArabic || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, instructionsArabic: e.target.value })
                  }
                  placeholder="تعليمات استخدام طريقة الدفع"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>التعليمات (إنجليزي)</Label>
                <Textarea
                  value={formData.instructions || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  placeholder="Payment method instructions"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>الرسوم (دينار)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.fees || "0.00"}
                  onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>الحد الأدنى (دينار)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.minAmount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, minAmount: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>الحد الأقصى (دينار)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.maxAmount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, maxAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>الأولوية (للترتيب)</Label>
                <Input
                  type="number"
                  value={formData.priority || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>مفعّل</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="ml-2 h-4 w-4" />
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              <Save className="ml-2 h-4 w-4" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
