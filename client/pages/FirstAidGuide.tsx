import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Zap,
  Thermometer,
  Scissors,
  Phone,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  User,
  MapPin,
  Activity,
  Stethoscope,
  Bandage,
  Droplet,
  Flame,
  Wind,
  Eye,
  Skull,
  Baby,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyScenario {
  id: string;
  title: string;
  icon: React.ReactNode;
  urgency: "critical" | "urgent" | "moderate";
  description: string;
  steps: string[];
  warnings: string[];
  duration?: string;
  categories: string[];
}

interface EmergencyTimer {
  scenario: string;
  isRunning: boolean;
  time: number;
  totalTime: number;
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    id: "heart-attack",
    title: "النوبة القلبية",
    icon: <Heart className="h-6 w-6" />,
    urgency: "critical",
    description: "أعراض: ألم في الصدر، ضيق في التنفس، غثيان، تعرق",
    duration: "فوري - كل ثانية مهمة",
    categories: ["قلبية", "حرجة"],
    steps: [
      "اتصل بالإسعاف فوراً (997)",
      "اجعل المريض يجلس مع إسناد الظهر",
      "أعط المريض أسبرين للمضغ (إذا لم يكن لديه حساسية)",
      "فك الملابس الضيقة حول الرقبة والصدر",
      "ابق مع المريض وطمئنه",
      "راقب التنف�� والنبض باستمرار",
      "كن مستعداً لإجراء الإنعاش القلبي الرئوي",
    ],
    warnings: [
      "لا تتركه وحيداً أبداً",
      "لا تعطيه الماء أو الطعام",
      "لا تتردد في الاتصال بالإسعاف",
    ],
  },
  {
    id: "choking",
    title: "الاختناق",
    icon: <Wind className="h-6 w-6" />,
    urgency: "critical",
    description: "عدم القدرة على التنفس أو الكلام بسبب انسداد مجرى الهواء",
    duration: "4-6 دقائق حرجة",
    categories: ["تنفسية", "حرجة"],
    steps: [
      "تأكد من وجود انسداد (لا يستطيع الكلام أو السعال)",
      "قف خلف المريض واحضنه من الخلف",
      "ضع قبضتك أسفل القفص الصدري مباشرة",
      "أمسك قبضتك باليد الأخرى واضغط بقوة للأعلى",
      "كرر 5 ضغطات سريعة وقوية",
      "تحقق من الفم وأزل أي جسم مرئي",
      "كرر حتى يخرج الجسم أو يفقد الوعي",
      "إذا فقد الوعي، ابدأ الإنعاش القلبي الرئوي",
    ],
    warnings: [
      "لا تضرب الظهر إذا كان واعياً",
      "لا تحاول إخراج الجسم بيدك إلا إذا كان مرئياً",
      "اتصل بالإسعاف فوراً",
    ],
  },
  {
    id: "severe-bleeding",
    title: "النزيف الشديد",
    icon: <Droplet className="h-6 w-6" />,
    urgency: "critical",
    description: "فقدان كمية كبيرة من الدم من جرح عميق",
    duration: "3-5 دقائق للسيطرة",
    categories: ["نزيف", "جراح"],
    steps: [
      "اضغط مباشرة على الجرح بقطعة قماش نظيفة",
      "ارفع الجزء المصاب فوق مستوى القلب إن أمكن",
      "حافظ على الضغط المستمر",
      "إذا تشبعت القماش، أضف طبقة أخرى فوقها",
      "اربط الضمادة بإحكام",
      "راقب علامات الصدمة (شحوب، دوار، برودة)",
      "اتصل بالإسعاف",
      "لا تزيل الضمادة الأولى",
    ],
    warnings: [
      "لا تزيل الأجسام الغريبة من الجرح",
      "لا ترفع الضمادة للتحقق من النزيف",
      "احذر من الصدمة",
    ],
  },
  {
    id: "burns",
    title: "الحروق",
    icon: <Flame className="h-6 w-6" />,
    urgency: "urgent",
    description: "إصابة الجلد بالحرارة أو المواد الكيميائية أو الكهرباء",
    duration: "10-20 دقيقة تبريد",
    categories: ["حروق", "جلدية"],
    steps: [
      "أبعد المصاب عن مصدر الحرق فوراً",
      "اسكب الماء البارد على الحرق لمدة 10-20 دقيقة",
      "أزل الملابس والحلي قبل التورم",
      "غط الحرق بغلاف بلاستيكي نظيف",
      "لا تستخدم الثلج أو الزبدة أو المعجون",
      "أعط مسكن ألم إذا لزم الأمر",
      "اطلب المساعدة الطبية للحروق الكبيرة",
      "راقب علامات الصدمة",
    ],
    warnings: [
      "لا تزيل الملابس الملتصقة بالجلد",
      "لا تستخدم الثلج مباشرة",
      "لا تفقع الفقاعات",
    ],
  },
  {
    id: "fractures",
    title: "الكسور",
    icon: <Bandage className="h-6 w-6" />,
    urgency: "urgent",
    description: "كسر في العظام مع ألم شديد وتشوه محتمل",
    duration: "حتى وصول الإسعاف",
    categories: ["عظام", "إصابات"],
    steps: [
      "لا تحرك المصاب إلا للضرورة القصوى",
      "ثبت الجزء المكسور في وضعه الحالي",
      "استخدم جبيرة بسيطة (لوح خشبي، مجلة)",
      "اربط الجبيرة أعلى وأسفل الكسر",
      "ضع وسادة أو قماش ناعم تحت الجبيرة",
      "تحقق من الدورة الدموية بالأطراف",
      "أعط مسكن ألم حسب الحاجة",
      "راقب علامات الصدمة",
    ],
    warnings: [
      "لا تحاول إعادة العظم لمكانه",
      "لا تربط الجبيرة بإحكام شديد",
      "راقب تنميل الأطراف",
    ],
  },
  {
    id: "unconscious",
    title: "فقدان الوعي",
    icon: <User className="h-6 w-6" />,
    urgency: "critical",
    description: "عدم الاستجابة للأصوات أو اللمس",
    duration: "فحص فوري",
    categories: ["عصبية", "حرجة"],
    steps: [
      "تحقق من الاستجابة (نادي، اهز الكتفين برفق)",
      "اتصل بالإسعاف فوراً",
      "افتح مجرى الهواء (ارفع الذقن، ��مل الرأس)",
      "تحقق من التنفس لمدة 10 ثوان",
      "ضع المريض في وضعية الإفاقة إذا كان يتنفس",
      "إذا لم يتنفس، ابدأ الإنعاش القلبي الرئوي",
      "راقب التنفس والنبض باستمرار",
      "لا تعطيه أي شيء عن طريق الفم",
    ],
    warnings: [
      "لا تحرك الرأس والرقبة إذا اشتبهت في إصابة العمود الفقري",
      "لا تتركه وحيداً",
      "لا تعطيه الماء أو الطعام",
    ],
  },
  {
    id: "stroke",
    title: "السكتة الدماغية",
    icon: <Activity className="h-6 w-6" />,
    urgency: "critical",
    description: "انقطاع تدفق الدم إلى جزء من الدماغ",
    duration: "الوقت حرج جد��ً",
    categories: ["دماغية", "حرجة"],
    steps: [
      "استخدم اختبار FAST:",
      "F - Face: اطلب منه الابتسام، هل نصف الوجه متدلي؟",
      "A - Arms: اطلب منه رفع الذراعين، هل أحدهما يسقط؟",
      "S - Speech: اطلب منه قول جملة، هل الكلام مشوش؟",
      "T - Time: سجل الوقت واتصل ب��لإسعاف فوراً",
      "اجعله يستلقي مع رفع الرأس قليلاً",
      "لا تعطيه طعام أو شراب",
      "راقب التنفس والوعي",
    ],
    warnings: [
      "الوقت حرج - كل دقيقة مهمة",
      "لا تعطيه أسبرين",
      "لا تتركه وحيداً",
    ],
  },
  {
    id: "seizure",
    title: "النوبة الصرعية",
    icon: <Zap className="h-6 w-6" />,
    urgency: "urgent",
    description: "تشنجات وحركات لا إرادية في الجسم",
    duration: "عادة 1-3 دقائق",
    categories: ["عصبية", "تشنجات"],
    steps: [
      "ابق هادئاً ولا تذعر",
      "أبعد الأشياء الصلبة من حوله",
      "ضع شيئاً ناعماً تحت رأسه",
      "أمله على جانبه لمنع اختناق اللعاب",
      "لا تحاول كبح التشنجات",
      "سجل مدة النوبة",
      "بعد انتهاء النوبة، تحدث معه بهدوء",
      "اتصل بالإسعاف إذا استمرت أكثر من 5 دقائق",
    ],
    warnings: [
      "لا تضع أي شيء في فمه",
      "لا تحاول كبح الحركات",
      "لا تصب عليه الماء",
    ],
  },
  {
    id: "poisoning",
    title: "التسمم",
    icon: <Skull className="h-6 w-6" />,
    urgency: "critical",
    description: "ابتلاع أو استنشاق مواد سامة",
    duration: "فوري",
    categories: ["تسمم", "حرجة"],
    steps: [
      "حدد نوع السم إن أمكن",
      "اتصل بمركز السموم (997)",
      "إذا كان واعياً ولم يبتلع مادة كاوية:",
      "اجعله يتقيأ بوضع إصبع في الحلق",
      "أعطه كمية كبيرة من الماء أو الحليب",
      "احتفظ بعينة من السم أو العبوة",
      "راقب التنفس والوعي",
      "لا تحفز القيء إذا ابتلع مادة كاوية",
    ],
    warnings: [
      "لا تحفز القيء مع المواد الكاوية",
      "لا تعطيه الحليب مع المبيدات",
      "اتصل بالخبراء فوراً",
    ],
  },
  {
    id: "allergic-reaction",
    title: "رد الفعل التحسسي الشديد",
    icon: <AlertTriangle className="h-6 w-6" />,
    urgency: "critical",
    description: "صدمة تحسسية تهدد الحياة",
    duration: "دقائق معدود��",
    categories: ["تحسس", "حرجة"],
    steps: [
      "ابحث عن قلم الإيبينيفرين واستخدمه فوراً",
      "اتصل بالإسعاف فوراً",
      "اجعل المريض يستلقي مع رفع الساقين",
      "فك الملابس الضيقة",
      "تحقق من مجرى الهواء والتنفس",
      "أعط إيبينيفرين ثاني إذا لم تتحسن الأعراض خلال 5-15 دقيقة",
      "كن مستعداً للإنعاش القلبي الرئوي",
      "راقب ضغط الدم والنبض",
    ],
    warnings: [
      "لا تتأخر في إعطاء الإيبينيفرين",
      "لا تعطيه شيئاً عن طريق الفم",
      "راقب تدهور الحالة",
    ],
  },
];

const emergencyNumbers = [
  { name: "الإسعاف", number: "997", icon: <Phone className="h-4 w-4" /> },
  { name: "الشرطة", number: "999", icon: <Shield className="h-4 w-4" /> },
  { name: "الحريق", number: "998", icon: <Flame className="h-4 w-4" /> },
  { name: "السموم", number: "997", icon: <Skull className="h-4 w-4" /> },
];

const FirstAidGuide: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [timer, setTimer] = useState<EmergencyTimer | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const filteredScenarios = emergencyScenarios.filter(
    (scenario) =>
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (urgencyFilter === "all" || scenario.urgency === urgencyFilter),
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 text-white";
      case "urgent":
        return "bg-orange-500 text-white";
      case "moderate":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "حرج";
      case "urgent":
        return "عاجل";
      case "moderate":
        return "متوسط";
      default:
        return "عادي";
    }
  };

  const startTimer = (scenario: string, totalTime: number) => {
    setTimer({
      scenario,
      isRunning: true,
      time: 0,
      totalTime,
    });

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev || prev.time >= prev.totalTime) {
          clearInterval(interval);
          return null;
        }
        return { ...prev, time: prev.time + 1 };
      });
    }, 1000);
  };

  const toggleStep = (stepIndex: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepIndex)
        ? prev.filter((i) => i !== stepIndex)
        : [...prev, stepIndex],
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 dir-rtl">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/emergency"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 ml-2" />
              العودة للطوارئ
            </Link>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">997</div>
                <div className="text-sm text-gray-500">الإسعاف</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              دليل الإسعافات الأولية
            </h1>
            <p className="text-gray-600">
              تعلم كيفية التعامل مع الحالات الطارئة قبل وصول الإسعاف
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث عن حالة طارئة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="critical">حرجة</option>
              <option value="urgent">عاجلة</option>
              <option value="moderate">متوسطة</option>
            </select>
          </div>

          {/* Emergency Numbers Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {emergencyNumbers.map((number) => (
              <a
                key={`${number.name}-${number.number}`}
                href={`tel:${number.number}`}
                className="bg-red-100 hover:bg-red-200 p-4 rounded-xl text-center transition-colors"
              >
                <div className="flex justify-center mb-2">{number.icon}</div>
                <div className="font-bold text-red-700">{number.number}</div>
                <div className="text-sm text-red-600">{number.name}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        {timer && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">
                  مؤقت الحالة الطارئة
                </h3>
                <p className="text-orange-700">{timer.scenario}</p>
              </div>
              <div className="text-2xl font-bold text-orange-800">
                {formatTime(timer.time)}
              </div>
            </div>
          </div>
        )}

        {/* Scenarios Grid */}
        <div className="grid gap-6">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() =>
                  setSelectedScenario(
                    selectedScenario === scenario.id ? null : scenario.id,
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div
                      className={cn(
                        "p-3 rounded-xl",
                        getUrgencyColor(scenario.urgency),
                      )}
                    >
                      {scenario.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-600">{scenario.description}</p>
                      {scenario.duration && (
                        <div className="flex items-center mt-2 text-sm text-orange-600">
                          <Clock className="h-4 w-4 ml-1" />
                          {scenario.duration}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getUrgencyColor(scenario.urgency),
                      )}
                    >
                      {getUrgencyText(scenario.urgency)}
                    </span>
                    {selectedScenario === scenario.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {selectedScenario === scenario.id && (
                <div className="px-6 pb-6">
                  <div className="border-t pt-6">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <button
                        onClick={() => window.open("tel:997")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Phone className="h-4 w-4 ml-2" />
                        اتصل بالإسعاف
                      </button>
                      {scenario.duration &&
                        scenario.duration.includes("دقيقة") && (
                          <button
                            onClick={() =>
                              startTimer(
                                scenario.title,
                                parseInt(
                                  scenario.duration.match(/\d+/)?.[0] || "5",
                                ) * 60,
                              )
                            }
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <Timer className="h-4 w-4 ml-2" />
                            ابدأ المؤقت
                          </button>
                        )}
                    </div>

                    {/* Steps */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        خطوات الإسعاف:
                      </h4>
                      <div className="space-y-3">
                        {scenario.steps.map((step, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-4 rounded-lg border-r-4 transition-all cursor-pointer",
                              expandedSteps.includes(index)
                                ? "bg-green-50 border-green-500"
                                : "bg-gray-50 border-gray-300 hover:border-green-400",
                            )}
                            onClick={() => toggleStep(index)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 space-x-reverse">
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                    expandedSteps.includes(index)
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-300 text-gray-700",
                                  )}
                                >
                                  {expandedSteps.includes(index) ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <p
                                  className={cn(
                                    "flex-1",
                                    expandedSteps.includes(index)
                                      ? "text-green-800 font-medium"
                                      : "text-gray-700",
                                  )}
                                >
                                  {step}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warnings */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
                        <AlertTriangle className="h-5 w-5 ml-2" />
                        تحذيرات مهمة:
                      </h4>
                      <ul className="space-y-2">
                        {scenario.warnings.map((warning, index) => (
                          <li
                            key={index}
                            className="text-yellow-700 flex items-start"
                          >
                            <span className="text-yellow-500 ml-2">•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-400">
              جرب البحث بكلمات مختلفة أو غير المرشحات
            </p>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3 space-x-reverse">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">
                تنبيه مهم:
              </h3>
              <p className="text-red-700 leading-relaxed">
                هذا الدليل لأغراض التعليم فقط ولا يغني عن التدريب المناسب. في
                حالات الطوارئ الحقيقية، اتصل بالإسعاف فوراً على الرقم 997.
                الإسعافات الأولية تكمل العناية الطبية المتخصصة ولا تحل محلها.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstAidGuide;
