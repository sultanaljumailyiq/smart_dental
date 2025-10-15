import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  name: string;
  verified?: boolean;
  rating?: number;
  image: string;
  location?: string;
  productsCount?: number;
  logo?: string;
}

interface CompactSuppliersSectionProps {
  title: string;
  suppliers: Supplier[];
  viewAllLink?: string;
  className?: string;
  type?: "brands" | "suppliers";
}

export default function CompactSuppliersSection({
  title,
  suppliers,
  viewAllLink,
  className,
  type = "suppliers",
}: CompactSuppliersSectionProps) {
  const SupplierCard = ({ supplier }: { supplier: Supplier }) => (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Supplier Image/Logo */}
      <div className="aspect-[3/2] bg-gray-50 relative overflow-hidden">
        <img
          src={supplier.image || supplier.logo}
          alt={supplier.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Verified Badge */}
        {supplier.verified && (
          <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Supplier Info */}
      <div className="p-2">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-1 leading-tight">
          {supplier.name}
        </h3>

        {/* Details */}
        <div className="space-y-1">
          {/* Rating for suppliers */}
          {type === "suppliers" && supplier.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{supplier.rating}</span>
            </div>
          )}

          {/* Products count for brands */}
          {type === "brands" && supplier.productsCount && (
            <div className="text-xs text-gray-500">
              {supplier.productsCount} منتج
            </div>
          )}

          {/* Location */}
          {supplier.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-xs text-gray-500 truncate">
                {supplier.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("mb-6", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm transition-colors"
          >
            عرض الكل
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Suppliers Horizontal Scroller: 3 visible on mobile, 6 on md+ */}
      <div
        className="grid grid-flow-col auto-cols-[calc(100%/3)] md:auto-cols-[calc(100%/6)] gap-2 lg:gap-3 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {suppliers.map((supplier, index) => (
          <SupplierCard key={index} supplier={supplier} />
        ))}
      </div>

      {/* Empty State */}
      {suppliers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏢</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            لا يوجد {type === "brands" ? "علامات تجارية" : "موردين"}
          </h3>
          <p className="text-gray-600 text-sm">
            لم نجد أي {type === "brands" ? "علامات تجارية" : "موردين"} متاحة
          </p>
        </div>
      )}
    </div>
  );
}
