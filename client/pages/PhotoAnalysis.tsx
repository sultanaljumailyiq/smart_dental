import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Upload,
  X,
  Eye,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Zap,
  Target,
  Scan,
  FileImage,
  RotateCcw,
  ZoomIn,
  Info,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { VisitorHeader } from "@/components/VisitorHeader";

interface AnalysisResult {
  overall_health: number;
  detected_issues: Array<{
    type: string;
    severity: "low" | "medium" | "high";
    confidence: number;
    description: string;
    location: string;
    recommendation: string;
  }>;
  recommendations: string[];
  next_steps: string[];
}

const sampleAnalysis: AnalysisResult = {
  overall_health: 78,
  detected_issues: [
    {
      type: "تسوس مبكر",
      severity: "medium",
      confidence: 89,
      description: "تم اكتشاف علامات تسوس مبكر في السن العلوي الأيمن",
      location: "السن رقم 14 (الضرس الأول العلوي الأيمن)",
      recommendation: "مراجعة طبيب الأسنان لتنظيف وحشو السن"
    },
    {
      type: "التهاب لثة خفيف",
      severity: "low",
      confidence: 76,
      description: "احمرار طفيف في اللثة يشير إلى التهاب بسيط",
      location: "اللثة حول الأسنان الأمامية السفلية",
      recommendation: "تحسين نظافة الفم واستخدام غسول مطهر"
    }
  ],
  recommendations: [
    "استخدام فرشاة أسنان ناعمة مع معجون يحتوي على الفلورايد",
    "استخدام خيط الأسنان يومياً",
    "غسول الفم المطهر مرتين يومياً",
    "تجنب المشروبات السكرية بين الوجبات",
    "مراجعة طبيب الأسنان خلال أسبوعين"
  ],
  next_steps: [
    "حجز موعد مع طبيب الأسنان",
    "بدء روتين عناية محسن",
    "إعادة التحليل بعد أسبوعين"
  ]
};

export default function PhotoAnalysis() {
  const { language } = useI18n();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    // محاكاة خطوات التحليل
    const steps = [
      "تحضير الصورة للتحليل...",
      "تحديد منطقة الأسنان واللثة...",
      "��حليل الألوان والأنسجة...",
      "البحث عن علامات التسوس...",
      "فحص صحة اللثة...",
      "إنشاء التقرير النهائي..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisStep(i + 1);
    }

    setAnalysisResult(sampleAnalysis);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  const downloadReport = () => {
    console.log("تحميل تقرير التحليل");
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "تقرير تحليل الصور الطبي",
        text: "تحليل صور الأسنان بالذكاء الاصطناعي",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-yellow-600 bg-yellow-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "low": return "خفيف";
      case "medium": return "متوسط";
      case "high": return "شديد";
      default: return "غير محدد";
    }
  };

  return (
    <>
      <VisitorHeader />
      <div className="min-h-screen bg-gray-50 pt-16" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/medical-services"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span>العودة للخدمات الطبية</span>
              </Link>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  تحليل الصور بالذكاء الاصطناعي
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                دقة 92%
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                تحليل صور الأسنان بالذكاء الاصطناعي
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                قم برفع صورة واضحة لأسنانك أو لثتك وسيقوم الذكاء الاصطناعي بتحليلها 
                وتقديم تقرير مفصل عن حالتها الصحية
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">نصائح للحصول على أفضل النتائج</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">إضاءة جيدة</h3>
                  <p className="text-gray-600 text-sm">تأكد من وجود إضاءة كافية وطبيعية</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">تركيز واضح</h3>
                  <p className="text-gray-600 text-sm">تأكد من وضوح الصورة وعدم وجود ضبابية</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ZoomIn className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">زاوية مناسبة</h3>
                  <p className="text-gray-600 text-sm">صور من زاوية تُظهر الأسنان واللثة بوضوح</p>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {!imagePreview ? (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-orange-400 transition-colors">
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Camera className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ارفع صورة للتحليل
                    </h3>
                    <p className="text-gray-600 mb-6">
                      اختر صورة من جهازك أو التقط صورة جديدة
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        رفع من الجهاز
                      </button>
                      
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center gap-2 border border-orange-600 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        التقاط صورة
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                      الصيغ المدعومة: JPG, PNG, HEIC (حد أقصى 10MB)
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Scan className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        جاري تحليل الصورة...
                      </h3>
                      <p className="text-gray-600 mb-6">
                        يرجى الانتظار بينما نحلل صورتك بدقة
                      </p>
                      
                      <div className="max-w-md mx-auto">
                        <div className="bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(analysisStep / 6) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysisStep < 6 ? [
                            "تحضير الصورة للتحليل...",
                            "تحديد منطقة الأسنان واللثة...",
                            "تحليل الألوان والأنسجة...",
                            "البحث عن علامات التسوس...",
                            "فحص صحة اللثة...",
                            "إنشاء التقرير النهائي..."
                          ][analysisStep] : "اكتمل التحليل!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={startAnalysis}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-3 mx-auto"
                      >
                        <Zap className="w-6 h-6" />
                        بدء التحليل الذكي
                      </button>
                      <p className="text-sm text-gray-500 mt-4">
                        سيستغرق التحليل حوالي 30-60 ثانية
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تم إكمال تحليل الصورة
              </h1>
              <p className="text-gray-600">
                إليك تقرير مفصل عن حالة أسنانك الصحية
              </p>
            </div>

            {/* Overall Health Score */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">التقييم العام للصحة</h2>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${analysisResult.overall_health * 2.83} 283`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {analysisResult.overall_health}%
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-600">
                  حالة جيدة مع بعض التحسينات المطلوبة
                </p>
              </div>
            </div>

            {/* Detected Issues */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">المشاكل المكتشفة</h2>
              <div className="space-y-6">
                {analysisResult.detected_issues.map((issue, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {issue.type}
                          </h3>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            getSeverityColor(issue.severity)
                          )}>
                            {getSeverityText(issue.severity)}
                          </span>
                          <span className="text-sm text-gray-500">
                            دقة {issue.confidence}%
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{issue.description}</p>
                        <div className="bg-blue-50 rounded-lg p-4 mb-3">
                          <p className="text-sm text-blue-800">
                            <strong>الموقع:</strong> {issue.location}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-green-800">
                            <strong>التوصية:</strong> {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  التوصيات العلاجية
                </h2>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  الخطوات التالية
                </h2>
                <div className="space-y-4">
                  {analysisResult.next_steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Doctors */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">أطباء موصى بهم</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">د</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        د. أحمد السيد
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        أخصائي علاج الجذور
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.9 (156 تقييم)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>15 سنة خبرة</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>عيادة الأسنان المتطورة - الرياض</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>+966 50 123 4567</span>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        احجز موعد
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">د</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        د. فاطمة النور
                      </h3>
                      <p className="text-green-600 font-medium mb-2">
                        أخصائية طب اللثة
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (89 تقييم)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>12 سنة خبرة</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>مركز الأسنان الشامل - جدة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>+966 55 987 6543</span>
                        </div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        احجز موعد
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadReport}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                تحميل التقرير
              </button>
              <button
                onClick={shareResults}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                مشاركة النتائج
              </button>
              <button
                onClick={resetAnalysis}
                className="flex-1 border border-orange-600 text-orange-600 py-3 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                تحليل صورة جديدة
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">تنبيه مهم</h4>
                  <p className="text-amber-700 text-sm">
                    هذا التحليل الذكي للصور يهدف إلى المساعدة في التشخيص المبدئي فقط ولا يغني عن 
                    الفحص الطبي المباشر. يُرجى مراجعة طبيب أسنان مختص للحصول على تشخيص دقيق وخطة علاج مناسبة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
