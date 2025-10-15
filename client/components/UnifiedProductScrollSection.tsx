import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedProductCard from "./UnifiedProductCard";

interface UnifiedProductScrollSectionProps {
  title: string;
  products: any[];
  viewAllLink?: string;
  className?: string;
  showProgressBar?: boolean;
  compact?: boolean;
  limit?: number;
}

export default function UnifiedProductScrollSection({
  title,
  products,
  viewAllLink,
  className,
  showProgressBar = false,
  compact = false,
  limit = 8,
}: UnifiedProductScrollSectionProps) {
  const displayProducts = products.slice(0, limit);

  return (
    <div className={cn("mb-8", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
          >
            عرض الكل
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Products Horizontal Scroll - Unified Design */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {displayProducts.map((product) => (
          <UnifiedProductCard
            key={product.id}
            product={product}
            compact={compact}
            showProgressBar={showProgressBar}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600">لم نجد أي منتجات في هذا القسم</p>
        </div>
      )}
    </div>
  );
}
