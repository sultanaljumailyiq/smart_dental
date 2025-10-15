import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@shared/permissions";
import { useNavigationSystem } from "@/hooks/useNavigationSystem";
import { navigationVariants } from "@/config/navigationConfig";
import { ChevronDown, ChevronRight, X, ExternalLink } from "lucide-react";

// أنواع البيانات للمكون
interface UnifiedNavigationProps {
  variant: "header" | "sidebar" | "bottomNav";
  style:
    | "full"
    | "minimal"
    | "mobile"
    | "expanded"
    | "compact"
    | "fixed"
    | "floating";
  userRole?: UserRole | null;
  userStats?: Record<string, any>;
  className?: string;
  logo?: React.ReactNode;
  onItemClick?: (itemId: string) => void;
}

// مكون عرض العنصر الواحد
interface NavigationItemProps {
  item: any;
  isActive: boolean;
  onClick: () => void;
  badge?: number | string | null;
  showIcon?: boolean;
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  onClick,
  badge,
  showIcon = true,
  showLabel = true,
  showDescription = false,
  className,
}) => {
  const Icon = item.icon;

  const itemContent = (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        isActive
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
    >
      {showIcon && Icon && (
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {showLabel && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{item.label}</span>
            {badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full ml-2",
                  isActive ? "bg-white/20 text-white" : "bg-red-500 text-white",
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {showDescription && item.description && (
            <p className="text-sm text-gray-500 mt-1 truncate">
              {item.description}
            </p>
          )}
        </div>
      )}

      {item.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
    </div>
  );

  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="block"
      >
        {itemContent}
      </a>
    );
  }

  return (
    <Link to={item.path} onClick={onClick} className="block">
      {itemContent}
    </Link>
  );
};

// مكون التنقل الجانبي
const SidebarNavigation: React.FC<{
  navigation: ReturnType<typeof useNavigationSystem>;
  style: "expanded" | "compact";
  className?: string;
}> = ({ navigation, style, className }) => {
  const config = navigationVariants.sidebar[style];
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "main",
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div
      className={cn(
        "h-full bg-white border-r border-gray-200 overflow-y-auto",
        className,
      )}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.filteredSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const hasItems = section.items.length > 0;

            return (
              <div key={section.id}>
                {config.showSectionTitles && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span>{section.title}</span>
                    {config.collapsible && hasItems && (
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          isExpanded && "rotate-90",
                        )}
                      />
                    )}
                  </button>
                )}

                {(!config.collapsible || isExpanded) && (
                  <div
                    className={cn(
                      "space-y-1",
                      config.showSectionTitles && "ml-2",
                    )}
                  >
                    {section.items.map((item) => (
                      <NavigationItem
                        key={item.id}
                        item={item}
                        isActive={navigation.isItemActive(item)}
                        onClick={() => navigation.navigateToItem(item)}
                        badge={navigation.getItemBadge(item)}
                        showIcon={config.showIcons}
                        showDescription={config.showDescriptions}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// مكون التنقل العلوي
const HeaderNavigation: React.FC<{
  navigation: ReturnType<typeof useNavigationSystem>;
  style: "full" | "minimal" | "mobile";
  logo?: React.ReactNode;
  className?: string;
}> = ({ navigation, style, logo, className }) => {
  const config = navigationVariants.header[style];

  // الحصول على العناصر الرئيسية للعرض في الهيدر
  const mainItems =
    navigation.filteredSections.find((section) => section.id === "main")
      ?.items || [];

  const serviceItems =
    navigation.filteredSections.find((section) => section.id === "services")
      ?.items || [];

  const displayItems = [...mainItems, ...serviceItems].slice(
    0,
    config.maxItems,
  );

  return (
    <div
      className={cn("bg-white border-b border-gray-200 px-4 py-3", className)}
    >
      <div className="flex items-center justify-between">
        {/* اللوجو */}
        {config.showLogo && logo && <div className="flex-shrink-0">{logo}</div>}

        {/* عناصر التنقل الرئيسية */}
        {style !== "mobile" && displayItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {displayItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={navigation.isItemActive(item)}
                onClick={() => navigation.navigateToItem(item)}
                badge={navigation.getItemBadge(item)}
                showDescription={false}
                className="p-2 rounded-lg"
              />
            ))}
          </nav>
        )}

        {/* الأدوات السريعة */}
        {config.showQuickActions && (
          <div className="flex items-center gap-2">
            {navigation.filteredQuickActions.map((action) => {
              const Icon = action.icon;
              const badge = navigation.getActionBadge(action.id);

              const handleClick = () => {
                switch (action.action) {
                  case "openSearch":
                    navigation.toggleSearch();
                    break;
                  case "openNotifications":
                    navigation.toggleNotifications();
                    break;
                  case "toggleMenu":
                    navigation.toggleMobileMenu();
                    break;
                  default:
                    if (action.path) {
                      navigation.navigateToPath(action.path);
                    }
                }
              };

              return (
                <button
                  key={action.id}
                  onClick={handleClick}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title={action.label}
                >
                  <Icon className="w-5 h-5" />
                  {badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// مكون التنقل السفلي
const BottomNavigation: React.FC<{
  navigation: ReturnType<typeof useNavigationSystem>;
  style: "fixed" | "floating";
  className?: string;
}> = ({ navigation, style, className }) => {
  const config = navigationVariants.bottomNav[style];

  // اختيار العناصر الأكثر أهمية للتنقل السفلي
  const bottomNavItems = [
    navigation.filteredSections.find((s) => s.id === "main")?.items[0], // Home
    navigation.filteredSections.find((s) => s.id === "services")?.items[0], // Dental Supply
    navigation.filteredSections
      .find((s) => s.id === "account")
      ?.items.find((i) => i.id === "favorites"), // Favorites
    navigation.filteredSections
      .find((s) => s.id === "account")
      ?.items.find((i) => i.id === "profile"), // Profile
  ]
    .filter(Boolean)
    .slice(0, config.maxItems);

  return (
    <div
      className={cn(
        "bg-white border-t border-gray-200",
        style === "fixed" && "fixed bottom-0 left-0 right-0 z-50",
        style === "floating" && "mx-4 mb-4 rounded-2xl shadow-lg",
        className,
      )}
    >
      <div className="grid grid-cols-4 gap-1 p-2">
        {bottomNavItems.map((item) => {
          if (!item) return null;

          const Icon = item.icon;
          const isActive = navigation.isItemActive(item);
          const badge = navigation.getItemBadge(item);

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => navigation.navigateToItem(item)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {badge && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              {config.showLabels && (
                <span className="text-xs font-medium truncate max-w-16">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// المكون الرئيسي الموحد
export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  variant,
  style,
  userRole = null,
  userStats = {},
  className,
  logo,
  onItemClick,
}) => {
  const navigation = useNavigationSystem(userRole, userStats);

  // معالج النقر على العناصر
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  React.useEffect(() => {
    // إضافة معالج النقر إلى جميع العناصر
    const originalNavigateToItem = navigation.navigateToItem;
    navigation.navigateToItem = (item) => {
      handleItemClick(item.id);
      originalNavigateToItem(item);
    };
  }, [handleItemClick]);

  switch (variant) {
    case "header":
      return (
        <HeaderNavigation
          navigation={navigation}
          style={style as "full" | "minimal" | "mobile"}
          logo={logo}
          className={className}
        />
      );

    case "sidebar":
      return (
        <SidebarNavigation
          navigation={navigation}
          style={style as "expanded" | "compact"}
          className={className}
        />
      );

    case "bottomNav":
      return (
        <BottomNavigation
          navigation={navigation}
          style={style as "fixed" | "floating"}
          className={className}
        />
      );

    default:
      console.error(`Unsupported navigation variant: ${variant}`);
      return null;
  }
};

export default UnifiedNavigation;

// تصدير مكونات فرعية للاستخدام المنفصل
export {
  NavigationItem,
  SidebarNavigation,
  HeaderNavigation,
  BottomNavigation,
};
