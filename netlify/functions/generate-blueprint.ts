import { Handler } from '@netlify/functions';

const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const formData = JSON.parse(event.body || '{}');
        if (!formData || typeof formData !== 'object') {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request payload" }) };
        }
        if (!formData.businessIdea || typeof formData.businessIdea !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: "Business Idea is required" }) };
        }

        const prompt = `
      You are a professional Marketing Stack Architect. Analyze the following business details and create a comprehensive Marketing Architecture Blueprint.
      
      Business Details:
      - Website URL: ${formData.websiteUrl || 'N/A'}
      - Business Idea/Description: ${formData.businessIdea || 'N/A'}
      - Current Tools: ${formData.currentTools || 'None'}
      - Business Type: ${formData.businessType}
      - Budget Range: ${formData.budgetRange}
      - Target Audience: ${formData.targetAudience || 'General'}
      - Geography: ${formData.geography}
      - Growth Goal: ${formData.growthGoal}
      
      Keep your reasoning concise. Provide a highly professional, structured response in JSON format matching this exact schema:
      {
        "businessModelAnalysis": "Professional breakdown of the business model",
        "funnelStrategy": "Diagram-style explanation in text format",
        "recommendedStack": [
          { "layer": "e.g., Website CMS", "tool": "Specific tool", "why": "Brief justification" }
        ],
        "dataAndTrackingSetup": "Tracking architecture recommendations",
        "automationPlan": "Suggested automation workflows",
        "ninetyDayRoadmap": [
          { "phase": "e.g., Phase 1: Foundation", "description": "Details" }
        ],
        "estimatedBudgetTiers": [
          { "tier": "e.g., Free", "cost": "$0", "description": "Details" }
        ],
        "strategicNotes": "CRO suggestions and AI integrations"
      }
      
      Ensure the tone is authoritative and strategic, fitting a high-end marketing consultancy.
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
                model: "openai/gpt-4o-mini",
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

        // Clean up potential markdown formatting from the response
        const cleanedText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        let blueprint;
        try {
            blueprint = JSON.parse(cleanedText);
        } catch (err) {
            console.error("JSON parsing error:", err, "Cleaned text:", cleanedText);
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to parse the AI architecture response into JSON." }) };
        }

        return { statusCode: 200, body: JSON.stringify(blueprint) };
    } catch (error) {
        console.error("Error generating blueprint:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate blueprint" }) };
    }
};
