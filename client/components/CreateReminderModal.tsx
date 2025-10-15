import React, { useState } from "react";
import { X, Bell, Calendar, Pill, UserCheck, FlaskConical, DollarSign, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reminder: {
    title: string;
    description: string;
    reminderTime: string;
    reminderType: string;
    toStaffId: number;
  }) => void;
  staffMembers: { id: number; name: string; role: string }[];
}

const REMINDER_TYPES = [
  { value: "appointment", label: "موعد", icon: Calendar, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300", activeBg: "bg-rose-100" },
  { value: "medication", label: "دواء", icon: Pill, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300", activeBg: "bg-purple-100" },
  { value: "followup", label: "متابعة", icon: UserCheck, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300", activeBg: "bg-blue-100" },
  { value: "lab_result", label: "نتيجة معمل", icon: FlaskConical, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-300", activeBg: "bg-indigo-100" },
  { value: "payment", label: "دفع", icon: DollarSign, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", activeBg: "bg-emerald-100" },
  { value: "general", label: "عام", icon: Info, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-300", activeBg: "bg-gray-100" },
];

export function CreateReminderModal({ isOpen, onClose, onSubmit, staffMembers }: CreateReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderType, setReminderType] = useState<string>("");
  const [toStaffId, setToStaffId] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !reminderTime || !toStaffId || !reminderType) {
      alert("الرجاء إدخال جميع الحقول المطلوبة");
      return;
    }

    onSubmit({
      title,
      description,
      reminderTime,
      reminderType,
      toStaffId: Number(toStaffId),
    });

    setTitle("");
    setDescription("");
    setReminderTime("");
    setReminderType("");
    setToStaffId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">إنشاء تذكير جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نوع التذكير *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {REMINDER_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReminderType(type.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-right transition-all border-2",
                      reminderType === type.value
                        ? cn(type.activeBg, type.color, type.border, "shadow-sm")
                        : cn(type.bg, type.color, "border-transparent hover:border-gray-200")
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{type.label}</span>
                    {reminderType === type.value && (
                      <div className={cn("mr-auto w-5 h-5 rounded-full flex items-center justify-center", type.color.replace("text-", "bg-"))}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل عنوان التذكير"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="أدخل تفاصيل التذكير"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المستلم *
            </label>
            <select
              value={toStaffId}
              onChange={(e) => setToStaffId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">اختر الموظف</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وقت التذكير *
            </label>
            <input
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <Bell className="w-5 h-5" />
              إنشاء التذكير
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
