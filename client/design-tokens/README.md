# Design Tokens System - نظام رموز التصميم الموحد

## نظرة عامة

نظام Design Tokens الموحد لمنصة DentalHub يوفر مجموعة شاملة من رموز التصميم المعيارية للألوان والمسافات والخطوط والحدود والظلال. هذا النظام يضمن الاتساق البصري عبر جميع أجزاء التطبيق ويسهل الصيانة والتطوير.

## 🎨 الميزات الرئيسية

- **ألوان موحدة**: نظام ألوان شامل مع درجات متدرجة
- **مسافات متسقة**: نظام مسافات مبني على rem units
- **خطوط منظمة**: أحجام وأوزان خطوط متدرجة
- **حدود وظلال معيارية**: أنماط موحدة للحدود والظلال
- **سياق طبي**: ألوان وأنماط خاصة بالمجال الطبي
- **دعم RTL**: دعم كامل للغة العربية
- **TypeScript**: دعم كامل للـ type safety
- **CSS Variables**: متوفرة كمتغيرات CSS للاستخدام المباشر

## 📁 هيكل الملفات

```
client/design-tokens/
├── tokens.ts          # التعريف الأساسي للرموز
├── tokens.css         # متغيرات CSS
├── utils.ts           # دوال مساعدة وإعدادات جاهزة
├── index.ts           # نقطة التصدير الرئيسية
└── README.md          # هذا الملف
```

## 🚀 كيفية الاستخدام

### الاستيراد الأساسي

```typescript
import { dt, tokens, colors, spacing, typography } from "@/design-tokens";
```

### استخدام الألوان

```typescript
// الطريقة السريعة
const primaryColor = dt.color.primary;
const backgroundColor = dt.color.bg.primary;

// الطريقة التفصيلية
const primaryShades = colors.primary("500"); // #3b82f6
const successColor = colors.success("600"); // #16a34a
```

### استخدام المسافات

```typescript
// المسافات الأساسية
const smallPadding = dt.space.sm; // 0.5rem (8px)
const basePadding = dt.space.base; // 1rem (16px)
const largePadding = dt.space.lg; // 1.5rem (24px)

// الوصول التفصيلي
const customSpacing = spacing.get("4"); // 1rem
```

### استخدام الخطوط

```typescript
// أحجام الخطوط
const headingSize = dt.text["2xl"]; // 1.5rem
const bodySize = dt.text.base; // 1rem
const captionSize = dt.text.xs; // 0.75rem

// أوزان الخطوط
const boldWeight = typography.fontWeight.bold; // 700
const mediumWeight = typography.fontWeight.medium; // 500
```

## 🎨 نظام الألوان

### الألوان الأساسية

```typescript
// الألوان الرئيسية
colors.primary(); // #3b82f6 (أزرق طبي)
colors.secondary(); // #0ea5e9 (أزرق فاتح)
colors.success(); // #22c55e (أخضر صحي)
colors.warning(); // #f59e0b (برتقالي تحذيري)
colors.error(); // #ef4444 (أحمر خطر)
```

### الألوان الدلالية

```typescript
// ألوان الخلفية
colors.background.primary; // #ffffff
colors.background.secondary; // #f8fafc
colors.background.accent; // #eff6ff

// ألوان النصوص
colors.text.primary; // #0f172a
colors.text.secondary; // #334155
colors.text.tertiary; // #64748b
```

### الألوان الطبية المتخصصة

```typescript
// ألوان طب الأسنان
colors.dental.healthy; // #22c55e (أسنان صحية)
colors.dental.cavity; // #dc2626 (تسوس)
colors.dental.filling; // #64748b (حشوة)

// ألوان الطوارئ
colors.emergency.urgent; // #dc2626 (عاجل)
colors.emergency.high; // #f59e0b (مهم)
colors.emergency.medium; // #3b82f6 (متوسط)
colors.emergency.low; // #22c55e (منخفض)

// ألوان الحالة المهنية
colors.professional.verified; // #22c55e (موثق)
colors.professional.pending; // #f59e0b (في الانتظار)
colors.professional.rejected; // #dc2626 (مرفوض)
```

## 📏 نظام المسافات

النظام مبني على وحدة أساسية = 4px (0.25rem)

```typescript
spacing.xs; // 0.25rem (4px)
spacing.sm; // 0.5rem  (8px)
spacing.base; // 1rem    (16px)
spacing.lg; // 1.5rem  (24px)
spacing.xl; // 2rem    (32px)
spacing["2xl"]; // 3rem   (48px)
```

## 🔤 نظام الخطوط

### عائلات الخطوط

```typescript
typography.fontFamily.sans; // Inter, system-ui, sans-serif
typography.fontFamily.arabic; // Noto Sans Arabic, system-ui, sans-serif
typography.fontFamily.medical; // Inter, system-ui, sans-serif
```

### أحجام الخطوط

```typescript
typography.fontSize.xs; // 0.75rem  (12px)
typography.fontSize.sm; // 0.875rem (14px)
typography.fontSize.base; // 1rem     (16px)
typography.fontSize.lg; // 1.125rem (18px)
typography.fontSize.xl; // 1.25rem  (20px)
typography.fontSize["2xl"]; // 1.5rem  (24px)
```

### أنماط العناوين الجاهزة

```typescript
typography.heading.h1; // حجم كبير، وزن عريض
typography.heading.h2; // حجم متوسط، وزن عريض
typography.heading.h3; // حجم صغير، وزن متوسط
```

## 🎛️ المكونات الجاهزة

### أزرار

```typescript
// استخدام الأنماط الجاهزة
const buttonStyle = components.button.primary;
const secondaryButton = components.button.secondary;

// أحجام مختلفة
const smallButton = components.button.sizes.sm;
const largeButton = components.button.sizes.lg;
```

### بطاقات

```typescript
// بطاقة أساسية
const cardStyle = components.card.base;

// بطاقة تفاعلية
const interactiveCard = components.card.interactive;

// بطاقة طبية
const medicalCard = components.card.medical;
```

### حقول الإدخال

```typescript
// حقل إدخال أساسي
const inputStyle = components.input.base;

// حقل بخطأ
const errorInput = components.input.error;

// حقل بنجاح
const successInput = components.input.success;
```

## 🎭 الاستخدام مع CSS

يمكن استخدام الرموز مباشرة في CSS من خلال متغيرات CSS:

```css
.my-component {
  color: var(--color-text-primary);
  background-color: var(--color-background-primary);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
}

/* أو استخدام الفئات الجاهزة */
.medical-card {
  /* تطبق تلقائياً أنماط البطاقة الطبية */
}

.medical-button {
  /* تطبق تلقائياً أنماط الزر الطبي */
}
```

## 🎨 الاستخدام مع Tailwind CSS

الرموز متكاملة مع Tailwind CSS:

```jsx
<div className="bg-primary-500 text-white p-4 rounded-lg shadow-md">
  محتوى بألوان موحدة
</div>

<div className="medical-card">
  بطاقة طبية جاهزة
</div>

<button className="medical-button">
  زر طبي جاهز
</button>
```

## 🌙 الوضع المظلم

النظام جاهز لدعم الوضع المظلم:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-primary: var(--color-neutral-900);
    --color-text-primary: var(--color-neutral-50);
    /* المزيد من التخصيصات... */
  }
}
```

## 📱 الاستجابة (Responsive)

```typescript
// استخدام نقاط التوقف
responsive.up("md"); // @media (min-width: 768px)
responsive.down("lg"); // @media (max-width: 1023px)

// أنماط متجاوبة
const responsiveStyles = responsiveStyles({
  base: { fontSize: dt.text.sm },
  md: { fontSize: dt.text.base },
  lg: { fontSize: dt.text.lg },
});
```

## 🚨 التنبيهات الطبية

```typescript
// الحصول على لون حسب الأولوية
const urgentColor = getEmergencyColor("urgent"); // #dc2626
const highColor = getEmergencyColor("high"); // #f59e0b

// الحصول على لون حسب الحالة المهنية
const verifiedColor = getProfessionalStatusColor("verified"); // #22c55e
```

## 🔧 الدوال المساعدة

```typescript
// إنشاء متغير CSS
const cssVariable = cssVar("color-primary-500"); // var(--color-primary-500)

// أنماط متجاوبة
const styles = responsiveStyles({
  base: { padding: dt.space.base },
  md: { padding: dt.space.lg },
  lg: { padding: dt.space.xl },
});
```

## 🎯 أفضل الممارسات

### 1. استخدام الرموز دائماً

```typescript
// ✅ صحيح
const color = dt.color.primary;

// ❌ خطأ
const color = "#3b82f6";
```

### 2. استخدام الدوال المساعدة

```typescript
// ✅ صحيح
const emergencyColor = getEmergencyColor("urgent");

// ❌ خطأ
const emergencyColor = "#dc2626";
```

### 3. الاستفادة من الأنماط الجاهزة

```typescript
// ✅ صحيح
const buttonStyle = presets.button.primary;

// ❌ خطأ
const buttonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "8px 16px",
  // ...
};
```

### 4. استخدام TypeScript للتحقق من الأنواع

```typescript
// ✅ صحيح - مع type safety
const spacing: SpacingScale = "4";
const color = getSpacing(spacing);

// ❌ خطأ - بدون type safety
const color = getSpacing("invalid");
```

## 🧪 المثال الشامل

راجع ملف `client/examples/DesignTokensExample.tsx` للحصول على مثال شامل يوضح جميع استخدامات النظام.

## 🔄 التحديث والصيانة

عند إضافة رموز جديدة:

1. أضف الرمز في `tokens.ts`
2. أضف متغير CSS في `tokens.css`
3. أضف دالة مساعدة في `utils.ts` إذا لزم الأمر
4. حدّث التصدير في `index.ts`
5. حدّث الوثائق في هذا الملف

## 📚 المراجع

- [Design Tokens Specification](https://design-tokens.github.io/community-group/format/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
