import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  Gift,
  Package,
  Truck,
  Award,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive categories with subcategories
const categoriesData = [
  {
    id: "general-dentistry",
    name: "General Dentistry",
    arabicName: "طب الأسنان العام",
    icon: "🦷",
    color: "bg-blue-100 text-blue-600",
    productCount: 312,
    description: "أساسيات طب الأسنان والفحوصات والعلاج الأساسي",
    subcategories: [
      { id: "basic-instruments", name: "الأدوات الأساسية", count: 45 },
      { id: "impression-materials", name: "مواد الطباعة", count: 78 },
      { id: "local-anesthetics", name: "المخدرات الموضعية", count: 32 },
      { id: "disposables", name: "المواد المستهلكة", count: 157 },
    ],
  },
  {
    id: "restorative-materials",
    name: "Restorative Materials",
    arabicName: "مواد الترميم",
    icon: "🔧",
    color: "bg-purple-100 text-purple-600",
    productCount: 256,
    description: "مواد حشو الأسنان والترميم التجميلي",
    subcategories: [
      { id: "composites", name: "الكومبوزيت", count: 89 },
      { id: "amalgam", name: "الأملغم", count: 45 },
      { id: "glass-ionomer", name: "الزجاج الأيونومري", count: 67 },
      { id: "bonding-agents", name: "مواد الربط", count: 55 },
    ],
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    arabicName: "تقويم الأسنان",
    icon: "📐",
    color: "bg-green-100 text-green-600",
    productCount: 189,
    description: "أجهزة وأدوات تقويم الأسنان",
    subcategories: [
      { id: "brackets", name: "البراكيت", count: 78 },
      { id: "wires", name: "الأسلاك", count: 65 },
      { id: "elastic", name: "المطاط", count: 23 },
      { id: "retention", name: "مواد التثبيت", count: 23 },
    ],
  },
  {
    id: "oral-surgery",
    name: "Oral Surgery",
    arabicName: "جراحة الفم",
    icon: "⚕️",
    color: "bg-red-100 text-red-600",
    productCount: 134,
    description: "أدوات ومعدات جراحة الفم والوجه والفكين",
    subcategories: [
      { id: "extraction-forceps", name: "ملاقط القلع", count: 45 },
      { id: "elevators", name: "الرافعات", count: 32 },
      { id: "surgical-handpieces", name: "المحركات الجراحية", count: 28 },
      { id: "sutures", name: "خيوط الجراحة", count: 29 },
    ],
  },
  {
    id: "preventive-care",
    name: "Preventive Care",
    arabicName: "الرعاية الوقائية",
    icon: "🛡️",
    color: "bg-yellow-100 text-yellow-600",
    productCount: 167,
    description: "منتجات الوقاية والعناية بصحة الفم",
    subcategories: [
      { id: "prophylaxis-paste", name: "معجون التنظيف", count: 34 },
      { id: "fluoride-treatments", name: "علاجات الفلورايد", count: 28 },
      { id: "sealants", name: "مواد الإغلاق", count: 45 },
      { id: "cleaning-instruments", name: "أدوات التنظيف", count: 60 },
    ],
  },
  {
    id: "endodontics",
    name: "Endodontics",
    arabicName: "علاج العصب",
    icon: "🔬",
    color: "bg-indigo-100 text-indigo-600",
    productCount: 201,
    description: "أدوات ومواد علاج جذور الأسنان",
    subcategories: [
      { id: "files-reamers", name: "المبارد والموسعات", count: 67 },
      { id: "obturation", name: "مواد الحشو النهائي", count: 45 },
      { id: "irrigation", name: "مواد الري", count: 34 },
      { id: "apex-locators", name: "محددات القمة", count: 55 },
    ],
  },
  {
    id: "dental-equipment",
    name: "Dental Equipment",
    arabicName: "المعدات الطبية",
    icon: "🏥",
    color: "bg-teal-100 text-teal-600",
    productCount: 98,
    description: "الأجهزة والمعدات الطبية للعيادات",
    subcategories: [
      { id: "dental-units", name: "وحدات الأسنان", count: 12 },
      { id: "compressors", name: "الضواغط", count: 15 },
      { id: "autoclaves", name: "أجهزة التعقيم", count: 23 },
      { id: "xray-equipment", name: "أجهزة الأشعة", count: 48 },
    ],
  },
  {
    id: "laboratory",
    name: "Laboratory",
    arabicName: "المختبر",
    icon: "🧪",
    color: "bg-pink-100 text-pink-600",
    productCount: 223,
    description: "مواد ومعدات مختبر الأسنان",
    subcategories: [
      { id: "impression-materials-lab", name: "مواد الطباعة", count: 78 },
      { id: "dental-stones", name: "الجبس الطبي", count: 45 },
      { id: "waxes", name: "الشموع", count: 67 },
      { id: "lab-instruments", name: "أدوات المختبر", count: 33 },
    ],
  },
  {
    id: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    arabicName: "طب أسنان الأطفال",
    icon: "👶",
    color: "bg-orange-100 text-orange-600",
    productCount: 432,
    description: "علاج أسنان الأطفال والمواد المتخصصة",
    subcategories: [
      { id: "space-maintainer", name: "حافظة المساحة", count: 85 },
      { id: "pediatric-crowns", name: "تيجان الأطفال", count: 195 },
      { id: "pulp-therapy", name: "علاج اللب", count: 152 },
    ],
  },
  {
    id: "prosthodontics",
    name: "Prosthodontics",
    arabicName: "التركيبات",
    icon: "🦷",
    color: "bg-cyan-100 text-cyan-600",
    productCount: 789,
    description: "التركيبات الثابتة والمتحركة",
    subcategories: [
      { id: "model-creation", name: "إنشاء النماذج", count: 185 },
      { id: "acrylics", name: "الأكريليك", count: 220 },
      { id: "dental-waxes", name: "شموع الأسنان", count: 125 },
      { id: "denture-processing", name: "معالجة أطقم الأسنان", count: 145 },
      { id: "denture-relines", name: "إعادة تبطين أطقم الأسنان", count: 114 },
    ],
  },
  {
    id: "periodontics",
    name: "Periodontics",
    arabicName: "أمراض اللثة",
    icon: "🦷",
    color: "bg-emerald-100 text-emerald-600",
    productCount: 345,
    description: "علاج أمراض اللثة والأنسجة المحيطة",
    subcategories: [
      { id: "scaling-instruments", name: "أدوات التقليح", count: 123 },
      { id: "periodontal-surgery", name: "جراحة اللثة", count: 89 },
      { id: "regenerative-materials", name: "مواد التجديد", count: 67 },
      { id: "antimicrobials", name: "مضادات الميكروبات", count: 66 },
    ],
  },
  {
    id: "infection-control",
    name: "Infection Control",
    arabicName: "مكافحة العدوى",
    icon: "🧽",
    color: "bg-lime-100 text-lime-600",
    productCount: 234,
    description: "منتجات التعقيم ومكافحة العدوى",
    subcategories: [
      { id: "disinfectants", name: "المطهرات", count: 67 },
      { id: "sterilization", name: "التعقيم", count: 45 },
      { id: "barriers", name: "الحواجز الواقية", count: 78 },
      { id: "personal-protection", name: "معدات الحماية الشخصية", count: 44 },
    ],
  },
];

export default function AllCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const filteredCategories = categoriesData.filter(
    (category) =>
      category.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalProducts = categoriesData.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <main className="p-2 md:p-4 lg:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            جميع الفئات
          </h1>
          <p className="text-gray-600">
            تصفح جميع الفئات والتخصصات المتاحة في متجرنا
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link
              to="/dental-supply/offers"
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Gift className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-sm text-center">العروض</span>
            </Link>

            <Link
              to="/dental-supply/products"
              className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Package className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-sm text-center">المنتجات</span>
            </Link>

            <Link
              to="/dental-supply/suppliers"
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Truck className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-sm text-center">الموردين</span>
            </Link>

            <Link
              to="/dental-supply/brands"
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Award className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-sm text-center">العلامات التجارية</span>
            </Link>

            <Link
              to="/dental-supply/students"
              className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <GraduationCap className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-sm text-center">طلاب طب الأسنان</span>
            </Link>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في الفئات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {viewMode === "grid" ? (
              <>
                <List className="w-5 h-5" />
                <span>قائمة</span>
              </>
            ) : (
              <>
                <Grid3X3 className="w-5 h-5" />
                <span>شبكة</span>
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">إجمالي الفئات</p>
                <p className="text-2xl font-bold">{categoriesData.length}</p>
              </div>
              <div className="text-3xl">📂</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  إجمالي المنتجات
                </p>
                <p className="text-2xl font-bold">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  الفئات المتاحة
                </p>
                <p className="text-2xl font-bold">{filteredCategories.length}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Categories Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-xl", category.color)}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {category.arabicName}
                        </h3>
                        <p className="text-gray-500 text-sm">{category.name}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        {category.productCount} منتج
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full p-2 text-right text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span>
                        الفئات الفرعية ({category.subcategories.length})
                      </span>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedCategories.includes(category.id) && (
                      <div className="space-y-1 pr-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/dental-supply/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}/${sub.id}`}
                            className="flex items-center justify-between p-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
                          >
                            <span className="group-hover:text-purple-600">
                              {sub.name}
                            </span>
                            <span className="text-xs text-gray-400 group-hover:text-purple-500">
                              {sub.count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/dental-supply/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <span>تصفح الفئة</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl", category.color)}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {category.arabicName}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {category.name}
                        </p>
                        <p className="text-gray-600 text-sm max-w-md">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                          {category.productCount} منتج
                        </span>
                      </div>
                      <Link
                        to={`/dental-supply/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        <span>تصفح</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
          </div>
        )}

        {/* Bottom spacing for navigation */}
        <div className="h-20 w-full"></div>
      </main>
    </div>
  );
}
