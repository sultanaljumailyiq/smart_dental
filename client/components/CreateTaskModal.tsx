import React, { useState } from "react";
import { X, Plus, Stethoscope, ShoppingCart, UserPlus, Package, CalendarClock, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    taskType: string;
    toStaffId: number;
    dueDate?: string;
  }) => void;
  staffMembers: { id: number; name: string; role: string }[];
}

const TASK_TYPES = [
  { value: "treatment_plan", label: "خطة علاج", icon: Stethoscope, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300", activeBg: "bg-blue-100" },
  { value: "purchase_suggestion", label: "اقتراح شراء", icon: ShoppingCart, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", activeBg: "bg-amber-100" },
  { value: "patient_recall", label: "استدعاء مريض", icon: UserPlus, color: "text-green-700", bg: "bg-green-50", border: "border-green-300", activeBg: "bg-green-100" },
  { value: "inventory_check", label: "جرد مخزون", icon: Package, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300", activeBg: "bg-purple-100" },
  { value: "appointment_followup", label: "متابعة موعد", icon: CalendarClock, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300", activeBg: "bg-rose-100" },
  { value: "lab_order", label: "طلب معمل", icon: FlaskConical, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-300", activeBg: "bg-indigo-100" },
];

export function CreateTaskModal({ isOpen, onClose, onSubmit, staffMembers }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskType, setTaskType] = useState<string>("");
  const [toStaffId, setToStaffId] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !toStaffId || !taskType) {
      alert("الرجاء إدخال العنوان واختيار المستلم ونوع المهمة");
      return;
    }

    onSubmit({
      title,
      description,
      priority,
      taskType,
      toStaffId: Number(toStaffId),
      dueDate: dueDate || undefined,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setTaskType("");
    setToStaffId("");
    setDueDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">إنشاء مهمة جديدة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نوع المهمة *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TASK_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTaskType(type.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-right transition-all border-2",
                      taskType === type.value
                        ? cn(type.activeBg, type.color, type.border, "shadow-sm")
                        : cn(type.bg, type.color, "border-transparent hover:border-gray-200")
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{type.label}</span>
                    {taskType === type.value && (
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="أدخل عنوان المهمة"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="أدخل تفاصيل المهمة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المستلم *
            </label>
            <select
              value={toStaffId}
              onChange={(e) => setToStaffId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              الأولوية
            </label>
            <div className="flex gap-2">
              {[
                { value: "low", label: "منخفضة", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
                { value: "medium", label: "متوسطة", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
                { value: "high", label: "عالية", color: "bg-red-100 text-red-700 hover:bg-red-200" },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as any)}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    priority === p.value ? p.color : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموعد النهائي
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              إنشاء المهمة
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
