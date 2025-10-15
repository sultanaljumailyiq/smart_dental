import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, MessageCircle, BookOpen, Activity, Users, Calendar, TrendingUp, Sparkles, ArrowRight, Clock, BarChart3, Bell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, type Patient, type Appointment } from "@/services/sharedClinicData";
export default function SmartClinicMain() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [pts, appts] = await Promise.all([sharedClinicData.getPatients(), sharedClinicData.getAppointments()]);
      if (!mounted) return;
      setPatients(pts);
      setAppointments(appts);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const stats = useMemo(() => {
    const todayAppts = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10)).length;
    const totalRevenue = patients.reduce((sum, p) => sum + (p.totalSpent || 0), 0);
    const avgPerPatient = patients.length > 0 ? Math.round(totalRevenue / patients.length) : 0;
    return {
      todayAppts,
      totalPatients: patients.length,
      avgPerPatient,
      totalRevenue
    };
  }, [patients, appointments]);
  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    color,
    onClick
  }: {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
  }) => <button onClick={onClick} className={cn("group relative p-6 rounded-2xl border-2 border-transparent transition-all hover:scale-105 hover:shadow-xl", "bg-gradient-to-br", color)}>
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>;
  const StatCard = ({
    icon: Icon,
    label,
    value,
    color
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string | number;
    color: string;
  }) => <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Hero Section */}
        

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الوصول السريع</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <QuickActionCard icon={MessageCircle} title="المساعد الذكي" description="احصل على استشارات طبية فورية وتحليلات ذكية" color="from-blue-500 to-cyan-500" onClick={() => navigate("/dentist-hub/smart-clinic/chatbot")} />
            <QuickActionCard icon={BookOpen} title="مكتبة المعرفة" description="مصادر تعليمية ومعلومات طبية محدثة" color="from-purple-500 to-pink-500" onClick={() => navigate("/dentist-hub/smart-clinic/learning")} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الإحصائيات</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label="مواعيد اليوم" value={stats.todayAppts} color="bg-blue-500" />
            <StatCard icon={Users} label="إجمالي المرضى" value={stats.totalPatients} color="bg-purple-500" />
            <StatCard icon={BarChart3} label="الإيرادات" value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`} color="bg-green-500" />
            <StatCard icon={Clock} label="متوسط الانتظار" value="12 د" color="bg-orange-500" />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            المزايا الذكية
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <Bell className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">تنبيهات ذكية</h3>
              <p className="text-sm text-gray-600">
                تلقَ إشعارات تلقائية للمواعيد والتذكيرات المهمة
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">تحليلات متقدمة</h3>
              <p className="text-sm text-gray-600">
                تقارير مفصلة وإحصائيات شاملة لأداء العيادة
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Brain className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">ذكاء اصطناعي</h3>
              <p className="text-sm text-gray-600">
                توصيات وخطط علاج مدعومة بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}