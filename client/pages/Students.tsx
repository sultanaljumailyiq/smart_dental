import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Star, Heart, Eye, Plus, Grid3X3, List, Search, BookOpen, Award, Users, Percent, Tag, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample student products and programs
const studentProducts = [{
  id: 1,
  name: "Student Dental Kit Basic",
  arabicName: "طقم طالب الأسنان الأساسي",
  price: 450000,
  originalPrice: 650000,
  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
  rating: 4.8,
  reviewCount: 234,
  category: "طقم أساسي",
  brand: "StudenDent",
  discount: 31,
  studentOnly: true,
  inStock: true,
  features: ["مرآة فم", "مسبار", "ملقط", "مقص"]
}, {
  id: 2,
  name: "Clinical Practice Set",
  arabicName: "مجموعة الممارسة السريرية",
  price: 680000,
  originalPrice: 850000,
  image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
  rating: 4.9,
  reviewCount: 156,
  category: "ممارسة سريرية",
  brand: "ClinicalPro",
  discount: 20,
  studentOnly: true,
  inStock: true,
  features: ["أدوات فحص", "مواد حشو", "أدوات تنظيف"]
}, {
  id: 3,
  name: "Anatomy Study Models",
  arabicName: "نماذج دراسة التشريح",
  price: 320000,
  originalPrice: 450000,
  image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
  rating: 4.7,
  reviewCount: 89,
  category: "نماذج تعليمية",
  brand: "AnatomyEd",
  discount: 29,
  studentOnly: true,
  inStock: true,
  features: ["نموذج فك", "نموذج أسنان", "مرجع تشريحي"]
}, {
  id: 4,
  name: "Digital Textbook Bundle",
  arabicName: "حزمة الكتب الرقمية",
  price: 240000,
  originalPrice: 400000,
  image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
  rating: 4.6,
  reviewCount: 167,
  category: "كتب رقمية",
  brand: "EduBooks",
  discount: 40,
  studentOnly: true,
  inStock: true,
  features: ["5 كتب رقمية", "فيديوهات", "امتحانات تفاعلية"]
}];
const studentPrograms = [{
  id: 1,
  title: "برنامج التدريب السريري",
  description: "برنامج تدريبي شامل للطلاب في السنوات الأخيرة",
  duration: "6 أشهر",
  price: 1200000,
  participants: 145,
  rating: 4.9,
  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop"
}, {
  id: 2,
  title: "ورشة المهارات المتقدمة",
  description: "تطوير مهارات الطلاب في التقنيات الحديثة",
  duration: "3 أشهر",
  price: 800000,
  participants: 89,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=250&fit=crop"
}];
const benefits = [{
  icon: Percent,
  title: "خصومات حصرية",
  description: "خصومات تصل إلى 50% على جميع المنتجات",
  color: "bg-green-100 text-green-600"
}, {
  icon: BookOpen,
  title: "مواد تعليمية مجانية",
  description: "وصول مجاني للمواد التعليمية والفيديوهات",
  color: "bg-blue-100 text-blue-600"
}, {
  icon: Users,
  title: "مجتمع الطلاب",
  description: "انضم لمجتمع طلاب طب الأسنان وشارك الخبرات",
  color: "bg-purple-100 text-purple-600"
}, {
  icon: Trophy,
  title: "برامج تدريبية",
  description: "برامج تدريبية متخصصة لتطوير المهارات",
  color: "bg-orange-100 text-orange-600"
}];
export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("grid");
  const ProductCard = ({
    product
  }: {
    product: any;
  }) => <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative bg-gradient-to-br from-white to-blue-50">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <img src={product.image} alt={product.arabicName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

        {/* Student Only Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <GraduationCap className="w-3 h-3" />
          طلاب فقط
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{product.discount}%
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
            <Heart className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
            <Eye className="w-3.5 h-3.5 text-gray-600 hover:text-blue-500" />
          </button>
          <button className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {product.arabicName}
        </h3>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 2).map((feature: string, index: number) => <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-0.5 rounded-full">
                {feature}
              </span>)}
        </div>

        {/* Rating */}
        

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {product.price.toLocaleString()} د.ع
            </span>
            <span className="text-xs text-gray-500 line-through">
              {product.originalPrice.toLocaleString()} د.ع
            </span>
          </div>
          
        </div>
      </div>
    </div>;
  const ProgramCard = ({
    program
  }: {
    program: any;
  }) => <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{program.duration}</span>
          </div>
          <h3 className="font-bold text-lg">{program.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{program.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {program.participants} متدرب
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{program.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {program.price.toLocaleString()} د.ع
          </span>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            التسجيل
          </button>
        </div>
      </div>
    </div>;
  const filteredProducts = studentProducts.filter(product => product.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) || product.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="min-h-screen p-6" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                قسم ا��طلاب
              </h1>
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                🎓 خصم 50%
              </span>
            </div>
            <p className="text-gray-600">
              منتجات وبرامج مخصصة لطلاب طب الأسنان بأفضل الأسعار
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ابحث في منتجات الطلاب..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm" />
            </div>

            {/* View Mode */}
            <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              {viewMode === "grid" ? <>
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">قائمة</span>
                </> : <>
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">شبكة</span>
                </>}
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          مميزات قسم الطلاب
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", benefit.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>;
        })}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab("products")} className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200", activeTab === "products" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900")}>
            المنتجات
          </button>
          <button onClick={() => setActiveTab("programs")} className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200", activeTab === "programs" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900")}>
            البرامج التدريبية
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              منتجات ال��لاب
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </>}

      {/* Programs Tab */}
      {activeTab === "programs" && <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              البرامج التدريبية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentPrograms.map(program => <ProgramCard key={program.id} program={program} />)}
            </div>
          </div>
        </>}

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-500 p-8 rounded-2xl text-white">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-100" />
          <h2 className="text-2xl font-bold mb-2">هل أنت طالب طب أسنان؟</h2>
          <p className="text-blue-100 mb-6">
            انضم إلى برنامج الطلاب واحصل على خصومات حصرية ومواد تعليمية مجانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              التسجيل في البرنامج
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
              تعرف على المزيد
            </button>
          </div>
        </div>
      </div>
    </div>;
}