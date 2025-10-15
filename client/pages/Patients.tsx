import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Users,
  TrendingUp,
  Activity,
  Star,
  Badge,
  Clock,
  Heart,
  FileText,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Timer,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Patient } from "@/services/sharedClinicData";
import { adaptPatientsToLegacy, LegacyPatient } from "@/services/clinicDataAdapter";
import TreatmentPlanManager from "@/components/TreatmentPlanManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const patients = [
  {
    id: 1,
    name: "وليد جني",
    phone: "07801234567",
    email: "willie.jennie@gmail.com",
    address: "بغداد - الكرادة",
    registered: "12 آذار 2021",
    lastVisit: "05 حزيران 2021",
    treatment: "تنظيف وتبييض الأسنان",
    avatar: "و.ج",
    color: "bg-purple-100 text-purple-700",
    age: 28,
    gender: "ذكر",
    status: "نشط",
    visits: 12,
    nextAppointment: "غدا 10:00 ص",
    medicalHistory: ["حساسية البنسلين", "ضغط الدم"],
    priority: "عادي",
  },
  {
    id: 2,
    name: "ميشيل ريفرز",
    phone: "07807654321",
    email: "michelle.rivers@gmail.com",
    address: "البصرة - العشار",
    registered: "12 آذار 2021",
    lastVisit: "03 أيار 2021",
    treatment: "تنظيف وقشرة الأسنان",
    avatar: "م.ر",
    color: "bg-blue-100 text-blue-700",
    age: 35,
    gender: "أنثى",
    status: "نشط",
    visits: 8,
    nextAppointment: "الأسبوع القادم",
    medicalHistory: ["داء السكري"],
    priority: "عاجل",
  },
  {
    id: 3,
    name: "تيم جينينغز",
    phone: "07809876543",
    email: "tim.jennings@gmail.com",
    address: "أربيل - عنكاوة",
    registered: "10 آذار 2021",
    lastVisit: "17 تشرين الأول 2021",
    treatment: "تنظيف الأسنان",
    avatar: "ت.ج",
    color: "bg-green-100 text-green-700",
    age: 42,
    gender: "ذكر",
    status: "غير نشط",
    visits: 5,
    nextAppointment: "غير محدد",
    medicalHistory: [],
    priority: "عادي",
  },
  {
    id: 4,
    name: "سارة أحمد",
    phone: "07801112223",
    email: "sara.ahmed@gmail.com",
    address: "النجف - المركز",
    registered: "20 نيسان 2021",
    lastVisit: "15 كانون الأول 2021",
    treatment: "زراعة الأسنان",
    avatar: "س.أ",
    color: "bg-pink-100 text-pink-700",
    age: 29,
    gender: "أنثى",
    status: "نشط",
    visits: 15,
    nextAppointment: "بعد أسبوعين",
    medicalHistory: ["حساسية اللاتكس"],
    priority: "عاجل",
  },
  {
    id: 5,
    name: "أحمد علي",
    phone: "07805556667",
    email: "ahmed.ali@gmail.com",
    address: "كربلاء - الحر",
    registered: "05 أيار 2021",
    lastVisit: "22 تشرين الثاني 2021",
    treatment: "تقويم الأسنان",
    avatar: "أ.ع",
    color: "bg-indigo-100 text-indigo-700",
    age: 22,
    gender: "ذكر",
    status: "نشط",
    visits: 20,
    nextAppointment: "الأسبوع القادم",
    medicalHistory: [],
    priority: "عادي",
  },
  {
    id: 6,
    name: "فاطمة حسن",
    phone: "07803334445",
    email: "fatima.hassan@gmail.com",
    address: "الموصل - الحدباء",
    registered: "18 حزيران 2021",
    lastVisit: "30 كانون الأول 2021",
    treatment: "حشو تجميلي",
    avatar: "ف.ح",
    color: "bg-yellow-100 text-yellow-700",
    age: 31,
    gender: "أنثى",
    status: "نشط",
    visits: 7,
    nextAppointment: "غدا 2:00 م",
    medicalHistory: ["ارتفاع ضغط الدم"],
    priority: "عادي",
  },
];

const Patients = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [treatmentPlanOpen, setTreatmentPlanOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientsData, setPatientsData] = useState<LegacyPatient[]>(patients);
  const [existingTreatmentPlan, setExistingTreatmentPlan] = useState<any>(null);
  const [treatmentPlansMap, setTreatmentPlansMap] = useState<Record<string, any>>({});
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "ذكر",
    phone: "",
    email: "",
    address: "",
    medicalHistory: "",
  });

  useEffect(() => {
    loadPatientsAndPlans();
  }, []);

  const loadPatientsAndPlans = async () => {
    try {
      // Load patients
      const sharedPatients = await sharedClinicData.getPatients();
      if (sharedPatients && sharedPatients.length > 0) {
        const legacyFormat = adaptPatientsToLegacy(sharedPatients);
        setPatientsData(legacyFormat);
      }

      // Load all treatment plans
      const allPlans = await sharedClinicData.getTreatmentPlans();
      const plansMap: Record<string, any> = {};
      allPlans.forEach(plan => {
        plansMap[plan.patientId] = plan;
      });
      setTreatmentPlansMap(plansMap);
    } catch (error) {
      console.error("Error loading patients and plans:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            نشط
          </span>
        );
      case "غير نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <Timer className="w-3 h-3" />
            غير نشط
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenTreatmentPlan = async (patient: any) => {
    setSelectedPatient(patient);
    
    // Load existing treatment plan for this patient
    const existingPlan = treatmentPlansMap[patient.id.toString()];
    if (existingPlan) {
      // Convert treatment plan to the format expected by TreatmentPlanManager
      const formattedPlan = {
        id: existingPlan.id,
        patientId: existingPlan.patientId,
        patientName: existingPlan.patientName,
        diagnosis: existingPlan.diagnosis || "",
        totalCost: existingPlan.steps?.reduce((sum: number, step: any) => sum + (step.cost || 0), 0) || 0,
        estimatedDuration: `${existingPlan.steps?.length || 0} جلسات`,
        steps: existingPlan.steps?.map((step: any) => ({
          id: step.id || `step-${Date.now()}-${Math.random()}`,
          title: step.treatmentType || step.title || "",
          description: step.description || "",
          status: step.status || "pending",
          cost: step.cost || 0,
          duration: step.duration || "30",
          tooth: step.tooth || "",
          notes: step.notes || "",
          requiresLab: step.requiresLab || false,
          date: step.scheduledDate || step.date,
        })) || [],
        priority: existingPlan.priority || "medium",
        createdDate: existingPlan.startDate || new Date().toISOString(),
        notes: existingPlan.notes || "",
      };
      setExistingTreatmentPlan(formattedPlan);
    } else {
      setExistingTreatmentPlan(null);
    }
    
    setTreatmentPlanOpen(true);
  };

  const handleAddPatient = async () => {
    try {
      // Create patient with new Patient interface
      const patientData: Omit<Patient, "id"> = {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender === "ذكر" ? "male" : "female",
        phone: newPatient.phone,
        email: newPatient.email || "",
        address: newPatient.address || "",
        status: "active",
        priority: "normal",
        medicalHistory: newPatient.medicalHistory ? [newPatient.medicalHistory] : [],
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString(),
        nextAppointment: null,
        treatment: "",
        notes: "",
      };

      const addedPatient = await sharedClinicData.addPatient(patientData);
      
      // Reload patients
      await loadPatientsAndPlans();
      
      // Reset form and close dialog
      setNewPatient({
        name: "",
        age: "",
        gender: "ذكر",
        phone: "",
        email: "",
        address: "",
        medicalHistory: "",
      });
      setAddPatientOpen(false);
      
      alert("تم إضافة المريض بنجاح");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("حدث خطأ أثناء إضافة المريض");
    }
  };

  const handleSaveTreatmentPlan = async (plan: any) => {
    try {
      // Prepare treatment plan data with ALL fields
      const planData = {
        patientId: plan.patientId,
        patientName: plan.patientName,
        doctorId: "doctor-1",
        doctorName: "د. أحمد محمد",
        title: plan.diagnosis || "خطة علاج",
        description: plan.notes || "",
        diagnosis: plan.diagnosis,
        status: "in_progress" as "draft" | "approved" | "in_progress" | "completed" | "cancelled",
        startDate: plan.createdDate || new Date().toISOString(),
        priority: plan.priority,
        notes: plan.notes,
        phases: [],
        totalCost: plan.steps.reduce((sum: number, s: any) => sum + (s.cost || 0), 0),
        estimatedCost: plan.steps.reduce((sum: number, s: any) => sum + (s.cost || 0), 0),
        estimatedDuration: plan.steps.length * 30,
        createdDate: plan.createdDate || new Date().toISOString(),
        steps: plan.steps.map((step: any) => ({
          id: step.id,
          treatmentType: step.title,
          description: step.description,
          status: step.status,
          scheduledDate: step.date || step.scheduledDate || new Date().toISOString(),
          cost: step.cost,
          tooth: step.tooth || "",
          notes: step.notes || "",
          requiresLab: step.requiresLab || false,
          duration: step.duration || "30",
        })),
      };

      let treatmentPlan;
      if (plan.id) {
        // Update existing plan
        treatmentPlan = await sharedClinicData.updateTreatmentPlan(plan.id, planData);
      } else {
        // Create new plan
        treatmentPlan = await sharedClinicData.addTreatmentPlan(planData);
      }

      // Create lab orders for steps that require lab work
      const labSteps = plan.steps.filter((step: any) => step.requiresLab);
      for (const step of labSteps) {
        await sharedClinicData.addLabOrder({
          patientId: plan.patientId,
          patientName: plan.patientName,
          treatmentPlanId: treatmentPlan.id,
          laboratoryId: "default-lab",
          laboratoryName: "المختبر الرئيسي",
          orderType: "prosthetics" as "crown" | "bridge" | "implant" | "other" | "prosthetics" | "orthodontics",
          description: step.description,
          specifications: step.notes || step.description,
          status: "ordered",
          orderDate: new Date().toISOString(),
          expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          cost: step.cost * 0.3,
          isPaid: false,
          paymentStatus: "pending" as "pending" | "paid" | "partial",
          priority: plan.priority === "urgent" ? "urgent" : "normal" as "urgent" | "normal",
          followUpRequired: true,
        });
      }

      console.log("Treatment plan and lab orders saved successfully");
      
      // Reload plans to show updated data
      await loadPatientsAndPlans();
      
      // Show success message to user
      alert("تم حفظ الخطة العلاجية بنجاح" + (labSteps.length > 0 ? ` وتم إنشاء ${labSteps.length} طلب مختبري` : ""));
    } catch (error) {
      console.error("Error saving treatment plan:", error);
      alert("حدث خطأ أثناء حفظ الخطة العلاجية");
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عاجل":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            عاجل
          </span>
        );
      case "عادي":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
            <Badge className="w-3 h-3" />
            عادي
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && patient.status === "نشط") ||
      (selectedFilter === "inactive" && patient.status === "غير نشط") ||
      (selectedFilter === "urgent" && patient.priority === "عاجل");
    return matchesSearch && matchesFilter;
  });

  const patientsStats = {
    total: patientsData.length,
    active: patientsData.filter((p) => p.status === "نشط").length,
    inactive: patientsData.filter((p) => p.status === "غير نشط").length,
    urgent: patientsData.filter((p) => p.priority === "عاجل").length,
    newThisMonth: 3,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المرضى</h1>
              <p className="text-emerald-100 text-lg mb-4">
                مجموعة شاملة لإدارة معلومات المرضى والملفات الطبية
              </p>
              <p className="text-emerald-100">
                لديك {patientsStats.total} مريض، {patientsStats.active} نشط و{" "}
                {patientsStats.urgent} عاجل
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير البيانات
              </button>
              <button 
                onClick={() => setAddPatientOpen(true)}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                مريض جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">إحصائيات المرضى</h3>
            <Users className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {patientsStats.total}
              </p>
              <p className="text-sm font-medium text-blue-700">إجمالي المرضى</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {patientsStats.active}
              </p>
              <p className="text-sm font-medium text-green-700">مرضى نشطين</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {patientsStats.urgent}
              </p>
              <p className="text-sm font-medium text-red-700">حالات عاجلة</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {patientsStats.newThisMonth}
              </p>
              <p className="text-sm font-medium text-purple-700">
                جدد هذا الشهر
              </p>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              نمو المرضى الشهري
            </h4>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl flex items-end justify-center p-4">
              <div className="flex items-end gap-2 h-full w-full">
                {[60, 75, 45, 90, 70, 85, 95, 100, 80, 90, 75, 85].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg flex-1 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                      style={{ height: `${height}%` }}
                    ></div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            إجراءات سريعة
          </h3>
          <div className="space-y-4">
            <button 
              onClick={() => setAddPatientOpen(true)}
              className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-800">مريض جديد</p>
                <p className="text-sm text-emerald-600">تسجيل مريض جديد</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-800">استيراد بيانات</p>
                <p className="text-sm text-blue-600">استيراد قائمة المرضى</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all group">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-purple-800">التقارير الطبية</p>
                <p className="text-sm text-purple-600">إنشاء تقارير شاملة</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all group">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-orange-800">إعدادات المرضى</p>
                <p className="text-sm text-orange-600">تخصيص الإعدادات</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن مريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">جميع المرضى</option>
              <option value="active">مرضى نشطين</option>
              <option value="inactive">مرضى غير نشطين</option>
              <option value="urgent">حالات عاجلة</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "grid"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "list"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            {/* Patient Name */}
            <Link 
              to={`/clinic_old/patients/${patient.id}`}
              className="block mb-3"
            >
              <h3 className="font-bold text-gray-900 hover:text-emerald-600 transition-colors text-base mb-1">
                {patient.name}
              </h3>
              <p className="text-sm text-gray-600">
                {patient.age} سنة - {patient.gender}
              </p>
            </Link>

            {/* Status and Priority */}
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(patient.status)}
              {getPriorityBadge(patient.priority)}
            </div>

            {/* Last Visit */}
            <div className="text-sm text-gray-600 mb-3">
              آخر زيارة: {patient.lastVisit}
            </div>

            {/* Last Treatment */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">آخر علاج</p>
              <p className="text-sm text-gray-800 font-medium">{patient.treatment}</p>
            </div>

            {/* Visit Count with Call Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">عدد الزيارات</span>
                <span className="text-sm font-semibold text-emerald-600">{patient.visits}</span>
              </div>
              <button className="p-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all">
                <Phone className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* Next Appointment */}
            {patient.nextAppointment !== "غير محدد" && (
              <div className="bg-blue-50 rounded-xl p-2 mb-3">
                <p className="text-xs text-blue-600">
                  الموعد القادم: {patient.nextAppointment}
                </p>
              </div>
            )}

            {/* Medical History */}
            {patient.medicalHistory.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-2 mb-3">
                <p className="text-xs text-yellow-700 mb-1">التاريخ الطبي</p>
                <div className="flex flex-wrap gap-1">
                  {patient.medicalHistory.map((condition, index) => (
                    <span
                      key={index}
                      className="text-xs text-yellow-800"
                    >
                      {condition}{index < patient.medicalHistory.length - 1 ? "،" : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Link
                to={`/clinic_old/patients/${patient.id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="عرض التفاصيل"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                title="تعديل"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Treatment Plan Manager Modal */}
      <TreatmentPlanManager
        isOpen={treatmentPlanOpen}
        onClose={() => {
          setTreatmentPlanOpen(false);
          setExistingTreatmentPlan(null);
        }}
        patient={selectedPatient ? {
          id: selectedPatient.id.toString(),
          name: selectedPatient.name,
          age: selectedPatient.age,
          phone: selectedPatient.phone,
        } : undefined}
        existingPlan={existingTreatmentPlan}
        onSave={handleSaveTreatmentPlan}
      />

      {/* Add Patient Dialog */}
      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-600">
              إضافة مريض جديد
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العمر <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="العمر"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجنس <span className="text-red-500">*</span>
                </label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="07XXXXXXXXX"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="example@email.com"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                type="text"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="المدينة - المنطقة"
              />
            </div>

            {/* Medical History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التاريخ الطبي
              </label>
              <textarea
                value={newPatient.medicalHistory}
                onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={3}
                placeholder="مثال: حساسية البنسلين، ضغط الدم..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={() => setAddPatientOpen(false)}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleAddPatient}
              disabled={!newPatient.name || !newPatient.age || !newPatient.phone}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              إضافة المريض
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
