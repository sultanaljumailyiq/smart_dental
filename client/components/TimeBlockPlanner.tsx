import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Coffee,
  Phone,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Timer,
  MapPin,
  Star,
  Activity,
  Heart,
  Sparkles,
  Camera,
  FileText,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Eye,
  X,
  Play,
  Pause,
  Square,
  ArrowRight,
  Bell,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeBlock {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type:
    | "appointment"
    | "treatment"
    | "break"
    | "consultation"
    | "emergency"
    | "surgery"
    | "checkup";
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  patient?: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    age?: number;
  };
  doctor: string;
  room?: string;
  notes?: string;
  priority: "low" | "medium" | "high" | "urgent";
  color: string;
  icon: React.ComponentType<any>;
  canEdit: boolean;
  canCancel: boolean;
  reminderSent?: boolean;
  cost?: number;
}

interface DaySchedule {
  date: string;
  dayName: string;
  blocks: TimeBlock[];
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  workingHours: {
    start: string;
    end: string;
  };
}

const sampleTimeBlocks: TimeBlock[] = [
  {
    id: "1",
    title: "فحص دوري",
    description: "فحص شامل للأسنان",
    startTime: "09:00",
    endTime: "09:30",
    duration: 30,
    type: "checkup",
    status: "completed",
    patient: {
      id: "p1",
      name: "أحمد محمد",
      phone: "+964 770 123 4567",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      age: 35,
    },
    doctor: "د. أحمد الرحمة",
    room: "غرفة 1",
    priority: "medium",
    color: "green",
    icon: Stethoscope,
    canEdit: false,
    canCancel: false,
    reminderSent: true,
    cost: 50000,
  },
  {
    id: "2",
    title: "علاج عصب",
    description: "علاج عصب للضرس الخلفي",
    startTime: "09:45",
    endTime: "10:30",
    duration: 45,
    type: "treatment",
    status: "in-progress",
    patient: {
      id: "p2",
      name: "فاطمة علي",
      phone: "+964 750 987 6543",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      age: 28,
    },
    doctor: "د. أحمد الرحمة",
    room: "غرفة 1",
    priority: "high",
    color: "blue",
    icon: Activity,
    canEdit: true,
    canCancel: true,
    reminderSent: true,
    cost: 150000,
  },
  {
    id: "3",
    title: "استراحة",
    startTime: "10:30",
    endTime: "10:45",
    duration: 15,
    type: "break",
    status: "scheduled",
    doctor: "د. أحمد الرحمة",
    priority: "low",
    color: "gray",
    icon: Coffee,
    canEdit: true,
    canCancel: false,
  },
  {
    id: "4",
    title: "تبييض أسنان",
    description: "جلسة تبييض بالليزر",
    startTime: "11:00",
    endTime: "12:00",
    duration: 60,
    type: "treatment",
    status: "scheduled",
    patient: {
      id: "p3",
      name: "سارة أحمد",
      phone: "+964 780 456 7890",
      age: 25,
    },
    doctor: "د. أحمد الرحمة",
    room: "غرفة 2",
    priority: "medium",
    color: "purple",
    icon: Sparkles,
    canEdit: true,
    canCancel: true,
    reminderSent: false,
    cost: 200000,
  },
  {
    id: "5",
    title: "زراعة سن",
    description: "زراعة سن واحد",
    startTime: "13:00",
    endTime: "14:30",
    duration: 90,
    type: "surgery",
    status: "scheduled",
    patient: {
      id: "p4",
      name: "محمد خالد",
      phone: "+964 790 123 9876",
      age: 42,
    },
    doctor: "د. سارة النور",
    room: "غرفة العمليات",
    priority: "high",
    color: "red",
    icon: Activity,
    canEdit: true,
    canCancel: true,
    reminderSent: true,
    cost: 800000,
  },
  {
    id: "6",
    title: "تصوير أشعة",
    description: "أشعة بانوراما",
    startTime: "14:45",
    endTime: "15:00",
    duration: 15,
    type: "consultation",
    status: "scheduled",
    patient: {
      id: "p5",
      name: "ليلى سالم",
      phone: "+964 760 555 1234",
      age: 30,
    },
    doctor: "تقني الأشعة",
    room: "غرفة الأشعة",
    priority: "medium",
    color: "orange",
    icon: Camera,
    canEdit: true,
    canCancel: true,
    reminderSent: false,
    cost: 75000,
  },
];

const today = new Date();
const daySchedule: DaySchedule = {
  date: today.toISOString().split("T")[0],
  dayName: today.toLocaleDateString("ar-SA", { weekday: "long" }),
  blocks: sampleTimeBlocks,
  totalAppointments: sampleTimeBlocks.filter((b) => b.type !== "break").length,
  completedAppointments: sampleTimeBlocks.filter(
    (b) => b.status === "completed",
  ).length,
  revenue: sampleTimeBlocks.reduce((sum, block) => sum + (block.cost || 0), 0),
  workingHours: {
    start: "09:00",
    end: "17:00",
  },
};

interface TimeBlockPlannerProps {
  schedule?: DaySchedule;
  onBlockClick?: (block: TimeBlock) => void;
  onAddAppointment?: (time: string) => void;
  compact?: boolean;
}

export default function TimeBlockPlanner({
  schedule = daySchedule,
  onBlockClick,
  onAddAppointment,
  compact = false,
}: TimeBlockPlannerProps) {
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-l-green-500 bg-green-50";
      case "in-progress":
        return "border-l-blue-500 bg-blue-50 shadow-lg";
      case "scheduled":
        return "border-l-gray-400 bg-white";
      case "cancelled":
        return "border-l-red-500 bg-red-50";
      case "no-show":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-gray-400 bg-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-600";
      case "treatment":
        return "text-purple-600";
      case "surgery":
        return "text-red-600";
      case "checkup":
        return "text-green-600";
      case "consultation":
        return "text-orange-600";
      case "break":
        return "text-gray-600";
      case "emergency":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startHour = 9; // 9 AM
    const totalMinutes = (hours - startHour) * 60 + minutes;
    return (totalMinutes / 60) * 80; // 80px per hour
  };

  const getCurrentTimePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const startHour = 9;
    const totalMinutes = (hours - startHour) * 60 + minutes;
    return Math.max(0, (totalMinutes / 60) * 80);
  };

  const isCurrentTime = (block: TimeBlock) => {
    const now = currentTime;
    const [startHour, startMin] = block.startTime.split(":").map(Number);
    const [endHour, endMin] = block.endTime.split(":").map(Number);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const blockStart = startHour * 60 + startMin;
    const blockEnd = endHour * 60 + endMin;

    return currentMinutes >= blockStart && currentMinutes <= blockEnd;
  };

  const filteredBlocks = schedule.blocks.filter(
    (block) => filterType === "all" || block.type === filterType,
  );

  const TimeBlockCard = ({ block }: { block: TimeBlock }) => {
    const isCurrent = isCurrentTime(block);
    const position = getTimePosition(block.startTime);
    const height = (block.duration / 60) * 80;

    return (
      <div
        onClick={() => {
          setSelectedBlock(block);
          setShowDetails(true);
          onBlockClick?.(block);
        }}
        className={cn(
          "absolute left-0 right-0 border-l-4 rounded-r-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
          getStatusColor(block.status),
          isCurrent && "ring-2 ring-blue-400 ring-opacity-50",
          compact ? "mx-2" : "mx-4",
        )}
        style={{
          top: `${position}px`,
          height: `${Math.max(height, 60)}px`,
          minHeight: "60px",
        }}
      >
        <div className="flex items-start justify-between h-full">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                block.color === "green"
                  ? "bg-green-100 text-green-600"
                  : block.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : block.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : block.color === "red"
                        ? "bg-red-100 text-red-600"
                        : block.color === "orange"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-600",
              )}
            >
              <block.icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {block.title}
                </h4>
                {isCurrent && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
                )}
              </div>

              {block.patient && (
                <div className="flex items-center gap-2 mb-1">
                  {block.patient.avatar ? (
                    <img
                      src={block.patient.avatar}
                      alt={block.patient.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 truncate">
                    {block.patient.name}
                  </span>
                  {block.patient.age && (
                    <span className="text-xs text-gray-500">
                      ({block.patient.age} سنة)
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {block.startTime} - {block.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>{block.duration} دقيقة</span>
                </div>
              </div>

              {block.room && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{block.room}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getPriorityColor(block.priority),
              )}
            >
              {block.priority === "urgent"
                ? "عاجل"
                : block.priority === "high"
                  ? "عالي"
                  : block.priority === "medium"
                    ? "متوسط"
                    : "منخفض"}
            </span>

            {block.status === "in-progress" && (
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">جاري</span>
              </div>
            )}

            {block.status === "completed" && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}

            {block.cost && (
              <span className="text-xs font-semibold text-gray-900">
                {formatCurrency(block.cost)}
              </span>
            )}

            {!block.reminderSent && block.patient && (
              <Bell className="w-3 h-3 text-orange-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const TimeGrid = () => {
    const hours = [];
    for (let i = 9; i <= 17; i++) {
      hours.push(`${i.toString().padStart(2, "0")}:00`);
    }

    return (
      <div className="relative">
        {/* Time labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-50 border-r border-gray-200">
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute text-xs text-gray-600 font-medium -translate-y-2"
              style={{ top: `${index * 80}px` }}
            >
              {hour}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="ml-16 relative min-h-[640px]">
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-gray-100"
              style={{ top: `${index * 80}px` }}
            />
          ))}

          {/* Current time indicator */}
          {currentTime.getHours() >= 9 && currentTime.getHours() <= 17 && (
            <div
              className="absolute left-0 right-4 border-t-2 border-red-500 z-20"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full" />
              <div className="absolute -top-6 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                الآن{" "}
                {currentTime.toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}

          {/* Time blocks */}
          {filteredBlocks.map((block) => (
            <TimeBlockCard key={block.id} block={block} />
          ))}

          {/* Empty time slots */}
          {hours.map((hour, index) => (
            <button
              key={`slot-${hour}`}
              onClick={() => {
                setSelectedTimeSlot(hour);
                setShowAddForm(true);
                onAddAppointment?.(hour);
              }}
              className="absolute left-4 right-4 h-20 border border-dashed border-gray-300 rounded-lg opacity-0 hover:opacity-100 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center justify-center group"
              style={{ top: `${index * 80}px` }}
            >
              <div className="flex items-center gap-2 text-blue-600">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">إضافة موعد</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              جدول اليوم - {schedule.dayName}
            </h2>
            <p className="text-sm text-gray-600">{schedule.date}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {schedule.totalAppointments}
            </div>
            <div className="text-xs text-gray-600">إجمالي المواعيد</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {schedule.completedAppointments}
            </div>
            <div className="text-xs text-gray-600">مكتملة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {schedule.totalAppointments - schedule.completedAppointments}
            </div>
            <div className="text-xs text-gray-600">متبقية</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {formatCurrency(schedule.revenue)}
            </div>
            <div className="text-xs text-gray-600">الإيرادات</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: "all", label: "الكل", count: schedule.blocks.length },
            {
              id: "appointment",
              label: "مواعيد",
              count: schedule.blocks.filter((b) => b.type === "appointment")
                .length,
            },
            {
              id: "treatment",
              label: "علاج",
              count: schedule.blocks.filter((b) => b.type === "treatment")
                .length,
            },
            {
              id: "surgery",
              label: "جراحة",
              count: schedule.blocks.filter((b) => b.type === "surgery").length,
            },
            {
              id: "checkup",
              label: "فحص",
              count: schedule.blocks.filter((b) => b.type === "checkup").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                filterType === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  filterType === tab.id
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

      {/* Timeline */}
      <div className="overflow-x-auto">
        <TimeGrid />
      </div>

      {/* Block Details Modal */}
      {selectedBlock && showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      selectedBlock.color === "green"
                        ? "bg-green-100 text-green-600"
                        : selectedBlock.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : selectedBlock.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : selectedBlock.color === "red"
                              ? "bg-red-100 text-red-600"
                              : selectedBlock.color === "orange"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-600",
                    )}
                  >
                    <selectedBlock.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedBlock.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedBlock.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedBlock.patient && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    معلومات المريض
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedBlock.patient.avatar ? (
                      <img
                        src={selectedBlock.patient.avatar}
                        alt={selectedBlock.patient.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {selectedBlock.patient.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {selectedBlock.patient.phone}
                      </p>
                      {selectedBlock.patient.age && (
                        <p className="text-sm text-gray-600">
                          {selectedBlock.patient.age} سنة
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">الوقت:</span>
                  <span className="font-medium">
                    {selectedBlock.startTime} - {selectedBlock.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Timer className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">
                    {selectedBlock.duration} دقيقة
                  </span>
                </div>
                {selectedBlock.room && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">الغرفة:</span>
                    <span className="font-medium">{selectedBlock.room}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">الطبيب:</span>
                  <span className="font-medium">{selectedBlock.doctor}</span>
                </div>
                {selectedBlock.cost && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">التكلفة:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(selectedBlock.cost)}
                    </span>
                  </div>
                )}
              </div>

              {selectedBlock.patient && (
                <div className="flex gap-3">
                  <a
                    href={`tel:${selectedBlock.patient.phone}`}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    اتصال
                  </a>
                  <a
                    href={`sms:${selectedBlock.patient.phone}`}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    رسالة
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
