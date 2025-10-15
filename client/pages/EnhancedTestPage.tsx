import React, { useState } from "react";
import EnhancedUnifiedHeader from "@/components/EnhancedUnifiedHeader";
import {
  FloatingModalProvider,
  useModalHelpers,
} from "@/components/FloatingModals";
import {
  Package,
  Heart,
  Star,
  ShoppingCart,
  Calendar,
  User,
  Settings,
  Bell,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TestPageContent: React.FC = () => {
  const {
    showAlert,
    showConfirm,
    showSuccess,
    showError,
    showLoading,
    openModal,
  } = useModalHelpers();
  const [headerVariant, setHeaderVariant] = useState<
    "default" | "minimal" | "expanded"
  >("default");
  const [isTransparent, setIsTransparent] = useState(false);

  // Test data for cards
  const testProducts = [
    {
      id: 1,
      name: "جهاز تنظيف الأسنان المتطور",
      price: "299 ر.س",
      originalPrice: "399 ر.س",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 156,
      badge: "خصم 25%",
      badgeColor: "red",
    },
    {
      id: 2,
      name: "مجموعة أدوات طب الأسنان الشاملة",
      price: "1,299 ر.س",
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop",
      rating: 4.9,
      reviews: 89,
      badge: "جديد",
      badgeColor: "green",
    },
    {
      id: 3,
      name: "كرسي أسنان كهربائي متقدم",
      price: "15,999 ر.س",
      originalPrice: "18,999 ر.س",
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=300&fit=crop",
      rating: 4.7,
      reviews: 34,
      badge: "مميز",
      badgeColor: "blue",
    },
    {
      id: 4,
      name: "مصباح فحص LED عالي الجودة",
      price: "899 ر.س",
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 67,
      badge: "أكثر مبيعاً",
      badgeColor: "purple",
    },
  ];

  const testServices = [
    {
      id: 1,
      title: "تشخيص ذكي بالذكاء الاصطناعي",
      description: "احصل على تشخيص دقيق وسريع لمشاكل الأسنان",
      icon: Zap,
      color: "purple",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: 2,
      title: "حجز مواعيد فوري",
      description: "احجز موعدك مع أفضل أطباء الأسنان في منطقتك",
      icon: Calendar,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "استشارة طبية مجانية",
      description: "استشر طبيب أسنان مختص عبر الهاتف أو الفيديو",
      icon: Phone,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      title: "متابعة العلاج",
      description: "تابع خطة علاجك وتلقى تذكيرات المواعيد",
      icon: CheckCircle,
      color: "orange",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  // Test modal functions
  const testBasicModal = () => {
    showAlert(
      "مرحباً بك في Smart",
      <div className="text-center">
        <div className="mb-4">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto" />
        </div>
        <p className="text-gray-600">منصتك الطبية الشاملة لطب الأسنان</p>
      </div>,
    );
  };

  const testConfirmModal = () => {
    showConfirm(
      "تأكيد الحجز",
      <div>
        <p className="mb-4">
          هل أنت متأكد من رغبتك في حجز موعد مع د. أحمد محمد؟
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">غداً - 10:00 صباحاً</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">عيادة الابتسامة الذهبية</span>
          </div>
        </div>
      </div>,
      () => {
        showSuccess(
          "تم تأكيد الحجز",
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p>تم حجز موعدك بنجاح. ستصلك رسالة تأكيد قريباً.</p>
          </div>,
        );
      },
    );
  };

  const testCustomModal = () => {
    openModal({
      type: "custom",
      title: "تفاصيل المنتج",
      size: "lg",
      draggable: true,
      resizable: true,
      content: (
        <div className="space-y-4">
          <div className="flex gap-4">
            <img
              src={testProducts[0].image}
              alt={testProducts[0].name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{testProducts[0].name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(testProducts[0].rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({testProducts[0].reviews} تقييم)
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-purple-600">
                  {testProducts[0].price}
                </span>
                {testProducts[0].originalPrice && (
                  <span className="text-gray-500 line-through">
                    {testProducts[0].originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">المواصفات:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• جودة عالية ومعتمد طبياً</li>
              <li>• ضمان لمدة سنتين</li>
              <li>• شحن مجاني لجميع أنحاء المملكة</li>
              <li>• دعم فني متخصص</li>
            </ul>
          </div>
        </div>
      ),
      buttons: [
        {
          label: "إضافة للسلة",
          variant: "primary",
          onClick: () => {
            showSuccess("تمت الإضافة", "تم إضافة المنتج لسلة التسوق بنجاح");
          },
        },
        {
          label: "إغلاق",
          variant: "secondary",
          onClick: () => {},
        },
      ],
    });
  };

  const testLoadingModal = () => {
    const loadingId = showLoading("جارٍ تحميل البيانات", "يرجى الانتظار...");

    setTimeout(() => {
      showSuccess("تم التحميل", "تم تحميل البيانات بنجاح!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <EnhancedUnifiedHeader
        variant={headerVariant}
        transparent={isTransparent}
        title="صفحة الاختبار"
        subtitle="اختبار جميع المكونات المحسنة"
      />

      <div className="pt-20 p-6">
        {/* Header Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">تحكم في الشريط العلوي</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setHeaderVariant("default")}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  headerVariant === "default"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                )}
              >
                افتراضي
              </button>
              <button
                onClick={() => setHeaderVariant("minimal")}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  headerVariant === "minimal"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                )}
              >
                مبسط
              </button>
              <button
                onClick={() => setHeaderVariant("expanded")}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  headerVariant === "expanded"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                )}
              >
                موسع
              </button>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isTransparent}
                onChange={(e) => setIsTransparent(e.target.checked)}
                className="rounded"
              />
              <span>شفاف</span>
            </label>
          </div>
        </div>

        {/* Modal Tests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">اختبار النوافذ المنبثقة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testBasicModal}
              className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Info className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">نافذة أساسية</div>
            </button>

            <button
              onClick={testConfirmModal}
              className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">نافذة تأكيد</div>
            </button>

            <button
              onClick={testCustomModal}
              className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Package className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">نافذة مخصصة</div>
            </button>

            <button
              onClick={testLoadingModal}
              className="p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">نافذة تحميل</div>
            </button>
          </div>
        </div>

        {/* Test Products Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">بطاقات المنتجات المحسنة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                onClick={testCustomModal}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium text-white rounded-full",
                        {
                          "bg-red-500": product.badgeColor === "red",
                          "bg-green-500": product.badgeColor === "green",
                          "bg-blue-500": product.badgeColor === "blue",
                          "bg-purple-500": product.badgeColor === "purple",
                        },
                      )}
                    >
                      {product.badge}
                    </span>
                  </div>
                  {/* Favorite Button */}
                  <button className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-purple-600">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Services Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">بطاقات الخدمات المحسنة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                {/* Service Header */}
                <div
                  className={cn(
                    "bg-gradient-to-r text-white p-4",
                    service.gradient,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <Award className="w-4 h-4 opacity-70" />
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={cn("w-4 h-4", `text-${service.color}-500`)}
                      />
                      <span className="text-gray-700 text-sm">
                        خدمة احترافية
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={cn("w-4 h-4", `text-${service.color}-500`)}
                      />
                      <span className="text-gray-700 text-sm">متاح 24/7</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={cn(
                      "w-full py-2 rounded-lg font-semibold text-white transition-all text-sm shadow-md",
                      `bg-gradient-to-r ${service.gradient}`,
                      "hover:shadow-lg",
                    )}
                  >
                    ابدأ الخدمة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EnhancedTestPage() {
  return (
    <FloatingModalProvider>
      <TestPageContent />
    </FloatingModalProvider>
  );
}
