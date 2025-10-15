import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Phone,
  MapPin,
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
  name: string;
  arabicName: string;
  type: string;
  isActive: boolean;
  displayOrder: number;
  description?: string;
  arabicDescription?: string;
  fees: string;
  minAmount?: string;
  maxAmount?: string;
  config: any;
}

const methodTypeOptions = [
  { value: "cash_on_delivery", label: "الدفع عند الاستلام", labelEn: "Cash on Delivery" },
  { value: "zain_cash", label: "زين كاش", labelEn: "Zain Cash" },
  { value: "exchange_office", label: "مكتب صيرفة", labelEn: "Exchange Office" },
  { value: "stripe", label: "بطاقة ائتمان", labelEn: "Credit/Debit Card" },
  { value: "voucher", label: "قسيمة", labelEn: "Voucher" },
];

export default function PaymentMethodsManagement() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<any>({
    type: "cash_on_delivery",
    name: "",
    arabicName: "",
    isActive: true,
    displayOrder: 0,
    fees: "0.00",
    config: {},
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
    setFormData({
      type: method.type,
      name: method.name,
      arabicName: method.arabicName,
      description: method.description,
      arabicDescription: method.arabicDescription,
      isActive: method.isActive,
      displayOrder: method.displayOrder,
      fees: method.fees,
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      config: method.config || {},
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMethod(null);
    setFormData({
      type: "cash_on_delivery",
      name: "",
      arabicName: "",
      isActive: true,
      displayOrder: 0,
      fees: "0.00",
      config: {},
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMethod(null);
    setFormData({
      type: "cash_on_delivery",
      name: "",
      arabicName: "",
      isActive: true,
      displayOrder: 0,
      fees: "0.00",
      config: {},
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
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة طرق الدفع</h2>
          <p className="text-muted-foreground mt-1">
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
                  {getMethodIcon(method.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{method.arabicName}</h3>
                    <Badge variant={method.isActive ? "default" : "secondary"}>
                      {method.isActive ? "مفعّل" : "معطّل"}
                    </Badge>
                    <Badge variant="outline">أولوية: {method.displayOrder}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {method.name}
                  </p>

                  {method.arabicDescription && (
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg mb-3">
                      {method.arabicDescription}
                    </p>
                  )}

                  <div className="flex gap-4">
                    {method.fees && method.fees !== "0.00" && (
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
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "تعديل طريقة الدفع" : "إضافة طريقة دفع جديدة"}
            </DialogTitle>
            <DialogDescription>
              قم بتعبئة البيانات التالية لإضافة أو تعديل طريقة دفع
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع طريقة الدفع</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {methodTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الاسم بالعربية</Label>
                <Input
                  value={formData.arabicName}
                  onChange={(e) =>
                    setFormData({ ...formData, arabicName: e.target.value })
                  }
                  placeholder="مثال: زين كاش"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم بالإنجليزية</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Example: Zain Cash"
                />
              </div>

              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الوصف بالعربية</Label>
              <Textarea
                value={formData.arabicDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, arabicDescription: e.target.value })
                }
                placeholder="وصف طريقة الدفع بالعربية"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الرسوم (دينار)</Label>
                <Input
                  value={formData.fees}
                  onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>الحد الأدنى</Label>
                <Input
                  value={formData.minAmount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, minAmount: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>

              <div className="space-y-2">
                <Label>الحد الأقصى</Label>
                <Input
                  value={formData.maxAmount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, maxAmount: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label>تفعيل طريقة الدفع</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {editingMethod ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
