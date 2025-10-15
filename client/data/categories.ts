export interface Category {
  id: string;
  name: string;
  arabicName: string;
  icon: string;
  productsCount: number;
  bgColor: string;
  image: string;
  description?: string;
  arabicDescription?: string;
}

export const dentalCategories: Category[] = [
  {
    id: "general-dentistry",
    name: "General Dentistry",
    arabicName: "طب الأسنان العام",
    icon: "🦷",
    productsCount: 2450,
    bgColor: "from-blue-500 to-cyan-600",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
    description: "Comprehensive general dental care products",
    arabicDescription: "منتجات رعاية الأسنان العامة الشاملة",
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    arabicName: "تقويم الأسنان",
    icon: "🔧",
    productsCount: 1650,
    bgColor: "from-purple-500 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
    description: "Braces, aligners and orthodontic instruments",
    arabicDescription: "أقواس التقويم والمصففات وأدوات التقويم",
  },
  {
    id: "oral-surgery",
    name: "Oral Surgery",
    arabicName: "جراحة الفم",
    icon: "⚕️",
    productsCount: 890,
    bgColor: "from-red-500 to-rose-600",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    description: "Surgical instruments and equipment",
    arabicDescription: "أدوات ومعدات جراحية",
  },
  {
    id: "preventive-care",
    name: "Preventive Care",
    arabicName: "الرعاية الوقائية",
    icon: "🛡️",
    productsCount: 1340,
    bgColor: "from-green-500 to-emerald-600",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop",
    description: "Preventive dental care products",
    arabicDescription: "��نتجات الرعاية الوقائية للأسنان",
  },
  {
    id: "endodontics",
    name: "Endodontics",
    arabicName: "علاج العصب",
    icon: "🔬",
    productsCount: 780,
    bgColor: "from-yellow-500 to-orange-600",
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=300&h=200&fit=crop",
    description: "Root canal treatment supplies",
    arabicDescription: "لوازم علاج قناة الجذر",
  },
  {
    id: "prosthetics",
    name: "Prosthetics",
    arabicName: "التركيبات",
    icon: "🦷",
    productsCount: 1120,
    bgColor: "from-indigo-500 to-purple-600",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=200&fit=crop",
    description: "Dental prosthetics and restorations",
    arabicDescription: "تركيبات الأسنان والترميمات",
  },
  {
    id: "implantology",
    name: "Implantology",
    arabicName: "زراعة الأسنان",
    icon: "⚙️",
    productsCount: 567,
    bgColor: "from-gray-500 to-slate-600",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
    description: "Dental implants and related equipment",
    arabicDescription: "زراعات الأسنان ��المعدات ذات الصلة",
  },
  {
    id: "periodontics",
    name: "Periodontics",
    arabicName: "علاج اللثة",
    icon: "🩸",
    productsCount: 432,
    bgColor: "from-pink-500 to-rose-600",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    description: "Gum disease treatment products",
    arabicDescription: "منتجات علاج أمراض اللثة",
  },
  {
    id: "radiology",
    name: "Radiology",
    arabicName: "الأشعة",
    icon: "📡",
    productsCount: 298,
    bgColor: "from-cyan-500 to-blue-600",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
    description: "X-ray and imaging equipment",
    arabicDescription: "معدات الأشعة السينية والتصوير",
  },
  {
    id: "anesthesia",
    name: "Anesthesia",
    arabicName: "التخدير",
    icon: "💉",
    productsCount: 345,
    bgColor: "from-emerald-500 to-teal-600",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=200&fit=crop",
    description: "Local anesthesia and pain management",
    arabicDescription: "التخدير الموضعي وإدارة الألم",
  },
  {
    id: "sterilization",
    name: "Sterilization",
    arabicName: "التعقيم",
    icon: "🧼",
    productsCount: 678,
    bgColor: "from-violet-500 to-purple-600",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop",
    description: "Sterilization and infection control",
    arabicDescription: "التعقيم ومكافحة العدوى",
  },
  {
    id: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    arabicName: "تجميل الأسنان",
    icon: "✨",
    productsCount: 523,
    bgColor: "from-rose-500 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=200&fit=crop",
    description: "Teeth whitening and cosmetic treatments",
    arabicDescription: "تبييض الأسنان والعلاجات التجميلية",
  },
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return dentalCategories.find((category) => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return dentalCategories.find(
    (category) =>
      category.name.toLowerCase() === name.toLowerCase() ||
      category.arabicName === name,
  );
};

export const getMainCategories = (limit?: number): Category[] => {
  return limit ? dentalCategories.slice(0, limit) : dentalCategories;
};
