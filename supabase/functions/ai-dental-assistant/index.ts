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
    const { message, clinicData, imageData, analysisType } = await req.json();
    
    // Get API keys from environment
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'No AI API keys configured. Please add GEMINI_API_KEY or OPENAI_API_KEY in settings.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare system prompt with clinic context
    const systemPrompt = `أنت مساعد ذكي متخصص في طب الأسنان. 
    
مهامك الأساسية:
- تحليل البيانات الطبية للعيادات
- إنشاء تقارير وتشخيصات دقيقة
- تقديم اقتراحات لتحسين الأداء
- تحليل الصور الطبية والأشعة
- المساعدة في التخطيط العلاجي

البيانات المتاحة:
${clinicData ? `
إحصائيات العيادة:
- عدد المرضى: ${clinicData.totalPatients}
- المواعيد اليوم: ${clinicData.todayAppointments}
- الإيرادات الشهرية: ${clinicData.monthlyRevenue} د.ع
- المخزون المنخفض: ${clinicData.lowStock} عنصر
- طلبات المختبر المعلقة: ${clinicData.pendingLabOrders}
` : 'لا توجد بيانات عيادة متاحة حالياً'}

قدم إجاباتك بشكل احترافي ودقيق باللغة العربية.`;

    let aiResponse;

    // Use Gemini by default (free during promo period)
    if (GEMINI_API_KEY) {
      console.log('Using Gemini API for analysis');
      
      const geminiEndpoint = imageData 
        ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
        : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

      const requestBody: any = {
        contents: [{
          parts: [
            { text: systemPrompt },
            { text: message }
          ]
        }]
      };

      // Add image if provided
      if (imageData) {
        requestBody.contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: imageData
          }
        });
      }

      const response = await fetch(`${geminiEndpoint}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error:', error);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أتمكن من إنشاء رد';
      
    } else if (OPENAI_API_KEY) {
      console.log('Using OpenAI API for analysis');
      
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ];

      // Add image if provided
      if (imageData) {
        messages[1].content = [
          { type: 'text', text: message },
          { 
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`
            }
          }
        ];
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: imageData ? 'gpt-4o' : 'gpt-4o-mini',
          messages,
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      aiResponse = data.choices?.[0]?.message?.content || 'لم أتمكن من إنشاء رد';
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        model: GEMINI_API_KEY ? 'gemini-2.5-flash' : 'gpt-4o-mini',
        analysisType: analysisType || 'general'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in ai-dental-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'تأكد من إضافة مفتاح API في إعدادات النظام'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
