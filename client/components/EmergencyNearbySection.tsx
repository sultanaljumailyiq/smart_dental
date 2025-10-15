import { Map } from "lucide-react";
import UnifiedInteractiveMap from "@/components/UnifiedInteractiveMap";

export default function EmergencyNearbySection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Map className="w-7 h-7 text-blue-600" />
            اعثر على عيادات الأسنان القريبة منك
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-blue-600" aria-hidden />
          نسخة تجريبية
        </div>
      </div>
      <UnifiedInteractiveMap
        title="الخريطة التفاعلية للعيادات والمستشفيات ال��ريبة"
        description="اعثر على أقرب العيادات والمستشفيات واحجز موعدك بسهولة"
      />
    </div>
  );
}
