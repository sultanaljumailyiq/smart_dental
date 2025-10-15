import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });

// Export tables for easy access
export {
  users,
  suppliers,
  categories,
  brands,
  products,
  orders,
  orderItems,
  commissionSettings,
  platformCommissions,
  cart,
  favorites,
  reviews,
  clinics,
  subscriptionPlans,
  clinicPayments,
  mapSettings,
  paymentMethods,
  coupons,
  paymentSettings,
  cashPaymentCenters,
  supplierApprovals,
  supplierNotifications,
  supplierAnalytics,
  // New payment and commission tables
  paymentMethodsConfig,
  commissionInvoices,
  subscriptionPayments,
  manualPaymentReviews,
  supplierSalesReports,
  // Usage tracking and rewards
  usageTracking,
  userRewards,
  subscriptionBadges,
  userBadges,
} from "../shared/schema";
