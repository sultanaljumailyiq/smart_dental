import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import UnifiedProductCard from "@/components/UnifiedProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  category?: string;
  supplier?: string;
}

interface SmartProductsGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  gridType?: "mobile-3" | "mobile-4" | "desktop-10" | "compact" | "featured";
  showScrollIndicator?: boolean;
  className?: string;
  mobileGrid?: boolean; // when true, use grid on mobile/tablet instead of horizontal scroll
}

export default function SmartProductsGrid({
  products,
  title,
  subtitle,
  viewAllLink,
  gridType = "mobile-3",
  showScrollIndicator = true,
  className = "",
  mobileGrid = false,
}: SmartProductsGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = Math.max(
        200,
        Math.floor(container.clientWidth * 0.9),
      );
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const getGridClasses = () => {
    // Horizontal scroller: 3 visible on mobile, 6 on md+ by sizing auto columns
    return `grid grid-flow-col auto-cols-[calc(100%/3.2)] sm:auto-cols-[calc(100%/4)] md:auto-cols-[calc(100%/6)] lg:auto-cols-[calc(100%/8)] gap-2 md:gap-3 overflow-x-auto scroll-smooth px-1 pb-2`;
  };

  const getCardClasses = () => {
    if (gridType === "compact") {
      return "smart-product-card flex-shrink-0 w-36 lg:w-auto";
    }

    return "smart-product-card";
  };

  return (
    <div className={`mb-4 md:mb-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1"
          >
            عرض الكل
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Products Horizontal Scroller (all breakpoints) */}
      <div className="relative">
        {showScrollIndicator && canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className={getGridClasses()}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <UnifiedProductCard
              key={product.id}
              product={product as any}
              compact
              showProgressBar={Boolean((product as any).timeLeft)}
            />
          ))}
        </div>

        {showScrollIndicator && canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
