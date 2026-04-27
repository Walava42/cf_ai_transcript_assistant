export interface Env {
    AI: any;
    DB: D1Database;
}

// CORS headers to allow cross-origin requests from the frontend
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response('Please send a POST request with the text payload.', { 
                status: 400, 
                headers: corsHeaders 
            });
        }

        try {
            const { text } = await request.json() as { text: string };

            if (!text) {
                return new Response('Missing "text" field in the request.', { 
                    status: 400, 
                    headers: corsHeaders 
                });
            }

            // 1. Call the AI Model (Llama 3.3)
            const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert technical tutor. Analyze the provided text excerpt. Output ONLY valid JSON: {\"summary\": \"A string, easy-to-understand explanation of the core concept\", \"flashcards\": [{\"q\": \"string\", \"a\": \"answer\"}]}" 
                    },
                    { 
                        role: "user", 
                        content: text.substring(0, 3000) 
                    }
                ]
            });

            // 2. Safely extract and parse the AI response
            let parsedData;
            try {
                // Check the format of the AI response (handles API variations)
                let rawText = typeof aiResponse === 'object' && aiResponse.response 
                    ? aiResponse.response 
                    : aiResponse;

                // If it's already a JSON object, use it directly
                if (typeof rawText === 'object') {
                    parsedData = rawText;
                } else {
                    // Ensure it's a string and strip any Markdown code blocks
                    rawText = String(rawText).replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    parsedData = JSON.parse(rawText);
                }
            } catch (e) {
                // Fallback in case the AI generates invalid JSON
                parsedData = { summary: "Failed to process AI response.", flashcards: [] };
            }

            // 3. Save interaction to D1 Database
            const summary = parsedData.summary || "No summary generated";
            const flashcards = JSON.stringify(parsedData.flashcards || []);

            await env.DB.prepare('INSERT INTO notes (original_text, summary, flashcards) VALUES (?, ?, ?)')
                .bind(text, summary, flashcards)
                .run();

            // 4. Send the structured response back to the client
            return new Response(JSON.stringify({ 
                success: true, 
                data: parsedData 
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });

        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            });
        }
    },
};