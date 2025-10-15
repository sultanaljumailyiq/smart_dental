import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Activity,
  Stethoscope,
  MapPin,
  Star,
  Phone,
  Navigation,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VisitorHeader } from "@/components/VisitorHeader";
import {
  PRIMARY_SYMPTOMS,
  AGE_RANGES,
  GENDER_OPTIONS,
  MEDICAL_CONDITIONS,
  DIAGNOSTIC_FLOW,
  type DiagnosticQuestion
} from "@/data/smartDiagnosisData";
import { calculateDiagnosis, getSeverityColor, type DiagnosisResult } from "@/utils/smartDiagnosisAlgorithm";

// مكون بطاقة العرَض - Symptom Card Component
const SymptomCard = ({ symptom, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-right p-6 rounded-2xl transition-all duration-300 hover:scale-105",
      selected
        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl"
        : "bg-white border-2 border-gray-200 hover:border-blue-300"
    )}
  >
    <div className="flex items-center justify-between mb-3">
      <ArrowRight className={cn("w-6 h-6", selected ? "text-white" : "text-blue-500")} />
      <h3 className="text-xl font-bold">{symptom.arabicLabel}</h3>
    </div>
    <p className={cn("text-sm", selected ? "text-blue-100" : "text-gray-600")}>
      {symptom.arabicDescription}
    </p>
  </button>
);

// مكون شريط التقدم - Progress Bar Component
const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// مكون بطاقة العيادة القريبة - Nearby Clinic Card
const ClinicCard = ({ clinic }: { clinic: any }) => (
  <div className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-bold text-lg text-gray-900 mb-1">{clinic.name}</h4>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {clinic.location}
        </p>
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold text-yellow-700">{clinic.rating}</span>
      </div>
    </div>
    
    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {clinic.distance}
      </span>
      <span className="flex items-center gap-1">
        <Phone className="w-4 h-4" />
        {clinic.phone}
      </span>
    </div>

    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={() => window.open(`https://maps.google.com/?q=${clinic.name}`, '_blank')}
      >
        <Navigation className="w-4 h-4 ml-2" />
        اتجاهات
      </Button>
      <Button 
        size="sm" 
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
        onClick={() => window.location.href = `/clinic-booking/${clinic.id}`}
      >
        <Calendar className="w-4 h-4 ml-2" />
        احجز الآن
      </Button>
    </div>
  </div>
);

export default function SmartDiagnosisEnhanced() {
  const navigate = useNavigate();
  
  // حالات المكون - Component States
  const [step, setStep] = useState<"welcome" | "demographics" | "symptoms" | "questions" | "results">("welcome");
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [nearbyClinics, setNearbyClinics] = useState<any[]>([]);

  // الأسئلة الحالية بناءً على العرَض المختار
  const currentQuestions = selectedSymptom ? DIAGNOSTIC_FLOW[selectedSymptom] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // دالة للانتقال للخطوة التالية
  const handleNext = () => {
    if (step === "welcome") {
      setStep("demographics");
    } else if (step === "demographics") {
      if (!age || !gender) {
        toast.error("الرجاء إكمال جميع المعلومات الأساسية");
        return;
      }
      setStep("symptoms");
    } else if (step === "symptoms") {
      if (!selectedSymptom) {
        toast.error("الرجاء اختيار العرَض الرئيسي");
        return;
      }
      setStep("questions");
    }
  };

  // دالة للإجابة على السؤال والانتقال للتالي
  const handleAnswerQuestion = (answer: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // انتهت الأسئلة - احسب التشخيص
      const finalAnswers = { ...answers, [currentQuestion.id]: answer };
      const result = calculateDiagnosis(selectedSymptom!, finalAnswers, medicalConditions, age);
      setDiagnosis(result);
      loadNearbyClinics(result.specialtyNeededArabic);
      setStep("results");
    }
  };

  // دالة تحميل العيادات القريبة
  const loadNearbyClinics = async (specialty: string) => {
    // محاكاة تحميل العيادات العراقية القريبة
    const mockClinics = [
      {
        id: 1,
        name: "عيادة النخبة للأسنان",
        location: "الكرادة، بغداد",
        distance: "2.3 كم",
        rating: "4.8",
        phone: "07701234567",
        specialty: specialty
      },
      {
        id: 2,
        name: "مركز بغداد التخصصي",
        location: "المنصور، بغداد",
        distance: "3.1 كم",
        rating: "4.7",
        phone: "07707654321",
        specialty: specialty
      },
      {
        id: 3,
        name: "عيادة الرافدين المتقدمة",
        location: "الجادرية، بغداد",
        distance: "4.5 كم",
        rating: "4.9",
        phone: "07801112233",
        specialty: specialty
      }
    ];
    setNearbyClinics(mockClinics);
  };

  // دالة الرجوع للخلف
  const handleBack = () => {
    if (step === "demographics") {
      setStep("welcome");
    } else if (step === "symptoms") {
      setStep("demographics");
    } else if (step === "questions") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        setStep("symptoms");
      }
    }
  };

  // التبديل للحالات الصحية
  const toggleMedicalCondition = (condition: string) => {
    if (medicalConditions.includes(condition)) {
      setMedicalConditions(medicalConditions.filter(c => c !== condition));
    } else {
      setMedicalConditions([...medicalConditions, condition]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <VisitorHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* شاشة الترحيب - Welcome Screen */}
        {step === "welcome" && (
          <div className="text-center animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                <Brain className="w-32 h-32 text-blue-600 relative" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              التشخيص الذكي بالذكاء الاصطناعي
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              نظام تشخيص طبي ذكي متقدم يحلل أعراضك ويوفر لك توصيات دقيقة<br />
              مبني على خوارزميات طبية معتمدة
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Activity, title: "تحليل ذكي", desc: "خوارزمية طبية متقدمة" },
                { icon: Target, title: "تشخيص دقيق", desc: "نتائج موثوقة ومفصلة" },
                { icon: MapPin, title: "عيادات قريبة", desc: "ربط مباشر بنظام الحجز" }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-12 py-6 rounded-xl"
              onClick={handleNext}
            >
              ابدأ التشخيص الآن
              <ArrowLeft className="mr-3 w-6 h-6" />
            </Button>

            <p className="mt-6 text-sm text-gray-500">
              <Info className="w-4 h-4 inline ml-1" />
              هذا النظام للإرشاد فقط - استشر طبيب أسنان للتشخيص النهائي
            </p>
          </div>
        )}

        {/* شاشة المعلومات الأساسية - Demographics Screen */}
        {step === "demographics" && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-right">المعلومات الأساسية</h2>
            
            <div className="space-y-6">
              {/* الفئة العمرية */}
              <div>
                <label className="block text-lg font-semibold mb-3 text-right">الفئة العمرية</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AGE_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setAge(range)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        age === range
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* الجنس */}
              <div>
                <label className="block text-lg font-semibold mb-3 text-right">الجنس</label>
                <div className="grid grid-cols-3 gap-3">
                  {GENDER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setGender(option)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        gender === option
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* الحالات الصحية */}
              <div>
                <label className="block text-lg font-semibold mb-3 text-right">
                  الحالات الصحية العامة (اختر ما ينطبق)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {MEDICAL_CONDITIONS.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => toggleMedicalCondition(condition)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-right",
                        medicalConditions.includes(condition)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
                <ArrowRight className="ml-2" />
                رجوع
              </Button>
              <Button size="lg" onClick={handleNext} className="flex-1 bg-blue-600">
                التالي
                <ArrowLeft className="mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* شاشة اختيار العرَض - Symptoms Screen */}
        {step === "symptoms" && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-right">ما هي المشكلة الرئيسية؟</h2>
            <p className="text-gray-600 mb-8 text-right">اختر العرَض الذي يصف مشكلتك بشكل أفضل</p>
            
            <div className="grid gap-4 mb-8">
              {PRIMARY_SYMPTOMS.map((symptom) => (
                <SymptomCard
                  key={symptom.id}
                  symptom={symptom}
                  selected={selectedSymptom === symptom.id}
                  onClick={() => setSelectedSymptom(symptom.id)}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
                <ArrowRight className="ml-2" />
                رجوع
              </Button>
              <Button size="lg" onClick={handleNext} className="flex-1 bg-blue-600">
                التالي
                <ArrowLeft className="mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* شاشة الأسئلة - Questions Screen */}
        {step === "questions" && currentQuestion && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <ProgressBar current={currentQuestionIndex + 1} total={currentQuestions.length} />
            
            <div className="mb-6 text-center">
              <span className="text-sm text-gray-500">
                السؤال {currentQuestionIndex + 1} من {currentQuestions.length}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-8 text-right">
              {currentQuestion.arabicQuestion}
            </h2>

            <div className="space-y-3">
              {currentQuestion.type === "radio" ? (
                currentQuestion.arabicOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerQuestion(option)}
                    className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-right font-medium"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <>
                  {currentQuestion.arabicOptions.map((option, index) => {
                    const selected = (answers[currentQuestion.id] as string[] || []).includes(option);
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const current = (answers[currentQuestion.id] as string[]) || [];
                          const updated = selected
                            ? current.filter(o => o !== option)
                            : [...current, option];
                          setAnswers({ ...answers, [currentQuestion.id]: updated });
                        }}
                        className={cn(
                          "w-full p-5 rounded-xl border-2 transition-all text-right font-medium",
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                  
                  <Button
                    size="lg"
                    className="w-full mt-4 bg-blue-600"
                    onClick={() => handleAnswerQuestion(answers[currentQuestion.id] || [])}
                    disabled={!(answers[currentQuestion.id] as string[])?.length}
                  >
                    التالي
                    <ArrowLeft className="mr-2" />
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="w-full mt-4"
            >
              <ArrowRight className="ml-2" />
              رجوع
            </Button>
          </div>
        )}

        {/* شاشة النتائج - Results Screen */}
        {step === "results" && diagnosis && (
          <div className="space-y-6 animate-fade-in">
            {/* نتيجة التشخيص */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("p-4 rounded-2xl", getSeverityColor(diagnosis.severity))}>
                  {diagnosis.severity === "emergency" || diagnosis.severity === "severe" ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : diagnosis.severity === "moderate" ? (
                    <AlertCircle className="w-8 h-8" />
                  ) : (
                    <CheckCircle className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1 text-right">
                  <h2 className="text-3xl font-bold mb-2">{diagnosis.conditionArabic}</h2>
                  <p className="text-gray-600">
                    الشدة: <span className="font-semibold">{diagnosis.severityArabic}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-3 text-right">الوصف</h3>
                <p className="text-gray-700 leading-relaxed text-right">{diagnosis.descriptionArabic}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-3 text-right flex items-center gap-2 justify-end">
                  <Clock className="w-5 h-5" />
                  مستوى الاستعجال
                </h3>
                <p className="text-blue-900 font-semibold text-right">{diagnosis.urgencyArabic}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4 text-right">التوصيات</h3>
                <ul className="space-y-3">
                  {diagnosis.recommendationsArabic.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-right">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3 text-right flex items-center gap-2 justify-end">
                  <Stethoscope className="w-5 h-5" />
                  التخصص المطلوب
                </h3>
                <p className="text-purple-900 font-semibold text-right">{diagnosis.specialtyNeededArabic}</p>
              </div>
            </div>

            {/* العيادات القريبة */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-right flex items-center gap-3 justify-end">
                <MapPin className="w-7 h-7 text-blue-600" />
                العيادات القريبة في العراق
              </h3>
              
              <div className="grid gap-4 mb-6">
                {nearbyClinics.map((clinic) => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/medical-services")}
              >
                <MapPin className="ml-2" />
                اعرض المزيد من العيادات
              </Button>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setStep("welcome");
                  setSelectedSymptom(null);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setDiagnosis(null);
                }}
              >
                تشخيص جديد
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => navigate("/medical-services")}
              >
                <Calendar className="ml-2" />
                احجز موعد
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
