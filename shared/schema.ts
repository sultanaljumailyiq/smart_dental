import { pgTable, serial, varchar, text, decimal, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table - includes suppliers, clinics, and other roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  supabaseId: varchar("supabase_id", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("customer"), // supplier, customer, admin, dentist
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }), // المحافظة العراقية (إلزامي للأطباء والموردين)
  avatar: text("avatar"),
  verified: boolean("verified").default(false),
  
  // Iraqi Dental Union endorsement (for dentists)
  unionEndorsed: boolean("union_endorsed").default(false), // مدعوم من نقابة الأسنان العراقية
  unionEndorsedAt: timestamp("union_endorsed_at"), // تاريخ الاعتماد من النقابة
  unionCertificateNumber: varchar("union_certificate_number", { length: 100 }), // رقم شهادة النقابة
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier profiles
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  arabicCompanyName: varchar("arabic_company_name", { length: 255 }),
  email: varchar("email", { length: 255 }), // Supplier email
  phone: varchar("phone", { length: 50 }), // Supplier phone
  description: text("description"),
  arabicDescription: text("arabic_description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  speciality: varchar("speciality", { length: 255 }),
  location: varchar("location", { length: 255 }),
  established: integer("established"),
  verified: boolean("verified").default(false),
  isApproved: boolean("is_approved").default(false),
  approvalNote: text("approval_note"),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  totalProducts: integer("total_products").default(0),
  totalOrders: integer("total_orders").default(0),
  website: varchar("website", { length: 255 }),
  badges: jsonb("badges").$type<string[]>().default([]),
  services: jsonb("services").$type<string[]>().default([]),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  responseTime: varchar("response_time", { length: 100 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  
  // Iraqi Dental Union endorsement & location
  province: varchar("province", { length: 100 }), // المحافظة العراقية (إلزامي عند التسجيل)
  unionEndorsed: boolean("union_endorsed").default(false), // مدعوم من نقابة الأسنان العراقية - لا عمولة
  unionEndorsedAt: timestamp("union_endorsed_at"), // تاريخ الاعتماد من النقابة
  unionCertificateNumber: varchar("union_certificate_number", { length: 100 }), // رقم شهادة النقابة
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  icon: varchar("icon", { length: 255 }),
  image: text("image"),
  parentId: integer("parent_id"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brands
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  logo: text("logo"),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  website: varchar("website", { length: 255 }),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  brandId: integer("brand_id").references(() => brands.id),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  sku: varchar("sku", { length: 100 }).unique().notNull(),
  barcode: varchar("barcode", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  stockQuantity: integer("stock_quantity").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  maxOrderQuantity: integer("max_order_quantity"),
  weight: varchar("weight", { length: 50 }),
  dimensions: varchar("dimensions", { length: 100 }),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  arabicFeatures: jsonb("arabic_features").$type<string[]>().default([]),
  specifications: jsonb("specifications").default({}),
  arabicSpecifications: jsonb("arabic_specifications").default({}),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  warranty: varchar("warranty", { length: 100 }),
  certification: jsonb("certification").$type<string[]>().default([]),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  viewCount: integer("view_count").default(0),
  orderCount: integer("order_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  freeShipping: boolean("free_shipping").default(false),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 100 }).unique().notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: varchar("payment_method", { length: 100 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  estimatedDelivery: timestamp("estimated_delivery"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productArabicName: varchar("product_arabic_name", { length: 255 }),
  productImage: text("product_image"),
  sku: varchar("sku", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("10.00"), // Platform commission percentage
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).default("0.00"), // Calculated commission
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, shipped, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Commission Settings - platform commission rates per supplier
export const commissionSettings = pgTable("commission_settings", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull().unique(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("10.00"), // percentage
  minCommission: decimal("min_commission", { precision: 10, scale: 2 }).default("0.00"), // minimum commission per order
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Iraqi Provinces - المحافظات العراقية
export const iraqiProvinces = pgTable("iraqi_provinces", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull().unique(), // Baghdad, Basra, etc.
  nameAr: varchar("name_ar", { length: 100 }).notNull(), // بغداد، البصرة، إلخ
  code: varchar("code", { length: 10 }).unique().notNull(), // BGD, BAS, etc.
  region: varchar("region", { length: 50 }), // Central, South, North, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Order Returns - مرتجعات الطلبات
export const orderReturns = pgTable("order_returns", {
  id: serial("id").primaryKey(),
  returnNumber: varchar("return_number", { length: 100 }).unique().notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // defective, wrong_item, not_as_described, changed_mind
  reasonArabic: varchar("reason_arabic", { length: 255 }),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, refunded, completed
  quantity: integer("quantity").notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundMethod: varchar("refund_method", { length: 100 }), // original_payment, store_credit, replacement
  images: jsonb("images").$type<string[]>().default([]),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  refundedAt: timestamp("refunded_at"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Deliveries - شحنات وتوصيل الطلبات
export const orderDeliveries = pgTable("order_deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  carrier: varchar("carrier", { length: 100 }), // شركة التوصيل
  carrierArabic: varchar("carrier_arabic", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, picked_up, in_transit, out_for_delivery, delivered, failed, returned
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  estimatedDelivery: timestamp("estimated_delivery"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  deliveryProof: jsonb("delivery_proof").$type<{ images: string[], signature?: string, notes?: string }>(),
  recipientName: varchar("recipient_name", { length: 255 }),
  recipientPhone: varchar("recipient_phone", { length: 50 }),
  deliveryAddress: jsonb("delivery_address").notNull(),
  currentLocation: varchar("current_location", { length: 255 }),
  failedReason: text("failed_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Delivery History - تاريخ تتبع الشحنات
export const deliveryHistory = pgTable("delivery_history", {
  id: serial("id").primaryKey(),
  deliveryId: integer("delivery_id").references(() => orderDeliveries.id).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  statusArabic: varchar("status_arabic", { length: 100 }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Supplier Messages - رسائل الموردين
export const supplierMessages = pgTable("supplier_messages", {
  id: serial("id").primaryKey(),
  conversationId: varchar("conversation_id", { length: 100 }).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(), // who sent the message
  senderType: varchar("sender_type", { length: 50 }).notNull(), // supplier, customer
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  orderId: integer("order_id").references(() => orders.id), // optional - if related to order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cart
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Favorites/Wishlist
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false), // verified purchase
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  supplierProfile: one(suppliers, {
    fields: [users.id],
    references: [suppliers.userId],
  }),
  orders: many(orders),
  cart: many(cart),
  favorites: many(favorites),
  reviews: many(reviews),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  user: one(users, {
    fields: [suppliers.userId],
    references: [users.id],
  }),
  products: many(products),
  orderItems: many(orderItems),
  returns: many(orderReturns),
  deliveries: many(orderDeliveries),
  messages: many(supplierMessages),
  notifications: many(supplierNotifications),
  commissionSetting: one(commissionSettings, {
    fields: [suppliers.id],
    references: [commissionSettings.supplierId],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cart),
  favorites: many(favorites),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
  returns: many(orderReturns),
  deliveries: many(orderDeliveries),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [orderItems.supplierId],
    references: [suppliers.id],
  }),
  returns: many(orderReturns),
}));

export const commissionSettingsRelations = relations(commissionSettings, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [commissionSettings.supplierId],
    references: [suppliers.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

// Order Returns Relations
export const orderReturnsRelations = relations(orderReturns, ({ one }) => ({
  order: one(orders, {
    fields: [orderReturns.orderId],
    references: [orders.id],
  }),
  orderItem: one(orderItems, {
    fields: [orderReturns.orderItemId],
    references: [orderItems.id],
  }),
  supplier: one(suppliers, {
    fields: [orderReturns.supplierId],
    references: [suppliers.id],
  }),
  customer: one(users, {
    fields: [orderReturns.customerId],
    references: [users.id],
  }),
  approvedByUser: one(users, {
    fields: [orderReturns.approvedBy],
    references: [users.id],
  }),
}));

// Order Deliveries Relations
export const orderDeliveriesRelations = relations(orderDeliveries, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderDeliveries.orderId],
    references: [orders.id],
  }),
  supplier: one(suppliers, {
    fields: [orderDeliveries.supplierId],
    references: [suppliers.id],
  }),
  history: many(deliveryHistory),
}));

// Delivery History Relations
export const deliveryHistoryRelations = relations(deliveryHistory, ({ one }) => ({
  delivery: one(orderDeliveries, {
    fields: [deliveryHistory.deliveryId],
    references: [orderDeliveries.id],
  }),
}));

// Supplier Messages Relations
export const supplierMessagesRelations = relations(supplierMessages, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierMessages.supplierId],
    references: [suppliers.id],
  }),
  customer: one(users, {
    fields: [supplierMessages.customerId],
    references: [users.id],
  }),
  sender: one(users, {
    fields: [supplierMessages.senderId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [supplierMessages.orderId],
    references: [orders.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// Clinics table - dental clinics registered in the platform
export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // optional - if clinic has user account
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address").notNull(),
  arabicAddress: text("arabic_address"),
  governorate: varchar("governorate", { length: 100 }).notNull(), // المحافظة
  city: varchar("city", { length: 100 }).notNull(),
  locationLat: decimal("location_lat", { precision: 10, scale: 7 }).notNull(),
  locationLng: decimal("location_lng", { precision: 10, scale: 7 }).notNull(),
  specialty: jsonb("specialty").$type<string[]>().default([]), // specialties array
  arabicSpecialty: jsonb("arabic_specialty").$type<string[]>().default([]),
  doctorName: varchar("doctor_name", { length: 255 }),
  arabicDoctorName: varchar("arabic_doctor_name", { length: 255 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  image: text("image"),
  images: jsonb("images").$type<string[]>().default([]),
  workingHours: jsonb("working_hours").default({}), // { saturday: "9:00-17:00", ... }
  services: jsonb("services").$type<string[]>().default([]),
  arabicServices: jsonb("arabic_services").$type<string[]>().default([]),
  
  // Subscription & Promotion fields
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free"), // free, basic, premium, enterprise
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  isPromoted: boolean("is_promoted").default(false), // paid promotion
  priorityLevel: integer("priority_level").default(0), // 0 = normal, higher = more priority
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMonths: integer("duration_months").notNull(), // subscription duration in months
  features: jsonb("features").$type<string[]>().default([]),
  arabicFeatures: jsonb("arabic_features").$type<string[]>().default([]),
  canBePromoted: boolean("can_be_promoted").default(false), // can clinics with this plan be promoted
  maxPriorityLevel: integer("max_priority_level").default(0), // maximum priority for this plan
  showInTop: boolean("show_in_top").default(false), // show in top results
  maxMonthlyAppearances: integer("max_monthly_appearances"), // limit on how many times shown per month
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Clinic Payments
export const clinicPayments = pgTable("clinic_payments", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("IQD"),
  paymentMethod: varchar("payment_method", { length: 100 }), // stripe, zain_cash, cash, etc
  
  // Stripe fields
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }), // Stripe payment ID
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }), // Stripe customer ID
  
  // Zain Cash fields
  zainCashTransferNumber: varchar("zain_cash_transfer_number", { length: 100 }), // رقم التحويل
  zainCashTransferAmount: decimal("zain_cash_transfer_amount", { precision: 10, scale: 2 }), // مبلغ التحويل
  zainCashTransactionId: varchar("zain_cash_transaction_id", { length: 255 }), // ZainCash API transaction ID
  
  // Cash payment fields
  cashCenterId: integer("cash_center_id"), // مركز الدفع النقدي
  cashReceiptNumber: varchar("cash_receipt_number", { length: 100 }), // رقم الإيصال
  
  // Coupon fields
  couponId: integer("coupon_id").references(() => coupons.id),
  couponCode: varchar("coupon_code", { length: 50 }),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0.00"),
  
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, completed, failed, refunded
  paymentDate: timestamp("payment_date"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  invoiceUrl: text("invoice_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment Settings - إعدادات طرق الدفع
export const paymentSettings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  
  // Zain Cash Settings
  zainCashEnabled: boolean("zain_cash_enabled").default(true),
  zainCashPhoneNumber: varchar("zain_cash_phone_number", { length: 20 }), // رقم هاتف زين كاش
  zainCashAccountName: varchar("zain_cash_account_name", { length: 255 }), // اسم حساب زين كاش
  zainCashQrCodeUrl: text("zain_cash_qr_code_url"), // رابط صورة QR Code
  zainCashMerchantId: varchar("zain_cash_merchant_id", { length: 255 }), // Merchant ID from ZainCash
  zainCashSecret: text("zain_cash_secret"), // Merchant secret for JWT
  zainCashTestMode: boolean("zain_cash_test_mode").default(true), // Test or production mode
  
  // Cash Payment Settings
  cashEnabled: boolean("cash_enabled").default(true),
  cashInstructions: text("cash_instructions"), // تعليمات الدفع النقدي
  cashInstructionsArabic: text("cash_instructions_arabic"),
  
  // Stripe Settings
  stripeEnabled: boolean("stripe_enabled").default(false),
  stripePublishableKey: text("stripe_publishable_key"),
  stripeSecretKey: text("stripe_secret_key"),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cash Payment Centers - مراكز الدفع النقدي
export const cashPaymentCenters = pgTable("cash_payment_centers", {
  id: serial("id").primaryKey(),
  governorate: varchar("governorate", { length: 100 }).notNull(), // المحافظة
  governorateArabic: varchar("governorate_arabic", { length: 100 }).notNull(),
  centerName: varchar("center_name", { length: 255 }).notNull(), // اسم المركز
  centerNameArabic: varchar("center_name_arabic", { length: 255 }).notNull(),
  address: text("address"),
  addressArabic: text("address_arabic"),
  phoneNumber: varchar("phone_number", { length: 20 }), // رقم الهاتف
  alternativePhone: varchar("alternative_phone", { length: 20 }), // رقم بديل
  workingHours: varchar("working_hours", { length: 255 }), // ساعات العمل
  workingHoursArabic: varchar("working_hours_arabic", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }), // Coordinates for map
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Map Settings - for managing Google Maps settings
export const mapSettings = pgTable("map_settings", {
  id: serial("id").primaryKey(),
  googleMapsApiKey: text("google_maps_api_key"), // Google Maps API key
  defaultCenterLat: decimal("default_center_lat", { precision: 10, scale: 7 }).default("33.3152"), // Baghdad center
  defaultCenterLng: decimal("default_center_lng", { precision: 10, scale: 7 }).default("44.3661"), // Baghdad center
  defaultZoom: integer("default_zoom").default(12),
  enableGeolocation: boolean("enable_geolocation").default(true),
  searchRadius: integer("search_radius").default(50), // km
  maxClinicsToShow: integer("max_clinics_to_show").default(20),
  promotedClinicsFirst: boolean("promoted_clinics_first").default(true), // show promoted clinics first
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment Methods - Iraqi-specific payment options
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  arabicName: varchar("arabic_name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // stripe, cash, zaincash, asiacell_cash
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  icon: varchar("icon", { length: 255 }),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  fees: decimal("fees", { precision: 5, scale: 2 }).default("0.00"), // percentage fee
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }).default("0.00"),
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }),
  config: jsonb("config").default({}), // method-specific config
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Promotions - للعروض الترويجية والتخفيضات
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  discountPercentage: integer("discount_percentage").notNull(), // نسبة الخصم
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  planIds: jsonb("plan_ids").$type<number[]>().default([]), // IDs of plans included
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0), // عدد مرات الاستخدام
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Coupons - قسائم الخصم
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(), // كود القسيمة
  discountType: varchar("discount_type", { length: 20 }).notNull(), // percentage or fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxUsage: integer("max_usage").default(0), // 0 = unlimited
  currentUsage: integer("current_usage").default(0),
  expiryDate: timestamp("expiry_date"),
  planIds: jsonb("plan_ids").$type<number[]>().default([]), // plans this coupon applies to
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Coupon Usage - تتبع استخدام القسائم
export const couponUsage = pgTable("coupon_usage", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => coupons.id).notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  paymentId: integer("payment_id").references(() => clinicPayments.id),
  discountApplied: decimal("discount_applied", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

// Subscription Analytics - تحليلات الاشتراكات
export const subscriptionAnalytics = pgTable("subscription_analytics", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM format
  patientsCount: integer("patients_count").default(0),
  aiUsageCount: integer("ai_usage_count").default(0),
  remindersCount: integer("reminders_count").default(0),
  suggestionsCount: integer("suggestions_count").default(0),
  appointmentsCount: integer("appointments_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Renewal Reminders - تذكيرات تجديد الاشتراك
export const renewalReminders = pgTable("renewal_reminders", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  reminderType: varchar("reminder_type", { length: 50 }).notNull(), // 7_days, 3_days, 1_day, expired
  sentAt: timestamp("sent_at"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, sent, clicked, renewed
  expiryDate: timestamp("expiry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Support Tickets - تذاكر الدعم الفني للاشتراكات
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 50 }).unique().notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
  status: varchar("status", { length: 50 }).default("open"), // open, in_progress, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Roles - أدوار المستخدمين
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  arabicName: varchar("arabic_name", { length: 100 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  level: integer("level").notNull(), // hierarchy level (higher = more permissions)
  isSystem: boolean("is_system").default(false), // system roles can't be deleted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Permissions - الصلاحيات
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  resource: varchar("resource", { length: 100 }).notNull(), // clinic_old, dentist-hub, marketplace, etc
  action: varchar("action", { length: 100 }).notNull(), // read, write, delete, etc
  name: varchar("name", { length: 100 }).notNull(),
  arabicName: varchar("arabic_name", { length: 100 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueResourceAction: uniqueIndex("unique_resource_action").on(table.resource, table.action),
}));

// Role Permissions - ربط الأدوار بالصلاحيات
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueRolePermission: uniqueIndex("role_permissions_role_id_permission_id_key").on(table.roleId, table.permissionId),
}));

// User Roles - أدوار المستخدمين (يمكن للمستخدم أن يكون له عدة أدوار)
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id), // optional - role specific to clinic
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUserRoleClinic: uniqueIndex("user_roles_user_id_role_id_clinic_id_key").on(table.userId, table.roleId, table.clinicId),
}));

// User Permissions - صلاحيات مباشرة للمستخدمين
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id).notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id), // optional - permission specific to clinic
  grantedBy: integer("granted_by").references(() => users.id), // who granted this permission
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // optional - permission expiry
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUserPermissionClinic: uniqueIndex("user_permissions_user_id_permission_id_clinic_id_key").on(table.userId, table.permissionId, table.clinicId),
}));

// Staff - الطاقم الطبي
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // optional - if staff has user account
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  roleId: integer("role_id").references(() => roles.id), // reference to roles table
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 100 }).unique(), // for login
  password: varchar("password", { length: 255 }), // hashed password
  role: varchar("role", { length: 100 }).notNull(), // doctor, nurse, assistant, receptionist, etc
  arabicRole: varchar("arabic_role", { length: 100 }),
  specialization: varchar("specialization", { length: 255 }),
  arabicSpecialization: varchar("arabic_specialization", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  licenseNumber: varchar("license_number", { length: 100 }),
  experience: integer("experience").default(0), // years of experience
  joinDate: timestamp("join_date"),
  status: varchar("status", { length: 50 }).default("active"), // active, inactive, on_leave
  salary: decimal("salary", { precision: 10, scale: 2 }),
  workingHours: jsonb("working_hours").default({}), // { saturday: "9:00-17:00", ... }
  permissions: jsonb("permissions").$type<string[]>().default([]), // custom permissions for this staff
  canAccessSections: jsonb("can_access_sections").$type<string[]>().default([]), // sections they can access
  isOwner: boolean("is_owner").default(false), // is this staff the clinic owner
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier Approval - موافقات الموردين
export const supplierApprovals = pgTable("supplier_approvals", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  arabicRejectionReason: text("arabic_rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Platform Commission - عمولات المنصة من الموردين
export const platformCommissions = pgTable("platform_commissions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  orderTotal: decimal("order_total", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(), // percentage
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, cancelled
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier Analytics - تحليلات الموردين
export const supplierAnalytics = pgTable("supplier_analytics", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM format
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  totalCommission: decimal("total_commission", { precision: 10, scale: 2 }).default("0.00"),
  netRevenue: decimal("net_revenue", { precision: 10, scale: 2 }).default("0.00"),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }).default("0.00"),
  newCustomers: integer("new_customers").default(0),
  productsSold: integer("products_sold").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier Notifications - إشعارات الموردين
export const supplierNotifications = pgTable("supplier_notifications", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // pending_approval, approved, rejected, reminder
  title: varchar("title", { length: 255 }).notNull(),
  titleArabic: varchar("title_arabic", { length: 255 }).notNull(),
  message: text("message").notNull(),
  messageArabic: text("message_arabic").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const clinicsRelations = relations(clinics, ({ one, many }) => ({
  user: one(users, {
    fields: [clinics.userId],
    references: [users.id],
  }),
  payments: many(clinicPayments),
  staff: many(staff),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  payments: many(clinicPayments),
}));

export const clinicPaymentsRelations = relations(clinicPayments, ({ one }) => ({
  clinic: one(clinics, {
    fields: [clinicPayments.clinicId],
    references: [clinics.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [clinicPayments.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  clinic: one(clinics, {
    fields: [userRoles.clinicId],
    references: [clinics.id],
  }),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userPermissions.userId],
    references: [users.id],
  }),
  permission: one(permissions, {
    fields: [userPermissions.permissionId],
    references: [permissions.id],
  }),
  clinic: one(clinics, {
    fields: [userPermissions.clinicId],
    references: [clinics.id],
  }),
  grantedByUser: one(users, {
    fields: [userPermissions.grantedBy],
    references: [users.id],
  }),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),
  clinic: one(clinics, {
    fields: [staff.clinicId],
    references: [clinics.id],
  }),
  roleRef: one(roles, {
    fields: [staff.roleId],
    references: [roles.id],
  }),
}));

export const supplierApprovalsRelations = relations(supplierApprovals, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierApprovals.supplierId],
    references: [suppliers.id],
  }),
  reviewer: one(users, {
    fields: [supplierApprovals.reviewedBy],
    references: [users.id],
  }),
}));

export const platformCommissionsRelations = relations(platformCommissions, ({ one }) => ({
  order: one(orders, {
    fields: [platformCommissions.orderId],
    references: [orders.id],
  }),
  supplier: one(suppliers, {
    fields: [platformCommissions.supplierId],
    references: [suppliers.id],
  }),
}));

export const supplierAnalyticsRelations = relations(supplierAnalytics, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierAnalytics.supplierId],
    references: [suppliers.id],
  }),
}));

export const supplierNotificationsRelations = relations(supplierNotifications, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierNotifications.supplierId],
    references: [suppliers.id],
  }),
}));

// Staff Tasks - نظام المهام بين الموظفين
export const staffTasks = pgTable("staff_tasks", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  fromStaffId: integer("from_staff_id").references(() => staff.id).notNull(), // المرسل
  toStaffId: integer("to_staff_id").references(() => staff.id).notNull(), // المستقبل
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // low, medium, high
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, accepted, rejected, completed
  taskType: varchar("task_type", { length: 50 }).notNull().default("general"), // general, treatment_plan, purchase_suggestion, patient_recall, inventory_check, lab_order, appointment_followup
  relatedEntityId: varchar("related_entity_id"), // ID للكيان المرتبط (معالجة، مريض، منتج، إلخ)
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // treatment_plan, patient, product, lab_order, etc
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  rejectionReason: text("rejection_reason"),
  metadata: jsonb("metadata").default({}), // بيانات إضافية مرنة
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Staff Reminders - نظام التذكيرات بين الموظفين
export const staffReminders = pgTable("staff_reminders", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  fromStaffId: integer("from_staff_id").references(() => staff.id).notNull(), // المرسل
  toStaffId: integer("to_staff_id").references(() => staff.id).notNull(), // المستقبل
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  reminderTime: timestamp("reminder_time").notNull(), // وقت التذكير
  reminderType: varchar("reminder_type", { length: 50 }).notNull().default("general"), // general, appointment, medication, followup, lab_result, payment
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, acknowledged, snoozed, dismissed
  snoozedUntil: timestamp("snoozed_until"), // إذا تم تأجيله
  acknowledgedAt: timestamp("acknowledged_at"),
  relatedEntityId: varchar("related_entity_id"), // ID للكيان المرتبط
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // appointment, patient, treatment_plan, etc
  relatedAppointmentId: varchar("related_appointment_id"), // ربط بموعد إذا لزم (string ID)
  metadata: jsonb("metadata").default({}), // بيانات إضافية
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier Badges - وسوم الموردين (موثوق، مميز، جديد، إلخ)
export const supplierBadges = pgTable("supplier_badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // English name
  arabicName: varchar("arabic_name", { length: 100 }).notNull(), // Arabic name
  slug: varchar("slug", { length: 100 }).unique().notNull(), // trusted, featured, new, certified, syndicate_verified, etc
  description: text("description"), // Description
  arabicDescription: text("arabic_description"), // Arabic description
  icon: varchar("icon", { length: 100 }), // Icon name (lucide-react)
  color: varchar("color", { length: 50 }).default("blue"), // Badge color: blue, green, purple, gold, etc
  backgroundColor: varchar("background_color", { length: 50 }), // Background color
  textColor: varchar("text_color", { length: 50 }), // Text color
  order: integer("order").default(0), // Display order
  isActive: boolean("is_active").default(true), // Active status
  requiresApproval: boolean("requires_approval").default(true), // Requires admin approval
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations for Staff Tasks
export const staffTasksRelations = relations(staffTasks, ({ one }) => ({
  clinic: one(clinics, {
    fields: [staffTasks.clinicId],
    references: [clinics.id],
  }),
  fromStaff: one(staff, {
    fields: [staffTasks.fromStaffId],
    references: [staff.id],
  }),
  toStaff: one(staff, {
    fields: [staffTasks.toStaffId],
    references: [staff.id],
  }),
}));

// Relations for Staff Reminders
export const staffRemindersRelations = relations(staffReminders, ({ one }) => ({
  clinic: one(clinics, {
    fields: [staffReminders.clinicId],
    references: [clinics.id],
  }),
  fromStaff: one(staff, {
    fields: [staffReminders.fromStaffId],
    references: [staff.id],
  }),
  toStaff: one(staff, {
    fields: [staffReminders.toStaffId],
    references: [staff.id],
  }),
}));

// Platform Settings - Global platform configuration
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(), // setting key
  value: text("value"), // setting value
  category: varchar("category", { length: 50 }).notNull(), // general, payment, email, sms, etc
  description: text("description"),
  isPublic: boolean("is_public").default(false), // if true, can be accessed by frontend
  dataType: varchar("data_type", { length: 50 }).default("string"), // string, number, boolean, json
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// External Database Connections
export const externalDatabaseConnections = pgTable("external_database_connections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Connection name
  arabicName: varchar("arabic_name", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull(), // postgresql, mysql, mongodb, firebase, supabase
  host: varchar("host", { length: 255 }),
  port: integer("port"),
  database: varchar("database", { length: 255 }),
  username: varchar("username", { length: 255 }),
  passwordEncrypted: text("password_encrypted"), // Encrypted password
  connectionString: text("connection_string"), // For services like Supabase
  isActive: boolean("is_active").default(true),
  lastConnected: timestamp("last_connected"),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// External API Services
export const externalApiServices = pgTable("external_api_services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Service name
  arabicName: varchar("arabic_name", { length: 255 }),
  type: varchar("type", { length: 100 }).notNull(), // stripe, zain_cash, google_maps, openai, twilio, etc
  baseUrl: varchar("base_url", { length: 500 }),
  apiKeyEncrypted: text("api_key_encrypted"), // Encrypted API key
  secretKeyEncrypted: text("secret_key_encrypted"), // Encrypted secret key
  additionalConfig: jsonb("additional_config"), // Additional configuration
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  requestsCount: integer("requests_count").default(0),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Keys Management
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Key name/description
  arabicName: varchar("arabic_name", { length: 255 }),
  keyValue: varchar("key_value", { length: 500 }).unique().notNull(), // The actual API key
  serviceId: integer("service_id").references(() => externalApiServices.id), // Link to service
  permissions: jsonb("permissions").$type<string[]>().default([]), // Permissions for this key
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  rateLimit: integer("rate_limit"), // requests per hour
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Integration Logs
export const integrationLogs = pgTable("integration_logs", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => externalApiServices.id),
  action: varchar("action", { length: 100 }).notNull(), // api_call, connection_test, sync, etc
  status: varchar("status", { length: 50 }).notNull(), // success, failed, pending
  requestData: jsonb("request_data"),
  responseData: jsonb("response_data"),
  errorMessage: text("error_message"),
  executionTime: integer("execution_time"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const platformSettingsRelations = relations(platformSettings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [platformSettings.updatedBy],
    references: [users.id],
  }),
}));

export const externalDatabaseConnectionsRelations = relations(externalDatabaseConnections, ({ one }) => ({
  createdByUser: one(users, {
    fields: [externalDatabaseConnections.createdBy],
    references: [users.id],
  }),
}));

export const externalApiServicesRelations = relations(externalApiServices, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [externalApiServices.createdBy],
    references: [users.id],
  }),
  apiKeys: many(apiKeys),
  logs: many(integrationLogs),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  service: one(externalApiServices, {
    fields: [apiKeys.serviceId],
    references: [externalApiServices.id],
  }),
  createdByUser: one(users, {
    fields: [apiKeys.createdBy],
    references: [users.id],
  }),
}));

export const integrationLogsRelations = relations(integrationLogs, ({ one }) => ({
  service: one(externalApiServices, {
    fields: [integrationLogs.serviceId],
    references: [externalApiServices.id],
  }),
}));

// Payment Methods Configuration - إعدادات طرق الدفع
export const paymentMethodsConfig = pgTable("payment_methods_config", {
  id: serial("id").primaryKey(),
  methodType: varchar("method_type", { length: 50 }).notNull(), // zain_cash, exchange_office, stripe, voucher
  methodName: varchar("method_name", { length: 255 }).notNull(),
  methodNameArabic: varchar("method_name_arabic", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // للترتيب في القائمة
  // Zain Cash Configuration
  zainCashPhoneNumber: varchar("zain_cash_phone_number", { length: 50 }),
  zainCashAccountName: varchar("zain_cash_account_name", { length: 255 }),
  // Exchange Office Configuration
  exchangeOfficeName: varchar("exchange_office_name", { length: 255 }),
  exchangeOfficePhone: varchar("exchange_office_phone", { length: 50 }),
  exchangeOfficeAddress: text("exchange_office_address"),
  // Additional Configuration
  instructions: text("instructions"), // تعليمات للمستخدم
  instructionsArabic: text("instructions_arabic"),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"), // رسوم إضافية
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }),
  metadata: jsonb("metadata").default({}), // معلومات إضافية
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Commission Invoices - فواتير العمولات للموردين
export const commissionInvoices = pgTable("commission_invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).unique().notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  periodStart: timestamp("period_start").notNull(), // بداية الفترة
  periodEnd: timestamp("period_end").notNull(), // نهاية الفترة
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).notNull(), // إجمالي المبيعات
  totalCommission: decimal("total_commission", { precision: 12, scale: 2 }).notNull(), // إجمالي العمولة
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, overdue, cancelled
  dueDate: timestamp("due_date"), // تاريخ الاستحقاق
  paidAt: timestamp("paid_at"),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0.00"),
  paymentMethod: varchar("payment_method", { length: 100 }),
  paymentReference: varchar("payment_reference", { length: 255 }), // رقم التحويل أو الإيصال
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Payments - مدفوعات اشتراكات العيادات
export const subscriptionPayments = pgTable("subscription_payments", {
  id: serial("id").primaryKey(),
  paymentNumber: varchar("payment_number", { length: 100 }).unique().notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(), // الطبيب الذي أرسل الدفع
  subscriptionType: varchar("subscription_type", { length: 100 }).notNull(), // basic, premium, enterprise
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // المدة بالأشهر
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // zain_cash, exchange_office, stripe
  // Zain Cash Details
  zainCashPhoneNumber: varchar("zain_cash_phone_number", { length: 50 }),
  zainCashTransactionRef: varchar("zain_cash_transaction_ref", { length: 255 }), // رقم التحويل
  senderName: varchar("sender_name", { length: 255 }), // اسم الراسل
  // Exchange Office Details
  exchangeOfficeName: varchar("exchange_office_name", { length: 255 }),
  depositReceiptNumber: varchar("deposit_receipt_number", { length: 255 }), // رقم إيصال الإيداع
  // Payment Status
  status: varchar("status", { length: 50 }).default("pending_verification"), // pending_verification, verified, rejected, activated
  verificationStatus: varchar("verification_status", { length: 50 }).default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by").references(() => users.id), // المسؤول الذي تحقق
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),
  rejectionReason: text("rejection_reason"),
  // Subscription Activation
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),
  attachments: jsonb("attachments").$type<string[]>().default([]), // صور إيصالات أو إثباتات
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Manual Payment Reviews - قائمة انتظار التحقق من المدفوعات
export const manualPaymentReviews = pgTable("manual_payment_reviews", {
  id: serial("id").primaryKey(),
  reviewNumber: varchar("review_number", { length: 100 }).unique().notNull(),
  paymentType: varchar("payment_type", { length: 50 }).notNull(), // subscription, commission, refund
  referenceId: integer("reference_id").notNull(), // ID من الجدول المرجعي
  referenceType: varchar("reference_type", { length: 50 }).notNull(), // subscription_payment, commission_invoice
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  transactionReference: varchar("transaction_reference", { length: 255 }), // رقم التحويل أو الإيصال
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, in_review, verified, rejected
  assignedTo: integer("assigned_to").references(() => users.id), // المسؤول المكلف بالمراجعة
  assignedAt: timestamp("assigned_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  verificationMethod: varchar("verification_method", { length: 100 }), // manual_check, phone_call, photo_verification
  verificationDetails: jsonb("verification_details").default({}),
  reviewNotes: text("review_notes"),
  priority: varchar("priority", { length: 50 }).default("normal"), // urgent, high, normal, low
  attachments: jsonb("attachments").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier Sales Reports - تقارير مبيعات الموردين
export const supplierSalesReports = pgTable("supplier_sales_reports", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  reportPeriod: varchar("report_period", { length: 50 }).notNull(), // daily, weekly, monthly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0.00"),
  totalCommission: decimal("total_commission", { precision: 12, scale: 2 }).default("0.00"),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }).default("0.00"),
  topProducts: jsonb("top_products").default([]), // قائمة المنتجات الأكثر مبيعاً
  paymentMethods: jsonb("payment_methods").default({}), // توزيع طرق الدفع
  orderStatuses: jsonb("order_statuses").default({}), // توزيع حالات الطلبات
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for new tables
export const paymentMethodsConfigRelations = relations(paymentMethodsConfig, ({ many }) => ({
  subscriptionPayments: many(subscriptionPayments),
}));

export const commissionInvoicesRelations = relations(commissionInvoices, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [commissionInvoices.supplierId],
    references: [suppliers.id],
  }),
}));

export const subscriptionPaymentsRelations = relations(subscriptionPayments, ({ one }) => ({
  clinic: one(clinics, {
    fields: [subscriptionPayments.clinicId],
    references: [clinics.id],
  }),
  user: one(users, {
    fields: [subscriptionPayments.userId],
    references: [users.id],
  }),
  verifier: one(users, {
    fields: [subscriptionPayments.verifiedBy],
    references: [users.id],
  }),
}));

export const manualPaymentReviewsRelations = relations(manualPaymentReviews, ({ one }) => ({
  submitter: one(users, {
    fields: [manualPaymentReviews.submittedBy],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [manualPaymentReviews.assignedTo],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [manualPaymentReviews.reviewedBy],
    references: [users.id],
  }),
}));

export const supplierSalesReportsRelations = relations(supplierSalesReports, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierSalesReports.supplierId],
    references: [suppliers.id],
  }),
}));

export const promotionalCards = pgTable("promotional_cards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  image: text("image"),
  images: jsonb("images").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  displayType: varchar("display_type", { length: 50 }).notNull().default("card"),
  targetSection: jsonb("target_section").$type<string[]>().default([]),
  linkUrl: text("link_url"),
  buttonText: varchar("button_text", { length: 100 }),
  arabicButtonText: varchar("arabic_button_text", { length: 100 }),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  discountPercentage: integer("discount_percentage"),
  priority: integer("priority").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promotionalCardsRelations = relations(promotionalCards, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [promotionalCards.supplierId],
    references: [suppliers.id],
  }),
}));

// Community Moderators & Elite Members
export const communityModerators = pgTable("community_moderators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("moderator"), // moderator, elite, featured
  province: varchar("province", { length: 100 }), // Iraqi province
  badge: varchar("badge", { length: 100 }),
  badgeColor: varchar("badge_color", { length: 50 }),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  bio: text("bio"),
  specialization: varchar("specialization", { length: 255 }),
  canPublishEducational: boolean("can_publish_educational").default(false),
  canModerate: boolean("can_moderate").default(false),
  isActive: boolean("is_active").default(true),
  assignedBy: integer("assigned_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Events/Webinars
export const communityEvents = pgTable("community_events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  eventType: varchar("event_type", { length: 50 }).notNull().default("webinar"), // webinar, workshop, conference
  isExternal: boolean("is_external").default(false),
  externalUrl: text("external_url"),
  platform: varchar("platform", { length: 100 }), // Zoom, Teams, Google Meet, etc.
  meetingLink: text("meeting_link"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  duration: integer("duration"), // in minutes
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  speakerName: varchar("speaker_name", { length: 255 }),
  speakerBio: text("speaker_bio"),
  speakerImage: text("speaker_image"),
  coverImage: text("cover_image"),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  category: varchar("category", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  isFree: boolean("is_free").default(true),
  status: varchar("status", { length: 50 }).default("upcoming"), // upcoming, ongoing, completed, cancelled
  registrationDeadline: timestamp("registration_deadline"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Trusted Sources
export const communityTrustedSources = pgTable("community_trusted_sources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  sourceUrl: text("source_url").notNull(),
  sourceName: varchar("source_name", { length: 255 }).notNull(), // e.g., "PubMed", "WHO", "ADA"
  sourceType: varchar("source_type", { length: 50 }).notNull(), // article, research, guideline, news
  thumbnail: text("thumbnail"),
  author: varchar("author", { length: 255 }),
  publishDate: timestamp("publish_date"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  addedBy: integer("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community 3D Models from Sketchfab
export const community3DModels = pgTable("community_3d_models", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  sketchfabUrl: text("sketchfab_url").notNull(),
  sketchfabType: varchar("sketchfab_type", { length: 50 }).notNull(), // collection, user, model
  sketchfabId: varchar("sketchfab_id", { length: 255 }),
  embedCode: text("embed_code"),
  thumbnail: text("thumbnail"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  modelType: varchar("model_type", { length: 100 }), // anatomy, procedure, implant, etc.
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  addedBy: integer("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Educational Content (Elite-only)
export const communityEducationalContent = pgTable("community_educational_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  arabicContent: text("arabic_content").notNull(),
  excerpt: text("excerpt"),
  arabicExcerpt: text("arabic_excerpt"),
  contentType: varchar("content_type", { length: 50 }).notNull().default("article"), // article, tutorial, case_study
  coverImage: text("cover_image"),
  images: jsonb("images").$type<string[]>().default([]),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  authorId: integer("author_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, published
  isApproved: boolean("is_approved").default(false),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  isPinned: boolean("is_pinned").default(false),
  isFeatured: boolean("is_featured").default(false),
  readTime: integer("read_time"), // in minutes
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Posts
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  image: text("image"),
  images: jsonb("images").$type<string[]>().default([]),
  postType: varchar("post_type", { length: 50 }).default("general"), // general, elite, trusted
  visibility: varchar("visibility", { length: 50 }).default("public"), // public, friends, private
  isPinned: boolean("is_pinned").default(false),
  isApproved: boolean("is_approved").default(true),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Comments
export const communityComments = pgTable("community_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  parentCommentId: integer("parent_comment_id"),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Post Likes
export const communityPostLikes = pgTable("community_post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Comment Likes
export const communityCommentLikes = pgTable("community_comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => communityComments.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Post Saves
export const communityPostSaves = pgTable("community_post_saves", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Follows
export const communityFollows = pgTable("community_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  followedId: integer("followed_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFollowerFollowed: uniqueIndex("community_follows_follower_followed_uidx").on(table.followerId, table.followedId),
}));

// Community Groups
export const communityGroups = pgTable("community_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  coverImage: text("cover_image"),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  groupType: varchar("group_type", { length: 50 }).default("public"), // public, private, elite
  memberCount: integer("member_count").default(0),
  postCount: integer("post_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Group Members
export const communityGroupMembers = pgTable("community_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => communityGroups.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: varchar("role", { length: 50 }).default("member"), // admin, moderator, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Community Courses
export const communityCourses = pgTable("community_courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  instructor: varchar("instructor", { length: 255 }).notNull(),
  arabicInstructor: varchar("arabic_instructor", { length: 255 }),
  coverImage: text("cover_image"),
  duration: varchar("duration", { length: 100 }), // e.g., "4 weeks", "20 hours"
  level: varchar("level", { length: 50 }).default("beginner"), // beginner, intermediate, advanced
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  enrollmentCount: integer("enrollment_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Community Course Enrollments
export const communityCourseEnrollments = pgTable("community_course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => communityCourses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  progress: integer("progress").default(0), // 0-100
  status: varchar("status", { length: 50 }).default("enrolled"), // enrolled, in_progress, completed, dropped
  completedAt: timestamp("completed_at"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

// Stripe Customers - عملاء Stripe
export const stripeCustomers = pgTable("stripe_customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique().notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stripe Subscriptions - اشتراكات Stripe
export const stripeSubscriptions = pgTable("stripe_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique().notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // active, canceled, past_due, incomplete, trialing
  planType: varchar("plan_type", { length: 50 }).notNull(), // basic, premium, enterprise
  amountIQD: decimal("amount_iqd", { precision: 10, scale: 2 }).notNull(), // المبلغ بالدينار العراقي
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(), // المبلغ بالدولار
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).notNull(), // سعر الصرف المستخدم
  interval: varchar("interval", { length: 50 }).notNull(), // month, year
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stripe Payment Intents - نوايا الدفع عبر Stripe
export const stripePaymentIntents = pgTable("stripe_payment_intents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).unique().notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  amountIQD: decimal("amount_iqd", { precision: 10, scale: 2 }).notNull(),
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("usd"),
  status: varchar("status", { length: 50 }).notNull(), // succeeded, processing, requires_payment_method, canceled
  paymentMethod: varchar("payment_method", { length: 100 }),
  description: text("description"),
  receiptEmail: varchar("receipt_email", { length: 255 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const communityModeratorsRelations = relations(communityModerators, ({ one }) => ({
  user: one(users, {
    fields: [communityModerators.userId],
    references: [users.id],
  }),
  assigner: one(users, {
    fields: [communityModerators.assignedBy],
    references: [users.id],
  }),
}));

export const communityEventsRelations = relations(communityEvents, ({ one }) => ({
  creator: one(users, {
    fields: [communityEvents.createdBy],
    references: [users.id],
  }),
}));

export const communityTrustedSourcesRelations = relations(communityTrustedSources, ({ one }) => ({
  adder: one(users, {
    fields: [communityTrustedSources.addedBy],
    references: [users.id],
  }),
}));

export const community3DModelsRelations = relations(community3DModels, ({ one }) => ({
  adder: one(users, {
    fields: [community3DModels.addedBy],
    references: [users.id],
  }),
}));

export const communityEducationalContentRelations = relations(communityEducationalContent, ({ one }) => ({
  author: one(users, {
    fields: [communityEducationalContent.authorId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [communityEducationalContent.approvedBy],
    references: [users.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [communityPosts.authorId],
    references: [users.id],
  }),
  comments: many(communityComments),
  likes: many(communityPostLikes),
  saves: many(communityPostSaves),
}));

export const communityCommentsRelations = relations(communityComments, ({ one, many }) => ({
  post: one(communityPosts, {
    fields: [communityComments.postId],
    references: [communityPosts.id],
  }),
  author: one(users, {
    fields: [communityComments.authorId],
    references: [users.id],
  }),
  parentComment: one(communityComments, {
    fields: [communityComments.parentCommentId],
    references: [communityComments.id],
  }),
  likes: many(communityCommentLikes),
}));

export const communityPostLikesRelations = relations(communityPostLikes, ({ one }) => ({
  post: one(communityPosts, {
    fields: [communityPostLikes.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [communityPostLikes.userId],
    references: [users.id],
  }),
}));

export const communityCommentLikesRelations = relations(communityCommentLikes, ({ one }) => ({
  comment: one(communityComments, {
    fields: [communityCommentLikes.commentId],
    references: [communityComments.id],
  }),
  user: one(users, {
    fields: [communityCommentLikes.userId],
    references: [users.id],
  }),
}));

export const communityPostSavesRelations = relations(communityPostSaves, ({ one }) => ({
  post: one(communityPosts, {
    fields: [communityPostSaves.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [communityPostSaves.userId],
    references: [users.id],
  }),
}));

export const communityGroupsRelations = relations(communityGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [communityGroups.creatorId],
    references: [users.id],
  }),
  members: many(communityGroupMembers),
}));

export const communityGroupMembersRelations = relations(communityGroupMembers, ({ one }) => ({
  group: one(communityGroups, {
    fields: [communityGroupMembers.groupId],
    references: [communityGroups.id],
  }),
  user: one(users, {
    fields: [communityGroupMembers.userId],
    references: [users.id],
  }),
}));

export const communityCoursesRelations = relations(communityCourses, ({ one, many }) => ({
  creator: one(users, {
    fields: [communityCourses.createdBy],
    references: [users.id],
  }),
  enrollments: many(communityCourseEnrollments),
}));

export const communityCourseEnrollmentsRelations = relations(communityCourseEnrollments, ({ one }) => ({
  course: one(communityCourses, {
    fields: [communityCourseEnrollments.courseId],
    references: [communityCourses.id],
  }),
  user: one(users, {
    fields: [communityCourseEnrollments.userId],
    references: [users.id],
  }),
}));

// Stripe Relations
export const stripeCustomersRelations = relations(stripeCustomers, ({ one }) => ({
  user: one(users, {
    fields: [stripeCustomers.userId],
    references: [users.id],
  }),
}));

export const stripeSubscriptionsRelations = relations(stripeSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [stripeSubscriptions.userId],
    references: [users.id],
  }),
  clinic: one(clinics, {
    fields: [stripeSubscriptions.clinicId],
    references: [clinics.id],
  }),
}));

export const stripePaymentIntentsRelations = relations(stripePaymentIntents, ({ one }) => ({
  user: one(users, {
    fields: [stripePaymentIntents.userId],
    references: [users.id],
  }),
}));

// Usage Tracking - لتتبع استخدام المستخدمين
export const usageTracking = pgTable("usage_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  clinicId: integer("clinic_id").references(() => clinics.id),
  trackingDate: timestamp("tracking_date").defaultNow().notNull(), // تاريخ التتبع
  
  // Patient tracking
  patientsCount: integer("patients_count").default(0), // عدد المرضى الحالي
  patientsAddedToday: integer("patients_added_today").default(0), // عدد المرضى المضافين اليوم
  
  // AI usage tracking
  aiUsageToday: integer("ai_usage_today").default(0), // استخدامات AI اليوم
  aiUsageTotal: integer("ai_usage_total").default(0), // إجمالي استخدامات AI
  
  // Clinic count
  clinicsCount: integer("clinics_count").default(0), // عدد العيادات
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Rewards - نظام المكافآت والترقيات
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  
  rewardType: varchar("reward_type", { length: 100 }).notNull(), // bonus_months, discount, upgrade
  rewardValue: integer("reward_value").notNull(), // قيمة المكافأة (عدد الأشهر، نسبة الخصم، إلخ)
  rewardDescription: text("reward_description"), // وصف المكافأة
  arabicDescription: text("arabic_description"), // الوصف بالعربي
  
  planId: integer("plan_id").references(() => subscriptionPlans.id), // الباقة المرتبطة
  
  isActive: boolean("is_active").default(true),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"), // تاريخ انتهاء المكافأة
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Badges - شارات المشتركين
export const subscriptionBadges = pgTable("subscription_badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  arabicName: varchar("arabic_name", { length: 100 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  
  icon: varchar("icon", { length: 255 }), // أيقونة الشارة
  color: varchar("color", { length: 50 }), // لون الشارة
  
  planId: integer("plan_id").references(() => subscriptionPlans.id), // الباقة المرتبطة
  
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Badges - ربط المستخدمين بالشارات
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => subscriptionBadges.id).notNull(),
  
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  isVisible: boolean("is_visible").default(true), // هل تظهر للعامة
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  user: one(users, {
    fields: [usageTracking.userId],
    references: [users.id],
  }),
  clinic: one(clinics, {
    fields: [usageTracking.clinicId],
    references: [clinics.id],
  }),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userRewards.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const subscriptionBadgesRelations = relations(subscriptionBadges, ({ one, many }) => ({
  plan: one(subscriptionPlans, {
    fields: [subscriptionBadges.planId],
    references: [subscriptionPlans.id],
  }),
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(subscriptionBadges, {
    fields: [userBadges.badgeId],
    references: [subscriptionBadges.id],
  }),
}));
