import React, { useState } from "react";
import {
  X,
  Plus,
  Calendar,
  Phone,
  User,
  Crown,
  FlaskConical,
  Clock,
  FileText,
  Bell,
  Search,
  Building2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  lastVisit: string;
}

interface LabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string; // When called from patient details
}

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string; // When creating reminder for specific order
}

// Mock patients data
const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "أحمد محمد علي",
    phone: "07701234567",
    age: 35,
    lastVisit: "2024-01-10",
  },
  {
    id: "P002",
    name: "فاطمة أحمد",
    phone: "07709876543",
    age: 28,
    lastVisit: "2024-01-08",
  },
  {
    id: "P003",
    name: "محمد سالم",
    phone: "07701111222",
    age: 42,
    lastVisit: "2024-01-05",
  },
  {
    id: "P004",
    name: "سارة حسن",
    phone: "07703333444",
    age: 31,
    lastVisit: "2024-01-12",
  },
];

// Treatment types for dental labs
const treatmentTypes = [
  { id: "crown", name: "تاج أسنان", category: "fixed" },
  { id: "bridge", name: "جسر أسنان", category: "fixed" },
  { id: "partial_denture", name: "طقم أسنان جزئي", category: "removable" },
  { id: "complete_denture", name: "طقم أسنان كامل", category: "removable" },
  { id: "veneer", name: "قشرة أسنان", category: "aesthetic" },
  { id: "implant_crown", name: "تاج زراعة", category: "implant" },
  { id: "orthodontic", name: "تقويم أسنان", category: "orthodontic" },
  { id: "night_guard", name: "حارس ليلي", category: "appliance" },
];

// Dental labs
const dentalLabs = [
  {
    id: "lab1",
    name: "مختبر النخبة للأسنان",
    phone: "07701111111",
    rating: 4.8,
  },
  { id: "lab2", name: "مختبر الدقة", phone: "07702222222", rating: 4.5 },
  { id: "lab3", name: "مختبر التميز", phone: "07703333333", rating: 4.7 },
  { id: "lab4", name: "مختبر الإبداع", phone: "07704444444", rating: 4.6 },
];

export function NewLabOrderModal({
  isOpen,
  onClose,
  patientId,
}: LabOrderModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>(
    patientId || "",
  );
  const [patientSearch, setPatientSearch] = useState("");
  const [treatment, setTreatment] = useState("");
  const [tooth, setTooth] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("");
  const [shade, setShade] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  if (!isOpen) return null;

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch),
  );

  const selectedPatientData = mockPatients.find(
    (p) => p.id === selectedPatient,
  );

  const handleSubmit = () => {
    // Here you would submit the lab order
    console.log({
      patient: selectedPatient,
      treatment,
      tooth,
      lab: selectedLab,
      priority,
      expectedDate,
      notes,
      cost,
      shade,
      reminderDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                طلب مختبر جديد
              </h2>
              <p className="text-sm text-gray-600">إضافة طلب تركيبة للمختبر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                المريض *
              </label>
              {!patientId ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      placeholder="ابحث عن المريض..."
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-lg text-right transition-colors",
                          selectedPatient === patient.id
                            ? "border-purple-300 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {patient.phone} | العمر: {patient.age}
                          </div>
                        </div>
                        {selectedPatient === patient.id && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedPatientData?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedPatientData?.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Treatment and Tooth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  نوع العلاج *
                </label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">اختر نوع العلاج</option>
                  {treatmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  رقم/منطقة السن *
                </label>
                <input
                  type="text"
                  value={tooth}
                  onChange={(e) => setTooth(e.target.value)}
                  placeholder="مثال: رقم 14 أو الأسنان العلوية اليمنى"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lab Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                المختبر *
              </label>
              <div className="grid gap-2">
                {dentalLabs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => setSelectedLab(lab.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg text-right transition-colors",
                      selectedLab === lab.id
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {lab.name}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{lab.phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>★ {lab.rating}</span>
                        </span>
                      </div>
                    </div>
                    {selectedLab === lab.id && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority and Expected Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  الأولوية
                </label>
                <div className="flex gap-2">
                  {[
                    {
                      value: "low",
                      label: "منخفضة",
                      color: "bg-green-100 text-green-800",
                    },
                    {
                      value: "medium",
                      label: "متوسطة",
                      color: "bg-yellow-100 text-yellow-800",
                    },
                    {
                      value: "high",
                      label: "عالية",
                      color: "bg-orange-100 text-orange-800",
                    },
                    {
                      value: "urgent",
                      label: "عاجلة",
                      color: "bg-red-100 text-red-800",
                    },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value as any)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        priority === p.value
                          ? p.color
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  تاريخ التسليم المتوقع
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  التكلفة (د.ع)
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="مثال: 250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  اللون/الدرجة
                </label>
                <input
                  type="text"
                  value={shade}
                  onChange={(e) => setShade(e.target.value)}
                  placeholder="مثال: A2, B1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reminder Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                تاريخ التذكير (اختياري)
              </label>
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                سيتم إنشاء تذكير تلقائي للاتصال بالمختبر في هذا التاريخ
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ملاحظات إضافية
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="أي تفاصيل أو تعليمات إضافية للمختبر..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 lg:p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || !treatment || !tooth || !selectedLab}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 ml-2" />
            إرسال الطلب
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NewReminderModal({
  isOpen,
  onClose,
  orderId,
}: ReminderModalProps) {
  const [reminderType, setReminderType] = useState<
    "call" | "visit" | "check" | "followup"
  >("call");
  const [scheduledDate, setScheduledDate] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedOrder, setSelectedOrder] = useState(orderId || "");

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({
      type: reminderType,
      scheduledDate,
      message,
      priority,
      orderId: selectedOrder,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">تذكير جديد</h2>
              <p className="text-sm text-gray-600">إضافة تذكير للمختبر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-4">
          {/* Reminder Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              نوع التذكير
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "call", label: "اتصال", icon: Phone },
                { value: "visit", label: "زيارة", icon: Building2 },
                { value: "check", label: "فحص", icon: CheckCircle },
                { value: "followup", label: "متابعة", icon: Clock },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setReminderType(type.value as any)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                      reminderType === type.value
                        ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              التاريخ والوقت
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              رسالة التذكير
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="مثال: الاتصال بمختبر النخبة للسؤال عن حالة التاج للمريض أحمد محمد"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              الأولوية
            </label>
            <div className="flex gap-2">
              {[
                {
                  value: "low",
                  label: "منخفضة",
                  color: "bg-green-100 text-green-800",
                },
                {
                  value: "medium",
                  label: "متوسطة",
                  color: "bg-yellow-100 text-yellow-800",
                },
                {
                  value: "high",
                  label: "عالية",
                  color: "bg-red-100 text-red-800",
                },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value as any)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    priority === p.value
                      ? p.color
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 lg:p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!scheduledDate || !message}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Bell className="w-4 h-4 ml-2" />
            إنشاء التذكير
          </Button>
        </div>
      </div>
    </div>
  );
}
