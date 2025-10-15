import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  Rss,
  Database,
  Settings,
  Eye,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Upload,
  Link as LinkIcon,
  FileText,
  Video,
  Image,
  BookOpen,
  Zap,
  Shield,
  Key,
  Server,
  Star,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Hash,
  ExternalLink,
  Save,
  X,
  Copy,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import UnifiedHeader from "@/components/UnifiedHeader";

// Mock data for external sources
const externalSources = [
  {
    id: 1,
    name: "PubMed Medical Database",
    description: "قاعدة البيانات الطبية الأمريكية للمقالات العلمية المحكمة",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    type: "database",
    category: "research",
    status: "active",
    apiKey: "pm_key_***********",
    apiEndpoint: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/",
    lastSync: "منذ ساعتين",
    articlesCount: 2456,
    monthlyQuota: 10000,
    usedQuota: 3456,
    rating: 5.0,
    reliability: 98,
    language: "en",
    allowedContentTypes: ["article", "research"],
    tags: ["طب", "بحث علمي", "مقالات محكمة"],
    addedBy: "د. أحمد المدير",
    addedDate: "2023-01-15",
    lastUpdated: "2024-01-20",
    autoSync: true,
    syncFrequency: "daily",
    contentFilter: {
      keywords: ["dentistry", "oral health", "dental"],
      dateRange: "last_5_years",
      minCitations: 5
    }
  },
  {
    id: 2,
    name: "مجلة طب الأسنان العربية",
    description: "المجلة العلمية الرائدة في طب الأسنان باللغة العربية",
    url: "https://arabdentaljornal.com/",
    type: "journal",
    category: "publication",
    status: "active",
    apiKey: "adj_key_***********",
    apiEndpoint: "https://api.arabdentaljornal.com/v1/",
    lastSync: "منذ 4 ساعات",
    articlesCount: 567,
    monthlyQuota: 5000,
    usedQuota: 1234,
    rating: 4.8,
    reliability: 95,
    language: "ar",
    allowedContentTypes: ["article", "case_study"],
    tags: ["طب أسنان", "عربي", "حالات سريرية"],
    addedBy: "د. فاطمة المحررة",
    addedDate: "2023-03-10",
    lastUpdated: "2024-01-19",
    autoSync: true,
    syncFrequency: "weekly",
    contentFilter: {
      keywords: ["طب الأسنان", "علاج", "تشخيص"],
      dateRange: "last_3_years",
      minCitations: 1
    }
  },
  {
    id: 3,
    name: "Journal of Endodontics",
    description: "مجلة متخصصة في علاج جذور الأسنان وطب العصب",
    url: "https://www.jendodon.com/",
    type: "journal",
    category: "specialized",
    status: "pending",
    apiKey: "je_key_***********",
    apiEndpoint: "https://api.jendodon.com/v2/",
    lastSync: "لم يتم المزامنة بعد",
    articlesCount: 0,
    monthlyQuota: 3000,
    usedQuota: 0,
    rating: 4.9,
    reliability: 97,
    language: "en",
    allowedContentTypes: ["article", "research"],
    tags: ["علاج العصب", "جذور الأسنان", "بحث متخصص"],
    addedBy: "د. محمد المختص",
    addedDate: "2024-01-18",
    lastUpdated: "2024-01-18",
    autoSync: false,
    syncFrequency: "manual",
    contentFilter: {
      keywords: ["endodontics", "root canal", "pulp"],
      dateRange: "last_2_years",
      minCitations: 3
    }
  },
  {
    id: 4,
    name: "Dental News Network",
    description: "شبكة الأخبار الطبية المتخصصة في طب الأسنان",
    url: "https://dentalnews.net/",
    type: "news",
    category: "news",
    status: "inactive",
    apiKey: "dnn_key_***********",
    apiEndpoint: "https://api.dentalnews.net/feed/",
    lastSync: "منذ أسبوع",
    articlesCount: 89,
    monthlyQuota: 2000,
    usedQuota: 456,
    rating: 4.2,
    reliability: 85,
    language: "en",
    allowedContentTypes: ["news", "article"],
    tags: ["أخبار طبية", "تطورات", "تكنولوجيا"],
    addedBy: "د. سارة المحررة",
    addedDate: "2023-08-22",
    lastUpdated: "2024-01-10",
    autoSync: false,
    syncFrequency: "daily",
    contentFilter: {
      keywords: ["dental technology", "innovation", "breakthrough"],
      dateRange: "last_year",
      minCitations: 0
    }
  }
];

// Mock data for source categories
const sourceCategories = [
  { id: "all", label: "جميع المصادر", count: externalSources.length },
  { id: "database", label: "قواعد البيانات", count: 1 },
  { id: "journal", label: "المجلات العلمية", count: 2 },
  { id: "news", label: "مصادر الأخبار", count: 1 },
  { id: "blog", label: "المدونات المتخصصة", count: 0 },
  { id: "social", label: "المنصات الاجتماعية", count: 0 }
];

// Content types mapping
const contentTypesIcons = {
  article: FileText,
  research: BookOpen,
  case_study: Database,
  news: Globe,
  video: Video,
  image: Image
};

export default function CommunitySourcesAdmin() {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  const filteredSources = externalSources.filter(source => {
    const matchesCategory = selectedCategory === "all" || source.type === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.includes(searchQuery) ||
      source.tags.some(tag => tag.includes(searchQuery));
    
    return matchesCategory && matchesSearch;
  });

  const AddSourceModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">إضافة مصدر خارجي جديد</h2>
          <button
            onClick={() => setShowAddSource(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المصدر</label>
                <input
                  type="text"
                  placeholder="مثال: مجلة طب الأسنان الدولية"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المصدر</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="journal">مجلة علمية</option>
                  <option value="database">قاعدة بيانات</option>
                  <option value="news">مصدر أخبار</option>
                  <option value="blog">مدونة متخصصة</option>
                  <option value="social">منصة اجتماعية</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                placeholder="وصف مختصر عن المصدر والمحتوى الذي يقدمه..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الرابط الأساسي</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="ar">العربية</option>
                  <option value="en">الإنجليزية</option>
                  <option value="both">كلاهما</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">إعدادات API</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                <input
                  type="url"
                  placeholder="https://api.example.com/v1/"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  placeholder="مفتاح API"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الشهري للاستعلامات</label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تكرار المزامنة</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="hourly">كل ساعة</option>
                  <option value="daily">يومياً</option>
                  <option value="weekly">أسبوعياً</option>
                  <option value="monthly">شهرياً</option>
                  <option value="manual">يدوياً</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">فلاتر المحتوى</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
              <input
                type="text"
                placeholder="طب الأسنان، علاج، تشخيص (مفصولة بفواصل)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نطاق التاريخ</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="last_year">السنة الماضية</option>
                  <option value="last_2_years">آخر سنتين</option>
                  <option value="last_5_years">آخر 5 سنوات</option>
                  <option value="all_time">كل الأوقات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للاستشهادات</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">أنواع المحتوى المسموحة</label>
                <div className="space-y-2">
                  {["article", "research", "case_study", "news"].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddSource(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              اختبار الاتصال
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              حفظ المصدر
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SourceDetailsModal = ({ source }: { source: any }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{source.name}</h2>
            <p className="text-sm text-gray-600">{source.description}</p>
          </div>
          <button
            onClick={() => setShowSourceDetails(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status and Stats */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">حالة المصدر</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الحالة</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      source.status === "active" ? "bg-green-100 text-green-700" :
                      source.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {source.status === "active" ? "ن��ط" : source.status === "pending" ? "معلق" : "غير نشط"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">آخر مزامنة</span>
                    <span className="text-sm font-medium">{source.lastSync}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الموثوقية</span>
                    <span className="text-sm font-medium text-green-600">{source.reliability}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">إحصائيات المحتوى</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">المقالات المحفوظة</span>
                    <span className="text-lg font-bold text-blue-600">{source.articlesCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الاستعلامات المستخدمة</span>
                    <span className="text-sm font-medium">{source.usedQuota.toLocaleString()} / {source.monthlyQuota.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(source.usedQuota / source.monthlyQuota) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Details and Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium mr-2">{source.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التصنيف:</span>
                    <span className="font-medium mr-2">{source.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">اللغة:</span>
                    <span className="font-medium mr-2">{source.language === "ar" ? "العربية" : source.language === "en" ? "الإنجليزية" : "متعدد"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center gap-1 mr-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{source.rating}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">الرابط:</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-2 flex items-center gap-1">
                      {source.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">العلامات</h3>
                <div className="flex flex-wrap gap-2">
                  {source.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <Hash className="w-3 h-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">فلاتر المحتوى</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">الكلمات المفتاحية:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {source.contentFilter.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">نطاق التاريخ:</span>
                      <span className="font-medium mr-2">{source.contentFilter.dateRange}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الحد الأدنى للاستشهادات:</span>
                      <span className="font-medium mr-2">{source.contentFilter.minCitations}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  مزامنة الآن
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
                <button className="bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  التقارير
                </button>
                <button className="bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  أرشفة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <UnifiedHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المصادر الخارجية</h1>
              <p className="text-gray-600">
                إدارة وتكوين المصادر الخارجية لجلب المحتوى التعليمي والبحثي لمنصة التواصل
              </p>
            </div>
            <button
              onClick={() => setShowAddSource(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة مصدر جديد
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{externalSources.length}</div>
              <div className="text-sm text-gray-600">مصدر مُكوّن</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {externalSources.filter(s => s.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">مصدر نشط</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {externalSources.reduce((acc, curr) => acc + curr.articlesCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">مقال محفوظ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {externalSources.reduce((acc, curr) => acc + curr.usedQuota, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">استعلام شهري</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث في المصادر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    تصنيف المصادر
                  </h3>
                </div>
                <div className="p-2">
                  {sourceCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <span>{category.label}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    مزامنة جميع المصادر
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير التقارير
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    الإعدادات العامة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sources List */}
            <div className="space-y-4">
              {filteredSources.map((source) => (
                <div key={source.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          {source.type === "database" && <Database className="w-8 h-8 text-white" />}
                          {source.type === "journal" && <BookOpen className="w-8 h-8 text-white" />}
                          {source.type === "news" && <Globe className="w-8 h-8 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{source.name}</h3>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              source.status === "active" ? "bg-green-100 text-green-700" :
                              source.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {source.status === "active" ? "نشط" : source.status === "pending" ? "معلق" : "غير نشط"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" />
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                {source.url}
                              </a>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {source.lastSync}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {source.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSource(source);
                            setShowSourceDetails(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-500 border border-gray-300 rounded-lg hover:border-green-300 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg hover:border-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{source.articlesCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">مقال محفوظ</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{source.reliability}%</div>
                        <div className="text-xs text-gray-600">موثوقية</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{source.usedQuota.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">استعلام مستخدم</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{source.monthlyQuota.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">حد شهري</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>استخدام الحصة الشهرية</span>
                        <span>{Math.round((source.usedQuota / source.monthlyQuota) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all",
                            (source.usedQuota / source.monthlyQuota) > 0.8 ? "bg-red-500" :
                            (source.usedQuota / source.monthlyQuota) > 0.6 ? "bg-yellow-500" :
                            "bg-green-500"
                          )}
                          style={{ width: `${(source.usedQuota / source.monthlyQuota) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {source.tags.slice(0, 4).map((tag: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {source.tags.length > 4 && (
                        <span className="text-xs text-gray-500">+{source.tags.length - 4}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        عرض المقالات
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        تعديل
                      </button>
                      <button className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                        تقرير
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSources.length === 0 && (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مصادر</h3>
                  <p className="text-gray-600 mb-4">لم يتم العثور على مصادر تطابق معايير البحث</p>
                  <button
                    onClick={() => setShowAddSource(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    إضافة مصدر جديد
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddSource && <AddSourceModal />}
      {showSourceDetails && selectedSource && (
        <SourceDetailsModal source={selectedSource} />
      )}
    </div>
  );
}
