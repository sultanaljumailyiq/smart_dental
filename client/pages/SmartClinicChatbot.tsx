import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import SmartClinicAIAssistant from "./SmartClinicAIAssistant";
export default function SmartClinicChatbot() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          
        </div>

        {/* AI Assistant */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <SmartClinicAIAssistant />
        </div>
      </div>
    </div>;
}