import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  FileText,
  FlaskConical,
  Bell,
  Plus,
  Edit,
  Eye,
  Share2,
  Download,
  Printer,
  Star,
  Clock,
  Activity,
  Building2,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PatientTreatmentPlan from "@/components/PatientTreatmentPlan";
import { NewLabOrderModal, NewReminderModal } from "@/components/LabOrderModals";

interface PatientDetails {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  visitHistory: {
    date: string;
    diagnosis: string;
    treatment: string;
    cost: number;
    notes?: string;
  }[];
  upcomingAppointments: {
    date: string;
    time: string;
    type: string;
    doctor: string;
  }[];
  totalSpent: number;
  outstandingBalance: number;
  lastVisit: string;
  nextVisit: string;
  patientSince: string;
}

// Mock patient data
const mockPatient: PatientDetails = {
  id: "P001",
  name: "أحمد محمد علي",
  age: 35,
  gender: "male",
  phone: "07701234567",
  email: "ahmed.mohammed@email.com",
  address: "بغداد - الكرادة - شارع أبو نواس",
  emergencyContact: {
    name: "محمد علي أحمد",
    phone: "07707654321",
    relation: "الأخ",
  },
  medicalHistory: [
    "ضغط الدم المرتفع",
    "حساسية من البنسلين",
    "عملية استئصال اللوزتين (2010)",
  ],
  allergies: ["البنسلين", "المكسرات"],
  currentMedications: ["أملوديبين 5mg", "أسبرين 75mg"],
  insuranceInfo: {
    provider: "شركة التأمين الوطنية",
    policyNumber: "INS-2024-001234",
    expiryDate: "2024-12-31",
  },
  visitHistory: [
    {
      date: "2024-01-15",
      diagnosis: "تسوس في الضرس العلوي الأيمن",
      treatment: "حشوة مركبة",
      cost: 150,
      notes: "تحسن ملحوظ، موعد المتابعة خلال أسبوعين",
    },
    {
      date: "2024-01-10",
      diagnosis: "تنظيف عام",
      treatment: "تنظيف وتلميع الأسنان",
      cost: 100,
    },
    {
      date: "2024-01-05",
      diagnosis: "فحص دوري",
      treatment: "فحص شامل وأشعة",
      cost: 75,
    },
  ],
  upcomingAppointments: [
    {
      date: "2024-01-25",
      time: "10:00 صباحاً",
      type: "متابعة",
      doctor: "د. أحمد السعدي",
    },
    {
      date: "2024-02-05",
      time: "02:00 مساءً",
      type: "تركيب التاج",
      doctor: "د. أحمد السعدي",
    },
  ],
  totalSpent: 2450,
  outstandingBalance: 350,
  lastVisit: "2024-01-15",
  nextVisit: "2024-01-25",
  patientSince: "2023-06-15",
};

export default function PatientDetailsPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "treatment" | "history" | "financial">("overview");
  const [showNewLabOrder, setShowNewLabOrder] = useState(false);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [selectedTreatmentStep, setSelectedTreatmentStep] = useState<string>("");

  const handleAddLabOrder = (treatmentStepId?: string) => {
    if (treatmentStepId) {
      setSelectedTreatmentStep(treatmentStepId);
    }
    setShowNewLabOrder(true);
  };

  const getGenderLabel = (gender: string) => {
    return gender === "male" ? "ذكر" : "أنثى";
  };

  const calculateAge = () => {
    const today = new Date();
    const since = new Date(mockPatient.patientSince);
    const years = today.getFullYear() - since.getFullYear();
    const months = today.getMonth() - since.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < since.getDate())) {
      return `${years - 1} سنة`;
    }
    return `${years} سنة`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden lg:inline text-sm font-medium">رجوع</span>
              </button>
              
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">{mockPatient.name}</h1>
                <p className="text-sm text-gray-600">
                  {getGenderLabel(mockPatient.gender)} • {mockPatient.age} سنة • مريض منذ {calculateAge()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="hidden lg:flex">
                <Share2 className="w-4 h-4 ml-1" />
                مشاركة
              </Button>
              <Button size="sm" variant="outline" className="hidden lg:flex">
                <Download className="w-4 h-4 ml-1" />
                تصدير
              </Button>
              <Button size="sm" onClick={() => handleAddLabOrder()}>
                <FlaskConical className="w-4 h-4 ml-1" />
                <span className="hidden lg:inline">طلب مختبر</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-xs lg:text-sm text-blue-600">إجمالي الإنفاق</div>
              <div className="text-lg lg:text-xl font-bold text-blue-800">
                {mockPatient.totalSpent.toLocaleString()} د.ع
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="text-xs lg:text-sm text-yellow-600">الرصيد المستحق</div>
              <div className="text-lg lg:text-xl font-bold text-yellow-800">
                {mockPatient.outstandingBalance.toLocaleString()} د.ع
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-xs lg:text-sm text-green-600">عدد الزيارات</div>
              <div className="text-lg lg:text-xl font-bold text-green-800">
                {mockPatient.visitHistory.length}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-xs lg:text-sm text-purple-600">طلبات المختبر</div>
              <div className="text-lg lg:text-xl font-bold text-purple-800">3</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-1 shadow-sm border border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "نظرة عامة", icon: Eye },
              { id: "treatment", label: "الخطة العلاجية", icon: FileText },
              { id: "history", label: "التاريخ الطبي", icon: Clock },
              { id: "financial", label: "المالية", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">معلومات الاتصال</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">رقم الهاتف</div>
                    <div className="font-medium text-gray-900">{mockPatient.phone}</div>
                  </div>
                </div>
                
                {mockPatient.email && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">البريد الإلكتروني</div>
                      <div className="font-medium text-gray-900">{mockPatient.email}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">العنوان</div>
                    <div className="font-medium text-gray-900">{mockPatient.address}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-2">جهة الاتصال في حالات الطوارئ</div>
                  <div className="text-sm text-gray-600">
                    <div>{mockPatient.emergencyContact.name} ({mockPatient.emergencyContact.relation})</div>
                    <div>{mockPatient.emergencyContact.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">المعلومات الطبية</h3>
              <div className="space-y-4">
                
                {mockPatient.allergies.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      الحساسيات
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockPatient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">التاريخ المرضي</div>
                  <div className="space-y-1">
                    {mockPatient.medicalHistory.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">الأدوية الحالية</div>
                  <div className="space-y-1">
                    {mockPatient.currentMedications.map((medication, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {medication}
                      </div>
                    ))}
                  </div>
                </div>

                {mockPatient.insuranceInfo && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-2">معلومات التأمين</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>الشركة: {mockPatient.insuranceInfo.provider}</div>
                      <div>رقم البوليصة: {mockPatient.insuranceInfo.policyNumber}</div>
                      <div>تاريخ الانتهاء: {mockPatient.insuranceInfo.expiryDate}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">المواعيد القادمة</h3>
              <div className="space-y-3">
                {mockPatient.upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{appointment.type}</div>
                      <div className="text-sm text-gray-600">
                        {appointment.date} - {appointment.time}
                      </div>
                      <div className="text-xs text-gray-500">{appointment.doctor}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
              <div className="space-y-3">
                {mockPatient.visitHistory.slice(0, 3).map((visit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{visit.treatment}</div>
                      <div className="text-sm text-gray-600">{visit.diagnosis}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {visit.date} • {visit.cost.toLocaleString()} د.ع
                      </div>
                      {visit.notes && (
                        <div className="text-xs text-gray-500 mt-1 italic">
                          {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "treatment" && (
          <PatientTreatmentPlan 
            patientId={patientId || ""} 
            onAddLabOrder={handleAddLabOrder}
          />
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">تاريخ الزيارات</h3>
            <div className="space-y-4">
              {mockPatient.visitHistory.map((visit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{visit.treatment}</div>
                      <div className="text-sm text-gray-600">{visit.diagnosis}</div>
                      <div className="text-xs text-gray-500 mt-1">{visit.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{visit.cost.toLocaleString()} د.ع</div>
                    </div>
                  </div>
                  {visit.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <strong>ملاحظات:</strong> {visit.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "financial" && (
          <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              
              {/* Financial Summary */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">الملخص المالي</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">إجمالي الإنفاق</span>
                    <span className="font-bold text-green-800">{mockPatient.totalSpent.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-600">الرصيد المستحق</span>
                    <span className="font-bold text-yellow-800">{mockPatient.outstandingBalance.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">المدفوع</span>
                    <span className="font-bold text-blue-800">
                      {(mockPatient.totalSpent - mockPatient.outstandingBalance).toLocaleString()} د.ع
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">سجل المدفوعات</h3>
                <div className="space-y-3">
                  {mockPatient.visitHistory.map((visit, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{visit.treatment}</div>
                        <div className="text-xs text-gray-500">{visit.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{visit.cost.toLocaleString()} د.ع</div>
                        <Badge className="bg-green-100 text-green-800 text-xs">مدفوع</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <NewLabOrderModal 
        isOpen={showNewLabOrder} 
        onClose={() => {
          setShowNewLabOrder(false);
          setSelectedTreatmentStep("");
        }}
        patientId={patientId}
      />
      
      <NewReminderModal 
        isOpen={showNewReminder} 
        onClose={() => setShowNewReminder(false)} 
      />
    </div>
  );
}
