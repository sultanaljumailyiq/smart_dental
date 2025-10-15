import React, { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Heart,
  Star,
  Award,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Timer,
  Phone,
  MessageCircle,
  MapPin,
  Stethoscope,
  Brain,
  Camera,
  FileText,
  Settings,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Eye,
  Edit,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
  Shield,
  Globe,
  Mail,
  Bell,
  User,
  RefreshCw,
  Download,
  Upload,
  Search,
  Archive,
  Bookmark,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NestedWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "list" | "calendar" | "progress" | "activity";
  size: "small" | "medium" | "large";
  data: any;
  color: string;
  icon: React.ComponentType<any>;
  expandable?: boolean;
  refreshable?: boolean;
  configurable?: boolean;
}

interface WidgetContainer {
  id: string;
  title: string;
  description?: string;
  layout: "grid" | "stack" | "flex";
  columns?: number;
  widgets: NestedWidget[];
  collapsible?: boolean;
  color: string;
  gradient: string;
  icon: React.ComponentType<any>;
}

const sampleNestedWidgets: NestedWidget[] = [
  {
    id: "patients-today",
    title: "مرضى اليوم",
    type: "metric",
    size: "small",
    data: { value: 24, change: "+12%", trend: "up" },
    color: "blue",
    icon: Users,
    refreshable: true,
  },
  {
    id: "revenue-chart",
    title: "الإيرادات الأسبوعية",
    type: "chart",
    size: "medium",
    data: {
      values: [120, 150, 180, 200, 165, 220, 240],
      labels: [
        "السبت",
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
      ],
    },
    color: "green",
    icon: BarChart3,
    expandable: true,
    configurable: true,
  },
  {
    id: "appointments-list",
    title: "المواعيد القادمة",
    type: "list",
    size: "medium",
    data: [
      {
        id: 1,
        time: "10:00",
        patient: "أحمد محمد",
        type: "فحص",
        status: "confirmed",
      },
      {
        id: 2,
        time: "11:30",
        patient: "فاطمة علي",
        type: "علاج",
        status: "pending",
      },
      {
        id: 3,
        time: "14:00",
        patient: "سارة أحمد",
        type: "تبييض",
        status: "confirmed",
      },
    ],
    color: "purple",
    icon: Calendar,
    expandable: true,
  },
  {
    id: "satisfaction-score",
    title: "معدل الرضا",
    type: "progress",
    size: "small",
    data: { value: 96, target: 100, label: "ممتاز" },
    color: "yellow",
    icon: Heart,
  },
  {
    id: "recent-activity",
    title: "النشاط الأخير",
    type: "activity",
    size: "large",
    data: [
      {
        id: 1,
        action: "موعد جديد",
        user: "أحمد محمد",
        time: "منذ 5 دقائق",
        type: "appointment",
      },
      {
        id: 2,
        action: "دفعة مالية",
        user: "فاطمة علي",
        time: "منذ 15 دقيقة",
        type: "payment",
      },
      {
        id: 3,
        action: "تقييم جديد",
        user: "سارة أحمد",
        time: "منذ ساعة",
        type: "review",
      },
    ],
    color: "indigo",
    icon: Activity,
    refreshable: true,
  },
  {
    id: "performance-metrics",
    title: "مؤشرات الأداء",
    type: "chart",
    size: "small",
    data: {
      completion: 85,
      efficiency: 92,
      quality: 88,
    },
    color: "orange",
    icon: Target,
  },
];

const widgetContainers: WidgetContainer[] = [
  {
    id: "overview",
    title: "نظرة عامة",
    description: "المؤشرات الرئيسية للعيادة",
    layout: "grid",
    columns: 2,
    widgets: sampleNestedWidgets.filter((w) =>
      ["patients-today", "satisfaction-score", "performance-metrics"].includes(
        w.id,
      ),
    ),
    collapsible: false,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    icon: Activity,
  },
  {
    id: "financial",
    title: "المالية والإيرادات",
    description: "متابعة الأرباح والمدفوعات",
    layout: "flex",
    widgets: sampleNestedWidgets.filter((w) => w.id === "revenue-chart"),
    collapsible: true,
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    icon: DollarSign,
  },
  {
    id: "appointments",
    title: "إدارة المواعيد",
    description: "جدولة ومتابعة المواعيد",
    layout: "stack",
    widgets: sampleNestedWidgets.filter((w) => w.id === "appointments-list"),
    collapsible: true,
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
    icon: Calendar,
  },
  {
    id: "activity-feed",
    title: "سجل النشاط",
    description: "آخر العمليات والتحديثات",
    layout: "stack",
    widgets: sampleNestedWidgets.filter((w) => w.id === "recent-activity"),
    collapsible: true,
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600",
    icon: Bell,
  },
];

interface NestedWidgetDashboardProps {
  containers?: WidgetContainer[];
  compact?: boolean;
  editable?: boolean;
}

export default function NestedWidgetDashboard({
  containers = widgetContainers,
  compact = false,
  editable = false,
}: NestedWidgetDashboardProps) {
  const [expandedContainers, setExpandedContainers] = useState<string[]>([
    "overview",
    "financial",
  ]);
  const [expandedWidgets, setExpandedWidgets] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const toggleContainer = (containerId: string) => {
    setExpandedContainers((prev) =>
      prev.includes(containerId)
        ? prev.filter((id) => id !== containerId)
        : [...prev, containerId],
    );
  };

  const toggleWidget = (widgetId: string) => {
    setExpandedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId],
    );
  };

  const getWidgetSize = (size: string, compact: boolean) => {
    if (compact) {
      return size === "large" ? "col-span-2" : "col-span-1";
    }
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-2";
      case "large":
        return "col-span-3";
      default:
        return "col-span-1";
    }
  };

  const MetricWidget = ({ widget }: { widget: NestedWidget }) => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            widget.color === "blue"
              ? "bg-blue-100 text-blue-600"
              : widget.color === "green"
                ? "bg-green-100 text-green-600"
                : widget.color === "purple"
                  ? "bg-purple-100 text-purple-600"
                  : widget.color === "yellow"
                    ? "bg-yellow-100 text-yellow-600"
                    : widget.color === "orange"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600",
          )}
        >
          <widget.icon className="w-5 h-5" />
        </div>
        {widget.data.change && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              widget.data.trend === "up"
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50",
            )}
          >
            {widget.data.trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {widget.data.change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {widget.data.value}
      </div>
      <div className="text-sm text-gray-600">{widget.title}</div>
    </div>
  );

  const ChartWidget = ({ widget }: { widget: NestedWidget }) => {
    const isExpanded = expandedWidgets.includes(widget.id);
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">{widget.title}</h4>
          <div className="flex items-center gap-2">
            {widget.expandable && (
              <button
                onClick={() => toggleWidget(widget.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {widget.configurable && (
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {widget.id === "revenue-chart" ? (
          <div className="h-32 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end gap-2 w-full">
              {widget.data.values.map((value: number, index: number) => (
                <div
                  key={index}
                  className="bg-green-500 rounded-t"
                  style={{
                    height: `${(value / Math.max(...widget.data.values)) * 80}px`,
                    width: "100%",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {widget.data.completion}%
              </div>
              <div className="text-xs text-gray-600">الإنجاز</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {widget.data.efficiency}%
              </div>
              <div className="text-xs text-gray-600">الكفاءة</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {widget.data.quality}%
              </div>
              <div className="text-xs text-gray-600">الجودة</div>
            </div>
          </div>
        )}

        {isExpanded && widget.data.labels && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-600">
              {widget.data.labels.map((label: string, index: number) => (
                <div key={index} className="text-center">
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ListWidget = ({ widget }: { widget: NestedWidget }) => {
    const isExpanded = expandedWidgets.includes(widget.id);
    const displayItems = isExpanded ? widget.data : widget.data.slice(0, 2);

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">{widget.title}</h4>
          {widget.expandable && (
            <button
              onClick={() => toggleWidget(widget.id)}
              className="text-blue-600 text-sm font-medium"
            >
              {isExpanded ? "إخفاء" : `عرض الكل (${widget.data.length})`}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {displayItems.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-900">
                  {item.time}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.patient}
                  </div>
                  <div className="text-xs text-gray-600">{item.type}</div>
                </div>
              </div>
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  item.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700",
                )}
              >
                {item.status === "confirmed" ? "مؤكد" : "قيد الانتظار"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProgressWidget = ({ widget }: { widget: NestedWidget }) => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <widget.icon
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            widget.color === "yellow"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600",
          )}
        />
        <div className="text-xl font-bold text-yellow-600">
          {widget.data.value}%
        </div>
      </div>
      <div className="mb-2">
        <div className="text-sm font-medium text-gray-900 mb-1">
          {widget.title}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${widget.data.value}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-gray-600">{widget.data.label}</div>
    </div>
  );

  const ActivityWidget = ({ widget }: { widget: NestedWidget }) => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">{widget.title}</h4>
        {widget.refreshable && (
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {widget.data.map((activity: any) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                activity.type === "appointment"
                  ? "bg-blue-100 text-blue-600"
                  : activity.type === "payment"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600",
              )}
            >
              {activity.type === "appointment" ? (
                <Calendar className="w-4 h-4" />
              ) : activity.type === "payment" ? (
                <DollarSign className="w-4 h-4" />
              ) : (
                <Star className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>
              <p className="text-sm text-gray-600">{activity.user}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWidget = (widget: NestedWidget) => {
    switch (widget.type) {
      case "metric":
        return <MetricWidget widget={widget} />;
      case "chart":
        return <ChartWidget widget={widget} />;
      case "list":
        return <ListWidget widget={widget} />;
      case "progress":
        return <ProgressWidget widget={widget} />;
      case "activity":
        return <ActivityWidget widget={widget} />;
      default:
        return <div>Widget type not supported</div>;
    }
  };

  const WidgetContainerComponent = ({
    container,
  }: {
    container: WidgetContainer;
  }) => {
    const isExpanded = expandedContainers.includes(container.id);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Container Header */}
        <div
          className={cn("bg-gradient-to-r text-white p-4", container.gradient)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <container.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{container.title}</h3>
                {container.description && (
                  <p className="text-white/80 text-xs">
                    {container.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editable && (
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              )}
              {container.collapsible && (
                <button
                  onClick={() => toggleContainer(container.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Container Content */}
        {isExpanded && (
          <div className="p-2">
            {container.layout === "grid" ? (
              <div
                className={cn(
                  "grid gap-2",
                  compact
                    ? "grid-cols-2"
                    : `grid-cols-${container.columns || 2}`,
                )}
              >
                {container.widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={cn(
                      "bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm",
                      getWidgetSize(widget.size, compact),
                    )}
                  >
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
            ) : container.layout === "flex" ? (
              <div className="flex gap-2">
                {container.widgets.map((widget) => (
                  <div key={widget.id} className="flex-1 bg-gray-50 rounded-xl">
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {container.widgets.map((widget) => (
                  <div key={widget.id} className="bg-gray-50 rounded-xl">
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              لوحة تحكم العيادة
            </h1>
            <p className="text-sm text-gray-600">نظرة شاملة على أداء العيادة</p>
          </div>

          <div className="flex items-center gap-2">
            {editable && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-colors",
                  editMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {editMode ? "حفظ" : "تحرير"}
              </button>
            )}
            <button className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Widget Containers */}
      <div className="grid gap-4">
        {containers.map((container) => (
          <WidgetContainerComponent key={container.id} container={container} />
        ))}
      </div>

      {/* Quick Action Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Plus, label: "موعد جديد", color: "blue" },
            { icon: Users, label: "مريض جديد", color: "green" },
            { icon: FileText, label: "تقرير", color: "purple" },
            { icon: Settings, label: "إعدادات", color: "gray" },
          ].map((action, index) => (
            <button
              key={index}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105",
                action.color === "blue"
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : action.color === "green"
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : action.color === "purple"
                      ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100",
              )}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
