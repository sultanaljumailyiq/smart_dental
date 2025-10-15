import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryProps {
  className?: string;
}

const categories = [
  {
    id: 1,
    name: "أجهزة التشخيص",
    icon: "🔬",
    count: 234,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2Fec535ce8f44045d7a1b786f24b8d5a77?format=webp&width=800",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "أدوات الجراحة",
    icon: "⚡",
    count: 456,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F2cf3a5b0a7724e2e9e44b29ebac18a9d?format=webp&width=800",
    color: "from-green-500 to-green-600",
  },
  {
    id: 3,
    name: "مواد التعقيم",
    icon: "🧼",
    count: 789,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F5263123d5b07448fbd373c656ed85dca?format=webp&width=800",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    name: "معدات الإضاءة",
    icon: "💡",
    count: 123,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F26736f83032d44dcb5d6d0722b59bb13?format=webp&width=800",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 5,
    name: "كراسي الأسنان",
    icon: "🪑",
    count: 67,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2Fcc312065940448069c48f06ada270e02?format=webp&width=800",
    color: "from-red-500 to-red-600",
  },
  {
    id: 6,
    name: "أنظمة الإدارة",
    icon: "💻",
    count: 45,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2Fe36bf54502904f3d97e9a48f51a4f55e?format=webp&width=800",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function ModernCategories({ className }: CategoryProps) {
  return (
    <section className={cn("space-y-6", className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            تصفح حسب الفئة
          </h2>
          <p className="text-gray-600">
            اكتشف مجموعة واسعة من المعدات الطبية عالية الجودة
          </p>
        </div>
        <Link
          to="/categories"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          عرض الكل
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
          >
            {/* Background Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                </div>

                {/* Bottom Section */}
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {category.count} منتج
                    </span>
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>

            {/* Stats Bar */}
            <div className="p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  متوفر الآن
                </span>
                <span className="font-semibold text-gray-900">
                  +{Math.floor(category.count * 0.1)} جديد
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          لم تجد ما تبحث عنه؟
        </h3>
        <p className="text-gray-600 mb-6">
          تواصل معنا للحصول على استشارة مجانية حول احتياجاتك
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            طلب استشارة
          </button>
          <button className="bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            تصفح الكتالوج
          </button>
        </div>
      </div>
    </section>
  );
}
