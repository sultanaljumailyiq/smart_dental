import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Plus,
  X,
  AlertCircle,
  FlaskConical,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign,
  Printer,
  Check,
  Clock,
  Activity,
  ChevronRight,
} from "lucide-react";
import type {
  ToothData,
  ToothCondition,
  TreatmentType,
  ToothTreatment,
  TreatmentStatus,
  CrownMaterial,
  TreatmentPrognosis,
  TreatmentSuggestion,
} from "@/types/dental";
import { patientDentalService } from "@/services/patientDentalService";

interface EnhancedDentalChartProps {
  patientId: string;
  patientName?: string;
}

const toothConditions: { id: ToothCondition; label: string; color: string }[] = [
  { id: "present", label: "موجود", color: "bg-white" },
  { id: "healthy", label: "سليم", color: "bg-green-100" },
  { id: "absent", label: "غائب", color: "bg-gray-400" },
  { id: "missing", label: "مفقود", color: "bg-gray-300" },
  { id: "calculus", label: "جير", color: "bg-yellow-300" },
  { id: "decayed", label: "متسوس", color: "bg-red-300" },
  { id: "cavity", label: "تجويف", color: "bg-red-200" },
  { id: "colored", label: "ملون", color: "bg-amber-200" },
  { id: "fractured", label: "مكسور", color: "bg-red-400" },
  { id: "mobile", label: "متحرك", color: "bg-orange-300" },
  { id: "abnormal_shape", label: "شكل غير طبيعي", color: "bg-purple-200" },
  { id: "abnormal_position", label: "موضع غير طبيعي", color: "bg-pink-200" },
];

const treatmentStates: { id: "filling" | "crown" | "root_canal" | "extraction" | "implant" | "bridge"; label: string; color: string }[] = [
  { id: "filling", label: "حشوة", color: "bg-blue-200" },
  { id: "crown", label: "تاج", color: "bg-yellow-200" },
  { id: "root_canal", label: "علاج جذور", color: "bg-purple-300" },
  { id: "extraction", label: "خلع", color: "bg-red-200" },
  { id: "implant", label: "زراعة", color: "bg-green-200" },
  { id: "bridge", label: "جسر", color: "bg-orange-200" },
];

const treatmentTypes: { id: TreatmentType; label: string }[] = [
  { id: "scaling", label: "تنظيف الجير" },
  { id: "polishing", label: "تلميع" },
  { id: "simple_restoration", label: "حشوة بسيطة" },
  { id: "complex_restoration", label: "حشوة معقدة" },
  { id: "inlay", label: "إنلاي" },
  { id: "onlay", label: "أونلاي" },
  { id: "crown", label: "تاج" },
  { id: "extraction", label: "خلع" },
  { id: "orthodontic", label: "تقويم" },
  { id: "implant", label: "زراعة" },
  { id: "endodontic", label: "علاج عصب" },
];

const crownMaterials: { id: CrownMaterial; label: string }[] = [
  { id: "porcelain", label: "بورسلين" },
  { id: "zirconia", label: "زيركونيا" },
  { id: "metal", label: "معدني" },
  { id: "pfm", label: "PFM (معدن مع بورسلين)" },
];

export default function EnhancedDentalChart({ patientId, patientName = "المريض" }: EnhancedDentalChartProps) {
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [showSideDialog, setShowSideDialog] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<ToothCondition>("present");
  const [selectedTreatmentState, setSelectedTreatmentState] = useState<"filling" | "crown" | "root_canal" | "extraction" | "implant" | "bridge" | "">("");
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentType | "">("");
  const [notes, setNotes] = useState("");
  const [prognosis, setPrognosis] = useState<TreatmentPrognosis[]>([]);
  const [suggestions, setSuggestions] = useState<TreatmentSuggestion[]>([]);

  // Endodontic specific fields
  const [numberOfRoots, setNumberOfRoots] = useState(1);
  const [numberOfCanals, setNumberOfCanals] = useState(1);
  const [canalDetails, setCanalDetails] = useState<{ canalNumber: number; workingLength: string; filesUsed: string }[]>([]);

  // Crown specific fields
  const [crownMaterial, setCrownMaterial] = useState<CrownMaterial>("zirconia");
  const [requiresPostAndCore, setRequiresPostAndCore] = useState(false);
  const [shade, setShade] = useState("");

  // Orthodontic specific fields
  const [durationMonths, setDurationMonths] = useState(12);
  const [problemDescription, setProblemDescription] = useState("");

  // Treatment cost and payment
  const [treatmentCost, setTreatmentCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Auto-generate canal details when number changes
  useEffect(() => {
    const newCanals: { canalNumber: number; workingLength: string; filesUsed: string }[] = [];
    for (let i = 1; i <= numberOfCanals; i++) {
      const existing = canalDetails.find(c => c.canalNumber === i);
      newCanals.push(existing || { canalNumber: i, workingLength: "", filesUsed: "" });
    }
    setCanalDetails(newCanals);
  }, [numberOfCanals]);

  // Calculate estimated visits based on treatment type
  const calculateEstimatedVisits = (treatmentType: TreatmentType): number => {
    switch (treatmentType) {
      case "endodontic":
        return Math.ceil(numberOfCanals / 2) + 1; // 1-2 canals = 2 visits, 3-4 canals = 3 visits, etc.
      case "crown":
        return requiresPostAndCore ? 3 : 2; // Post&Core adds a visit
      case "implant":
        return 3; // Surgery + healing check + crown
      case "orthodontic":
        return Math.ceil(durationMonths / 6); // 1 visit every 6 months
      case "complex_restoration":
        return 2;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const loadData = () => {
      const dentalRecord = patientDentalService.getPatientDentalRecord(patientId);
      if (dentalRecord) {
        setTeeth(dentalRecord.teeth);
        setPrognosis(dentalRecord.prognosis);
        setSuggestions(dentalRecord.treatmentSuggestions);
      }
    };

    loadData();
    const unsubscribe = patientDentalService.subscribe(patientId, loadData);
    return unsubscribe;
  }, [patientId]);

  const getToothData = (toothNumber: number): ToothData | undefined => {
    return teeth.find((t) => t.number === toothNumber);
  };

  const getToothColor = (toothNumber: number): string => {
    const toothData = getToothData(toothNumber);
    if (!toothData) return "bg-white";
    const condition = toothConditions.find((c) => c.id === toothData.condition);
    return condition?.color || "bg-white";
  };

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const existingData = getToothData(toothNumber);
    setSelectedCondition(existingData?.condition || "present");
    setSelectedTreatmentState(existingData?.treatmentState || "");
    setNotes(existingData?.notes || "");
    setSelectedTreatment("");
    setShowSideDialog(true);
  };

  const handleSaveTooth = () => {
    if (!selectedTooth) return;

    patientDentalService.updateToothData(patientId, selectedTooth, {
      number: selectedTooth,
      condition: selectedCondition,
      treatmentState: selectedTreatmentState || undefined,
      treatments: getToothData(selectedTooth)?.treatments || [],
      notes: notes,
      lastUpdated: new Date().toISOString(),
    });

    setShowSideDialog(false);
  };

  const handleAddTreatment = () => {
    if (!selectedTooth || !selectedTreatment) return;

    const needsLab = ["crown", "implant", "inlay", "onlay"].includes(selectedTreatment);
    const estimatedVisits = calculateEstimatedVisits(selectedTreatment);

    const treatment: ToothTreatment = {
      id: `T${Date.now()}`,
      type: selectedTreatment,
      status: "consultation",
      progress: 0,
      startDate: new Date().toISOString(),
      cost: treatmentCost,
      paid: paidAmount,
      notes: notes,
      needsLab,
      estimatedVisits,
    };

    if (selectedTreatment === "endodontic") {
      treatment.endodonticDetails = {
        numberOfRoots,
        numberOfCanals,
        canals: canalDetails.map(canal => ({
          canalNumber: canal.canalNumber,
          workingLength: canal.workingLength,
          filesUsed: canal.filesUsed.split(",").map((f) => f.trim()).filter(f => f.length > 0),
        })),
        estimatedVisits,
        visits: [],
      };
    }

    if (selectedTreatment === "crown") {
      treatment.crownDetails = {
        material: crownMaterial,
        requiresPostAndCore,
        shade,
      };
    }

    if (selectedTreatment === "orthodontic") {
      treatment.orthodonticDetails = {
        durationMonths,
        problemDescription,
        startDate: new Date().toISOString(),
        estimatedEndDate: new Date(
          Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        progress: 0,
      };
    }

    patientDentalService.addTreatment(patientId, selectedTooth, treatment, patientName);

    // Save prognosis for treatment tracking
    const prognosis: TreatmentPrognosis = {
      toothNumber: selectedTooth,
      treatmentId: treatment.id,
      currentStep: "consultation",
      stepsCompleted: 0,
      totalSteps: estimatedVisits,
      progressPercentage: 0,
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      estimatedCompletion: new Date(Date.now() + estimatedVisits * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    patientDentalService.updatePrognosis(patientId, prognosis, patientName);

    // Reset form
    setSelectedTreatment("");
    setTreatmentCost(0);
    setPaidAmount(0);
    setNotes("");
    setCanalDetails([{ canalNumber: 1, workingLength: "", filesUsed: "" }]);
    setNumberOfCanals(1);
    setNumberOfRoots(1);
  };

  const renderTooth = (toothNumber: number) => {
    const toothData = getToothData(toothNumber);
    const color = getToothColor(toothNumber);
    const hasCondition = toothData && toothData.condition !== "present";
    const hasTreatment = toothData && toothData.treatments.length > 0;

    return (
      <button
        key={toothNumber}
        onClick={() => handleToothClick(toothNumber)}
        className={cn(
          "relative w-12 h-16 rounded-lg border-2 border-gray-300 transition-all hover:scale-110 hover:shadow-lg",
          color,
          hasCondition && "ring-2 ring-blue-400",
          selectedTooth === toothNumber && "ring-4 ring-blue-600 scale-110"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-bold text-gray-700">{toothNumber}</div>
        </div>
        {hasTreatment && toothData.treatments.some((t) => t.needsLab) && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <FlaskConical className="w-3 h-3 text-white" />
          </div>
        )}
        {hasTreatment && (
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </button>
    );
  };

  const getPrognosisForTooth = (toothNumber: number) => {
    return prognosis.filter((p) => p.toothNumber === toothNumber);
  };

  const getSuggestionsForTooth = (toothNumber: number) => {
    return suggestions.filter((s) => s.toothNumber === toothNumber);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          دليل الحالات
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {toothConditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded border border-gray-300", condition.color)} />
              <span className="text-sm text-gray-700">{condition.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dental Chart */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          مخطط الأسنان التفاعلي
        </h3>

        {/* Upper Teeth */}
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-600 mb-3 text-center">
            الفك العلوي
          </div>
          <div className="flex justify-center gap-1">
            {upperTeeth.map((tooth) => renderTooth(tooth))}
          </div>
        </div>

        {/* Lower Teeth */}
        <div>
          <div className="text-sm font-medium text-gray-600 mb-3 text-center">
            الفك السفلي
          </div>
          <div className="flex justify-center gap-1">
            {lowerTeeth.map((tooth) => renderTooth(tooth))}
          </div>
        </div>
      </div>

      {/* Treatment Prognosis Cards */}
      {prognosis.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            تقدم العلاج
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {prognosis.map((prog) => (
              <div key={`${prog.toothNumber}-${prog.treatmentId}`} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {prog.toothNumber}
                    </div>
                    <span className="font-medium text-gray-900">{prog.currentStep}</span>
                  </div>
                  <span className="text-sm text-green-700 font-medium">{prog.progressPercentage}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${prog.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    {prog.stepsCompleted} من {prog.totalSteps} خطوة مكتملة
                  </div>
                  {prog.progressPercentage < 100 && (
                    <button
                      onClick={() => {
                        patientDentalService.completeStep(
                          patientId,
                          prog.toothNumber,
                          prog.treatmentId,
                          patientName
                        );
                        // Reload prognosis
                        const dentalRecord = patientDentalService.getPatientDentalRecord(patientId);
                        if (dentalRecord) {
                          setPrognosis(dentalRecord.prognosis);
                        }
                      }}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      إضافة خطوة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            توصيات العلاج
          </h4>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "p-4 rounded-xl border-r-4",
                  suggestion.priority === "urgent" && "bg-red-50 border-red-500",
                  suggestion.priority === "high" && "bg-orange-50 border-orange-500",
                  suggestion.priority === "medium" && "bg-yellow-50 border-yellow-500",
                  suggestion.priority === "low" && "bg-blue-50 border-blue-500"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">السن {suggestion.toothNumber}</span>
                      <span className="text-sm text-gray-600">
                        {treatmentTypes.find((t) => t.id === suggestion.suggestedTreatment)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">التكلفة التقديرية: {suggestion.estimatedCost.toLocaleString()} د.ع</p>
                  </div>
                  {suggestion.aiGenerated && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side Dialog */}
      {showSideDialog && selectedTooth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end" onClick={() => setShowSideDialog(false)}>
          <div
            className="bg-white w-full md:w-[600px] h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">السن رقم {selectedTooth}</h3>
                  <p className="text-blue-100">فحص وتخطيط العلاج</p>
                </div>
                <button
                  onClick={() => setShowSideDialog(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Section 1: Tooth Condition */}
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  حالة السن (التشخيص)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {toothConditions.map((condition) => (
                    <button
                      key={condition.id}
                      onClick={() => setSelectedCondition(condition.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-sm",
                        selectedCondition === condition.id
                          ? "border-blue-600 bg-blue-100 font-bold"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      {condition.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 1.5: Treatment State (Already Done) */}
              {selectedCondition !== "healthy" && selectedCondition !== "present" && (
                <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                  <h4 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    حالة العلاج السابقة
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {treatmentStates.map((state) => (
                      <button
                        key={state.id}
                        onClick={() => setSelectedTreatmentState(state.id)}
                        className={cn(
                          "p-2 rounded-xl border-2 transition-all text-sm",
                          selectedTreatmentState === state.id
                            ? "border-purple-600 bg-purple-100 font-bold"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                      >
                        {state.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedTreatmentState("")}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-800"
                  >
                    مسح الحالة
                  </button>
                </div>
              )}

              {/* Section 2: Treatment Needed */}
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  العلاج المطلوب
                </h4>
                <select
                  value={selectedTreatment}
                  onChange={(e) => setSelectedTreatment(e.target.value as TreatmentType)}
                  className="w-full px-4 py-3 bg-white border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                >
                  <option value="">اختر نوع العلاج</option>
                  {treatmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                {/* Display Estimated Visits */}
                {selectedTreatment && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        عدد الزيارات المتوقعة:
                      </span>
                      <span className="text-xl font-bold text-green-700">
                        {calculateEstimatedVisits(selectedTreatment)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Endodontic Details */}
              {selectedTreatment === "endodontic" && (
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 space-y-4">
                  <h5 className="font-bold text-purple-900 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    تفاصيل علاج العصب
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">عدد الجذور</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={numberOfRoots}
                        onChange={(e) => setNumberOfRoots(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">عدد القنوات</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={numberOfCanals}
                        onChange={(e) => setNumberOfCanals(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  {/* Individual Canal Working Lengths */}
                  <div className="space-y-3">
                    <h6 className="text-sm font-semibold text-purple-900 border-b border-purple-300 pb-1">
                      طول العمل لكل قناة (Working Length)
                    </h6>
                    {canalDetails.map((canal, index) => (
                      <div key={canal.canalNumber} className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="font-medium text-sm text-purple-800 mb-2">
                          القناة {canal.canalNumber}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">طول العمل (mm)</label>
                            <input
                              type="text"
                              value={canal.workingLength}
                              onChange={(e) => {
                                const updated = [...canalDetails];
                                updated[index].workingLength = e.target.value;
                                setCanalDetails(updated);
                              }}
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm"
                              placeholder="22mm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">الملفات المستخدمة</label>
                            <input
                              type="text"
                              value={canal.filesUsed}
                              onChange={(e) => {
                                const updated = [...canalDetails];
                                updated[index].filesUsed = e.target.value;
                                setCanalDetails(updated);
                              }}
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm"
                              placeholder="15,20,25"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crown Details */}
              {selectedTreatment === "crown" && (
                <div className="p-4 bg-yellow-50 rounded-xl space-y-3">
                  <h5 className="font-semibold text-yellow-900">تفاصيل التاج</h5>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">المادة</label>
                    <select
                      value={crownMaterial}
                      onChange={(e) => setCrownMaterial(e.target.value as CrownMaterial)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                    >
                      {crownMaterials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requiresPostAndCore}
                        onChange={(e) => setRequiresPostAndCore(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">يحتاج Post & Core</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">اللون (Shade)</label>
                    <input
                      type="text"
                      value={shade}
                      onChange={(e) => setShade(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                      placeholder="مثال: A2"
                    />
                  </div>
                </div>
              )}

              {/* Orthodontic Details */}
              {selectedTreatment === "orthodontic" && (
                <div className="p-4 bg-pink-50 rounded-xl space-y-3">
                  <h5 className="font-semibold text-pink-900">تفاصيل التقويم</h5>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">المدة المتوقعة (شهر)</label>
                    <input
                      type="number"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">وصف المشكلة</label>
                    <textarea
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg resize-none"
                      rows={2}
                      placeholder="مثال: ازدحام أسنان، سوء إطباق..."
                    />
                  </div>
                </div>
              )}

              {/* Cost and Payment */}
              {selectedTreatment && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">التكلفة (د.ع)</label>
                    <input
                      type="number"
                      value={treatmentCost}
                      onChange={(e) => setTreatmentCost(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">المدفوع (د.ع)</label>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">ملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="أضف ملاحظات..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveTooth}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  حفظ حالة السن
                </button>
                {selectedTreatment && (
                  <button
                    onClick={handleAddTreatment}
                    className="w-full py-3 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة خطة علاج
                  </button>
                )}
              </div>

              {/* Current Treatments */}
              {getToothData(selectedTooth)?.treatments && getToothData(selectedTooth)!.treatments.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3">العلاجات الحالية</h5>
                  <div className="space-y-2">
                    {getToothData(selectedTooth)!.treatments.map((treatment) => (
                      <div key={treatment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {treatmentTypes.find((t) => t.id === treatment.type)?.label}
                          </span>
                          <span className="text-xs text-gray-500">{treatment.status}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{treatment.cost.toLocaleString()} د.ع</span>
                          <span>مدفوع: {treatment.paid.toLocaleString()} د.ع</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
