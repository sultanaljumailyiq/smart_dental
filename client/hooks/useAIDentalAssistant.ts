import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useToast } from '@/hooks/use-toast';

interface UseAIDentalAssistantProps {
  clinicData?: any;
  clinicId?: string;
  agentType?: 'clinic' | 'patient' | 'diagnosis' | 'workflow';
  customInstructions?: string;
  preferredModel?: string; // e.g., 'gemini-2.5-flash', 'gpt-4o-mini'
}

export const useAIDentalAssistant = ({ 
  clinicData, 
  clinicId,
  agentType = 'clinic',
  customInstructions,
  preferredModel = 'gemini-2.5-flash'
}: UseAIDentalAssistantProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    message: string, 
    imageData?: string, 
    analysisType?: string,
    overrideAgentType?: string
  ) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-agent-manager', {
        body: {
          message,
          clinicData,
          clinicId,
          imageData,
          analysisType,
          agentType: overrideAgentType || agentType,
          customInstructions,
          preferredModel
        }
      });

      if (error) {
        console.error('AI Agent Error:', error);
        toast({
          title: 'خطأ في وكيل الذكاء الاصطناعي',
          description: 'تأكد من إضافة مفاتيح API في إعدادات النظام',
          variant: 'destructive'
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('AI Agent Exception:', error);
      toast({
        title: 'خطأ في الاتصال',
        description: 'فشل الاتصال بوكيل الذكاء الاصطناعي',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportType: string = 'comprehensive') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-clinic-report', {
        body: {
          clinicData,
          reportType
        }
      });

      if (error) {
        console.error('Report Generation Error:', error);
        toast({
          title: 'خطأ في إنشاء التقرير',
          description: 'تأكد من إضافة مفاتيح API في إعدادات النظام',
          variant: 'destructive'
        });
        return null;
      }

      toast({
        title: 'تم إنشاء التقرير',
        description: 'تم تحليل البيانات بنجاح',
      });

      return data;
    } catch (error) {
      console.error('Report Generation Exception:', error);
      toast({
        title: 'خطأ في الاتصال',
        description: 'فشل إنشاء التقرير',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    generateReport,
    isLoading
  };
};
