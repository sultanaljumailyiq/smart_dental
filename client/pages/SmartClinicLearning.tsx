import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import SmartClinicKnowledge from "./SmartClinicKnowledge";

export default function SmartClinicLearning() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/dentist-hub/smart-clinic/main")}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">مكتبة المعرفة</h1>
                <p className="text-sm text-gray-600">
                  مصادر تعليمية ومعلومات طبية محدثة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Library */}
        <SmartClinicKnowledge />
      </div>
    </div>
  );
}
