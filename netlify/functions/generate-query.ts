import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { query_text } = JSON.parse(event.body || '{}');
        if (!query_text || typeof query_text !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Query text is required' }) };
        }

        const prompt = `
      You are a senior growth marketing architect with expertise in Martech, CDP, CRM, Automation, Attribution, Paid media, Data architecture, Funnel engineering, and B2B & B2C growth.
      
      Analyze the following business description and growth goal:
      "${query_text}"
      
      Keep your reasoning concise. Provide a highly professional, structured response in JSON format matching this exact schema:
      {
        "businessModelAnalysis": "Professional breakdown of the business model",
        "recommendedStack": [
          { "layer": "e.g., Website CMS", "tool": "Specific tool", "why": "Brief justification" }
        ],
        "architectureAndIntegrations": "How the tools connect and share data",
        "goToMarketStrategy": "Step-by-step GTM plan",
        "coreAutomations": "Key automated workflows to implement",
        "growthLevers": "Primary channels and tactics for growth",
        "ninetyDayRoadmap": [
          { "phase": "e.g., Phase 1: Foundation", "description": "Details" }
        ],
        "estimatedBudgetTiers": [
          { "tier": "e.g., Minimum Viable", "cost": "$X/mo", "description": "Details" }
        ]
      }
      
      No fluff. No emojis. Actionable. Professional. Precise.
      Return ONLY valid JSON. Do not include markdown code blocks like \`\`\`json.
    `;

        if (!openrouterApiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "No API key provided. Please set OPENROUTER_API_KEY." }) };
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openrouterApiKey}`,
                "HTTP-Referer": "https://theboringstack.com",
                "X-Title": "TheBoringStack",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            return { statusCode: 500, body: JSON.stringify({ error: `OpenRouter API error: ${response.statusText}` }) };
        }

        const data = await response.json();
        let resultText = data.choices[0].message.content;

        // Remove deepseek thinking block
        const thinkMatch = resultText.match(/<think>[\s\S]*?<\/think>/);
        if (thinkMatch) {
            resultText = resultText.replace(thinkMatch[0], '');
        }

        const cleanedText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        let blueprint;
        try {
            blueprint = JSON.parse(cleanedText);
        } catch (err) {
            console.error("JSON parsing error:", err, "Cleaned text:", cleanedText);
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to parse the AI architecture response into JSON." }) };
        }

        // Basic lead scoring
        let lead_score = 0;
        const lowerQuery = query_text.toLowerCase();
        if (lowerQuery.includes('$') || lowerQuery.includes('budget')) lead_score += 10;
        if (lowerQuery.includes('saas') || lowerQuery.includes('ecommerce') || lowerQuery.includes('b2b')) lead_score += 15;
        if (lowerQuery.includes('scale') || lowerQuery.includes('growth') || lowerQuery.includes('leads')) lead_score += 5;
        if (query_text.length > 100) lead_score += 5;

        // Save to Supabase
        const { data: dbData, error } = await supabase
            .from('marketing_queries')
            .insert([
                {
                    query_text,
                    ai_output: JSON.stringify(blueprint),
                    lead_score
                }
            ])
            .select('id')
            .single();

        if (error) {
            console.error(error);
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to save query to database" }) };
        }

        // Return partial data for preview
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: dbData.id,
                preview: {
                    businessModelAnalysis: blueprint.businessModelAnalysis,
                    recommendedStack: blueprint.recommendedStack.slice(0, 2)
                }
            })
        };

    } catch (error) {
        console.error("Error generating query:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate architecture" }) };
    }
};
