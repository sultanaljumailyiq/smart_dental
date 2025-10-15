// النظام الشامل لإدارة المتجر الإلكتروني
// Professional E-commerce System Architecture

// ============= User Management System =============

export enum UserRole {
  PLATFORM_ADMIN = "platform_admin",
  DENTIST = "dentist",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
  MODERATOR = "moderator",
  VISITOR = "visitor",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
  BANNED = "banned",
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  arabicName: string;
  province?: string; // Iraqi province (required for dentists and suppliers)
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  profile: UserProfile;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserProfile {
  // Common fields
  address?: Address;
  nationalId?: string;

  // Supplier specific
  companyName?: string;
  companyNameArabic?: string;
  businessLicense?: string;
  taxNumber?: string;
  bankAccount?: BankAccount;

  // Customer specific
  dateOfBirth?: Date;
  gender?: "male" | "female";
  profession?: string;
}

export interface Permission {
  resource: string; // 'products', 'orders', 'users', etc.
  actions: string[]; // ['create', 'read', 'update', 'delete']
}

export interface Address {
  governorate: string; // محافظة
  city: string; // مدينة
  district: string; // منطقة
  street: string; // شارع
  buildingNumber: string;
  floor?: string;
  apartmentNumber?: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  iban: string;
  accountHolderName: string;
}

// ============= Product Management System =============

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  PENDING_APPROVAL = "pending_approval",
  REJECTED = "rejected",
  DISCONTINUED = "discontinued",
}

export enum ProductVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  SUPPLIER_ONLY = "supplier_only",
  FEATURED = "featured",
  HIDDEN = "hidden",
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  arabicName: string;
  slug: string;
  description: string;
  arabicDescription: string;

  // Categorization
  category: Category;
  subcategory?: Category;
  brand: Brand;
  supplier: Supplier;
  tags: Tag[];

  // Pricing
  pricing: ProductPricing;

  // Inventory
  inventory: ProductInventory;

  // Media
  images: ProductImage[];
  videos?: ProductVideo[];

  // Specifications
  specifications: ProductSpecification[];

  // SEO & Metadata
  seo: ProductSEO;

  // Status & Visibility
  status: ProductStatus;
  visibility: ProductVisibility;

  // Features & Badges
  badges: ProductBadge[];
  features: string[];
  arabicFeatures: string[];

  // Shipping & Fulfillment
  shipping: ProductShipping;

  // Reviews & Ratings
  rating: number;
  reviewCount: number;

  // Analytics
  analytics: ProductAnalytics;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // Relations
  relatedProducts?: string[]; // Product IDs
  bundleProducts?: ProductBundle[];

  // Compliance
  certifications: string[];
  safetyInformation?: string;
  arabicSafetyInformation?: string;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  cost?: number; // Supplier cost
  margin?: number;
  currency: "IQD" | "USD";
  tax: {
    included: boolean;
    rate: number;
    type: "percentage" | "fixed";
  };
  bulkPricing?: BulkPricing[];
  priceHistory: PriceHistory[];
}

export interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discountPercentage?: number;
}

export interface PriceHistory {
  price: number;
  date: Date;
  reason?: string;
  changedBy: string; // User ID
}

export interface ProductInventory {
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  locations: InventoryLocation[];
}

export interface InventoryLocation {
  locationId: string;
  locationName: string;
  quantity: number;
  reservedQuantity: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  arabicAlt: string;
  order: number;
  isPrimary: boolean;
  size: {
    width: number;
    height: number;
  };
  variants?: {
    thumbnail: string;
    medium: string;
    large: string;
  };
}

export interface ProductVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  arabicTitle: string;
  duration: number;
  order: number;
}

export interface ProductSpecification {
  name: string;
  arabicName: string;
  value: string;
  arabicValue: string;
  unit?: string;
  arabicUnit?: string;
  order: number;
  group?: string;
  arabicGroup?: string;
}

export interface ProductSEO {
  metaTitle: string;
  arabicMetaTitle: string;
  metaDescription: string;
  arabicMetaDescription: string;
  keywords: string[];
  arabicKeywords: string[];
  canonicalUrl?: string;
}

export enum BadgeType {
  NEW = "new",
  SALE = "sale",
  FEATURED = "featured",
  BESTSELLER = "bestseller",
  EXCLUSIVE = "exclusive",
  LIMITED = "limited",
  PREMIUM = "premium",
  ECO_FRIENDLY = "eco_friendly",
}

export interface ProductBadge {
  type: BadgeType;
  label: string;
  arabicLabel: string;
  color: string;
  backgroundColor: string;
  expiresAt?: Date;
  conditions?: BadgeCondition[];
}

export interface BadgeCondition {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "contains";
  value: any;
}

export interface ProductShipping {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass: string;
  freeShipping: boolean;
  estimatedDelivery: {
    min: number;
    max: number;
    unit: "hours" | "days" | "weeks";
  };
  restrictedAreas?: string[];
}

export interface ProductAnalytics {
  views: number;
  uniqueViews: number;
  clicks: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  searchImpressions: number;
  searchClicks: number;
}

export interface ProductBundle {
  productId: string;
  quantity: number;
  discountPercentage?: number;
}

// ============= Category Management =============

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  description?: string;
  arabicDescription?: string;

  // Hierarchy
  parentId?: string;
  children?: Category[];
  level: number;

  // Media
  image?: string;
  icon?: string;

  // SEO
  seo: CategorySEO;

  // Display
  order: number;
  isActive: boolean;
  isVisible: boolean;

  // Analytics
  productCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CategorySEO {
  metaTitle: string;
  arabicMetaTitle: string;
  metaDescription: string;
  arabicMetaDescription: string;
  keywords: string[];
  arabicKeywords: string[];
}

// ============= Brand & Supplier Management =============

export interface Brand {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  description?: string;
  arabicDescription?: string;

  // Media
  logo?: string;
  banner?: string;

  // Information
  website?: string;
  countryOfOrigin: string;
  establishedYear?: number;

  // SEO
  seo: BrandSEO;

  // Status
  isActive: boolean;
  isVerified: boolean;

  // Analytics
  productCount: number;
  popularityScore: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandSEO {
  metaTitle: string;
  arabicMetaTitle: string;
  metaDescription: string;
  arabicMetaDescription: string;
  keywords: string[];
  arabicKeywords: string[];
}

export interface Supplier {
  id: string;
  userId: string; // Reference to User
  companyName: string;
  companyNameArabic: string;
  slug: string;

  // Business Information
  businessLicense: string;
  taxNumber: string;
  establishedYear?: number;
  website?: string;

  // Contact Information
  contactPerson: {
    name: string;
    arabicName: string;
    position: string;
    phone: string;
    email: string;
  };

  // Address & Location
  address: Address;

  // Financial
  bankAccount: BankAccount;

  // Media
  logo?: string;
  banner?: string;
  gallery?: string[];

  // Verification & Status
  verificationStatus: "pending" | "verified" | "rejected";
  isActive: boolean;

  // Performance Metrics
  metrics: SupplierMetrics;

  // Settings
  settings: SupplierSettings;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

export interface SupplierMetrics {
  rating: number;
  reviewCount: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedOrders: number;
  revenue: number;
  responseTime: number; // in hours
  onTimeDeliveryRate: number; // percentage
  returnRate: number; // percentage
}

export interface SupplierSettings {
  automaticApproval: boolean;
  allowReviews: boolean;
  minimumOrderAmount?: number;
  shippingMethods: string[];
  paymentMethods: string[];
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
}

// ============= Tag System =============

export interface Tag {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  color?: string;
  description?: string;
  arabicDescription?: string;

  // Categorization
  type: "general" | "feature" | "material" | "use_case" | "target_audience";

  // Analytics
  usageCount: number;

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============= Order Management System =============

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  RETURNED = "returned",
  FAILED = "failed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export interface Order {
  id: string;
  orderNumber: string;

  // Customer Information
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  // Order Details
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: "IQD" | "USD";

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Addresses
  shippingAddress: Address;
  billingAddress?: Address;

  // Shipping
  shippingMethod: {
    id: string;
    name: string;
    arabicName: string;
    cost: number;
    estimatedDelivery: {
      min: number;
      max: number;
      unit: "hours" | "days" | "weeks";
    };
  };

  // Payment
  payment: PaymentDetails;

  // Fulfillment
  fulfillment: OrderFulfillment;

  // Communication
  notes?: string;
  internalNotes?: string;

  // Tracking
  timeline: OrderEvent[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expectedDeliveryAt?: Date;
  deliveredAt?: Date;

  // Analytics
  source: "web" | "mobile" | "admin" | "api";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameArabic: string;
  sku: string;
  image: string;

  // Pricing
  unitPrice: number;
  salePrice?: number;
  quantity: number;
  totalPrice: number;

  // Supplier
  supplierId: string;
  supplierName: string;

  // Product Details at time of order
  productSnapshot: {
    specifications: ProductSpecification[];
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };

  // Status
  status: "pending" | "confirmed" | "cancelled" | "shipped" | "delivered";

  // Fulfillment
  shippedAt?: Date;
  deliveredAt?: Date;
  trackingNumber?: string;
}

export interface PaymentDetails {
  id: string;
  method:
    | "cash_on_delivery"
    | "bank_transfer"
    | "credit_card"
    | "digital_wallet";
  provider?: string;
  transactionId?: string;
  reference?: string;

  // Amounts
  amount: number;
  paidAmount: number;
  remainingAmount: number;

  // Status
  status: PaymentStatus;

  // Details
  details?: {
    cardLast4?: string;
    bankName?: string;
    accountNumber?: string;
  };

  // Timestamps
  initiatedAt: Date;
  paidAt?: Date;
  failedAt?: Date;
}

export interface OrderFulfillment {
  supplier: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };

  // Packing
  packingSlips: PackingSlip[];

  // Shipping
  carrier?: {
    name: string;
    trackingNumber: string;
    trackingUrl: string;
  };

  // Status
  packedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;

  // Delivery
  deliveryNotes?: string;
  receivedBy?: string;
  deliveryPhoto?: string;
}

export interface PackingSlip {
  id: string;
  items: OrderItem[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  trackingNumber?: string;
}

export interface OrderEvent {
  id: string;
  type: "status_change" | "payment" | "shipment" | "note" | "communication";
  title: string;
  arabicTitle: string;
  description?: string;
  arabicDescription?: string;

  // Data
  data?: Record<string, any>;

  // Actor
  actorId?: string;
  actorName?: string;
  actorRole?: UserRole;

  // Visibility
  isPublic: boolean; // Visible to customer

  // Timestamp
  createdAt: Date;
}

// ============= Promotion & Offer System =============

export enum OfferType {
  DISCOUNT_PERCENTAGE = "discount_percentage",
  DISCOUNT_FIXED = "discount_fixed",
  FREE_SHIPPING = "free_shipping",
  BUY_X_GET_Y = "buy_x_get_y",
  BUNDLE = "bundle",
  CATEGORY_DISCOUNT = "category_discount",
  BULK_DISCOUNT = "bulk_discount",
  FIRST_ORDER = "first_order",
  LOYALTY = "loyalty",
}

export interface Offer {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;

  // Type & Configuration
  type: OfferType;
  configuration: OfferConfiguration;

  // Conditions
  conditions: OfferCondition[];

  // Validity
  startDate: Date;
  endDate?: Date;
  isActive: boolean;

  // Usage Limits
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  currentUsage: number;

  // Targeting
  targetAudience: OfferTargeting;

  // Products
  applicableProducts?: string[]; // Product IDs
  applicableCategories?: string[]; // Category IDs
  applicableBrands?: string[]; // Brand IDs

  // Display
  badge?: {
    text: string;
    arabicText: string;
    color: string;
    backgroundColor: string;
  };

  // Priority
  priority: number;

  // Analytics
  analytics: OfferAnalytics;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Creator
  createdBy: string; // User ID
  supplierIds?: string[]; // If supplier-specific
}

export interface OfferConfiguration {
  // Discount Configuration
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscountAmount?: number;

  // Buy X Get Y Configuration
  buyQuantity?: number;
  getQuantity?: number;
  getProductIds?: string[];

  // Bundle Configuration
  bundleProducts?: {
    productId: string;
    quantity: number;
    discountPercentage?: number;
  }[];

  // Bulk Discount Configuration
  bulkTiers?: {
    minQuantity: number;
    discountPercentage: number;
  }[];
}

export interface OfferCondition {
  field: string; // 'order_total', 'product_quantity', 'customer_group', etc.
  operator: "equals" | "greater_than" | "less_than" | "contains" | "in";
  value: any;
  logicalOperator?: "AND" | "OR";
}

export interface OfferTargeting {
  customerGroups?: string[];
  governorates?: string[];
  cities?: string[];
  newCustomersOnly?: boolean;
  returningCustomersOnly?: boolean;
  minOrderValue?: number;
  maxOrderValue?: number;
}

export interface OfferAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  discountGiven: number;
  averageOrderValue: number;
  conversionRate: number;
}

// ============= Search & Filtering System =============

export interface SearchFilters {
  // Text Search
  query?: string;

  // Categorization
  categoryIds?: string[];
  brandIds?: string[];
  supplierIds?: string[];
  tagIds?: string[];

  // Pricing
  minPrice?: number;
  maxPrice?: number;

  // Product Attributes
  inStock?: boolean;
  hasDiscount?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;

  // Badges & Features
  badges?: BadgeType[];
  features?: string[];

  // Sorting
  sortBy?:
    | "relevance"
    | "price_low"
    | "price_high"
    | "newest"
    | "rating"
    | "popularity";

  // Pagination
  page?: number;
  limit?: number;

  // Advanced Filters
  specifications?: {
    name: string;
    values: string[];
  }[];

  // Geographic
  governorates?: string[];
  cities?: string[];

  // Temporal
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Aggregations
  aggregations: {
    categories: {
      id: string;
      name: string;
      count: number;
    }[];
    brands: {
      id: string;
      name: string;
      count: number;
    }[];
    priceRanges: {
      min: number;
      max: number;
      count: number;
    }[];
    ratings: {
      rating: number;
      count: number;
    }[];
  };

  // Search Metadata
  query?: string;
  searchTime: number; // in milliseconds
  suggestions?: string[];
}

// ============= Analytics & Reporting =============

export interface SystemAnalytics {
  // Product Analytics
  products: {
    total: number;
    active: number;
    outOfStock: number;
    pending: number;
    topSellingIds: string[];
    lowStockIds: string[];
  };

  // Order Analytics
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  };

  // User Analytics
  users: {
    totalCustomers: number;
    activeCustomers: number;
    totalSuppliers: number;
    activeSuppliers: number;
    newRegistrations: number;
  };

  // Performance Metrics
  performance: {
    averageResponseTime: number;
    uptime: number;
    errorRate: number;
    searchPerformance: number;
  };

  // Traffic Analytics
  traffic: {
    totalPageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    conversionRate: number;
    topPages: {
      path: string;
      views: number;
    }[];
  };
}

// ============= Notification System =============

export enum NotificationType {
  ORDER_PLACED = "order_placed",
  ORDER_CONFIRMED = "order_confirmed",
  ORDER_SHIPPED = "order_shipped",
  ORDER_DELIVERED = "order_delivered",
  ORDER_CANCELLED = "order_cancelled",
  PRODUCT_APPROVED = "product_approved",
  PRODUCT_REJECTED = "product_rejected",
  LOW_STOCK = "low_stock",
  PRICE_CHANGE = "price_change",
  NEW_MESSAGE = "new_message",
  SYSTEM_UPDATE = "system_update",
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  arabicTitle: string;
  message: string;
  arabicMessage: string;

  // Targeting
  userId?: string;
  userRole?: UserRole;
  userIds?: string[];

  // Data
  data?: Record<string, any>;

  // Links
  actionUrl?: string;

  // Status
  isRead: boolean;
  isArchived: boolean;

  // Delivery
  channels: ("push" | "email" | "sms" | "in_app")[];
  sentAt?: Date;
  readAt?: Date;

  // Timestamps
  createdAt: Date;
  expiresAt?: Date;
}

// ============= System Configuration =============

export interface SystemConfig {
  // General Settings
  siteName: string;
  siteNameArabic: string;
  siteDescription: string;
  siteDescriptionArabic: string;
  defaultLanguage: "ar" | "en";
  defaultCurrency: "IQD" | "USD";
  timezone: string;

  // Business Settings
  businessInfo: {
    name: string;
    nameArabic: string;
    address: Address;
    phone: string;
    email: string;
    website: string;
    taxNumber: string;
    commercialRegistry: string;
  };

  // Payment Settings
  paymentMethods: {
    cashOnDelivery: boolean;
    bankTransfer: boolean;
    creditCard: boolean;
    digitalWallet: boolean;
  };

  // Shipping Settings
  shippingZones: ShippingZone[];

  // Tax Settings
  taxConfig: {
    defaultRate: number;
    included: boolean;
    enableTax: boolean;
  };

  // Features
  features: {
    enableReviews: boolean;
    enableWishlist: boolean;
    enableCompare: boolean;
    enableInventoryTracking: boolean;
    enableBackorders: boolean;
    enableGuestCheckout: boolean;
    enableSocialLogin: boolean;
  };

  // Limits
  limits: {
    maxProductImages: number;
    maxProductVideos: number;
    maxFileSize: number; // in MB
    maxProductsPerSupplier: number;
    maxOrderItems: number;
  };

  // Notifications
  notificationSettings: {
    email: {
      enabled: boolean;
      smtp: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: "tls" | "ssl" | "none";
      };
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
    push: {
      enabled: boolean;
      fcmServerKey: string;
    };
  };
}

export interface ShippingZone {
  id: string;
  name: string;
  arabicName: string;
  governorates: string[];
  methods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  arabicName: string;
  cost: number;
  freeShippingThreshold?: number;
  estimatedDelivery: {
    min: number;
    max: number;
    unit: "hours" | "days" | "weeks";
  };
  isActive: boolean;
}
