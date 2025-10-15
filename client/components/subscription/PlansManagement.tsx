import { useState, useEffect } from "react";
import { Crown, Zap, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FALLBACK_SUBSCRIPTION_PLANS, type SubscriptionPlan } from "../../../shared/fallbackData";

const emptyPlan: Omit<SubscriptionPlan, "id"> = {
  name: "",
  arabicName: "",
  description: "",
  arabicDescription: "",
  price: 0,
  durationMonths: 1,
  features: [],
  arabicFeatures: [],
  canBePromoted: false,
  maxPriorityLevel: 0,
  showInTop: false,
  maxMonthlyAppearances: 0,
  isActive: true,
  displayOrder: 0,
};

export default function PlansManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/subscription-plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        // Use shared fallback data
        toast.info("جاري استخدام البيانات التجريبية");
        setPlans(FALLBACK_SUBSCRIPTION_PLANS);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error("فشل تحميل الخطط، جاري استخدام البيانات التجريبية");
      // Use shared fallback data on error
      setPlans(FALLBACK_SUBSCRIPTION_PLANS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPlan) return;

    try {
      const url = editingPlan.id
        ? `/api/subscription-plans/${editingPlan.id}`
        : "/api/subscription-plans";
      
      const method = editingPlan.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan),
      });

      if (response.ok) {
        toast.success(editingPlan.id ? "تم تحديث الخطة" : "تم إنشاء الخطة");
        setEditingPlan(null);
        setIsCreating(false);
        loadPlans();
      } else {
        toast.error("فشل حفظ الخطة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخطة؟")) return;

    try {
      const response = await fetch(`/api/subscription-plans/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف الخطة");
        loadPlans();
      } else {
        toast.error("فشل حذف الخطة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const addFeature = (isArabic: boolean) => {
    if (!editingPlan) return;
    
    const key = isArabic ? "arabicFeatures" : "features";
    setEditingPlan({
      ...editingPlan,
      [key]: [...editingPlan[key], ""],
    });
  };

  const updateFeature = (index: number, value: string, isArabic: boolean) => {
    if (!editingPlan) return;

    const key = isArabic ? "arabicFeatures" : "features";
    const updated = [...editingPlan[key]];
    updated[index] = value;
    setEditingPlan({
      ...editingPlan,
      [key]: updated,
    });
  };

  const removeFeature = (index: number, isArabic: boolean) => {
    if (!editingPlan) return;

    const key = isArabic ? "arabicFeatures" : "features";
    setEditingPlan({
      ...editingPlan,
      [key]: editingPlan[key].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">خطط الاشتراك</h2>
        <Button
          onClick={() => {
            setEditingPlan({ ...emptyPlan, id: 0 } as SubscriptionPlan);
            setIsCreating(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة خطة جديدة
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : editingPlan ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {isCreating ? "إضافة خطة جديدة" : "تعديل الخطة"}
            </h3>
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsCreating(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم الخطة (عربي)</Label>
                <Input
                  value={editingPlan.arabicName}
                  onChange={(e) => setEditingPlan({ ...editingPlan, arabicName: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>اسم الخطة (English)</Label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>السعر (IQD)</Label>
                <Input
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>المدة (شهر)</Label>
                <Input
                  type="number"
                  value={editingPlan.durationMonths}
                  onChange={(e) => setEditingPlan({ ...editingPlan, durationMonths: parseInt(e.target.value) })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>أقصى مستوى أولوية</Label>
                <Input
                  type="number"
                  value={editingPlan.maxPriorityLevel}
                  onChange={(e) => setEditingPlan({ ...editingPlan, maxPriorityLevel: parseInt(e.target.value) })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>ترتيب العرض</Label>
                <Input
                  type="number"
                  value={editingPlan.displayOrder}
                  onChange={(e) => setEditingPlan({ ...editingPlan, displayOrder: parseInt(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الوصف (عربي)</Label>
                <Textarea
                  value={editingPlan.arabicDescription}
                  onChange={(e) => setEditingPlan({ ...editingPlan, arabicDescription: e.target.value })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف (English)</Label>
                <Textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>المزايا (عربي)</Label>
                  <button
                    onClick={() => addFeature(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + إضافة ميزة
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPlan.arabicFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, true)}
                        className="flex-1 rounded-xl"
                      />
                      <button
                        onClick={() => removeFeature(index, true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>المزايا (English)</Label>
                  <button
                    onClick={() => addFeature(false)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value, false)}
                        className="flex-1 rounded-xl"
                      />
                      <button
                        onClick={() => removeFeature(index, false)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-gray-900 font-medium">يمكن الترويج للعيادات</span>
                <input
                  type="checkbox"
                  checked={editingPlan.canBePromoted}
                  onChange={(e) => setEditingPlan({ ...editingPlan, canBePromoted: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-gray-900 font-medium">إظهار في الأعلى</span>
                <input
                  type="checkbox"
                  checked={editingPlan.showInTop}
                  onChange={(e) => setEditingPlan({ ...editingPlan, showInTop: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-gray-900 font-medium">فعّال</span>
                <input
                  type="checkbox"
                  checked={editingPlan.isActive}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
              <Button
                onClick={() => {
                  setEditingPlan(null);
                  setIsCreating(false);
                }}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.arabicName}</h3>
                  <p className="text-gray-600 text-sm">{plan.arabicDescription}</p>
                </div>
                {plan.canBePromoted && <Crown className="w-6 h-6 text-yellow-500" />}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">IQD</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{plan.durationMonths} شهر</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.arabicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingPlan(plan)}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
                <Button
                  onClick={() => handleDelete(plan.id)}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
