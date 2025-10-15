import React, { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Image,
  Calendar,
  Filter,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Printer,
  Mail,
  Share2,
  Cloud,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLoading, ProgressBar } from "./LoadingIndicators";

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: "pdf" | "excel" | "csv" | "json";
  category: "financial" | "inventory" | "customers" | "sales" | "analytics";
  icon: React.ElementType;
  fields: string[];
  isCustomizable: boolean;
  estimatedSize: string;
}

interface ExportJob {
  id: string;
  templateName: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: string;
  downloadUrl?: string;
  fileSize?: string;
  expiresAt?: string;
}

const exportTemplates: ExportTemplate[] = [
  {
    id: "financial-report",
    name: "التقرير المالي الشامل",
    description: "تقرير مفصل يشمل الإيرادات والمصروفات والأرباح",
    type: "pdf",
    category: "financial",
    icon: DollarSign,
    fields: [
      "الإيرادات",
      "المصروفات",
      "صافي الربح",
      "التدفق النقدي",
      "المؤشرات المالية",
    ],
    isCustomizable: true,
    estimatedSize: "2.5 MB",
  },
  {
    id: "inventory-sheet",
    name: "كشف المخزون",
    description: "جدول بيانات شامل لجميع المنتجات والكميات",
    type: "excel",
    category: "inventory",
    icon: Package,
    fields: [
      "اسم المنتج",
      "الكمية الحالية",
      "الحد الأدنى",
      "السعر",
      "الموقع",
      "تاريخ الانتهاء",
    ],
    isCustomizable: true,
    estimatedSize: "1.8 MB",
  },
  {
    id: "customer-database",
    name: "قاعدة بيانات العملاء",
    description: "معلومات العملاء وت��ريخ المشتريات",
    type: "csv",
    category: "customers",
    icon: Users,
    fields: [
      "الاسم",
      "البريد الإلكتروني",
      "الهاتف",
      "العنوان",
      "تاريخ التسجيل",
      "إجمالي المشتريات",
    ],
    isCustomizable: true,
    estimatedSize: "850 KB",
  },
  {
    id: "sales-analytics",
    name: "تحليلات المبيعات",
    description: "تقرير تحليلي مرئي للمبيعات والاتجاهات",
    type: "pdf",
    category: "analytics",
    icon: BarChart3,
    fields: [
      "المبيعات الشهرية",
      "المنتجات الأكثر مبيعاً",
      "تحليل العملاء",
      "التوقعات",
    ],
    isCustomizable: false,
    estimatedSize: "3.2 MB",
  },
  {
    id: "orders-history",
    name: "تاريخ الطلبات",
    description: "سجل كامل لجميع الطلبات والمعاملات",
    type: "excel",
    category: "sales",
    icon: ShoppingCart,
    fields: [
      "رقم الطلب",
      "العميل",
      "التاريخ",
      "المبلغ",
      "الحالة",
      "تفاصيل المنتجات",
    ],
    isCustomizable: true,
    estimatedSize: "4.1 MB",
  },
];

const mockExportJobs: ExportJob[] = [
  {
    id: "1",
    templateName: "التقرير المالي الشامل",
    status: "completed",
    progress: 100,
    createdAt: "2024-01-15T14:30:00Z",
    downloadUrl: "/exports/financial-report-jan-2024.pdf",
    fileSize: "2.3 MB",
    expiresAt: "2024-01-22T14:30:00Z",
  },
  {
    id: "2",
    templateName: "كشف المخزون",
    status: "processing",
    progress: 65,
    createdAt: "2024-01-15T15:15:00Z",
  },
  {
    id: "3",
    templateName: "قاعدة بيانات العملاء",
    status: "pending",
    progress: 0,
    createdAt: "2024-01-15T15:20:00Z",
  },
];

interface DataExportProps {
  className?: string;
}

export function DataExport({ className }: DataExportProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ExportTemplate | null>(null);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(mockExportJobs);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [exportFormat, setExportFormat] = useState<
    "pdf" | "excel" | "csv" | "json"
  >("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const categories = [
    { id: "all", label: "جميع الفئات", icon: BarChart3 },
    { id: "financial", label: "المالية", icon: DollarSign },
    { id: "inventory", label: "المخزون", icon: Package },
    { id: "customers", label: "العملاء", icon: Users },
    { id: "sales", label: "المبيعات", icon: ShoppingCart },
    { id: "analytics", label: "التحليلات", icon: BarChart3 },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? exportTemplates
      : exportTemplates.filter(
          (template) => template.category === selectedCategory,
        );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-600" />;
      case "excel":
        return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
      case "csv":
        return <File className="w-8 h-8 text-blue-600" />;
      case "json":
        return <File className="w-8 h-8 text-purple-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const startExport = async (template: ExportTemplate) => {
    setIsExporting(true);

    // Simulate export process
    const newJob: ExportJob = {
      id: Date.now().toString(),
      templateName: template.name,
      status: "processing",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setExportJobs((prev) => [newJob, ...prev]);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExportJobs((prev) =>
        prev.map((job) =>
          job.id === newJob.id ? { ...job, progress: i } : job,
        ),
      );
    }

    // Complete the job
    setExportJobs((prev) =>
      prev.map((job) =>
        job.id === newJob.id
          ? {
              ...job,
              status: "completed",
              downloadUrl: `/exports/${template.id}-${Date.now()}.${template.type}`,
              fileSize: template.estimatedSize,
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            }
          : job,
      ),
    );

    setIsExporting(false);
    setSelectedTemplate(null);
  };

  const downloadFile = (job: ExportJob) => {
    if (job.downloadUrl) {
      // Simulate download
      const link = document.createElement("a");
      link.href = job.downloadUrl;
      link.download = job.downloadUrl.split("/").pop() || "download";
      link.click();
    }
  };

  return (
    <div className={cn("space-y-6", className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تصدير البيانات</h2>
          <p className="text-gray-600">تصدير وتحميل البيانات بصيغ مختلفة</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            الإعدادات
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            تصدير مخصص
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Templates */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">قوالب التصدير</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <template.icon className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        {getFileTypeIcon(template.type)}
                        {template.type.toUpperCase()}
                      </span>
                      <span>حجم متوقع: {template.estimatedSize}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.fields.slice(0, 3).map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                      {template.fields.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.fields.length - 3} المزيد
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ButtonLoading
                    loading={
                      isExporting && selectedTemplate?.id === template.id
                    }
                    onClick={() => {
                      setSelectedTemplate(template);
                      startExport(template);
                    }}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4" />
                    تصدير
                  </ButtonLoading>

                  {template.isCustomizable && (
                    <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Jobs History */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">سجل التصدير</h3>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {exportJobs.length === 0 ? (
              <div className="p-6 text-center">
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">لا توجد عمليات تصدير</p>
              </div>
            ) : (
              exportJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        getStatusColor(job.status),
                      )}
                    >
                      {getStatusIcon(job.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                        {job.templateName}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {formatDate(job.createdAt)}
                      </p>

                      {job.status === "processing" && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>التقدم</span>
                            <span>{job.progress}%</span>
                          </div>
                          <ProgressBar
                            progress={job.progress}
                            color="blue"
                            showPercentage={false}
                          />
                        </div>
                      )}

                      {job.status === "completed" && (
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            <div>حجم الملف: {job.fileSize}</div>
                            <div>
                              ينتهي:{" "}
                              {job.expiresAt && formatDate(job.expiresAt)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => downloadFile(job)}
                              className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors">
                              <Share2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h4 className="font-medium text-gray-900 mb-3">إجراءات سريعة</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                <Printer className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">طباعة التقارير</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">إرسال بالبريد</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                <Cloud className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">رفع للسحابة</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                <Smartphone className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">نسخة للجوال</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataExport;
