import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  MessageCircle,
  Download,
  FileText,
  Filter,
  FlaskConical,
  LineChart,
  MapPin,
  Pill,
  PieChart,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import * as Recharts from "recharts";
import {
  sharedClinicData,
  type Appointment,
  type Patient,
  type Treatment,
  type TreatmentPlan,
} from "@/services/sharedClinicData";

function SectionCard({ title, icon: Icon, children, action }: { title: string; icon: React.ComponentType<any>; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-600" /> {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatMini({ label, value, color = "blue" as "blue"|"green"|"purple"|"red"|"orange"|"teal"|"indigo"|"cyan", icon: Icon }:{ label:string; value: React.ReactNode; color?:"blue"|"green"|"purple"|"red"|"orange"|"teal"|"indigo"|"cyan"; icon: React.ComponentType<any>; }){
  const colorMap: Record<string,string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-rose-50 text-rose-600 border-rose-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    teal: "bg-teal-50 text-teal-600 border-teal-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
  };
  return (
    <div className={cn("p-3 rounded-xl border flex items-center gap-2", colorMap[color])}>
      <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-gray-600">{label}</div>
        <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function TabPills({ items, current, onChange }:{ items:{key:string; label:string; to:string;}[]; current:string; onChange:(k:string)=>void }){
  return (
    <div className="sticky top-28 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/60 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 overflow-x-auto h-12">
        {items.map((it)=> (
          <Link
            key={it.key}
            to={it.to}
            onClick={()=>onChange(it.key)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border",
              current===it.key ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SmartClinic(){
  const location = useLocation();
  const navigate = useNavigate();
  const base = "/dentist-hub/smart-clinic";
  const sectionFromPath = useMemo(()=>{
    const seg = location.pathname.replace(base, "").split("/").filter(Boolean)[0];
    return seg || "main";
  }, [location.pathname]);
  const [section, setSection] = useState<string>(sectionFromPath);
  useEffect(()=> setSection(sectionFromPath), [sectionFromPath]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const [pts, appts, trts, tps] = await Promise.all([
        sharedClinicData.getPatients(),
        sharedClinicData.getAppointments(),
        sharedClinicData.getTreatments(),
        sharedClinicData.getTreatmentPlans(),
      ]);
      if(!mounted) return;
      setPatients(pts);
      setAppointments(appts);
      setTreatments(trts);
      setPlans(tps);
    })();
    return ()=>{ mounted=false; };
  },[]);

  // Derived analytics
  const ageBuckets = useMemo(()=>{
    const buckets: Record<string, number> = { "<18":0, "18-25":0, "26-35":0, "36-45":0, "46-60":0, ">60":0 };
    for(const p of patients){
      if(p.age<18) buckets["<18"]++;
      else if(p.age<=25) buckets["18-25"]++;
      else if(p.age<=35) buckets["26-35"]++;
      else if(p.age<=45) buckets["36-45"]++;
      else if(p.age<=60) buckets["46-60"]++;
      else buckets[">60"]++;
    }
    return buckets;
  },[patients]);

  const locationDist = useMemo(()=>{
    const map = new Map<string,number>();
    patients.forEach(p=>{
      const region = (p.address || "").split("،")[0] || (p.address || "").split(",")[0] || p.address || "غير محدد";
      map.set(region, (map.get(region)||0)+1);
    });
    return Array.from(map.entries()).map(([name,value])=>({name,value}));
  },[patients]);

  const newVsReturning = useMemo(()=>{
    let newcomers=0, returning=0;
    for(const p of patients){
      if(p.totalVisits<=1) newcomers++; else returning++;
    }
    return { newcomers, returning };
  },[patients]);

  const commonConditions = useMemo(()=>{
    const map = new Map<string, number>();
    patients.forEach(p=>{
      p.medicalHistory.forEach(cond=> map.set(cond, (map.get(cond)||0)+1));
    });
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,6);
  },[patients]);

  const treatmentCounts = useMemo(()=>{
    const map = new Map<string, {count:number; priceSum:number; priceAvg:number}>();
    const priceOf = (name:string)=> treatments.find(t=>t.name===name)?.price ?? 0;
    appointments.forEach(a=>{
      const entry = map.get(a.treatment) || {count:0, priceSum:0, priceAvg:0};
      entry.count += 1;
      entry.priceSum += priceOf(a.treatment);
      map.set(a.treatment, entry);
    });
    return Array.from(map.entries()).map(([name, v])=>({ name, count: v.count, avg: v.count? Math.round(v.priceSum/v.count):0 }));
  },[appointments, treatments]);

  const avgSessionTime = useMemo(()=>{
    if(appointments.length===0) return 0;
    const sum = appointments.reduce((s,a)=> s + (a.duration||0), 0);
    return Math.round(sum/appointments.length);
  },[appointments]);

  const revenuePerPatient = useMemo(()=>{
    if(patients.length===0) return 0;
    const sum = patients.reduce((s,p)=> s + (p.totalSpent||0),0);
    return Math.round(sum / patients.length);
  },[patients]);

  const chartsData = useMemo(()=>{
    // Basic MoM by month derived from patients' lastVisit & totalSpent as a proxy
    const map = new Map<string, {patients:number; revenue:number}>();
    patients.forEach(p=>{
      const month = (p.lastVisit||"").slice(0,7) || "—";
      const v = map.get(month) || {patients:0, revenue:0};
      v.patients += 1;
      v.revenue += p.totalSpent||0;
      map.set(month, v);
    });
    const rows = Array.from(map.entries()).map(([month, v])=>({ month, patients: v.patients, revenue: v.revenue }));
    return rows.sort((a,b)=> a.month.localeCompare(b.month));
  },[patients]);

  const smartAlerts = useMemo(()=>{
    const alerts: {type:"warning"|"info"|"success"; text:string}[] = [];
    const total = patients.length || 1;
    const newPct = Math.round((newVsReturning.newcomers/total)*100);
    if(newPct < 30) alerts.push({ type:"warning", text:`نسبة المرضى الجدد منخفضة (${newPct}%). جرب حملات تعريفية.` });
    const gumDemand = (treatmentCounts.find(t=> t.name.includes("لثة"))?.count||0);
    if(gumDemand>0) alerts.push({ type:"info", text:"هناك زيادة في طلبات علاج اللثة مقارنةً بالفترة السابقة." });
    const totalAppts = appointments.length || 1;
    const noShows = appointments.filter(a=> a.status === "cancelled").length;
    const noShowRate = Math.round((noShows / totalAppts) * 100);
    alerts.push({ type:"info", text:`معدل عدم حضور المرضى للمواعيد ≈ ${noShowRate}%` });
    return alerts;
  },[patients.length, newVsReturning, treatmentCounts, appointments]);

  const kpis = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <StatMini label="متوسط وقت الجلسة" value={`${avgSessionTime} د`} color="teal" icon={Clock} />
      <StatMini label="العائد لكل مريض" value={`${revenuePerPatient.toLocaleString()} IQD`} color="purple" icon={CreditCard} />
      <StatMini label="عدد المرضى" value={patients.length} color="indigo" icon={Users} />
      <StatMini label="مناطق رئيسية" value={locationDist.slice(0,1).map(d=>d.name).join(" ") || "—"} color="orange" icon={MapPin} />
    </div>
  );

  const tabs = [
    { key:"main", label:"الصفحة الرئيسية", to:`${base}/main` },
    { key:"chatbot", label:"المساعد الذكي", to:`${base}/chatbot` },
    { key:"learning", label:"مكتبة التعلم", to:`${base}/learning` },
  ];

  // المساعد الذكي المحسن متاح الآن

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">العيادة الذكية</div>
              <div className="text-[11px] text-gray-600">تحليلات، تقارير، تنبيهات وذكاء اصطناعي</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">المساعد الذكي متاح</span>
          </div>
        </div>
      </div>

      <TabPills items={tabs} current={section} onChange={(k)=> setSection(k)} />

      {section==="main" && (
        <div className="space-y-4">
          <SectionCard title="مرحباً بك في العيادة الذكية" icon={Sparkles}>
            <p className="text-sm text-gray-700 mb-4">
              نظام متكامل لإدارة العيادة بالذكاء الاصطناعي مع تحليلات متقدمة وتقارير شاملة
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900">{patients.length} مريض</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900">{appointments.length} موعد</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900">نظام نشط</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="الوصول السريع" icon={Activity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(`${base}/chatbot`)}
                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" />
                  <div className="text-right">
                    <p className="font-semibold">المساعد الذكي</p>
                    <p className="text-xs opacity-90">احصل على استشارات فورية</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => navigate(`${base}/learning`)}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <div className="text-right">
                    <p className="font-semibold">مكتبة التعلم</p>
                    <p className="text-xs opacity-90">مصادر ومعلومات طبية</p>
                  </div>
                </div>
              </button>
            </div>
          </SectionCard>

          <SectionCard title="مؤشرات الأداء" icon={Activity}>
            {kpis}
          </SectionCard>

          <SectionCard title="تنبيهات ذكية" icon={Bell}>
            <div className="space-y-2">
              {smartAlerts.map((a, i)=> (
                <div key={i} className={cn("p-2 rounded-xl text-sm", a.type==="warning"? "bg-amber-50 text-amber-800" : a.type==="success"? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>{a.text}</div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {section==="chatbot" && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-4">المساعد الذكي متاح الآن. انتقل إلى الصفحة المخصصة للحصول على تجربة كاملة.</p>
          <button
            onClick={() => navigate(`${base}/chatbot`)}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            فتح المساعد الذكي
          </button>
        </div>
      )}

      {section==="learning" && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-4">مكتبة التعلم تحتوي على مصادر تعليمية ومعلومات طبية محدثة.</p>
          <button
            onClick={() => navigate(`${base}/learning`)}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            فتح مكتبة التعلم
          </button>
        </div>
      )}

    </div>
  );
}
