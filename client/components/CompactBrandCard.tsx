import React from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactBrandCardProps {
  brand: {
    id: string;
    name: string;
    arabicName: string;
    logo: string;
    country: string;
    arabicCountry: string;
    description: string;
    productCount: number;
    featured?: boolean;
  };
  className?: string;
}

export default function CompactBrandCard({
  brand,
  className,
}: CompactBrandCardProps) {
  return (
    <Link
      to={`/dental-supply/brand/${brand.id}`}
      className={cn(
        "group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative block",
        "lg:w-auto w-full flex-shrink-0",
        className,
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 md:h-18 lg:h-20 bg-gray-50 relative overflow-hidden flex items-center justify-center">
        <img
          src={brand.logo}
          alt={brand.arabicName}
          className="h-8 md:h-10 lg:h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
        />
        {brand.featured && (
          <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
            مميزة
          </div>
        )}
      </div>

      {/* Brand Info - Minimal */}
      <div className="p-2 md:p-2.5">
        {/* Brand Name */}
        <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1 text-center line-clamp-1">
          {brand.arabicName}
        </h3>

        {/* Country & Product Count - Horizontal */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            {brand.arabicCountry}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <Package className="w-2.5 h-2.5" />
            {brand.productCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
