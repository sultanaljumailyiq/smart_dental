import React, { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  MoreHorizontal,
  User,
  Stethoscope,
  Heart,
  Target,
  TrendingUp,
  DollarSign,
  FileText,
  Camera,
  Zap,
  Award,
  Star,
  Timer,
  MapPin,
  Phone,
  MessageCircle,
  Settings,
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Edit,
  Archive,
  AlertCircle,
  Info,
  BarChart3,
  PieChart,
  TrendingDown,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "skipped";
  duration: string;
  cost: number;
  date?: string;
  notes?: string;
  priority: "high" | "medium" | "low";
}

interface TreatmentPlan {
  id: string;
  patientName: string;
  patientId: string;
  title: string;
  description: string;
  category: "orthodontics" | "surgery" | "cleaning" | "cosmetic" | "emergency";
  status: "active" | "completed" | "paused" | "cancelled";
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  totalCost: number;
  paidAmount: number;
  steps: TreatmentStep[];
  doctor: string;
  priority: "urgent" | "high" | "medium" | "low";
  nextAppointment?: string;
  avatar?: string;
}

interface ProgressMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  color: string;
  icon: React.ComponentType<any>;
}

const sampleTreatmentPlans: TreatmentPlan[] = [
  {
    id: "1",
    patientName: "أحمد محمد",
    patientId: "P001",
    title: "تقويم الأسنان الشامل",
    description: "خطة تقويم شاملة لمدة 18 شهر",
    category: "orthodontics",
    status: "active",
    progress: 65,
    startDate: "2024-01-15",
    estimatedEndDate: "2025-07-15",
    totalCost: 3500000,
    paidAmount: 2275000,
    doctor: "د. أحمد الرحمة",
    priority: "high",
    nextAppointment: "2024-01-20 10:00",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    steps: [
      {
        id: "s1",
        title: "الفحص الأولي والتصوير",
        description: "فحص شامل وأخذ صور الأشعة",
        status: "completed",
        duration: "60 دقيقة",
        cost: 150000,
        date: "2024-01-15",
        priority: "high",
      },
      {
        id: "s2",
        title: "تركيب التقويم العلوي",
        description: "تركيب تقويم معدني للفك العلوي",
        status: "completed",
        duration: "90 دقيقة",
        cost: 800000,
        date: "2024-01-22",
        priority: "high",
      },
      {
        id: "s3",
        title: "تركيب التقويم السفلي",
        description: "تركيب تقويم معدني للفك السفلي",
        status: "in-progress",
        duration: "90 دقيقة",
        cost: 800000,
        priority: "high",
      },
      {
        id: "s4",
        title: "المتابعة الشهرية",
        description: "فحص وتعديل التقويم",
        status: "pending",
        duration: "30 دقيقة",
        cost: 100000,
        priority: "medium",
      },
    ],
  },
  {
    id: "2",
    patientName: "فاطمة علي",
    patientId: "P002",
    title: "زراعة سن واحد",
    description: "زراعة سن بديل في الفك العلوي",
    category: "surgery",
    status: "active",
    progress: 80,
    startDate: "2024-01-10",
    estimatedEndDate: "2024-03-10",
    totalCost: 1200000,
    paidAmount: 960000,
    doctor: "د. سارة النور",
    priority: "medium",
    nextAppointment: "2024-01-25 14:00",
    steps: [
      {
        id: "s1",
        title: "الفحص والتخطيط",
        description: "فحص المنطقة والتخطيط للزراعة",
        status: "completed",
        duration: "45 دقيقة",
        cost: 100000,
        date: "2024-01-10",
        priority: "high",
      },
      {
        id: "s2",
        title: "زراعة الغرسة",
        description: "زراعة الغرسة التيتانيوم",
        status: "completed",
        duration: "120 دقيقة",
        cost: 800000,
        date: "2024-01-17",
        priority: "high",
      },
      {
        id: "s3",
        title: "فترة الالتئام",
        description: "فترة انتظار لالتئام الغرسة",
        status: "in-progress",
        duration: "8 أسابيع",
        cost: 0,
        priority: "low",
      },
    ],
  },
];

const progressMetrics: ProgressMetric[] = [
  {
    id: "completion",
    label: "معدل الإنجاز",
    value: 73,
    target: 85,
    unit: "%",
    trend: "up",
    color: "green",
    icon: Target,
  },
  {
    id: "satisfaction",
    label: "رضا المرضى",
    value: 96,
    target: 95,
    unit: "%",
    trend: "up",
    color: "blue",
    icon: Heart,
  },
  {
    id: "efficiency",
    label: "كفاءة الوقت",
    value: 82,
    target: 90,
    unit: "%",
    trend: "stable",
    color: "orange",
    icon: Clock,
  },
  {
    id: "revenue",
    label: "الإيرادات",
    value: 87,
    target: 100,
    unit: "%",
    trend: "up",
    color: "purple",
    icon: DollarSign,
  },
];

export default function TreatmentPlanWidgets() {
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showMetrics, setShowMetrics] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const filteredPlans = sampleTreatmentPlans.filter(
    (plan) => filterStatus === "all" || plan.status === filterStatus,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "skipped":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "paused":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "orthodontics":
        return Activity;
      case "surgery":
        return Stethoscope;
      case "cleaning":
        return Sparkles;
      case "cosmetic":
        return Star;
      case "emergency":
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId],
    );
  };

  const ProgressMetricsGrid = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {progressMetrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                metric.color === "green"
                  ? "bg-green-100 text-green-600"
                  : metric.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : metric.color === "orange"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-purple-100 text-purple-600",
              )}
            >
              <metric.icon className="w-5 h-5" />
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                metric.trend === "up"
                  ? "text-green-600"
                  : metric.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600",
              )}
            >
              {metric.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : metric.trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <div className="w-3 h-1 bg-gray-400 rounded"></div>
              )}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
              {metric.unit}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                metric.color === "green"
                  ? "bg-green-500"
                  : metric.color === "blue"
                    ? "bg-blue-500"
                    : metric.color === "orange"
                      ? "bg-orange-500"
                      : "bg-purple-500",
              )}
              style={{ width: `${(metric.value / metric.target) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const TreatmentPlanCard = ({ plan }: { plan: TreatmentPlan }) => {
    const CategoryIcon = getCategoryIcon(plan.category);
    const completedSteps = plan.steps.filter(
      (step) => step.status === "completed",
    ).length;
    const totalSteps = plan.steps.length;

    return (
      <div
        onClick={() => setSelectedPlan(plan)}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {plan.avatar ? (
              <img
                src={plan.avatar}
                alt={plan.patientName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {plan.patientName}
              </h3>
              <p className="text-xs text-gray-600">{plan.title}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium border",
                getStatusColor(plan.status),
              )}
            >
              {plan.status === "active"
                ? "نشط"
                : plan.status === "completed"
                  ? "مكتمل"
                  : plan.status === "paused"
                    ? "متوقف"
                    : "ملغي"}
            </span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs",
                getPriorityColor(plan.priority),
              )}
            >
              {plan.priority === "urgent"
                ? "عاجل"
                : plan.priority === "high"
                  ? "عالي"
                  : plan.priority === "medium"
                    ? "متوسط"
                    : "منخفض"}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">التقدم</span>
            <span className="text-sm text-gray-600">{plan.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>
              {completedSteps} من {totalSteps} خطوات
            </span>
            <span>{plan.estimatedEndDate}</span>
          </div>
        </div>

        {/* Financial Info */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(plan.paidAmount)}
            </div>
            <div className="text-xs text-gray-600">مدفوع</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-blue-600">
              {formatCurrency(plan.totalCost - plan.paidAmount)}
            </div>
            <div className="text-xs text-gray-600">متبقي</div>
          </div>
        </div>

        {/* Next Appointment */}
        {plan.nextAppointment && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                الموعد القادم
              </div>
              <div className="text-xs text-blue-700">
                {plan.nextAppointment}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TreatmentStepCard = ({
    step,
    planId,
  }: {
    step: TreatmentStep;
    planId: string;
  }) => {
    const isExpanded = expandedSteps.includes(step.id);

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div
          onClick={() => toggleStepExpansion(step.id)}
          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                step.status === "completed"
                  ? "bg-green-100 text-green-600 border-green-300"
                  : step.status === "in-progress"
                    ? "bg-blue-100 text-blue-600 border-blue-300"
                    : step.status === "pending"
                      ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                      : "bg-gray-100 text-gray-600 border-gray-300",
              )}
            >
              {step.status === "completed" ? (
                <CheckCircle className="w-4 h-4" />
              ) : step.status === "in-progress" ? (
                <Play className="w-4 h-4" />
              ) : step.status === "pending" ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">
                {step.title}
              </h4>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(step.cost)}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
              <div>
                <span className="text-gray-500">المدة:</span>
                <span className="text-gray-900 ml-1">{step.duration}</span>
              </div>
              {step.date && (
                <div>
                  <span className="text-gray-500">التاريخ:</span>
                  <span className="text-gray-900 ml-1">{step.date}</span>
                </div>
              )}
            </div>
            {step.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500">ملاحظات:</span>
                <p className="text-xs text-gray-700 mt-1">{step.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            خطط العلاج
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="p-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: "all", label: "الكل", count: sampleTreatmentPlans.length },
            {
              id: "active",
              label: "نشط",
              count: sampleTreatmentPlans.filter((p) => p.status === "active")
                .length,
            },
            {
              id: "completed",
              label: "مكتمل",
              count: sampleTreatmentPlans.filter(
                (p) => p.status === "completed",
              ).length,
            },
            {
              id: "paused",
              label: "متوقف",
              count: sampleTreatmentPlans.filter((p) => p.status === "paused")
                .length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                filterStatus === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  filterStatus === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-white text-gray-600",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Metrics */}
      {showMetrics && <ProgressMetricsGrid />}

      {/* Treatment Plans */}
      <div className="space-y-3">
        {filteredPlans.map((plan) => (
          <TreatmentPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Detailed Plan Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {selectedPlan.avatar ? (
                  <img
                    src={selectedPlan.avatar}
                    alt={selectedPlan.patientName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPlan.patientName}
                  </h2>
                  <p className="text-sm text-gray-600">{selectedPlan.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Progress Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  تقدم العلاج
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      التقدم الإجمالي
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedPlan.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedPlan.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>بدء: {selectedPlan.startDate}</span>
                    <span>متوقع الانتهاء: {selectedPlan.estimatedEndDate}</span>
                  </div>
                </div>
              </div>

              {/* Financial Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  المعلومات المالية
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(selectedPlan.paidAmount)}
                    </div>
                    <div className="text-xs text-green-600">مدفوع</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-blue-700">
                      {formatCurrency(
                        selectedPlan.totalCost - selectedPlan.paidAmount,
                      )}
                    </div>
                    <div className="text-xs text-blue-600">متبقي</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-gray-700">
                      {formatCurrency(selectedPlan.totalCost)}
                    </div>
                    <div className="text-xs text-gray-600">إجمالي</div>
                  </div>
                </div>
              </div>

              {/* Treatment Steps */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  خطوات العلاج
                </h3>
                <div className="space-y-2">
                  {selectedPlan.steps.map((step) => (
                    <TreatmentStepCard
                      key={step.id}
                      step={step}
                      planId={selectedPlan.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  تحديث الخطة
                </button>
                <button className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  طباعة
                </button>
                <button className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  مشاركة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
