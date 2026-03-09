# 🦫 PukPuk: The Stoic Capybara AI Chatbot

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase_pgvector-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

> **Live Demo:** [https://puk-puk-chatbot-rag.vercel.app](https://puk-puk-chatbot-rag.vercel.app) 

## 📖 About The Project

**PukPuk** is an AI-powered chatbot designed to help corporate workers navigate burnout, stress, and daily workplace drama using **Stoic Philosophy**. 

This project was built as a submission for the **NeoTechPark "Vibe Engineering + RAG Implementation" Challenge**. It goes beyond simple text generation by combining advanced data retrieval with a highly specific, empathetic, and culturally relatable persona—a chill, stoic capybara communicating in a modern Indonesian corporate "Jaksel" style.

### 🧠 Core Concepts

#### 1. Vibe Engineering
PukPuk is not just a generic AI; it is an engineered persona. Through rigorous system prompting, PukPuk maintains the character of a non-judgmental, deeply empathetic capybara who references Stoic principles naturally. The "vibe" is further enhanced through UI micro-interactions, such as:
- Custom dynamic typing indicators (e.g., *"PukPuk sedang berendam di air panas mencari wangsit..."*).
- Delightful easter eggs (clicking the logo triggers falling leaf confetti and playful toast messages).
- A calming "Sage Green" UI aesthetic to reduce user stress visually.

#### 2. Retrieval-Augmented Generation (RAG)
To prevent AI hallucinations and provide genuinely useful philosophical advice, PukPuk uses a RAG pipeline. When a user shares a problem, the system retrieves contextual Stoic principles and quotes from a dedicated vector database before generating a response.

---

## ✨ Key Features

- **Persona-Driven AI Chat:** Engaging, context-aware conversations powered by Gemini 2.5 Flash.
- **RAG Pipeline:** Utilizes Supabase `pgvector` to perform similarity searches on Stoic texts.
- **Interactive UI/UX:** Clean, responsive design built with Tailwind CSS, featuring auto-scroll to bottom.
- **Quick Replies:** Pre-defined "Curhat" (venting) chips for users who are too burned out to type.
- **Custom Empty & Error States:** Themed graphics (sleeping capybara for empty state, angry capybara for errors) to maintain character consistency.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React.js, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless Functions)
- **AI Model:** Google Gemini API (gemini-2.5-flash) for LLM and Text Embeddings.
- **Database & Vector Store:** Supabase (PostgreSQL with pgvector extension)
- **Deployment:** Vercel

---

## 🏗️ System Architecture Flow

1. **User Input:** The user types a message or selects a quick reply.
2. **Embedding Generation:** The backend converts the user's message into vector embeddings using Google Gemini's embedding model.
3. **Vector Search (Retrieval):** The embeddings are queried against Supabase (pgvector) to find the most relevant Stoic philosophical context.
4. **Prompt Assembly:** The retrieved context and the user's message are combined with PukPuk's strict persona system prompt.
5. **Generation & Response:** Gemini 2.5 Flash processes the combined prompt and returns a highly contextual, persona-accurate response to the frontend.

---

## 🚀 Getting Started (Local Development)

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- A Supabase Project (with pgvector enabled)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
  
   git clone [https://github.com/sabaach/PukPuk-ChatbotRAG.git](https://github.com/sabaach/PukPuk-ChatbotRAG.git)
   cd PukPuk-ChatbotRAG

2. **Install dependencies:**
   
    npm install

3. **Set up Environment Variables:**
    Create a .env.local file in the root directory and add the following variables:

    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
    SUPABASE_URL=your_supabase_project_url_here
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

4. **Seed the Database (Optional but recommended for RAG):**
    If you haven't populated your Supabase vector database with Stoic data, run the seeding script:

    node scripts/seed_database.js


5. **Run the development server:**
   
    npm run dev


6. **Open the app:**
    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to interact with PukPuk.

---

## 📸 Screenshots

*(Tip: Replace the placeholder links below with actual screenshots of your app uploaded to your repository's /public/docs/ or /docs/ folder).*

| Empty State (Sleeping Capybara) | Active Chat (RAG & Vibe Engineering) |
| --- | --- |
| <img src="public/gambar/bersandar.png" width="300" alt="Empty State"> | <img src="public/gambar/logo.png" width="300" alt="Active Chat"> |

---

## 👨‍💻 Author

**Syafrie Bachtiar** *AI & Software Engineer | Final Year Student at ITS Surabaya*

* [LinkedIn Profile](https://www.linkedin.com/in/syafrie-bachtiar-a4a915247/)
* [GitHub Profile](https://www.google.com/search?q=https://github.com/sabaach)

---

## 🙏 Acknowledgments

* **NeoTechPark** - For hosting the inspiring Vibe Engineering + RAG Challenge.
* **Kei Matsuoka & Team** - For the continuous support and community building for Indonesian developers.

```
