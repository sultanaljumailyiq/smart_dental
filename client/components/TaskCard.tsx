import React, { useState } from "react";
import { CheckCircle, XCircle, Edit, Trash2, Clock, AlertCircle, Stethoscope, ShoppingCart, UserPlus, Package, CalendarClock, FlaskConical, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: number | string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "accepted" | "rejected" | "completed";
    category?: string;
    taskType?: string;
    dueDate?: string;
    fromStaffName: string;
    toStaffName: string;
    createdAt: string;
  };
  onAccept?: (id: number | string) => void;
  onReject?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onComplete?: (id: number | string) => void;
  onReply?: (id: number | string, reply: string) => void;
  currentUserId?: number;
}

const priorityConfig = {
  low: { color: "text-blue-600", bg: "bg-blue-50", label: "منخفضة" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-50", label: "متوسطة" },
  high: { color: "text-red-600", bg: "bg-red-50", label: "عالية" },
};

const statusConfig = {
  pending: { color: "text-gray-600", bg: "bg-gray-50", label: "قيد الانتظار" },
  accepted: { color: "text-green-600", bg: "bg-green-50", label: "مقبولة" },
  rejected: { color: "text-red-600", bg: "bg-red-50", label: "مرفوضة" },
  completed: { color: "text-blue-600", bg: "bg-blue-50", label: "مكتملة" },
};

const taskTypeConfig: Record<string, { icon: any; color: string; bg: string; label: string; borderColor: string }> = {
  treatment_plan: { 
    icon: Stethoscope, 
    color: "text-blue-700", 
    bg: "bg-blue-50", 
    borderColor: "border-blue-200",
    label: "خطة علاج" 
  },
  purchase_suggestion: { 
    icon: ShoppingCart, 
    color: "text-amber-700", 
    bg: "bg-amber-50", 
    borderColor: "border-amber-200",
    label: "اقتراح شراء" 
  },
  patient_recall: { 
    icon: UserPlus, 
    color: "text-green-700", 
    bg: "bg-green-50", 
    borderColor: "border-green-200",
    label: "استدعاء مريض" 
  },
  inventory_check: { 
    icon: Package, 
    color: "text-purple-700", 
    bg: "bg-purple-50", 
    borderColor: "border-purple-200",
    label: "جرد مخزون" 
  },
  appointment_followup: { 
    icon: CalendarClock, 
    color: "text-rose-700", 
    bg: "bg-rose-50", 
    borderColor: "border-rose-200",
    label: "متابعة موعد" 
  },
  lab_order: { 
    icon: FlaskConical, 
    color: "text-indigo-700", 
    bg: "bg-indigo-50", 
    borderColor: "border-indigo-200",
    label: "طلب معمل" 
  },
};

export function TaskCard({ task, onAccept, onReject, onEdit, onDelete, onComplete, onReply }: TaskCardProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const taskType = task.taskType ? taskTypeConfig[task.taskType] : null;
  const TypeIcon = taskType?.icon;

  const handleSendReply = () => {
    if (replyText.trim() && onReply) {
      onReply(task.id, replyText.trim());
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 p-4 hover:shadow-md transition-all",
      taskType ? taskType.borderColor : "border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2 mr-3">
          <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", priority.bg, priority.color)}>
            {priority.label}
          </span>
          <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", status.bg, status.color)}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <span>من:</span>
          <span className="font-medium">{task.fromStaffName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>إلى:</span>
          <span className="font-medium">{task.toStaffName}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString('ar-IQ')}</span>
          </div>
        )}
      </div>

      {taskType && (
        <div className="mb-3">
          <span className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium",
            taskType.bg,
            taskType.color
          )}>
            {TypeIcon && <TypeIcon className="w-4 h-4" />}
            {taskType.label}
          </span>
        </div>
      )}
      
      {task.category && !taskType && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
            <AlertCircle className="w-3 h-3" />
            {task.category}
          </span>
        </div>
      )}

      {/* Reply Box */}
      {showReplyBox && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="اكتب ردك هنا..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSendReply}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              إرسال
            </button>
            <button
              onClick={() => {
                setShowReplyBox(false);
                setReplyText("");
              }}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {task.status === "pending" && onAccept && (
          <button
            onClick={() => onAccept(task.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            قبول
          </button>
        )}
        {task.status === "pending" && onReject && (
          <button
            onClick={() => onReject(task.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            رفض
          </button>
        )}
        {task.status === "accepted" && onComplete && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            إكمال
          </button>
        )}
        {onReply && !showReplyBox && (
          <button
            onClick={() => setShowReplyBox(true)}
            className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            رد
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(task.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
