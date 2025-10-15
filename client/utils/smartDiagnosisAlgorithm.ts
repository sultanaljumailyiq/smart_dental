// خوارزمية التشخيص الطبية الذكية - Smart Medical Diagnosis Algorithm
// مبنية على نظام تسجيل النقاط المتقدم - Advanced Scoring System

export interface DiagnosisAnswer {
  questionId: string;
  answer: string | string[];
}

export interface DiagnosisResult {
  condition: string;
  conditionArabic: string;
  severity: "mild" | "moderate" | "severe" | "emergency";
  severityArabic: string;
  description: string;
  descriptionArabic: string;
  recommendations: string[];
  recommendationsArabic: string[];
  urgency: string;
  urgencyArabic: string;
  shouldSeeDoctor: boolean;
  specialtyNeeded: string;
  specialtyNeededArabic: string;
  score: number;
  maxScore: number;
}

// دالة حساب التشخيص الرئيسية - Main Diagnosis Calculator
export function calculateDiagnosis(
  symptomType: string,
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  
  switch (symptomType) {
    case "pain":
      return diagnosePain(answers, medicalConditions, age);
    case "gums":
      return diagnoseGums(answers, medicalConditions, age);
    case "cosmetic":
      return diagnoseCosmetic(answers, medicalConditions, age);
    case "lesion":
      return diagnoseLesion(answers, medicalConditions, age);
    case "other":
      return diagnoseOther(answers, medicalConditions, age);
    default:
      return getDefaultDiagnosis();
  }
}

// تشخيص ألم الأسنان - Tooth Pain Diagnosis
function diagnosePain(
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  let score = 0;
  const maxScore = 100;

  // تقييم شدة الألم (0-20 نقطة)
  const intensity = answers.pain_intensity as string;
  if (intensity?.includes("9-10")) score += 20;
  else if (intensity?.includes("7-8")) score += 16;
  else if (intensity?.includes("5-6")) score += 12;
  else if (intensity?.includes("3-4")) score += 8;
  else score += 4;

  // تقييم مدة الألم (0-15 نقطة)
  const onset = answers.pain_onset as string;
  if (onset?.includes("أكثر من أسبوعين")) score += 15;
  else if (onset?.includes("1-2 أسبوع")) score += 12;
  else if (onset?.includes("4-7 أيام")) score += 9;
  else if (onset?.includes("1-3 أيام")) score += 6;
  else score += 3;

  // تقييم المحفزات (0-15 نقطة)
  const triggers = answers.pain_triggers as string[];
  if (triggers?.includes("لمس المنطقة")) score += 5;
  if (triggers?.includes("مشروبات/أطعمة ساخنة") || triggers?.includes("مشروبات/أطعمة باردة")) score += 5;
  if (triggers?.includes("أطعمة حلوة")) score += 5;

  // تقييم النمط (0-15 نقطة)
  const pattern = answers.pain_pattern as string;
  if (pattern?.includes("ألم حاد طاعن")) score += 15;
  else if (pattern?.includes("ألم نابض")) score += 12;
  else if (pattern?.includes("ألم خفيف مستمر")) score += 8;
  else if (pattern?.includes("يأتي ويذهب")) score += 5;

  // تقييم التورم (0-15 نقطة)
  const swelling = answers.swelling_present as string;
  if (swelling?.includes("تورم شديد في الوجه")) score += 15;
  else if (swelling?.includes("تورم ملحوظ في الوجه")) score += 12;
  else if (swelling?.includes("تورم طفيف حول السن")) score += 6;

  // تقييم تأثير النوم (0-10 نقطة)
  const sleep = answers.sleep_disruption as string;
  if (sleep?.includes("لا أستطيع النوم")) score += 10;
  else if (sleep?.includes("يعطل النوم بشكل متكرر")) score += 7;
  else if (sleep?.includes("يوقظني أحياناً")) score += 4;

  // تقييم الأعراض المصاحبة (0-10 نقطة)
  const symptoms = answers.associated_symptoms as string[];
  if (symptoms?.includes("حمى")) score += 5;
  if (symptoms?.includes("صعوبة البلع") || symptoms?.includes("صعوبة فتح الفم")) score += 3;
  if (symptoms?.includes("طعم سيئ في الفم")) score += 2;

  // التشخيص بناءً على النقاط
  if (score >= 75 || swelling?.includes("تورم شديد") || symptoms?.includes("حمى")) {
    return {
      condition: "Dental Abscess or Severe Infection",
      conditionArabic: "خراج سني أو عدوى شديدة",
      severity: "emergency",
      severityArabic: "طارئ",
      description: "A severe bacterial infection requiring immediate medical attention to prevent spread",
      descriptionArabic: "عدوى بكتيرية شديدة تتطلب رعاية طبية فورية لمنع انتشارها",
      recommendations: [
        "Visit emergency dental care within hours",
        "Strong antibiotics (Amoxicillin + Clavulanic acid)",
        "Surgical drainage if needed",
        "Cold compresses to reduce swelling",
        "Strong pain medication (Ibuprofen 600mg + Paracetamol)"
      ],
      recommendationsArabic: [
        "زيارة طوارئ الأسنان خلال ساعات",
        "مضاد حيوي قوي (أموكسيسيلين + حمض الكلافولانيك)",
        "تصريف جراحي إذا لزم الأمر",
        "كمادات باردة لتقليل التورم",
        "مسكن ألم قوي (إيبوبروفين 600mg + باراسيتامول)"
      ],
      urgency: "Emergency - Within hours",
      urgencyArabic: "طوارئ - خلال ساعات",
      shouldSeeDoctor: true,
      specialtyNeeded: "Emergency Dental Care / Oral Surgeon",
      specialtyNeededArabic: "طوارئ أسنان / جراح فم",
      score,
      maxScore
    };
  } else if (score >= 50) {
    return {
      condition: "Pulpitis (Tooth Nerve Inflammation)",
      conditionArabic: "التهاب لب السن (التهاب عصب السن)",
      severity: "severe",
      severityArabic: "شديد",
      description: "Inflammation of the tooth pulp requiring urgent dental treatment",
      descriptionArabic: "التهاب في لب السن يتطلب علاج أسنان عاجل",
      recommendations: [
        "See dentist within 24-48 hours",
        "Root canal treatment likely needed",
        "Pain medication (Ibuprofen 400mg every 6 hours)",
        "Avoid hot/cold foods and drinks",
        "Antibiotics if infection suspected"
      ],
      recommendationsArabic: [
        "راجع طبيب الأسنان خلال 24-48 ساعة",
        "قد تحتاج لعلاج عصب (سحب العصب)",
        "مسكن ألم (إيبوبروفين 400mg كل 6 ساعات)",
        "تجنب الأطعمة والمشروبات الساخنة/الباردة",
        "مضاد حيوي إذا اشتبه بعدوى"
      ],
      urgency: "Urgent - Within 24-48 hours",
      urgencyArabic: "عاجل - خلال 24-48 ساعة",
      shouldSeeDoctor: true,
      specialtyNeeded: "Endodontist / General Dentist",
      specialtyNeededArabic: "أخصائي علاج عصب / طبيب أسنان عام",
      score,
      maxScore
    };
  } else if (score >= 30) {
    return {
      condition: "Dental Cavity or Reversible Pulpitis",
      conditionArabic: "تسوس أسنان أو التهاب لب قابل للعكس",
      severity: "moderate",
      severityArabic: "متوسط",
      description: "Tooth decay that requires dental filling to prevent progression",
      descriptionArabic: "تسوس في السن يحتاج حشوة لمنع تفاقمه",
      recommendations: [
        "Schedule dental appointment within a week",
        "Dental filling needed",
        "Use desensitizing toothpaste",
        "Avoid sugary foods and drinks",
        "Maintain good oral hygiene"
      ],
      recommendationsArabic: [
        "احجز موعد أسنان خلال أسبوع",
        "حشوة أسنان مطلوبة",
        "استخدم معجون أسنان للحساسية",
        "تجنب الأطعمة والمشروبات السكرية",
        "حافظ على نظافة فم جيدة"
      ],
      urgency: "Within a week",
      urgencyArabic: "خلال أسبوع",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist",
      specialtyNeededArabic: "طبيب أسنان عام",
      score,
      maxScore
    };
  } else {
    return {
      condition: "Tooth Sensitivity or Minor Irritation",
      conditionArabic: "حساسية أسنان أو تهيج بسيط",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Mild tooth sensitivity that can be managed with proper care",
      descriptionArabic: "حساسية أسنان خفيفة يمكن إدارتها بالرعاية المناسبة",
      recommendations: [
        "Use sensitivity toothpaste (Sensodyne)",
        "Soft-bristled toothbrush",
        "Avoid acidic foods and drinks",
        "Schedule routine dental checkup",
        "Monitor for any worsening symptoms"
      ],
      recommendationsArabic: [
        "استخدم معجون أسنان للحساسية (سنسوداين)",
        "فرشاة أسنان ناعمة",
        "تجنب الأطعمة والمشروبات الحمضية",
        "احجز فحص أسنان روتيني",
        "راقب أي تفاقم في الأعراض"
      ],
      urgency: "Routine checkup - within 2 weeks",
      urgencyArabic: "فحص روتيني - خلال أسبوعين",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist",
      specialtyNeededArabic: "طبيب أسنان عام",
      score,
      maxScore
    };
  }
}

// تشخيص مشاكل اللثة - Gum Problems Diagnosis
function diagnoseGums(
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  let score = 0;
  const maxScore = 100;

  // تقييم تكرار النزيف (0-20 نقطة)
  const frequency = answers.bleeding_frequency as string;
  if (frequency?.includes("باستمرار")) score += 20;
  else if (frequency?.includes("عدة مرات يومياً")) score += 16;
  else if (frequency?.includes("يومياً بدون سبب")) score += 12;
  else if (frequency?.includes("أحياناً أثناء الأكل")) score += 8;
  else score += 4;

  // تقييم كمية النزيف (0-15 نقطة)
  const amount = answers.bleeding_amount as string;
  if (amount?.includes("جلطات دموية")) score += 15;
  else if (amount?.includes("نزيف غزير")) score += 12;
  else if (amount?.includes("دم أحمر ملحوظ")) score += 8;
  else score += 4;

  // تقييم لون اللثة (0-15 نقطة)
  const color = answers.gum_color as string;
  if (color?.includes("أرجواني/مزرق")) score += 15;
  else if (color?.includes("أحمر داكن")) score += 12;
  else if (color?.includes("أحمر فاتح")) score += 8;
  else if (color?.includes("بقع بيضاء")) score += 6;

  // تقييم ملمس اللثة (0-15 نقطة)
  const texture = answers.gum_texture as string;
  if (texture?.includes("مؤلمة جداً")) score += 15;
  else if (texture?.includes("حساسة عند اللمس")) score += 10;
  else if (texture?.includes("منتفخة ومنفوخة")) score += 8;
  else if (texture?.includes("خدر أو وخز")) score += 6;

  // تقييم انحسار اللثة (0-15 نقطة)
  const recession = answers.gum_recession as string;
  if (recession?.includes("انحسار شديد") || recession?.includes("الأسنان تبدو أطول")) score += 15;
  else if (recession?.includes("انحسار ملحوظ في عدة أسنان")) score += 10;
  else if (recession?.includes("انحسار طفيف في بعض الأسنان")) score += 5;

  // تقييم ارتخاء الأسنان (0-10 نقطة)
  const loose = answers.loose_teeth as string;
  if (loose?.includes("الأسنان تحركت من موضعها") || loose?.includes("أسنان مرتخية جداً")) score += 10;
  else if (loose?.includes("عدة أسنان مرتخية")) score += 7;
  else if (loose?.includes("1-2 سن مرتخ قليلاً")) score += 3;

  // تقييم النظافة (0-5 نقطة عكسية - سوء النظافة يزيد النقاط)
  const hygiene = answers.oral_hygiene as string;
  if (hygiene?.includes("نادراً ما أنظف")) score += 5;
  else if (hygiene?.includes("تنظيف غير منتظم")) score += 3;
  else if (hygiene?.includes("تنظيف مرة يومياً")) score += 1;

  // تقييم التدخين (0-5 نقطة)
  const smoking = answers.smoking_history as string;
  if (smoking?.includes("مستخدم تبغ بكثرة")) score += 5;
  else if (smoking?.includes("مدخن حالياً")) score += 3;
  else if (smoking?.includes("أقلع مؤخراً")) score += 1;

  // التشخيص بناءً على النقاط
  if (score >= 70 || loose?.includes("أسنان مرتخية جداً")) {
    return {
      condition: "Advanced Periodontitis",
      conditionArabic: "التهاب دواعم الأسنان المتقدم",
      severity: "severe",
      severityArabic: "شديد",
      description: "Severe gum disease with potential tooth loss, requiring immediate specialist care",
      descriptionArabic: "مرض لثة شديد مع احتمال فقدان الأسنان، يتطلب رعاية أخصائي فورية",
      recommendations: [
        "See periodontist urgently within days",
        "Deep cleaning (scaling and root planing)",
        "Possible antibiotic therapy",
        "Surgical intervention may be needed",
        "Quit smoking immediately",
        "Intensive oral hygiene protocol"
      ],
      recommendationsArabic: [
        "راجع أخصائي لثة بشكل عاجل خلال أيام",
        "تنظيف عميق (تقليح وتسوية جذور)",
        "علاج مضاد حيوي محتمل",
        "قد تحتاج تدخل جراحي",
        "أقلع عن التدخين فوراً",
        "بروتوكول نظافة فم مكثف"
      ],
      urgency: "Urgent - Within 2-3 days",
      urgencyArabic: "عاجل - خلال 2-3 أيام",
      shouldSeeDoctor: true,
      specialtyNeeded: "Periodontist (Gum Specialist)",
      specialtyNeededArabic: "أخصائي أمراض لثة",
      score,
      maxScore
    };
  } else if (score >= 45) {
    return {
      condition: "Moderate Gingivitis/Periodontitis",
      conditionArabic: "التهاب لثة/دواعم أسنان متوسط",
      severity: "moderate",
      severityArabic: "متوسط",
      description: "Gum inflammation requiring professional dental care",
      descriptionArabic: "التهاب لثة يحتاج رعاية أسنان احترافية",
      recommendations: [
        "Professional dental cleaning within a week",
        "Antiseptic mouthwash (Chlorhexidine 0.12%)",
        "Brush twice daily with soft brush",
        "Daily flossing gently",
        "Quit smoking if applicable",
        "Follow-up in 2-4 weeks"
      ],
      recommendationsArabic: [
        "تنظيف أسنان احترافي خلال أسبوع",
        "غسول فم مطهر (كلورهيكسيدين 0.12%)",
        "تنظيف مرتين يومياً بفرشاة ناعمة",
        "استخدام خيط يومياً برفق",
        "أقلع عن التدخين إن أمكن",
        "متابعة خلال 2-4 أسابيع"
      ],
      urgency: "Within a week",
      urgencyArabic: "خلال أسبوع",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist / Periodontist",
      specialtyNeededArabic: "طبيب أسنان عام / أخصائي لثة",
      score,
      maxScore
    };
  } else {
    return {
      condition: "Mild Gingivitis",
      conditionArabic: "التهاب لثة خفيف",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Mild gum inflammation that can be reversed with improved oral hygiene",
      descriptionArabic: "التهاب لثة خفيف يمكن عكسه بتحسين نظافة الفم",
      recommendations: [
        "Improve brushing technique - twice daily minimum",
        "Start daily flossing",
        "Use antiseptic mouthwash",
        "Schedule dental cleaning",
        "Monitor improvement over 2 weeks"
      ],
      recommendationsArabic: [
        "حسّن تقنية التنظيف - مرتين يومياً كحد أدنى",
        "ابدأ باستخدام خيط الأسنان يومياً",
        "استخدم غسول فم مطهر",
        "احجز موعد تنظيف أسنان",
        "راقب التحسن خلال أسبوعين"
      ],
      urgency: "Routine checkup - within 2 weeks",
      urgencyArabic: "فحص روتيني - خلال أسبوعين",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist / Dental Hygienist",
      specialtyNeededArabic: "طبيب أسنان عام / أخصائي صحة فم",
      score,
      maxScore
    };
  }
}

// تشخيص المشاكل التجميلية - Cosmetic Issues Diagnosis
function diagnoseCosmetic(
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  const concern = answers.main_concern as string;
  const confidence = answers.smile_confidence as string;
  const alignment = answers.tooth_alignment as string;
  const bite = answers.bite_issues as string;
  const budget = answers.budget_timeline as string;
  const impact = answers.lifestyle_impact as string;

  let score = 0;
  const maxScore = 100;

  // تقييم الثقة والتأثير النفسي (0-30 نقطة)
  if (confidence?.includes("واعٍ بالذات للغاية")) score += 15;
  else if (confidence?.includes("أتجنب الابتسام")) score += 12;
  else if (confidence?.includes("غير واثق كثيراً")) score += 8;

  if (impact?.includes("ضيق عاطفي كبير")) score += 15;
  else if (impact?.includes("يؤثر على العمل/العلاقات")) score += 10;
  else if (impact?.includes("أتجنب الصور/المناسبات")) score += 5;

  // تحديد نوع المشكلة والعلاج المناسب
  if (concern?.includes("لون/تصبغات الأسنان")) {
    return {
      condition: "Tooth Discoloration/Staining",
      conditionArabic: "تلون/تصبغات الأسنان",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Cosmetic issue affecting tooth color that can be improved",
      descriptionArabic: "مشكلة تجميلية تؤثر على لون الأسنان يمكن تحسينها",
      recommendations: [
        "Professional teeth cleaning",
        "In-office whitening treatment",
        "At-home whitening kits (dentist-supervised)",
        "Reduce coffee, tea, and smoking",
        "Veneers for severe cases"
      ],
      recommendationsArabic: [
        "تنظيف أسنان احترافي",
        "تبييض أسنان في العيادة",
        "أطقم تبييض منزلية (بإشراف طبيب)",
        "قلل القهوة، الشاي، والتدخين",
        "قشور تجميلية للحالات الشديدة"
      ],
      urgency: "Cosmetic - Schedule at convenience",
      urgencyArabic: "تجميلي - حدد موعد حسب الراحة",
      shouldSeeDoctor: true,
      specialtyNeeded: "Cosmetic Dentist",
      specialtyNeededArabic: "طبيب أسنان تجميلي",
      score,
      maxScore
    };
  } else if (concern?.includes("أسنان معوجة أو غير منتظمة") || concern?.includes("فراغات بين الأسنان")) {
    return {
      condition: "Malocclusion / Misaligned Teeth",
      conditionArabic: "سوء إطباق / أسنان غير منتظمة",
      severity: bite?.includes("طبيعية") ? "mild" : "moderate",
      severityArabic: bite?.includes("طبيعية") ? "خفيف" : "متوسط",
      description: "Teeth alignment issue requiring orthodontic consultation",
      descriptionArabic: "مشكلة اصطفاف أسنان تحتاج استشارة تقويم",
      recommendations: [
        "Orthodontic consultation",
        "Panoramic X-ray evaluation",
        "Treatment options: traditional braces, clear aligners (Invisalign)",
        "Treatment duration: 12-24 months typically",
        "Payment plans usually available"
      ],
      recommendationsArabic: [
        "استشارة أخصائي تقويم أسنان",
        "تقييم بأشعة بانورامية",
        "خيارات العلاج: تقويم تقليدي، تقويم شفاف (إنفزلاين)",
        "مدة العلاج: عادة 12-24 شهر",
        "خطط دفع متوفرة عادة"
      ],
      urgency: "Cosmetic/Functional - Schedule consultation",
      urgencyArabic: "تجميلي/وظيفي - احجز استشارة",
      shouldSeeDoctor: true,
      specialtyNeeded: "Orthodontist",
      specialtyNeededArabic: "أخصائي تقويم أسنان",
      score,
      maxScore
    };
  } else if (concern?.includes("أسنان مكسورة أو مشروخة")) {
    return {
      condition: "Chipped/Broken Teeth",
      conditionArabic: "أسنان مكسورة/مشروخة",
      severity: "moderate",
      severityArabic: "متوسط",
      description: "Structural damage requiring restoration",
      descriptionArabic: "تلف هيكلي يحتاج ترميم",
      recommendations: [
        "Dental bonding for minor chips",
        "Veneers for front teeth",
        "Crowns for severe damage",
        "Root canal if nerve exposed",
        "Schedule appointment within days"
      ],
      recommendationsArabic: [
        "لصق تجميلي للكسور البسيطة",
        "قشور للأسنان الأمامية",
        "تيجان للتلف الشديد",
        "علاج عصب إذا كان العصب مكشوف",
        "احجز موعد خلال أيام"
      ],
      urgency: "Within a few days",
      urgencyArabic: "خلال أيام قليلة",
      shouldSeeDoctor: true,
      specialtyNeeded: "Cosmetic/Restorative Dentist",
      specialtyNeededArabic: "طبيب أسنان تجميلي/ترميمي",
      score,
      maxScore
    };
  }

  return getDefaultDiagnosis();
}

// تشخيص الآفات والبقع - Lesions Diagnosis
function diagnoseLesion(
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  let score = 0;
  const maxScore = 100;

  const appearance = answers.lesion_appearance as string;
  const duration = answers.lesion_duration as string;
  const size = answers.lesion_size as string;
  const pain = answers.lesion_pain as string;
  const changes = answers.lesion_changes as string;
  const bleeding = answers.bleeding_lesion as string;
  const riskFactors = answers.risk_factors as string[];

  // تقييم المدة (0-25 نقطة) - أطول مدة = أخطر
  if (duration?.includes("أكثر من 3 أشهر")) score += 25;
  else if (duration?.includes("1-3 أشهر")) score += 20;
  else if (duration?.includes("2-4 أسابيع")) score += 15;
  else if (duration?.includes("1-2 أسبوع")) score += 10;
  else score += 5;

  // تقييم الحجم (0-20 نقطة)
  if (size?.includes("كبيرة جداً")) score += 20;
  else if (size?.includes("كبيرة")) score += 15;
  else if (size?.includes("متوسطة")) score += 10;
  else if (size?.includes("صغيرة")) score += 5;

  // تقييم المظهر (0-20 نقطة)
  if (appearance?.includes("قرحة/تقرح مفتوح")) score += 20;
  else if (appearance?.includes("أحمر وأبيض مختلط")) score += 15;
  else if (appearance?.includes("بقعة داكنة/سوداء")) score += 12;
  else if (appearance?.includes("نتوء مرتفع")) score += 10;
  else if (appearance?.includes("بقعة بيضاء")) score += 8;

  // تقييم التغيرات (0-15 نقطة)
  if (changes?.includes("تغييرات متعددة") || changes?.includes("تكبر")) score += 15;
  else if (changes?.includes("تغيرات في اللون") || changes?.includes("تغيرات في الملمس")) score += 10;
  else if (changes?.includes("تصغر")) score += 3;

  // تقييم النزيف (0-10 نقطة)
  if (bleeding?.includes("نزيف تلقائي") || bleeding?.includes("إفراز مستمر")) score += 10;
  else if (bleeding?.includes("تنزف عند الأكل")) score += 7;
  else if (bleeding?.includes("تنزف عند اللمس")) score += 4;

  // عوامل الخطر (0-10 نقطة)
  if (riskFactors?.includes("استخدام التبغ")) score += 3;
  if (riskFactors?.includes("استهلاك كحول بكثرة")) score += 3;
  if (riskFactors?.includes("تاريخ عائلي لسرطان الفم")) score += 4;

  // التشخيص بناءً على النقاط
  if (score >= 60 || (duration?.includes("أكثر من 3 أشهر") && riskFactors?.includes("استخدام التبغ"))) {
    return {
      condition: "Suspicious Oral Lesion - Requires Biopsy",
      conditionArabic: "آفة فموية مشبوهة - تحتاج خزعة",
      severity: "severe",
      severityArabic: "شديد",
      description: "Oral lesion with concerning features requiring immediate specialist evaluation and biopsy",
      descriptionArabic: "آفة فموية بمظاهر مقلقة تتطلب تقييم أخصائي فوري وخزعة",
      recommendations: [
        "URGENT: See oral surgeon/pathologist within 2-3 days",
        "Biopsy required for diagnosis",
        "Stop all tobacco and alcohol use immediately",
        "Document changes with photos",
        "Do not delay - early detection is critical"
      ],
      recommendationsArabic: [
        "عاجل: راجع جراح فم/أخصائي أمراض خلال 2-3 أيام",
        "خزعة مطلوبة للتشخيص",
        "أوقف كل استخدام للتبغ والكحول فوراً",
        "وثّق التغيرات بالصور",
        "لا تؤجل - الكشف المبكر حرج"
      ],
      urgency: "URGENT - Within 2-3 days",
      urgencyArabic: "عاجل - خلال 2-3 أيام",
      shouldSeeDoctor: true,
      specialtyNeeded: "Oral Surgeon / Oral Pathologist",
      specialtyNeededArabic: "جراح فم / أخصائي أمراض فم",
      score,
      maxScore
    };
  } else if (score >= 35) {
    return {
      condition: "Oral Lesion - Needs Professional Evaluation",
      conditionArabic: "آفة فموية - تحتاج تقييم احترافي",
      severity: "moderate",
      severityArabic: "متوسط",
      description: "Oral lesion requiring dental/medical evaluation",
      descriptionArabic: "آفة فموية تحتاج تقييم طبي/أسنان",
      recommendations: [
        "See dentist or oral medicine specialist within a week",
        "May need biopsy if persists > 2 weeks",
        "Avoid irritants (spicy, acidic foods)",
        "Antiseptic mouth rinse",
        "Monitor for any changes"
      ],
      recommendationsArabic: [
        "راجع طبيب أسنان أو أخصائي طب فم خلال أسبوع",
        "قد تحتاج خزعة إذا استمرت > أسبوعين",
        "تجنب المهيجات (أطعمة حارة، حمضية)",
        "غسول فم مطهر",
        "راقب أي تغيرات"
      ],
      urgency: "Within a week",
      urgencyArabic: "خلال أسبوع",
      shouldSeeDoctor: true,
      specialtyNeeded: "Dentist / Oral Medicine Specialist",
      specialtyNeededArabic: "طبيب أسنان / أخصائي طب فم",
      score,
      maxScore
    };
  } else {
    return {
      condition: "Minor Oral Lesion (Likely Aphthous Ulcer/Canker Sore)",
      conditionArabic: "آفة فموية بسيطة (على الأرجح قرحة قلاعية)",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Minor oral ulcer that should heal with proper care",
      descriptionArabic: "قرحة فموية بسيطة يجب أن تشفى بالرعاية المناسبة",
      recommendations: [
        "Topical anesthetic gel (benzocaine)",
        "Saltwater rinses 3-4 times daily",
        "Avoid spicy, acidic, and rough foods",
        "B12 and folic acid supplements",
        "See dentist if not healed in 2 weeks"
      ],
      recommendationsArabic: [
        "جل مخدر موضعي (بنزوكائين)",
        "مضمضة ماء وملح 3-4 مرات يومياً",
        "تجنب الأطعمة الحارة، الحمضية، والخشنة",
        "مكملات فيتامين B12 وحمض الفوليك",
        "راجع طبيب إذا لم تشفى خلال أسبوعين"
      ],
      urgency: "Monitor - see doctor if persists > 2 weeks",
      urgencyArabic: "راقب - راجع طبيب إذا استمرت > أسبوعين",
      shouldSeeDoctor: false,
      specialtyNeeded: "Self-care / General Dentist if persists",
      specialtyNeededArabic: "رعاية ذاتية / طبيب أسنان إذا استمرت",
      score,
      maxScore
    };
  }
}

// تشخيص المشاكل الأخرى - Other Issues Diagnosis
function diagnoseOther(
  answers: Record<string, string | string[]>,
  medicalConditions: string[],
  age: string
): DiagnosisResult {
  const complaint = answers.primary_complaint as string;
  const duration = answers.symptom_duration as string;
  const severity = answers.symptom_severity as string;
  const urgency = answers.urgency_level as string;

  // تشخيص بناءً على الشكوى الرئيسية
  if (complaint?.includes("ألم فك/TMJ") || complaint?.includes("طقطقة الفك")) {
    return {
      condition: "TMJ Disorder (Temporomandibular Joint Dysfunction)",
      conditionArabic: "اضطراب المفصل الفكي الصدغي (TMJ)",
      severity: severity?.includes("شديد") ? "moderate" : "mild",
      severityArabic: severity?.includes("شديد") ? "متوسط" : "خفيف",
      description: "Jaw joint disorder causing pain and clicking",
      descriptionArabic: "اضطراب مفصل الفك يسبب ألم وطقطقة",
      recommendations: [
        "See dentist or TMJ specialist",
        "Jaw exercises and physical therapy",
        "Avoid hard/chewy foods",
        "Stress management techniques",
        "Night guard if grinding teeth",
        "Anti-inflammatory medication"
      ],
      recommendationsArabic: [
        "راجع طبيب أسنان أو أخصائي TMJ",
        "تمارين فك وعلاج طبيعي",
        "تجنب الأطعمة الصلبة/المطاطية",
        "تقنيات إدارة التوتر",
        "واقي ليلي إذا كنت تطحن أسنانك",
        "دواء مضاد للالتهاب"
      ],
      urgency: "Within 1-2 weeks",
      urgencyArabic: "خلال 1-2 أسبوع",
      shouldSeeDoctor: true,
      specialtyNeeded: "Dentist / TMJ Specialist",
      specialtyNeededArabic: "طبيب أسنان / أخصائي TMJ",
      score: 50,
      maxScore: 100
    };
  } else if (complaint?.includes("جفاف الفم")) {
    return {
      condition: "Xerostomia (Dry Mouth)",
      conditionArabic: "جفاف الفم (زيروستوميا)",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Reduced saliva production causing dry mouth",
      descriptionArabic: "انخفاض إنتاج اللعاب يسبب جفاف الفم",
      recommendations: [
        "Increase water intake",
        "Sugar-free gum or candy to stimulate saliva",
        "Avoid caffeine, alcohol, and tobacco",
        "Use saliva substitutes/mouth moisturizers",
        "See dentist to check medications",
        "Fluoride treatment to prevent cavities"
      ],
      recommendationsArabic: [
        "زد من شرب الماء",
        "علكة أو حلوى خالية من السكر لتحفيز اللعاب",
        "تجنب الكافيين، الكحول، والتبغ",
        "استخدم بدائل لعاب/مرطبات فم",
        "راجع طبيب أسنان لفحص الأدوية",
        "علاج فلورايد لمنع التسوس"
      ],
      urgency: "Routine checkup",
      urgencyArabic: "فحص روتيني",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist",
      specialtyNeededArabic: "طبيب أسنان عام",
      score: 30,
      maxScore: 100
    };
  } else if (complaint?.includes("رائحة فم كريهة")) {
    return {
      condition: "Chronic Halitosis (Bad Breath)",
      conditionArabic: "رائحة فم مزمنة (هاليتوسيس)",
      severity: "mild",
      severityArabic: "خفيف",
      description: "Persistent bad breath requiring dental evaluation",
      descriptionArabic: "رائحة فم مستمرة تحتاج تقييم أسنان",
      recommendations: [
        "Professional dental cleaning",
        "Treat any gum disease or cavities",
        "Brush tongue daily",
        "Antibacterial mouthwash",
        "Stay hydrated",
        "May need medical evaluation if dental causes ruled out"
      ],
      recommendationsArabic: [
        "تنظيف أسنان احترافي",
        "علاج أي مرض لثة أو تسوس",
        "نظف اللسان يومياً",
        "غسول فم مضاد للبكتيريا",
        "حافظ على الترطيب",
        "قد تحتاج تقييم طبي إذا استُبعدت أسباب الأسنان"
      ],
      urgency: "Within 1-2 weeks",
      urgencyArabic: "خلال 1-2 أسبوع",
      shouldSeeDoctor: true,
      specialtyNeeded: "General Dentist",
      specialtyNeededArabic: "طبيب أسنان عام",
      score: 35,
      maxScore: 100
    };
  }

  return getDefaultDiagnosis();
}

// تشخيص افتراضي - Default Diagnosis
function getDefaultDiagnosis(): DiagnosisResult {
  return {
    condition: "General Dental Concern",
    conditionArabic: "قلق أسنان عام",
    severity: "mild",
    severityArabic: "خفيف",
    description: "Dental concern requiring professional evaluation",
    descriptionArabic: "قلق أسنان يحتاج تقييم احترافي",
    recommendations: [
      "Schedule dental appointment",
      "Maintain good oral hygiene",
      "Brush twice daily",
      "Floss daily",
      "Use fluoride toothpaste"
    ],
    recommendationsArabic: [
      "احجز موعد أسنان",
      "حافظ على نظافة فم جيدة",
      "نظف مرتين يومياً",
      "استخدم خيط يومياً",
      "استخدم معجون بالفلورايد"
    ],
    urgency: "Routine checkup",
    urgencyArabic: "فحص روتيني",
    shouldSeeDoctor: true,
    specialtyNeeded: "General Dentist",
    specialtyNeededArabic: "طبيب أسنان عام",
    score: 25,
    maxScore: 100
  };
}

// دالة مساعدة لتحديد مستوى الخطورة بناءً على النقاط
export function getSeverityLevel(score: number, maxScore: number): "mild" | "moderate" | "severe" | "emergency" {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 85) return "emergency";
  if (percentage >= 65) return "severe";
  if (percentage >= 40) return "moderate";
  return "mild";
}

// دالة للحصول على لون مؤشر الخطورة
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "emergency":
      return "text-red-600 bg-red-50";
    case "severe":
      return "text-orange-600 bg-orange-50";
    case "moderate":
      return "text-yellow-600 bg-yellow-50";
    case "mild":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
