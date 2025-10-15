import React, { useState } from "react";
import {
  X,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Save,
  ChevronDown,
  ChevronRight,
  Package,
  Activity,
  Bell,
  Printer,
  Download,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  tooth?: string;
  cost: number;
  duration: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date?: string;
  notes?: string;
  requiresLab?: boolean;
}

interface TreatmentPlanData {
  id?: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  totalCost: number;
  estimatedDuration: string;
  steps: TreatmentStep[];
  priority: "low" | "medium" | "high" | "urgent";
  createdDate: string;
  startDate?: string;
  notes?: string;
}

interface TreatmentPlanManagerProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    id: string;
    name: string;
    age: number;
    phone: string;
  };
  existingPlan?: TreatmentPlanData;
  onSave: (plan: TreatmentPlanData) => void;
}

export default function TreatmentPlanManager({
  isOpen,
  onClose,
  patient,
  existingPlan,
  onSave,
}: TreatmentPlanManagerProps) {
  const [steps, setSteps] = useState<TreatmentStep[]>(
    existingPlan?.steps || []
  );
  const [diagnosis, setDiagnosis] = useState(existingPlan?.diagnosis || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(
    existingPlan?.priority || "medium"
  );
  const [notes, setNotes] = useState(existingPlan?.notes || "");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStep, setNewStep] = useState<Partial<TreatmentStep>>({
    title: "",
    description: "",
    cost: 0,
    duration: "30",
    status: "pending",
  });

  if (!isOpen || !patient) return null;

  const totalCost = steps.reduce((sum, step) => sum + step.cost, 0);
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  const handleAddStep = () => {
    if (!newStep.title || !newStep.description) return;

    const step: TreatmentStep = {
      id: `step-${Date.now()}`,
      title: newStep.title!,
      description: newStep.description!,
      cost: newStep.cost || 0,
      duration: newStep.duration || "30",
      status: "pending",
      tooth: newStep.tooth,
      notes: newStep.notes,
      requiresLab: newStep.requiresLab,
    };

    setSteps([...steps, step]);
    setNewStep({
      title: "",
      description: "",
      cost: 0,
      duration: "30",
      status: "pending",
    });
    setIsAddingStep(false);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const handleUpdateStepStatus = (stepId: string, status: TreatmentStep["status"]) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, status } : s))
    );
  };

  const handleSave = () => {
    const plan: TreatmentPlanData = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      diagnosis,
      totalCost,
      estimatedDuration: `${steps.length} جلسات`,
      steps,
      priority,
      createdDate: existingPlan?.createdDate || new Date().toISOString(),
      notes,
    };

    onSave(plan);
    onClose();
  };

  const getStatusColor = (status: TreatmentStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">الخطة العلاجية</h2>
                <p className="text-blue-100 text-sm">تخطيط وإجراءات العلاج</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">المريض</p>
                  <p className="font-semibold">{patient.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">العمر</p>
                  <p className="font-semibold">{patient.age} سنة</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">التكلفة الإجمالية</p>
                  <p className="font-semibold">{totalCost.toLocaleString()} د.ع</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Diagnosis and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                التشخيص
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="أدخل التشخيص التفصيلي..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الأولوية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
              <div className="mt-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ملاحظات عامة
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                التقدم العام
              </span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {completedSteps} من {steps.length} خطوة مكتملة
            </p>
          </div>

          {/* Treatment Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">خطوات العلاج</h3>
              <button
                onClick={() => setIsAddingStep(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة خطوة
              </button>
            </div>

            {/* Add Step Form */}
            {isAddingStep && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="عنوان الخطوة"
                    value={newStep.title || ""}
                    onChange={(e) =>
                      setNewStep({ ...newStep, title: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="رقم السن (اختياري)"
                    value={newStep.tooth || ""}
                    onChange={(e) =>
                      setNewStep({ ...newStep, tooth: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="وصف الإجراء"
                    value={newStep.description || ""}
                    onChange={(e) =>
                      setNewStep({ ...newStep, description: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2"
                    rows={2}
                  />
                  <input
                    type="number"
                    placeholder="التكلفة (د.ع)"
                    value={newStep.cost || ""}
                    onChange={(e) =>
                      setNewStep({
                        ...newStep,
                        cost: parseInt(e.target.value) || 0,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="المدة (دقائق)"
                    value={newStep.duration || ""}
                    onChange={(e) =>
                      setNewStep({ ...newStep, duration: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex items-center gap-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="requiresLab"
                      checked={newStep.requiresLab || false}
                      onChange={(e) =>
                        setNewStep({ ...newStep, requiresLab: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="requiresLab" className="text-sm text-gray-700">
                      يتطلب عمل مختبري
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    حفظ الخطوة
                  </button>
                  <button
                    onClick={() => setIsAddingStep(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Steps List */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedStep(expandedStep === step.id ? null : step.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {step.title}
                            {step.tooth && (
                              <span className="text-sm text-gray-500 mr-2">
                                (السن: {step.tooth})
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                            getStatusColor(step.status)
                          )}
                        >
                          {step.status === "completed" && <CheckCircle className="w-3 h-3" />}
                          {step.status === "in_progress" && <Activity className="w-3 h-3" />}
                          {step.status === "pending" && <Clock className="w-3 h-3" />}
                          {step.status === "cancelled" && <AlertTriangle className="w-3 h-3" />}
                          {step.status === "completed" && "مكتمل"}
                          {step.status === "in_progress" && "قيد التنفيذ"}
                          {step.status === "pending" && "معلق"}
                          {step.status === "cancelled" && "ملغى"}
                        </span>
                        <span className="text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          {step.cost.toLocaleString()} د.ع
                        </span>
                        <span className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {step.duration} دقيقة
                        </span>
                        {step.requiresLab && (
                          <span className="text-sm text-purple-600">
                            <Package className="w-4 h-4 inline mr-1" />
                            يتطلب مختبر
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedStep === step.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedStep === step.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        تحديث الحالة:
                      </span>
                      <select
                        value={step.status}
                        onChange={(e) =>
                          handleUpdateStepStatus(
                            step.id,
                            e.target.value as TreatmentStep["status"]
                          )
                        }
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="pending">معلق</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغى</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف الخطوة
                    </button>
                  </div>
                )}
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">لا توجد خطوات علاجية حتى الآن</p>
                <p className="text-sm text-gray-500 mt-1">
                  اضغط "إضافة خطوة" للبدء
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                طباعة
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                تصدير PDF
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ الخطة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
