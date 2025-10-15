import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, BarChart3, TrendingUp, Users, Calendar, Package, DollarSign, Activity, FileText, RefreshCw } from "lucide-react";
import SmartClinicSubNav from "@/components/SmartClinicSubNav";
import { clinicDataIntegration, type IntegratedClinicData } from "@/services/clinicDataIntegration";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAIDentalAssistant } from "@/hooks/useAIDentalAssistant";

export default function SmartClinicReports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<IntegratedClinicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const { generateReport, isLoading: aiLoading } = useAIDentalAssistant({
    clinicId: "clinic-1",
    agentType: "clinic",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const integratedData = await clinicDataIntegration.getIntegratedData();
      setData(integratedData);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIReport = async () => {
    setGenerating(true);
    try {
      const result = await generateReport("comprehensive");
      if (result) {
        toast({
          title: "تم إنشاء التقرير",
          description: "تم إنشاء التقرير بنجاح باستخدام الذكاء الاصطناعي",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل إنشاء التقرير",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <SmartClinicSubNav />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${color}-50`)}>
          <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium", trend > 0 ? "text-green-600" : "text-red-600")}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Sub Navigation */}
        <SmartClinicSubNav />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
                <p className="text-sm text-gray-600">تحليل شامل لأداء العيادة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerateAIReport}
                disabled={generating || aiLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generating || aiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 ml-2" />
                    إنشاء تقرير ذكي
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="إجمالي المرضى"
            value={data.totalPatients}
            icon={Users}
            color="blue"
            trend={12}
          />
          <StatCard
            title="مواعيد اليوم"
            value={data.todayAppointments}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="الإيرادات الشهرية"
            value={`${(data.monthlyRevenue / 1000000).toFixed(1)}م`}
            icon={DollarSign}
            color="emerald"
            trend={8}
          />
          <StatCard
            title="طلبات المختبر"
            value={data.pendingLabOrders}
            icon={Package}
            color="purple"
          />
        </div>

        {/* Advanced Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              مؤشرات الأداء
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل الإكمال</span>
                  <span className="text-sm font-medium text-gray-900">{data.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${data.completionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل الاحتفاظ بالمرضى</span>
                  <span className="text-sm font-medium text-gray-900">{data.patientRetentionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${data.patientRetentionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              التحليل المالي
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm text-gray-700">متوسط الإيرادات للمريض</span>
                <span className="text-sm font-bold text-emerald-700">
                  {data.avgRevenuePerPatient.toLocaleString()} د.ع
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">متوسط المرضى يومياً</span>
                <span className="text-sm font-bold text-blue-700">
                  {data.avgPatientsPerDay.toFixed(1)} مريض
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">أحدث المرضى</h3>
            <div className="space-y-3">
              {data.recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-xs text-gray-600">آخر زيارة: {patient.lastVisit}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    patient.status === "active" ? "bg-green-100 text-green-700" :
                    patient.status === "in_treatment" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {patient.status === "active" ? "نشط" :
                     patient.status === "in_treatment" ? "قيد العلاج" : "مكتمل"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">المواعيد القادمة</h3>
            <div className="space-y-3">
              {data.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-xs text-gray-600">{appointment.treatment}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-xs text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
