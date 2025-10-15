import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedProductCard from "@/components/UnifiedProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { dentalProducts } from "@/data/dentalProducts";

// Dynamic promotional cards data
const promoCards = [
  {
    id: 1,
    title: "عروض حصرية",
    subtitle: "خصومات تصل إلى 60%",
    icon: Sparkles,
    gradient: "from-purple-600 via-pink-600 to-red-600",
    badge: "جديد",
    bgPattern: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=300&fit=crop&q=80",
  },
  {
    id: 2,
    title: "المنتجات الأكثر مبيعاً",
    subtitle: "الأفضل في السوق",
    icon: TrendingUp,
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    badge: "الأكثر طلباً",
    bgPattern: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=300&fit=crop&q=80",
  },
  {
    id: 3,
    title: "منتجات جديدة",
    subtitle: "أحدث المنتجات الطبية",
    icon: Package,
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    badge: "وصل حديثاً",
    bgPattern: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=300&fit=crop&q=80",
  },
];

export default function AllProducts() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const isMobile = useIsMobile();

  // Auto-rotate promotional cards
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoCards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeCard = promoCards[currentPromo];
  const Icon = activeCard.icon;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <main className="p-2 md:p-4 lg:p-6">
        {/* Dynamic Promotional Banner */}
        <div className="mb-6 relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700">
          <div
            className={cn(
              "relative h-48 md:h-64 bg-gradient-to-r p-6 md:p-8 flex flex-col justify-between",
              activeCard.gradient
            )}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(${activeCard.bgPattern})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  {activeCard.badge}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {activeCard.title}
              </h2>
              <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow">
                {activeCard.subtitle}
              </p>
            </div>

            {/* Dots Indicator */}
            <div className="relative z-10 flex gap-2 justify-center md:justify-end">
              {promoCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentPromo === index 
                      ? "w-8 bg-white" 
                      : "w-2 bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              جميع المنتجات
            </h1>
            <p className="text-gray-600">
              {dentalProducts.length} منتج متوفر
            </p>
          </div>
        </div>

        {/* Products Grid - Using UnifiedProductCard */}
        <div className="grid grid-cols-3 lg:grid-cols-10 gap-2 md:gap-3">
          {dentalProducts.map((product) => (
            <UnifiedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20 w-full"></div>
      </main>
    </div>
  );
}
