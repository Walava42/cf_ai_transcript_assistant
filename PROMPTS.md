# 🤖 AI Prompts Used

This document outlines the AI prompts used during the development of this project, both for generating the application code (AI-assisted coding) and the system prompt used within the Cloudflare Worker to control the Llama 3.3 model.

## 1. Application Prompt (System Prompt for Llama 3.3)
To ensure the LLM returned structured data that could be safely parsed by the frontend and stored in the D1 database, I used a strict system prompt. 

**Prompt used in `src/index.ts`:**
> "You are an expert technical tutor. Analyze the provided text excerpt. Output ONLY valid JSON: {\"summary\": \"A string, easy-to-understand explanation of the core concept\", \"flashcards\": [{\"q\": \"string\", \"a\": \"answer\"}]}"

---

## 2. AI-Assisted Coding Prompts
During development, I used AI assistants (like ChatGPT/Gemini) to speed up boilerplate creation, debug CORS issues, and design the UI. Here are the core prompts I used:

**Prompt 1: Initial Architecture & D1 Setup**
> "I am building a Cloudflare Worker using TypeScript. I need to set up a D1 database with a table called 'notes' (columns: id, original_text, summary, flashcards, created_at). Show me the `schema.sql` and the `wrangler.jsonc` configuration to bind this database and the Workers AI service."

**Prompt 2: LLM Integration & Safe Parsing**
> "Write the `index.ts` logic for a Cloudflare Worker that accepts a POST request with text. It should pass this text to the `@cf/meta/llama-3.3-70b-instruct-fp8-fast` model. Sometimes the AI returns the JSON wrapped in markdown (```json ... ```). Write a robust parsing function in TypeScript to clean the string before running `JSON.pars ()`."

**Prompt 3: Frontend & UI Construction**
> "Create a single-file `index.html` frontend using Tailwind CSS via CDN. It needs a dark mode aesthetic. Include a textarea for the user's transcript, a submit button with a loading spinner, and JavaScript logic to send a POST request to my Worker URL. Parse the returned JSON and render the summary and flashcards into modern HTML cards."

**Prompt 4: Debugging CORS**
> "My frontend is being blocked by CORS when trying to fetch from my local Wrangler server. How do I add the proper CORS headers (Access-Control-Allow-Origin, etc.) to my Cloudflare Worker response, and how do I handle the preflight OPTIONS request?"