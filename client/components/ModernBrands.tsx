import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, CheckCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandsProps {
  className?: string;
}

const brands = [
  {
    id: 1,
    name: "DentalTech Pro",
    arabicName: "دنتال تك برو",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    verified: true,
    rating: 4.9,
    products: 234,
    description: "رائدة في تقنيات طب الأسنان الحديثة",
    color: "from-blue-500 to-cyan-500",
    established: "2010",
  },
  {
    id: 2,
    name: "MedSupply Elite",
    arabicName: "مد سبلاي إيليت",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop",
    verified: true,
    rating: 4.8,
    products: 456,
    description: "متخصصون في المعدات الطبية عالية الجودة",
    color: "from-green-500 to-emerald-500",
    established: "2008",
  },
  {
    id: 3,
    name: "SterileMax",
    arabicName: "ستريل ماكس",
    logo: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=150&h=150&fit=crop",
    verified: false,
    rating: 4.6,
    products: 123,
    description: "حلول التعقيم المتطورة",
    color: "from-purple-500 to-pink-500",
    established: "2015",
  },
  {
    id: 4,
    name: "ProDental",
    arabicName: "برو دنتال",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop",
    verified: true,
    rating: 4.7,
    products: 789,
    description: "أدوات الأسنان الاحترافية",
    color: "from-orange-500 to-red-500",
    established: "2005",
  },
  {
    id: 5,
    name: "ClinoCare",
    arabicName: "كلينو كير",
    logo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
    verified: true,
    rating: 4.9,
    products: 345,
    description: "رعاية شاملة لعياداتكم",
    color: "from-indigo-500 to-blue-500",
    established: "2012",
  },
  {
    id: 6,
    name: "HealthTech",
    arabicName: "هيلث تك",
    logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=150&h=150&fit=crop",
    verified: false,
    rating: 4.5,
    products: 678,
    description: "تكنولوجيا الصحة المبتكرة",
    color: "from-teal-500 to-green-500",
    established: "2018",
  },
];

export default function ModernBrands({ className }: BrandsProps) {
  return (
    <section className={cn("space-y-8", className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            العلامات التجارية الرائدة
          </h2>
          <p className="text-gray-600">
            تسوق من أفضل العلامات التجارية المتخصصة في المعدات الطبية
          </p>
        </div>
        <Link
          to="/brands"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          عرض جميع العلامات
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/brand/${brand.id}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
          >
            {/* Header with Gradient */}
            <div
              className={`h-24 bg-gradient-to-r ${brand.color} relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full opacity-10"></div>
                <div className="absolute bottom-2 left-2 w-10 h-10 bg-white rounded-full opacity-10"></div>
              </div>

              {/* Verification Badge */}
              {brand.verified && (
                <div className="absolute top-3 left-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Established Year */}
              <div className="absolute bottom-3 right-3 text-white text-xs font-semibold bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full">
                منذ {brand.established}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 relative">
              {/* Logo */}
              <div className="absolute -top-8 right-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.arabicName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Brand Info */}
              <div className="mt-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {brand.arabicName}
                    </h3>
                    <p className="text-sm text-gray-500">{brand.name}</p>
                  </div>
                  {brand.verified && (
                    <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      موثق
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {brand.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {brand.rating}
                    </span>
                    <span className="text-gray-500">تقييم</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {brand.products}
                    </span>{" "}
                    منتج
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gray-50 hover:bg-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                  زيارة المتجر
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
          </Link>
        ))}
      </div>

      {/* Bottom Section - Partnership CTA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500 rounded-full opacity-10 translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                هل أنت مورد أو علامة تجارية؟
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                انضم إلى شبكتنا من الموردين المعتمدين واصل إلى آلاف العملاء في
                القطاع الطبي
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors">
                  انضم كمورد
                </button>
                <button className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-xl font-semibold transition-colors">
                  تعرف على المزايا
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 opacity-80">
              {brands.slice(0, 3).map((brand) => (
                <div
                  key={brand.id}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <img
                    src={brand.logo}
                    alt={brand.arabicName}
                    className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover"
                  />
                  <div className="text-xs font-semibold">{brand.products}+</div>
                  <div className="text-xs text-gray-300">منتج</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
