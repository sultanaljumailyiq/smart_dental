import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Share2,
  Heart,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings,
  X,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Camera,
  Move3D,
  Rotate3D,
  Box,
  Users,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
  Info,
  BookOpen,
  PlayCircle,
  Mouse,
  Smartphone,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for 3D models
const models3D = [
  {
    id: 1,
    title: "التشريح الكامل للأسنان",
    description:
      "نموذج تفاعلي شامل يظ��ر التركيب التشريحي المفصل لجميع أنواع الأسنان والأنسجة المحيطة بها.",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    category: "تشريح",
    subcategory: "أ��اسيات",
    difficulty: "مبتدئ",
    views: 15620,
    likes: 892,
    downloads: 234,
    rating: 4.8,
    reviewsCount: 156,
    fileSize: "15.2 MB",
    format: "GLB",
    author: {
      name: "د. سارة الأحمد",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
      title: "أستاذ التشريح",
    },
    tags: ["تشريح", "أسنان", "نموذج", "تعليمي"],
    features: [
      "تفاعلي بالكامل",
      "عرض متعدد الطبقات",
      "تسميات تفصيلية",
      "محاكاة ����يقية",
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    license: "Creative Commons",
    compatibility: ["WebGL", "Mobile", "VR"],
    featured: true,
    trending: true,
    premium: false,
  },
  {
    id: 2,
    title: "عملية زراعة الأسنان التفاعلية",
    description:
      "محاكاة ثلاثية الأبعاد متقدمة توضح جميع مراحل عملية زراعة الأسنان من التحضير إلى التركيب النهائي.",
    thumbnail:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop",
    category: "جراحة",
    subcategory: "زراعة الأسنان",
    difficulty: "متقدم",
    views: 12340,
    likes: 567,
    downloads: 189,
    rating: 4.9,
    reviewsCount: 89,
    fileSize: "28.7 MB",
    format: "GLB",
    author: {
      name: "د. محمد العراقي",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      title: "��راح فم وفكين",
    },
    tags: ["زراعة", "جراحة", "محاكاة", "تدريب"],
    features: ["خطوات متسلسلة", "أدوات جراحية", "محاكاة زمنية", "تقييم الأداء"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-18",
    license: "Educational Use",
    compatibility: ["WebGL", "VR", "AR"],
    featured: true,
    trending: false,
    premium: true,
  },
  {
    id: 3,
    title: "أجهزة تقويم ال��سنان المتنوعة",
    description:
      "مجموعة شاملة من النماذج ثلاثية الأبعاد لأجهزة تقويم الأسنان التقليدية والحديثة.",
    thumbnail:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop",
    category: "تقويم",
    subcategory: "أجهزة التقويم",
    difficulty: "متوسط",
    views: 9876,
    likes: 432,
    downloads: 156,
    rating: 4.7,
    reviewsCount: 78,
    fileSize: "12.4 MB",
    format: "GLB",
    author: {
      name: "د. زينب المحمد",
      avatar:
        "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=50&h=50&fit=crop&crop=face",
      title: "أخصائي تقويم الأسنان",
    },
    tags: ["تقويم", "أجهزة", "أسلاك", "تطبيق"],
    features: [
      "��نواع متعددة",
      "مقارنات تفاعلية",
      "شرح الوظائف",
      "حالات تطبيقية",
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-16",
    license: "Open Source",
    compatibility: ["WebGL", "Mobile"],
    featured: false,
    trending: true,
    premium: false,
  },
  {
    id: 4,
    title: "أمراض اللثة وم��احل العلاج",
    description:
      "نماذج تفاعلية توضح تطور أمراض اللثة من الالتهاب الب��يط إلى المراحل المتقدمة وطرق العلاج.",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160549-2173dba999ef?w=400&h=300&fit=crop",
    category: "علاج اللثة",
    subcategory: "أمراض اللثة",
    difficulty: "متوسط",
    views: 8765,
    likes: 398,
    downloads: 123,
    rating: 4.6,
    reviewsCount: 92,
    fileSize: "18.9 MB",
    format: "GLB",
    author: {
      name: "د. أحمد الزهراني",
      avatar:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face",
      title: "أخصائ�� علاج اللثة",
    },
    tags: ["لثة", "أمراض", "علاج", "وقاية"],
    features: ["مراحل تطور المرض", "خيارات العلاج", "قبل وبعد", "نصائح وقائية"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-14",
    license: "Creative Commons",
    compatibility: ["WebGL", "Mobile", "Tablet"],
    featured: false,
    trending: false,
    premium: false,
  },
  {
    id: 5,
    title: "تشريح الأعصاب السنية",
    description:
      "نموذج متخصص يوضح الشبكة العصبية المعقدة داخل الأسنان والفكين بتفاصيل عالية الدقة.",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    category: "تشريح",
    subcategory: "الجهاز العصبي",
    difficulty: "متقدم",
    views: 6543,
    likes: 287,
    downloads: 98,
    rating: 4.9,
    reviewsCount: 45,
    fileSize: "22.1 MB",
    format: "GLB",
    author: {
      name: "د. فاطمة علي",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
      title: "أخصائي علاج العصب",
    },
    tags: ["أعصاب", "تشريح", "علاج العصب", "تخصصي"],
    features: ["دقة عالية", "عرض متدرج", "شرح وظيفي", "حالات مرضية"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
    license: "Academic Use",
    compatibility: ["WebGL", "VR"],
    featured: true,
    trending: false,
    premium: true,
  },
  {
    id: 6,
    title: "محاكي ح��ر الأسنان التفاعلي",
    description:
      "أداة تدريب متقدمة تحاكي عملية حفر الأسنان مع ردود فعل لمسية وبصرية واقعية.",
    thumbnail:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop",
    category: "تدريب",
    subcategory: "محاكاة العمليات",
    difficulty: "متقدم",
    views: 11234,
    likes: 678,
    downloads: 145,
    rating: 4.8,
    reviewsCount: 134,
    fileSize: "35.2 MB",
    format: "GLB",
    author: {
      name: "د. خالد الحسن",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      title: "أستاذ طب الأسنان",
    },
    tags: ["تدريب", "محاكاة", "حفر", "تفاعلي"],
    features: [
      "ردود فعل لمسية",
      "نظام تقييم",
      "سي��اريوهات متنوعة",
      "تتبع التقدم",
    ],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-10",
    license: "Professional Use",
    compatibility: ["WebGL", "VR", "Haptic"],
    featured: true,
    trending: true,
    premium: true,
  },
];

const categories = [
  { id: "all", name: "الكل", count: models3D.length },
  {
    id: "تشريح",
    name: "تشريح",
    count: models3D.filter((m) => m.category === "تشريح").length,
  },
  {
    id: "جراحة",
    name: "��راحة",
    count: models3D.filter((m) => m.category === "جراحة").length,
  },
  {
    id: "تقويم",
    name: "تقويم",
    count: models3D.filter((m) => m.category === "تقويم").length,
  },
  {
    id: "علاج اللثة",
    name: "علاج اللثة",
    count: models3D.filter((m) => m.category === "علاج اللثة").length,
  },
  {
    id: "تدريب",
    name: "تدريب",
    count: models3D.filter((m) => m.category === "تدريب").length,
  },
];

const difficulties = [
  { id: "all", name: "جميع المستويات" },
  { id: "مبتدئ", name: "مبتدئ" },
  { id: "م��وسط", name: "متوسط" },
  { id: "مت��دم", name: "متقدم" },
];

export default function Models3D() {
  const { language } = useI18n();
  const isMobile = useIsMobile();
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [is3DControlsActive, setIs3DControlsActive] = useState(false);
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [modelZoom, setModelZoom] = useState(1);

  const filteredModels = models3D.filter((model) => {
    const matchesCategory =
      selectedCategory === "all" || model.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || model.difficulty === selectedDifficulty;
    const matchesSearch =
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case "popular":
        return b.views - a.views;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "downloads":
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "مبتدئ":
        return "bg-green-100 text-green-600";
      case "متوسط":
        return "bg-yellow-100 text-yellow-600";
      case "متقدم":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const ModelCard = ({ model }: { model: any }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={model.thumbnail}
          alt={model.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <button
          onClick={() => setSelectedModel(model)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              عرض ال��موذج
            </div>
          </div>
        </button>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {model.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              مميز
            </span>
          )}
          {model.trending && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              رائج
            </span>
          )}
          {model.premium && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="w-3 h-3" />
              مميز
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getDifficultyColor(model.difficulty),
            )}
          >
            {model.difficulty}
          </span>
          <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
            {model.format} • {model.fileSize}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
            {model.category}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-xs">{model.subcategory}</span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {model.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {model.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={model.author.avatar}
            alt={model.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {model.author.name}
            </p>
            <p className="text-xs text-gray-600">{model.author.title}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(model.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {model.rating}
          </span>
          <span className="text-sm text-gray-600">({model.reviewsCount})</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {model.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {model.likes}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {model.downloads}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {model.features
              .slice(0, 2)
              .map((feature: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
            {model.features.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{model.features.length - 2} المزيد
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedModel(model)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            عرض تفاعلي
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const Model3DViewer = () =>
    selectedModel && (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full h-full sm:w-[95vw] sm:h-[95vh] sm:max-w-6xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedModel.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedModel.category} • {selectedModel.difficulty}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedModel(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[calc(100%-80px)]">
            {/* 3D Viewer */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
              {/* 3D Model Display Area */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <Box className="w-16 h-16 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    عارض النماذج ثلاثية الأبعاد
                  </h4>
                  <p className="text-gray-600 mb-4">
                    النموذج: {selectedModel.title}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Mouse className="w-4 h-4" />
                    <span>استخدم الماوس للتحكم</span>
                    <span>•</span>
                    <Smartphone className="w-4 h-4" />
                    <span>اللمس للهاتف</span>
                  </div>
                </div>
              </div>

              {/* 3D Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      className="hover:scale-110 transition-transform"
                      onClick={() => setModelRotation({ x: 0, y: 0, z: 0 })}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <Move3D className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <Rotate3D className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={cn(
                "bg-white border-l border-gray-200 overflow-y-auto",
                isMobile ? "w-full absolute inset-0 top-[80px]" : "w-80",
              )}
            >
              <div className="p-4 space-y-6">
                {/* Model Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    معلومات النموذج
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-medium">
                        {selectedModel.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التصنيف الفرعي:</span>
                      <span className="font-medium">
                        {selectedModel.subcategory}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المستوى:</span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getDifficultyColor(selectedModel.difficulty),
                        )}
                      >
                        {selectedModel.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حجم الملف:</span>
                      <span className="font-medium">
                        {selectedModel.fileSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التنسيق:</span>
                      <span className="font-medium">
                        {selectedModel.format}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الترخيص:</span>
                      <span className="font-medium">
                        {selectedModel.license}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">الوصف</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedModel.description}
                  </p>
                </div>

                {/* Author */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">المؤلف</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedModel.author.avatar}
                      alt={selectedModel.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedModel.author.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedModel.author.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">المميزات</h4>
                  <div className="space-y-2">
                    {selectedModel.features.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Compatibility */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">التوافق</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.compatibility.map(
                      (tech: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">العلامات</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    الإحصائيات
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedModel.views.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">مشاهدة</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedModel.likes}
                      </div>
                      <div className="text-xs text-gray-600">إعجاب</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedModel.downloads}
                      </div>
                      <div className="text-xs text-gray-600">تحميل</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedModel.rating}
                      </div>
                      <div className="text-xs text-gray-600">تقييم</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    تحميل النموذج
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    مشاركة النموذج
                  </button>
                  <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium">
                    إضافة للمفضلة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gray-50 with-floating-nav"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  مكتبة النماذج ثلاثية الأبعاد
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isMobile && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في النماذج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <Link
                to="/education"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                العودة للتعليم
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Search */}
        {isMobile && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في النماذج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Stats and Info */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-6 sm:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                استكشف النماذج ثلاثية الأبعاد
              </h1>
              <p className="text-lg mb-6 opacity-90">
                مجموعة شاملة من النماذج ��لتفاعلية ثلاثية الأبعاد لتعلم طب
                الأسنان بطريقة ت��اعلية ومبتكرة.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{models3D.length}</div>
                  <div className="text-sm opacity-90">نموذج</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {categories.length - 1}
                  </div>
                  <div className="text-sm opacity-90">فئة</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {models3D.filter((m) => m.featured).length}
                  </div>
                  <div className="text-sm opacity-90">مميز</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {models3D.filter((m) => m.premium).length}
                  </div>
                  <div className="text-sm opacity-90">احترا��ي</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Monitor className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">متوافق مع الويب</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Smartphone className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">دعم الهاتف</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Box className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">تفاعل كامل</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Download className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">قابل للتحميل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  المرشحات:
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {showFilters ? "إخفاء" : "إظهار"} الم��شحات
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="featured">المميز</option>
                <option value="trending">الرائج</option>
                <option value="popular">الأكثر مشاهدة</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="newest">الأحدث</option>
                <option value="downloads">الأكثر تحميلاً</option>
              </select>

              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3X3 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className={cn("space-y-4", !showFilters && "hidden md:block")}>
            {/* Categories */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                التصنيف:
              </span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedCategory === category.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                المستوى:
              </span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedDifficulty === difficulty.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {difficulty.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              النماذج المتاحة
            </h2>
            <span className="text-sm text-gray-600">
              {sortedModels.length} نموذج
            </span>
          </div>
        </div>

        {/* Models Grid */}
        <div
          className={cn(
            "grid gap-6 mb-8",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {sortedModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {/* Empty State */}
        {sortedModels.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد نماذج
            </h3>
            <p className="text-gray-600">جرب تغيير المرشحات أو كلمات البحث</p>
          </div>
        )}
      </div>

      {/* 3D Model Viewer */}
      <Model3DViewer />


      {/* Bottom padding for mobile */}
      {isMobile && <div className="h-20"></div>}
    </div>
  );
}
