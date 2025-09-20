# 🧠 Artizen AI – Marketplace Dashboard

**Artizen AI** (Artisan + Citizen + AI) is a smart, AI-powered dashboard built to empower local artisans through streamlined tools and insights.

---

## 🚀 Tech Stack
- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧠 OpenAI API (integrated)
- 🌐 Vercel (deployment & serverless functions)

---

## 📦 Getting Started

### Step 1. Install dependencies
```bash
npm install
```

### Step 2. Set up environment variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Add your OpenAI API key to .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3. Start the development server
```bash
npm run dev
```

### Step 4. Open the application
Navigate to: http://localhost:5173/

---

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variable in Vercel dashboard:
   - `OPENAI_API_KEY` = your OpenAI API key

### Option 2: Deploy via GitHub
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable in Vercel dashboard:
   - `OPENAI_API_KEY` = your OpenAI API key
4. Deploy automatically on every push

### Environment Variables Required:
- `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

---

## 🛠️ Features
- 🎨 Artist Bio Generator
- 📱 Social Media Post Generator
- 📊 Dashboard Analytics
- 🎯 AI-Powered Content Creation

---

## 📁 Project Structure
```
├── api/                    # Vercel serverless functions
│   ├── generate-artist-bio.js
│   └── generate-social-post.js
├── src/
│   ├── components/         # React components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```
