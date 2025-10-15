import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ArrowRight,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Award,
  CheckCircle,
  Eye,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import CategoryProductsStrip from "@/components/CategoryProductsStrip";

// بيانات المنتج التفصيلي��
const productDetails = {
  id: 1,
  name: "Pro Ⅱ Composite Resin",
  arabicName: "راتنج مركب برو 2",
  price: 385000,
  originalPrice: 450000,
  images: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop",
  ],
  rating: 4.9,
  reviewCount: 324,
  category: "مواد حشو",
  brand: "DentalTech",
  sku: "DT-CR-PRO2-001",
  discount: 15,
  inStock: true,
  stockCount: 45,
  description:
    "راتنج مركب عالي الجودة للحشوات التجميلية يتميز بقوة عالية ومقاومة للتآكل. مصمم خصيصاً للاستخدام في الأسنان الأمامية والخلفية مع نتائج تجميلية ممتازة.",
  features: [
    "مقاوم للبقع والتلوث",
    "سهل التشكيل والنحت",
    "مطابق للون الطبيعي للأسنان",
    "مقاوم للتآكل والكسر",
    "تصلب سريع تحت الضوء",
    "آمن وغير سام",
  ],
  specifications: [
    { name: "المادة", value: "راتنج مركب نانو هايبرد" },
    { name: "الحجم", value: "4 جرام" },
    { name: "اللون", value: "A2, A3, B1, C2" },
    { name: "وقت التصلب", value: "20 ثانية" },
    { name: "قوة الضغط", value: "350 ميجا باسكال" },
    { name: "مدة الصلاحية", value: "3 سنوات" },
  ],
  shipping: {
    freeShipping: true,
    estimatedDays: "2-3 أيام عمل",
    regions: "متوفر في جميع أنحاء العراق",
  },
  warranty: "ضمان لمدة سنتين ضد عيوب التصنيع",
  seller: {
    name: "شر��ة حلول الأسنان التقنية",
    rating: 4.8,
    verified: true,
  },
};

// منتجات مقترحة
const suggestedProducts = [
  {
    id: 2,
    name: "Bonding Agent",
    arabicName: "مادة الربط",
    price: 125000,
    originalPrice: 150000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    brand: "DentalTech",
    discount: 17,
  },
  {
    id: 3,
    name: "Curing Light",
    arabicName: "ضوء المعالجة",
    price: 890000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    brand: "LightCure",
  },
  {
    id: 4,
    name: "Polishing Kit",
    arabicName: "طقم التلميع",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 203,
    brand: "PolishPro",
  },
];

// مراجعات العملاء
const reviews = [
  {
    id: 1,
    user: "د. أحمد محمد",
    rating: 5,
    date: "منذ أسبوعين",
    comment: "منتج ممتاز، سهل الاستخدام ونتائج رائعة. أنصح به بشدة.",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    user: "د. فاطمة علي",
    rating: 5,
    date: "منذ شهر",
    comment: "جودة عالية جداً ومطابق تماماً للوصف. التوصيل كان سريع.",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    user: "د. خالد حسين",
    rating: 4,
    date: "منذ شهرين",
    comment: "منتج جيد ولكن السعر مرتفع قليلاً. الجودة تستحق.",
    verified: true,
    helpful: 5,
  },
];

export default function ProductDetail() {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { addItem: addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    const cartItem = {
      id: productDetails.id.toString(),
      name: productDetails.name,
      arabicName: productDetails.arabicName,
      price: productDetails.price,
      originalPrice: productDetails.originalPrice,
      image: productDetails.images[0],
      category: productDetails.category,
      brand: productDetails.brand,
      supplier: productDetails.seller?.name || '',
      inStock: productDetails.inStock,
      maxQuantity: 99,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Link
      to={`/dental-supply/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
          {product.arabicName}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {product.price.toLocaleString()} د.ع
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.originalPrice.toLocaleString()} د.ع
              </span>
            )}
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-6" dir="rtl">
      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4 lg:mb-6">
        <Link to="/dental-supply" className="hover:text-blue-600">
          الرئيسية
        </Link>
        <ArrowRight className="w-4 h-4 rotate-180" />
        <Link to="/dental-supply/products" className="hover:text-blue-600">
          المنتجات
        </Link>
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-gray-900">{productDetails.arabicName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 mb-6 md:mb-8 lg:mb-12">
        {/* Product Images */}
        <div className="space-y-2 md:space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg md:rounded-2xl overflow-hidden relative">
            <img
              src={productDetails.images[selectedImage]}
              alt={productDetails.arabicName}
              className="w-full h-full object-cover"
            />
            {productDetails.discount && (
              <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-500 text-white px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-sm font-bold">
                -{productDetails.discount}%
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1 md:gap-2">
            {productDetails.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200",
                )}
              >
                <img
                  src={image}
                  alt={`${productDetails.arabicName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 md:space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                {productDetails.category}
              </span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-600 text-sm md:text-base font-medium">
                {productDetails.brand}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              {productDetails.arabicName}
            </h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg hidden md:block">
              {productDetails.name}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4 md:w-5 md:h-5",
                    i < Math.floor(productDetails.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="text-sm md:text-lg font-medium">
              {productDetails.rating}
            </span>
            <span className="text-gray-600 text-sm md:text-base">
              ({productDetails.reviewCount} تقييم)
            </span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3 md:mb-4">
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                {productDetails.price.toLocaleString()} د.ع
              </span>
              <div className="flex items-center gap-2">
                {productDetails.originalPrice && (
                  <span className="text-sm md:text-lg lg:text-xl text-gray-500 line-through">
                    {productDetails.originalPrice.toLocaleString()} د.ع
                  </span>
                )}
                {productDetails.discount && (
                  <span className="bg-green-100 text-green-600 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
                    وفر{" "}
                    {(
                      (productDetails.originalPrice - productDetails.price) /
                      1000
                    ).toFixed(0)}
                    K د.ع
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              <span className="text-green-600 text-sm md:text-base font-medium">
                متوفر في المخزن
              </span>
              <span className="text-gray-500 text-xs md:text-sm">
                ({productDetails.stockCount} قطعة متبقية)
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 md:p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <span className="px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 md:p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">إضافة إلى السلة</span>
                <span className="md:hidden">إضافة</span>
              </button>

              <button
                onClick={() => toggleFavorite({
                  id: productDetails.id.toString(),
                  name: productDetails.name,
                  arabicName: productDetails.arabicName,
                  price: productDetails.price,
                  originalPrice: productDetails.originalPrice,
                  image: productDetails.images[0],
                  category: productDetails.category,
                  brand: productDetails.brand,
                  rating: productDetails.rating,
                  supplier: productDetails.seller?.name || '',
                  addedDate: new Date().toISOString(),
                })}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  isFavorite(productDetails.id.toString())
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600",
                )}
              >
                <Heart className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-1 md:gap-4 text-center">
              <div className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 bg-white rounded-lg">
                <Truck className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                <span className="text-xs md:text-sm font-medium">
                  شحن مجاني
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 bg-white rounded-lg">
                <Shield className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                <span className="text-xs md:text-sm font-medium">
                  ضمان شامل
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 bg-white rounded-lg">
                <RotateCcw className="w-4 h-4 md:w-6 md:h-6 text-purple-500" />
                <span className="text-xs md:text-sm font-medium">
                  إرجاع مجاني
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-6 md:mb-8 lg:mb-12">
        <div className="border-b border-gray-200 mb-3 md:mb-6">
          <div className="flex gap-2 md:gap-4 lg:gap-8 overflow-x-auto">
            {[
              { id: "description", label: "الوصف" },
              { id: "specifications", label: "المواصفات" },
              { id: "reviews", label: "التقييمات" },
              { id: "shipping", label: "الشحن" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 md:pb-4 px-1 md:px-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-600",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 shadow-sm border">
          {activeTab === "description" && (
            <div className="space-y-3 md:space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">
                  وصف المنتج
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">
                  {productDetails.description}
                </p>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold mb-2 md:mb-3">
                  المميزات الرئيسية
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                  {productDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm md:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">
                المواصفات التقنية
              </h3>
              <div className="grid grid-cols-1 gap-2 md:gap-4">
                {productDetails.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 text-sm md:text-base">
                      {spec.name}
                    </span>
                    <span className="text-gray-700 text-sm md:text-base">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">تقييمات العملاء</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  اكتب تقييماً
                </button>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            مشتري موثق
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>مفيد ({review.helpful})</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>رد</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">معلومات الشحن والضمان</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">الشحن والتوصيل</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-500" />
                      <span>شحن مجاني على جميع الطلبات</span>
                    </div>
                    <p className="text-gray-600">
                      مدة التوصيل: {productDetails.shipping.estimatedDays}
                    </p>
                    <p className="text-gray-600">
                      المناطق: {productDetails.shipping.regions}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg">الضمان والإرجاع</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span>{productDetails.warranty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-purple-500" />
                      <span>إرجاع مجاني خلال 14 يوم</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products from Same Category */}
      <CategoryProductsStrip
        categoryName={productDetails.category}
        excludeProductId={productDetails.id}
        title={`منتجات أخرى من فئة ${productDetails.category}`}
      />

      {/* Suggested Products */}
      <div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 md:mb-6">
          منتجات مقترحة
        </h2>
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {suggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-2 px-1">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-40">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
