import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentalCategories, type Category } from "@/data/categories";

interface CategoryStripProps {
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  categories?: Category[];
  className?: string;
}

export default function CategoryStrip({
  title = "تصفح الفئات",
  showViewAll = true,
  viewAllLink = "/dental-supply/categories",
  categories = dentalCategories,
  className = "mb-4 md:mb-6",
}: CategoryStripProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <Link
            to={viewAllLink}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-thin">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/dental-supply/category/${category.id}`}
            className="group flex-shrink-0 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200"
          >
            <div className="flex items-center gap-2 p-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm",
                  category.bgColor,
                )}
              >
                {category.icon}
              </div>
              <div className="text-right">
                <h3 className="text-gray-900 font-medium text-sm whitespace-nowrap group-hover:text-purple-600 transition-colors">
                  {category.arabicName}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
