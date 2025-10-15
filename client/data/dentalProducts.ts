export interface DentalProduct {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand: string;
  supplier: string;
  rating: number;
  reviewCount: number;
  description: string;
  arabicDescription: string;
  features: string[];
  arabicFeatures: string[];
  specifications: { [key: string]: string };
  arabicSpecifications: { [key: string]: string };
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  discount?: number;
  timeLeft?: string;
  stockLeft?: number;
  tags: string[];
  arabicTags: string[];
  weight?: string;
  dimensions?: string;
  warranty?: string;
  certification?: string[];
  countryOfOrigin: string;
  barcode?: string;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  shippingInfo: {
    freeShipping: boolean;
    estimatedDays: string;
    weight?: number;
  };
}

export const dentalProducts: DentalProduct[] = [
  // Composite Resins & Restorative Materials
  {
    id: 1,
    name: "Filtek Universal Restorative",
    arabicName: "فيلتك يونيفرسال للترميم",
    price: 45000,
    originalPrice: 52000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop",
    ],
    category: "Restorative Materials",
    subcategory: "Composite Resins",
    brand: "3M ESPE",
    supplier: "3M Dental Products",
    rating: 4.8,
    reviewCount: 234,
    description: "Universal composite for anterior and posterior restorations",
    arabicDescription: "مادة ترميم عامة للأسنان الأمامية والخلفية",
    features: [
      "Universal shade matching",
      "Easy handling and placement",
      "Excellent wear resistance",
      "High strength and durability",
    ],
    arabicFeatures: [
      "مطابقة لون عامة",
      "سهولة في التعامل والوضع",
      "مقاومة ممتازة للتآكل",
      "قوة ومتانة عالية",
    ],
    specifications: {
      "Shade Range": "16 shades",
      "Particle Size": "20 nanometers",
      "Filler Loading": "76.5% by weight",
      "Compressive Strength": "295 MPa",
    },
    arabicSpecifications: {
      "نطاق الألوان": "16 لون",
      "حجم الجسيمات": "20 نانومتر",
      "نسبة الحشو": "76.5% من الوزن",
      "قوة الضغط": "295 ميجا باسكال",
    },
    inStock: true,
    stockQuantity: 45,
    sku: "3M-FU-001",
    isFeatured: true,
    isExclusive: true,
    discount: 13,
    tags: ["composite", "universal", "restorative"],
    arabicTags: ["مركب", "عام", "ترميم"],
    weight: "4g",
    warranty: "2 years",
    certification: ["FDA", "CE", "ISO 13485"],
    countryOfOrigin: "USA",
    barcode: "7622300991234",
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "2-3 أيام",
      weight: 0.1,
    },
  },

  {
    id: 2,
    name: "Single Bond Universal Adhesive",
    arabicName: "مادة لاصقة سينجل بوند يونيفرسال",
    price: 28000,
    originalPrice: 35000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    category: "Bonding Agents",
    subcategory: "Universal Adhesives",
    brand: "3M ESPE",
    supplier: "3M Dental Products",
    rating: 4.7,
    reviewCount: 189,
    description: "Universal dental adhesive for direct and indirect bonding",
    arabicDescription: "مادة لاصقة عامة للربط المباشر وغير المباشر",
    features: [
      "Universal bonding agent",
      "No separate etching required",
      "Bonds to all substrates",
      "Reliable marginal seal",
    ],
    arabicFeatures: [
      "مادة ربط عامة",
      "لا يتطلب تخريش منفصل",
      "يربط بجميع الأسطح",
      "إغلاق حافي موث��ق",
    ],
    specifications: {
      "Bond Strength": "25-30 MPa",
      "Application Time": "15 seconds",
      "Light Cure Time": "10 seconds",
      pH: "2.7",
    },
    arabicSpecifications: {
      "قوة الرابطة": "25-30 ميجا باسكال",
      "وقت التطبيق": "15 ثانية",
      "وقت المعالجة الضوئية": "10 ثواني",
      "الرقم الهيدروجيني": "2.7",
    },
    inStock: true,
    stockQuantity: 67,
    sku: "3M-SBU-001",
    discount: 20,
    tags: ["adhesive", "bonding", "universal"],
    arabicTags: ["لاصق", "ربط", "عام"],
    weight: "6ml",
    warranty: "2 years",
    certification: ["FDA", "CE"],
    countryOfOrigin: "Germany",
    shippingInfo: {
      freeShipping: false,
      estimatedDays: "3-5 أيام",
      weight: 0.05,
    },
  },

  // Endodontic Products
  {
    id: 3,
    name: "ProTaper Universal Files",
    arabicName: "مبارد بروتيبر يونيفرسال",
    price: 125000,
    image:
      "https://images.unsplash.com/photo-1584467735871-8297329f9eb3?w=400&h=400&fit=crop",
    category: "Endodontics",
    subcategory: "Rotary Files",
    brand: "Dentsply Sirona",
    supplier: "Dentsply Sirona",
    rating: 4.9,
    reviewCount: 445,
    description: "Complete rotary file system for root canal preparation",
    arabicDescription: "نظام مبارد دوراني كامل لتحضير قناة الجذر",
    features: [
      "Progressive taper design",
      "Superior cutting efficiency",
      "Flexible and resistant",
      "Shorter treatment time",
    ],
    arabicFeatures: [
      "تصميم مخروطي متدرج",
      "كفاءة قطع فائقة",
      "مرن ومقاوم",
      "وقت علاج أقصر",
    ],
    specifications: {
      Material: "NiTi alloy",
      Taper: "Variable (.07-.12)",
      Length: "21, 25, 31mm",
      Speed: "150-300 RPM",
    },
    arabicSpecifications: {
      المادة: "سبيكة نيكل تيتانيوم",
      المخروطية: "م��غيرة (.07-.12)",
      الطول: "21، 25، 31 مم",
      السرعة: "150-300 لفة/دقيقة",
    },
    inStock: true,
    stockQuantity: 23,
    sku: "DS-PTU-001",
    isFeatured: true,
    isExclusive: true,
    tags: ["endodontic", "files", "rotary"],
    arabicTags: ["لبي", "مبارد", "دوراني"],
    weight: "Set",
    warranty: "1 year",
    certification: ["FDA", "CE", "ISO 13485"],
    countryOfOrigin: "Switzerland",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "1-2 أيام",
      weight: 0.2,
    },
  },

  {
    id: 4,
    name: "AH Plus Root Canal Sealer",
    arabicName: "حاشي قناة الجذر AH بلس",
    price: 35000,
    originalPrice: 42000,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop",
    category: "Endodontics",
    subcategory: "Root Canal Sealers",
    brand: "Dentsply Sirona",
    supplier: "Dentsply Sirona",
    rating: 4.6,
    reviewCount: 298,
    description:
      "Epoxy resin-based root canal sealer with excellent sealing properties",
    arabicDescription:
      "حاشي قناة جذر مبني على راتنج الإيبوكسي مع خصائص إغلاق ممتازة",
    features: [
      "Excellent sealing ability",
      "Radiopaque for X-ray visibility",
      "Good flow properties",
      "Biocompatible material",
    ],
    arabicFeatures: [
      "قدرة إغلاق ممتازة",
      "مرئي في الأشعة السينية",
      "خصائص انسياب جيدة",
      "مادة متوافقة حيوياً",
    ],
    specifications: {
      "Working Time": "4 hours",
      "Setting Time": "8 hours",
      "Film Thickness": "17 micrometers",
      Solubility: "1.4%",
    },
    arabicSpecifications: {
      "وقت العمل": "4 ساعات",
      "وقت التجمد": "8 ساعات",
      "سماكة الفيلم": "17 ميكرومتر",
      "القابلية للذوبان": "1.4%",
    },
    inStock: true,
    stockQuantity: 89,
    sku: "DS-AHP-001",
    discount: 17,
    tags: ["sealer", "endodontic", "root canal"],
    arabicTags: ["حاشي", "لبي", "قناة جذر"],
    weight: "4g + 4g",
    warranty: "3 years",
    certification: ["FDA", "CE"],
    countryOfOrigin: "Germany",
    shippingInfo: {
      freeShipping: false,
      estimatedDays: "2-4 أيام",
      weight: 0.08,
    },
  },

  // Impression Materials
  {
    id: 5,
    name: "Aquasil Ultra Impression Material",
    arabicName: "مادة طبع أكواسيل ألترا",
    price: 78000,
    originalPrice: 95000,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
    category: "Impression Materials",
    subcategory: "Addition Silicone",
    brand: "Dentsply Sirona",
    supplier: "Dentsply Sirona",
    rating: 4.8,
    reviewCount: 167,
    description:
      "Premium vinyl polysiloxane impression material for precision impressions",
    arabicDescription: "مادة طبع فاينيل بولي سيلوكسان ممتازة للطبعات الدقيقة",
    features: [
      "Excellent dimensional stability",
      "Superior detail reproduction",
      "Hydrophilic properties",
      "Extended working time",
    ],
    arabicFeatures: [
      "ثبات أبعاد ممتاز",
      "استنساخ تفاصيل فائق",
      "خصائص محبة للماء",
      "وقت عمل ممتد",
    ],
    specifications: {
      "Setting Time": "3:45 minutes",
      "Working Time": "2:15 minutes",
      "Shore A Hardness": "25",
      "Dimensional Change": "0.15%",
    },
    arabicSpecifications: {
      "وقت التجمد": "3:45 دقيقة",
      "وقت العمل": "2:15 دقيقة",
      "صلابة شور A": "25",
      "تغير الأبعاد": "0.15%",
    },
    inStock: true,
    stockQuantity: 34,
    sku: "DS-AQU-001",
    isNew: true,
    discount: 18,
    tags: ["impression", "silicone", "precision"],
    arabicTags: ["طبع", "سيليكون", "دقة"],
    weight: "2x50ml",
    warranty: "2 years",
    certification: ["FDA", "CE", "ISO 4823"],
    countryOfOrigin: "USA",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "2-3 أيام",
      weight: 0.15,
    },
  },

  // Instruments
  {
    id: 6,
    name: "Gracey Curettes Set",
    arabicName: "طقم كوريت جريسي",
    price: 156000,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=400&fit=crop",
    category: "Instruments",
    subcategory: "Periodontal Instruments",
    brand: "Hu-Friedy",
    supplier: "Hu-Friedy Manufacturing",
    rating: 4.9,
    reviewCount: 89,
    description:
      "Professional periodontal curettes for subgingival scaling and root planing",
    arabicDescription: "كوريت لثوية مهنية لتقليح ما تحت اللثة وتنعيم الجذر",
    features: [
      "Sharp and durable blades",
      "Ergonomic handle design",
      "Precision cutting edges",
      "Autoclavable instruments",
    ],
    arabicFeatures: [
      "شفرات حادة ومتينة",
      "تصميم مقبض مريح",
      "حواف قطع دقيقة",
      "أدوات قابلة للتعقيم",
    ],
    specifications: {
      Material: "Stainless Steel",
      Handle: "EverEdge 2.0",
      "Blade Angle": "Site-specific",
      Length: "16-18cm",
    },
    arabicSpecifications: {
      المادة: "ستانلس ستيل",
      المقبض: "إيفر إيدج 2.0",
      "زاوية الشفرة": "خاصة بالموقع",
      الطول: "16-18 سم",
    },
    inStock: true,
    stockQuantity: 12,
    sku: "HF-GRC-001",
    isFeatured: true,
    isExclusive: true,
    tags: ["instruments", "periodontal", "curettes"],
    arabicTags: ["أدوات", "لثوية", "كوريت"],
    weight: "Set of 7",
    warranty: "Lifetime",
    certification: ["FDA", "CE", "ISO 13485"],
    countryOfOrigin: "USA",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "3-5 أيام",
      weight: 0.5,
    },
  },

  // Equipment
  {
    id: 7,
    name: "LED Curing Light",
    arabicName: "ضوء المعالجة LED",
    price: 285000,
    originalPrice: 350000,
    image:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    category: "Equipment",
    subcategory: "Light Curing Units",
    brand: "Ivoclar Vivadent",
    supplier: "Ivoclar Vivadent",
    rating: 4.7,
    reviewCount: 234,
    description: "High-performance LED curing light with multiple curing modes",
    arabicDescription: "ضوء معالجة LED عالي الأداء مع أنماط معالجة متعددة",
    features: [
      "High light intensity output",
      "Multiple curing programs",
      "Cordless operation",
      "360° rotating light guide",
    ],
    arabicFeatures: [
      "شدة ضوء عالية",
      "برامج معالجة متعددة",
      "تشغيل لاسلكي",
      "دليل ضوء دوار 360°",
    ],
    specifications: {
      "Light Intensity": "1200 mW/cm²",
      Wavelength: "400-515 nm",
      "Battery Life": "500 cycles",
      "Curing Modes": "Standard, High, Pulse",
    },
    arabicSpecifications: {
      "شدة الضوء": "1200 مللي واط/سم²",
      "الطول الموجي": "400-515 نانومتر",
      "عمر البطارية": "500 دورة",
      "أنماط المعالجة": "قياسي، عالي، نبضي",
    },
    inStock: true,
    stockQuantity: 8,
    sku: "IV-LED-001",
    isFeatured: true,
    discount: 19,
    tags: ["equipment", "curing light", "LED"],
    arabicTags: ["معدات", "ضوء معالجة", "LED"],
    weight: "180g",
    warranty: "2 years",
    certification: ["FDA", "CE", "Health Canada"],
    countryOfOrigin: "Liechtenstein",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "5-7 أيام",
      weight: 0.5,
    },
  },

  // Consumables
  {
    id: 8,
    name: "Nitrile Gloves Box",
    arabicName: "علبة قفازات ��يتريل",
    price: 25000,
    originalPrice: 30000,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    category: "Consumables",
    subcategory: "Personal Protection",
    brand: "Ansell",
    supplier: "Ansell Healthcare",
    rating: 4.6,
    reviewCount: 567,
    description:
      "Powder-free nitrile examination gloves for superior protection",
    arabicDescription: "قفازات فحص نيتريل خالية من البودرة للحماية الفائقة",
    features: [
      "Powder-free formula",
      "Superior puncture resistance",
      "Textured fingertips",
      "Latex-free material",
    ],
    arabicFeatures: [
      "خالي من البودرة",
      "مقاومة ثقب فائقة",
      "أطراف أصابع محكمة",
      "مادة خالية من اللات��س",
    ],
    specifications: {
      Material: "Nitrile rubber",
      Thickness: "0.12mm",
      Length: "240mm",
      Quantity: "100 pieces",
    },
    arabicSpecifications: {
      المادة: "مطاط نيتريل",
      السماكة: "0.12 مم",
      الطول: "240 مم",
      الكمية: "100 قطعة",
    },
    inStock: true,
    stockQuantity: 245,
    sku: "ANS-NIT-001",
    discount: 17,
    tags: ["gloves", "protection", "nitrile"],
    arabicTags: ["قفازات", "حماية", "نيتريل"],
    weight: "Box of 100",
    warranty: "N/A",
    certification: ["FDA", "CE", "ASTM D6319"],
    countryOfOrigin: "Malaysia",
    minOrderQuantity: 5,
    shippingInfo: {
      freeShipping: false,
      estimatedDays: "1-2 أيام",
      weight: 0.8,
    },
  },

  // Orthodontic
  {
    id: 9,
    name: "Metal Brackets Set",
    arabicName: "طقم حاصرات معدنية",
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    category: "Orthodontics",
    subcategory: "Brackets",
    brand: "3M Unitek",
    supplier: "3M Orthodontic Products",
    rating: 4.8,
    reviewCount: 156,
    description:
      "High-quality stainless steel orthodontic brackets with excellent bonding",
    arabicDescription:
      "حاصرات تقويم أسنان ستانلس ستيل عالية الجودة مع ربط ممتاز",
    features: [
      "Precision-made slots",
      "Smooth surface finish",
      "Excellent bond strength",
      "Easy debonding",
    ],
    arabicFeatures: [
      "فتحات مصنوعة بدقة",
      "سطح أملس",
      "قوة ربط ممتازة",
      "سهولة الفك",
    ],
    specifications: {
      Material: "17-4 PH Stainless Steel",
      "Slot Size": ".022 x .028",
      "Base Type": "Micro-etched",
      Quantity: "20 pieces",
    },
    arabicSpecifications: {
      المادة: "ستانلس ستيل 17-4 PH",
      "حجم الف��حة": ".022 x .028",
      "نوع القاعدة": "محفور مجهرياً",
      الكمية: "20 قطعة",
    },
    inStock: true,
    stockQuantity: 78,
    sku: "3M-MTB-001",
    tags: ["orthodontic", "brackets", "metal"],
    arabicTags: ["تقويم", "حاصرات", "معدني"],
    weight: "Set",
    warranty: "2 years",
    certification: ["FDA", "CE", "ISO 13485"],
    countryOfOrigin: "USA",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "3-4 أيام",
      weight: 0.1,
    },
  },

  // Dental Implants
  {
    id: 10,
    name: "Titanium Dental Implant",
    arabicName: "زرعة أسنان تيتانيوم",
    price: 450000,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    category: "Implantology",
    subcategory: "Dental Implants",
    brand: "Straumann",
    supplier: "Straumann Group",
    rating: 4.9,
    reviewCount: 89,
    description:
      "Premium titanium dental implant with superior osseointegration",
    arabicDescription: "زرعة أسنان تيتانيوم ممتازة مع اندماج عظمي فائق",
    features: [
      "SLA surface treatment",
      "Excellent osseointegration",
      "High success rate",
      "Biocompatible material",
    ],
    arabicFeatures: [
      "معالجة سطح SLA",
      "اندماج عظمي ممتاز",
      "معدل نجاح عالي",
      "مادة متوافقة حيوياً",
    ],
    specifications: {
      Material: "Grade 4 Titanium",
      Diameter: "4.1mm",
      Length: "10mm",
      Connection: "Internal hex",
    },
    arabicSpecifications: {
      المادة: "تيت��نيوم درجة 4",
      القطر: "4.1 مم",
      الطول: "10 مم",
      الاتصال: "سداسي داخلي",
    },
    inStock: true,
    stockQuantity: 15,
    sku: "STR-TI-001",
    isFeatured: true,
    isExclusive: true,
    tags: ["implant", "titanium", "osseointegration"],
    arabicTags: ["زرعة", "تيتانيوم", "اندماج عظمي"],
    weight: "Single unit",
    warranty: "10 years",
    certification: ["FDA", "CE", "ISO 13485"],
    countryOfOrigin: "Switzerland",
    shippingInfo: {
      freeShipping: true,
      estimatedDays: "7-10 أيام",
      weight: 0.02,
    },
  },
];

// Helper functions for product management
export const getProductsByCategory = (category: string): DentalProduct[] => {
  return dentalProducts.filter((product) => product.category === category);
};

export const getProductsByBrand = (brand: string): DentalProduct[] => {
  return dentalProducts.filter((product) => product.brand === brand);
};

export const getFeaturedProducts = (): DentalProduct[] => {
  return dentalProducts.filter((product) => product.isFeatured);
};

export const getNewProducts = (): DentalProduct[] => {
  return dentalProducts.filter((product) => product.isNew);
};

export const getDiscountedProducts = (): DentalProduct[] => {
  return dentalProducts.filter(
    (product) => product.discount && product.discount > 0,
  );
};

export const getExclusiveProducts = (): DentalProduct[] => {
  return dentalProducts.filter((product) => product.isExclusive);
};

export const searchProducts = (query: string): DentalProduct[] => {
  const lowercaseQuery = query.toLowerCase();
  return dentalProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.arabicName.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      product.arabicTags.some((tag) =>
        tag.toLowerCase().includes(lowercaseQuery),
      ),
  );
};

export const getProductById = (id: number): DentalProduct | undefined => {
  return dentalProducts.find((product) => product.id === id);
};

export const getDentalProductById = (id: number): DentalProduct | null => {
  return dentalProducts.find((product) => product.id === id) || null;
};

export const getRandomProducts = (count: number): DentalProduct[] => {
  const shuffled = [...dentalProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRelatedProducts = (
  productId: number,
  count: number = 4,
): DentalProduct[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const related = dentalProducts.filter(
    (p) =>
      p.id !== productId &&
      (p.category === product.category || p.brand === product.brand),
  );

  return related.slice(0, count);
};
