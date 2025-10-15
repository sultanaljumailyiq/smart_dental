import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  count?: number;
}

interface SmartCategoriesNavigationProps {
  categories: Category[];
  currentCategory?: string;
  baseUrl?: string;
  className?: string;
}

export default function SmartCategoriesNavigation({
  categories,
  currentCategory,
  baseUrl = "/dental-supply",
  className = "",
}: SmartCategoriesNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
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
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`sticky top-0 z-40 relative bg-white border-b border-gray-100 ${className}`}>
      <div className="relative px-2 sm:px-4">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            aria-label="التمرير يساراً"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide py-3 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category) => {
            const isActive = currentCategory === category.slug;
            return (
              <Link
                key={category.id}
                to={`${baseUrl}/${category.slug}`}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${
                    isActive
                      ? "bg-teal-50 border-teal-200 text-teal-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                  }
                `}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {category.name}
                </span>
                {category.count && (
                  <span
                    className={`
                    text-xs px-1.5 py-0.5 rounded-full font-medium
                    ${
                      isActive
                        ? "bg-teal-100 text-teal-600"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                  >
                    {category.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            aria-label="التمرير يميناً"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
