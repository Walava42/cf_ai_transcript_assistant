An AI-powered, full-stack serverless application designed to help students and developers break down complex academic texts, dense technical documentation, or lecture excerpts into simple summaries and study flashcards.

Built exclusively on the **Cloudflare Developer Platform** for a lightning-fast, edge-computed experience.

## 🚀 Live Demo
**Try it out here:** [https://study-notes-frontend.pages.dev](https://study-notes-frontend.pages.dev)

## 🏗️ Architecture & Tech Stack
This project is 100% serverless and deployed on Cloudflare's edge network.

* **Frontend:** HTML5, Vanilla JavaScript, and Tailwind CSS for a modern, dark-mode UI. Hosted on **Cloudflare Pages**.
* **Backend/API:** **Cloudflare Workers** (TypeScript) handling secure cross-origin requests (CORS) and AI orchestration.
* **AI Engine:** **Cloudflare Workers AI** using Meta's `Llama 3.3 70B Instruct` model (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) to process and structure the data into a strict JSON format.
* **Database:** **Cloudflare D1** (Serverless SQLite) to persistently store the original texts, generated summaries, and flashcards.

## ✨ Features
* **Smart Summarization:** Converts convoluted paragraphs into easy-to-understand core concepts.
* **Auto-Flashcards:** Generates Q&A flashcards instantly for active recall studying.
* **Edge Performance:** Ultra-low latency globally thanks to Cloudflare's distributed infrastructure.
* **Robust JSON Parsing:** The backend enforces and sanitizes strict JSON schema validation from the LLM output before passing it to the client and database.

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Walava42/cf_ai_transcript_assistant.git
   cd cf_ai_transcript_assistant
   ```
   
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up local D1 Database:**
   ```bash
   npx wrangler d1 execute study-notes-db --local --file=./schema.sql
   ```

4. **Run the local development server:**
   ```bash
   npx wrangler dev
   ```
