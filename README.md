# KrishiMitra (Kisan AI) 🌾

KrishiMitra is an intelligent, bilingual agricultural assistant designed to empower farmers with data-driven insights. It provides an intuitive platform featuring real-time AI agronomy chat, disease detection for crops, and interactive crop monitoring maps.

## 🌍 The Problem & Our Impact

**The Problem:** Many farmers face challenges related to unpredictable weather, lack of real-time expert guidance, and delayed disease identification. Traditional agricultural methods often lack the integration of modern, data-driven technologies that could prevent crop failure and maximize yield, leading to significant financial losses and food insecurity.

**Our Impact:** KrishiMitra bridges the gap between traditional farming and modern AI technology. By providing a bilingual, user-friendly interface, we empower farmers in rural areas with:
- **Immediate Insights:** Real-time AI consultation reduces the time and cost associated with waiting for human agricultural experts.
- **Early Intervention:** Photo-based disease detection allows farmers to treat crop illnesses before they spread, preventing catastrophic harvest losses.
- **Data-Driven Decisions:** The CropWatch map helps communities anticipate risks (like drought or pests) and monitor critical zones across regions.
- **Digital Inclusion:** Built with bilingual support (English and Hindi), it ensures that language is not a barrier to accessing critical farming intelligence.

## ✨ Key Features

- **🗣️ Bilingual Support**: Fully supports both English and Hindi across the entire application to ensure accessibility for local farmers.
- **🤖 AI Agronomist**: A smart chatbot powered by Groq and Mistral APIs to answer farming queries, suggest crop cycles, and provide customized agricultural advice.
- **📸 Disease Detection**: Upload photos of crops to identify diseases instantly and receive actionable treatment plans.
- **🗺️ CropWatch Map**: Interactive maps to track predictive intelligence, active nodes, and critical zones.
- **👤 Farmer Profiles**: Editable profiles to keep track of farm size, soil type, budget, and labor availability for personalized AI recommendations.
- **🔒 Secure Authentication**: Powered by Supabase for secure login and data storage.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **AI Integrations**: Groq API, Mistral API
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- Supabase account and CLI (optional for local DB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/krishimitra.git
   cd krishimitra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```
   You will need to provide:
   - Supabase URL & Anon Key
   - Groq API Key
   - Mistral API Key

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Setup

If you are setting up your own Supabase instance, ensure you push the database migrations to create the required `farmers` table and its columns:

```bash
npx supabase db push
```

## 📄 License

This project is licensed under the MIT License.
