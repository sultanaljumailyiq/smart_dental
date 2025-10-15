import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

/**
 * مكون لتحسين التطبيق للهاتف المحمول
 * يضيف classes CSS وتحسينات خاصة بالأجهزة المحمولة
 */
export default function MobileOptimizer({ children }: MobileOptimizerProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // إضافة classes CSS للمتصفح
    document.documentElement.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('mobile-optimized', isMobile);

    // تحسين الأداء للهاتف المحمول
    if (isMobile) {
      // تفعيل smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // تحسين touch scrolling
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      
      // منع الـ zoom عند التركيز على input
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
        );
      }
    }

    return () => {
      document.documentElement.classList.remove('is-mobile');
      document.body.classList.remove('mobile-optimized');
    };
  }, [isMobile]);

  // إضافة event listeners للتحسينات
  useEffect(() => {
    if (!isMobile) return;

    // تحسين أداء الـ touch events
    const handleTouchStart = (e: TouchEvent) => {
      // إضافة visual feedback للمس
      const target = e.target as HTMLElement;
      if (target.classList.contains('mobile-tap-highlight')) {
        target.classList.add('mobile-button-press');
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // إزالة visual feedback
      const target = e.target as HTMLElement;
      if (target.classList.contains('mobile-tap-highlight')) {
        setTimeout(() => {
          target.classList.remove('mobile-button-press');
        }, 150);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  return (
    <>
      {children}
    </>
  );
}
