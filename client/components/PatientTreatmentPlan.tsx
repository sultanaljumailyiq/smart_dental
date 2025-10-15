import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Crown,
  FlaskConical,
  FileText,
  User,
  Phone,
  Building2,
  Timer,
  RotateCcw,
  Package,
  Activity,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Bell,
  Send,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EnhancedDentalChart from "@/components/EnhancedDentalChart";

interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  cost: number;
  tooth: string;
  notes?: string;
  labOrder?: LabOrderInfo;
}

interface LabOrderInfo {
  id: string;
  treatment: string;
  labName: string;
  status: "pending" | "in_progress" | "ready" | "delivered" | "revision";
  submittedDate: string;
  expectedDate: string;
  deliveredDate?: string;
  cost: number;
  priority: "low" | "medium" | "high" | "urgent";
  notes: string;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  nextVisit: string;
  totalTreatmentCost: number;
  paidAmount: number;
}

interface PatientTreatmentPlanProps {
  patientId: string;
  onAddLabOrder?: (treatmentStepId: string) => void;
}

// Mock data
const mockPatient: PatientInfo = {
  id: "P001",
  name: "��حمد محمد علي",
  age: 35,
  phone: "07701234567",
  lastVisit: "2024-01-15",
  nextVisit: "2024-01-25",
  totalTreatmentCost: 1500,
  paidAmount: 800,
};

const mockTreatmentPlan: TreatmentStep[] = [
  {
    id: "T001",
    title: "فحص شامل وأشعة",
    description: "فحص أولي وأخذ أشعة بانورامية للفكين",
    status: "completed",
    date: "2024-01-10",
    cost: 100,
    tooth: "جميع الأسنان",
  },
  {
    id: "T002",
    title: "تنظيف وإزالة الجير",
    description: "تنظيف شامل للأسنان وإزالة الجير المتراكم",
    status: "completed",
    date: "2024-01-12",
    cost: 150,
    tooth: "جميع الأسنان",
  },
  {
    id: "T003",
    title: "علاج عصب الضرس",
    description: "علاج جذور للضرس العلوي الأيمن الأول",
    status: "in_progress",
    date: "2024-01-15",
    cost: 300,
    tooth: "رقم 16",
    notes: "يحتاج جلستين إضافيتين",
  },
  {
    id: "T004",
    title: "تاج أسنان للضرس المعالج",
    description: "تركيب تاج خزفي للضرس بعد علاج العصب",
    status: "pending",
    date: "2024-01-20",
    cost: 400,
    tooth: "رقم 16",
    labOrder: {
      id: "LAB001",
      treatment: "تاج أسنان خزفي",
      labName: "مختبر النخبة للأسنان",
      status: "in_progress",
      submittedDate: "2024-01-16",
      expectedDate: "2024-01-22",
      cost: 250,
      priority: "medium",
      notes: "لون A2, مع تطابق اللثة الطبيعية",
    },
  },
  {
    id: "T005",
    title: "حشوة تجميلية",
    description: "حشوة ضوئية للضرس السفلي الأيسر",
    status: "pending",
    date: "2024-01-25",
    cost: 120,
    tooth: "رقم 36",
  },
  {
    id: "T006",
    title: "تقويم الأسنان",
    description: "تركيب تقويم شفاف للأسنان العلوية",
    status: "pending",
    date: "2024-02-01",
    cost: 800,
    tooth: "الأسنان العلوية",
    labOrder: {
      id: "LAB002",
      treatment: "تقويم شفاف",
      labName: "مختبر التقويم المتطور",
      status: "pending",
      submittedDate: "2024-01-18",
      expectedDate: "2024-01-30",
      cost: 500,
      priority: "low",
      notes: "قياسات دقيقة للفك العلوي",
    },
  },
];

interface ToothData {
  number: number;
  condition?: string;
  treatment?: string;
  needsLab?: boolean;
  notes?: string;
}

export default function PatientTreatmentPlan({
  patientId,
  onAddLabOrder,
}: PatientTreatmentPlanProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [selectedTeeth, setSelectedTeeth] = useState<ToothData[]>([]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId],
    );
  };

  const handleToothSelect = (toothNumber: number, data: ToothData) => {
    setSelectedTeeth((prev) => {
      const existing = prev.findIndex((t) => t.number === toothNumber);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = data;
        return updated;
      }
      return [...prev, data];
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLabStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "revision":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Activity className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLabStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Timer className="w-3 h-3" />;
      case "in_progress":
        return <Activity className="w-3 h-3" />;
      case "ready":
        return <CheckCircle className="w-3 h-3" />;
      case "delivered":
        return <Package className="w-3 h-3" />;
      case "revision":
        return <RotateCcw className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const completedSteps = mockTreatmentPlan.filter(
    (step) => step.status === "completed",
  ).length;
  const totalSteps = mockTreatmentPlan.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
      {/* Patient Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              {mockPatient.name}
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-4">
                <span>العمر: {mockPatient.age} سنة</span>
                <span>الهاتف: {mockPatient.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>آخر زيارة: {mockPatient.lastVisit}</span>
                <span>الزيارة القادمة: {mockPatient.nextVisit}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">إجمالي التكلفة</div>
          <div className="text-lg font-bold text-gray-900">
            {mockPatient.totalTreatmentCost.toLocaleString()} د.ع
          </div>
          <div className="text-sm text-green-600">
            مدفوع: {mockPatient.paidAmount.toLocaleString()} د.ع
          </div>
        </div>
      </div>

      {/* Interactive Dental Chart */}
      <div className="mb-6">
        <EnhancedDentalChart patientId={patientId} patientName={mockPatient.name} />
      </div>

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">تقدم العلاج</h3>
          <span className="text-sm text-gray-600">
            {completedSteps} من {totalSteps} مكتمل
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600">
          {progressPercentage.toFixed(0)}% مكتمل
        </div>
      </div>

      {/* Treatment Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            الخطة العلاجية
          </h3>
          <Button size="sm" onClick={() => setShowAddTreatment(true)}>
            <Plus className="w-4 h-4 ml-1" />
            إضافة خطوة
          </Button>
        </div>

        <div className="space-y-3">
          {mockTreatmentPlan.map((step, index) => (
            <div
              key={step.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Step Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center mt-1">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                          getStatusColor(step.status),
                        )}
                      >
                        {getStatusIcon(step.status)}
                      </div>
                      {index < mockTreatmentPlan.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {step.title}
                        </h4>
                        <Badge
                          className={cn("text-xs", getStatusColor(step.status))}
                        >
                          {step.status === "completed"
                            ? "مكتمل"
                            : step.status === "in_progress"
                              ? "قيد التنفيذ"
                              : step.status === "cancelled"
                                ? "ملغي"
                                : "معلق"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          <span>{step.tooth}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{step.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {step.cost.toLocaleString()} د.ع
                          </span>
                        </div>
                      </div>

                      {/* Lab Order Preview */}
                      {step.labOrder && (
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FlaskConical className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">
                              طلب مختبر مرتبط
                            </span>
                            <Badge
                              className={cn(
                                "text-xs",
                                getLabStatusColor(step.labOrder.status),
                              )}
                            >
                              {getLabStatusIcon(step.labOrder.status)}
                              <span className="mr-1">
                                {step.labOrder.status === "pending"
                                  ? "معلق"
                                  : step.labOrder.status === "in_progress"
                                    ? "قيد العمل"
                                    : step.labOrder.status === "ready"
                                      ? "جاهز"
                                      : step.labOrder.status === "revision"
                                        ? "مراجعة"
                                        : "مُسلم"}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            {step.labOrder.labName} | التسليم:{" "}
                            {step.labOrder.expectedDate}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!step.labOrder && step.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddLabOrder?.(step.id);
                        }}
                        title="إضافة طلب مختبر"
                      >
                        <FlaskConical className="w-4 h-4 text-purple-600" />
                      </Button>
                    )}
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {expandedSteps.includes(step.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedSteps.includes(step.id) && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {step.notes && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        ملاحظات:
                      </h5>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                        {step.notes}
                      </p>
                    </div>
                  )}

                  {/* Lab Order Details */}
                  {step.labOrder && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-900">
                        تفاصيل طلب المختبر:
                      </h5>

                      <div className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500">المختبر</div>
                            <div className="font-medium text-gray-900">
                              {step.labOrder.labName}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              نوع العلاج
                            </div>
                            <div className="font-medium text-gray-900">
                              {step.labOrder.treatment}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              تاريخ الإرسال
                            </div>
                            <div className="font-medium text-gray-900">
                              {step.labOrder.submittedDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              التسليم المتوقع
                            </div>
                            <div className="font-medium text-gray-900">
                              {step.labOrder.expectedDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">التكلفة</div>
                            <div className="font-medium text-gray-900">
                              {step.labOrder.cost.toLocaleString()} د.ع
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              الأولوية
                            </div>
                            <Badge
                              className={cn(
                                "text-xs",
                                step.labOrder.priority === "urgent"
                                  ? "bg-red-100 text-red-800"
                                  : step.labOrder.priority === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : step.labOrder.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800",
                              )}
                            >
                              {step.labOrder.priority === "urgent"
                                ? "عاجل"
                                : step.labOrder.priority === "high"
                                  ? "عالي"
                                  : step.labOrder.priority === "medium"
                                    ? "متوسط"
                                    : "منخفض"}
                            </Badge>
                          </div>
                        </div>

                        {step.labOrder.notes && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-1">
                              ملاحظات المختبر:
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {step.labOrder.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 ml-1" />
                            اتصال بالمختبر
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="w-3 h-3 ml-1" />
                            إضافة تذكير
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 ml-1" />
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lab Orders Summary */}
      <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-3">ملخص طلبات المختبر</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-800">
              {
                mockTreatmentPlan.filter(
                  (s) => s.labOrder?.status === "pending",
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">معلقة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">
              {
                mockTreatmentPlan.filter(
                  (s) => s.labOrder?.status === "in_progress",
                ).length
              }
            </div>
            <div className="text-xs text-gray-600">قيد العمل</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-800">
              {
                mockTreatmentPlan.filter((s) => s.labOrder?.status === "ready")
                  .length
              }
            </div>
            <div className="text-xs text-gray-600">جاهزة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {mockTreatmentPlan
                .reduce((total, step) => total + (step.labOrder?.cost || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">تكلفة المختبرات</div>
          </div>
        </div>
      </div>
    </div>
  );
}
