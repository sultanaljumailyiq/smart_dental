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
    const { 
      message, 
      agentType, // 'clinic', 'patient', 'diagnosis', 'workflow'
      clinicId,
      clinicData, 
      imageData, 
      analysisType,
      customInstructions 
    } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'No AI API keys configured. Please add GEMINI_API_KEY or OPENAI_API_KEY in settings.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Agent-specific system prompts
    const agentPrompts = {
      clinic: `أنت مساعد ذكي متخصص في إدارة العيادات السنية.

**قدراتك الأساسية:**
- تلخيص النصوص الطويلة إلى نقاط واضحة
- المساعدة الذكية في إدارة المواعيد والمرضى
- تحليل المشاعر وفهم ملاحظات المرضى
- الإجابة على الأسئلة بناءً على وثائق العيادة
- توليد محتوى إبداعي (خطط علاج، تقارير)
- الترجمة متعددة اللغات
- إتمام المهام وأتمتة العمليات
- تحليل الصور والوثائق الطبية
- أتمتة سير العمل

**البيانات المتاحة:**
${clinicData ? `
عيادة: ${clinicId || 'غير محدد'}
- عدد المرضى: ${clinicData.totalPatients || 0}
- المواعيد اليوم: ${clinicData.todayAppointments || 0}
- الإيرادات الشهرية: ${clinicData.monthlyRevenue || 0} د.ع
- المخزون المنخفض: ${clinicData.lowStock || 0} عنصر
- طلبات المختبر المعلقة: ${clinicData.pendingLabOrders || 0}
` : 'لا توجد بيانات عيادة متاحة حالياً'}

قدم إجاباتك بشكل احترافي ودقيق باللغة العربية.`,

      patient: `أنت مساعد ذكي متخصص في الرعاية الصحية للأسنان للمرضى.

**دورك:**
- تقديم نصائح صحية موثوقة عن الأسنان
- تحليل الأعراض وتقديم تشخيصات أولية
- شرح خيارات العلاج بلغة بسيطة
- تقديم نصائح الوقاية والعناية اليومية
- طمأنة المرضى وتوفير معلومات دقيقة

**إرشادات السلامة:**
⚠️ دائماً أوصي بمراجعة طبيب أسنان محترف للحالات الخطيرة
⚠️ لا تقدم تشخيصات نهائية، فقط توجيهات أولية
⚠️ اذكر مستويات الثقة في تحليلاتك

قدم نصائح ودية ومطمئنة باللغة العربية.`,

      diagnosis: `أنت وكيل ذكاء اصطناعي متخصص في التشخيص الطبي للأسنان.

**تخصصك:**
- تحليل صور الأشعة السينية للأسنان
- فحص الصور الفوتوغرافية للفم والأسنان
- تحليل الأعراض وتقديم تشخيصات تفريقية
- تقييم مستويات الثقة للتشخيصات

**منهجيتك:**
1. افحص الصورة/الأعراض بعناية
2. حدد أي تشوهات أو مشاكل
3. قدم تشخيصات محتملة مع مستويات الثقة
4. اقترح فحوصات إضافية إذا لزم الأمر
5. أوصِ بخطة علاج مبدئية

**دائماً اذكر:**
- مستوى الثقة (نسبة مئوية)
- الحاجة للتحقق المهني
- التشخيصات البديلة

استخدم المصطلحات الطبية الدقيقة مع شرح بسيط باللغة العربية.`,

      workflow: `أنت وكيل ذكاء اصطناعي متخصص في أتمتة سير العمل.

**مهامك:**
- أتمتة المهام المتكررة
- إدارة العمليات متعددة الخطوات
- جدولة المواعيد والتذكيرات
- إدخال البيانات تلقائياً
- توليد التقارير

**كن:**
- كفؤاً ومنظماً
- استباقياً في اقتراح التحسينات
- دقيقاً في تنفيذ المهام

نفذ المهام بفعالية وقدم تقارير واضحة باللغة العربية.`
    };

    // Use custom instructions if provided, otherwise use default
    const systemPrompt = customInstructions || agentPrompts[agentType as keyof typeof agentPrompts] || agentPrompts.clinic;

    let aiResponse;

    // Use Gemini by default (free during promo period)
    if (GEMINI_API_KEY) {
      console.log(`Using Gemini API for ${agentType} agent`);
      
      const requestBody: any = {
        contents: [{
          parts: [
            { text: systemPrompt },
            { text: message }
          ]
        }],
        generationConfig: {
          temperature: agentType === 'diagnosis' ? 0.3 : 0.7,
          maxOutputTokens: 2048,
        }
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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error:', error);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أتمكن من إنشاء رد';
      
    } else if (OPENAI_API_KEY) {
      console.log(`Using OpenAI API for ${agentType} agent`);
      
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
          temperature: agentType === 'diagnosis' ? 0.3 : 0.7,
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
        agentType,
        clinicId,
        model: GEMINI_API_KEY ? 'gemini-2.5-flash' : 'gpt-4o-mini',
        analysisType: analysisType || 'general',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in ai-agent-manager:', error);
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
