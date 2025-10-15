import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus, Search, Filter, MoreHorizontal, Phone, Calendar, Eye, Edit, User, ArrowLeft, MapPin, Heart, Clock, AlertTriangle, CheckCircle, Star, Badge as BadgeIcon, FileText, Camera, Download, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClinicSubNav from "@/components/ClinicSubNav";
import { sharedClinicData, Patient } from "@/services/sharedClinicData";

// Mock patients data - shared with clinic_old system
const mockPatients = [{
  id: "1",
  name: "أحمد محمد الطائي",
  age: 28,
  phone: "+964 770 123 4567",
  email: "ahmed.taie@email.com",
  address: "ا��كرادة، بغداد",
  lastVisit: "2024-01-15",
  nextAppointment: "2024-01-22",
  treatment: "تنظيف الأسنان",
  status: "active",
  priority: "normal",
  totalVisits: 8,
  totalSpent: 750000,
  // IQD
  notes: "مريض منتظم، لا يوجد حساسية معروفة",
  medicalHistory: ["تسوس أسنان", "التهاب لثة خفيف"],
  avatar: null
}, {
  id: "2",
  name: "فاطمة علي السعد",
  age: 35,
  phone: "+964 750 987 6543",
  email: "fatima.saad@email.com",
  address: "المنصور، بغداد",
  lastVisit: "2024-01-14",
  nextAppointment: "2024-01-20",
  treatment: "حشوة ضرس",
  status: "in_treatment",
  priority: "high",
  totalVisits: 12,
  totalSpent: 1250000,
  notes: "تحتاج متابعة دورية، حساسية من البنسلين",
  medicalHistory: ["تسوس متقدم", "حشوات سابقة", "تقويم أسنان"],
  avatar: null
}, {
  id: "3",
  name: "محمد حسن الكريم",
  age: 42,
  phone: "+964 771 456 7890",
  email: "mohammed.kareem@email.com",
  address: "الجادرية، بغداد",
  lastVisit: "2024-01-10",
  nextAppointment: null,
  treatment: "زراعة أسنان",
  status: "completed",
  priority: "normal",
  totalVisits: 15,
  totalSpent: 2100000,
  notes: "تم إكمال زراعة الأسنان بنجاح",
  medicalHistory: ["فقدان أسنان", "زراعة أسنان"],
  avatar: null
}, {
  id: "4",
  name: "سارة أحمد النور",
  age: 24,
  phone: "+964 782 321 6547",
  email: "sara.noor@email.com",
  address: "الحرية، بغداد",
  lastVisit: "2024-01-12",
  nextAppointment: "2024-01-25",
  treatment: "تقويم أسنان",
  status: "active",
  priority: "normal",
  totalVisits: 6,
  totalSpent: 950000,
  notes: "تقويم أسنان، ا��مرح��ة الثانية",
  medicalHistory: ["تقويم أسنان"],
  avatar: null
}, {
  id: "5",
  name: "عبد الله يوسف الشمري",
  age: 50,
  phone: "+964 790 654 3210",
  email: "abdullah.shamri@email.com",
  address: "الكاظمية، بغداد",
  lastVisit: "2024-01-08",
  nextAppointment: "2024-01-18",
  treatment: "علاج عصب",
  status: "urgent",
  priority: "high",
  totalVisits: 4,
  totalSpent: 580000,
  notes: "ألم شديد، يحتاج علاج عاجل",
  medicalHistory: ["ألم أسنان حاد", "التهاب عصب"],
  avatar: null
}];
const ClinicNewPatients: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await sharedClinicData.getPatients();
        setPatients(data);
      } catch (e) {
        console.error("Failed to load patients", e);
      }
    })();
  }, []);

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.phone.includes(searchQuery) || patient.treatment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in_treatment":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "in_treatment":
        return "قيد العلاج";
      case "completed":
        return "مكتمل";
      case "urgent":
        return "عاجل";
      default:
        return "غير محدد";
    }
  };
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/clinic" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  إدارة المرضى
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredPatients.length.toLocaleString()} مريض
                </p>
              </div>
            </div>

            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              مريض جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ClinicSubNav />
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ابحث عن مريض..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">جميع ا��حالات</option>
              <option value="active">نشط</option>
              <option value="in_treatment">قيد العلاج</option>
              <option value="completed">مكتمل</option>
              <option value="urgent">عاجل</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.length}
                </p>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">مرضى نشطون</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === "urgent").length}
                </p>
                <p className="text-sm text-gray-600">حالات عاجلة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.nextAppointment).length}
                </p>
                <p className="text-sm text-gray-600">مواعيد قادمة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Grid - compact mobile cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredPatients.map(patient => <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
              {/* Patient Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-gray-600">{patient.age} سنة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPriorityIcon(patient.priority)}
                    <Badge className={getStatusColor(patient.status)}>
                      {getStatusText(patient.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-3 space-y-2">
                

                

                

                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-4 h-4" />
                  آخر زيارة: {patient.lastVisit}
                </div>

                {patient.nextAppointment}
              </div>

              {/* Stats */}
              

              {/* Actions */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 py-2" onClick={() => navigate(`/clinic_old/patients/${patient.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    عرض
                  </Button>

                  <Button size="sm" variant="outline" className="flex-1 py-2" onClick={() => navigate(`/clinic/reservations?patient=${patient.id}`)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    موعد
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => window.open(`tel:${patient.phone}`)}>
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>)}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600 mb-4">
              جرب البحث بكلمات مختلفة أو غير المرشحات
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة مريض جديد
            </Button>
          </div>}
      </div>
    </div>;
};
export default ClinicNewPatients;