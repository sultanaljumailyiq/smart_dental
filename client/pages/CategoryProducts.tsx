import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Package,
  Heart,
  ShoppingCart,
  Bell,
  Menu,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ModernSidebar from "@/components/ModernSidebar";
import UnifiedHeader from "@/components/UnifiedHeader";

// Mock data for when products exist
const mockProducts = [];

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get category display name
  const getCategoryDisplayName = (name?: string) => {
    const categories: Record<string, string> = {
      "general-dentistry": "طب ��لأسنان العام",
      "consumables": "المستهلكات",
      "endodontics": "علاج الجذور",
      "orthodontics": "تقويم الأسنان",
      "instruments": "الأدوات",
      "equipments": "المعدات",
      "paedodontics": "أسنان الأطفال",
      "prosthodontics": "التركيبات",
      "periodontics": "أمراض اللثة",
      "oral-surgery": "جراحة الفم",
      "implantology": "زراعة الأسنان",
      "sterilization": "��لتعقيم",
      "oral-care": "العناية بالفم",
      "clothing-and-uniforms": "الملابس والزي الطبي",
      "photography": "التصوير",
      "learning-and-training": "التعلم والتدريب",
      "maintenance": "الصيانة",
      "laboratory": "المخ��بر"
    };
    return categories[name || ""] || name || "الفئة";
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
        <Package className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">لا توجد منتجات</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        عذراً، لا توجد منتجات متاحة في فئة "{getCategoryDisplayName(categoryName)}" حالياً.
        يرجى المحاولة لاحقاً أو تصفح الفئات الأخرى.
      </p>
      <div className="flex gap-4">
        <Link
          to="/dental-supply"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
        >
          العودة للصفحة الرئيسية
        </Link>
        <Link
          to="/products"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-300"
        >
          تصفح جميع المنتجات
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Unified Header */}
      <UnifiedHeader
        showSidebar={false} // Hide menu button since sidebar is always visible
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-16 right-0 bottom-0 z-40 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "lg:w-16" : "lg:w-64",
            "md:w-16 w-16", // Always show with icons on mobile
            "translate-x-0", // Always visible
          )}
        >
          <ModernSidebar
            collapsed={isMobile || sidebarCollapsed} // Always collapsed on mobile
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:mr-16" : "lg:mr-64",
          "mr-16" // Always account for sidebar on mobile
        )}>
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link to="/dental-supply" className="hover:text-purple-600 transition-colors">
                الصفحة الرئيسية
              </Link>
              <ArrowRight className="w-4 h-4" />
              <Link to="/products" className="hover:text-purple-600 transition-colors">
                المنتجات
              </Link>
              <ArrowRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {getCategoryDisplayName(categoryName)}
              </span>
            </div>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getCategoryDisplayName(categoryName)}
                </h1>
                <p className="text-gray-600">
                  {mockProducts.length === 0 
                    ? "لا توجد منتجات متاحة" 
                    : `${mockProducts.length} منتج متاح`
                  }
                </p>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-2xl p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      viewMode === "grid"
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      viewMode === "list"
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="popular">الأكثر شعبية</option>
                </select>

                <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  فلترة
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[500px] flex items-center justify-center">
              <EmptyState />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
