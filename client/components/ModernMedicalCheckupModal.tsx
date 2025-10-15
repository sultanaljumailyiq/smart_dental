import React, { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Brain,
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Eye,
  ClipboardCheck,
  Save,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  Camera,
  Upload,
  Clock,
  Star,
  Zap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { toast } from "sonner";

interface ModernMedicalCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    name: string;
    id: string;
    avatar: string;
    age: number;
    phone: string;
    email: string;
  };
  onSave?: (data: any) => void;
}

const steps = [
  {
    id: 1,
    title: "البيانات الطبية",
    subtitle: "المعلومات الصحية الأساسية",
    icon: FileText,
    color: "from-blue-500 to-indigo-500",
    description: "سجل البيانات الطبية والتاريخ المرضي",
  },
  {
    id: 2,
    title: "الخطة العلاجية",
    subtitle: "تخطيط وإجراءات العلاج",
    icon: Stethoscope,
    color: "from-green-500 to-emerald-500",
    description: "وضع خطة علاجية مفصلة",
  },
  {
    id: 3,
    title: "الفحص الفموي",
    subtitle: "فحص شامل للفم والأسنان",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    description: "تسجيل نتائج الفحص السريري",
  },
  {
    id: 4,
    title: "اعتماد الخطة",
    subtitle: "مراجعة وموافقة العلاج",
    icon: ClipboardCheck,
    color: "from-orange-500 to-red-500",
    description: "اعتماد الخطة العلاجية النهائية",
  },
];

const ModernMedicalCheckupModal = ({
  isOpen,
  onClose,
  patient,
  onSave,
}: ModernMedicalCheckupModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [medicalData, setMedicalData] = useState({
    bloodPressure: { systolic: "120", diastolic: "80" },
    heartRate: "72",
    temperature: "36.5",
    conditions: {
      heartDisease: false,
      covid19: false,
      hemophilia: false,
      hepatitis: false,
      osteoporosis: false,
      diabetes: false,
      otherDisease: false,
    },
    allergies: "",
    medications: "",
    notes: "",
  });

  // حفظ البيانات في ملف المريض
  const handleSaveMedicalData = async () => {
    if (!patient) return;

    setIsSaving(true);
    try {
      // تحديث بيانات المريض
      await sharedClinicData.updatePatient(patient.id, {
        medicalHistory: [
          ...Object.entries(medicalData.conditions)
            .filter(([_, value]) => value)
            .map(([key, _]) => {
              const conditionNames: Record<string, string> = {
                heartDisease: "أمراض القلب",
                diabetes: "السكري",
                covid19: "كوفيد-19",
                hemophilia: "الهيموفيليا",
                hepatitis: "الالتهاب الكبدي",
                osteoporosis: "هشاشة العظام",
              };
              return conditionNames[key] || key;
            }),
          medicalData.allergies ? `حساسية: ${medicalData.allergies}` : "",
          medicalData.medications ? `أدوية: ${medicalData.medications}` : "",
        ].filter(Boolean),
        notes: `
ضغط الدم: ${medicalData.bloodPressure.systolic}/${medicalData.bloodPressure.diastolic} mmHg
النبض: ${medicalData.heartRate} BPM
الحرارة: ${medicalData.temperature}°C
${medicalData.notes ? `ملاحظات: ${medicalData.notes}` : ""}
        `.trim(),
      });

      if (onSave) {
        onSave(medicalData);
      }

      toast.success("تم حفظ البيانات الطبية بنجاح");
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Patient Info Card - Mobile First */}
            {patient && (
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

                <div className="relative z-10">
                  {/* Avatar and Name - Centered on Mobile */}
                  <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:items-start md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl border-2 md:border-4 border-white/30">
                      {patient.avatar}
                    </div>
                    <div className="text-center md:text-right">
                      <h3 className="text-xl md:text-2xl font-bold mb-1">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-white/80 justify-center md:justify-start">
                        <User className="w-4 h-4" />
                        <span>{patient.age} سنة</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info - Stacked on Mobile */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-white" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs">الهاتف</p>
                          <p className="font-semibold text-sm truncate">{patient.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-white" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs">البريد</p>
                          <p className="font-semibold text-sm truncate">{patient.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white" />
                          <div>
                            <p className="text-white/80 text-xs">تاريخ الزيارة</p>
                            <p className="font-semibold text-sm">
                              {new Date().toLocaleDateString("ar-IQ")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-xs">رقم الملف</p>
                          <p className="font-bold">#{patient.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vital Signs - Mobile First Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Pressure */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">ضغط الدم</h4>
                    <p className="text-sm text-gray-600">Systolic / Diastolic</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={medicalData.bloodPressure.systolic}
                    onChange={(e) =>
                      setMedicalData({
                        ...medicalData,
                        bloodPressure: {
                          ...medicalData.bloodPressure,
                          systolic: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="120"
                  />
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                  <input
                    type="number"
                    value={medicalData.bloodPressure.diastolic}
                    onChange={(e) =>
                      setMedicalData({
                        ...medicalData,
                        bloodPressure: {
                          ...medicalData.bloodPressure,
                          diastolic: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="80"
                  />
                </div>

                <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs text-red-700 text-center">
                    القيم الطبيعية: 120/80 mmHg
                  </p>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">النبض</h4>
                    <p className="text-xs text-gray-600">BPM</p>
                  </div>
                </div>

                <input
                  type="number"
                  value={medicalData.heartRate}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      heartRate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="72"
                />

                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 text-center">60-100 طبيعي</p>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">الحرارة</h4>
                    <p className="text-xs text-gray-600">°C</p>
                  </div>
                </div>

                <input
                  type="number"
                  step="0.1"
                  value={medicalData.temperature}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      temperature: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="36.5"
                />

                <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-xs text-orange-700 text-center">36-37.5°C طبيعي</p>
                </div>
              </div>
            </div>

            {/* Medical Conditions - Mobile Optimized */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">الحالات المرضية</h4>
                  <p className="text-xs text-gray-600">تاريخ الأمراض</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: "heartDisease",
                    label: "أمراض القلب",
                    icon: Heart,
                    color: "from-red-500 to-pink-500",
                    bgColor: "bg-red-50",
                    textColor: "text-red-700",
                  },
                  {
                    key: "diabetes",
                    label: "السكري",
                    icon: Pill,
                    color: "from-blue-500 to-indigo-500",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-700",
                  },
                  {
                    key: "covid19",
                    label: "كوفيد-19",
                    icon: Shield,
                    color: "from-purple-500 to-indigo-500",
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-700",
                  },
                  {
                    key: "hemophilia",
                    label: "الهيموفيليا",
                    icon: Activity,
                    color: "from-green-500 to-emerald-500",
                    bgColor: "bg-green-50",
                    textColor: "text-green-700",
                  },
                  {
                    key: "hepatitis",
                    label: "الالتهاب الكبدي",
                    icon: AlertTriangle,
                    color: "from-yellow-500 to-orange-500",
                    bgColor: "bg-yellow-50",
                    textColor: "text-yellow-700",
                  },
                  {
                    key: "osteoporosis",
                    label: "هشاشة العظام",
                    icon: User,
                    color: "from-gray-500 to-gray-600",
                    bgColor: "bg-gray-50",
                    textColor: "text-gray-700",
                  },
                ].map((condition) => {
                  const IconComponent = condition.icon;
                  const isChecked =
                    medicalData.conditions[
                      condition.key as keyof typeof medicalData.conditions
                    ];

                  return (
                    <label
                      key={condition.key}
                      className={cn(
                        "flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all active:scale-95",
                        isChecked
                          ? `${condition.bgColor} border-current ${condition.textColor}`
                          : "border-gray-200 active:border-gray-300"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setMedicalData({
                            ...medicalData,
                            conditions: {
                              ...medicalData.conditions,
                              [condition.key]: e.target.checked,
                            },
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                          isChecked
                            ? `bg-gradient-to-r ${condition.color} text-white`
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span
                        className={cn(
                          "mr-3 font-semibold text-sm",
                          isChecked ? condition.textColor : "text-gray-900"
                        )}
                      >
                        {condition.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Allergies and Medications */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">الحساسيات</h4>
                    <p className="text-xs text-gray-600">الحساسيات المعروفة</p>
                  </div>
                </div>
                <textarea
                  value={medicalData.allergies}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      allergies: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                  placeholder="اكتب أي حساسيات معروفة..."
                />
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">الأدوية الحالية</h4>
                    <p className="text-xs text-gray-600">الأدوية الموصوفة</p>
                  </div>
                </div>
                <textarea
                  value={medicalData.medications}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      medications: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  placeholder="اذكر الأدوية التي يتناولها المريض..."
                />
              </div>
            </div>

            {/* Save Button - Mobile Optimized */}
            <button
              onClick={handleSaveMedicalData}
              disabled={isSaving}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "جاري الحفظ..." : "حفظ البيانات الطبية"}
            </button>

            {/* Navigation Buttons - Mobile Optimized */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200 bg-gray-100 active:scale-95"
                )}
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </button>

              <div className="flex items-center gap-1.5">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index + 1 === currentStep
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 w-6"
                        : index + 1 < currentStep
                        ? "bg-green-500 w-2"
                        : "bg-gray-300 w-2"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95"
              >
                التالي
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">هذه الخطوة قيد التطوير</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Mobile Optimized */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {React.createElement(currentStepData.icon, {
                  className: "w-5 h-5 md:w-6 md:h-6 text-white",
                })}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-xs md:text-sm text-blue-100">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default ModernMedicalCheckupModal;
