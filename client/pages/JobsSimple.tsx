import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Heart,
  Bookmark,
  Filter,
  Grid3X3,
  List,
  Plus,
  Building,
  Users,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// بيانات الوظائف التجريبية
const jobsData = [
  {
    id: 1,
    title: "طبيب أسنان عام",
    company: "مستشفى بغداد التخصصي",
    location: "بغداد، العراق",
    type: "دوام كامل",
    salary: "2,500,000 - 4,000,000 د.ع",
    experience: "2-5 سنوات",
    posted: "منذ يومين",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    featured: true,
    description: "نبحث عن طبيب أسنان متخصص للانضمام لفريقنا الطبي المتميز",
    requirements: [
      "درجة في طب الأسنان",
      "خبرة سابقة مفضلة",
      "مهارات تواصل ممتازة",
    ],
  },
  {
    id: 2,
    title: "أخصائي تقويم أسنان",
    company: "عيادة النخبة لطب الأسنان",
    location: "البصرة، العراق",
    type: "دوام جزئي",
    salary: "3,000,000 - 5,500,000 د.ع",
    experience: "3+ سنوات",
    posted: "منذ أسبوع",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop",
    featured: false,
    description: "فرصة ممتازة للعمل مع أحدث تقنيات تقويم الأسنان",
    requirements: ["شهادة تخصص في تقويم الأسنان", "خبرة 3 سنوات على الأقل"],
  },
  {
    id: 3,
    title: "مساعد طبيب أسنان",
    company: "مركز الرعاية الطبية",
    location: "أربيل، العراق",
    type: "دوام كامل",
    salary: "800,000 - 1,200,000 د.ع",
    experience: "1-2 سنوات",
    posted: "منذ 3 أيام",
    logo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=60&h=60&fit=crop",
    featured: false,
    description: "ندعو مساعدي طب الأسنان المؤهلين للانضمام إلى فريقنا",
    requirements: ["دبلوم في مساعدة طب الأسنان", "مهارات تنظيمية عالية"],
  },
];

const JobsSimple = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    experience: "all",
    location: "all",
  });

  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">منصة الوظائف</h1>
              <p className="text-gray-600">
                اكتشف الفرص المهنية في مجال طب الأسنان
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden md:block">نشر وظيفة</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن الوظائف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">المرشحات</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الوظيفة
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedFilters.type}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="full-time">دوام كامل</option>
                    <option value="part-time">دوام جزئي</option>
                    <option value="contract">عقد</option>
                    <option value="freelance">عمل حر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedFilters.experience}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                  >
                    <option value="all">جميع المستويات</option>
                    <option value="entry">مبتدئ (0-2 سنة)</option>
                    <option value="mid">متوسط (2-5 سنوات)</option>
                    <option value="senior">خبير (5+ سنوات)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredJobs.length} وظيفة متاحة
              </h2>
            </div>

            <div
              className={cn(
                viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4",
              )}
            >
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {job.featured && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          مميزة
                        </span>
                      )}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          savedJobs.includes(job.id)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        )}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {job.experience}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{job.posted}</span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد وظائف
                </h3>
                <p className="text-gray-600">
                  لم نعثر على وظائف تطابق البحث الخاص بك
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsSimple;
