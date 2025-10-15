import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Route mapping for Arabic labels
const routeLabels: Record<string, string> = {
  admin: "لوحة التحكم",
  reservations: "الحجوزات",
  patients: "المرضى",
  treatments: "العلاجات",
  staff: "الطاقم",
  accounts: "الحسابات",
  sales: "المبيعات",
  purchases: "المشتريات",
  "payment-methods": "طرق الدفع",
  stocks: "المخزون",
  peripherals: "الأجهزة",
  reports: "التقارير",
  support: "ا��دعم الفني",
  "platform-admin": "إدارة المنصة",
  "marketplace-admin": "إدارة السوق",
  "super-admin-settings": "إعدادات المدير العام",
  "dental-supply": "متجر المستلزمات",
  categories: "الفئات",
  products: "المنتجات",
  suppliers: "الموردين",
  brands: "العلامات التجارية",
  community: "المجتمع",
  jobs: "الوظائف",
  marketplace: "السوق الطبي",
  dashboard: "لوحة التحكم",
  dentist: "طبيب الأسنان",
  supplier: "المورد",
  cart: "عربة التسوق",
  favorites: "المفضلة",
  trending: "الأكثر رواجاً",
  featured: "المميزة",
  offers: "العروض",
  students: "الطلاب",
};

export function Breadcrumbs({
  items,
  className,
  showHome = true,
}: BreadcrumbsProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from current path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: "الرئيسية",
        href: "/",
      });
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const label = routeLabels[segment] || segment;

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="التنقل"
      dir="rtl"
    >
      <ol className="flex items-center gap-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronLeft className="w-4 h-4 text-gray-400 mx-2 rotate-180" />
            )}

            {item.current ? (
              <span className="font-medium text-gray-900 px-2 py-1 bg-gray-100 rounded-lg">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 px-2 py-1">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)} dir="rtl">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} className="mb-4" />

      {/* Title and Actions */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

// Specific breadcrumb components for common sections
export function ClinicBreadcrumbs({ currentPage }: { currentPage: string }) {
  const items: BreadcrumbItem[] = [
    { label: "الرئيسية", href: "/" },
    { label: "لوحة التحكم", href: "/admin" },
    { label: routeLabels[currentPage] || currentPage, current: true },
  ];

  return <Breadcrumbs items={items} />;
}

export function MarketplaceBreadcrumbs({
  category,
  subcategory,
  product,
}: {
  category?: string;
  subcategory?: string;
  product?: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: "الرئيسية", href: "/" },
    { label: "متجر المستلزمات", href: "/dental-supply" },
  ];

  if (category) {
    items.push({
      label: category,
      href: subcategory || product ? `/categories/${category}` : undefined,
      current: !subcategory && !product,
    });
  }

  if (subcategory) {
    items.push({
      label: subcategory,
      href: product ? `/categories/${category}/${subcategory}` : undefined,
      current: !product,
    });
  }

  if (product) {
    items.push({
      label: product,
      current: true,
    });
  }

  return <Breadcrumbs items={items} />;
}

export function SupplierBreadcrumbs({
  supplierName,
  section,
}: {
  supplierName: string;
  section?: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: "ا��رئيسية", href: "/" },
    { label: "متجر المستلزمات", href: "/dental-supply" },
    { label: "الموردين", href: "/suppliers" },
    {
      label: supplierName,
      href: section ? `/suppliers/${supplierName}` : undefined,
      current: !section,
    },
  ];

  if (section) {
    items.push({
      label: section,
      current: true,
    });
  }

  return <Breadcrumbs items={items} />;
}

export default Breadcrumbs;
