# Loan Picks Dashboard

A modern, responsive Next.js web application for personalized loan discovery and AI-assisted financial advice. Features a dynamic dashboard, smart filtering, and a context-aware AI chatbot powered by Meta Llama 3.

## 🚀 Features

- **Personalized Dashboard**:
  - **Best Match**: Automatically highlights the best loan product based on user's credit score and income.
  - **Top Picks**: Curated list of top 5 relevant products.
- **Smart Discovery**:
  - **Search & Filter**: Real-time filtering by Product Type (Home, Personal, Vehicle), APR, and features.
  - **Dynamic Badges**: Visual indicators for "Low APR", "Fast Disbursal", etc.
- **AI Loan Assistant**:
  - **Context-Aware**: Chatbot understands the specific product you are viewing AND your financial profile.
  - **Powered by Llama 3**: Uses `meta-llama/llama-3.3-70b-instruct` via OpenRouter for high-quality, free-tier responses.
  - **Persistent History**: Chat sessions are saved to the database per user/product.
  - **Rate Limit Handling**: Graceful error messages when API limits are hit.
- **Secure Authentication**:
  - Full email/password login flow via **Supabase Auth**.
  - Protected routes via Middleware.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI**: [OpenRouter](https://openrouter.ai/) (Meta Llama 3) + OpenAI SDK

## 🏗 Architecture

The app follows a modern full-stack architecture:

1.  **Frontend**: Server Components for data fetching + Client Components for interactivity (Chat, Filters).
2.  **Backend**: Next.js Route Handlers (`/api/ai/ask`) act as the secure API layer.
3.  **Database**: 
    - `users`: Syncs with Supabase Auth identities.
    - `products`: Stores rich loan data (JSON for features/terms).
    - `ai_chat_messages`: Stores chat history linked to User+Product.

## ⚡ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- A Supabase project
- An OpenRouter API Key

### 2. Installation
```bash
git clone https://github.com/satyam1256/LoanDashboard.git
cd LoanDashboard
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database (Get from Supabase -> Project Settings -> Database -> Connection String -> URI)
# Use the "Transaction" connection string for DATABASE_URL
DATABASE_URL="postgres://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Use the "Session" connection string for DIRECT_URL
DIRECT_URL="postgres://postgres.xxxx:password@aws-0-region.pooler.supabase.com:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Provider (OpenRouter)
OPENROUTER_API_KEY="sk-or-..."
```

### 4. Database Setup

**Option A: Quick SQL Setup (Recommended)**
1.  Open `setup.sql` from the root of this project.
2.  Copy the contents.
3.  Go to your Supabase Project -> **SQL Editor**.
4.  Paste and run. This creates all tables and inserts 10 sample products.

**Option B: Using Prisma**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to DB
npx prisma db push

# Seed data
npx prisma db seed
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 🤖 AI Features
The `api/ai/ask` endpoint implements a **RAG-lite** pattern:
1.  **Context Injection**: Injects the active Product's details (Interest Rate, Fees, Eligibility) and the User's Profile (Income, Score) into the System Prompt.
2.  **Guardrails**: Instructions to keep answers concise (80-90 words) and strictly related to loans.
3.  **Session Management**: Chats are stored in Postgres (`ai_chat_messages`), allowing users to revisit conversations.

## 📂 Project Structure
- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (shadcn/ui).
- `src/lib`: Utilities for DB (`db.ts`), Supabase, and helper functions.
- `prisma`: Database schema (`schema.prisma`) and seed scripts.
