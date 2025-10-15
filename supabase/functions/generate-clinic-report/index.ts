import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clinicData, reportType } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'No AI API keys configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare detailed clinic analysis prompt
    const analysisPrompt = `قم بإنشاء تقرير تحليلي شامل للعيادة باللغة العربية:

📊 **بيانات العيادة:**
- إجمالي المرضى: ${clinicData.totalPatients}
- المواعيد المجدولة اليوم: ${clinicData.todayAppointments}
- المواعيد المنجزة اليوم: ${clinicData.completedToday}
- المواعيد المعلقة: ${clinicData.pendingAppointments}
- الإيرادات الشهرية: ${clinicData.monthlyRevenue.toLocaleString()} د.ع
- إجمالي الإيرادات: ${clinicData.totalRevenue.toLocaleString()} د.ع
- إجمالي المصروفات: ${clinicData.totalExpenses.toLocaleString()} د.ع
- صافي الربح: ${clinicData.netProfit.toLocaleString()} د.ع
- الطاقم النشط: ${clinicData.activeStaff}
- المخزون المنخفض: ${clinicData.lowStock} عنصر
- طلبات المختبر المعلقة: ${clinicData.pendingLabOrders}
- طلبات المختبر الجاهزة: ${clinicData.readyLabOrders}
- تكاليف المختبر الشهرية: ${clinicData.thisMonthLabCosts.toLocaleString()} د.ع

نوع التقرير المطلوب: ${reportType || 'شامل'}

يرجى تقديم:
1. **تحليل الأداء**: تقييم شامل للأداء الحالي مع نقاط القوة والضعف
2. **المؤشرات المالية**: تحليل الوضع المالي والربحية
3. **إدارة المواعيد**: تقييم كفاءة الجدولة والحضور
4. **المخزون والتوريد**: حالة المخزون والتوصيات
5. **طلبات المختبر**: تحليل أداء المختبر والتكاليف
6. **التوصيات والاقتراحات**: خطوات تحسين واضحة وقابلة للتنفيذ
7. **التوقعات**: توقعات النمو والتطوير

استخدم رموز تعبيرية ✨ وتنسيق واضح للعناوين والنقاط الرئيسية.`;

    let reportContent;

    if (GEMINI_API_KEY) {
      console.log('Generating report with Gemini');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: analysisPrompt }]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      reportContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
    } else if (OPENAI_API_KEY) {
      console.log('Generating report with OpenAI');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير في تحليل أداء العيادات الطبية وإعداد التقارير الاحترافية'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      reportContent = data.choices?.[0]?.message?.content;
    }

    return new Response(
      JSON.stringify({ 
        report: reportContent,
        generatedAt: new Date().toISOString(),
        reportType: reportType || 'comprehensive'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
