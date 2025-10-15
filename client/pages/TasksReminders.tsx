import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Plus, ListTodo, Bell, Filter, Stethoscope, ShoppingCart, UserPlus, Package, CalendarClock, FlaskConical, Calendar, Pill, UserCheck, DollarSign, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/TaskCard";
import { ReminderCard } from "@/components/ReminderCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { CreateReminderModal } from "@/components/CreateReminderModal";
import { sharedClinicData, type StaffTask, type StaffReminder } from "@/services/sharedClinicData";

const mockStaff = [
  { id: 1, name: "د. أحمد محمد", role: "طبيب" },
  { id: 2, name: "سارة علي", role: "استقبال" },
  { id: 3, name: "محمد حسن", role: "مساعد" },
];

// Task type configurations
const TASK_TYPES = [
  { value: "all", label: "الكل", icon: ListTodo, color: "text-gray-700", bgColor: "bg-gray-50", hoverColor: "hover:bg-gray-100" },
  { value: "treatment_plan", label: "خطط علاج", icon: Stethoscope, color: "text-blue-700", bgColor: "bg-blue-50", hoverColor: "hover:bg-blue-100" },
  { value: "purchase_suggestion", label: "اقتراحات شراء", icon: ShoppingCart, color: "text-amber-700", bgColor: "bg-amber-50", hoverColor: "hover:bg-amber-100" },
  { value: "patient_recall", label: "استدعاءات مرضى", icon: UserPlus, color: "text-green-700", bgColor: "bg-green-50", hoverColor: "hover:bg-green-100" },
  { value: "inventory_check", label: "جرد مخزون", icon: Package, color: "text-purple-700", bgColor: "bg-purple-50", hoverColor: "hover:bg-purple-100" },
  { value: "appointment_followup", label: "متابعة مواعيد", icon: CalendarClock, color: "text-rose-700", bgColor: "bg-rose-50", hoverColor: "hover:bg-rose-100" },
  { value: "lab_order", label: "طلبات معمل", icon: FlaskConical, color: "text-indigo-700", bgColor: "bg-indigo-50", hoverColor: "hover:bg-indigo-100" },
];

// Reminder type configurations
const REMINDER_TYPES = [
  { value: "all", label: "الكل", icon: Bell, color: "text-gray-700", bgColor: "bg-gray-50", hoverColor: "hover:bg-gray-100" },
  { value: "appointment", label: "مواعيد", icon: Calendar, color: "text-rose-700", bgColor: "bg-rose-50", hoverColor: "hover:bg-rose-100" },
  { value: "medication", label: "أدوية", icon: Pill, color: "text-purple-700", bgColor: "bg-purple-50", hoverColor: "hover:bg-purple-100" },
  { value: "followup", label: "متابعة", icon: UserCheck, color: "text-blue-700", bgColor: "bg-blue-50", hoverColor: "hover:bg-blue-100" },
  { value: "lab_result", label: "نتائج معمل", icon: FlaskConical, color: "text-indigo-700", bgColor: "bg-indigo-50", hoverColor: "hover:bg-indigo-100" },
  { value: "payment", label: "دفعات", icon: DollarSign, color: "text-emerald-700", bgColor: "bg-emerald-50", hoverColor: "hover:bg-emerald-100" },
  { value: "general", label: "عام", icon: Info, color: "text-gray-700", bgColor: "bg-gray-50", hoverColor: "hover:bg-gray-100" },
];

export default function TasksReminders() {
  const [activeMainTab, setActiveMainTab] = useState<"tasks" | "reminders">("tasks");
  const [activeTaskTypeTab, setActiveTaskTypeTab] = useState("all");
  const [activeReminderTypeTab, setActiveReminderTypeTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [reminders, setReminders] = useState<StaffReminder[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const tasksData = await sharedClinicData.getStaffTasks();
    const remindersData = await sharedClinicData.getStaffReminders();
    setTasks(tasksData);
    setReminders(remindersData);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = activeTaskTypeTab === "all" || task.taskType === activeTaskTypeTab;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter;
    const matchesType = activeReminderTypeTab === "all" || reminder.reminderType === activeReminderTypeTab;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateTask = async (taskData: any) => {
    await sharedClinicData.addStaffTask({
      clinicId: "1",
      ...taskData,
    });
    await loadData();
    setShowTaskModal(false);
  };

  const handleCreateReminder = async (reminderData: any) => {
    await sharedClinicData.addStaffReminder({
      clinicId: "1",
      ...reminderData,
    });
    await loadData();
    setShowReminderModal(false);
  };

  const handleTaskAction = async (action: string, id: number | string, reply?: string) => {
    const taskId = id.toString();
    if (action === "accept") {
      await sharedClinicData.updateStaffTask(taskId, { status: "accepted" });
    } else if (action === "reject") {
      await sharedClinicData.updateStaffTask(taskId, { status: "rejected" });
    } else if (action === "complete") {
      await sharedClinicData.updateStaffTask(taskId, { 
        status: "completed",
        completedAt: new Date().toISOString()
      });
    } else if (action === "edit") {
      console.log("Edit task:", taskId);
    } else if (action === "delete") {
      await sharedClinicData.deleteStaffTask(taskId);
    } else if (action === "reply" && reply) {
      console.log("Reply to task:", taskId, reply);
    }
    await loadData();
  };

  const handleReminderAction = async (action: string, id: number | string, reply?: string) => {
    const reminderId = id.toString();
    if (action === "acknowledge") {
      await sharedClinicData.updateStaffReminder(reminderId, { 
        status: "acknowledged",
        acknowledgedAt: new Date().toISOString()
      });
    } else if (action === "snooze") {
      const snoozedUntil = new Date();
      snoozedUntil.setHours(snoozedUntil.getHours() + 1);
      await sharedClinicData.updateStaffReminder(reminderId, { 
        status: "snoozed",
        snoozedUntil: snoozedUntil.toISOString()
      });
    } else if (action === "dismiss") {
      await sharedClinicData.updateStaffReminder(reminderId, { status: "dismissed" });
    } else if (action === "delete") {
      await sharedClinicData.deleteStaffReminder(reminderId);
    } else if (action === "reply" && reply) {
      console.log("Reply to reminder:", reminderId, reply);
    }
    await loadData();
  };

  // Statistics
  const stats = useMemo(() => {
    const taskStats = {
      all: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      treatment_plan: tasks.filter(t => t.taskType === "treatment_plan").length,
      purchase_suggestion: tasks.filter(t => t.taskType === "purchase_suggestion").length,
      patient_recall: tasks.filter(t => t.taskType === "patient_recall").length,
      inventory_check: tasks.filter(t => t.taskType === "inventory_check").length,
      appointment_followup: tasks.filter(t => t.taskType === "appointment_followup").length,
      lab_order: tasks.filter(t => t.taskType === "lab_order").length,
    };
    
    const reminderStats = {
      all: reminders.length,
      pending: reminders.filter(r => r.status === "pending").length,
      appointment: reminders.filter(r => r.reminderType === "appointment").length,
      medication: reminders.filter(r => r.reminderType === "medication").length,
      followup: reminders.filter(r => r.reminderType === "followup").length,
      lab_result: reminders.filter(r => r.reminderType === "lab_result").length,
      payment: reminders.filter(r => r.reminderType === "payment").length,
      general: reminders.filter(r => r.reminderType === "general").length,
    };

    return { taskStats, reminderStats };
  }, [tasks, reminders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            to="/dentist-hub"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى لوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold">المهام والتذكيرات</h1>
          <p className="text-purple-100 mt-2">نظام تعاون تفاعلي بين الموظفين</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Main Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveMainTab("tasks");
                    setActiveTaskTypeTab("all");
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                    activeMainTab === "tasks"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <ListTodo className="w-5 h-5" />
                  المهام ({stats.taskStats.all})
                </button>
                <button
                  onClick={() => {
                    setActiveMainTab("reminders");
                    setActiveReminderTypeTab("all");
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                    activeMainTab === "reminders"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Bell className="w-5 h-5" />
                  التذكيرات ({stats.reminderStats.all})
                </button>
              </div>

              <button
                onClick={() => activeMainTab === "tasks" ? setShowTaskModal(true) : setShowReminderModal(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-all shadow-md hover:shadow-lg hover:scale-105",
                  activeMainTab === "tasks" 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" 
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                )}
              >
                <Plus className="w-5 h-5" />
                {activeMainTab === "tasks" ? "إنشاء مهمة" : "إنشاء تذكير"}
              </button>
            </div>

            {/* Sub Tabs for Tasks */}
            {activeMainTab === "tasks" && (
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {TASK_TYPES.map((type) => {
                    const Icon = type.icon;
                    const count = stats.taskStats[type.value as keyof typeof stats.taskStats] || 0;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setActiveTaskTypeTab(type.value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                          activeTaskTypeTab === type.value
                            ? cn(type.bgColor, type.color, "shadow-sm ring-2 ring-offset-1", type.color.replace("text-", "ring-"))
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub Tabs for Reminders */}
            {activeMainTab === "reminders" && (
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {REMINDER_TYPES.map((type) => {
                    const Icon = type.icon;
                    const count = stats.reminderStats[type.value as keyof typeof stats.reminderStats] || 0;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setActiveReminderTypeTab(type.value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                          activeReminderTypeTab === type.value
                            ? cn(type.bgColor, type.color, "shadow-sm ring-2 ring-offset-1", type.color.replace("text-", "ring-"))
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex items-center gap-4 p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  {activeMainTab === "tasks" ? (
                    <>
                      <option value="pending">قيد الانتظار</option>
                      <option value="accepted">مقبولة</option>
                      <option value="rejected">مرفوضة</option>
                      <option value="completed">مكتملة</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">معلق</option>
                      <option value="acknowledged">تم الإقرار</option>
                      <option value="snoozed">مؤجل</option>
                      <option value="dismissed">متجاهل</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeMainTab === "tasks" ? (
              <div className="grid gap-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onAccept={(id) => handleTaskAction("accept", id)}
                      onReject={(id) => handleTaskAction("reject", id)}
                      onEdit={(id) => handleTaskAction("edit", id)}
                      onDelete={(id) => handleTaskAction("delete", id)}
                      onComplete={(id) => handleTaskAction("complete", id)}
                      onReply={(id, reply) => handleTaskAction("reply", id, reply)}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <ListTodo className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">لا توجد مهام</p>
                    <p className="text-gray-400 text-sm mt-1">جرب تغيير الفلاتر أو إنشاء مهمة جديدة</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReminders.length > 0 ? (
                  filteredReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onAcknowledge={(id) => handleReminderAction("acknowledge", id)}
                      onSnooze={(id) => handleReminderAction("snooze", id)}
                      onDismiss={(id) => handleReminderAction("dismiss", id)}
                      onDelete={(id) => handleReminderAction("delete", id)}
                      onReply={(id, reply) => handleReminderAction("reply", id, reply)}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">لا توجد تذكيرات</p>
                    <p className="text-gray-400 text-sm mt-1">جرب تغيير الفلاتر أو إنشاء تذكير جديد</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        staffMembers={mockStaff}
      />

      <CreateReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSubmit={handleCreateReminder}
        staffMembers={mockStaff}
      />
    </div>
  );
}
