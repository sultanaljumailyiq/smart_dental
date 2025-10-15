import React from "react";
import { cn } from "@/lib/utils";
import {
  dt,
  presets,
  getEmergencyColor,
  getProfessionalStatusColor,
} from "@/design-tokens";

// مثال شامل على استخدام Design Tokens في المكونات

// مثال على Button مع Design Tokens
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "base" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "base",
  children,
  onClick,
  disabled,
  className,
}) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 200ms ease",
    border: "none",
    borderRadius: dt.radius.md,
    opacity: disabled ? "0.6" : "1",
  };

  const variants = {
    primary: {
      backgroundColor: dt.color.primary,
      color: "white",
      "&:hover": !disabled && {
        backgroundColor: "#2563eb",
        transform: "translateY(-1px)",
        boxShadow: dt.shadow.md,
      },
    },
    secondary: {
      backgroundColor: "transparent",
      color: dt.color.primary,
      border: `1px solid ${dt.color.border.primary}`,
      "&:hover": !disabled && {
        backgroundColor: dt.color.bg.secondary,
        borderColor: dt.color.primary,
      },
    },
    danger: {
      backgroundColor: dt.color.error,
      color: "white",
      "&:hover": !disabled && {
        backgroundColor: "#dc2626",
        transform: "translateY(-1px)",
        boxShadow: dt.shadow.md,
      },
    },
  };

  const sizes = {
    sm: {
      height: "2rem",
      padding: `${dt.space.xs} ${dt.space.sm}`,
      fontSize: dt.text.sm,
    },
    base: {
      height: "2.5rem",
      padding: `${dt.space.sm} ${dt.space.base}`,
      fontSize: dt.text.base,
    },
    lg: {
      height: "3rem",
      padding: `${dt.space.sm} ${dt.space.lg}`,
      fontSize: dt.text.lg,
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(className)}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
      }}
    >
      {children}
    </button>
  );
};

// مثال على Card مع Design Tokens
interface CardProps {
  variant?: "base" | "interactive" | "medical";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = "base",
  children,
  onClick,
  className,
}) => {
  const baseStyles = {
    backgroundColor: dt.color.bg.primary,
    borderRadius: dt.radius.xl,
    padding: dt.space.lg,
    border: `1px solid ${dt.color.border.primary}`,
    transition: "all 200ms ease",
  };

  const variants = {
    base: {
      boxShadow: dt.shadow.base,
    },
    interactive: {
      boxShadow: dt.shadow.base,
      cursor: "pointer",
      "&:hover": {
        boxShadow: dt.shadow.lg,
        transform: "translateY(-2px)",
        borderColor: dt.color.border.accent,
      },
    },
    medical: {
      boxShadow:
        "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
      borderLeft: `4px solid ${dt.color.primary}`,
    },
  };

  return (
    <div
      onClick={variant === "interactive" ? onClick : undefined}
      className={cn(className)}
      style={{
        ...baseStyles,
        ...variants[variant],
      }}
    >
      {children}
    </div>
  );
};

// مثال على Input مع Design Tokens
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled,
  className,
}) => {
  const baseStyles = {
    width: "100%",
    padding: `${dt.space.sm} ${dt.space.base}`,
    borderRadius: dt.radius.md,
    fontSize: dt.text.base,
    backgroundColor: disabled ? dt.color.bg.secondary : dt.color.bg.primary,
    color: disabled ? dt.color.text.secondary : dt.color.text.primary,
    transition: "all 150ms ease",
    border: `1px solid ${error ? dt.color.error : dt.color.border.primary}`,
    outline: "none",
    cursor: disabled ? "not-allowed" : "text",
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(className)}
      style={baseStyles}
    />
  );
};

// مثال على Badge للحالة الطبية
interface MedicalBadgeProps {
  status: "verified" | "pending" | "rejected" | "inactive";
  children: React.ReactNode;
}

const MedicalBadge: React.FC<MedicalBadgeProps> = ({ status, children }) => {
  const statusColor = getProfessionalStatusColor(status);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${dt.space.xs} ${dt.space.sm}`,
        fontSize: dt.text.xs,
        fontWeight: "500",
        borderRadius: dt.radius.full,
        color: statusColor,
        backgroundColor: `${statusColor}20`,
        border: `1px solid ${statusColor}40`,
      }}
    >
      {children}
    </span>
  );
};

// مثال على Emergency Alert
interface EmergencyAlertProps {
  priority: "urgent" | "high" | "medium" | "low";
  title: string;
  message: string;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  priority,
  title,
  message,
}) => {
  const emergencyColor = getEmergencyColor(priority);

  const priorityIcons = {
    urgent: "🚨",
    high: "⚠️",
    medium: "ℹ️",
    low: "✅",
  };

  return (
    <div
      style={{
        padding: dt.space.base,
        borderRadius: dt.radius.lg,
        border: `1px solid ${emergencyColor}`,
        backgroundColor: `${emergencyColor}10`,
        borderLeft: `4px solid ${emergencyColor}`,
        boxShadow: `0 4px 6px -1px ${emergencyColor}20`,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: dt.space.sm }}
      >
        <span style={{ fontSize: dt.text.lg }}>{priorityIcons[priority]}</span>
        <div>
          <h4
            style={{
              fontSize: dt.text.base,
              fontWeight: "600",
              color: emergencyColor,
              margin: "0 0 4px 0",
            }}
          >
            {title}
          </h4>
          <p
            style={{
              fontSize: dt.text.sm,
              color: dt.color.text.secondary,
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

// مثال شامل على استخدام Design Tokens
const DesignTokensExample: React.FC = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [errorInput, setErrorInput] = React.useState(false);

  return (
    <div
      style={{
        padding: dt.space["2xl"],
        backgroundColor: dt.color.bg.secondary,
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* العنوان الرئيسي */}
        <h1
          style={{
            fontSize: dt.text["3xl"],
            fontWeight: "700",
            color: dt.color.text.primary,
            marginBottom: dt.space.lg,
            textAlign: "center",
          }}
        >
          مثال على نظام Design Tokens
        </h1>

        {/* قسم الأزرار */}
        <Card variant="base" className="mb-6">
          <h2
            style={{
              fontSize: dt.text.xl,
              fontWeight: "600",
              marginBottom: dt.space.base,
              color: dt.color.text.primary,
            }}
          >
            الأزرار
          </h2>
          <div
            style={{ display: "flex", gap: dt.space.base, flexWrap: "wrap" }}
          >
            <Button variant="primary" size="sm">
              زر صغير
            </Button>
            <Button variant="primary" size="base">
              زر متوسط
            </Button>
            <Button variant="primary" size="lg">
              زر كبير
            </Button>
            <Button variant="secondary">زر ثانوي</Button>
            <Button variant="danger">زر خطر</Button>
            <Button variant="primary" disabled>
              زر معطل
            </Button>
          </div>
        </Card>

        {/* قسم الـ Cards */}
        <Card variant="base" className="mb-6">
          <h2
            style={{
              fontSize: dt.text.xl,
              fontWeight: "600",
              marginBottom: dt.space.base,
              color: dt.color.text.primary,
            }}
          >
            البطاقات
          </h2>
          <div
            style={{
              display: "grid",
              gap: dt.space.base,
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            <Card variant="base">
              <h3
                style={{
                  fontSize: dt.text.lg,
                  fontWeight: "600",
                  marginBottom: dt.space.sm,
                }}
              >
                بطاقة عادية
              </h3>
              <p
                style={{ fontSize: dt.text.sm, color: dt.color.text.secondary }}
              >
                هذه بطاقة عادية تستخدم Design Tokens للألوان والمسافات.
              </p>
            </Card>

            <Card variant="interactive" onClick={() => alert("تم النقر!")}>
              <h3
                style={{
                  fontSize: dt.text.lg,
                  fontWeight: "600",
                  marginBottom: dt.space.sm,
                }}
              >
                بطاقة تفاعلية
              </h3>
              <p
                style={{ fontSize: dt.text.sm, color: dt.color.text.secondary }}
              >
                انقر عليها لرؤية التأثير التفاعلي.
              </p>
            </Card>

            <Card variant="medical">
              <h3
                style={{
                  fontSize: dt.text.lg,
                  fontWeight: "600",
                  marginBottom: dt.space.sm,
                }}
              >
                بطاقة طبية
              </h3>
              <p
                style={{ fontSize: dt.text.sm, color: dt.color.text.secondary }}
              >
                بطاقة خاصة بالسياق الطبي مع تصميم مميز.
              </p>
            </Card>
          </div>
        </Card>

        {/* قسم المدخلات */}
        <Card variant="base" className="mb-6">
          <h2
            style={{
              fontSize: dt.text.xl,
              fontWeight: "600",
              marginBottom: dt.space.base,
              color: dt.color.text.primary,
            }}
          >
            حقول الإدخال
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: dt.space.base,
            }}
          >
            <Input
              placeholder="حقل إدخال عادي"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input placeholder="حقل إدخال بخطأ" error={true} />
            <Input placeholder="حقل إدخال معطل" disabled={true} />
          </div>
        </Card>

        {/* قسم الشارات الطبية */}
        <Card variant="base" className="mb-6">
          <h2
            style={{
              fontSize: dt.text.xl,
              fontWeight: "600",
              marginBottom: dt.space.base,
              color: dt.color.text.primary,
            }}
          >
            الشارات الطبية
          </h2>
          <div
            style={{ display: "flex", gap: dt.space.base, flexWrap: "wrap" }}
          >
            <MedicalBadge status="verified">موثق</MedicalBadge>
            <MedicalBadge status="pending">في الانتظار</MedicalBadge>
            <MedicalBadge status="rejected">مرفوض</MedicalBadge>
            <MedicalBadge status="inactive">غير نشط</MedicalBadge>
          </div>
        </Card>

        {/* قسم تنبيهات الطوارئ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: dt.space.base,
          }}
        >
          <EmergencyAlert
            priority="urgent"
            title="تنبيه عاجل"
            message="هناك حالة طوارئ تتطلب تدخلاً فورياً"
          />
          <EmergencyAlert
            priority="high"
            title="تنبيه مهم"
            message="مسألة مهمة تحتاج إلى اهتمام قريباً"
          />
          <EmergencyAlert
            priority="medium"
            title="تنبيه متوسط"
            message="معلومة مفيدة للعلم"
          />
          <EmergencyAlert
            priority="low"
            title="تنبيه منخفض"
            message="كل شيء يسير بشكل طبيعي"
          />
        </div>

        {/* معلومات Design Tokens */}
        <Card variant="base" className="mt-8">
          <h2
            style={{
              fontSize: dt.text.xl,
              fontWeight: "600",
              marginBottom: dt.space.base,
              color: dt.color.text.primary,
            }}
          >
            معلومات Design Tokens
          </h2>
          <div
            style={{
              fontSize: dt.text.sm,
              color: dt.color.text.secondary,
              lineHeight: "1.6",
            }}
          >
            <p>
              هذا المثال يوضح كيفية استخدام نظام Design Tokens الموحد في
              المكونات:
            </p>
            <ul style={{ marginTop: dt.space.sm, paddingRight: dt.space.base }}>
              <li>الألوان موحدة عبر جميع المكونات</li>
              <li>المسافات متسقة ومبنية على نظام محدد</li>
              <li>الخطوط والأحجام منظمة ومتدرجة</li>
              <li>الحدود والظلال محددة مسبقاً</li>
              <li>سهولة الصيانة والتطوير</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesignTokensExample;
