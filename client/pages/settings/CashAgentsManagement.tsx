import React, { useState, useEffect } from "react";
import { 
  MapPin, Plus, Edit, Trash2, Phone, Building2, Clock, Save, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CashAgent {
  id: number;
  governorateArabic: string;
  centerNameArabic: string;
  addressArabic: string;
  phoneNumber: string;
  alternativePhone?: string;
  workingHoursArabic: string;
}

const IRAQI_GOVERNORATES = [
  "بغداد", "البصرة", "نينوى", "الأنبار", "أربيل", "كركوك", 
  "ديالى", "صلاح الدين", "النجف", "كربلاء", "ذي قار", 
  "القادسية", "بابل", "واسط", "ميسان", "المثنى", "دهوك", "السليمانية"
];

export default function CashAgentsManagement() {
  const [agents, setAgents] = useState<CashAgent[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");
  
  const [formData, setFormData] = useState({
    governorateArabic: "",
    centerNameArabic: "",
    addressArabic: "",
    phoneNumber: "",
    alternativePhone: "",
    workingHoursArabic: ""
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await fetch("/api/cash-payment-centers");
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      }
    } catch (error) {
      console.error("Error loading agents:", error);
    }
  };

  const handleSaveNew = async () => {
    if (!formData.governorateArabic || !formData.centerNameArabic || !formData.phoneNumber) {
      toast.error("الرجاء إدخال جميع الحقول المطلوبة");
      return;
    }

    try {
      const response = await fetch("/api/cash-payment-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("تم إضافة الوكيل بنجاح");
        setIsAddingNew(false);
        setFormData({
          governorateArabic: "",
          centerNameArabic: "",
          addressArabic: "",
          phoneNumber: "",
          alternativePhone: "",
          workingHoursArabic: ""
        });
        loadAgents();
      } else {
        toast.error("فشل إضافة الوكيل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };

  const handleEdit = (agent: CashAgent) => {
    setEditingId(agent.id);
    setFormData({
      governorateArabic: agent.governorateArabic,
      centerNameArabic: agent.centerNameArabic,
      addressArabic: agent.addressArabic,
      phoneNumber: agent.phoneNumber,
      alternativePhone: agent.alternativePhone || "",
      workingHoursArabic: agent.workingHoursArabic
    });
  };

  const handleUpdate = async () => {
    if (!formData.governorateArabic || !formData.centerNameArabic || !formData.phoneNumber) {
      toast.error("الرجاء إدخال جميع الحقول المطلوبة");
      return;
    }

    try {
      const response = await fetch(`/api/cash-payment-centers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("تم تحديث الوكيل بنجاح");
        setEditingId(null);
        setFormData({
          governorateArabic: "",
          centerNameArabic: "",
          addressArabic: "",
          phoneNumber: "",
          alternativePhone: "",
          workingHoursArabic: ""
        });
        loadAgents();
      } else {
        toast.error("فشل تحديث الوكيل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الوكيل؟")) return;

    try {
      const response = await fetch(`/api/cash-payment-centers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف الوكيل بنجاح");
        loadAgents();
      } else {
        toast.error("فشل حذف الوكيل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const filteredAgents = selectedGovernorate === "الكل" 
    ? agents 
    : agents.filter(a => a.governorateArabic === selectedGovernorate);

  const governoratesWithAgents = ["الكل", ...new Set(agents.map(a => a.governorateArabic))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-purple-600" />
            إدارة وكلاء الدفع
          </h1>
          <p className="text-gray-600">
            إضافة وإدارة الوكلاء المعتمدين في المحافظات العراقية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الوكلاء</p>
                <p className="text-3xl font-bold text-purple-600">{agents.length}</p>
              </div>
              <MapPin className="w-12 h-12 text-purple-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">المحافظات المغطاة</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {new Set(agents.map(a => a.governorateArabic)).size}
                </p>
              </div>
              <Building2 className="w-12 h-12 text-emerald-200" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">محافظات بدون وكيل</p>
                <p className="text-3xl font-bold text-blue-600">
                  {IRAQI_GOVERNORATES.length - new Set(agents.map(a => a.governorateArabic)).size}
                </p>
              </div>
              <MapPin className="w-12 h-12 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
            {governoratesWithAgents.map((gov) => (
              <button
                key={gov}
                onClick={() => setSelectedGovernorate(gov)}
                className={`px-4 py-2 rounded-xl border-2 transition-all whitespace-nowrap ${
                  selectedGovernorate === gov
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {gov}
              </button>
            ))}
          </div>
          
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة وكيل جديد
          </Button>
        </div>

        {/* Add New Form */}
        {isAddingNew && (
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                إضافة وكيل جديد
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setFormData({
                    governorateArabic: "",
                    centerNameArabic: "",
                    addressArabic: "",
                    phoneNumber: "",
                    alternativePhone: "",
                    workingHoursArabic: ""
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المحافظة *
                </label>
                <select
                  value={formData.governorateArabic}
                  onChange={(e) => setFormData({ ...formData, governorateArabic: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">اختر المحافظة</option>
                  {IRAQI_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم الوكيل *
                </label>
                <Input
                  value={formData.centerNameArabic}
                  onChange={(e) => setFormData({ ...formData, centerNameArabic: e.target.value })}
                  placeholder="اسم الوكيل أو المركز"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان
                </label>
                <Input
                  value={formData.addressArabic}
                  onChange={(e) => setFormData({ ...formData, addressArabic: e.target.value })}
                  placeholder="العنوان التفصيلي"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="07XX XXX XXXX"
                  className="direction-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم بديل
                </label>
                <Input
                  value={formData.alternativePhone}
                  onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                  placeholder="رقم هاتف بديل"
                  className="direction-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ساعات العمل
                </label>
                <Input
                  value={formData.workingHoursArabic}
                  onChange={(e) => setFormData({ ...formData, workingHoursArabic: e.target.value })}
                  placeholder="مثال: 9 صباحاً - 5 مساءً"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveNew}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Save className="w-5 h-5 ml-2" />
                حفظ
              </Button>
              <Button
                onClick={() => {
                  setIsAddingNew(false);
                  setFormData({
                    governorateArabic: "",
                    centerNameArabic: "",
                    addressArabic: "",
                    phoneNumber: "",
                    alternativePhone: "",
                    workingHoursArabic: ""
                  });
                }}
                variant="outline"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Agents List */}
        <div className="grid gap-4">
          {filteredAgents.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {selectedGovernorate === "الكل" 
                  ? "لا توجد وكلاء مضافين بعد" 
                  : `لا يوجد وكيل في ${selectedGovernorate}`}
              </p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
                {editingId === agent.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المحافظة *
                        </label>
                        <select
                          value={formData.governorateArabic}
                          onChange={(e) => setFormData({ ...formData, governorateArabic: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        >
                          {IRAQI_GOVERNORATES.map((gov) => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          اسم الوكيل *
                        </label>
                        <Input
                          value={formData.centerNameArabic}
                          onChange={(e) => setFormData({ ...formData, centerNameArabic: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          العنوان
                        </label>
                        <Input
                          value={formData.addressArabic}
                          onChange={(e) => setFormData({ ...formData, addressArabic: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رقم الهاتف *
                        </label>
                        <Input
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="direction-ltr text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رقم بديل
                        </label>
                        <Input
                          value={formData.alternativePhone}
                          onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                          className="direction-ltr text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ساعات العمل
                        </label>
                        <Input
                          value={formData.workingHoursArabic}
                          onChange={(e) => setFormData({ ...formData, workingHoursArabic: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleUpdate}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        حفظ التغييرات
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            governorateArabic: "",
                            centerNameArabic: "",
                            addressArabic: "",
                            phoneNumber: "",
                            alternativePhone: "",
                            workingHoursArabic: ""
                          });
                        }}
                        variant="outline"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{agent.centerNameArabic}</h3>
                          <p className="text-sm text-purple-600 font-semibold">{agent.governorateArabic}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mr-15">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{agent.addressArabic || "لا يوجد عنوان"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm direction-ltr">{agent.phoneNumber}</span>
                        </div>
                        {agent.alternativePhone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm direction-ltr">{agent.alternativePhone}</span>
                          </div>
                        )}
                        {agent.workingHoursArabic && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{agent.workingHoursArabic}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
