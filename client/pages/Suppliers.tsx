import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Star, MapPin, Phone, Mail, Globe, Award, Users, Package, Search, Filter, Grid3X3, List, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample suppliers data
const suppliers = [{
  id: 1,
  name: "DentalTech Solutions",
  arabicName: "شركة حلول الأسنان التقنية",
  image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
  rating: 4.9,
  reviewCount: 234,
  location: "بغداد، العراق",
  speciality: "معدات طبية متقدمة",
  productsCount: 450,
  verified: true,
  established: 2015,
  description: "موردين معدات طب الأسنان المتقدمة والتقنيات الحديثة",
  contact: {
    phone: "+964 770 123 4567",
    email: "info@dentaltech.iq",
    website: "www.dentaltech.iq"
  },
  badges: ["موثق", "شحن سريع", "ضمان شامل"],
  growth: "+25%"
}, {
  id: 2,
  name: "MedEquip Iraq",
  arabicName: "المعدات الطبية العراقية",
  image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&h=200&fit=crop",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
  rating: 4.7,
  reviewCount: 189,
  location: "أربيل، العراق",
  speciality: "أدوات جراحية",
  productsCount: 320,
  verified: true,
  established: 2018,
  description: "متخصصون في الأدوات الجراحية وأدوات طب الأسنان",
  contact: {
    phone: "+964 750 987 6543",
    email: "sales@medequip.iq",
    website: "www.medequip.iq"
  },
  badges: ["جودة عالية", "أسعار منافسة", "دعم فني"],
  growth: "+18%"
}, {
  id: 3,
  name: "Dental Pro Supplies",
  arabicName: "مستلزمات طب الأسنان المحترف",
  image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
  rating: 4.8,
  reviewCount: 156,
  location: "البصرة، العراق",
  speciality: "مواد الترميم",
  productsCount: 280,
  verified: true,
  established: 2016,
  description: "موردين مواد الترميم والحشو عالية الجودة",
  contact: {
    phone: "+964 771 456 7890",
    email: "contact@dentalpro.iq",
    website: "www.dentalpro.iq"
  },
  badges: ["مواد أصلية", "توصيل مجاني", "استشارة فنية"],
  growth: "+32%"
}, {
  id: 4,
  name: "Iraqi Dental Imports",
  arabicName: "واردات الأسنان العراقية",
  image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=300&h=200&fit=crop",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
  rating: 4.6,
  reviewCount: 98,
  location: "النجف، العراق",
  speciality: "معدات تقويم",
  productsCount: 180,
  verified: true,
  established: 2019,
  description: "مستوردين معدات تقويم الأسنان من أفضل الشركات العالمية",
  contact: {
    phone: "+964 782 234 5678",
    email: "info@iraqidental.iq",
    website: "www.iraqidental.iq"
  },
  badges: ["واردات أصلية", "خدمة عملاء", "تدريب"],
  growth: "+15%"
}];
export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");
  const specialities = [...new Set(suppliers.map(s => s.speciality))];
  const SupplierCard = ({
    supplier
  }: {
    supplier: any;
  }) => <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header Image */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-500 overflow-hidden">
        <img src={supplier.image} alt={supplier.arabicName} className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Verification Badge */}
        {supplier.verified && <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            موثق
          </div>}

        {/* Growth Badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {supplier.growth}
        </div>
      </div>

      {/* Supplier Info */}
      <div className="p-6 relative">
        {/* Logo */}
        <div className="absolute -top-8 right-6 w-16 h-16 bg-white rounded-xl shadow-lg border-4 border-white overflow-hidden">
          <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
        </div>

        <div className="pt-10">
          {/* Name and Rating */}
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {supplier.arabicName}
            </h3>
            

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < Math.floor(supplier.rating) ? "text-yellow-400 fill-current" : "text-gray-300")} />)}
              </div>
              <span className="text-sm text-gray-600">
                {supplier.rating} ({supplier.reviewCount})
              </span>
            </div>
          </div>

          {/* Speciality */}
          

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {supplier.description}
          </p>

          {/* Stats */}
          

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{supplier.location}</span>
          </div>

          {/* Badges */}
          

          {/* Contact Actions */}
          <div className="flex gap-2">
            <Link to={`/suppliers/${supplier.id}`} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-3 rounded-lg text-center text-sm font-medium hover:shadow-lg transition-all duration-300">
              عرض المنتجات
            </Link>
            <a href={`tel:${supplier.contact.phone}`} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        </div>
      </div>
    </div>;
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeciality = selectedSpeciality === "all" || supplier.speciality === selectedSpeciality;
    return matchesSearch && matchesSpeciality;
  });
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "products":
        return b.productsCount - a.productsCount;
      case "established":
        return b.established - a.established;
      default:
        return 0;
    }
  });
  return <div className="min-h-screen p-6" dir="rtl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                الموردين المعتمدين
              </h1>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                ✓ موثقين
              </span>
            </div>
            <p className="text-gray-600">
              شركاء موثوقين لتوفير أفضل منتجات طب الأسنان
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ابحث في الموردين..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64 pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm" />
            </div>

            {/* Speciality Filter */}
            <select value={selectedSpeciality} onChange={e => setSelectedSpeciality(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
              <option value="all">جميع التخصصات</option>
              {specialities.map(spec => <option key={spec} value={spec}>
                  {spec}
                </option>)}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
              <option value="rating">الأعلى تقييماً</option>
              <option value="products">الأكثر منتجات</option>
              <option value="established">الأقدم تأسيساً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                الموردين المعتمدين
              </p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                إجمالي المنتجات
              </p>
              <p className="text-2xl font-bold">
                {suppliers.reduce((sum, s) => sum + s.productsCount, 0).toLocaleString()}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                متوسط التقييم
              </p>
              <p className="text-2xl font-bold">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">موثقين</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedSuppliers.map(supplier => <SupplierCard key={supplier.id} supplier={supplier} />)}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد موردين
          </h3>
          <p className="text-gray-600">
            جرب تغيير الفلاتر أو البحث بكلمات مختلفة
          </p>
        </div>}
    </div>;
}