# Iraqi Dental Platform

## Overview
The Iraqi Dental Platform is an Arabic-first, all-in-one solution designed to revolutionize dental care in Iraq. It offers comprehensive tools for dental clinics, suppliers, patients, and medical services, aiming to improve efficiency, accessibility, and quality. The platform features AI-assisted diagnosis, clinic and patient management, a dental supply marketplace, job listings, educational resources, community features, and an integrated booking system. Its primary goal is to become the leading digital ecosystem for the Iraqi dental sector.

## User Preferences
I prefer detailed explanations and iterative development. Ask before making major changes. I prefer to use the latest stable technologies. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture

### UI/UX Decisions
The platform features a fully Arabic interface with RTL support and a mobile-first design. It uses role-based navigation and a `SmartLandingHeader` that dynamically adjusts content. Platform branding is dynamic via a `usePlatformName` hook, allowing administrators to change the platform name globally. Authentication pages utilize dynamic platform names in headlines with distinct color schemes.

### Technical Implementations
-   **Frontend**: React 18, TypeScript, Vite, Radix UI, Tailwind CSS, Three.js, React Three Fiber. State management uses React Context API and TanStack Query. Form validation uses React Hook Form and Zod. The application is a Progressive Web App (PWA) with offline support, Service Workers, IndexedDB, and auto-sync. Pages are lazy-loaded for improved performance.
-   **Backend**: Express.js (Node.js) API with production-ready endpoints for commissions, supplier dashboards, clinics, and user profiles. Endpoints include comprehensive input validation and database fallbacks for resilience. Security features include trust proxy settings and rate limiting.
-   **Database**: PostgreSQL (Neon) with Drizzle ORM, including tables for commission invoices, supplier notifications, support tickets, and clinics, with proper foreign keys and indexes.

### Feature Specifications
-   **AI Dental Assistant**: AI-powered diagnosis, treatment planning, and case review.
-   **Community Module**: A social platform for dental professionals featuring posts, comments, likes, events, courses, and doctor profiles, with a follow/unfollow system and optimistic UI updates.
-   **Supplier Management**: Unified center with production-ready backend APIs for dashboards, notifications, recent orders, and low-stock alerts.
-   **Clinic Management & Booking**: Shareable booking links, online scheduling, calendar integration, and staff management.
-   **Clinic Messages System**: Dedicated messaging hub for dentists (patients, staff, suppliers, community) with real-time chat.
-   **Clinic Finder System**: Interactive clinic discovery via `ClinicFinderCard` and `NearbyClinicCarousel`, integrating Google Maps, geolocation, and promoted clinic fallbacks.
-   **Admin Platform**: Centralized control for users, content, job listings, finances, system monitoring, security, and global platform settings. Includes dedicated admin authentication and role management.
-   **Marketplace**: Mobile-optimized dental supply marketplace with product listings and order management.
-   **Professional Order & Return Tracking**: Visual timeline for tracking orders and returns through a 5-stage process.
-   **Learning Section**: Educational content, courses, and interactive 3D dental models.
-   **Payment & Subscription System**: Subscription plans, clinic promotions, support for Iraqi payment methods (Cash Agents, Zain Cash, Al-Rafidain, Bank Transfer), Stripe integration with IQD-USD conversion, and coupon discounts. Includes a complete subscription requests management system for approval/rejection.
-   **Jobs Section**: Comprehensive job application tracking with Iraqi salary data.
-   **Notifications Center**: A mobile-first, integrated notification system with unified popovers for notifications, messages, tasks, and reminders, supporting smart navigation and categorization.
-   **Interactive Clinic Calendar**: Appointment management with a secretary-to-doctor workflow.
-   **Enhanced Interactive Dental Chart**: Comprehensive charting with detailed tooth examination, dynamic prognosis, AI treatment suggestions, and payment tracking.
-   **Lab Management**: Lab order creation, data export, printing, and statistics.
-   **Tasks & Reminders System**: Advanced inter-staff collaboration with smart filtering.
-   **Landing Pages**: Dedicated pages for Patients, Dentists, and Suppliers with tailored content.
-   **Promotional Cards Management System**: Supports creation and management of promotional cards with multi-image support, bilingual tags, analytics, and user dismissal.
-   **Iraqi Dental Union Endorsement System**: A commission and endorsement system based on Iraqi provinces, with configurable commission rates, union-endorsed supplier badges, and profit analytics.
-   **Technical Support System**: Comprehensive support page for users with ticket management, statuses, priorities, and filtering.

## Recent Changes (October 14, 2025)
-   **Usage Tracking System**: Added comprehensive usage tracking tables (usageTracking, userRewards, subscriptionBadges, userBadges) to monitor patient counts, AI usage, and clinic counts per user.
-   **Subscription Access Control**: Implemented middleware (subscriptionCheck.ts) to enforce subscription tier limits for patients, clinics, and AI usage.
-   **Badges System**: Created badge management system with API endpoints for creating, assigning, and managing subscription badges for users.
-   **Rewards & Loyalty Program**: Implemented complete rewards system allowing bonus months, discounts, and upgrades with auto-assignment capabilities.
-   **Admin Statistics Dashboard**: Added comprehensive subscription statistics API showing subscriber metrics, usage trends, revenue, and top users.
-   **Security Enhancements**: All sensitive endpoints now have proper authentication (requireAuth) and authorization (requireAdmin) with ownership verification to prevent unauthorized access.
-   **Card-Based Notifications System**: Rebuilt notifications system as card-based UI with smart navigation - messages navigate to messages section, tasks to tasks section, reminders to reminders section. Includes NotificationBell component, sample data, and demo page at /notifications-demo.
-   **Unified Subscription Data**: Created shared/fallbackData.ts containing consistent subscription plans (Free, Basic 60K IQD, Premium 100K IQD) and payment methods used across DoctorSubscriptionEnhanced and PlansManagement components.
-   **AI Smart Diagnosis System**: Comprehensive step-by-step diagnostic system with:
    - 5 symptom categories (pain, swelling, bleeding, sensitivity, aesthetic) with detailed Arabic questions
    - Advanced medical scoring algorithm (0-44 points) for accurate severity assessment (mild/moderate/severe)
    - Smart clinic recommendations based on diagnosis results and patient location
    - Seamless integration with Iraqi clinics via UnifiedInteractiveMap and booking system
    - Route: /smart-diagnosis accessible from patient landing page

## External Dependencies
-   **Google Maps**: For clinic discovery, booking, and job locations.
-   **Supabase**: Database services and authentication.
-   **Firebase**: Specific data storage or real-time functionalities.
-   **api.qrserver.com**: QR code generation.
-   **Stripe**: Payment gateway for transactions.
-   **Google Gemini AI**: Powers the Smart Clinic AI Assistant.