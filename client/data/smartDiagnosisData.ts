// نظام التشخيص الذكي الشامل - مبني على خوارزمية طبية متقدمة
// Smart Diagnosis System - Based on Advanced Medical Algorithm

export interface DiagnosticSymptom {
  id: string;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  arabicQuestion: string;
  type: "radio" | "checkbox";
  options: string[];
  arabicOptions: string[];
}

export interface DiagnosticFlow {
  [key: string]: DiagnosticQuestion[];
}

// الأعراض الرئيسية - Primary Symptoms
export const PRIMARY_SYMPTOMS: DiagnosticSymptom[] = [
  {
    id: "pain",
    label: "Tooth Pain",
    arabicLabel: "🦷 ألم الأسنان",
    description: "Sharp, dull, or throbbing pain",
    arabicDescription: "ألم حاد أو خفيف أو نابض"
  },
  {
    id: "gums",
    label: "Bleeding Gums",
    arabicLabel: "🫸 نزيف اللثة",
    description: "Gum bleeding, swelling, or tenderness",
    arabicDescription: "نزيف، تورم، أو ألم في اللثة"
  },
  {
    id: "cosmetic",
    label: "Cosmetic Concerns",
    arabicLabel: "😬 مشاكل تجميلية",
    description: "Appearance, gaps, or alignment issues",
    arabicDescription: "مظهر، فراغات، أو مشاكل في الاصطفاف"
  },
  {
    id: "lesion",
    label: "Spots or Lesions",
    arabicLabel: "⚠️ بقع أو آفات",
    description: "White/red patches, bumps, or sores",
    arabicDescription: "بقع بيضاء/حمراء، انتفاخات، أو تقرحات"
  },
  {
    id: "other",
    label: "Other Issues",
    arabicLabel: "❓ مشاكل أخرى",
    description: "Something else or not sure",
    arabicDescription: "شيء آخر أو غير متأكد"
  }
];

// الفئات العمرية - Age Ranges
export const AGE_RANGES = ["0-18", "19-30", "31-50", "فوق 50"];

// الجنس - Gender
export const GENDER_OPTIONS = ["ذكر", "أنثى", "أفضل عدم الإفصاح"];

// الحالات الصحية العامة - Medical Conditions
export const MEDICAL_CONDITIONS = [
  "السكري",
  "ارتفاع ضغط الدم",
  "أمراض القلب",
  "الربو",
  "اضطرابات الغدة الدرقية",
  "اضطرابات تخثر الدم",
  "ضعف المناعة",
  "لا يوجد"
];

// أسئلة تشخيص ألم الأسنان - Tooth Pain Diagnostic Questions
export const PAIN_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "pain_location",
    question: "Where exactly is the pain located?",
    arabicQuestion: "أين يقع الألم بالتحديد؟",
    type: "radio",
    options: ["Upper front teeth", "Upper back teeth", "Lower front teeth", "Lower back teeth", "Multiple areas", "Entire mouth"],
    arabicOptions: ["الأسنان الأمامية العلوية", "الأضراس الخلفية العلوية", "الأسنان الأمامية السفلية", "الأضراس الخلفية السفلية", "مناطق متعددة", "الفم بالكامل"]
  },
  {
    id: "pain_intensity",
    question: "How would you rate your pain intensity?",
    arabicQuestion: "كيف تقيّم شدة الألم؟",
    type: "radio",
    options: ["1-2 (Mild)", "3-4 (Moderate)", "5-6 (Strong)", "7-8 (Severe)", "9-10 (Unbearable)"],
    arabicOptions: ["1-2 (خفيف)", "3-4 (متوسط)", "5-6 (قوي)", "7-8 (شديد)", "9-10 (لا يُحتمل)"]
  },
  {
    id: "pain_onset",
    question: "When did the pain start?",
    arabicQuestion: "متى بدأ الألم؟",
    type: "radio",
    options: ["Less than 24 hours ago", "1-3 days ago", "4-7 days ago", "1-2 weeks ago", "More than 2 weeks ago"],
    arabicOptions: ["منذ أقل من 24 ساعة", "منذ 1-3 أيام", "منذ 4-7 أيام", "منذ 1-2 أسبوع", "أكثر من أسبوعين"]
  },
  {
    id: "pain_triggers",
    question: "What makes the pain worse?",
    arabicQuestion: "ما الذي يزيد الألم سوءاً؟",
    type: "checkbox",
    options: ["Hot drinks/food", "Cold drinks/food", "Sweet foods", "Chewing", "Biting down", "Touching the area", "Nothing specific"],
    arabicOptions: ["مشروبات/أطعمة ساخنة", "مشروبات/أطعمة باردة", "أطعمة حلوة", "المضغ", "العض", "لمس المنطقة", "لا شيء محدد"]
  },
  {
    id: "pain_relief",
    question: "What helps relieve the pain?",
    arabicQuestion: "ما الذي يخفف الألم؟",
    type: "checkbox",
    options: ["Pain medication", "Cold compress", "Warm compress", "Avoiding certain foods", "Rinsing with salt water", "Nothing helps"],
    arabicOptions: ["مسكنات الألم", "كمادات باردة", "كمادات دافئة", "تجنب أطعمة معينة", "المضمضة بماء وملح", "لا شيء يساعد"]
  },
  {
    id: "pain_pattern",
    question: "How would you describe the pain pattern?",
    arabicQuestion: "كيف تصف نمط الألم؟",
    type: "radio",
    options: ["Constant dull ache", "Sharp stabbing pain", "Throbbing pain", "Comes and goes", "Only when touching/chewing"],
    arabicOptions: ["ألم خفيف مستمر", "ألم حاد طاعن", "ألم نابض", "يأتي ويذهب", "فقط عند اللمس/المضغ"]
  },
  {
    id: "swelling_present",
    question: "Do you notice any swelling?",
    arabicQuestion: "هل تلاحظ أي تورم؟",
    type: "radio",
    options: ["No swelling", "Slight swelling around the tooth", "Noticeable facial swelling", "Severe facial swelling"],
    arabicOptions: ["لا يوجد تورم", "تورم طفيف حول السن", "تورم ملحوظ في الوجه", "تورم شديد في الوجه"]
  },
  {
    id: "sleep_disruption",
    question: "Does the pain affect your sleep?",
    arabicQuestion: "هل يؤثر الألم على نومك؟",
    type: "radio",
    options: ["No, I sleep normally", "Occasionally wakes me up", "Frequently disrupts sleep", "Cannot sleep due to pain"],
    arabicOptions: ["لا، أنام بشكل طبيعي", "يوقظني أحياناً", "يعطل النوم بشكل متكرر", "لا أستطيع النوم بسبب الألم"]
  },
  {
    id: "recent_dental_work",
    question: "Have you had any recent dental work?",
    arabicQuestion: "هل خضعت لأي عمل أسنان مؤخراً؟",
    type: "radio",
    options: ["No recent dental work", "Filling within last month", "Crown/cap within last month", "Root canal within last month", "Extraction nearby", "Cleaning within last week"],
    arabicOptions: ["لا يوجد عمل أسنان مؤخراً", "حشوة خلال الشهر الماضي", "تاج/تلبيسة خلال الشهر الماضي", "علاج عصب خلال الشهر الماضي", "خلع سن قريب", "تنظيف خلال الأسبوع الماضي"]
  },
  {
    id: "associated_symptoms",
    question: "Are you experiencing any other symptoms?",
    arabicQuestion: "هل تعاني من أي أعراض أخرى؟",
    type: "checkbox",
    options: ["Bad taste in mouth", "Fever", "Difficulty opening mouth", "Difficulty swallowing", "Ear pain", "Headache", "None of the above"],
    arabicOptions: ["طعم سيئ في الفم", "حمى", "صعوبة فتح الفم", "صعوبة البلع", "ألم في الأذن", "صداع", "لا شيء مما سبق"]
  }
];

// أسئلة تشخيص نزيف اللثة - Gum Bleeding Questions
export const GUM_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "bleeding_frequency",
    question: "How often do your gums bleed?",
    arabicQuestion: "كم مرة تنزف لثتك؟",
    type: "radio",
    options: ["Only when brushing/flossing", "Occasionally during eating", "Daily without trigger", "Multiple times per day", "Constantly"],
    arabicOptions: ["فقط عند التنظيف/الخيط", "أحياناً أثناء الأكل", "يومياً بدون سبب", "عدة مرات يومياً", "باستمرار"]
  },
  {
    id: "bleeding_amount",
    question: "How much bleeding do you notice?",
    arabicQuestion: "ما مقدار النزيف الذي تلاحظه؟",
    type: "radio",
    options: ["Light pink when spitting", "Noticeable red blood", "Heavy bleeding", "Blood clots present"],
    arabicOptions: ["وردي فاتح عند البصق", "دم أحمر ملحوظ", "نزيف غزير", "وجود جلطات دموية"]
  },
  {
    id: "gum_color",
    question: "What color are your gums?",
    arabicQuestion: "ما لون لثتك؟",
    type: "radio",
    options: ["Normal pink", "Dark red", "Bright red", "Purple/bluish", "White patches", "Mix of colors"],
    arabicOptions: ["وردي طبيعي", "أحمر داكن", "أحمر فاتح", "أرجواني/مزرق", "بقع بيضاء", "خليط من الألوان"]
  },
  {
    id: "gum_texture",
    question: "How do your gums feel?",
    arabicQuestion: "كيف تشعر بلثتك؟",
    type: "radio",
    options: ["Normal and firm", "Swollen and puffy", "Tender to touch", "Very painful", "Numb or tingling"],
    arabicOptions: ["طبيعية وثابتة", "منتفخة ومنفوخة", "حساسة عند اللمس", "مؤلمة جداً", "خدر أو وخز"]
  },
  {
    id: "bad_breath",
    question: "Do you have persistent bad breath?",
    arabicQuestion: "هل لديك رائحة فم مستمرة؟",
    type: "radio",
    options: ["No bad breath issues", "Occasional bad breath", "Daily bad breath", "Severe halitosis", "Metallic taste"],
    arabicOptions: ["لا توجد مشكلة رائحة", "رائحة أحياناً", "رائحة يومية", "رائحة شديدة", "طعم معدني"]
  },
  {
    id: "gum_recession",
    question: "Have you noticed gums pulling away from teeth?",
    arabicQuestion: "هل لاحظت انحسار اللثة عن الأسنان؟",
    type: "radio",
    options: ["No recession", "Slight recession on few teeth", "Noticeable recession multiple teeth", "Severe recession", "Teeth look longer than before"],
    arabicOptions: ["لا يوجد انحسار", "انحسار طفيف في بعض الأسنان", "انحسار ملحوظ في عدة أسنان", "انحسار شديد", "الأسنان تبدو أطول من قبل"]
  },
  {
    id: "loose_teeth",
    question: "Do any teeth feel loose?",
    arabicQuestion: "هل تشعر بأي أسنان مرتخية؟",
    type: "radio",
    options: ["All teeth feel secure", "1-2 teeth slightly loose", "Multiple loose teeth", "Very loose teeth", "Teeth have shifted position"],
    arabicOptions: ["جميع الأسنان ثابتة", "1-2 سن مرتخ قليلاً", "عدة أسنان مرتخية", "أسنان مرتخية جداً", "الأسنان تحركت من موضعها"]
  },
  {
    id: "oral_hygiene",
    question: "How often do you brush and floss?",
    arabicQuestion: "كم مرة تنظف أسنانك وتستخدم الخيط؟",
    type: "radio",
    options: ["Brush 2x daily, floss daily", "Brush 2x daily, floss occasionally", "Brush once daily", "Brush irregularly", "Rarely brush or floss"],
    arabicOptions: ["تنظيف مرتين + خيط يومياً", "تنظيف مرتين + خيط أحياناً", "تنظيف مرة يومياً", "تنظيف غير منتظم", "نادراً ما أنظف"]
  },
  {
    id: "smoking_history",
    question: "Do you use tobacco products?",
    arabicQuestion: "هل تستخدم منتجات التبغ؟",
    type: "radio",
    options: ["Never used tobacco", "Former smoker (quit >1 year ago)", "Recent quitter (<1 year)", "Current smoker", "Heavy tobacco user"],
    arabicOptions: ["لم أستخدم التبغ أبداً", "مدخن سابق (أقلع منذ >سنة)", "أقلع مؤخراً (<سنة)", "مدخن حالياً", "مستخدم تبغ بكثرة"]
  },
  {
    id: "stress_grinding",
    question: "Do you grind your teeth or feel stressed?",
    arabicQuestion: "هل تطحن أسنانك أو تشعر بالتوتر؟",
    type: "radio",
    options: ["No grinding or stress", "Occasional stress", "Regular stress/grinding", "Severe bruxism", "Jaw pain from clenching"],
    arabicOptions: ["لا طحن أو توتر", "توتر أحياناً", "توتر/طحن منتظم", "صرير شديد", "ألم فك من الضغط"]
  }
];

// أسئلة تشخيص المشاكل التجميلية - Cosmetic Questions
export const COSMETIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "main_concern",
    question: "What is your main cosmetic concern?",
    arabicQuestion: "ما هو قلقك التجميلي الرئيسي؟",
    type: "radio",
    options: ["Tooth color/staining", "Crooked or misaligned teeth", "Gaps between teeth", "Chipped or broken teeth", "Tooth shape/size", "Gummy smile"],
    arabicOptions: ["لون/تصبغات الأسنان", "أسنان معوجة أو غير منتظمة", "فراغات بين الأسنان", "أسنان مكسورة أو مشروخة", "شكل/حجم الأسنان", "ابتسامة لثوية"]
  },
  {
    id: "smile_confidence",
    question: "How confident are you with your smile?",
    arabicQuestion: "ما مدى ثقتك بابتسامتك؟",
    type: "radio",
    options: ["Very confident", "Somewhat confident", "Not very confident", "Avoid smiling", "Extremely self-conscious"],
    arabicOptions: ["واثق جداً", "واثق نوعاً ما", "غير واثق كثيراً", "أتجنب الابتسام", "واعٍ بالذات للغاية"]
  },
  {
    id: "staining_type",
    question: "What type of staining do you notice?",
    arabicQuestion: "أي نوع من التصبغات تلاحظه؟",
    type: "radio",
    options: ["No staining", "Yellow tint", "Brown spots", "Gray discoloration", "White spots", "Dark lines/bands"],
    arabicOptions: ["لا تصبغات", "صبغة صفراء", "بقع بنية", "تلون رمادي", "بقع بيضاء", "خطوط/أشرطة داكنة"]
  },
  {
    id: "previous_treatments",
    question: "Have you had any cosmetic dental work?",
    arabicQuestion: "هل خضعت لأي عمل أسنان تجميلي؟",
    type: "checkbox",
    options: ["Professional whitening", "At-home whitening", "Veneers", "Bonding", "Orthodontics/braces", "None of the above"],
    arabicOptions: ["تبييض احترافي", "تبييض منزلي", "قشور تجميلية", "لصق تجميلي", "تقويم أسنان", "لا شيء مما سبق"]
  },
  {
    id: "diet_habits",
    question: "Which of these do you consume regularly?",
    arabicQuestion: "أي من هذه تستهلك بانتظام؟",
    type: "checkbox",
    options: ["Coffee", "Tea", "Red wine", "Dark sodas", "Berries", "Tobacco", "None of these"],
    arabicOptions: ["قهوة", "شاي", "نبيذ أحمر", "مشروبات غازية داكنة", "توت", "تبغ", "لا شيء من هذه"]
  },
  {
    id: "tooth_alignment",
    question: "How would you describe your tooth alignment?",
    arabicQuestion: "كيف تصف اصطفاف أسنانك؟",
    type: "radio",
    options: ["Straight and well-aligned", "Slightly crooked", "Moderately misaligned", "Severely crooked", "Major gaps or crowding"],
    arabicOptions: ["مستقيمة ومنتظمة", "معوجة قليلاً", "غير منتظمة بشكل متوسط", "معوجة بشدة", "فراغات أو ازدحام كبير"]
  },
  {
    id: "bite_issues",
    question: "Do you have any bite problems?",
    arabicQuestion: "هل لديك أي مشاكل في العضة؟",
    type: "radio",
    options: ["Normal bite", "Overbite", "Underbite", "Crossbite", "Open bite", "TMJ/jaw clicking"],
    arabicOptions: ["عضة طبيعية", "عضة علوية زائدة", "عضة سفلية", "عضة متصالبة", "عضة مفتوحة", "طقطقة فك/TMJ"]
  },
  {
    id: "age_changes",
    question: "Have you noticed changes as you age?",
    arabicQuestion: "هل لاحظت تغييرات مع التقدم في العمر؟",
    type: "checkbox",
    options: ["Teeth yellowing", "Gum recession", "Tooth wear", "More gaps", "Teeth shifting", "No changes noticed"],
    arabicOptions: ["اصفرار الأسنان", "انحسار اللثة", "تآكل الأسنان", "فراغات أكثر", "تحرك الأسنان", "لا تغييرات ملحوظة"]
  },
  {
    id: "budget_timeline",
    question: "What's your treatment preference?",
    arabicQuestion: "ما هو تفضيلك للعلاج؟",
    type: "radio",
    options: ["Quick affordable options", "Moderate investment", "Comprehensive treatment", "Premium/best results", "Need payment plans"],
    arabicOptions: ["خيارات سريعة وبأسعار معقولة", "استثمار متوسط", "علاج شامل", "نتائج مميزة/الأفضل", "أحتاج خطط دفع"]
  },
  {
    id: "lifestyle_impact",
    question: "How does this affect your daily life?",
    arabicQuestion: "كيف يؤثر هذا على حياتك اليومية؟",
    type: "radio",
    options: ["No impact", "Slight self-consciousness", "Avoid photos/social events", "Affects work/relationships", "Significant emotional distress"],
    arabicOptions: ["لا تأثير", "وعي ذاتي طفيف", "أتجنب الصور/المناسبات", "يؤثر على العمل/العلاقات", "ضيق عاطفي كبير"]
  }
];

// أسئلة الآفات والبقع - Lesion Questions
export const LESION_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "lesion_location",
    question: "Where is the spot/lesion located?",
    arabicQuestion: "أين تقع البقعة/الآفة؟",
    type: "radio",
    options: ["Tongue", "Inner cheeks", "Gums", "Roof of mouth", "Floor of mouth", "Lips", "Multiple locations"],
    arabicOptions: ["اللسان", "باطن الخدود", "اللثة", "سقف الفم", "أرضية الفم", "الشفاه", "عدة مواقع"]
  },
  {
    id: "lesion_appearance",
    question: "How would you describe the appearance?",
    arabicQuestion: "كيف تصف المظهر؟",
    type: "radio",
    options: ["White patch", "Red patch", "Mixed red and white", "Dark/black spot", "Raised bump", "Open sore/ulcer"],
    arabicOptions: ["بقعة بيضاء", "بقعة حمراء", "أحمر وأبيض مختلط", "بقعة داكنة/سوداء", "نتوء مرتفع", "قرحة/تقرح مفتوح"]
  },
  {
    id: "lesion_size",
    question: "What size is the lesion?",
    arabicQuestion: "ما حجم الآفة؟",
    type: "radio",
    options: ["Very small (pinhead)", "Small (pencil eraser)", "Medium (dime)", "Large (quarter)", "Very large (bigger than quarter)"],
    arabicOptions: ["صغيرة جداً (رأس دبوس)", "صغيرة (ممحاة قلم)", "متوسطة (عملة صغيرة)", "كبيرة (عملة متوسطة)", "كبيرة جداً (أكبر من عملة)"]
  },
  {
    id: "lesion_duration",
    question: "How long has it been present?",
    arabicQuestion: "منذ متى وهي موجودة؟",
    type: "radio",
    options: ["Less than 1 week", "1-2 weeks", "2-4 weeks", "1-3 months", "More than 3 months"],
    arabicOptions: ["أقل من أسبوع", "1-2 أسبوع", "2-4 أسابيع", "1-3 أشهر", "أكثر من 3 أشهر"]
  },
  {
    id: "lesion_pain",
    question: "Is the lesion painful?",
    arabicQuestion: "هل الآفة مؤلمة؟",
    type: "radio",
    options: ["No pain at all", "Mild discomfort", "Moderate pain", "Severe pain", "Pain comes and goes"],
    arabicOptions: ["لا ألم على الإطلاق", "انزعاج خفيف", "ألم متوسط", "ألم شديد", "ألم يأتي ويذهب"]
  },
  {
    id: "lesion_texture",
    question: "How does the area feel?",
    arabicQuestion: "كيف تشعر بالمنطقة؟",
    type: "radio",
    options: ["Smooth", "Rough/bumpy", "Hard/firm", "Soft", "Ulcerated/open", "Changes texture"],
    arabicOptions: ["ناعمة", "خشنة/متعرجة", "صلبة/ثابتة", "ناعمة", "متقرحة/مفتوحة", "تتغير الملمس"]
  },
  {
    id: "lesion_changes",
    question: "Has the lesion changed over time?",
    arabicQuestion: "هل تغيرت الآفة مع الوقت؟",
    type: "radio",
    options: ["No changes", "Getting larger", "Getting smaller", "Color changes", "Texture changes", "Multiple changes"],
    arabicOptions: ["لا تغييرات", "تكبر", "تصغر", "تغيرات في اللون", "تغيرات في الملمس", "تغييرات متعددة"]
  },
  {
    id: "bleeding_lesion",
    question: "Does the lesion bleed?",
    arabicQuestion: "هل تنزف الآفة؟",
    type: "radio",
    options: ["Never bleeds", "Bleeds when touched", "Bleeds when eating", "Spontaneous bleeding", "Constant oozing"],
    arabicOptions: ["لا تنزف أبداً", "تنزف عند اللمس", "تنزف عند الأكل", "نزيف تلقائي", "إفراز مستمر"]
  },
  {
    id: "risk_factors",
    question: "Do any of these apply to you?",
    arabicQuestion: "هل ينطبق عليك أي من هذا؟",
    type: "checkbox",
    options: ["Tobacco use", "Heavy alcohol use", "HPV history", "Sun exposure to lips", "Family history of oral cancer", "None apply"],
    arabicOptions: ["استخدام التبغ", "استهلاك كحول بكثرة", "تاريخ HPV", "تعرض الشفاه للشمس", "تاريخ عائلي لسرطان الفم", "لا ينطبق شيء"]
  },
  {
    id: "other_symptoms_lesion",
    question: "Any other symptoms with the lesion?",
    arabicQuestion: "أي أعراض أخرى مع الآفة؟",
    type: "checkbox",
    options: ["Numbness", "Tingling", "Difficulty swallowing", "Voice changes", "Ear pain", "Swollen lymph nodes", "None"],
    arabicOptions: ["خدر", "وخز", "صعوبة البلع", "تغيرات في الصوت", "ألم في الأذن", "تضخم الغدد الليمفاوية", "لا شيء"]
  }
];

// أسئلة المشاكل الأخرى - Other Issues Questions
export const OTHER_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "primary_complaint",
    question: "What is your main concern?",
    arabicQuestion: "ما هو قلقك الرئيسي؟",
    type: "radio",
    options: ["Jaw pain/TMJ", "Dry mouth", "Bad breath", "Tooth sensitivity", "Clicking jaw", "Mouth breathing", "Other"],
    arabicOptions: ["ألم فك/TMJ", "جفاف الفم", "رائحة فم كريهة", "حساسية الأسنان", "طقطقة الفك", "التنفس من الفم", "أخرى"]
  },
  {
    id: "symptom_duration",
    question: "How long have you had this issue?",
    arabicQuestion: "منذ متى ولديك هذه المشكلة؟",
    type: "radio",
    options: ["Less than 1 week", "1-4 weeks", "1-3 months", "3-12 months", "More than 1 year"],
    arabicOptions: ["أقل من أسبوع", "1-4 أسابيع", "1-3 أشهر", "3-12 شهر", "أكثر من سنة"]
  },
  {
    id: "symptom_frequency",
    question: "How often do you experience this?",
    arabicQuestion: "كم مرة تعاني من هذا؟",
    type: "radio",
    options: ["Constantly", "Daily", "Few times per week", "Occasionally", "Rarely"],
    arabicOptions: ["باستمرار", "يومياً", "عدة مرات أسبوعياً", "أحياناً", "نادراً"]
  },
  {
    id: "triggers_other",
    question: "What seems to trigger your symptoms?",
    arabicQuestion: "ما الذي يبدو أنه يثير أعراضك؟",
    type: "checkbox",
    options: ["Stress", "Certain foods", "Weather changes", "Physical activity", "Time of day", "Nothing specific"],
    arabicOptions: ["التوتر", "أطعمة معينة", "تغيرات الطقس", "نشاط بدني", "وقت من اليوم", "لا شيء محدد"]
  },
  {
    id: "relief_methods",
    question: "What helps improve your symptoms?",
    arabicQuestion: "ما الذي يساعد في تحسين أعراضك؟",
    type: "checkbox",
    options: ["Rest", "Medication", "Warm/cold compress", "Avoiding triggers", "Mouth rinse", "Nothing helps"],
    arabicOptions: ["الراحة", "الأدوية", "كمادات دافئة/باردة", "تجنب المحفزات", "غسول فم", "لا شيء يساعد"]
  },
  {
    id: "associated_issues",
    question: "Do you have any related symptoms?",
    arabicQuestion: "هل لديك أي أعراض ذات صلة؟",
    type: "checkbox",
    options: ["Headaches", "Neck pain", "Ear problems", "Sleep issues", "Stress/anxiety", "None"],
    arabicOptions: ["صداع", "ألم رقبة", "مشاكل أذن", "مشاكل نوم", "توتر/قلق", "لا شيء"]
  },
  {
    id: "medical_conditions_other",
    question: "Do you have any of these conditions?",
    arabicQuestion: "هل لديك أي من هذه الحالات؟",
    type: "checkbox",
    options: ["Diabetes", "Autoimmune disease", "Heart disease", "Medications that cause dry mouth", "Allergies", "None"],
    arabicOptions: ["السكري", "مرض مناعي ذاتي", "مرض قلب", "أدوية تسبب جفاف الفم", "حساسية", "لا شيء"]
  },
  {
    id: "previous_treatment",
    question: "Have you tried any treatments?",
    arabicQuestion: "هل جربت أي علاجات؟",
    type: "radio",
    options: ["No treatment yet", "Over-counter remedies", "Saw dentist", "Saw physician", "Multiple treatments"],
    arabicOptions: ["لم أجرب علاج بعد", "علاجات بدون وصفة", "رأيت طبيب أسنان", "رأيت طبيب عام", "علاجات متعددة"]
  },
  {
    id: "symptom_severity",
    question: "How much does this issue bother you?",
    arabicQuestion: "كم يزعجك هذا الأمر؟",
    type: "radio",
    options: ["Mild concern", "Moderate concern", "Significant concern", "Severe problem affecting daily life"],
    arabicOptions: ["قلق خفيف", "قلق متوسط", "قلق كبير", "مشكلة شديدة تؤثر على الحياة اليومية"]
  },
  {
    id: "urgency_level",
    question: "How urgent do you feel this issue is?",
    arabicQuestion: "ما مدى استعجال هذه المشكلة برأيك؟",
    type: "radio",
    options: ["Emergency - need immediate care", "Urgent - should see dentist this week", "Moderate - should schedule soon", "Low - can wait for routine appointment"],
    arabicOptions: ["طوارئ - أحتاج رعاية فورية", "عاجل - يجب رؤية طبيب هذا الأسبوع", "متوسط - يجب الحجز قريباً", "منخفض - يمكن الانتظار لموعد روتيني"]
  }
];

// مجموعة كل الأسئلة حسب العَرَض - All Questions by Symptom
export const DIAGNOSTIC_FLOW: DiagnosticFlow = {
  pain: PAIN_QUESTIONS,
  gums: GUM_QUESTIONS,
  cosmetic: COSMETIC_QUESTIONS,
  lesion: LESION_QUESTIONS,
  other: OTHER_QUESTIONS
};
