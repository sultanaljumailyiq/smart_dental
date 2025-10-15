import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Calendar,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Building2,
  RefreshCw,
} from "lucide-react";
import SmartClinicSubNav from "@/components/SmartClinicSubNav";
import { clinicDataIntegration, type IntegratedClinicData, type ClinicInsight } from "@/services/clinicDataIntegration";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SmartClinicMainRebuilt() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<IntegratedClinicData | null>(null);
  const [insights, setInsights] = useState<ClinicInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const integratedData = await clinicDataIntegration.getIntegratedData();
      const generatedInsights = await clinicDataIntegration.generateInsights(integratedData);
      
      setData(integratedData);
      setInsights(generatedInsights);
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

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: any) => (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-right w-full"
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", `bg-${color}-50`)}>
          <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
      </div>
    </button>
  );

  const InsightCard = ({ insight }: { insight: ClinicInsight }) => {
    const iconMap = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Clock,
      danger: AlertTriangle,
    };
    const Icon = iconMap[insight.type];

    const colorMap = {
      success: "green",
      warning: "orange",
      info: "blue",
      danger: "red",
    };
    const color = colorMap[insight.type];

    return (
      <div className={cn("p-4 rounded-xl border", `bg-${color}-50 border-${color}-200`)}>
        <div className="flex items-start gap-3">
          <Icon className={cn("w-5 h-5 flex-shrink-0", `text-${color}-600`)} />
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold mb-1", `text-${color}-900`)}>{insight.title}</h4>
            <p className={cn("text-sm", `text-${color}-700`)}>{insight.description}</p>
            {insight.action && (
              <Button
                variant="link"
                className={cn("p-0 h-auto mt-2", `text-${color}-600 hover:text-${color}-700`)}
                onClick={() => navigate(insight.action!.path)}
              >
                {insight.action.label} ←
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${color}-50`)}>
          <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
        </div>
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

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">العيادة الذكية</h1>
              <p className="text-blue-100">مركز التحكم الذكي لإدارة عيادتك</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <Sparkles className="w-4 h-4" />
            <span>يعمل بتقنيات الذكاء الاصطناعي المتقدمة</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="إجمالي المرضى"
            value={data.totalPatients}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="مواعيد اليوم"
            value={data.todayAppointments}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="المخزون المنخفض"
            value={data.lowStock}
            icon={Package}
            color="orange"
          />
          <StatCard
            title="طلبات المختبر"
            value={data.pendingLabOrders}
            icon={Building2}
            color="purple"
          />
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              الاستشارات الذكية
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {insights.slice(0, 4).map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الخيارات السريعة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="إدارة المواعيد"
              description="عرض وإدارة مواعيد اليوم"
              icon={Calendar}
              color="blue"
              onClick={() => navigate("/clinic/reservations")}
            />
            <QuickActionCard
              title="المرضى"
              description="إدارة ملفات المرضى"
              icon={Users}
              color="green"
              onClick={() => navigate("/clinic/patients")}
            />
            <QuickActionCard
              title="المختبر"
              description="متابعة طلبات المختبر"
              icon={Package}
              color="purple"
              onClick={() => navigate("/clinic/lab")}
            />
            <QuickActionCard
              title="التقارير المالية"
              description="عرض الإيرادات والمصروفات"
              icon={TrendingUp}
              color="emerald"
              onClick={() => navigate("/clinic/accounts")}
            />
            <QuickActionCard
              title="التقارير والإحصائيات"
              description="تحليل شامل لأداء العيادة"
              icon={BarChart3}
              color="indigo"
              onClick={() => navigate("/dentist-hub/smart-clinic/reports")}
            />
            <QuickActionCard
              title="المساعد الذكي"
              description="احصل على مساعدة فورية"
              icon={Brain}
              color="cyan"
              onClick={() => navigate("/dentist-hub/smart-clinic/ai-assistant")}
            />
          </div>
        </div>

        {/* Build Report Button */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">بناء تقرير مخصص</h3>
              <p className="text-sm text-gray-600">
                احصل على تقرير شامل مبني على بيانات عيادتك بتقنية الذكاء الاصطناعي
              </p>
            </div>
            <Button
              onClick={() => navigate("/dentist-hub/smart-clinic/reports")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              بناء التقرير
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
