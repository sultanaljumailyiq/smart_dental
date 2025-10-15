import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  Award,
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Download,
  CheckCircle,
  Lock,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock course data - will be replaced with API
const getCourseById = (id: string) => ({
  id: parseInt(id),
  title: "دورة تقويم الأسنان الشاملة",
  arabicTitle: "دورة تقويم الأسنان الشاملة",
  description: "دورة متقدمة في تقويم الأسنان تغطي جميع الجوانب النظرية والعملية للتقويم الحديث",
  fullDescription: "هذه الدورة الشاملة تقدم لك كل ما تحتاج معرفته عن تقويم الأسنان الحديث. ستتعلم من خبراء متخصصين وستحصل على شهادة معتمدة بعد اجتياز الاختبار النهائي.",
  image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
  thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
  instructor: {
    id: 1,
    name: "د. أحمد السعيد",
    arabicName: "د. أحمد السعيد",
    title: "استشاري تقويم الأسنان",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
    verified: true,
    bio: "خبرة 20 سنة في تقويم الأسنان والتجميل",
    students: 1250,
    courses: 8,
    rating: 4.9,
  },
  level: "متوسط",
  duration: "12 أسبوع",
  hours: 48,
  language: "العربية",
  certificate: true,
  isPaid: true,
  price: 150000,
  currency: "IQD",
  originalPrice: 200000,
  discount: 25,
  students: 487,
  rating: 4.8,
  reviews: 156,
  lastUpdated: "2024-10-01",
  includes: [
    "48 ساعة فيديو حسب الطلب",
    "25 مقالة تعليمية",
    "15 ملف قابل للتحميل",
    "وصول كامل مدى الحياة",
    "شهادة إتمام معتمدة",
    "ضمان استرداد المال لمدة 30 يوم",
  ],
  requirements: [
    "معرفة أساسية بطب الأسنان",
    "رخصة مزاولة مهنة طب الأسنان",
    "حاسوب مع اتصال بالإنترنت",
  ],
  learningOutcomes: [
    "فهم شامل لأساسيات تقويم الأسنان",
    "تشخيص حالات تقويم الأسنان المختلفة",
    "وضع خطط علاجية متقدمة",
    "استخدام التقنيات الحديثة في التقويم",
  ],
  curriculum: [
    {
      id: 1,
      title: "مقدمة في تقويم الأسنان",
      duration: "2 ساعة",
      lessons: 5,
      isUnlocked: true,
      items: [
        { type: "video", title: "ما هو تقويم الأسنان؟", duration: "15:30", isUnlocked: true },
        { type: "video", title: "تاريخ تقويم الأسنان", duration: "20:15", isUnlocked: true },
        { type: "article", title: "أنواع التقويم", duration: "10 دقائق", isUnlocked: true },
        { type: "quiz", title: "اختبار الوحدة الأولى", duration: "15 دقيقة", isUnlocked: true },
        { type: "download", title: "ملف PDF - مقدمة في التقويم", duration: "-", isUnlocked: true },
      ],
    },
    {
      id: 2,
      title: "التشخيص والتخطيط",
      duration: "4 ساعات",
      lessons: 8,
      isUnlocked: false,
      items: [
        { type: "video", title: "طرق التشخيص", duration: "25:00", isUnlocked: false },
        { type: "video", title: "قراءة الأشعة", duration: "30:00", isUnlocked: false },
        { type: "video", title: "وضع خطة العلاج", duration: "35:00", isUnlocked: false },
        { type: "article", title: "دراسة حالات", duration: "20 دقيقة", isUnlocked: false },
        { type: "quiz", title: "اختبار التشخيص", duration: "20 دقيقة", isUnlocked: false },
      ],
    },
    {
      id: 3,
      title: "التقنيات الحديثة",
      duration: "6 ساعات",
      lessons: 10,
      isUnlocked: false,
      items: [
        { type: "video", title: "التقويم الشفاف", duration: "40:00", isUnlocked: false },
        { type: "video", title: "التقويم الداخلي", duration: "35:00", isUnlocked: false },
        { type: "video", title: "التقويم السريع", duration: "30:00", isUnlocked: false },
      ],
    },
  ],
  tags: ["تقويم الأسنان", "تخصص", "شهادة معتمدة", "CME"],
});

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1]));

  if (!id) {
    return <div>Course ID not found</div>;
  }

  const course = getCourseById(id);

  const handleEnroll = () => {
    setIsEnrolled(true);
    toast.success("تم التسجيل في الدورة بنجاح!");
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "تم إلغاء الحفظ" : "تم حفظ الدورة");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("تم نسخ الرابط");
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons, 0);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "p-2 rounded-full transition-colors",
                isFavorited ? "bg-red-50 text-red-600" : "hover:bg-gray-100"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-red-600")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                {course.certificate && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    شهادة معتمدة
                  </span>
                )}
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {course.language}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.arabicTitle}
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating}</span>
                  <span>({course.reviews} تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students} طالب</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.hours} ساعة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>آخر تحديث: {new Date(course.lastUpdated).toLocaleDateString('ar-IQ')}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="mt-6 pt-6 border-t flex items-center gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.arabicName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{course.instructor.arabicName}</h3>
                    {course.instructor.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{course.instructor.title}</p>
                  <p className="text-gray-500 text-sm">
                    {course.instructor.students} طالب • {course.instructor.courses} دورات
                  </p>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                ماذا ستتعلم
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                محتوى الدورة
              </h2>
              <p className="text-gray-600 mb-4">
                {course.curriculum.length} أقسام • {totalLessons} درس • {course.hours} ساعة إجمالي
              </p>
              
              <div className="space-y-2">
                {course.curriculum.map((section) => (
                  <div key={section.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                        <div className="text-right">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">
                            {section.lessons} دروس • {section.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {expandedSections.has(section.id) && (
                      <div className="border-t bg-gray-50">
                        {section.items.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 flex items-center justify-between hover:bg-white transition-colors border-b last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {item.type === 'video' && <Play className="w-4 h-4 text-gray-600" />}
                              {item.type === 'article' && <FileText className="w-4 h-4 text-gray-600" />}
                              {item.type === 'quiz' && <CheckCircle className="w-4 h-4 text-gray-600" />}
                              {item.type === 'download' && <Download className="w-4 h-4 text-gray-600" />}
                              
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.duration}</p>
                              </div>
                            </div>
                            {!item.isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">المتطلبات</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg sticky top-24">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.arabicTitle}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                </button>
              </div>

              <div className="p-6">
                {/* Price */}
                {course.isPaid && (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {course.price.toLocaleString()} <span className="text-lg">{course.currency}</span>
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {course.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                      خصم {course.discount}%
                    </div>
                  </div>
                )}

                {/* Enroll Button */}
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all mb-4"
                  >
                    سجل الآن
                  </button>
                ) : (
                  <div className="mb-4">
                    <div className="p-4 bg-green-50 rounded-xl flex items-center gap-2 justify-center text-green-700 font-semibold mb-3">
                      <CheckCircle className="w-5 h-5" />
                      أنت مسجل في هذه الدورة
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      ابدأ التعلم
                    </button>
                  </div>
                )}

                <p className="text-center text-sm text-gray-500 mb-4">
                  ضمان استرداد المال لمدة 30 يوم
                </p>

                {/* Includes */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold text-gray-900">تتضمن هذه الدورة:</h4>
                  {course.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">دورات مشابهة</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                to={`/community/course/${i + 1}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400`}
                  alt="Course"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    دورة زراعة الأسنان المتقدمة
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Users className="w-4 h-4" />
                    <span>350 طالب</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">4.7</span>
                    </div>
                    <span className="font-bold text-blue-600">120,000 IQD</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
