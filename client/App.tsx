import "./global.css";
import "./styles/clinic-improvements.css";

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { StaffAuthProvider } from "./contexts/StaffAuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import StaffLogin from "./pages/StaffLogin";
import MobileOptimizer from "./components/MobileOptimizer";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { useOfflineSync } from "./hooks/useOfflineSync";
// Lazy load clinic management pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Patients = lazy(() => import("./pages/Patients"));
const Accounts = lazy(() => import("./pages/Accounts"));
const Stocks = lazy(() => import("./pages/Stocks"));
const Reservations = lazy(() => import("./pages/Reservations"));
const Treatments = lazy(() => import("./pages/Treatments"));
const Staff = lazy(() => import("./pages/Staff"));
const AdvancedStaffManagement = lazy(() => import("./pages/AdvancedStaffManagement"));
const Sales = lazy(() => import("./pages/Sales"));
const Purchases = lazy(() => import("./pages/Purchases"));
const Reports = lazy(() => import("./pages/Reports"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const Peripherals = lazy(() => import("./pages/Peripherals"));
const PatientDetail = lazy(() => import("./pages/PatientDetail"));
import LandingPage from "./pages/LandingPage";
const Community = lazy(() => import("./pages/Community"));
const JobsNew = lazy(() => import("./pages/JobsNew"));
import Auth from "./pages/Auth";
const DentalSupplyMarketResponsive = lazy(() => import("./pages/DentalSupplyMarketResponsive"));
import StoreLayout from "./components/StoreLayout";

// Lazy load admin pages
const PlatformAdmin = lazy(() => import("./pages/PlatformAdmin"));
const SuperAdminSettings = lazy(() => import("./pages/SuperAdminSettings"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const Messages = lazy(() => import("./pages/Messages"));
const BrandDetail = lazy(() => import("./pages/BrandDetail"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Cart = lazy(() => import("./pages/Cart"));
const Students = lazy(() => import("./pages/Students"));
const DentalSupplyOrders = lazy(() => import("./pages/DentalSupplyOrders"));
const DentalSupplyAddresses = lazy(() => import("./pages/DentalSupplyAddresses"));
const DentalSupplyOrderDetail = lazy(() => import("./pages/DentalSupplyOrderDetail"));
const DentalSupplyReturnTracking = lazy(() => import("./pages/DentalSupplyReturnTracking"));
const Trending = lazy(() => import("./pages/Trending"));
const Featured = lazy(() => import("./pages/Featured"));
const Offers = lazy(() => import("./pages/Offers"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Brands = lazy(() => import("./pages/Brands"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const SupplierProfile = lazy(() => import("./pages/SupplierProfile"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const DentistHub = lazy(() => import("./pages/DentistHub"));
const ClinicDashboard = lazy(() => import("./pages/ClinicDashboard"));

// Lazy load system admin dashboard
const SystemAdminDashboard = lazy(() => import("./pages/SystemAdminDashboard"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AllCategories = lazy(() => import("./pages/AllCategories"));
// Lazy load community pages
const CommunityGroups = lazy(() => import("./pages/CommunityGroups"));
const CommunityExperts = lazy(() => import("./pages/CommunityExperts"));
const CommunityEvents = lazy(() => import("./pages/CommunityEvents"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const CommunityProfile = lazy(() => import("./pages/CommunityProfile"));
const CommunityStatistics = lazy(() => import("./pages/CommunityStatistics"));
const CommunitySettings = lazy(() => import("./pages/CommunitySettings"));
const CommunityJobsAdmin = lazy(() => import("./pages/CommunityJobsAdmin"));
const SupplierOrders = lazy(() => import("./pages/supplier/SupplierOrders"));
const SupplierStore = lazy(() => import("./pages/supplier/SupplierStore"));
const SupplierCustomers = lazy(() => import("./pages/supplier/SupplierCustomers"));
const SupplierAnalytics = lazy(() => import("./pages/supplier/SupplierAnalytics"));
const SupplierShipping = lazy(() => import("./pages/supplier/SupplierShipping"));
const SupplierPayments = lazy(() => import("./pages/supplier/SupplierPayments"));
const SupplierProducts = lazy(() => import("./pages/supplier/SupplierProducts"));
const SupplierDashboard = lazy(() => import("./pages/supplier/SupplierDashboard"));
const SupplierReturns = lazy(() => import("./pages/supplier/SupplierReturns"));
const SupplierMessages = lazy(() => import("./pages/supplier/SupplierMessages"));
const SupplierSettings = lazy(() => import("./pages/supplier/SupplierSettings"));
const SupplierNotifications = lazy(() => import("./pages/supplier/SupplierNotifications"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));
const AdminSupplierAnalytics = lazy(() => import("./pages/admin/AdminSupplierAnalytics"));
const AdminSupplierPromotions = lazy(() => import("./pages/admin/AdminSupplierPromotions"));
const AdminSupplierSupport = lazy(() => import("./pages/admin/AdminSupplierSupport"));
const PlatformSettings = lazy(() => import("./pages/admin/PlatformSettings"));
const CommunityAdminSettings = lazy(() => import("./pages/CommunityAdminSettings"));
const Articles = lazy(() => import("./pages/Articles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const NotificationsDemo = lazy(() => import("./pages/NotificationsDemo"));

// Lazy load AI and education pages  
const Education = lazy(() => import("./pages/Education"));
const Models3D = lazy(() => import("./pages/Models3D"));
const AIDiagnosis = lazy(() => import("./pages/AIDiagnosis"));
const SmartDiagnosisEnhanced = lazy(() => import("./pages/SmartDiagnosisEnhanced"));
const SmartChat = lazy(() => import("./pages/SmartChat"));
const PhotoAnalysis = lazy(() => import("./pages/PhotoAnalysis"));
import CategoriesNew from "./pages/CategoriesNew";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import AppWithUnifiedHeader from "./components/AppWithUnifiedHeader";
import ClinicBooking from "./pages/ClinicBooking";
import ModernAppointmentBooking from "./pages/ModernAppointmentBooking";
import SimplifiedAppointmentBooking from "./pages/SimplifiedAppointmentBooking";
// Lazy load medical and clinic pages
const ModernMedicalServices = lazy(() => import("./pages/ModernMedicalServices"));
const BookingShowcase = lazy(() => import("./components/BookingShowcase"));
const ClinicAdmin = lazy(() => import("./pages/ClinicAdmin"));
const AdvancedClinicManagement = lazy(() => import("./pages/AdvancedClinicManagement"));
const Notifications = lazy(() => import("./pages/Notifications"));
const UnifiedNotifications = lazy(() => import("./pages/UnifiedNotifications"));
const Emergency = lazy(() => import("./pages/Emergency"));
const UnifiedMedicalServices = lazy(() => import("./pages/UnifiedMedicalServices"));
import About from "./pages/About";
import TasksReminders from "./pages/TasksReminders";
import PatientLandingPage from "./pages/PatientLandingPage";
// Lazy load admin and enhanced pages
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const EnhancedTestPage = lazy(() => import("./pages/EnhancedTestPage"));
const EnhancedClinicDashboard = lazy(() => import("./pages/EnhancedClinicDashboard"));
const PatientDetailsPage = lazy(() => import("./pages/PatientDetailsPage"));
const AdminClinicDashboard = lazy(() => import("./pages/AdminClinicDashboard"));
import MobileBookingPage from "./pages/MobileBookingPage";
import FirstAidGuide from "./pages/FirstAidGuide";
import EmergencyHospitals from "./pages/EmergencyHospitals";
import PainManagement from "./pages/PainManagement";
import DentalEmergency from "./pages/DentalEmergency";
import BrowseDentists from "./pages/BrowseDentists";
import InteractiveClinicCalendar from "./pages/clinic/InteractiveClinicCalendar";
import ClinicOnlineBooking from "./pages/ClinicOnlineBooking";
import ClinicsManager from "./pages/ClinicsManager";
import ClinicMessages from "./pages/clinic/ClinicMessages";

// Clinic redirects - redirect new clinic routes to old clinic manager
import ClinicOldLab from "./pages/ClinicOldLab";
// Lazy load Smart Clinic AI pages
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage"));
const SmartClinicAIAssistant = lazy(() => import("./pages/SmartClinicAIAssistant"));
const SmartClinicKnowledge = lazy(() => import("./pages/SmartClinicKnowledge"));
const SmartClinicMainRebuilt = lazy(() => import("./pages/SmartClinicMainRebuilt"));
const SmartClinicReports = lazy(() => import("./pages/SmartClinicReports"));
const SmartClinicChatbot = lazy(() => import("./pages/SmartClinicChatbot"));
const SmartClinicLearning = lazy(() => import("./pages/SmartClinicLearning"));
import ProtectedRoute from "./components/ProtectedRoute";
import FinanceUnified from "./pages/clinic_old/FinanceUnified";
import AssetsUnified from "./pages/clinic_old/AssetsUnified";
import UnifiedAIAssistant from "./components/UnifiedAIAssistant";
import MapsSettings from "./pages/settings/MapsSettings";
import ClinicsManagement from "./pages/settings/ClinicsManagement";
import DoctorSubscription from "./pages/DoctorSubscriptionEnhanced";
import DoctorSubscriptionSuccess from "./pages/DoctorSubscriptionSuccess";
import TestPaymentMethods from "./pages/TestPaymentMethods";
import TestPaymentStep from "./pages/TestPaymentStep";
import SubscriptionManagement from "./pages/settings/SubscriptionManagement";
import SubscriptionRequests from "./pages/settings/SubscriptionRequests";
import CashAgentsManagement from "./pages/settings/CashAgentsManagement";
import PaymentManagement from "./pages/settings/PaymentManagement";
import DentalLandingPage from "./pages/DentalLandingPage";
import SupplierLandingPage from "./pages/SupplierLandingPage";
import DentalAuthPage from "./pages/DentalAuthPage";
import SupplierAuthPage from "./pages/SupplierAuthPage";
import AdminAuthPage from "./pages/AdminAuthPage";
import DentistHubMessages from "./pages/dentist-hub/DentistHubMessages";
import TechnicalSupport from "./pages/settings/TechnicalSupport";

const queryClient = new QueryClient();

function AdminPatientsRedirect() {
  const params = useParams();
  const id = (params as any)?.id;
  return <Navigate to={`/clinic_old/patients/${id}`} replace />;
}

function ClinicPatientsRedirect() {
  return <Navigate to="/clinic_old/patients" replace />;
}

function ClinicPatientDetailRedirect() {
  const params = useParams();
  const id = (params as any)?.id;
  return <Navigate to={`/clinic_old/patients/${id}`} replace />;
}

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);

const App = () => {
  useOfflineSync();
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BookmarksProvider>
                <SystemSettingsProvider>
                  <MobileOptimizer>
                    <PWAInstallPrompt />
                    <OfflineIndicator />
                    <Toaster />
                    <Sonner />
                    <BrowserRouter
                      future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                      }}
                    >
                      <StaffAuthProvider>
                        <NavigationProvider>
                          <ScrollToTop />
                          <AppWithUnifiedHeader>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route
                              path="/patient-landing"
                              element={<PatientLandingPage />}
                            />
                            <Route path="/dental" element={<DentalLandingPage />} />
                            <Route path="/dental/auth" element={<DentalAuthPage />} />
                            <Route path="/supplier" element={<SupplierLandingPage />} />
                            <Route path="/supplier/auth" element={<SupplierAuthPage />} />
                            <Route path="/admin/auth" element={<AdminAuthPage />} />
                            <Route
                              path="/community"
                              element={<Community />}
                            />
                            <Route
                              path="/community/groups"
                              element={<CommunityGroups />}
                            />
                            <Route
                              path="/community/experts"
                              element={<CommunityExperts />}
                            />
                            <Route
                              path="/community/events"
                              element={<CommunityEvents />}
                            />
                            <Route
                              path="/community/event/:id"
                              element={<EventDetail />}
                            />
                            <Route
                              path="/community/course/:id"
                              element={<CourseDetail />}
                            />
                            <Route
                              path="/community/profile/:id"
                              element={<CommunityProfile />}
                            />
                            <Route
                              path="/community/statistics"
                              element={<CommunityStatistics />}
                            />
                            <Route
                              path="/community/settings"
                              element={<CommunitySettings />}
                            />
                            <Route path="/education" element={<Education />} />
                            <Route
                              path="/education/models"
                              element={<Models3D />}
                            />
                            <Route path="/jobs" element={<JobsNew />} />
                            <Route
                              path="/jobs/dentists"
                              element={<BrowseDentists />}
                            />
                            <Route path="/articles" element={<Articles />} />
                            <Route
                              path="/articles/:id"
                              element={<ArticleDetail />}
                            />
                            <Route path="/notifications-demo" element={<NotificationsDemo />} />
                            <Route
                              path="/admin/articles"
                              element={<AdminArticles />}
                            />
                            <Route
                              path="/ai-diagnosis"
                              element={<AIDiagnosis />}
                            />
                            <Route
                              path="/smart-diagnosis"
                              element={<SmartDiagnosisEnhanced />}
                            />
                            <Route path="/smart-chat" element={<SmartChat />} />
                            <Route
                              path="/photo-analysis"
                              element={<PhotoAnalysis />}
                            />
                            {/* Store Routes with Unified Layout */}
                            <Route
                              path="/dental-supply/*"
                              element={<StoreLayout />}
                            >
                              <Route
                                index
                                element={<DentalSupplyMarketResponsive />}
                              />
                              <Route
                                path="categories"
                                element={<AllCategories />}
                              />
                              <Route path="trending" element={<Trending />} />
                              <Route path="featured" element={<Featured />} />
                              <Route path="offers" element={<Offers />} />
                              <Route path="flash-deals" element={<Offers />} />
                              <Route
                                path="new-arrivals"
                                element={<Featured />}
                              />
                              <Route
                                path="products"
                                element={<AllProducts />}
                              />
                              <Route path="favorites" element={<Favorites />} />
                              <Route path="cart" element={<Cart />} />
                              <Route path="orders" element={<DentalSupplyOrders />} />
                              <Route path="order/:orderId" element={<DentalSupplyOrderDetail />} />
                              <Route path="return/:returnId" element={<DentalSupplyReturnTracking />} />
                              <Route path="addresses" element={<DentalSupplyAddresses />} />
                              <Route path="suppliers" element={<Suppliers />} />
                              <Route path="brands" element={<Brands />} />
                              <Route path="students" element={<Students />} />
                              <Route
                                path="product/:productId"
                                element={<ProductDetail />}
                              />
                              <Route
                                path="supplier/:supplierId"
                                element={<SupplierProfile />}
                              />
                              <Route
                                path="brand/:brandId"
                                element={<BrandDetail />}
                              />
                            </Route>

                            {/* Legacy Store Routes (for backward compatibility) */}
                            <Route path="/search" element={<Search />} />
                            <Route
                              path="/notifications"
                              element={<UnifiedNotifications />}
                            />
                            <Route
                              path="/dentist-hub/notifications"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/dentist-hub/messages"
                              element={<DentistHubMessages />}
                            />
                            <Route
                              path="/dentist-hub/tasks-reminders"
                              element={<TasksReminders />}
                            />
                            <Route
                              path="/notifications-old"
                              element={<Notifications />}
                            />
                            <Route
                              path="/messages"
                              element={<UnifiedNotifications />}
                            />
                            <Route
                              path="/messages-old"
                              element={<Messages />}
                            />
                            <Route
                              path="/medical-services"
                              element={<ModernMedicalServices />}
                            />
                            <Route
                              path="/medical-services-old"
                              element={<UnifiedMedicalServices />}
                            />

                            {/* مسارات الحجز المحسنة للهاتف */}
                            <Route
                              path="/booking/:clinicId"
                              element={<MobileBookingPage />}
                            />
                            <Route
                              path="/mobile-booking/:clinicId"
                              element={<MobileBookingPage />}
                            />
                            <Route
                              path="/dentist-hub"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/dentist-hub/*"
                              element={<DentistHub />}
                            />
                            <Route path="/emergency" element={<Emergency />} />
                            <Route
                              path="/emergency/first-aid"
                              element={<FirstAidGuide />}
                            />
                            <Route
                              path="/emergency/hospitals"
                              element={<EmergencyHospitals />}
                            />
                            <Route
                              path="/emergency/pain-management"
                              element={<PainManagement />}
                            />
                            <Route
                              path="/emergency/dental"
                              element={<DentalEmergency />}
                            />
                            <Route
                              path="/ai-assistant"
                              element={<AIAssistantPage />}
                            />
                            <Route path="/about" element={<About />} />
                            <Route
                              path="/clinic/:clinicId/booking"
                              element={<ClinicBooking />}
                            />
                            <Route
                              path="/modern-booking/:clinicId?"
                              element={<ModernAppointmentBooking />}
                            />
                            <Route
                              path="/simplified-booking/:clinicId?"
                              element={<SimplifiedAppointmentBooking />}
                            />
                            <Route
                              path="/booking-systems"
                              element={<BookingShowcase />}
                            />
                            <Route
                              path="/clinic/admin"
                              element={<AdvancedClinicManagement />}
                            />
                            <Route
                              path="/clinic/advanced-staff-management"
                              element={
                                <Layout>
                                  <AdvancedStaffManagement />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic/admin/old"
                              element={<ClinicAdmin />}
                            />
                            <Route path="/products" element={<AllProducts />} />
                            <Route
                              path="/categories"
                              element={<CategoriesNew />}
                            />
                            <Route
                              path="/clinics"
                              element={<Navigate to="/dentist-hub/clinics" replace />}
                            />
                            <Route
                              path="/favorites"
                              element={
                                <Navigate to="/dentist-hub/favorites" replace />
                              }
                            />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/trending" element={<Trending />} />
                            <Route path="/featured" element={<Featured />} />
                            <Route path="/offers" element={<Offers />} />
                            <Route path="/suppliers" element={<Suppliers />} />
                            <Route
                              path="/suppliers/:supplierId"
                              element={<SupplierProfile />}
                            />
                            <Route path="/brands" element={<Brands />} />
                            <Route
                              path="/brand/:id"
                              element={<BrandDetail />}
                            />
                            <Route
                              path="/categories/:categoryName"
                              element={<CategoryProducts />}
                            />
                            <Route
                              path="/categories/:categoryName/:subcategoryName"
                              element={<CategoryProducts />}
                            />
                            <Route
                              path="/product/:productId"
                              element={<ProductDetail />}
                            />
                            <Route
                              path="/dashboard"
                              element={<UserDashboard />}
                            />
                            <Route
                              path="/dentist/dashboard"
                              element={<UserDashboard />}
                            />
                            <Route
                              path="/supplier/dashboard"
                              element={<SupplierDashboard />}
                            />
                            <Route
                              path="/supplier/orders"
                              element={<SupplierOrders />}
                            />
                            <Route
                              path="/supplier/store"
                              element={<SupplierStore />}
                            />
                            <Route
                              path="/supplier/customers"
                              element={<SupplierCustomers />}
                            />
                            <Route
                              path="/supplier/analytics"
                              element={<SupplierAnalytics />}
                            />
                            <Route
                              path="/supplier/shipping"
                              element={<SupplierShipping />}
                            />
                            <Route
                              path="/supplier/payments"
                              element={<SupplierPayments />}
                            />
                            <Route
                              path="/supplier/products"
                              element={<SupplierProducts />}
                            />
                            <Route
                              path="/supplier/returns"
                              element={<SupplierReturns />}
                            />
                            <Route
                              path="/supplier/messages"
                              element={<SupplierMessages />}
                            />
                            <Route
                              path="/supplier/settings"
                              element={<SupplierSettings />}
                            />
                            <Route
                              path="/supplier/notifications"
                              element={<SupplierNotifications />}
                            />
                            <Route
                              path="/admin/dashboard"
                              element={
                                <Layout>
                                  <SystemAdminDashboard />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/suppliers"
                              element={
                                <Layout>
                                  <AdminSuppliers />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/suppliers/analytics"
                              element={
                                <Layout>
                                  <AdminSupplierAnalytics />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/suppliers/promotions"
                              element={
                                <Layout>
                                  <AdminSupplierPromotions />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/community-settings"
                              element={
                                <Layout>
                                  <CommunityAdminSettings />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/suppliers/support"
                              element={
                                <Layout>
                                  <AdminSupplierSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/platform-settings"
                              element={
                                <Layout>
                                  <PlatformSettings />
                                </Layout>
                              }
                            />
                            <Route
                              path="/community-jobs-admin"
                              element={<CommunityJobsAdmin />}
                            />
                            <Route
                              path="/appointments"
                              element={
                                <Layout>
                                  <Reservations />
                                </Layout>
                              }
                            />

                            {/* Auth Routes */}
                            <Route
                              path="/auth"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signin"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/patient"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/patient"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/supplier"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/supplier"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/admin"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/admin"
                              element={<Auth mode="signup" />}
                            />

                            {/* Staff Login Route */}
                            <Route
                              path="/staff/login"
                              element={<StaffLogin />}
                            />

                            {/* Dentist Hub Routes */}
                            <Route
                              path="/dentist-hub"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/dentist-hub/*"
                              element={<DentistHub />}
                            />

                            {/* Redirect new clinic routes to old clinic manager */}
                            <Route path="/clinic" element={<Navigate to="/clinic_old" replace />} />
                            <Route path="/clinic/patients" element={<Navigate to="/clinic_old/patients" replace />} />
                            <Route path="/clinic/patients/:id" element={<ClinicPatientDetailRedirect />} />
                            <Route path="/clinic/calendar" element={<InteractiveClinicCalendar />} />
                            <Route path="/clinic/reservations" element={<Navigate to="/clinic_old/reservations" replace />} />
                            <Route path="/clinic/treatments" element={<Navigate to="/clinic_old/treatments" replace />} />
                            <Route path="/clinic/staff" element={<Navigate to="/clinic_old/staff" replace />} />
                            <Route path="/clinic/accounts" element={<Navigate to="/clinic_old/accounts" replace />} />
                            <Route path="/clinic/sales" element={<Navigate to="/clinic_old/sales" replace />} />
                            <Route path="/clinic/purchases" element={<Navigate to="/clinic_old/purchases" replace />} />
                            <Route path="/clinic/stocks" element={<Navigate to="/clinic_old/stocks" replace />} />
                            <Route path="/clinic/peripherals" element={<Navigate to="/clinic_old/peripherals" replace />} />
                            <Route path="/clinic/reports" element={<Navigate to="/clinic_old/reports" replace />} />
                            <Route path="/clinic/lab" element={<Navigate to="/clinic_old/lab" replace />} />
                            <Route path="/clinic/legacy" element={<Navigate to="/clinic_old" replace />} />

                            {/* Legacy Clinic Management Routes - moved to clinic_old */}
                            <Route
                              path="/clinic_old"
                              element={
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              }
                            />

                            {/* System Admin Routes - فقط ��مدير النظام */}
                            <Route
                              path="/admin"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/dashboard"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/suppliers"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <AdminSuppliers />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/system-admin"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            {/* Clinic Old Management Routes - النظام ��لقديم */}
                            <Route
                              path="/clinic_old/patients"
                              element={
                                <Layout>
                                  <Patients />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/patient/:id"
                              element={<ClinicPatientDetailRedirect />}
                            />
                            <Route
                              path="/clinic_old/patients/:id"
                              element={<PatientDetailsPage />}
                            />
                            <Route
                              path="/clinic_old/accounts"
                              element={
                                <Layout>
                                  <Accounts />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/stocks"
                              element={
                                <Layout>
                                  <Stocks />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/reservations"
                              element={
                                <Layout>
                                  <Reservations />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/treatments"
                              element={
                                <Layout>
                                  <Treatments />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/staff"
                              element={
                                <Layout>
                                  <Staff />
                                </Layout>
                              }
                            />
                            <Route
                              path="/advanced-staff"
                              element={
                                <Layout>
                                  <AdvancedStaffManagement />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/sales"
                              element={
                                <Layout>
                                  <Sales />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/purchases"
                              element={
                                <Layout>
                                  <Purchases />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/reports"
                              element={
                                <Layout>
                                  <Reports />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/customer-support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/payment-methods"
                              element={
                                <Layout>
                                  <PaymentMethods />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/peripherals"
                              element={
                                <Layout>
                                  <Peripherals />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/finance"
                              element={
                                <Layout>
                                  <FinanceUnified />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/assets"
                              element={
                                <Layout>
                                  <AssetsUnified />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/lab"
                              element={
                                <Layout>
                                  <ClinicOldLab />
                                </Layout>
                              }
                            />

                            {/* Legacy Routes - المسارات القديمة للتوافق مع الإصدارات السابقة */}
                            <Route
                              path="/admin/dashboard/old"
                              element={
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/clinic-dashboard"
                              element={<EnhancedClinicDashboard />}
                            />
                            <Route
                              path="/admin/patient/:id"
                              element={
                                <Layout>
                                  <PatientDetail />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/patients/:id"
                              element={<AdminPatientsRedirect />}
                            />
                            <Route
                              path="/admin/patients/:id/old"
                              element={
                                <Layout>
                                  <PatientDetail />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/customer-support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />

                            {/* System Admin Routes - مسارات إدارة النظام */}
                            <Route
                              path="/system-admin"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/system-admin/dashboard"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/system-admin/*"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/platform-admin"
                              element={<PlatformAdmin />}
                            />
                            <Route
                              path="/admin/platform-admin"
                              element={<PlatformAdmin />}
                            />
                            <Route
                              path="/super-admin"
                              element={<SuperAdminSettings />}
                            />
                            <Route
                              path="/admin/users"
                              element={<AdminUsers />}
                            />
                            <Route
                              path="/admin/settings"
                              element={<AdminSettings />}
                            />
                            <Route path="/messages" element={<Messages />} />

                            {/* Enhanced Test Page */}
                            <Route
                              path="/test-enhanced"
                              element={<EnhancedTestPage />}
                            />

                            {/* Settings Routes - مسارات الإعدادات */}
                            <Route
                              path="/settings/maps"
                              element={<MapsSettings />}
                            />
                            <Route
                              path="/settings/clinics"
                              element={<ClinicsManagement />}
                            />
                            <Route
                              path="/settings/technical-support"
                              element={<TechnicalSupport />}
                            />
                            <Route
                              path="/settings/subscription-plans"
                              element={<Navigate to="/settings/subscription-management" replace />}
                            />
                            <Route
                              path="/settings/clinic-settings"
                              element={<Navigate to="/dentist-hub/clinics" replace />}
                            />
                            <Route
                              path="/settings/subscription-management"
                              element={<SubscriptionManagement />}
                            />
                            <Route
                              path="/settings/subscription-requests"
                              element={<SubscriptionRequests />}
                            />
                            <Route
                              path="/settings/cash-agents"
                              element={<CashAgentsManagement />}
                            />
                            <Route
                              path="/settings/payment-management"
                              element={<PaymentManagement />}
                            />
                            <Route
                              path="/doctor/subscription"
                              element={<DoctorSubscription />}
                            />
                            <Route
                              path="/doctor/subscription/success"
                              element={<DoctorSubscriptionSuccess />}
                            />
                            <Route
                              path="/test-payment-methods"
                              element={<TestPaymentMethods />}
                            />
                            <Route
                              path="/test-payment-step"
                              element={<TestPaymentStep />}
                            />

                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </AppWithUnifiedHeader>
                      </NavigationProvider>
                      </StaffAuthProvider>
                    </BrowserRouter>
                  </MobileOptimizer>
                </SystemSettingsProvider>
              </BookmarksProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
