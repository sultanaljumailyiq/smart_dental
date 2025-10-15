import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Bell,
  Menu,
  Package,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ModernSidebar from "@/components/ModernSidebar";
import UnifiedHeader from "@/components/UnifiedHeader";

// فئات شاملة متطابقة مع ModernSidebar
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
      "Examination & Diagnosis",
      "Basic Examination Instruments",
      "Anesthetics & Needles",
      "Local Anesthesia Syringes",
      "Dental Mirrors & Probes",
      "Impression Trays",
      "Basic Dental Materials",
      "Temporary Filling Materials",
      "Dental Cotton & Gauze",
      "Disposable Items",
      "Patient Comfort Items",
    ],
  },
  {
    id: "restorative-dentistry",
    name: "Restorative Dentistry",
    arabicName: "طب الأسنان الترميمي",
    icon: "🔧",
    color: "bg-green-100 text-green-600",
    productCount: 289,
    description: "مواد الحشو والترميم والعلاج التعويضي",
    subcategories: [
      "Composite Resins",
      "Direct Composites",
      "Indirect Composites",
      "Flowable Composites",
      "Bulk Fill Composites",
      "Amalgam Alloys",
      "Glass Ionomer Cements",
      "Resin Modified Glass Ionomer",
      "Compomers",
      "Temporary Restorative Materials",
      "Cavity Liners & Bases",
      "Pulp Protection Materials",
      "Opaquers & Tints",
      "Composite Modeling Liquids",
    ],
  },
  {
    id: "endodontics",
    name: "Endodontics",
    arabicName: "علاج الجذور",
    icon: "🔬",
    color: "bg-purple-100 text-purple-600",
    productCount: 187,
    description: "علاج جذور ا��أسنان والعصب",
    subcategories: [
      "Root Canal Files",
      "Rotary Files",
      "Hand Files",
      "Gates Glidden Drills",
      "Peeso Reamers",
      "Root Canal Irrigants",
      "Sodium Hypochlorite",
      "EDTA Solutions",
      "Root Canal Sealers",
      "Gutta Percha Points",
      "Paper Points",
      "Root Canal Obturation",
      "Post & Core Systems",
      "Fiber Posts",
      "Metal Posts",
      "Calcium Hydroxide",
      "MTA Materials",
      "Root Repair Materials",
      "Endodontic Accessories",
      "Apex Locators",
      "Endodontic Motors",
    ],
  },
  {
    id: "crown-bridge",
    name: "Crown & Bridge",
    arabicName: "التيجان والجسور",
    icon: "👑",
    color: "bg-yellow-100 text-yellow-600",
    productCount: 156,
    description: "تيجان الأسنان والجسور والتعويضات الثابتة",
    subcategories: [
      "Impression Materials",
      "Polyvinyl Siloxane (PVS)",
      "Polyether",
      "Alginate",
      "Bite Registration Materials",
      "Retraction Cords",
      "Hemostatic Agents",
      "Temporary Crowns",
      "Temporary Crown Materials",
      "Temporary Cements",
      "Permanent Cements",
      "Resin Cements",
      "Glass Ionomer Cements",
      "Zinc Phosphate Cements",
      "Preparation Burs",
      "Finishing Burs",
      "Ceramic Materials",
      "Zirconia Blocks",
      "Lithium Disilicate",
      "Feldspathic Ceramics",
    ],
  },
  {
    id: "oral-surgery",
    name: "Oral Surgery",
    arabicName: "جراحة الفم",
    icon: "🔪",
    color: "bg-red-100 text-red-600",
    productCount: 134,
    description: "أدوات الجراحة وعمليات الفم والفكين",
    subcategories: [
      "Surgical Instruments",
      "Elevators",
      "Forceps",
      "Surgical Burs",
      "Suture Materials",
      "Absorbable Sutures",
      "Non-Absorbable Sutures",
      "Hemostatic Agents",
      "Bone Grafts",
      "Barrier Membranes",
      "Surgical Guides",
      "Implant Systems",
      "Implant Drills",
      "Healing Abutments",
      "Cover Screws",
    ],
  },
  {
    id: "periodontics",
    name: "Periodontics",
    arabicName: "أمراض اللثة",
    icon: "🦴",
    color: "bg-pink-100 text-pink-600",
    productCount: 98,
    description: "علاج أمراض اللثة والأنسجة المحيطة",
    subcategories: [
      "Scaling & Root Planing",
      "Ultrasonic Scalers",
      "Hand Scalers",
      "Curettes",
      "Periodontal Probes",
      "Subgingival Irrigation",
      "Antimicrobial Agents",
      "Chlorhexidine",
      "Local Drug Delivery",
      "Regenerative Materials",
      "GTR Membranes",
      "Bone Substitutes",
      "Growth Factors",
    ],
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    arabicName: "تقويم الأسنان",
    icon: "🔗",
    color: "bg-indigo-100 text-indigo-600",
    productCount: 167,
    description: "تقويم الأسنا�� وتصحيح الإطباق",
    subcategories: [
      "Metal Brackets",
      "Ceramic Brackets",
      "Self-Ligating Brackets",
      "Lingual Brackets",
      "Orthodontic Wires",
      "Stainless Steel Wires",
      "Nickel Titanium Wires",
      "Beta Titanium Wires",
      "Elastomeric Ties",
      "Power Chains",
      "Coil Springs",
      "Orthodontic Bands",
      "Separators",
      "Headgear",
      "Face Masks",
      "Clear Aligners",
      "Retainers",
    ],
  },
  {
    id: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    arabicName: "طب أسنان الأطفال",
    icon: "👶",
    color: "bg-orange-100 text-orange-600",
    productCount: 89,
    description: "طب أسنان الأطفال والعناية المتخصصة",
    subcategories: [
      "Stainless Steel Crowns",
      "Pediatric Forceps",
      "Smaller Instruments",
      "Fluoride Varnishes",
      "Pit & Fissure Sealants",
      "Behavior Management",
      "Nitrous Oxide",
      "Pediatric Anesthetics",
      "Space Maintainers",
      "Pulp Therapy Materials",
    ],
  },
  {
    id: "prosthodontics",
    name: "Prosthodontics",
    arabicName: "التعويضات السنية",
    icon: "🦷",
    color: "bg-teal-100 text-teal-600",
    productCount: 123,
    description: "التعويضات السنية الثابتة والمتحركة",
    subcategories: [
      "Complete Dentures",
      "Partial Dentures",
      "Denture Base Materials",
      "Denture Teeth",
      "Denture Adhesives",
      "Relines & Repairs",
      "Implant Prosthodontics",
      "Abutments",
      "Impression Copings",
      "Laboratory Analogs",
    ],
  },
  {
    id: "preventive-dentistry",
    name: "Preventive Dentistry",
    arabicName: "الطب الوقائي",
    icon: "🛡️",
    color: "bg-emerald-100 text-emerald-600",
    productCount: 67,
    description: "الوقاية وحماية الأسنان من الأمراض",
    subcategories: [
      "Fluoride Treatments",
      "Professional Fluorides",
      "Fluoride Varnishes",
      "Fluoride Gels",
      "Pit & Fissure Sealants",
      "Resin-Based Sealants",
      "Glass Ionomer Sealants",
      "Caries Detection",
      "Disclosing Solutions",
      "DIAGNOdent",
      "Desensitizing Agents",
    ],
  },
  {
    id: "cosmetic-esthetic",
    name: "Cosmetic & Esthetic",
    arabicName: "طب الأسنان التجميلي",
    icon: "✨",
    color: "bg-violet-100 text-violet-600",
    productCount: 78,
    description: "تجميل وتبييض الأسنان",
    subcategories: [
      "Tooth Whitening",
      "In-Office Bleaching",
      "Take-Home Bleaching",
      "Bleaching Gels",
      "Light-Activated Systems",
      "Veneers",
      "Porcelain Veneers",
      "Composite Veneers",
      "Tooth Contouring",
      "Polishing Systems",
      "Tooth Jewellery",
    ],
  },
  {
    id: "instruments",
    name: "Instruments",
    arabicName: "الأدوات الطبية",
    icon: "🔧",
    color: "bg-gray-100 text-gray-600",
    productCount: 234,
    description: "الأدوات اليدوية والأساسية",
    subcategories: [
      "Basic Hand Instruments",
      "Mirrors & Handles",
      "Explorers & Probes",
      "Tweezers & Pliers",
      "Excavators",
      "Plastic Instruments",
      "Condensers",
      "Burnishers",
      "Carvers",
      "Margin Trimmers",
      "Hatchets",
      "Chisels",
      "Surgical Instruments",
      "Periodontal Instruments",
      "Endodontic Instruments",
      "Orthodontic Pliers",
      "Instrument Maintenance",
    ],
  },
  {
    id: "infection-control",
    name: "Infection Control",
    arabicName: "مكافحة العدوى",
    icon: "🧽",
    color: "bg-cyan-100 text-cyan-600",
    productCount: 156,
    description: "التعقيم ومكافحة العدوى",
    subcategories: [
      "Sterilization",
      "Autoclaves",
      "Chemical Sterilants",
      "Disinfectants",
      "Surface Disinfectants",
      "Instrument Disinfectants",
      "Personal Protection",
      "Gloves",
      "Masks & Face Shields",
      "Protective Eyewear",
      "Disposable Gowns",
      "Barrier Films",
      "Sterilization Pouches",
      "Indicator Strips",
    ],
  },
];

export default function CategoriesNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const filteredCategories = categoriesData.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.arabicName.includes(searchTerm) ||
      category.subcategories.some((sub) =>
        sub.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Unified Header */}
      <UnifiedHeader />

      <div className="flex pt-16">
        {/* Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/dental-supply" className="hover:text-purple-600">
                الرئيسية
              </Link>
              <ArrowRight className="w-4 h-4" />
              <span>الفئات</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              جميع الفئات
            </h1>
            <p className="text-gray-600">
              استكشف مجموعتنا الشاملة من المستلزمات الطبية المصنفة حسب التخصص
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid - 4 on mobile, more on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 block group"
              >
                {/* Category Header - Compact */}
                <div className="text-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-lg mx-auto mb-2 group-hover:scale-110 transition-transform",
                      category.color,
                    )}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {category.arabicName}
                  </h3>
                  <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {category.productCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد فئات مطابقة
              </h3>
              <p className="text-gray-500">
                جرب كلمات بحث مختلفة أو تصفح جميع الفئات
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              إحصائيات الفئات
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {categoriesData.length}
                </div>
                <p className="text-gray-600">فئة رئيسية</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {categoriesData.reduce(
                    (total, cat) => total + cat.subcategories.length,
                    0,
                  )}
                </div>
                <p className="text-gray-600">فئة فرعية</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {categoriesData.reduce(
                    (total, cat) => total + cat.productCount,
                    0,
                  )}
                </div>
                <p className="text-gray-600">منتج</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(
                    categoriesData.reduce(
                      (total, cat) => total + cat.productCount,
                      0,
                    ) / categoriesData.length,
                  )}
                </div>
                <p className="text-gray-600">متوسط المنتجات لكل فئة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
