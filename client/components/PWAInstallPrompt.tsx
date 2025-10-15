import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-2xl p-4 animate-in slide-in-from-bottom-5">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Download className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">ثبّت التطبيق</h3>
          <p className="text-sm text-white/90 mb-3">
            ثبّت Smart Dental Platform على جهازك للوصول السريع والعمل أوف لاين
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="bg-white text-blue-600 hover:bg-gray-100 flex-1"
              size="sm"
            >
              <Download className="w-4 h-4 ml-2" />
              تثبيت الآن
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="text-white hover:bg-white/20"
              size="sm"
            >
              لاحقاً
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
