import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import OptimizedProductCard from "./OptimizedProductCard";

interface HorizontalProductsSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  sectionId: string;
  viewAllLink: string;
  className?: string;
  compact?: boolean;
}

export default function HorizontalProductsSection({
  title,
  subtitle,
  products,
  sectionId,
  viewAllLink,
  className,
  compact = false,
}: HorizontalProductsSectionProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100",
        className,
      )}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>

        <Link
          to={viewAllLink}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <span className="text-sm font-medium">عرض المزيد</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Products Horizontal Scroll */}
      <div className="relative">
        <div
          className={cn(
            "flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
            "lg:grid lg:overflow-visible",
            products.length >= 4
              ? "lg:grid-cols-4"
              : `lg:grid-cols-${products.length}`,
            "lg:gap-6",
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          {products.slice(0, 8).map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "flex-shrink-0",
                "lg:flex-shrink lg:w-auto",
                compact ? "w-32 sm:w-36" : "w-32 sm:w-36 lg:w-auto",
              )}
            >
              <OptimizedProductCard
                product={product}
                compact={compact}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Scroll Indicator for Mobile */}
        <div className="lg:hidden absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4 text-gray-400 animate-pulse" />
            <span className="text-xs text-gray-400">اسحب لعرض المزيد</span>
          </div>
        </div>
      </div>

      {/* Mobile View All Button */}
      <div className="lg:hidden mt-4 text-center">
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span>عرض جميع المنتجات</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
