import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import PatientFriendlyArticlesSection from "@/components/PatientFriendlyArticlesSection";
import { UserRole } from "@shared/permissions";

interface ArticlesProps {
  userRole?: UserRole;
}

export default function Articles({ userRole = "patient" }: ArticlesProps) {
  const { language } = useI18n();

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/medical-services"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
          >
            <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">العودة إلى الخدمات الطبية</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              المقالات والنصائح الطبية
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              اقرأ أحدث المقالات الطبية ونصائح الصحة من أطباء متخصصين
            </p>

            {/* Navigation to First Aid Section */}
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              <a
                href="#first-aid"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                الإسعافات الأولية
              </a>
              <Link
                to="/emergency/pain-management"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all inline-flex items-center gap-2"
              >
                إدارة الأل��
              </Link>
              <Link
                to="/emergency"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all inline-flex items-center gap-2"
              >
                طوارئ
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* First Aid Guide Section (compact redirect) */}
      <section id="first-aid" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-900">دليل الإسعافات الأولية</span>
            </div>
            <Link to="/emergency/first-aid" className="text-red-600 font-medium hover:underline">اذهب للدليل</Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientFriendlyArticlesSection userRole={userRole} />
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">المقالات الطبية</span>
          </div>
          <p className="text-gray-400 mb-4">
            منصة موثوقة للمعلومات الطبية والنصائح الصحية
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link to="/about" className="hover:text-white">
              حول المنصة
            </Link>
            <Link to="/privacy" className="hover:text-white">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-white">
              شروط الاستخدام
            </Link>
            <Link to="/contact" className="hover:text-white">
              تواصل معنا
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
