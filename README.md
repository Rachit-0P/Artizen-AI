# 🎨 Artizen AI – AI Artist Toolkit

**Artizen AI** is a powerful AI-driven toolkit designed to help artists create, promote, and enhance their artistic work with professional marketing content and creative assistance.

---

## ✨ Features

### 🎯 Core Tools
- **🎨 Artist Bio Generator** - Create compelling professional bios for portfolios and exhibitions
- **🚀 Social Media Post Generator** - Generate engaging posts and captions for various platforms
- **🎬 Video Content Ideas** - Get creative ideas for video content and marketing
- **📊 Performance Predictions** - Analyze trends and predict content performance
- **🔔 Smart Notifications** - Stay updated with AI-powered insights

### 🤖 AI Assistant
- **Ask AI** - Get instant help with art, creativity, and marketing questions
- **Settings Panel** - Manage API configuration and app preferences

---

## 🚀 Tech Stack
- ⚛️ **React 18** - Modern frontend framework
- ⚡ **Vite** - Fast build tool and dev server
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧠 **Google Gemini AI** - Advanced AI integration
- 🌐 **React Router** - Client-side routing

---

## �️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Step 1: Clone the repository
```bash
git clone https://github.com/Rachit-0P/Artizen-AI.git
cd Artizen-AI
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini AI Configuration
VITE_GOOGLE_AI_API_KEY=your_primary_gemini_api_key_here
VITE_GOOGLE_AI_API_KEY_BACKUP=your_backup_gemini_api_key_here
```

### Step 4: Start the development server
```bash
npm run dev
```

### Step 5: Open in browser
Navigate to: [http://localhost:5173/](http://localhost:5173/)

---

## 🎨 Usage

1. **Generate Artist Bios**: Enter artist details and get professional bio content
2. **Create Social Posts**: Describe your art and get platform-specific social media content
3. **Ask AI**: Click the 🤖 button in the header to get instant AI assistance
4. **Settings**: Use the ⚙️ button to check API status and app configuration
5. **Explore Demos**: Try the video ideas, predictions, and notifications features

---

## 📁 Project Structure
```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard with feature grid
│   ├── Topbar.jsx            # Header with Ask AI and Settings
│   ├── BioGenerator.jsx      # Artist bio generation tool
│   ├── SocialGenerator.jsx   # Social media content tool
│   ├── VideoGenerator.jsx    # Video content ideas
│   ├── PredictionsChart.jsx  # Performance predictions
│   └── Notifications.jsx     # Smart notifications
├── utils/
│   └── aiProviders.js        # Gemini AI integration
└── main.jsx                  # App entry point
```

---

## 🔧 Build & Deploy

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The project includes configuration files for easy deployment:
- `vercel.json` - Vercel deployment config
- `netlify.toml` - Netlify deployment config

---

## 🎯 API Configuration

This application uses Google Gemini AI for content generation. You'll need:

1. **Google AI Studio Account**: Sign up at [aistudio.google.com](https://aistudio.google.com)
2. **API Key**: Generate your Gemini API key
3. **Environment Setup**: Add your keys to the `.env` file

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developed by
[Codesthetic](https://codesthetic.com) - Crafting digital experiences with AI

---

**🚀 Ready to enhance your artistic journey with AI? Get started now!**
