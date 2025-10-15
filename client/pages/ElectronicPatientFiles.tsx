import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  FileText,
  Camera,
  Upload,
  Download,
  Edit,
  Save,
  X,
  Plus,
  Search,
  Filter,
  Eye,
  History,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Users,
  TrendingUp,
  FileImage,
  Paperclip,
  Stethoscope,
  Thermometer,
  Zap,
  Shield,
  Award,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/Breadcrumbs";
import { LoadingSpinner, ButtonLoading } from "@/components/LoadingIndicators";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female";
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType?: string;
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  avatar?: string;
  registrationDate: string;
  lastVisit?: string;
  totalVisits: number;
  status: "active" | "inactive" | "archived";
  priority: "normal" | "high" | "vip";
  notes?: string;
}

interface TreatmentRecord {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  doctorName: string;
  treatment: string;
  diagnosis: string;
  procedure: string;
  duration: number;
  cost: number;
  status: "completed" | "in-progress" | "planned";
  notes?: string;
  followUpDate?: string;
  medications?: Medication[];
  images?: string[];
  xrays?: string[];
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface VitalSigns {
  date: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

interface Document {
  id: string;
  name: string;
  type: "xray" | "report" | "prescription" | "insurance" | "other";
  url: string;
  uploadDate: string;
  size: string;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "محمد علي",
    fullName: "أحمد محمد علي",
    phone: "+964 770 123 4567",
    email: "ahmed.mohammed@email.com",
    dateOfBirth: "1988-05-15",
    age: 35,
    gender: "male",
    address: "بغداد، الكرخ، حي الجامعة",
    emergencyContact: {
      name: "فاطمة محمد",
      phone: "+964 771 987 6543",
      relationship: "زوجة",
    },
    bloodType: "O+",
    allergies: ["البنسلين", "المكسرات"],
    medicalHistory: ["ضغط الدم المرتفع", "السكري النوع الثاني"],
    currentMedications: ["أملوديبين 5 ملغ", "ميتفورمين 500 ملغ"],
    insurance: {
      provider: "شركة التأمين الوطنية",
      policyNumber: "INS-2024-001234",
      expiryDate: "2024-12-31",
    },
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    registrationDate: "2023-01-15",
    lastVisit: "2024-01-10",
    totalVisits: 12,
    status: "active",
    priority: "normal",
    notes: "مريض منتظم، يحتاج متابعة دورية لحالة السكري",
  },
  {
    id: "2",
    firstName: "فاطمة",
    lastName: "أحمد",
    fullName: "فاطمة أحمد",
    phone: "+964 771 987 6543",
    email: "fatima.ahmed@email.com",
    dateOfBirth: "1995-08-22",
    age: 28,
    gender: "female",
    address: "بغداد، الرصافة، البتاوين",
    emergencyContact: {
      name: "أحمد علي",
      phone: "+964 772 456 7890",
      relationship: "زوج",
    },
    bloodType: "A+",
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    registrationDate: "2024-01-14",
    totalVisits: 1,
    status: "active",
    priority: "normal",
  },
];

const mockTreatmentHistory: TreatmentRecord[] = [
  {
    id: "1",
    patientId: "1",
    date: "2024-01-10",
    doctorId: "dr1",
    doctorName: "د. أحمد محمد",
    treatment: "حشو الأسنان",
    diagnosis: "تسوس الأسنان",
    procedure: "حشو كومبوزيت للضرس الأول العلوي الأيمن",
    duration: 60,
    cost: 50000,
    status: "completed",
    notes: "تم العلاج بنجاح، لا توجد مضاعفات",
    followUpDate: "2024-02-10",
    medications: [
      {
        name: "إيبوبروفين",
        dosage: "400 ملغ",
        frequency: "كل 8 ساعات",
        duration: "3 أيام",
        instructions: "يؤخذ بعد الطعام",
      },
    ],
  },
];

const mockVitalSigns: VitalSigns[] = [
  {
    date: "2024-01-10",
    bloodPressure: "120/80",
    heartRate: 75,
    temperature: 36.8,
    weight: 75,
    height: 175,
    notes: "جميع القراءات طبيعية",
  },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "أشعة الأسنان - يناير 2024",
    type: "xray",
    url: "/documents/xray-001.jpg",
    uploadDate: "2024-01-10",
    size: "2.3 MB",
  },
  {
    id: "2",
    name: "تقرير طبي",
    type: "report",
    url: "/documents/report-001.pdf",
    uploadDate: "2024-01-10",
    size: "456 KB",
  },
];

export default function ElectronicPatientFiles() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "vip":
        return "bg-purple-500";
      case "high":
        return "bg-red-500";
      case "normal":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: User },
    { id: "history", label: "التاريخ الطبي", icon: History },
    { id: "treatments", label: "العلاجات", icon: Stethoscope },
    { id: "medications", label: "الأدوية", icon: Pill },
    { id: "vitals", label: "العلامات الحيوية", icon: Activity },
    { id: "documents", label: "المستندات", icon: FileText },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="ملفات المرضى الإلكترونية"
        description="إدارة شاملة لملفات المرضى مع التاريخ الطبي والعلاجات"
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              تصدير
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              مريض جديد
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المرضى</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">نشطين</p>
              <p className="text-2xl font-bold text-green-600">
                {patients.filter((p) => p.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">زيارات هذا الشهر</p>
              <p className="text-2xl font-bold text-purple-600">
                {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مرضى VIP</p>
              <p className="text-2xl font-bold text-yellow-600">
                {patients.filter((p) => p.priority === "vip").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">قائمة المرضى</h3>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث عن مريض..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المرضى</option>
                  <option value="active">نشطين</option>
                  <option value="inactive">غير نشطين</option>
                  <option value="archived">أرشيف</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-gray-50",
                    selectedPatient?.id === patient.id && "bg-blue-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {patient.avatar ? (
                        <img
                          src={patient.avatar}
                          alt={patient.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                          getPriorityColor(patient.priority),
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {patient.fullName}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{patient.age} سنة</span>
                        <span>•</span>
                        <span>{patient.totalVisits} زيارة</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs border",
                          getStatusColor(patient.status),
                        )}
                      >
                        {patient.status === "active" && "نشط"}
                        {patient.status === "inactive" && "غير نشط"}
                        {patient.status === "archived" && "أرشيف"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl border border-gray-100">
              {/* Patient Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {selectedPatient.avatar ? (
                      <img
                        src={selectedPatient.avatar}
                        alt={selectedPatient.fullName}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedPatient.fullName}
                        </h2>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm border",
                            getStatusColor(selectedPatient.status),
                          )}
                        >
                          {selectedPatient.status === "active" && "نشط"}
                          {selectedPatient.status === "inactive" && "غير نشط"}
                          {selectedPatient.status === "archived" && "أرشيف"}
                        </span>
                        {selectedPatient.priority === "vip" && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{selectedPatient.age} سنة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{selectedPatient.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      {editMode ? "إلغاء" : "تعديل"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 py-4 border-b-2 font-medium transition-colors",
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700",
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          المعلومات الأساسية
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              الاسم الكامل:
                            </span>
                            <span className="font-medium">
                              {selectedPatient.fullName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              تاريخ الميلاد:
                            </span>
                            <span className="font-medium">
                              {formatDate(selectedPatient.dateOfBirth)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              الهاتف:
                            </span>
                            <span className="font-medium">
                              {selectedPatient.phone}
                            </span>
                          </div>
                          {selectedPatient.email && (
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600">
                                البريد الإلكتروني:
                              </span>
                              <span className="font-medium">
                                {selectedPatient.email}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              العنوان:
                            </span>
                            <span className="font-medium">
                              {selectedPatient.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          المعلومات الطبية
                        </h4>
                        <div className="space-y-3">
                          {selectedPatient.bloodType && (
                            <div className="flex items-center gap-3">
                              <Heart className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-gray-600">
                                فصيلة الدم:
                              </span>
                              <span className="font-medium">
                                {selectedPatient.bloodType}
                              </span>
                            </div>
                          )}

                          {selectedPatient.allergies.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-600">
                                  الحساسية:
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mr-7">
                                {selectedPatient.allergies.map(
                                  (allergy, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                                    >
                                      {allergy}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {selectedPatient.medicalHistory.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <History className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  التاريخ المرضي:
                                </span>
                              </div>
                              <div className="space-y-1 mr-7">
                                {selectedPatient.medicalHistory.map(
                                  (condition, index) => (
                                    <div
                                      key={index}
                                      className="text-sm text-gray-700"
                                    >
                                      • {condition}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        جهة الاتصال في الطوارئ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">الاسم:</span>
                          <span className="font-medium">
                            {selectedPatient.emergencyContact.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">الهاتف:</span>
                          <span className="font-medium">
                            {selectedPatient.emergencyContact.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            القرابة:
                          </span>
                          <span className="font-medium">
                            {selectedPatient.emergencyContact.relationship}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Info */}
                    {selectedPatient.insurance && (
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          معلومات التأمين
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              الشركة:
                            </span>
                            <span className="font-medium">
                              {selectedPatient.insurance.provider}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              رقم البوليصة:
                            </span>
                            <span className="font-medium">
                              {selectedPatient.insurance.policyNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              تاريخ الانتهاء:
                            </span>
                            <span className="font-medium">
                              {formatDate(selectedPatient.insurance.expiryDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "treatments" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        سجل العلاجات
                      </h4>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        إضافة علاج
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockTreatmentHistory.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {treatment.treatment}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {treatment.diagnosis}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs border",
                                treatment.status === "completed"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-200",
                              )}
                            >
                              {treatment.status === "completed"
                                ? "مكتمل"
                                : "قيد المتابعة"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(treatment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{treatment.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{treatment.duration} دقيقة</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span>{formatCurrency(treatment.cost)}</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {treatment.procedure}
                          </p>

                          {treatment.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>ملاحظات:</strong> {treatment.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        المستندات والملفات
                      </h4>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        رفع ملف
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                doc.type === "xray" && "bg-blue-100",
                                doc.type === "report" && "bg-green-100",
                                doc.type === "prescription" && "bg-purple-100",
                              )}
                            >
                              {doc.type === "xray" && (
                                <FileImage className="w-5 h-5 text-blue-600" />
                              )}
                              {doc.type === "report" && (
                                <FileText className="w-5 h-5 text-green-600" />
                              )}
                              {doc.type === "prescription" && (
                                <Pill className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {doc.name}
                              </h5>
                              <p className="text-xs text-gray-600">
                                {doc.size}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{formatDate(doc.uploadDate)}</span>
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="w-3 h-3" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                اختر مريضاً
              </h3>
              <p className="text-gray-600">
                اختر مريضاً من القائمة لعرض ملفه الطبي
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
