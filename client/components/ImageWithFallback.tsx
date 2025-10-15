import React from "react";
import { Building2, Stethoscope, MapPin, Star } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  type?: "clinic" | "article" | "generic";
  clinicName?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  type = "generic",
  clinicName = ""
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setLoading(false);
  };

  const renderFallback = () => {
    if (type === "clinic") {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center`}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-center px-2">
            <p className="text-xs font-medium text-blue-800 line-clamp-1">
              {clinicName || "عيادة طبية"}
            </p>
            <p className="text-xs text-blue-600">صورة غير متوفرة</p>
          </div>
        </div>
      );
    }

    if (type === "article") {
      return (
        <div className={`${className} bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center`}>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="text-center px-2">
            <p className="text-xs font-medium text-gray-800">مقال طبي</p>
            <p className="text-xs text-gray-600">صورة غير متوفرة</p>
          </div>
        </div>
      );
    }

    // Generic fallback
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-1">
            <span className="text-white text-xs">؟</span>
          </div>
          <p className="text-xs text-gray-600">صورة غير متوفرة</p>
        </div>
      </div>
    );
  };

  if (imageError) {
    return renderFallback();
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0`}>
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;