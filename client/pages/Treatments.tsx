import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Brain,
  Stethoscope,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Eye,
  Activity,
  Zap,
  Shield,
  Target,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Award,
  Users,
  Timer,
  BarChart3,
  Heart,
  Scissors,
  Wrench,
  Microscope,
  Pill,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  BookOpen,
  Settings,
  CheckCircle,
  Play,
  Pause,
  ArrowRight,
  Download,
  Upload,
  Camera,
  Video,
  MessageSquare,
  AlertTriangle,
  Bookmark,
  Share2,
  Printer,
  Save,
  RefreshCw,
  X,
  ChevronDown,
  ChevronRight,
  Info,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  User,
  Badge,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { adaptTreatmentsToLegacy, LegacyTreatment } from "@/services/clinicDataAdapter";

interface ExtendedTreatment extends LegacyTreatment {
  arabicName?: string;
  aiSuccess?: number;
  difficulty?: string;
  equipment?: string[];
  steps?: number;
  popularity?: number;
  lastUpdate?: string;
  provider?: string;
  completionRate?: number;
  patientSatisfaction?: number;
  complications?: number;
  image?: string;
}

const enhanceTreatmentWithDefaults = (treatment: LegacyTreatment, index: number): ExtendedTreatment => {
  const durationMatch = treatment.duration.match(/\d+/);
  const durationNum = durationMatch ? parseInt(durationMatch[0]) : 60;
  
  const priceNum = typeof treatment.price === 'number' ? treatment.price : 50000;
  
  const difficultyMap: Record<number, string> = {
    0: "مبتدئ",
    1: "متوسط",
    2: "متقدم",
    3: "خبير"
  };
  
  const equipmentMap: Record<string, string[]> = {
    "وقائي": ["أدوات فحص", "معدات تنظيف", "مواد وقائية"],
    "علاجي": ["أدوات حفر", "مواد حشو", "معدات تعقيم"],
    "جراحي": ["أدوات جراحية", "معدات تخدير", "أجهزة مراقبة"],
  };
  
  const categoryKey = treatment.category.includes("علاج") ? "علاجي" : treatment.category.includes("جراحة") ? "جراحي" : "وقائي";
  
  return {
    ...treatment,
    arabicName: treatment.name,
    aiSuccess: 85 + Math.floor(Math.random() * 15),
    difficulty: difficultyMap[index % 4],
    equipment: equipmentMap[categoryKey] || ["معدات طبية أساسية"],
    steps: Math.ceil(durationNum / 15),
    popularity: 70 + Math.floor(Math.random() * 30),
    lastUpdate: new Date().toISOString().split('T')[0],
    provider: "د. أحمد السعيد",
    completionRate: 85 + Math.floor(Math.random() * 15),
    patientSatisfaction: 4.5 + Math.random() * 0.5,
    complications: Math.floor(Math.random() * 3),
    image: `https://images.unsplash.com/photo-${1576091160399 + index * 100}-112ba8d25d1f?w=300&h=200&fit=crop`
  };
};

const difficultyLevels = {
  "مبتدئ": { color: "green", percentage: 25 },
  "متوسط": { color: "blue", percentage: 50 },
  "متقدم": { color: "orange", percentage: 75 },
  "خبير": { color: "red", percentage: 100 }
};

const Treatments = () => {
  const [treatments, setTreatments] = useState<ExtendedTreatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    { id: "all", name: "جميع العلاجات", count: 0, color: "gray" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTreatment, setSelectedTreatment] = useState<ExtendedTreatment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    const loadTreatments = async () => {
      try {
        setLoading(true);
        const treatmentsData = await sharedClinicData.getTreatments();
        const legacyTreatments = adaptTreatmentsToLegacy(treatmentsData);
        const enhancedTreatments = legacyTreatments.map((t, i) => enhanceTreatmentWithDefaults(t, i));
        setTreatments(enhancedTreatments);
        
        const uniqueCategories = [...new Set(enhancedTreatments.map(t => t.category))];
        const categoriesData = [
          { id: "all", name: "جميع العلاجات", count: enhancedTreatments.length, color: "gray" },
          ...uniqueCategories.map((cat, index) => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            name: cat,
            count: enhancedTreatments.filter(t => t.category === cat).length,
            color: ["blue", "red", "green", "purple", "orange"][index % 5]
          }))
        ];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading treatments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTreatments();
  }, []);

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || treatment.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTreatments = [...filteredTreatments].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return (b.popularity || 0) - (a.popularity || 0);
      case "success":
        return (b.aiSuccess || 0) - (a.aiSuccess || 0);
      case "price":
        const priceA = typeof a.price === 'string' ? parseInt(a.price.split("-")[0]) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.split("-")[0]) : b.price;
        return priceA - priceB;
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      default:
        return 0;
    }
  });

  const openTreatmentDetail = (treatment: any) => {
    setSelectedTreatment(treatment);
    setIsDetailModalOpen(true);
  };

  const openTreatmentEdit = (treatment: any) => {
    setSelectedTreatment(treatment);
    setIsEditModalOpen(true);
  };

  const deleteTreatment = async (treatmentId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العلاج؟")) {
      setTreatments(treatments.filter(t => t.id !== treatmentId));
    }
  };

  const TreatmentCard = ({ treatment }: { treatment: any }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group">
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={treatment.image}
          alt={treatment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold text-white",
            treatment.status === "نشط" ? "bg-green-500" : "bg-red-500"
          )}>
            {treatment.status}
          </span>
        </div>

        {/* AI Success Score */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-bold">{treatment.aiSuccess}%</span>
        </div>

        {/* Difficulty Level */}
        <div className="absolute bottom-4 right-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold text-white",
            difficultyLevels[treatment.difficulty as keyof typeof difficultyLevels].color === "green" && "bg-green-500",
            difficultyLevels[treatment.difficulty as keyof typeof difficultyLevels].color === "blue" && "bg-blue-500",
            difficultyLevels[treatment.difficulty as keyof typeof difficultyLevels].color === "orange" && "bg-orange-500",
            difficultyLevels[treatment.difficulty as keyof typeof difficultyLevels].color === "red" && "bg-red-500"
          )}>
            {treatment.difficulty}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {treatment.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{treatment.arabicName}</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                {treatment.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{treatment.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-gray-900">{treatment.duration}</span>
            </div>
            <p className="text-xs text-gray-600">المدة</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-gray-900">{treatment.price}</span>
            </div>
            <p className="text-xs text-gray-600">السعر</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">معدل النجاح</span>
            <span className="font-bold text-green-600">{treatment.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${treatment.completionRate}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">رضا المرضى</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-bold text-gray-900">{treatment.patientSatisfaction}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => openTreatmentDetail(treatment)}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </button>
          <button 
            onClick={() => openTreatmentEdit(treatment)}
            className="p-3 border border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => deleteTreatment(treatment.id)}
            className="p-3 border border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const AddTreatmentModal = () => {
    const [newTreatment, setNewTreatment] = useState({
      name: "",
      category: "",
      price: "",
      visits: "1",
      duration: "30",
      description: "",
      requiresLab: false,
      difficulty: "متوسط",
      equipment: "",
    });

    if (!isAddModalOpen) return null;

    const handleSave = async () => {
      // Here you would save to database and integrate with patient profiles, labs, etc.
      console.log("Saving treatment:", newTreatment);
      setIsAddModalOpen(false);
      setNewTreatment({
        name: "",
        category: "",
        price: "",
        visits: "1",
        duration: "30",
        description: "",
        requiresLab: false,
        difficulty: "متوسط",
        equipment: "",
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">إضافة علاج جديد</h2>
                <p className="text-blue-100">أدخل تفاصيل العلاج والتكامل مع النظام</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-2 gap-6">
              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العلاج *</label>
                  <input
                    type="text"
                    value={newTreatment.name}
                    onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: تنظيف الأسنان"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف *</label>
                  <select
                    value={newTreatment.category}
                    onChange={(e) => setNewTreatment({ ...newTreatment, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر التصنيف</option>
                    <option value="وقائي">وقائي</option>
                    <option value="علاجي">علاجي</option>
                    <option value="جراحي">جراحي</option>
                    <option value="تجميلي">تجميلي</option>
                    <option value="تقويم">تقويم</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر (د.ع) *</label>
                    <input
                      type="number"
                      value={newTreatment.price}
                      onChange={(e) => setNewTreatment({ ...newTreatment, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الزيارات</label>
                    <input
                      type="number"
                      value={newTreatment.visits}
                      onChange={(e) => setNewTreatment({ ...newTreatment, visits: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={newTreatment.duration}
                    onChange={(e) => setNewTreatment({ ...newTreatment, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={newTreatment.description}
                    onChange={(e) => setNewTreatment({ ...newTreatment, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="وصف تفصيلي للعلاج..."
                  />
                </div>
              </div>

              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مستوى الصعوبة</label>
                  <select
                    value={newTreatment.difficulty}
                    onChange={(e) => setNewTreatment({ ...newTreatment, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                    <option value="خبير">خبير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المعدات المطلوبة</label>
                  <textarea
                    value={newTreatment.equipment}
                    onChange={(e) => setNewTreatment({ ...newTreatment, equipment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="أدوات فحص، معدات تنظيف..."
                  />
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Microscope className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">التكامل مع المختبر</span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTreatment.requiresLab}
                      onChange={(e) => setNewTreatment({ ...newTreatment, requiresLab: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">يتطلب هذا العلاج عمل مختبري</span>
                  </label>
                </div>

                {/* Integration Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    التكامل التلقائي
                  </h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>إضافة إلى خطط العلاج للمرضى</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>إنشاء أوامر مختبر تلقائياً</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>ربط مع نظام الحجوزات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>تسجيل في النظام المالي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                حفظ العلاج
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditTreatmentModal = () => {
    const [editData, setEditData] = useState({
      name: selectedTreatment?.name || "",
      category: selectedTreatment?.category || "",
      price: selectedTreatment?.price?.toString() || "",
      duration: selectedTreatment?.duration?.toString() || "",
      description: selectedTreatment?.description || "",
      difficulty: selectedTreatment?.difficulty || "متوسط",
    });

    React.useEffect(() => {
      if (selectedTreatment) {
        setEditData({
          name: selectedTreatment.name,
          category: selectedTreatment.category,
          price: selectedTreatment.price?.toString() || "",
          duration: selectedTreatment.duration?.toString() || "",
          description: selectedTreatment.description,
          difficulty: selectedTreatment.difficulty || "متوسط",
        });
      }
    }, [selectedTreatment]);

    if (!isEditModalOpen || !selectedTreatment) return null;

    const handleSave = async () => {
      const updatedTreatments = treatments.map(t =>
        t.id === selectedTreatment.id
          ? { ...t, ...editData, price: editData.price, duration: editData.duration }
          : t
      );
      setTreatments(updatedTreatments);
      setIsEditModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">تعديل العلاج</h2>
                <p className="text-blue-100">تحديث معلومات {selectedTreatment.name}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-2 gap-6">
              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العلاج *</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف *</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="وقائي">وقائي</option>
                    <option value="علاجي">علاجي</option>
                    <option value="جراحي">جراحي</option>
                    <option value="تجميلي">تجميلي</option>
                    <option value="تقويمي">تقويمي</option>
                    <option value="تعويضي">تعويضي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر (د.ع) *</label>
                  <input
                    type="text"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدة</label>
                  <input
                    type="text"
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مستوى الصعوبة</label>
                  <select
                    value={editData.difficulty}
                    onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                    <option value="خبير">خبير</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TreatmentDetailModal = () => {
    if (!selectedTreatment || !isDetailModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={selectedTreatment.image}
              alt={selectedTreatment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{selectedTreatment.name}</h2>
              <p className="text-white/90 text-lg mb-4">{selectedTreatment.description}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Brain className="w-5 h-5" />
                  <span className="font-bold">{selectedTreatment.aiSuccess}% نجاح AI</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">{selectedTreatment.patientSatisfaction} تقييم</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Users className="w-5 h-5" />
                  <span className="font-bold">{selectedTreatment.popularity}% شعبية</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-96">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Treatment Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات العلاج</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">المدة</p>
                      <p className="font-bold text-gray-900">{selectedTreatment.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">السعر</p>
                      <p className="font-bold text-gray-900">{selectedTreatment.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">عدد الخطوات</p>
                      <p className="font-bold text-gray-900">{selectedTreatment.steps} خطوة</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">مستوى الصعوبة</p>
                      <p className="font-bold text-gray-900">{selectedTreatment.difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">المعدات المطلوبة</h3>
                  <div className="grid gap-3">
                    {selectedTreatment.equipment.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">الأداء والإحصائيات</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">معدل الإكمال</span>
                        <span className="font-bold text-green-600">{selectedTreatment.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${selectedTreatment.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">المضاعفات</span>
                        <span className="font-bold text-red-600">{selectedTreatment.complications}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full"
                          style={{ width: `${selectedTreatment.complications * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Provider Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">مقدم العلاج</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selectedTreatment.provider}</p>
                      <p className="text-sm text-gray-600">طبيب متخصص</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">
                      <Phone className="w-4 h-4" />
                      اتصال
                    </button>
                    <button className="w-full flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200">
                      <Mail className="w-4 h-4" />
                      مراسلة
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                      <Calendar className="w-4 h-4" />
                      جدولة علاج
                    </button>
                    <button className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                      <Copy className="w-4 h-4" />
                      نسخ البروتوكول
                    </button>
                    <button className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                      <Download className="w-4 h-4" />
                      تصدير التفاصيل
                    </button>
                    <button className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                      <BookOpen className="w-4 h-4" />
                      دليل العلاج
                    </button>
                  </div>
                </div>

                {/* Last Update */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">آخر تحديث</span>
                  </div>
                  <p className="text-sm text-purple-700">{selectedTreatment.lastUpdate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل العلاجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة العلاجات</h1>
              <p className="text-blue-100 text-lg mb-4">نظام ذكي لإدارة البروتوكولات والعلاجات الطبية</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">{treatments.length} علاج نشط</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">تقنية AI متقدمة</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">4.8 تقييم متوسط</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة علاج
              </button>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all flex items-center gap-2">
                <Upload className="w-5 h-5" />
                استيراد بروتوكولات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن العلاجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularity">الأكثر شعبية</option>
              <option value="success">الأعلى نجاحاً</option>
              <option value="price">السعر</option>
              <option value="duration">المدة</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all">
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "إجمالي العلاجات", value: treatments.length, change: "+2", icon: Activity, color: "blue" },
          { title: "متوسط النجاح", value: `${Math.round(treatments.reduce((acc, t) => acc + t.aiSuccess, 0) / treatments.length)}%`, change: "+3%", icon: TrendingUp, color: "green" },
          { title: "متوسط الرضا", value: `${(treatments.reduce((acc, t) => acc + t.patientSatisfaction, 0) / treatments.length).toFixed(1)}`, change: "+0.2", icon: Star, color: "yellow" },
          { title: "العلاجات النشطة", value: treatments.filter(t => t.status === "نشط").length, change: "0", icon: CheckCircle, color: "purple" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
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

      {/* Treatments Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedTreatments.map((treatment) => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sortedTreatments.map((treatment, index) => (
              <div key={treatment.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-6">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{treatment.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {treatment.category}
                      </span>
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        treatment.status === "نشط" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {treatment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{treatment.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {treatment.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {treatment.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        {treatment.aiSuccess}% نجاح
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {treatment.patientSatisfaction}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openTreatmentDetail(treatment)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => openTreatmentEdit(treatment)}
                      className="p-2 text-gray-600 hover:bg-blue-100 rounded-xl"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteTreatment(String(treatment.id))}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddTreatmentModal />
      <EditTreatmentModal />
      <TreatmentDetailModal />
    </div>
  );
};

export default Treatments;
