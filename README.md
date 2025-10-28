# 🤖 AI Writing Assistant

A powerful, production-ready AI writing web application with real-time streaming responses and essential productivity features. Generate various types of content using Google's Gemini 2.0 Flash (free tier) with a clean, modern interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_2.0-4285F4)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎥 Demo

> **Note:** Add a demo GIF here showing the streaming AI response in action

## ✨ Features

### Core Features
- ✅ **Multiple Writing Modes**
  - Email composition
  - Blog post generation
  - Social media captions
  - Code comments
  - Product descriptions

- ✅ **Real-time AI Streaming**
  - Live text generation with Google Gemini 2.0 Flash
  - No loading spinners - watch text appear character by character
  - Smooth, responsive streaming experience
  - **100% Free** - No quota limits with generous rate limits

- ✅ **Productivity Tools**
  - 💾 Save generations to history
  - ⭐ Bookmark favorite outputs
  - 📋 Copy to clipboard with one click
  - 🔄 Regenerate content instantly
  - 📊 Character, word, and token counter
  - 📥 Export to .md or .txt formats

- ✅ **User Interface**
  - 🌗 Dark/light mode toggle
  - 📱 Fully responsive design
  - 🎨 Clean, minimal UI with shadcn/ui
  - ⚡ Built with Next.js 14 App Router

- ✅ **History & Bookmarks**
  - View all past generations with timestamps
  - Filter bookmarked content
  - Delete unwanted generations
  - Track token usage per generation

- ✅ **Token Tracking**
  - Real-time token estimation
  - Session-wide token counter
  - Per-generation token display

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui components
- **AI Integration:** Google Gemini 2.0 Flash with Vercel AI SDK
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Hooks
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key - **FREE** ([Get one here](https://aistudio.google.com/app/apikey))
- Supabase account ([Sign up here](https://supabase.com))

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-writing-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in the SQL Editor
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   # Google Gemini API Key (Get free key at https://aistudio.google.com/app/apikey)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google Gemini API key (FREE at https://aistudio.google.com/app/apikey) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

## 🗄️ Database Schema

The application uses a single `generations` table:

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mode VARCHAR(50) NOT NULL,
  prompt TEXT NOT NULL,
  output TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  is_bookmarked BOOLEAN DEFAULT FALSE
);
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Add environment variables**
   - In project settings, add all environment variables
   - Redeploy if needed

4. **Your app is live!** 🎉

## 📁 Project Structure

```
ai-writing-assistant/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Google Gemini streaming endpoint
│   │   └── generations/
│   │       ├── route.ts           # GET/POST generations
│   │       └── [id]/
│   │           └── route.ts       # PATCH/DELETE generation
│   ├── history/
│   │   └── page.tsx               # History page
│   ├── bookmarks/
│   │   └── page.tsx               # Bookmarks page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── nav.tsx                    # Navigation bar
│   ├── theme-provider.tsx         # Theme context
│   ├── theme-toggle.tsx           # Dark/light mode toggle
│   └── writing-generator.tsx      # Main generator component
├── lib/
│   ├── supabase.ts                # Supabase client
│   ├── database.types.ts          # TypeScript types
│   └── utils.ts                   # Utility functions
├── hooks/
│   └── use-toast.ts               # Toast notifications
├── supabase-schema.sql            # Database schema
├── .env.example                   # Example env file
└── package.json
```

## 🎯 Usage

1. **Select a writing mode** from the dropdown (Email, Blog Post, etc.)
2. **Enter your prompt** in the textarea
3. **Click "Generate Content"** to start streaming
4. **Watch the AI generate** text in real-time
5. **Use the action buttons** to:
   - Bookmark the output
   - Save to history
   - Copy to clipboard
   - Export as .md or .txt
   - Regenerate content

## 🧪 Features in Detail

### Real-time Streaming
The app uses Google's Gemini 2.0 Flash model with the Vercel AI SDK to display text as it's generated, providing instant feedback to users. The free tier offers generous rate limits (15 requests/minute, 1M tokens/minute).

### Token Tracking
Token usage is estimated using a 4:1 character-to-token ratio and tracked both per-generation and for the entire session.

### History Management
All generations are automatically saved to Supabase with timestamps, allowing users to review and manage past outputs.

### Export Functionality
Users can export content in two formats:
- `.md` - Markdown format for documentation
- `.txt` - Plain text format for general use

## 📚 Learning Outcomes

By building this project, you gain hands-on experience with:

- ✅ Real-time AI response streaming
- ✅ API integration and async request handling
- ✅ State management using React Context and Hooks
- ✅ Database CRUD operations with Supabase
- ✅ Modern Next.js 14 App Router architecture
- ✅ TypeScript for type-safe development
- ✅ Responsive design with Tailwind CSS
- ✅ Component-based UI with shadcn/ui

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev) for the free, powerful AI API
- [Vercel](https://vercel.com) for the AI SDK
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Supabase](https://supabase.com) for the database backend

## 🌐 Live Demo

> **Note:** Add your deployed Vercel URL here

---

Built with ❤️ using Next.js 16 and Google Gemini 2.0 Flash
