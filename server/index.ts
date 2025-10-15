import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import * as productsController from "./routes/products";
import * as cartController from "./routes/cart";
import * as ordersController from "./routes/orders";
import * as clinicsController from "./routes/clinics";
import * as staffController from "./routes/staff";
import * as rolesController from "./routes/roles";
import { registerSubscriptionRoutes } from "./routes/subscriptions";
import supplierApprovalRoutes from "./routes/supplierApproval";
import platformRoutes from "./routes/platform";
import platformSettingsRoutes from "./routes/platformSettings";
import databaseConnectionsRoutes from "./routes/databaseConnections";
import apiServicesRoutes from "./routes/apiServices";
import integrationLogsRoutes from "./routes/integrationLogs";
import supplierDashboardRoutes from "./routes/supplierDashboard";
import supplierAnalyticsRoutes from "./routes/supplierAnalytics";
import adminDashboardRoutes from "./routes/adminDashboard";
import paymentMethodsRoutes from "./routes/paymentMethods";
import commissionsRoutes from "./routes/commissions";
import ownerAnalyticsRoutes from "./routes/ownerAnalytics";
import commissionManagementRoutes from "./routes/commissionManagement";
import provincesRoutes from "./routes/provinces";
import paymentVerificationRoutes from "./routes/paymentVerification";
import supplierSalesReportsRoutes from "./routes/supplierSalesReports";
import promotionalCardsRoutes from "./routes/promotionalCards";
import communityAdminRoutes from "./routes/communityAdmin";
import communityPostsRoutes from "./routes/communityPosts";
import communityCommentsRoutes from "./routes/communityComments";
import userProfileRoutes from "./routes/userProfile";
import suppliersRoutes from "./routes/suppliers";
import badgesRoutes from "./routes/badges";
import rewardsRoutes from "./routes/rewards";
import subscriptionStatsRoutes from "./routes/subscriptionStats";

export function createServer() {
  const app = express();

  // Trust proxy - trust only the first proxy (Replit's reverse proxy)
  // This prevents header spoofing while allowing proper IP detection
  app.set('trust proxy', 1);

  // Security middleware
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com", "https://maps.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https:", "wss:", "ws://127.0.0.1:*"],
        fontSrc: ["'self'", "data:", "https:", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https:"],
        frameSrc: ["'self'", "https:"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'", "blob:"],
        // السماح بعرض الموقع في iframe في وضع التطوير (Replit preview)
        frameAncestors: isDevelopment ? ["*"] : ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    // السماح بعرض الموقع في iframe في وضع التطوير (Replit preview)
    frameguard: isDevelopment ? false : { action: 'sameorigin' },
  }));

  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'];
  
  app.use(cors({
    origin: (origin, callback) => {
      // في وضع التطوير: السماح لجميع الـ origins
      if (isDevelopment) {
        callback(null, true);
        return;
      }
      
      // في الإنتاج: التحقق من القائمة المسموحة
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // Rate limiting - general API requests
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'تم تجاوز محاولات تسجيل الدخول المسموحة. يرجى المحاولة بعد 15 دقيقة.',
    skipSuccessfulRequests: true,
  });

  app.use('/api/', apiLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Product routes
  app.get("/api/products", productsController.getProducts);
  app.get("/api/products/:id", productsController.getProductById);
  app.post("/api/products", productsController.createProduct);
  app.put("/api/products/:id", productsController.updateProduct);
  app.delete("/api/products/:id", productsController.deleteProduct);
  app.get("/api/suppliers/:supplierId/products", productsController.getProductsBySupplier);

  // Cart routes
  app.get("/api/cart/:userId", cartController.getCart);
  app.post("/api/cart", cartController.addToCart);
  app.put("/api/cart/:id", cartController.updateCartItem);
  app.delete("/api/cart/:id", cartController.removeFromCart);
  app.delete("/api/cart/:userId/clear", cartController.clearCart);

  // Order routes
  app.get("/api/orders/:userId", ordersController.getOrders);
  app.get("/api/suppliers/:supplierId/orders", ordersController.getSupplierOrders);
  app.get("/api/order/:id", ordersController.getOrderById);
  app.post("/api/orders", ordersController.createOrder);
  app.put("/api/orders/:id/status", ordersController.updateOrderStatus);
  app.put("/api/order-items/:id/status", ordersController.updateOrderItemStatus);

  // Clinic routes
  app.get("/api/clinics", clinicsController.getClinics);
  app.get("/api/clinics/nearby", clinicsController.getNearbyClinics);
  app.get("/api/clinics/:id", clinicsController.getClinicById);
  app.get("/api/clinics/governorate/:governorate", clinicsController.getClinicsByGovernorate);
  app.post("/api/clinics/seed", clinicsController.seedClinics); // Development only

  // Subscription routes
  registerSubscriptionRoutes(app);

  // Staff routes (with authentication rate limiting)
  app.post("/api/staff/login", authLimiter, staffController.staffLogin);
  app.get("/api/clinics/:clinicId/staff", staffController.getClinicStaff);
  app.get("/api/staff/:id", staffController.getStaffById);
  app.post("/api/staff", staffController.createStaff);
  app.put("/api/staff/:id", staffController.updateStaff);
  app.delete("/api/staff/:id", staffController.deleteStaff);
  app.get("/api/staff/permissions/check", staffController.checkPermission);

  // Roles and Permissions routes
  app.get("/api/roles", rolesController.getRoles);
  app.get("/api/roles/:id", rolesController.getRoleById);
  app.get("/api/permissions", rolesController.getPermissions);

  // Supplier Approval routes
  app.use("/api/supplier-approvals", supplierApprovalRoutes);

  // Platform routes (commissions, stats, settings)
  app.use("/api/platform", platformRoutes);

  // Platform Settings routes
  app.use("/api/admin/platform-settings", platformSettingsRoutes);
  app.use("/api/admin/database-connections", databaseConnectionsRoutes);
  app.use("/api/admin/api-services", apiServicesRoutes);
  app.use("/api/admin/integration-logs", integrationLogsRoutes);

  // Supplier Dashboard and Analytics routes
  app.use("/api/supplier", supplierDashboardRoutes);
  app.use("/api/supplier", supplierAnalyticsRoutes);
  app.use("/api/supplier", supplierSalesReportsRoutes);

  // Admin Dashboard routes
  app.use("/api/admin", adminDashboardRoutes);

  // Payment Methods routes
  app.use("/api/admin/payment-methods", paymentMethodsRoutes);

  // Commissions routes
  app.use("/api/admin/commissions", commissionsRoutes);
  app.use("/api/owner/analytics", ownerAnalyticsRoutes);
  app.use("/api/owner/commission-management", commissionManagementRoutes);
  
  // Iraqi Provinces routes
  app.use("/api/provinces", provincesRoutes);

  // Payment Verification routes
  app.use("/api/admin/payment-verification", paymentVerificationRoutes);

  // Promotional Cards routes
  app.use("/api/admin/promotional-cards", promotionalCardsRoutes);

  // Community Admin routes
  app.use("/api/admin/community", communityAdminRoutes);

  // Community Public routes
  app.use("/api/community/posts", communityPostsRoutes);
  app.use("/api/community/comments", communityCommentsRoutes);
  app.use(userProfileRoutes);
  
  // Badges routes
  app.use("/api/badges", badgesRoutes);
  
  // Rewards routes
  app.use("/api/rewards", rewardsRoutes);
  
  // Subscription Stats routes (Admin)
  app.use("/api/subscription-stats", subscriptionStatsRoutes);
  
  // Suppliers routes
  app.use(suppliersRoutes);

  // For unmatched routes: pass non-API to next (Vite/static), 404 JSON for unknown API
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    next();
  });

  return app;
}
