import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Trash2, ShoppingCart, Eye, Store, Users, Briefcase, BookOpen, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useNavigation } from "@/contexts/NavigationContext";

type SectionType = "marketplace" | "community" | "jobs" | "education" | "all";

const favoriteProducts = [
  {
    id: 1,
    name: "Pro II Composite Resin",
    arabicName: "راتنج مركب برو 2",
    price: 385,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    rating: 4.8,
    inStock: true,
    section: "marketplace"
  }
];

const sectionConfig = {
  marketplace: { title: "المتجر", icon: Store, color: "blue" },
  community: { title: "المجتمع", icon: Users, color: "emerald" },
  jobs: { title: "الوظائف", icon: Briefcase, color: "violet" },
  education: { title: "التعليم", icon: BookOpen, color: "rose" },
  all: { title: "جميع المفضلات", icon: Heart, color: "gray" }
};

export default function Favorites() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { goBack } = useNavigation();
  const [selectedSection, setSelectedSection] = useState<SectionType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getAllFavorites = () => {
    const contextBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      name: bookmark.title,
      arabicName: bookmark.title
    }));
    return [...favoriteProducts, ...contextBookmarks];
  };

  const getFilteredFavorites = () => {
    let items = getAllFavorites();
    if (selectedSection !== "all") {
      items = items.filter(item => item.section === selectedSection);
    }
    if (searchTerm) {
      items = items.filter(item => {
        const title = 'title' in item ? item.title : 'name' in item ? item.name : '';
        return title?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    return items;
  };

  const config = sectionConfig[selectedSection];
  const filteredItems = getFilteredFavorites();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <button onClick={goBack} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{config.title}</h1>
            </div>
          </div>

          {/* Mobile-Optimized Section Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none' }}>
            {(Object.keys(sectionConfig) as SectionType[]).map((section) => {
              const SectionIcon = sectionConfig[section].icon;
              return (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0",
                    selectedSection === section 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <SectionIcon className="w-3.5 h-3.5" />
                  {sectionConfig[section].title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Search */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في المفضلة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mobile-Optimized Grid */}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base text-gray-500">لا توجد عناصر مفضلة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                <div className="relative">
                  <img src={item.image || 'https://via.placeholder.com/300'} alt={'name' in item ? item.name : item.title} className="w-full h-32 sm:h-40 object-cover" />
                  <button
                    onClick={() => removeBookmark(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-current" />
                  </button>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1">
                    {'arabicName' in item ? item.arabicName : 'name' in item ? item.name : item.title}
                  </h3>
                  {'price' in item && item.price && (
                    <p className="text-sm sm:text-base font-bold text-blue-600 mb-2">
                      {item.price} ر.س
                    </p>
                  )}
                  {'rating' in item && item.rating && (
                    <div className="flex items-center gap-1 text-xs mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                  <button className="w-full bg-blue-600 text-white py-1.5 px-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
