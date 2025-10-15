import React from "react";
import { MapPin, Phone } from "lucide-react";

interface UnifiedPlaceCardProps {
  name: string;
  distance?: string;
  address?: string;
  phone?: string;
  badge?: string;
  onDirections?: () => void;
}

export default function UnifiedPlaceCard({ name, distance, address, phone, badge, onDirections }: UnifiedPlaceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[45vw] sm:min-w-[300px] md:min-w-0 snap-start">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          {distance && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{distance}</span>
            </div>
          )}
        </div>
        {badge && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{badge}</span>
        )}
      </div>
      {address && <p className="text-sm text-gray-600 mb-4">{address}</p>}
      <div className="flex gap-2">
        {phone && (
          <a href={`tel:${phone}`} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-blue-700">
            اتصال
          </a>
        )}
        <button onClick={onDirections} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">الاتجاهات</button>
      </div>
    </div>
  );
}
