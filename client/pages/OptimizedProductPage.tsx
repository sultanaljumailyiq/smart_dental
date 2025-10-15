import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ArrowRight,
  Package,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

// Sample product data
const productData = {
  id: 1,
  name: "Premium Ceramic Brackets",
  arabicName: "حاصرات السيراميك المتميزة",
  price: 1200000,
  originalPrice: 1500000,
  images: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=600&fit=crop",
  ],
  rating: 4.9,
  reviewCount: 145,
  category: "تقويم أسنان",
  brand: "OrthoElite",
  description:
    "حاصرات سيراميك عالية الجودة مصممة خصيصاً لتقويم الأسنان بطريقة آمنة وفعالة. توفر راحة استثنائية ونتائج مثالية.",
  features: [
    "مصنوعة من السيراميك عالي الجودة",
    "مقاومة للكسر والتآكل",
    "سهلة التنظيف والصيانة",
    "متوافقة مع جميع أنواع الأسلاك",
  ],
  inStock: true,
  stockCount: 25,
  discount: 20,
  shippingInfo: "توصيل مجاني للطلبات أكثر من 500,000 د.ع",
  warranty: "ضمان سنة واحدة",
};

export default function OptimizedProductPage() {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { addItem: addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    const cartItem = {
      id: productData.id.toString(),
      name: productData.name,
      arabicName: productData.arabicName,
      price: productData.price,
      originalPrice: productData.originalPrice,
      image: productData.images[0],
      category: productData.category,
      brand: productData.brand,
      supplier: productData.brand,
      inStock: productData.inStock || true,
      maxQuantity: 99,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === productData.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? productData.images.length - 1 : prev - 1,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:mb-0 mb-20" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/dental-supply" className="hover:text-blue-600">
            المتجر
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to="/dental-supply/categories" className="hover:text-blue-600">
            {productData.category}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 truncate">
            {productData.arabicName}
          </span>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={productData.images[selectedImageIndex]}
                alt={productData.arabicName}
                className="w-full aspect-square object-cover"
              />

              {/* Navigation Arrows */}
              {productData.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {productData.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{productData.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200",
                  )}
                >
                  <img
                    src={image}
                    alt={`${productData.arabicName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-600 font-medium">
                  {productData.brand}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {productData.category}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {productData.arabicName}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(productData.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productData.rating} ({productData.reviewCount} تقييم)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {productData.price.toLocaleString()} د.ع
                  </div>
                  {productData.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">
                      {productData.originalPrice.toLocaleString()} د.ع
                    </div>
                  )}
                </div>
                {productData.discount && (
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-lg">
                      وفر{" "}
                      {(
                        (productData.originalPrice! - productData.price) /
                        1000
                      ).toFixed(0)}
                      k
                    </div>
                    <div className="text-sm text-gray-600">
                      خصم {productData.discount}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  الكمية:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  ({productData.stockCount} متوفر)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart(productData.id.toString()) ? "في السلة" : "أضف للسلة"}
                </button>

                <button
                  onClick={() => toggleFavorite({
                    id: productData.id.toString(),
                    name: productData.name,
                    arabicName: productData.arabicName,
                    price: productData.price,
                    originalPrice: productData.originalPrice,
                    image: productData.images[0],
                    category: productData.category,
                    brand: productData.brand,
                    rating: productData.rating,
                    supplier: productData.brand,
                    addedDate: new Date().toISOString(),
                  })}
                  className={cn(
                    "p-3 rounded-xl transition-colors flex items-center justify-center",
                    isFavorite(productData.id.toString())
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500",
                  )}
                >
                  <Heart className="w-5 h-5" />
                </button>

                <button className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">توصيل سريع</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">
                  {productData.warranty}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">جودة مضمونة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details - Simplified for Mobile */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">وصف المنتج</h3>
          <p
            className={cn(
              "text-gray-600 leading-relaxed",
              !showFullDescription && "line-clamp-3",
            )}
          >
            {productData.description}
          </p>

          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showFullDescription ? "عرض أقل" : "عرض المزيد"}
          </button>

          {showFullDescription && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                الميزات الرئيسية:
              </h4>
              <ul className="space-y-2">
                {productData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
