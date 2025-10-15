import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Camera,
  Plus,
  Edit,
  Download,
  Share,
  AlertTriangle,
  CheckCircle,
  Brain,
  Heart,
  Activity,
  Pill,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  ChevronRight,
  Users,
  Stethoscope,
  EyeIcon,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  X,
  UserCheck,
  Thermometer,
  Droplets,
  PieChart,
  BarChart3,
  LineChart,
  Calendar as CalendarIcon,
  BookOpen,
  ClipboardList,
  Bookmark,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";


// Mock patient data - Enhanced
const patientData = {
  id: "P001",
  name: "Willie Jennie",
  arabicName: "وليام جيني",
  age: 28,
  gender: "Male",
  email: "willie.jennie@gmail.com",
  phone: "(368) 316-4463",
  address: "8300 Barby Hill, Los Angeles, CA 90210",
  dateOfBirth: "1995-06-15",
  bloodType: "O+",
  avatar: "W.J",
  memberSince: "2022-03-15",
  totalVisits: 12,
  lastVisit: "2024-01-15",
  nextAppointment: "2024-02-15",
  emergencyContact: {
    name: "Sarah Jennie",
    relation: "Spouse",
    phone: "(368) 316-4464",
  },
  insurance: {
    provider: "Delta Dental",
    policyNumber: "DD123456789",
    groupNumber: "GRP001",
    coverageLevel: "Premium",
    validUntil: "2024-12-31",
  },
  vitalSigns: {
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    temperature: 36.6,
    lastChecked: "2024-01-15",
  },
  medicalHistory: {
    allergies: ["Penicillin", "Latex", "Shellfish"],
    medications: ["Ibuprofen 400mg", "Vitamin D 1000IU", "Omega-3"],
    conditions: ["Hypertension", "Diabetes Type 2", "High Cholesterol"],
    chronicConditions: ["Diabetes Type 2"],
    lastUpdate: "2024-01-15",
  },
  dentalHistory: {
    lastCleaning: "2023-12-10",
    lastXray: "2023-11-15",
    orthodonticHistory: false,
    riskLevel: "Low",
    oralHygiene: "Excellent",
    previousTreatments: [
      {
        id: 1,
        date: "2023-12-10",
        treatment: "Routine Cleaning",
        provider: "Dr. Sarah Johnson",
        notes: "Good oral hygiene, minor tartar buildup",
        status: "completed",
        tooth: null,
      },
      {
        id: 2,
        date: "2023-10-05",
        treatment: "Filling - Tooth #14",
        provider: "Dr. Michael Chen",
        notes: "Composite filling placed on mesial surface",
        status: "completed",
        tooth: 14,
      },
      {
        id: 3,
        date: "2023-08-20",
        treatment: "Root Canal - Tooth #18",
        provider: "Dr. Sarah Johnson",
        notes: "Root canal therapy completed successfully",
        status: "completed",
        tooth: 18,
      },
    ],
  },
  appointments: [
    {
      id: 1,
      date: "2024-02-15",
      time: "10:00 AM",
      type: "Follow-up Checkup",
      provider: "Dr. Sarah Johnson",
      status: "scheduled",
      priority: "medium",
      duration: "45 minutes",
    },
    {
      id: 2,
      date: "2024-01-20",
      time: "2:00 PM",
      type: "Routine Cleaning",
      provider: "Lisa Thompson",
      status: "completed",
      priority: "low",
      duration: "60 minutes",
    },
    {
      id: 3,
      date: "2024-03-10",
      time: "9:00 AM",
      type: "Cavity Treatment",
      provider: "Dr. Michael Chen",
      status: "scheduled",
      priority: "high",
      duration: "90 minutes",
    },
  ],
  healthScore: 85,
  riskFactors: ["Diabetes", "Family History"],
  preferences: {
    appointmentTime: "Morning",
    reminderMethod: "SMS",
    language: "English",
  },
};

// Enhanced dental chart data
const dentalChart = {
  upperTeeth: [
    { number: 11, status: "healthy", condition: "Excellent" },
    { number: 12, status: "healthy", condition: "Good" },
    { number: 13, status: "healthy", condition: "Good" },
    { number: 14, status: "filled", condition: "Fair", lastTreatment: "2023-10-05" },
    { number: 15, status: "healthy", condition: "Good" },
    { number: 16, status: "healthy", condition: "Excellent" },
    { number: 17, status: "healthy", condition: "Good" },
    { number: 18, status: "root_canal", condition: "Fair", lastTreatment: "2023-08-20" },
    { number: 21, status: "cavity", condition: "Poor", needsTreatment: true },
    { number: 22, status: "crown", condition: "Good" },
    { number: 23, status: "healthy", condition: "Excellent" },
    { number: 24, status: "healthy", condition: "Good" },
    { number: 25, status: "healthy", condition: "Good" },
    { number: 26, status: "healthy", condition: "Excellent" },
    { number: 27, status: "healthy", condition: "Good" },
    { number: 28, status: "missing", condition: "N/A" },
  ],
  lowerTeeth: [
    { number: 31, status: "healthy", condition: "Excellent" },
    { number: 32, status: "healthy", condition: "Good" },
    { number: 33, status: "healthy", condition: "Good" },
    { number: 34, status: "healthy", condition: "Excellent" },
    { number: 35, status: "crown", condition: "Good" },
    { number: 36, status: "healthy", condition: "Good" },
    { number: 37, status: "healthy", condition: "Excellent" },
    { number: 38, status: "healthy", condition: "Good" },
    { number: 41, status: "healthy", condition: "Excellent" },
    { number: 42, status: "healthy", condition: "Good" },
    { number: 43, status: "healthy", condition: "Good" },
    { number: 44, status: "healthy", condition: "Excellent" },
    { number: 45, status: "healthy", condition: "Good" },
    { number: 46, status: "healthy", condition: "Good" },
    { number: 47, status: "healthy", condition: "Excellent" },
    { number: 48, status: "wisdom_extracted", condition: "N/A" },
  ],
};

const toothStatusColors = {
  healthy: "fill-emerald-100 stroke-emerald-400 hover:fill-emerald-200",
  cavity: "fill-red-100 stroke-red-400 hover:fill-red-200",
  filled: "fill-blue-100 stroke-blue-400 hover:fill-blue-200",
  crown: "fill-yellow-100 stroke-yellow-400 hover:fill-yellow-200",
  root_canal: "fill-purple-100 stroke-purple-400 hover:fill-purple-200",
  missing: "fill-gray-100 stroke-gray-400 hover:fill-gray-200",
  wisdom_extracted: "fill-gray-200 stroke-gray-500 hover:fill-gray-300",
};

const PatientDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "النظرة العامة", arabicLabel: "Patient Overview", icon: User, color: "text-blue-600" },
    { id: "medical", label: "التاريخ الطبي", arabicLabel: "Medical History", icon: Heart, color: "text-red-600" },
    { id: "dental", label: "السجلات السنية", arabicLabel: "Dental Records", icon: FileText, color: "text-green-600" },
    { id: "treatments", label: "خطة العلاج", arabicLabel: "Treatment Plan", icon: Activity, color: "text-purple-600" },
    { id: "appointments", label: "المواعيد", arabicLabel: "Appointments", icon: Calendar, color: "text-orange-600" },
  ];

  const renderToothChart = () => (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">مخطط الأسنان التفاعلي</h3>
          <p className="text-gray-600">انقر على أي سن للحصول على التفاصيل</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all">
            <Camera className="w-4 h-4" />
            التقاط صورة
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all">
            <Plus className="w-4 h-4" />
            إضافة علاج
          </button>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
        {[
          { status: "healthy", label: "سليم", count: 24, color: "emerald" },
          { status: "filled", label: "محشو", count: 1, color: "blue" },
          { status: "crown", label: "تاج", count: 2, color: "yellow" },
          { status: "cavity", label: "تسوس", count: 1, color: "red" },
          { status: "root_canal", label: "علاج جذور", count: 1, color: "purple" },
          { status: "missing", label: "مفقود", count: 3, color: "gray" },
        ].map((item) => (
          <div key={item.status} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
            <div className={`w-5 h-5 bg-${item.color}-200 border-2 border-${item.color}-400 rounded`}></div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.count} أسنان</div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Dental Chart */}
      <div className="space-y-12">
        {/* Upper Teeth */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            الأسنان العلوية
          </h4>
          <div className="flex justify-center">
            <div className="grid grid-cols-8 gap-3 bg-gradient-to-b from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-100">
              {dentalChart.upperTeeth.slice(0, 8).map((tooth, index) => (
                <div key={tooth.number} className="flex flex-col items-center gap-3">
                  <div className="text-xs font-bold text-gray-700">{tooth.number}</div>
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl cursor-pointer transition-all duration-300 border-3 flex items-center justify-center text-sm font-bold hover:scale-110 hover:shadow-lg",
                      toothStatusColors[tooth.status as keyof typeof toothStatusColors],
                      selectedTooth === tooth.number && "ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-xl",
                    )}
                    onClick={() => setSelectedTooth(selectedTooth === tooth.number ? null : tooth.number)}
                  >
                    {tooth.needsTreatment && <AlertTriangle className="w-6 h-6 text-red-600" />}
                    {tooth.status === "healthy" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                    {tooth.status === "filled" && <Shield className="w-6 h-6 text-blue-600" />}
                    {tooth.status === "crown" && <Award className="w-6 h-6 text-yellow-600" />}
                  </div>
                  <div className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    tooth.condition === "Excellent" && "bg-emerald-100 text-emerald-700",
                    tooth.condition === "Good" && "bg-blue-100 text-blue-700", 
                    tooth.condition === "Fair" && "bg-yellow-100 text-yellow-700",
                    tooth.condition === "Poor" && "bg-red-100 text-red-700",
                  )}>
                    {tooth.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-8 gap-3 bg-gradient-to-t from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-100">
              {dentalChart.upperTeeth.slice(8).map((tooth, index) => (
                <div key={tooth.number} className="flex flex-col items-center gap-3">
                  <div className="text-xs font-bold text-gray-700">{tooth.number}</div>
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl cursor-pointer transition-all duration-300 border-3 flex items-center justify-center text-sm font-bold hover:scale-110 hover:shadow-lg",
                      toothStatusColors[tooth.status as keyof typeof toothStatusColors],
                      selectedTooth === tooth.number && "ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-xl",
                    )}
                    onClick={() => setSelectedTooth(selectedTooth === tooth.number ? null : tooth.number)}
                  >
                    {tooth.needsTreatment && <AlertTriangle className="w-6 h-6 text-red-600" />}
                    {tooth.status === "healthy" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                    {tooth.status === "filled" && <Shield className="w-6 h-6 text-blue-600" />}
                    {tooth.status === "crown" && <Award className="w-6 h-6 text-yellow-600" />}
                  </div>
                  <div className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    tooth.condition === "Excellent" && "bg-emerald-100 text-emerald-700",
                    tooth.condition === "Good" && "bg-blue-100 text-blue-700", 
                    tooth.condition === "Fair" && "bg-yellow-100 text-yellow-700",
                    tooth.condition === "Poor" && "bg-red-100 text-red-700",
                  )}>
                    {tooth.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Teeth */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5 rotate-90 text-green-600" />
            الأسنان السفلية
          </h4>
          <div className="flex justify-center">
            <div className="grid grid-cols-8 gap-3 bg-gradient-to-t from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-green-100">
              {dentalChart.lowerTeeth.slice(0, 8).map((tooth, index) => (
                <div key={tooth.number} className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl cursor-pointer transition-all duration-300 border-3 flex items-center justify-center text-sm font-bold hover:scale-110 hover:shadow-lg",
                      toothStatusColors[tooth.status as keyof typeof toothStatusColors],
                      selectedTooth === tooth.number && "ring-4 ring-green-500 ring-offset-2 scale-110 shadow-xl",
                    )}
                    onClick={() => setSelectedTooth(selectedTooth === tooth.number ? null : tooth.number)}
                  >
                    {(tooth.status !== "سليم" && tooth.condition !== "طبيعي") && <AlertTriangle className="w-6 h-6 text-red-600" />}
                    {tooth.status === "healthy" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                    {tooth.status === "filled" && <Shield className="w-6 h-6 text-blue-600" />}
                    {tooth.status === "crown" && <Award className="w-6 h-6 text-yellow-600" />}
                  </div>
                  <div className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    tooth.condition === "Excellent" && "bg-emerald-100 text-emerald-700",
                    tooth.condition === "Good" && "bg-blue-100 text-blue-700", 
                    tooth.condition === "Fair" && "bg-yellow-100 text-yellow-700",
                    tooth.condition === "Poor" && "bg-red-100 text-red-700",
                  )}>
                    {tooth.condition}
                  </div>
                  <div className="text-xs font-bold text-gray-700">{tooth.number}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-8 gap-3 bg-gradient-to-b from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-green-100">
              {dentalChart.lowerTeeth.slice(8).map((tooth, index) => (
                <div key={tooth.number} className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl cursor-pointer transition-all duration-300 border-3 flex items-center justify-center text-sm font-bold hover:scale-110 hover:shadow-lg",
                      toothStatusColors[tooth.status as keyof typeof toothStatusColors],
                      selectedTooth === tooth.number && "ring-4 ring-green-500 ring-offset-2 scale-110 shadow-xl",
                    )}
                    onClick={() => setSelectedTooth(selectedTooth === tooth.number ? null : tooth.number)}
                  >
                    {(tooth.status !== "سليم" && tooth.condition !== "طبيعي") && <AlertTriangle className="w-6 h-6 text-red-600" />}
                    {tooth.status === "healthy" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                    {tooth.status === "filled" && <Shield className="w-6 h-6 text-blue-600" />}
                    {tooth.status === "crown" && <Award className="w-6 h-6 text-yellow-600" />}
                  </div>
                  <div className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    tooth.condition === "Excellent" && "bg-emerald-100 text-emerald-700",
                    tooth.condition === "Good" && "bg-blue-100 text-blue-700", 
                    tooth.condition === "Fair" && "bg-yellow-100 text-yellow-700",
                    tooth.condition === "Poor" && "bg-red-100 text-red-700",
                  )}>
                    {tooth.condition}
                  </div>
                  <div className="text-xs font-bold text-gray-700">{tooth.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Selected Tooth Info */}
      {selectedTooth && (
        <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">
                {selectedTooth}
              </div>
              تفاصيل السن #{selectedTooth}
            </h4>
            <button 
              onClick={() => setSelectedTooth(null)}
              className="p-2 hover:bg-blue-200 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: "الحالة", 
                value: dentalChart.upperTeeth.concat(dentalChart.lowerTeeth).find(t => t.number === selectedTooth)?.status.replace("_", " "), 
                icon: Activity,
                color: "blue"
              },
              { 
                label: "الحالة العامة", 
                value: dentalChart.upperTeeth.concat(dentalChart.lowerTeeth).find(t => t.number === selectedTooth)?.condition, 
                icon: Target,
                color: "green"
              },
              { 
                label: "آخر علاج", 
                value: dentalChart.upperTeeth.concat(dentalChart.lowerTeeth).find(t => t.number === selectedTooth)?.lastTreatment || "لا يوجد", 
                icon: Calendar,
                color: "purple"
              },
              { 
                label: "الفحص التالي", 
                value: "Jun 10, 2024", 
                icon: Clock,
                color: "orange"
              },
            ].map((item, index) => (
              <div key={index} className={`bg-white p-4 rounded-2xl border border-${item.color}-100 shadow-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg">
              <Edit className="w-4 h-4" />
              تحديث السجل
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-lg">
              <Plus className="w-4 h-4" />
              إضافة علاج
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all shadow-lg">
              <Camera className="w-4 h-4" />
              التقاط صورة
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Patient Hero Card - Bento Style */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="grid grid-cols-12 gap-8">
                  {/* Main Info */}
                  <div className="col-span-12 lg:col-span-8">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
                        {patientData.avatar}
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold mb-2">{patientData.name}</h1>
                        <p className="text-white/90 text-lg mb-2">{patientData.arabicName}</p>
                        <div className="flex items-center gap-4 text-white/80">
                          <span className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {patientData.age} سنة
                          </span>
                          <span className="flex items-center gap-2">
                            <Droplets className="w-5 h-5" />
                            {patientData.bloodType}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            عضو منذ {new Date(patientData.memberSince).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "الزيارات", value: patientData.totalVisits, icon: Users, trend: "+2" },
                        { label: "النقاط الصحية", value: patientData.healthScore, icon: Star, trend: "+5" },
                        { label: "العلاجات", value: "3", icon: Stethoscope, trend: "+1" },
                        { label: "المتابعة", value: "ممتاز", icon: TrendingUp, trend: "↗" },
                      ].map((stat, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center justify-between mb-2">
                            <stat.icon className="w-6 h-6 text-white" />
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                              {stat.trend}
                            </span>
                          </div>
                          <div className="text-2xl font-bold mb-1">{stat.value}</div>
                          <div className="text-sm text-white/80">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="col-span-12 lg:col-span-4">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold mb-4">معلومات الاتصال</h3>
                      
                      {[
                        { icon: Phone, label: "الهاتف", value: patientData.phone },
                        { icon: Mail, label: "البريد", value: patientData.email },
                        { icon: MapPin, label: "العنوان", value: patientData.address },
                      ].map((contact, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                              <contact.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">{contact.label}</p>
                              <p className="font-semibold text-sm">{contact.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Dashboard */}
            <div className="grid grid-cols-12 gap-6">
              {/* Vital Signs */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">العلامات الحيوية</h3>
                    <span className="text-sm text-gray-500">آخر فحص: {patientData.vitalSigns.lastChecked}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {patientData.vitalSigns.bloodPressure.systolic}/{patientData.vitalSigns.bloodPressure.diastolic}
                      </div>
                      <p className="text-sm text-gray-600">ضغط الدم</p>
                      <p className="text-xs text-green-600 mt-1">طبيعي</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{patientData.vitalSigns.heartRate}</div>
                      <p className="text-sm text-gray-600">النبض</p>
                      <p className="text-xs text-green-600 mt-1">طبيعي</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Thermometer className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{patientData.vitalSigns.temperature}°</div>
                      <p className="text-sm text-gray-600">الحرارة</p>
                      <p className="text-xs text-green-600 mt-1">طبيعي</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">النقاط الصحية</h3>
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-green-500"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${patientData.healthScore}, 100`}
                            strokeLinecap="round"
                            fill="transparent"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-900">{patientData.healthScore}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">صحة الفم</span>
                        <span className="font-medium text-green-600">ممتاز</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">مستوى الخطر</span>
                        <span className="font-medium text-green-600">منخفض</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="col-span-12 lg:col-span-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات التأمين</h3>
                  <div className="space-y-4">
                    {[
                      { label: "مقدم الخدمة", value: patientData.insurance.provider, icon: Shield },
                      { label: "رقم البوليصة", value: patientData.insurance.policyNumber, icon: FileText },
                      { label: "مستوى التغطية", value: patientData.insurance.coverageLevel, icon: Star },
                      { label: "صالح حتى", value: new Date(patientData.insurance.validUntil).toLocaleDateString('ar-IQ'), icon: Calendar },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <p className="font-semibold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="col-span-12 lg:col-span-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">جهة الاتصال الطارئ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <UserCheck className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{patientData.emergencyContact.name}</h4>
                        <p className="text-gray-600">{patientData.emergencyContact.relation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{patientData.emergencyContact.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all">
                      <Phone className="w-4 h-4" />
                      اتصال طارئ
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="col-span-12">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">النشاط الأخير</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      عرض الكل
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {patientData.dentalHistory.previousTreatments.slice(0, 3).map((treatment, index) => (
                      <div key={index} className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                          <Activity className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">{treatment.treatment}</h4>
                          <p className="text-gray-600">{treatment.provider}</p>
                          <p className="text-sm text-gray-500 mt-1">{treatment.notes}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(treatment.date).toLocaleDateString('ar-IQ')}
                          </p>
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            مكتمل
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "medical":
        return (
          <div className="space-y-8">
            {/* Medical History Overview */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">التاريخ الطبي</h3>
                  <p className="text-gray-600">معلومات طبية شاملة ومحدثة</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
                    <Brain className="w-5 h-5" />
                    <span className="text-sm font-medium">تحليل ذكي</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    إضافة سجل
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Allergies */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="h-full bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">الحساسيات</h4>
                        <p className="text-sm text-red-600">{patientData.medicalHistory.allergies.length} حساسية</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {patientData.medicalHistory.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900">{allergy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">الأدوية الحالية</h4>
                        <p className="text-sm text-blue-600">{patientData.medicalHistory.medications.length} دواء</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {patientData.medicalHistory.medications.map((medication, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Pill className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{medication}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">الحالات المرضية</h4>
                        <p className="text-sm text-purple-600">{patientData.medicalHistory.conditions.length} حالة</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {patientData.medicalHistory.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Health Insights - Enhanced */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">توصيات الذكاء الاصطناعي</h3>
                    <p className="text-white/90">تحليل ذكي للحالة الصحية</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "تقييم المخاطر",
                      description: "خطر منخفض للمضاعفات السنية بناءً على التاريخ الطبي",
                      icon: Shield,
                      color: "green",
                      score: "85%"
                    },
                    {
                      title: "تفاعل الأدوية", 
                      description: "لا توجد تفاعلات معروفة مع الأدوية السنية الشائعة",
                      icon: Pill,
                      color: "blue", 
                      score: "آمن"
                    },
                    {
                      title: "توصيات العلاج",
                      description: "يُنصح بمواعيد أقصر بسبب إدارة مرض السكري",
                      icon: Activity,
                      color: "purple",
                      score: "متوسط"
                    },
                  ].map((insight, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <div className="flex items-center justify-between mb-4">
                        <insight.icon className="w-8 h-8 text-white" />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{insight.score}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                      <p className="text-white/90 text-sm">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Timeline */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">الخط الزمني الصحي</h3>
              
              <div className="space-y-6">
                {[
                  { date: "2024-01-15", event: "تحديث التاريخ الطبي", type: "update", icon: FileText },
                  { date: "2023-12-10", event: "فحص دوري شامل", type: "checkup", icon: Stethoscope },
                  { date: "2023-10-05", event: "حشو السن رقم 14", type: "treatment", icon: Activity },
                  { date: "2023-08-20", event: "علاج جذور السن 18", type: "major", icon: AlertTriangle },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      item.type === "update" && "bg-blue-100",
                      item.type === "checkup" && "bg-green-100",
                      item.type === "treatment" && "bg-purple-100",
                      item.type === "major" && "bg-red-100"
                    )}>
                      <item.icon className={cn(
                        "w-6 h-6",
                        item.type === "update" && "text-blue-600",
                        item.type === "checkup" && "text-green-600",
                        item.type === "treatment" && "text-purple-600",
                        item.type === "major" && "text-red-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.event}</h4>
                      <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString('ar-IQ')}</p>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">عرض التفاصيل</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "dental":
        return (
          <div className="space-y-8">
            {renderToothChart()}

            {/* Dental Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "حالة الفم العامة", value: "ممتاز", change: "+5%", icon: Star, color: "green" },
                { title: "عدد التسوسات", value: "1", change: "-2", icon: AlertTriangle, color: "red" },
                { title: "العلاجات المطلوبة", value: "2", change: "+1", icon: ClipboardList, color: "blue" },
                { title: "آخر تنظيف", value: "شهرين", change: "موعد قريب", icon: Clock, color: "purple" },
              ].map((stat, index) => (
                <div key={index} className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-700`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Treatment History */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">تاريخ العلاجات</h3>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">
                    <Filter className="w-4 h-4" />
                    تصفية
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    إضافة علاج
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {patientData.dentalHistory.previousTreatments.map((treatment, index) => (
                  <div key={index} className="flex items-center gap-6 p-6 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{treatment.treatment}</h4>
                        {treatment.tooth && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                            السن #{treatment.tooth}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">{treatment.provider}</p>
                      <p className="text-sm text-gray-500">{treatment.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {new Date(treatment.date).toLocaleDateString('ar-IQ')}
                      </p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        مكتمل
                      </span>
                      <div className="mt-2">
                        <button className="text-blue-600 text-sm hover:underline">عرض التفاصيل</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "treatments":
        return (
          <div className="space-y-8">
            {/* Treatment Plan Overview */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">خطة العلاج النشطة</h3>
                  <p className="text-gray-600">علاجات مخططة ومجدولة</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg">
                  <Plus className="w-5 h-5" />
                  إضافة علاج
                </button>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "علاج التسوس - السن رقم 21",
                    description: "حشو تجميلي مُوصى به",
                    status: "pending",
                    priority: "متوسط",
                    cost: "$150-200",
                    duration: "45 دقيقة",
                    date: null,
                    urgency: "medium"
                  },
                  {
                    title: "تنظيف دوري شامل",
                    description: "تنظيف كل 6 أشهر وفحص",
                    status: "scheduled",
                    priority: "منخفض",
                    cost: "$120",
                    duration: "60 دقيقة", 
                    date: "2024-02-15",
                    urgency: "low"
                  },
                  {
                    title: "فحص متابعة علاج الجذور",
                    description: "فحص حالة السن 18",
                    status: "scheduled",
                    priority: "عالي",
                    cost: "$80",
                    duration: "30 دقيقة",
                    date: "2024-03-01",
                    urgency: "high"
                  }
                ].map((treatment, index) => (
                  <div key={index} className={cn(
                    "p-6 rounded-2xl border-r-4",
                    treatment.urgency === "high" && "bg-red-50 border-red-400",
                    treatment.urgency === "medium" && "bg-yellow-50 border-yellow-400", 
                    treatment.urgency === "low" && "bg-blue-50 border-blue-400"
                  )}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{treatment.title}</h4>
                          <span className={cn(
                            "px-3 py-1 text-sm rounded-full font-medium",
                            treatment.status === "pending" && "bg-yellow-100 text-yellow-800",
                            treatment.status === "scheduled" && "bg-blue-100 text-blue-800"
                          )}>
                            {treatment.status === "pending" ? "معلق" : "مجدول"}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{treatment.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">التكلفة المقدرة:</span>
                            <p className="font-semibold text-gray-900">{treatment.cost}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">المدة:</span>
                            <p className="font-semibold text-gray-900">{treatment.duration}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">الأولوية:</span>
                            <p className={cn(
                              "font-semibold",
                              treatment.priority === "عالي" && "text-red-600",
                              treatment.priority === "متوسط" && "text-yellow-600",
                              treatment.priority === "منخفض" && "text-blue-600"
                            )}>{treatment.priority}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">التاريخ:</span>
                            <p className="font-semibold text-gray-900">
                              {treatment.date ? new Date(treatment.date).toLocaleDateString('ar-IQ') : "غير محدد"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-xl">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* AI Treatment Recommendations - Enhanced */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">توصيات العلاج الذكية</h3>
                    <p className="text-white/90">تحليل متقدم وتوصيات مخصصة</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "تحسين الرعاية الوقائية",
                      description: "يُنصح بعلاج الفلوريد لمنع التسوسات المستقبلية بناءً على تاريخ المريض",
                      icon: Zap,
                      action: "إضافة لخطة العلاج"
                    },
                    {
                      title: "تحسين الجدولة",
                      description: "يُفضل المواعيد الصباحية بسبب جدول إدارة مرض السكري للمريض",
                      icon: Calendar,
                      action: "تطبيق التوصية"
                    },
                    {
                      title: "خطة طويلة المدى",
                      description: "مراقبة دورية للأسنان المعالجة والتحقق من استقرار الحالة",
                      icon: Target,
                      action: "إنشاء خطة"
                    },
                    {
                      title: "إدارة الألم",
                      description: "استراتيجية مخصصة لإدارة الألم تتناسب مع الأدوية الحالية",
                      icon: Shield,
                      action: "مراجعة الخطة"
                    }
                  ].map((recommendation, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <recommendation.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{recommendation.title}</h4>
                          <p className="text-white/90 text-sm mb-4">{recommendation.description}</p>
                          <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl border border-white/30 transition-all">
                            {recommendation.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">المواعيد القادمة</h3>
                  <p className="text-gray-600">مواعيد مجدولة ومؤكدة</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg">
                  <Plus className="w-5 h-5" />
                  جدولة موعد
                </button>
              </div>

              <div className="space-y-6">
                {patientData.appointments
                  .filter((apt) => apt.status === "scheduled")
                  .map((appointment, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        appointment.priority === "high" && "bg-gradient-to-r from-red-500 to-pink-500",
                        appointment.priority === "medium" && "bg-gradient-to-r from-yellow-500 to-orange-500",
                        appointment.priority === "low" && "bg-gradient-to-r from-blue-500 to-indigo-500"
                      )}>
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{appointment.type}</h4>
                          <span className={cn(
                            "px-3 py-1 text-sm rounded-full font-medium",
                            appointment.priority === "high" && "bg-red-100 text-red-800",
                            appointment.priority === "medium" && "bg-yellow-100 text-yellow-800",
                            appointment.priority === "low" && "bg-blue-100 text-blue-800"
                          )}>
                            {appointment.priority === "high" ? "عاجل" : appointment.priority === "medium" ? "متوسط" : "عادي"}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{appointment.provider}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString('ar-IQ')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Activity className="w-4 h-4" />
                            {appointment.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-green-600 hover:bg-green-100 rounded-xl transition-all">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Appointment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "مواعيد هذا الشهر", value: "3", icon: Calendar, color: "blue" },
                { title: "معدل الحضور", value: "95%", icon: CheckCircle, color: "green" },
                { title: "آخر موعد", value: "15 يناير", icon: Clock, color: "purple" },
                { title: "التقييم", value: "4.9/5", icon: Star, color: "yellow" },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Appointment History */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">تاريخ المواعيد</h3>
              
              <div className="space-y-6">
                {patientData.appointments
                  .filter((apt) => apt.status === "completed")
                  .map((appointment, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{appointment.type}</h4>
                        <p className="text-gray-600 mb-2">{appointment.provider}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString('ar-IQ')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-800 text-sm rounded-xl font-medium">
                          مكتمل
                        </span>
                        <div className="mt-2">
                          <button className="text-green-600 text-sm hover:underline">عرض التقرير</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {patientData.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">تفاصيل المريض</h1>
              <p className="text-gray-600 text-lg">إدارة شاملة للمرضى - {patientData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all">
              <Download className="w-5 h-5" />
              تصدير
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all">
              <Share className="w-5 h-5" />
              مشاركة
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg">
              <Calendar className="w-5 h-5" />
              جدولة موعد
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 py-4 px-6 border-b-3 font-semibold text-sm transition-all rounded-t-2xl",
                activeTab === tab.id
                  ? `border-blue-600 ${tab.color} bg-blue-50`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden lg:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">{renderContent()}</div>
    </div>
  );
};

export default PatientDetail;
