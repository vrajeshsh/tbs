import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const handler: Handler = async (event, context) => {
    const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
    const siteUrl = process.env.URL || 'https://theboringstack.netlify.app';

    // Lazy init to prevent crash when env vars are missing at module load time
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Request body is empty' }) };
        }

        const { query_text } = JSON.parse(event.body);
        if (!query_text || typeof query_text !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Query text is required' }) };
        }

        if (!openrouterApiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "Netlify Error: OPENROUTER_API_KEY is not set in environment variables." }) };
        }

        const prompt = `
      You are the **Lead Growth Marketing Architect** at **TheBoringStack**. Your goal is to design a high-performance, scalable marketing infrastructure for a client. 

      Client Context/Goal:
      "${query_text}"

      ### Strategic Requirements:
      1. **Business Model Analysis**: Identify the core growth engine (PLG, Sales-Led, or Hybrid).
      2. **The Boring Stack (Tooling)**: Recommend a "minimalist but powerful" stack. Prioritize reliability. Include layers for CDP/Data, CRM, Engagement (Email/SMS), and Analytics.
      3. **Core Automations**: Define the 3 highest-impact automated workflows (e.g., Abandoned Cart, Lead Scoring, Onboarding).
      4. **Go-To-Market Strategy**: Provide a tactical plan for the first 90 days.
      5. **Growth Levers**: Identify the specific metrics that will move the needle for this specific business.

      ### Constraints:
      - Use clean, professional Markdown.
      - Be opinionated. Don't give "options"; give the **best** path.
      - Focus on **First-Party Data** and **Privacy-First** tracking.
      - Use tables where appropriate for clarity.

      Output must be high-signal, zero-fluff, and "CEO-ready".
    `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openrouterApiKey}`,
                "HTTP-Referer": siteUrl,
                "X-Title": "TheBoringStack",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat", // Using DeepSeek V3 for high-quality, efficient reasoning
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: `OpenRouter API error (${response.status}): ${errorData.error?.message || response.statusText || 'Unknown Error'}`
                })
            };
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]) {
            return { statusCode: 500, body: JSON.stringify({ error: "OpenRouter returned an empty response." }) };
        }

        let resultText = data.choices[0].message.content;

        // Remove deepseek thinking block
        const thinkMatch = resultText.match(/<think>[\s\S]*?<\/think>/);
        if (thinkMatch) {
            resultText = resultText.replace(thinkMatch[0], '');
        }

        const cleanedText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        const id = Math.random().toString(36).substring(2, 15);

        // Save to Supabase
        const { error: insertError } = await supabase
            .from('marketing_queries')
            .insert([{
                id,
                query_text,
                ai_output: cleanedText,
                lead_score: 0
            }]);

        if (insertError) {
            console.error("Error saving query to Supabase:", insertError);
            return { statusCode: 500, body: JSON.stringify({ error: 'Database error while saving query' }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                id,
                preview: cleanedText
            })
        };

    } catch (error: any) {
        console.error("Error generating query:", error);
        return { statusCode: 500, body: JSON.stringify({ error: `Function Crash: ${error?.message || "Internal error"}` }) };
    }
};
