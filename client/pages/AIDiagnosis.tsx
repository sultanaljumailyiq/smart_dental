import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  AlertCircle,
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Stethoscope,
  Activity,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { VisitorHeader } from "@/components/VisitorHeader";

interface Question {
  id: string;
  text: string;
  type: "single" | "multiple" | "scale";
  options?: string[];
  next?: (answer: any) => string;
}

interface DiagnosticResult {
  condition: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
  recommendations: string[];
  urgency: string;
  shouldSeeDoctor: boolean;
}

const diagnosticQuestions: Record<string, Question> = {
  start: {
    id: "start",
    text: "ما هي المشكلة الرئيسية التي تعاني منها؟",
    type: "single",
    options: ["ألم", "مشكلة تجميلية", "نزيف", "تصبغات وتلون", "تورم وانتفاخ", "رائحة كريهة", "بقعة بيضاء"],
    next: (answer) => {
      if (answer === "ألم") return "pain_location";
      if (answer === "مشكلة تجميلية") return "esthetic";
      if (answer === "نزيف") return "bleeding";
      if (answer === "تصبغات وتلون") return "staining";
      if (answer === "تورم وانتفاخ") return "swelling_location";
      if (answer === "رائحة كريهة") return "bad_odor";
      if (answer === "بقعة بيضاء") return "white_patch";
      return "pain_location";
    }
  },
  pain_location: {
    id: "pain_location",
    text: "أين يقع الألم بالتحديد؟",
    type: "single",
    options: ["الأسنان الأمامية", "الأضراس الخلفية", "اللثة", "الفك", "اللسان", "الفم بشكل عام"],
    next: () => "pain_type"
  },
  esthetic: {
    id: "esthetic",
    text: "ما نوع المشكلة التجميلية؟",
    type: "multiple",
    options: ["اصفرار الأسنان", "أسنان معوجة", "فراغات بين الأسنان", "شكل اللثة", "أسنان مكسورة", "حشوات قديمة ظاهرة"],
    next: () => "esthetic_duration"
  },
  esthetic_duration: {
    id: "esthetic_duration",
    text: "منذ متى وأنت تشعر بهذه المشكلة التجميلية؟",
    type: "single",
    options: ["حديثاً", "عدة أشهر", "منذ سنوات", "منذ الطفولة"],
    next: () => "esthetic_impact"
  },
  esthetic_impact: {
    id: "esthetic_impact",
    text: "كيف تؤثر هذه المشكلة على حياتك؟",
    type: "multiple",
    options: ["تجنب الابتسام", "انخفاض الثقة بالنفس", "تأثير على العمل", "تأثير على العلاقات", "لا تؤثر كثيراً"],
    next: () => "esthetic_priority"
  },
  esthetic_priority: {
    id: "esthetic_priority",
    text: "ما أولويتك في العلاج؟",
    type: "single",
    options: ["الحصول على نتائج سريعة", "الحصول على أفضل النتائج (يحتاج وقت)", "أقل تكلفة ممكنة", "حل طبيعي غير ملحوظ"],
    next: () => "previous_treatment"
  },
  bleeding: {
    id: "bleeding",
    text: "متى يحدث النزيف؟",
    type: "multiple",
    options: ["عند تنظيف الأسنان", "عند استخدام الخيط", "عند الأكل", "تلقائياً", "عند الضغط على اللثة"],
    next: () => "bleeding_duration"
  },
  bleeding_duration: {
    id: "bleeding_duration",
    text: "منذ متى يحدث النزيف؟",
    type: "single",
    options: ["يوم أو يومين", "أسبوع", "أسبوعين", "شهر أو أكثر"],
    next: () => "bleeding_amount"
  },
  bleeding_amount: {
    id: "bleeding_amount",
    text: "ما كمية النزيف؟",
    type: "single",
    options: ["نقاط قليلة", "كمية متوسطة", "كثير ومستمر", "يتوقف ثم يعود"],
    next: () => "gum_color"
  },
  gum_color: {
    id: "gum_color",
    text: "ما لون اللثة؟",
    type: "single",
    options: ["وردي طبيعي", "أحمر فاتح", "أحمر داكن", "أرجواني", "شاحب"],
    next: () => "oral_hygiene"
  },
  oral_hygiene: {
    id: "oral_hygiene",
    text: "كم مرة تنظف أسنانك يومياً؟",
    type: "single",
    options: ["مرتين أو أكثر", "مرة واحدة", "أحياناً", "نادراً"],
    next: () => "smoking_status"
  },
  smoking_status: {
    id: "smoking_status",
    text: "هل أنت مدخن؟",
    type: "single",
    options: ["لا أدخن", "مدخن خفيف (أقل من 10 سجائر)", "مدخن متوسط (10-20 سيجارة)", "مدخن شره (أكثر من 20 سيجارة)"],
    next: () => "previous_treatment"
  },
  staining: {
    id: "staining",
    text: "ما لون التصبغات؟",
    type: "single",
    options: ["أصفر", "بني", "أسود", "رمادي", "بقع بيضاء"],
    next: () => "staining_location"
  },
  staining_location: {
    id: "staining_location",
    text: "أين تقع التصبغات؟",
    type: "multiple",
    options: ["على سطح الأسنان", "بين الأسنان", "عند خط اللثة", "على الأسنان الأمامية", "على الأضراس"],
    next: () => "staining_habits"
  },
  staining_habits: {
    id: "staining_habits",
    text: "هل تتناول أياً من التالي بشكل متكرر؟",
    type: "multiple",
    options: ["القهوة", "الشاي", "المشروبات الغازية", "النبيذ الأحمر", "لا شيء من ذلك"],
    next: () => "smoking_status"
  },
  swelling_location: {
    id: "swelling_location",
    text: "أين يقع التورم؟",
    type: "single",
    options: ["حول سن معين", "اللثة العلوية", "اللثة السفلية", "الخد", "تحت الفك"],
    next: () => "swelling_pain"
  },
  swelling_pain: {
    id: "swelling_pain",
    text: "هل التورم مصحوب بألم؟",
    type: "single",
    options: ["نعم، ألم شديد", "نعم، ألم خفيف", "لا يوجد ألم"],
    next: () => "swelling_duration"
  },
  swelling_duration: {
    id: "swelling_duration",
    text: "منذ متى لاحظت التورم؟",
    type: "single",
    options: ["اليوم", "أمس", "منذ أيام", "منذ أسبوع أو أكثر"],
    next: () => "swelling_size"
  },
  swelling_size: {
    id: "swelling_size",
    text: "هل حجم التورم في تزايد؟",
    type: "single",
    options: ["نعم، يزداد بسرعة", "نعم، ببطء", "ثابت لا يتغير", "يتناقص"],
    next: () => "fever"
  },
  bad_odor: {
    id: "bad_odor",
    text: "متى تلاحظ الرائحة الكريهة أكثر؟",
    type: "multiple",
    options: ["في الصباح", "بعد الأكل", "طوال اليوم", "عند التحدث", "لا يوجد وقت محدد"],
    next: () => "bad_odor_habits"
  },
  bad_odor_habits: {
    id: "bad_odor_habits",
    text: "كيف هي عادات النظافة لديك؟",
    type: "multiple",
    options: ["أنظف أسناني مرتين يومياً", "أستخدم خيط الأسنان", "أستخدم غسول الفم", "أنظف أسناني مرة واحدة فقط", "نادراً ما أنظف أسناني"],
    next: () => "result"
  },
  white_patch: {
    id: "white_patch",
    text: "كيف تصف البقعة البيضاء؟",
    type: "single",
    options: ["ناعمة ولا تؤلم", "خشنة الملمس", "مؤلمة", "متقرحة", "تنزف عند اللمس"],
    next: () => "white_patch_location"
  },
  white_patch_location: {
    id: "white_patch_location",
    text: "أين تقع البقعة البيضاء؟",
    type: "single",
    options: ["اللسان", "باطن الخد", "اللثة", "سقف الحلق", "الشفاه من الداخل"],
    next: () => "white_patch_duration"
  },
  white_patch_duration: {
    id: "white_patch_duration",
    text: "منذ متى لاحظت البقعة البيضاء؟",
    type: "single",
    options: ["أيام قليلة", "أسبوع", "أسبوعين", "شهر أو أكثر"],
    next: () => "white_patch_change"
  },
  white_patch_change: {
    id: "white_patch_change",
    text: "هل تتغير البقعة البيضاء؟",
    type: "single",
    options: ["تكبر بسرعة", "تكبر ببطء", "تتقلص", "لا تتغير"],
    next: () => "smoking_status"
  },
  pain_type: {
    id: "pain_type",
    text: "كيف تصف الألم أو الإزعاج؟",
    type: "single",
    options: ["ألم حاد ومفاجئ", "ألم خفيف مستمر", "حساسية عند الأكل/الشرب", "تورم وانتفاخ", "لا يوجد ألم"],
    next: (answer) => {
      if (answer === "حساسية عند الأكل/الشرب") return "sensitivity";
      if (answer === "تورم وانتفاخ") return "swelling";
      return "pain_duration";
    }
  },
  pain_duration: {
    id: "pain_duration",
    text: "منذ متى وأنت تعاني من هذه الأعراض؟",
    type: "single",
    options: ["أقل من يوم", "1-3 أيام", "أسبوع", "أسبوعين", "أكثر من شهر"],
    next: () => "triggers"
  },
  triggers: {
    id: "triggers",
    text: "هل هناك محفزات تزيد من الألم؟",
    type: "multiple",
    options: ["المشروبات الباردة", "المشروبات الساخنة", "الأطعمة الحلوة", "المضغ", "اللمس", "لا شيء"],
    next: () => "pain_intensity"
  },
  pain_intensity: {
    id: "pain_intensity",
    text: "ما شدة الألم على مقياس من 1 إلى 10؟",
    type: "scale",
    options: ["1-3 (خفيف)", "4-6 (متوسط)", "7-9 (شديد)", "10 (لا يطاق)"],
    next: () => "pain_timing"
  },
  pain_timing: {
    id: "pain_timing",
    text: "متى يكون الألم أكثر؟",
    type: "single",
    options: ["في الليل", "في النهار", "بعد الأكل", "عند الاستيقاظ", "طوال الوقت"],
    next: () => "radiating_pain"
  },
  radiating_pain: {
    id: "radiating_pain",
    text: "هل ينتشر الألم إلى مناطق أخرى؟",
    type: "single",
    options: ["نعم، إلى الرأس", "نعم، إلى الأذن", "نعم، إلى الرقبة", "نعم، إلى الفك", "لا ينتشر"],
    next: () => "previous_treatment"
  },
  sensitivity: {
    id: "sensitivity",
    text: "متى تحدث الحساسية؟",
    type: "multiple",
    options: ["عند شرب البارد", "عند شرب الساخن", "عند الأكل", "عند التنفس بالفم", "دائماً"],
    next: () => "previous_treatment"
  },
  swelling: {
    id: "swelling",
    text: "أين يقع التورم بالضبط؟",
    type: "single",
    options: ["حول سن معين", "اللثة العلوية", "اللثة السفلية", "الخد", "تحت الفك"],
    next: () => "fever"
  },
  fever: {
    id: "fever",
    text: "هل تعاني من حمى أو ارتفاع في درجة الحرارة؟",
    type: "single",
    options: ["نعم", "لا", "غير متأكد"],
    next: () => "previous_treatment"
  },
  gums: {
    id: "gums",
    text: "ما هي مشكلة اللثة التي تعاني منها؟",
    type: "multiple",
    options: ["نزيف عند التنظيف", "احمرار وتورم", "انحسار اللثة", "رائحة كريهة", "ألم عند اللمس"],
    next: () => "gum_duration"
  },
  gum_duration: {
    id: "gum_duration",
    text: "منذ متى ولاحظت هذه المشكلة؟",
    type: "single",
    options: ["أيام قليلة", "أسبوع إلى أسبوعين", "شهر", "عدة أشهر"],
    next: () => "previous_treatment"
  },
  jaw: {
    id: "jaw",
    text: "ما نوع مشكلة الفك؟",
    type: "multiple",
    options: ["صعوبة في فتح الفم", "طقطقة عند الحركة", "ألم عند المضغ", "تشنج عضلي", "انحراف عند الفتح"],
    next: () => "previous_treatment"
  },
  previous_treatment: {
    id: "previous_treatment",
    text: "هل سبق وعالجت هذه المشكلة؟",
    type: "single",
    options: ["نعم، عند طبيب أسنان", "نعم، بعلاج منزلي", "لا، هذه أول مرة", "تحسنت ثم عادت"],
    next: () => "result"
  }
};

const analyzeSymptoms = (answers: Record<string, any>): DiagnosticResult => {
  // خوارزمية التشخيص التقليدية بناءً على الشكوى الرئيسية مع نظام النقاط
  const chiefComplaint = answers.start;
  const painType = answers.pain_type;
  const duration = answers.pain_duration;
  const triggers = answers.triggers || [];
  const painIntensity = answers.pain_intensity;
  const painTiming = answers.pain_timing;
  const radiatingPain = answers.radiating_pain;
  const swellingLocation = answers.swelling_location;
  const swellingPain = answers.swelling_pain;
  const swellingDuration = answers.swelling_duration;
  const swellingSize = answers.swelling_size;
  const fever = answers.fever;
  const bleeding = answers.bleeding || [];
  const bleedingDuration = answers.bleeding_duration;
  const bleedingAmount = answers.bleeding_amount;
  const gumColor = answers.gum_color;
  const oralHygiene = answers.oral_hygiene;
  const smokingStatus = answers.smoking_status;
  const stainingColor = answers.staining;
  const stainingHabits = answers.staining_habits || [];
  const esthetic = answers.esthetic || [];
  const badOdor = answers.bad_odor || [];
  const badOdorHabits = answers.bad_odor_habits || [];
  const whitePatch = answers.white_patch;
  const whitePatchDuration = answers.white_patch_duration;
  const whitePatchChange = answers.white_patch_change;
  
  // نظام تسجيل النقاط لتحسين الدقة
  let diagnosticScore = 0;

  // تشخيص حالات النزيف بنظام النقاط
  if (chiefComplaint === "نزيف") {
    diagnosticScore = 0;
    
    // تقييم نوع النزيف (النقاط من 0-10)
    if (bleeding.includes("تلقائياً")) diagnosticScore += 10;
    else if (bleeding.includes("عند الضغط على اللثة")) diagnosticScore += 7;
    else if (bleeding.includes("عند الأكل")) diagnosticScore += 5;
    else if (bleeding.includes("عند تنظيف الأسنان") || bleeding.includes("عند استخدام الخيط")) diagnosticScore += 3;
    
    // تقييم المدة (النقاط من 0-8)
    if (bleedingDuration === "شهر أو أكثر") diagnosticScore += 8;
    else if (bleedingDuration === "أسبوعين") diagnosticScore += 5;
    else if (bleedingDuration === "أسبوع") diagnosticScore += 3;
    else diagnosticScore += 1;
    
    // تقييم الكمية (النقاط من 0-7)
    if (bleedingAmount === "كثير ومستمر") diagnosticScore += 7;
    else if (bleedingAmount === "كمية متوسطة") diagnosticScore += 4;
    else if (bleedingAmount === "يتوقف ثم يعود") diagnosticScore += 3;
    else diagnosticScore += 1;
    
    // تقييم لون اللثة (النقاط من 0-6)
    if (gumColor === "أرجواني" || gumColor === "أحمر داكن") diagnosticScore += 6;
    else if (gumColor === "أحمر فاتح") diagnosticScore += 3;
    else diagnosticScore += 1;
    
    // تقييم النظافة والتدخين (النقاط من 0-5)
    if (oralHygiene === "نادراً") diagnosticScore += 5;
    else if (oralHygiene === "أحياناً") diagnosticScore += 3;
    else if (oralHygiene === "مرة واحدة") diagnosticScore += 2;
    
    if (smokingStatus?.includes("شره")) diagnosticScore += 4;
    else if (smokingStatus?.includes("متوسط")) diagnosticScore += 3;
    else if (smokingStatus?.includes("خفيف")) diagnosticScore += 1;
    
    // تشخيص بناءً على النقاط (إجمالي من 40 نقطة)
    if (diagnosticScore >= 25 || bleeding.includes("تلقائياً")) {
      return {
        condition: "التهاب دواعم السن المتقدم أو مشكلة صحية عامة",
        severity: "severe",
        description: "التهاب شديد في دواعم الأسنان أو نزيف تلقائي قد يشير إلى مشكلة في الدم",
        recommendations: [
          "زيارة طبيب الأسنان فوراً (طوارئ)",
          "فحص الدم الشامل (تخثر الدم)",
          "تنظيف عميق للجير تحت اللثة",
          "مضاد حيوي إذا لزم الأمر",
          "كمادات باردة وتجنب الأسبرين"
        ],
        urgency: "فوري - خلال 24-48 ساعة",
        shouldSeeDoctor: true
      };
    } else if (diagnosticScore >= 15) {
      return {
        condition: "التهاب اللثة المتوسط",
        severity: "moderate",
        description: "التهاب في اللثة نتيجة تراكم البلاك والجير، يحتاج لتدخل طبي",
        recommendations: [
          "تنظيف احترافي عند طبيب الأسنان خلال أسبوع",
          "غسول فم مطهر (كلورهيكسيدين 0.12%)",
          "تنظيف بفرشاة ناعمة مرتين يومياً",
          "استخدام خيط الأسنان برفق يومياً",
          "الإقلاع عن التدخين فوراً"
        ],
        urgency: "خلال أسبوع",
        shouldSeeDoctor: true
      };
    } else {
      return {
        condition: "التهاب لثة خفيف",
        severity: "mild",
        description: "التهاب بسيط في اللثة يمكن علاجه بتحسين النظافة",
        recommendations: [
          "تحسين تنظيف الأسنان - مرتين يومياً على الأقل",
          "استخدام خيط الأسنان يومياً",
          "غسول فم مطهر",
          "فحص عند طبيب الأسنان للتنظيف",
          "مراقبة تحسن الأعراض خلال أسبوعين"
        ],
        urgency: "خلال أسبوعين",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص حالات التورم بنظام النقاط
  if (chiefComplaint === "تورم وانتفاخ") {
    diagnosticScore = 0;
    
    // تقييم الألم المصاحب (النقاط من 0-10)
    if (swellingPain === "نعم، ألم شديد") diagnosticScore += 10;
    else if (swellingPain === "نعم، ألم خفيف") diagnosticScore += 5;
    else diagnosticScore += 1;
    
    // تقييم المدة (النقاط من 0-8)
    if (swellingDuration === "منذ أسبوع أو أكثر") diagnosticScore += 8;
    else if (swellingDuration === "منذ أيام") diagnosticScore += 5;
    else if (swellingDuration === "أمس") diagnosticScore += 3;
    else diagnosticScore += 2;
    
    // تقييم حجم التورم (النقاط من 0-9)
    if (swellingSize === "نعم، يزداد بسرعة") diagnosticScore += 9;
    else if (swellingSize === "نعم، ببطء") diagnosticScore += 5;
    else if (swellingSize === "ثابت لا يتغير") diagnosticScore += 3;
    else diagnosticScore += 1;
    
    // تقييم الحمى (النقاط من 0-10)
    if (fever === "نعم") diagnosticScore += 10;
    else if (fever === "غير متأكد") diagnosticScore += 3;
    
    // تقييم الموقع (النقاط من 0-7)
    if (swellingLocation === "تحت الفك" || swellingLocation === "الخد") diagnosticScore += 7;
    else if (swellingLocation === "حول سن معين") diagnosticScore += 5;
    else diagnosticScore += 3;
    
    // تشخيص بناءً على النقاط (إجمالي من 44 نقطة)
    if (diagnosticScore >= 28 || fever === "نعم") {
      return {
        condition: "خراج أو عدوى بكتيرية حادة",
        severity: "severe",
        description: "عدوى بكتيرية خطيرة تتطلب تدخلاً طبياً فورياً لمنع انتشارها",
        recommendations: [
          "زيارة طوارئ الأسنان فوراً (خلال ساعات)",
          "مضاد حيوي قوي (أموكسيسيلين + كلافولانيك)",
          "فتح وتصريف الخراج جراحياً",
          "كمادات باردة لتقليل التورم",
          "مسكنات قوية (إيبوبروفين 600mg)"
        ],
        urgency: "فوري - خلال ساعات",
        shouldSeeDoctor: true
      };
    } else if (diagnosticScore >= 18) {
      return {
        condition: "التهاب حاد أو خراج في مرحلة مبكرة",
        severity: "moderate",
        description: "التهاب حاد يحتاج لتدخل سريع قبل أن يتطور لعدوى",
        recommendations: [
          "زيارة طبيب الأسنان خلال 24 ساعة",
          "مضاد حيوي (أموكسيسيلين 500mg)",
          "كمادات باردة كل ساعتين",
          "مسكنات الألم (باراسيتامول + إيبوبروفين)",
          "غسول فم مطهر"
        ],
        urgency: "خلال 24 ساعة",
        shouldSeeDoctor: true
      };
    } else {
      return {
        condition: "تورم أو التهاب بسيط في اللثة",
        severity: "mild",
        description: "تورم خفيف قد يكون بسبب تهيج أو التهاب بسيط",
        recommendations: [
          "مراجعة طبيب الأسنان خلال 2-3 أيام",
          "كمادات باردة 15 دقيقة كل ساعتين",
          "غسول فم بالماء والملح الدافئ",
          "تجنب الأطعمة الصلبة والساخنة",
          "مراقبة تطور الأعراض"
        ],
        urgency: "خلال 2-3 أيام",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص حالات التصبغات
  if (chiefComplaint === "تصبغات وتلون") {
    if (stainingColor === "أسود" || stainingColor === "بني") {
      return {
        condition: "تصبغات سطحية أو تسوس",
        severity: "mild",
        description: "تصبغات قد تكون بسبب القهوة، الشاي، التدخين، أو بداية تسوس",
        recommendations: [
          "تنظيف احترافي عند طبيب الأسنان",
          "تقليل المشروبات الملونة",
          "تنظيف الأسنان بعد القهوة والشاي",
          "الإقلاع عن التدخين",
          "فحص للتأكد من عدم وجود تسوس"
        ],
        urgency: "خلال أسبوعين",
        shouldSeeDoctor: true
      };
    }
    if (stainingColor === "بقع بيضاء") {
      return {
        condition: "تسوس مبكر أو فلوروسيس",
        severity: "mild",
        description: "بقع بيضاء قد تشير إلى بداية تسوس أو زيادة الفلورايد",
        recommendations: [
          "فحص عند طبيب الأسنان",
          "تطبيق الفلورايد إذا كان تسوس مبكر",
          "تحسين نظافة الفم",
          "تقليل السكريات",
          "متابعة دورية"
        ],
        urgency: "خلال أسبوع",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص الحالات التجميلية
  if (chiefComplaint === "مشكلة تجميلية") {
    if (esthetic.includes("اصفرار الأسنان")) {
      return {
        condition: "تصبغات واصفرار الأسنان",
        severity: "mild",
        description: "تغير لون الأسنان نتيجة عوامل طبيعية أو خارجية",
        recommendations: [
          "تنظيف احترافي للأسنان",
          "تبييض الأسنان عند الطبيب",
          "معجون أسنان مبيض",
          "تقليل القهوة والشاي",
          "الإقلاع عن التدخين"
        ],
        urgency: "حسب الرغبة",
        shouldSeeDoctor: true
      };
    }
    if (esthetic.includes("أسنان معوجة") || esthetic.includes("فراغات بين الأسنان")) {
      return {
        condition: "مشكلة في اصطفاف الأسنان",
        severity: "mild",
        description: "عدم انتظام في وضعية الأسنان يحتاج إلى تقويم",
        recommendations: [
          "استشارة أخصائي تقويم أسنان",
          "تقييم خيارات التقويم (تقليدي/شفاف)",
          "تصوير بانورامي للأسنان",
          "خطة علاجية تقويمية",
          "المحافظة على نظافة الفم الجيدة"
        ],
        urgency: "حسب الرغبة - للاستشارة",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص حالات الرائحة الكريهة
  if (chiefComplaint === "رائحة كريهة") {
    const poorHygiene = badOdorHabits.includes("نادراً ما أنظف أسناني") || 
                        badOdorHabits.includes("أنظف أسناني مرة واحدة فقط");
    
    if (poorHygiene) {
      return {
        condition: "رائحة فم بسبب سوء النظافة",
        severity: "mild",
        description: "تراكم البكتيريا وبقايا الطعام يسبب رائحة كريهة",
        recommendations: [
          "تنظيف الأسنان مرتين يومياً",
          "تنظيف اللسان بفرشاة خاصة",
          "استخدام خيط الأسنان يومياً",
          "غسول الفم المطهر",
          "شرب الماء بكثرة"
        ],
        urgency: "تحسين فوري للنظافة",
        shouldSeeDoctor: true
      };
    }
    
    if (badOdor.includes("في الصباح")) {
      return {
        condition: "رائحة الفم الصباحية",
        severity: "mild",
        description: "جفاف الفم أثناء النوم يسبب رائحة صباحية",
        recommendations: [
          "تنظيف الأسنان قبل النوم",
          "تنظيف اللسان",
          "شرب ماء عند الاستيقاظ",
          "غسول الفم قبل النوم",
          "فحص للتأكد من عدم وجود مشاكل أخرى"
        ],
        urgency: "للاستشارة إذا استمرت",
        shouldSeeDoctor: false
      };
    }

    return {
      condition: "رائحة فم مزمنة",
      severity: "moderate",
      description: "قد تكون بسبب مشاكل في اللثة أو الجهاز الهضمي",
      recommendations: [
        "فحص شامل عند طبيب الأسنان",
        "تنظيف الجير واللثة",
        "علاج أي التهابات في الفم",
        "استشارة طبيب باطني إذا لزم",
        "تحسين نظافة الفم"
      ],
      urgency: "خلال أسبوع",
      shouldSeeDoctor: true
    };
  }

  // تشخيص حالات البقع البيضاء
  if (chiefComplaint === "بقعة بيضاء") {
    if (whitePatch === "مؤلمة" || whitePatch === "متقرحة") {
      return {
        condition: "قرحة فموية أو التهاب",
        severity: whitePatchDuration === "شهر أو أكثر" ? "severe" : "moderate",
        description: "قرحة في الفم قد تحتاج فحصاً دقيقاً خاصة إذا استمرت طويلاً",
        recommendations: [
          "زيارة طبيب الأسنان للفحص",
          "أخذ عينة (خزعة) إذا استمرت أكثر من أسبوعين",
          "غسول فم مطهر ومخدر",
          "تجنب الأطعمة الحارة والحمضية",
          "فيتامينات B12 وحمض الفوليك"
        ],
        urgency: whitePatchDuration === "شهر أو أكثر" ? "فوري - خلال أيام" : "خلال أسبوع",
        shouldSeeDoctor: true
      };
    }
    
    if (whitePatch === "ناعمة ولا تؤلم") {
      return {
        condition: "ليكوبلاكيا (بقعة بيضاء)",
        severity: "moderate",
        description: "بقعة بيضاء تحتاج فحصاً لاستبعاد أي تغيرات غير طبيعية",
        recommendations: [
          "فحص شامل عند طبيب الأسنان",
          "قد تحتاج لأخذ عينة (خزعة)",
          "الإقلاع عن التدخين فوراً",
          "تقليل المهيجات",
          "متابعة دورية منتظمة"
        ],
        urgency: "خلال أسبوع",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص حالات الألم
  if (chiefComplaint === "ألم") {
    if (painType === "حساسية عند الأكل/الشرب" || 
        triggers.includes("المشروبات الباردة") || 
        triggers.includes("المشروبات الساخنة")) {
      return {
        condition: "حساسية الأسنان",
        severity: "mild",
        description: "تآكل مينا الأسنان أو انحسار اللثة يؤدي إلى كشف عاج السن",
        recommendations: [
          "معجون أسنان للحساسية (سنسوداين)",
          "فرشاة أسنان ناعمة",
          "تجنب الأطعمة الحمضية",
          "تجنب تنظيف الأسنان بقوة",
          "تطبيق فلورايد عند الطبيب"
        ],
        urgency: "خلال أسبوعين",
        shouldSeeDoctor: true
      };
    }

    if (painType === "ألم حاد ومفاجئ") {
      if (triggers.includes("الأطعمة الحلوة")) {
        return {
          condition: "تسوس الأسنان",
          severity: duration === "أكثر من شهر" ? "moderate" : "mild",
          description: "تآكل في بنية السن نتيجة الأحماض البكتيرية",
          recommendations: [
            "حشوة الأسنان عند الطبيب",
            "تقليل السكريات",
            "تنظيف الأسنان بعد كل وجبة",
            "استخدام خيط الأسنان",
            "فحص دوري كل 6 أشهر"
          ],
          urgency: duration === "أكثر من شهر" ? "خلال أيام" : "خلال أسبوع",
          shouldSeeDoctor: true
        };
      }
      
      return {
        condition: "التهاب في عصب السن",
        severity: "severe",
        description: "التهاب في لب السن يتطلب علاجاً سريعاً",
        recommendations: [
          "زيارة طبيب الأسنان فوراً",
          "قد تحتاج علاج جذور",
          "مسكنات ألم قوية",
          "مضاد حيوي إذا كان هناك عدوى",
          "تجنب المضغ على السن المصاب"
        ],
        urgency: "فوري - خلال 24-48 ساعة",
        shouldSeeDoctor: true
      };
    }

    if (answers.pain_location === "الفك") {
      return {
        condition: "اضطراب المفصل الصدغي الفكي (TMJ)",
        severity: "moderate",
        description: "مشكلة في مفصل الفك قد تكون بسبب الضغط أو طحن الأسنان",
        recommendations: [
          "كمادات دافئة على المفصل",
          "تجنب الأطعمة الصلبة",
          "تمارين الفك الخفيفة",
          "تقليل التوتر",
          "قد تحتاج إلى واقي أسنان ليلي"
        ],
        urgency: "خلال أسبوع",
        shouldSeeDoctor: true
      };
    }
  }

  // تشخيص عام
  return {
    condition: "مشكلة في الفم تتطلب فحصاً",
    severity: "moderate",
    description: "بناءً على الأعراض، يُنصح بزيارة طبيب الأسنان للفحص الدقيق",
    recommendations: [
      "حجز موعد مع طبيب أسنان",
      "تنظيف الأسنان بانتظام",
      "استخدام غسول الفم",
      "تجنب الأطعمة التي تزيد الألم",
      "مسكنات خفيفة عند الحاجة"
    ],
    urgency: "خلال أسبوع",
    shouldSeeDoctor: true
  };
};

const nearbyClinic = [
  {
    id: 1,
    name: "عيادة الأسنان المتطورة",
    doctor: "د. أحمد السيد",
    specialty: "أخصائي علاج الجذور",
    rating: 4.9,
    reviews: 156,
    distance: "1.2 كم",
    address: "شارع الملك فهد، الرياض",
    phone: "+966 50 123 4567",
    available: "اليوم - 3:00 م"
  },
  {
    id: 2,
    name: "مركز الابتسامة الطبي",
    doctor: "د. فاطمة محمد",
    specialty: "طب الأسنان التجميلي",
    rating: 4.8,
    reviews: 203,
    distance: "2.5 كم",
    address: "طريق العروبة، الرياض",
    phone: "+966 55 234 5678",
    available: "غداً - 10:00 ص"
  },
  {
    id: 3,
    name: "عيادة النخبة لطب الأسنان",
    doctor: "د. خالد العمري",
    specialty: "جراحة الفم والأسنان",
    rating: 4.7,
    reviews: 89,
    distance: "3.8 كم",
    address: "حي السليمانية، الرياض",
    phone: "+966 53 345 6789",
    available: "اليوم - 5:00 م"
  }
];

export default function AIDiagnosis() {
  const { language } = useI18n();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState("start");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const question = diagnosticQuestions[currentQuestion];

  const handleAnswer = (answer: any) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (question.next) {
      const nextQ = question.next(answer);
      if (nextQ === "result") {
        const diagnosis = analyzeSymptoms(newAnswers);
        setResult(diagnosis);
      } else {
        setCurrentQuestion(nextQ);
      }
    }
  };

  useEffect(() => {
    const state = location.state as { chiefComplaint?: string };
    if (state?.chiefComplaint && currentQuestion === "start") {
      handleAnswer(state.chiefComplaint);
    }
  }, [location.state]);

  const resetDiagnosis = () => {
    setCurrentQuestion("start");
    setAnswers({});
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "moderate": return "text-orange-700 bg-orange-100 border-orange-300";
      case "severe": return "text-red-700 bg-red-100 border-red-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "mild": return "خفيف";
      case "moderate": return "متوسط";
      case "severe": return "شديد - عاجل";
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  التشخيص الذكي
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>خوارزمية طبية</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                التشخيص المبني على الطرق التقليدية
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                سنطرح عليك مجموعة من الأسئلة التشخيصية لتحديد حالتك بدقة
              </p>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  السؤال {Object.keys(answers).length + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length} إجابة
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / 8) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {question.text}
                  </h2>
                  <p className="text-gray-600">
                    {question.type === "multiple" ? "يمكنك اختيار أكثر من إجابة" : "اختر إجابة واحدة"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {question.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (question.type === "multiple") {
                        const current = answers[currentQuestion] || [];
                        const updated = current.includes(option)
                          ? current.filter((o: string) => o !== option)
                          : [...current, option];
                        setAnswers({ ...answers, [currentQuestion]: updated });
                      } else {
                        handleAnswer(option);
                      }
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-right",
                      question.type === "multiple" && answers[currentQuestion]?.includes(option)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {question.type === "multiple" && (
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center",
                          answers[currentQuestion]?.includes(option)
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300"
                        )}>
                          {answers[currentQuestion]?.includes(option) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {question.type === "multiple" && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleAnswer(answers[currentQuestion] || [])}
                    disabled={!answers[currentQuestion]?.length}
                    className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              )}

              {Object.keys(answers).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      const keys = Object.keys(answers);
                      if (keys.length > 0) {
                        const lastKey = keys[keys.length - 1];
                        const newAnswers = { ...answers };
                        delete newAnswers[lastKey];
                        setAnswers(newAnswers);
                        setCurrentQuestion(lastKey);
                      }
                    }}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    ← السؤال السابق
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تم التشخيص بنجاح
              </h1>
              <p className="text-gray-600">
                إليك النتائج بناءً على الأعراض التي ذكرتها
              </p>
            </div>

            {/* Diagnosis */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">التشخيص المحتمل</h2>
                <span className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border-2",
                  getSeverityColor(result.severity)
                )}>
                  {getSeverityText(result.severity)}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-4">{result.condition}</h3>
              <p className="text-lg text-gray-700 mb-6">{result.description}</p>
              
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">وقت المراجعة الموصى به</p>
                    <p className="text-orange-600 font-bold">{result.urgency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">التوصيات العلاجية</h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Clinics */}
            {result.shouldSeeDoctor && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">عيادات موصى بها قريبة منك</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    عرض الخريطة
                  </button>
                </div>
                
                <div className="space-y-6">
                  {nearbyClinic.map((clinic) => (
                    <div key={clinic.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{clinic.name}</h3>
                          <p className="text-blue-600 font-medium mb-2">{clinic.doctor} - {clinic.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{clinic.rating} ({clinic.reviews} تقييم)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{clinic.distance}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {clinic.available}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{clinic.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                          حجز موعد
                        </button>
                        <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetDiagnosis}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                تشخيص جديد
              </button>
              <button className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                حفظ التقرير
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium mb-2">تنويه طبي مهم</p>
                  <p className="text-amber-700 text-sm">
                    هذا التشخيص مبني على خوارزمية طبية تقليدية ولا يغني عن استشارة طبيب مختص. 
                    يُنصح بزيارة طبيب الأسنان للفحص الدقيق والتشخيص النهائي. 
                    في حالات الطوارئ (ألم شديد، حمى، تورم كبير) يرجى التوجه فوراً إلى أقرب عيادة طوارئ.
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
