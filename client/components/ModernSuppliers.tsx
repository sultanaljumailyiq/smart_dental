import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  Award,
  Shield,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  id: number;
  name: string;
  arabicName: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  unionEndorsed?: boolean;
  location: string;
  arabicLocation: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  productsCount: number;
  established: string;
  certification: string[];
  responseTime: string;
  color: string;
}

interface SuppliersProps {
  className?: string;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "DentalTech Solutions",
    arabicName: "حلول دنتال تك",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 234,
    verified: true,
    unionEndorsed: true,
    location: "Baghdad, Iraq",
    arabicLocation: "بغداد، العراق",
    phone: "+964 770 123 4567",
    email: "info@dentaltech.iq",
    description:
      "متخصصون في أحدث تقنيات طب الأسنان والمعدات الطبية عالية الجودة",
    specialties: ["أجهزة الأشعة", "معدات التشخيص", "أدوات الجراحة"],
    productsCount: 456,
    established: "2010",
    certification: ["ISO 9001", "CE Mark", "FDA"],
    responseTime: "خلال ساعة",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "MedSupply Elite",
    arabicName: "مد سبلاي إيليت",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 189,
    verified: true,
    location: "Basra, Iraq",
    arabicLocation: "البصرة، العراق",
    phone: "+964 770 234 5678",
    email: "contact@medsupply.iq",
    description: "أكبر موزع للمستلزمات الطبية في جنوب العراق",
    specialties: ["مواد التعقيم", "مستلزمات الوقاية", "أدوات التنظيف"],
    productsCount: 789,
    established: "2008",
    certification: ["ISO 13485", "CE Mark"],
    responseTime: "خلال 30 دقيقة",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "ProDental Iraq",
    arabicName: "برو دنتال العراق",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    verified: false,
    location: "Erbil, Iraq",
    arabicLocation: "أربيل، العراق",
    phone: "+964 750 345 6789",
    email: "sales@prodental.iq",
    description: "خبرة 15 عام في توفير أفضل المعدات لعيادات الأسنان",
    specialties: ["كراسي الأسنان", "أنظمة الإضاءة", "معدات التبريد"],
    productsCount: 234,
    established: "2005",
    certification: ["ISO 9001"],
    responseTime: "خلال ساعتين",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "SterileMax",
    arabicName: "ستريل ماكس",
    logo: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=400&h=200&fit=crop",
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    location: "Najaf, Iraq",
    arabicLocation: "النجف، العراق",
    phone: "+964 770 456 7890",
    email: "info@sterilemax.iq",
    description: "رواد حلول التعقيم والسلامة في المرافق الطبية",
    specialties: ["أجهزة التعقيم", "مواد التطهير", "معدات السلامة"],
    productsCount: 345,
    established: "2015",
    certification: ["ISO 13485", "CE Mark", "FDA"],
    responseTime: "خلال 45 دقيقة",
    color: "from-orange-500 to-red-500",
  },
];

export default function ModernSuppliers({ className }: SuppliersProps) {
  return (
    <section className={cn("space-y-8", className)} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            شبكة الموردين المعتمدين
          </h2>
          <p className="text-gray-600">
            تواصل مباشرة مع الموردين الموثوقين في العراق
          </p>
        </div>
        <Link
          to="/suppliers"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          عرض جميع الموردين
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {suppliers.map((supplier) => (
          <Link
            key={supplier.id}
            to={`/supplier/${supplier.id}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
          >
            {/* Cover Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={supplier.coverImage}
                alt={supplier.arabicName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${supplier.color} opacity-80`}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex items-end text-white">
                <div className="flex items-center gap-4 w-full">
                  {/* Logo */}
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden flex-shrink-0">
                    <img
                      src={supplier.logo}
                      alt={supplier.arabicName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl">
                        {supplier.arabicName}
                      </h3>
                      {supplier.verified && (
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-300" />
                        <span>{supplier.rating}</span>
                        <span>({supplier.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{supplier.arabicLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification & Union Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {supplier.unionEndorsed && (
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3" />
                    مدعوم من النقابة
                  </div>
                )}
                {supplier.verified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    مورد موثق
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {supplier.description}
              </p>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  التخصصات:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">
                    {supplier.productsCount}
                  </div>
                  <div className="text-xs text-gray-600">منتج</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">
                    {supplier.established}
                  </div>
                  <div className="text-xs text-gray-600">تأسيس</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">
                    {supplier.certification.length}
                  </div>
                  <div className="text-xs text-gray-600">شهادة</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{supplier.responseTime}</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  الشهادات:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.certification.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                    >
                      <Award className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  زيارة المتجر
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  تواصل مباشر
                </button>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-3">ابحث عن مورد غير متوفر؟</h3>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              نساعدك في العثور على الموردين المناسبين لاحتياجاتك الخاصة من خلال
              شبكتنا الواسعة
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                طلب مورد جديد
              </button>
              <button className="border border-indigo-300 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors">
                تواصل معنا
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold text-lg">+50</div>
              <div className="text-xs text-indigo-200">مورد معتمد</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold text-lg">+5000</div>
              <div className="text-xs text-indigo-200">منتج متنوع</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
