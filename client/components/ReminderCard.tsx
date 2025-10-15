import React, { useState } from "react";
import { Bell, Check, Clock, XCircle, Trash2, Calendar, Pill, UserCheck, FlaskConical, DollarSign, Info, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReminderCardProps {
  reminder: {
    id: number | string;
    title: string;
    description?: string;
    reminderTime: string;
    reminderType?: string;
    status: "pending" | "acknowledged" | "snoozed" | "dismissed";
    fromStaffName: string;
    toStaffName: string;
    snoozedUntil?: string;
    createdAt: string;
  };
  onAcknowledge?: (id: number | string) => void;
  onSnooze?: (id: number | string) => void;
  onDismiss?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onReply?: (id: number | string, reply: string) => void;
}

const statusConfig = {
  pending: { color: "text-orange-600", bg: "bg-orange-50", icon: Bell, label: "معلق" },
  acknowledged: { color: "text-green-600", bg: "bg-green-50", icon: Check, label: "تم الإقرار" },
  snoozed: { color: "text-blue-600", bg: "bg-blue-50", icon: Clock, label: "مؤجل" },
  dismissed: { color: "text-gray-600", bg: "bg-gray-50", icon: XCircle, label: "متجاهل" },
};

const reminderTypeConfig: Record<string, { icon: any; color: string; bg: string; label: string; borderColor: string }> = {
  appointment: { 
    icon: Calendar, 
    color: "text-rose-700", 
    bg: "bg-rose-50", 
    borderColor: "border-rose-200",
    label: "موعد" 
  },
  medication: { 
    icon: Pill, 
    color: "text-purple-700", 
    bg: "bg-purple-50", 
    borderColor: "border-purple-200",
    label: "دواء" 
  },
  followup: { 
    icon: UserCheck, 
    color: "text-blue-700", 
    bg: "bg-blue-50", 
    borderColor: "border-blue-200",
    label: "متابعة" 
  },
  lab_result: { 
    icon: FlaskConical, 
    color: "text-indigo-700", 
    bg: "bg-indigo-50", 
    borderColor: "border-indigo-200",
    label: "نتيجة معمل" 
  },
  payment: { 
    icon: DollarSign, 
    color: "text-emerald-700", 
    bg: "bg-emerald-50", 
    borderColor: "border-emerald-200",
    label: "دفع" 
  },
  general: { 
    icon: Info, 
    color: "text-gray-700", 
    bg: "bg-gray-50", 
    borderColor: "border-gray-200",
    label: "عام" 
  },
};

export function ReminderCard({ reminder, onAcknowledge, onSnooze, onDismiss, onDelete, onReply }: ReminderCardProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const status = statusConfig[reminder.status];
  const StatusIcon = status.icon;
  const reminderType = reminder.reminderType ? reminderTypeConfig[reminder.reminderType] : null;
  const TypeIcon = reminderType?.icon;

  const reminderDate = new Date(reminder.reminderTime);
  const now = new Date();
  const isOverdue = reminderDate < now && reminder.status === "pending";

  const handleSendReply = () => {
    if (replyText.trim() && onReply) {
      onReply(reminder.id, replyText.trim());
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 p-4 hover:shadow-md transition-all",
      isOverdue ? "border-red-300 bg-red-50/30" : (reminderType ? reminderType.borderColor : "border-gray-200")
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
            {isOverdue && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                متأخر
              </span>
            )}
          </div>
          {reminder.description && (
            <p className="text-sm text-gray-600">{reminder.description}</p>
          )}
        </div>
        <span className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium", status.bg, status.color)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <span>من:</span>
          <span className="font-medium">{reminder.fromStaffName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>إلى:</span>
          <span className="font-medium">{reminder.toStaffName}</span>
        </div>
      </div>

      {reminderType && (
        <div className="mb-3">
          <span className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium",
            reminderType.bg,
            reminderType.color
          )}>
            {TypeIcon && <TypeIcon className="w-4 h-4" />}
            {reminderType.label}
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className={cn(
          "font-medium",
          isOverdue ? "text-red-600" : "text-gray-700"
        )}>
          {reminderDate.toLocaleString('ar-IQ', { 
            dateStyle: 'short', 
            timeStyle: 'short' 
          })}
        </span>
        {reminder.snoozedUntil && (
          <span className="text-blue-600">
            (مؤجل حتى {new Date(reminder.snoozedUntil).toLocaleString('ar-IQ', { 
              dateStyle: 'short', 
              timeStyle: 'short' 
            })})
          </span>
        )}
      </div>

      {/* Reply Box */}
      {showReplyBox && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="اكتب ردك هنا..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSendReply}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
        {reminder.status === "pending" && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(reminder.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            إقرار
          </button>
        )}
        {reminder.status === "pending" && onSnooze && (
          <button
            onClick={() => onSnooze(reminder.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Clock className="w-4 h-4" />
            تأجيل
          </button>
        )}
        {reminder.status === "pending" && onDismiss && (
          <button
            onClick={() => onDismiss(reminder.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            تجاهل
          </button>
        )}
        {onReply && !showReplyBox && (
          <button
            onClick={() => setShowReplyBox(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            رد
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(reminder.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
