import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, X, AlertCircle, FlaskConical } from "lucide-react";

interface ToothData {
  number: number;
  condition?: string;
  treatment?: string;
  needsLab?: boolean;
  notes?: string;
}

interface InteractiveDentalChartProps {
  onToothSelect?: (toothNumber: number, data: ToothData) => void;
  selectedTeeth?: ToothData[];
}

const toothConditions = [
  { id: "healthy", label: "سليم", color: "bg-white", icon: "✓" },
  { id: "cavity", label: "تسوس", color: "bg-red-200", icon: "●" },
  { id: "filling", label: "حشوة", color: "bg-blue-200", icon: "■" },
  { id: "crown", label: "تاج", color: "bg-yellow-200", icon: "◆" },
  { id: "root_canal", label: "علاج جذور", color: "bg-purple-200", icon: "▲" },
  { id: "extraction", label: "خلع", color: "bg-gray-300", icon: "✕" },
  { id: "implant", label: "زراعة", color: "bg-green-200", icon: "◉" },
  { id: "missing", label: "مفقود", color: "bg-gray-400", icon: "○" },
  { id: "bridge", label: "جسر", color: "bg-orange-200", icon: "═" },
];

const treatmentPlans: Record<string, { treatment: string; needsLab: boolean }> = {
  cavity: { treatment: "حشوة تجميلية", needsLab: false },
  filling: { treatment: "استبدال الحشوة", needsLab: false },
  crown: { treatment: "تركيب تاج", needsLab: true },
  root_canal: { treatment: "علاج عصب", needsLab: false },
  extraction: { treatment: "خلع السن", needsLab: false },
  implant: { treatment: "زراعة سن", needsLab: true },
  missing: { treatment: "تعويض السن", needsLab: true },
  bridge: { treatment: "تركيب جسر", needsLab: true },
  healthy: { treatment: "متابعة دورية", needsLab: false },
};

const InteractiveDentalChart: React.FC<InteractiveDentalChartProps> = ({
  onToothSelect,
  selectedTeeth = [],
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");

  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const getToothData = (toothNumber: number): ToothData | undefined => {
    return selectedTeeth.find((t) => t.number === toothNumber);
  };

  const getToothColor = (toothNumber: number): string => {
    const toothData = getToothData(toothNumber);
    if (!toothData || !toothData.condition) return "bg-white";
    
    const condition = toothConditions.find((c) => c.id === toothData.condition);
    return condition?.color || "bg-white";
  };

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const existingData = getToothData(toothNumber);
    setSelectedCondition(existingData?.condition || "");
    setNotes(existingData?.notes || "");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!selectedTooth || !selectedCondition) return;

    const treatmentData = treatmentPlans[selectedCondition];
    const toothData: ToothData = {
      number: selectedTooth,
      condition: selectedCondition,
      treatment: treatmentData.treatment,
      needsLab: treatmentData.needsLab,
      notes: notes,
    };

    onToothSelect?.(selectedTooth, toothData);
    setShowModal(false);
    setSelectedTooth(null);
    setSelectedCondition("");
    setNotes("");
  };

  const renderTooth = (toothNumber: number, isUpper: boolean = true) => {
    const toothData = getToothData(toothNumber);
    const color = getToothColor(toothNumber);
    const hasCondition = toothData && toothData.condition;

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
        {toothData?.needsLab && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <FlaskConical className="w-3 h-3 text-white" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          دليل الحالات
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {toothConditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded border border-gray-300", condition.color)} />
              <span className="text-sm text-gray-700">{condition.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
          <FlaskConical className="w-4 h-4" />
          <span>الأيقونة البرتقالية تشير إلى الحاجة للمختبر</span>
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
            الفك العلوي (Adult)
          </div>
          <div className="flex justify-center gap-1">
            {upperTeeth.map((tooth) => renderTooth(tooth, true))}
          </div>
        </div>

        {/* Lower Teeth */}
        <div>
          <div className="text-sm font-medium text-gray-600 mb-3 text-center">
            الفك السفلي (Adult)
          </div>
          <div className="flex justify-center gap-1">
            {lowerTeeth.map((tooth) => renderTooth(tooth, false))}
          </div>
        </div>
      </div>

      {/* Treatment Summary */}
      {selectedTeeth.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">ملخص العلاج المخطط</h4>
          <div className="space-y-3">
            {selectedTeeth.map((tooth) => (
              <div
                key={tooth.number}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">
                    {tooth.number}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tooth.treatment}</p>
                    <p className="text-sm text-gray-600">
                      الحالة: {toothConditions.find((c) => c.id === tooth.condition)?.label}
                    </p>
                  </div>
                </div>
                {tooth.needsLab && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-sm font-medium">يحتاج مختبر</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedTeeth.some((t) => t.needsLab) && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">تذكير: اتصال بالمختبر مطلوب</p>
                  <p className="text-sm text-orange-700 mt-1">
                    بعض العلاجات تتطلب تنسيق مع المختبر. يرجى التواصل مع المختبر لترتيب
                    العمل المخبري.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selection Modal */}
      {showModal && selectedTooth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 m-4">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">السن رقم {selectedTooth}</h3>
                  <p className="text-blue-100">تحديد حالة السن وخطة العلاج</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  حالة السن
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {toothConditions.map((condition) => (
                    <button
                      key={condition.id}
                      onClick={() => setSelectedCondition(condition.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        selectedCondition === condition.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300",
                        condition.color
                      )}
                    >
                      <div className="text-2xl mb-2">{condition.icon}</div>
                      <div className="text-sm font-medium text-gray-900">
                        {condition.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCondition && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">خطة العلاج المقترحة:</h4>
                  <p className="text-blue-800">{treatmentPlans[selectedCondition]?.treatment}</p>
                  {treatmentPlans[selectedCondition]?.needsLab && (
                    <div className="mt-2 flex items-center gap-2 text-orange-700">
                      <FlaskConical className="w-4 h-4" />
                      <span className="text-sm">يتطلب عمل مخبري</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="أضف ملاحظات حول حالة السن..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={!selectedCondition}
                  className={cn(
                    "flex-1 py-3 px-6 rounded-xl font-medium transition-all",
                    selectedCondition
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  حفظ
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDentalChart;
